/**
 * Migração: adicionar campos SSBWiki ao modelo Music
 *
 * Campos novos: youtubeId, duration, sourceGame, compositionType, notes
 *
 * Run (com dev server parado):
 *   npx tsx --env-file=.env.local scripts/admin/add-music-ssbu-fields.ts
 *
 * Depois: npx prisma generate  (para regenerar o cliente Prisma)
 */

import { db } from "@/lib/db";

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  Migração: Music — novos campos SSBWiki SSBU         ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  const steps: { sql: string; label: string }[] = [
    {
      label: "youtubeId TEXT",
      sql: `ALTER TABLE "Music" ADD COLUMN IF NOT EXISTS "youtubeId" TEXT`,
    },
    {
      label: "duration TEXT",
      sql: `ALTER TABLE "Music" ADD COLUMN IF NOT EXISTS "duration" TEXT`,
    },
    {
      label: "sourceGame TEXT",
      sql: `ALTER TABLE "Music" ADD COLUMN IF NOT EXISTS "sourceGame" TEXT`,
    },
    {
      label: "compositionType TEXT",
      sql: `ALTER TABLE "Music" ADD COLUMN IF NOT EXISTS "compositionType" TEXT`,
    },
    {
      label: "notes TEXT",
      sql: `ALTER TABLE "Music" ADD COLUMN IF NOT EXISTS "notes" TEXT`,
    },
    {
      label: "INDEX franchiseId",
      sql: `CREATE INDEX IF NOT EXISTS "Music_franchiseId_idx" ON "Music" ("franchiseId")`,
    },
  ];

  for (const step of steps) {
    try {
      await db.$executeRawUnsafe(step.sql);
      console.log(`  ✅ ${step.label}`);
    } catch (e) {
      console.error(`  ❌ ${step.label}: ${String(e)}`);
    }
  }

  // Verificação
  const count = await db.music.count();
  console.log(`\n✅ Migração concluída. ${count} registros Music existentes.`);
  console.log("👉 Próximo passo: npx prisma generate");
  console.log("👉 Depois:        npx tsx --env-file=.env.local scripts/scrapers/scrape-ssbu-music-full.ts");
}

main()
  .catch(e => { console.error("✗ Falha:", e); process.exit(1); })
  .finally(() => db.$disconnect());
