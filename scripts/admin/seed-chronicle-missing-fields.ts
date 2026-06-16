/**
 * seed-chronicle-missing-fields.ts
 *
 * Preenche campos vazios em ChronicleEntry via Wikipedia API + Libretro Thumbnails.
 * NÃO altera consoleName (já corrigido).
 *
 * Campos preenchidos:
 *   wikiUrl          — URL do artigo EN Wikipedia
 *   releaseDateNtsc  — data de lançamento NA extraída do infobox
 *   titleJp          — título japonês via langlinks da Wikipedia
 *   boxArtUrl        — capa via Libretro Thumbnails (offline index)
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/seed-chronicle-missing-fields.ts
 *   npx tsx --env-file=.env.local scripts/admin/seed-chronicle-missing-fields.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/seed-chronicle-missing-fields.ts --field wikiUrl
 *   npx tsx --env-file=.env.local scripts/admin/seed-chronicle-missing-fields.ts --limit 50
 */

import { db } from "../../lib/db";

const DRY    = process.argv.includes("--dry-run");
const FIELD  = (() => { const i = process.argv.indexOf("--field"); return i !== -1 ? process.argv[i+1] : null; })();
const LIMIT  = (() => { const i = process.argv.indexOf("--limit"); return i !== -1 ? parseInt(process.argv[i+1]!) : 9999; })();
const DELAY  = 1_600; // ms entre requests Wikipedia
const UA     = "SmashCompendiumBot/1.0 (educational project; smash-compendium)";

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ── Wikipedia API ──────────────────────────────────────────────────────────────

async function wikiParseApi(title: string): Promise<{
  redirectTitle: string | null;
  html: string;
  langlinks: Array<{ lang: string; title: string }>;
} | null> {
  const url = `https://en.wikipedia.org/w/api.php?` + new URLSearchParams({
    action: "parse", page: title,
    prop: "text|langlinks", format: "json", formatversion: "2",
    redirects: "1",
  });
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12_000) });
    const json: any = await res.json();
    if (json.error || !json.parse) return null;
    const html: string = json.parse.text ?? "";
    // Detect actual disambiguation pages via their HTML markers
    if (html.includes("id=\"disambig\"") || html.includes("class=\"mw-disambig\"") || html.includes("dmbox-disambig")) {
      return null;
    }
    return {
      redirectTitle: json.parse.title ?? null,
      html,
      langlinks:     json.parse.langlinks ?? [],
    };
  } catch { return null; }
}

// Strip scraping artifacts from titles before searching
function cleanTitle(raw: string): string | null {
  if (!raw) return null;
  // Skip placeholder titles
  if (/^(JP EXCLUSIVE|PAL EXCLUSIVE|JP|PAL|NTSC)$/i.test(raw.trim())) return null;
  // Remove trailing date suffix like "(05/1)", "(12/25)", "(1990)"
  let s = raw.replace(/\s*\(\d{1,2}\/\d{1,2}\)\s*$/, "").trim();
  s = s.replace(/\s*\(\d{4}\)\s*$/, "").trim();
  return s || null;
}

// Build candidate title variants to try on Wikipedia
function wikiTitleVariants(title: string, consoleName: string): string[] {
  const variants: string[] = [title];
  // For Game & Watch — prepend console prefix to disambiguate generic titles
  if (consoleName === "Game & Watch") {
    variants.unshift(`Game & Watch: ${title}`, `Game & Watch ${title}`);
    variants.push(`${title} (Game & Watch)`);
  }
  // & → and
  if (title.includes(" & "))    variants.push(title.replace(/ & /g, " and "));
  // Pokémon → Pokemon (ASCII)
  if (title.includes("é"))      variants.push(title.replace(/é/g, "e"));
  // "The X" → "X"
  if (title.startsWith("The ")) variants.push(title.slice(4));
  // Remove subtitle after ": "
  const colonIdx = title.indexOf(": ");
  if (colonIdx > 5)             variants.push(title.slice(0, colonIdx));
  // Disambig fallback: add "(video game)"
  variants.push(`${title} (video game)`);
  return [...new Set(variants)];
}

