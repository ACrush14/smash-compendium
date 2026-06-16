import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function run() {
  const m = await db.fighter.findFirst({ where: { name: 'Mario' }});
  if (m) {
    await db.fighterTip.deleteMany({ where: { fighterId: m.id } });
    console.log("Deleted all tips for Mario");
  }
}
run().finally(() => db.$disconnect());
