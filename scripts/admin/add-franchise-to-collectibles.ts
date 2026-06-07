/**
 * Migration: Add franchiseId to Collectible table + auto-populate from fighters
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/add-franchise-to-collectibles.ts
 *
 * Then regenerate Prisma client:
 *   npx prisma generate
 */

import { db } from "@/lib/db";

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  Migration: Collectible.franchiseId                  ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  // ── Step 1: Add column ──────────────────────────────────────────────────────
  console.log("→ Step 1: Adding franchiseId column to Collectible...");
  try {
    await db.$executeRawUnsafe(`
      ALTER TABLE "Collectible"
      ADD COLUMN IF NOT EXISTS "franchiseId" TEXT;
    `);
    console.log("  ✓ Column added (or already exists)\n");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("already exists")) {
      console.log("  ✓ Column already exists — skipping\n");
    } else {
      throw e;
    }
  }

  // ── Step 2: Add index ───────────────────────────────────────────────────────
  console.log("→ Step 2: Creating index on franchiseId...");
  try {
    await db.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Collectible_franchiseId_idx"
      ON "Collectible" ("franchiseId");
    `);
    console.log("  ✓ Index created (or already exists)\n");
  } catch (e: unknown) {
    console.log("  ⚠ Index error (non-fatal):", e instanceof Error ? e.message : String(e), "\n");
  }

  // ── Step 3: Count how many collectibles need populating ─────────────────────
  const totalCollectibles = await db.collectible.count();
  const alreadySet = await db.$queryRawUnsafe<[{ count: bigint }]>(
    `SELECT COUNT(*) as count FROM "Collectible" WHERE "franchiseId" IS NOT NULL`
  );
  const alreadyCount = Number(alreadySet[0].count);
  const remaining = totalCollectibles - alreadyCount;

  console.log(`→ Step 3: Populating franchiseId from fighter.franchiseId...`);
  console.log(`  Total collectibles : ${totalCollectibles}`);
  console.log(`  Already have value : ${alreadyCount}`);
  console.log(`  Need populating    : ${remaining}`);

  if (remaining === 0) {
    console.log("  ✓ All collectibles already have franchiseId set — skipping\n");
  } else {
    const updated = await db.$executeRawUnsafe(`
      UPDATE "Collectible" c
      SET "franchiseId" = f."franchiseId"
      FROM "Fighter" f
      WHERE c."fighterId" = f.id
        AND c."franchiseId" IS NULL;
    `);
    console.log(`  ✓ Updated ${updated} collectibles with franchiseId from their fighter\n`);
  }

  // ── Step 4: Add FK constraint (soft — informational) ───────────────────────
  console.log("→ Step 4: Adding foreign key constraint...");
  try {
    await db.$executeRawUnsafe(`
      ALTER TABLE "Collectible"
      ADD CONSTRAINT "Collectible_franchiseId_fkey"
      FOREIGN KEY ("franchiseId") REFERENCES "Franchise"(id)
      ON DELETE SET NULL;
    `);
    console.log("  ✓ Foreign key added\n");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("already exists")) {
      console.log("  ✓ FK already exists — skipping\n");
    } else {
      console.log("  ⚠ FK warning (non-fatal):", msg, "\n");
    }
  }

  // ── Step 5: Final count ─────────────────────────────────────────────────────
  const finalWithFranchise = await db.$queryRawUnsafe<[{ count: bigint }]>(
    `SELECT COUNT(*) as count FROM "Collectible" WHERE "franchiseId" IS NOT NULL`
  );
  const finalWithout = await db.$queryRawUnsafe<[{ count: bigint }]>(
    `SELECT COUNT(*) as count FROM "Collectible" WHERE "franchiseId" IS NULL`
  );

  console.log("─── Final State ─────────────────────────────────────────");
  console.log(`  With franchiseId    : ${Number(finalWithFranchise[0].count)}`);
  console.log(`  Without franchiseId : ${Number(finalWithout[0].count)} (collectibles with no fighter)`);
  console.log("─────────────────────────────────────────────────────────\n");

  console.log("✅ Migration complete!\n");
  console.log("Next steps:");
  console.log("  1. npx prisma generate");
  console.log("  2. Visit /franchise/Mario to see it work");
}

main()
  .catch(e => { console.error("✗ Migration failed:", e); process.exit(1); })
  .finally(() => db.$disconnect());
