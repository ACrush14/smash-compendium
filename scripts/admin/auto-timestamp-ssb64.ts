import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createWorker, createScheduler } from 'tesseract.js';

const db = new PrismaClient();
const VIDEO_PATH = path.join(process.cwd(), 'full_SSB64_video.mp4');
const FRAMES_DIR = path.join(process.cwd(), 'temp_ssb64_frames');
const OUTPUT_JSON = path.join(process.cwd(), 'ssb64-timestamps.json');

function cleanText(text: string): string {
  return text.replace(/[^a-zA-Z0-9\.\-&é]/g, ' ')
             .replace(/\s+/g, ' ')
             .trim()
             .toLowerCase();
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
}

async function run() {
  console.log('1. Buscando apenas os LUTADORES do SSB64 no banco de dados...');
  const rawTrophies = await db.collectible.findMany({
    where: { smashGameVersion: 'SSB64', type: 'FIGHTER' },
    select: { id: true, name: true, posicaoLutador: true },
    orderBy: { posicaoLutador: 'asc' }
  });

  const trophies = rawTrophies.map(t => ({
    ...t,
    cleanName: cleanText(t.name)
  }));

  console.log(`Carregados ${trophies.length} lutadores do SSB64.`);

  if (!fs.existsSync(VIDEO_PATH)) {
    console.error(`ERRO: Vídeo não encontrado em ${VIDEO_PATH}`);
    process.exit(1);
  }

  const existingFrames = fs.existsSync(FRAMES_DIR) ? fs.readdirSync(FRAMES_DIR).filter(f => f.endsWith('.jpg')) : [];
  
  if (existingFrames.length < 10) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
    console.log('\n2. Extraindo frames a partir dos 29s (Crop no Top-Left do SSB64)...');
    // Crop temporário, será ajustado com a confirmação. Pula os primeiros 29s do vídeo
    execSync(`ffmpeg -ss 00:00:29 -i "${VIDEO_PATH}" -vf "fps=1,crop=600:200:20:110" "${FRAMES_DIR}/frame_%05d.jpg" -y`, { stdio: 'inherit' });
    console.log('Extração concluída!');
  } else {
    console.log(`\n2. Frames já encontrados (${existingFrames.length} arquivos). Pulando extração.`);
  }

  console.log('\n3. Iniciando OCR (SSB64)...');
  const scheduler = createScheduler();
  for (let i = 0; i < 4; i++) {
    const worker = await createWorker('eng');
    scheduler.addWorker(worker);
  }

  const frames = fs.readdirSync(FRAMES_DIR).filter(f => f.endsWith('.jpg')).sort();
  const results: any[] = [];
  
  let activeTrophy: any = null;
  let activeTrophyStartSeconds: number | null = null;

  for (let i = 0; i < frames.length; i++) {
    const frameFile = frames[i];
    // Como pulamos os 29 primeiros segundos, o frame_00001 na verdade é o segundo 30 do vídeo
    const second = parseInt(frameFile.replace('frame_', '').replace('.jpg', ''), 10) + 29;
    const framePath = path.join(FRAMES_DIR, frameFile);

    try {
      const { data: { text } } = await scheduler.addJob('recognize', framePath);
      const readClean = cleanText(text);

      if (i % 50 === 0) console.log(`[SSB64] Progresso: ${second}s... (Lido: "${readClean}")`);
      if (readClean.length < 3) continue;

      let bestMatch = null;
      let bestScore = 999;

      for (const t of trophies) {
        if (readClean.includes(t.cleanName) && t.cleanName.length > 3) {
          bestMatch = t;
          bestScore = 0;
          break;
        }
        const dist = levenshteinDistance(readClean, t.cleanName);
        if (dist < bestScore && dist <= 2) {
          bestMatch = t;
          bestScore = dist;
        }
      }

      if (bestMatch && (!activeTrophy || activeTrophy.id !== bestMatch.id)) {
        if (activeTrophy && activeTrophyStartSeconds !== null) {
          results.push({
            id: activeTrophy.id,
            name: activeTrophy.name,
            posicao: activeTrophy.posicaoLutador,
            startSec: activeTrophyStartSeconds,
            endSec: second - 1
          });
          console.log(`=> GRAVADO [${activeTrophy.name}]: ${activeTrophyStartSeconds}s até ${second - 1}s`);
        }
        activeTrophy = bestMatch;
        activeTrophyStartSeconds = second;
        console.log(`=> INICIADO [${activeTrophy.name}] no segundo ${second}s`);
      }
    } catch (e) {}
  }

  if (activeTrophy && activeTrophyStartSeconds !== null) {
    results.push({
      id: activeTrophy.id,
      name: activeTrophy.name,
      posicao: activeTrophy.posicaoLutador,
      startSec: activeTrophyStartSeconds,
      endSec: frames.length
    });
  }

  await scheduler.terminate();

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2));
  console.log(`\n✅ OCR finalizado! ${results.length} itens encontrados. Salvo em ${OUTPUT_JSON}`);
}

run().catch(console.error);
