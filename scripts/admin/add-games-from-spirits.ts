/**
 * add-games-from-spirits.ts
 *
 * Encontra jogos referenciados em spiritArtworkSource / spiritFirstAppearance
 * que não existem no ChronicleEntry e os adiciona.
 *
 * Para cada jogo ausente:
 *   1. Tenta scrape do SSBWiki para obter plataforma + capa
 *   2. Se não achar, usa estimativa por ano
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/add-games-from-spirits.ts [--dry-run]
 */

import { db } from "../../lib/db";
import { fetchHtml, log, sleep } from "../scrapers/utils";

const DELAY_MS   = 1_500;
const BASE_WIKI  = "https://www.ssbwiki.com";

// ─── Platform mapping ─────────────────────────────────────────────────────────

// Ordered list: first match wins
const PLATFORM_MAP: [RegExp, string][] = [
  [/nintendo switch/i,                "Nintendo Switch"],
  [/wii u/i,                          "Wii U"],
  [/\bwii\b/i,                        "Wii"],
  [/nintendo 3ds/i,                   "Nintendo DS"],  // approximate
  [/nintendo ds/i,                    "Nintendo DS"],
  [/nintendo gamecube|gamecube|gcn/i, "Nintendo GameCube"],
  [/game boy advance|gba/i,           "GAME BOY ADVANCE"],
  [/nintendo 64|n64/i,                "Nintendo 64"],
  [/super nes|snes|super famicom/i,   "Super Nintendo Entertainment System"],
  [/game boy color|gbc/i,             "GAME BOY"],
  [/game boy/i,                       "GAME BOY"],
  [/\bnes\b|famicom/i,                "Nintendo Entertainment System"],
  [/virtual boy/i,                    "VIRTUAL BOY"],
  [/game & watch|game and watch/i,    "GAME & WATCH"],
  [/playstation 4|ps4/i,              "PlayStation 4"],
  [/playstation 3|ps3/i,              "PlayStation 3"],
  [/playstation 2|ps2/i,              "PlayStation 2"],
  [/playstation\b|ps1/i,              "PlayStation 1"],
  [/xbox 360/i,                       "Xbox 360"],
];

function mapPlatform(raw: string): string | null {
  for (const [re, val] of PLATFORM_MAP) {
    if (re.test(raw)) return val;
  }
  return null;
}

function guessConsoleByYear(year: number | null): string {
  if (!year || year < 1981) return "GAME & WATCH";
  if (year <= 1989) return "Nintendo Entertainment System";
  if (year <= 1995) return "Super Nintendo Entertainment System";
  if (year <= 2001) return "Nintendo 64";
  if (year <= 2005) return "Nintendo GameCube";
  if (year <= 2011) return "Wii";
  if (year <= 2016) return "Wii U";
  return "Nintendo Switch";
}

// ─── Source string parsing ─────────────────────────────────────────────────────

function parseSource(s: string): { name: string; year: number | null } {
  const m = s.match(/^(.+?)\s*\((\d{4})\)\s*$/);
  return m ? { name: m[1].trim(), year: parseInt(m[2]) } : { name: s.trim(), year: null };
}

