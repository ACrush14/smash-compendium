import { db } from "../../lib/db";

const TIPS = [
  { titleEn: "[★☆☆] Wii Fit Trainer's Origins", titleJp: "Wii Fit トレーナーの初登場作品", textJp: "Wii Fit トレーナーの初登場作品は、２００７年に発売された『Wii Fit』。プレイヤーを優しく指導してくれる存在。男性、女性好きな方を選べる。", titleJpEn: "Wii Fit Trainer's Origins", textJpEn: "Wii Fit Trainer's debut was in \"Wii Fit,\" released in 2007. A gentle guide who instructs the player. You can choose either the male or female trainer, whichever you prefer.", titlePt: "As Origens do Wii Fit Trainer", textPt: "O debut do Wii Fit Trainer foi em \"Wii Fit,\" lançado em 2007. Um guia gentil que instrui o jogador. Você pode escolher o treinador masculino ou feminino, o que preferir." },
  { titleEn: "[★☆☆] In Their Series", titleJp: "原作では", textJp: "男性と女性が登場。運動を行う時、ユーザーに体の動きを解説してくれる。ときどき寝坊や遅刻をしたり、選んだ方ではないトレーナーが代理で来ることも。", titleJpEn: "In Their Series", textJpEn: "Both a male and a female appear. While exercising, they explain body movements to the user. Sometimes they oversleep or arrive late, and occasionally the trainer you didn't choose shows up as a substitute.", titlePt: "Na Série Original", textPt: "Tanto um treinador masculino quanto uma treinadora feminina aparecem. Enquanto se exercita, eles explicam os movimentos do corpo ao usuário. Às vezes eles dormem demais ou chegam atrasados, e ocasionalmente o treinador que você não escolheu aparece como substituto." },
  { titleEn: "[★☆☆] Sun Salutation (Neutral Special)", titleJp: "太陽礼拝 【通常必殺ワザ】", textJp: "最大までためて撃つと、わずかだが回復できる。攻撃と回復が同時にできる、めずらしいワザ。", titleJpEn: "Sun Salutation (Neutral Special)", textJpEn: "Charging it to maximum and firing restores a small amount of health. A rare move that lets her attack and heal at the same time.", titlePt: "Sun Salutation (Especial Neutro)", textPt: "Carregá-lo ao máximo e disparar restaura uma pequena quantidade de vida. Um golpe raro que permite atacar e se curar ao mesmo tempo." },
  { titleEn: "[★★★] Header (Side Special)", titleJp: "ヘディング 【横必殺ワザ】", textJp: "ボタン入力するタイミングでボールの軌道が変化する。また、頭を直接当てることでも攻撃でき、頭の攻撃にはメテオ効果がある。", titleJpEn: "Header (Side Special)", textJpEn: "The timing of the button input changes the ball's trajectory. It can also attack by hitting directly with the head, and the head hit has a meteor effect.", titlePt: "Header (Especial Lateral)", textPt: "O timing do input do botão muda a trajetória da bola. Também pode atacar acertando diretamente com a cabeça, e o golpe de cabeça tem efeito de meteoro." },
  { titleEn: "[★★☆] Canceling Header (Side Special)", titleJp: "ヘディングのキャンセル 【横必殺ワザ】", textJp: "ボールを打つ前にシールドボタンを押すと、ボールを打たずにキャンセルすることができる。", titleJpEn: "Canceling Header (Side Special)", textJpEn: "Pressing the shield button before hitting the ball lets her cancel without hitting it.", titlePt: "Cancelando o Header (Especial Lateral)", textPt: "Apertar o botão de escudo antes de acertar a bola permite cancelar sem acertá-la." },
  { titleEn: "[★★☆] Super Hoop (Up Special)", titleJp: "燃焼フープダンス 【上必殺ワザ】", textJp: "ワザ中にボタンを連打すると上昇力がアップし、復帰能力が高まる。待ち構える相手の位置を見て、連打を加減すれば復帰を邪魔されにくい。", titleJpEn: "Super Hoop (Up Special)", textJpEn: "Mashing the button during the move increases the rising power, improving recovery ability. Watching the position of a waiting opponent and adjusting the mashing can make it harder for recovery to be interfered with.", titlePt: "Super Hoop (Especial Cima)", textPt: "Apertar o botão repetidamente durante o golpe aumenta o poder de subida, melhorando a capacidade de recuperação. Observar a posição de um adversário à espera e ajustar os apertos pode dificultar que a recuperação seja atrapalhada." },
  { titleEn: "[★★☆] Deep Breathing (Down Special)", titleJp: "腹式呼吸の効果 【下必殺ワザ】", textJp: "成功すると、攻撃力とふっとばし力、移動速度が一定時間上がり、ダメージをわずかに回復する効果もある。", titleJpEn: "Deep Breathing (Down Special)", textJpEn: "On success, attack power, knockback, and movement speed all increase for a set time, and it also slightly restores health.", titlePt: "Deep Breathing (Especial Baixo)", textPt: "Em caso de sucesso, poder de ataque, arremesso e velocidade de movimento aumentam por um tempo determinado, e também restaura levemente a vida." },
  { titleEn: "[★☆☆] Timing Deep Breathing (Down Special)", titleJp: "腹式呼吸のタイミング 【下必殺ワザ】", textJp: "外側の輪が、内側の赤い円に重なる時にボタンを押すと、成功となる。連続で使うと円の進みが遅くなる。スキが大きいワザなので、使いどころに注意。", titleJpEn: "Timing Deep Breathing (Down Special)", textJpEn: "Pressing the button when the outer ring overlaps the inner red circle results in success. Using it repeatedly slows down the ring's movement. Since it has a large opening, be careful about when you use it.", titlePt: "O Timing do Deep Breathing (Especial Baixo)", textPt: "Apertar o botão quando o anel externo se sobrepõe ao círculo vermelho interno resulta em sucesso. Usá-lo repetidamente diminui a velocidade do movimento do anel. Como tem uma grande abertura, cuidado com quando usá-lo." },
  { titleEn: "[★☆☆] Wii Fit (Final Smash)", titleJp: "Wii Fit 【最後の切りふだ】", textJp: "前方に無数のシルエットを放って、相手をステージの外へ押し出す。シルエットのポーズは、全部で１０種類ある。", titleJpEn: "Wii Fit (Final Smash)", textJpEn: "Releases countless silhouettes forward, pushing opponents off the stage. There are 10 different silhouette poses in total.", titlePt: "Wii Fit (Final Smash)", textPt: "Libera inúmeras silhuetas para frente, empurrando os adversários para fora do palco. Há 10 poses diferentes de silhuetas no total." },
  { titleEn: "[★★☆] Lunge (Neutral Attack)", titleJp: "ランジ 【弱攻撃】", textJp: "地上にいる相手に弱攻撃の３段目をうまく当てると、相手を地面に埋めることができる。", titleJpEn: "Lunge (Neutral Attack)", textJpEn: "Successfully landing the third hit of the neutral attack on a grounded opponent can bury them in the ground.", titlePt: "Lunge (Ataque Neutro)", textPt: "Acertar com sucesso o terceiro golpe do ataque neutro em um adversário no chão pode enterrá-lo." },
  { titleEn: "[★★☆] Dancer (Side Tilt Attack)", titleJp: "ダンスのポーズ 【横強攻撃】", textJp: "前に伸ばした腕だけでなく、後ろに振り上げる足も強力な攻撃で、当たれば相手を真上にふっとばす。前後から敵が接近している時に有効。", titleJpEn: "Dancer (Side Tilt Attack)", textJpEn: "Not only the arm extended forward, but also the leg swung up behind her is a powerful attack, launching opponents straight up on hit. Effective when enemies approach from both the front and back.", titlePt: "Dancer (Ataque Inclinado Lateral)", textPt: "Não só o braço estendido para frente, mas também a perna balançada para trás é um ataque poderoso, arremessando os adversários diretamente para cima ao acertar. Eficaz quando inimigos se aproximam pela frente e por trás." },
  { titleEn: "[★★★] Tree (Up Smash Attack)", titleJp: "立ち木のポーズ 【上スマッシュ攻撃】", textJp: "攻撃を出す直前、一瞬だけ無敵になる。うまく使えば、上空から攻撃してくる相手をふっとばせる。", titleJpEn: "Tree (Up Smash Attack)", textJpEn: "Right before the attack comes out, she becomes briefly invincible. Used well, it can launch opponents attacking from above.", titlePt: "Tree (Ataque Smash Cima)", textPt: "Pouco antes do ataque sair, ela fica brevemente invencível. Usado bem, pode arremessar adversários atacando de cima." },
  { titleEn: "[★☆☆] Arm & Leg Lift (Down Smash)", titleJp: "アーム＆レッグレイズ 【下スマッシュ攻撃】", textJp: "相手を低くふっとばす。下必殺ワザでふっとばしが強化されていれば、相手の蓄積ダメージが低くても、ガケ付近で撃墜を狙えることがある。", titleJpEn: "Arm & Leg Lift (Down Smash)", textJpEn: "Launches opponents at a low angle. If knockback has been boosted by the down special, it can sometimes go for a KO near the ledge even at low accumulated damage.", titlePt: "Arm & Leg Lift (Ataque Smash Baixo)", textPt: "Arremessa os adversários em um ângulo baixo. Se o arremesso foi potencializado pelo especial baixo, às vezes pode buscar um KO perto da borda mesmo com dano acumulado baixo." },
  { titleEn: "[★☆☆] Single-Leg Extension (Forward Air Attack)", titleJp: "片足バランスウォーク 【前空中攻撃】", textJp: "後方に突き出した足でも、ダメージを与えられる。実は、弱めのメテオ効果もある。", titleJpEn: "Single-Leg Extension (Forward Air Attack)", textJpEn: "The leg thrust out behind her can also deal damage. In fact, it has a weak meteor effect too.", titlePt: "Single-Leg Extension (Ataque Aéreo Frente)", textPt: "A perna projetada para trás também pode causar dano. Na verdade, ela também tem um efeito de meteoro fraco." },
];

