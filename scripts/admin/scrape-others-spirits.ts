// @ts-nocheck
import { fetchHtml, cleanText, politeDelay } from "../scrapers/utils";
import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function parseTableWithSpan($table: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string[][] {
  const grid: string[][] = [];

  $table.find("tr").each((rowIndex, tr) => {
    let colIndex = 0;
    $(tr).find("th, td").each((_, cell) => {
      while (grid[rowIndex] && grid[rowIndex][colIndex] !== undefined) {
        colIndex++;
      }

      const rowspan = parseInt($(cell).attr("rowspan") || "1", 10);
      const colspan = parseInt($(cell).attr("colspan") || "1", 10);
      const text = cleanText($(cell).text());

      for (let r = 0; r < rowspan; r++) {
        for (let c = 0; c < colspan; c++) {
          if (!grid[rowIndex + r]) {
            grid[rowIndex + r] = [];
          }
          grid[rowIndex + r][colIndex + c] = text;
        }
      }
    });
  });

  return grid;
}

async function main() {
  console.log("Loading 'Others' SPIRITs from the database (>= 1115)...");
  const spirits = await db.collectible.findMany({
    where: { type: "SPIRIT", posicaoSpiritSsbu: { gte: 1115 } },
    select: { id: true, name: true, sourceGame: true, spiritArtworkSource: true, descriptionEn: true }
  });

  const spiritMap = new Map<string, typeof spirits[0]>();
  for (const s of spirits) {
    spiritMap.set(s.name.toLowerCase().trim(), s);
  }

  console.log(`Loaded ${spirits.length} spirits.`);

  const url = "https://www.ssbwiki.com/List_of_spirits_(Others)";
  console.log(`\nProcessing: ${url}`);
    
  let updatedCount = 0;

  try {
    const $page = await fetchHtml(url);
    const allPromises: any[] = [];
    
    $page("table.wikitable").each((_, table) => {
      const grid = parseTableWithSpan($page(table), $page);
      if (grid.length < 2) return;

      let nameCol = -1;
      let originGameCol = -1;
      let inspirationCol = -1;

      for (let r = 0; r < Math.min(3, grid.length); r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const val = grid[r][c].toLowerCase();
          if (val === "name" || val === "spirit") nameCol = c;
          else if (val === "origin game") originGameCol = c;
          else if (val === "inspiration") inspirationCol = c;
        }
      }

      if (nameCol === -1) return;

      const updatePromises: any[] = [];

      for (let r = 1; r < grid.length; r++) {
        if (!grid[r] || !grid[r][nameCol]) continue;
        
        const nameRaw = grid[r][nameCol];
        const name = nameRaw.replace(/\[\d+\]/g, "").trim().toLowerCase();
        const spirit = spiritMap.get(name);
        
        if (!spirit) continue;

        let updates: any = {};
        let shouldUpdate = false;

        // Process Origin Game
        if (originGameCol !== -1 && grid[r][originGameCol]) {
          const ogRaw = grid[r][originGameCol].replace(/\[\d+\]/g, "").trim();
          if (ogRaw && ogRaw !== "—") {
            let sourceGame = ogRaw;
            let artwork = null;
            
            // Extract artwork using indexOf to handle malformed strings
            const artIdx = ogRaw.indexOf("(Artwork");
            if (artIdx !== -1) {
              sourceGame = ogRaw.substring(0, artIdx).trim();
              const afterArt = ogRaw.substring(artIdx);
              const colonIdx = afterArt.indexOf(":");
              if (colonIdx !== -1) {
                artwork = afterArt.substring(colonIdx + 1, afterArt.length - 1).trim();
              }
            }

            if (spirit.sourceGame !== sourceGame) {
              updates.sourceGame = sourceGame;
              shouldUpdate = true;
            }
            if (artwork && spirit.spiritArtworkSource !== artwork) {
              updates.spiritArtworkSource = artwork;
              shouldUpdate = true;
            }
          }
        }

        // Process Inspiration (if it ever gets added or exists in another table)
        if (inspirationCol !== -1 && grid[r][inspirationCol]) {
          let insp = grid[r][inspirationCol].replace(/\[\d+\]/g, "").trim();
          if (insp.startsWith("Spirit Battle inspiration:")) {
            insp = insp.replace("Spirit Battle inspiration:", "").trim();
          }
          if (insp && insp !== "—" && spirit.descriptionEn !== insp) {
            updates.descriptionEn = insp;
            shouldUpdate = true;
          }
        }

        if (shouldUpdate) {
          Object.assign(spirit, updates);
          updatePromises.push(async () => {
            await db.collectible.update({
              where: { id: spirit.id },
              data: updates
            });
          });
          updatedCount++;
          console.log(`Updated [${spirit.name}]: ${JSON.stringify(updates).substring(0, 100)}...`);
        }
      }
      
      if (updatePromises.length > 0) {
        allPromises.push(...updatePromises);
      }
    });

    if (allPromises.length > 0) {
      for (const updateFn of allPromises) {
        await updateFn();
      }
    }

  } catch (err) {
    console.error(`Failed to process ${url}:`, err);
  }

  console.log(`\nFinished! Updated ${updatedCount} records.`);
  await db.$disconnect();
}

main().catch(console.error);
