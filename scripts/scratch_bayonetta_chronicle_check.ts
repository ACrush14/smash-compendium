import { db } from "../lib/db";
async function main() {
  const bay = await db.fighter.findFirst({ where: { name: "Bayonetta" }, select: { id: true } });
  const links = await db.fighterChronicleLink.findMany({ where: { fighterId: bay!.id }, include: { chronicleEntry: { select: { titleNtsc: true, consoleName: true } } } });
  console.log(`FighterChronicleLink count: ${links.length}`);
  links.forEach(l => console.log(`  "${l.chronicleEntry.titleNtsc}" [${l.chronicleEntry.consoleName}]`));

  const bay1 = await db.chronicleEntry.findMany({ where: { titleNtsc: "Bayonetta" }, select: { id: true, titleNtsc: true, consoleName: true, releaseDateNtsc: true } });
  console.log("\nBayonetta (game 1) entries:", bay1);
  await db.$disconnect();
}
main().catch(console.error);
