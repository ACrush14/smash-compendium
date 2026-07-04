import { db } from "../lib/db";
async function main() {
  const cloud = await db.fighter.findFirst({ where: { name: "Cloud" }, select: { id: true } });
  const links = await db.fighterChronicleLink.findMany({ where: { fighterId: cloud!.id }, include: { chronicleEntry: { select: { titleNtsc: true, consoleName: true } } } });
  console.log(`FighterChronicleLink count: ${links.length}`);
  links.forEach(l => console.log(`  "${l.chronicleEntry.titleNtsc}" [${l.chronicleEntry.consoleName}]`));

  const ff7 = await db.chronicleEntry.findMany({ where: { titleNtsc: { contains: "Final Fantasy VII" } }, select: { id: true, titleNtsc: true, consoleName: true, releaseDateNtsc: true } });
  console.log("\nFinal Fantasy VII entries:", ff7);
  await db.$disconnect();
}
main().catch(console.error);
