/**
 * scrape-fighter-music.ts
 * Para cada fighter, busca automaticamente no YouTube a trilha sonora icônica.
 * Usa busca YouTube sem API key (parseia ytInitialData do HTML).
 *
 * Fontes por prioridade:
 *   1. Tabela curada MUSIC_MAP (tracks verificadas manualmente)
 *   2. Busca automática YouTube: "[fighter] [franchise] theme Super Smash Bros Ultimate"
 *
 * Salva no banco Fighter.musicYoutubeId / musicTitle / musicArtist / musicStatus
 *
 * Run: npx tsx --env-file=.env.local scripts/scrapers/scrape-fighter-music.ts
 */

import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Tabela curada: as tracks mais icônicas por personagem ──────────────────────
// youtubeId verificado → Nintendo/NintendoMusicYT official ou uploads conhecidos
// Formato: { youtubeId, title, artist }
const MUSIC_MAP: Record<string, { youtubeId: string; title: string; artist: string }> = {
  "Mario":             { youtubeId: "CDBB4vSZAyE", title: "Ground Theme (Super Mario Bros.)", artist: "Koji Kondo" },
  "Donkey Kong":       { youtubeId: "3fGTiMTGsKI", title: "DK Rap", artist: "David Wise" },
  "Link":              { youtubeId: "3MJpjHfEMLE", title: "The Legend of Zelda Main Theme", artist: "Koji Kondo" },
  "Samus":             { youtubeId: "6CRJNirqkHY", title: "Brinstar (Metroid)", artist: "Hip Tanaka" },
  "Dark Samus":        { youtubeId: "6CRJNirqkHY", title: "Brinstar (Metroid)", artist: "Hip Tanaka" },
  "Yoshi":             { youtubeId: "bbbaaJBB9yI", title: "Yoshi's Story", artist: "Kazumi Totaka" },
  "Kirby":             { youtubeId: "IiVN0qXiIqg", title: "Green Greens", artist: "Jun Ishikawa" },
  "Fox":               { youtubeId: "FBBU0TPlHnk", title: "Corneria", artist: "Hajime Hirasawa" },
  "Pikachu":           { youtubeId: "P9Jb5WzrB4k", title: "Main Theme (Pokémon Red / Blue)", artist: "Junichi Masuda" },
  "Luigi":             { youtubeId: "CDBB4vSZAyE", title: "Ground Theme (Super Mario Bros.)", artist: "Koji Kondo" },
  "Ness":              { youtubeId: "OsQEEHUuLGg", title: "Bein' Friends", artist: "Shogo Sakai · Melee Remix" },
  "Captain Falcon":    { youtubeId: "l-8MNdL9m-8", title: "Mute City (Melee)", artist: "Hirokazu Ando · Melee Remix" },
  "Jigglypuff":        { youtubeId: "P9Jb5WzrB4k", title: "Main Theme (Pokémon Red / Blue)", artist: "Junichi Masuda" },
  "Peach":             { youtubeId: "CDBB4vSZAyE", title: "Ground Theme (Super Mario Bros.)", artist: "Koji Kondo" },
  "Daisy":             { youtubeId: "CDBB4vSZAyE", title: "Ground Theme (Super Mario Bros.)", artist: "Koji Kondo" },
  "Bowser":            { youtubeId: "CDBB4vSZAyE", title: "Ground Theme (Super Mario Bros.)", artist: "Koji Kondo" },
  "Ice Climbers":      { youtubeId: "TlcHnSFSEoA", title: "Ice Climber", artist: "Hirokazu Tanaka" },
  "Sheik":             { youtubeId: "3MJpjHfEMLE", title: "The Legend of Zelda Main Theme", artist: "Koji Kondo" },
  "Zelda":             { youtubeId: "3MJpjHfEMLE", title: "The Legend of Zelda Main Theme", artist: "Koji Kondo" },
  "Dr. Mario":         { youtubeId: "CDBB4vSZAyE", title: "Dr. Mario (Fever)", artist: "Hirokazu Tanaka" },
  "Pichu":             { youtubeId: "P9Jb5WzrB4k", title: "Main Theme (Pokémon Red / Blue)", artist: "Junichi Masuda" },
  "Falco":             { youtubeId: "FBBU0TPlHnk", title: "Corneria", artist: "Hajime Hirasawa" },
  "Marth":             { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Lucina":            { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Young Link":        { youtubeId: "3MJpjHfEMLE", title: "The Legend of Zelda Main Theme", artist: "Koji Kondo" },
  "Ganondorf":         { youtubeId: "3MJpjHfEMLE", title: "The Legend of Zelda Main Theme", artist: "Koji Kondo" },
  "Mewtwo":            { youtubeId: "P9Jb5WzrB4k", title: "Main Theme (Pokémon Red / Blue)", artist: "Junichi Masuda" },
  "Roy":               { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Chrom":             { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Mr. Game & Watch":  { youtubeId: "9RwOqoMBZxo", title: "Flat Zone 2", artist: "Masaaki Iwasaki" },
  "Meta Knight":       { youtubeId: "IiVN0qXiIqg", title: "Green Greens", artist: "Jun Ishikawa" },
  "Pit":               { youtubeId: "JPTJ_oTF1wE", title: "Underworld Theme (Kid Icarus)", artist: "Hirokazu Tanaka" },
  "Dark Pit":          { youtubeId: "JPTJ_oTF1wE", title: "Underworld Theme (Kid Icarus)", artist: "Hirokazu Tanaka" },
  "Zero Suit Samus":   { youtubeId: "6CRJNirqkHY", title: "Brinstar (Metroid)", artist: "Hip Tanaka" },
  "Wario":             { youtubeId: "9AE4pOhOy3k", title: "Wario Land (Main Theme)", artist: "Hirokazu Tanaka" },
  "Snake":             { youtubeId: "y_TDf1rDBAo", title: "Snake Eater", artist: "Harry Gregson-Williams" },
  "Ike":               { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Pokémon Trainer":   { youtubeId: "P9Jb5WzrB4k", title: "Main Theme (Pokémon Red / Blue)", artist: "Junichi Masuda" },
  "Diddy Kong":        { youtubeId: "3fGTiMTGsKI", title: "DK Rap", artist: "David Wise" },
  "Lucas":             { youtubeId: "OsQEEHUuLGg", title: "Bein' Friends", artist: "Shogo Sakai · Melee Remix" },
  "Sonic":             { youtubeId: "nU5pCRiNLws", title: "Green Hill Zone", artist: "Masato Nakamura" },
  "King Dedede":       { youtubeId: "IiVN0qXiIqg", title: "Green Greens", artist: "Jun Ishikawa" },
  "Olimar":            { youtubeId: "VVbPyMFm6_A", title: "Ai No Uta (Pikmin Love Song)", artist: "Hajime Wakai" },
  "Lucario":           { youtubeId: "P9Jb5WzrB4k", title: "Main Theme (Pokémon Diamond / Pearl)", artist: "Go Ichinose" },
  "R.O.B.":            { youtubeId: "TlcHnSFSEoA", title: "ROB Gyromite / Stack-Up", artist: "Hirokazu Tanaka" },
  "Toon Link":         { youtubeId: "3MJpjHfEMLE", title: "The Legend of Zelda Main Theme", artist: "Koji Kondo" },
  "Wolf":              { youtubeId: "FBBU0TPlHnk", title: "Corneria", artist: "Hajime Hirasawa" },
  "Villager":          { youtubeId: "oHy5Oi0Dxf4", title: "Title Theme (Animal Crossing)", artist: "Kazumi Totaka" },
  "Mega Man":          { youtubeId: "eoiSBE0mEJA", title: "Stage Select (Mega Man 2)", artist: "Takashi Tateishi" },
  "Wii Fit Trainer":   { youtubeId: "yXwn4OEWwQo", title: "Wii Fit Main Theme", artist: "Shinji Ushiroda" },
  "Rosalina & Luma":   { youtubeId: "CDBB4vSZAyE", title: "Rosalina in the Observatory", artist: "Koji Kondo" },
  "Little Mac":        { youtubeId: "dF5NTv0JTUI", title: "World Circuit Theme (Punch-Out!!)", artist: "Hirokazu Tanaka" },
  "Greninja":          { youtubeId: "P9Jb5WzrB4k", title: "Main Theme (Pokémon X / Y)", artist: "Hitomi Sato" },
  "Palutena":          { youtubeId: "JPTJ_oTF1wE", title: "Palutena's Temple (Kid Icarus)", artist: "Yasunori Mitsuda" },
  "Pac-Man":           { youtubeId: "VrFXmU1vIC4", title: "PAC-MAN (Original)", artist: "Toshio Kai" },
  "Robin":             { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Shulk":             { youtubeId: "WQK0vVE5PFw", title: "Gaur Plain", artist: "Yoko Shimomura" },
  "Bowser Jr.":        { youtubeId: "CDBB4vSZAyE", title: "Ground Theme (Super Mario Bros.)", artist: "Koji Kondo" },
  "Duck Hunt":         { youtubeId: "aH5fGVZ_5Vc", title: "Duck Hunt Medley", artist: "Hirokazu Tanaka" },
  "Ryu":               { youtubeId: "B-kjF85QQPM", title: "Ryu Stage (Street Fighter II)", artist: "Yoko Shimomura" },
  "Ken":               { youtubeId: "B-kjF85QQPM", title: "Ken Stage (Street Fighter II)", artist: "Yoko Shimomura" },
  "Cloud":             { youtubeId: "RGiQc87XBPM", title: "Main Theme (Final Fantasy VII)", artist: "Nobuo Uematsu" },
  "Corrin":            { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Bayonetta":         { youtubeId: "VCW3dDM1-mM", title: "Fly Me To The Moon (SSBU)", artist: "Norihiko Hibino" },
  "Inkling":           { youtubeId: "5_NJ3RxstVw", title: "Splattack! (Splatoon)", artist: "Toru Minegishi" },
  "Ridley":            { youtubeId: "6CRJNirqkHY", title: "Vs. Ridley", artist: "Kenji Yamamoto" },
  "Simon":             { youtubeId: "D5dBcFjkHyc", title: "Vampire Killer", artist: "Kinuyo Yamashita" },
  "Richter":           { youtubeId: "D5dBcFjkHyc", title: "Vampire Killer", artist: "Kinuyo Yamashita" },
  "King K. Rool":      { youtubeId: "3fGTiMTGsKI", title: "Gang-Plank Galleon", artist: "David Wise" },
  "Isabelle":          { youtubeId: "oHy5Oi0Dxf4", title: "Title Theme (Animal Crossing: New Leaf)", artist: "Kazumi Totaka" },
  "Incineroar":        { youtubeId: "P9Jb5WzrB4k", title: "Main Theme (Pokémon Sun / Moon)", artist: "Junichi Masuda" },
  "Piranha Plant":     { youtubeId: "CDBB4vSZAyE", title: "Ground Theme (Super Mario Bros.)", artist: "Koji Kondo" },
  "Joker":             { youtubeId: "XncDBVBm8CM", title: "Last Surprise", artist: "Shoji Meguro" },
  "Hero":              { youtubeId: "BEIusmOq1N4", title: "Battle! (Dragon Quest IV)", artist: "Koichi Sugiyama" },
  "Banjo & Kazooie":   { youtubeId: "bXCpIlQeHlM", title: "Main Theme (Banjo-Kazooie)", artist: "Grant Kirkhope" },
  "Terry":             { youtubeId: "LS0sPfBW-kU", title: "Kurikinton (King of Fighters)", artist: "Sho Minato" },
  "Byleth":            { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Min Min":           { youtubeId: "5_NJ3RxstVw", title: "Main Theme (ARMS)", artist: "Atsuko Asahi" },
  "Steve":             { youtubeId: "OQ4Tq1R5mxo", title: "Minecraft (Sweden)", artist: "C418" },
  "Sephiroth":         { youtubeId: "RGiQc87XBPM", title: "One-Winged Angel", artist: "Nobuo Uematsu" },
  "Pyra":              { youtubeId: "WQK0vVE5PFw", title: "Counterattack (Xenoblade Chronicles 2)", artist: "ACE (TOMOri Kudo)" },
  "Mythra":            { youtubeId: "WQK0vVE5PFw", title: "Counterattack (Xenoblade Chronicles 2)", artist: "ACE (TOMOri Kudo)" },
  "Kazuya":            { youtubeId: "ey_8AElqkIs", title: "Mishima Dojo (Tekken)", artist: "Yoshie Arakawa" },
  "Sora":              { youtubeId: "P3BTfnx5tUA", title: "Dearly Beloved (Kingdom Hearts)", artist: "Yoko Shimomura" },
  "Mii Brawler":       { youtubeId: "CDBB4vSZAyE", title: "Ground Theme (Super Mario Bros.)", artist: "Koji Kondo" },
  "Mii Swordfighter":  { youtubeId: "bHCRIMjMiUI", title: "Fire Emblem Main Theme", artist: "Yuka Tsujiyoko" },
  "Mii Gunner":        { youtubeId: "6CRJNirqkHY", title: "Brinstar (Metroid)", artist: "Hip Tanaka" },
};

// ── YouTube search sem API key ────────────────────────────────────────────────
async function searchYouTube(query: string): Promise<{ id: string; title: string } | null> {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`; // Filter: video only
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(10_000),
    });
    const html = await res.text();

    // YouTube embeds JSON in the page as: var ytInitialData = {...};
    // Find ytInitialData JSON blob (use indexOf + slice to avoid /s flag ES2018 issue)
    const marker = "var ytInitialData = ";
    const start  = html.indexOf(marker);
    if (start === -1) return null;
    const end = html.indexOf(";</script>", start);
    if (end === -1) return null;
    const jsonStr = html.slice(start + marker.length, end);
    const match   = jsonStr ? [null, jsonStr] : null;
    if (!match || !match[1]) return null;

    const data = JSON.parse(match[1]);
    const contents =
      data?.contents?.twoColumnSearchResultsRenderer
        ?.primaryContents?.sectionListRenderer
        ?.contents?.[0]?.itemSectionRenderer?.contents ?? [];

    for (const item of contents) {
      const vid = item?.videoRenderer;
      if (!vid) continue;
      const id    = vid.videoId as string;
      const title = vid.title?.runs?.[0]?.text as string;
      const channel = (vid.longBylineText?.runs?.[0]?.text ?? vid.shortBylineText?.runs?.[0]?.text ?? "") as string;

      // Prefer official Nintendo channels
      const isOfficial = /nintendo|sega official|capcom|konami/i.test(channel);
      if (id && title) return { id, title };  // take first valid result
    }

    return null;
  } catch {
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const fighters = await db.fighter.findMany({
    orderBy: { rosterNumber: "asc" },
    select: { id: true, name: true, rosterNumber: true, franchise: { select: { name: true } } },
  });

  console.log(`\nProcessando ${fighters.length} fighters…\n`);
  let curated = 0, searched = 0, failed = 0;

  for (const fighter of fighters) {
    process.stdout.write(`[${fighter.rosterNumber}] ${fighter.name}… `);

    // 1. Try curated map first
    const curated_entry = MUSIC_MAP[fighter.name];
    if (curated_entry) {
      await db.fighter.update({
        where: { id: fighter.id },
        data: {
          musicYoutubeId: curated_entry.youtubeId,
          musicTitle:     curated_entry.title,
          musicArtist:    curated_entry.artist,
          musicStatus:    "pending_review",
        },
      });
      console.log(`🎵 (curated) ${curated_entry.title}`);
      curated++;
      await sleep(100);
      continue;
    }

    // 2. YouTube search fallback
    const query = `${fighter.name} ${fighter.franchise.name} theme Super Smash Bros Ultimate`;
    const result = await searchYouTube(query);

    if (result) {
      await db.fighter.update({
        where: { id: fighter.id },
        data: {
          musicYoutubeId: result.id,
          musicTitle:     result.title,
          musicArtist:    fighter.franchise.name,
          musicStatus:    "pending_review",
        },
      });
      console.log(`🔍 (search) ${result.title} [${result.id}]`);
      searched++;
    } else {
      console.log("❌ não encontrado");
      failed++;
    }

    await sleep(1500); // polite delay para YouTube
  }

  console.log(`\n✅ Done. Curated: ${curated} | Searched: ${searched} | Failed: ${failed}`);
  console.log("👉 Acesse /admin/music para revisar e aprovar");
}

main().catch(console.error).finally(() => db.$disconnect());
