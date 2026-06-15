/**
 * enrich-all-fighter-bios.ts
 * Scrapa bios EN + JP de TODOS os lutadores do banco (ou de um subconjunto).
 * Reutiliza a lógica de enrich-fighter-bios.ts mas roda em batch.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-bios.ts
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-bios.ts --skip-existing
 *   npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-bios.ts --dry-run
 */

import { db } from "../../lib/db";
import { fetchHtml, cleanText } from "./utils";
import * as cheerio from "cheerio";

const args = process.argv.slice(2);
const DRY_RUN      = args.includes("--dry-run");
const SKIP_EXISTING = args.includes("--skip-existing"); // pula lutadores que já têm bios EN

const DELAY_MS = 1600; // 1.6s entre requests (respeita rate limit)

// ─── Mapa completo: nome EN → slug smashwiki.info ─────────────────────────────
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
  "R.O.B.":             "ロボット",
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

// ─── Parser JP ────────────────────────────────────────────────────────────────
const JP_BADGE: Record<string, string> = {
  "64": "SSB64", "DX": "SSBM", "X": "SSBB",
  "3U": "SSB4", "3": "SSB4", "U": "SSB4", "WiiU": "SSB4", "SP": "SSBU",
};
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

function scrapeJp($: cheerio.CheerioAPI): Record<string, string> {
  const base: Record<string, string> = {};
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
    // Pula entries de movimentos (SMASH, EX, ファイナル) — essas são para FighterMove
    if (/(SMASH|EX|ファイナル)/.test(charName)) return;
    if (!base[era]) base[era] = stripWorks(dd);
  });
  return base;
}

function enHeadingToEra(h: string): string | null {
  // h é o texto do span.mw-headline (sem "[edit]")
  if (/Ultimate/i.test(h)) return "SSBU";
  if (/Brawl/i.test(h)) return "SSBB";
  if (/Melee/i.test(h)) return "SSBM";
  if (/Super Smash Bros\. 4|for (Nintendo 3DS|Wii U)/i.test(h)) return "SSB4";
  if (/^In Super Smash Bros\.?$/i.test(h.trim())) return "SSB64";
  return null;
}

