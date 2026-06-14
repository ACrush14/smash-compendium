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

  let count = 0;

  for (const t of trophies) {
    if (!t.sourceGame) continue;

    // Ignora os troféus SMASH de Melee (002 a 078)
    if (t.smashGameVersion === "SSBM" && t.posicaoTrofeuMelee && t.posicaoTrofeuMelee >= 2 && t.posicaoTrofeuMelee <= 78 && t.sourceGame === "SMASH") {
      continue;
    }

    let newGame = t.sourceGame;

    // Normaliza nomes base
    newGame = newGame.replace(/Super Smash Bros\. Melee\s*(12\/01)?/gi, "Super Smash Bros. Melee (GCN)");
    newGame = newGame.replace(/Super Smash Bros\. Brawl/gi, "Super Smash Bros. Brawl (Wii)");
    // Só substitui "Super Smash Bros." puro se não for Melee, Brawl ou for (Wii U/3DS)
    newGame = newGame.replace(/Super Smash Bros\.(?!\s*(Melee|Brawl|for))\s*(4\/99)?/gi, "Super Smash Bros. (N64)");
    
    // Limpa espaços extras ao redor da barra
    newGame = newGame.replace(/\/\s*Super Smash Bros\. (N64|Melee \(GCN\)|Brawl \(Wii\))/gi, "/ Super Smash Bros. $1");

    if (newGame !== t.sourceGame) {
      await prisma.collectible.update({
        where: { id: t.id },
        data: { sourceGame: newGame }
      });
      count++;
    }
  }

  console.log(`\n✅ ${count} origens de Smash padronizadas no banco!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
