/**
 * Gera uma capa WebP leve (≤640px, ~15–30 KB) para cada clipe .webm de public/assets/media:
 *   clipe:  public/assets/media/SSBM/gifs/mario_gameplay1.webm
 *   capa:   public/assets/media/SSBM/gifs/mario_gameplay1.poster.webp
 * O carrossel usa a capa como `poster` do <video>: o primeiro desenho da página (LCP) deixa de depender
 * do download do clipe (até 2,6 MB) e as miniaturas não baixam vídeo nenhum (preload="none").
 *
 *   npx tsx scripts/admin/make-clip-posters.ts
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "assets", "media");

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".webm") ? [path.join(dir, e.name)] : [],
  );
}

let ok = 0, skipped = 0, failed = 0, bytes = 0;
for (const clip of walk(ROOT)) {
  const out = clip.replace(/\.webm$/, ".poster.webp");
  if (existsSync(out)) { skipped++; continue; }
  const r = spawnSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-ss", "0.4", "-i", clip,
    "-frames:v", "1", "-vf", "scale='min(640,iw)':-2", "-c:v", "libwebp", "-quality", "74", out,
  ]);
  if (r.status === 0 && existsSync(out)) { ok++; bytes += statSync(out).size; } else { failed++; console.warn("! falhou:", path.relative(ROOT, clip)); }
}
console.log(`capas criadas: ${ok} (${(bytes / 1024).toFixed(0)} KB no total) | já existiam: ${skipped} | falhas: ${failed}`);
