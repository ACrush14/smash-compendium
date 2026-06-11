/**
 * fill-chronicle-boxarts.ts
 *
 * Busca capas na coleção Libretro Thumbnails para ChronicleEntries sem boxArtUrl.
 *
 * Estratégia:
 *  1. Para cada console mapeado, baixa o índice de Named_Boxarts/
 *  2. Extrai todos os nomes de arquivo .png e normaliza os títulos
 *  3. Para cada chronicle sem boxArtUrl, faz matching fuzzy do título
 *  4. Salva a URL pública se encontrar correspondência
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/admin/fill-chronicle-boxarts.ts
 *   npx tsx --env-file=.env.local scripts/admin/fill-chronicle-boxarts.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/admin/fill-chronicle-boxarts.ts --console "Nintendo 64"
 */

import { db } from "@/lib/db";

const DRY_RUN   = process.argv.includes("--dry-run");
const ONLY_CON  = (() => {
  const idx = process.argv.indexOf("--console");
  return idx !== -1 ? process.argv[idx + 1] : null;
})();
const DELAY_MS  = 300;
const TIMEOUT   = 15_000;

// ─── Mapeamento consoleName DB → pasta Libretro ───────────────────────────────

const CONSOLE_MAP: Record<string, string> = {
  "GAME BOY":                           "Nintendo - Game Boy",
  "GAME BOY ADVANCE":                   "Nintendo - Game Boy Advance",
  "Nintendo 64":                        "Nintendo - Nintendo 64",
  "Nintendo DS":                        "Nintendo - Nintendo DS",
  "Nintendo Entertainment System":      "Nintendo - Nintendo Entertainment System",
  "Nintendo GameCube":                  "Nintendo - GameCube",
  "Super Nintendo Entertainment System":"Nintendo - Super Nintendo Entertainment System",
  "VIRTUAL BOY":                        "Nintendo - Virtual Boy",
  "Wii":                                "Nintendo - Wii",
  "Wii U":                              "Nintendo - Wii U",
  "Disk System":                        "Nintendo - Family Computer Disk System",
  "PlayStation 1":                      "Sony - PlayStation",
  "PlayStation 2":                      "Sony - PlayStation 2",
  "PlayStation 3":                      "Sony - PlayStation 3",
  "PlayStation 4":                      "Sony - PlayStation 4",
  // Sem pasta no Libretro: GAME & WATCH, Nintendo Switch, Xbox 360
};

// ─── Fetcher de índice ────────────────────────────────────────────────────────

async function fetchIndex(libretroFolder: string): Promise<string[]> {
  const folderEncoded = libretroFolder.split("").map(c =>
    /[A-Za-z0-9\-_.]/.test(c) ? c : encodeURIComponent(c)
  ).join("");
  const url = `https://thumbnails.libretro.com/${folderEncoded}/Named_Boxarts/`;

  try {
    const res = await fetch(url, {
      signal:  AbortSignal.timeout(TIMEOUT),
      headers: { "User-Agent": "SmashCompendium/1.0 (educational project)" },
    });
    if (!res.ok) {
      console.error(`  HTTP ${res.status} ao buscar índice: ${url}`);
      return [];
    }
    const html = await res.text();
    // Extrai hrefs de arquivos PNG (podem estar URL-encoded)
    const matches = html.matchAll(/href="([^"?#]+\.png)"/gi);
    return [...matches]
      .map(m => {
        try { return decodeURIComponent(m[1]!); } catch { return m[1]!; }
      })
      .filter(f => !f.startsWith("http")); // apenas nomes relativos
  } catch (e) {
    console.error(`  Erro ao buscar índice ${libretroFolder}:`, (e as Error).message);
    return [];
  }
}

// ─── Extração do título base do nome de arquivo ───────────────────────────────

function extractBaseTitle(filename: string): string {
  let s = filename.replace(/\.png$/i, "");

  // Remove parênteses de data: (1990-01-06)
  s = s.replace(/\s*\(\d{4}(?:-\d{2}(?:-\d{2})?)?\)\s*/g, " ");
  // Remove parênteses de publisher antes de região: (Nintendo)
  s = s.replace(/\s*\([A-Z][a-z][^)]*\)\s*(?=\([A-Z]{2,}\))/g, " ");
  // Remove sufixos de região/revisão no final: (USA), (Japan), (En,Ja), (Rev 1), (Unl), [...]
  // Remove recursivamente até não ter mais nada
  const regionLike = /\s*(?:\([^)]+\)|\[[^\]]+\])\s*$/;
  for (let i = 0; i < 8; i++) {
    const m = regionLike.exec(s);
    if (!m) break;
    // Só remove se parece ser região/rev/lang/publisher (não título real)
    const part = m[0].trim();
    if (/^\((?:USA|Japan|Europe|[A-Z]{2,3}(?:,[A-Z]{2,3})*|Rev\s?\d|v\d|Unl|Beta|Demo|Proto|Sample|Aftermarket|En[,A-Za-z]*|Ja[,A-Za-z]*|Fr[,A-Za-z]*|De[,A-Za-z]*|\d{4}[\d-]*)\)/i.test(part)) {
      s = s.slice(0, m.index);
    } else {
      break;
    }
  }

  return s.replace(/\s+/g, " ").trim();
}

