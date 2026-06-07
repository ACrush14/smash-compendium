/**
 * Scraper — Music SSBU completo (SSBWiki)
 *
 * Fonte: https://www.ssbwiki.com/Music_(SSBU)
 * ~1.068 faixas organizadas por franquia.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/scrapers/scrape-ssbu-music-full.ts
 *   npx tsx --env-file=.env.local scripts/scrapers/scrape-ssbu-music-full.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/scrapers/scrape-ssbu-music-full.ts --limit=100
 */

import { db } from "@/lib/db";
import { fetchHtml, cleanText, log } from "./utils";
import type * as cheerio from "cheerio";

const MUSIC_URL = "https://www.ssbwiki.com/Music_(SSBU)";

const isDryRun = process.argv.includes("--dry-run");
const limitArg = process.argv.find(a => a.startsWith("--limit="));
const LIMIT    = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

// ─── Mapeamento seção wiki → franquia no DB ───────────────────────────────────
const FRANCHISE_MAP: Record<string, string> = {
  "Mario":                         "Super Mario",
  "Donkey Kong":                   "Donkey Kong",
  "The Legend of Zelda":           "The Legend of Zelda",
  "Metroid":                       "Metroid",
  "Yoshi":                         "Yoshi",
  "Kirby":                         "Kirby",
  "Star Fox":                      "Star Fox",
  "Pokémon":                       "Pokémon",
  "Pokemon":                       "Pokémon",
  "F-Zero":                        "F-Zero",
  "EarthBound / MOTHER":           "EarthBound",
  "EarthBound":                    "EarthBound",
  "Ice Climber":                   "Ice Climber",
  "Fire Emblem":                   "Fire Emblem",
  "Game & Watch":                  "Game & Watch",
  "Kid Icarus":                    "Kid Icarus",
  "WarioWare":                     "WarioWare",
  "Wario":                         "Wario",
  "Pikmin":                        "Pikmin",
  "Animal Crossing":               "Animal Crossing",
  "Wii":                           "Wii Sports",
  "Wii Fit":                       "Wii Fit",
  "Punch-Out!!":                   "Punch-Out!!",
  "Xenoblade Chronicles":          "Xenoblade Chronicles",
  "Xenoblade":                     "Xenoblade Chronicles",
  "Splatoon":                      "Splatoon",
  "ARMS":                          "ARMS",
  "Mega Man":                      "Mega Man",
  "Sonic the Hedgehog":            "Sonic the Hedgehog",
  "Sonic":                         "Sonic the Hedgehog",
  "Pac-Man":                       "PAC-MAN",
  "Street Fighter":                "Street Fighter",
  "Final Fantasy":                 "Final Fantasy",
  "FINAL FANTASY VII":             "Final Fantasy",
  "Bayonetta":                     "Bayonetta",
  "Metal Gear":                    "Metal Gear",
  "Castlevania":                   "Castlevania",
  "Persona":                       "Persona",
  "Dragon Quest":                  "Dragon Quest",
  "DRAGON QUEST":                  "Dragon Quest",
  "Banjo-Kazooie":                 "Banjo-Kazooie",
  "Fatal Fury / King of Fighters": "Fatal Fury",
  "Fatal Fury":                    "Fatal Fury",
  "FATAL FURY":                    "Fatal Fury",
  "Minecraft":                     "Minecraft",
  "Tekken":                        "Tekken",
  "Kingdom Hearts":                "Kingdom Hearts",
  "KINGDOM HEARTS":                "Kingdom Hearts",
  "Super Smash Bros.":             "Super Smash Bros.",
  "Mario Kart":                    "Mario Kart",
  "Other":                         "Other",
  "Tracks not listed in Sounds":   "Other",
  "Tracks only used in trailers":  "Other",
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface RawTrack {
  title:           string;
  youtubeId:       string | null;
  compositionType: string | null;
  sourceGame:      string | null;
  duration:        string | null;
  notes:           string | null;
  franchiseName:   string;
  wikiSection:     string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractYoutubeId(href: string): string | null {
  if (!href) return null;
  const m1 = href.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m1) return m1[1];
  const m2 = href.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m2) return m2[1];
  return null;
}

function normalizeComposition(raw: string): string | null {
  if (!raw) return null;
  const r = raw.toLowerCase();
  if (r.includes("new arrangement") || r.includes("new remix"))         return "New Remix";
  if (r.includes("original"))                                            return "Original";
  if (r.includes("64"))                                                  return "SSB64 Remix";
  if (r.includes("melee") || r.includes("dx"))                          return "Melee Remix";
  if (r.includes("brawl"))                                               return "Brawl Remix";
  if (r.includes("ssb4") || r.includes("smash 4") || r.includes("for nintendo")) return "SSB4 Remix";
  if (r.includes("remix") || r.includes("arrangement"))                 return "Remix";
  return raw.trim() || null;
}

