import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const db = new PrismaClient();

const CONSOLE_MAPPING: Record<string, string> = {
  "Super Nintendo Entertainment System": "Super Nintendo Entertainment System",
  "Nintendo Entertainment System": "Nintendo Entertainment System",
  "Game Boy Advance": "Game Boy Advance",
  "Game Boy": "Game Boy",
  "Game Boy Color": "Game Boy Color",
  "Nintendo 64": "Nintendo 64",
  "Nintendo GameCube": "Nintendo GameCube",
  "Wii": "Wii",
  "Wii U": "Wii U",
  "Nintendo Switch": "Nintendo Switch",
  "Nintendo DS": "Nintendo DS",
  "Nintendo 3DS": "Nintendo 3DS",
  "Family Computer": "Family Computer",
  "Famicom Disk System": "Famicom Disk System",
  "Arcade game": "Arcade",
  "arcade video game machine": "Arcade",
  "PlayStation": "PlayStation 1",
  "PlayStation 2": "PlayStation 2",
  "PlayStation 3": "PlayStation 3",
  "PlayStation 4": "PlayStation 4",
  "PlayStation Portable": "PlayStation Portable",
  "PlayStation Vita": "PlayStation Vita",
  "Xbox 360": "Xbox 360",
  "Xbox One": "Xbox One",
  "Microsoft Windows": "PC",
  "MS-DOS": "PC",
  "DOS": "PC",
  "macOS": "PC",
  "Linux": "PC",
  "Sega Genesis": "Sega Genesis",
  "Mega Drive": "Sega Genesis",
  "Neo Geo": "Neo Geo",
  "Neo Geo Pocket Color": "Neo Geo",
  "Dreamcast": "Dreamcast",
  "Game & Watch": "Game & Watch",
  "Virtual Boy": "Virtual Boy",
  "Sega CD": "Sega CD",
  "Sega 32X": "Sega 32X",
  "Android": "Mobile",
  "iOS": "Mobile",
  "mobile phone": "Mobile"
};

const CONSOLE_PRIORITY = [
  "Arcade",
  "Family Computer", "Nintendo Entertainment System", "Famicom Disk System",
  "Super Nintendo Entertainment System", 
  "Game Boy", "Game Boy Color", "Virtual Boy",
  "Nintendo 64",
  "Game Boy Advance",
  "Nintendo GameCube",
  "Nintendo DS",
  "Wii",
  "Nintendo 3DS",
  "Wii U",
  "Nintendo Switch",
  "PlayStation 1", "PlayStation 2", "PlayStation 3", "PlayStation 4", "PlayStation Portable", "PlayStation Vita",
  "Sega Genesis", "Sega CD", "Sega 32X", "Dreamcast",
  "Neo Geo",
  "Xbox 360", "Xbox One",
  "PC",
  "Mobile"
];

const fetchOpts = {
  headers: {
    "User-Agent": "SuperSmashBrosMuseum/1.0 (https://github.com; test@test.com)"
  }
};

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const unknowns = await db.chronicleEntry.findMany({
    where: { consoleName: "Unknown" }
  });

  console.log(`Encontrados ${unknowns.length} jogos com console 'Unknown'.`);

  let updatedCount = 0;

  for (const entry of unknowns) {
    if (!entry.wikiUrl) {
      console.log(`Ignorando ${entry.titleNtsc} (Sem wikiUrl)`);
      continue;
    }

    try {
      const title = entry.wikiUrl.split('/').pop()!;
      
      // 1. Get Wikidata ID from Wikipedia title
      const wpRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${title}&format=json`, fetchOpts);
      const wpData = await wpRes.json() as any;
      const pages = wpData.query?.pages || {};
      const pageId = Object.keys(pages)[0];
      const wikidataId = pages[pageId]?.pageprops?.wikibase_item;
      
      if (!wikidataId) {
        console.log(`[${entry.titleNtsc}] Sem Wikidata ID.`);
        continue;
      }
      
      // 2. Get Platform claims (P400)
      const wdRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wikidataId}&property=P400&format=json`, fetchOpts);
      const wdData = await wdRes.json() as any;
      const platformClaims = wdData.claims?.P400;
      
      if (!platformClaims) {
        console.log(`[${entry.titleNtsc}] Sem plataformas no Wikidata.`);
        continue;
      }
      
      const platformIds = platformClaims.map((c: any) => c.mainsnak.datavalue?.value?.id).filter(Boolean);
      if (platformIds.length === 0) continue;
      
      // 3. Get labels for these platform IDs
      const labelsRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${platformIds.join('|')}&props=labels&languages=en&format=json`, fetchOpts);
      const labelsData = await labelsRes.json() as any;
      
      const platforms = platformIds.map((id: string) => labelsData.entities[id]?.labels?.en?.value).filter(Boolean);
      
      // 4. Map to our known consoles
      const mappedConsoles = platforms.map(p => CONSOLE_MAPPING[p]).filter(Boolean);
      
      if (mappedConsoles.length === 0) {
        console.log(`[${entry.titleNtsc}] Nenhuma plataforma mapeada. (Encontradas: ${platforms.join(', ')})`);
        continue;
      }
      
      // 5. Select best console by priority
      const bestConsole = mappedConsoles.sort((a, b) => {
        const idxA = CONSOLE_PRIORITY.indexOf(a);
        const idxB = CONSOLE_PRIORITY.indexOf(b);
        const prioA = idxA === -1 ? 999 : idxA;
        const prioB = idxB === -1 ? 999 : idxB;
        return prioA - prioB;
      })[0];
      
      if (bestConsole) {
        await db.chronicleEntry.update({
          where: { id: entry.id },
          data: { consoleName: bestConsole }
        });
        console.log(`[✓] ${entry.titleNtsc} -> ${bestConsole}`);
        updatedCount++;
      } else {
        console.log(`[${entry.titleNtsc}] Não conseguiu escolher a melhor plataforma.`);
      }

    } catch (e) {
      console.error(`Erro ao processar ${entry.titleNtsc}:`, e);
    }
    
    // Rate limit
    await delay(1000);
  }

  console.log(`Processo concluído! ${updatedCount} jogos atualizados.`);
}

run().finally(() => db.$disconnect());
