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
import { addGamesFromSpirits } from "../admin/add-games-from-spirits";

const BASE = "https://www.ssbuspirits.com";
const PAGE_DELAY_MS   = 3_000;
const SPIRIT_DELAY_MS = 1_500;
const MAX_SPIRIT_NUM  = 1137; // ssbuspirits.com só tem até esse número

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

  // ── Load DB spirits (apenas até MAX_SPIRIT_NUM) ─────────────────────────────
  log.step("Loading DB spirits…");
  const dbSpirits = await db.collectible.findMany({
    where: {
      type: "SPIRIT",
      OR: [
        { posicaoSpiritSsbu: { lte: MAX_SPIRIT_NUM } },
        { posicaoSpiritSsbu: null },
      ],
    },
    select: { id: true, name: true, posicaoSpiritSsbu: true },
    orderBy: { posicaoSpiritSsbu: "asc" },
  });
  log.ok(`DB spirits (≤ #${MAX_SPIRIT_NUM}): ${dbSpirits.length}`);

  // Complementa slugs com gerados a partir dos nomes do DB filtrado
  const allSlugs = new Set<string>(listedSlugs);
  for (const s of dbSpirits) {
    const gen = toSlug(s.name);
    if (gen) allSlugs.add(gen);
  }
  log.ok(`Total slugs to try: ${allSlugs.size}`);

  // Lookup maps para match imediato no DB
  const dbByNum  = new Map<number, typeof dbSpirits[number]>();
  const dbBySlug = new Map<string, typeof dbSpirits[number]>();
  for (const s of dbSpirits) {
    if (s.posicaoSpiritSsbu) dbByNum.set(s.posicaoSpiritSsbu, s);
    dbBySlug.set(normalize(toSlug(s.name)), s);
  }
  const updatedIds = new Set<string>(); // evita double-update

  // ── Scrape + update incremental ─────────────────────────────────────────────
  log.step("Scraping e atualizando DB em tempo real…");
  let scraped = 0, notFound = 0, errors = 0, updated = 0, i = 0;

  for (const slug of allSlugs) {
    i++;
    try {
      const $ = await fetchHtml(`${BASE}/spirits/${slug}`, 1);
      const meta = parseSpiritPage($);
      scraped++;

      // Match: por número primeiro, depois por slug normalizado
      let dbSpirit = meta.number !== null ? dbByNum.get(meta.number) : undefined;
      if (!dbSpirit) dbSpirit = dbBySlug.get(normalize(slug));

      if (dbSpirit && !updatedIds.has(dbSpirit.id)) {
        updatedIds.add(dbSpirit.id);
        await db.collectible.update({
          where: { id: dbSpirit.id },
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
      }
    } catch (e: any) {
      if (String(e.message).includes("404")) notFound++;
      else { errors++; if (errors <= 10) console.warn(`  [ERR] ${slug}: ${String(e.message).slice(0, 60)}`); }
    }

    if (i % 50 === 0) log.ok(`  ${i}/${allSlugs.size} — scrapeados: ${scraped}, atualizados: ${updated}, 404: ${notFound}`);
    await sleep(SPIRIT_DELAY_MS);
  }

  log.ok(`Concluído — scrapeados: ${scraped}, atualizados no DB: ${updated}, 404: ${notFound}, erros: ${errors}`);

  // Sincroniza automaticamente os jogos novos para o Chronicles
  await addGamesFromSpirits();
}

main().catch(console.error);
