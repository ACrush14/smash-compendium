/**
 * fill-jp-wiki-urls.ts
 *
 * Para cada entrada JP EXCLUSIVE sem wikiUrl, tenta encontrar o artigo
 * correspondente na Wikipedia japonesa (ja.wikipedia.org) e salva a URL
 * se o artigo existir (HTTP 200 / 302).
 *
 * Lógica de título:
 *  1. Remove anotações de furigana entre parênteses: 歴史(れきし) → 歴史
 *  2. Troca espaços por underscores para o path da Wikipedia
 *  3. Tenta URL com o título completo; se falhar, tenta título só até "・" ou " " (parte principal)
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/fill-jp-wiki-urls.ts
 *   npx tsx --env-file=.env.local scripts/admin/fill-jp-wiki-urls.ts --dry-run
 */

import { db } from "@/lib/db";

const DRY_RUN = process.argv.includes("--dry-run");
const DELAY_MS = 400; // entre requests — respeitar rate limit da Wikipedia
const TIMEOUT_MS = 8_000;

// ─── Limpeza de título ────────────────────────────────────────────────────────

function cleanForWiki(raw: string): string {
  return (
    raw
      // Remove furigana em parênteses ASCII: 歴史(れきし) → 歴史
      .replace(/\([ぁ-んァ-ン][ぁ-んァ-ン・ー]*\)/g, "")
      // Remove furigana em parênteses full-width: 歴史（れきし）→ 歴史
      .replace(/（[ぁ-んァ-ン][ぁ-んァ-ン・ー]*）/g, "")
      // Remove conteúdo de parênteses que ficou vazio
      .replace(/（）/g, "")
      .replace(/\(\)/g, "")
      // Normaliza espaços
      .replace(/　/g, " ")
      .trim()
      // Troca espaços por underscores para URL
      .replace(/ /g, "_")
  );
}

function buildWikiUrl(title: string): string {
  const slug = cleanForWiki(title);
  return `https://ja.wikipedia.org/wiki/${slug}`;
}

// Variante: só a parte antes de "前編" / "後編" / "・"
function buildShortWikiUrl(title: string): string | null {
  const stripped = title
    .replace(/\s*(前編|後編|上巻|下巻|前編・後編|パート[12２１]|PART[12])\s*.*$/u, "")
    .trim();
  if (stripped === title.trim()) return null; // sem sufixo para remover
  const slug = cleanForWiki(stripped);
  return `https://ja.wikipedia.org/wiki/${slug}`;
}

// ─── HTTP check ───────────────────────────────────────────────────────────────

async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "SmashCompendium/1.0 (educational project)" },
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  fill-jp-wiki-urls — JP EXCLUSIVE sem wikiUrl        ║");
  console.log(`╚══════════════════════════════════════════════════════╝`);
  if (DRY_RUN) console.log("  [DRY RUN — nada será salvo]\n");

  const entries = await db.chronicleEntry.findMany({
    where: {
      titleNtsc: "JP EXCLUSIVE",
      wikiUrl: null,
      titleJp: { not: null },
    },
    select: { id: true, consoleName: true, titleJp: true, titleJpEn: true },
    orderBy: [{ consoleName: "asc" }, { titleJp: "asc" }],
  });

  // Ignora entradas com titleJp placeholder "Title"
  const valid = entries.filter(e => e.titleJp && e.titleJp !== "Title");
  console.log(`  ${valid.length} entradas para processar (de ${entries.length} totais)\n`);

  let found = 0, notFound = 0, saved = 0;

  for (let i = 0; i < valid.length; i++) {
    const e = valid[i];
    const title = e.titleJp!;

    const url1 = buildWikiUrl(title);
    const url2 = buildShortWikiUrl(title); // fallback sem sufixo de parte

    let resolvedUrl: string | null = null;

    if (await urlExists(url1)) {
      resolvedUrl = url1;
    } else if (url2 && await urlExists(url2)) {
      resolvedUrl = url2;
      await sleep(DELAY_MS);
    }

    const prefix = `[${String(i + 1).padStart(3)}/${valid.length}]`;
    const label  = `${e.consoleName.padEnd(20)} ${title.slice(0, 28)}`;

    if (resolvedUrl) {
      found++;
      console.log(`${prefix} ✅  ${label}`);
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
      if (notFound <= 30 || i % 20 === 0) {
        // Não printa todos os "não encontrado" para não poluir o log
        console.log(`${prefix} ❌  ${label}`);
      }
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
