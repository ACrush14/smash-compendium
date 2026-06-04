/**
 * Teste isolado de scraping — alvo único: Ness (SSBU)
 *
 * Este script NÃO toca o banco de dados.
 * Ele raspa uma única URL, imprime tudo que extraiu e termina.
 *
 * Execução:
 *   npx tsx scripts/seed.ts
 */

import * as cheerio from "cheerio";
import { fetchHtml, cleanText, wikiUrl, resolveGameVersion, log } from "./scrapers/utils";

// ─── Alvo fixo ────────────────────────────────────────────────────────────────

const TARGET_NAME      = "Ness";
const TARGET_WIKI_PATH = "/Ness_(SSBU)";
const TARGET_URL       = wikiUrl(TARGET_WIKI_PATH);

// ─── Resultado tipado ─────────────────────────────────────────────────────────

interface ScrapeResult {
  name:          string;
  wikiUrl:       string;
  rosterNumber:  string | null;
  franchiseName: string;
  bioEn:         string;
  bioLength:     number;
  appearsIn:     string[];
  debutGame:     string | null;
  imageUrl:      string | null;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

async function scrapeNess(): Promise<ScrapeResult> {
  log.step(`Buscando: ${TARGET_URL}`);
  const $ = await fetchHtml(TARGET_URL);

  // ── 1. Número no roster ─────────────────────────────────────────────────────
  let rosterNumber: string | null = null;
  $(".infobox-row, .pi-data, table.infobox tr").each((_i, el) => {
    const label = $(el).find("th, .infobox-row-header, .pi-data-label").text().trim().toLowerCase();
    if (label.includes("fighter number") || label.includes("no.") || label === "#") {
      const val = $(el).find("td, .infobox-row-value, .pi-data-value").text().trim();
      if (val) rosterNumber = val;
    }
  });

  // Fallback: procura padrão "Fighter #N" no texto da página
  if (!rosterNumber) {
    const pageText = $(".mw-parser-output").text();
    const match    = pageText.match(/fighter\s+#?(\d+)/i);
    if (match?.[1]) rosterNumber = match[1];
  }

  // ── 2. Franquia ─────────────────────────────────────────────────────────────
  let franchiseName = "Unknown";

  // Tenta infobox moderna (Portals/DPL style)
  $(".infobox-row, .pi-data").each((_i, el) => {
    const label = $(el).find(".infobox-row-header, .pi-data-label").text().trim().toLowerCase();
    if (label.includes("universe")) {
      const raw   = cleanText($(el).find(".infobox-row-value, .pi-data-value").text());
      const first = raw.split(/[,\/]/)[0] ?? raw;
      franchiseName = first.trim().replace(/\s*universe\s*/i, "").trim();
    }
  });

  // Fallback: tabela infobox clássica
  if (franchiseName === "Unknown") {
    $("table.infobox tr").each((_i, el) => {
      if (!$(el).text().toLowerCase().includes("universe")) return;
      const td  = $(el).find("td").last();
      const raw = cleanText(td.text());
      const first = raw.split(/[,\/]/)[0] ?? raw;
      franchiseName = first.trim().replace(/\s*universe\s*/i, "").trim();
    });
  }

  // ── 3. Imagem de render ─────────────────────────────────────────────────────
  let imageUrl: string | null = null;
  const infoboxImg = $("table.infobox img, .infobox img").first();
  if (infoboxImg.length) {
    const src = infoboxImg.attr("data-src") ?? infoboxImg.attr("src") ?? null;
    imageUrl  = src?.startsWith("//") ? `https:${src}` : (src ?? null);
  }

  // ── 4. Bio em inglês ────────────────────────────────────────────────────────
  let bioEn = "";

  // Tenta seção "Biography" explícita
  const bioHeading = $("#Biography").closest("h2, h3");
  if (bioHeading.length) {
    const paras = bioHeading.nextUntil("h2, h3").filter("p");
    bioEn = cleanText(paras.map((_i, el) => $(el).text()).get().join(" "));
  }

  // Fallback: primeiro parágrafo substantivo da página
  if (!bioEn) {
    $(".mw-parser-output > p").each((_i, el) => {
      if (bioEn) return; // já encontrou
      const t = $(el).text().trim();
      if (t.length > 100 && !t.startsWith("For other")) {
        bioEn = cleanText(t);
      }
    });
  }

  // ── 5. Aparições por jogo + debut ───────────────────────────────────────────
  const appearsIn: string[] = [];

  // Procura rows de aparição na infobox (contêm ícones de jogo como links/imgs)
  $("table.infobox tr, .infobox-row").each((_i, el) => {
    const rowText = $(el).text().toLowerCase();
    if (!rowText.includes("appear") && !rowText.includes("fighter in") && !rowText.includes("game")) return;

    $(el).find("a[title]").each((_j, a) => {
      const title = $(a).attr("title") ?? "";
      const ver   = resolveGameVersion(title);
      // Filtra versões válidas do enum SMASH_GAME_VERSIONS
      if (ver && ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"].includes(ver) && !appearsIn.includes(ver)) {
        appearsIn.push(ver);
      }
    });
  });

  // Fallback: varredura de alt text de ícones de jogo
  if (appearsIn.length === 0) {
    $(".mw-parser-output img[alt]").each((_i, img) => {
      const alt = $(img).attr("alt") ?? "";
      const ver = resolveGameVersion(alt);
      if (["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"].includes(ver) && !appearsIn.includes(ver)) {
        appearsIn.push(ver);
      }
    });
  }

  // Fallback 2: extrai menções de jogo direto da bio (texto plano)
  if (appearsIn.length <= 1) {
    const bioText = $(".mw-parser-output").text();
    const gamePatterns: Array<[RegExp, string]> = [
      [/Super Smash Bros\. for (Nintendo 3DS|Wii U)/g,          "SSB4"],
      [/Super Smash Bros\. Melee/g,                              "SSBM"],
      [/Super Smash Bros\. Brawl/g,                             "SSBB"],
      [/Super Smash Bros\. Ultimate/g,                           "SSBU"],
      [/original Super Smash Bros\.|Super Smash Bros\. 64/g,    "SSB64"],
    ];
    for (const [pattern, ver] of gamePatterns) {
      if (pattern.test(bioText) && !appearsIn.includes(ver)) {
        appearsIn.push(ver);
      }
    }
    // Re-ordena cronologicamente
    const ORDER = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];
    appearsIn.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  }

  const debutGame = appearsIn[0] ?? null;

  return {
    name:         TARGET_NAME,
    wikiUrl:      TARGET_URL,
    rosterNumber,
    franchiseName,
    bioEn,
    bioLength:    bioEn.length,
    appearsIn,
    debutGame,
    imageUrl,
  };
}

// ─── Saída de diagnóstico ─────────────────────────────────────────────────────

function printResult(r: ScrapeResult): void {
  const SEP   = "─".repeat(60);
  const BLANK = "";

  console.log(BLANK);
  console.log(`\x1b[1m\x1b[33m╔${"═".repeat(58)}╗\x1b[0m`);
  console.log(`\x1b[1m\x1b[33m║   RESULTADO DO SCRAPING — ${r.name.padEnd(30)}║\x1b[0m`);
  console.log(`\x1b[1m\x1b[33m╚${"═".repeat(58)}╝\x1b[0m`);
  console.log(BLANK);

  // Metadados
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m METADADOS\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  console.log(`  URL fonte      : ${r.wikiUrl}`);
  console.log(`  Roster number  : ${r.rosterNumber ?? "\x1b[31m[NÃO ENCONTRADO]\x1b[0m"}`);
  console.log(`  Franquia       : ${r.franchiseName}`);
  console.log(`  Imagem render  : ${r.imageUrl ?? "\x1b[33m[sem imagem na infobox]\x1b[0m"}`);
  console.log(BLANK);

  // Aparições
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m APARIÇÕES EM JOGOS  (debut: ${r.debutGame ?? "desconhecido"})\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  if (r.appearsIn.length === 0) {
    console.log(`  \x1b[31m[NENHUMA APARIÇÃO DETECTADA — verificar seletores de infobox]\x1b[0m`);
  } else {
    r.appearsIn.forEach((v, i) => {
      const marker = i === 0 ? " \x1b[32m← debut\x1b[0m" : "";
      console.log(`  ${String(i + 1).padStart(2)}. ${v}${marker}`);
    });
  }
  console.log(BLANK);

  // Bio
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m BIOGRAFIA EN  (${r.bioLength} chars)\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  if (!r.bioEn) {
    console.log(`  \x1b[31m[BIO NÃO ENCONTRADA — verificar seletor de seção Biography]\x1b[0m`);
  } else {
    // Imprime no máximo 600 chars para não poluir o terminal
    const preview = r.bioEn.length > 600
      ? r.bioEn.slice(0, 600) + `\x1b[2m … [+${r.bioEn.length - 600} chars truncados]\x1b[0m`
      : r.bioEn;
    console.log(`  ${preview}`);
  }
  console.log(BLANK);

  // Diagnóstico final
  console.log(`\x1b[36m${SEP}\x1b[0m`);
  console.log(`\x1b[36m DIAGNÓSTICO\x1b[0m`);
  console.log(`\x1b[36m${SEP}\x1b[0m`);

  const checks: Array<[string, boolean, string]> = [
    ["Roster number", !!r.rosterNumber, "infobox row com 'fighter number'"],
    ["Franquia detectada", r.franchiseName !== "Unknown", "infobox row com 'universe'"],
    ["Aparições mapeadas", r.appearsIn.length > 0, "links com [title] na infobox"],
    ["Bio extraída", r.bioLength > 50, "section #Biography ou primeiro <p> > 100 chars"],
    ["Imagem encontrada", !!r.imageUrl, "img na table.infobox"],
  ];

  for (const [label, ok, hint] of checks) {
    const icon   = ok ? "\x1b[32m✔\x1b[0m" : "\x1b[31m✘\x1b[0m";
    const status = ok ? "\x1b[32mOK\x1b[0m" : `\x1b[31mFALHOU\x1b[0m — checar: ${hint}`;
    console.log(`  ${icon}  ${label.padEnd(22)} ${status}`);
  }

  console.log(BLANK);
  console.log(`\x1b[2m  [Nenhum dado foi gravado no banco — modo dry-run]\x1b[0m`);
  console.log(BLANK);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  try {
    const result = await scrapeNess();
    printResult(result);
  } catch (err) {
    log.error(`Falha fatal: ${String(err)}`);
    if (err instanceof Error) console.error(err.stack);
    process.exit(1);
  }
}

main();
