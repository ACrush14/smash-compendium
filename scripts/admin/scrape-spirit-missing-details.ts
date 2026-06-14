import { fetchHtml, cleanText, politeDelay } from "../scrapers/utils";
import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Helper to parse complex tables with rowspan/colspan
function parseTableWithSpan($table: cheerio.Cheerio<cheerio.Element>, $: cheerio.CheerioAPI): string[][] {
  const grid: string[][] = [];

  $table.find("tr").each((rowIndex, tr) => {
    let colIndex = 0;
    $(tr).find("th, td").each((_, cell) => {
      // Find the next available empty cell in this row
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
  console.log("Loading all SPIRITs from the database...");
  const spirits = await db.collectible.findMany({
    where: { type: "SPIRIT" },
    select: { id: true, name: true, sourceGame: true, spiritMusicTitle: true, descriptionEn: true }
  });

  const spiritMap = new Map<string, typeof spirits[0]>();
  for (const s of spirits) {
    spiritMap.set(s.name.toLowerCase(), s);
  }

  console.log(`Loaded ${spirits.length} spirits.`);

  console.log("Fetching series pages from SmashWiki...");
  const $ = await fetchHtml("https://www.ssbwiki.com/List_of_spirits");
  
  const links = $("a").filter((_, el) => {
    const href = $(el).attr("href");
    return !!href && href.startsWith("/List_of_spirits_(") && !href.includes("action=edit");
  }).map((_, el) => $(el).attr("href")).get();

  const uniqueLinks = [...new Set(links)];
  console.log(`Found ${uniqueLinks.length} series pages.`);

  let updatedCount = 0;

  for (const link of uniqueLinks) {
    const url = `https://www.ssbwiki.com${link}`;
    console.log(`\nProcessing: ${url}`);
    
    try {
      const $page = await fetchHtml(url);
      
      $page("table.wikitable").each((_, table) => {
        const grid = parseTableWithSpan($page(table), $page);
        if (grid.length < 2) return;

        // Try to identify column indices by scanning the first few rows (headers)
        let nameCol = -1;
        let originGameCol = -1;
        let musicCol = -1;
        let inspirationCol = -1;

        // Search the first 3 rows for headers
        for (let r = 0; r < Math.min(3, grid.length); r++) {
          for (let c = 0; c < grid[r].length; c++) {
            const val = grid[r][c].toLowerCase();
            if (val === "name" || val === "spirit") nameCol = c;
            else if (val === "origin game") originGameCol = c;
            else if (val === "music") musicCol = c;
            else if (val === "inspiration") inspirationCol = c;
          }
        }

        // If no name column found, skip this table
        if (nameCol === -1) return;

        const updatePromises: any[] = [];

        // Process data rows
        for (let r = 1; r < grid.length; r++) {
          const nameRaw = grid[r][nameCol];
          if (!nameRaw) continue;

          // Some names are empty because it's a header row or rowspan side effect, skip them
          const name = nameRaw.replace(/\[\d+\]/g, "").trim();
          const spirit = spiritMap.get(name.toLowerCase());
          
          if (!spirit) continue;

          let updates: any = {};
          let shouldUpdate = false;

          // Process Origin Game
          if (originGameCol !== -1 && grid[r][originGameCol]) {
            const og = grid[r][originGameCol].replace(/\[\d+\]/g, "").trim();
            // Origin game usually has text like "Tekken(Artwork: Tekken 7)"
            // We can just keep it as is, or strip (Artwork...) if we want, but keeping is fine as it has valuable info.
            if (og && og !== "—" && spirit.sourceGame !== og) {
              updates.sourceGame = og;
              shouldUpdate = true;
            }
          }

          // Process Music
          if (musicCol !== -1 && grid[r][musicCol]) {
            const music = grid[r][musicCol].replace(/\[\d+\]/g, "").trim();
            if (music && music !== "—" && spirit.spiritMusicTitle !== music) {
              updates.spiritMusicTitle = music;
              shouldUpdate = true;
            }
          }

          // Process Inspiration
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
            // Apply updates locally to avoid redundant DB calls on duplicate rows
            Object.assign(spirit, updates);
            updatePromises.push(
              db.collectible.update({
                where: { id: spirit.id },
                data: updates
              })
            );
            updatedCount++;
            console.log(`Updated [${spirit.name}]: ${JSON.stringify(updates).substring(0, 100)}...`);
          }
        }
        
        // Wait for all updates in this table to finish before moving on
        if (updatePromises.length > 0) {
          Promise.all(updatePromises).catch(console.error);
        }
      });

      await politeDelay();
    } catch (err) {
      console.error(`Failed to process ${url}:`, err);
    }
  }

  console.log(`\nFinished! Updated ${updatedCount} records.`);
  process.exit(0);
}

main().catch(console.error);
