/**
 * fix-chronicles-false-positives.ts
 *
 * Limpa entradas de ChronicleEntry.boxArtUrl que são falsos positivos:
 * - Logos do MediaWiki (poweredby_mediawiki_88x31.png)
 * - Creative Commons icons (cc-by-sa.png)
 * - Outros ícones de sistema
 *
 * Run: npx tsx --env-file=.env.local scripts/scrapers/fix-chronicles-false-positives.ts
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const FALSE_POSITIVE_PATTERNS = [
  "poweredby_mediawiki",
  "cc-by-sa",
  "cc-by",
  "cc-0",
  "creative_commons",
  "mediawiki.org",
  "wikidata-logo",
  "commons-logo",
  "portal-puzzle",
  "disambig",
  "question_mark",
  "OOjs_UI_icon",
  // Logo images (not box art)
  "_logo.png",
  "_logo.jpg",
  "_logo.svg",
  "wikimedia_logo",
  "commons_logo",
];

// Regex patterns in URL that indicate NOT a box art
const FALSE_POSITIVE_URL_PATTERNS = [
  /poweredby/i,
  /mediawiki.*logo/i,
  /[_-]logo\.(png|jpg|gif|svg)/i,   // *_logo.png, *-logo.png
  /Logo\.(png|jpg)/i,                // *Logo.png (capital L)
  /cc-by/i,
  /creative.commons/i,
  /88x31/i,        // banner-size images (e.g. 88x31 px MediaWiki badge)
  /Cscr-featured/i,
  /Disambig/i,
  /Wikidata/i,
  /commons-logo/i,
  /\/icon_/i,
  /pictochat/i,    // specific false positive
];

async function main() {
  // Get all entries with boxArtUrl set
  const entries = await db.chronicleEntry.findMany({
    where:  { boxArtUrl: { not: null } },
    select: { id: true, titleNtsc: true, consoleName: true, boxArtUrl: true },
  });

  console.log(`Checking ${entries.length} entries with boxArtUrl...`);

  let cleared = 0;
  for (const entry of entries) {
    const url = entry.boxArtUrl ?? "";
    const urlLower = url.toLowerCase();
    const isFalsePositive = FALSE_POSITIVE_PATTERNS.some((p) => urlLower.includes(p.toLowerCase()))
      || FALSE_POSITIVE_URL_PATTERNS.some((re) => re.test(url));
    if (isFalsePositive) {
      console.log(`  ❌ Clearing: ${entry.consoleName} — ${entry.titleNtsc} [${entry.boxArtUrl?.split("/").pop()}]`);
      await db.chronicleEntry.update({
        where: { id: entry.id },
        data:  { boxArtUrl: null },
      });
      cleared++;
    }
  }

  console.log(`\n✅ Done. Cleared ${cleared} false positives.`);
}

main().catch(console.error).finally(() => db.$disconnect());
