import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import { politeDelay } from "./utils";

const db = new PrismaClient();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateCuratorNote(fighterName: string, franchise: string): Promise<{ en: string, pt: string, jp: string }> {
  const prompt = `Write a museum curator note for the character "${fighterName}" from the franchise "${franchise}", in the context of their inclusion in Super Smash Bros.

The tone should be passionate, respectful, and slightly nostalgic (like an art museum curator presenting a beloved piece). Focus on their legacy, playstyle essence, or what makes them special.
Keep each version strictly under 50 words!

Return ONLY a JSON object with three keys:
- "en": English text
- "pt": Brazilian Portuguese translation
- "jp": Japanese text written in natural museum placard style (自然な日本語の学芸員コメント) — evocative and authentic, as if written for a Japanese audience

No markdown formatting around the JSON.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: "text"; text: string }).text.trim();
  const json = raw.startsWith("```")
    ? raw.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "")
    : raw;

  return JSON.parse(json);
}

async function main() {
  console.log("Starting Curator Note Generation for all fighters...");

  const fighters = await db.fighter.findMany({
    where: { OR: [{ curatorOverviewEn: null }, { curatorOverviewJp: null }] },
    include: { franchise: true },
    orderBy: { rosterNumber: 'asc' }
  });

  console.log(`Found ${fighters.length} fighters without curator notes.`);

  for (const f of fighters) {
    try {
      console.log(`Generating notes for ${f.name}...`);
      const notes = await generateCuratorNote(f.name, f.franchise.name);
      
      await db.fighter.update({
        where: { id: f.id },
        data: {
          curatorOverviewEn: notes.en,
          curatorOverviewPt: notes.pt,
          curatorOverviewJp: notes.jp,
        }
      });
      
      console.log(`✅ Saved: ${f.name}`);
      await politeDelay(1000); // 1 second delay to avoid rate limit
    } catch (err) {
      console.error(`❌ Failed for ${f.name}:`, err);
    }
  }

  console.log("🎉 Curator note generation completed!");
}

main().catch(console.error).finally(() => db.$disconnect());
