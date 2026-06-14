/**
 * enrich-fighter-bios.ts — Cria/atualiza FighterBio (EN + JP) por era, de ambas as wikis.
 *
 * Fonte EN: ssbwiki.com/<Name>      — descrições "in-game character description" por era
 * Fonte JP: smashwiki.info/<jpName> — seção ゲーム中の解説 (キャラクター紹介 / フィギュア名鑑 base)
 *
 * NÃO escreve contentPt / contentJpEn (tradução é feita à parte, com qualidade).
 * NÃO altera curationStatus (curadoria é manual — regra absoluta).
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-fighter-bios.ts --fighter Mario --dry-run
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-fighter-bios.ts --fighter Mario
 */

import { db } from "../../lib/db";
import { fetchHtml, jpWikiUrl, cleanText } from "./utils";
import * as cheerio from "cheerio";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FIGHTER = args.includes("--fighter") ? args[args.indexOf("--fighter") + 1] : null;

// EN name → smashwiki.info slug (JP). Subconjunto; expandir conforme necessário.
const JP_SLUG: Record<string, string> = {
  "Mario": "マリオ", "Luigi": "ルイージ", "Peach": "ピーチ", "Bowser": "クッパ",
  "Donkey Kong": "ドンキーコング", "Yoshi": "ヨッシー", "Link": "リンク", "Samus": "サムス",
  "Kirby": "カービィ", "Fox": "フォックス", "Pikachu": "ピカチュウ", "Ness": "ネス",
  "Captain Falcon": "キャプテン・ファルコン", "Jigglypuff": "プリン",
};

// JP badge → smashGameVersion
const JP_BADGE: Record<string, string> = {
  "64": "SSB64", "DX": "SSBM", "X": "SSBB", "3U": "SSB4", "3": "SSB4", "U": "SSB4", "WiiU": "SSB4", "SP": "SSBU",
};
const JP_BADGES_ORDERED = ["WiiU", "3U", "64", "DX", "SP", "X", "3", "U"]; // mais longos primeiro

// EN h2 heading → smashGameVersion
function enHeadingToEra(h: string): string | null {
  if (/Ultimate/i.test(h)) return "SSBU";
  if (/Brawl/i.test(h)) return "SSBB";
  if (/Melee/i.test(h)) return "SSBM";
  if (/Super Smash Bros\. 4|for (Nintendo 3DS|Wii U)/i.test(h)) return "SSB4";
  if (/In Super Smash Bros\.?$/i.test(h.trim())) return "SSB64";
  return null;
}

