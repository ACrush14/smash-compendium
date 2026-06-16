import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
  const dk = await db.fighter.findFirst({ where: { name: 'Donkey Kong' }, include: { tips: true } });
  if (dk) {
    console.log("DK Tips count:", dk.tips.length);
    if (dk.tips.length > 0) {
      console.log("DK First Tip titleJp:", dk.tips[0].titleJp);
      console.log("DK First Tip textJp:", dk.tips[0].textJp);
    }
  }

  const mario = await db.fighter.findFirst({ where: { name: 'Mario' }, include: { tips: true } });
  if (mario) {
    console.log("Mario Tips count:", mario.tips.length);
    if (mario.tips.length > 0) {
      console.log("Mario First Tip EN:", mario.tips[0].titleEn);
      console.log("Mario First Tip JP Title:", mario.tips[0].titleJp);
      console.log("Mario First Tip JP Text:", mario.tips[0].textJp);
    }
  }
}
main().finally(() => db.$disconnect());