// Sanity-check: is the Wikipedia redirect plausibly about the same game?
// Uses word-level overlap — at least one significant word must match
function redirectIsSane(searchTitle: string, redirectTitle: string): boolean {
  const words = (s: string) => s.toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length >= 3 && !["the","and","for","of","in","a","an"].includes(w));
  const sw = words(searchTitle);
  const rw = words(redirectTitle);
  if (sw.length === 0) return true; // can't check — allow
  const matches = sw.filter(w => rw.includes(w) || rw.some(r => r.startsWith(w) || w.startsWith(r)));
  return matches.length > 0;
}

// ── HTML release date parser ───────────────────────────────────────────────────

function extractReleaseDate(html: string): string | null {
  // Wikipedia infobox for video games usually has a "Release" or "Released" row
  // We look for <bdi>...</bdi> inside the infobox which contains dates like
  // "September 26, 2003" or "1984" or "December 14, 1998"

  const monthMap: Record<string, string> = {
    January: "01", February: "02", March: "03", April: "04",
    May: "05", June: "06", July: "07", August: "08",
    September: "09", October: "10", November: "11", December: "12",
  };

  // Pattern: "Month DD, YYYY" — US release
  const longDate = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\b/;
  // Find all date mentions in infobox context
  // Strip HTML tags first for simple regex matching
  const stripped = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/\s+/g, " ");

  // Find "Release" section then look for first date
  const releaseIdx = stripped.search(/\bReleas/i);
  const searchText = releaseIdx >= 0 ? stripped.slice(releaseIdx, releaseIdx + 800) : stripped;

  const match = longDate.exec(searchText);
  if (match) {
    const [, month, day, year] = match;
    const mm = monthMap[month!] ?? "00";
    const dd = String(parseInt(day!)).padStart(2, "0");
    return `${mm}/${dd}/${year}`;
  }
  // Fallback: just a 4-digit year near "Release"
  const yearMatch = /\b(19[5-9]\d|20[0-3]\d)\b/.exec(searchText);
  if (yearMatch) return yearMatch[1]!; // just the year as string
  return null;
}

// ── Libretro box art ───────────────────────────────────────────────────────────

const LIBRETRO: Record<string, string> = {
  "Nintendo Entertainment System":       "Nintendo - Nintendo Entertainment System",
  "Famicom Disk System":                 "Nintendo - Family Computer Disk System",
  "Super Nintendo Entertainment System": "Nintendo - Super Nintendo Entertainment System",
  "Nintendo 64":                         "Nintendo - Nintendo 64",
  "Nintendo GameCube":                   "Nintendo - GameCube",
  "Wii":                                 "Nintendo - Wii",
  "Wii U":                               "Nintendo - Wii U",
  "Nintendo DS":                         "Nintendo - Nintendo DS",
  "Nintendo 3DS":                        "Nintendo - Nintendo 3DS",
  "Game Boy":                            "Nintendo - Game Boy",
  "Game Boy Color":                      "Nintendo - Game Boy Color",
  "Game Boy Advance":                    "Nintendo - Game Boy Advance",
  "Virtual Boy":                         "Nintendo - Virtual Boy",
  "PlayStation 1":                       "Sony - PlayStation",
  "PlayStation 2":                       "Sony - PlayStation 2",
  "PlayStation 3":                       "Sony - PlayStation 3",
  "PlayStation 4":                       "Sony - PlayStation 4",
  "PlayStation Portable":                "Sony - PlayStation Portable",
  "Sega Genesis":                        "Sega - Mega Drive - Genesis",
  "Sega CD":                             "Sega - Mega-CD",
  "Dreamcast":                           "Sega - Dreamcast",
  "Xbox 360":                            "Microsoft - Xbox 360",
  "Arcade":                              "MAME",
};

