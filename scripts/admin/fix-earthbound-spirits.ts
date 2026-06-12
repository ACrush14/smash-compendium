/**
 * Patch — baixa e atualiza spirits da série EarthBound que faltaram
 * no scraper principal (URL estava incorreta: EarthBound_%2F_Mother_series → EarthBound_series)
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log, sleep } from "../scrapers/utils";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, extname } from "path";

const OUTPUT_DIR = join(process.cwd(), "public", "assets", "collectibles");
const USER_AGENT = "SmashCompendiumBot/1.0 (academic research; github.com/smash-compendium)";
const IMG_DELAY_MS = 3_000;
const PAGE_URL = "https://www.ssbwiki.com/List_of_spirits_(EarthBound_series)";

function toFullRes(thumbUrl: string): string {
  return thumbUrl.replace(/\/thumb\//, "/").replace(/\/\d+px-[^/]+$/, "");
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

interface WikiSpirit {
  number: number | null;
  name: string;
  imageUrl: string;
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) { console.warn(`  [HTTP ${res.status}] ${url}`); return false; }
    writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch (e: any) {
    console.warn(`  [ERR] ${String(e.message).substring(0, 80)}`);
    return false;
  }
}

async function main() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  log.step("Scraping EarthBound series page…");
  const $ = await fetchHtml(PAGE_URL);

  const scraped: WikiSpirit[] = [];
  $("table.wikitable tbody tr").each((_i, row) => {
    const cells = $("td", row).toArray();
    if (cells.length < 2) return;

    const numText = cleanText($(cells[0]!).text()).replace(/,/g, "");
    const number = parseInt(numText.replace(/\D/g, ""), 10) || null;

    const imgEl = $("img", cells[1]!).first();
    if (!imgEl.length) return;
    const rawSrc = imgEl.attr("data-src") ?? imgEl.attr("src") ?? "";
    if (!rawSrc || !rawSrc.includes("SSBU_spirit")) return;
    const src = rawSrc.startsWith("//") ? `https:${rawSrc}` : rawSrc;
    const imageUrl = toFullRes(src);

    let name = "";
    for (let j = 2; j < cells.length; j++) {
      const text = cleanText($(cells[j]!).text());
      if (text.length > 0 && text.length < 120 && !/^\d+$/.test(text)) {
        name = text;
        break;
      }
    }
    if (!name || !imageUrl) return;
    scraped.push({ number, name, imageUrl });
  });

  log.ok(`Scraped ${scraped.length} EarthBound spirits`);
  scraped.forEach(s => console.log(`  #${s.number} "${s.name}"`));

  // Build lookup maps
  const byNumber = new Map<number, WikiSpirit>();
  const byName   = new Map<string, WikiSpirit>();
  for (const s of scraped) {
    if (s.number !== null) byNumber.set(s.number, s);
    const key = normalize(s.name);
    if (!byName.has(key)) byName.set(key, s);
  }

  // Load only unmatched DB spirits (no assetRenderUrl or path is not a local one yet for these numbers)
  log.step("Loading DB spirits without correct images…");
  const dbSpirits = await db.collectible.findMany({
    where: { type: "SPIRIT" },
    select: { id: true, name: true, posicaoSpiritSsbu: true, assetRenderUrl: true },
  });

  const assignments = new Map<string, WikiSpirit>();
  // Pass 1: match by number
  for (const s of dbSpirits) {
    if (s.posicaoSpiritSsbu && byNumber.has(s.posicaoSpiritSsbu)) {
      assignments.set(s.id, byNumber.get(s.posicaoSpiritSsbu)!);
    }
  }
  // Pass 2: match by name for any still unmatched
  for (const s of dbSpirits) {
    if (assignments.has(s.id)) continue;
    const wiki = byName.get(normalize(s.name));
    if (wiki) assignments.set(s.id, wiki);
  }

  log.ok(`Matched ${assignments.size} DB spirits to EarthBound wiki entries`);

  // Download unique images
  log.step("Downloading images…");
  const urlToFilename = new Map<string, string>();
  for (const [, wiki] of assignments) {
    if (!urlToFilename.has(wiki.imageUrl)) {
      const ext = extname(new URL(wiki.imageUrl).pathname) || ".png";
      const numStr = wiki.number !== null
        ? String(wiki.number).padStart(4, "0")
        : normalize(wiki.name).substring(0, 40);
      urlToFilename.set(wiki.imageUrl, `SPIRIT-SSBU-${numStr}${ext}`);
    }
  }

  let dlOk = 0, dlSkip = 0, dlFail = 0;
  for (const [url, filename] of urlToFilename) {
    const destPath = join(OUTPUT_DIR, filename);
    if (existsSync(destPath)) {
      dlSkip++;
      console.log(`  skip ${filename}`);
    } else {
      const ok = await downloadImage(url, destPath);
      if (ok) { dlOk++; console.log(`  ok   ${filename}`); }
      else     { dlFail++; }
      await sleep(IMG_DELAY_MS);
    }
  }
  log.ok(`Download done — ok: ${dlOk}, skipped: ${dlSkip}, failed: ${dlFail}`);

  // Update DB
  log.step("Updating DB…");
  let updated = 0;
  for (const spirit of dbSpirits) {
    const wiki = assignments.get(spirit.id);
    if (!wiki) continue;
    const filename = urlToFilename.get(wiki.imageUrl);
    if (!filename) continue;
    const localUrl = `/assets/collectibles/${filename}`;
    await db.collectible.update({
      where: { id: spirit.id },
      data: { assetRenderUrl: localUrl },
    });
    updated++;
  }
  log.ok(`DB update done — updated: ${updated}`);
}

main().catch(console.error);
