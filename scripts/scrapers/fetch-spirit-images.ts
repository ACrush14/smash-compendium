/**
 * Scraper — Spirit images from SSBWiki series pages
 *
 * Fontes (by series + special types + DLC):
 *   https://www.ssbwiki.com/List_of_spirits_(Super_Mario_series) etc.
 *
 * Estratégia:
 *   1. Scrape todas as ~45 páginas → mapa spiritNumber → imageUrl
 *   2. Match DB spirits por posicaoSpiritSsbu (pass 1) ou nome (pass 2)
 *   3. Download local com delay 3s/imagem
 *   4. Atualiza DB com path local
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log, sleep, politeDelay } from "./utils";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, extname } from "path";

const OUTPUT_DIR = join(process.cwd(), "public", "assets", "collectibles");
const USER_AGENT = "SmashCompendiumBot/1.0 (academic research; github.com/smash-compendium)";
const PAGE_DELAY_MS = 5_000;
const IMG_DELAY_MS  = 3_000;

// ─── Source pages ─────────────────────────────────────────────────────────────

const BASE = "https://www.ssbwiki.com";

const SERIES_PAGES = [
  // Base game — by series
  `${BASE}/List_of_spirits_(Super_Mario_series)`,
  `${BASE}/List_of_spirits_(Donkey_Kong_series)`,
  `${BASE}/List_of_spirits_(The_Legend_of_Zelda_series)`,
  `${BASE}/List_of_spirits_(Metroid_series)`,
  `${BASE}/List_of_spirits_(Yoshi_series)`,
  `${BASE}/List_of_spirits_(Kirby_series)`,
  `${BASE}/List_of_spirits_(Star_Fox_series)`,
  `${BASE}/List_of_spirits_(Pok%C3%A9mon_series)`,
  `${BASE}/List_of_spirits_(EarthBound_%2F_Mother_series)`,
  `${BASE}/List_of_spirits_(F-Zero_series)`,
  `${BASE}/List_of_spirits_(Ice_Climber_series)`,
  `${BASE}/List_of_spirits_(Fire_Emblem_series)`,
  `${BASE}/List_of_spirits_(Game_%26_Watch_series)`,
  `${BASE}/List_of_spirits_(Kid_Icarus_series)`,
  `${BASE}/List_of_spirits_(Wario_series)`,
  `${BASE}/List_of_spirits_(Metal_Gear_series)`,
  `${BASE}/List_of_spirits_(Sonic_the_Hedgehog_series)`,
  `${BASE}/List_of_spirits_(Pikmin_series)`,
  `${BASE}/List_of_spirits_(R.O.B._series)`,
  `${BASE}/List_of_spirits_(Animal_Crossing_series)`,
  `${BASE}/List_of_spirits_(Mega_Man_series)`,
  `${BASE}/List_of_spirits_(Wii_Fit_series)`,
  `${BASE}/List_of_spirits_(Punch-Out!!_series)`,
  `${BASE}/List_of_spirits_(Pac-Man_series)`,
  `${BASE}/List_of_spirits_(Xenoblade_Chronicles_series)`,
  `${BASE}/List_of_spirits_(Duck_Hunt_series)`,
  `${BASE}/List_of_spirits_(Street_Fighter_series)`,
  `${BASE}/List_of_spirits_(Final_Fantasy_series)`,
  `${BASE}/List_of_spirits_(Bayonetta_series)`,
  `${BASE}/List_of_spirits_(Splatoon_series)`,
  `${BASE}/List_of_spirits_(Castlevania_series)`,
  `${BASE}/List_of_spirits_(Mii_series)`,
  `${BASE}/List_of_spirits_(Super_Smash_Bros._series)`,
  `${BASE}/List_of_spirits_(Others)`,
  // Special types
  `${BASE}/Fighter_spirit`,
  `${BASE}/Master_spirit`,
  `${BASE}/Summon`,
  // DLC
  `${BASE}/Downloadable_content_(SSBU)/List_of_DLC_Spirits`,
  `${BASE}/List_of_spirits_(Persona_series)`,
  `${BASE}/List_of_spirits_(Dragon_Quest_series)`,
  `${BASE}/List_of_spirits_(Banjo-Kazooie_series)`,
  `${BASE}/List_of_spirits_(Fatal_Fury_series)`,
  `${BASE}/List_of_spirits_(ARMS_series)`,
  `${BASE}/List_of_spirits_(Minecraft_series)`,
  `${BASE}/List_of_spirits_(Tekken_series)`,
  `${BASE}/List_of_spirits_(Kingdom_Hearts_series)`,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Page parser ──────────────────────────────────────────────────────────────

function parseSpiritPage($: ReturnType<typeof import("cheerio").load>): WikiSpirit[] {
  const results: WikiSpirit[] = [];

  $("table.wikitable tbody tr").each((_i, row) => {
    const cells = $("td", row).toArray();
    if (cells.length < 2) return;

    // Col 0: spirit number (may be empty for some rows)
    const numText = cleanText($(cells[0]!).text()).replace(/,/g, "");
    const number = parseInt(numText.replace(/\D/g, ""), 10) || null;

    // Col 1: spirit image (always first image column)
    // Fighter spirit pages have col 1 = spirit image, col 2 = alternate artwork
    const imgEl = $("img", cells[1]!).first();
    if (!imgEl.length) return;

    const rawSrc = imgEl.attr("data-src") ?? imgEl.attr("src") ?? "";
    if (!rawSrc || !rawSrc.includes("SSBU_spirit")) return; // skip non-spirit images

    const src = rawSrc.startsWith("//") ? `https:${rawSrc}` : rawSrc;
    const imageUrl = toFullRes(src);

    // Name: first cell with meaningful text that isn't just a number
    let name = "";
    for (let j = 2; j < cells.length; j++) {
      const text = cleanText($(cells[j]!).text());
      if (text.length > 0 && text.length < 120 && !/^\d+$/.test(text)) {
        name = text;
        break;
      }
    }

    if (!name || !imageUrl) return;
    results.push({ number, name, imageUrl });
  });

  return results;
}

// ─── Download ─────────────────────────────────────────────────────────────────

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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  // ── Phase 1: scrape all pages ──────────────────────────────────────────────
  log.step(`Scraping ${SERIES_PAGES.length} pages…`);

  // byNumber: spiritNumber → best WikiSpirit (first seen wins)
  const byNumber = new Map<number, WikiSpirit>();
  // byName: normalizedName → WikiSpirit (first seen wins per name)
  const byName   = new Map<string, WikiSpirit>();

  for (const url of SERIES_PAGES) {
    try {
      const $ = await fetchHtml(url);
      const spirits = parseSpiritPage($);

      for (const s of spirits) {
        if (s.number !== null && !byNumber.has(s.number)) {
          byNumber.set(s.number, s);
        }
        const key = normalize(s.name);
        if (!byName.has(key)) byName.set(key, s);
      }

      console.log(`  ✓ ${url.split("/").pop()} → ${spirits.length} spirits`);
    } catch (e: any) {
      console.warn(`  ✗ ${url.split("/").pop()} → ${String(e.message).substring(0, 60)}`);
    }

    await sleep(PAGE_DELAY_MS);
  }

  log.ok(`Scraped: ${byNumber.size} by number, ${byName.size} by name`);

  // ── Phase 2: match DB spirits ──────────────────────────────────────────────
  log.step("Loading DB spirits…");
  const dbSpirits = await db.collectible.findMany({
    where: { type: "SPIRIT" },
    select: { id: true, name: true, posicaoSpiritSsbu: true },
    orderBy: { posicaoSpiritSsbu: "asc" },
  });

  const assignments = new Map<string, WikiSpirit>(); // dbId → wiki entry

  // Pass 1: match by posicaoSpiritSsbu
  for (const s of dbSpirits) {
    if (s.posicaoSpiritSsbu && byNumber.has(s.posicaoSpiritSsbu)) {
      assignments.set(s.id, byNumber.get(s.posicaoSpiritSsbu)!);
    }
  }

  // Pass 2: match by normalized name for unmatched
  for (const s of dbSpirits) {
    if (assignments.has(s.id)) continue;
    const key = normalize(s.name);
    const wiki = byName.get(key);
    if (wiki) assignments.set(s.id, wiki);
  }

  log.ok(`Matched: ${assignments.size} / ${dbSpirits.length} spirits`);

  // ── Phase 3: download images ───────────────────────────────────────────────
  log.step("Downloading images…");

  // Collect unique imageUrls to download (deduplicate)
  const urlToLocalPath = new Map<string, string>(); // imageUrl → local filename
  for (const [, wiki] of assignments) {
    if (!urlToLocalPath.has(wiki.imageUrl)) {
      const ext = extname(new URL(wiki.imageUrl).pathname) || ".png";
      // Use the spirit number if available, else a slug of the name
      const numStr = wiki.number !== null
        ? String(wiki.number).padStart(4, "0")
        : normalize(wiki.name).substring(0, 40);
      urlToLocalPath.set(wiki.imageUrl, `SPIRIT-SSBU-${numStr}${ext}`);
    }
  }

  let dlOk = 0, dlSkip = 0, dlFail = 0;
  const entries = [...urlToLocalPath.entries()];

  for (let i = 0; i < entries.length; i++) {
    const [url, filename] = entries[i]!;
    const destPath = join(OUTPUT_DIR, filename);

    if (existsSync(destPath)) {
      dlSkip++;
    } else {
      const ok = await downloadImage(url, destPath);
      if (ok) { dlOk++; } else { dlFail++; }
      await sleep(IMG_DELAY_MS);
    }

    if ((dlOk + dlSkip) % 50 === 0 && (dlOk + dlSkip) > 0) {
      log.ok(`  ${dlOk} downloaded, ${dlSkip} skipped, ${dlFail} failed (${i + 1}/${entries.size ?? entries.length})`);
    }
  }

  log.ok(`Download done — ok: ${dlOk}, skipped: ${dlSkip}, failed: ${dlFail}`);

  // ── Phase 4: update DB ─────────────────────────────────────────────────────
  log.step("Updating DB…");
  let updated = 0;

  for (const spirit of dbSpirits) {
    const wiki = assignments.get(spirit.id);
    if (!wiki) continue;

    const filename = urlToLocalPath.get(wiki.imageUrl);
    if (!filename) continue;

    const localUrl = `/assets/collectibles/${filename}`;
    await db.collectible.update({
      where: { id: spirit.id },
      data: { assetRenderUrl: localUrl },
    });
    updated++;
    if (updated % 100 === 0) log.ok(`  Updated ${updated}…`);
  }

  const unmatched = dbSpirits.filter(s => !assignments.has(s.id));
  log.ok(`DB update done — updated: ${updated}, unmatched: ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log("\nUnmatched spirits (first 20):");
    unmatched.slice(0, 20).forEach(s =>
      console.log(`  #${s.posicaoSpiritSsbu} "${s.name}"`)
    );
  }
}

main().catch(console.error);
