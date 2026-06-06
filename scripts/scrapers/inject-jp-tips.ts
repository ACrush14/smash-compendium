import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";

const db = new PrismaClient();

async function main() {
  const url = "https://wikiwiki.jp/ssbswitch/%E3%82%B9%E3%83%9E%E3%81%A1%E3%81%97%E3%81%8D/%E3%83%95%E3%82%A1%E3%82%A4%E3%82%BF%E3%83%BC";
  console.log("Fetching: " + url);
  const html = await fetch(url).then((res) => res.text());
  const $ = cheerio.load(html);

  // Encontrar o <h3> que contém "ネス"
  const headings = $("h3");
  let nessHeading = null;
  headings.each((i, el) => {
    if ($(el).text().includes("10.ネス")) {
      nessHeading = el;
    }
  });

  if (!nessHeading) {
    console.error("Ness heading not found");
    return;
  }

  const tips: { titleJp: string; textJp: string }[] = [];

  let curr = $(nessHeading).next();
  while (curr.length > 0) {
    if (curr[0]?.name === "h3") break; // Parar no próximo lutador

    if (curr[0]?.name === "dl" && curr.hasClass("list1")) {
      const titleJp = curr.find("dt").text().trim();
      const textJp = curr.find("dd").text().trim();
      if (titleJp && textJp) {
        tips.push({ titleJp, textJp });
      }
    }
    curr = curr.next();
  }

  console.log(`Found ${tips.length} JP tips for Ness`);

  // Pegar os tips em inglês do banco (ordenados)
  const fighter = await db.fighter.findUnique({ where: { name: "Ness" } });
  if (!fighter) { console.error("Ness not found in DB"); return; }

  const dbTips = await db.fighterTip.findMany({
    where: { fighterId: fighter.id },
    orderBy: { id: "asc" } // assumindo que a ordem no banco bate com a ordem natural
  });

  // Sabemos que Ness tem 5 tips lore no banco (Origins, Series, Homesick, Sister, PSI)
  // E no wiki, os primeiros 5 são exatamente esses.
  for (let i = 0; i < Math.min(dbTips.length, tips.length); i++) {
    const dbTip = dbTips[i];
    const jpTip = tips[i];
    if (!dbTip || !jpTip) continue;

    console.log(`Updating Tip [${dbTip.titleEn}] -> JP: [${jpTip.titleJp}]`);
    await db.fighterTip.update({
      where: { id: dbTip.id },
      data: {
        titleJp: jpTip.titleJp,
        textJp: jpTip.textJp
      }
    });
  }

  console.log("✅ All JP tips injected!");
}

main().catch(console.error).finally(() => db.$disconnect());
