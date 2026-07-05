import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Banjo & Kazooie's Origins",
    titleJp: "バンジョー＆カズーイの初登場作品",
    textJp: "初めて二人そろって登場したのは、１９９８年発売の『バンジョーとカズーイの大冒険』。バンジョーはその前に、１９９７年の『ディディーコングレーシング』で初登場していた。",
    titleJpEn: "Banjo & Kazooie's Debut Work",
    textJpEn: "The first time the two appeared together was in Banjo-Kazooie, released in 1998. Banjo had already made his debut before that, in Diddy Kong Racing in 1997.",
    titlePt: "As Origens de Banjo & Kazooie",
    textPt: "A primeira vez que os dois apareceram juntos foi em Banjo-Kazooie, lançado em 1998. Banjo já havia estreado antes disso, em Diddy Kong Racing em 1997.",
  },
  {
    titleEn: "[★☆☆] In Their Series",
    titleJp: "原作では",
    textJp: "魔女グランチルダに連れ去られたバンジョーの妹チューティを助けるため、二人で冒険の旅に出た。一心同体のアクションで道を切り開き、様々なステージを駆け巡る。",
    titleJpEn: "In the Original Games",
    textJpEn: "The two set out on a journey together to rescue Banjo's sister Tooty, who was kidnapped by the witch Gruntilda. They open up the path with actions performed as one, racing through a variety of stages.",
    titlePt: "Nos Jogos Originais",
    textPt: "Os dois partem juntos numa jornada para resgatar Tooty, irmã de Banjo, sequestrada pela bruxa Gruntilda. Eles abrem caminho com ações realizadas como um só, correndo por uma variedade de cenários.",
  },
  {
    titleEn: "[★☆☆] Egg Firing (Neutral Special)",
    titleJp: "タマゴミサイル 【通常必殺ワザ】",
    textJp: "カズーイの口から、タマゴを発射する。タマゴは、地形に落ちるとバウンドし、相手に当たると破裂する。",
    titleJpEn: "Egg Firing (Neutral Special)",
    textJpEn: "Fires an egg from Kazooie's mouth. The egg bounces when it lands on the terrain, and bursts if it hits an opponent.",
    titlePt: "Disparo de Ovo (Especial Neutro)",
    textPt: "Dispara um ovo da boca de Kazooie. O ovo quica ao cair no cenário, e estoura se atingir um oponente.",
  },
  {
    titleEn: "[★☆☆] Breegull Blaster (Neutral Special)",
    titleJp: "タマゴばきゅーん 【通常必殺ワザ】",
    textJp: "ボタン長押しで、バンジョーがカズーイを抱えたタマゴばきゅーん状態になり、タマゴをすばやく連射する。連射しながら、移動やジャンプもできる。",
    titleJpEn: "Breegull Blaster (Neutral Special)",
    textJpEn: "Holding the button makes Banjo hold Kazooie in the Breegull Blaster stance, firing eggs rapidly. He can also move and jump while firing continuously.",
    titlePt: "Breegull Blaster (Especial Neutro)",
    textPt: "Segurar o botão faz Banjo segurar Kazooie na postura Breegull Blaster, disparando ovos rapidamente. Ele também pode se mover e pular enquanto dispara continuamente.",
  },
  {
    titleEn: "[★☆☆] Canceling Breegull Blaster (Neutral Special)",
    titleJp: "タマゴばきゅーんの解除 【通常必殺ワザ】",
    textJp: "タマゴばきゅーん状態は、他の必殺ワザ、シールド、しゃがみ入力で解除できる。入力したボタンを押しっぱなしにすると、そのまま必殺ワザやシールドにつなげられる。",
    titleJpEn: "Canceling Breegull Blaster (Neutral Special)",
    textJpEn: "The Breegull Blaster stance can be canceled with another special move, a shield, or a crouch input. Holding down the input button lets you flow directly into that special move or shield.",
    titlePt: "Cancelando o Breegull Blaster (Especial Neutro)",
    textPt: "A postura do Breegull Blaster pode ser cancelada com outro golpe especial, um escudo, ou um input de agachar. Segurar o botão de input permite emendar diretamente naquele golpe especial ou escudo.",
  },
  {
    titleEn: "[★☆☆] Breegull Blaster Power (Neutral Special)",
    titleJp: "タマゴばきゅーんの威力 【通常必殺ワザ】",
    textJp: "タマゴの威力は、連射し続けると下がってしまう。最大2段階下がるが、タマゴばきゅーん状態を解除しておくと、元に戻っていく。",
    titleJpEn: "Breegull Blaster Power (Neutral Special)",
    textJpEn: "The egg's power decreases if you keep firing rapidly. It can drop up to 2 stages, but it will return to normal once you exit the Breegull Blaster stance.",
    titlePt: "Poder do Breegull Blaster (Especial Neutro)",
    textPt: "O poder do ovo diminui se você continuar disparando rapidamente. Pode cair até 2 estágios, mas volta ao normal assim que você sai da postura do Breegull Blaster.",
  },
  {
    titleEn: "[★☆☆] Wonderwing (Side Special)",
    titleJp: "ワンダーウイング 【横必殺ワザ】",
    textJp: "きんのハネを消費して、無敵状態で突進する。強力な体当たりで、復帰にも役立つが、ハネがなくなると発動しない。",
    titleJpEn: "Wonderwing (Side Special)",
    textJpEn: "Consumes a Golden Feather to charge forward while invincible. The powerful tackle is also useful for recovery, but it can't be used once you run out of feathers.",
    titlePt: "Wonderwing (Especial Lateral)",
    textPt: "Consome uma Pena Dourada para avançar invencível. O golpe de corpo poderoso também é útil para recuperação, mas não pode ser usado quando as penas acabam.",
  },
  {
    titleEn: "[★☆☆] Wonderwing Tackle (Side Special)",
    titleJp: "ワンダーウイングの突進 【横必殺ワザ】",
    textJp: "突進中は、相手の攻撃を受けてもダメージを受けず、ひるまない。ただし、シールドで防がれると、スキだらけになるので注意。",
    titleJpEn: "Wonderwing Tackle (Side Special)",
    textJpEn: "While charging, he takes no damage and doesn't flinch even if hit by an opponent's attack. However, be careful — if it's blocked by a shield, he'll be left wide open.",
    titlePt: "Investida do Wonderwing (Especial Lateral)",
    textPt: "Durante a investida, ele não sofre dano nem se abala mesmo se atingido pelo ataque de um oponente. Porém, cuidado — se for bloqueado por um escudo, ele fica totalmente exposto.",
  },
  {
    titleEn: "[★☆☆] Wonderwing Feather (Side Special)",
    titleJp: "ワンダーウイングのハネ 【横必殺ワザ】",
    textJp: "きんのハネは、通常は５枚、サドンデスでは１枚使える。消費したきんのハネは、ミスになるまで回復しない。",
    titleJpEn: "Wonderwing Feather (Side Special)",
    textJpEn: "He can use 5 Golden Feathers in a standard battle, and 1 in Sudden Death. Consumed Golden Feathers don't recover until he's KO'd.",
    titlePt: "Pena do Wonderwing (Especial Lateral)",
    textPt: "Ele pode usar 5 Penas Douradas numa partida padrão, e 1 na Morte Súbita. Penas Douradas consumidas não se recuperam até ele ser nocauteado.",
  },
  {
    titleEn: "[★☆☆] Wonderwing in Stamina Mode (Side Special)",
    titleJp: "体力制でのワンダーウイング 【横必殺ワザ】",
    textJp: "体力制の時は、最初の体力によって、使えるきんのハネの枚数が変わる。",
    titleJpEn: "Wonderwing in Stamina Mode (Side Special)",
    textJpEn: "In Stamina Mode, the number of usable Golden Feathers changes depending on the starting stamina amount.",
    titlePt: "Wonderwing no Modo Resistência (Especial Lateral)",
    textPt: "No Modo Resistência, o número de Penas Douradas utilizáveis muda dependendo da quantidade inicial de resistência.",
  },
  {
    titleEn: "[★☆☆] Shock Spring Jump (Up Special)",
    titleJp: "ショックジャンプの特性 【上必殺ワザ】",
    textJp: "ジャンプ台で、まっすぐ真上に跳び上がる。落下に転じた後、自由に移動や攻撃ができる、珍しいワザ。",
    titleJpEn: "Shock Spring Jump Characteristics (Up Special)",
    textJpEn: "Uses a springboard to leap straight up. A rare move that lets him freely move and attack once he starts falling.",
    titlePt: "Características do Shock Spring Jump (Especial Superior)",
    textPt: "Usa um trampolim para saltar reto para cima. Um golpe raro que permite se mover e atacar livremente assim que começa a cair.",
  },
  {
    titleEn: "[★☆☆] Shock Spring Jump Charge (Up Special)",
    titleJp: "ショックジャンプのため 【上必殺ワザ】",
    textJp: "足元にジャンプ台を呼び出してジャンプする時、ボタン長押しで力をためると、より高く跳べる。",
    titleJpEn: "Shock Spring Jump Charge (Up Special)",
    textJpEn: "When summoning a springboard underfoot to jump, holding the button to charge power lets him jump higher.",
    titlePt: "Carga do Shock Spring Jump (Especial Superior)",
    textPt: "Ao invocar um trampolim sob os pés para pular, segurar o botão para carregar energia permite pular mais alto.",
  },
  {
    titleEn: "[★☆☆] Attacking with Shock Spring Pad (Up Special)",
    titleJp: "ジャンプ台で攻撃 【上必殺ワザ】",
    textJp: "落としたジャンプ台は、相手にぶつけることができる。攻撃力は、ためても変わらない。",
    titleJpEn: "Attacking with the Shock Spring Pad (Up Special)",
    textJpEn: "The dropped springboard can hit opponents. Its attack power doesn't change even if the move was charged.",
    titlePt: "Atacando com o Shock Spring Pad (Especial Superior)",
    textPt: "O trampolim derrubado pode acertar oponentes. Seu poder de ataque não muda mesmo que o golpe tenha sido carregado.",
  },
  {
    titleEn: "[★☆☆] Rear Egg (Down Special)",
    titleJp: "おケツタマゴ 【下必殺ワザ】",
    textJp: "後ろ斜め上に向かって、カズーイがばくだんエッグを発射する。おしり側に発射するので、向き直ってから撃とう。",
    titleJpEn: "Rear Egg (Down Special)",
    textJpEn: "Kazooie fires a grenade egg diagonally upward behind them. Since it's fired from behind, turn around first before shooting.",
    titlePt: "Rear Egg (Especial Inferior)",
    textPt: "Kazooie dispara um ovo-granada na diagonal para trás e para cima. Como é disparado por trás, vire-se antes de atirar.",
  },
  {
    titleEn: "[★☆☆] Rear Egg's Characteristics (Down Special)",
    titleJp: "おケツタマゴの特性 【下必殺ワザ】",
    textJp: "ばくだんエッグは、タマゴの形に沿ってはずむ。また、拾って投げることができるが、時間経過で爆発すると、自分もダメージを受ける。",
    titleJpEn: "Rear Egg's Characteristics (Down Special)",
    textJpEn: "The grenade egg bounces following its egg shape. It can also be picked up and thrown, but if it explodes from its timer running out, it will also damage you.",
    titlePt: "Características do Rear Egg (Especial Inferior)",
    textPt: "O ovo-granada quica seguindo seu formato de ovo. Ele também pode ser pego e arremessado, mas se explodir por causa do temporizador, também causa dano em você.",
  },
  {
    titleEn: "[★☆☆] Only One Rear Egg (Down Special)",
    titleJp: "おケツタマゴは１つまで 【下必殺ワザ】",
    textJp: "前のばくだんエッグが残っている間は、新しいばくだんエッグを発射できない。再度ワザを出そうとしても、スキができてしまう。",
    titleJpEn: "Only One Rear Egg at a Time (Down Special)",
    textJpEn: "As long as the previous grenade egg still exists, a new one can't be fired. Trying to use the move again will leave you open.",
    titlePt: "Só um Rear Egg por Vez (Especial Inferior)",
    textPt: "Enquanto o ovo-granada anterior ainda existir, um novo não pode ser disparado. Tentar usar o golpe de novo deixa você vulnerável.",
  },
  {
    titleEn: "[★☆☆] The Mighty Jinjonator (Final Smash)",
    titleJp: "ジンジョネーター 【最後の切りふだ】",
    textJp: "地面から、石像を呼び出す。相手に当たると、石像の中からジンジョネーターが覚醒。ジンジョーたちと共に、相手に高速の連続体当たりをくらわせて、ふっとばす。",
    titleJpEn: "The Mighty Jinjonator (Final Smash)",
    textJpEn: "Summons a stone statue from the ground. If it hits an opponent, the Mighty Jinjonator awakens from within the statue. Together with the Jinjos, it unleashes a rapid series of tackles on the opponent, launching them.",
    titlePt: "The Mighty Jinjonator (Ataque Final)",
    textPt: "Invoca uma estátua de pedra do chão. Se acertar um oponente, o Mighty Jinjonator desperta de dentro da estátua. Junto com os Jinjos, ele desfere uma sequência rápida de investidas no oponente, lançando-o.",
  },
  {
    titleEn: "[★☆☆] Twirling Wing Whack (Neutral Air Attack)",
    titleJp: "回転ウイングアタック 【通常空中攻撃】",
    textJp: "カズーイが翼を広げて回転し、全方位に攻撃する。上下より横方向のほうが、少し遠くまで届く。",
    titleJpEn: "Twirling Wing Whack (Neutral Air Attack)",
    textJpEn: "Kazooie spreads her wings and spins, attacking in all directions. It reaches slightly farther to the sides than up or down.",
    titlePt: "Twirling Wing Whack (Ataque Aéreo Neutro)",
    textPt: "Kazooie estende as asas e gira, atacando em todas as direções. Ele alcança um pouco mais longe para os lados do que para cima ou para baixo.",
  },
  {
    titleEn: "[★★☆] Beak Buster (Down Air Attack)",
    titleJp: "くちばしバスター 【下空中攻撃】",
    textJp: "ワザの出始めに、メテオ効果がある。ただし、急降下するので、自滅に気をつけよう。",
    titleJpEn: "Beak Buster (Down Air Attack)",
    textJpEn: "This move has a meteor effect at the start. However, since it dives quickly, be careful not to self-destruct.",
    titlePt: "Beak Buster (Ataque Aéreo Inferior)",
    textPt: "Esse golpe tem efeito meteoro no início. Porém, como ele mergulha rapidamente, cuidado para não se autodestruir.",
  },
  {
    titleEn: "[★☆☆] Downward Throw",
    titleJp: "下投げ",
    textJp: "つかんだ相手を、地面に埋める。蓄積ダメージが高いほど、埋まっている時間が長くなる。",
    titleJpEn: "Downward Throw",
    textJpEn: "Buries a grabbed opponent in the ground. The higher their accumulated damage, the longer they stay buried.",
    titlePt: "Arremesso para Baixo",
    textPt: "Enterra um oponente agarrado no chão. Quanto maior o dano acumulado dele, mais tempo ele fica enterrado.",
  },
  {
    titleEn: "[★☆☆] Midair Jump",
    titleJp: "空中ジャンプ",
    textJp: "2回まで、空中ジャンプすることができる。上必殺ワザの後にもジャンプできるので、復帰しやすい。",
    titleJpEn: "Midair Jump",
    textJpEn: "Can perform up to 2 midair jumps. Since they can also jump after using the up special, recovery is easier.",
    titlePt: "Pulo Aéreo",
    textPt: "Pode realizar até 2 pulos aéreos. Como também podem pular depois de usar o especial superior, a recuperação fica mais fácil.",
  },
  {
    titleEn: "[★☆☆] Kazooie's Characteristics",
    titleJp: "カズーイの特性",
    textJp: "カズーイは、普段は相手の攻撃に当たらない。ただし、走行中は相手の攻撃が当たるので注意。",
    titleJpEn: "Kazooie's Characteristics",
    textJpEn: "Kazooie normally can't be hit by opponents' attacks. However, be careful, since she can be hit while running.",
    titlePt: "Características de Kazooie",
    textPt: "Kazooie normalmente não pode ser atingida pelos ataques do oponente. Porém, cuidado, pois ela pode ser atingida enquanto corre.",
  },
  {
    titleEn: "[★☆☆] Talon Trot",
    titleJp: "カズーイダッシュ",
    textJp: "走行時は、リュックから出てきたカズーイが、バンジョーを背負う。原作では、移動速度が上がり急な斜面も登れるため、多用されるアクションだった。",
    titleJpEn: "Talon Trot",
    textJpEn: "While running, Kazooie comes out of the backpack and carries Banjo on her back. In the original games, this was a frequently used action since it increases movement speed and lets them climb steep slopes.",
    titlePt: "Talon Trot",
    textPt: "Durante a corrida, Kazooie sai da mochila e carrega Banjo nas costas. Nos jogos originais, essa era uma ação bastante usada, já que aumenta a velocidade de movimento e permite subir ladeiras íngremes.",
  },
];

