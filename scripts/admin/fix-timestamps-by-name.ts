import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const db = new PrismaClient();
const ROOT_DIR = process.cwd();

const files = [
  { name: 'Melee', path: 'melee-timestamps.json', gameVer: 'SSBM' },
  { name: 'Brawl', path: 'brawl-timestamps.json', gameVer: 'SSBB' },
  { name: '3DS', path: 'ssb4-3ds-timestamps.json', gameVer: 'SSB4' },
  { name: 'Wii U', path: 'ssb4-wiiu-timestamps.json', gameVer: 'SSB4' }
];

async function run() {
  console.log('Iniciando re-importação de timestamps baseada no nome do troféu...');

  for (const file of files) {
    const filePath = path.join(ROOT_DIR, file.path);
    if (!fs.existsSync(filePath)) {
      console.log(`[PULANDO] Arquivo ${file.path} não encontrado.`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`\nImportando ${data.length} registros para ${file.name} (${file.gameVer})...`);

    let count = 0;
    for (const item of data) {
      try {
        // Encontra o troféu pelo nome e versão do jogo
        const collectibles = await db.collectible.findMany({
          where: { 
            name: { equals: item.name, mode: 'insensitive' },
            smashGameVersion: file.gameVer 
          }
        });

        if (collectibles.length > 0) {
          // Atualiza todos os que baterem (geralmente será 1)
          for (const c of collectibles) {
            await db.collectible.update({
              where: { id: c.id },
              data: {
                videoStartSec: item.startSec,
                videoEndSec: item.endSec
              }
            });
            count++;
          }
        } else {
          console.log(`[AVISO] Troféu não encontrado no banco: "${item.name}" (${file.gameVer})`);
        }
      } catch (err: any) {
        console.error(`Erro ao atualizar "${item.name}":`, err.message);
      }
    }
    console.log(`[SUCESSO] ${count} registros atualizados para ${file.name}.`);
  }

  console.log('\nRe-importação finalizada!');
}

run()
  .catch(console.error)
  .finally(() => db.$disconnect());
