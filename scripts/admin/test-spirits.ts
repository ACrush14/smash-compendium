import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const spirits = await db.collectible.findMany({
    where: { type: "SPIRIT", posicaoSpiritSsbu: { gte: 1115 } },
    orderBy: { posicaoSpiritSsbu: "asc" }
  });

  console.log(`Found ${spirits.length} spirits >= 1115`);
  for (const s of spirits.slice(0, 10)) {
    console.log(`${s.posicaoSpiritSsbu}: ${s.name} - sourceGame: ${s.sourceGame} - Artwork: ${s.spiritArtworkSource} - DescEn: ${s.descriptionEn}`);
  }
}

main().catch(console.error).finally(() => db.$disconnect());
