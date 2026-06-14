/**
 * Aplica manualmente as mudanças de schema no banco sem depender do prisma migrate.
 */
import { db } from "../../lib/db";

async function main() {
  console.log("Aplicando mudanças de schema...");

  // 1. Adiciona coluna assetRender2Url na Collectible
  await (db as any).$executeRawUnsafe(`
    ALTER TABLE "Collectible" ADD COLUMN IF NOT EXISTS "assetRender2Url" TEXT
  `);
  console.log("✓ assetRender2Url adicionado");

  // 2. Cria tabela CollectibleRelation
  await (db as any).$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CollectibleRelation" (
      "id"           TEXT NOT NULL,
      "fromId"       TEXT NOT NULL,
      "toId"         TEXT NOT NULL,
      "relationType" TEXT NOT NULL,
      CONSTRAINT "CollectibleRelation_pkey" PRIMARY KEY ("id")
    )
  `);
  console.log("✓ CollectibleRelation criada");

  // 3. Foreign keys
  await (db as any).$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'CollectibleRelation_fromId_fkey'
      ) THEN
        ALTER TABLE "CollectibleRelation"
          ADD CONSTRAINT "CollectibleRelation_fromId_fkey"
          FOREIGN KEY ("fromId") REFERENCES "Collectible"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);
  await (db as any).$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'CollectibleRelation_toId_fkey'
      ) THEN
        ALTER TABLE "CollectibleRelation"
          ADD CONSTRAINT "CollectibleRelation_toId_fkey"
          FOREIGN KEY ("toId") REFERENCES "Collectible"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);
  console.log("✓ Foreign keys aplicadas");

  // 4. Unique + indexes
  await (db as any).$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "CollectibleRelation_fromId_toId_key"
    ON "CollectibleRelation"("fromId", "toId")
  `);
  await (db as any).$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "CollectibleRelation_fromId_idx"
    ON "CollectibleRelation"("fromId")
  `);
  await (db as any).$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "CollectibleRelation_toId_idx"
    ON "CollectibleRelation"("toId")
  `);
  console.log("✓ Indexes criados");

  await db.$disconnect();
  console.log("\nSchema atualizado com sucesso!");
}

main().catch(e => { console.error(e); process.exit(1); });
