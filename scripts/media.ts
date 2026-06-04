/**
 * Pipeline de Mídia — Extração e Transcodificação
 *
 * Lê media_index.json, usa yt-dlp + ffmpeg para baixar e transcodar
 * cada clipe como WebM (VP9, sem áudio), salva em public/assets/fighters/
 * e atualiza a coluna selectAnimationUrl no banco.
 *
 * Pré-requisitos (instalar manualmente):
 *   yt-dlp  → https://github.com/yt-dlp/yt-dlp  (adicionar ao PATH)
 *   ffmpeg  → https://ffmpeg.org/download.html   (adicionar ao PATH)
 *
 * Uso:
 *   npm run media                          # processa todas as entradas
 *   npm run media -- --key "Ness_Select"  # processa uma entrada específica
 *   npm run media -- --force              # reprocessa mesmo se já existir
 */

import { exec }   from "child_process";
import { promisify } from "util";
import path        from "path";
import fs          from "fs";
import { db }      from "../lib/db";
import { log }     from "./scrapers/utils";

const execAsync = promisify(exec);

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaEntry {
  url:     string;       // URL do YouTube (ou outro suporte do yt-dlp)
  start:   string;       // Timestamp início, ex: "00:45"
  end:     string;       // Timestamp fim,   ex: "00:49"
  fighter: string;       // Nome exato do Fighter no banco
  field?:  "selectAnimationUrl"; // Coluna a preencher (default: selectAnimationUrl)
}

type MediaIndex = Record<string, MediaEntry>;

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const keyArg  = args[args.indexOf("--key") + 1]  ?? null;
const force   = args.includes("--force");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(process.cwd(), "public", "assets", "fighters");

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    log.ok(`Diretório criado: ${OUTPUT_DIR}`);
  }
}

async function checkDependency(bin: string): Promise<boolean> {
  try {
    await execAsync(`${bin} --version`);
    return true;
  } catch {
    return false;
  }
}

// ─── Download + Transcode ─────────────────────────────────────────────────────

async function processEntry(key: string, entry: MediaEntry): Promise<string> {
  const safeName   = key.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const outputFile = path.join(OUTPUT_DIR, `${safeName}.webm`);
  const tempFile   = path.join(OUTPUT_DIR, `_tmp_${safeName}.mp4`);

  // 1. Download do trecho com yt-dlp
  log.step(`  yt-dlp: baixando trecho ${entry.start}→${entry.end}`);
  const ytDlpCmd = [
    "yt-dlp",
    `-f "bestvideo[height<=720][ext=mp4]/bestvideo[height<=720]/bestvideo"`,
    `--download-sections "*${entry.start}-${entry.end}"`,
    `--force-keyframes-at-cuts`,
    `-o "${tempFile}"`,
    `"${entry.url}"`,
  ].join(" ");

  await execAsync(ytDlpCmd);

  // 2. Transcode para VP9 WebM (sem áudio, otimizado para loop)
  log.step(`  ffmpeg: transcodando para VP9 WebM`);
  const ffmpegCmd = [
    "ffmpeg -y",
    `-i "${tempFile}"`,
    "-c:v libvpx-vp9",
    "-b:v 0 -crf 33",           // qualidade constante, sem bitrate fixo
    "-vf scale=-2:360",          // reduz altura para 360p mantendo AR
    "-an",                       // remove faixa de áudio
    "-deadline good -cpu-used 2",
    `"${outputFile}"`,
  ].join(" ");

  await execAsync(ffmpegCmd);

  // 3. Remove temp
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

  return `/assets/fighters/${safeName}.webm`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Verifica dependências
  const [hasYtDlp, hasFfmpeg] = await Promise.all([
    checkDependency("yt-dlp"),
    checkDependency("ffmpeg"),
  ]);

  if (!hasYtDlp || !hasFfmpeg) {
    if (!hasYtDlp) log.error("yt-dlp não encontrado no PATH. Instale: https://github.com/yt-dlp/yt-dlp");
    if (!hasFfmpeg) log.error("ffmpeg não encontrado no PATH. Instale: https://ffmpeg.org/download.html");
    process.exit(1);
  }

  ensureOutputDir();

  // Lê o índice
  const indexPath = path.join(process.cwd(), "media_index.json");
  if (!fs.existsSync(indexPath)) {
    log.error(`media_index.json não encontrado em: ${indexPath}`);
    process.exit(1);
  }

  const index: MediaIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  const entries = keyArg
    ? Object.entries(index).filter(([k]) => k === keyArg)
    : Object.entries(index);

  if (entries.length === 0) {
    log.ok("Nenhuma entrada para processar.");
    process.exit(0);
  }

  log.ok(`Processando ${entries.length} entrada(s)...`);

  let success = 0;
  let failed  = 0;

  for (const [key, entry] of entries) {
    const safeName   = key.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const outputFile = path.join(OUTPUT_DIR, `${safeName}.webm`);

    // Pula se já existe e não é force
    if (!force && fs.existsSync(outputFile)) {
      log.info(`  ${key}: arquivo já existe — pulando (use --force para reprocessar)`);
      success++;
      continue;
    }

    log.info(`[${key}] ${entry.fighter} — ${entry.url}`);

    try {
      const assetPath = await processEntry(key, entry);

      // Persiste no banco
      const field = entry.field ?? "selectAnimationUrl";
      await db.fighter.updateMany({
        where: { name: { equals: entry.fighter, mode: "insensitive" } },
        data:  { [field]: assetPath },
      });

      log.ok(`  ${key} → ${assetPath} (banco atualizado)`);
      success++;
    } catch (err) {
      log.error(`  Falha em ${key}: ${String(err)}`);
      failed++;
    }
  }

  console.log("");
  log.ok(`Concluído: ${success} processados, ${failed} falhas.`);
  await db.$disconnect();
}

main().catch((err) => {
  log.error(`Erro fatal: ${String(err)}`);
  process.exit(1);
});
