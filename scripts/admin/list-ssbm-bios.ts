import { db } from '../../lib/db';
async function main() {
  const bios = await db.fighterBio.findMany({
    where: { smashGameVersion: 'SSBM' },
    select: { id: true, fighter: { select: { name: true } } },
    orderBy: { fighter: { name: 'asc' } },
  });
  console.log('Total SSBM bios:', bios.length);
  bios.forEach(b => console.log(' -', b.fighter?.name));
}
main().catch(console.error).finally(() => db.$disconnect());