// Remove linhas de "works"/jogos de origem que vazam para dentro da descrição.
// A prosa da bio é a(s) primeira(s) linha(s); citações de jogo seguem depois.
function stripWorks(s: string): string {
  const lines = s.split("\n").map(l => l.trim()).filter(Boolean);
  const out: string[] = [];
  for (const line of lines) {
    if (/^[（(]/.test(line)) break;                                                        // "(FC) ..." / "（AC）..."
    if (/[（(]\s*(FC|SFC|SF|N64|AC|GB|GBA|GCN|Wii|3DS|NES|SNES|MD|Arcade|\d)/i.test(line)) break; // "... (1981)" / "...(FC)"
    out.push(line);
  }
  return (out.join(" ").trim() || lines[0] || s).trim();
}

interface JpBioSet { base: Record<string, string>; moves: Record<string, string[]>; }

function scrapeJp($: cheerio.CheerioAPI, fighterJp: string): JpBioSet {
  const base: Record<string, string> = {};
  const moves: Record<string, string[]> = {};

  $(".mw-parser-output dl").each((_, dl) => {
    const dtRaw = $(dl).find("dt").first().text().replace(/\s+/g, " ").trim();
    const dd = cleanText($(dl).find("dd").first().text());
    if (!dtRaw.startsWith("[") || dd.length < 20) return;

    const inner = dtRaw.slice(1); // remove "["
    const badge = JP_BADGES_ORDERED.find(b => inner.startsWith(b));
    if (!badge) return;
    const era = JP_BADGE[badge];

    const closeIdx = dtRaw.indexOf("]");
    if (closeIdx < 0) return;
    const charName = dtRaw.slice(closeIdx + 1).trim(); // ex: "マリオ", "マリオ(SMASH)", "" (キャラクター紹介)
    const section = inner.slice(badge.length, closeIdx - 1); // キャラクター紹介 / フィギュア名鑑

    const isBase = section.includes("キャラクター紹介") || charName === fighterJp;
    const isMove = /\(SMASH\)|\(EX\)|ファイナル/.test(charName);

    if (isBase && !base[era]) {
      base[era] = stripWorks(dd);
    } else if (isMove) {
      (moves[era] ??= []).push(stripWorks(dd));
    }
  });

  return { base, moves };
}

function scrapeEn($: cheerio.CheerioAPI): Record<string, string> {
  const out: Record<string, string> = {};
  let era: string | null = null;

  $(".mw-parser-output").children().each((_, el) => {
    const tag = (el as any).name;
    if (tag === "h2") {
      const h = $(el).find(".mw-headline").text().trim();
      era = enHeadingToEra(h);
      return;
    }
    if (!era) return;
    // captura a descrição in-game: dd substancial que não seja "Works:"/"For ..."
    if (tag === "dl") {
      $(el).find("dd").each((__, dd) => {
        const txt = stripWorks(cleanText($(dd).text()));
        if (txt.length < 60) return;
        if (/^Works:|^For /i.test(txt)) return;
        if (!out[era!]) out[era!] = txt;
      });
    }
  });

  return out;
}

async function main() {
  if (!FIGHTER) { console.log("Use --fighter <Name>"); return; }
  if (DRY_RUN) console.log("⚠  DRY RUN — nada será gravado\n");

  const fighter = await db.fighter.findFirst({
    where: { name: { equals: FIGHTER, mode: "insensitive" } },
    include: { bios: true },
  });
  if (!fighter) { console.log(`Fighter "${FIGHTER}" não encontrado`); return; }

  const jpSlug = JP_SLUG[fighter.name];
  if (!jpSlug) { console.log(`Sem JP slug para "${fighter.name}"`); return; }

  console.log(`Scraping EN (ssbwiki.com/${fighter.name})...`);
  const $en = await fetchHtml(`https://www.ssbwiki.com/${encodeURIComponent(fighter.name)}`);
  const enBios = scrapeEn($en);

  console.log(`Scraping JP (smashwiki.info/${jpSlug})...`);
  const $jp = await fetchHtml(jpWikiUrl(jpSlug));
  const jp = scrapeJp($jp, jpSlug);

  const ERAS = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];
  console.log("\n══════════ RESULTADO POR ERA ══════════");
  for (const era of ERAS) {
    const en = enBios[era];
    const jpb = jp.base[era];
    const mv = jp.moves[era] ?? [];
    console.log(`\n[${era}]  EN:${en?.length || 0}  JP:${jpb?.length || 0}  moves:${mv.length}`);
    if (en) console.log(`  EN: ${en.slice(0, 110)}...`);
    if (jpb) console.log(`  JP: ${jpb.slice(0, 80)}...`);
  }

  if (DRY_RUN) return;

  // Upsert FighterBio: cria se não existir, preenche EN/JP sem sobrescrever traduções
  let created = 0, updated = 0;
  for (const era of ERAS) {
    const en = enBios[era];
    const jpb = jp.base[era];
    if (!en && !jpb) continue;
    const existing = fighter.bios.find(b => b.smashGameVersion === era);
    if (existing) {
      await db.fighterBio.update({
        where: { id: existing.id },
        data: { ...(en ? { contentEn: en } : {}), ...(jpb ? { contentJp: jpb } : {}) },
      });
      updated++;
    } else {
      await db.fighterBio.create({
        data: {
          fighterId: fighter.id, smashGameVersion: era,
          contentEn: en ?? "", contentJp: jpb ?? null,
        },
      });
      created++;
    }
  }
  console.log(`\n✅ Bios — criadas: ${created}, atualizadas: ${updated}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
