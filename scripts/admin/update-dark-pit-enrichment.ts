import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "An angel who descends on black wings, the spitting image of Pit. A mysterious being with a combative personality. Commonly known as \"Pittoo.\" Belonging to no army, when he first appeared, he showed an aggressive side toward both the Underworld Army and Pit. In Smash Bros., he uses moves similar to Pit's. The bow he carries is the \"Silver Bow,\" and he also fights with other sacred treasures different from Pit's.",
    pt: "Um anjo que desce em asas negras, a cara do Pit. Um ser misterioso com uma personalidade combativa. Conhecido popularmente como \"Pittoo.\" Não pertencendo a nenhum exército, quando apareceu pela primeira vez, ele mostrou um lado agressivo tanto contra o Exército do Submundo quanto contra o Pit. Em Smash Bros., ele usa golpes parecidos com os do Pit. O arco que ele carrega é o \"Silver Bow,\" e ele também luta com outros tesouros sagrados diferentes dos do Pit.",
  },
  SSBU: {
    jpEn: "Born from Pandora's \"Mirror of Truth\" in Chapter 5, \"Pandora's Trap,\" of \"Kid Icarus: Uprising,\" he is a copy of Pit. He calls himself the \"Wings of Freedom.\" His wings, hair, and clothing are black, and his manner of speech is somewhat rough and aggressive, as well as a bit of a show-off. He's called \"Pittoo\" by Pit and the others, though he himself hates that nickname.",
    pt: "Nascido do \"Espelho da Verdade\" de Pandora no Capítulo 5, \"A Armadilha de Pandora,\" de \"Kid Icarus: Uprising,\" ele é uma cópia do Pit. Ele se autodenomina \"Asas da Liberdade.\" Suas asas, cabelo e roupas são negros, e seu jeito de falar é um tanto rude e agressivo, além de um pouco pomposo. Ele é chamado de \"Pittoo\" pelo Pit e pelos outros, embora ele mesmo odeie esse apelido.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Dark Pit's Origins", titleJp: "ブラックピットの初登場作品", textJp: "ブラックピットの初登場は、２０１２年発売の『新・光神話 パルテナの鏡』。性格は異なるものの、身体能力はピットと完全に同じ。真実の魔鏡から生まれた。", titleJpEn: "Dark Pit's Origins", textJpEn: "Dark Pit's debut was in \"Kid Icarus: Uprising,\" released in 2012. Though his personality differs, his physical abilities are completely identical to Pit's. He was born from the Mirror of Truth.", titlePt: "As Origens do Dark Pit", textPt: "O debut do Dark Pit foi em \"Kid Icarus: Uprising,\" lançado em 2012. Embora sua personalidade seja diferente, suas habilidades físicas são completamente idênticas às do Pit. Ele nasceu do Espelho da Verdade." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『新・光神話 パルテナの鏡』に登場。冥府軍の「真実の魔鏡」によって、生み出された。ピットの複製だが、不完全な状態で誕生。パルテナから「ブラピ」と愛称をつけられた。", titleJpEn: "In His Series", textJpEn: "Appears in \"Kid Icarus: Uprising.\" He was created by the Underworld Army's \"Mirror of Truth.\" A duplicate of Pit, he was born in an incomplete state. Palutena gave him the nickname \"Pittoo.\"", titlePt: "Na Série Original", textPt: "Aparece em \"Kid Icarus: Uprising.\" Ele foi criado pelo \"Espelho da Verdade\" do Exército do Submundo. Uma duplicata do Pit, ele nasceu em um estado incompleto. Palutena lhe deu o apelido \"Pittoo.\"" },
  { titleEn: "[★☆☆] Silver Bow", titleJp: "神弓シルバーリップとは", textJp: "『新・光神話 パルテナの鏡』に登場した神器で、「パルテナの神弓」の試作版。原作では、近距離のほうがダメージが強いという珍しい個性を持っていた。", titleJpEn: "Silver Bow", textJpEn: "A sacred treasure that appeared in \"Kid Icarus: Uprising,\" a prototype version of \"Palutena Bow.\" In its original series, it had the unusual trait of dealing more damage at close range.", titlePt: "Silver Bow", textPt: "Um tesouro sagrado que apareceu em \"Kid Icarus: Uprising,\" uma versão prototípica do \"Palutena Bow.\" Em sua série original, ele tinha a característica incomum de causar mais dano à curta distância." },
  { titleEn: "[★☆☆] Silver Bow (Neutral Special)", titleJp: "神弓シルバーリップ 【通常必殺ワザ】", textJp: "ピットが持つパルテナの神弓と比べて、発射後に矢が消えるまでの時間が少しだけ短く、また、矢の飛ぶ方向を調整しにくい。その分攻撃力が少し高い。", titleJpEn: "Silver Bow (Neutral Special)", textJpEn: "Compared to Pit's Palutena Bow, the time before the arrow disappears after firing is slightly shorter, and the arrow's flight direction is harder to adjust. In exchange, its attack power is slightly higher.", titlePt: "Silver Bow (Especial Neutro)", textPt: "Comparado ao Palutena Bow do Pit, o tempo antes da flecha desaparecer depois de disparada é um pouco mais curto, e a direção de voo da flecha é mais difícil de ajustar. Em compensação, seu poder de ataque é um pouco maior." },
  { titleEn: "[★★☆] Electroshock Arm (Side Special)", titleJp: "豪腕デンショッカー 【横必殺ワザ】", textJp: "突進し、当たった相手を強くふっとばす。「豪腕ダッシュアッパー」より浅い角度でふっとばし、電撃属性を持つ。", titleJpEn: "Electroshock Arm (Side Special)", textJpEn: "Charges forward, launching opponents it hits with strong knockback. It launches at a shallower angle than \"Upperdash Arm\" and carries an electric attribute.", titlePt: "Electroshock Arm (Especial Lateral)", textPt: "Avança, arremessando com forte impulso os adversários que atinge. Ele arremessa em um ângulo mais raso que o \"Upperdash Arm\" e carrega um atributo elétrico." },
  { titleEn: "[★★☆] Dark Pit Staff (Final Smash)", titleJp: "ブラピの狙杖 【最後の切りふだ】", textJp: "相手や地形を貫通して一直線に飛ぶ攻撃。複数の相手に当たると、もっとも手前の相手に一番大きくダメージを与え、相手を貫くほど威力が下がる。", titleJpEn: "Dark Pit Staff (Final Smash)", textJpEn: "An attack that flies in a straight line, piercing through opponents and terrain. When it hits multiple opponents, the nearest one takes the most damage, and the power decreases the further it pierces through.", titlePt: "Dark Pit Staff (Final Smash)", textPt: "Um ataque que voa em linha reta, perfurando adversários e o cenário. Quando atinge vários adversários, o mais próximo recebe o maior dano, e o poder diminui quanto mais ele perfura." },
  { titleEn: "[★☆☆] Pit vs. Dark Pit", titleJp: "ピットとブラックピットの違い", textJp: "ピットとブラックピットの能力は同等、しかし髪や服の色、一部の神器などが異なる。また、乱闘に勝った時には、それぞれ違う曲が流れる。", titleJpEn: "Pit vs. Dark Pit", textJpEn: "Pit and Dark Pit have equivalent abilities, but differ in hair and clothing color and some of their weapons. Also, different music plays for each when they win a brawl.", titlePt: "Pit vs. Dark Pit", textPt: "Pit e Dark Pit têm habilidades equivalentes, mas diferem na cor do cabelo e das roupas e em algumas de suas armas. Além disso, uma música diferente toca para cada um quando vencem uma partida." },
];

