/**
 * fill-timestamp-gaps.ts
 * Preenche trofeus sem timestamp usando dois métodos:
 *
 *  1. SMASH variants  — "Name SMASH" e "Name SMASH (2)" ficam logo após o
 *     troféu base do mesmo lutador (startSec do base + avgDuration × offset)
 *
 *  2. Gaps de timeline — demais trofeus sem ts são distribuídos proporcionalmente
 *     nos buracos de tempo entre dois trofeus capturados consecutivos.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/fill-timestamp-gaps.ts [melee|brawl|wiiu|3ds]
 *   (sem argumento = roda todos)
 */

import { db } from '../../lib/db';

const GAMES = [
  { key: 'melee', versions: ['SSBM']               as string[], posCol: 'posicaoTrofeuMelee', label: 'Melee', total: 293 },
  { key: 'brawl', versions: ['SSBB']               as string[], posCol: 'posicaoTrofeuBrawl', label: 'Brawl', total: 544 },
  { key: 'wiiu',  versions: ['SSB4_WIIU', 'SSB4']  as string[], posCol: 'posicaoTrofeuSsb4',  label: 'Wii U', total: 743 },
  { key: '3ds',   versions: ['SSB4_3DS']            as string[], posCol: 'posicaoTrofeuSsb4',  label: '3DS',   total: 707 },
];

function extractFighterBase(name: string): string | null {
  // "Mario SMASH"     → "mario"
  // "Mario SMASH (2)" → "mario"
  // "Capt. Falcon SMASH (2)" → "capt  falcon"
  const m = name.match(/^(.+?)\s+SMASH(\s+\(\d+\))?$/i);
  return m ? m[1].toLowerCase().trim() : null;
}

