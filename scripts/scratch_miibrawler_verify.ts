import { db } from "../lib/db";
async function main() {
  const f = await db.fighter.findFirst({
    where: { name: "Mii Brawler" },
    select: {
      curationStatus: true, curatorOverviewEn: true,
      tips: { select: { titleEn: true, titleJp: true } },
    },
  });
  console.log(`status=${f?.curationStatus} curator=${!!f?.curatorOverviewEn}`);
  console.log(`tips jp set: ${f?.tips.filter(t => t.titleJp).length}/${f?.tips.length}`);
  const trophies = await db.collectible.findMany({ where: { name: { in: ["Mii Brawler", "Mii Brawler (Alt.)"] }, type: "TROPHY", smashGameVersion: "SSB4" }, select: { name: true, fighterId: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true } });
  trophies.forEach(t => console.log(t));
  await db.$disconnect();
}
main().catch(console.error);
