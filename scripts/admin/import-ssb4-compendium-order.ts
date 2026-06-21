/**
 * import-ssb4-compendium-order.ts
 * Lê a coluna E ("orderCompedium") da aba "SSB4 Trophies" do Google Sheets
 * e atualiza posicaoTrofeuSsb4 no banco para todos os 1042 troféus do SSB4.
 *
 * A ordem final no Compendium é: shared (3DS+WiiU) → exclusivo 3DS → exclusivo WiiU,
 * intercalado por franquia — conforme preenchido pelo usuário na planilha.
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/import-ssb4-compendium-order.ts
 */

import { google } from 'googleapis';
import { db } from '../../lib/db';

const SPREADSHEET_ID = '1JqkLjQuqXnzxWzWAh7WoJGgft-rjFB5ydulC6_SXRr8';
const SHEET          = 'SSB4 Trophies';

function normName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\n\r]+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  // ── 1. Ler planilha ──────────────────────────────────────────────────────────
  const auth = new google.auth.GoogleAuth({
    keyFile: 'google-service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('📖 Lendo planilha...');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${SHEET}'!A:E`,
  });
  const allRows  = res.data.values ?? [];
  const dataRows = allRows.slice(1); // pula cabeçalho
  console.log(`  ${dataRows.length} linhas carregadas`);

  // mapa: normName → orderCompedium (col E = índice 4)
  const sheetMap = new Map<string, number>();
  let sheetEmpty = 0;
  for (const row of dataRows) {
    const name  = (row[0] ?? '').toString().trim();
    const order = (row[4] ?? '').toString().trim();
    if (!name || !order) { sheetEmpty++; continue; }
    const orderNum = parseInt(order, 10);
    if (isNaN(orderNum)) continue;
    sheetMap.set(normName(name), orderNum);
  }
  console.log(`  ${sheetMap.size} entradas válidas na planilha (${sheetEmpty} sem nome/ordem)`);

  // ── 2. Carregar troféus do banco ─────────────────────────────────────────────
  const trophies = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: { in: ['SSB4', 'SSB4_3DS', 'SSB4_WIIU'] } },
    select: { id: true, name: true, smashGameVersion: true, posicaoTrofeuSsb4: true },
  });
  console.log(`\n🗄  ${trophies.length} troféus SSB4 no banco`);

  // ── 3. Fazer match e acumular updates ────────────────────────────────────────
  let updated   = 0;
  let notFound  = 0;
  const missed: string[] = [];

  for (const trophy of trophies) {
    const key   = normName(trophy.name);
    const order = sheetMap.get(key);

    if (order == null) {
      notFound++;
      missed.push(`[${trophy.smashGameVersion}] "${trophy.name}"`);
      continue;
    }

    await db.collectible.update({
      where: { id: trophy.id },
      data:  { posicaoTrofeuSsb4: order },
    });
    updated++;
  }

  // ── 4. Relatório ─────────────────────────────────────────────────────────────
  console.log(`\n✅ ${updated} troféus atualizados`);
  if (notFound > 0) {
    console.warn(`\n⚠️  ${notFound} troféus sem match na planilha:`);
    for (const m of missed) console.warn(`   ${m}`);
  }
}

main().catch(console.error).finally(() => db.$disconnect());
