/**
 * translate-all-fighter-content.ts
 * Traduz automaticamente contentEn → contentPt e contentJp → contentJpEn
 * de todos os FighterBio sem tradução. Também traduz FighterMove.
 *
 * Usa Gemini 2.5 Flash Lite (free tier).
 * Requer GEMINI_API_KEY em .env.local (aistudio.google.com).
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts
 *   npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts --only-moves
 *   npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts --fighter Mario
 */

import { GoogleGenAI } from "@google/genai";
import { db } from "../../lib/db";

const args = process.argv.slice(2);
const DRY_RUN    = args.includes("--dry-run");
const ONLY_MOVES = args.includes("--only-moves");
const ONLY_BIOS  = args.includes("--only-bios");
const FIGHTER_ARG = args.includes("--fighter") ? args[args.indexOf("--fighter") + 1] : null;

// Gemini free tier: 15 req/min → mínimo 4s entre chamadas
const DELAY_MS = 4100;

const ERA_LABELS: Record<string, string> = {
  SSB64: "Super Smash Bros. (Nintendo 64, 1999)",
  SSBM:  "Super Smash Bros. Melee (GameCube, 2001)",
  SSBB:  "Super Smash Bros. Brawl (Wii, 2008)",
  SSB4:  "Super Smash Bros. for Nintendo 3DS / Wii U (2014)",
  SSBU:  "Super Smash Bros. Ultimate (Nintendo Switch, 2018)",
};

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function translate(ai: GoogleGenAI, prompt: string): Promise<string> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });
      const text = result.text;
      if (!text) throw new Error("Gemini returned empty response");
      return text.trim();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      const is503 = msg.includes("503") || msg.includes("UNAVAILABLE");
      // 429: extrai retryDelay da mensagem e espera
      const retryMatch = msg.match(/"retryDelay":"(\d+)s"/);
      const is429 = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
      if (attempt < 4) {
        if (retryMatch && is429) {
          const waitMs = (parseInt(retryMatch[1]) + 2) * 1000;
          process.stdout.write(` [retry ${attempt}/3, wait ${retryMatch[1]}s]`);
          await sleep(waitMs);
          continue;
        }
        if (is503) {
          await sleep(5000 * attempt);
          continue;
        }
      }
      throw e;
    }
  }
  throw new Error("translate: unreachable");
}

function buildPtPrompt(fighterName: string, era: string, textEn: string): string {
  return `You are a translator for SmashCompendium, a Brazilian Portuguese Nintendo museum.\
 Translate the following Super Smash Bros. character biography to natural Brazilian Portuguese (pt-BR).\
 Rules:\
 - Sound as if it was originally written in pt-BR, NOT like a translation\
 - Preserve proper nouns: character names, game titles, move names in their official PT names when they exist\
 - Use the same engaging, informative museum-catalog tone\
 - Do not add commentary, notes, or explanations — output ONLY the translated text\
 Character: ${fighterName}\
 Era: ${ERA_LABELS[era] ?? era}\
 ---\
 ${textEn}\
 ---\
 Brazilian Portuguese translation:`;
}

function buildJpEnPrompt(fighterName: string, era: string, textJp: string): string {
  return `You are a translator for SmashCompendium, a Nintendo museum.\
 Translate the following Super Smash Bros. Japanese character biography to natural English.\
 Rules:\
 - Sound as if it was written by a Nintendo of America copywriter, NOT like a literal translation\
 - Preserve the descriptive, catalog/museum tone\
 - Keep character names, game titles in their official English names\
 - Do not add commentary or notes — output ONLY the translated text\
 Character: ${fighterName}\
 Era: ${ERA_LABELS[era] ?? era}\
 ---\
 ${textJp}\
 ---\
 English translation:`;
}

function buildMovePtPrompt(fighterName: string, era: string, label: string, textEn: string): string {
  return `You are a translator for SmashCompendium, a Brazilian Portuguese Nintendo museum.\
 Translate the following Super Smash Bros. move/trophy description to natural Brazilian Portuguese (pt-BR).\
 Rules:\
 - Sound as if it was originally written in pt-BR\
 - Preserve move names (Super Jump Punch, Mario Tornado, Final Smash, etc.) in their official PT names when they exist\
 - Keep the same gameplay-description tone\
 - Output ONLY the translated text, no commentary\
 Character: ${fighterName} | Era: ${ERA_LABELS[era] ?? era} | Move type: ${label}\
 ---\
 ${textEn}\
 ---\
 Brazilian Portuguese translation:`;
}

function buildMoveJpEnPrompt(fighterName: string, era: string, label: string, textJp: string): string {
  return `You are a translator for SmashCompendium, a Nintendo museum.\
 Translate the following Super Smash Bros. Japanese move/trophy description to natural English.\
 Rules:\
 - Sound like official Nintendo of America text\
 - Keep move names in their official English equivalents\
 - Preserve the gameplay-description tone\
 - Output ONLY the translated text\
 Character: ${fighterName} | Era: ${ERA_LABELS[era] ?? era} | Move type: ${label}\
 ---\
 ${textJp}\
 ---\
 English translation:`;
}

