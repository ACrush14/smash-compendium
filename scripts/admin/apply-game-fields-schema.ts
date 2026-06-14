/**
 * apply-game-fields-schema.ts — Adiciona colunas de exibição ao modelo Game (idempotente).
 * Necessário para migrar os jogos de origem (works) de hardcoded para o banco.
 *
 * Run: npx tsx --env-file=.env.local scripts/admin/apply-game-fields-schema.ts
 */
import { db } from "../../lib/db";

const COLS: [string, string][] = [
  ["releaseYearNa", "INTEGER"],
  ["releaseMonthNa", "INTEGER"],
  ["boxArtUrlJp", "TEXT"],
  ["wikiUrl", "TEXT"],
  ["wikiUrlJp", "TEXT"],
  ["jpExclusive", "BOOLEAN NOT NULL DEFAULT false"],
  ["displayOrder", "INTEGER"],
];

async function main() {
  for (const [col, type] of COLS) {
    await (db as any).$executeRawUnsafe(
      `ALTER TABLE "Game" ADD COLUMN IF NOT EXISTS "${col}" ${type}`
    );
    console.log(`✓ Game.${col} (${type})`);
  }
  console.log("\nColunas aplicadas.");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
