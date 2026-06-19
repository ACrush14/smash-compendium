import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createWorker, createScheduler } from 'tesseract.js';

const db = new PrismaClient();
const VIDEO_PATH = 'full_video_brawl.mp4';
const FRAMES_DIR = path.join(process.cwd(), 'temp_brawl_frames');
const OUTPUT_JSON = path.join(process.cwd(), 'brawl-timestamps.json');

// Função para converter "string suja" do OCR no nome mais provável
function cleanText(text: string): string {
  // Troca tudo que não for letra/número por espaço, remove espaços duplos e põe minúsculo
  return text.replace(/[^a-zA-Z0-9\.\-&é]/g, ' ')
             .replace(/\s+/g, ' ')
             .trim()
             .toLowerCase();
}

// Distância de Levenshtein simples para Fuzzy Match
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[a.length][b.length];
}

async function run() {
  console.log('1. Carregando troféus do Brawl do banco...');
  const rawTrophies = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: 'SSBB' },
    select: { id: true, name: true, posicaoTrofeuBrawl: true },
    orderBy: { posicaoTrofeuBrawl: 'asc' }
  });

  const trophies = rawTrophies.map(t => ({
    ...t,
    cleanName: cleanText(t.name)
  }));

  console.log(`Carregados ${trophies.length} troféus.`);

  // 2. Extrair os frames se a pasta estiver vazia
  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  }

  const existingFrames = fs.readdirSync(FRAMES_DIR).filter(f => f.endsWith('.jpg'));
  
  if (existingFrames.length < 100) {
    console.log('\n2. Extraindo 1 frame por segundo (Crop no Top-Right)... isso pode demorar alguns minutos.');
    // x=900, y=0, w=1000, h=250 captura bem o canto superior direito
    execSync(`ffmpeg -i "${VIDEO_PATH}" -vf "fps=1,crop=1000:250:900:0" "${FRAMES_DIR}/frame_%05d.jpg" -y`, { stdio: 'inherit' });
    console.log('Extração concluída!');
  } else {
    console.log(`\n2. Frames já encontrados (${existingFrames.length} arquivos). Pulando extração FFmpeg.`);
  }

  // 3. Configurar Tesseract Scheduler (Multi-threading)
  const frames = fs.readdirSync(FRAMES_DIR).filter(f => f.endsWith('.jpg')).sort();
  console.log(`\n3. Iniciando OCR em ${frames.length} frames...`);
  
  const scheduler = createScheduler();
  const workerCount = 4; // Use 4 threads for OCR
  for (let i = 0; i < workerCount; i++) {
    const worker = await createWorker('eng');
    scheduler.addWorker(worker);
  }

  let activeTrophy: any = null;
  let activeTrophyStartSeconds: number | null = null;
  const results: any[] = [];

  for (let i = 0; i < frames.length; i++) {
    const frameFile = frames[i];
    const second = parseInt(frameFile.replace('frame_', '').replace('.jpg', ''), 10);
    const framePath = path.join(FRAMES_DIR, frameFile);

    try {
      const { data: { text } } = await scheduler.addJob('recognize', framePath);
      const readClean = cleanText(text);

      if (i % 50 === 0) console.log(`[Brawl] Progresso: ${second}s... (Lido: "${readClean}")`);
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
            posicao: activeTrophy.posicaoTrofeuBrawl,
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
      posicao: activeTrophy.posicaoTrofeuBrawl,
      startSec: activeTrophyStartSeconds,
      endSec: frames.length
    });
  }

  await scheduler.terminate();

  // 4. Salvar resultados
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2));
  console.log(`\nFinalizado! ${results.length} timestamps salvos em ${OUTPUT_JSON}`);
}

run().finally(() => db.$disconnect());
