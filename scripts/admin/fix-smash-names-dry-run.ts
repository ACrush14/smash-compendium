import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const trophies = await prisma.collectible.findMany({
    where: { 
      type: "TROPHY",
      sourceGame: { contains: "Smash", mode: "insensitive" }
    },
    select: { id: true, name: true, sourceGame: true, smashGameVersion: true, posicaoTrofeuMelee: true }
  });

  const updates: { id: string, name: string, oldGame: string, newGame: string, version: string }[] = [];

  for (const t of trophies) {
    if (!t.sourceGame) continue;

    // Rule 1: Ignore Melee SMASH (moves) trophies (002 to 078)
    if (t.smashGameVersion === "SSBM" && t.posicaoTrofeuMelee && t.posicaoTrofeuMelee >= 2 && t.posicaoTrofeuMelee <= 78 && t.sourceGame === "SMASH") {
      continue;
    }

    let newGame = t.sourceGame;

    // Replace old "Smash" references with correct standard names
    newGame = newGame.replace(/Super Smash Bros\. Melee\s*(12\/01)?/gi, "Super Smash Bros. Melee (GCN)");
    newGame = newGame.replace(/Super Smash Bros\. Brawl/gi, "Super Smash Bros. Brawl (Wii)");
    // Only match 'Super Smash Bros.' if it's NOT followed by Melee, Brawl, or 'for' (Wii U/3DS)
    newGame = newGame.replace(/Super Smash Bros\.(?!\s*(Melee|Brawl|for))\s*(4\/99)?/gi, "Super Smash Bros. (N64)");
    
    // Clean up extra spaces/slashes
    newGame = newGame.replace(/\/\s*Super Smash Bros\. (N64|Melee \(GCN\)|Brawl \(Wii\))/gi, "/ Super Smash Bros. $1");

    // Fix the "SMASH" mistakenly assigned to non-moves
    if (newGame === "SMASH") {
      if (t.smashGameVersion === "SSBM") {
        newGame = "Super Smash Bros. (N64)"; // User's specific rule for Melee trophies with 'Smash'
      } else {
        // For SSBB and SSB4, SMASH was a parser error for missing <img> tags. Best to null it so it's not fake data.
        newGame = "??? (Necessita ajuste manual ou null)";
      }
    }

    if (newGame !== t.sourceGame) {
      updates.push({
        id: t.id,
        name: t.name,
        version: t.smashGameVersion,
        oldGame: t.sourceGame,
        newGame: newGame
      });
    }
  }

  console.log(`\n=== DRY RUN RESULT: ${updates.length} trophies to update ===\n`);
  for (const u of updates.slice(0, 50)) {
    console.log(`[${u.version}] ${u.name} \n   DE:   ${u.oldGame} \n   PARA: ${u.newGame}\n`);
  }
  if (updates.length > 50) {
    console.log(`...and ${updates.length - 50} more.`);
  }

}

main().catch(console.error).finally(() => prisma.$disconnect());