// Cache: libretroFolder → Set of normalised filenames
const libretroIndexCache: Map<string, string[]> = new Map();

function norm(s: string) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[:\-'"!?.,&\/\\]/g, " ")
    .replace(/\s+/g, " ").trim();
}

async function fetchLibretroIndex(folder: string): Promise<string[]> {
  if (libretroIndexCache.has(folder)) return libretroIndexCache.get(folder)!;
  const enc = folder.split("").map(c => /[A-Za-z0-9\-_.]/.test(c) ? c : encodeURIComponent(c)).join("");
  const url = `https://thumbnails.libretro.com/${enc}/Named_Boxarts/`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { "User-Agent": UA } });
    if (!res.ok) { libretroIndexCache.set(folder, []); return []; }
    const html = await res.text();
    const matches = [...html.matchAll(/href="([^"?#]+\.png)"/gi)]
      .map(m => { try { return decodeURIComponent(m[1]!); } catch { return m[1]!; } });
    libretroIndexCache.set(folder, matches);
    return matches;
  } catch { libretroIndexCache.set(folder, []); return []; }
}

function extractBase(filename: string): string {
  let s = filename.replace(/\.png$/i, "");
  const regionLike = /\s*(?:\([^)]+\)|\[[^\]]+\])\s*$/;
  for (let i = 0; i < 8; i++) {
    const m = regionLike.exec(s);
    if (!m) break;
    const p = m[0].trim();
    if (/^\((?:USA|Japan|Europe|[A-Z]{2,3}|Rev|v\d|Unl|Beta|Demo|Proto|En[,A-Za-z]*|Ja[,A-Za-z]*|\d{4}[\d-]*)\)/i.test(p)) s = s.slice(0, m.index);
    else break;
  }
  return s.trim();
}

function pickBest(files: string[]): string {
  const score = (f: string) => /\(USA\)/i.test(f) ? 10 : /\(Japan,\s*USA\)/i.test(f) ? 9 : /\(Japan\)/i.test(f) ? 8 : /\(Europe\)/i.test(f) ? 5 : 1;
  return [...files].sort((a, b) => score(b) - score(a))[0]!;
}

