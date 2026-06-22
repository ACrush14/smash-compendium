/**
 * import-ssb4-3ds-timestamps-secondary.ts
 * Grava os timestamps 3DS (colunas H/I) nos campos videoStartSec2/videoEndSec2
 * dos troféus SSB4 compartilhados (smashGameVersion = 'SSB4').
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/import-ssb4-3ds-timestamps-secondary.ts
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
  console.log('📖 Lendo planilha...');
  const auth = new google.auth.GoogleAuth({
    keyFile: 'google-service-account.json',
    scopes:  ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const res    = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET}'!A:I`,
  });
  const dataRows = (res.data.values ?? []).slice(1);

  // Mapa normName → timestamps 3DS (H/I)
  const sheetMap = new Map<string, { start: number; end: number | null }>();
  for (const row of dataRows) {
    const name  = (row[0] ?? '').toString().trim();
    const has3DS = !!(row[5] ?? '').toString().trim(); // col F = 3DS Number
    if (!name || !has3DS) continue;
    const start = parseTime((row[7] ?? '').toString()); // H
    const end   = parseTime((row[8] ?? '').toString()); // I
    if (start == null) continue;
    sheetMap.set(normName(name), { start, end });
  }
  console.log(`  ${sheetMap.size} entradas 3DS mapeadas`);

  // Carregar troféus SSB4 compartilhados
  const trophies = await db.collectible.findMany({
    where:  { type: 'TROPHY', smashGameVersion: 'SSB4' },
    select: { id: true, name: true },
  });
  console.log(`  ${trophies.length} troféus SSB4 (compartilhados) no banco`);

  // Gravar em lotes
  type Pending = { id: string; start: number; end: number | null };
  const pending: Pending[] = [];
  const missed: string[] = [];

  for (const t of trophies) {
    const entry = sheetMap.get(normName(t.name));
    if (!entry) { missed.push(t.name); continue; }
    pending.push({ id: t.id, start: Math.round(entry.start), end: entry.end != null ? Math.round(entry.end) : null });
  }

  console.log(`\n✏️  Gravando ${pending.length} registros...`);
  const BATCH = 50;
  for (let i = 0; i < pending.length; i += BATCH) {
    const chunk = pending.slice(i, i + BATCH);
    await db.$transaction(
      chunk.map(p => db.collectible.update({
        where: { id: p.id },
        data:  { videoStartSec2: p.start, videoEndSec2: p.end },
      }))
    );
    process.stdout.write(`\r  ${Math.min(i + BATCH, pending.length)}/${pending.length}`);
  }

  console.log(`\n\n✅ Concluído:`);
  console.log(`  Gravados: ${pending.length}`);
  console.log(`  Sem match: ${missed.length}`);
  if (missed.length) missed.forEach(m => console.log(`   "${m}"`));
}

main().catch(console.error).finally(() => db.$disconnect());
