import { db } from "../../lib/db";

async function main() {
  // Future Release entry and linked fighters
  const fr = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Future Release" }, select: { id: true } });
  console.log("Future Release id:", fr?.id);

  if (fr) {
    const links = await db.fighterChronicleLink.findMany({
      where: { chronicleEntryId: fr.id },
      include: { fighter: { select: { name: true, rosterNumber: true } } },
    });
    console.log("Linked fighters:", links.length);
    links.forEach(l => console.log("  " + l.fighter.name + " #" + l.fighter.rosterNumber));
  }

  // Animal Crossing fighters
  const ac = await db.fighter.findMany({
    where: { franchise: { name: { contains: "Animal" } } },
    select: { name: true, rosterNumber: true },
  });
  console.log("\nAnimal Crossing fighters:", ac.map(f => f.name + " #" + f.rosterNumber).join(", "));

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
