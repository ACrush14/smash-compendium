/**
 * scrape-jp-bios.ts — Scrapa bios JP de smashwiki.info para todos os fighters
 *
 * Uso:
 *   npx tsx scripts/scrapers/scrape-jp-bios.ts            # roda tudo
 *   npx tsx scripts/scrapers/scrape-jp-bios.ts --test     # imprime sem salvar
 *   npx tsx scripts/scrapers/scrape-jp-bios.ts --fighter Ness   # um fighter só
 */

import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";
import { politeDelay, sleep } from "./utils";

const db = new PrismaClient();
const args = process.argv.slice(2);
const DRY_RUN  = args.includes("--test");
const SINGLE   = args.includes("--fighter") ? args[args.indexOf("--fighter") + 1] : null;

// ─── Mapeamento EN name → slug smashwiki.info ─────────────────────────────────

const JP_SLUG: Record<string, string> = {
  // ── Smash 64 originals ─────────────────────────────────────────────────────
  "Mario":              "マリオ",
  "Donkey Kong":        "ドンキーコング",
  "Link":               "リンク",
  "Samus":              "サムス",
  "Yoshi":              "ヨッシー",
  "Kirby":              "カービィ",
  "Fox":                "フォックス",
  "Pikachu":            "ピカチュウ",
  "Luigi":              "ルイージ",
  "Ness":               "ネス",
  "Captain Falcon":     "キャプテン・ファルコン",
  "Jigglypuff":         "プリン",
  // ── Melee additions ────────────────────────────────────────────────────────
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
  "Young Link":         "こどもリンク",
  "Ganondorf":          "ガノンドロフ",
  "Mewtwo":             "ミュウツー",
  "Roy":                "ロイ",
  "Chrom":              "クロム",
  "Mr. Game & Watch":   "Mr.ゲーム&ウォッチ",
  // ── Brawl additions ────────────────────────────────────────────────────────
  "Meta Knight":        "メタナイト",
  "Pit":                "ピット",
  "Dark Pit":           "ブラックピット",
  "Zero Suit Samus":    "ゼロスーツサムス",
  "Wario":              "ワリオ",
  "Snake":              "スネーク",
  "Ike":                "アイク",
  "Pokémon Trainer":    "ポケモントレーナー",
  "Diddy Kong":         "ディディーコング",
  "Lucas":              "リュカ",
  "Sonic":              "ソニック",
  "King Dedede":        "デデデ",
  "Olimar":             "ピクミン&オリマー",
  "Lucario":            "ルカリオ",
  "R.O.B.":             "ロボット",
  "Toon Link":          "トゥーンリンク",
  "Wolf":               "ウルフ",
  // ── Smash 4 additions ──────────────────────────────────────────────────────
  "Villager":           "むらびと",
  "Mega Man":           "ロックマン",
  "Wii Fit Trainer":    "Wiiフィットトレーナー",
  "Rosalina & Luma":    "ロゼッタ&チコ",
  "Little Mac":         "リトル・マック",
  "Greninja":           "ゲッコウガ",
  "Mii Brawler":        "Miiファイター_(格闘タイプ)",
  "Mii Swordfighter":   "Miiファイター_(剣術タイプ)",
  "Mii Gunner":         "Miiファイター_(射撃タイプ)",
  "Palutena":           "パルテナ",
  "Pac-Man":            "パックマン",
  "Robin":              "ルフレ",
  "Shulk":              "シュルク",
  "Bowser Jr.":         "クッパJr.",
  "Duck Hunt":          "ダックハント",
  "Ryu":                "リュウ",
  "Ken":                "ケン・マスターズ",
  "Cloud":              "クラウド",
  "Corrin":             "カムイ",
  "Bayonetta":          "ベヨネッタ",
  // ── Ultimate additions ─────────────────────────────────────────────────────
  "Dark Samus":         "ダークサムス",
  "Inkling":            "インクリング",
  "Ridley":             "リドリー",
  "Simon":              "サイモン",
  "Richter":            "リヒター",
  "King K. Rool":       "キングクルール",
  "Isabelle":           "しずえ",
  "Incineroar":         "ガオガエン",
  "Piranha Plant":      "パックンフラワー",
  "Joker":              "ジョーカー",
  "Hero":               "勇者",
  "Banjo & Kazooie":    "バンジョー&カズーイ",
  "Terry":              "テリー",
  "Byleth":             "ベレト",
  "Min Min":            "ミーミー",
  "Steve":              "スティーブ",
  "Sephiroth":          "セフィロス",
  "Pyra":               "ホムラ",
  "Mythra":             "ヒカリ",
  "Kazuya":             "カズヤ",
  "Sora":               "ソラ",
};