// ─── Encontra o h2/h3 mais próximo ANTES de um elemento ───────────────────────
// Estratégia: percorre todos os h2 do documento e vê qual fica logo antes da tabela

function findPrecedingH2(
  $: cheerio.CheerioAPI,
  tableEl: cheerio.Element,
): string {
  let best = "Other";
  // Coleta todos os headings com sua posição no DOM
  $("h2, h3").each((_i, hEl) => {
    const headlineText = cleanText($(hEl).find(".mw-headline").text());
    if (!headlineText || headlineText.toLowerCase().includes("see also")) return;
    // Compara posição DOM: a heading só conta se vem ANTES da tabela
    const pos = tableEl.compareDocumentPosition
      // Node.DOCUMENT_POSITION_FOLLOWING = 4 → tableEl vem depois do heading
      ? tableEl.compareDocumentPosition(hEl)
      : 0;
    // In Cheerio/dom: se heading antecede o table, table.compareDocumentPosition(heading) === 2
    // (Node.DOCUMENT_POSITION_PRECEDING = 2)
    // Se não tem compareDocumentPosition, usamos índice
    if (pos === 2 /* PRECEDING */ || pos === 0) {
      best = headlineText;
    }
  });
  return best;
}

// ─── Parse principal ──────────────────────────────────────────────────────────

async function scrapeMusic(): Promise<RawTrack[]> {
  log.step("Buscando página de música SSBU...");
  const $ = await fetchHtml(MUSIC_URL);
  const tracks: RawTrack[] = [];

  // Abordagem robusta: itera por h2 e coleta tabelas na mesma "section"
  // Usa o índice DOM: encontra todos h2/wikitable, ordena por posição

  // Passo 1: mapeia todos os h2 com seu texto de headline
  const sections: Array<{ idx: number; name: string }> = [];
  $("h2").each((i, hEl) => {
    const txt = cleanText($(hEl).find(".mw-headline").text());
    if (txt && !txt.toLowerCase().includes("see also") && !txt.toLowerCase().includes("notes") && !txt.toLowerCase().includes("content")) {
      sections.push({ idx: i, name: txt });
    }
  });

  log.info(`Seções encontradas: ${sections.map(s => s.name).join(", ")}`);

  // Passo 2: para cada h2, encontra as tabelas que vêm depois dele
  // Usando a estrutura do DOM com nextAll/siblings até o próximo h2

  $("h2").each((_i, hEl) => {
    const sectionName = cleanText($(hEl).find(".mw-headline").text());
    if (!sectionName || sectionName.toLowerCase().includes("see also")) return;
    if (sectionName.toLowerCase().includes("notes")) return;
    if (sectionName.toLowerCase().includes("content")) return;

    const franchiseName = FRANCHISE_MAP[sectionName] ?? sectionName;

    // Percorre todos os elementos após este h2 até encontrar o próximo h2
    let cursor = $(hEl).next();
    let found  = 0;

    while (cursor.length > 0) {
      const tag = (cursor.prop("tagName") as string | undefined)?.toLowerCase() ?? "";

      // Para ao encontrar o próximo h2
      if (tag === "h2") break;

      // Processa a tabela (direta ou dentro de containers)
      const tables = tag === "table"
        ? cursor.filter(".wikitable, .sortable")
        : cursor.find("table.wikitable, table.sortable");

      // Inclui também a tabela se for wikitable ela mesma
      const allTables = tag === "table" && (cursor.hasClass("wikitable") || cursor.hasClass("sortable"))
        ? cursor
        : tables;

      allTables.each((_j, tableEl) => {
        const tableRows = parseTable($, $(tableEl));
        for (const row of tableRows) {
          tracks.push({ ...row, franchiseName, wikiSection: sectionName });
          found++;
        }
      });

      cursor = cursor.next();
    }

    if (found > 0) {
      log.ok(`  ${sectionName} → ${franchiseName}: ${found} faixas`);
    }
  });

  log.ok(`\nTotal: ${tracks.length} faixas de ${new Set(tracks.map(t => t.franchiseName)).size} franquias.`);
  return tracks;
}

// ─── Parse de uma wikitable ───────────────────────────────────────────────────

