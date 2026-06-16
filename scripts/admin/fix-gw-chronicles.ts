/**
 * Corrige Game & Watch no Chronicles:
 * 1. Renomeia JP EXCLUSIVE que representam jogos únicos
 * 2. Deleta JP EXCLUSIVE que são duplicatas de entradas western existentes
 * 3. Corrige "Fire" existente → "Fire (Wide Screen)" com data certa
 * 4. Adiciona 11 jogos que faltam totalmente
 */
import { db } from "../../lib/db";

async function main() {
  const DRY = process.argv.includes("--dry");
  if (DRY) console.log("[DRY RUN]\n");

  // ─── 1. RENAMES ────────────────────────────────────────────────────────────
  // JP EXCLUSIVE → título real (identificados pelo titleJp único)
  const RENAMES: Array<{
    titleJpMatch: string;   // match parcial do titleJp atual
    titleNtsc: string;
    titleJp: string;
    releaseDateNtsc?: string;
  }> = [
    { titleJpMatch: "シェフ",               titleNtsc: "Chef",                                titleJp: "シェフ",                             releaseDateNtsc: "09/08/1981" },
    { titleJpMatch: "ライオン",              titleNtsc: "Lion",                                titleJp: "ライオン",                            releaseDateNtsc: "04/27/1981" },
    { titleJpMatch: "バーミン",              titleNtsc: "Vermin",                              titleJp: "バーミン",                            releaseDateNtsc: "07/10/1980" },
    { titleJpMatch: "ドンキーコングJR.（ニュー", titleNtsc: "Donkey Kong Junior (New Wide Screen)", titleJp: "ドンキーコングJR.（ニューワイドシリーズ）",   releaseDateNtsc: "10/26/1982" },
    { titleJpMatch: "マリオズ セメント ファクトリー（ニュー", titleNtsc: "Mario's Cement Factory (New Wide Screen)", titleJp: "マリオズ セメント ファクトリー（ニューワイドシリーズ）", releaseDateNtsc: "06/16/1983" },
    { titleJpMatch: "スヌーピー（カラースクリーン", titleNtsc: "Snoopy (Table Top)",              titleJp: "スヌーピー（カラースクリーン テーブルトップ）",  releaseDateNtsc: "07/05/1983" },
    { titleJpMatch: "ドンキーコングJR.（カラースクリーン", titleNtsc: "Donkey Kong Junior (Table Top)", titleJp: "ドンキーコングJR.（カラースクリーン テーブルトップ）", releaseDateNtsc: "04/28/1983" },
    { titleJpMatch: "ポパイ（パノラマスクリーン）",  titleNtsc: "Popeye (Panorama)",              titleJp: "ポパイ（パノラマスクリーン）",              releaseDateNtsc: "08/30/1983" },
    { titleJpMatch: "ピンボール",             titleNtsc: "Pinball",                            titleJp: "ピンボール",                          releaseDateNtsc: "12/05/1983" },
    { titleJpMatch: "ファイア（シルバー",        titleNtsc: "Fire (Silver Series)",              titleJp: "ファイア（シルバーシリーズ）",              releaseDateNtsc: "07/31/1980" },
    { titleJpMatch: "マンホール（ゴールド",       titleNtsc: "Manhole (Gold Series)",            titleJp: "マンホール（ゴールドシリーズ）",             releaseDateNtsc: "01/27/1981" },
  ];

  console.log("=== RENAMES ===");
  for (const r of RENAMES) {
    const entry = await db.chronicleEntry.findFirst({
      where: {
        consoleName: "Game & Watch",
        titleNtsc: { in: ["JP EXCLUSIVE", "PAL EXCLUSIVE"] },
        titleJp: { contains: r.titleJpMatch },
      },
    });
    if (!entry) {
      console.log(`  MISS ${r.titleNtsc} — não encontrado (titleJp contém "${r.titleJpMatch}")`);
      continue;
    }
    if (!DRY) {
      await db.chronicleEntry.update({
        where: { id: entry.id },
        data: {
          titleNtsc: r.titleNtsc,
          titleJp: r.titleJp,
          ...(r.releaseDateNtsc ? { releaseDateNtsc: r.releaseDateNtsc } : {}),
        },
      });
    }
    console.log(`  RENAME [${entry.id.slice(-6)}] → "${r.titleNtsc}"`);
  }

  // ─── 2. CORRIGE "Fire" existente → "Fire (Wide Screen)" ──────────────────
  console.log("\n=== CORRIGIR Fire existente ===");
  const existingFire = await db.chronicleEntry.findFirst({
    where: { consoleName: "Game & Watch", titleNtsc: "Fire" },
  });
  if (existingFire) {
    if (!DRY) {
      await db.chronicleEntry.update({
        where: { id: existingFire.id },
        data: { titleNtsc: "Fire (Wide Screen)", releaseDateNtsc: "12/04/1981" },
      });
    }
    console.log(`  UPDATE [${existingFire.id.slice(-6)}] "Fire" → "Fire (Wide Screen)" (1981)`);
  } else {
    console.log("  SKIP — 'Fire' não encontrado");
  }

  // ─── 3. DELETA duplicatas JP EXCLUSIVE ────────────────────────────────────
  // Esses têm uma entrada western equivalente já no DB
  const DELETE_MATCHES: string[] = [
    "オイルパニック",        // Oil Panic
    "オクトパス",           // Octopus
    "クラブグラブ",          // Crab Grab
    "グリーンハウス",        // Green House
    "ジャッジ",             // Judge
    "スヌーピー（パノラマ",   // Snoopy (Panorama)
    "スヌーピーテニス",       // Snoopy Tennis
    "スピット ボール",        // Spitball Sparky
    "タートルブリッジ",       // Turtle Bridge
    "ドンキーコング（マルチ",  // Donkey Kong (Multi Screen)
    "ドンキーコング3",        // Donkey Kong 3
    "ドンキーコングⅡ",       // Donkey Kong II
    "ドンキーコングJR.（パノラマ", // DK Junior Panorama
    "ドンキーコングホッケー",  // Donkey Kong Hockey
    "パラシュート",          // Parachute
    "ファイアアタック",       // Fire Attack
    "ブラックジャック",        // Blackjack
    "フラッグマン",           // Flagman
    "ヘルメット",             // Helmet
    "ボール（シルバー",        // Ball
    "ボクシング",             // Boxing / Punch-Out
    "ポパイ（ワイドスクリーン）", // Popeye Wide Screen
    "マリオズ セメント ファクトリー（カラースクリーン", // Mario's Cement Factory Table Top
    "マリオズ ボン アウェイ",  // Mario's Bombs Away Panorama
    "マリオブラザーズ",        // Mario Bros.
    "ミッキー＆ドナルド",      // Mickey & Donald
    "ミッキーマウス",          // Mickey Mouse
    "ファイア（ワイドスクリーン）", // Fire Wide Screen (after renaming existing "Fire")
  ];

  console.log("\n=== DELETE duplicatas ===");
  for (const jpMatch of DELETE_MATCHES) {
    const entry = await db.chronicleEntry.findFirst({
      where: {
        consoleName: "Game & Watch",
        titleNtsc: { in: ["JP EXCLUSIVE", "PAL EXCLUSIVE"] },
        titleJp: { contains: jpMatch },
      },
      include: {
        collectibleLinks: true,
        fighterLinks: true,
      },
    });
    if (!entry) {
      console.log(`  MISS "${jpMatch}" — não encontrado`);
      continue;
    }
    const links = entry.collectibleLinks.length + entry.fighterLinks.length;
    if (links > 0) {
      console.log(`  SKIP [${entry.id.slice(-6)}] "${jpMatch}" — tem ${links} links, não deletar`);
      continue;
    }
    if (!DRY) {
      await db.chronicleEntry.delete({ where: { id: entry.id } });
    }
    console.log(`  DELETE [${entry.id.slice(-6)}] "${jpMatch}"`);
  }

  // Deleta o JP EXCLUSIVE sem titleJp (desconhecido)
  const unknown = await db.chronicleEntry.findFirst({
    where: {
      consoleName: "Game & Watch",
      titleNtsc: "JP EXCLUSIVE",
      titleJp: null,
    },
    include: { collectibleLinks: true, fighterLinks: true },
  });
  if (unknown) {
    const links = unknown.collectibleLinks.length + unknown.fighterLinks.length;
    if (links === 0) {
      if (!DRY) await db.chronicleEntry.delete({ where: { id: unknown.id } });
      console.log(`  DELETE [${unknown.id.slice(-6)}] "(sem titleJp)"`);
    } else {
      console.log(`  SKIP [${unknown.id.slice(-6)}] "(sem titleJp)" — tem ${links} links`);
    }
  }

  // ─── 4. ADICIONA jogos faltantes ─────────────────────────────────────────
  const NEW_GAMES = [
    { titleNtsc: "Egg",              releaseDateNtsc: "10/09/1981", titleJp: "エッグ" },
    { titleNtsc: "Tropical Fish",    releaseDateNtsc: "1985",       titleJp: "トロピカルフィッシュ" },
    { titleNtsc: "Super Mario Bros.",releaseDateNtsc: "1988",       titleJp: "スーパーマリオブラザーズ" },
    { titleNtsc: "Climber",          releaseDateNtsc: "1988",       titleJp: "クライマー" },
    { titleNtsc: "Balloon Fight",    releaseDateNtsc: "1988",       titleJp: "バルーンファイト" },
    { titleNtsc: "Mario the Juggler",releaseDateNtsc: "1991",       titleJp: "マリオ・ザ・ジャグラー" },
    { titleNtsc: "Squish",           releaseDateNtsc: "1986",       titleJp: "スクウィッシュ" },
    { titleNtsc: "Bomb Sweeper",     releaseDateNtsc: "1987",       titleJp: "ボムスウィーパー" },
    { titleNtsc: "Safebuster",       releaseDateNtsc: "1988",       titleJp: "セーフバスター" },
    { titleNtsc: "Gold Cliff",       releaseDateNtsc: "1988",       titleJp: "ゴールドクリフ" },
    { titleNtsc: "Zelda",            releaseDateNtsc: "1989",       titleJp: "ゼルダ" },
  ];

  console.log("\n=== ADICIONAR novos jogos ===");
  for (const g of NEW_GAMES) {
    if (!DRY) {
      await db.chronicleEntry.create({
        data: {
          consoleName:     "Game & Watch",
          titleNtsc:       g.titleNtsc,
          titleJp:         g.titleJp,
          releaseDateNtsc: g.releaseDateNtsc,
        },
      });
    }
    console.log(`  CREATE "${g.titleNtsc}" (${g.releaseDateNtsc})`);
  }

  console.log("\n=== CONCLUÍDO ===");
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
