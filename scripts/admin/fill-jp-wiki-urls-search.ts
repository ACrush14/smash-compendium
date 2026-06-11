/**
 * fill-jp-wiki-urls-search.ts  — 2ª passagem
 *
 * Para entradas JP EXCLUSIVE que ainda não têm wikiUrl após a 1ª passagem,
 * usa a API de busca da Wikipedia japonesa (opensearch) para encontrar
 * o artigo mais relevante.
 *
 * Estratégia:
 *  1. Limpa o título (remove furigana, tipo de tela, parte 前編/後編)
 *  2. Faz opensearch na ja.wikipedia.org
 *  3. Verifica se o top-resultado é suficientemente parecido com o título
 *  4. Salva somente se a similaridade for alta
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/fill-jp-wiki-urls-search.ts
 *   npx tsx --env-file=.env.local scripts/admin/fill-jp-wiki-urls-search.ts --dry-run
 */

import { db } from "@/lib/db";

const DRY_RUN    = process.argv.includes("--dry-run");
const DELAY_MS   = 500;
const TIMEOUT_MS = 8_000;

// ─── Limpeza ──────────────────────────────────────────────────────────────────

function stripParens(s: string): string {
  // Remove todo conteúdo entre parênteses (ASCII e full-width)
  return s
    .replace(/\([^)]*\)/g,  "")
    .replace(/（[^）]*）/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripFurigana(s: string): string {
  // Remove furigana: 歴史(れきし) → 歴史
  return s
    .replace(/\([ぁ-んァ-ン・ーa-zA-Z0-9\s]+\)/g, "")
    .replace(/（[ぁ-んァ-ン・ーa-zA-Z0-9\s]+）/g, "")
    .trim();
}

function buildQuery(title: string): string {
  // 1. Remove furigana
  let q = stripFurigana(title);
  // 2. Remove tipo de tela/série (conteúdo entre parênteses full-width)
  q = stripParens(q);
  // 3. Remove sufixos de parte: 前編, 後編, Part 1, etc.
  q = q.replace(/\s*(前編|後編|上巻|下巻|パート[１２12]|PART\s?[12]|第[一二三四五]部)\s*/g, " ").trim();
  return q;
}

// ─── Wikipedia Search API ─────────────────────────────────────────────────────

interface OpenSearchResult {
  titles: string[];
  urls:   string[];
}

async function wikiSearch(query: string): Promise<OpenSearchResult> {
  const url = new URL("https://ja.wikipedia.org/w/api.php");
  url.searchParams.set("action",    "opensearch");
  url.searchParams.set("search",    query);
  url.searchParams.set("limit",     "3");
  url.searchParams.set("namespace", "0");
  url.searchParams.set("format",    "json");

  try {
    const res = await fetch(url.toString(), {
      signal:  AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "SmashCompendium/1.0 (educational project)" },
    });
    const data = await res.json() as [string, string[], string[], string[]];
    return { titles: data[1] ?? [], urls: data[3] ?? [] };
  } catch {
    return { titles: [], urls: [] };
  }
}

// ─── Similaridade básica ──────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s_・\-～〜]/g, "").replace(/[Ａ-Ｚａ-ｚ０-９]/g, c =>
    String.fromCharCode(c.charCodeAt(0) - 0xFEE0)
  );
}

function isSimilar(query: string, candidate: string): boolean {
  const q = normalize(query);
  const c = normalize(candidate);

  // Correspondência exata
  if (q === c) return true;
  // Um contém o outro (ignora sufixos/prefixos menores)
  if (c.includes(q) || q.includes(c)) return true;
  // Query curta (≤ 5 chars): exige correspondência exata
  if (q.length <= 5) return q === c;
  // Query longa: aceita se 70%+ dos chars da query estão no candidato
  // (heurística simples via sobreposição de bigramas)
  const bigrams = (s: string) => new Set(Array.from({ length: s.length - 1 }, (_, i) => s.slice(i, i + 2)));
  const bq = bigrams(q);
  const bc = bigrams(c);
  const inter = [...bq].filter(b => bc.has(b)).length;
  const score = (2 * inter) / (bq.size + bc.size);
  return score >= 0.55;
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  fill-jp-wiki-urls-search — 2ª passagem (API busca)  ║");
  console.log(`╚══════════════════════════════════════════════════════╝`);
  if (DRY_RUN) console.log("  [DRY RUN — nada será salvo]\n");

  const entries = await db.chronicleEntry.findMany({
    where: {
      titleNtsc: "JP EXCLUSIVE",
      wikiUrl:   null,
      titleJp:   { not: null },
    },
    select: { id: true, consoleName: true, titleJp: true, titleJpEn: true },
    orderBy: [{ consoleName: "asc" }, { titleJp: "asc" }],
  });

  const valid = entries.filter(e => e.titleJp && e.titleJp !== "Title");
  console.log(`  ${valid.length} entradas ainda sem wikiUrl\n`);

  if (valid.length === 0) {
    console.log("  Nenhuma entrada para processar — tudo já tem wikiUrl!");
    return;
  }

  let found = 0, notFound = 0, saved = 0;

  for (let i = 0; i < valid.length; i++) {
    const e      = valid[i];
    const title  = e.titleJp!;
    const query  = buildQuery(title);
    const prefix = `[${String(i + 1).padStart(3)}/${valid.length}]`;
    const label  = `${e.consoleName.padEnd(20)} ${title.slice(0, 28)}`;

    if (!query) {
      notFound++;
      continue;
    }

    const { titles, urls } = await wikiSearch(query);

    let resolvedUrl: string | null = null;
    for (let j = 0; j < titles.length; j++) {
      if (isSimilar(query, titles[j])) {
        resolvedUrl = urls[j] ?? null;
        break;
      }
    }

    if (resolvedUrl) {
      found++;
      console.log(`${prefix} ✅  ${label}`);
      console.log(`          query: "${query}" → "${titles[0]}"`);
      console.log(`          → ${resolvedUrl}`);
      if (!DRY_RUN) {
        await db.chronicleEntry.update({
          where: { id: e.id },
          data:  { wikiUrl: resolvedUrl },
        });
        saved++;
      }
    } else {
      notFound++;
      const topHit = titles[0] ? `"${titles[0]}"` : "sem resultado";
      console.log(`${prefix} ❌  ${label}  [busca: "${query}" → ${topHit}]`);
    }

    await sleep(DELAY_MS);
  }

  console.log("\n══════════════════════════════════════");
  console.log(`  ✅ Encontrados : ${found}`);
  console.log(`  ❌ Não achados : ${notFound}`);
  console.log(`  💾 Salvos      : ${saved}`);
  console.log("══════════════════════════════════════");
}

main()
  .catch(e => { console.error("Erro:", e); process.exit(1); })
  .finally(() => db.$disconnect());
