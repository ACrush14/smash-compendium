import { db } from "../lib/db";
async function main() {
  const t = await db.collectible.findFirst({ where: { id: "TROPHY-SSB4-Inkling-Inkling-1" }, select: { chronicleLinks: { select: { chronicleEntry: { select: { titleNtsc: true, consoleName: true } } } } } });
  console.log("chronicleLinks:", t?.chronicleLinks.map(l => `${l.chronicleEntry.titleNtsc} [${l.chronicleEntry.consoleName}]`));

  const inkling = await db.fighter.findFirst({ where: { name: "Inkling" }, select: { id: true } });
  const links = await db.fighterChronicleLink.findMany({ where: { fighterId: inkling!.id }, include: { chronicleEntry: { select: { titleNtsc: true, consoleName: true } } } });
  console.log(`FighterChronicleLink count: ${links.length}`);
  links.forEach(l => console.log(`  "${l.chronicleEntry.titleNtsc}" [${l.chronicleEntry.consoleName}]`));
  await db.$disconnect();
}
main().catch(console.error);
