import { db } from "../../lib/db";

// Bug: "Mewtwo (Alt.)" (posicaoTrofeuSsb4=473) ordena ANTES de "Mewtwo" (posicaoTrofeuSsb4=521).
// mainTrophyWithVideo pegaria o Alt em vez do principal, mostrando o timing/descrição errados
// mesmo sendo timing "válido" (mesmo personagem, clipe adjacente). Limpar o vídeo do Alt para
// garantir que o "Mewtwo" principal (timing confirmado via VLC pelo usuário) seja sempre escolhido.

async function main() {
  const alt = await db.collectible.findFirst({
    where: { name: "Mewtwo (Alt.)", smashGameVersion: "SSB4", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true },
  });
  if (alt) {
    await db.collectible.update({
      where: { id: alt.id },
      data: { videoStartSec: null, videoEndSec: null, videoStartSec2: null, videoEndSec2: null },
    });
    console.log(`✅ "Mewtwo (Alt.)": vídeo limpo (era ${alt.videoStartSec}-${alt.videoEndSec} | 2: ${alt.videoStartSec2}-${alt.videoEndSec2}) -- agora só "Mewtwo" principal tem vídeo`);
  }
  await db.$disconnect();
}
main().catch(console.error);