async function translateBios(ai: GoogleGenAI) {
  const where = FIGHTER_ARG
    ? { fighter: { name: FIGHTER_ARG } }
    : {};

  const allBios = await db.fighterBio.findMany({
    where,
    include: { fighter: { select: { name: true } } },
    orderBy: [{ fighter: { rosterNumber: "asc" } }, { smashGameVersion: "asc" }],
  });
  const bios = allBios.filter(b =>
    (b.contentPt === null && b.contentEn !== null) ||
    (b.contentJpEn === null && b.contentJp !== null)
  );

  console.log(`\nBIOS sem tradução: ${bios.length}`);
  let done = 0, failed = 0;

  for (const bio of bios) {
    const name = bio.fighter.name;
    const era  = bio.smashGameVersion;
    process.stdout.write(`  ${name.padEnd(22)} [${era}] `);

    const updates: Record<string, string> = {};

    try {
      if (bio.contentEn && !bio.contentPt) {
        if (!DRY_RUN) {
          updates.contentPt = await translate(ai, buildPtPrompt(name, era, bio.contentEn));
          await sleep(DELAY_MS);
        } else {
          process.stdout.write("[dry] PT ");
        }
      }
      if (bio.contentJp && !bio.contentJpEn) {
        if (!DRY_RUN) {
          updates.contentJpEn = await translate(ai, buildJpEnPrompt(name, era, bio.contentJp));
          await sleep(DELAY_MS);
        } else {
          process.stdout.write("[dry] JP→EN ");
        }
      }

      if (DRY_RUN) { console.log(""); continue; }

      if (Object.keys(updates).length > 0) {
        await db.fighterBio.update({
          where: { fighterId_smashGameVersion: { fighterId: bio.fighterId, smashGameVersion: era } },
          data: updates,
        });
        done++;
        console.log(`✅ ${Object.keys(updates).join("+")}`);
      } else {
        console.log("— nada a traduzir");
      }
    } catch (e) {
      failed++;
      console.log(`❌ ${e}`);
    }
  }

  console.log(`  Bios: ${done} traduzidos, ${failed} falhas`);
}

async function translateMoves(ai: GoogleGenAI) {
  const where = FIGHTER_ARG
    ? { fighter: { name: FIGHTER_ARG } }
    : {};

  const allMoves = await db.fighterMove.findMany({
    where,
    include: { fighter: { select: { name: true } } },
    orderBy: [{ fighter: { rosterNumber: "asc" } }, { smashGameVersion: "asc" }, { order: "asc" }],
  });
  const moves = allMoves.filter(m =>
    (m.descPt === null && m.descEn !== null) ||
    (m.descJpEn === null && m.descJp !== null) ||
    (m.descEn === null && m.descJp !== null)
  );

  console.log(`\nMOVES sem tradução: ${moves.length}`);
  let done = 0, failed = 0;

  for (const mv of moves) {
    const name  = mv.fighter.name;
    const era   = mv.smashGameVersion;
    const label = mv.label ?? "SMASH";
    process.stdout.write(`  ${name.padEnd(22)} [${era}#${mv.order} ${label}] `);

    const updates: Record<string, string> = {};

    try {
      if (mv.descJp && !mv.descJpEn) {
        if (!DRY_RUN) {
          updates.descJpEn = await translate(ai, buildMoveJpEnPrompt(name, era, label, mv.descJp));
          await sleep(DELAY_MS);
        }
      }
      const enBase = mv.descEn ?? updates.descJpEn;
      if (enBase && !mv.descPt) {
        if (!DRY_RUN) {
          updates.descPt = await translate(ai, buildMovePtPrompt(name, era, label, enBase));
          await sleep(DELAY_MS);
        }
      }
      if (!mv.descEn && updates.descJpEn) {
        updates.descEn = updates.descJpEn;
      }

      if (DRY_RUN) {
        console.log(`[dry] ${Object.keys(updates).join("+") || "nada"}`);
        continue;
      }

      if (Object.keys(updates).length > 0) {
        await db.fighterMove.update({ where: { id: mv.id }, data: updates });
        done++;
        console.log(`✅ ${Object.keys(updates).join("+")}`);
      } else {
        console.log("— já traduzido");
      }
    } catch (e) {
      failed++;
      console.log(`❌ ${e}`);
    }
  }

  console.log(`  Moves: ${done} traduzidos, ${failed} falhas`);
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY não definida em .env.local");
    console.error("   Crie uma chave gratuita em: aistudio.google.com/apikey");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey, apiVersion: "v1" });
  console.log("SmashCompendium — Tradução automática via Gemini 2.5 Flash Lite");
  console.log(DRY_RUN ? "MODO DRY RUN — sem escrita\n" : "");

  if (!ONLY_MOVES) await translateBios(ai);
  if (!ONLY_BIOS)  await translateMoves(ai);

  await db.$disconnect();
  console.log("\n✅ Tradução concluída.");
}

main().catch(e => { console.error(e); process.exit(1); });
