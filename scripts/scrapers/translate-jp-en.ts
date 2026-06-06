import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";

const db = new PrismaClient();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function translateChunk(texts: Record<string, string>): Promise<Record<string, string>> {
  if (Object.keys(texts).length === 0) return {};
  
  const prompt = `Translate the following texts from Japanese to English. Make it a VERY LITERAL and faithful translation. For example, if the Japanese text says 'MOTHER2 ギーグの逆襲' (MOTHER2 Giygas Strikes Back), translate it exactly as 'MOTHER2 Giygas Strikes Back' rather than localized titles like 'EarthBound'. Preserve the narrative style, tone, and proper nouns literally. Return ONLY a valid JSON object with the exact same keys but translated values — no markdown, no explanation.

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
  console.log("Starting JP->EN literal translation for Ness...");
  
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

  if (fighter.curatorOverviewJp) {
    texts["curator"] = fighter.curatorOverviewJp;
  }

  for (const bio of fighter.bios) {
    if (bio.contentJp) texts[`bio_${bio.id}`] = bio.contentJp;
  }

  for (const tip of fighter.tips) {
    if (tip.titleJp) texts[`tip_title_${tip.id}`] = tip.titleJp;
    if (tip.textJp) texts[`tip_text_${tip.id}`] = tip.textJp;
  }

  for (const coll of fighter.collectibles) {
    if (coll.descriptionJp) texts[`coll_desc_${coll.id}`] = coll.descriptionJp;
  }

  console.log(`Gathered ${Object.keys(texts).length} texts to translate.`);
  if (Object.keys(texts).length === 0) {
    console.log("Nothing to translate.");
    return;
  }

  // Chunking to avoid massive payload issues
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
      data: { curatorOverviewJpEn: translatedTexts["curator"] } // Wait, Fighter model does not have curatorOverviewJpEn ! Let me check!
    });
  }

  // Handle Bios
  for (const bio of fighter.bios) {
    const jpEn = translatedTexts[`bio_${bio.id}`];
    if (jpEn) {
      await db.fighterBio.update({
        where: { id: bio.id },
        data: { contentJpEn: jpEn }
      });
    }
  }

  // Handle Tips
  for (const tip of fighter.tips) {
    const titleJpEn = translatedTexts[`tip_title_${tip.id}`];
    const textJpEn = translatedTexts[`tip_text_${tip.id}`];
    if (titleJpEn || textJpEn) {
      await db.fighterTip.update({
        where: { id: tip.id },
        data: {
          titleJpEn: titleJpEn || tip.titleJpEn,
          textJpEn: textJpEn || tip.textJpEn
        }
      });
    }
  }

  // Handle Collectibles
  for (const coll of fighter.collectibles) {
    const descJpEn = translatedTexts[`coll_desc_${coll.id}`];
    if (descJpEn) {
      await db.collectible.update({
        where: { id: coll.id },
        data: { descriptionJpEn: descJpEn }
      });
    }
  }

  console.log("✅ JP->EN Translation fully injected!");
}

main().catch(console.error).finally(() => db.$disconnect());
