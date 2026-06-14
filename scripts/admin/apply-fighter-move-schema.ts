/**
 * apply-fighter-move-schema.ts — Cria a tabela FighterMove (idempotente).
 * Run: npx tsx --env-file=.env.local scripts/admin/apply-fighter-move-schema.ts
 */
import { db } from "../../lib/db";

async function main() {
  await (db as any).$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "FighterMove" (
      "id"               TEXT NOT NULL,
      "fighterId"        TEXT NOT NULL,
      "smashGameVersion" TEXT NOT NULL,
      "order"            INTEGER NOT NULL DEFAULT 0,
      "label"            TEXT,
      "descEn"           TEXT,
      "descJp"           TEXT,
      "descPt"           TEXT,
      "descJpEn"         TEXT,
      CONSTRAINT "FighterMove_pkey" PRIMARY KEY ("id")
    )
  `);
  await (db as any).$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FighterMove_fighterId_fkey') THEN
        ALTER TABLE "FighterMove" ADD CONSTRAINT "FighterMove_fighterId_fkey"
          FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);
  await (db as any).$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "FighterMove_fighterId_smashGameVersion_idx" ON "FighterMove"("fighterId","smashGameVersion")`);
  console.log("✓ FighterMove criada (+ FK + índice)");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
