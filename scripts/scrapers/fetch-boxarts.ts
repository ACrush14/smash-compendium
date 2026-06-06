import { db } from "../../lib/db";
import { fetchHtml, cleanText, wikiUrl, log, politeDelay } from "./utils";

async function fetchBoxArtForGame(titleEn: string): Promise<string | null> {
  const url = wikiUrl(`/${titleEn.replace(/ /g, "_")}`);
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
    log.warn(`  Não foi possível buscar a arte para "${titleEn}": ${err.message}`);
    return null;
  }
}

async function main() {
  const games = await db.game.findMany();
  log.step(`Iniciando busca de Box Arts para ${games.length} jogos...`);

  let updatedCount = 0;

  for (const game of games) {
    if (game.boxArtUrl) continue; // Skip if already has a box art

    log.step(`Buscando Box Art para: ${game.titleEn}`);
    const boxArtUrl = await fetchBoxArtForGame(game.titleEn);
    
    if (boxArtUrl) {
      await db.game.update({
        where: { id: game.id },
        data: { boxArtUrl }
      });
      log.ok(`  Salvo: ${boxArtUrl}`);
      updatedCount++;
    } else {
      log.warn(`  Nenhuma arte encontrada para ${game.titleEn}`);
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
