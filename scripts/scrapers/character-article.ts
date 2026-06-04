/**
 * Scraper — Character Article (página principal do lutador na SSBWiki)
 *
 * Extrai:
 *   - Descrições in-game por versão do Smash (→ FighterBio)
 *   - Textos de troféus por versão, incluindo variantes NTSC/PAL (→ Collectible TROPHY)
 *   - Textos e efeito do sticker (→ Collectible STICKER)
 *
 * Uso:
 *   npx tsx scripts/scrapers/character-article.ts Ness
 *   npx tsx scripts/scrapers/character-article.ts Ness --save
 */

import * as cheerio from "cheerio";
import { db } from "../../lib/db";
import { fetchHtml, cleanText, wikiUrl, log } from "./utils";

// ─── CLI ─────────────────────────────────────────────────────────────────────

const [, , fighterArg, flagArg] = process.argv;
const FIGHTER_NAME = fighterArg ?? "Ness";
const SAVE_TO_DB   = flagArg === "--save";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InGameDescription {
  gameVersion: string;
  textEn:      string;
}

interface TrophyEntry {
  gameVersion: string;
  name:        string;
  index:       number;      // índice dentro do mesmo gameVersion+name (desambiguação de ID)
  textEn:      string;      // texto primário (NA/universal)
  textNa?:     string;      // preenchido apenas quando NA ≠ EU
  textEu?:     string;      // preenchido apenas quando NA ≠ EU
  imageUrl?:   string;
}

interface StickerEntry {
  gameVersion: string;
  name:        string;
  imageUrl?:   string;
  effect?:     string;
}

interface ArticleData {
  fighterName:  string;
  descriptions: InGameDescription[];
  trophies:     TrophyEntry[];
  stickers:     StickerEntry[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const H2_GAME_MAP: Array<[RegExp, string]> = [
  [/Super Smash Bros\. Ultimate/i,                           "SSBU"],
  [/Super Smash Bros\. for/i,                                "SSB4"],
  [/Super Smash Bros\. 4/i,                                  "SSB4"],
  [/Super Smash Bros\. Brawl/i,                              "SSBB"],
  [/Super Smash Bros\. Melee/i,                              "SSBM"],
  [/Super Smash Bros\./i,                                    "SSB64"],
];

function headingToVersion(text: string): string | null {
  for (const [re, ver] of H2_GAME_MAP) {
    if (re.test(text)) return ver;
  }
  return null;
}

function resolveImageUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith("//")) return `https:${raw}`;
  if (raw.startsWith("/")) return `https://www.ssbwiki.com${raw}`;
  return raw;
}

/**
 * Detecta variantes NTSC/PAL dentro de um <dd>.
 * SSBWiki usa ícones de bandeiras pequenos (width ≤ 25px) como marcadores regionais.
 * Se encontrar 2+ bandeiras, divide o texto ao redor delas.
 * Retorna { textNa, textEu } onde textEu é null quando os textos são idênticos.
 */
function extractRegionalTexts(
  $: cheerio.CheerioAPI,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dd: any,
): { textNa: string; textEu: string | null } {
  const $dd = $(dd);

  const flagImgs = $dd.find("img").filter((_i, img) => {
    const w = parseInt($(img).attr("width") ?? "999", 10);
    return w <= 25;
  });

  if (flagImgs.length < 2) {
    const italic = $dd.find("i").first().text().trim();
    return { textNa: cleanText(italic || $dd.text()), textEu: null };
  }

  // Substitui cada <img> por marcador e quebra o texto ao redor
  const rawHtml = $dd.html() ?? "";
  const segments = rawHtml
    .replace(/<img[^>]+>/gi, "⟦FLAG⟧")
    .split("⟦FLAG⟧")
    .map((s) => cleanText(s.replace(/<[^>]+>/g, " ")))
    .filter((s) => s.length > 20);

  if (segments.length >= 2) {
    const na = segments[0] ?? "";
    const eu = segments[1] ?? null;
    return { textNa: na, textEu: (eu && eu !== na) ? eu : null };
  }

  // Fallback
  const italic = $dd.find("i").first().text().trim();
  return { textNa: cleanText(italic || $dd.text()), textEu: null };
}

