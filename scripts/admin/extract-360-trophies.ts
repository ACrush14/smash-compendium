import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const db = new PrismaClient();
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1JqkLjQuqXnzxWzWAh7WoJGgft-rjFB5ydulC6_SXRr8/export?format=csv&gid=911992710';

async function run() {
  const publicMediaDir = path.join(process.cwd(), 'public', 'assets', 'media', 'SSBM', 'gifs');
  if (!fs.existsSync(publicMediaDir)) fs.mkdirSync(publicMediaDir, { recursive: true });

  console.log('Baixando planilha CSV...');
  const res = await fetch(SHEET_CSV_URL);
  const csvText = await res.text();
  
  const lines = csvText.split('\n').slice(1); // skip header
  
  for (const line of lines) {
    if (!line.trim()) continue;
    // Tratar colunas que podem ter aspas por causa do CSV
    const cols = line.split(',');
    const normalOrderStr = cols[0]?.replace(/"/g, '').trim();
    const startStr = cols[2]?.replace(/"/g, '').trim();
    const endStr = cols[3]?.replace(/"/g, '').trim();
    const nameStr = cols[4]?.replace(/"/g, '').trim();

    if (!normalOrderStr || !startStr || !endStr) continue;

    const normalOrder = parseInt(normalOrderStr, 10);
    if (isNaN(normalOrder)) continue;

    console.log(`\n=== Processando Troféu #${normalOrder} - ${nameStr} ===`);

    const trophy = await db.collectible.findFirst({
      where: { type: 'TROPHY', smashGameVersion: 'SSBM', posicaoTrofeuMelee: normalOrder }
    });

    if (!trophy) {
      console.error(`Troféu ${normalOrder} não encontrado no banco.`);
      continue;
    }

    const outputFilename = `trophy_360_${normalOrder}.webm`;
    const outputPath = path.join(publicMediaDir, outputFilename);
    const assetUrl = `/assets/media/SSBM/gifs/${outputFilename}`;

    try {
      if (!fs.existsSync(outputPath)) {
        console.log(`Extraindo trecho ${startStr} a ${endStr}...`);
        execSync(`ffmpeg -ss ${startStr} -to ${endStr} -i "full_video_trophies.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 -an -r 30 -row-mt 1 -cpu-used 4 -deadline realtime -y "${outputPath}"`, { stdio: 'inherit' });
        console.log(`Salvo em ${outputPath}`);
      } else {
        console.log(`Arquivo já existe: ${outputPath}`);
      }

      // Link to Vault as MEDIA for Fighter Page
      if (trophy.fighterId) {
        const dbName = `360 TROPHY - ${trophy.name}`;
        const existingMedia = await db.collectible.findFirst({
           where: { type: 'MEDIA', smashGameVersion: 'SSBM', name: dbName, fighterId: trophy.fighterId }
        });
        if (existingMedia) {
           await db.collectible.update({ where: { id: existingMedia.id }, data: { assetRenderUrl: assetUrl } });
           console.log(`Atualizado MEDIA na vault do lutador.`);
        } else {
           await db.collectible.create({
             data: {
               fighterId: trophy.fighterId,
               smashGameVersion: 'SSBM',
               type: 'MEDIA',
               name: dbName,
               sourceType: 'YOUTUBE',
               assetRenderUrl: assetUrl
             }
           });
           console.log(`Criado MEDIA na vault do lutador.`);
        }
      }
      
      // Update the actual trophy collectible assetRender2Url so Collections page can use it
      await db.collectible.update({
        where: { id: trophy.id },
        data: { assetRender2Url: assetUrl }
      });
      console.log(`Atualizado assetRender2Url no troféu original!`);

    } catch (e) {
      console.error(`Erro:`, e);
    }
  }
  
  console.log('\nFinalizado!');
}

run().finally(() => db.$disconnect());
