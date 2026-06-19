/**
 * auto-timestamp-v2.ts
 * Re-roda OCR nos frames já extraídos com matching muito mais robusto.
 * Usa: npx tsx --env-file=.env.local scripts/admin/auto-timestamp-v2.ts <jogo>
 * Jogos: melee | brawl | wiiu | 3ds
 *
 * Melhorias vs v1:
 *  - Matching por tokens de palavras (captura nomes compostos como "Ice Climbers")
 *  - Levenshtein dinâmico: tolerância cresce com tamanho do nome
 *  - Score contínuo em vez de threshold binário
 *  - Escrita direta no banco (sem JSON intermediário)
 *  - Exclui SSB4 compartilhados do 3DS (não sobrescreve timestamps do Wii U)
 */

import { db } from '../../lib/db';
import fs from 'fs';
import path from 'path';
import { createWorker, createScheduler } from 'tesseract.js';

// ── Config por jogo ────────────────────────────────────────────────────────────
type GameKey = 'melee' | 'brawl' | 'wiiu' | '3ds';

interface GameConfig {
  framesDir:  string;
  dbVersions: string[];        // versões a carregar do banco
  skipVersions?: string[];     // versões a NÃO atualizar (ex: SSB4 shared p/ 3DS)
  posCol:     string;
  label:      string;
  videoSrc:   string;          // para log
}

const CONFIGS: Record<GameKey, GameConfig> = {
  melee: {
    framesDir:  'temp_melee_frames',
    dbVersions: ['SSBM'],
    posCol:     'posicaoTrofeuMelee',
    label:      'Melee',
    videoSrc:   'full_video_trophies.mp4',
  },
  brawl: {
    framesDir:  'temp_brawl_frames',
    dbVersions: ['SSBB'],
    posCol:     'posicaoTrofeuBrawl',
    label:      'Brawl',
    videoSrc:   'full_video_brawl.mp4',
  },
  wiiu: {
    framesDir:  'temp_ssb4_wiiu_frames',
    dbVersions: ['SSB4_WIIU', 'SSB4'],   // SSB4 compartilhado fica com timestamp Wii U
    posCol:     'posicaoTrofeuSsb4',
    label:      'Wii U',
    videoSrc:   'full_video_ssb4_wiiu.mp4',
  },
  '3ds': {
    framesDir:  'temp_ssb4_3ds_frames',
    dbVersions: ['SSB4_3DS'],             // NÃO inclui SSB4 shared — evita sobrescrever Wii U
    posCol:     'posicaoTrofeuSsb4',
    label:      '3DS',
    videoSrc:   'full_video_ssb4_3ds.mp4',
  },
};

// ── Helpers de texto ──────────────────────────────────────────────────────────
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(' ').filter(w => w.length >= 2);
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j-1], dp[i][j-1], dp[i-1][j]);
  return dp[m][n];
}

/**
 * matchScore — retorna 0–1. Aceita acima de THRESHOLD.
 * Estratégias (em ordem decrescente de confiança):
 *  1. Normalização exata
 *  2. Substring (OCR contém nome ou vice-versa)
 *  3. Cobertura de tokens: % dos tokens do nome encontrados no OCR (com Lev ≤1 por token)
 *  4. Levenshtein whole-string com tolerância dinâmica (para nomes curtos)
 */
function matchScore(ocrRaw: string, trophyName: string): number {
  const ocrNorm   = normalize(ocrRaw);
  const nameNorm  = normalize(trophyName);

  if (ocrNorm.length < 2 || nameNorm.length < 2) return 0;

  // 1. Exact
  if (ocrNorm === nameNorm) return 1.0;

  // 2. Substring
  if (ocrNorm.includes(nameNorm) && nameNorm.length >= 3) return 0.95;
  if (nameNorm.includes(ocrNorm) && ocrNorm.length >= 3)  return 0.88;

  // 3. Token overlap (core improvement)
  const ocrTokens  = tokenize(ocrRaw);
  const nameTokens = tokenize(trophyName).filter(t => t.length >= 2);

  if (nameTokens.length > 0 && ocrTokens.length > 0) {
    let matched = 0;
    for (const nt of nameTokens) {
      for (const ot of ocrTokens) {
        if (nt === ot) { matched++; break; }
        // Levenshtein ≤1 for tokens ≥4 chars
        if (nt.length >= 4 && levenshtein(nt, ot) <= 1) { matched++; break; }
        // Levenshtein ≤2 for tokens ≥7 chars
        if (nt.length >= 7 && levenshtein(nt, ot) <= 2) { matched++; break; }
      }
    }
    const coverage = matched / nameTokens.length;
    // Require at least 1 match AND ≥70% token coverage
    if (matched >= 1 && coverage >= 0.70) {
      return 0.70 + coverage * 0.20;  // 0.70–0.90 range
    }
    // Single important token (≥5 chars) found → weaker signal
    if (matched >= 1 && nameTokens.some(t => t.length >= 5)) {
      const longestFound = nameTokens.filter(t => t.length >= 5).some(nt =>
        ocrTokens.some(ot => nt === ot || (nt.length >= 5 && levenshtein(nt, ot) <= 1))
      );
      if (longestFound) return 0.62;
    }
  }

  // 4. Whole-string Levenshtein (only for short names ≤12 chars)
  if (nameNorm.length <= 12) {
    const dist = levenshtein(ocrNorm, nameNorm);
    const tol  = Math.max(2, Math.floor(nameNorm.length * 0.30));
    if (dist <= tol) return Math.max(0, 0.68 - dist * 0.08);
  }

  return 0;
}