// ─── Parser principal ─────────────────────────────────────────────────────────

export async function scrapeCharacterArticle(fighterName: string): Promise<ArticleData> {
  const url = wikiUrl(`/${fighterName.replace(/ /g, "_")}`);
  log.step(`Buscando: ${url}`);
  const $ = await fetchHtml(url);

  const descriptions: InGameDescription[] = [];
  const trophies:     TrophyEntry[]       = [];
  const stickers:     StickerEntry[]      = [];

  let currentGame:     string | null = null;
  let currentSection:  string | null = null;
  let awaitIngameDesc  = false;

  $(".mw-parser-output").children().each((_i, el) => {
    const tag = ($(el).prop("tagName") as string | undefined)?.toLowerCase() ?? "";

    // ── H2: seção de jogo ──────────────────────────────────────────────────────
    if (tag === "h2") {
      const headText  = $(el).find(".mw-headline").text();
      currentGame     = headingToVersion(headText);
      currentSection  = null;
      awaitIngameDesc = false;
      return;
    }

    if (!currentGame) return;

    // ── H3: subseção ──────────────────────────────────────────────────────────
    if (tag === "h3") {
      const sub = $(el).find(".mw-headline").text().toLowerCase();
      if (sub.includes("playable") || sub.includes("fighter")) {
        currentSection  = "playable";
        awaitIngameDesc = false;
      } else if (sub.includes("trophy") || sub.includes("trophies")) {
        currentSection  = "trophy";
        awaitIngameDesc = false;
      } else if (sub.includes("sticker")) {
        currentSection  = "sticker";
        awaitIngameDesc = false;
      } else {
        currentSection  = sub;
        awaitIngameDesc = false;
      }
      return;
    }

    // ── <p>: detecta "In-game description:" ───────────────────────────────────
    if (tag === "p" && currentSection === "playable") {
      const pText = $(el).text().toLowerCase();
      if (pText.includes("in-game description")) {
        awaitIngameDesc = true;
        const afterColon = $(el).text().split(":").slice(1).join(":").trim();
        if (afterColon.length > 30) {
          descriptions.push({ gameVersion: currentGame, textEn: cleanText(afterColon) });
          awaitIngameDesc = false;
        }
      }
      return;
    }

    // ── <dl>: descrições in-game e troféus ────────────────────────────────────
    if (tag === "dl") {

      // Descrição in-game
      if (awaitIngameDesc && currentSection === "playable") {
        const liText = $(el).find("dd li").first().text().trim();
        const ddText = $(el).find("dd").first().text().trim();
        const text   = cleanText(liText || ddText);
        if (text.length > 20 && !descriptions.some((d) => d.gameVersion === currentGame)) {
          descriptions.push({ gameVersion: currentGame!, textEn: text });
        }
        awaitIngameDesc = false;
        return;
      }

      // Troféus — itera TODOS os pares dt/dd do elemento <dl>
      if (currentSection === "trophy") {
        const dts   = $(el).find("dt");
        const dds   = $(el).find("dd");
        const count = Math.max(dts.length, dds.length);

        for (let idx = 0; idx < count; idx++) {
          const dtText = cleanText(dts.eq(idx).text());
          const dd     = dds.get(idx);
          if (!dd) continue;

          const name     = dtText || fighterName;
          const regional = extractRegionalTexts($, dd);
          const textEn   = regional.textNa;

          if (textEn.length < 40) continue;

          const isDupe = trophies.some(
            (t) => t.gameVersion === currentGame && t.textEn === textEn,
          );
          if (isDupe) continue;

          const nameIndex = trophies.filter(
            (t) => t.gameVersion === currentGame && t.name === name,
          ).length;

          trophies.push({
            gameVersion: currentGame!,
            name,
            index:  nameIndex,
            textEn,
            textNa: regional.textEu ? regional.textNa : undefined,
            textEu: regional.textEu ?? undefined,
          });
        }
        return;
      }
    }

    // ── <table>: sticker ──────────────────────────────────────────────────────
    if (tag === "table" && currentSection === "sticker") {
      $("tbody tr", el).each((_j, row) => {
        const cells = $("td", row);
        if (cells.length < 3) return;

        const nameCell   = cells.eq(0);
        const effectCell = cells.eq(2);
        const name       = cleanText(nameCell.text());
        const effect     = cleanText(effectCell.text());

        if (!name || name.length < 2) return;

        let imageUrl: string | undefined;
        const cellImg = nameCell.find("img").first();
        const cellSrc = cellImg.attr("data-src") ?? cellImg.attr("src") ?? cellImg.attr("srcset");
        if (cellSrc) imageUrl = resolveImageUrl(cellSrc.split(" ")[0]) ?? undefined;

        stickers.push({
          gameVersion: currentGame!,
          name:        name || fighterName,
          imageUrl,
          effect:      effect || undefined,
        });
      });
      return;
    }

    // ── div.thumb: imagem do sticker ──────────────────────────────────────────
    if ((tag === "div" || tag === "figure") && currentSection === "sticker") {
      const img    = $(el).find("img").first();
      const rawSrc = img.attr("data-src") ?? img.attr("src") ?? img.attr("srcset");
      if (!rawSrc) return;

      const imageUrl = resolveImageUrl(rawSrc.split(" ")[0]);
      if (!imageUrl) return;

      const lastSticker = [...stickers]
        .reverse()
        .find((s) => s.gameVersion === currentGame && !s.imageUrl);
      if (lastSticker) lastSticker.imageUrl = imageUrl;
      return;
    }
  });

  return { fighterName, descriptions, trophies, stickers };
}

