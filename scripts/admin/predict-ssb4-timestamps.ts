/**
 * predict-ssb4-timestamps.ts
 * Lê a aba "SSB4 Trophies" do Google Sheets e preenche:
 *   E  = 3DS Number      (posição in-game no 3DS)
 *   F  = WiiU Number     (posição in-game no Wii U)
 *   G  = Timestamp 3ds começo   (H:MM:SS)
 *   H  = Timestamp 3ds fim      (H:MM:SS)
 *   I  = Timestamp Wii U começo (H:MM:SS)
 *   J  = Timestamp Wii U Fim    (H:MM:SS)
 *
 * Não sobrescreve células já preenchidas pelo usuário.
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/predict-ssb4-timestamps.ts
 */

import { google } from 'googleapis';
import { db } from '../../lib/db';

const SPREADSHEET_ID = '1JqkLjQuqXnzxWzWAh7WoJGgft-rjFB5ydulC6_SXRr8';
const SHEET          = 'SSB4 Trophies';

// ── Helpers ───────────────────────────────────────────────────────────────────

function normName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\n\r]+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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

  // 1. Ler planilha (colunas A–J)
  console.log('📖 Lendo planilha...');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET}'!A:J`,
  });
  const allRows = res.data.values ?? [];
  const header  = allRows[0];
  const dataRows = allRows.slice(1);
  console.log(`  ${dataRows.length} linhas carregadas`);
  console.log(`  Colunas: ${JSON.stringify(header)}`);

  // 2. Ler banco de dados
  console.log('🗃  Lendo banco...');
  const dbTrophies = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: { in: ['SSB4', 'SSB4_3DS', 'SSB4_WIIU'] } },
    select: {
      name: true,
      smashGameVersion: true,
      posicaoTrofeuSsb4: true,
      videoStartSec: true,
      videoEndSec: true,
    },
  });
  console.log(`  ${dbTrophies.length} troféus no banco`);

  // Índice por nome normalizado, por versão
  type DbEntry = { pos: number | null; startSec: number | null; endSec: number | null; version: string };
  const byVersion: Record<string, Map<string, DbEntry>> = {
    SSB4:      new Map(),
    SSB4_3DS:  new Map(),
    SSB4_WIIU: new Map(),
  };

  for (const t of dbTrophies) {
    const key = normName(t.name);
    const entry: DbEntry = {
      pos:      t.posicaoTrofeuSsb4,
      startSec: t.videoStartSec,
      endSec:   t.videoEndSec,
      version:  t.smashGameVersion,
    };
    byVersion[t.smashGameVersion]!.set(key, entry);
  }

  // 3. Processar cada linha da planilha
  type Update = { range: string; values: (string | number)[][] };
  const updates: Update[] = [];
  let filled3dsPos = 0, filledWiuPos = 0;
  let filled3dsTs = 0, filledWiuTs = 0;
  let unmatched = 0;

  for (let i = 0; i < dataRows.length; i++) {
    const row    = dataRows[i]!;
    const rowIdx = i + 2; // 1-indexed, linha 1 é header

    const rawName = (row[0] ?? '').trim();
    if (!rawName) continue;

    // Normalizar nome da planilha (pode ter \n separando nomes alternativos)
    const key      = normName(rawName);
    const keyFirst = normName(rawName.split('\n')[0] ?? rawName); // só primeira linha

    const cur3dsNum   = (row[4] ?? '').trim();
    const curWiuNum   = (row[5] ?? '').trim();
    const cur3dsStart = (row[6] ?? '').trim();
    const cur3dsEnd   = (row[7] ?? '').trim();
    const curWiuStart = (row[8] ?? '').trim();
    const curWiuEnd   = (row[9] ?? '').trim();

    // Resolver dados do banco para 3DS (SSB4 shared + SSB4_3DS)
    const entry3ds = byVersion['SSB4_3DS']!.get(key)
      ?? byVersion['SSB4_3DS']!.get(keyFirst)
      ?? byVersion['SSB4']!.get(key)
      ?? byVersion['SSB4']!.get(keyFirst);

    // Resolver dados do banco para Wii U (SSB4 shared + SSB4_WIIU)
    const entryWiu = byVersion['SSB4_WIIU']!.get(key)
      ?? byVersion['SSB4_WIIU']!.get(keyFirst)
      ?? byVersion['SSB4']!.get(key)
      ?? byVersion['SSB4']!.get(keyFirst);

    if (!entry3ds && !entryWiu) {
      console.warn(`  [?] Sem match: "${rawName.replace(/\n/g, ' / ')}" (linha ${rowIdx})`);
      unmatched++;
      continue;
    }

    // Montar as 6 células: E, F, G, H, I, J
    const cellE = !cur3dsNum  && entry3ds?.pos   ? String(entry3ds.pos)             : null;
    const cellF = !curWiuNum  && entryWiu?.pos   ? String(entryWiu.pos)             : null;
    const cellG = !cur3dsStart && entry3ds?.startSec != null ? fmtHMS(entry3ds.startSec) : null;
    const cellH = !cur3dsEnd   && entry3ds?.endSec   != null ? fmtHMS(entry3ds.endSec)   : null;
    const cellI = !curWiuStart && entryWiu?.startSec != null ? fmtHMS(entryWiu.startSec) : null;
    const cellJ = !curWiuEnd   && entryWiu?.endSec   != null ? fmtHMS(entryWiu.endSec)   : null;

    if (cellE) filled3dsPos++;
    if (cellF) filledWiuPos++;
    if (cellG || cellH) filled3dsTs++;
    if (cellI || cellJ) filledWiuTs++;

    // Só escreve se houver algo novo
    const hasUpdate = cellE || cellF || cellG || cellH || cellI || cellJ;
    if (!hasUpdate) continue;

    // Escrevemos as 6 colunas E–J de uma vez para manter alinhamento
    // Usa '' para células que não queremos sobrescrever (valor existente fica)
    // A API com USER_ENTERED e '' não apaga valor existente quando usamos range celular
    // Então escrevemos cada célula separadamente para não sobrescrever as já preenchidas
    for (const [col, val] of [
      ['E', cellE], ['F', cellF],
      ['G', cellG], ['H', cellH],
      ['I', cellI], ['J', cellJ],
    ] as [string, string | null][]) {
      if (val !== null) {
        updates.push({ range: `'${SHEET}'!${col}${rowIdx}`, values: [[val]] });
      }
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`  E (3DS Number) a preencher : ${filled3dsPos}`);
  console.log(`  F (WiiU Number) a preencher: ${filledWiuPos}`);
  console.log(`  G/H (3DS timestamps)        : ${filled3dsTs}`);
  console.log(`  I/J (WiiU timestamps)       : ${filledWiuTs}`);
  console.log(`  Sem match no banco          : ${unmatched}`);
  console.log(`  Total de células a escrever : ${updates.length}`);

  if (updates.length === 0) { console.log('\nNada a atualizar.'); return; }

  // 4. Batch write em chunks de 500
  const BATCH = 500;
  for (let i = 0; i < updates.length; i += BATCH) {
    const chunk = updates.slice(i, i + BATCH);
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { valueInputOption: 'USER_ENTERED', data: chunk },
    });
    console.log(`  Batch ${Math.floor(i / BATCH) + 1}: ${chunk.length} células escritas`);
  }

  console.log(`\n✅ Planilha "${SHEET}" atualizada!`);
}

main().catch(console.error).finally(() => db.$disconnect());
