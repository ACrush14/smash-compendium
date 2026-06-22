/**
 * import-ssb4-timestamps.ts
 * Importa timestamps do SSB4 do Google Sheets para o banco:
 *
 *  SSB4_3DS  → colunas H/I (Timestamp 3ds começo / fim)
 *  SSB4_WIIU → colunas J/K (Timestamp Wii U começo / fim)
 *  SSB4      → colunas J/K (troféus compartilhados aparecem no vídeo Wii U)
 *
 * Match por nome normalizado. Sobrescreve videoStartSec/videoEndSec existentes.
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/import-ssb4-timestamps.ts
 */

import { google } from 'googleapis';
import { db } from '../../lib/db';

const SPREADSHEET_ID = '1JqkLjQuqXnzxWzWAh7WoJGgft-rjFB5ydulC6_SXRr8';
const SHEET          = 'SSB4 Trophies';

function parseTime(s: string): number | null {
  s = s.trim();
  if (!s || s === '-----' || s === '---') return null;
  const parts = s.split(':').map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  if (parts.length === 2) return parts[0]! * 60 + parts[1]!;
  return null;
}

function normName(s: string): string {
  return s.toLowerCase().replace(/[\n\r]+/g, ' ').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

async function main() {
  // 1. Ler planilha (A:K)
  console.log('📖 Lendo planilha...');
  const auth = new google.auth.GoogleAuth({
    keyFile: 'google-service-account.json',
    scopes:  ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets  = google.sheets({ version: 'v4', auth });
  const res     = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET}'!A:K`,
  });
  const dataRows = (res.data.values ?? []).slice(1);
  console.log(`  ${dataRows.length} linhas`);

  // Mapa normName → timestamps por versão
  type SheetEntry = {
    ds3Start: number | null;  // H
    ds3End:   number | null;  // I
    wiiStart: number | null;  // J
    wiiEnd:   number | null;  // K
    has3DS:   boolean;        // col F preenchida
    hasWiiU:  boolean;        // col G preenchida
  };

  const sheetMap = new Map<string, SheetEntry>();
  for (const row of dataRows) {
    const name = (row[0] ?? '').toString().trim();
    if (!name) continue;
    const key = normName(name);
    sheetMap.set(key, {
      ds3Start: parseTime((row[7]  ?? '').toString()),
      ds3End:   parseTime((row[8]  ?? '').toString()),
      wiiStart: parseTime((row[9]  ?? '').toString()),
      wiiEnd:   parseTime((row[10] ?? '').toString()),
      has3DS:   !!(row[5] ?? '').toString().trim(),
      hasWiiU:  !!(row[6] ?? '').toString().trim(),
    });
  }
  console.log(`  ${sheetMap.size} entradas mapeadas`);

  // 2. Carregar trofeus SSB4 do banco
  const trophies = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: { in: ['SSB4', 'SSB4_3DS', 'SSB4_WIIU'] } },
    select: { id: true, name: true, smashGameVersion: true },
  });
  console.log(`  ${trophies.length} troféus no banco`);

  // 3. Importar
  let updated3DS = 0, updatedWiiU = 0, noMatch = 0, noTimestamp = 0;
  const missed: string[] = [];
  type Pending = { id: string; smashGameVersion: string; startSec: number; endSec: number | null };
  const pending: Pending[] = [];

  for (const trophy of trophies) {
    const entry = sheetMap.get(normName(trophy.name));

    if (!entry) {
      noMatch++;
      missed.push(`[${trophy.smashGameVersion}] "${trophy.name}"`);
      continue;
    }

    // Determina qual timestamp usar
    let startSec: number | null;
    let endSec:   number | null;

    if (trophy.smashGameVersion === 'SSB4_3DS') {
      startSec = entry.ds3Start;
      endSec   = entry.ds3End;
    } else {
      // SSB4 e SSB4_WIIU → vídeo Wii U (J/K)
      startSec = entry.wiiStart;
      endSec   = entry.wiiEnd;
    }

    if (startSec == null) {
      noTimestamp++;
      continue;
    }

    pending.push({
      id: trophy.id,
      smashGameVersion: trophy.smashGameVersion,
      startSec: Math.round(startSec),
      endSec:   endSec != null ? Math.round(endSec) : null,
    });
  }

  // 4. Gravar em lotes via $transaction
  const BATCH = 50;
  console.log(`\n✏️  Gravando ${pending.length} registros em lotes de ${BATCH}...`);
  for (let i = 0; i < pending.length; i += BATCH) {
    const chunk = pending.slice(i, i + BATCH);
    await db.$transaction(
      chunk.map(p => db.collectible.update({
        where: { id: p.id },
        data:  { videoStartSec: p.startSec, videoEndSec: p.endSec },
      }))
    );
    process.stdout.write(`\r  ${Math.min(i + BATCH, pending.length)}/${pending.length}`);
  }

  for (const p of pending) {
    if (p.smashGameVersion === 'SSB4_3DS') updated3DS++;
    else updatedWiiU++;
  }

  // 5. Relatório
  console.log(`\n✅ Importação concluída:`);
  console.log(`  SSB4_3DS atualizados:        ${updated3DS}`);
  console.log(`  SSB4 / SSB4_WIIU atualizados: ${updatedWiiU}`);
  console.log(`  Sem timestamp na planilha:   ${noTimestamp}`);
  console.log(`  Sem match por nome:          ${noMatch}`);
  if (missed.length) {
    console.log(`\n⚠️  Sem match:`);
    missed.forEach(m => console.log(`   ${m}`));
  }
}

main().catch(console.error).finally(() => db.$disconnect());
