import { db } from "../../lib/db";

async function main() {
  const fox = await db.fighter.findFirst({
    where: { name: "Fox" },
    select: { id: true, bios: { select: { id: true, smashGameVersion: true } } },
  });
  if (!fox) { console.log("Fox not found"); return; }

  // Curator Overview — 4 idiomas
  await db.fighter.update({
    where: { id: fox.id },
    data: {
      curatorOverviewEn: "Fox McCloud, ace pilot of Team Star Fox, has been a series mainstay since the N64 original. His toolkit — the precise Blaster, the rushing Fox Illusion, the all-purpose Up Smash, and the legendary Reflector (Shine) — rewards players who master his speed-driven, combo-centric playstyle with explosive damage and stage control.",
      curatorOverviewPt: "Fox McCloud, o ás piloto da Equipe Star Fox, é presença constante na série desde o original do N64. Seu conjunto de habilidades — o preciso Blaster, o veloz Fox Illusion, o poderoso Up Smash e o lendário Reflector (Shine) — recompensa quem domina seu estilo baseado em velocidade e combos com dano explosivo e controle de espaço.",
      curatorOverviewJp: "スターフォックスのエースパイロット、フォックス・マクラウドは64版から参戦するシリーズの常連ファイター。鋭いブラスター、突進するフォックスイリュージョン、万能の上スマッシュ、そして伝説のリフレクター（シャイン）を武器に、スピードとコンボを極めたプレイヤーに爆発的なダメージと場の支配力をもたらす。",
      curatorOverviewJpEn: "Fox McCloud, ace pilot of Team Star Fox, has been a series staple since the N64 original. Armed with the precise Blaster, the charging Fox Illusion, a versatile Up Smash, and the legendary Reflector (Shine), he rewards players who master his speed-driven, combo-focused playstyle with explosive damage and stage dominance.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Fix Bio SSBM: 4303–4307 → 1520–1540 (Fox McCloud trophy in ZoomZike)
  const bioSsbm = fox.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({
      where: { id: bioSsbm.id },
      data: { videoStartSec: 1520, videoEndSec: 1540 },
    });
    console.log("✅ Bio SSBM video: 4303–4307 → 1520–1540 (Fox McCloud trophy 25:20–25:40)");
  }

  await db.$disconnect();
  console.log("\n✅ Fox enrichment aplicado (Curator Overview + Bio SSBM video)");
}
main().catch(console.error);
