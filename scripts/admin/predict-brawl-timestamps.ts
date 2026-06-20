/**
 * predict-brawl-timestamps.ts
 * Lê a aba "SSBB Trophies" do Google Sheets, usa os timestamps manuais
 * como âncoras de calibração, interpola linearmente os vazios, e escreve
 * de volta nas colunas D (Começo) e E (Fim) em formato H:MM:SS.
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/predict-brawl-timestamps.ts
 */

import { google } from 'googleapis';
import { db } from '../../lib/db';

const SPREADSHEET_ID = '1JqkLjQuqXnzxWzWAh7WoJGgft-rjFB5ydulC6_SXRr8';
const SHEET          = 'SSBB Trophies';

// ── Helpers de tempo ─────────────────────────────────────────────────────────

function parseTime(s: string): number | null {
  s = s?.trim() ?? '';
  if (!s) return null;
  const parts = s.split(':').map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  if (parts.length === 2) return parts[0]! * 60  + parts[1]!;
  return null;
}

function fmtHMS(sec: number): string {
  sec = Math.round(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'google-service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // 1. Ler planilha inteira (colunas A–E)
  console.log('📖 Lendo planilha...');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET}'!A:E`,
  });
  const allRows = res.data.values ?? [];

  type Row = {
    rowIdx: number;   // linha na planilha (1-based, 2+ = dados)
    pos: number;      // Numero Trofeu = posicaoTrofeuBrawl
    name: string;
    manualStart: number | null;
    manualEnd: number | null;
    predStart: number | null;
    predEnd: number | null;
  };

  const rows: Row[] = allRows.slice(1).map((r, i) => ({
    rowIdx:      i + 2,
    pos:         parseInt(r[1] ?? '0') || 0,
    name:        (r[0] ?? '').trim(),
    manualStart: parseTime(r[3] ?? ''),
    manualEnd:   parseTime(r[4] ?? ''),
    predStart:   null,
    predEnd:     null,
  })).filter(r => r.pos > 0);

  console.log(`  ${rows.length} linhas carregadas`);

  // 2. Buscar timestamps do banco (OCR + fill-gaps) como fallback
  console.log('🗃  Lendo banco...');
  const dbRows = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: 'SSBB' },
    select: { posicaoTrofeuBrawl: true, videoStartSec: true, videoEndSec: true },
  });
  const dbByPos = new Map(dbRows.map(t => [t.posicaoTrofeuBrawl!, t]));
  console.log(`  ${dbByPos.size} troféus no banco`);

  // 3. Âncoras = linhas com timestamp manual preenchido
  const anchors = rows.filter(r => r.manualStart !== null).sort((a, b) => a.pos - b.pos);
  console.log(`⚓ Âncoras manuais: ${anchors.length}`);

  // 4. Duração média a partir das âncoras com start+end
  const durs = anchors.filter(r => r.manualEnd !== null).map(r => r.manualEnd! - r.manualStart!).filter(d => d > 0);
  const avgDur = durs.length > 0 ? Math.round(durs.reduce((a, b) => a + b) / durs.length) : 16;
  console.log(`⏱  Duração média: ${avgDur}s`);

  // 5. Interpolar / prever timestamps para linhas sem manual
  const sorted = [...rows].sort((a, b) => a.pos - b.pos);

  for (const row of sorted) {
    if (row.manualStart !== null) {
      row.predStart = row.manualStart;
      row.predEnd   = row.manualEnd;
      continue;
    }

    // Âncoras vizinhas
    const prev = [...anchors].reverse().find(a => a.pos < row.pos);
    const next = anchors.find(a => a.pos > row.pos);

    if (prev && next) {
      // Interpolação linear entre âncoras
      const ratio = (row.pos - prev.pos) / (next.pos - prev.pos);
      row.predStart = prev.manualStart! + ratio * (next.manualStart! - prev.manualStart!);
    } else {
      // Fallback: timestamp do banco (OCR)
      const dbEntry = dbByPos.get(row.pos);
      if (dbEntry?.videoStartSec) {
        row.predStart = dbEntry.videoStartSec;
      } else if (prev) {
        // Extrapolação a partir da última âncora + passo médio
        const stepPerTrophy = anchors.length >= 2
          ? (anchors[anchors.length - 1]!.manualStart! - anchors[0]!.manualStart!) / (anchors[anchors.length - 1]!.pos - anchors[0]!.pos)
          : avgDur + 2;
        row.predStart = prev.manualStart! + (row.pos - prev.pos) * stepPerTrophy;
      } else if (next) {
        const stepPerTrophy = anchors.length >= 2
          ? (anchors[anchors.length - 1]!.manualStart! - anchors[0]!.manualStart!) / (anchors[anchors.length - 1]!.pos - anchors[0]!.pos)
          : avgDur + 2;
        row.predStart = next.manualStart! - (next.pos - row.pos) * stepPerTrophy;
      }
    }

    // Duração: preferir diferença do banco, senão média
    if (row.predStart !== null) {
      const dbEntry = dbByPos.get(row.pos);
      const dur = dbEntry?.videoStartSec && dbEntry?.videoEndSec
        ? dbEntry.videoEndSec - dbEntry.videoStartSec
        : avgDur;
      row.predEnd = row.predStart + dur;
    }
  }

  // 6. Montar updates (somente linhas onde D estava vazio)
  const updates: Array<{ range: string; values: string[][] }> = [];
  let filled = 0;

  for (const row of rows) {
    if (row.manualStart !== null) continue; // já preenchido pelo usuário — não sobrescrever
    if (row.predStart === null) continue;

    updates.push({
      range:  `'${SHEET}'!D${row.rowIdx}:E${row.rowIdx}`,
      values: [[fmtHMS(row.predStart), row.predEnd !== null ? fmtHMS(row.predEnd) : '']],
    });
    filled++;
  }

  console.log(`\n✏️  Linhas a preencher: ${filled}`);
  if (filled === 0) { console.log('Nada a fazer.'); return; }

  // 7. Escrever em batch (máx 1000 ranges por chamada)
  const BATCH = 500;
  for (let i = 0; i < updates.length; i += BATCH) {
    const chunk = updates.slice(i, i + BATCH);
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: 'USER_ENTERED', data: chunk },
    });
    console.log(`  Batch ${Math.floor(i / BATCH) + 1}: ${chunk.length} células escritas`);
  }

  console.log(`\n✅ ${filled} linhas preenchidas na aba "${SHEET}"!`);
  console.log('   Timestamps manuais existentes foram preservados.');
}

main().catch(console.error).finally(() => db.$disconnect());
