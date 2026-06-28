/**
 * Faz upload dos arquivos trophy_360_*.webm para o Cloudflare R2 (S3-compatible).
 *
 * Pré-requisito: npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
 *
 * Variáveis de ambiente necessárias (.env.local):
 *   R2_ACCOUNT_ID       — Account ID do Cloudflare (dashboard → R2)
 *   R2_ACCESS_KEY_ID    — R2 API Token → Access Key ID
 *   R2_SECRET_ACCESS_KEY — R2 API Token → Secret Access Key
 *   R2_BUCKET_NAME      — Nome do bucket (ex: smash-compendium)
 *
 * Após criar o bucket, habilitar "Public Access" e copiar o URL público:
 *   https://pub-{hash}.r2.dev  →  NEXT_PUBLIC_CDN_BASE_URL
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/upload-trophy360-to-r2.ts
 *
 * Os arquivos sobem mantendo o path relativo:
 *   local:  public/assets/media/SSBM/gifs/trophy_360_1.webm
 *   CDN:    https://pub-xxx.r2.dev/assets/media/SSBM/gifs/trophy_360_1.webm
 *
 * Total: ~293 arquivos, ~667 MB — cabe no free tier do R2 (10 GB).
 */

import fs from "fs";
import path from "path";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const ACCOUNT_ID    = process.env.R2_ACCOUNT_ID!;
const ACCESS_KEY    = process.env.R2_ACCESS_KEY_ID!;
const SECRET_KEY    = process.env.R2_SECRET_ACCESS_KEY!;
const BUCKET        = process.env.R2_BUCKET_NAME!;
const LOCAL_ROOT    = path.join(process.cwd(), "public");
const TROPHY_DIR    = path.join(LOCAL_ROOT, "assets/media/SSBM/gifs");
const PATTERN       = /^trophy_360_\d+\.webm$/;

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY || !BUCKET) {
  console.error("❌ Configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME no .env.local");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

async function alreadyUploaded(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!fs.existsSync(TROPHY_DIR)) {
    console.error(`❌ Diretório não encontrado: ${TROPHY_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(TROPHY_DIR)
    .filter(f => PATTERN.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)![0]);
      const nb = parseInt(b.match(/\d+/)![0]);
      return na - nb;
    });

  console.log(`\nUpload de ${files.length} arquivos trophy_360 → R2 bucket "${BUCKET}"\n`);

  let done = 0;
  let skipped = 0;

  for (const file of files) {
    const localPath = path.join(TROPHY_DIR, file);
    const r2Key = `assets/media/SSBM/gifs/${file}`;  // sem leading slash

    if (await alreadyUploaded(r2Key)) {
      process.stdout.write(`  SKIP ${file}\r`);
      skipped++;
      continue;
    }

    const stream = fs.createReadStream(localPath);
    const sizeMB = (fs.statSync(localPath).size / (1024 * 1024)).toFixed(1);

    process.stdout.write(`  UP   ${file} (${sizeMB} MB)...\r`);

    try {
      const upload = new Upload({
        client: s3,
        params: {
          Bucket:      BUCKET,
          Key:         r2Key,
          Body:        stream,
          ContentType: "video/webm",
          CacheControl: "public, max-age=31536000, immutable",
        },
      });
      await upload.done();
      console.log(`  ✓    ${file} (${sizeMB} MB)`);
      done++;
    } catch (err) {
      console.error(`  ✗    ${file}: ${err}`);
    }
  }

  console.log(`\nFeito: ${done} uploads, ${skipped} já existiam.`);
  console.log(`\nPróximo passo:`);
  console.log(`  1. No dashboard R2, habilitar "Public Access" no bucket`);
  console.log(`  2. Copiar o Public URL (https://pub-xxx.r2.dev)`);
  console.log(`  3. Adicionar ao .env.local: NEXT_PUBLIC_CDN_BASE_URL=https://pub-xxx.r2.dev`);
  console.log(`  4. Adicionar a mesma var nas Environment Variables do Vercel`);
  console.log(`  5. Redeploy no Vercel → trophy_360 webms carregam do CDN`);
}

main().catch(err => { console.error(err); process.exit(1); });
