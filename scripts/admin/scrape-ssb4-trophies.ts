/**
 * scrape-ssb4-trophies.ts
 *
 * Scrapa https://www.ssbwiki.com/List_of_SSB4_trophies_(complete_list)
 *
 * Seções da página e versões no banco:
 *   "Both versions" → smashGameVersion = "SSB4"      (imagem Wii U preferida)
 *   "3DS version"   → smashGameVersion = "SSB4_3DS"
 *   "Wii U version" → smashGameVersion = "SSB4_WIIU"
 *
 * Estrutura de colunas (Both versions):
 *   5 td → [Name | 3DS img | WiiU img | Series(rowspan) | Category(rowspan)]
 *   4 td → [Name | 3DS img | WiiU img | Category(rowspan)]  ← nova categoria
 *   3 td → [Name | 3DS img | WiiU img]                      ← mesma série e categoria
 *
 * Estrutura de colunas (3DS / Wii U exclusivo):
 *   4 td → [Name | Img | Series(rowspan) | Category(rowspan)]
 *   3 td → [Name | Img | Category(rowspan)]
 *   2 td → [Name | Img]
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/scrape-ssb4-trophies.ts
 *   npx tsx --env-file=.env.local scripts/admin/scrape-ssb4-trophies.ts --reset
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log } from "../scrapers/utils";
import type { CheerioAPI } from "cheerio";

const SOURCE_URL = "https://www.ssbwiki.com/List_of_SSB4_trophies_(complete_list)";
const DO_RESET   = process.argv.includes("--reset");

// ── Series → Franchise name ───────────────────────────────────────────────────
const SERIES_MAP: Record<string, string> = {
  "Super Mario Bros.":          "Mario",
  "Mario":                      "Mario",
  "Donkey Kong":                "Donkey Kong",
  "The Legend of Zelda":        "The Legend of Zelda",
  "Legend of Zelda":            "The Legend of Zelda",
  "Zelda":                      "The Legend of Zelda",
  "Metroid":                    "Metroid",
  "Yoshi":                      "Yoshi",
  "Kirby":                      "Kirby",
  "Star Fox":                   "Star Fox",
  "Pokémon":                    "Pokémon",
  "Pokemon":                    "Pokémon",
  "EarthBound":                 "EarthBound",
  "Earthbound":                 "EarthBound",
  "F-Zero":                     "F-Zero",
  "Ice Climbers":               "Ice Climber",
  "Ice Climber":                "Ice Climber",
  "Fire Emblem":                "Fire Emblem",
  "Game & Watch":               "Game & Watch",
  "Super Smash Bros.":          "Super Smash Bros.",
  "Kid Icarus":                 "Kid Icarus",
  "Pikmin":                     "Pikmin",
  "Wario":                      "Wario",
  "WarioWare":                  "Wario",
  "R.O.B.":                     "R.O.B.",
  "Metal Gear":                 "Metal Gear",
  "Sonic the Hedgehog":         "Sonic the Hedgehog",
  "Sonic":                      "Sonic the Hedgehog",
  "Animal Crossing":            "Animal Crossing",
  "Mega Man":                   "Mega Man",
  "Pac-Man":                    "Pac-Man",
  "Xenoblade Chronicles":       "Xenoblade Chronicles",
  "Xenoblade":                  "Xenoblade Chronicles",
  "Punch-Out!!":                "Punch-Out!!",
  "Punch-Out":                  "Punch-Out!!",
  "Duck Hunt":                  "Duck Hunt",
  "Wii Fit":                    "Wii Fit",
  "Little Mac":                 "Punch-Out!!",
  "Palutena":                   "Kid Icarus",
  "Robin":                      "Fire Emblem",
  "Shulk":                      "Xenoblade Chronicles",
  "Bowser Jr.":                 "Mario",
  "Dark Pit":                   "Kid Icarus",
};

function fullSizeUrl(src: string): string {
  return src.replace(/\/thumb(\/[^/]+\/[^/]+\/[^/]+)\/\d+px-[^/]+$/, "$1");
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[''`']/g, "").replace(/[^a-z0-9]/g, "");
}

function extractImg($: CheerioAPI, cellHtml: ReturnType<ReturnType<typeof import("cheerio")["load"]>>): string | null {
  const img = cellHtml.find("img").first();
  if (!img.length) return null;
  const src = img.attr("data-src") ?? img.attr("src") ?? null;
  if (!src) return null;
  const abs = src.startsWith("//") ? `https:${src}` : src;
  return fullSizeUrl(abs);
}

type Version = "SSB4" | "SSB4_3DS" | "SSB4_WIIU";

interface TrophyRow {
  position:    number;
  name:        string;
  imgUrl:      string | null;    // WiiU image para SSB4/WIIU; 3DS image para SSB4_3DS
  img3dsUrl:   string | null;    // 3DS image — somente para SSB4 Both
  series:      string;
  version:     Version;
}

// ── Parse ─────────────────────────────────────────────────────────────────────
async function scrapePage(): Promise<TrophyRow[]> {
  log.step(`Carregando ${SOURCE_URL}…`);
  const $ = await fetchHtml(SOURCE_URL, 3);
  const all: TrophyRow[] = [];

  const SECTIONS: { heading: string; version: Version }[] = [
    { heading: "Both versions", version: "SSB4" },
    { heading: "3DS version",   version: "SSB4_3DS" },
    { heading: "Wii U version", version: "SSB4_WIIU" },
  ];

  for (const { heading, version } of SECTIONS) {
    const h2 = $(".mw-parser-output h2, .mw-parser-output .mw-heading2")
      .filter((_i, el) => cleanText($(el).text()).includes(heading))
      .first();

    if (!h2.length) { log.step(`Seção "${heading}" não encontrada, pulando`); continue; }

    const table = h2.nextAll("table.wikitable").first();
    if (!table.length) { log.step(`Tabela para "${heading}" não encontrada`); continue; }

    let pos = 0;
    let currentSeries   = "";
    let currentCategory = "";

    table.find("tbody tr").each((_i, row) => {
      const cells = $("td", row);
      const n     = cells.length;
      if (n < 2) return;

      const name = cleanText($(cells.eq(0)).text());
      if (!name) return;
      pos++;

      let imgUrl: string | null = null;

      let img3dsUrl: string | null = null;

      if (version === "SSB4") {
        // col1 = 3DS image, col2 = Wii U image (confirmado pelo debug via nomes de arquivo)
        img3dsUrl = extractImg($, $(cells.eq(1)));  // 3DS image
        imgUrl    = extractImg($, $(cells.eq(2)));  // Wii U image
        if (n === 5) {
          currentSeries   = cleanText($(cells.eq(3)).text());
          currentCategory = cleanText($(cells.eq(4)).text());
        } else if (n === 4) {
          currentCategory = cleanText($(cells.eq(3)).text());
        }
        // n === 3 → mesma série e categoria (rowspan)
      } else {
        // SSB4_3DS e SSB4_WIIU: col1 = única imagem
        imgUrl = extractImg($, $(cells.eq(1)));
        if (n === 4) {
          currentSeries   = cleanText($(cells.eq(2)).text());
          currentCategory = cleanText($(cells.eq(3)).text());
        } else if (n === 3) {
          currentCategory = cleanText($(cells.eq(2)).text());
        }
        // n === 2 → mesma série e categoria (rowspan)
      }

      all.push({ position: pos, name, imgUrl, img3dsUrl, series: currentSeries, version });
    });

    log.ok(`"${heading}": ${pos} troféus`);
  }

  return all;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (DO_RESET) {
    log.step("Resetando troféus SSB4 (SSB4 + SSB4_3DS + SSB4_WIIU)…");
    await db.collectible.updateMany({
      where: { type: "TROPHY", smashGameVersion: { in: ["SSB4", "SSB4_3DS", "SSB4_WIIU"] } },
      data: { assetRenderUrl: null, orderIndex: null, posicaoTrofeuSsb4: null, franchiseId: null },
    });
    log.ok("Reset concluído.");
  }

  const franchises     = await db.franchise.findMany({ select: { id: true, name: true } });
  const franchiseByName = new Map(franchises.map(f => [norm(f.name), f.id]));

  function resolveFranchise(series: string): string | null {
    const sNorm = norm(series);
    for (const [key, fname] of Object.entries(SERIES_MAP)) {
      if (norm(key) === sNorm) return franchiseByName.get(norm(fname)) ?? null;
    }
    return franchiseByName.get(sNorm) ?? null;
  }

  // Carrega DB por versão
  const dbTrophies = await db.collectible.findMany({
    where: { type: "TROPHY", smashGameVersion: { in: ["SSB4", "SSB4_3DS", "SSB4_WIIU"] } },
    select: { id: true, name: true, smashGameVersion: true },
  });
  const dbByVersionName = new Map(
    dbTrophies.map(t => [`${t.smashGameVersion}::${norm(t.name)}`, t])
  );
  log.ok(`${dbTrophies.length} troféus SSB4 no DB`);

  const rows = await scrapePage();
  log.ok(`${rows.length} troféus encontrados na SSBWiki`);

  let updated = 0, created = 0;

  for (const row of rows) {
    const franchiseId = resolveFranchise(row.series);
    const key = `${row.version}::${norm(row.name)}`;
    const dbRecord = dbByVersionName.get(key) ?? null;

    const prefix = row.version === "SSB4" ? "TROPHY-SSB4" :
                   row.version === "SSB4_3DS" ? "TROPHY-SSB4-3DS" : "TROPHY-SSB4-WIIU";
    const baseId = `${prefix}-${row.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40)}`;

    if (!dbRecord) {
      // Novo — detecta duplicata de nome dentro da mesma versão
      const exists = await db.collectible.findUnique({ where: { id: baseId }, select: { id: true } });
      const finalId   = exists ? `${baseId}_2` : baseId;
      const finalName = exists ? `${row.name} (2)` : row.name;

      await db.collectible.upsert({
        where: { id: finalId },
        create: {
          id:               finalId,
          type:             "TROPHY",
          smashGameVersion: row.version,
          name:             finalName,
          posicaoTrofeuSsb4: row.position,
          orderIndex:        row.position,
          assetRenderUrl:    row.imgUrl,
          assetRender2Url:   row.img3dsUrl,
          franchiseId,
        },
        update: {
          posicaoTrofeuSsb4: row.position,
          orderIndex:        row.position,
          assetRenderUrl:    row.imgUrl,
          assetRender2Url:   row.img3dsUrl,
          ...(franchiseId ? { franchiseId } : {}),
        },
      });
      created++;
      process.stdout.write(`  + #${String(row.position).padStart(3,"0")} [${row.version}] ${finalName}\n`);
      continue;
    }

    await db.collectible.update({
      where: { id: dbRecord.id },
      data: {
        posicaoTrofeuSsb4: row.position,
        orderIndex:        row.position,
        assetRenderUrl:    row.imgUrl,
        assetRender2Url:   row.img3dsUrl,
        ...(franchiseId ? { franchiseId } : {}),
      },
    });
    dbByVersionName.delete(key);
    updated++;
    process.stdout.write(`  ✓ #${String(row.position).padStart(3,"0")} [${row.version}] ${row.name}\n`);
  }

  // Remove orphãos
  const orphans = await db.collectible.deleteMany({
    where: {
      type: "TROPHY",
      smashGameVersion: { in: ["SSB4", "SSB4_3DS", "SSB4_WIIU"] },
      orderIndex: null,
    },
  });

  log.ok(`\nConcluído!`);
  log.ok(`  Atualizados: ${updated}`);
  log.ok(`  Criados:     ${created}`);
  if (orphans.count) log.ok(`  Orphãos removidos: ${orphans.count}`);
}

main().catch(console.error);
