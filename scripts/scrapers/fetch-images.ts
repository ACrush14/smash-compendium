/**
 * Scraper de Imagens — busca imagens para um lutador na SSBWiki.
 *
 * Extrai:
 *   1. Render principal (SSBU)        → Fighter.imageUrl
 *   2. Imagens de troféus/sticker     → Collectible.assetRenderUrl
 *   3. Sprite de origem (Background)  → Collectible type=SPRITE, smashGameVersion=ORIGIN
 *   4. Spirit (Ultimate)              → Collectible type=SPIRIT, smashGameVersion=SSBU
 *
 * Uso:
 *   npx tsx scripts/scrapers/fetch-images.ts Ness
 *   npx tsx scripts/scrapers/fetch-images.ts Ness --save
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, wikiUrl, log } from "./utils";

// ─── CLI ─────────────────────────────────────────────────────────────────────

const [, , fighterArg, flagArg] = process.argv;
const FIGHTER_NAME = fighterArg ?? "Ness";
const SAVE_TO_DB   = flagArg === "--save";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const H2_GAME_MAP: Array<[RegExp, string]> = [
  [/Super Smash Bros\. Ultimate/i,  "SSBU"],
  [/Super Smash Bros\. for/i,       "SSB4"],
  [/Super Smash Bros\. 4/i,         "SSB4"],
  [/Super Smash Bros\. Brawl/i,     "SSBB"],
  [/Super Smash Bros\. Melee/i,     "SSBM"],
  [/Super Smash Bros\./i,           "SSB64"],
];

function headingToVersion(text: string): string | null {
  for (const [re, ver] of H2_GAME_MAP) {
    if (re.test(text)) return ver;
  }
  return null;
}

/** Converte thumbnail URL em resolução completa.
 *  Ex: .../thumb/8/82/Ness.png/250px-Ness.png → .../8/82/Ness.png
 */
function toFullRes(url: string): string {
  if (!url.includes("/thumb/")) return url;
  return url.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
}

