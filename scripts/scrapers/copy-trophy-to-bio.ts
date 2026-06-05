import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fighter = await prisma.fighter.findUnique({ where: { name: "Ness" } });
  if (!fighter) { console.error("Fighter not found"); return; }

  const eras = ["SSBM", "SSBB", "SSB4"];
  for (const era of eras) {
    // Pegar o troféu principal que contém a bio
    const trophy = await prisma.collectible.findFirst({
      where: {
        fighterId: fighter.id,
        smashGameVersion: era,
        type: "TROPHY",
        name: "Ness" // O troféu primário se chama Ness
      }
    });

    if (trophy && trophy.descriptionJp) {
      await prisma.fighterBio.updateMany({
        where: { fighterId: fighter.id, smashGameVersion: era },
        data: { contentJp: trophy.descriptionJp }
      });
      console.log(`✅ Bio ${era} atualizada com o texto do troféu.`);
    } else {
      console.log(`⚠️ Troféu principal de ${era} não encontrado ou sem descrição JP.`);
    }
  }

  // Para SSBU, o texto oficial do site japonês:
  const ssbuBio = "超能力“PSI”とバットやヨーヨーを駆使して戦う少年。飛び道具の「PKサンダー」を自分にぶつけて、その勢いで相手に体当たりする復帰ワザ「PKサンダー体当たり」は超強力！";
  await prisma.fighterBio.updateMany({
    where: { fighterId: fighter.id, smashGameVersion: "SSBU" },
    data: { contentJp: ssbuBio }
  });
  console.log(`✅ Bio SSBU atualizada com o texto do site oficial.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
