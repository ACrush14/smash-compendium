/**
 * Baixa as imagens dos troféus (ssb.wiki.gallery) uma única vez e gera versões leves em WebP:
 *   public/assets/trophies/<nome>.webp         (≤512px — tamanho de exibição, 2x)
 *   public/assets/trophies/thumbs/<nome>.webp  (≤128px — listas e carrosséis)
 * O site usa essas versões via fullImageUrl()/thumbUrl() (lib/media-config.ts) e cai de volta para a URL
 * original se o arquivo local não existir. Não altera o banco. Retoma de onde parou (pula o que já existe).
 *
 *   npx tsx --env-file=.env.local scripts/admin/download-trophy-images.ts
 *   npx tsx --env-file=.env.local scripts/admin/download-trophy-images.ts --limit 20   # teste
 */
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { db } from "../../lib/db";
import { wikiImageKey } from "../../lib/media-config";

const OUT = path.join(process.cwd(), "public", "assets", "trophies");
const THUMBS = path.join(OUT, "thumbs");
const FAILED = path.join(process.cwd(), "data", "trophy-images-failed.json");
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;

async function fetchBuffer(url: string): Promise<Buffer> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "SmashCompendium/1.0 (projeto academico fan-made)" } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if ((res.status === 429 || res.status >= 500) && attempt < 5) { await sleep(3000 * 2 ** attempt); continue; }
    throw new Error(`HTTP ${res.status}`);
  }
}

async function main() {
  mkdirSync(THUMBS, { recursive: true });
  const rows = await db.collectible.findMany({
    where: { type: "TROPHY" },
    select: { assetRenderUrl: true, assetRender2Url: true },
  });
  const urls = new Map<string, string>(); // key -> url
  for (const r of rows) for (const u of [r.assetRenderUrl, r.assetRender2Url]) {
    const key = u ? wikiImageKey(u) : null;
    if (u && key && !urls.has(key)) urls.set(key, u);
  }
  const todo = [...urls].filter(([k]) => !existsSync(path.join(OUT, `${k}.webp`)) || !existsSync(path.join(THUMBS, `${k}.webp`))).slice(0, LIMIT);
  console.log(`${urls.size} imagens únicas de troféu; ${todo.length} a baixar.`);

  const failed: { url: string; error: string }[] = [];
  let done = 0, bytesIn = 0, bytesOut = 0;
  for (const [key, url] of todo) {
    try {
      const buf = await fetchBuffer(url);
      bytesIn += buf.length;
      const full = await sharp(buf).resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true }).webp({ quality: 88, effort: 5 }).toBuffer();
      const thumb = await sharp(buf).resize({ width: 128, height: 128, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      writeFileSync(path.join(OUT, `${key}.webp`), full);
      writeFileSync(path.join(THUMBS, `${key}.webp`), thumb);
      bytesOut += full.length + thumb.length;
    } catch (e) {
      failed.push({ url, error: String(e) });
      console.warn(`! ${key}: ${e}`);
    }
    if (++done % 50 === 0) console.log(`${done}/${todo.length}  ${(bytesIn / 1048576).toFixed(0)} MB baixados → ${(bytesOut / 1048576).toFixed(0)} MB gravados`);
    await sleep(1600 + Math.random() * 400); // respeita o servidor da wiki
  }
  if (failed.length) writeFileSync(FAILED, JSON.stringify(failed, null, 2));
  console.log(`Concluído: ${done - failed.length} ok, ${failed.length} falhas. ${(bytesIn / 1048576).toFixed(0)} MB → ${(bytesOut / 1048576).toFixed(0)} MB`);
  process.exit(0);
}

main();