async function main() {
  const dp = await db.fighter.findFirst({
    where: { name: { contains: "Dark Pit" } },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!dp) { console.log("Dark Pit not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: dp.id },
    data: {
      curatorOverviewEn: "Dark Pit, Pit's Echo Fighter born from Pandora's Mirror of Truth, mirrors his counterpart's toolkit with a sharper edge — Silver Bow trades arrow control for extra power, and Electroshock Arm launches at a shallower, more horizontal angle with an electric hitbox. His Dark Pit Staff Final Smash pierces straight through the stage, hitting everything in its path. Same wings, same jumps, subtly different math — Dark Pit rewards players who know exactly where those small differences pay off.",
      curatorOverviewPt: "Dark Pit, o Echo Fighter do Pit nascido do Espelho da Verdade de Pandora, espelha o arsenal de seu equivalente com um toque mais afiado — Silver Bow troca controle da flecha por poder extra, e Electroshock Arm arremessa em um ângulo mais raso e horizontal com uma hitbox elétrica. Seu Final Smash Dark Pit Staff perfura o palco em linha reta, acertando tudo em seu caminho. Mesmas asas, mesmos pulos, matemática sutilmente diferente — o Dark Pit recompensa jogadores que sabem exatamente onde essas pequenas diferenças valem a pena.",
      curatorOverviewJp: "パンドーラの真実の魔鏡から生まれたピットのエコーファイター、ブラックピットは、相方の戦法をより鋭く映し出す――神弓シルバーリップは矢の制御を犠牲にして威力を上げ、豪腕デンショッカーはより浅く水平に近い角度で電撃属性の判定を放つ。最後の切りふだ「ブラピの狙杖」はステージを一直線に貫き、経路上のすべてに当たる。同じ翼、同じジャンプ、しかし微妙に異なる数値――ブラックピットは、その小さな違いがどこで生きるかを正確に把握するプレイヤーに応える。",
      curatorOverviewJpEn: "Dark Pit, Pit's Echo Fighter born from Pandora's Mirror of Truth, mirrors his counterpart's approach with a sharper edge — Silver Bow trades arrow control for extra power, and Electroshock Arm launches at a shallower, more horizontal angle with an electric-attribute hitbox. His Final Smash \"Dark Pit Staff\" pierces straight across the stage, hitting everything in its path. Same wings, same jumps, subtly different numbers — Dark Pit rewards players who know exactly where those small differences pay off.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Bios PT+JpEn
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = dp.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Move EN+PT+JpEn
  const move = dp.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "The down special \"Guardian Orbitars\" summons floating satellites that create large shields of light on either side. They block attacks and reflect projectiles. The shields of light can break if they take too many hits from an opponent's attacks. If that happens, waiting a while lets them be used again. The shields are positioned left and right, but they can also block attacks from above and below to some extent. (3DS) Kid Icarus: Uprising (2012/03)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "O especial baixo \"Guardian Orbitars\" convoca satélites flutuantes que criam grandes escudos de luz de cada lado. Eles bloqueiam ataques e refletem projéteis. Os escudos de luz podem se quebrar se receberem golpes demais dos ataques do adversário. Se isso acontecer, esperar um pouco permite usá-los novamente. Os escudos ficam posicionados à esquerda e à direita, mas também podem bloquear ataques de cima e de baixo até certo ponto. (3DS) Kid Icarus: Uprising (2012/03)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = dp.tips.find(t => t.titleEn === data.titleEn);
    if (!tip) { console.log(`  ⚠️  Tip não encontrada: "${data.titleEn}"`); continue; }
    await db.fighterTip.update({
      where: { id: tip.id },
      data: {
        titleJp: data.titleJp, textJp: data.textJp,
        titleJpEn: data.titleJpEn, textJpEn: data.textJpEn,
        titlePt: data.titlePt, textPt: data.textPt,
      },
    });
    updated++;
  }
  console.log(`✅ ${updated}/${TIPS.length} tips atualizadas`);

  // Video fixes: main "Dark Pit" trophy — WiiU 1:31:57-1:32:08, 3DS 1:20:43-1:20:53
  const mainTrophy = await db.collectible.findFirst({ where: { name: "Dark Pit", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true } });
  if (mainTrophy) {
    await db.collectible.update({ where: { id: mainTrophy.id }, data: { videoStartSec: 5517, videoEndSec: 5528, videoStartSec2: 4843, videoEndSec2: 4853 } });
    console.log(`✅ SSB4 Trophy "Dark Pit": ${mainTrophy.videoStartSec}-${mainTrophy.videoEndSec}|2:${mainTrophy.videoStartSec2}-${mainTrophy.videoEndSec2} -> 5517-5528|2:4843-4853`);
  }

  // Fix corrupted "Dark Pit (Alt.)" secondary field (was 6653-4863, start > end)
  const altTrophy = await db.collectible.findFirst({ where: { name: "Dark Pit (Alt.)", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (altTrophy) {
    await db.collectible.update({ where: { id: altTrophy.id }, data: { videoStartSec2: 4853, videoEndSec2: 4864 } });
    console.log(`✅ SSB4 Trophy "Dark Pit (Alt.)" secundário corrompido -> 4853-4864`);
  }

  // Merge orphaned "Dark Pit Staff" WiiU/3DS rows into one SSB4 row, link fighterId
  const staffWiiU = await db.collectible.findFirst({ where: { name: "Dark Pit Staff", smashGameVersion: "SSB4_WIIU", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  const staff3DS = await db.collectible.findFirst({ where: { name: "Dark Pit Staff", smashGameVersion: "SSB4_3DS", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (staffWiiU && staff3DS) {
    await db.collectible.update({
      where: { id: staffWiiU.id },
      data: { smashGameVersion: "SSB4", fighterId: dp.id, videoStartSec2: staff3DS.videoStartSec, videoEndSec2: staff3DS.videoEndSec },
    });
    await db.collectible.delete({ where: { id: staff3DS.id } });
    console.log(`✅ "Dark Pit Staff": WiiU+3DS mesclados em 1 registro SSB4, fighterId linkado`);
  }

  await db.$disconnect();
}
main().catch(console.error);
