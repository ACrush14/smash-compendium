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
  subtype?: "sprite-origin" | "clay-model" | "art-ssb64"; // diferencia dentro do tipo SPRITE
  imageUrl: string;
  caption:  string;
  smashGameVersion?: string; // para clay (SSBM) e arte SSB64 (SSB64)
}

interface FandomImage {
  imageUrl: string;
  caption:  string;
  section:  string; // "renders" | "sprites" | "victory" | "other"
}

interface ImageResult {
  renderUrl:     string | null;
  sectionImages: SectionImage[];
  specialImages: SpecialImage[];
  fandomImages:  FandomImage[];  // novos — do earthbound.fandom.com
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
  // "Artwork" inclui clay models e renders de época
  const TARGET_SECTIONS = new Map<string, "SPRITE" | "SPIRIT">([
    ["Background", "SPRITE"],
    ["Origin",     "SPRITE"],
    ["Artwork",    "SPRITE"],   // clay model, renders históricos
    ["Spirit",     "SPIRIT"],
    ["Spirits",    "SPIRIT"],
  ]);

  // Quantas imagens capturar por seção (Artwork pode ter várias)
  const SECTION_LIMIT = new Map<string, number>([
    ["Background", 1],
    ["Origin",     1],
    ["Artwork",    4],   // clay model + renders de época (até 4)
    ["Spirit",     1],
    ["Spirits",    1],
  ]);

  let currentType:  "SPRITE" | "SPIRIT" | null = null;
  let currentSection = "";
  let countInSection = 0;

