import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const db = new PrismaClient();
const ROOT_DIR = process.cwd();

const files = [
  { name: 'Melee', path: 'melee-timestamps.json', model: 'collectible' },
  { name: 'Brawl', path: 'brawl-timestamps.json', model: 'collectible' },
  { name: '3DS', path: 'ssb4-3ds-timestamps.json', model: 'collectible' },
  { name: 'Wii U', path: 'ssb4-wiiu-timestamps.json', model: 'collectible' },
  { name: 'SSB64', path: 'ssb64-timestamps.json', model: 'fighter' }
];

async function run() {
  console.log('Iniciando importação de timestamps para o banco de dados...');

  for (const file of files) {
    const filePath = path.join(ROOT_DIR, file.path);
    if (!fs.existsSync(filePath)) {
      console.log(`[PULANDO] Arquivo ${file.path} não encontrado.`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`\nImportando ${data.length} registros para ${file.name}...`);

    let count = 0;
    for (const item of data) {
      try {
        if (file.model === 'collectible') {
          await db.collectible.update({
            where: { id: item.id },
            data: {
              videoStartSec: item.startSec,
              videoEndSec: item.endSec
            }
          });
        } else if (file.model === 'fighter') {
          // As we mapped timestamps to FighterBio now, we find the bio for this fighter for the specific game (SSB64)
          const bio = await db.fighterBio.findUnique({
            where: { fighterId_smashGameVersion: { fighterId: item.id, smashGameVersion: 'SSB64' } }
          });
          
          if (bio) {
            await db.fighterBio.update({
              where: { id: bio.id },
              data: {
                videoStartSec: item.startSec,
                videoEndSec: item.endSec
              }
            });
          } else {
            console.log(`[AVISO] Bio não encontrada para ${item.name} no SSB64`);
          }
        }
        count++;
      } catch (err) {
        console.error(`Erro ao atualizar ID ${item.id} (${item.name}):`, err.message);
      }
    }
    console.log(`[SUCESSO] ${count} registros importados para ${file.name}.`);
  }

  console.log('\nImportação finalizada!');
}

run()
  .catch(console.error)
  .finally(() => db.$disconnect());
