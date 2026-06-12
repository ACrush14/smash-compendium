import { db } from "../../lib/db";
import { fetchHtml, cleanText, log } from "./utils";

function toFullRes(thumbUrl: string): string {
  return thumbUrl.replace(/\/thumb\//, "/").replace(/\/\d+px-[^/]+$/, "");
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function looksLikeEffect(text: string): boolean {
  if (/^[A-Z]{1,3}[a-zA-Z]+[+-]\d/.test(text)) return true;
  if (/^[A-Z]{2}[A-Z][a-z]/.test(text)) return true;
  if (/\b(Attack|Shield|Launch|Flinch|Nose|Foot|Hand|Specials|Energy)\s*[+-]/.test(text)) return true;
  if (/^[A-Z][A-Za-z]{1,3}[A-Z][a-z]/.test(text) && !/\s/.test(text.substring(0, 5))) return true;
  return false;
}

interface WikiSticker {
  number: number;
  name: string;
  normName: string;
  game: string;
  imageUrl: string;
}

async function main() {
  const url = "https://www.ssbwiki.com/List_of_stickers_(complete_list)";
  log.step(`Fetching ${url}`);
  const $ = await fetchHtml(url);

  // Build FULL list (not a map) — preserves all duplicated names
  const wikiList: WikiSticker[] = [];
  let lastGame = "";

  $("table.wikitable tbody tr").each((_i, row) => {
    const cells = $("td", row).toArray();
    if (cells.length < 4) return;
    const numText = cleanText($(cells[0]!).text());
    const number = parseInt(numText.replace(/\D/g, ""), 10);
    if (isNaN(number) || number === 0) return;
    const imgEl = $("img", cells[1]!).first();
    if (!imgEl.length) return;
    const rawSrc = imgEl.attr("data-src") ?? imgEl.attr("src") ?? "";
    if (!rawSrc) return;
    const src = rawSrc.startsWith("//") ? `https:${rawSrc}` : rawSrc;
    const imageUrl = toFullRes(src);
    const name = cleanText($(cells[2]!).text());
    if (!name || !imageUrl) return;
    let game = "";
    if (cells.length >= 5) {
      const col3 = cleanText($(cells[3]!).text());
      if (!looksLikeEffect(col3) && col3.length > 0) { game = col3; lastGame = game; }
      else game = lastGame;
    } else game = lastGame;
    wikiList.push({ number, name, normName: normalize(name), game, imageUrl });
  });

  log.ok(`SSBWiki: ${wikiList.length} stickers`);

  // Group wiki entries by normalized name
  const wikiByName = new Map<string, WikiSticker[]>();
  for (const w of wikiList) {
    const arr = wikiByName.get(w.normName) ?? [];
    arr.push(w);
    wikiByName.set(w.normName, arr);
  }

  // Load all DB stickers
  const dbStickers = await db.collectible.findMany({
    where: { type: "STICKER" },
    select: { id: true, name: true, sourceGame: true },
  });
  log.step(`DB: ${dbStickers.length} stickers`);

  // Track which wiki entries are already claimed (by index)
  const claimed = new Set<number>();

  // Two-pass matching:
  // Pass 1: exact name + game match (most specific)
  // Pass 2: name-only match on unclaimed entries
  const assignments = new Map<string, WikiSticker>(); // dbId → wiki entry

  // Pass 1: name + game exact match
  for (const sticker of dbStickers) {
    const key = normalize(sticker.name);
    const candidates = wikiByName.get(key) ?? [];
    if (candidates.length === 0) continue;
    const gameKey = normalize(sticker.sourceGame ?? "");
    const exact = candidates.find(
      w => !claimed.has(w.number) && normalize(w.game) === gameKey && gameKey.length > 2
    );
    if (exact) {
      assignments.set(sticker.id, exact);
      claimed.add(exact.number);
    }
  }

  // Pass 2: name match on first unclaimed candidate
  for (const sticker of dbStickers) {
    if (assignments.has(sticker.id)) continue;
    const key = normalize(sticker.name);
    const candidates = wikiByName.get(key) ?? [];
    const best = candidates.find(w => !claimed.has(w.number));
    if (best) {
      assignments.set(sticker.id, best);
      claimed.add(best.number);
    } else {
      // Fallback: allow reuse (sticker is a genuine duplicate)
      const any = candidates[0];
      if (any) assignments.set(sticker.id, any);
    }
  }

  log.step(`Assigned ${assignments.size} stickers — updating DB`);

  let updated = 0;
  for (const sticker of dbStickers) {
    const match = assignments.get(sticker.id);
    if (!match) continue;
    await db.collectible.update({
      where: { id: sticker.id },
      data: {
        assetRenderUrl: match.imageUrl,
        sourceGame: match.game || null,
        orderIndex: match.number,
      },
    });
    updated++;
    if (updated % 50 === 0) log.ok(`  Updated ${updated}...`);
  }

  // Report unclaimed wiki entries (truly missing from DB)
  const unclaimed = wikiList.filter(w => !claimed.has(w.number));
  log.ok(`Done — updated: ${updated}, uncovered wiki entries: ${unclaimed.length}`);
  if (unclaimed.length > 0) {
    console.log("\nUncovered SSBWiki entries (no DB record):");
    unclaimed.slice(0, 20).forEach(w => console.log(`  #${w.number} "${w.name}" (${w.game})`));
  }
}

main().catch(console.error);
