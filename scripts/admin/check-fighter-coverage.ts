import { db } from "../../lib/db";

async function main() {
  const fighters = await db.fighter.findMany({
    where: { collectibles: { some: { chronicleLinks: { some: {} } } } },
    select: { name: true, rosterNumber: true },
    orderBy: { rosterNumber: "asc" },
  });
  console.log(`Fighters cobertos via trofeus: ${fighters.length}`);
  console.log(fighters.map(f => f.name).join(", "));
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
