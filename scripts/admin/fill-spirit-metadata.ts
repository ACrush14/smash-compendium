/**
 * fill-spirit-metadata.ts
 *
 * Preenche campos NULL de spirits 1–1137 a partir de ssbuspirits.com.
 * Não sobrescreve campos que já estão preenchidos.
 *
 * Run: npx tsx scripts/admin/fill-spirit-metadata.ts
 */

import * as cheerio from "cheerio";
import { db } from "../../lib/db";
import { fetchHtml, cleanText, log, sleep } from "../scrapers/utils";
import { addGamesFromSpirits } from "./add-games-from-spirits";

const BASE = "https://www.ssbuspirits.com";
const MAX_SPIRIT_NUM = 1137;
const DELAY_MS = 1_500;

// ── Slug helpers ─────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/&/g, "%26")
    .replace(/[^a-z0-9%]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// ── Parser de página individual ───────────────────────────────────────────────

interface SpiritMeta {
  number: number | null;
  firstAppearance: string | null;
  artworkSource: string | null;
  musicTitle: string | null;
  musicArtist: string | null;
  musicDuration: string | null;
  comment: string | null;
}

function parsePage($: cheerio.CheerioAPI): SpiritMeta {
  const leaves: string[] = [];
  $("*").each((_i, el) => {
    if ($(el).children().length === 0) {
      const t = cleanText($(el).text());
      if (t.length > 0 && t.length < 400) leaves.push(t);
    }
  });

  let number: number | null = null;
  for (const t of leaves) {
    const m = t.match(/^No\.\s*(\d+)$/);
    if (m) { number = parseInt(m[1]!); break; }
  }

  let firstAppearance: string | null = null;
  for (const t of leaves) {
    const m = t.match(/^First Appearance:\s*(.+)$/i);
    if (m) { firstAppearance = m[1]!.trim(); break; }
  }

  let artworkSource: string | null = null;
  for (const t of leaves) {
    const m = t.match(/^Artwork From:\s*(.+)$/i) ??
               t.match(/^Artwork Source:\s*(.+)$/i) ??
               t.match(/^Artwork:\s*(.+)$/i);
    if (m) { artworkSource = m[1]!.trim(); break; }
  }

  const musicTitle  = cleanText($(".TrackName3057130458__title").first().text()) || null;
  const musicArtist = cleanText($(".ArtistName2701513331__title").first().text()) || null;

  let musicDuration: string | null = null;
  for (const t of leaves) {
    const m = t.match(/^\d{1,2}:\d{2}\s*\/\s*(\d{1,2}:\d{2})$/);
    if (m) { musicDuration = m[1]!; break; }
  }

  let comment: string | null = null;
  $("p").each((_i, el) => {
    if (comment) return;
    const t = cleanText($(el).text());
    if (t.length > 80) comment = t;
  });

  return { number, firstAppearance, artworkSource, musicTitle, musicArtist, musicDuration, comment };
}

// ── Coleta slugs da listagem ──────────────────────────────────────────────────

async function collectSlugs(): Promise<Set<string>> {
  const slugs = new Set<string>();
  for (let page = 1; page <= 15; page++) {
    const url = page === 1 ? `${BASE}/spirits` : `${BASE}/spirits?page=${page}`;
    try {
      const $ = await fetchHtml(url);
      let found = 0;
      $("a[href^='/spirits/']").each((_i, el) => {
        const href = $(el).attr("href") ?? "";
        const slug = href.replace(/^\/spirits\//, "").split("?")[0]!.trim();
        if (slug && !slugs.has(slug)) { slugs.add(slug); found++; }
      });
      log.ok(`Listing page ${page} → ${found} slugs (total: ${slugs.size})`);
      if (found === 0) break;
    } catch { break; }
    await sleep(2_000);
  }
  return slugs;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log.step("Carregando spirits do DB (1–1137)…");
  const dbSpirits = await db.collectible.findMany({
    where: {
      type: "SPIRIT",
      posicaoSpiritSsbu: { lte: MAX_SPIRIT_NUM },
    },
    select: {
      id: true, name: true, posicaoSpiritSsbu: true,
      spiritFirstAppearance: true,
      spiritArtworkSource: true,
      spiritMusicTitle: true,
      spiritMusicArtist: true,
      spiritMusicDuration: true,
      spiritCuratorComment: true,
    },
    orderBy: { posicaoSpiritSsbu: "asc" },
  });
  log.ok(`${dbSpirits.length} spirits carregados`);

  // Conta quantos precisam de atualização
  const needsUpdate = dbSpirits.filter(s =>
    !s.spiritFirstAppearance || !s.spiritArtworkSource ||
    !s.spiritMusicTitle || !s.spiritCuratorComment
  );
  log.ok(`${needsUpdate.length} spirits com campos faltando`);

  if (needsUpdate.length === 0) {
    log.ok("Tudo preenchido! Nada a fazer.");
    return;
  }

  // Build lookup maps
  const dbByNum  = new Map<number, typeof dbSpirits[number]>();
  const dbBySlug = new Map<string, typeof dbSpirits[number]>();
  for (const s of needsUpdate) {
    if (s.posicaoSpiritSsbu) dbByNum.set(s.posicaoSpiritSsbu, s);
    dbBySlug.set(normalize(s.name), s);
  }

  log.step("Coletando slugs da listagem ssbuspirits.com…");
  const listedSlugs = await collectSlugs();
  log.ok(`${listedSlugs.size} slugs coletados`);

  // Adiciona slugs gerados dos nomes que precisam de update
  const allSlugs = new Set<string>(listedSlugs);
  for (const s of needsUpdate) {
    const gen = toSlug(s.name);
    if (gen) allSlugs.add(gen);
  }
  log.ok(`Total de slugs a tentar: ${allSlugs.size}`);

  log.step("Scraping e atualizando DB (só campos NULL)…");
  const updatedIds = new Set<string>();
  let scraped = 0, updated = 0, notFound = 0, errors = 0, i = 0;

  for (const slug of allSlugs) {
    i++;
    try {
      const $ = await fetchHtml(`${BASE}/spirits/${slug}`, 1);
      const meta = parsePage($);
      scraped++;

      let dbSpirit = meta.number !== null ? dbByNum.get(meta.number) : undefined;
      if (!dbSpirit) dbSpirit = dbBySlug.get(normalize(slug));
      if (!dbSpirit || updatedIds.has(dbSpirit.id)) { await sleep(DELAY_MS); continue; }

      // Só atualiza campos que estão NULL no DB
      const patch: Record<string, string | null> = {};
      if (!dbSpirit.spiritFirstAppearance && meta.firstAppearance)
        patch.spiritFirstAppearance = meta.firstAppearance;
      if (!dbSpirit.spiritArtworkSource && meta.artworkSource)
        patch.spiritArtworkSource = meta.artworkSource;
      if (!dbSpirit.spiritMusicTitle && meta.musicTitle)
        patch.spiritMusicTitle = meta.musicTitle;
      if (!dbSpirit.spiritMusicArtist && meta.musicArtist)
        patch.spiritMusicArtist = meta.musicArtist;
      if (!dbSpirit.spiritMusicDuration && meta.musicDuration)
        patch.spiritMusicDuration = meta.musicDuration;
      if (!dbSpirit.spiritCuratorComment && meta.comment)
        patch.spiritCuratorComment = meta.comment;

      if (Object.keys(patch).length > 0) {
        await db.collectible.update({ where: { id: dbSpirit.id }, data: patch });
        updatedIds.add(dbSpirit.id);
        updated++;
        process.stdout.write(`  ✓ #${dbSpirit.posicaoSpiritSsbu} ${dbSpirit.name}\n`);
      }
    } catch (e: any) {
      if (String(e.message).includes("404") || String(e.message).includes("HTTP 4")) notFound++;
      else {
        errors++;
        if (errors <= 10) log.warn(`${slug}: ${String(e.message).slice(0, 70)}`);
      }
    }

    if (i % 50 === 0)
      log.ok(`  ${i}/${allSlugs.size} — scrap: ${scraped}, upd: ${updated}, 404: ${notFound}`);
    await sleep(DELAY_MS);
  }

  log.ok(`Concluído — atualizados: ${updated}, 404: ${notFound}, erros: ${errors}`);
  await addGamesFromSpirits();
}

main().catch(console.error);
