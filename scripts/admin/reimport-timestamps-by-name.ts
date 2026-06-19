import { db } from '../../lib/db';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const TROPHY_FILES = [
  { file: 'melee-timestamps.json',     versions: ['SSBM'] },
  { file: 'brawl-timestamps.json',     versions: ['SSBB'] },
  { file: 'ssb4-wiiu-timestamps.json', versions: ['SSB4_WIIU', 'SSB4'] },
  { file: 'ssb4-3ds-timestamps.json',  versions: ['SSB4_3DS', 'SSB4'] },
];

const SSB64_FILE = 'ssb64-timestamps.json';

async function run() {
  let totalUpdated = 0;
  let totalMissed  = 0;

  // ── Troféus (Melee, Brawl, SSB4) ──────────────────────────────────────────
  for (const { file, versions } of TROPHY_FILES) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) { console.log(`[SKIP] ${file} não encontrado`); continue; }

    const entries: { id: string; name: string; posicao: number; startSec: number; endSec: number }[] =
      JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`\n[${file}] ${entries.length} entradas — game versions: ${versions.join(', ')}`);

    let updated = 0;
    let missed  = 0;

    for (const entry of entries) {
      // Tenta cada smashGameVersion em ordem
      let found = false;
      for (const ver of versions) {
        const record = await db.collectible.findFirst({
          where: {
            name: { equals: entry.name, mode: 'insensitive' },
            smashGameVersion: ver,
            type: 'TROPHY',
          },
          select: { id: true },
        });

        if (record) {
          await db.collectible.update({
            where: { id: record.id },
            data: { videoStartSec: entry.startSec, videoEndSec: entry.endSec },
          });
          updated++;
          found = true;
          break;
        }
      }

      if (!found) {
        console.log(`  [MISS] "${entry.name}" não encontrado em ${versions.join('/')}`);
        missed++;
      }
    }

    console.log(`  ✅ ${updated} atualizados | ❌ ${missed} não encontrados`);
    totalUpdated += updated;
    totalMissed  += missed;
  }

  // ── SSB64 — FighterBio ─────────────────────────────────────────────────────
  const ssb64Path = path.join(ROOT, SSB64_FILE);
  if (fs.existsSync(ssb64Path)) {
    const entries: { id: string; name: string; startSec: number; endSec: number }[] =
      JSON.parse(fs.readFileSync(ssb64Path, 'utf-8'));

    console.log(`\n[${SSB64_FILE}] ${entries.length} entradas — FighterBio SSB64`);

    let updated = 0;
    let missed  = 0;

    for (const entry of entries) {
      // entry.id pode ser CUID real (SSB64 foi gerado com IDs reais) — tenta direto primeiro
      const bio = await db.fighterBio.findFirst({
        where: {
          smashGameVersion: 'SSB64',
          fighter: { name: { equals: entry.name, mode: 'insensitive' } },
        },
        select: { id: true },
      });

      if (bio) {
        await db.fighterBio.update({
          where: { id: bio.id },
          data: { videoStartSec: entry.startSec, videoEndSec: entry.endSec },
        });
        updated++;
      } else {
        console.log(`  [MISS] Fighter "${entry.name}" não tem FighterBio SSB64`);
        missed++;
      }
    }

    console.log(`  ✅ ${updated} atualizados | ❌ ${missed} não encontrados`);
    totalUpdated += updated;
    totalMissed  += missed;
  }

  console.log(`\n══ TOTAL: ${totalUpdated} atualizados | ${totalMissed} não encontrados ══`);
}

run().catch(console.error).finally(() => db.$disconnect());
