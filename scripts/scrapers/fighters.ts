/**
 * Scraper — Fighters
 *
 * Fonte primária: Lista de personagens do SSBU e páginas individuais de cada lutador.
 * Estratégia:
 *   1. Raspa a tabela de roster da página de lista do SSBU para obter nome + número.
 *   2. Para cada lutador, visita a página individual e extrai:
 *      - Franquia de origem (infobox)
 *      - Bio em inglês (seção "Biography" ou "In Super Smash Bros. …")
 *      - Aparições em quais jogos (tabela de aparições na infobox)
 */

import { db } from "../../lib/db";
import {
  fetchHtml,
  politeDelay,
  cleanText,
  wikiUrl,
  jpWikiUrl,
  resolveGameVersion,
  log,
} from "./utils";

// ─── Types locais ─────────────────────────────────────────────────────────────

interface RawFighter {
  number:   string;
  name:     string;
  wikiPath: string;
  jpName:   string;  // Nome canônico JP — usado em smashwiki.info
}

interface FighterDetail {
  franchiseName: string;
  bioEn:         string;
  bioJp:         string | null;  // Introdução extraída da smashwiki.info
  appearsIn:     string[];
  isDebutMap:    Record<string, boolean>;
}

// ─── Step 1: Roster hardcoded (SSBWiki não tem página de índice estável) ─────
// Roster completo do SSBU — 89 fighters em ordem de número oficial.
// URLs seguem o padrão /Name_(SSBU) da SSBWiki.

