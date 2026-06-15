import { db } from "../../lib/db";

async function main() {
  const titles = [
    "Perfect Dark",
    "GoldenEye 007",
    "GoldenEye",
    "Goldeneye 007",
    "Animal Crossing",
    "Cubivore",
    "Future Release",
  ];

  for (const t of titles) {
    const entry = await db.chronicleEntry.findFirst({
      where: { titleNtsc: { contains: t } },
      select: { id: true, titleNtsc: true, consoleName: true, releaseDateNtsc: true },
    });
    console.log(`"${t}": ${entry ? `FOUND → "${entry.titleNtsc}" [${entry.consoleName}] date=${entry.releaseDateNtsc}` : "NOT FOUND"}`);
  }

  // Show the corrupted Perfect Dark entry
  const corrupted = await db.chronicleEntry.findFirst({
    where: { titleNtsc: { contains: "TOP SECRET" } },
    select: { id: true, titleNtsc: true, consoleName: true, releaseDateNtsc: true },
  });
  console.log(`\nCorrupted entry: ${JSON.stringify(corrupted)}`);

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
