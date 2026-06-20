/**
 * import-timestamps-from-csv.ts
 * Importa timestamps de um CSV (baixado do Google Sheets) para o banco.
 *
 * Matching (em ordem de prioridade):
 *   1. Coluna "id" (Prisma ID) — mais rápido, do export-timestamps-csv.ts
 *   2. Coluna "Game Order" / "Posição" — posicaoTrofeu* do jogo
 *
 * Formatos de tempo aceitos nas colunas de timestamp:
 *   - Segundos puros: 4303
 *   - MM:SS: 1:11:43  ou  71:43
 *   - HH:MM:SS: 1:11:43
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/import-timestamps-from-csv.ts <arquivo.csv> <tipo>
 *
 * Tipos:
 *   melee          → Collectible SSBM  (posicaoTrofeuMelee)
 *   melee-fighters → FighterBio SSBM
 *   brawl          → Collectible SSBB  (posicaoTrofeuBrawl)
 *   wiiu           → Collectible SSB4_WIIU + SSB4  (posicaoTrofeuSsb4)
 *   3ds            → Collectible SSB4_3DS  (posicaoTrofeuSsb4)
 */

import { db } from '../../lib/db';
import fs from 'fs';

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]!);
  return lines.slice(1)
    .filter(l => l.trim())
    .map(line => {
      const values = parseCsvLine(line);
      return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] ?? '').trim()]));
    });
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current); current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── Time parsers ──────────────────────────────────────────────────────────────

/** Aceita segundos puros (4303), MM:SS (71:43) ou HH:MM:SS (1:11:43) */
function parseTime(s: string): number | null {
  s = s.trim().replace(/[""]/g, '');
  if (!s || s === '-' || s === '—' || s === '') return null;
  // Segundos puros
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  // HH:MM:SS ou MM:SS
  const parts = s.split(':').map(p => parseInt(p.trim(), 10));
  if (parts.some(p => isNaN(p))) return null;
  if (parts.length === 2) return parts[0]! * 60 + parts[1]!;
  if (parts.length === 3) return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  return null;
}

// ── DB lookup by position ─────────────────────────────────────────────────────

type Tipo = 'melee' | 'melee-fighters' | 'brawl' | 'wiiu' | '3ds';

async function findByPosition(tipo: Tipo, pos: number): Promise<string | null> {
  let record: { id: string } | null = null;
  if (tipo === 'melee') {
    record = await (db.collectible.findFirst as any)({
      where: { type: 'TROPHY', smashGameVersion: 'SSBM', posicaoTrofeuMelee: pos },
      select: { id: true },
    });
  } else if (tipo === 'brawl') {
    record = await (db.collectible.findFirst as any)({
      where: { type: 'TROPHY', smashGameVersion: 'SSBB', posicaoTrofeuBrawl: pos },
      select: { id: true },
    });
  } else if (tipo === 'wiiu') {
    record = await (db.collectible.findFirst as any)({
      where: { type: 'TROPHY', smashGameVersion: { in: ['SSB4_WIIU', 'SSB4'] }, posicaoTrofeuSsb4: pos },
      select: { id: true },
    });
  } else if (tipo === '3ds') {
    record = await (db.collectible.findFirst as any)({
      where: { type: 'TROPHY', smashGameVersion: 'SSB4_3DS', posicaoTrofeuSsb4: pos },
      select: { id: true },
    });
  }
  return record?.id ?? null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const [,, csvFile, tipo] = process.argv;

  if (!csvFile || !tipo) {
    console.error('Uso: npx tsx --env-file=.env.local scripts/admin/import-timestamps-from-csv.ts <arquivo.csv> <melee|melee-fighters|brawl|wiiu|3ds>');
    process.exit(1);
  }
  if (!fs.existsSync(csvFile)) {
    console.error(`Arquivo não encontrado: ${csvFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(csvFile, 'utf-8');
  const rows    = parseCsv(content);
  console.log(`\n📄 ${csvFile} — ${rows.length} linhas lidas`);

  // Detectar colunas (aceita nomes em português, inglês e variações do Sheets)
  const keys     = Object.keys(rows[0] ?? {});
  const idKey    = keys.find(k => /^id$/i.test(k));
  const posKey   = keys.find(k => /game.?order|posição|posicao|position|order.?#|ordem/i.test(k));
  const nameKey  = keys.find(k => /^nome$|^name$/i.test(k)) ?? 'Nome';
  // Ignora colunas com URLs (ex: "Timestamp Fim 360 - https://...")
  const noUrl    = (k: string) => !/https?:\/\//i.test(k);
  const startKey = keys.filter(noUrl).find(k => /começo|comeco|início|inicio|start/i.test(k));
  const endKey   = keys.filter(noUrl).find(k => /\bfim\b|\bend\b/i.test(k));

  console.log(`   id="${idKey ?? '—'}" | pos="${posKey ?? '—'}" | start="${startKey ?? '—'}" | end="${endKey ?? '—'}"`);

  if (!startKey || !endKey) {
    console.error('\n❌ Colunas de timestamp não encontradas. Colunas disponíveis:', keys.join(', '));
    process.exit(1);
  }
  if (!idKey && !posKey) {
    console.error('\n❌ Nem coluna de id nem de posição encontrada. Colunas disponíveis:', keys.join(', '));
    process.exit(1);
  }

  let updated = 0, skipped = 0, noTs = 0;

  for (const row of rows) {
    const name  = (row[nameKey] ?? '').trim();
    const start = parseTime(row[startKey] ?? '');
    const end   = parseTime(row[endKey]   ?? '');

    if (start == null && end == null) { noTs++; continue; }

    // Resolver ID do registro
    let recordId: string | null = null;

    if (idKey && row[idKey]?.trim()) {
      recordId = row[idKey]!.trim();
    } else if (posKey && row[posKey]?.trim()) {
      const pos = parseInt(row[posKey]!.trim(), 10);
      if (!isNaN(pos)) {
        recordId = await findByPosition(tipo as Tipo, pos);
        if (!recordId) {
          console.warn(`  [SKIP] posição ${pos} não encontrada no banco (${name})`);
          skipped++; continue;
        }
      }
    }

    if (!recordId) {
      console.warn(`  [SKIP] sem id/posição: ${name}`);
      skipped++; continue;
    }

    try {
      if (tipo === 'melee-fighters') {
        await db.fighterBio.update({ where: { id: recordId }, data: { videoStartSec: start, videoEndSec: end } });
      } else {
        await db.collectible.update({ where: { id: recordId }, data: { videoStartSec: start, videoEndSec: end } });
      }
      console.log(`  ✓ ${name || recordId} → ${start}s–${end}s`);
      updated++;
    } catch (e: any) {
      console.warn(`  [ERR] ${name} (${recordId}): ${e.message}`);
      skipped++;
    }
  }

  console.log(`\n═══ Resultado ═══`);
  console.log(`  Atualizados: ${updated}`);
  console.log(`  Sem timestamp (ignorados): ${noTs}`);
  console.log(`  Erros/skip: ${skipped}`);
}

main().catch(console.error).finally(() => db.$disconnect());
