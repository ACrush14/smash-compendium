import { db } from '../../lib/db';

const GAMES = [
  { versions: ['SSBM'],                posCol: 'posicaoTrofeuMelee', label: 'Melee',  total: 293 },
  { versions: ['SSBB'],                posCol: 'posicaoTrofeuBrawl', label: 'Brawl',  total: 544 },
  { versions: ['SSB4_WIIU', 'SSB4'],   posCol: 'posicaoTrofeuSsb4', label: 'Wii U',  total: 743 },
  { versions: ['SSB4_3DS'],            posCol: 'posicaoTrofeuSsb4', label: '3DS',     total: 707 },
] as const;

async function main() {
  const game = process.argv[2];
  const cfg = GAMES.find(g => g.label.toLowerCase() === game?.toLowerCase())
           ?? GAMES.find(g => g.label.toLowerCase().includes(game?.toLowerCase() ?? ''));

  const targets = cfg ? [cfg] : GAMES;

  for (const { versions, posCol, label, total } of targets) {
    const withTs = await db.collectible.count({
      where: { type: 'TROPHY', smashGameVersion: { in: [...versions] }, videoStartSec: { not: null } },
    });
    const missing = await db.collectible.findMany({
      where: { type: 'TROPHY', smashGameVersion: { in: [...versions] }, videoStartSec: null },
      select: { name: true, [posCol]: true },
      orderBy: { [posCol]: 'asc' },
    });

    console.log(`\n[${label}] ${withTs}/${total} com timestamp | ${missing.length} sem:`);
    missing.forEach(t => {
      const pos = (t as any)[posCol];
      console.log(`  #${String(pos ?? '?').padStart(3)} ${t.name}`);
    });
  }
}

main().catch(console.error).finally(() => db.$disconnect());
