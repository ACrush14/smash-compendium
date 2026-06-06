/**
 * Scraper — Collectibles (Trophies, Spirits, Stickers)
 *
 * Fontes:
 *   Fonte 1 (EN base): páginas de lista na SSBWiki (ssbwiki.com)
 *   Fonte 2 (JP canônica): página individual do lutador em smashwiki.info
 *     - Seção "ゲーム中の解説" — blocos <dl>/<dt>/<dd>
 *
 * Title Matching EN→JP:
 *   Base ("Ness")         → JP fighter name ("ネス")
 *   Sufixo SMASH          → "<jpName>(SMASH)"
 *   Sufixo (Alt.)         → "<jpName>(EX)"
 *   Outros (Final Smash)  → sem correspondência automática (null)
 */

import { db } from "../../lib/db";
import {
  fetchHtml,
  politeDelay,
  cleanText,
  log,
  jpWikiUrl,
  parseJpDescriptionSection,
  matchJpEntry,
  type JpEntry,
} from "./utils";
import type { Fighter } from "@prisma/client";

// ─── Fontes EN por tipo e versão ──────────────────────────────────────────────

const SOURCES = [
  { type: "TROPHY" as const, version: "SSBM", url: "https://www.ssbwiki.com/List_of_trophies_by_unlock_criteria_(SSBM)"       },
  { type: "TROPHY" as const, version: "SSBB", url: "https://www.ssbwiki.com/List_of_trophies_by_unlock_criteria_(SSBB)"      },
  { type: "TROPHY" as const, version: "SSB4", url: "https://www.ssbwiki.com/List_of_trophies_by_unlock_criteria_(SSB4-3DS)"   },
  { type: "SPIRIT" as const, version: "SSBU", url: "https://www.ssbwiki.com/List_of_spirits_(complete_list)"   },
  { type: "STICKER" as const,version: "SSBB", url: "https://www.ssbwiki.com/List_of_stickers_(complete_list)"       },
];

// ─── Raw types ────────────────────────────────────────────────────────────────

interface RawCollectible {
  name:         string;
  descriptionEn: string;
  imageUrl:     string | null;
  type:         "TROPHY" | "SPIRIT" | "STICKER";
  version:      string;
  orderIndex:   number;
}

// ─── EN parser ────────────────────────────────────────────────────────────────

