import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function run() {
  const m = await db.fighter.findFirst({ where: { name: 'Donkey Kong' }});
  if (m) {
    await db.fighterTip.deleteMany({ where: { fighterId: m.id } });
    console.log("Deleted all tips for Donkey Kong");
  }
}
run().finally(() => db.$disconnect());
