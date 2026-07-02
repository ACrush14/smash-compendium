import { db } from "../../lib/db";

// Padrão do componente: 1 troféu "SSB4" com videoStartSec (Wii U) + videoStartSec2 (3DS).
// "Daisy" (WiiU, 1229-1240) recebe o campo secundário com o timing do "Daisy (Tennis Outfit)" (3DS, 1534-1544).

async function main() {
  const wiiuTrophy = await db.collectible.findFirst({
    where: { name: "Daisy", smashGameVersion: "SSB4", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (wiiuTrophy) {
    await db.collectible.update({
      where: { id: wiiuTrophy.id },
      data: { videoStartSec2: 1534, videoEndSec2: 1544 },
    });
    console.log(`✅ "Daisy" (SSB4): videoStartSec2/videoEndSec2 = 1534-1544 (3DS Tennis, 25:34-25:44)`);
    console.log(`   Primary (Wii U) permanece: ${wiiuTrophy.videoStartSec}-${wiiuTrophy.videoEndSec} (20:29-20:40)`);
  } else {
    console.log("⚠️  Trophy 'Daisy' SSB4 não encontrado");
  }

  await db.$disconnect();
}
main().catch(console.error);
