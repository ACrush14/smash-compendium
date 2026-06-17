import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function run() {
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Darumeshi Sports Shop' }, data: { consoleName: 'Nintendo 3DS' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Famicom Detective Club Part II: The Girl Who Stands Behind' }, data: { consoleName: 'Famicom Disk System' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Game Boy Wars Advance 1+2' }, data: { consoleName: 'Game Boy Advance' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Jikkyō Powerful Pro Yakyū \'94' }, data: { consoleName: 'Super Nintendo Entertainment System' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Jikkyō Powerful Pro Yakyū 2013' }, data: { consoleName: 'PlayStation 3' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Jikkyō Powerful Pro Yakyū 4' }, data: { consoleName: 'Nintendo 64' } });

  // Other known ones
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Jikkyō Powerful Pro Yakyū 7' }, data: { consoleName: 'PlayStation 2' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Jikkyō Powerful Pro Yakyū Heroes' }, data: { consoleName: 'Nintendo 3DS' } });

  console.log('Fixed from screenshot');
}

run().finally(() => db.$disconnect());
