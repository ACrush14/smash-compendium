import { db } from "../../lib/db";

async function main() {
  const withFighter = await db.collectible.count({ where: { fighterId: { not: null } } });
  const withLinks   = await db.collectible.count({ where: { fighterId: { not: null }, chronicleLinks: { some: {} } } });
  const totalLinks  = await db.collectibleChronicleLink.count();
  console.log(`Collectibles com fighterId:          ${withFighter}`);
  console.log(`Collectibles com fighterId + links:  ${withLinks}`);
  console.log(`CollectibleChronicleLinks total:     ${totalLinks}`);

  const yoshi = await db.fighter.findFirst({ where: { name: "Yoshi" }, select: { id: true } });
  const trophies = await db.collectible.findMany({
    where: { fighterId: yoshi!.id },
    select: {
      id: true, name: true, smashGameVersion: true,
      chronicleLinks: {
        select: { chronicleEntry: { select: { titleNtsc: true } } }
      }
    },
    orderBy: { smashGameVersion: "asc" },
  });
  console.log("\nTrofeus do Yoshi:");
  for (const t of trophies) {
    const games = t.chronicleLinks.map(l => l.chronicleEntry.titleNtsc).join(", ");
    console.log(`  [${t.smashGameVersion}] ${t.name}  →  ${games || "(sem links)"}`);
  }

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
