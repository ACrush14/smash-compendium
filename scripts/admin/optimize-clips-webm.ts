/**
 * Reduz os clipes .webm de public/assets/media para no máximo 720p e bitrate moderado (VP9, sem áudio).
 * Só mexe em arquivos acima de 720p OU com bitrate médio > 1,5 Mbps.
 * Os originais são movidos para scratch/webm-originals/ (mesmo caminho relativo) — para reverter,
 * copie de volta.
 *
 *   npx tsx scripts/admin/optimize-clips-webm.ts            # otimiza tudo que precisa
 *   npx tsx scripts/admin/optimize-clips-webm.ts --dry-run  # só lista o que seria feito
 */
import { spawn, execFileSync } from "node:child_process";
import { cpus } from "node:os";
import { existsSync, mkdirSync, readdirSync, renameSync, statSync, rmSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "assets", "media");
const BACKUP = path.join(process.cwd(), "scratch", "webm-originals");
const MAX_HEIGHT = 720;
const MAX_BITRATE = 1_500_000;
const DRY = process.argv.includes("--dry-run");
const CONCURRENCY = Math.max(2, Math.floor(cpus().length / 6));

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".webm") ? [path.join(dir, e.name)] : [],
  );
}

function probe(file: string) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=height:format=duration,size", "-of", "json", file,
  ]).toString();
  const j = JSON.parse(out) as { streams: { height: number }[]; format: { duration: string; size: string } };
  const height = j.streams[0]?.height ?? 0;
  const bitrate = (Number(j.format.size) * 8) / Math.max(1, Number(j.format.duration));
  return { height, bitrate };
}

function encode(src: string, dst: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-an",
      "-vf", `scale=-2:'min(${MAX_HEIGHT},ih)'`,
      "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "1400k", // CRF com teto de bitrate (qualidade restrita)
      "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-threads", "4",
      "-g", "60", "-f", "webm", dst,
    ], { stdio: "inherit" });
    p.on("exit", c => (c === 0 ? resolve() : reject(new Error(`ffmpeg ${c}: ${src}`))));
  });
}

async function main() {
  const all = walk(ROOT);
  const todo = all
    .map(f => ({ f, ...probe(f), size: statSync(f).size }))
    .filter(x => x.height > MAX_HEIGHT || x.bitrate > MAX_BITRATE);

  const before = todo.reduce((s, x) => s + x.size, 0);
  console.log(`${all.length} clipes; ${todo.length} precisam de otimização (${(before / 1048576).toFixed(0)} MB).`);
  if (DRY) { todo.forEach(x => console.log(` - ${path.relative(ROOT, x.f)}  ${x.height}p  ${(x.bitrate / 1e6).toFixed(1)} Mbps`)); return; }

  let saved = 0, i = 0, failed = 0;
  const queue = [...todo];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    for (let x = queue.shift(); x; x = queue.shift()) {
      const tmp = x.f + ".part";
      try {
        await encode(x.f, tmp);
        const after = statSync(tmp).size;
        if (after >= x.size) { rmSync(tmp); console.log(`= ${path.basename(x.f)} já era menor que o novo; mantido`); continue; }
        const bak = path.join(BACKUP, path.relative(ROOT, x.f));
        mkdirSync(path.dirname(bak), { recursive: true });
        if (!existsSync(bak)) renameSync(x.f, bak); else rmSync(x.f);
        renameSync(tmp, x.f);
        saved += x.size - after;
        console.log(`✔ [${++i}/${todo.length}] ${path.basename(x.f)}: ${(x.size / 1048576).toFixed(1)} → ${(after / 1048576).toFixed(1)} MB`);
      } catch (e) {
        failed++; rmSync(tmp, { force: true }); console.error(String(e));
      }
    }
  }));
  console.log(`Economia total: ${(saved / 1048576).toFixed(0)} MB. Falhas: ${failed}. Originais em ${path.relative(process.cwd(), BACKUP)}`);
  process.exit(failed ? 1 : 0);
}

main();