const SSBU_ROSTER: RawFighter[] = [
  { number: "1",   name: "Mario",              wikiPath: "/Mario_(SSBU)",              jpName: "マリオ" },
  { number: "2",   name: "Donkey Kong",        wikiPath: "/Donkey_Kong_(SSBU)",        jpName: "ドンキーコング" },
  { number: "3",   name: "Link",               wikiPath: "/Link_(SSBU)",               jpName: "リンク" },
  { number: "4",   name: "Samus",              wikiPath: "/Samus_(SSBU)",              jpName: "サムス" },
  { number: "4e",  name: "Dark Samus",         wikiPath: "/Dark_Samus_(SSBU)",         jpName: "ダークサムス" },
  { number: "5",   name: "Yoshi",              wikiPath: "/Yoshi_(SSBU)",              jpName: "ヨッシー" },
  { number: "6",   name: "Kirby",              wikiPath: "/Kirby_(SSBU)",              jpName: "カービィ" },
  { number: "7",   name: "Fox",                wikiPath: "/Fox_(SSBU)",                jpName: "フォックス" },
  { number: "8",   name: "Pikachu",            wikiPath: "/Pikachu_(SSBU)",            jpName: "ピカチュウ" },
  { number: "9",   name: "Luigi",              wikiPath: "/Luigi_(SSBU)",              jpName: "ルイージ" },
  { number: "10",  name: "Ness",               wikiPath: "/Ness_(SSBU)",               jpName: "ネス" },
  { number: "11",  name: "Captain Falcon",     wikiPath: "/Captain_Falcon_(SSBU)",     jpName: "キャプテン・ファルコン" },
  { number: "12",  name: "Jigglypuff",         wikiPath: "/Jigglypuff_(SSBU)",         jpName: "プリン" },
  { number: "13",  name: "Peach",              wikiPath: "/Peach_(SSBU)",              jpName: "ピーチ" },
  { number: "13e", name: "Daisy",              wikiPath: "/Daisy_(SSBU)",              jpName: "デイジー" },
  { number: "14",  name: "Bowser",             wikiPath: "/Bowser_(SSBU)",             jpName: "クッパ" },
  { number: "15",  name: "Ice Climbers",       wikiPath: "/Ice_Climbers_(SSBU)",       jpName: "アイスクライマー" },
  { number: "16",  name: "Sheik",              wikiPath: "/Sheik_(SSBU)",              jpName: "シーク" },
  { number: "17",  name: "Zelda",              wikiPath: "/Zelda_(SSBU)",              jpName: "ゼルダ" },
  { number: "18",  name: "Dr. Mario",          wikiPath: "/Dr._Mario_(SSBU)",          jpName: "ドクターマリオ" },
  { number: "19",  name: "Pichu",              wikiPath: "/Pichu_(SSBU)",              jpName: "ピチュー" },
  { number: "20",  name: "Falco",              wikiPath: "/Falco_(SSBU)",              jpName: "ファルコ" },
  { number: "21",  name: "Marth",              wikiPath: "/Marth_(SSBU)",              jpName: "マルス" },
  { number: "21e", name: "Lucina",             wikiPath: "/Lucina_(SSBU)",             jpName: "ルキナ" },
  { number: "22",  name: "Young Link",         wikiPath: "/Young_Link_(SSBU)",         jpName: "こどもリンク" },
  { number: "23",  name: "Ganondorf",          wikiPath: "/Ganondorf_(SSBU)",          jpName: "ガノンドロフ" },
  { number: "24",  name: "Mewtwo",             wikiPath: "/Mewtwo_(SSBU)",             jpName: "ミュウツー" },
  { number: "25",  name: "Roy",                wikiPath: "/Roy_(SSBU)",                jpName: "ロイ" },
  { number: "25e", name: "Chrom",              wikiPath: "/Chrom_(SSBU)",              jpName: "クロム" },
  { number: "26",  name: "Mr. Game & Watch",   wikiPath: "/Mr._Game_%26_Watch_(SSBU)", jpName: "Mr.ゲーム＆ウォッチ" },
  { number: "27",  name: "Meta Knight",        wikiPath: "/Meta_Knight_(SSBU)",        jpName: "メタナイト" },
  { number: "28",  name: "Pit",                wikiPath: "/Pit_(SSBU)",                jpName: "ピット" },
  { number: "28e", name: "Dark Pit",           wikiPath: "/Dark_Pit_(SSBU)",           jpName: "ブラックピット" },
  { number: "29",  name: "Zero Suit Samus",    wikiPath: "/Zero_Suit_Samus_(SSBU)",    jpName: "ゼロスーツサムス" },
  { number: "30",  name: "Wario",              wikiPath: "/Wario_(SSBU)",              jpName: "ワリオ" },
  { number: "31",  name: "Snake",              wikiPath: "/Snake_(SSBU)",              jpName: "スネーク" },
  { number: "32",  name: "Ike",                wikiPath: "/Ike_(SSBU)",                jpName: "アイク" },
  { number: "33",  name: "Pokémon Trainer",    wikiPath: "/Pokémon_Trainer_(SSBU)",    jpName: "ポケモントレーナー" },
  { number: "34",  name: "Diddy Kong",         wikiPath: "/Diddy_Kong_(SSBU)",         jpName: "ディディーコング" },
  { number: "35",  name: "Lucas",              wikiPath: "/Lucas_(SSBU)",              jpName: "リュカ" },
  { number: "36",  name: "Sonic",              wikiPath: "/Sonic_(SSBU)",              jpName: "ソニック" },
  { number: "37",  name: "King Dedede",        wikiPath: "/King_Dedede_(SSBU)",        jpName: "デデデ" },
  { number: "38",  name: "Olimar",             wikiPath: "/Olimar_(SSBU)",             jpName: "ピクミン＆オリマー" },
  { number: "39",  name: "Lucario",            wikiPath: "/Lucario_(SSBU)",            jpName: "ルカリオ" },
  { number: "40",  name: "R.O.B.",             wikiPath: "/R.O.B._(SSBU)",             jpName: "ロボット" },
  { number: "41",  name: "Toon Link",          wikiPath: "/Toon_Link_(SSBU)",          jpName: "トゥーンリンク" },
  { number: "42",  name: "Wolf",               wikiPath: "/Wolf_(SSBU)",               jpName: "ウルフ" },
  { number: "43",  name: "Villager",           wikiPath: "/Villager_(SSBU)",           jpName: "むらびと" },
  { number: "44",  name: "Mega Man",           wikiPath: "/Mega_Man_(SSBU)",           jpName: "ロックマン" },
  { number: "45",  name: "Wii Fit Trainer",    wikiPath: "/Wii_Fit_Trainer_(SSBU)",    jpName: "Wii Fitトレーナー" },
  { number: "46",  name: "Rosalina & Luma",    wikiPath: "/Rosalina_%26_Luma_(SSBU)",  jpName: "ロゼッタ＆チコ" },
  { number: "47",  name: "Little Mac",         wikiPath: "/Little_Mac_(SSBU)",         jpName: "リトル・マック" },
  { number: "48",  name: "Greninja",           wikiPath: "/Greninja_(SSBU)",           jpName: "ゲッコウガ" },
  { number: "49",  name: "Mii Brawler",        wikiPath: "/Mii_Brawler_(SSBU)",        jpName: "Mii格闘タイプ" },
  { number: "50",  name: "Mii Swordfighter",   wikiPath: "/Mii_Swordfighter_(SSBU)",   jpName: "Mii剣術タイプ" },
  { number: "51",  name: "Mii Gunner",         wikiPath: "/Mii_Gunner_(SSBU)",         jpName: "Mii射撃タイプ" },
  { number: "52",  name: "Palutena",           wikiPath: "/Palutena_(SSBU)",           jpName: "パルテナ" },
  { number: "53",  name: "Pac-Man",            wikiPath: "/Pac-Man_(SSBU)",            jpName: "パックマン" },
  { number: "54",  name: "Robin",              wikiPath: "/Robin_(SSBU)",              jpName: "ルフレ" },
  { number: "55",  name: "Shulk",              wikiPath: "/Shulk_(SSBU)",              jpName: "シュルク" },
  { number: "56",  name: "Bowser Jr.",         wikiPath: "/Bowser_Jr._(SSBU)",         jpName: "クッパJr." },
  { number: "57",  name: "Duck Hunt",          wikiPath: "/Duck_Hunt_(SSBU)",          jpName: "ダックハント" },
  { number: "58",  name: "Ryu",                wikiPath: "/Ryu_(SSBU)",                jpName: "リュウ" },
  { number: "58e", name: "Ken",                wikiPath: "/Ken_(SSBU)",                jpName: "ケン" },
  { number: "59",  name: "Cloud",              wikiPath: "/Cloud_(SSBU)",              jpName: "クラウド" },
  { number: "60",  name: "Corrin",             wikiPath: "/Corrin_(SSBU)",             jpName: "カムイ" },
  { number: "61",  name: "Bayonetta",          wikiPath: "/Bayonetta_(SSBU)",          jpName: "ベヨネッタ" },
  { number: "62",  name: "Inkling",            wikiPath: "/Inkling_(SSBU)",            jpName: "インクリング" },
  { number: "63",  name: "Ridley",             wikiPath: "/Ridley_(SSBU)",             jpName: "リドリー" },
  { number: "64",  name: "Simon",              wikiPath: "/Simon_(SSBU)",              jpName: "シモン" },
  { number: "64e", name: "Richter",            wikiPath: "/Richter_(SSBU)",            jpName: "リヒター" },
  { number: "65",  name: "King K. Rool",       wikiPath: "/King_K._Rool_(SSBU)",       jpName: "キングクルール" },
  { number: "66",  name: "Isabelle",           wikiPath: "/Isabelle_(SSBU)",           jpName: "しずえ" },
  { number: "67",  name: "Incineroar",         wikiPath: "/Incineroar_(SSBU)",         jpName: "ガオガエン" },
  { number: "68",  name: "Piranha Plant",      wikiPath: "/Piranha_Plant_(SSBU)",      jpName: "パックンフラワー" },
  { number: "69",  name: "Joker",              wikiPath: "/Joker_(SSBU)",              jpName: "ジョーカー" },
  { number: "70",  name: "Hero",               wikiPath: "/Hero_(SSBU)",               jpName: "勇者" },
  { number: "71",  name: "Banjo & Kazooie",    wikiPath: "/Banjo_%26_Kazooie_(SSBU)",  jpName: "バンジョー＆カズーイ" },
  { number: "72",  name: "Terry",              wikiPath: "/Terry_(SSBU)",              jpName: "テリー" },
  { number: "73",  name: "Byleth",             wikiPath: "/Byleth_(SSBU)",             jpName: "ベレト" },
  { number: "74",  name: "Min Min",            wikiPath: "/Min_Min_(SSBU)",            jpName: "ミェンミェン" },
  { number: "75",  name: "Steve",              wikiPath: "/Steve_(SSBU)",              jpName: "スティーブ" },
  { number: "76",  name: "Sephiroth",          wikiPath: "/Sephiroth_(SSBU)",          jpName: "セフィロス" },
  { number: "77",  name: "Pyra",               wikiPath: "/Pyra_(SSBU)",               jpName: "ホムラ" },
  { number: "77e", name: "Mythra",             wikiPath: "/Mythra_(SSBU)",             jpName: "ヒカリ" },
  { number: "78",  name: "Kazuya",             wikiPath: "/Kazuya_(SSBU)",             jpName: "カズヤ" },
  { number: "79",  name: "Sora",               wikiPath: "/Sora_(SSBU)",               jpName: "ソラ" },
];

