import { db } from "../../lib/db";

// "Zelda's Lullaby" não existe como faixa isolada no banco -- usando "Ocarina of Time Medley" (contém o tema) por pedido do usuário

async function main() {
  await db.fighter.updateMany({
    where: { name: "Zelda" },
    data: {
      musicYoutubeId: "gUJHa2Rc8dQ",
      musicTitle: "Ocarina of Time Medley",
      musicArtist: "Michiko Naruke (Arrangement Supervisor)",
    },
  });
  console.log("✅ Zelda musicYoutubeId/musicTitle/musicArtist definidos (Ocarina of Time Medley)");
  await db.$disconnect();
}
main().catch(console.error);