function parseTable(
  $: cheerio.CheerioAPI,
  table: ReturnType<typeof $>,
): Omit<RawTrack, "franchiseName" | "wikiSection">[] {
  const rows: Omit<RawTrack, "franchiseName" | "wikiSection">[] = [];

  // Detecta índices de colunas pelo cabeçalho (th)
  const headerCells: string[] = [];
  table.find("thead tr th, tbody tr:first-child th").each((_j, th) => {
    headerCells.push($(th).text().trim().toLowerCase());
  });

  const idxTitle       = headerCells.findIndex(h => h.includes("title") || h.includes("music") || h.includes("name"));
  const idxLink        = headerCells.findIndex(h => h.includes("link") || h.includes("youtube") || h.includes("video"));
  const idxComposition = headerCells.findIndex(h => h.includes("composition") || h.includes("type") || h.includes("arrangement"));
  const idxSource      = headerCells.findIndex(h => h.includes("source") || h.includes("game") || h.includes("origin"));
  const idxDuration    = headerCells.findIndex(h => h.includes("duration") || h.includes("length") || h.includes("time"));
  const idxNotes       = headerCells.findIndex(h => h.includes("note") || h.includes("arranger") || h.includes("composer") || h.includes("info"));

  // Posições padrão se não encontrou cabeçalhos
  const tTitle       = idxTitle       >= 0 ? idxTitle       : 0;
  const tLink        = idxLink        >= 0 ? idxLink        : 1;
  const tComposition = idxComposition >= 0 ? idxComposition : 2;
  const tSource      = idxSource      >= 0 ? idxSource      : 3;
  const tDuration    = idxDuration    >= 0 ? idxDuration    : 4;
  const tNotes       = idxNotes       >= 0 ? idxNotes       : 5;

  // Para lidar com rowspan: mantém o "título herdado"
  let inheritedTitle = "";
  let rowspanLeft    = 0;

  table.find("tbody tr").each((_j, row) => {
    const tds = $(row).find("td");
    if (tds.length === 0) return; // linha de cabeçalho (todos th)

    let title = "";
    let tdOffset = 0; // ajuste de offset se título tiver rowspan e não aparecer nesta linha

    if (rowspanLeft > 0) {
      // Sub-track: usa título herdado, células começam 1 coluna antes
      title    = inheritedTitle;
      tdOffset = -1; // células estão deslocadas 1 para a esquerda
      rowspanLeft--;
    } else {
      const titleCell = tds.eq(tTitle);
      const rowspan   = parseInt(titleCell.attr("rowspan") ?? "1", 10);
      title           = cleanText(titleCell.text());
      if (rowspan > 1) {
        inheritedTitle = title;
        rowspanLeft    = rowspan - 1;
      }
    }

    if (!title || /^\d+$/.test(title)) return; // pula linhas numéricas ou vazias

    // Obtém célula com ajuste de offset para sub-tracks
    const getCell = (idx: number): string => {
      const adjusted = idx + tdOffset;
      if (adjusted < 0 || adjusted >= tds.length) return "";
      return cleanText($(tds[adjusted]).text());
    };

    const getLinkHref = (idx: number): string => {
      const adjusted = idx + tdOffset;
      if (adjusted < 0 || adjusted >= tds.length) return "";
      return $(tds[adjusted]).find("a[href]").attr("href") ?? "";
    };

    // YouTube ID
    let youtubeId: string | null = null;
    const linkHref = getLinkHref(tLink);
    if (linkHref) youtubeId = extractYoutubeId(linkHref);
    // Fallback: qualquer link YouTube na linha
    if (!youtubeId) {
      $(row).find("a[href]").each((_k, a) => {
        const h = $(a).attr("href") ?? "";
        if (h.includes("youtube") || h.includes("youtu.be")) {
          const yt = extractYoutubeId(h);
          if (yt) { youtubeId = yt; return false; }
        }
      });
    }

    const rawComposition = getCell(tComposition);
    const sourceGame     = getCell(tSource)    || null;
    const duration       = getCell(tDuration)  || null;
    const notes          = getCell(tNotes)     || null;

    rows.push({
      title,
      youtubeId,
      compositionType: normalizeComposition(rawComposition),
      sourceGame,
      duration: duration && /^\d+:\d{2}$/.test(duration) ? duration : null,
      notes,
    });
  });

  return rows;
}

// ─── Upsert via raw SQL ───────────────────────────────────────────────────────

