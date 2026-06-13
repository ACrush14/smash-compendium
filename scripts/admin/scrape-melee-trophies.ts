/**
 * scrape-melee-trophies.ts
 *
 * Scrapa https://www.ssbwiki.com/List_of_SSBM_trophies_(complete_list) e:
 *  1. Atualiza assetRenderUrl (imagem do troféu em alta resolução)
 *  2. Seta posicaoTrofeuMelee = Game Order # (coluna "Game Order" da tabela SSBWiki)
 *  3. Seta orderIndex = Game Order # (usado pela UI para ordenar)
 *  4. Vincula franchiseId pelo nome do universo
 *
 * Matching SOMENTE por nome (sem fallback por posição, evita associações erradas).
 * Usa upsert para criação de registros novos (idempotente).
 *
 * Run:
 *   npx tsx scripts/admin/scrape-melee-trophies.ts
 *   npx tsx scripts/admin/scrape-melee-trophies.ts --reset   (limpa campos primeiro)
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log, sleep } from "../scrapers/utils";

const SOURCE_URL =
  "https://www.ssbwiki.com/List_of_SSBM_trophies_(complete_list)";

const DO_RESET = process.argv.includes("--reset");

// ── Universe name → Franchise name mapping ────────────────────────────────────
const UNIVERSE_MAP: Record<string, string> = {
  "Mario":                   "Mario",
  "Donkey Kong":             "Donkey Kong",
  "Legend of Zelda":         "The Legend of Zelda",
  "Zelda":                   "The Legend of Zelda",
  "Metroid":                 "Metroid",
  "Yoshi":                   "Yoshi",
  "Kirby":                   "Kirby",
  "Star Fox":                "Star Fox",
  "Pokémon":                 "Pokémon",
  "Pokemon":                 "Pokémon",
  "EarthBound":              "EarthBound",
  "Earthbound":              "EarthBound",
  "F-Zero":                  "F-Zero",
  "Ice Climbers":            "Ice Climber",
  "Ice Climber":             "Ice Climber",
  "Fire Emblem":             "Fire Emblem",
  "Game & Watch":            "Game & Watch",
  "Super Smash Bros.":       "Super Smash Bros.",
  "Kid Icarus":              "Kid Icarus",
  "Pikmin":                  "Pikmin",
  "Wario":                   "Wario",
  "R.O.B.":                  "R.O.B.",
};

// ── Full-size image URL from SSBWiki thumbnail ────────────────────────────────
function fullSizeUrl(src: string): string {
  return src.replace(/\/thumb(\/[^/]+\/[^/]+\/[^/]+)\/\d+px-[^/]+$/, "$1");
}

// ── Normalize name for matching ───────────────────────────────────────────────
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[''`']/g, "")
    .replace(/[^a-z0-9]/g, "");
}

interface TrophyRow {
  gameOrder:   number;
  name:        string;
  imageUrl:    string | null;
  universe:    string;
}

// ── Parse the complete list page ──────────────────────────────────────────────
async function scrapePage(): Promise<TrophyRow[]> {
  log.step(`Carregando ${SOURCE_URL}…`);
  const $ = await fetchHtml(SOURCE_URL, 3);

  const rows: TrophyRow[] = [];

  $("table.wikitable tbody tr").each((_i, row) => {
    const cells = $("td", row);
    if (cells.length < 4) return;

    // Table columns: Normal Order | Game Order | Name | Image | Universe
    const normalOrder = parseInt(cleanText($(cells.eq(0)).text()));
    const name        = cleanText($(cells.eq(2)).text());
    const universe    = cleanText($(cells.eq(4)).text());

    if (isNaN(normalOrder) || !name) return;

    let imageUrl: string | null = null;
    const img = $(cells.eq(3)).find("img").first();
    if (img.length) {
      const src = img.attr("data-src") ?? img.attr("src") ?? null;
      if (src) {
        const abs = src.startsWith("//") ? `https:${src}` : src;
        imageUrl = fullSizeUrl(abs);
      }
    }

    rows.push({ gameOrder: normalOrder, name, imageUrl, universe });
  });

  return rows;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Limpa campos se --reset
  if (DO_RESET) {
    log.step("Resetando assetRenderUrl / orderIndex / posicaoTrofeuMelee de todos os troféus Melee…");
    await db.collectible.updateMany({
      where: { type: "TROPHY", smashGameVersion: "SSBM" },
      data: { assetRenderUrl: null, orderIndex: null, posicaoTrofeuMelee: null, franchiseId: null },
    });
    log.ok("Reset concluído.");
  }

  // 2. Carrega franchises
  const franchises = await db.franchise.findMany({ select: { id: true, name: true } });
  const franchiseByName = new Map(franchises.map(f => [norm(f.name), f.id]));

  // 3. Carrega troféus Melee do DB (APÓS reset, se houver)
  const dbTrophies = await db.collectible.findMany({
    where: { type: "TROPHY", smashGameVersion: "SSBM" },
    select: { id: true, name: true, assetRenderUrl: true, franchiseId: true },
  });
  log.ok(`${dbTrophies.length} troféus Melee no DB`);

  // Mapa name-normalizado → registro DB (somente matching por nome)
  const dbByName = new Map(dbTrophies.map(t => [norm(t.name), t]));

  // 4. Scrapa a página
  const rows = await scrapePage();
  log.ok(`${rows.length} troféus encontrados na SSBWiki`);

  let updated = 0, created = 0;

  for (const row of rows) {
    // Resolve franchise pelo universo
    let franchiseId: string | null = null;
    const uNorm = norm(row.universe);
    for (const [key, fname] of Object.entries(UNIVERSE_MAP)) {
      if (norm(key) === uNorm) {
        franchiseId = franchiseByName.get(norm(fname)) ?? null;
        break;
      }
    }
    if (!franchiseId) franchiseId = franchiseByName.get(uNorm) ?? null;

    // Matching SOMENTE por nome
    const dbRecord = dbByName.get(norm(row.name)) ?? null;

    if (!dbRecord) {
      // Sem match por nome — verifica se já existe um registro com o mesmo ID gerado
      // (acontece com nomes duplicados como "Mario SMASH" que aparecem 2x na tabela SSBWiki)
      const baseId = `TROPHY-SSBM-${row.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40)}`;
      const existsBase = await db.collectible.findUnique({ where: { id: baseId }, select: { id: true } });

      let finalId = baseId;
      let finalName = row.name;
      if (existsBase) {
        // Duplicata de nome — cria variante numerada
        finalId   = `${baseId}_2`;
        finalName = `${row.name} (2)`;
      }

      await db.collectible.upsert({
        where: { id: finalId },
        create: {
          id:                 finalId,
          type:               "TROPHY",
          smashGameVersion:   "SSBM",
          name:               finalName,
          posicaoTrofeuMelee: row.gameOrder,
          orderIndex:         row.gameOrder,
          assetRenderUrl:     row.imageUrl,
          franchiseId:        franchiseId,
        },
        update: {
          posicaoTrofeuMelee: row.gameOrder,
          orderIndex:         row.gameOrder,
          assetRenderUrl:     row.imageUrl,
          ...(franchiseId ? { franchiseId } : {}),
        },
      });
      created++;
      process.stdout.write(`  + #${row.gameOrder} ${finalName}\n`);
      continue;
    }

    // Atualiza registro existente (SEMPRE sobrescreve imagem e posição)
    const patch: Record<string, unknown> = {
      posicaoTrofeuMelee: row.gameOrder,
      orderIndex:         row.gameOrder,
      assetRenderUrl:     row.imageUrl,
    };
    if (franchiseId) patch.franchiseId = franchiseId;

    await db.collectible.update({ where: { id: dbRecord.id }, data: patch });

    // Remove do mapa para evitar duplo-update
    dbByName.delete(norm(row.name));

    updated++;
    const flags = [row.imageUrl ? "🖼" : "  ", franchiseId ? "🏷" : "  "].join("");
    process.stdout.write(`  ${flags} #${row.gameOrder} ${row.name}\n`);
  }

  log.ok(`\nConcluído!`);
  log.ok(`  Atualizados: ${updated}`);
  log.ok(`  Criados:     ${created}`);
}

main().catch(console.error);
