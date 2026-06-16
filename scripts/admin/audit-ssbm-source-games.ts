import { db } from "../../lib/db";

async function main() {
  const trophies = await db.collectible.findMany({
    where: { smashGameVersion: "SSBM", type: "TROPHY", chronicleLinks: { none: {} } },
    select: { name: true, sourceGame: true },
    orderBy: { posicaoTrofeuMelee: "asc" },
  });

  // Show all distinct sourceGame values
  const distinct = [...new Set(trophies.map(t => t.sourceGame ?? "null"))].sort();
  console.log(`=== DISTINCT sourceGame values (${distinct.length}) ===`);
  distinct.forEach(s => console.log(`  ${JSON.stringify(s)}`));

  console.log(`\n=== Total unlinked: ${trophies.length} ===`);
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
