/**
 * Converte os vídeos completos de public/videos/*.mp4 para WebM 720p (VP9, sem áudio, 30fps).
 * Os MP4 originais NÃO são tocados (os scripts de timestamp/extração e /admin/timestamps ainda os usam).
 *
 *   npx tsx scripts/admin/convert-videos-webm.ts            # converte todos (pula os já prontos)
 *   npx tsx scripts/admin/convert-videos-webm.ts brawl      # só arquivos cujo nome contém "brawl"
 *
 * Saída: public/videos/<nome>_720p.webm  (escrito em .part e renomeado ao terminar).
 * Fontes que já são AV1 720p (ssb4_wiiu) são apenas remuxadas, sem reencodar.
 */
import { spawn, execFileSync } from "node:child_process";
import { existsSync, readdirSync, renameSync, statSync } from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "videos");
// full_video_trophies.mp4 não é usado pelo site (só por scripts de extração), então fica de fora.
const SKIP = ["full_video_trophies"];
const filter = process.argv[2]?.toLowerCase();

function probe(file: string) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=codec_name,height", "-of", "csv=p=0", file,
  ]).toString().trim();
  const [codec = "", height = "0"] = out.split(",");
  return { codec, height: Number(height) };
}

function run(src: string, dst: string): Promise<void> {
  const { codec, height } = probe(src);
  const part = dst + ".part";
  const copyOnly = codec === "av1" && height <= 720;
  const args = copyOnly
    ? ["-i", src, "-an", "-c:v", "copy", "-f", "webm"]
    : [
        "-i", src, "-an",
        "-vf", "scale=-2:'min(720,ih)',fps=30",
        "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0",
        "-deadline", "good", "-cpu-used", "5", "-row-mt", "1", "-threads", "6",
        "-g", "150", // keyframe a cada 5s: seeks por timestamp ficam rápidos
        "-f", "webm",
      ];
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-stats", "-y", ...args, part], { stdio: "inherit" });
    p.on("exit", code => {
      if (code === 0) { renameSync(part, dst); resolve(); }
      else reject(new Error(`ffmpeg saiu com código ${code} em ${src}`));
    });
  });
}

async function main() {
  const jobs = readdirSync(DIR)
    .filter(f => f.endsWith(".mp4"))
    .filter(f => !SKIP.some(s => f.startsWith(s)))
    .filter(f => !filter || f.toLowerCase().includes(filter))
    .map(f => ({ src: path.join(DIR, f), dst: path.join(DIR, f.replace(/\.mp4$/, "_720p.webm")) }))
    .filter(j => !existsSync(j.dst));

  console.log(`Convertendo ${jobs.length} vídeo(s) em paralelo...`);
  const results = await Promise.allSettled(jobs.map(async j => {
    const t0 = Date.now();
    await run(j.src, j.dst);
    const before = statSync(j.src).size / 1048576, after = statSync(j.dst).size / 1048576;
    console.log(`✔ ${path.basename(j.dst)}: ${before.toFixed(0)} MB → ${after.toFixed(0)} MB em ${((Date.now() - t0) / 60000).toFixed(1)} min`);
  }));
  const failed = results.filter(r => r.status === "rejected");
  failed.forEach(r => console.error((r as PromiseRejectedResult).reason));
  process.exit(failed.length ? 1 : 0);
}

main();
