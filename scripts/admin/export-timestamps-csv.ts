/**
 * export-timestamps-csv.ts
 * Exporta timestamps do banco para CSV, um arquivo por jogo.
 * Os CSVs podem ser importados no Google Sheets para revisar e corrigir.
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/export-timestamps-csv.ts
 * Saída: timestamps-melee.csv, timestamps-brawl.csv, timestamps-wiiu.csv, timestamps-3ds.csv
 */

import { db } from '../../lib/db';
import fs from 'fs';

function row(...cols: (string | number | null | undefined)[]): string {
  return cols.map(c => {
    const s = c == null ? '' : String(c);
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(',');
}

async function exportGame(cfg: {
  file: string;
  label: string;
  type: 'collectible' | 'fighterBio';
  versions?: string[];
  posCol?: string;
  smashGameVersion?: string;
}) {
  let data: { id: string; name: string; position: number | null; videoStartSec: number | null; videoEndSec: number | null }[] = [];

  if (cfg.type === 'collectible' && cfg.versions && cfg.posCol) {
    const rows = await (db.collectible.findMany as any)({
      where: { type: 'TROPHY', smashGameVersion: { in: cfg.versions } },
      select: { id: true, name: true, videoStartSec: true, videoEndSec: true, [cfg.posCol]: true },
      orderBy: { [cfg.posCol]: 'asc' },
    });
    data = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      position: r[cfg.posCol!],
      videoStartSec: r.videoStartSec,
      videoEndSec: r.videoEndSec,
    }));
  } else if (cfg.type === 'fighterBio' && cfg.smashGameVersion) {
    const rows = await db.fighterBio.findMany({
      where: { smashGameVersion: cfg.smashGameVersion },
      select: { id: true, videoStartSec: true, videoEndSec: true, fighter: { select: { name: true } } },
      orderBy: { fighter: { name: 'asc' } },
    });
    data = rows.map(r => ({
      id: r.id,
      name: r.fighter?.name ?? '?',
      position: null,
      videoStartSec: r.videoStartSec,
      videoEndSec: r.videoEndSec,
    }));
  }

  const lines = [
    row('id', 'Posição', 'Nome', 'Timestamp Início (s)', 'Timestamp Fim (s)', 'Duração (s)'),
    ...data.map(d => row(
      d.id,
      d.position,
      d.name,
      d.videoStartSec,
      d.videoEndSec,
      d.videoStartSec != null && d.videoEndSec != null ? d.videoEndSec - d.videoStartSec : '',
    )),
  ];

  fs.writeFileSync(cfg.file, lines.join('\n'), 'utf-8');
  const withTs = data.filter(d => d.videoStartSec != null).length;
  console.log(`✅ ${cfg.label}: ${data.length} linhas (${withTs} com timestamp) → ${cfg.file}`);
}

async function main() {
  await Promise.all([
    exportGame({
      file: 'timestamps-melee-trofeus.csv',
      label: 'Melee Troféus',
      type: 'collectible',
      versions: ['SSBM'],
      posCol: 'posicaoTrofeuMelee',
    }),
    exportGame({
      file: 'timestamps-melee-lutadores.csv',
      label: 'Melee Lutadores (FighterBio)',
      type: 'fighterBio',
      smashGameVersion: 'SSBM',
    }),
    exportGame({
      file: 'timestamps-brawl.csv',
      label: 'Brawl Troféus',
      type: 'collectible',
      versions: ['SSBB'],
      posCol: 'posicaoTrofeuBrawl',
    }),
    exportGame({
      file: 'timestamps-wiiu.csv',
      label: 'Wii U Troféus',
      type: 'collectible',
      versions: ['SSB4_WIIU', 'SSB4'],
      posCol: 'posicaoTrofeuSsb4',
    }),
    exportGame({
      file: 'timestamps-3ds.csv',
      label: '3DS Troféus',
      type: 'collectible',
      versions: ['SSB4_3DS'],
      posCol: 'posicaoTrofeuSsb4',
    }),
  ]);
  console.log('\nImporte os CSVs no Google Sheets, preencha os timestamps e baixe como CSV.');
  console.log('Depois rode: npx tsx --env-file=.env.local scripts/admin/import-timestamps-from-csv.ts <arquivo.csv> <melee|brawl|wiiu|3ds|melee-fighters>');
}

main().catch(console.error).finally(() => db.$disconnect());
