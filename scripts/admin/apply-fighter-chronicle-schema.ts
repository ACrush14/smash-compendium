/**
 * apply-fighter-chronicle-schema.ts — Cria FighterChronicleLink + colunas JP em ChronicleEntry.
 * Works dos lutadores passam a ser ligados DIRETAMENTE ao Chronicles.
 *
 * Run: npx tsx --env-file=.env.local scripts/admin/apply-fighter-chronicle-schema.ts
 */
import { db } from "../../lib/db";

async function main() {
  // Colunas JP no ChronicleEntry
  await (db as any).$executeRawUnsafe(`ALTER TABLE "ChronicleEntry" ADD COLUMN IF NOT EXISTS "wikiUrlJp" TEXT`);
  await (db as any).$executeRawUnsafe(`ALTER TABLE "ChronicleEntry" ADD COLUMN IF NOT EXISTS "boxArtUrlJp" TEXT`);
  console.log("✓ ChronicleEntry.wikiUrlJp / boxArtUrlJp");

  // Tabela de junção
  await (db as any).$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "FighterChronicleLink" (
      "fighterId"        TEXT NOT NULL,
      "chronicleEntryId" TEXT NOT NULL,
      "isDebut"          BOOLEAN NOT NULL DEFAULT false,
      "displayOrder"     INTEGER,
      CONSTRAINT "FighterChronicleLink_pkey" PRIMARY KEY ("fighterId", "chronicleEntryId")
    )
  `);
  console.log("✓ FighterChronicleLink criada");

  await (db as any).$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FighterChronicleLink_fighterId_fkey') THEN
        ALTER TABLE "FighterChronicleLink" ADD CONSTRAINT "FighterChronicleLink_fighterId_fkey"
          FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FighterChronicleLink_chronicleEntryId_fkey') THEN
        ALTER TABLE "FighterChronicleLink" ADD CONSTRAINT "FighterChronicleLink_chronicleEntryId_fkey"
          FOREIGN KEY ("chronicleEntryId") REFERENCES "ChronicleEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);
  await (db as any).$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "FighterChronicleLink_fighterId_idx" ON "FighterChronicleLink"("fighterId")`);
  await (db as any).$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "FighterChronicleLink_chronicleEntryId_idx" ON "FighterChronicleLink"("chronicleEntryId")`);
  console.log("✓ FKs + índices");
  console.log("\nSchema aplicado.");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
