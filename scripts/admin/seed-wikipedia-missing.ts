import { PrismaClient } from '@prisma/client';
import { fetchHtml } from '../scrapers/utils';

const db = new PrismaClient();

async function main() {
  const missing = await db.chronicleEntry.findMany({
    where: { boxArtUrl: null, wikiUrl: null }
  });

  console.log(`Encontrados ${missing.length} registros sem wikiUrl e sem boxArtUrl.`);

  let updatedCount = 0;

  for (const entry of missing) {
    if (!entry.titleNtsc) continue;
    
    // We try Wikipedia since the titles match Wikipedia page names better for core games.
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(entry.titleNtsc.replace(/ /g, '_'))}`;
    
    console.log(`Buscando: ${entry.titleNtsc}`);

    try {
      const $ = await fetchHtml(wikiUrl);
      const img = $('.infobox img').first();
      let boxArtUrl = null;
      
      if (img.length > 0) {
        let src = img.attr('src');
        if (src) {
          if (src.startsWith('//')) src = 'https:' + src;
          else if (src.startsWith('/')) src = 'https://en.wikipedia.org' + src;
          // Change thumb to full size by removing the thumb segment and width, or just use thumb. 250px thumb is fine.
          boxArtUrl = src;
        }
      }

      await db.chronicleEntry.update({
        where: { id: entry.id },
        data: {
          wikiUrl: wikiUrl,
          boxArtUrl: boxArtUrl
        }
      });
      
      updatedCount++;
      console.log(`  -> URL: ${wikiUrl}`);
      console.log(`  -> IMG: ${boxArtUrl}`);

    } catch(err) {
      console.log(`  -> Não encontrado no Wikipedia.`);
    }
    
    // sleep to be nice to Wikipedia
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`Processo concluído! ${updatedCount} registros atualizados.`);
}

main().finally(() => db.$disconnect());
