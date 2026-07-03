import { db } from "../lib/db";
async function main() {
  const f = await db.fighter.findFirst({
    where: { name: "Mii Gunner" },
    select: { curationStatus: true, curatorOverviewEn: true, tips: { select: { titleEn: true, titleJp: true } } },
  });
  console.log(`status=${f?.curationStatus} curator=${!!f?.curatorOverviewEn}`);
  console.log(`tips jp set: ${f?.tips.filter(t => t.titleJp).length}/${f?.tips.length}`);
  await db.$disconnect();
}
main().catch(console.error);
