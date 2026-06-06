/**
 * Scraper — Music (SSBWiki)
 *
 * Fonte: https://www.ssbwiki.com/Music_(Super_Smash_Bros._Ultimate)
 *
 * A página lista trilhas por série/franquia, cada uma com:
 * - Título da música
 * - Compositor/Arranjador
 * - Indicador se é remix ou original
 *
 * Modelo de ingestão:
 *   1. Extrai todas as faixas com sua franquia.
 *   2. Persiste Music + Franchise.
 *   3. Tenta associar cada faixa ao Stage cujo nome aparece na tabela
 *      (SSBWiki lista, em cada seção de stage, as músicas disponíveis nele).
 */

import { db } from "../../lib/db";
import { fetchHtml, politeDelay, cleanText, log } from "./utils";

const MUSIC_URL =
  "https://www.ssbwiki.com/Music_(SSBU)";

interface RawTrack {
  title:        string;
  arranger:     string | null;
  isRemix:      boolean;
  franchiseName: string;
  stageName:    string | null;
}

// ─── Parser da página de música do SSBU ──────────────────────────────────────

async function scrapeMusicPage(): Promise<RawTrack[]> {
  log.step("Buscando lista de músicas do SSBU...");
  const $ = await fetchHtml(MUSIC_URL);
  const tracks: RawTrack[] = [];

  // A página é organizada em seções por franquia/universo (h2 ou h3).
  // Cada seção tem uma wikitable com colunas: #, Title, Composer(s), Arranger(s)
  let currentFranchise = "Unknown";
  let currentStage: string | null = null;

  $(".mw-parser-output > *").each((_i, el) => {
    const tag = ($(el).prop("tagName") as string | undefined)?.toLowerCase() ?? "";

    // Atualiza franquia ao encontrar cabeçalho de seção
    if (tag === "h2" || tag === "h3") {
      const headingText = cleanText($(el).find(".mw-headline").text());
      if (headingText && !headingText.toLowerCase().includes("see also")) {
        // Distingue nome de stage vs franquia: stages tendem a terminar em " Stage"
        // ou são precedidos por um h3 dentro de um h2 de franquia
        if (tag === "h2") {
          currentFranchise = headingText;
          currentStage     = null;
        } else {
          // h3 dentro de uma seção de franquia geralmente é o nome do stage
          currentStage = headingText.replace(/ \(.*\)$/, "").trim();
        }
      }
      return;
    }

    if (tag !== "table") return;
    if (!$(el).hasClass("wikitable")) return;

    // Cabeçalhos da tabela para determinar índice de colunas
    const headers: string[] = [];
    $(el).find("thead th, tbody tr:first-child th").each((_j, th) => {
      headers.push($(th).text().trim().toLowerCase());
    });

    const titleIdx    = headers.findIndex((h) => h.includes("title") || h.includes("music"));
    const arrangerIdx = headers.findIndex((h) => h.includes("arranger") || h.includes("composer"));

    $(el).find("tbody tr").each((_j, row) => {
      const cells = $("td", row);
      if (cells.length < 2) return;

      const title = cleanText(
        titleIdx >= 0
          ? $(cells[titleIdx]).text()
          : $(cells[1]).text(),
      );
      const arrangerRaw = arrangerIdx >= 0
        ? cleanText($(cells[arrangerIdx]).text())
        : null;

      if (!title || /^#?\d+$/.test(title)) return;

      // Indicadores de remix: SSBWiki costuma ter colunas "Original" ou nota "Remix of"
      const rowText = $(row).text().toLowerCase();
      const isRemix = rowText.includes("remix") || rowText.includes("arrangement");

      tracks.push({
        title,
        arranger:     arrangerRaw || null,
        isRemix,
        franchiseName: currentFranchise,
        stageName:    currentStage,
      });
    });
  });

  log.ok(`${tracks.length} faixas extraídas.`);
  return tracks;
}

// ─── Upsert no banco ──────────────────────────────────────────────────────────

export async function scrapeAndUpsertMusic(): Promise<void> {
  const tracks    = await scrapeMusicPage();
  let processed   = 0;

  // Cache de IDs para evitar queries repetidas
  const franchiseCache = new Map<string, string>();
  const stageCache     = new Map<string, string | null>();

  for (const track of tracks) {
    try {
      // Franchise
      let franchiseId = franchiseCache.get(track.franchiseName);
      if (!franchiseId) {
        const f = await db.franchise.upsert({
          where:  { name: track.franchiseName },
          create: { name: track.franchiseName },
          update: {},
        });
        franchiseId = f.id;
        franchiseCache.set(track.franchiseName, franchiseId);
      }

      // Music upsert
      const existing = await db.music.findFirst({
        where: { title: track.title, franchiseId },
      });

      const music = existing
        ? await db.music.update({
            where: { id: existing.id },
            data:  { arranger: track.arranger, isRemix: track.isRemix },
          })
        : await db.music.create({
            data: {
              title:       track.title,
              franchiseId,
              arranger:    track.arranger,
              isRemix:     track.isRemix,
            },
          });

      // StageMusic link
      if (track.stageName) {
        let stageId = stageCache.get(track.stageName);
        if (stageId === undefined) {
          const stage = await db.stage.findFirst({
            where: { name: { contains: track.stageName, mode: "insensitive" } },
          });
          stageId = stage?.id ?? null;
          stageCache.set(track.stageName, stageId ?? null);
        }

        if (stageId) {
          await db.stageMusic.upsert({
            where: {
              stageId_musicId: { stageId, musicId: music.id },
            },
            create: { stageId, musicId: music.id },
            update: {},
          });
        }
      }

      processed++;
    } catch (err) {
      log.warn(`  Falha em música "${track.title}": ${String(err)}`);
    }
  }

  log.ok(`Músicas: ${processed}/${tracks.length} persistidas.`);
  await politeDelay();
}
