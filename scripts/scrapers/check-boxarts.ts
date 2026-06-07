import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
  const total = await db.chronicleEntry.count();
  const withArt = await db.chronicleEntry.count({ where: { boxArtUrl: { not: null } } });
  console.log('ChronicleEntry total:', total, '| com boxArt:', withArt, '| sem:', total - withArt);
  const noArt = await db.chronicleEntry.findMany({ where: { boxArtUrl: null }, take: 5, select: { titleNtsc: true, consoleName: true, wikiUrl: true } });
  console.log('Sem arte (sample):', JSON.stringify(noArt, null, 2));
  const games = await db.game.findMany({ select: { titleEn: true, platform: true, boxArtUrl: true } });
  console.log('\nGames in DB:', games.length);
  games.forEach((g: any) => console.log('  ', g.platform, g.titleEn, '->', g.boxArtUrl ? 'HAS ART' : 'NO ART'));
}
main().catch(console.error).finally(() => db.$disconnect());