function buildLibretroUrl(folder: string, filename: string): string {
  const encF = folder.split("").map(c => /[A-Za-z0-9\-_.]/.test(c) ? c : encodeURIComponent(c)).join("");
  const encN = filename.split("").map(c => /[A-Za-z0-9\-_.!~*'()]/.test(c) ? c : encodeURIComponent(c)).join("");
  return `https://thumbnails.libretro.com/${encF}/Named_Boxarts/${encN}`;
}

async function findBoxArt(consoleName: string, title: string): Promise<string | null> {
  const folder = LIBRETRO[consoleName];
  if (!folder) return null;
  const files = await fetchLibretroIndex(folder);
  if (!files.length) return null;
  const qNorm = norm(title);
  const matches = files.filter(f => norm(extractBase(f)) === qNorm);
  if (matches.length) return buildLibretroUrl(folder, pickBest(matches));
  // Fuzzy: prefix match
  const prefix = files.filter(f => norm(extractBase(f)).startsWith(qNorm + " ") && qNorm.length >= 8);
  if (prefix.length) return buildLibretroUrl(folder, pickBest(prefix));
  return null;
}

// ── Main ────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║  seed-chronicle-missing-fields ${DRY ? "(DRY RUN)           " : "                    "}║`);
  console.log(`╚════════════════════════════════════════════════════════╝\n`);

  const where: any = { OR: [] };
  if (!FIELD || FIELD === "wikiUrl")         where.OR.push({ wikiUrl: null });
  if (!FIELD || FIELD === "date")            where.OR.push({ releaseDateNtsc: null, releaseDateJp: null });
  if (!FIELD || FIELD === "titleJp")         where.OR.push({ titleJp: null });
  if (!FIELD || FIELD === "boxArtUrl")       where.OR.push({ boxArtUrl: null });
  if (where.OR.length === 0) where.OR.push({ wikiUrl: null });

  const entries = await db.chronicleEntry.findMany({
    where,
    orderBy: [{ consoleName: "asc" }, { titleNtsc: "asc" }],
    take: LIMIT,
  });

  console.log(`  Entradas a processar: ${entries.length}${LIMIT < 9999 ? ` (limite ${LIMIT})` : ""}\n`);

  let wikiOk = 0, dateOk = 0, jpOk = 0, artOk = 0, notFound = 0;

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    const label = (e.titleNtsc ?? e.titleJp ?? "?").slice(0, 50);
    process.stdout.write(`  [${String(i+1).padStart(4)}/${entries.length}] ${label.padEnd(52)} `);

    const changes: Record<string, string> = {};

    // ── Box art (Libretro, offline index) ───────────────────────────────────
    if (!e.boxArtUrl) {
      const art = await findBoxArt(e.consoleName, e.titleNtsc ?? e.titleJp ?? "");
      if (art) { changes.boxArtUrl = art; artOk++; }
    }

    // ── Wikipedia ──────────────────────────────────────────────────────────
    const needsWiki = !e.wikiUrl;
    const needsDate = !e.releaseDateNtsc && !e.releaseDateJp;
    const needsJp   = !e.titleJp;

    if (needsWiki || needsDate || needsJp) {
      const rawTitle = e.titleNtsc && e.titleNtsc !== "JP EXCLUSIVE" ? e.titleNtsc : (e.titleJpEn ?? "");
      const searchTitle = cleanTitle(rawTitle);

      if (searchTitle) {
        let parsed = null;
        let usedTitle = "";
        for (const variant of wikiTitleVariants(searchTitle, e.consoleName)) {
          parsed = await wikiParseApi(variant);
          if (parsed) { usedTitle = variant; break; }
          await sleep(400);
        }

        if (parsed) {
          const canonTitle = parsed.redirectTitle ?? usedTitle;
          const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(canonTitle.replace(/ /g, "_"))}`;
          const sane = redirectIsSane(searchTitle, canonTitle);

          if (needsWiki) { changes.wikiUrl = wikiUrl; wikiOk++; }

          if (needsDate && sane) {
            const date = extractReleaseDate(parsed.html);
            if (date) { changes.releaseDateNtsc = date; dateOk++; }
          }

          if (needsJp && sane) {
            const jpLink = parsed.langlinks.find(l => l.lang === "ja");
            if (jpLink) { changes.titleJp = jpLink.title; jpOk++; }
          }
        } else {
          notFound++;
        }

        await sleep(DELAY);
      }
    }

    // ── Log ──────────────────────────────────────────────────────────────
    const parts: string[] = [];
    if (changes.wikiUrl)         parts.push("+wiki");
    if (changes.releaseDateNtsc) parts.push(`+date(${changes.releaseDateNtsc})`);
    if (changes.titleJp)         parts.push(`+jp(${changes.titleJp.slice(0,20)})`);
    if (changes.boxArtUrl)       parts.push("+art");
    console.log(parts.length ? parts.join(" ") : "—");

    // ── Save ─────────────────────────────────────────────────────────────
    if (!DRY && Object.keys(changes).length > 0) {
      await db.chronicleEntry.update({ where: { id: e.id }, data: changes });
    }
  }

  console.log(`\n══════════════════════════════════════════════════`);
  console.log(`  wiki URLs     : ${wikiOk}`);
  console.log(`  datas         : ${dateOk}`);
  console.log(`  títulos JP    : ${jpOk}`);
  console.log(`  capas (art)   : ${artOk}`);
  console.log(`  não achados   : ${notFound}`);
  console.log(`══════════════════════════════════════════════════\n`);
  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
