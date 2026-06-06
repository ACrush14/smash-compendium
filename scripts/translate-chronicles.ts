import { db } from "../lib/db";

async function translateText(text: string, toLang: "en" | "pt"): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json[0][0][0];
  } catch (err) {
    return null;
  }
}

async function run() {
  console.log("Fetching JP EXCLUSIVE games...");
  const games = await db.chronicleEntry.findMany({
    where: { titleNtsc: "JP EXCLUSIVE", titleJp: { not: null } }
  });

  console.log(`Found ${games.length} JP EXCLUSIVE games to translate.`);

  let successCount = 0;

  for (const game of games) {
    if (!game.titleJp) continue;

    // Skip if already translated
    if (game.titleJpEn && game.titleJpPt) continue;

    console.log(`Translating: ${game.titleJp}`);
    
    // Delay slightly to avoid rate limit
    await new Promise(r => setTimeout(r, 500));

    const en = await translateText(game.titleJp, "en");
    const pt = await translateText(game.titleJp, "pt");

    if (en && pt) {
      await db.chronicleEntry.update({
        where: { id: game.id },
        data: { titleJpEn: en, titleJpPt: pt }
      });
      console.log(`  -> EN: ${en} | PT: ${pt}`);
      successCount++;
    } else {
      console.log(`  -> Failed to translate.`);
    }
  }

  console.log(`Finished! Translated ${successCount} games.`);
}

run();
