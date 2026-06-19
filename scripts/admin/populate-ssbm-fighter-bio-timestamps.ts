/**
 * populate-ssbm-fighter-bio-timestamps.ts
 *
 * Copia videoStartSec/videoEndSec das Collectibles SSBM para os FighterBios SSBM.
 * A lógica: cada lutador tem um troféu com o mesmo nome (ou nome próximo) no Melee.
 * O Trophy Compendium (full_video.mp4) já tem timestamps para esses troféus.
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/populate-ssbm-fighter-bio-timestamps.ts
 */

import { db } from '../../lib/db';

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j-1], dp[i][j-1], dp[i-1][j]);
  return dp[m][n];
}

async function main() {
  // 1. Carrega todos os trofeus SSBM com timestamp
  const trophies = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: 'SSBM', videoStartSec: { not: null } },
    select: { id: true, name: true, videoStartSec: true, videoEndSec: true },
  });
  console.log(`Trofeus SSBM com timestamp: ${trophies.length}`);

  // 2. Carrega todos os FighterBios SSBM
  const bios = await db.fighterBio.findMany({
    where: { smashGameVersion: 'SSBM' },
    select: { id: true, fighter: { select: { name: true } } },
  });
  console.log(`FighterBios SSBM: ${bios.length}`);

  let updated = 0;
  let skipped = 0;

  for (const bio of bios) {
    const fighterName = bio.fighter?.name ?? '';
    const normFighter = normalize(fighterName);

    // Tenta match exato primeiro, depois fuzzy
    let best = trophies.find(t => normalize(t.name) === normFighter);

    if (!best) {
      // Fuzzy: menor distância de Levenshtein entre nome do lutador e nome do troféu
      let bestDist = Infinity;
      for (const t of trophies) {
        const dist = levenshtein(normFighter, normalize(t.name));
        if (dist < bestDist) { bestDist = dist; best = t; }
      }
      // Rejeita se distância muito alta
      if (bestDist > Math.max(3, Math.floor(normFighter.length * 0.35))) {
        console.log(`  [SKIP]   ${fighterName} — sem match (melhor dist: ${bestDist})`);
        skipped++;
        continue;
      }
    }

    if (!best) { skipped++; continue; }

    await db.fighterBio.update({
      where: { id: bio.id },
      data: { videoStartSec: best.videoStartSec, videoEndSec: best.videoEndSec },
    });
    console.log(`  [OK]     ${fighterName} → "${best.name}" @ ${best.videoStartSec}s–${best.videoEndSec}s`);
    updated++;
  }

  console.log(`\n✅ ${updated} FighterBios atualizados | ${skipped} ignorados`);
}

main().catch(console.error).finally(() => db.$disconnect());
