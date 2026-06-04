/**
 * Scraper — Stages
 *
 * Fonte: https://www.ssbwiki.com/List_of_stages
 *
 * A página lista todos os estágios com: nome, jogo de origem (debut),
 * universo (franquia) e se é retorno ou estreia.
 * O scraper extrai esses dados e os persiste na tabela Stage.
 */

import { db } from "../../lib/db";
import {
  fetchHtml,
  politeDelay,
  cleanText,
  wikiUrl,
  resolveGameVersion,
  log,
} from "./utils";

const STAGES_LIST_URL = "https://www.ssbwiki.com/List_of_stages";

interface RawStage {
  name:             string;
  franchiseName:    string;
  smashDebutVersion: string;
  detailPath:       string | null;
}

// ─── Raspa a lista de estágios ────────────────────────────────────────────────

async function scrapeStageList(): Promise<RawStage[]> {
  log.step("Buscando lista de estágios...");
  const $ = await fetchHtml(STAGES_LIST_URL);
  const stages: RawStage[] = [];

  // A página tem seções por jogo, cada uma com uma wikitable.
  // Cada linha da tabela contém: Stage, Series/Origin, Debut (para estágios de retorno)
  $("table.wikitable").each((_tIdx, table) => {
    // Detecta versão pelo cabeçalho h2/h3 anterior à tabela
    const heading = $(table).prevAll("h2, h3").first().find(".mw-headline").text();
    const debutVersion = resolveGameVersion(heading);

    $("tbody tr", table).each((_i, row) => {
      const cells = $("td", row);
      if (cells.length < 2) return;

      const raw0 = cells.get(0);
      const raw1 = cells.get(1);
      if (!raw0 || !raw1) return;

      const nameCell   = $(raw0);
      const seriesCell = $(raw1);

      const link        = nameCell.find("a").first();
      const name        = cleanText(link.text() || nameCell.text());
      const rawSeries   = cleanText(seriesCell.find("a").text() || seriesCell.text());
      const franchiseName = (rawSeries.split(/[,\/]/)[0] ?? rawSeries).trim();
      const detailPath  = link.attr("href") ?? null;

      if (!name || name.length < 2) return;

      stages.push({ name, franchiseName, smashDebutVersion: debutVersion, detailPath });
    });
  });

  log.ok(`${stages.length} estágios encontrados.`);
  return stages;
}

// ─── Raspa descrição individual (opcional, com rate limit) ───────────────────

async function scrapeStageDescription(detailPath: string): Promise<string> {
  try {
    const $ = await fetchHtml(wikiUrl(detailPath));
    const firstPara = $(".mw-parser-output > p").filter((_i, el) => {
      const t = $(el).text().trim();
      return t.length > 60;
    }).first();
    return cleanText(firstPara.text());
  } catch {
    return "";
  }
}

// ─── Upsert no banco ──────────────────────────────────────────────────────────

export async function scrapeAndUpsertStages(): Promise<void> {
  const rawStages = await scrapeStageList();
  let processed   = 0;

  for (const raw of rawStages) {
    try {
      const franchise = await db.franchise.upsert({
        where:  { name: raw.franchiseName || "Unknown" },
        create: { name: raw.franchiseName || "Unknown" },
        update: {},
      });

      // Busca descrição na página do estágio (com delay)
      let description: string | null = null;
      if (raw.detailPath) {
        description = await scrapeStageDescription(raw.detailPath) || null;
        await politeDelay();
      }

      await db.stage.upsert({
        where:  { name: raw.name },
        create: {
          name:              raw.name,
          franchiseId:       franchise.id,
          smashDebutVersion: raw.smashDebutVersion,
          description,
        },
        update: {
          franchiseId:       franchise.id,
          smashDebutVersion: raw.smashDebutVersion,
          description,
        },
      });

      processed++;
      log.ok(`  Stage "${raw.name}" (${raw.smashDebutVersion}) salvo.`);
    } catch (err) {
      log.error(`  Falha em stage "${raw.name}": ${String(err)}`);
    }
  }

  log.ok(`Stages: ${processed}/${rawStages.length} persistidos.`);
}
