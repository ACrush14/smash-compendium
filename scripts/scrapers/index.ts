/**
 * ETL Pipeline — Orquestrador principal
 *
 * Ordem de execução (dependências de FK impõem a sequência):
 *   1. Fighters  → cria Franchise, Game, Fighter, FighterBio, FighterWork
 *   2. Stages    → cria Stage (reutiliza Franchise)
 *   3. Music     → cria Music, StageMusic (depende de Stage)
 *   4. Collectibles → cria Collectible (depende de Fighter)
 *
 * Uso:
 *   npm run scrape                   # pipeline completo
 *   npm run scrape -- --only fighters
 *   npm run scrape -- --only stages
 *   npm run scrape -- --only music
 *   npm run scrape -- --only collectibles
 */

import { db } from "../../lib/db";
import { log } from "./utils";
import { scrapeFighterList, upsertFighters } from "./fighters";
import { scrapeAndUpsertStages } from "./stages";
import { scrapeAndUpsertMusic } from "./music";
import { scrapeAndUpsertCollectibles } from "./collectibles";

// ─── CLI argument parsing ─────────────────────────────────────────────────────

const args   = process.argv.slice(2);
const onlyIdx = args.indexOf("--only");
const only    = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

const VALID_STEPS = ["fighters", "stages", "music", "collectibles"] as const;
type Step = (typeof VALID_STEPS)[number];

function shouldRun(step: Step): boolean {
  return only === null || only === step;
}

// ─── Orquestrador ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startedAt = Date.now();

  console.log("");
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║   SmashCompendium — ETL Pipeline v1.0        ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  if (only && !VALID_STEPS.includes(only as Step)) {
    log.error(`Step inválido: "${only}". Use: ${VALID_STEPS.join(" | ")}`);
    process.exit(1);
  }

  try {
    // Testa conexão com o banco antes de começar
    await db.$queryRaw`SELECT 1`;
    log.ok("Conexão com PostgreSQL estabelecida.");
  } catch (err) {
    log.error(`Não foi possível conectar ao banco de dados: ${String(err)}`);
    log.error("Verifique DATABASE_URL no arquivo .env.local");
    process.exit(1);
  }

  // ── Step 1: Fighters ────────────────────────────────────────────────────────
  if (shouldRun("fighters")) {
    console.log("\n── STEP 1/4: Fighters ──────────────────────────\n");
    const list = await scrapeFighterList();
    await upsertFighters(list);
  }

  // ── Step 2: Stages ──────────────────────────────────────────────────────────
  if (shouldRun("stages")) {
    console.log("\n── STEP 2/4: Stages ────────────────────────────\n");
    await scrapeAndUpsertStages();
  }

  // ── Step 3: Music ───────────────────────────────────────────────────────────
  if (shouldRun("music")) {
    console.log("\n── STEP 3/4: Music ─────────────────────────────\n");
    await scrapeAndUpsertMusic();
  }

  // ── Step 4: Collectibles ────────────────────────────────────────────────────
  if (shouldRun("collectibles")) {
    console.log("\n── STEP 4/4: Collectibles ──────────────────────\n");
    await scrapeAndUpsertCollectibles();
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log("\n╔══════════════════════════════════════════════╗");
  log.ok(`Pipeline concluído em ${elapsed}s.`);
  console.log("╚══════════════════════════════════════════════╝\n");

  await db.$disconnect();
}

main().catch((err) => {
  log.error(`Erro fatal: ${String(err)}`);
  console.error(err);
  process.exit(1);
});
