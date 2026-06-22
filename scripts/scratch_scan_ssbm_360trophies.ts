import { db } from "../lib/db";

async function main() {
  // Todos os lutadores com troféus SSBM
  const fighters = await db.fighter.findMany({
    where: {
      collectibles: { some: { smashGameVersion: "SSBM", type: "TROPHY" } },
    },
    select: { id: true, name: true, rosterNumber: true },
    orderBy: { rosterNumber: "asc" },
  });

  console.log(`Fighters com troféus SSBM: ${fighters.length}\n`);

  const missing: { fighter: string; missing: string[] }[] = [];
  const ok: string[] = [];

  for (const f of fighters) {
    // Troféus SSBM do fighter
    const trophies = await db.collectible.findMany({
      where: { fighterId: f.id, smashGameVersion: "SSBM", type: "TROPHY" },
      select: { name: true },
    });
    const trophyNames = trophies.map(t => t.name);

    // MEDIA 360 TROPHY do fighter
    const media360 = await db.collectible.findMany({
      where: { fighterId: f.id, smashGameVersion: "SSBM", type: "MEDIA", name: { contains: "360 TROPHY", mode: "insensitive" } },
      select: { name: true, assetRenderUrl: true },
    });
    const mediaNames = media360.map(m => m.name);

    // Para cada troféu, verifica se existe o 360 TROPHY correspondente
    const missingFor: string[] = [];
    for (const tName of trophyNames) {
      const expected360 = `360 TROPHY - ${tName}`;
      if (!mediaNames.some(m => m.toLowerCase() === expected360.toLowerCase())) {
        missingFor.push(expected360);
      }
    }

    if (missingFor.length === 0) {
      ok.push(`${f.name} (${mediaNames.length}/${trophyNames.length} 360s)`);
    } else {
      missing.push({ fighter: f.name, missing: missingFor });
    }
  }

  console.log("=== ✅ COMPLETOS ===");
  for (const f of ok) console.log(` - ${f}`);

  console.log(`\n=== ❌ FALTANDO 360 TROPHY (${missing.length} fighters) ===`);
  for (const m of missing) {
    console.log(` - ${m.fighter}:`);
    for (const item of m.missing) console.log(`     ✗ "${item}"`);
  }

  await db.$disconnect();
}
main();
