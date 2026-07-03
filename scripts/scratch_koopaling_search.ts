import { db } from "../lib/db";
async function main() {
  const all = await db.collectible.findMany({
    where: { type: "TROPHY", smashGameVersion: "SSB4", posicaoTrofeuSsb4: { in: [64,65,66,67,68,69,70,71,72,73,74,75,76] } },
    select: { name: true, posicaoTrofeuSsb4: true, fighterId: true, descriptionEn: true },
    orderBy: { posicaoTrofeuSsb4: "asc" },
  });
  all.forEach(a => console.log(a.posicaoTrofeuSsb4, a.name, "fighterId:"+a.fighterId, "-", a.descriptionEn?.slice(0,60)));
  await db.$disconnect();
}
main().catch(console.error);
