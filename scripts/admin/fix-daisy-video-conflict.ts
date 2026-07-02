import { db } from "../../lib/db";

// Bug: "Daisy (Tennis Outfit)" (posicaoTrofeuSsb4=147) ordena ANTES de "Daisy" (posicaoTrofeuSsb4=176).
// mainTrophyWithVideo pega o primeiro troféu da era com vídeo setado -- como ambos tinham
// videoStartSec preenchido, "Tennis Outfit" (errado, 1534s) era escolhido em vez de "Daisy" (1229s + secundário 1534s).
// Fix: limpar o campo duplicado do "Tennis Outfit" -- o timing dele já vive em Daisy.videoStartSec2.

async function main() {
  const tennisTrophy = await db.collectible.findFirst({
    where: { name: "Daisy (Tennis Outfit)", smashGameVersion: "SSB4", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (tennisTrophy) {
    await db.collectible.update({
      where: { id: tennisTrophy.id },
      data: { videoStartSec: null, videoEndSec: null },
    });
    console.log(`✅ "Daisy (Tennis Outfit)": videoStartSec/videoEndSec limpos (era ${tennisTrophy.videoStartSec}-${tennisTrophy.videoEndSec}) -- timing já vive em Daisy.videoStartSec2/videoEndSec2`);
  }

  // Verificação final
  const check = await db.collectible.findMany({
    where: { fighter: { name: "Daisy" }, type: "TROPHY", smashGameVersion: "SSB4" },
    select: { name: true, posicaoTrofeuSsb4: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true },
    orderBy: { posicaoTrofeuSsb4: "asc" },
  });
  console.log("\nEstado final (ordenado por posicaoTrofeuSsb4, que é a ordem real do mainTrophyWithVideo):");
  check.forEach(t => console.log(`  pos=${t.posicaoTrofeuSsb4} | ${t.name} | ${t.videoStartSec}-${t.videoEndSec} | 2: ${t.videoStartSec2}-${t.videoEndSec2}`));

  await db.$disconnect();
}
main().catch(console.error);