async function main() {
  const wft = await db.fighter.findFirst({
    where: { name: { contains: "Wii Fit" } },
    select: {
      id: true,
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!wft) { console.log("Wii Fit Trainer not found"); return; }

  await db.fighter.update({
    where: { id: wft.id },
    data: {
      curatorOverviewEn: "Wii Fit Trainer, the unassuming instructor from Wii Fit, hides genuine danger behind a friendly demeanor — Sun Salutation is a rare projectile that heals on max charge, Header doubles as a ranged attack or a meteor-smashing headbutt, and Deep Breathing offers a risky but powerful buff to attack, knockback, and speed if timed correctly. Super Hoop provides a controllable, mashable recovery. Calm and precise rather than flashy, Wii Fit Trainer rewards players who master her unusual timing-based mechanics and space fights around Deep Breathing's window.",
      curatorOverviewPt: "Wii Fit Trainer, a discreta instrutora de Wii Fit, esconde um perigo genuíno por trás de uma postura amigável — Sun Salutation é um projétil raro que cura na carga máxima, Header funciona tanto como um ataque à distância quanto uma cabeçada com efeito de meteoro, e Deep Breathing oferece um bônus arriscado mas poderoso de ataque, arremesso e velocidade se cronometrado corretamente. Super Hoop oferece uma recuperação controlável e que pode ser potencializada apertando o botão. Calma e precisa em vez de vistosa, a Wii Fit Trainer recompensa jogadores que dominam suas mecânicas incomuns baseadas em timing e organizam a luta em torno da janela do Deep Breathing.",
      curatorOverviewJp: "Wii Fitトレーナーは、Wii Fitシリーズの控えめなインストラクターだが、その親しみやすい物腰の裏に本物の危険を秘めている――太陽礼拝は最大までためると回復する珍しい飛び道具で、ヘディングは遠距離攻撃とメテオ効果を持つヘディングを兼ね、腹式呼吸は正確なタイミングで発動すれば攻撃力・ふっとばし力・速度に強力だがリスクのあるバフを与える。燃焼フープダンスは連打で調整可能な復帰を提供する。派手さより冷静さと精密さを持つWii Fitトレーナーは、独特のタイミングベースの仕組みを使いこなし、腹式呼吸のタイミングを中心に戦いを組み立てるプレイヤーに応える。",
      curatorOverviewJpEn: "Wii Fit Trainer, the unassuming instructor from Wii Fit, hides genuine danger behind her friendly demeanor — Sun Salutation is a rare projectile that heals when fully charged, Header doubles as both a ranged attack and a meteor-effect headbutt, and Deep Breathing grants a powerful but risky buff to attack power, knockback, and speed if timed correctly. Super Hoop offers a mashable, controllable recovery. Calm and precise rather than flashy, Wii Fit Trainer rewards players who master her unusual timing-based mechanics and build their game plan around the Deep Breathing window.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = wft.tips.find(t => t.titleEn === data.titleEn);
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

  // Link orphaned "Wii Fit" (Final Smash trophy) and "Wii Fit U Trainer" [SSB4_WIIU]
  for (const name of ["Wii Fit", "Wii Fit U Trainer"]) {
    const item = await db.collectible.findFirst({ where: { name, smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
    if (item) {
      await db.collectible.update({ where: { id: item.id }, data: { smashGameVersion: "SSB4", fighterId: wft.id } });
      console.log(`✅ "${name}" [SSB4_WIIU]: normalizado SSB4, linkado`);
    }
  }

  await db.$disconnect();
}
main().catch(console.error);
