import { db } from "../../lib/db";

async function main() {
  const luigi = await db.fighter.findFirst({
    where: { name: "Luigi" },
    select: { id: true, bios: { select: { id: true, smashGameVersion: true } } },
  });
  if (!luigi) { console.log("Luigi not found"); return; }

  // Curator Overview — 4 idiomas
  await db.fighter.update({
    where: { id: luigi.id },
    data: {
      curatorOverviewEn: "Luigi, Mario's younger brother, has evolved from a palette-swap into one of Smash's most distinct fighters. Defined by his floaty jumps, powerful counter (Super Jump Punch), the horizontal Green Missile, and the ever-dangerous down taunt that can kill at high percentages, Luigi rewards patient, defensive players who wait for punish opportunities.",
      curatorOverviewPt: "Luigi, o irmão mais novo do Mario, evoluiu de uma recoloração para um dos lutadores mais distintos do Smash. Definido por seus saltos flutuantes, o poderoso contra-ataque (Super Jump Punch), o Green Missile horizontal e a famosa provocação baixa que pode KO em altas porcentagens, Luigi recompensa jogadores pacientes e defensivos que esperam oportunidades de punir.",
      curatorOverviewJp: "マリオの弟、ルイージは単なる色違いキャラから独自の個性を持つスマブラの名ファイターへと進化した。ふわふわとした浮きジャンプ、強力なカウンター（スーパージャンプパンチ）、水平突進のグリーンミサイル、そして高%で撃墜できる伝説の下アピール――待ちとパニッシュを得意とする防御型プレイヤーに適したファイターだ。",
      curatorOverviewJpEn: "Luigi, Mario's younger brother, evolved from a palette swap into one of Smash's most distinctive fighters. Defined by floaty jumps, a powerful counter (Super Jump Punch), the horizontal Green Missile, and the legendary down taunt that can KO at high percentages — he's a fighter suited for patient, punish-oriented defensive players.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Fix Bio SSBM: 4499–4527 → 136–153 (regular Luigi trophy in ZoomZike ~2:16-2:33)
  const bioSsbm = luigi.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({
      where: { id: bioSsbm.id },
      data: { videoStartSec: 136, videoEndSec: 153 },
    });
    console.log("✅ Bio SSBM: 4499–4527 → 136–153 (Luigi trophy 2:16–2:33)");
  }

  // Fix SSBB Trophy: videoEndSec=108780 is corrupted data
  // Needs VLC confirmation — set to null until user provides correct timing
  const ssbbTrophy = await db.collectible.findFirst({
    where: { name: "Luigi", smashGameVersion: "SSBB", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (ssbbTrophy && ssbbTrophy.videoEndSec === 108780) {
    await db.collectible.update({
      where: { id: ssbbTrophy.id },
      data: { videoEndSec: null },
    });
    console.log("⚠️  SSBB Trophy videoEndSec=108780 (corrupted) → null — aguarda VLC timing do usuário");
  }

  await db.$disconnect();
  console.log("\n✅ Luigi enrichment parcial aplicado");
}
main().catch(console.error);
