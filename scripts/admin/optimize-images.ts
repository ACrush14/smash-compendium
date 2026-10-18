/**
 * Otimiza as imagens locais de public/assets/collectibles (spirits, stickers, sprites):
 *   1. reduz para no máximo MAX_SIDE px no maior lado (PNG sem perdas — mantém transparência e nitidez);
 *   2. gera miniaturas WebP em public/assets/collectibles/thumbs/<nome>.webp (máx. THUMB_SIDE px) para as listas.
 * Os originais maiores são copiados para scratch/images-originals/ antes de serem substituídos.
 *
 *   npx tsx scripts/admin/optimize-images.ts            # aplica
 *   npx tsx scripts/admin/optimize-images.ts --dry-run  # só mostra a economia estimada
 */
import sharp from "sharp";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "assets", "collectibles");
const THUMBS = path.join(DIR, "thumbs");
const MD = path.join(DIR, "md"); // versão WebP de ≤512px dos spirits (imagem aberta no viewer)
const BACKUP = path.join(process.cwd(), "scratch", "images-originals");
const MAX_SIDE = 600;   // maior exibição é ~256px CSS; 600px cobre telas 2x com folga
const THUMB_SIDE = 128; // listas mostram 32–44px; 128px cobre telas 3x
const DRY = process.argv.includes("--dry-run");

async function main() {
  mkdirSync(THUMBS, { recursive: true });
  mkdirSync(MD, { recursive: true });
  mkdirSync(BACKUP, { recursive: true });
  const files = readdirSync(DIR).filter(f => /\.(png|jpe?g)$/i.test(f));
  let before = 0, after = 0, resized = 0, thumbs = 0, bad = 0;

  for (const f of files) {
    const src = path.join(DIR, f);
    const size = statSync(src).size;
    before += size;
    let meta;
    try { meta = await sharp(src).metadata(); } catch { bad++; after += size; console.warn(`! ilegível, ignorado: ${f}`); continue; }
    const side = Math.max(meta.width ?? 0, meta.height ?? 0);

    // 1) reduzir o arquivo principal
    let finalSize = size;
    if (side > MAX_SIDE) {
      const isPng = /\.png$/i.test(f);
      const pipeline = sharp(src).resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", kernel: "lanczos3" });
      const buf = await (isPng
        ? pipeline.png({ compressionLevel: 9, effort: 10 })
        : pipeline.jpeg({ quality: 88, mozjpeg: true })).toBuffer();
      if (buf.length < size) {
        finalSize = buf.length; resized++;
        if (!DRY) {
          const bak = path.join(BACKUP, f);
          try {
            if (!existsSync(bak)) copyFileSync(src, bak);
            writeFileSync(src, buf);
          } catch (e) {
            // arquivo travado por outro processo (dev server/antivírus): mantém o original e segue
            console.warn(`! não consegui gravar ${f}: ${(e as Error).message}`);
            finalSize = size; resized--;
          }
        }
      }
    }
    after += finalSize;

    // 2) miniatura WebP (com alpha) para as listas
    const thumbPath = path.join(THUMBS, f.replace(/\.(png|jpe?g)$/i, ".webp"));
    if (!DRY && !existsSync(thumbPath)) {
      await sharp(src).resize({ width: THUMB_SIDE, height: THUMB_SIDE, fit: "inside" }).webp({ quality: 82, alphaQuality: 90 }).toFile(thumbPath);
      thumbs++;
    }

    // 3) versão ≤512px em WebP para os spirits (PNG de ~160 KB -> ~23 KB)
    const mdPath = path.join(MD, f.replace(/\.(png|jpe?g)$/i, ".webp"));
    if (!DRY && /^SPIRIT-/.test(f) && !existsSync(mdPath)) {
      await sharp(src).resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toFile(mdPath);
    }
  }
  const mb = (n: number) => (n / 1048576).toFixed(0);
  console.log(`${files.length} imagens (${bad} ilegíveis). Reduzidas: ${resized}. Miniaturas novas: ${thumbs}.`);
  console.log(`Antes: ${mb(before)} MB → depois: ${mb(after)} MB (economia ${mb(before - after)} MB)${DRY ? " [simulação]" : ""}`);
}

main();
