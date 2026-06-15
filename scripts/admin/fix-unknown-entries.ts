import { db } from "../../lib/db";

const DRY = process.argv.includes("--dry-run");
let updated = 0;

async function main() {
  console.log(`SmashCompendium — fix-unknown-entries ${DRY ? "(DRY RUN)" : ""}\n`);

  // 1. Fix corrupted "Perfect Dark 5/00\n/TOP SECRET" → "Perfect Dark" (N64)
  const pd = await db.chronicleEntry.findFirst({
    where: { titleNtsc: { contains: "TOP SECRET" } },
    select: { id: true, titleNtsc: true, consoleName: true },
  });
  if (pd) {
    console.log(`[FOUND] Corrupted: "${pd.titleNtsc}"`);
    if (!DRY) {
      await db.chronicleEntry.update({
        where: { id: pd.id },
        data: { titleNtsc: "Perfect Dark", consoleName: "Nintendo 64", releaseDateNtsc: "05/26/2000" },
      });
    }
    console.log(`  [${DRY ? "DRY" : "OK"}] → "Perfect Dark" [Nintendo 64] date=05/26/2000`);
    updated++;
  } else {
    console.log("[NOT FOUND] Corrupted Perfect Dark entry (already fixed?)");
  }

  // 2. Create GoldenEye 007 (N64) if it doesn't exist
  const ge = await db.chronicleEntry.findFirst({ where: { titleNtsc: { contains: "GoldenEye" } } });
  if (ge) {
    console.log(`\n[SKIP] GoldenEye already exists: "${ge.titleNtsc}" [${ge.consoleName}]`);
  } else {
    console.log("\n[CREATE] GoldenEye 007 → Nintendo 64");
    if (!DRY) {
      await db.chronicleEntry.create({
        data: {
          titleNtsc: "GoldenEye 007",
          titleJp: "ゴールデンアイ 007",
          consoleName: "Nintendo 64",
          releaseDateNtsc: "08/25/1997",
        },
      });
    }
    console.log(`  [${DRY ? "DRY" : "OK"}] Created "GoldenEye 007" [Nintendo 64] date=08/25/1997`);
    updated++;
  }

  console.log(`\n✅ Total: ${updated} operações`);
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
