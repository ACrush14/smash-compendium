/**
 * migrate-music.ts
 * Adds music columns to Fighter table if they don't exist.
 * Run: npx tsx --env-file=.env.local scripts/scrapers/migrate-music.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Use raw SQL to add the columns if they don't exist
  await db.$executeRawUnsafe(`
    ALTER TABLE "Fighter"
    ADD COLUMN IF NOT EXISTS "musicYoutubeId" TEXT,
    ADD COLUMN IF NOT EXISTS "musicTitle"     TEXT,
    ADD COLUMN IF NOT EXISTS "musicArtist"    TEXT,
    ADD COLUMN IF NOT EXISTS "musicStatus"    TEXT DEFAULT 'pending_review';
  `);
  console.log("✅ Music columns added (or already exist).");

  // Verify
  const sample = await db.fighter.findFirst({ where: { name: "Ness" } });
  console.log("Ness musicYoutubeId:", (sample as any).musicYoutubeId ?? "(null)");
}

main().catch(console.error).finally(() => db.$disconnect());
