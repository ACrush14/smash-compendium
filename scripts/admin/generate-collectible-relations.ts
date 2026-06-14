import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function getWords(name: string) {
  // Normalize and split into words, ignoring small or common words
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .split(" ")
    .filter(w => w.length > 2 && w !== "the" && w !== "and" && w !== "for");
}

async function main() {
  console.log("Loading collectibles...");
  const items = await db.collectible.findMany({
    select: { id: true, name: true, type: true, smashGameVersion: true, franchiseId: true }
  });

  console.log(`Loaded ${items.length} items. Calculating scores...`);

  const itemWords = items.map(item => ({
    ...item,
    words: getWords(item.name),
    exactName: item.name.toLowerCase().trim()
  }));

  type RelationInsert = { fromId: string; toId: string; relationType: string; score: number };
  const allRelations: RelationInsert[] = [];

  for (let i = 0; i < itemWords.length; i++) {
    const c1 = itemWords[i]!;
    const scored: { toId: string; score: number }[] = [];

    for (let j = 0; j < itemWords.length; j++) {
      if (i === j) continue;
      const c2 = itemWords[j]!;
      let score = 0;

      const sameFranchise = c1.franchiseId === c2.franchiseId && c1.franchiseId != null;
      const bothSmash = c1.franchiseId == null && c2.franchiseId == null;
      const isRelatedFranchise = sameFranchise || bothSmash;

      const exact = c1.exactName === c2.exactName;
      
      if (exact) {
        score = isRelatedFranchise ? 100 : 80;
      } else if (isRelatedFranchise) {
        const c1InC2 = c1.exactName.includes(c2.exactName) && c2.exactName.length > 3;
        const c2InC1 = c2.exactName.includes(c1.exactName) && c1.exactName.length > 3;
        
        if (c1InC2 || c2InC1) {
          score = 50;
        } else {
          let intersectCount = 0;
          for (const w of c1.words) {
            if (c2.words.includes(w)) intersectCount++;
          }
          if (intersectCount > 0) {
            score = 10 * intersectCount;
          }
        }
      }

      // Bonus to prefer different types or games to show variety among equal name matches
      if (score > 0) {
        if (c1.type !== c2.type) score += 5; 
        if (c1.smashGameVersion !== c2.smashGameVersion) score += 5;
      }

      if (score > 0) {
        scored.push({ toId: c2.id, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    // Limit to 8 associations
    const top8 = scored.slice(0, 8);
    for (const s of top8) {
      allRelations.push({ fromId: c1.id, toId: s.toId, relationType: "cross_game", score: s.score });
    }
  }

  console.log(`Generated ${allRelations.length} potential relations. Clearing old relations...`);
  await db.collectibleRelation.deleteMany({ where: { relationType: "cross_game" } });

  console.log(`Inserting new relations in batches...`);
  const CHUNK = 5000;
  for (let i = 0; i < allRelations.length; i += CHUNK) {
    const chunk = allRelations.slice(i, i + CHUNK).map(r => ({ fromId: r.fromId, toId: r.toId, relationType: r.relationType }));
    await db.collectibleRelation.createMany({
      data: chunk,
      skipDuplicates: true
    });
    console.log(`Inserted chunk ${i / CHUNK + 1}`);
  }

  console.log("Done!");
}

main().catch(console.error).finally(() => db.$disconnect());