  $(".mw-parser-output").children().each((_i, el) => {
    const tag = $(el).prop("tagName")?.toLowerCase() ?? "";

    if (tag === "h2") {
      const headId   = $(el).find("span.mw-headline").attr("id") ?? "";
      const headText = $(el).find("span.mw-headline").text().trim();
      currentSection = headId || headText;
      currentType    = TARGET_SECTIONS.get(headId) ?? TARGET_SECTIONS.get(headText) ?? null;
      countInSection = 0;
      return;
    }

    if (!currentType) return;

    const limit = SECTION_LIMIT.get(currentSection) ?? 1;
    if (countInSection >= limit) return;

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

// ─── 4. Fandom Wiki — renders, sprites e victory screens ─────────────────────
//
//  Alvo: https://earthbound.fandom.com/wiki/Ness/Super_Smash_Bros.
//  A wiki do Fandom serve HTML estático compatível com cheerio.
//  Seções capturadas: galeria de renders, sprites e tela de vitória.

async function fetchFandomImages(name: string): Promise<FandomImage[]> {
  // Mapa de personagem → URL da página Fandom
  // Estende facilmente para outros lutadores com origem em franquias com wiki no Fandom
  const FANDOM_URLS: Record<string, string> = {
    Ness:   "https://earthbound.fandom.com/wiki/Ness/Super_Smash_Bros.",
    Lucas:  "https://earthbound.fandom.com/wiki/Lucas/Super_Smash_Bros.",
  };

  const pageUrl = FANDOM_URLS[name];
  if (!pageUrl) {
    log.warn(`  Fandom: nenhuma URL mapeada para "${name}" — pulando.`);
    return [];
  }

  log.step(`Fandom — ${pageUrl}`);

  try {
    const $ = await fetchHtml(pageUrl);
    const results: FandomImage[] = [];
    const seen = new Set<string>();

    // Cabeçalhos que identificam seções de interesse
    const SECTION_KEYWORDS = [
      { re: /render|artwork|art/i,    section: "renders"  },
      { re: /sprite/i,               section: "sprites"  },
      { re: /victory|win/i,          section: "victory"  },
      { re: /screenshot|in.game/i,   section: "ingame"   },
      { re: /gallery/i,              section: "gallery"  },
    ];

  let currentSection = "other";

  $(".mw-parser-output, .page-content").children().each((_i, el) => {
    const tag  = $(el).prop("tagName")?.toLowerCase() ?? "";
    const text = $(el).text().trim().toLowerCase();

    // Detecta seção atual pelo heading
    if (tag === "h2" || tag === "h3") {
      const matched = SECTION_KEYWORDS.find(({ re }) => re.test(text));
      currentSection = matched?.section ?? "other";
      return;
    }

    // Captura imagens em figuras, galeria e thumbs
    $(el).find("img, [data-src]").each((_j, imgEl) => {
      const raw     = $(imgEl).attr("data-src") ?? $(imgEl).attr("src");
      const resolved = resolveImg(raw);
      if (!resolved || seen.has(resolved)) return;

      // Filtra ícones muito pequenos (botões de UI do Fandom, etc.)
      const width = parseInt($(imgEl).attr("width") ?? "200", 10);
      if (width < 80) return;

      // Filtra URLs de UI do Fandom (avatares, badges, etc.)
      if (resolved.includes("wiki/Special") || resolved.includes("extensions/")) return;

      const caption = $(imgEl).closest("figure, .thumbinner, .wikia-gallery-item")
        .find("figcaption, .thumbcaption, .lightbox-caption")
        .first().text().trim() || $(imgEl).attr("alt") || "";

      seen.add(resolved);
      results.push({ imageUrl: resolved, caption: cleanText(caption), section: currentSection });
    });
  });

  log.ok(`  Fandom: ${results.length} imagens encontradas`);
  return results;
  } catch (err: any) {
    log.warn(`  Fandom extra failed: ${err.message}`);
    return [];
  }
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

  console.log(`\n\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m FANDOM (${result.fandomImages.length})\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  for (const img of result.fandomImages) {
    console.log(`  \x1b[32m[${img.section}]\x1b[0m ${img.caption || "(sem legenda)"}`);
    console.log(`     ${img.imageUrl.slice(0, 80)}`);
  }
  if (!result.fandomImages.length)
    console.log(`  \x1b[33m  Nenhuma imagem encontrada no Fandom para "${FIGHTER_NAME}".\x1b[0m`);
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

  // 4b. Imagens do Fandom — upsert como Collectible tipo SPRITE com sourceType=Fandom
  for (let i = 0; i < result.fandomImages.length; i++) {
    const fi  = result.fandomImages[i];
    if (!fi) continue;
    const id  = `FANDOM-${FIGHTER_NAME}-${fi.section}-${i}`.slice(0, 255);
    await db.collectible.upsert({
      where: { id },
      create: {
        id, type: "SPRITE",
        smashGameVersion: "FANDOM",
        name:             `${FIGHTER_NAME} — ${fi.section} (Fandom)`,
        description:      fi.caption || null,
        assetRenderUrl:   fi.imageUrl,
        sourceType:       "Fandom",
        fighterId:        fighter.id,
      },
      update: { assetRenderUrl: fi.imageUrl, description: fi.caption || null },
    });
    log.ok(`  Fandom [${fi.section}] #${i} "${FIGHTER_NAME}" → salvo.`);
  }

  // 4. Sprite, Artwork (clay/arte SSB64) e Spirit — upsert como Collectible
  for (const special of result.specialImages) {
    // Determina nome, versão e ID com base no subtype
    let id: string;
    let collName: string;
    let gameVersion: string;

    if (special.subtype === "clay-model") {
      id          = `SPRITE-${FIGHTER_NAME}-clay`.slice(0, 255);
      collName    = `${FIGHTER_NAME} — Clay Model (Melee)`;
      gameVersion = "SSBM";
    } else if (special.subtype === "art-ssb64") {
      id          = `SPRITE-${FIGHTER_NAME}-art64`.slice(0, 255);
      collName    = `${FIGHTER_NAME} — Arte SSB64`;
      gameVersion = "SSB64";
    } else if (special.type === "SPIRIT") {
      id          = `SPIRIT-${FIGHTER_NAME}-ssbu`.slice(0, 255);
      collName    = `${FIGHTER_NAME} — Spirit`;
      gameVersion = "SSBU";
    } else {
      // sprite-origin padrão
      id          = `SPRITE-${FIGHTER_NAME}-origin`.slice(0, 255);
      collName    = `${FIGHTER_NAME} — Sprite Origem`;
      gameVersion = "ORIGIN";
    }

    await db.collectible.upsert({
      where: { id },
      create: {
        id,
        type:             special.type,
        smashGameVersion: gameVersion,
        name:             collName,
        description:      special.caption || null,
        assetRenderUrl:   special.imageUrl,
        sourceType:       special.type === "SPRITE" ? "Origin" : "Official",
        fighterId:        fighter.id,
      },
      update: { assetRenderUrl: special.imageUrl, description: special.caption || null },
    });
    log.ok(`  ${special.type}/${special.subtype ?? "origin"} "${FIGHTER_NAME}" → imagem salva.`);
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    const [renderUrl, sectionImages, specialImages, fandomImages] = await Promise.all([
      fetchFighterRender(FIGHTER_NAME),
      fetchSectionImages(FIGHTER_NAME),
      fetchSpecialImages(FIGHTER_NAME),
      fetchFandomImages(FIGHTER_NAME),
    ]);

    const result: ImageResult = { renderUrl, sectionImages, specialImages, fandomImages };
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
