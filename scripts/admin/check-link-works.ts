import { db } from "../../lib/db";

async function main() {
  const fighter = await db.fighter.findFirst({ where: { name: "Link" }, select: { id: true } });
  const trophies = await db.collectible.findMany({
    where: { fighterId: fighter!.id },
    select: {
      name: true,
      smashGameVersion: true,
      chronicleLinks: { select: { chronicleEntry: { select: { titleNtsc: true } } } }
    },
    orderBy: { smashGameVersion: "asc" }
  });
  for (const t of trophies) {
    const g = t.chronicleLinks.map(l => l.chronicleEntry.titleNtsc).join(", ");
    console.log(`[${t.smashGameVersion}] ${t.name} → ${g || "(sem links)"}`);
  }
  await db.$disconnect();
}
main().catch(console.error);
