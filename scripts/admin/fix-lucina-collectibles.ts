import { db } from "../../lib/db";

// Mesmo bug da Daisy: troféu "Critical Hit (Lucina)" sem fighterId e com smashGameVersion
// não-normalizado (SSB4_WIIU em vez de SSB4) -- nunca aparecia na galeria do lutador.

async function main() {
  const lucina = await db.fighter.findFirst({ where: { name: "Lucina" }, select: { id: true } });
  if (!lucina) { console.log("Lucina not found"); return; }

  const trophy = await db.collectible.findFirst({
    where: { name: "Critical Hit (Lucina)", smashGameVersion: "SSB4_WIIU", type: "TROPHY" },
    select: { id: true },
  });
  if (trophy) {
    await db.collectible.update({
      where: { id: trophy.id },
      data: { fighterId: lucina.id, smashGameVersion: "SSB4" },
    });
    console.log("✅ 'Critical Hit (Lucina)': fighterId linkado + smashGameVersion normalizado SSB4_WIIU -> SSB4");
  } else {
    console.log("⚠️ Trophy 'Critical Hit (Lucina)' não encontrado");
  }

  await db.$disconnect();
}
main().catch(console.error);
