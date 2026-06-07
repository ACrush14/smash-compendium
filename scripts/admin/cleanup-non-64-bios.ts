/**
 * Cleanup: Delete FighterBio records for eras other than SSB64
 *
 * Only SSB64 (1999) has real in-game character bio text.
 * Melee, Brawl, SSB4 and SSBU bios were wiki-scraped placeholders
 * and are not used on the public pages anymore.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/cleanup-non-64-bios.ts
 *
 * Dry run (preview only, no changes):
 *   npx tsx --env-file=.env.local scripts/admin/cleanup-non-64-bios.ts --dry-run
 */

import { db } from "@/lib/db";

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  Cleanup: FighterBio non-SSB64 records               ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  if (isDryRun) {
    console.log("  [DRY RUN] — no changes will be made\n");
  }

  // Count what exists
  const byCra = await db.fighterBio.groupBy({
    by: ["smashGameVersion"],
    _count: { _all: true },
  });

  console.log("Current FighterBio records by era:");
  for (const row of byCra) {
    const isTarget = row.smashGameVersion !== "SSB64";
    console.log(`  ${isTarget ? "🗑" : "✓"} ${row.smashGameVersion.padEnd(6)} : ${row._count._all}`);
  }

  const toDelete = byCra
    .filter(r => r.smashGameVersion !== "SSB64")
    .reduce((sum, r) => sum + r._count._all, 0);

  const toKeep = byCra
    .find(r => r.smashGameVersion === "SSB64")
    ?._count._all ?? 0;

  console.log(`\nWill DELETE : ${toDelete} records (Melee/Brawl/4/Ultimate)`);
  console.log(`Will KEEP   : ${toKeep} SSB64 bios`);

  if (isDryRun) {
    console.log("\n[DRY RUN] Done — run without --dry-run to apply.");
    return;
  }

  if (toDelete === 0) {
    console.log("\n✅ Nothing to delete — all clean.");
    return;
  }

  const result = await db.fighterBio.deleteMany({
    where: { smashGameVersion: { not: "SSB64" } },
  });

  console.log(`\n✅ Deleted ${result.count} FighterBio records.`);
}

main()
  .catch(e => { console.error("✗ Cleanup failed:", e); process.exit(1); })
  .finally(() => db.$disconnect());