// Scrapa bios EN do SSBWiki.
// Estrutura real: dl > dt=NomeLutador, dd=texto. NÃO usa "in-game" no dt.
// Usa mw-headline para pegar o heading sem "[edit]".
function scrapeEn($: cheerio.CheerioAPI, fighterName: string): Record<string, string> {
  const bios: Record<string, string> = {};
  let currentEra: string | null = null;
  const nameLower = fighterName.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  $(".mw-parser-output").children().each((_, el) => {
    const tag = el.type === "tag" ? el.name : null;
    if (!tag) return;

    // h2: detecta era pelo span.mw-headline (sem "[edit]")
    if (tag === "h2") {
      const headlineSpan = $(el).find(".mw-headline").text().trim();
      currentEra = enHeadingToEra(headlineSpan || $(el).text().trim());
      return;
    }

    if (!currentEra || tag !== "dl") return;

    const dt = $(el).find("dt").first().text().trim();
    const dd = cleanText($(el).find("dd").first().text());
    if (!dt || dd.length < 40) return;

    const dtLower = dt.toLowerCase().replace(/[^a-z0-9\s]/g, "");

    // Filtra DLs que NÃO são a bio base: Works, SMASH, EX, Alt, For...
    if (dtLower.startsWith("works")) return;
    if (dtLower.startsWith("for ")) return;
    if (/smash|final smash|\(ex\)|\(alt\.\)/i.test(dt)) return;
    if (/\+\s/.test(dt)) return; // "Mario + Yoshi", "DK + Barrel Train"

    // O dt deve conter o nome do lutador (ex: "Donkey Kong", "Mario", "Dr. Mario")
    if (!dtLower.includes(nameLower) && !nameLower.includes(dtLower)) return;

    if (!bios[currentEra]) {
      bios[currentEra] = dd;
    }
  });

  return bios;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function enrichFighter(fighter: { id: string; name: string }) {
  const jpSlug = JP_SLUG[fighter.name];
  const enUrl = `https://www.ssbwiki.com/${encodeURIComponent(fighter.name.replace(/ /g, "_"))}`;

  // Scrape EN
  let enBios: Record<string, string> = {};
  try {
    const $en = await fetchHtml(enUrl);
    enBios = scrapeEn($en, fighter.name);
    await sleep(DELAY_MS);
  } catch (e) {
    console.error(`  ⚠ EN scrape failed for ${fighter.name}: ${e}`);
  }

  // Scrape JP
  let jpBios: Record<string, string> = {};
  if (jpSlug) {
    try {
      // Encode each path segment separately so "/" in names stays as path separator
      const jpUrl = `https://smashwiki.info/${jpSlug.split("/").map(encodeURIComponent).join("/")}`;

      const $jp = await fetchHtml(jpUrl);
      jpBios = scrapeJp($jp);
      await sleep(DELAY_MS);
    } catch (e) {
      console.error(`  ⚠ JP scrape failed for ${fighter.name}: ${e}`);
    }
  }

  const eras = new Set([...Object.keys(enBios), ...Object.keys(jpBios)]);
  let created = 0, updated = 0;

  for (const era of eras) {
    const enText = enBios[era];
    const jpText = jpBios[era];
    if (!enText && !jpText) continue;

    if (DRY_RUN) {
      console.log(`  [dry] ${era}: EN=${enText ? enText.slice(0, 60) + "…" : "—"}`);
      continue;
    }

    const existing = await db.fighterBio.findUnique({
      where: { fighterId_smashGameVersion: { fighterId: fighter.id, smashGameVersion: era } },
    });

    if (existing) {
      const data: Record<string, string> = {};
      if (enText && !existing.contentEn) data.contentEn = enText;
      if (jpText && !existing.contentJp) data.contentJp = jpText;
      if (Object.keys(data).length > 0) {
        await db.fighterBio.update({
          where: { fighterId_smashGameVersion: { fighterId: fighter.id, smashGameVersion: era } },
          data,
        });
        updated++;
      }
    } else if (enText) {
      await db.fighterBio.create({
        data: {
          fighterId: fighter.id,
          smashGameVersion: era,
          contentEn: enText,
          contentJp: jpText ?? null,
        },
      });
      created++;
    }
  }

  return { created, updated, eras: eras.size };
}

async function main() {
  const fighters = await db.fighter.findMany({
    orderBy: { rosterNumber: "asc" },
    include: { bios: { select: { smashGameVersion: true } } },
  });

  const toProcess = SKIP_EXISTING
    ? fighters.filter(f => f.bios.length === 0)
    : fighters;

  console.log(`Lutadores a processar: ${toProcess.length}/${fighters.length}`);
  console.log(DRY_RUN ? "MODO DRY RUN — sem escrita no banco\n" : "");

  let totalCreated = 0, totalUpdated = 0, failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const f = toProcess[i]!;
    const pct = Math.round(((i + 1) / toProcess.length) * 100);
    process.stdout.write(`[${pct}%] ${String(i + 1).padStart(2)}/${toProcess.length} ${f.name.padEnd(25)}`);

    try {
      const result = await enrichFighter(f);
      totalCreated += result.created;
      totalUpdated += result.updated;
      console.log(`→ ${result.eras} eras | +${result.created} criados | ~${result.updated} atualizados`);
    } catch (e) {
      failed++;
      console.log(`→ ERRO: ${e}`);
    }
  }

  await db.$disconnect();
  console.log("\n=== RESULTADO ===");
  console.log(`✅ Criados:     ${totalCreated}`);
  console.log(`🔄 Atualizados: ${totalUpdated}`);
  console.log(`❌ Falhas:      ${failed}`);
}

main().catch(e => { console.error(e); process.exit(1); });