async function fillGame(cfg: typeof GAMES[0]) {
  console.log(`\n══ ${cfg.label} ══`);

  // Carregar todos os trofeus do jogo
  const all = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: { in: cfg.versions } },
    select: { id: true, name: true, videoStartSec: true, videoEndSec: true, [cfg.posCol]: true },
    orderBy: { [cfg.posCol]: 'asc' },
  });

  const withTs    = all.filter(t => t.videoStartSec != null);
  const withoutTs = all.filter(t => t.videoStartSec == null);

  if (withoutTs.length === 0) { console.log('  Nenhum gap — 100% coberto!'); return 0; }

  // Duração média e mínima (ignora zeros)
  const durations = withTs
    .filter(t => (t.videoEndSec ?? 0) > (t.videoStartSec ?? 0))
    .map(t => t.videoEndSec! - t.videoStartSec!);
  const avgDur = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 15;

  console.log(`  Com ts: ${withTs.length} | Sem ts: ${withoutTs.length} | avgDur: ${avgDur}s`);

  // Ordenar âncoras por startSec
  const anchors = [...withTs]
    .filter(t => t.videoStartSec != null)
    .sort((a, b) => a.videoStartSec! - b.videoStartSec!);

  let filled = 0;

  // ── Método 1: SMASH variants ─────────────────────────────────────────────
  const smashMissing    = withoutTs.filter(t => extractFighterBase(t.name) !== null);
  const nonSmashMissing = withoutTs.filter(t => extractFighterBase(t.name) === null);

  // Mapa: nome base → lista de SMASH variants ordenada
  const smashGroups = new Map<string, typeof withoutTs>();
  for (const t of smashMissing) {
    const base = extractFighterBase(t.name)!;
    if (!smashGroups.has(base)) smashGroups.set(base, []);
    smashGroups.get(base)!.push(t);
  }

  for (const [base, variants] of smashGroups) {
    // Encontrar o troféu base mais próximo pelo nome
    const baseAnchor = anchors.find(a =>
      a.name.toLowerCase().trim() === base ||
      a.name.toLowerCase().replace(/\s*\(.*?\)/g, '').trim() === base
    );

    if (baseAnchor && baseAnchor.videoStartSec != null) {
      // Colocar variantes SMASH consecutivamente após o base
      // Ordena por "(2)", "(3)" para manter a sequência
      variants.sort((a, b) => {
        const na = parseInt(a.name.match(/\((\d+)\)/)?.[1] ?? '1');
        const nb = parseInt(b.name.match(/\((\d+)\)/)?.[1] ?? '1');
        return na - nb;
      });
      for (let i = 0; i < variants.length; i++) {
        const startSec = baseAnchor.videoStartSec + avgDur * (i + 1);
        const endSec   = startSec + avgDur;
        await db.collectible.update({
          where: { id: variants[i].id },
          data:  { videoStartSec: startSec, videoEndSec: endSec },
        });
        console.log(`  [SMASH] ${variants[i].name} → ${startSec}s–${endSec}s (base: ${baseAnchor.name} @ ${baseAnchor.videoStartSec}s)`);
        filled++;
      }
    } else {
      // Base não capturada — adiciona ao grupo de gaps genéricos
      nonSmashMissing.push(...variants);
    }
  }

  // ── Método 2: Gaps de timeline ────────────────────────────────────────────
  if (nonSmashMissing.length === 0) {
    console.log(`  Sem gaps genéricos.`);
  } else {
    // Construir lista de gaps entre âncoras consecutivas
    type Gap = { startSec: number; endSec: number; capacity: number };
    const gaps: Gap[] = [];

    for (let i = 0; i < anchors.length - 1; i++) {
      const prev      = anchors[i];
      const next      = anchors[i + 1];
      const gapStart  = (prev.videoEndSec ?? prev.videoStartSec!) + 1;
      const gapEnd    = next.videoStartSec! - 1;
      const gapSize   = gapEnd - gapStart;
      if (gapSize >= avgDur) {
        const capacity = Math.floor(gapSize / avgDur);
        gaps.push({ startSec: gapStart, endSec: gapEnd, capacity });
      }
    }

    // Últimos trofeus após a última âncora
    if (anchors.length > 0) {
      const lastEnd = anchors[anchors.length - 1].videoEndSec ?? anchors[anchors.length - 1].videoStartSec!;
      gaps.push({ startSec: lastEnd + 1, endSec: lastEnd + nonSmashMissing.length * avgDur + 1, capacity: nonSmashMissing.length });
    }

    // Distribuir trofeus sem ts pelos gaps proporcionalmente
    let queue = [...nonSmashMissing];
    for (const gap of gaps) {
      if (queue.length === 0) break;
      const toFill = Math.min(gap.capacity, queue.length);
      const slot   = Math.floor((gap.endSec - gap.startSec) / (toFill + 1));
      for (let j = 0; j < toFill; j++) {
        const t        = queue.shift()!;
        const startSec = gap.startSec + slot * (j + 1);
        const endSec   = startSec + avgDur;
        await db.collectible.update({
          where: { id: t.id },
          data:  { videoStartSec: startSec, videoEndSec: endSec },
        });
        console.log(`  [GAP]   ${t.name} → ${startSec}s–${endSec}s`);
        filled++;
      }
    }

    // Restantes sem gap disponível — empilha ao final do último anchor
    if (queue.length > 0) {
      const lastAnchor = anchors[anchors.length - 1];
      const base = lastAnchor?.videoEndSec ?? lastAnchor?.videoStartSec ?? 0;
      for (let i = 0; i < queue.length; i++) {
        const t        = queue[i];
        const startSec = base + avgDur * (i + 1);
        const endSec   = startSec + avgDur;
        await db.collectible.update({
          where: { id: t.id },
          data:  { videoStartSec: startSec, videoEndSec: endSec },
        });
        console.log(`  [END]   ${t.name} → ${startSec}s–${endSec}s`);
        filled++;
      }
    }
  }

  const finalWithTs = await db.collectible.count({
    where: { type: 'TROPHY', smashGameVersion: { in: cfg.versions }, videoStartSec: { not: null } },
  });
  console.log(`  ✅ ${filled} preenchidos | Total com ts: ${finalWithTs} / ${cfg.total}`);
  return filled;
}

async function main() {
  const arg  = process.argv[2]?.toLowerCase();
  const targets = arg
    ? GAMES.filter(g => g.key === arg || g.label.toLowerCase() === arg)
    : GAMES;

  if (targets.length === 0) {
    console.error('Jogo não encontrado. Use: melee | brawl | wiiu | 3ds');
    process.exit(1);
  }

  let total = 0;
  for (const g of targets) total += await fillGame(g);
  console.log(`\n═══ TOTAL preenchidos: ${total} ═══`);
}

main().catch(console.error).finally(() => db.$disconnect());
