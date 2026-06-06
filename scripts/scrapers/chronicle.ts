/**
 * Scraper — Chronicle
 * 
 * Extrai todos os jogos do SmashWiki Chronicle e acopla variações regionais.
 */

import { db } from "../../lib/db";
import { fetchHtml, politeDelay, log } from "./utils";
import { Prisma } from "@prisma/client";

const CHRONICLE_URL = "https://www.ssbwiki.com/Chronicle";

export async function scrapeAndUpsertChronicle(): Promise<void> {
  log.step("Buscando Chronicle do SmashWiki...");
  const $ = await fetchHtml(CHRONICLE_URL);
  
  const entriesMap = new Map<string, Partial<Prisma.ChronicleEntryCreateInput>>();

  $('.tabber').each((_i, tabber) => {
    let prev = $(tabber).prev();
    while (prev.length > 0 && !['h2', 'h3'].includes((prev[0] as any).name)) {
      prev = prev.prev();
    }
    const consoleName = prev.text().trim().replace(/\[edit\]/, '');

    const tabs = $(tabber).find('.tabbertab');
    
    tabs.each((_j, tab) => {
      const tabTitle = $(tab).attr('title') || '';
      const isNTSC = tabTitle.includes('NTSC');
      const isPAL = tabTitle.includes('PAL');
      const isJP = tabTitle.includes('Japan');
      
      $(tab).find('table.wikitable tr').each((_k, row) => {
        const cells = $(row).find('th, td');
        // Pula o cabeçalho
        if ($(cells[0]).prop('tagName') === 'th' || cells.length < 3) return;

        const date = $(cells[0]).text().trim();
        const titleNode = $(cells[1]);
        const aNode = titleNode.find('a').first();
        const href = aNode.attr('href');
        
        // Remove <sup> text (notas de rodapé como [1])
        titleNode.find('sup').remove();
        const title = titleNode.text().trim();

        // O critério de desbloqueio às vezes é apenas um "-"
        let unlock = $(cells[2]).text().trim();
        if (unlock === "—" || unlock === "-") unlock = null as any;

        // Se houver href, usamos como chave para mesclar perfeitamente. 
        // Se não houver, combinamos pelo consoleName + title.
        const key = href ? href : `${consoleName}::${title.toLowerCase()}`;

        if (!entriesMap.has(key)) {
          entriesMap.set(key, { 
            consoleName, 
            wikiUrl: href,
            titleNtsc: "", // Preenchido no post-processamento
          });
        }
        
        const entry = entriesMap.get(key)!;

        if (isNTSC) {
          entry.titleNtsc = title;
          entry.releaseDateNtsc = date;
          if (unlock && !entry.unlockCriteria) entry.unlockCriteria = unlock;
        }
        if (isPAL) {
          if (!entry.titlePal) entry.titlePal = title;
          if (!entry.releaseDatePal) entry.releaseDatePal = date;
          if (unlock && !entry.unlockCriteria) entry.unlockCriteria = unlock;
        }
        if (isJP) {
          entry.titleJp = title;
          entry.releaseDateJp = date;
          if (unlock && !entry.unlockCriteria) entry.unlockCriteria = unlock;
        }
      });
    });
  });

  const finalEntries = Array.from(entriesMap.values());
  log.ok(`${finalEntries.length} jogos únicos processados (unificando NTSC, PAL e JP).`);
  
  log.step("Persistindo Chronicle no banco...");
  
  let processed = 0;
  for (const partial of finalEntries) {
    // Post-processamento de nomes vazios (Exclusivos)
    if (!partial.titleNtsc) {
      if (partial.titleJp && !partial.titlePal) {
        partial.titleNtsc = "JP EXCLUSIVE";
      } else if (partial.titlePal && !partial.titleJp) {
        partial.titleNtsc = "PAL EXCLUSIVE";
      } else {
        partial.titleNtsc = partial.titleJp || partial.titlePal || "UNKNOWN";
      }
    }

    try {
      // Como o Chronicle não é algo que deve atualizar 1 a 1, e não temos unique constraint
      // no schema além do ID gerado aleatoriamente, limparemos a tabela antes no script pai,
      // ou apenas confiaremos no create. Neste caso, faremos upsert manual buscando por nome + console.
      
      // Buscar primeiro se já existe
      const existing = await db.chronicleEntry.findFirst({
        where: { 
          titleNtsc: partial.titleNtsc,
          consoleName: partial.consoleName,
          titleJp: partial.titleJp,
        }
      });

      if (existing) {
        await db.chronicleEntry.update({
          where: { id: existing.id },
          data: partial as Prisma.ChronicleEntryCreateInput
        });
      } else {
        await db.chronicleEntry.create({
          data: partial as Prisma.ChronicleEntryCreateInput
        });
      }
      processed++;
    } catch(err) {
      log.warn(`Falha ao inserir jogo ${partial.titleNtsc}: ${err}`);
    }
  }

  log.ok(`${processed}/${finalEntries.length} entradas do Chronicle cadastradas com sucesso!`);
}
