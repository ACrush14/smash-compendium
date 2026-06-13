import { db } from "../../lib/db";

async function main() {
  const total = await db.collectible.count({ where: { type: "SPIRIT" } });
  const withImg = await db.collectible.count({ where: { type: "SPIRIT", assetRenderUrl: { not: null } } });
  const withNum = await db.collectible.count({ where: { type: "SPIRIT", posicaoSpiritSsbu: { not: null } } });

  console.log(`Total spirits: ${total}`);
  console.log(`With assetRenderUrl: ${withImg}`);
  console.log(`With posicaoSpiritSsbu: ${withNum}`);

  const samples = await db.collectible.findMany({
    where: { type: "SPIRIT", posicaoSpiritSsbu: { not: null } },
    select: { id: true, name: true, posicaoSpiritSsbu: true, assetRenderUrl: true },
    orderBy: { posicaoSpiritSsbu: "asc" },
    take: 5,
  });
  console.log("\nSamples:");
  samples.forEach(s => console.log(`  #${s.posicaoSpiritSsbu} "${s.name}" | ${(s.assetRenderUrl ?? "").substring(0, 70)}`));
}
main().catch(console.error);
