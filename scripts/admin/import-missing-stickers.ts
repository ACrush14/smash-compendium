import { db } from "../../lib/db";
import { fetchHtml, cleanText, log } from "../scrapers/utils";

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

async function main() {
  const url = "https://www.ssbwiki.com/List_of_stickers_(complete_list)";
  log.step(`Fetching ${url}`);
  const $ = await fetchHtml(url);

  interface WikiSticker { number: number; name: string; game: string; imageUrl: string; }
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
    wikiList.push({ number, name, game, imageUrl });
  });

  log.ok(`SSBWiki: ${wikiList.length} stickers`);

  // Get existing indices in DB
  const existing = await db.collectible.findMany({
    where: { type: "STICKER" },
    select: { orderIndex: true },
  });
  const existingIndices = new Set(existing.map(s => s.orderIndex).filter(Boolean) as number[]);

  const missing = wikiList.filter(w => !existingIndices.has(w.number));
  log.step(`${missing.length} stickers to create`);

  let created = 0;
  for (const w of missing) {
    const id = `STICKER-SSBB-idx${w.number}`;
    await db.collectible.create({
      data: {
        id,
        type: "STICKER",
        smashGameVersion: "SSBB",
        name: w.name,
        orderIndex: w.number,
        sourceGame: w.game || null,
        assetRenderUrl: w.imageUrl,
      },
    });
    console.log(`  [+] #${w.number} "${w.name}" (${w.game})`);
    created++;
  }

  log.ok(`Created ${created} stickers. DB now has ${existing.length + created} stickers.`);
}

main().catch(console.error);
