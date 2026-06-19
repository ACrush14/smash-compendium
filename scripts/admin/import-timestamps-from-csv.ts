/**
 * import-timestamps-from-csv.ts
 * Lê um CSV baixado do Google Sheets e atualiza os timestamps no banco.
 *
 * Formato esperado do CSV (colunas obrigatórias):
 *   id, Posição, Nome, Timestamp Início (s), Timestamp Fim (s), ...
 *   (gerado pelo export-timestamps-csv.ts — ou com as mesmas colunas)
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/import-timestamps-from-csv.ts <arquivo.csv> <tipo>
 *
 * Tipos:
 *   melee          → Collectible SSBM
 *   melee-fighters → FighterBio SSBM
 *   brawl          → Collectible SSBB
 *   wiiu           → Collectible SSB4_WIIU + SSB4
 *   3ds            → Collectible SSB4_3DS
 *
 * Exemplo:
 *   npx tsx --env-file=.env.local scripts/admin/import-timestamps-from-csv.ts timestamps-melee-trofeus.csv melee
 */

import { db } from '../../lib/db';
import fs from 'fs';

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]!);
  return lines.slice(1).map(line => {
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

function toIntOrNull(s: string): number | null {
  if (!s || s.trim() === '' || s.trim() === '-' || s.trim() === '—') return null;
  const n = parseInt(s.trim(), 10);
  return isNaN(n) ? null : n;
}

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

  const content  = fs.readFileSync(csvFile, 'utf-8');
  const rows     = parseCsv(content);
  console.log(`\n📄 ${csvFile} — ${rows.length} linhas lidas`);

  // Detectar nomes das colunas de timestamp (flexível: aceita variações de nome)
  const sample = rows[0] ?? {};
  const keys   = Object.keys(sample);
  const startKey = keys.find(k => /início|inicio|começo|comeco|start/i.test(k)) ?? 'Timestamp Início (s)';
  const endKey   = keys.find(k => /fim|end/i.test(k))                           ?? 'Timestamp Fim (s)';
  const idKey    = keys.find(k => /^id$/i.test(k))                              ?? 'id';
  const nameKey  = keys.find(k => /^nome$|^name$/i.test(k))                     ?? 'Nome';

  console.log(`   Colunas detectadas: id="${idKey}" | start="${startKey}" | end="${endKey}" | name="${nameKey}"`);

  let updated = 0, skipped = 0, noTs = 0;

  for (const row of rows) {
    const id    = row[idKey]?.trim();
    const start = toIntOrNull(row[startKey] ?? '');
    const end   = toIntOrNull(row[endKey]   ?? '');
    const name  = row[nameKey]?.trim() ?? '';

    if (start == null && end == null) { noTs++; continue; }

    if (!id) {
      console.warn(`  [SKIP] Sem id na linha: ${name}`);
      skipped++; continue;
    }

    try {
      if (tipo === 'melee-fighters') {
        await db.fighterBio.update({ where: { id }, data: { videoStartSec: start, videoEndSec: end } });
      } else {
        await db.collectible.update({ where: { id }, data: { videoStartSec: start, videoEndSec: end } });
      }
      console.log(`  ✓ ${name} → ${start}s–${end}s`);
      updated++;
    } catch (e: any) {
      console.warn(`  [ERR] ${name} (${id}): ${e.message}`);
      skipped++;
    }
  }

  console.log(`\n═══ Resultado ═══`);
  console.log(`  Atualizados: ${updated}`);
  console.log(`  Sem timestamp (ignorados): ${noTs}`);
  console.log(`  Erros/skip: ${skipped}`);
}

main().catch(console.error).finally(() => db.$disconnect());
