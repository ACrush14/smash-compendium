import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "Samus Aran in a state without her Power Suit. While she loses the power, moves, and abundant projectiles she has while wearing the Power Suit, she gains a power-up in the form of Jet Boots on her feet. The Paralyzer she carries can fire a shock-inducing beam, and can also transform into a whip to attack. Firing it toward a ledge lets her grab on and recover as well.",
    pt: "Samus Aran em um estado sem a Power Suit. Embora ela perca o poder, os golpes e os abundantes projéteis que tem enquanto usa a Power Suit, ela ganha um aprimoramento na forma de Jet Boots nos pés. O Paralyzer que ela carrega pode disparar um raio que causa choque, e também pode se transformar em um chicote para atacar. Disparando-o em direção a uma borda, ela também consegue se agarrar e se recuperar.",
  },
  SSBB: {
    jpEn: "Samus Aran in a state with her Power Suit removed. In this state, Samus's characteristic attack power is lost. However, having been trained by the Chozo since childhood, she possesses agility and physical ability far beyond that of an ordinary person. Being lighter also increases her speed. The weapon she carries is the Paralyzer, used for self-defense. It paralyzes enemies.",
    pt: "Samus Aran em um estado sem a Power Suit. Nesse estado, o poder de ataque característico da Samus é perdido. Porém, tendo sido treinada pelos Chozo desde a infância, ela possui uma agilidade e habilidade física muito além da de uma pessoa comum. Ficando mais leve, sua velocidade também aumenta. A arma que ela carrega é o Paralyzer, usado para autodefesa. Ele paralisa inimigos.",
  },
  SSBU: {
    jpEn: "For Zero Suit Samus as a fighter, see \"Zero Suit Samus (X),\" \"Zero Suit Samus (3DS/Wii U),\" and \"Zero Suit Samus (SP)\" respectively.",
    pt: "Para a Zero Suit Samus como lutadora, veja respectivamente \"Zero Suit Samus (X),\" \"Zero Suit Samus (3DS/Wii U)\" e \"Zero Suit Samus (SP).\"",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Zero Suit Samus's Origins", titleJp: "ゼロスーツサムスの初登場作品", textJp: "サムスが初めて青いゼロスーツに身を包んだ姿で登場したのは、『メトロイド ゼロミッション』。２００４年に発売された作品。", titleJpEn: "Zero Suit Samus's Origins", textJpEn: "Samus first appeared clad in her blue Zero Suit in \"Metroid: Zero Mission,\" a title released in 2004.", titlePt: "As Origens da Zero Suit Samus", textPt: "A Samus apareceu pela primeira vez vestindo sua Zero Suit azul em \"Metroid: Zero Mission,\" um título lançado em 2004." },
  { titleEn: "[★☆☆] In Her Series", titleJp: "原作では", textJp: "水色のスーツ、通称「ゼロスーツ」が、初めて描かれた『メトロイド ゼロミッション』。ハンドガンのみの状態で、スペースパイレーツのマザーシップへの潜入を試みる。", titleJpEn: "In Her Series", textJpEn: "The light-blue suit commonly known as the \"Zero Suit\" was first depicted in \"Metroid: Zero Mission.\" Armed with only a handgun, she attempts to infiltrate the Space Pirates' mothership.", titlePt: "Na Série Original", textPt: "O traje azul-claro conhecido popularmente como \"Zero Suit\" foi retratado pela primeira vez em \"Metroid: Zero Mission.\" Armada apenas com uma pistola, ela tenta infiltrar-se na nave-mãe dos Piratas Espaciais." },
  { titleEn: "[★☆☆] Paralyzer", titleJp: "パラライザーとは", textJp: "『メトロイド ゼロミッション』の、パワードスーツを着用していないサムスが使用。原作でもハンドガンを用いて、敵を一定時間麻痺させた。", titleJpEn: "Paralyzer", textJpEn: "Used by Samus in \"Metroid: Zero Mission\" when not wearing her Power Suit. In its original series, the handgun was also used to paralyze enemies for a set amount of time.", titlePt: "Paralyzer", textPt: "Usada pela Samus em \"Metroid: Zero Mission\" quando não está vestindo a Power Suit. Em sua série original, a pistola também era usada para paralisar inimigos por um período determinado." },
  { titleEn: "[★☆☆] Zero Suit Samus's 7th Color", titleJp: "ゼロスーツサムスの7P", textJp: "ゼロスーツサムスの7Pカラーはオレンジ色のショートパンツ姿。この姿は『メトロイド ゼロミッション』をある条件下でクリアすると出現。", titleJpEn: "Zero Suit Samus's 7th Color", textJpEn: "Zero Suit Samus's 7P color gives her orange short pants. This appearance shows up in \"Metroid: Zero Mission\" when the game is cleared under certain conditions.", titlePt: "A 7ª Cor da Zero Suit Samus", textPt: "A cor 7P da Zero Suit Samus lhe dá um short laranja. Essa aparência surge em \"Metroid: Zero Mission\" quando o jogo é zerado sob certas condições." },
  { titleEn: "[★☆☆] Paralyzer (Neutral Special)", titleJp: "パラライザー 【通常必殺ワザ】", textJp: "当たると一瞬、相手をしびれ状態にすることができる。相手がしびれて動けない間が攻撃のチャンス。", titleJpEn: "Paralyzer (Neutral Special)", textJpEn: "On hit, it can briefly stun the opponent. While the opponent is stunned and unable to move, it's a chance to attack.", titlePt: "Paralyzer (Especial Neutro)", textPt: "Ao acertar, pode atordoar brevemente o adversário. Enquanto o adversário está atordoado e incapaz de se mover, é uma chance de atacar." },
  { titleEn: "[★☆☆] Plasma Whip (Side Special)", titleJp: "プラズマウィップ 【横必殺ワザ】", textJp: "プラズマをムチのようにのばし、前に向かって振る。ボタン長押しでムチを振り上げ、対空攻撃や追撃に使うことも可能。", titleJpEn: "Plasma Whip (Side Special)", textJpEn: "Extends plasma like a whip and swings it forward. Holding the button raises the whip up, which can also be used for anti-air attacks or follow-ups.", titlePt: "Plasma Whip (Especial Lateral)", textPt: "Estende plasma como um chicote e o balança para frente. Segurar o botão levanta o chicote para cima, que também pode ser usado para ataques antiaéreos ou acompanhamentos." },
  { titleEn: "[★★☆] Grabbing Ledges with Plasma Whip (Side Special)", titleJp: "プラズマウィップでガケつかまり 【横必殺ワザ】", textJp: "空中でプラズマウィップをガケに当てれば、そのガケにつかまれる。横必殺ワザでも、つかみ操作でも可能。", titleJpEn: "Grabbing Ledges with Plasma Whip (Side Special)", textJpEn: "Hitting a ledge with Plasma Whip in the air lets her grab onto it. This works both with the side special and with the grab command.", titlePt: "Agarrando Bordas com o Plasma Whip (Especial Lateral)", textPt: "Acertar uma borda com o Plasma Whip no ar permite que ela se agarre a ela. Isso funciona tanto com o especial lateral quanto com o comando de agarrar." },
  { titleEn: "[★★★] Flip Jump (Down Special)", titleJp: "フリップジャンプ 【下必殺ワザ】", textJp: "地上の相手を踏みつけると地面に埋めることができる。また、空中の相手を踏みつけるとメテオ効果がある。", titleJpEn: "Flip Jump (Down Special)", textJpEn: "Stomping on a grounded opponent can bury them in the ground. Also, stomping on an airborne opponent has a meteor effect.", titlePt: "Flip Jump (Especial Baixo)", textPt: "Pisar em um adversário no chão pode enterrá-lo. Além disso, pisar em um adversário no ar tem um efeito de meteoro." },
  { titleEn: "[★★☆] Flip Jump's Traits (Down Special)", titleJp: "フリップジャンプの特性 【下必殺ワザ】", textJp: "相手に触れると、空中の相手にはメテオ効果、地上の相手には地面に埋める攻撃を行う。必殺ワザボタンの追加入力で出るキックは、相手を大きくふっとばす。", titleJpEn: "Flip Jump's Traits (Down Special)", textJpEn: "On contact, it has a meteor effect on airborne opponents and buries grounded opponents. The kick that comes out with an additional special move button input launches opponents with strong knockback.", titlePt: "As Características do Flip Jump (Especial Baixo)", textPt: "Ao entrar em contato, tem um efeito de meteoro em adversários no ar e enterra adversários no chão. O chute que sai com um input adicional do botão de golpe especial arremessa os adversários com forte impulso." },
  { titleEn: "[★★★] Flip Jump's Meteor Effect (Down Special)", titleJp: "フリップジャンプのメテオ効果 【下必殺ワザ】", textJp: "ワザの途中で攻撃ボタンを押すと蹴りを出す。この蹴りは、威力が高く強力なメテオ効果がある。", titleJpEn: "Flip Jump's Meteor Effect (Down Special)", textJpEn: "Pressing the attack button partway through the move delivers a kick. This kick has high power and a strong meteor effect.", titlePt: "O Efeito Meteoro do Flip Jump (Especial Baixo)", textPt: "Apertar o botão de ataque no meio do golpe libera um chute. Esse chute tem alto poder e um forte efeito de meteoro." },
  { titleEn: "[★☆☆] Zero Laser (Final Smash)", titleJp: "ゼロレーザー 【最後の切りふだ】", textJp: "レーザーは徐々に力をためて、最後に強力な一撃が出る。力のたまりきるタイミングは、照準の表示に注目。", titleJpEn: "Zero Laser (Final Smash)", textJpEn: "The laser gradually charges up power, unleashing a powerful final blow. Watch the reticle display to see when the charge is complete.", titlePt: "Zero Laser (Final Smash)", textPt: "O laser carrega poder gradualmente, liberando um golpe final poderoso. Observe a exibição da retícula para saber quando a carga está completa." },
  { titleEn: "[★★☆] Zero Laser Controls (Final Smash)", titleJp: "ゼロレーザーの操作 【最後の切りふだ】", textJp: "照準は、レーザー発射前の方が早く動かせるので、先回りして狙う場所を決めておく。最後の一撃の照準範囲は、少し大きくなる。", titleJpEn: "Zero Laser Controls (Final Smash)", textJpEn: "The reticle can be moved faster before the laser fires, so it's best to decide the target location in advance. The aiming range for the final blow is a bit larger.", titlePt: "Os Controles do Zero Laser (Final Smash)", textPt: "A retícula pode ser movida mais rápido antes do laser disparar, então é melhor decidir o local do alvo com antecedência. A área de mira do golpe final é um pouco maior." },
  { titleEn: "[★☆☆] Slant Paralyzer (Down Smash Attack)", titleJp: "スラントパラライザー 【下スマッシュ攻撃】", textJp: "パラライザーを斜め下に向かって撃つ。当たった相手はしびれて一定時間動けなくなるので連続攻撃のチャンス。", titleJpEn: "Slant Paralyzer (Down Smash Attack)", textJpEn: "Fires the Paralyzer diagonally downward. Opponents hit are stunned and unable to move for a set time, creating a chance for a combo.", titlePt: "Slant Paralyzer (Ataque Smash Baixo)", textPt: "Dispara o Paralyzer na diagonal para baixo. Adversários atingidos ficam atordoados e incapazes de se mover por um tempo determinado, criando uma chance de combo." },
  { titleEn: "[★☆☆] Slash Dive (Down Air Attack)", titleJp: "スラッシュダイブ 【下空中攻撃】", textJp: "斜め下方向に急降下しながら攻撃するワザ。着地の衝撃で周りにダメージを与えられる。", titleJpEn: "Slash Dive (Down Air Attack)", textJpEn: "A move that attacks while diving diagonally downward. The impact of landing can deal damage to those nearby.", titlePt: "Slash Dive (Ataque Aéreo Baixo)", textPt: "Um golpe que ataca enquanto mergulha na diagonal para baixo. O impacto do pouso pode causar dano aos que estão por perto." },
];