function resolveImg(raw: string | undefined, fallbackSrcset?: string): string | null {
  let src = raw ?? fallbackSrcset?.split(" ")[0];
  if (!src) return null;
  if (src.startsWith("//")) src = `https:${src}`;
  if (!src.startsWith("http")) return null;
  return toFullRes(src);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionImage {
  gameVersion: string;
  section:     "trophy" | "sticker";
  imageUrl:    string;
  caption:     string;
}

interface SpecialImage {
  type:     "SPRITE" | "SPIRIT";
  imageUrl: string;
  caption:  string;
}

interface ImageResult {
  renderUrl:     string | null;
  sectionImages: SectionImage[];
  specialImages: SpecialImage[];
}

// ─── 1. Render SSBU (infobox da página SSBU) ──────────────────────────────────

async function fetchFighterRender(name: string): Promise<string | null> {
  const url = wikiUrl(`/${name.replace(/ /g, "_")}_(SSBU)`);
  log.step(`Render SSBU — ${url}`);
  try {
    const $ = await fetchHtml(url);
    const img = $("table.infobox img, .infobox img").first();
    const raw = img.attr("data-src") ?? img.attr("src") ?? img.attr("srcset");
    return resolveImg(raw);
  } catch (err) {
    log.warn(`  Render não encontrado: ${String(err)}`);
    return null;
  }
}

// ─── 2. Imagens de troféus e stickers (artigo principal) ─────────────────────

async function fetchSectionImages(name: string): Promise<SectionImage[]> {
  const url = wikiUrl(`/${name.replace(/ /g, "_")}`);
  log.step(`Troféus/Stickers — ${url}`);
  const $ = await fetchHtml(url);

  const images: SectionImage[] = [];
  let currentGame:    string | null              = null;
  let currentSection: "trophy" | "sticker" | null = null;

  $(".mw-parser-output").children().each((_i, el) => {
    const tag = $(el).prop("tagName")?.toLowerCase() ?? "";

    if (tag === "h2") {
      currentGame    = headingToVersion($(el).find(".mw-headline").text());
      currentSection = null;
      return;
    }

    if (!currentGame) return;

    if (tag === "h3") {
      const sub = $(el).find(".mw-headline").text().toLowerCase();
      if (sub.includes("trophy") || sub.includes("trophies")) {
        currentSection = "trophy";
      } else if (sub.includes("sticker")) {
        currentSection = "sticker";
      } else {
        currentSection = null;
      }
      return;
    }

    if (!currentSection) return;

    if (tag === "div" || tag === "figure") {
      $(el).find("img").each((_j, imgEl) => {
        const raw    = $(imgEl).attr("data-src") ?? $(imgEl).attr("src");
        const url    = resolveImg(raw, $(imgEl).attr("srcset"));
        if (!url) return;

        const width = parseInt($(imgEl).attr("width") ?? "999", 10);
        if (width < 30) return; // descarta ícones de bandeira etc.

        const caption = cleanText(
          $(el).find(".thumbcaption, figcaption").text() ||
          $(imgEl).attr("alt") || ""
        );

        images.push({ gameVersion: currentGame!, section: currentSection!, imageUrl: url, caption });
      });
    }
  });

  return images;
}

// ─── 3. Sprite de origem (Background) e Spirit ────────────────────────────────

async function fetchSpecialImages(name: string): Promise<SpecialImage[]> {
  const url = wikiUrl(`/${name.replace(/ /g, "_")}`);
  log.step(`Sprite/Spirit — ${url}`);
  const $ = await fetchHtml(url);

  const results: SpecialImage[] = [];
  const seen = new Set<string>();

  // Seções-alvo → tipo de colecionável
  const TARGET_SECTIONS = new Map<string, "SPRITE" | "SPIRIT">([
    ["Background", "SPRITE"],
    ["Origin",     "SPRITE"],
    ["Spirit",     "SPIRIT"],
    ["Spirits",    "SPIRIT"],
  ]);

  let currentType:  "SPRITE" | "SPIRIT" | null = null;
  let countInSection = 0;

  $(".mw-parser-output").children().each((_i, el) => {
    const tag = $(el).prop("tagName")?.toLowerCase() ?? "";

    if (tag === "h2") {
      const headId   = $(el).find("span.mw-headline").attr("id") ?? "";
      const headText = $(el).find("span.mw-headline").text().trim();
      currentType    = TARGET_SECTIONS.get(headId) ?? TARGET_SECTIONS.get(headText) ?? null;
      countInSection = 0;
      return;
    }

    if (!currentType) return;

    // Para sprites de origem, limitamos a 1 imagem (a mais proeminente da seção)
    if (countInSection >= 1) return;

    $(el).find("img").each((_j, imgEl) => {
      if (countInSection >= 1) return;

      const raw = $(imgEl).attr("data-src") ?? $(imgEl).attr("src");
      const resolved = resolveImg(raw);
      if (!resolved || seen.has(resolved)) return;

      const width = parseInt($(imgEl).attr("width") ?? "100", 10);
      if (width < 50) return; // descarta ícones

      const caption = cleanText(
        $(el).find(".thumbcaption, figcaption").text() ||
        $(imgEl).attr("alt") || ""
      );

      seen.add(resolved);
      countInSection++;
      results.push({ type: currentType!, imageUrl: resolved, caption });
    });
  });

  return results;
}

// ─── Terminal output ──────────────────────────────────────────────────────────

function printResults(result: ImageResult): void {
  const SEP = "─".repeat(60);
  console.log(`\n\x1b[1m\x1b[33m╔${"═".repeat(58)}╗\x1b[0m`);
  console.log(`\x1b[1m\x1b[33m║   IMAGENS — ${FIGHTER_NAME.padEnd(45)}║\x1b[0m`);
  console.log(`\x1b[1m\x1b[33m╚${"═".repeat(58)}╝\x1b[0m`);

  console.log(`\n\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m RENDER SSBU\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  console.log(result.renderUrl
    ? `  \x1b[32m✔\x1b[0m ${result.renderUrl}`
    : `  \x1b[31m✘  não encontrado\x1b[0m`);

  console.log(`\n\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m TROFÉUS/STICKERS (${result.sectionImages.length})\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  for (const img of result.sectionImages) {
    console.log(`  \x1b[32m[${img.gameVersion}]\x1b[0m [${img.section}] ${img.caption || "(sem legenda)"}`);
    console.log(`     ${img.imageUrl.slice(0, 80)}`);
  }
  if (!result.sectionImages.length)
    console.log(`  \x1b[31m✘  nenhuma\x1b[0m`);

  console.log(`\n\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m SPRITE/SPIRIT (${result.specialImages.length})\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  for (const img of result.specialImages) {
    console.log(`  \x1b[32m[${img.type}]\x1b[0m ${img.caption || "(sem legenda)"}`);
    console.log(`     ${img.imageUrl.slice(0, 80)}`);
  }
  if (!result.specialImages.length)
    console.log(`  \x1b[33m  Seções Background/Origin/Spirit não encontradas na página.\x1b[0m`);
}

// ─── Gravação no banco ────────────────────────────────────────────────────────

async function saveImages(result: ImageResult): Promise<void> {
  const fighter = await db.fighter.findFirst({
    where: { name: { equals: FIGHTER_NAME, mode: "insensitive" } },
  });
  if (!fighter) {
    log.error(`Lutador "${FIGHTER_NAME}" não encontrado no banco.`);
    return;
  }

  // 1. Render SSBU
  if (result.renderUrl) {
    await db.fighter.update({ where: { id: fighter.id }, data: { imageUrl: result.renderUrl } });
    log.ok(`Fighter.imageUrl salvo.`);
  }

  // 2. Troféus — associa imagens por ordem dentro de cada era
  const trophyImages = result.sectionImages.filter((i) => i.section === "trophy");
  for (const img of trophyImages) {
    const collectibles = await db.collectible.findMany({
      where: { fighterId: fighter.id, type: "TROPHY", smashGameVersion: img.gameVersion },
      orderBy: { name: "asc" },
    });

    let target = collectibles.find(
      (c) =>
        !c.assetRenderUrl &&
        (img.caption.toLowerCase().includes(c.name.toLowerCase()) ||
          c.name.toLowerCase() === FIGHTER_NAME.toLowerCase()),
    );
    if (!target) target = collectibles.find((c) => !c.assetRenderUrl);

    if (target) {
      await db.collectible.update({ where: { id: target.id }, data: { assetRenderUrl: img.imageUrl } });
      log.ok(`  Trophy [${img.gameVersion}] "${target.name}" → imagem salva.`);
    } else {
      log.warn(`  Trophy [${img.gameVersion}] sem correspondência (${img.caption}).`);
    }
  }

  // 3. Stickers
  for (const img of result.sectionImages.filter((i) => i.section === "sticker")) {
    const sticker = await db.collectible.findFirst({
      where: { fighterId: fighter.id, type: "STICKER", smashGameVersion: img.gameVersion, assetRenderUrl: null },
    });
    if (sticker) {
      await db.collectible.update({ where: { id: sticker.id }, data: { assetRenderUrl: img.imageUrl } });
      log.ok(`  Sticker [${img.gameVersion}] "${sticker.name}" → imagem salva.`);
    }
  }

  // 4. Sprite de origem e Spirit — upsert como Collectible
  for (const special of result.specialImages) {
    const id = `${special.type}-${FIGHTER_NAME}-origin`.slice(0, 255);
    await db.collectible.upsert({
      where: { id },
      create: {
        id,
        type:             special.type,
        smashGameVersion: special.type === "SPRITE" ? "ORIGIN" : "SSBU",
        name:             special.type === "SPRITE"
          ? `${FIGHTER_NAME} — Sprite EarthBound`
          : `${FIGHTER_NAME} — Spirit`,
        description:      special.caption || null,
        assetRenderUrl:   special.imageUrl,
        sourceType:       special.type === "SPRITE" ? "Origin" : "Official",
        fighterId:        fighter.id,
      },
      update: { assetRenderUrl: special.imageUrl, description: special.caption || null },
    });
    log.ok(`  ${special.type} "${FIGHTER_NAME}" → imagem salva.`);
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    const [renderUrl, sectionImages, specialImages] = await Promise.all([
      fetchFighterRender(FIGHTER_NAME),
      fetchSectionImages(FIGHTER_NAME),
      fetchSpecialImages(FIGHTER_NAME),
    ]);

    const result: ImageResult = { renderUrl, sectionImages, specialImages };
    printResults(result);

    if (SAVE_TO_DB) {
      console.log("\n\x1b[35m── Gravando no banco...\x1b[0m\n");
      await saveImages(result);
      await db.$disconnect();
    } else {
      console.log(`\n\x1b[2m  [dry-run — use --save para gravar]\x1b[0m\n`);
    }
  } catch (err) {
    log.error(`Erro: ${String(err)}`);
    process.exit(1);
  }
}

main();
