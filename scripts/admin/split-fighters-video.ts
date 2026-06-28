/**
 * Quebra full_video_Zoomzike.mp4 em um clip por lutador Melee.
 *
 * Pré-requisito: ffmpeg instalado e no PATH.
 * Uso: npx tsx --env-file=.env.local scripts/admin/split-fighters-video.ts
 *
 * Output: public/videos/clips/ssbm_{slug}.mp4
 *
 * Após o upload ao CDN:
 *   - Set NEXT_PUBLIC_CDN_BASE_URL em .env.local e Vercel
 *   - Para cada fighter, atualizar Bio.videoStartSec = 0, videoEndSec = duração do clip
 *   - OU manter os timestamps originais e apontar para o full video no CDN
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { db } from "../lib/db";

const INPUT = path.join(process.cwd(), "public/videos/full_video_Zoomzike.mp4");
const OUTPUT_DIR = path.join(process.cwd(), "public/videos/clips");

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`❌ Arquivo não encontrado: ${INPUT}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const fighters = await db.fighter.findMany({
    where: { bios: { some: { smashGameVersion: "SSBM" } } },
    include: { bios: { where: { smashGameVersion: "SSBM" } } },
    orderBy: { name: "asc" },
  });

  let done = 0;
  let skipped = 0;

  for (const f of fighters) {
    const bio = f.bios[0];
    if (!bio?.videoStartSec || !bio?.videoEndSec) {
      console.log(`  SKIP ${f.name} — sem timestamps`);
      skipped++;
      continue;
    }

    const slug = f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const out = path.join(OUTPUT_DIR, `ssbm_${slug}.mp4`);

    if (fs.existsSync(out)) {
      console.log(`  EXISTS ${f.name} (${out})`);
      done++;
      continue;
    }

    const cmd = [
      "ffmpeg",
      `-ss ${bio.videoStartSec}`,
      `-to ${bio.videoEndSec}`,
      `-i "${INPUT}"`,
      `-c copy`,              // sem re-encode — instantâneo
      `"${out}"`,
      `-y`,
    ].join(" ");

    console.log(`  CUT ${f.name}: ${bio.videoStartSec}s → ${bio.videoEndSec}s`);
    try {
      execSync(cmd, { stdio: "pipe" });
      const size = (fs.statSync(out).size / (1024 * 1024)).toFixed(1);
      console.log(`    ✓ ${out} (${size} MB)`);
      done++;
    } catch (err) {
      console.error(`    ✗ Falha: ${err}`);
    }
  }

  console.log(`\nFeito: ${done} clips criados, ${skipped} sem timestamps.`);
  console.log(`Clips em: ${OUTPUT_DIR}`);
  console.log(`\nPróximo passo:`);
  console.log(`  1. Upload clips para CDN (Cloudflare R2, etc.)`);
  console.log(`  2. Set NEXT_PUBLIC_CDN_BASE_URL=https://pub-xxx.r2.dev no .env.local e Vercel`);
  console.log(`  3. Se clips hospedados em /videos/clips/ssbm_{slug}.mp4 no CDN, a URL automática resolve.`);

  await db.$disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
