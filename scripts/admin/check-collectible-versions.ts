import { db } from "../../lib/db";

async function main() {
  const groups = await db.collectible.groupBy({
    by: ["smashGameVersion", "type"],
    _count: true,
    orderBy: { smashGameVersion: "asc" },
  });
  console.log("smashGameVersion       type           count");
  console.log("──────────────────────────────────────────");
  groups.forEach(g => console.log(g.smashGameVersion.padEnd(22), g.type.padEnd(15), g._count));

  // Also check a few Melee-era trophy samples
  const sample = await db.collectible.findMany({
    where: { type: "TROPHY" },
    select: { name: true, smashGameVersion: true, posicaoTrofeuMelee: true, sourceGame: true },
    orderBy: { posicaoTrofeuMelee: "asc" },
    take: 10,
  });
  console.log("\n=== Sample TROPHY (sorted by posicaoTrofeuMelee) ===");
  sample.forEach(t => console.log(`  [pos=${String(t.posicaoTrofeuMelee ?? "null").padEnd(4)}] ${t.smashGameVersion.padEnd(10)} ${t.name.padEnd(30)} src:${t.sourceGame ?? "null"}`));

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
