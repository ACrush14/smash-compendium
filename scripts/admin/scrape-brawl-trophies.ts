/**
 * scrape-brawl-trophies.ts
 *
 * Scrapa https://www.ssbwiki.com/List_of_SSBB_trophies_(complete_list) e:
 *  1. Atualiza assetRenderUrl (imagem do troféu)
 *  2. Seta posicaoTrofeuBrawl = posição na tabela SSBWiki (ordem sequencial)
 *  3. Seta orderIndex = posicaoTrofeuBrawl (usado pela UI para ordenar e numerar)
 *  4. Vincula franchiseId pelo nome da série
 *
 * Tabela Brawl não tem coluna de número — a posição é o índice de linha.
 * Matching somente por nome (sem fallback por posição).
 * Usa upsert para criar registros novos de forma idempotente.
 * Duplicatas de nome recebem sufixo (2).
 *
 * Run:
 *   npx tsx scripts/admin/scrape-brawl-trophies.ts
 *   npx tsx scripts/admin/scrape-brawl-trophies.ts --reset
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log } from "../scrapers/utils";

const SOURCE_URL =
  "https://www.ssbwiki.com/List_of_SSBB_trophies_(complete_list)";

const DO_RESET = process.argv.includes("--reset");

// ── Series → Franchise name mapping ──────────────────────────────────────────
const SERIES_MAP: Record<string, string> = {
  "Mario":                   "Mario",
  "Donkey Kong":             "Donkey Kong",
  "The Legend of Zelda":     "The Legend of Zelda",
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
  "Metal Gear":              "Metal Gear",
  "Sonic the Hedgehog":      "Sonic the Hedgehog",
  "Sonic":                   "Sonic the Hedgehog",
  "Animal Crossing":         "Animal Crossing",
  "WarioWare":               "Wario",
  "Wario Land":              "Wario",
  "Pikmin & Olimar":         "Pikmin",
  "Lucas":                   "EarthBound",
};

// ── Full-size image URL from SSBWiki thumbnail ────────────────────────────────
function fullSizeUrl(src: string): string {
  return src.replace(/\/thumb(\/[^/]+\/[^/]+\/[^/]+)\/\d+px-[^/]+$/, "$1");
}

// ── Normalize name ────────────────────────────────────────────────────────────
function norm(s: string): string {
  return s.toLowerCase().replace(/[''`']/g, "").replace(/[^a-z0-9]/g, "");
}

interface TrophyRow {
  position: number;
  name:     string;
  imageUrl: string | null;
  series:   string;
}

// ── Parse the complete list page ──────────────────────────────────────────────
async function scrapePage(): Promise<TrophyRow[]> {
  log.step(`Carregando ${SOURCE_URL}…`);
  const $ = await fetchHtml(SOURCE_URL, 3);

  const rows: TrophyRow[] = [];
  let pos = 0;

  // Brawl table uses rowspan on the Series column.
  // First row of each series group: 4 td = [Name | Image | Series(rowspan=N) | Type]
  // Subsequent rows in same group: 3 td = [Name | Image | Type]  (Series comes from rowspan)
  // Rows with no Type: 2 td = [Name | Image]
  // → Track currentSeries: update only when cells.length === 4 (first row of group).
  let currentSeries = "";

  $("table.wikitable tbody tr").each((_i, row) => {
    const cells = $("td", row);
    if (cells.length < 2) return;

    const name = cleanText($(cells.eq(0)).text());
    if (!name) return;
    pos++;

    // First row of a new series group — col2 is the Series cell (with rowspan)
    if (cells.length === 4) {
      currentSeries = cleanText($(cells.eq(2)).text());
    }
    const series = currentSeries;

    let imageUrl: string | null = null;
    const img = $(cells.eq(1)).find("img").first();
    if (img.length) {
      const src = img.attr("data-src") ?? img.attr("src") ?? null;
      if (src) {
        const abs = src.startsWith("//") ? `https:${src}` : src;
        imageUrl = fullSizeUrl(abs);
      }
    }

    rows.push({ position: pos, name, imageUrl, series });
  });

  return rows;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (DO_RESET) {
    log.step("Resetando troféus Brawl (assetRenderUrl / orderIndex / posicaoTrofeuBrawl)…");
    await db.collectible.updateMany({
      where: { type: "TROPHY", smashGameVersion: "SSBB" },
      data: { assetRenderUrl: null, orderIndex: null, posicaoTrofeuBrawl: null, franchiseId: null },
    });
    log.ok("Reset concluído.");
  }

  const franchises = await db.franchise.findMany({ select: { id: true, name: true } });
  const franchiseByName = new Map(franchises.map(f => [norm(f.name), f.id]));

  const dbTrophies = await db.collectible.findMany({
    where: { type: "TROPHY", smashGameVersion: "SSBB" },
    select: { id: true, name: true, assetRenderUrl: true, franchiseId: true },
  });
  log.ok(`${dbTrophies.length} troféus Brawl no DB`);

  const dbByName = new Map(dbTrophies.map(t => [norm(t.name), t]));

  const rows = await scrapePage();
  log.ok(`${rows.length} troféus encontrados na SSBWiki`);

  let updated = 0, created = 0;

  for (const row of rows) {
    // Resolve franchise
    let franchiseId: string | null = null;
    const sNorm = norm(row.series);
    for (const [key, fname] of Object.entries(SERIES_MAP)) {
      if (norm(key) === sNorm) {
        franchiseId = franchiseByName.get(norm(fname)) ?? null;
        break;
      }
    }
    if (!franchiseId) franchiseId = franchiseByName.get(sNorm) ?? null;

    const dbRecord = dbByName.get(norm(row.name)) ?? null;

    if (!dbRecord) {
      // Novo — detecta duplicatas de nome
      const baseId = `TROPHY-SSBB-${row.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40)}`;
      const exists  = await db.collectible.findUnique({ where: { id: baseId }, select: { id: true } });

      const finalId   = exists ? `${baseId}_2` : baseId;
      const finalName = exists ? `${row.name} (2)` : row.name;

      await db.collectible.upsert({
        where: { id: finalId },
        create: {
          id:               finalId,
          type:             "TROPHY",
          smashGameVersion: "SSBB",
          name:             finalName,
          posicaoTrofeuBrawl: row.position,
          orderIndex:       row.position,
          assetRenderUrl:   row.imageUrl,
          franchiseId,
        },
        update: {
          posicaoTrofeuBrawl: row.position,
          orderIndex:         row.position,
          assetRenderUrl:     row.imageUrl,
          ...(franchiseId ? { franchiseId } : {}),
        },
      });
      created++;
      process.stdout.write(`  + #${row.position} ${finalName}\n`);
      continue;
    }

    await db.collectible.update({
      where: { id: dbRecord.id },
      data: {
        posicaoTrofeuBrawl: row.position,
        orderIndex:         row.position,
        assetRenderUrl:     row.imageUrl,
        ...(franchiseId ? { franchiseId } : {}),
      },
    });
    dbByName.delete(norm(row.name));
    updated++;

    const flags = [row.imageUrl ? "🖼" : "  ", franchiseId ? "🏷" : "  "].join("");
    process.stdout.write(`  ${flags} #${row.position} ${row.name}\n`);
  }

  // Limpa orphãos
  const orphans = await db.collectible.deleteMany({
    where: { type: "TROPHY", smashGameVersion: "SSBB", orderIndex: null },
  });

  log.ok(`\nConcluído!`);
  log.ok(`  Atualizados: ${updated}`);
  log.ok(`  Criados:     ${created}`);
  if (orphans.count) log.ok(`  Orphãos removidos: ${orphans.count}`);
}

main().catch(console.error);
