import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function run() {
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Mario Golf: Super Rush' }, data: { consoleName: 'Nintendo Switch' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Monster Hunter Rise' }, data: { consoleName: 'Nintendo Switch' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Sakuna: Of Rice and Ruin' }, data: { consoleName: 'Nintendo Switch' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Super Bomberman R' }, data: { consoleName: 'Nintendo Switch' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Cuphead' }, data: { consoleName: 'PC' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Warframe' }, data: { consoleName: 'PC' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Persona 5 Strikers' }, data: { consoleName: 'Nintendo Switch' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Ghosts \'n Goblins Resurrection' }, data: { consoleName: 'Nintendo Switch' } });
  await db.chronicleEntry.updateMany({ where: { titleNtsc: 'Final Fantasy VII Remake' }, data: { consoleName: 'PlayStation 4' } }); // Remake is actually PS4 first
  await db.chronicleEntry.updateMany({ where: { titleNtsc: '13 Sentinels: Aegis Rim' }, data: { consoleName: 'PlayStation 4' } }); // Correct, was PS4 first

  console.log('Fixed');
}

run().finally(() => db.$disconnect());
