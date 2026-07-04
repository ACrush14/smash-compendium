import { db } from "../lib/db";
async function main() {
  const ken = await db.fighter.findFirst({ where: { name: "Ken" }, select: { id: true } });
  const links = await db.fighterChronicleLink.findMany({ where: { fighterId: ken!.id }, include: { chronicleEntry: { select: { titleNtsc: true, consoleName: true } } } });
  console.log(`FighterChronicleLink count: ${links.length}`);
  links.forEach(l => console.log(`  "${l.chronicleEntry.titleNtsc}" [${l.chronicleEntry.consoleName}]`));
  await db.$disconnect();
}
main().catch(console.error);
