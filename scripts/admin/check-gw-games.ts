import { db } from "../../lib/db";
async function main() {
  const entries = await db.chronicleEntry.findMany({
    where: { consoleName: "Game & Watch" },
    select: { id: true, titleNtsc: true, releaseDateNtsc: true, titleJp: true },
    orderBy: { titleNtsc: "asc" },
  });
  console.log(`Game & Watch no DB: ${entries.length}\n`);
  entries.forEach(e => console.log(`  ${(e.titleNtsc ?? "").padEnd(40)} ${e.releaseDateNtsc ?? ""}`));
  await db.$disconnect();
}
main();