export async function scrapeFighterList(): Promise<RawFighter[]> {
  log.ok(`Roster hardcoded: ${SSBU_ROSTER.length} lutadores carregados.`);
  return SSBU_ROSTER;
}

// ─── Step 2a: Bio JP (smashwiki.info) ────────────────────────────────────────

async function scrapeJpBio(jpName: string): Promise<string | null> {
  try {
    const url = jpWikiUrl(jpName);
    const $   = await fetchHtml(url);

    // Tenta intro: primeiro parágrafo substantivo da página
    let bio = "";
    $(".mw-parser-output > p").each((_i, el) => {
      if (bio) return;
      const t = $(el).text().trim();
      if (t.length > 80) bio = cleanText(t);
    });
    return bio || null;
  } catch {
    return null; // wiki JP pode não ter a página — não bloqueia o ETL
  }
}

// ─── Step 2b: Detalhe individual (EN) ────────────────────────────────────────

async function scrapeFighterDetail(
  name: string,
  wikiPath: string,
): Promise<FighterDetail> {
  const url = wikiUrl(wikiPath);
  const $   = await fetchHtml(url);

  // --- Franquia ---
  let franchiseName = "Unknown";
  $(".infobox-row, .pi-data").each((_i, el) => {
    const label = $(el).find(".infobox-row-header, .pi-data-label").text().trim().toLowerCase();
    if (label.includes("universe") || label.includes("universe(s)")) {
      franchiseName = cleanText($(el).find(".infobox-row-value, .pi-data-value").text());
      // Pega apenas o primeiro universo se houver múltiplos
      franchiseName = (franchiseName.split(/[,\/]/)[0] ?? franchiseName).trim().replace("universe", "").trim();
    }
  });

  // Fallback: procura na infobox genérica de personagem
  if (franchiseName === "Unknown") {
    const universeRow = $("table.infobox tr").filter((_i, el) => {
      return $(el).text().toLowerCase().includes("universe");
    }).first();
    if (universeRow.length) {
      const rawFranchise = cleanText(universeRow.find("td").last().text());
      franchiseName = (rawFranchise.split(/[,\/]/)[0] ?? rawFranchise).trim();
    }
  }

  // --- Bio em inglês ---
  // SSBWiki coloca a bio na seção "In Super Smash Bros. <Game>" ou "Biography"
  let bioEn = "";
  const bioSection = $("#Biography, #Biography_in_other_languages")
    .closest("h2, h3")
    .nextUntil("h2, h3");

  if (bioSection.length) {
    bioEn = cleanText(bioSection.filter("p").text());
  }

  // Fallback: pega o primeiro parágrafo descritivo da página
  if (!bioEn) {
    const firstPara = $(".mw-parser-output > p").filter((_i, el) => {
      const t = $(el).text().trim();
      return t.length > 80 && !t.startsWith("For");
    }).first();
    bioEn = cleanText(firstPara.text());
  }

  // --- Aparições por jogo ---
  const appearsIn: string[] = [];
  const isDebutMap: Record<string, boolean> = {};

  // Procura tabela de aparições na infobox (linhas com ícones de jogo)
  $("table.infobox tr, .infobox-row").each((_i, el) => {
    const label = $(el).find("th, .infobox-row-header").text().trim().toLowerCase();
    if (!label.includes("game") && !label.includes("appear") && !label.includes("fighter")) return;

    $(el).find("a[title]").each((_j, a) => {
      const title = $(a).attr("title") ?? "";
      const ver   = resolveGameVersion(title);
      if (ver && !appearsIn.includes(ver)) {
        appearsIn.push(ver);
      }
    });
  });

  // Se não encontrou, tenta varrer os ícones de jogo na própria infobox
  if (appearsIn.length === 0) {
    $(".infobox img[alt], table.infobox img[alt]").each((_i, img) => {
      const alt = $(img).attr("alt") ?? "";
      const ver = resolveGameVersion(alt);
      if (ver && ver !== alt && !appearsIn.includes(ver)) {
        appearsIn.push(ver);
      }
    });
  }

  // Fallback: extrai menções de jogo direto do texto da página quando infobox falha
  if (appearsIn.length <= 1) {
    const pageText = $(".mw-parser-output").text();
    const gamePatterns: Array<[RegExp, string]> = [
      [/Super Smash Bros\. for (Nintendo 3DS|Wii U)/g,       "SSB4"],
      [/Super Smash Bros\. Melee/g,                           "SSBM"],
      [/Super Smash Bros\. Brawl/g,                          "SSBB"],
      [/Super Smash Bros\. Ultimate/g,                        "SSBU"],
      [/original Super Smash Bros\.|Super Smash Bros\. 64/g, "SSB64"],
    ];
    for (const [pattern, ver] of gamePatterns) {
      if (pattern.test(pageText) && !appearsIn.includes(ver)) {
        appearsIn.push(ver);
      }
    }
    const ORDER = ["SSB64", "SSBM", "SSBB", "SSB4", "SSBU"];
    appearsIn.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  }

  // Tenta inferir debut: procura a primeira menção histórica
  const firstAppearance = appearsIn[0];
  if (firstAppearance) {
    isDebutMap[firstAppearance] = true;
  }

  return { franchiseName, bioEn, bioJp: null, appearsIn, isDebutMap };
}

