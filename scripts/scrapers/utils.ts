import * as cheerio from "cheerio";

// ─── Rate limiter ─────────────────────────────────────────────────────────────

const BASE_DELAY_MS = 3_000;
const JITTER_MS     = 1_000;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function politeDelay(): Promise<void> {
  await sleep(BASE_DELAY_MS + Math.random() * JITTER_MS);
}

// ─── HTTP fetch com retry ─────────────────────────────────────────────────────

const USER_AGENT =
  "SmashCompendiumBot/1.0 (academic research; github.com/smash-compendium)";

export async function fetchHtml(
  url: string,
  retries = 3,
): Promise<cheerio.CheerioAPI> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }

      const html = await res.text();
      return cheerio.load(html);
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  [retry ${attempt}/${retries}] ${url} — ${String(err)}`);
      await sleep(attempt * 2_000);
    }
  }
  // TypeScript unreachable, but satisfies the return type
  throw new Error("fetchHtml: exceeded retries");
}

// ─── Text sanitisation ────────────────────────────────────────────────────────

/** Remove citation brackets like [1], [2], [a], etc. */
export function stripCitations(text: string): string {
  return text.replace(/\[\d+\]|\[[a-z]\]/gi, "").trim();
}

/** Collapse excess whitespace and normalise line breaks. */
export function normaliseWhitespace(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function cleanText(raw: string): string {
  return normaliseWhitespace(stripCitations(raw));
}

// ─── SSBWiki URL helpers ──────────────────────────────────────────────────────

export const WIKI_BASE    = "https://www.ssbwiki.com";
export const JP_WIKI_BASE = "https://smashwiki.info";

export function wikiUrl(path: string): string {
  return path.startsWith("http") ? path : `${WIKI_BASE}${path}`;
}

/** URL da wiki JP canônica: https://smashwiki.info/<jpName> */
export function jpWikiUrl(jpName: string): string {
  return `${JP_WIKI_BASE}/${encodeURIComponent(jpName)}`;
}

// ─── Mapeamento de siglas JP → versão do jogo ─────────────────────────────────

export const JP_SIGLA_MAP: Record<string, string> = {
  "[64]": "SSB64",
  "[DX]": "SSBM",
  "[X]":  "SSBB",
  "[3]":  "SSB4",
  "[U]":  "SSB4",
  "[3U]": "SSB4",
  "[SP]": "SSBU",
};

export interface JpEntry {
  era:         string;
  jpName:      string;   // nome sem sigla, ex: "ネス(SMASH)"
  description: string;
}

/**
 * Parseia a seção "ゲーム中の解説" de uma página smashwiki.info.
 * Retorna lista de entradas, cada uma com era + nome JP + descrição.
 */
export function parseJpDescriptionSection($: ReturnType<typeof import("cheerio").load>): JpEntry[] {
  const entries: JpEntry[] = [];

  // Localiza o header da seção "ゲーム中の解説"
  const sectionHeader = $("span#ゲーム中の解説, h2:contains('ゲーム中の解説'), h3:contains('ゲーム中の解説')").first();
  if (!sectionHeader.length) return entries;

  const parent = sectionHeader.closest("h2, h3");
  const container = (parent.length ? parent : sectionHeader).nextUntil("h2, h3");

  container.filter("dl").each((_i, dl) => {
    const dts = $("dt", dl);
    const dds = $("dd", dl);

    dts.each((j, dt) => {
      const dtText  = cleanText($(dt).text());
      const ddEl    = dds.eq(j);
      const ddText  = ddEl.length ? cleanText(ddEl.text()) : "";
      if (!dtText || !ddText) return;

      // Extrai sigla: "[DX]", "[3U]", etc.
      const siglaMatch = dtText.match(/^\[([^\]]+)\]\s*/);
      if (!siglaMatch) return;

      const siglaRaw = `[${siglaMatch[1]}]`;
      const era      = JP_SIGLA_MAP[siglaRaw];
      if (!era) return;

      const jpName = dtText.slice(siglaMatch[0].length).trim();
      entries.push({ era, jpName, description: ddText });
    });
  });

  return entries;
}

/**
 * Algoritmo de Title Matching EN→JP.
 * Dado o nome EN de um colecionável e o nome JP do fighter,
 * tenta encontrar a entrada JP correspondente.
 *
 * Regras (em ordem):
 *  1. Base ("Ness")       → jpName exato do fighter ("ネス")
 *  2. Sufixo SMASH        → "<jpName>(SMASH)"
 *  3. Sufixo (Alt.)       → "<jpName>(EX)"
 *  4. Desconhecido / FS   → tenta match posicional por era
 */
export function matchJpEntry(
  enName:       string,
  fighterJpName: string,
  fighterEnName: string,
  era:           string,
  jpEntries:     JpEntry[],
): JpEntry | null {
  const eraEntries = jpEntries.filter((e) => e.era === era);

  const isBase  = enName.trim().toLowerCase() === fighterEnName.trim().toLowerCase();
  const isSmash = /\bSMASH$/i.test(enName);
  const isAlt   = /\(Alt\.\)$/i.test(enName);

  const findByJpName = (jpName: string) =>
    eraEntries.find((e) => e.jpName === jpName) ?? null;

  if (isBase)  return findByJpName(fighterJpName);
  if (isSmash) return findByJpName(`${fighterJpName}(SMASH)`);
  if (isAlt)   return findByJpName(`${fighterJpName}(EX)`);

  // Final Smash / outro: sem regra de sufixo — retorna null
  // (infraestrutura pronta para tabela de lookup futura)
  return null;
}

// ─── Smash game version mapping ───────────────────────────────────────────────

export const GAME_VERSION_MAP: Record<string, string> = {
  "Super Smash Bros.": "SSB64",
  "Super Smash Bros. for Nintendo 64": "SSB64",
  "Super Smash Bros. Melee": "SSBM",
  "Super Smash Bros. Brawl": "SSBB",
  "Super Smash Bros. for Nintendo 3DS": "SSB4",
  "Super Smash Bros. for Wii U": "SSB4",
  "Super Smash Bros. 4": "SSB4",
  "Super Smash Bros. Ultimate": "SSBU",
};

export function resolveGameVersion(title: string): string {
  for (const [key, val] of Object.entries(GAME_VERSION_MAP)) {
    if (title.includes(key)) return val;
  }
  return title.trim();
}

// ─── Logger ───────────────────────────────────────────────────────────────────

export const log = {
  info:  (msg: string) => console.log(`\x1b[36m[INFO]\x1b[0m  ${msg}`),
  ok:    (msg: string) => console.log(`\x1b[32m[OK]\x1b[0m    ${msg}`),
  warn:  (msg: string) => console.warn(`\x1b[33m[WARN]\x1b[0m  ${msg}`),
  error: (msg: string) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  step:  (msg: string) => console.log(`\x1b[35m[STEP]\x1b[0m  ${msg}`),
};