async function main() {
  const zss = await db.fighter.findFirst({
    where: { name: { contains: "Zero Suit" } },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!zss) { console.log("Zero Suit Samus not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: zss.id },
    data: {
      curatorOverviewEn: "Zero Suit Samus trades her Power Suit's firepower for raw speed and precision — Paralyzer stuns from range, Plasma Whip doubles as a whip-crack attack and a ledge-grabbing tether, and Flip Jump buries grounded opponents or meteors them out of the air. Her Zero Laser Final Smash briefly restores the Power Suit for one devastating charged beam. Fast, fragile, and technical, she rewards players who land precise pokes and convert stuns into real damage.",
      curatorOverviewPt: "Zero Suit Samus troca o poder de fogo da Power Suit por velocidade e precisão puras — Paralyzer atordoa à distância, Plasma Whip funciona tanto como um ataque de chicote quanto como um gancho para se agarrar em bordas, e Flip Jump enterra adversários no chão ou os transforma em meteoros no ar. Seu Final Smash Zero Laser restaura brevemente a Power Suit para um devastador raio carregado. Rápida, frágil e técnica, ela recompensa jogadores que acertam golpes precisos e convertem atordoamentos em dano real.",
      curatorOverviewJp: "ゼロスーツサムスは、パワードスーツの火力を犠牲にして生の速さと精密さを得る――パラライザーは遠距離からしびれさせ、プラズマウィップはムチの一撃とガケつかまり用のロープを兼ね、フリップジャンプは地上の相手を埋めるか空中でメテオにする。最後の切りふだ「ゼロレーザー」は一時的にパワードスーツを取り戻し、強烈なチャージビームを放つ。速く、もろく、テクニカルな彼女は、正確な牽制を当ててしびれをダメージに変えられるプレイヤーに応える。",
      curatorOverviewJpEn: "Zero Suit Samus trades the Power Suit's firepower for raw speed and precision — the Paralyzer stuns from range, Plasma Whip doubles as both a whip strike and a ledge-grab rope, and Flip Jump buries grounded opponents or meteor smashes them in the air. Her Final Smash \"Zero Laser\" temporarily restores the Power Suit and unleashes a fierce charged beam. Fast, fragile, and technical, she rewards players who land precise pokes and convert stuns into real damage.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Bios PT+JpEn
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = zss.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Move EN+PT+JpEn
  const move = zss.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "The up special \"Boost Kick\" — if the rising kick connects, the finishing rolling sobat hits as well, launching the opponent sideways. If the very start of the move connects at point-blank range, it can hit up to 8 times. \"Flip Jump\" is a down special that performs a somersault. Landing it directly on a grounded opponent buries them, and pressing the button during the somersault delivers a downward kick. (GBA) Metroid: Zero Mission (2004/05) (Wii) Metroid: Other M (2010/09)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "O especial cima \"Boost Kick\" — se o chute ascendente conectar, o rolling sobat final também acerta, arremessando o adversário lateralmente. Se o início do golpe conectar à queima-roupa, pode acertar até 8 vezes. \"Flip Jump\" é um especial baixo que realiza um mortal. Acertá-lo diretamente em um adversário no chão o enterra, e apertar o botão durante o mortal libera um chute para baixo. (GBA) Metroid: Zero Mission (2004/05) (Wii) Metroid: Other M (2010/09)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = zss.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fixes
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "Zero Suit Samus", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 4050, videoEndSec: 4067 } });
    console.log(`✅ SSBB Trophy: ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} -> 4050-4067 (1:07:30-1:07:47)`);
  }

  const ssb4Main = await db.collectible.findFirst({ where: { name: "Zero Suit Samus", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssb4Main) {
    await db.collectible.update({ where: { id: ssb4Main.id }, data: { videoStartSec: 2628, videoEndSec: 2638 } });
    console.log(`✅ SSB4 Trophy "Zero Suit Samus" WiiU: ${ssb4Main.videoStartSec}-${ssb4Main.videoEndSec} -> 2628-2638 (43:48-43:58)`);
  }

  // Link orphaned "Gunship (Zero Suit Samus)" (SSB4_WIIU only, no 3DS pair)
  const gunship = await db.collectible.findFirst({ where: { name: "Gunship (Zero Suit Samus)", smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
  if (gunship) {
    await db.collectible.update({ where: { id: gunship.id }, data: { smashGameVersion: "SSB4", fighterId: zss.id } });
    console.log(`✅ "Gunship (Zero Suit Samus)": normalizado para SSB4, fighterId linkado`);
  }

  await db.$disconnect();
}
main().catch(console.error);
