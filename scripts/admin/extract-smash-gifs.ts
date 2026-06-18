import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const db = new PrismaClient();

interface ClipConfig {
  fighter: string;
  url: string;
  start: string;
  end: string;
  gameVer: string;
  title: string;
}

async function run() {
  const configPath = path.join(process.cwd(), 'youtube-clips.json');
  if (!fs.existsSync(configPath)) {
    console.error('youtube-clips.json não encontrado!');
    process.exit(1);
  }

  const clips: ClipConfig[] = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  for (const clip of clips) {
    console.log(`\n=== Processando clipe para ${clip.fighter} (${clip.gameVer}) ===`);
    
    // Busca lutador
    const fighterRecord = await db.fighter.findFirst({
      where: { name: { equals: clip.fighter, mode: 'insensitive' } }
    });

    if (!fighterRecord) {
      console.error(`Lutador ${clip.fighter} não encontrado no banco!`);
      continue;
    }

    const publicMediaDir = path.join(process.cwd(), 'public', 'assets', 'media', clip.gameVer, 'gifs');
    if (!fs.existsSync(publicMediaDir)) {
      fs.mkdirSync(publicMediaDir, { recursive: true });
    }

    const outputFilename = `${clip.fighter.toLowerCase().replace(/[^a-z0-9]/g, '')}_${clip.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.webm`;
    const outputPath = path.join(publicMediaDir, outputFilename);
    const assetUrl = `/assets/media/${clip.gameVer}/gifs/${outputFilename}`;
    const tempFile = path.join(process.cwd(), 'temp_clip.mp4');

    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

    try {
      if (!fs.existsSync(outputPath)) {
        console.log(`Extraindo trecho ${clip.start} a ${clip.end} do vídeo local...`);
        // ffmpeg to slice local video and convert to WebM
        execSync(`ffmpeg -ss ${clip.start} -to ${clip.end} -i "full_video.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 -an -r 30 -row-mt 1 -cpu-used 4 -deadline realtime -y "${outputPath}"`, { stdio: 'inherit' });
        
        console.log(`Arquivo salvo em: ${outputPath}`);
      } else {
        console.log(`Arquivo já existe: ${outputPath}. Pulando download.`);
      }

      // Salva no banco de dados
      const dbName = `CLIP - ${clip.title}`;
      const existing = await db.collectible.findFirst({
        where: { fighterId: fighterRecord.id, smashGameVersion: clip.gameVer, type: "MEDIA", name: dbName }
      });

      if (existing) {
        await db.collectible.update({
          where: { id: existing.id },
          data: { assetRenderUrl: assetUrl }
        });
        console.log(`Banco atualizado: ${dbName}`);
      } else {
        await db.collectible.create({
          data: {
            fighterId: fighterRecord.id,
            smashGameVersion: clip.gameVer,
            type: "MEDIA",
            name: dbName,
            sourceType: "YOUTUBE",
            assetRenderUrl: assetUrl
          }
        });
        console.log(`Banco criado: ${dbName}`);
      }

    } catch (e) {
      console.error(`Erro ao processar ${clip.fighter}:`, e);
    } finally {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    }
  }

  console.log(`\nTodos os clipes processados!`);
}

run().finally(() => db.$disconnect());
