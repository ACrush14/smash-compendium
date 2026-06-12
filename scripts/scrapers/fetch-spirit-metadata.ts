/**
 * Scraper — Spirit metadata from ssbuspirits.com (Wix site)
 *
 * Campos coletados por spirit:
 *   spiritFirstAppearance — "First Appearance: X" text node
 *   spiritArtworkSource   — "Artwork From: X" text node
 *   spiritMusicTitle      — .TrackName3057130458__title
 *   spiritMusicArtist     — .ArtistName2701513331__title
 *   spiritMusicDuration   — "00:00 / MM:SS" text → extrai "MM:SS"
 *   spiritCuratorComment  — primeiro <p> com texto > 80 chars
 *
 * Estratégia de slug:
 *   1. Scrape /spirits para coletar slugs reais
 *   2. Complementa com slugs gerados dos nomes do DB
 *   3. Busca cada página individual com 1.5s de delay
 *   4. Match por número → fallback nome normalizado
 *   5. Update DB
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log, sleep } from "./utils";

const BASE = "https://www.ssbuspirits.com";
const PAGE_DELAY_MS   = 3_000;
const SPIRIT_DELAY_MS = 1_500;

// ─── Slug helpers ─────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// ─── Phase 1: coletar slugs da listagem ───────────────────────────────────────

async function collectSlugs(): Promise<Set<string>> {
  const slugs = new Set<string>();

  // O site é Wix — renderiza tudo no SSR, paginação é client-side.
  // Uma única requisição ao /spirits retorna todos os links.
  for (let page = 1; page <= 10; page++) {
    const url = page === 1 ? `${BASE}/spirits` : `${BASE}/spirits?page=${page}`;
    try {
      const $ = await fetchHtml(url);
      let found = 0;
      $("a[href^='/spirits/']").each((_i, el) => {
        const href = $(el).attr("href") ?? "";
        const slug = href.replace(/^\/spirits\//, "").split("?")[0]!.trim();
        if (slug && !slugs.has(slug)) { slugs.add(slug); found++; }
      });
      console.log(`  Listing page ${page} → ${found} new slugs (total: ${slugs.size})`);
      if (found === 0) break; // sem novidades → fim da paginação
    } catch { break; }
    await sleep(PAGE_DELAY_MS);
  }

  return slugs;
}

// ─── Phase 2: parser de página individual ─────────────────────────────────────

interface SpiritMeta {
  number: number | null;
  firstAppearance: string | null;
  artworkSource: string | null;
  musicTitle: string | null;
  musicArtist: string | null;
  musicDuration: string | null;
  comment: string | null;
}

function parseSpiritPage($: ReturnType<typeof import("cheerio").load>): SpiritMeta {
  // ── Coleta todos os text leaves (sem filhos de texto) ──
  const leaves: string[] = [];
  $("*").each((_i, el) => {
    if ($(el).children().length === 0) {
      const t = cleanText($(el).text());
      if (t.length > 0 && t.length < 400) leaves.push(t);
    }
  });

  // ── Número: "No. 563" ──
  let number: number | null = null;
  for (const t of leaves) {
    const m = t.match(/^No\.\s*(\d+)$/);
    if (m) { number = parseInt(m[1]!); break; }
  }

  // ── First Appearance: "First Appearance: EarthBound (1994)" ──
  let firstAppearance: string | null = null;
  for (const t of leaves) {
    const m = t.match(/^First Appearance:\s*(.+)$/i);
    if (m) { firstAppearance = m[1]!.trim(); break; }
  }

  // ── Artwork Source: "Artwork From: Mario Party 10 (2015)" ──
  let artworkSource: string | null = null;
  for (const t of leaves) {
    const m = t.match(/^Artwork From:\s*(.+)$/i) ??
               t.match(/^Artwork Source:\s*(.+)$/i) ??
               t.match(/^Artwork:\s*(.+)$/i);
    if (m) { artworkSource = m[1]!.trim(); break; }
  }

  // ── Music title: classe TrackName3057130458__title ──
  let musicTitle: string | null = cleanText($(".TrackName3057130458__title").first().text()) || null;

  // ── Music artist: classe ArtistName2701513331__title ──
  let musicArtist: string | null = cleanText($(".ArtistName2701513331__title").first().text()) || null;

  // ── Duration: "00:00 / 04:10" → "04:10" ──
  let musicDuration: string | null = null;
  for (const t of leaves) {
    const m = t.match(/^\d{1,2}:\d{2}\s*\/\s*(\d{1,2}:\d{2})$/);
    if (m) { musicDuration = m[1]!; break; }
  }

  // ── Comentário: primeiro <p> longo ──
  let comment: string | null = null;
  $("p").each((_i, el) => {
    if (comment) return;
    const t = cleanText($(el).text());
    if (t.length > 80) comment = t;
  });

  return { number, firstAppearance, artworkSource, musicTitle, musicArtist, musicDuration, comment };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── Phase 1: collect slugs ──────────────────────────────────────────────────
  log.step("Collecting slugs from listing…");
  const listedSlugs = await collectSlugs();
  log.ok(`Listed slugs: ${listedSlugs.size}`);

  // ── Load DB spirits ─────────────────────────────────────────────────────────
  log.step("Loading DB spirits…");
  const dbSpirits = await db.collectible.findMany({
    where: { type: "SPIRIT" },
    select: { id: true, name: true, posicaoSpiritSsbu: true },
    orderBy: { posicaoSpiritSsbu: "asc" },
  });
  log.ok(`DB spirits: ${dbSpirits.length}`);

  // Complementa slugs com gerados a partir dos nomes do DB
  const allSlugs = new Set<string>(listedSlugs);
  for (const s of dbSpirits) {
    const gen = toSlug(s.name);
    if (gen) allSlugs.add(gen);
  }
  log.ok(`Total slugs to try: ${allSlugs.size}`);

  // ── Phase 2: scrape individual pages ────────────────────────────────────────
  log.step("Scraping spirit pages…");

  // Map: spiritNumber → meta  +  normalizedSlug → meta
  const byNumber = new Map<number, SpiritMeta>();
  const bySlug   = new Map<string, SpiritMeta>();   // normalized slug
  let scraped = 0, notFound = 0, errors = 0, i = 0;

  for (const slug of allSlugs) {
    i++;
    try {
      const $ = await fetchHtml(`${BASE}/spirits/${slug}`);
      const meta = parseSpiritPage($);
      if (meta.number !== null) byNumber.set(meta.number, meta);
      bySlug.set(normalize(slug), meta);
      scraped++;
    } catch (e: any) {
      if (String(e.message).includes("404")) notFound++;
      else { errors++; if (errors <= 10) console.warn(`  [ERR] ${slug}: ${String(e.message).slice(0, 60)}`); }
    }

    if (i % 100 === 0) log.ok(`  ${i}/${allSlugs.size} tried — scraped: ${scraped}, 404: ${notFound}, err: ${errors}`);
    await sleep(SPIRIT_DELAY_MS);
  }

  log.ok(`Done — scraped: ${scraped}, 404: ${notFound}, errors: ${errors}`);

  // ── Phase 3: match DB spirits ────────────────────────────────────────────────
  log.step("Matching to DB…");
  const dbByNum = new Map<number, typeof dbSpirits[number]>();
  for (const s of dbSpirits) {
    if (s.posicaoSpiritSsbu) dbByNum.set(s.posicaoSpiritSsbu, s);
  }

  const assignments = new Map<string, SpiritMeta>(); // dbId → meta
  let matchNum = 0, matchName = 0, noMatch = 0;

  for (const spirit of dbSpirits) {
    // Pass 1: by spirit number
    if (spirit.posicaoSpiritSsbu && byNumber.has(spirit.posicaoSpiritSsbu)) {
      assignments.set(spirit.id, byNumber.get(spirit.posicaoSpiritSsbu)!);
      matchNum++;
      continue;
    }
    // Pass 2: by normalized slug from name
    const slug = normalize(toSlug(spirit.name));
    if (bySlug.has(slug)) {
      assignments.set(spirit.id, bySlug.get(slug)!);
      matchName++;
      continue;
    }
    noMatch++;
  }

  log.ok(`Matched — by number: ${matchNum}, by name: ${matchName}, unmatched: ${noMatch}`);

  // ── Phase 4: update DB ───────────────────────────────────────────────────────
  log.step("Updating DB…");
  let updated = 0;

  for (const spirit of dbSpirits) {
    const meta = assignments.get(spirit.id);
    if (!meta) continue;

    await db.collectible.update({
      where: { id: spirit.id },
      data: {
        spiritFirstAppearance: meta.firstAppearance,
        spiritArtworkSource:   meta.artworkSource,
        spiritMusicTitle:      meta.musicTitle,
        spiritMusicArtist:     meta.musicArtist,
        spiritMusicDuration:   meta.musicDuration,
        spiritCuratorComment:  meta.comment,
      },
    });
    updated++;
    if (updated % 100 === 0) log.ok(`  Updated ${updated}…`);
  }

  log.ok(`DB update done — updated: ${updated} spirits`);

  // Amostra
  const samples = dbSpirits.slice(0, 3);
  for (const s of samples) {
    const m = assignments.get(s.id);
    if (m) console.log(`\n  #${s.posicaoSpiritSsbu} "${s.name}"`
      + `\n    FirstApp: ${m.firstAppearance}`
      + `\n    Artwork:  ${m.artworkSource}`
      + `\n    Music:    ${m.musicTitle} — ${m.musicArtist} (${m.musicDuration})`
      + `\n    Comment:  ${(m.comment ?? "").slice(0, 80)}…`);
  }
}

main().catch(console.error);
