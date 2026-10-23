/**
 * Sobe os arquivos de mídia pesados (que não vão para o git) para o Cloudflare R2, mantendo o caminho relativo a `public/`:
 *   - public/videos/*_720p.webm          (vídeos completos usados com #t=início,fim)
 *   - public/assets/media/**\/*.webm      (clipes de troféus/lutadores)
 *   - public/audio/trophy-gallery.*      (trilha de 1 hora)
 * Os MP4 originais NÃO sobem (8 GB, só servem para os scripts de timestamp).
 *
 * Variáveis (.env.local): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *
 *   npx tsx --env-file=.env.local scripts/admin/upload-media-to-r2.ts --dry-run   # só lista o que subiria
 *   npx tsx --env-file=.env.local scripts/admin/upload-media-to-r2.ts             # envia (pula o que já existe com o mesmo tamanho)
 *
 * Depois: NEXT_PUBLIC_CDN_BASE_URL=https://pub-xxxx.r2.dev no .env.local E na Vercel, e Redeploy.
 */
import fs from "node:fs";
import path from "node:path";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const DRY = process.argv.includes("--dry-run");
const PUBLIC = path.join(process.cwd(), "public");
const { R2_ACCOUNT_ID: ACCOUNT, R2_ACCESS_KEY_ID: KEY, R2_SECRET_ACCESS_KEY: SECRET, R2_BUCKET_NAME: BUCKET } = process.env;

const TYPES: Record<string, string> = { ".webm": "video/webm", ".mp3": "audio/mpeg", ".ogg": "audio/ogg" };

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

function collect(): string[] {
  const files = [
    ...walk(path.join(PUBLIC, "videos")).filter(f => f.endsWith("_720p.webm")),
    ...walk(path.join(PUBLIC, "assets", "media")).filter(f => f.endsWith(".webm")),
    ...walk(path.join(PUBLIC, "audio")).filter(f => /trophy-gallery\.(webm|mp3|ogg)$/.test(f)),
  ];
  return files.sort();
}

const keyOf = (f: string) => path.relative(PUBLIC, f).split(path.sep).join("/");
const mb = (n: number) => (n / 1048576).toFixed(1);

async function main() {
  const files = collect();
  const total = files.reduce((s, f) => s + fs.statSync(f).size, 0);
  console.log(`${files.length} arquivos, ${(total / 1073741824).toFixed(2)} GB (o plano grátis do R2 guarda 10 GB)${DRY ? " [simulação]" : ""}`);
  if (DRY) {
    files.slice(0, 8).forEach(f => console.log(`  ${keyOf(f)}  ${mb(fs.statSync(f).size)} MB`));
    if (files.length > 8) console.log(`  ... e mais ${files.length - 8}`);
    return;
  }
  if (!ACCOUNT || !KEY || !SECRET || !BUCKET) {
    console.error("Configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY e R2_BUCKET_NAME no .env.local");
    process.exit(1);
  }
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: KEY, secretAccessKey: SECRET },
  });

  let up = 0, skip = 0, fail = 0;
  for (const f of files) {
    const key = keyOf(f);
    const size = fs.statSync(f).size;
    try {
      const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
      if (head.ContentLength === size) { skip++; continue; }
    } catch { /* não existe: sobe */ }
    try {
      await new Upload({
        client: s3,
        params: {
          Bucket: BUCKET, Key: key, Body: fs.createReadStream(f),
          ContentType: TYPES[path.extname(f)] ?? "application/octet-stream",
          CacheControl: "public, max-age=31536000, immutable",
        },
      }).done();
      up++;
      console.log(`  ✓ ${key} (${mb(size)} MB)`);
    } catch (e) {
      fail++;
      console.error(`  ✗ ${key}: ${(e as Error).message}`);
    }
  }
  console.log(`\nFeito: ${up} enviados, ${skip} já estavam lá, ${fail} com erro.`);
}

main().catch(e => { console.error(e); process.exit(1); });
