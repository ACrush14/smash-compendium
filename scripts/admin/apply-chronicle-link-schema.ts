/**
 * apply-chronicle-link-schema.ts
 *
 * Cria a tabela CollectibleChronicleLink no banco e corrige consoleName dos SSB4.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/apply-chronicle-link-schema.ts
 */
import { db } from "../../lib/db";

async function main() {
  console.log("Aplicando mudanças de schema...");

  // 1. Cria tabela CollectibleChronicleLink
  await (db as any).$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CollectibleChronicleLink" (
      "collectibleId"    TEXT NOT NULL,
      "chronicleEntryId" TEXT NOT NULL,
      CONSTRAINT "CollectibleChronicleLink_pkey" PRIMARY KEY ("collectibleId", "chronicleEntryId")
    )
  `);
  console.log("✓ CollectibleChronicleLink criada");

  // 2. Foreign keys (idempotentes via DO $$ BEGIN ... END $$)
  await (db as any).$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'CollectibleChronicleLink_collectibleId_fkey'
      ) THEN
        ALTER TABLE "CollectibleChronicleLink"
          ADD CONSTRAINT "CollectibleChronicleLink_collectibleId_fkey"
          FOREIGN KEY ("collectibleId") REFERENCES "Collectible"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);
  await (db as any).$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'CollectibleChronicleLink_chronicleEntryId_fkey'
      ) THEN
        ALTER TABLE "CollectibleChronicleLink"
          ADD CONSTRAINT "CollectibleChronicleLink_chronicleEntryId_fkey"
          FOREIGN KEY ("chronicleEntryId") REFERENCES "ChronicleEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);
  console.log("✓ Foreign keys aplicadas");

  // 3. Indexes
  await (db as any).$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "CollectibleChronicleLink_collectibleId_idx"
    ON "CollectibleChronicleLink"("collectibleId")
  `);
  await (db as any).$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "CollectibleChronicleLink_chronicleEntryId_idx"
    ON "CollectibleChronicleLink"("chronicleEntryId")
  `);
  console.log("✓ Indexes criados");

  // 4. Corrige consoleName errado dos SSB4 (ambos estavam como "Nintendo DS")
  const fix3ds = await (db as any).$executeRawUnsafe(`
    UPDATE "ChronicleEntry"
    SET "consoleName" = 'Nintendo 3DS'
    WHERE "titleNtsc" = 'Super Smash Bros. for Nintendo 3DS'
      AND "consoleName" != 'Nintendo 3DS'
  `);
  const fixWiiU = await (db as any).$executeRawUnsafe(`
    UPDATE "ChronicleEntry"
    SET "consoleName" = 'Wii U'
    WHERE "titleNtsc" = 'Super Smash Bros. for Wii U'
      AND "consoleName" != 'Wii U'
  `);
  console.log(`✓ consoleName SSB4 3DS corrigido (${fix3ds} rows)`);
  console.log(`✓ consoleName SSB4 Wii U corrigido (${fixWiiU} rows)`);

  await db.$disconnect();
  console.log("\nSchema atualizado com sucesso!");
}

main().catch(e => { console.error(e); process.exit(1); });
