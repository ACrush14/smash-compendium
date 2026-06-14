/**
 * enrich-fighter-moves.ts — Descrições de movimentos/Final Smash (fichas SMASH) por era.
 * JP: smashwiki.info — entradas (SMASH)/(EX)/ファイナル.  EN: ssbwiki.com — descrições extras por era.
 * Grava em FighterMove (descEn + descJp). NÃO grava PT/JP→EN (tradução à parte). NÃO toca curationStatus.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-fighter-moves.ts --fighter Mario --dry-run
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-fighter-moves.ts --fighter Mario
 */
import { db } from "../../lib/db";
import { fetchHtml, jpWikiUrl, cleanText } from "./utils";
import * as cheerio from "cheerio";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FIGHTER = args.includes("--fighter") ? args[args.indexOf("--fighter") + 1] : null;

const JP_SLUG: Record<string, string> = {
  "Mario": "マリオ", "Luigi": "ルイージ", "Peach": "ピーチ", "Bowser": "クッパ",
  "Donkey Kong": "ドンキーコング", "Yoshi": "ヨッシー", "Link": "リンク", "Samus": "サムス",
  "Kirby": "カービィ", "Fox": "フォックス", "Pikachu": "ピカチュウ", "Ness": "ネス",
  "Captain Falcon": "キャプテン・ファルコン", "Jigglypuff": "プリン",
};
const JP_BADGE: Record<string, string> = { "64": "SSB64", "DX": "SSBM", "X": "SSBB", "3U": "SSB4", "3": "SSB4", "U": "SSB4", "WiiU": "SSB4", "SP": "SSBU" };
const JP_BADGES_ORDERED = ["WiiU", "3U", "64", "DX", "SP", "X", "3", "U"];

function stripWorks(s: string): string {
  const lines = s.split("\n").map(l => l.trim()).filter(Boolean);
  const out: string[] = [];
  for (const line of lines) {
    if (/^[（(]/.test(line)) break;
    if (/[（(]\s*(FC|SFC|SF|N64|AC|GB|GBA|GCN|Wii|3DS|NES|SNES|MD|Arcade|\d)/i.test(line)) break;
    out.push(line);
  }
  return (out.join(" ").trim() || lines[0] || s).trim();
}

function moveLabel(charName: string): string {
  if (/ファイナル|Final/i.test(charName)) return "Final Smash";
  if (/\(EX\)/.test(charName)) return "EX";
  if (/\(SMASH\)/.test(charName)) return "SMASH";
  return "SMASH";
}

type Move = { label: string; jp?: string; en?: string };

function scrapeJpMoves($: cheerio.CheerioAPI): Record<string, Move[]> {
  const out: Record<string, Move[]> = {};
  $(".mw-parser-output dl").each((_, dl) => {
    const dtRaw = $(dl).find("dt").first().text().replace(/\s+/g, " ").trim();
    const dd = cleanText($(dl).find("dd").first().text());
    if (!dtRaw.startsWith("[") || dd.length < 20) return;
    const inner = dtRaw.slice(1);
    const badge = JP_BADGES_ORDERED.find(b => inner.startsWith(b));
    if (!badge) return;
    const era = JP_BADGE[badge];
    const closeIdx = dtRaw.indexOf("]");
    if (closeIdx < 0) return;
    const charName = dtRaw.slice(closeIdx + 1).trim();
    if (!/\(SMASH\)|\(EX\)|ファイナル/.test(charName)) return;
    (out[era] ??= []).push({ label: moveLabel(charName), jp: stripWorks(dd) });
  });
  return out;
}

async function main() {
  if (!FIGHTER) { console.log("Use --fighter <Name>"); return; }
  if (DRY_RUN) console.log("⚠  DRY RUN\n");
  const fighter = await db.fighter.findFirst({ where: { name: { equals: FIGHTER, mode: "insensitive" } } });
  if (!fighter) { console.log("Fighter não encontrado"); return; }
  const slug = JP_SLUG[fighter.name];
  if (!slug) { console.log(`Sem JP slug para ${fighter.name}`); return; }

  // Fonte autoritativa = wiki JP (limpa: só (SMASH)/(EX)/ファイナル).
  // EN/PT/JP→EN são preenchidos à parte por tradução curada.
  const $jp = await fetchHtml(jpWikiUrl(slug));
  const jpMoves = scrapeJpMoves($jp);

  const ERAS = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];
  const records: { era: string; order: number; label: string; jp: string }[] = [];
  for (const era of ERAS) {
    (jpMoves[era] ?? []).forEach((m, i) => records.push({ era, order: i, label: m.label, jp: m.jp! }));
  }

  console.log("══════════ MOVIMENTOS POR ERA (JP) ══════════");
  for (const r of records) {
    console.log(`\n[${r.era}] #${r.order} (${r.label})`);
    console.log(`  JP: ${r.jp}`);
  }

  if (DRY_RUN) return;

  await db.fighterMove.deleteMany({ where: { fighterId: fighter.id } });
  for (const r of records) {
    await db.fighterMove.create({
      data: { fighterId: fighter.id, smashGameVersion: r.era, order: r.order, label: r.label, descJp: r.jp },
    });
  }
  console.log(`\n✅ FighterMove gravados: ${records.length}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