// Badge text (from <span> elements inside <dt>) → smashGameVersion
const BADGE_MAP: Record<string, string> = {
  "64":    "SSB64",
  "DX":    "SSBM",
  "X":     "SSBB",
  "3U":    "SSB4",
  "WiiU":  "SSB4",
  "SP":    "SSBU",
};

// ─── Scraper ──────────────────────────────────────────────────────────────────

async function scrapeJpBio(slug: string): Promise<Record<string, string>> {
  const url = `https://www.smashwiki.info/${encodeURIComponent(slug)}`;
  let res: Response;
  for (let attempt = 1; attempt <= 3; attempt++) {
    res = await fetch(url, {
      headers: {
        "User-Agent": "SmashCompendiumBot/1.0 (academic research)",
        "Accept-Language": "ja,en",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (res.status === 429) {
      await sleep(attempt * 8_000);
      continue;
    }
    break;
  }
  if (!res!.ok) {
    throw new Error(`HTTP ${res!.status} — ${url}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const bios: Record<string, string> = {};

  // Find H3 "ゲーム中の解説" inside any parent context
  $(".mw-parser-output h3").each((_, h3el) => {
    const heading = $(h3el).find(".mw-headline").text().trim();
    if (heading !== "ゲーム中の解説") return;

    // Walk siblings until next h2/h3
    let node = $(h3el).next();
    while (node.length) {
      const name = (node[0] as any)?.name;
      if (name === "h2" || name === "h3") break;

      if (name === "dl") {
        const dt = node.find("dt").first();
        const dd = node.find("dd").first();

        // Extract badge text by joining inner span texts (handles "3"+"U" → "3U")
        const badgeText = dt
          .find("span > span")
          .map((_, s) => $(s).text().trim())
          .get()
          .join("");

        const ver = BADGE_MAP[badgeText];
        if (ver && !bios[ver]) {
          // Remove <ul> list items (source game citations) and get clean text
          const ddClone = dd.clone();
          ddClone.find("ul, .reference, sup").remove();
          const text = ddClone.text().replace(/\s+/g, " ").trim();
          if (text.length > 20) {
            bios[ver] = text;
          }
        }
      }

      node = node.next();
    }
  });

  return bios;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const fighters = await db.fighter.findMany({
    where: SINGLE ? { name: SINGLE } : { bios: { some: { contentJp: null } } },
    include: { bios: true },
    orderBy: { rosterNumber: "asc" },
  });

  console.log(`Found ${fighters.length} fighters to process.`);
  let ok = 0, skip = 0, fail = 0;

  for (const fighter of fighters) {
    const slug = JP_SLUG[fighter.name];
    if (!slug) {
      console.log(`⚠️  No JP slug for "${fighter.name}" — skip`);
      skip++;
      continue;
    }

    try {
      process.stdout.write(`Scraping ${fighter.name} (${slug})... `);
      const bios = await scrapeJpBio(slug);

      const foundVersions = Object.keys(bios);
      if (foundVersions.length === 0) {
        console.log("⚠️  no bios found");
        skip++;
      } else {
        console.log(`✅ [${foundVersions.join(", ")}]`);
        if (DRY_RUN) {
          for (const [ver, text] of Object.entries(bios)) {
            console.log(`  ${ver}: ${text.slice(0, 100)}...`);
          }
        } else {
          for (const bio of fighter.bios) {
            const text = bios[bio.smashGameVersion];
            if (text) {
              await db.fighterBio.update({
                where: { id: bio.id },
                data: { contentJp: text },
              });
            }
          }
        }
        ok++;
      }
    } catch (err) {
      console.log(`❌ ${(err as Error).message}`);
      fail++;
    }

    await politeDelay();
  }

  console.log(`\nDone — ✅ ${ok} saved, ⚠️  ${skip} skipped, ❌ ${fail} failed`);
}

main().catch(console.error).finally(() => db.$disconnect());