function normalizeTitle(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// ─── SSBWiki scraper ──────────────────────────────────────────────────────────

async function trySSBWiki(name: string): Promise<{
  consoleName: string | null;
  boxArtUrl: string | null;
  wikiUrl: string;
}> {
  const slug = name.replace(/\s+/g, "_");
  const url  = `${BASE_WIKI}/${encodeURIComponent(slug)}`;

  const $ = await fetchHtml(url, 1); // retries=1, lança em 404

  // Detect disambiguation or redirect landing pages
  const pageTitle = $("h1#firstHeading, h1.page-header__title").first().text().trim();
  const isDisambig = $(".disambig, #disambig").length > 0 ||
    $("body").text().includes("may refer to");
  if (isDisambig) return { consoleName: null, boxArtUrl: null, wikiUrl: url };

  // ── Platform: procura em tabelas de infobox ──
  let consoleName: string | null = null;
  $("table tr").each((_, row) => {
    if (consoleName) return;
    const th = $("th", row).first().text().trim();
    if (!/platform|console|system/i.test(th)) return;

    // Tenta cada item de lista (wiki usa <li> pra múltiplas plataformas)
    $("li", row).each((_, li) => {
      if (consoleName) return;
      const mapped = mapPlatform($(li).text());
      if (mapped) consoleName = mapped;
    });

    // Fallback: texto inteiro da célula
    if (!consoleName) {
      const mapped = mapPlatform($("td", row).first().text());
      if (mapped) consoleName = mapped;
    }
  });

  // ── Box art: primeira imagem significativa em tabela ──
  let boxArtUrl: string | null = null;
  $("table img").each((_, img) => {
    if (boxArtUrl) return;
    const src = $(img).attr("src") ?? "";
    const alt = $(img).attr("alt") ?? "";
    const w   = parseInt($(img).attr("width") ?? "0");

    // Ignora ícones pequenos e logos
    if (w > 0 && w < 60) return;
    if (/icon|logo|symbol|flag|placeholder|question/i.test(src + alt)) return;
    if (!src) return;

    boxArtUrl = src.startsWith("//") ? `https:${src}`
              : src.startsWith("/")  ? `${BASE_WIKI}${src}`
              : src;
  });

  return { consoleName, boxArtUrl, wikiUrl: url };
}

// ─── Função exportável ────────────────────────────────────────────────────────

export async function addGamesFromSpirits(dryRun = false) {
  if (dryRun) log.step("DRY RUN — nenhuma mudança no DB");

  // 1. Coleta todos os game names referenciados nos spirits
  log.step("Sincronizando jogos dos spirits → Chronicles…");
  const spirits = await db.collectible.findMany({
    where: { type: "SPIRIT" },
    select: { spiritArtworkSource: true, spiritFirstAppearance: true },
  });

  const sourceSet = new Set<string>();
  for (const s of spirits) {
    if (s.spiritArtworkSource) sourceSet.add(s.spiritArtworkSource);
    if (s.spiritFirstAppearance) sourceSet.add(s.spiritFirstAppearance);
  }

  // 2. Títulos já existentes no ChronicleEntry (normalizados)
  const existing = await db.chronicleEntry.findMany({
    select: { titleNtsc: true, titleJp: true, titleJpEn: true },
  });
  const existingNorm = new Set<string>();
  for (const e of existing) {
    existingNorm.add(normalizeTitle(e.titleNtsc));
    if (e.titleJp)   existingNorm.add(normalizeTitle(e.titleJp));
    if (e.titleJpEn) existingNorm.add(normalizeTitle(e.titleJpEn));
  }

  // 3. Jogos ausentes
  const missing: { name: string; year: number | null }[] = [];
  const seenNames = new Set<string>();

  for (const raw of sourceSet) {
    const { name, year } = parseSource(raw);
    const norm = normalizeTitle(name);
    if (!existingNorm.has(norm) && !seenNames.has(norm)) {
      seenNames.add(norm);
      missing.push({ name, year });
    }
  }

  if (missing.length === 0) {
    log.ok("Chronicles já sincronizado — nenhum jogo novo.");
    return;
  }
  log.ok(`Jogos novos a adicionar ao Chronicles: ${missing.length}`);

  // 4. Para cada jogo: tenta SSBWiki e cria ChronicleEntry
  let created = 0, noArt = 0, errors = 0;

  for (let i = 0; i < missing.length; i++) {
    const game = missing[i]!;
    process.stdout.write(`  [${i + 1}/${missing.length}] ${game.name}… `);

    let consoleName: string | null = null;
    let boxArtUrl:   string | null = null;
    let wikiUrl:     string | null = null;

    try {
      const wiki = await trySSBWiki(game.name);
      consoleName = wiki.consoleName;
      boxArtUrl   = wiki.boxArtUrl;
      wikiUrl     = wiki.wikiUrl;
    } catch {
      // 404 ou erro → sem dados do wiki
    }

    if (!consoleName) consoleName = guessConsoleByYear(game.year);
    if (!boxArtUrl) noArt++;

    if (!dryRun) {
      try {
        await db.chronicleEntry.create({
          data: {
            consoleName,
            titleNtsc: game.name,
            releaseDateNtsc: game.year ? String(game.year) : null,
            boxArtUrl: boxArtUrl ?? null,
            wikiUrl: wikiUrl ?? null,
          },
        });
        created++;
        console.log(`✓ ${consoleName}${boxArtUrl ? " [+capa]" : ""}`);
      } catch (e: any) {
        console.log(`✗ ${String(e.message).slice(0, 60)}`);
        errors++;
      }
    } else {
      console.log(`→ ${consoleName}${boxArtUrl ? " [+capa]" : ""} [DRY]`);
      created++;
    }

    await sleep(DELAY_MS);
  }

  log.ok(`Chronicles atualizado — criados: ${created}, sem capa: ${noArt}, erros: ${errors}`);
}

// ─── Execução direta (npx tsx ...) ───────────────────────────────────────────

const isDirectRun = process.argv[1]?.includes("add-games-from-spirits");
if (isDirectRun) {
  addGamesFromSpirits(process.argv.includes("--dry-run")).catch(console.error);
}
