import { db } from "../lib/db";
async function main() {
  const roys = await db.collectible.findMany({
    where: { name: "Roy", type: "TROPHY" },
    select: { id: true, name: true, smashGameVersion: true, fighterId: true, posicaoTrofeuSsb4: true, videoStartSec: true, videoEndSec: true, descriptionEn: true },
  });
  roys.forEach(r => console.log(r));
  const feRoy = await db.fighter.findFirst({ where: { name: "Roy" }, select: { id: true } });
  console.log("FE Roy fighter id:", feRoy?.id);
  await db.$disconnect();
}
main().catch(console.error);
