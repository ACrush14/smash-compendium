import { db } from "../../lib/db";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, extname } from "path";
import { log, sleep } from "../scrapers/utils";

const DELAY_MS = 3000;
const OUTPUT_DIR = join(process.cwd(), "public", "assets", "collectibles");
const USER_AGENT = "SmashCompendiumBot/1.0 (academic research; github.com/smash-compendium)";

function localPath(orderIndex: number, imageUrl: string): string {
  const ext = extname(new URL(imageUrl).pathname) || ".png";
  return `STICKER-SSBB-${String(orderIndex).padStart(3, "0")}${ext}`;
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.warn(`  [HTTP ${res.status}] ${url}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(destPath, buffer);
    return true;
  } catch (e: any) {
    console.warn(`  [ERR] ${url} — ${e.message}`);
    return false;
  }
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load all stickers with SSBWiki URLs, deduplicated by orderIndex
  const all = await db.collectible.findMany({
    where: { type: "STICKER", assetRenderUrl: { startsWith: "https://ssb.wiki.gallery" } },
    select: { id: true, orderIndex: true, assetRenderUrl: true, name: true },
    orderBy: { orderIndex: "asc" },
  });

  // Deduplicate by orderIndex — only download one image per index
  const seenIdx = new Set<number>();
  const toDownload = all.filter(s => {
    if (!s.orderIndex) return false;
    if (seenIdx.has(s.orderIndex)) return false;
    seenIdx.add(s.orderIndex);
    return true;
  });

  log.step(`${toDownload.length} unique sticker images to download (~${Math.round(toDownload.length * (DELAY_MS + 300) / 60000)} min)`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const sticker of toDownload) {
    const filename = localPath(sticker.orderIndex!, sticker.assetRenderUrl!);
    const destPath = join(OUTPUT_DIR, filename);
    const localUrl = `/assets/collectibles/${filename}`;

    if (existsSync(destPath)) {
      // Already downloaded — just update DB records to point to local path
      await db.collectible.updateMany({
        where: { type: "STICKER", orderIndex: sticker.orderIndex! },
        data: { assetRenderUrl: localUrl },
      });
      skipped++;
    } else {
      const ok = await downloadImage(sticker.assetRenderUrl!, destPath);
      if (ok) {
        // Update ALL DB records with this orderIndex to the local path
        await db.collectible.updateMany({
          where: { type: "STICKER", orderIndex: sticker.orderIndex! },
          data: { assetRenderUrl: localUrl },
        });
        downloaded++;
        if (downloaded % 25 === 0) {
          log.ok(`  ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
        }
        await sleep(DELAY_MS);
      } else {
        failed++;
      }
    }
  }

  log.ok(`Done — downloaded: ${downloaded}, already existed: ${skipped}, failed: ${failed}`);
  if (failed > 0) console.log("Re-run the script to retry failed downloads.");
}

main().catch(console.error);
