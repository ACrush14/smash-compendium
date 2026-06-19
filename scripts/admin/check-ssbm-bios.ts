import { db } from '../../lib/db';
async function main() {
  const bios = await db.fighterBio.findMany({
    where: { smashGameVersion: 'SSBM' },
    select: { id: true, videoStartSec: true, videoEndSec: true, fighter: { select: { name: true } } },
    orderBy: { fighter: { name: 'asc' } },
  });
  console.log('FighterBio SSBM total:', bios.length);
  bios.forEach(b => console.log(`  ${b.fighter.name}: ${b.videoStartSec} → ${b.videoEndSec}`));
}
main().catch(console.error).finally(() => db.$disconnect());
