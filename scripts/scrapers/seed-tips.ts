import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(process.cwd(), "data", "fighter_tips.json");
  const dataRaw = await fs.readFile(jsonPath, "utf-8");
  const data = JSON.parse(dataRaw);

  for (const entry of data) {
    const fighterName = entry.fighter;
    const tips = entry.tips;

    console.log(`Processing tips for: ${fighterName}`);

    const fighter = await prisma.fighter.findUnique({
      where: { name: fighterName },
    });

    if (!fighter) {
      console.error(`❌ Fighter not found: ${fighterName}`);
      continue;
    }

    let created = 0;
    for (const tip of tips) {
      // Evita duplicação exata do título e do fighter
      const existing = await prisma.fighterTip.findFirst({
        where: {
          fighterId: fighter.id,
          titleEn: tip.titleEn,
        },
      });

      if (!existing) {
        await prisma.fighterTip.create({
          data: {
            fighterId: fighter.id,
            titleEn: tip.titleEn,
            textEn: tip.textEn,
            titlePt: tip.titlePt,
            textPt: tip.textPt,
            titleJp: tip.titleJp,
            textJp: tip.textJp,
          },
        });
        created++;
      }
    }

    console.log(`✅ Created ${created} new tips for ${fighterName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