// ─── Normalização para comparação ─────────────────────────────────────────────

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")   // remove acentos
    .replace(/[:\-'"!?.,&\/\\+＆！？。、・]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Versão sem espaços: "fire red" === "firered"
function normCompact(s: string): string {
  return norm(s).replace(/\s/g, "");
}

// Bigramas para similaridade fuzzy
function bigrams(s: string): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}

function diceSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const ba = bigrams(a), bb = bigrams(b);
  let inter = 0;
  for (const bg of ba) if (bb.has(bg)) inter++;
  return (2 * inter) / (ba.size + bb.size);
}

// ─── Matching ─────────────────────────────────────────────────────────────────

type IndexEntry = { filename: string; normBase: string; compactBase: string };

function buildIndex(filenames: string[]): IndexEntry[] {
  return filenames.map(filename => {
    const normBase = norm(extractBaseTitle(filename));
    return { filename, normBase, compactBase: normBase.replace(/\s/g, "") };
  });
}

function findBestMatch(title: string, index: IndexEntry[]): string | null {
  if (!title || title === "JP EXCLUSIVE") return null;

  const query        = norm(title);
  const queryCompact = normCompact(title);
  if (!query || query.length < 3) return null;

  // 1) Correspondência exata (com e sem espaços)
  const exactMatches = index.filter(e =>
    e.normBase === query || e.compactBase === queryCompact
  );
  if (exactMatches.length > 0) {
    return pickPreferred(exactMatches.map(e => e.filename));
  }

  // 2) Prefixo: o título da query é prefixo do nome base do arquivo
  //    (ex: DB tem "Super Mario 64", arquivo tem "Super Mario 64 Shindou Pack")
  //    Exige que a query tenha >= 8 chars para evitar matches genéricos
  if (query.length >= 8) {
    const prefixMatches = index.filter(e =>
      (e.normBase.startsWith(query + " ") || e.compactBase.startsWith(queryCompact + " "))
    );
    if (prefixMatches.length > 0) {
      return pickPreferred(prefixMatches.map(e => e.filename));
    }
  }

  // 3) Prefixo reverso: o nome base do arquivo é prefixo do título da query
  //    (ex: titleJpEn "Fire Emblem: Sword of Recca" → arquivo "Fire Emblem (USA)")
  //    Exige base >= 10 chars para evitar matches genéricos curtos como "Pokemon"
  if (query.length >= 12) {
    const revPrefixMatches = index.filter(e =>
      e.normBase.length >= 10 &&
      (query.startsWith(e.normBase + " ") || queryCompact.startsWith(e.compactBase + " "))
    );
    // Pega o mais longo (mais específico) entre os candidatos
    if (revPrefixMatches.length > 0) {
      revPrefixMatches.sort((a, b) => b.normBase.length - a.normBase.length);
      return pickPreferred(revPrefixMatches.map(e => e.filename));
    }
  }

  // 3) Similaridade de bigramas >= 0.70 (para variações de pontuação/subtítulo)
  //    Só ativa se a query tem >= 10 chars (evita matches genéricos curtos)
  if (query.length >= 10) {
    type Scored = { filename: string; score: number };
    const similar: Scored[] = [];
    for (const e of index) {
      if (Math.abs(e.normBase.length - query.length) > query.length * 0.5) continue;
      const score = diceSimilarity(query, e.normBase);
      if (score >= 0.70) similar.push({ filename: e.filename, score });
    }
    if (similar.length > 0) {
      similar.sort((a, b) => b.score - a.score);
      // Só aceita se o melhor resultado for claramente melhor que o segundo
      const best = similar[0]!;
      const second = similar[1];
      if (!second || best.score - second.score >= 0.10) {
        return pickPreferred([best.filename]);
      }
      // Se empate, pega o preferido (USA > Japan > etc.)
      return pickPreferred(similar.map(s => s.filename));
    }
  }

  return null;
}

// Prefere: USA > Japan,USA > Japan > Europe > outros
function pickPreferred(filenames: string[]): string {
  const score = (f: string) => {
    if (/\(USA\)/i.test(f))              return 10;
    if (/\(Japan,\s*USA\)/i.test(f))     return 9;
    if (/\(Japan\)/i.test(f))            return 8;
    if (/\(Europe\)/i.test(f))           return 5;
    if (/\(JP\)/i.test(f))               return 7;
    if (/\(US\)/i.test(f))               return 9;
    return 1;
  };
  return filenames.sort((a, b) => score(b) - score(a))[0]!;
}

