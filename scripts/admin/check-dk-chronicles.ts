import { db } from "../../lib/db";
(async () => {
  const entries = await db.chronicleEntry.findMany({
    where: { titleNtsc: { contains: "Donkey Kong", mode: "insensitive" } },
    select: { id: true, titleNtsc: true, consoleName: true },
    orderBy: { releaseDateNtsc: "asc" },
  });
  entries.forEach(e => console.log(`[${e.id.slice(-6)}] ${e.titleNtsc} [${e.consoleName}]`));
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