// ─── Terminal output ──────────────────────────────────────────────────────────

function printArticleData(data: ArticleData): void {
  const SEP  = "─".repeat(60);
  const LINE = "";

  console.log(`\n\x1b[1m\x1b[33m╔${"═".repeat(58)}╗\x1b[0m`);
  console.log(`\x1b[1m\x1b[33m║   ARTIGO SSBWiki — ${data.fighterName.padEnd(38)}║\x1b[0m`);
  console.log(`\x1b[1m\x1b[33m╚${"═".repeat(58)}╝\x1b[0m`);

  console.log(`\n\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m DESCRIÇÕES IN-GAME (${data.descriptions.length})\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  for (const d of data.descriptions) {
    console.log(`  \x1b[32m[${d.gameVersion}]\x1b[0m`);
    console.log(`  ${d.textEn.slice(0, 200)}${d.textEn.length > 200 ? "…" : ""}\n`);
  }
  if (!data.descriptions.length)
    console.log(`  \x1b[31m[NENHUMA]\x1b[0m`);

  console.log(`\n\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m TROFÉUS (${data.trophies.length})\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  for (const t of data.trophies) {
    const regional = t.textEu ? ` \x1b[33m[NTSC/PAL divergentes]\x1b[0m` : "";
    console.log(`  \x1b[32m[${t.gameVersion}]\x1b[0m "${t.name}"${regional}`);
    console.log(`  NA: ${t.textEn.slice(0, 160)}${t.textEn.length > 160 ? "…" : ""}`);
    if (t.textEu)
      console.log(`  EU: ${t.textEu.slice(0, 160)}${t.textEu.length > 160 ? "…" : ""}`);
    console.log(LINE);
  }
  if (!data.trophies.length)
    console.log(`  \x1b[31m[NENHUM]\x1b[0m`);

  console.log(`\n\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m STICKERS (${data.stickers.length})\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  for (const s of data.stickers) {
    console.log(`  \x1b[32m[${s.gameVersion}]\x1b[0m "${s.name}" — efeito: ${s.effect ?? "—"}`);
    console.log(`  Imagem: ${s.imageUrl ?? "\x1b[33m[sem URL]\x1b[0m"}\n`);
  }
  if (!data.stickers.length)
    console.log(`  \x1b[31m[NENHUM]\x1b[0m`);
}

// ─── Gravação no banco ────────────────────────────────────────────────────────

async function saveArticleData(data: ArticleData): Promise<void> {
  const fighter = await db.fighter.findFirst({
    where: { name: { equals: data.fighterName, mode: "insensitive" } },
  });

  if (!fighter) {
    log.error(`Lutador "${data.fighterName}" não encontrado. Rode fighters.ts primeiro.`);
    return;
  }

  let saved = 0;

  // FighterBio — descrições in-game
  for (const desc of data.descriptions) {
    await db.fighterBio.upsert({
      where: {
        fighterId_smashGameVersion: {
          fighterId:        fighter.id,
          smashGameVersion: desc.gameVersion,
        },
      },
      create: { fighterId: fighter.id, smashGameVersion: desc.gameVersion, contentEn: desc.textEn },
      update: { contentEn: desc.textEn },
    });
    log.ok(`  FighterBio [${desc.gameVersion}] salvo.`);
    saved++;
  }

  // Troféus — com descriptionNa/descriptionEu
  for (const trophy of data.trophies) {
    // Sufixo de índice apenas a partir do segundo com o mesmo nome (retrocompatível com IDs antigos)
    const suffix = trophy.index > 0 ? `-${trophy.index}` : "";
    const id = `TROPHY-${trophy.gameVersion}-${data.fighterName}-${trophy.name}${suffix}`.slice(0, 255);
    await db.collectible.upsert({
      where:  { id },
      create: {
        id,
        type:             "TROPHY",
        smashGameVersion: trophy.gameVersion,
        name:             trophy.name,
        description:      trophy.textEn,
        descriptionNa:    trophy.textNa ?? null,
        descriptionEu:    trophy.textEu ?? null,
        assetRenderUrl:   trophy.imageUrl ?? null,
        sourceType:       "Official",
        fighterId:        fighter.id,
      },
      update: {
        description:    trophy.textEn,
        descriptionNa:  trophy.textNa ?? null,
        descriptionEu:  trophy.textEu ?? null,
        assetRenderUrl: trophy.imageUrl ?? null,
      },
    });
    const tag = trophy.textEu ? " [NTSC+PAL]" : "";
    log.ok(`  Trophy [${trophy.gameVersion}] "${trophy.name}"${tag} salvo.`);
    saved++;
  }

  // Stickers
  for (const sticker of data.stickers) {
    const id = `STICKER-${sticker.gameVersion}-${data.fighterName}-${sticker.name}`.slice(0, 255);
    await db.collectible.upsert({
      where:  { id },
      create: {
        id,
        type:             "STICKER",
        smashGameVersion: sticker.gameVersion,
        name:             sticker.name,
        description:      sticker.effect ? `Efeito: ${sticker.effect}` : null,
        assetRenderUrl:   sticker.imageUrl ?? null,
        sourceType:       "Official",
        fighterId:        fighter.id,
      },
      update: {
        description:    sticker.effect ? `Efeito: ${sticker.effect}` : null,
        assetRenderUrl: sticker.imageUrl ?? null,
      },
    });
    log.ok(`  Sticker [${sticker.gameVersion}] "${sticker.name}" salvo.`);
    saved++;
  }

  log.ok(`\nTotal: ${saved} registros salvos para ${data.fighterName}.`);
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    const data = await scrapeCharacterArticle(FIGHTER_NAME);
    printArticleData(data);

    if (SAVE_TO_DB) {
      console.log("\n\x1b[35m── Gravando no banco...\x1b[0m\n");
      await saveArticleData(data);
      await db.$disconnect();
    } else {
      console.log(`\n\x1b[2m  [dry-run — use --save para gravar]\x1b[0m\n`);
    }
  } catch (err) {
    log.error(`Falha: ${String(err)}`);
    if (err instanceof Error) console.error(err.stack);
    process.exit(1);
  }
}

main();