// ─── Constrói URL pública ──────────────────────────────────────────────────────

function buildUrl(libretroFolder: string, filename: string): string {
  const encFolder   = libretroFolder.split("").map(c =>
    /[A-Za-z0-9\-_.]/.test(c) ? c : encodeURIComponent(c)
  ).join("");
  const encFilename = filename.split("").map(c =>
    /[A-Za-z0-9\-_.!~*'()]/.test(c) ? c : encodeURIComponent(c)
  ).join("");
  return `https://thumbnails.libretro.com/${encFolder}/Named_Boxarts/${encFilename}`;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║  fill-chronicle-boxarts — Libretro Thumbnails        ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  if (DRY_RUN)  console.log("  [DRY RUN — nada será salvo]");
  if (ONLY_CON) console.log(`  [Filtrando: ${ONLY_CON}]`);
  console.log();

  // Busca entradas sem boxArtUrl
  const entries = await db.chronicleEntry.findMany({
    where: {
      boxArtUrl: null,
      ...(ONLY_CON ? { consoleName: ONLY_CON } : {}),
    },
    select: { id: true, consoleName: true, titleNtsc: true, titleJp: true, titleJpEn: true },
    orderBy: [{ consoleName: "asc" }, { titleNtsc: "asc" }],
  });

  console.log(`  ${entries.length} entradas sem boxArtUrl\n`);

  // Agrupa por console
  const byConsole = new Map<string, typeof entries>();
  for (const e of entries) {
    if (!byConsole.has(e.consoleName)) byConsole.set(e.consoleName, []);
    byConsole.get(e.consoleName)!.push(e);
  }

  let totalFound = 0, totalNotFound = 0, totalSaved = 0;

  for (const [consoleName, consoleEntries] of byConsole) {
    const libretroFolder = CONSOLE_MAP[consoleName];
    if (!libretroFolder) {
      console.log(`⏭  ${consoleName} — sem mapeamento Libretro, pulando ${consoleEntries.length} entradas`);
      totalNotFound += consoleEntries.length;
      continue;
    }

    console.log(`📂 ${consoleName} → ${libretroFolder}`);
    console.log(`   Baixando índice...`);

    const filenames = await fetchIndex(libretroFolder);
    if (filenames.length === 0) {
      console.log(`   ❌ Índice vazio ou erro\n`);
      totalNotFound += consoleEntries.length;
      continue;
    }

    console.log(`   ${filenames.length} arquivos no índice`);
    const index = buildIndex(filenames);

    let found = 0, notFound = 0;

    for (const e of consoleEntries) {
      // Títulos candidatos: NTSC primeiro, depois JP-EN, depois JP
      const candidates = [
        e.titleNtsc !== "JP EXCLUSIVE" ? e.titleNtsc : null,
        e.titleJpEn,
        e.titleJp,
      ].filter(Boolean) as string[];

      let matched: string | null = null;
      let usedTitle = "";

      for (const title of candidates) {
        matched = findBestMatch(title, index);
        if (matched) { usedTitle = title; break; }
      }

      if (matched) {
        found++;
        totalFound++;
        const url = buildUrl(libretroFolder, matched);
        const label = (e.titleNtsc !== "JP EXCLUSIVE" ? e.titleNtsc : e.titleJp) ?? "";
        console.log(`   ✅  ${label.slice(0, 40).padEnd(42)} → ${matched.slice(0, 50)}`);

        if (!DRY_RUN) {
          await db.chronicleEntry.update({ where: { id: e.id }, data: { boxArtUrl: url } });
          totalSaved++;
        }
      } else {
        notFound++;
        totalNotFound++;
        // Só printa "não achados" no dry-run ou se forem poucos
        if (DRY_RUN || consoleEntries.length <= 20) {
          const label = (e.titleNtsc !== "JP EXCLUSIVE" ? e.titleNtsc : e.titleJp) ?? "";
          console.log(`   ❌  ${label.slice(0, 60)}`);
        }
      }

      await sleep(DELAY_MS);
    }

    console.log(`   → ${found} encontrados, ${notFound} não achados\n`);
    await sleep(DELAY_MS);
  }

  console.log("══════════════════════════════════════");
  console.log(`  ✅ Encontrados : ${totalFound}`);
  console.log(`  ❌ Não achados : ${totalNotFound}`);
  console.log(`  💾 Salvos      : ${totalSaved}`);
  console.log("══════════════════════════════════════");
}

main()
  .catch(e => { console.error("Erro:", e); process.exit(1); })
  .finally(() => db.$disconnect());
