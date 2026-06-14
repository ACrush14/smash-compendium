/**
 * scrape-trophy-descriptions.ts
 *
 * Scrapa descrições e "First Game / Moves" dos troféus de Melee, Brawl e Smash 4.
 * Para cada jogo, extrai as URLs das séries do navbox da página "complete list",
 * depois scrapa cada página de série.
 *
 * Popula: Collectible.descriptionEn + Collectible.sourceGame
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/scrape-trophy-descriptions.ts
 *   npx tsx --env-file=.env.local scripts/admin/scrape-trophy-descriptions.ts --game=SSBM
 *   npx tsx --env-file=.env.local scripts/admin/scrape-trophy-descriptions.ts --game=SSBB
 *   npx tsx --env-file=.env.local scripts/admin/scrape-trophy-descriptions.ts --game=SSB4
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log, sleep } from "../scrapers/utils";

const WIKI = "https://www.ssbwiki.com";
const DELAY = 1600;

const GAME_ARG = process.argv.find(a => a.startsWith("--game="))?.split("=")[1];

// ── Jogos a processar ─────────────────────────────────────────────────────────
const GAMES: { version: string[]; urlPrefix: string; completeListUrl: string; label: string }[] = [
  {
    version: ["SSBM"],
    urlPrefix: "List_of_SSBM_trophies_",
    completeListUrl: `${WIKI}/List_of_SSBM_trophies_(complete_list)`,
    label: "Melee",
  },
  {
    version: ["SSBB"],
    urlPrefix: "List_of_SSBB_trophies_",
    completeListUrl: `${WIKI}/List_of_SSBB_trophies_(complete_list)`,
    label: "Brawl",
  },
  {
    version: ["SSB4", "SSB4_3DS", "SSB4_WIIU"],
    urlPrefix: "List_of_SSB4_trophies_",
    completeListUrl: `${WIKI}/List_of_SSB4_trophies_(complete_list)`,
    label: "Smash 4",
  },
];

function norm(s: string): string {
  return s.toLowerCase().replace(/[''`']/g, "").replace(/[^a-z0-9]/g, "");
}

// ── Extrai URLs das páginas de série a partir do navbox ───────────────────────
// urlPrefix filtra apenas as páginas do jogo correto (navbox inclui links de todos os jogos)
async function getSeriesUrls(completeListUrl: string, urlPrefix: string): Promise<string[]> {
  const $ = await fetchHtml(completeListUrl, 3);
  const urls: string[] = [];

  // Navbox no final da página — contém links para cada série de TODOS os jogos
  $("table.navbox a[href]").each((_i, el) => {
    const href = $(el).attr("href") ?? "";
    // Filtra pelo prefixo do jogo específico para evitar cross-contamination
    if (href.includes(urlPrefix) && !href.includes("complete_list") && !href.includes("#")) {
      const full = href.startsWith("http") ? href : `${WIKI}${href}`;
      if (!urls.includes(full)) urls.push(full);
    }
  });

  return urls;
}

// ── Parse de uma página de série ──────────────────────────────────────────────
interface TrophyDesc {
  name:        string;
  description: string;
  firstGame:   string;
}

async function scrapeSeriesPage(url: string): Promise<TrophyDesc[]> {
  const $ = await fetchHtml(url, 3);
  const results: TrophyDesc[] = [];

  // Cada página pode ter múltiplas tabelas (Normal order, Game order, ou versões 3DS/WiiU)
  // Pegamos todas as wikitables e procuramos as que têm coluna "Description"
  $("table.wikitable").each((_ti, table) => {
    // Detecta colunas pelo header
    const headerCells: string[] = [];
    $(table).find("thead tr th, tbody tr:first-child th").each((_i, th) => {
      headerCells.push(cleanText($(th).text()).toLowerCase());
    });

    const descIdx  = headerCells.findIndex(h => h.includes("description") || h.includes("desc"));
    const nameIdx  = headerCells.findIndex(h => h === "name" || h.startsWith("name"));
    const gameIdx  = headerCells.findIndex(h => h.includes("first game") || h.includes("moves") || h.includes("game / moves"));

    if (descIdx === -1 || nameIdx === -1) return; // tabela sem description, pula

    $(table).find("tbody tr").each((_ri, row) => {
      const cells = $("td", row);
      if (cells.length < descIdx + 1) return;

      const name = cleanText($(cells.eq(nameIdx)).text());
      if (!name) return;

      const descCell = $(cells.eq(descIdx));
      const description = cleanText(descCell.find("p").text() || descCell.clone().find("dl").remove().end().text());

      // Extrai sourceGame: <dd> com <img> de plataforma = jogo de origem
      //                    <dd> sem <img> = movimento (troféu SMASH de lutador)
      const gameNames: string[] = [];
      descCell.find("dl > dd").each((_i, dd) => {
        const rawHtml = $(dd).html() || "";
        const gameName = cleanText($("<div>").html(rawHtml.replace(/<br\s*\/?>/gi, " ")).text()).replace(/^[:\s]+/, "");
        if (gameName) gameNames.push(gameName);
      });
      let firstGame = gameNames.join(" / ");

      // Fallback para coluna separada (Melee): "first game" = extrai; "moves"/"game / moves" = SMASH
      if (!firstGame && gameIdx !== -1) {
        const rawGameHtml = $(cells.eq(gameIdx)).html() || "";
        const gameText = cleanText($("<div>").html(rawGameHtml.replace(/<br\s*\/?>/gi, " ")).text());
        
        // Se o texto parecer uma lista de movimentos (ex: "B: Fireball")
        if (gameText.includes(" B:") || gameText.includes("B:")) {
          firstGame = "SMASH"; // Melee SMASH trophy
        } else {
          firstGame = gameText;
          // Normaliza nomenclaturas de Smash conforme regra de negócio
          if (firstGame.includes("Super Smash Bros. Melee")) {
            firstGame = "Super Smash Bros. Melee (GCN)";
          } else if (firstGame.includes("Super Smash Bros.")) {
            firstGame = "Super Smash Bros. (N64)";
          }
        }
      }

      if (!description) return;
      results.push({ name, description, firstGame });
    });
  });

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const games = GAME_ARG
    ? GAMES.filter(g => g.version.includes(GAME_ARG) || g.label.toLowerCase().includes(GAME_ARG.toLowerCase()))
    : GAMES;

  if (games.length === 0) {
    console.error(`Jogo não encontrado: ${GAME_ARG}. Use SSBM, SSBB ou SSB4.`);
    process.exit(1);
  }

  let totalUpdated = 0;

  for (const game of games) {
    log.step(`\n=== ${game.label} ===`);

    // Carrega troféus do banco para este jogo
    const dbTrophies = await db.collectible.findMany({
      where: { type: "TROPHY", smashGameVersion: { in: game.version } },
      select: { id: true, name: true, smashGameVersion: true },
    });
    log.ok(`${dbTrophies.length} troféus no banco`);

    // Indexa por nome normalizado (tentando todas as versões)
    const dbByName = new Map<string, typeof dbTrophies[0][]>();
    for (const t of dbTrophies) {
      const key = norm(t.name);
      if (!dbByName.has(key)) dbByName.set(key, []);
      dbByName.get(key)!.push(t);
    }

    // Descobre URLs das séries (filtradas pelo prefixo do jogo)
    log.step(`Buscando URLs de séries em ${game.completeListUrl}…`);
    const seriesUrls = await getSeriesUrls(game.completeListUrl, game.urlPrefix);
    log.ok(`${seriesUrls.length} páginas de série encontradas`);

    let gameUpdated = 0;
    let notFound = 0;

    for (const url of seriesUrls) {
      const pageName = decodeURIComponent(url.split("/").pop() ?? url);
      process.stdout.write(`  Scraping ${pageName}…`);
      await sleep(DELAY);

      const rows = await scrapeSeriesPage(url);
      process.stdout.write(` ${rows.length} troféus\n`);

      for (const row of rows) {
        const key = norm(row.name);
        const matches = dbByName.get(key);
        if (!matches?.length) {
          // Tenta sem sufixo "(2)"
          const base = norm(row.name.replace(/\s*\(2\)$/, ""));
          const baseMatches = dbByName.get(base);
          if (!baseMatches?.length) { notFound++; continue; }

          for (const m of baseMatches) {
            await db.collectible.update({
              where: { id: m.id },
              data: {
                descriptionEn: row.description || null,
                sourceGame:    row.firstGame   || null,
              },
            });
            gameUpdated++;
          }
          continue;
        }

        for (const m of matches) {
          await db.collectible.update({
            where: { id: m.id },
            data: {
              descriptionEn: row.description || null,
              sourceGame:    row.firstGame   || null,
            },
          });
          gameUpdated++;
        }
      }
    }

    log.ok(`${game.label}: ${gameUpdated} troféus atualizados, ${notFound} não encontrados`);
    totalUpdated += gameUpdated;
  }

  log.ok(`\nTotal geral: ${totalUpdated} troféus com descrição`);
}

main().catch(console.error);