async function scrapeCollectiblePage(
  url: string,
  type: "TROPHY" | "SPIRIT" | "STICKER",
  version: string,
): Promise<RawCollectible[]> {
  log.step(`Raspando ${type} de ${version} — ${url}`);
  const $ = await fetchHtml(url);
  const results: RawCollectible[] = [];

  $("table.wikitable tbody tr").each((_i, row) => {
    const cells = $("td", row);
    if (cells.length < 2) return;

    let name = "";
    let descriptionEn = "";
    let imageUrl: string | null = null;
    let explicitNumber: number | null = null;

    cells.each((_j, cell) => {
      const img = $("img", cell).first();
      if (img.length && !imageUrl) {
        imageUrl = img.attr("data-src") ?? img.attr("src") ?? null;
        if (imageUrl?.startsWith("//")) imageUrl = `https:${imageUrl}`;
      }
      const text = cleanText($(cell).text());
      
      // Captura explicitamente o número (ex: Spirits SSBU, Trophies SSBM tem o index em algumas cols)
      const numMatch = text.match(/^#?(\d+)$/);
      if (numMatch && !explicitNumber && _j <= 1) {
        explicitNumber = parseInt(numMatch[1]!, 10);
      }

      if (!name && text.length > 0 && text.length < 80 && !/^\d+$/.test(text) && !text.startsWith("#")) {
        name = text;
      } else if (!descriptionEn && text.length >= 20) {
        descriptionEn = text;
      }
    });

    if (!name) return;
    
    // Se não achou um número explícito na tabela, usa a ordem natural da tabela (1-indexed)
    const orderIndex = explicitNumber ?? (_i + 1);
    
    results.push({ name, descriptionEn, imageUrl, type, version, orderIndex });
  });

  log.ok(`  ${results.length} itens extraídos de ${type}/${version}`);
  return results;
}

// ─── JP parser por lutador ────────────────────────────────────────────────────

/**
 * Dado o nome JP de um fighter, busca a página smashwiki.info e extrai
 * todas as entradas de "ゲーム中の解説" como JpEntry[].
 */
async function scrapeJpEntries(jpName: string): Promise<JpEntry[]> {
  try {
    const url = jpWikiUrl(jpName);
    const $   = await fetchHtml(url);
    return parseJpDescriptionSection($);
  } catch {
    return [];
  }
}

// ─── Fighter index helpers ────────────────────────────────────────────────────

interface FighterRecord extends Fighter {
  jpName?: string | null; // injetado pelo scraper de fighters via jpName do roster
}

function buildFighterIndex(fighters: Fighter[]): Map<string, string> {
  const index = new Map<string, string>();
  for (const f of fighters) {
    index.set(f.name.toLowerCase(), f.id);
    index.set(f.name.toLowerCase().replace(/[^a-z0-9]/g, ""), f.id);
  }
  return index;
}

function findFighterId(
  collectibleName: string,
  fighterIndex: Map<string, string>,
): string | null {
  const lower     = collectibleName.toLowerCase();
  const firstWord = lower.split(" ")[0] ?? lower;
  for (const [key, id] of fighterIndex) {
    if (lower.includes(key) || key.includes(firstWord)) return id;
  }
  return null;
}

// ─── JP name lookup — derivado dos bios já no banco ──────────────────────────

/**
 * Constrói um Map<fighterId, jpName> a partir da tabela FighterBio.
 * O jpName é extraído dos textos SSBU bio (que contêm o nome JP entre parênteses).
 * Fallback: usa o roster hardcoded via import.
 */
async function buildJpNameIndex(): Promise<Map<string, string>> {
  // Importa o roster para obter os jpNames canônicos
  const { SSBU_ROSTER_JP } = await import("./fighters-jp-index");
  const fighters = await db.fighter.findMany({ select: { id: true, name: true } });
  const index = new Map<string, string>();
  for (const f of fighters) {
    const entry = SSBU_ROSTER_JP.find(
      (r) => r.name.toLowerCase() === f.name.toLowerCase()
    );
    if (entry) index.set(f.id, entry.jpName);
  }
  return index;
}

// ─── Upsert principal ─────────────────────────────────────────────────────────

export async function scrapeAndUpsertCollectibles(): Promise<void> {
  const fighters   = await db.fighter.findMany();
  const fighterIdx = buildFighterIndex(fighters);

  // Índice JP por fighterId
  const jpNameIdx  = await buildJpNameIndex();

  // Cache de entradas JP por fighterId (fetch sob demanda)
  const jpCache = new Map<string, JpEntry[]>();

  async function getJpEntries(fighterId: string): Promise<JpEntry[]> {
    if (jpCache.has(fighterId)) return jpCache.get(fighterId)!;
    const jpName = jpNameIdx.get(fighterId);
    const entries = jpName ? await scrapeJpEntries(jpName) : [];
    jpCache.set(fighterId, entries);
    await politeDelay();
    return entries;
  }

  let totalProcessed = 0;

  for (const source of SOURCES) {
    const items = await scrapeCollectiblePage(source.url, source.type, source.version);

    for (const item of items) {
      try {
        const fighterId  = findFighterId(item.name, fighterIdx);
        const jpEntries  = fighterId ? await getJpEntries(fighterId) : [];
        const fighterEn  = fighterId ? (fighters.find((f) => f.id === fighterId)?.name ?? "") : "";
        const fighterJp  = fighterId ? (jpNameIdx.get(fighterId) ?? "") : "";

        // Title matching EN→JP
        const jpMatch = fighterId
          ? matchJpEntry(item.name, fighterJp, fighterEn, source.version, jpEntries)
          : null;

        const id = `${source.type}-${source.version}-${item.name}`.slice(0, 255);

        await db.collectible.upsert({
          where: { id },
          create: {
            id,
            type:             source.type,
            smashGameVersion: source.version,
            name:             item.name,
            nameJp:           jpMatch?.jpName ?? null,
            description:      item.descriptionEn || null,   // legacy
            descriptionEn:    item.descriptionEn || null,
            descriptionJp:    jpMatch?.description ?? null,
            assetRenderUrl:   item.imageUrl,
            sourceType:       "Official",
            orderIndex:       item.orderIndex,
            fighterId,
          },
          update: {
            descriptionEn:  item.descriptionEn || null,
            description:    item.descriptionEn || null,
            ...(jpMatch ? {
              nameJp:        jpMatch.jpName,
              descriptionJp: jpMatch.description,
            } : {}),
            assetRenderUrl: item.imageUrl,
            orderIndex:     item.orderIndex,
            fighterId,
          },
        });

        totalProcessed++;
      } catch (err) {
        log.warn(`  Falha em collectible "${item.name}": ${String(err)}`);
      }
    }

    log.ok(`${source.type}/${source.version}: ${items.length} itens persistidos.`);
    await politeDelay();
  }

  log.ok(`Collectibles: ${totalProcessed} itens no total.`);
}

// ─── Execução Standalone ──────────────────────────────────────────────────────
if (require.main === module) {
  scrapeAndUpsertCollectibles()
    .then(() => {
      log.ok("ETL Massivo de Collectibles Finalizado.");
      process.exit(0);
    })
    .catch((err) => {
      log.error(`Falha no ETL de Collectibles: ${err}`);
      process.exit(1);
    });
}

