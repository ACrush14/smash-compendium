/**
 * enrich-all-fighter-moves.ts
 * Scrapa movimentos/Final Smash JP de TODOS os lutadores do banco.
 * Reutiliza a lógica de enrich-fighter-moves.ts mas roda em batch.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-moves.ts
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-moves.ts --skip-existing
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-moves.ts --dry-run
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText } from "./utils";
import * as cheerio from "cheerio";

const args = process.argv.slice(2);
const DRY_RUN       = args.includes("--dry-run");
const SKIP_EXISTING = args.includes("--skip-existing");

const DELAY_MS = 1600;

// Mesmo mapa de slugs do enrich-all-fighter-bios.ts
const JP_SLUG: Record<string, string> = {
  "Mario":              "マリオ",
  "Donkey Kong":        "ドンキーコング",
  "Link":               "リンク",
  "Samus":              "サムス",
  "Dark Samus":         "ダークサムス",
  "Yoshi":              "ヨッシー",
  "Kirby":              "カービィ",
  "Fox":                "フォックス",
  "Pikachu":            "ピカチュウ",
  "Luigi":              "ルイージ",
  "Ness":               "ネス",
  "Captain Falcon":     "キャプテン・ファルコン",
  "Jigglypuff":         "プリン",
  "Peach":              "ピーチ",
  "Daisy":              "デイジー",
  "Bowser":             "クッパ",
  "Ice Climbers":       "アイスクライマー",
  "Sheik":              "シーク",
  "Zelda":              "ゼルダ",
  "Dr. Mario":          "ドクターマリオ",
  "Pichu":              "ピチュー",
  "Falco":              "ファルコ",
  "Marth":              "マルス",
  "Lucina":             "ルキナ",
  "Young Link":         "コドリンク",
  "Ganondorf":          "ガノンドロフ",
  "Mewtwo":             "ミュウツー",
  "Roy":                "ロイ",
  "Chrom":              "クロム",
  "Mr. Game & Watch":   "Mr.ゲーム&ウォッチ",
  "Meta Knight":        "メタナイト",
  "Pit":                "ピット",
  "Dark Pit":           "ブラックピット",
  "Zero Suit Samus":    "ゼロスーツサムス",
  "Wario":              "ワリオ",
  "Snake":              "スネーク",
  "Ike":                "アイク",
  "Pokémon Trainer":    "ポケモントレーナー",
  "Squirtle":           "ゼニガメ",
  "Ivysaur":            "フシギソウ",
  "Charizard":          "リザードン",
  "Diddy Kong":         "ディディーコング",
  "Lucas":              "リュカ",
  "Sonic":              "ソニック",
  "King Dedede":        "デデデ",
  "Olimar":             "ピクミン&オリマー",
  "Lucario":            "ルカリオ",
  "R.O.B.":             "R.O.B.",
  "Toon Link":          "トゥーンリンク",
  "Wolf":               "ウルフ",
  "Villager":           "むらびと",
  "Mega Man":           "ロックマン",
  "Wii Fit Trainer":    "Wii_Fitトレーナー",
  "Rosalina & Luma":    "ロゼッタ&チコ",
  "Little Mac":         "リトルマック",
  "Greninja":           "ゲッコウガ",
  "Mii Brawler":        "Mii格闘タイプ",
  "Mii Swordfighter":   "Mii剣術タイプ",
  "Mii Gunner":         "Mii射撃タイプ",
  "Palutena":           "パルテナ",
  "Pac-Man":            "パックマン",
  "Robin":              "ルフレ",
  "Shulk":              "シュルク",
  "Bowser Jr.":         "クッパJr.",
  "Duck Hunt":          "ダックハント",
  "Ryu":                "リュウ",
  "Ken":                "ケン",
  "Cloud":              "クラウド",
  "Corrin":             "カムイ",
  "Bayonetta":          "ベヨネッタ",
  "Inkling":            "インクリング",
  "Ridley":             "リドリー",
  "Simon":              "シモン",
  "Richter":            "リヒター",
  "King K. Rool":       "キングクルール",
  "Isabelle":           "しずえ",
  "Incineroar":         "ガオガエン",
  "Piranha Plant":      "パックンフラワー",
  "Joker":              "ジョーカー",
  "Hero":               "勇者",
  "Banjo & Kazooie":    "バンジョー&カズーイ",
  "Terry":              "テリー",
  "Byleth":             "ベレト/ベレス",
  "Min Min":            "ミェンミェン",
  "Steve":              "スティーブ/アレックス",
  "Sephiroth":          "セフィロス",
  "Pyra":               "ホムラ/ヒカリ",
  "Mythra":             "ホムラ/ヒカリ",
  "Kazuya":             "カズヤ",
  "Sora":               "ソラ",
};

const JP_BADGE: Record<string, string> = {
  "64": "SSB64", "DX": "SSBM", "X": "SSBB",
  "3U": "SSB4", "3": "SSB4", "U": "SSB4", "WiiU": "SSB4", "SP": "SSBU",
};
const JP_BADGES_ORDERED = ["WiiU", "3U", "64", "DX", "SP", "X", "3", "U"];

function moveLabel(charName: string): string {
  if (/ファイナル/.test(charName)) return "Final Smash";
  if (/\(EX\)/.test(charName))    return "EX";
  if (/\(SMASH\)/.test(charName)) return "SMASH";
  return "SMASH";
}

interface MoveEntry { era: string; order: number; label: string; descJp: string; }

function scrapeMoves($: cheerio.CheerioAPI): MoveEntry[] {
  const results: MoveEntry[] = [];
  const orderByEra: Record<string, number> = {};

  $(".mw-parser-output dl").each((_, dl) => {
    const dtRaw = $(dl).find("dt").first().text().replace(/\s+/g, " ").trim();
    const dd = $(dl).find("dd").first().text().replace(/\s+/g, " ").trim();
    if (!dtRaw.startsWith("[") || dd.length < 20) return;

    const inner = dtRaw.slice(1);
    const badge = JP_BADGES_ORDERED.find(b => inner.startsWith(b));
    if (!badge) return;
    const era = JP_BADGE[badge];
    const closeIdx = dtRaw.indexOf("]");
    if (closeIdx < 0) return;
    const charName = dtRaw.slice(closeIdx + 1).trim();

    // Só move entries: (SMASH), (EX), ファイナル
    if (!/(SMASH|EX|ファイナル)/.test(charName)) return;

    const order = orderByEra[era] ?? 0;
    orderByEra[era] = order + 1;

    results.push({
      era,
      order,
      label: moveLabel(charName),
      descJp: dd.trim(),
    });
  });

  return results;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function enrichMoves(fighter: { id: string; name: string }) {
  const jpSlug = JP_SLUG[fighter.name];
  if (!jpSlug) return { skipped: true, count: 0 };

  const jpUrl = `https://smashwiki.info/${encodeURIComponent(jpSlug)}`;
  let moves: MoveEntry[] = [];

  try {
    const $ = await fetchHtml(jpUrl);
    moves = scrapeMoves($);
    await sleep(DELAY_MS);
  } catch (e) {
    console.error(`  ⚠ JP scrape failed for ${fighter.name}: ${e}`);
    return { skipped: false, count: 0 };
  }

  if (moves.length === 0) return { skipped: false, count: 0 };
  if (DRY_RUN) {
    moves.forEach(m => console.log(`  [dry] ${m.era} #${m.order} [${m.label}]: ${m.descJp.slice(0, 60)}…`));
    return { skipped: false, count: moves.length };
  }

  // Apaga movimentos existentes para recriar limpo
  await db.fighterMove.deleteMany({ where: { fighterId: fighter.id } });

  await db.fighterMove.createMany({
    data: moves.map(m => ({
      fighterId:        fighter.id,
      smashGameVersion: m.era,
      order:            m.order,
      label:            m.label,
      descJp:           m.descJp,
    })),
  });

  return { skipped: false, count: moves.length };
}

async function main() {
  const fighters = await db.fighter.findMany({
    orderBy: { rosterNumber: "asc" },
    include: { moves: { select: { id: true } } },
  });

  const toProcess = SKIP_EXISTING
    ? fighters.filter(f => f.moves.length === 0)
    : fighters;

  console.log(`Lutadores a processar: ${toProcess.length}/${fighters.length}`);
  console.log(DRY_RUN ? "MODO DRY RUN\n" : "");

  let totalMoves = 0, skipped = 0, failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const f = toProcess[i]!;
    const pct = Math.round(((i + 1) / toProcess.length) * 100);
    process.stdout.write(`[${pct}%] ${String(i + 1).padStart(2)}/${toProcess.length} ${f.name.padEnd(25)}`);

    try {
      const result = await enrichMoves(f);
      if (result.skipped) { skipped++; console.log("→ sem slug JP, pulado"); }
      else { totalMoves += result.count; console.log(`→ ${result.count} movimentos`); }
    } catch (e) {
      failed++;
      console.log(`→ ERRO: ${e}`);
    }
  }

  await db.$disconnect();
  console.log("\n=== RESULTADO ===");
  console.log(`✅ Movimentos inseridos: ${totalMoves}`);
  console.log(`⏭ Sem slug JP:          ${skipped}`);
  console.log(`❌ Falhas:               ${failed}`);
}

main().catch(e => { console.error(e); process.exit(1); });
