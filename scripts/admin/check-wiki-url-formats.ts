import { db } from "../../lib/db";
async function main() {
  const entries = await db.chronicleEntry.findMany({
    where: { wikiUrl: { not: null }, titleJp: null },
    select: { titleNtsc: true, wikiUrl: true },
    take: 30, orderBy: { consoleName: "asc" },
  });
  entries.forEach(e => console.log(`${(e.titleNtsc ?? "").padEnd(40)} | ${e.wikiUrl}`));
  await db.$disconnect();
}
main();
