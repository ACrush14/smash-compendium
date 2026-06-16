require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const ssb64Roster = [
  { name: "Mario", jpName: "マリオ" },
  { name: "Donkey Kong", jpName: "ドンキーコング" },
  { name: "Link", jpName: "リンク" },
  { name: "Samus", jpName: "サムス" },
  { name: "Yoshi", jpName: "ヨッシー" },
  { name: "Kirby", jpName: "カービィ" },
  { name: "Fox", jpName: "フォックス" },
  { name: "Pikachu", jpName: "ピカチュウ" },
  { name: "Luigi", jpName: "ルイージ" },
  { name: "Captain Falcon", jpName: "キャプテン・ファルコン" },
  { name: "Ness", jpName: "ネス" },
  { name: "Jigglypuff", jpName: "プリン" },
];

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
  try {
    const url = `${wikiUrl}/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&format=json`;
    const res = await fetch(url);
    const json = await res.json();
    return json?.parse?.wikitext?.["*"] || "";
  } catch (e) {
    return "";
  }
}

async function main() {
  console.log("Fetching global profiles for SSB64...");
  const profilesText = await fetchWikiText("List_of_character_profiles");

  for (const f of ssb64Roster) {
    console.log(`Processing ${f.name}...`);
    const fighter = await db.fighter.findUnique({ where: { name: f.name } });
    if (!fighter) {
      console.log(`Fighter ${f.name} not found in DB!`);
      continue;
    }

    // 1. Fetch N64 EN Bio
    const regexEn = new RegExp(`==\\{\\{SSB\\|${f.name.replace(/ /g, "[ _]")}\\}\\}.*?\\n(.*?)(?=\\n===Works|\\n==\\{\\{SSB)`, "is");
    const matchEn = profilesText.match(regexEn);
    let bioEn = matchEn ? matchEn[1].trim() : "";
    if (!bioEn) {
      console.log(`Could not parse EN Bio for ${f.name}`);
    } else {
      const bioPt = await translateText(bioEn, 'en', 'pt');

      // 2. Fetch N64 JP Bio (from JP SmashWiki)
      const jpText = await fetchWikiText(f.jpName, "https://smashwiki.info");
      let bioJp = "";
      const matchJp = jpText.match(/==\\s*ゲーム中の解説\\s*==\\n====.*?スマブラ64.*?\\n.*?紹介画面.*?'''\\n(.*?)(?=\\n====|\\n===|\\n==)/is);
      if (matchJp) {
        bioJp = matchJp[1].replace(/<br>/gi, "\\n").trim();
      } else {
        const matchFallback = jpText.match(/==\\s*概要\\s*==\\n(.*?)(?=\\n==)/is);
        bioJp = matchFallback ? matchFallback[1].replace(/<br>/gi, "\\n").trim() : "NOT FOUND";
      }

      const bioJpEn = await translateText(bioJp, 'ja', 'en');

      await db.fighterBio.upsert({
        where: { fighterId_smashGameVersion: { fighterId: fighter.id, smashGameVersion: "SSB64" } },
        update: { contentEn: bioEn, contentPt: bioPt, contentJp: bioJp, contentJpEn: bioJpEn },
        create: { fighterId: fighter.id, smashGameVersion: "SSB64", contentEn: bioEn, contentPt: bioPt, contentJp: bioJp, contentJpEn: bioJpEn }
      });
      console.log(`Saved SSB64 Bio for ${f.name}!`);
    }
    await new Promise(r => setTimeout(r, 1500));
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
