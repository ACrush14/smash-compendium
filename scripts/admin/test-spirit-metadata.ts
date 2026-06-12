import { fetchHtml, cleanText, log } from "../scrapers/utils";

const BASE = "https://www.ssbuspirits.com";

function normalize(s: string) { return s.toLowerCase().replace(/[^a-z0-9]/g, ""); }

async function test(slug: string) {
  try {
    const $ = await fetchHtml(`${BASE}/spirits/${slug}`);
    const leaves: string[] = [];
    $("*").each((_i, el) => {
      if ($(el).children().length === 0) {
        const t = cleanText($(el).text());
        if (t.length > 0 && t.length < 400) leaves.push(t);
      }
    });

    let number: number | null = null;
    let firstAppearance: string | null = null;
    let artworkSource: string | null = null;
    let musicDuration: string | null = null;

    for (const t of leaves) {
      if (!number) { const m = t.match(/^No\.\s*(\d+)$/); if (m) number = parseInt(m[1]!); }
      if (!firstAppearance) { const m = t.match(/^First Appearance:\s*(.+)$/i); if (m) firstAppearance = m[1]!.trim(); }
      if (!artworkSource) { const m = t.match(/^Artwork From:\s*(.+)$/i) ?? t.match(/^Artwork:\s*(.+)$/i); if (m) artworkSource = m[1]!.trim(); }
      if (!musicDuration) { const m = t.match(/^\d{1,2}:\d{2}\s*\/\s*(\d{1,2}:\d{2})$/); if (m) musicDuration = m[1]!; }
    }

    const musicTitle  = cleanText($(".TrackName3057130458__title").first().text()) || null;
    const musicArtist = cleanText($(".ArtistName2701513331__title").first().text()) || null;
    let comment: string | null = null;
    $("p").each((_i, el) => { if (!comment) { const t = cleanText($(el).text()); if (t.length > 80) comment = t; } });

    console.log(`\n✓ ${slug} (#${number})`);
    console.log(`  First Appearance : ${firstAppearance}`);
    console.log(`  Artwork From     : ${artworkSource}`);
    console.log(`  Music            : ${musicTitle} — ${musicArtist} (${musicDuration})`);
    console.log(`  Comment          : ${(comment ?? "").slice(0, 100)}…`);
  } catch (e: any) {
    console.log(`\n✗ ${slug} → ${e.message.slice(0, 60)}`);
  }
}

async function main() {
  await test("mario");
  await test("ness");
  await test("link");
  await test("pikachu");
  await test("donkey-kong-lady");
}
main().catch(console.error);
