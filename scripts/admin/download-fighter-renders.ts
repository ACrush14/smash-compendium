/**
 * Baixa as renders dos lutadores (ssb.wiki.gallery/…/Nome_SSBU.png — PNGs de 4389×4389, ~7 MB cada)
 * e gera versões leves em WebP:
 *   public/assets/renders/<nome>.webp          (≤1024px — ficha do lutador)
 *   public/assets/renders/md/<nome>.webp       (≤400px  — cartões da grade /fighters)
 *   public/assets/renders/thumbs/<nome>.webp   (≤128px  — carrossel)
 * O site usa essas versões via localImageUrl() (lib/media-config.ts), com fallback para a URL original.
 * Não altera o banco. Retoma de onde parou.
 *
 *   npx tsx --env-file=.env.local scripts/admin/download-fighter-renders.ts
 */
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { db } from "../../lib/db";
import { wikiImageKey } from "../../lib/media-config";

const OUT = path.join(process.cwd(), "public", "assets", "renders");
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchBuffer(url: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "SmashCompendium/1.0 (projeto academico fan-made)" } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if ((res.status === 429 || res.status >= 500) && attempt < 5) { await sleep(3000 * 2 ** attempt); continue; }
    throw new Error(`HTTP ${res.status}`);
  }
}

async function main() {
  for (const d of ["", "md", "thumbs"]) mkdirSync(path.join(OUT, d), { recursive: true });
  const fighters = await db.fighter.findMany({ where: { imageUrl: { not: null } }, select: { imageUrl: true } });
  const urls = new Map<string, string>();
  for (const f of fighters) {
    const k = f.imageUrl ? wikiImageKey(f.imageUrl) : null;
    if (k && /_SSBU$/i.test(k) && f.imageUrl) urls.set(k, f.imageUrl);
  }
  const missing = (k: string) => ["", "md", "thumbs"].some(d => !existsSync(path.join(OUT, d, `${k}.webp`)));
  const todo = [...urls].filter(([k]) => missing(k));
  console.log(`${urls.size} renders; ${todo.length} a baixar.`);

  let ok = 0, failed = 0, bytesIn = 0, bytesOut = 0;
  for (const [key, url] of todo) {
    try {
      const buf = await fetchBuffer(url);
      bytesIn += buf.length;
      const base = sharp(buf, { limitInputPixels: false });
      const full = await base.clone().resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true }).webp({ quality: 86, effort: 5 }).toBuffer();
      const md = await base.clone().resize({ width: 400, height: 400, fit: "inside", withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toBuffer();
      const thumb = await base.clone().resize({ width: 128, height: 128, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      writeFileSync(path.join(OUT, `${key}.webp`), full);
      writeFileSync(path.join(OUT, "md", `${key}.webp`), md);
      writeFileSync(path.join(OUT, "thumbs", `${key}.webp`), thumb);
      bytesOut += full.length + md.length + thumb.length;
      ok++;
    } catch (e) {
      failed++;
      console.warn(`! ${key}: ${e}`);
    }
    if ((ok + failed) % 10 === 0) console.log(`${ok + failed}/${todo.length}  ${(bytesIn / 1048576).toFixed(0)} MB → ${(bytesOut / 1048576).toFixed(1)} MB`);
    await sleep(1600 + Math.random() * 400);
  }
  console.log(`Concluído: ${ok} ok, ${failed} falhas. ${(bytesIn / 1048576).toFixed(0)} MB → ${(bytesOut / 1048576).toFixed(1)} MB`);
  process.exit(0);
}

main();
