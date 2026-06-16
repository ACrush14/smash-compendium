import { db } from "../../lib/db";
const names = ["Sora", "King K. Rool", "Mii Brawler", "King Dedede", "Pit", "Falco", "Mario", "Link", "Bayonetta", "Joker"];
(async () => {
  for (const name of names) {
    const f = await db.fighter.findFirst({
      where: { name },
      include: { chronicleLinks: { include: { chronicleEntry: { select: { titleNtsc: true, consoleName: true } } }, orderBy: { displayOrder: "asc" } } },
    });
    if (!f) { console.log(`${name}: NOT FOUND`); continue; }
    console.log(`\n${name} (${f.chronicleLinks.length} links):`);
    f.chronicleLinks.forEach(l => console.log(`  [${l.displayOrder}] ${l.chronicleEntry.titleNtsc} [${l.chronicleEntry.consoleName}]${l.isDebut ? " ★" : ""}`));
  }
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
