/**
 * translate-all-fighter-content.ts
 * Traduz automaticamente contentEn → contentPt e contentJp → contentJpEn
 * de todos os FighterBio sem tradução. Também traduz FighterMove.
 *
 * Usa Claude API (claude-sonnet-4-6) com prompt curatorial — o resultado
 * deve soar como texto escrito originalmente em PT-BR ou EN, não traduzido.
 *
 * Requer ANTHROPIC_API_KEY em .env.local
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts
 *   npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts --only-moves
 *   npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts --fighter Mario
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "../../lib/db";

const args = process.argv.slice(2);
const DRY_RUN    = args.includes("--dry-run");
const ONLY_MOVES = args.includes("--only-moves");
const ONLY_BIOS  = args.includes("--only-bios");
const FIGHTER_ARG = args.includes("--fighter") ? args[args.indexOf("--fighter") + 1] : null;

const DELAY_MS = 800; // entre chamadas à API

const ERA_LABELS: Record<string, string> = {
  SSB64: "Super Smash Bros. (Nintendo 64, 1999)",
  SSBM:  "Super Smash Bros. Melee (GameCube, 2001)",
  SSBB:  "Super Smash Bros. Brawl (Wii, 2008)",
  SSB4:  "Super Smash Bros. for Nintendo 3DS / Wii U (2014)",
  SSBU:  "Super Smash Bros. Ultimate (Nintendo Switch, 2018)",
};

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function translate(client: Anthropic, prompt: string): Promise<string> {
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });
  const block = msg.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text.trim();
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

async function translateBios(client: Anthropic) {
  const where = FIGHTER_ARG
    ? { fighter: { name: FIGHTER_ARG } }
    : {};

  const bios = await db.fighterBio.findMany({
    where: {
      ...where,
      OR: [
        { contentPt: null, contentEn: { not: null } },
        { contentJpEn: null, contentJp: { not: null } },
      ],
    },
    include: { fighter: { select: { name: true } } },
    orderBy: [{ fighter: { rosterNumber: "asc" } }, { smashGameVersion: "asc" }],
  });

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
          updates.contentPt = await translate(client, buildPtPrompt(name, era, bio.contentEn));
          await sleep(DELAY_MS);
        } else {
          console.log(`[dry] PT from EN`);
        }
      }
      if (bio.contentJp && !bio.contentJpEn) {
        if (!DRY_RUN) {
          updates.contentJpEn = await translate(client, buildJpEnPrompt(name, era, bio.contentJp));
          await sleep(DELAY_MS);
        } else {
          console.log(`[dry] JP→EN`);
        }
      }

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

async function translateMoves(client: Anthropic) {
  const where = FIGHTER_ARG
    ? { fighter: { name: FIGHTER_ARG } }
    : {};

  const moves = await db.fighterMove.findMany({
    where: {
      ...where,
      OR: [
        { descPt: null, descEn: { not: null } },
        { descJpEn: null, descJp: { not: null } },
        { descEn: null, descJp: { not: null } },
      ],
    },
    include: { fighter: { select: { name: true } } },
    orderBy: [{ fighter: { rosterNumber: "asc" } }, { smashGameVersion: "asc" }, { order: "asc" }],
  });

  console.log(`\nMOVES sem tradução: ${moves.length}`);
  let done = 0, failed = 0;

  for (const mv of moves) {
    const name  = mv.fighter.name;
    const era   = mv.smashGameVersion;
    const label = mv.label ?? "SMASH";
    process.stdout.write(`  ${name.padEnd(22)} [${era}#${mv.order} ${label}] `);

    const updates: Record<string, string> = {};

    try {
      // JP → EN (se só tem JP)
      if (mv.descJp && !mv.descJpEn) {
        if (!DRY_RUN) {
          updates.descJpEn = await translate(client, buildMoveJpEnPrompt(name, era, label, mv.descJp));
          await sleep(DELAY_MS);
        }
      }
      // EN base: usa descEn se existir, senão usa descJpEn recém-traduzido
      const enBase = mv.descEn ?? updates.descJpEn;
      if (enBase && !mv.descPt) {
        if (!DRY_RUN) {
          updates.descPt = await translate(client, buildMovePtPrompt(name, era, label, enBase));
          await sleep(DELAY_MS);
        }
      }
      // Garante descEn preenchido se só tinha JP
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
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("❌ ANTHROPIC_API_KEY não definida em .env.local");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  console.log(`SmashCompendium — Tradução automática de bios e movimentos`);
  console.log(DRY_RUN ? "MODO DRY RUN — sem escrita\n" : "");

  if (!ONLY_MOVES) await translateBios(client);
  if (!ONLY_BIOS)  await translateMoves(client);

  await db.$disconnect();
  console.log("\n✅ Tradução concluída.");
}

main().catch(e => { console.error(e); process.exit(1); });
