import { PrismaClient } from '@prisma/client';
import { fetchHtml } from '../scrapers/utils';

const db = new PrismaClient();

function normalize(str: string): string {
  return str.replace(/\s*\(\d{4}\)$/, '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function main() {
  const collectibles = await db.collectible.findMany({
    where: { type: 'SPIRIT', posicaoSpiritSsbu: { gte: 1115 } },
    select: { id: true, sourceGame: true, spiritArtworkSource: true, spiritFirstAppearance: true }
  });

  const chronicles = await db.chronicleEntry.findMany({
    select: { id: true, titleNtsc: true }
  });

  const chronMap = new Map<string, string>();
  for (const c of chronicles) {
    chronMap.set(normalize(c.titleNtsc), c.id);
  }

  // Find missing unique names
  const missingNames = new Set<string>();

  for (const item of collectibles) {
    for (const rawName of [item.sourceGame, item.spiritArtworkSource, item.spiritFirstAppearance]) {
      if (!rawName) continue;
      
      const cleanName = rawName.replace(/\s*\(\d{4}\)$/, '').trim();
      const norm = normalize(cleanName);
      
      if (norm && norm !== 'nintendo' && norm !== 'originalgame' && !chronMap.has(norm)) {
        missingNames.add(cleanName);
      }
    }
  }

  console.log(`Found ${missingNames.size} missing games to seed into Chronicles.`);

  let createdCount = 0;

  for (const gameName of missingNames) {
    const norm = normalize(gameName);
    if (chronMap.has(norm)) continue; // in case a previous loop created it

    console.log(`\nFetching Box Art for: ${gameName}`);
    
    // Attempt to scrape SmashWiki
    const url = `https://www.ssbwiki.com/${encodeURIComponent(gameName.replace(/ /g, '_'))}`;
    let boxArtUrl = null;
    let wikiUrl = null;

    try {
      const $ = await fetchHtml(url);
      
      // SmashWiki infobox images are usually in a table with class 'infobox'
      const img = $('.infobox img').first();
      if (img.length > 0) {
        let src = img.attr('src');
        if (src) {
          if (src.startsWith('//')) src = 'https:' + src;
          else if (src.startsWith('/')) src = 'https://www.ssbwiki.com' + src;
          
          boxArtUrl = src;
        }
      }
      wikiUrl = url;
    } catch (err) {
      console.log(`  -> Page not found or error for ${gameName}`);
    }

    // Attempt to scrape GiantBomb or somewhere? We will just stick to SmashWiki or null
    console.log(`  -> Image: ${boxArtUrl}`);

    const newChronicle = await db.chronicleEntry.create({
      data: {
        consoleName: 'Unknown',
        titleNtsc: gameName,
        wikiUrl: wikiUrl,
        boxArtUrl: boxArtUrl,
      }
    });

    chronMap.set(norm, newChronicle.id);
    createdCount++;
  }

  console.log(`\nFinished seeding ${createdCount} new ChronicleEntries!`);
}

main().catch(console.error).finally(() => db.$disconnect());
