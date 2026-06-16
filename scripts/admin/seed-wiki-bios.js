require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function translateText(text, sl = 'auto', tl = 'pt') {
  if (!text || text.trim() === '') return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json && json[0]) {
      return json[0].map(x => x[0]).join('');
    }
    return text;
  } catch (e) {
    console.error("Translation error:", e);
    return text;
  }
}

async function fetchWikiText(pageTitle, wikiUrl = "https://www.ssbwiki.com") {
  const url = `${wikiUrl}/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&format=json`;
  const res = await fetch(url);
  const json = await res.json();
  return json?.parse?.wikitext?.["*"] || "";
}

async function scrapeMario() {
  console.log("Scraping Mario...");

  // 1. Fetch N64 Profile (English)
  const profilesText = await fetchWikiText("List_of_character_profiles");
  const marioN64Match = profilesText.match(/==\{\{SSB\|Mario\}\}==\n(.*?)(?=\n===Works)/is);
  const bioN64En = marioN64Match ? marioN64Match[1].trim() : "";
  console.log("N64 EN:", bioN64En.slice(0, 50) + "...");

  const bioN64Pt = await translateText(bioN64En, 'en', 'pt');
  
  // 2. Fetch Japanese N64 Bio from smashwiki.info
  const jpText = await fetchWikiText("マリオ_(初代)", "https://smashwiki.info");
  const jpBioMatch = jpText.match(/==\s*キャラクター解説\s*==\n(.*?)(?=\n==)/is);
  const bioN64Jp = jpBioMatch ? jpBioMatch[1].replace(/<br>/gi, "\n").trim() : "NOT FOUND";
  console.log("N64 JP:", bioN64Jp.slice(0, 50) + "...");

  const bioN64JpEn = await translateText(bioN64Jp, 'ja', 'en');

  // 3. Save to DB
  const mario = await db.fighter.findUnique({ where: { name: "Mario" } });
  if (mario) {
    await db.fighterBio.upsert({
      where: { fighterId_smashGameVersion: { fighterId: mario.id, smashGameVersion: "SSB64" } },
      update: { contentEn: bioN64En, contentPt: bioN64Pt, contentJp: bioN64Jp, contentJpEn: bioN64JpEn },
      create: { fighterId: mario.id, smashGameVersion: "SSB64", contentEn: bioN64En, contentPt: bioN64Pt, contentJp: bioN64Jp, contentJpEn: bioN64JpEn }
    });
    console.log("Saved SSB64 Bio for Mario.");
  }
}

scrapeMario().then(() => {
  console.log("Done");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
