import { db } from '../../lib/db';

const GAMES = [
  { versions: ['SSBM'],                label: 'Melee', total: 293 },
  { versions: ['SSBB'],                label: 'Brawl', total: 544 },
  { versions: ['SSB4_WIIU', 'SSB4'],   label: 'Wii U', total: 743 },
  { versions: ['SSB4_3DS'],            label: '3DS',   total: 707 },
];

async function main() {
  for (const { versions, label, total } of GAMES) {
    const withTs = await db.collectible.findMany({
      where: { type: 'TROPHY', smashGameVersion: { in: versions }, videoStartSec: { not: null } },
      select: { videoStartSec: true, videoEndSec: true },
      orderBy: { videoStartSec: 'asc' },
    });

    const withoutCount = await db.collectible.count({
      where: { type: 'TROPHY', smashGameVersion: { in: versions }, videoStartSec: null },
    });

    if (withTs.length === 0) {
      console.log(`${label}: 0 com timestamp, ${withoutCount} sem`);
      continue;
    }

    const durations = withTs
      .filter(t => t.videoEndSec != null && t.videoEndSec! > t.videoStartSec!)
      .map(t => t.videoEndSec! - t.videoStartSec!);
    const avgDur = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

    const lastEnd   = withTs[withTs.length - 1].videoEndSec ?? 0;
    const firstStart = withTs[0].videoStartSec ?? 0;

    const gap = total - withTs.length;

    console.log(`\n[${label}] — correto: ${total}`);
    console.log(`  Com timestamp: ${withTs.length} | Sem: ${withoutCount} | Gap vs. total real: ${gap}`);
    console.log(`  Duração média: ${avgDur.toFixed(1)}s | Vídeo: ${firstStart}s → ${lastEnd}s (~${(lastEnd/60).toFixed(1)} min)`);
    if (gap > 0) {
      console.log(`  ⚠️  ${gap} troféus sem timestamp (≈ ${(gap * avgDur / 60).toFixed(1)} min de vídeo a cobrir)`);
    } else {
      console.log(`  ✅ Cobertura completa!`);
    }
  }
}

main().catch(console.error).finally(() => db.$disconnect());