async function main() {
  const banjo = await db.fighter.findFirst({
    where: { name: { contains: "Banjo", mode: "insensitive" } },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!banjo) { console.log("Banjo & Kazooie not found"); return; }

  await db.fighter.update({
    where: { id: banjo.id },
    data: {
      curatorOverviewEn: "Banjo & Kazooie split their toolkit between straightforward projectile spam and high-commitment gambles. Breegull Blaster turns the neutral special into sustained mobile fire — Banjo can move and jump while Kazooie unloads eggs, though the power drops the longer you hold it down, recovering only once you let go — and it cancels cleanly into a shield, crouch, or another special if you need to bail. Wonderwing is the opposite: five uses per stock (one in Sudden Death) of a fully invincible, no-flinch charge that's great for both offense and recovery, but a shield eats it entirely and leaves Banjo wide open, and once the feathers are gone they don't come back until he's KO'd. Rear Egg fires behind them rather than in front, so it takes some getting used to, and only one grenade egg can exist at a time — pick it up too slowly and it can go off in your own hands. Shock Spring Jump is a rare recovery option that lets Banjo act freely after the peak of the jump, and the dropped springboard itself can still hit as a leftover trap. Between the double jump, that free-action window after Shock Spring Jump, and Kazooie's own passive immunity to most hits (she's only vulnerable while actively running), the duo has more ways back to the stage than most — they just have to manage a very literal limited-use resource to get the most out of their most dangerous option.",
      curatorOverviewPt: "Banjo & Kazooie dividem o kit entre spam direto de projétil e apostas de alto comprometimento. Breegull Blaster transforma o especial neutro em disparo móvel sustentado — Banjo pode se mover e pular enquanto Kazooie descarrega ovos, embora o poder caia quanto mais tempo você segurar, só voltando ao normal quando você soltar — e cancela de forma limpa num escudo, agachamento, ou outro especial se precisar sair da jogada. Wonderwing é o oposto: cinco usos por stock (um na Morte Súbita) de uma investida totalmente invencível e sem hesitação, ótima tanto pra ataque quanto pra recuperação, mas um escudo a anula completamente e deixa Banjo totalmente exposto, e quando as penas acabam elas só voltam quando ele é nocauteado. Rear Egg dispara para trás em vez de para frente, então exige um pouco de costume, e só pode existir um ovo-granada por vez — demorar demais pra pegá-lo de volta pode fazer ele explodir nas próprias mãos. Shock Spring Jump é uma opção rara de recuperação que permite Banjo agir livremente após o pico do pulo, e o trampolim derrubado ainda pode acertar como uma armadilha residual. Entre o pulo duplo, essa janela de ação livre depois do Shock Spring Jump, e a imunidade passiva de Kazooie à maioria dos golpes (ela só fica vulnerável enquanto corre ativamente), a dupla tem mais formas de voltar ao palco do que a maioria — só precisam gerenciar um recurso de uso limitado bem literal pra tirar o máximo proveito da opção mais perigosa.",
      curatorOverviewJp: "バンジョー＆カズーイの技構成は、素直な飛び道具の連射と、大きく踏み込む賭けに分かれている。「タマゴばきゅーん」は通常必殺ワザを持続的な移動射撃に変える——バンジョーはカズーイがタマゴを撃ち続けている間も移動やジャンプができるが、押し続けるほど威力が下がり、離すまで元に戻らない——そして必要ならシールドやしゃがみ、別の必殺ワザにきれいにキャンセルできる。「ワンダーウイング」はその逆だ。ストックごとに５回（サドンデスでは１回）、完全無敵でひるまない突進を使え、攻撃にも復帰にも優れているが、シールドで防がれると丸ごと無効化され、バンジョーは丸裸になる。しかもハネがなくなると、撃墜されるまで戻ってこない。「おケツタマゴ」は前ではなく後ろに発射するため、少し慣れが必要で、ばくだんエッグは同時に１つしか存在できない——回収が遅れると自分の手の中で爆発することもある。「ショックジャンプ」は珍しい復帰技で、ジャンプの頂点を過ぎた後、バンジョーは自由に行動できる。落としたジャンプ台自体も、残された罠として相手に当たる。２段ジャンプ、ショックジャンプ後の自由行動の間、そしてカズーイ自身がほとんどの攻撃に受け付けない受動的な免疫（走っている間だけ攻撃を受ける）を組み合わせれば、このコンビは多くのファイターより多彩な復帰手段を持つ——ただし、一番危険な選択肢を最大限に活かすには、まさに文字通りの限られた資源をうまく管理する必要がある。",
      curatorOverviewJpEn: "Banjo & Kazooie's moveset splits between straightforward projectile spam and high-commitment gambles. \"Breegull Blaster\" turns the neutral special into sustained mobile fire — Banjo can move and jump while Kazooie keeps firing eggs, but the longer you hold it down, the more the power drops, only returning to normal once you release it — and it cancels cleanly into a shield, crouch, or another special move when needed. \"Wonderwing\" is the opposite: five uses per stock (one during Sudden Death) of a fully invincible, flinch-free charge that excels at both offense and recovery, but it's completely negated if blocked by a shield, leaving Banjo completely exposed. And once the feathers run out, they don't return until he's KO'd. \"Rear Egg\" fires backward instead of forward, taking some getting used to, and only one grenade egg can exist at a time — pick it up too slowly and it can explode right in your own hands. \"Shock Spring Jump\" is a rare recovery move that lets Banjo act freely after passing the peak of the jump, and the dropped springboard itself can still hit as a leftover trap. Combine the double jump, the free-action window after Shock Spring Jump, and Kazooie's own passive immunity to most attacks (she's only vulnerable while running), and this duo has more varied recovery options than most fighters — they just need to manage a very literal limited resource well to make the most of their most dangerous option.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = banjo.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: banjo.id }, data: { curationStatus: "approved" } });
  console.log("✅ Banjo & Kazooie aprovados");

  // Sem FighterMove (0 registros) — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista Banjo-Kazooie/Nuts & Bolts corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.

  await db.$disconnect();
}
main().catch(console.error);
