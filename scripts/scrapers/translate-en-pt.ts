import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";

const db = new PrismaClient();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function translateChunk(texts: Record<string, string>): Promise<Record<string, string>> {
  if (Object.keys(texts).length === 0) return {};
  
  const prompt = `Translate the following texts from English to Brazilian Portuguese (PT-BR). Preserve the narrative style, tone, and any proper nouns (character names, game titles, move names). Return ONLY a valid JSON object with the exact same keys but translated values — no markdown, no explanation.

${JSON.stringify(texts, null, 2)}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: "text"; text: string }).text.trim();
  const json = raw.startsWith("\`\`\`")
    ? raw.replace(/^\`\`\`[a-z]*\n?/, "").replace(/\n?\`\`\`$/, "")
    : raw;

  return JSON.parse(json);
}

async function main() {
  console.log("Starting EN->PT translation for Ness...");
  
  const fighter = await db.fighter.findUnique({
    where: { name: "Ness" },
    include: {
      bios: true,
      tips: true,
      collectibles: true
    }
  });

  if (!fighter) throw new Error("Fighter not found");

  const texts: Record<string, string> = {};

  if (fighter.curatorOverviewEn) {
    texts["curator"] = fighter.curatorOverviewEn;
  }

  for (const bio of fighter.bios) {
    if (bio.contentEn) texts[`bio_${bio.id}`] = bio.contentEn;
  }

  for (const tip of fighter.tips) {
    if (tip.titleEn) texts[`tip_title_${tip.id}`] = tip.titleEn;
    if (tip.textEn) texts[`tip_text_${tip.id}`] = tip.textEn;
  }

  for (const coll of fighter.collectibles) {
    if (coll.descriptionEn) texts[`coll_desc_${coll.id}`] = coll.descriptionEn;
    if (coll.name) texts[`coll_name_${coll.id}`] = coll.name; // Translating collectible names too? Actually, PT names might just be the English ones if we don't have PT names. But let's translate them to see if it makes sense (e.g. Smash Attack -> Ataque Smash)
  }

  console.log(`Gathered ${Object.keys(texts).length} texts to translate.`);
  if (Object.keys(texts).length === 0) {
    console.log("Nothing to translate.");
    return;
  }

  const entries = Object.entries(texts);
  const CHUNK_SIZE = 20;
  const translatedTexts: Record<string, string> = {};

  for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
    console.log(`Translating chunk ${i / CHUNK_SIZE + 1} of ${Math.ceil(entries.length / CHUNK_SIZE)}...`);
    const chunk = Object.fromEntries(entries.slice(i, i + CHUNK_SIZE));
    const result = await translateChunk(chunk);
    Object.assign(translatedTexts, result);
  }

  console.log("Translations completed. Saving to database...");

  if (translatedTexts["curator"]) {
    await db.fighter.update({
      where: { id: fighter.id },
      data: { curatorOverviewPt: translatedTexts["curator"] }
    });
  }

  for (const bio of fighter.bios) {
    const pt = translatedTexts[`bio_${bio.id}`];
    if (pt) {
      await db.fighterBio.update({
        where: { id: bio.id },
        data: { contentPt: pt }
      });
    }
  }

  for (const tip of fighter.tips) {
    const titlePt = translatedTexts[`tip_title_${tip.id}`];
    const textPt = translatedTexts[`tip_text_${tip.id}`];
    if (titlePt || textPt) {
      await db.fighterTip.update({
        where: { id: tip.id },
        data: {
          titlePt: titlePt || tip.titlePt,
          textPt: textPt || tip.textPt
        }
      });
    }
  }

  for (const coll of fighter.collectibles) {
    const descPt = translatedTexts[`coll_desc_${coll.id}`];
    // Collectible name doesn't have namePt! Let's ignore translating name for PT, it's not strictly necessary. Let's not save `coll_name` to db since there is no `namePt` column.
    if (descPt) {
      await db.collectible.update({
        where: { id: coll.id },
        data: { descriptionPt: descPt }
      });
    }
  }

  console.log("✅ EN->PT Translation fully injected!");
}

main().catch(console.error).finally(() => db.$disconnect());