const MATCH_THRESHOLD = 0.61;

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const gameKey = (process.argv[2] ?? '') as GameKey;
  if (!CONFIGS[gameKey]) {
    console.error(`Uso: npx tsx --env-file=.env.local scripts/admin/auto-timestamp-v2.ts <melee|brawl|wiiu|3ds>`);
    process.exit(1);
  }

  const cfg = CONFIGS[gameKey];
  console.log(`\n═══ OCR v2 — ${cfg.label} ═══`);

  // 1. Carregar troféus do banco
  console.log(`\n1. Carregando troféus [${cfg.dbVersions.join(', ')}] do banco...`);
  const rawTrophies = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: { in: cfg.dbVersions } },
    select: { id: true, name: true, [cfg.posCol]: true },
    orderBy: { [cfg.posCol]: 'asc' },
  });
  console.log(`   ${rawTrophies.length} troféus carregados.`);

  // Pré-computar tokens p/ performance
  const trophyList = rawTrophies.map(t => ({
    id:       t.id,
    name:     t.name as string,
    posicao:  (t as any)[cfg.posCol] as number | null,
    normName: normalize(t.name as string),
    tokens:   tokenize(t.name as string),
  }));

  // 2. Verificar frames
  const framesDir = path.join(process.cwd(), cfg.framesDir);
  if (!fs.existsSync(framesDir)) {
    console.error(`ERRO: Pasta de frames não encontrada: ${framesDir}`);
    process.exit(1);
  }
  const frames = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).sort();
  console.log(`\n2. ${frames.length} frames encontrados em ${cfg.framesDir}`);

  // 3. Tesseract scheduler (4 workers)
  // Se rodar em paralelo com outros jogos, usar menos workers para não saturar CPU.
  // PARALLEL=1 → 2 workers; padrão → 4 workers
  const workerCount = process.env.PARALLEL === '1' ? 2 : 4;
  console.log(`\n3. Iniciando OCR com ${workerCount} workers Tesseract...`);
  const scheduler = createScheduler();
  for (let i = 0; i < workerCount; i++) {
    const w = await createWorker('eng', 1, {
      // Configurações Tesseract para melhor performance em texto de videogame
      langPath: process.cwd(),
    });
    scheduler.addWorker(w);
  }

  // 4. Processar frames
  let activeTrophy: typeof trophyList[0] | null = null;
  let activeStart: number | null = null;
  let written = 0;
  let noMatch = 0;

  for (let i = 0; i < frames.length; i++) {
    const frameFile = frames[i];
    const second    = parseInt(frameFile.replace('frame_', '').replace('.jpg', ''), 10);
    const framePath = path.join(framesDir, frameFile);

    try {
      const { data: { text } } = await scheduler.addJob('recognize', framePath) as any;

      if (i % 100 === 0) {
        const pct = ((i / frames.length) * 100).toFixed(1);
        console.log(`   [${pct}%] ${second}s — matches: ${written}`);
      }

      if (!text || normalize(text).length < 2) { noMatch++; continue; }

      // Encontrar melhor match
      let bestTrophy: typeof trophyList[0] | null = null;
      let bestScore = 0;

      for (const t of trophyList) {
        const score = matchScore(text, t.name);
        if (score > bestScore) {
          bestScore  = score;
          bestTrophy = t;
        }
      }

      if (!bestTrophy || bestScore < MATCH_THRESHOLD) { noMatch++; continue; }

      // Transição detectada?
      if (!activeTrophy || activeTrophy.id !== bestTrophy.id) {
        // Gravar troféu anterior
        if (activeTrophy && activeStart !== null) {
          const endSec = Math.max(activeStart + 1, second - 1);
          await db.collectible.update({
            where: { id: activeTrophy.id },
            data:  { videoStartSec: activeStart, videoEndSec: endSec },
          });
          written++;
          if (written % 20 === 0) {
            console.log(`   ✔ ${written} gravados — último: [${activeTrophy.name}] ${activeStart}s→${endSec}s`);
          }
        }
        activeTrophy = bestTrophy;
        activeStart  = second;
      }
    } catch { noMatch++; }
  }

  // Gravar último troféu ativo
  if (activeTrophy && activeStart !== null) {
    await db.collectible.update({
      where: { id: activeTrophy.id },
      data:  { videoStartSec: activeStart, videoEndSec: frames.length },
    });
    written++;
  }

  await scheduler.terminate();

  // 5. Relatório final
  const withTs = await db.collectible.count({
    where: { type: 'TROPHY', smashGameVersion: { in: cfg.dbVersions }, videoStartSec: { not: null } },
  });
  const total = await db.collectible.count({
    where: { type: 'TROPHY', smashGameVersion: { in: cfg.dbVersions } },
  });

  console.log(`\n═══ Resultado ${cfg.label} ═══`);
  console.log(`  Escritas nesta execução: ${written}`);
  console.log(`  Com timestamp no banco:  ${withTs} / ${total}`);
  console.log(`  Sem OCR legível:         ${noMatch} frames`);
}

run().catch(console.error).finally(() => db.$disconnect());
