import { db } from '../../lib/db';
async function main() {
  const wiiu  = await db.collectible.count({ where: { type: 'TROPHY', smashGameVersion: { in: ['SSB4_WIIU', 'SSB4'] } } });
  const ds3   = await db.collectible.count({ where: { type: 'TROPHY', smashGameVersion: { in: ['SSB4_3DS', 'SSB4'] } } });
  const brawl = await db.collectible.count({ where: { type: 'TROPHY', smashGameVersion: 'SSBB' } });
  const melee = await db.collectible.count({ where: { type: 'TROPHY', smashGameVersion: 'SSBM' } });
  const withTs = await db.collectible.count({ where: { type: 'TROPHY', videoStartSec: { not: null } } });
  const wiuuWithTs = await db.collectible.count({ where: { type: 'TROPHY', smashGameVersion: { in: ['SSB4_WIIU', 'SSB4'] }, videoStartSec: { not: null } } });
  console.log('Wii U troféus total:', wiiu);
  console.log('3DS troféus total:', ds3);
  console.log('Brawl troféus total:', brawl);
  console.log('Melee troféus total:', melee);
  console.log('Com videoStartSec (todos tipos):', withTs);
  console.log('Wii U com videoStartSec:', wiuuWithTs);
}
main().catch(console.error).finally(() => db.$disconnect());