// ─── Step 3: Upsert no banco ──────────────────────────────────────────────────

export async function upsertFighters(fighters: RawFighter[]): Promise<void> {
  // Garante que os Games base existem para fazer os FighterWork links
  const gameVersionDefs = [
    { titleEn: "Super Smash Bros.",        platform: "N64",      franchiseName: "Super Smash Bros." },
    { titleEn: "Super Smash Bros. Melee",  platform: "GameCube", franchiseName: "Super Smash Bros." },
    { titleEn: "Super Smash Bros. Brawl",  platform: "Wii",      franchiseName: "Super Smash Bros." },
    { titleEn: "Super Smash Bros. 4",      platform: "WiiU",     franchiseName: "Super Smash Bros." },
    { titleEn: "Super Smash Bros. Ultimate",platform: "Switch",  franchiseName: "Super Smash Bros." },
  ];

  // Upsert da franquia "Super Smash Bros." (a série em si)
  const seriesFranchise = await db.franchise.upsert({
    where:  { name: "Super Smash Bros." },
    create: { name: "Super Smash Bros." },
    update: {},
  });

  // Upsert dos games base
  const gameMap: Record<string, string> = {}; // version → gameId
  for (const def of gameVersionDefs) {
    const ver = resolveGameVersion(def.titleEn);
    const game = await db.game.upsert({
      where:  { id: `game-${ver}` },
      create: {
        id:          `game-${ver}`,
        titleEn:     def.titleEn,
        platform:    def.platform,
        franchiseId: seriesFranchise.id,
      },
      update: {},
    });
    gameMap[ver] = game.id;
  }

  let processed = 0;

  for (const raw of fighters) {
    try {
      log.info(`[${raw.number}] ${raw.name}`);
      const [detail, bioJp] = await Promise.all([
        scrapeFighterDetail(raw.name, raw.wikiPath),
        scrapeJpBio(raw.jpName),
      ]);
      detail.bioJp = bioJp;

      // Upsert da franquia do lutador
      const franchise = await db.franchise.upsert({
        where:  { name: detail.franchiseName },
        create: { name: detail.franchiseName },
        update: {},
      });

      // Upsert do lutador
      const fighter = await db.fighter.upsert({
        where:  { name: raw.name },
        create: {
          name:         raw.name,
          rosterNumber: raw.number,
          franchiseId:  franchise.id,
        },
        update: {
          rosterNumber: raw.number,
          franchiseId:  franchise.id,
        },
      });

      // Upsert da bio SSBU (EN + JP quando disponível)
      if (detail.bioEn) {
        await db.fighterBio.upsert({
          where: {
            fighterId_smashGameVersion: {
              fighterId:        fighter.id,
              smashGameVersion: "SSBU",
            },
          },
          create: {
            fighterId:        fighter.id,
            smashGameVersion: "SSBU",
            contentEn:        detail.bioEn,
            contentJp:        detail.bioJp ?? null,
          },
          update: {
            contentEn: detail.bioEn,
            ...(detail.bioJp ? { contentJp: detail.bioJp } : {}),
          },
        });
      }

      // Upsert das aparições por jogo
      for (const ver of detail.appearsIn) {
        const gameId = gameMap[ver];
        if (!gameId) continue;
        await db.fighterWork.upsert({
          where: {
            fighterId_gameId: { fighterId: fighter.id, gameId },
          },
          create: {
            fighterId: fighter.id,
            gameId,
            isDebut:   detail.isDebutMap[ver] ?? false,
          },
          update: {
            isDebut: detail.isDebutMap[ver] ?? false,
          },
        });
      }

      processed++;
      log.ok(`  ${raw.name} salvo (franquia: ${detail.franchiseName})`);
    } catch (err) {
      log.error(`  Falha em ${raw.name}: ${String(err)}`);
    }

    await politeDelay();
  }

  log.ok(`Lutadores: ${processed}/${fighters.length} processados.`);
}
