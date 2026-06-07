/**
 * add-curation-columns.ts
 *
 * Fallback para adicionar colunas de curadoria ao Fighter via $executeRaw.
 * Usar se `prisma db push` falhar.
 *
 *   npx tsx --env-file=.env.local scripts/admin/add-curation-columns.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Adicionando colunas de curadoria ao Fighter...");

  await db.$executeRawUnsafe(`
    ALTER TABLE "Fighter"
    ADD COLUMN IF NOT EXISTS "curationStatus" TEXT DEFAULT 'pending_review',
    ADD COLUMN IF NOT EXISTS "curationNotes"  TEXT;
  `);

  const count = await db.fighter.count({ where: { curationStatus: "pending_review" } });
  console.log(`✅ Colunas adicionadas. ${count} fighters com status 'pending_review'.`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
