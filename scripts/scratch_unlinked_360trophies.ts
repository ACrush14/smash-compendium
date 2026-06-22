import { db } from "../lib/db";

async function main() {
  // 360 TROPHY sem fighter vinculado
  const unlinked = await db.collectible.findMany({
    where: {
      smashGameVersion: "SSBM",
      type: "MEDIA",
      fighterId: null,
      name: { contains: "360 TROPHY", mode: "insensitive" },
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true, assetRenderUrl: true },
  });

  console.log(`360 TROPHY SSBM sem fighter: ${unlinked.length}`);
  for (const m of unlinked) {
    console.log(` - "${m.name}" | url=${!!m.assetRenderUrl}`);
  }

  // Também ver todos os 360 TROPHY existentes (vinculados e não)
  const all360 = await db.collectible.findMany({
    where: {
      smashGameVersion: "SSBM",
      type: "MEDIA",
      name: { contains: "360 TROPHY", mode: "insensitive" },
    },
    include: { fighter: { select: { name: true } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, assetRenderUrl: true, fighterId: true, fighter: true },
  });

  console.log(`\nTotal 360 TROPHY SSBM: ${all360.length}`);
  for (const m of all360) {
    console.log(` - "${m.name}" → ${m.fighter?.name ?? "SEM FIGHTER"}`);
  }

  await db.$disconnect();
}
main();
