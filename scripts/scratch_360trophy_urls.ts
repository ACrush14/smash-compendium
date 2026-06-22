import { db } from "../lib/db";

async function main() {
  const existing = await db.collectible.findMany({
    where: { smashGameVersion: "SSBM", type: "MEDIA", name: { contains: "360 TROPHY", mode: "insensitive" } },
    orderBy: { name: "asc" },
    select: { name: true, assetRenderUrl: true, fighterId: true },
  });

  console.log(`Total 360 TROPHY no banco: ${existing.length}\n`);
  for (const m of existing) {
    console.log(`"${m.name}"`);
    console.log(`  URL: ${m.assetRenderUrl}`);
    console.log(`  fighter: ${m.fighterId ?? "null"}\n`);
  }

  await db.$disconnect();
}
main();