async function upsertTrack(track: RawTrack, franchiseId: string): Promise<"inserted" | "updated"> {
  const existing = await db.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "Music" WHERE lower(title) = lower($1) AND "franchiseId" = $2 LIMIT 1`,
    track.title,
    franchiseId,
  );

  if (existing.length > 0) {
    await db.$executeRawUnsafe(
      `UPDATE "Music"
       SET "youtubeId"       = COALESCE($2, "youtubeId"),
           "duration"        = COALESCE($3, "duration"),
           "sourceGame"      = COALESCE($4, "sourceGame"),
           "compositionType" = COALESCE($5, "compositionType"),
           "notes"           = COALESCE($6, "notes"),
           "isRemix"         = $7
       WHERE id = $1`,
      existing[0].id,
      track.youtubeId,
      track.duration,
      track.sourceGame,
      track.compositionType,
      track.notes,
      track.compositionType !== null && track.compositionType !== "Original",
    );
    return "updated";
  }

  const newId = `music-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  await db.$executeRawUnsafe(
    `INSERT INTO "Music" (id, title, "franchiseId", arranger, "isRemix", "youtubeId", duration, "sourceGame", "compositionType", notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT DO NOTHING`,
    newId,
    track.title,
    franchiseId,
    track.notes,
    track.compositionType !== null && track.compositionType !== "Original",
    track.youtubeId,
    track.duration,
    track.sourceGame,
    track.compositionType,
    track.notes,
  );
  return "inserted";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║  Scraper: Music SSBU completo (SSBWiki)                  ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  if (isDryRun) console.log("  [DRY RUN] — nenhuma escrita no banco\n");

  const allTracks = await scrapeMusic();
  const tracks    = LIMIT < Infinity ? allTracks.slice(0, LIMIT) : allTracks;

  if (isDryRun) {
    const byFranchise = new Map<string, number>();
    for (const t of tracks) byFranchise.set(t.franchiseName, (byFranchise.get(t.franchiseName) ?? 0) + 1);
    console.log("\nFaixas por franquia:");
    for (const [f, n] of [...byFranchise.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(4)} × ${f}`);
    }
    console.log(`\nTotal: ${tracks.length} faixas`);
    console.log("\nAmostra (primeiras 15):");
    for (const t of tracks.slice(0, 15)) {
      console.log(`  [${t.franchiseName}] "${t.title}" | ${t.compositionType ?? "—"} | src:${t.sourceGame ?? "—"} | ${t.duration ?? "—"} | YT:${t.youtubeId ?? "—"}`);
    }
    return;
  }

  const franchiseCache = new Map<string, string | null>();
  let inserted = 0, updated = 0, failed = 0;

  for (const [i, track] of tracks.entries()) {
    // Franquia
    let cached = franchiseCache.get(track.franchiseName);
    if (cached === undefined) {
      const f = await db.franchise.findFirst({
        where: { name: { equals: track.franchiseName, mode: "insensitive" } },
      }) ?? await db.franchise.findFirst({
        where: { name: { contains: track.franchiseName.split(" ")[0], mode: "insensitive" } },
      });

      if (!f) {
        // Criar franquia nova (para DLC como Minecraft, Kingdom Hearts, etc.)
        try {
          const created = await db.franchise.create({ data: { name: track.franchiseName } });
          cached = created.id;
          log.info(`Nova franquia criada: "${track.franchiseName}"`);
        } catch {
          cached = null;
          log.warn(`Franquia não encontrada: "${track.franchiseName}" (${track.wikiSection})`);
        }
      } else {
        cached = f.id;
      }
      franchiseCache.set(track.franchiseName, cached ?? null);
    }

    const franchiseId = cached;
    if (!franchiseId) { failed++; continue; }

    try {
      const result = await upsertTrack(track, franchiseId);
      if (result === "inserted") inserted++; else updated++;

      if ((i + 1) % 100 === 0 || i + 1 === tracks.length) {
        process.stdout.write(`\r  [${i + 1}/${tracks.length}] ✅ ${inserted} inseridos | ↑ ${updated} atualizados | ❌ ${failed} falhas   `);
      }
    } catch (e) {
      log.warn(`\nFalha em "${track.title}": ${String(e)}`);
      failed++;
    }
  }

  console.log("\n");
  log.ok(`Concluído: ${inserted} inseridos | ${updated} atualizados | ${failed} falhas`);
  const total = await db.$queryRawUnsafe<{ count: bigint }[]>(`SELECT COUNT(*) as count FROM "Music"`);
  log.ok(`Total Music no banco: ${total[0].count}`);
}

main()
  .catch(e => { console.error("✗ Falha:", e); process.exit(1); })
  .finally(() => db.$disconnect());
