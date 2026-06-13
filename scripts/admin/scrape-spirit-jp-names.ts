/**
 * scrape-spirit-jp-names.ts
 *
 * Preenche nameJp dos spirits a partir da SSBWiki e do smashwiki.info (wiki JP).
 *
 * Estratégia em 3 camadas:
 *  1. Página de lista do smashwiki.info (wiki JP) — tabela com nomes JP + número
 *  2. Página individual SSBWiki em inglês — infobox do spirit com nome JP
 *  3. Fallback: tenta URL alternativa sem sufixo "(spirit)"
 *
 * Run: npx tsx scripts/admin/scrape-spirit-jp-names.ts
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText, log, sleep } from "../scrapers/utils";

const WIKI_BASE    = "https://www.ssbwiki.com";
const JP_WIKI_BASE = "https://smashwiki.info";
const DELAY_MS     = 1_500;

// ── Slug para SSBWiki ─────────────────────────────────────────────────────────

function toWikiSlug(name: string): string {
  // SSBWiki URL encoding: spaces → underscores, preserva maiúsculas
  return name
    .replace(/&/g, "%26")
    .replace(/ /g, "_")
    .replace(/'/g, "%27");
}

// ── Fase 1: lista do smashwiki.info (JP) ─────────────────────────────────────
// Mapeia número do spirit → nome japonês a partir da lista JP

async function fetchJpListMap(): Promise<Map<number, string>> {
  const map = new Map<number, string>();

  // Tentativas de URLs da lista JP
  const listUrls = [
    `${JP_WIKI_BASE}/%E3%82%B9%E3%83%94%E3%83%AA%E3%83%83%E3%83%88%E4%B8%80%E8%A6%A7_(%E5%A4%A7%E4%B9%B1%E9%97%98%E3%82%B9%E3%83%9E%E3%83%83%E3%82%B7%E3%83%A5%E3%83%96%E3%83%A9%E3%82%B6%E3%83%BCSPECIAL)`,
    `${JP_WIKI_BASE}/スピリット一覧_(大乱闘スマッシュブラザーズSPECIAL)`,
  ];

  for (const url of listUrls) {
    try {
      log.step(`Tentando lista JP: ${url.slice(0, 60)}…`);
      const $ = await fetchHtml(url, 2);

      // Procura tabelas com colunas de número e nome
      $("table.wikitable tr, table tr").each((_i, row) => {
        const cells = $(row).find("td, th");
        if (cells.length < 2) return;

        const first  = cleanText($(cells.eq(0)).text());
        const second = cleanText($(cells.eq(1)).text());

        // Número do spirit na primeira ou segunda célula
        const numMatch = first.match(/^(\d+)$/) ?? second.match(/^(\d+)$/);
        if (!numMatch) return;

        const num = parseInt(numMatch[1]!);
        if (num < 1 || num > 1582) return;

        // Nome JP: procura texto com caracteres japoneses
        for (let ci = 1; ci < Math.min(cells.length, 5); ci++) {
          const text = cleanText($(cells.eq(ci)).text());
          if (/[　-鿿＀-￯]/.test(text) && text.length > 0 && text.length < 60) {
            if (!map.has(num)) { map.set(num, text); }
            break;
          }
        }
      });

      if (map.size > 10) {
        log.ok(`Lista JP: ${map.size} nomes encontrados`);
        break;
      }
    } catch (e: any) {
      log.warn(`Falha na lista JP: ${String(e.message).slice(0, 60)}`);
    }
    await sleep(2_000);
  }

  return map;
}

// ── Fase 2: página individual SSBWiki ─────────────────────────────────────────
// Extrai nome JP do infobox de uma página de spirit

function extractJpFromPage($: ReturnType<typeof import("cheerio").load>): string | null {
  // Opção A: infobox com row "Japanese"
  let jp: string | null = null;
  $(".infobox tr, table.infobox tr").each((_i, row) => {
    if (jp) return;
    const cells = $(row).find("td, th");
    if (cells.length < 2) return;
    const label = cleanText($(cells.first()).text()).toLowerCase();
    if (label.includes("japanese") || label.includes("japan")) {
      const val = cleanText($(cells.eq(1)).text());
      if (val && /[　-鿿＀-￯]/.test(val)) jp = val;
    }
  });

  // Opção B: busca qualquer texto em japonês dentro de spans/tdts na infobox
  if (!jp) {
    $(".infobox span, .infobox td").each((_i, el) => {
      if (jp) return;
      const text = cleanText($(el).text());
      if (/[　-鿿＀-￯]/.test(text) && text.length > 0 && text.length < 60) {
        jp = text;
      }
    });
  }

  // Opção C: procura no título da página ou em lang="ja" elements
  if (!jp) {
    $("[lang='ja'], .lang-ja").first().each((_i, el) => {
      const text = cleanText($(el).text());
      if (text.length > 0 && text.length < 80) jp = text;
    });
  }

  return jp;
}

async function fetchJpFromWikiPage(name: string): Promise<string | null> {
  const slugs = [
    `${WIKI_BASE}/${toWikiSlug(name)}_(spirit)`,
    `${WIKI_BASE}/${toWikiSlug(name)}`,
  ];

  for (const url of slugs) {
    try {
      const $ = await fetchHtml(url, 1);
      // Verifica se não foi redirecionado para uma página de desambiguação
      const title = cleanText($("h1#firstHeading, h1.page-header__title").text());
      if (title.toLowerCase().includes("disambiguation")) continue;

      const jp = extractJpFromPage($);
      if (jp) return jp;
    } catch (e: any) {
      if (!String(e.message).includes("404") && !String(e.message).includes("HTTP 4")) {
        // erro real, não 404
        log.warn(`  ${name}: ${String(e.message).slice(0, 50)}`);
      }
    }
    await sleep(500);
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log.step("Carregando spirits sem nameJp…");
  const spirits = await db.collectible.findMany({
    where: { type: "SPIRIT", nameJp: null },
    select: { id: true, name: true, posicaoSpiritSsbu: true },
    orderBy: { posicaoSpiritSsbu: "asc" },
  });
  log.ok(`${spirits.length} spirits sem nome japonês`);

  if (spirits.length === 0) { log.ok("Todos já têm nameJp!"); return; }

  // ── Fase 1: lista JP ──────────────────────────────────────────────────────
  log.step("Buscando lista do wiki JP…");
  const jpListMap = await fetchJpListMap();
  log.ok(`Lista JP retornou ${jpListMap.size} mapeamentos`);

  let updated = 0, fromList = 0, fromPage = 0, notFound = 0;

  // Aplica mapeamentos da lista JP primeiro (batch rápido)
  const remaining: typeof spirits = [];
  for (const spirit of spirits) {
    const num = spirit.posicaoSpiritSsbu;
    if (num !== null && jpListMap.has(num)) {
      const jp = jpListMap.get(num)!;
      await db.collectible.update({ where: { id: spirit.id }, data: { nameJp: jp } });
      updated++; fromList++;
      process.stdout.write(`  ✓ #${num} ${spirit.name} → ${jp}\n`);
    } else {
      remaining.push(spirit);
    }
  }
  log.ok(`Fase 1 concluída: ${fromList} atualizados via lista JP`);

  // ── Fase 2: páginas individuais SSBWiki ───────────────────────────────────
  if (remaining.length > 0) {
    log.step(`Fase 2: buscando ${remaining.length} spirits em páginas individuais…`);
    let i = 0;
    for (const spirit of remaining) {
      i++;
      const jp = await fetchJpFromWikiPage(spirit.name);
      if (jp) {
        await db.collectible.update({ where: { id: spirit.id }, data: { nameJp: jp } });
        updated++; fromPage++;
        process.stdout.write(`  ✓ #${spirit.posicaoSpiritSsbu} ${spirit.name} → ${jp}\n`);
      } else {
        notFound++;
      }

      if (i % 50 === 0)
        log.ok(`  ${i}/${remaining.length} — via lista: ${fromList}, via página: ${fromPage}, não encontrado: ${notFound}`);
      await sleep(DELAY_MS);
    }
  }

  log.ok(`\nConcluído!`);
  log.ok(`  Via lista JP:      ${fromList}`);
  log.ok(`  Via página wiki:   ${fromPage}`);
  log.ok(`  Não encontrado:    ${notFound}`);
  log.ok(`  Total atualizado:  ${updated}`);
}

main().catch(console.error);
