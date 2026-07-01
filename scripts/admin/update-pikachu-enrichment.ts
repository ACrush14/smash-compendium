import { db } from "../../lib/db";

async function main() {
  const pikachu = await db.fighter.findFirst({
    where: { name: "Pikachu" },
    select: { id: true, bios: { select: { id: true, smashGameVersion: true } } },
  });
  if (!pikachu) { console.log("Pikachu not found"); return; }

  // Curator Overview — 4 idiomas
  await db.fighter.update({
    where: { id: pikachu.id },
    data: {
      curatorOverviewEn: "Pikachu, the iconic Electric-type Pokémon, has been Smash Bros.' most recognizable mascot since the very first game. Combining exceptional speed, powerful projectiles with Thunder Jolt, and the versatile Reflector-like Quick Attack recovery, Pikachu is a rush-down fighter that rewards fast, aggressive play with devastating combo potential.",
      curatorOverviewPt: "Pikachu, o icônico Pokémon do tipo Elétrico, é o mascote mais reconhecido do Smash Bros. desde o primeiro jogo. Combinando velocidade excepcional, projéteis poderosos com o Choque Elétrico e a versátil recuperação Ataque Rápido, Pikachu é um lutador agressivo que recompensa um jogo veloz e ofensivo com potencial devastador de combos.",
      curatorOverviewJp: "でんきタイプポケモンの象徴、ピカチュウは初代スマブラからのシリーズを代表するマスコット。優れたスピード、でんきショックによる強力な飛び道具、そして多用途な復帰ワザ「でんこうせっか」を組み合わせ、スピーディーで攻撃的なプレイを得意とするファイター。その爆発的なコンボ力でどこからでもKOを狙える。",
      curatorOverviewJpEn: "Pikachu, the iconic Electric-type Pokémon, has been the face of Smash Bros. since the very first game. Combining exceptional speed, the powerful Thunder Jolt projectile, and the versatile Quick Attack recovery, Pikachu is an aggressive rush-down fighter who rewards fast play with devastating combo potential and KO opportunities from anywhere.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Fix Bio SSBM: 4419–4449 → 2506–2523 (Pikachu regular trophy in ZoomZike)
  const bioSsbm = pikachu.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({
      where: { id: bioSsbm.id },
      data: { videoStartSec: 2506, videoEndSec: 2523 },
    });
    console.log("✅ Bio SSBM: 4419–4449 → 2506–2523 (Pikachu trophy ~41:46–41:63)");
  }

  await db.$disconnect();
  console.log("\n✅ Pikachu enrichment aplicado");
}
main().catch(console.error);
