import { db } from "../../lib/db";
import { fetchHtml, log, politeDelay } from "./utils";

async function fetchBoxArtFromWiki(wikiUrl: string): Promise<string | null> {
  const url = `https://www.ssbwiki.com${wikiUrl}`;
  try {
    const $ = await fetchHtml(url);
    const img = $(".infobox img").first();
    let rawUrl = img.attr("data-src") ?? img.attr("src") ?? null;
    if (!rawUrl) return null;
    if (rawUrl.startsWith("//")) rawUrl = `https:${rawUrl}`;
    
    // Convert to full resolution if it's a thumbnail
    if (rawUrl.includes("/thumb/")) {
      rawUrl = rawUrl.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
    }
    
    return rawUrl;
  } catch (err: any) {
    log.warn(`  Não foi possível buscar a arte na URL "${wikiUrl}": ${err.message}`);
    return null;
  }
}

async function main() {
  const entries = await db.chronicleEntry.findMany({
    where: { 
      wikiUrl: { not: null },
      boxArtUrl: null
    }
  });

  log.step(`Iniciando busca de Box Arts para ${entries.length} jogos do Chronicles...`);

  let updatedCount = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry) continue;
    log.step(`[${i+1}/${entries.length}] Buscando Box Art para: ${entry.titleNtsc}`);
    
    const boxArtUrl = await fetchBoxArtFromWiki(entry.wikiUrl!);
    
    if (boxArtUrl) {
      await db.chronicleEntry.update({
        where: { id: entry.id },
        data: { boxArtUrl }
      });
      log.ok(`  Salvo: ${boxArtUrl}`);
      updatedCount++;
    } else {
      log.warn(`  Nenhuma arte encontrada.`);
    }

    await politeDelay();
  }

  log.ok(`Concluído! ${updatedCount} capas de jogos adicionadas.`);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
