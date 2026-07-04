import { db } from "../../lib/db";

const BIO_JPEN_PT: Record<string, { jpEn: string; pt: string }> = {
  SSBB: {
    jpEn: "A ferocious plant that lives in pipes. Since it emerges from pipes with its mouth open, be careful — if you try to step on it, it will live up to its name and \"chomp\" you right up. It stops appearing if Mario stands right beside or on top of the pipe. Using this trait along with fireballs makes it easy to defeat. However, some entries in the series go against this trait.",
    pt: "Uma planta feroz que vive em tubos. Como ela emerge dos tubos com a boca aberta, cuidado — se você tentar pisar nela, ela vai fazer jus ao nome e vai te \"morder\". Ela para de aparecer se Mario ficar bem ao lado ou em cima do tubo. Usar essa característica junto com bolas de fogo facilita derrotá-la. Porém, alguns jogos da série fogem dessa característica.",
  },
  SSB4: {
    jpEn: "This flower isn't a carnivorous plant so much as a Mario-vorous one. It comes in an enormous variety — Big Piranha, Fire Piranha, Jurassic Piranha, Lick Piranha, Munching Piranha, Petit Piranha, Bony Piranha, Ghost Piranha... and even that's still only a small fraction of them. Turning it into a song set to music might make it easier to remember.",
    pt: "Essa flor não é bem uma planta carnívora, é mais uma planta \"Mario-vora\". Ela vem numa variedade enorme — Piranha Grande, Piranha de Fogo, Piranha Jurássica, Piranha Lambedora, Piranha Mastigadora, Piranha Pequena, Piranha de Osso, Piranha Fantasma... e mesmo assim isso ainda é só uma pequena fração delas. Transformar isso em uma música pode ajudar a decorar mais fácil.",
  },
};

const TIPS = [
  {
    titleEn: "[★☆☆] Piranha Plant's Origins",
    titleJp: "パックンフラワーの初登場作品",
    textJp: "パックンフラワーの初登場は、１９８５年発売の『スーパーマリオブラザーズ』。主に土管に生息している植物で、急に顔を出してくる。",
    titleJpEn: "Piranha Plant's Debut Work",
    textJpEn: "Piranha Plant's debut was in Super Mario Bros., released in 1985. It's a plant that mainly lives in pipes, and it suddenly pokes its head out.",
    titlePt: "As Origens de Piranha Plant",
    textPt: "A estreia de Piranha Plant foi em Super Mario Bros., lançado em 1985. É uma planta que vive principalmente em tubos, e aparece de repente colocando a cabeça para fora.",
  },
  {
    titleEn: "[★☆☆] Types of Piranha Plants",
    titleJp: "パックンフラワーの種類",
    textJp: "パックンフラワーの亜種は、約６０種類存在する。姿も能力も、それぞれに個性豊か。",
    titleJpEn: "Types of Piranha Plants",
    textJpEn: "There are about 60 subspecies of Piranha Plant. Each one is rich in individuality, both in appearance and ability.",
    titlePt: "Tipos de Piranha Plant",
    textPt: "Existem cerca de 60 subespécies de Piranha Plant. Cada uma é rica em individualidade, tanto na aparência quanto nas habilidades.",
  },
  {
    titleEn: "[★☆☆] In Its Series",
    titleJp: "原作では",
    textJp: "元々は、緑色に黄色い斑点がついた姿をしていた。赤色に白い斑点がついた姿は、『スーパーマリオブラザーズ3』からのもの。",
    titleJpEn: "In the Original Games",
    textJpEn: "Originally, it was green with yellow spots. The red version with white spots first appeared starting with Super Mario Bros. 3.",
    titlePt: "Nos Jogos Originais",
    textPt: "Originalmente, ela era verde com manchas amarelas. A versão vermelha com manchas brancas apareceu pela primeira vez em Super Mario Bros. 3.",
  },
  {
    titleEn: "[★☆☆] Ptooie (Neutral Special)",
    titleJp: "シューリンガンを飛ばす 【通常必殺ワザ】",
    textJp: "シューリンガンを吹き上げている時、左右へのスティック入力で、入力した方向に飛ばすことができる。",
    titleJpEn: "Launching the Spiked Ball (Neutral Special)",
    textJpEn: "While blowing the spiked ball upward, inputting the stick left or right lets you launch it in that direction.",
    titlePt: "Lançando a Bola com Espinhos (Especial Neutro)",
    textPt: "Enquanto sopra a bola com espinhos para cima, inputar o direcional para esquerda ou direita permite lançá-la naquela direção.",
  },
  {
    titleEn: "[★☆☆] Ptooie Height (Neutral Special)",
    titleJp: "シューリンガンの高さ 【通常必殺ワザ】",
    textJp: "必殺ワザボタンを押し続けると、シューリンガンを吹き上げて、高さを変えられる。口元に近いときほど、より遠くまで飛ばすことができる。",
    titleJpEn: "Spiked Ball Height (Neutral Special)",
    textJpEn: "Holding down the special-move button blows the spiked ball up, letting you change its height. The closer it is to the mouth, the farther it can be launched.",
    titlePt: "Altura da Bola com Espinhos (Especial Neutro)",
    textPt: "Segurar o botão de golpe especial sopra a bola com espinhos para cima, permitindo mudar sua altura. Quanto mais perto da boca ela estiver, mais longe pode ser lançada.",
  },
  {
    titleEn: "[★☆☆] Repeated Ptooie (Neutral Special)",
    titleJp: "シューリンガンの連続使用 【通常必殺ワザ】",
    textJp: "シューリンガンは、一度に１つしか出しておけない。消える前に次を出そうとすると、スキが出来てしまう。",
    titleJpEn: "Using the Spiked Ball Repeatedly (Neutral Special)",
    textJpEn: "Only one spiked ball can be out at a time. Trying to bring out another before the first one disappears will leave you open.",
    titlePt: "Uso Repetido da Bola com Espinhos (Especial Neutro)",
    textPt: "Só é possível ter uma bola com espinhos no ar por vez. Tentar lançar outra antes que a primeira desapareça deixa você vulnerável.",
  },
  {
    titleEn: "[★★☆] Ptooie Power (Neutral Special)",
    titleJp: "シューリンガンの威力 【通常必殺ワザ】",
    textJp: "シューリンガンは、地形やファイターに当たるたび、威力が下がっていく。また、床に落ちて速度が下がると、相手に当たらなくなって消える。",
    titleJpEn: "Spiked Ball's Power (Neutral Special)",
    textJpEn: "Each time the spiked ball hits the terrain or a fighter, its power decreases. Also, once it falls to the ground and loses speed, it stops being able to hit opponents and disappears.",
    titlePt: "Poder da Bola com Espinhos (Especial Neutro)",
    textPt: "A cada vez que a bola com espinhos atinge o cenário ou um lutador, seu poder diminui. Além disso, quando ela cai no chão e perde velocidade, deixa de acertar oponentes e desaparece.",
  },
  {
    titleEn: "[★☆☆] Charging Poison Breath (Side Special)",
    titleJp: "ポイズンブレスのため 【横必殺ワザ】",
    textJp: "必殺ワザボタンで、ため始め、もう一度入力すると毒霧を吐く。ためるほど、毒霧の大きさや出ている時間、ダメージ量が増加する。",
    titleJpEn: "Charging Poison Breath (Side Special)",
    textJpEn: "Press the special-move button to start charging, then press it again to spit out a poison cloud. The longer you charge, the bigger the cloud, the longer it lasts, and the more damage it deals.",
    titlePt: "Carregando o Sopro Venenoso (Especial Lateral)",
    textPt: "Pressione o botão de golpe especial para começar a carregar, depois pressione novamente para cuspir uma nuvem de veneno. Quanto mais tempo carregar, maior a nuvem, mais tempo ela dura, e mais dano ela causa.",
  },
  {
    titleEn: "[★★☆] Storing Poison Breath Charge (Side Special)",
    titleJp: "ポイズンブレスのためキャンセル 【横必殺ワザ】",
    textJp: "毒霧をためている間に、シールドや回避、ジャンプを行うと、ためを保持したまま動くことができる。",
    titleJpEn: "Canceling the Poison Breath Charge (Side Special)",
    textJpEn: "If you shield, dodge, or jump while charging the poison cloud, you can keep moving while retaining the charge.",
    titlePt: "Cancelando a Carga do Sopro Venenoso (Especial Lateral)",
    textPt: "Se você se defender, esquivar ou pular enquanto carrega a nuvem de veneno, pode continuar se movendo mantendo a carga.",
  },
  {
    titleEn: "[★★☆] Poison Breath Damage (Side Special)",
    titleJp: "ポイズンブレスの性質 【横必殺ワザ】",
    textJp: "毒霧は、相殺や吸収はされないが、カウンターは可能。また、毒霧の周囲よりも中心のほうが、攻撃力が高い。",
    titleJpEn: "Poison Breath's Properties (Side Special)",
    textJpEn: "The poison cloud can't be canceled out or absorbed, but it can be countered. Also, the center of the cloud deals more damage than its edges.",
    titlePt: "Propriedades do Sopro Venenoso (Especial Lateral)",
    textPt: "A nuvem de veneno não pode ser cancelada nem absorvida, mas pode ser rebatida por um contra-ataque. Além disso, o centro da nuvem causa mais dano do que as bordas.",
  },
  {
    titleEn: "[★★☆] Poison Breath's Duration (Side Special)",
    titleJp: "ポイズンブレスの継続時間 【横必殺ワザ】",
    textJp: "乱闘に参加しているファイターの人数が、多くなればなるほど、毒霧が出ている時間は、短くなっていく。",
    titleJpEn: "Poison Breath's Duration (Side Special)",
    textJpEn: "The more fighters that are participating in the brawl, the shorter the poison cloud's duration becomes.",
    titlePt: "Duração do Sopro Venenoso (Especial Lateral)",
    textPt: "Quanto mais lutadores estiverem participando da partida, mais curta fica a duração da nuvem de veneno.",
  },
  {
    titleEn: "[★☆☆] Piranhacopter (Up Special)",
    titleJp: "リーフローター 【上必殺ワザ】",
    textJp: "上昇している間、左右を入力すると、横に移動する。回転中の葉っぱは、周囲の相手を巻き込んで攻撃できる。",
    titleJpEn: "Piranhacopter (Up Special)",
    textJpEn: "Inputting left or right while rising moves it sideways. The spinning leaf can hit and attack nearby opponents caught in it.",
    titlePt: "Piranhacóptero (Especial Superior)",
    textPt: "Inputar esquerda ou direita durante a subida move para o lado. A folha giratória pode acertar e atacar oponentes próximos que forem pegos por ela.",
  },
  {
    titleEn: "[★☆☆] Long-Stem Strike Charge (Down Special)",
    titleJp: "ロングレンジパックンのため 【下必殺ワザ】",
    textJp: "必殺ワザボタンを押している間は、植木鉢や土管に収まったまま、力をためられる。ためる時間が長いほど、より遠くまで攻撃できる。",
    titleJpEn: "Charging Long-Stem Strike (Down Special)",
    textJpEn: "While holding the special-move button, it stays tucked in its flowerpot or pipe, charging power. The longer you charge, the farther the attack reaches.",
    titlePt: "Carregando o Ataque de Caule Longo (Especial Inferior)",
    textPt: "Enquanto segura o botão de golpe especial, ele fica recolhido no vaso ou no tubo, carregando energia. Quanto mais tempo carregar, mais longe o ataque alcança.",
  },
  {
    titleEn: "[★★☆] Long-Stem Strike Direction (Down Special)",
    titleJp: "ロングレンジパックンの向き 【下必殺ワザ】",
    textJp: "ため中にスティックを倒すと傾き、攻撃方向を変えられる。空中では、地上よりも大きく傾けられる。",
    titleJpEn: "Long-Stem Strike Direction (Down Special)",
    textJpEn: "Tilting the stick while charging leans it over, changing the attack's direction. It can lean farther in the air than on the ground.",
    titlePt: "Direção do Ataque de Caule Longo (Especial Inferior)",
    textPt: "Inclinar o direcional durante a carga o inclina, mudando a direção do ataque. Ele pode se inclinar mais no ar do que no chão.",
  },
  {
    titleEn: "[★★☆] Long-Stem Strike Armor (Down Special)",
    titleJp: "ため中のスーパーアーマー 【下必殺ワザ】",
    textJp: "ため中は、スーパーアーマー状態になる。ただし、伸びた後で植木鉢や土管に戻る時には、効果は消えてしまう。",
    titleJpEn: "Super Armor While Charging (Down Special)",
    textJpEn: "While charging, it gains super armor. However, that effect disappears once it extends and then returns to its flowerpot or pipe.",
    titlePt: "Superarmadura Durante a Carga (Especial Inferior)",
    textPt: "Enquanto carrega, ele ganha superarmadura. Porém, esse efeito desaparece assim que ele se estica e depois retorna ao vaso ou ao tubo.",
  },
  {
    titleEn: "[★★☆] Long-Stem Strike Bite (Down Special)",
    titleJp: "噛みつきのタイミング 【下必殺ワザ】",
    textJp: "伸びている時、相手ファイターが近くにいると、自動で噛みつく。伸びている最中にボタンを押せば、伸びきる前でも、その場で噛みつける。",
    titleJpEn: "Bite Timing (Down Special)",
    textJpEn: "If an opponent fighter is nearby while it's extended, it will automatically bite. If you press the button while it's extending, it can bite on the spot even before fully extending.",
    titlePt: "Timing da Mordida (Especial Inferior)",
    textPt: "Se um lutador oponente estiver perto enquanto ele está esticado, ele morde automaticamente. Se você pressionar o botão enquanto ele está se esticando, pode morder na hora, mesmo antes de se esticar completamente.",
  },
  {
    titleEn: "[★☆☆] Petey Piranha (Final Smash)",
    titleJp: "ボスパックン 【最後の切りふだ】",
    textJp: "カゴに触れた相手を２人まで閉じ込めて、大ダメージを与える。切りふだが終わるか、ボスパックンが撃墜されるまでは、脱出されない。",
    titleJpEn: "Petey Piranha (Final Smash)",
    textJpEn: "Traps up to two opponents who touch the cage and deals heavy damage. They can't escape until the Final Smash ends or Petey Piranha is KO'd.",
    titlePt: "Petey Piranha (Ataque Final)",
    textPt: "Prende até dois oponentes que tocarem na gaiola e causa grande dano. Eles não podem escapar até o Ataque Final acabar ou Petey Piranha ser nocauteado.",
  },
  {
    titleEn: "[★☆☆] Petey Piranha's Movement (Final Smash)",
    titleJp: "ボスパックンの動き 【最後の切りふだ】",
    textJp: "ボスパックンは、操作によって左右に移動することができる。ジャンプ入力をすると、高く跳び上がる。",
    titleJpEn: "Petey Piranha's Movement (Final Smash)",
    textJpEn: "Petey Piranha can be moved left or right. Inputting a jump makes him leap up high.",
    titlePt: "Movimento de Petey Piranha (Ataque Final)",
    textPt: "Petey Piranha pode ser movido para a esquerda ou direita. Inputar um pulo faz ele saltar bem alto.",
  },
  {
    titleEn: "[★★★] Push and Pull (Side Tilt Attack)",
    titleJp: "押しパックン / 引きパックン 【横強攻撃】",
    textJp: "ワザを出した後、すぐに攻撃ボタンを押すと、追加の噛みつき攻撃を行う。１段目が当たった時だけ、２段目を出すようにすれば、スキを抑えられる。",
    titleJpEn: "Push Piranha / Pull Piranha (Side Tilt Attack)",
    textJpEn: "Pressing the attack button right after using this move triggers an additional bite attack. Only following up with the second hit when the first one connects helps minimize how open you leave yourself.",
    titlePt: "Piranha Empurrão / Piranha Puxão (Ataque Inclinado Lateral)",
    textPt: "Pressionar o botão de ataque logo após usar esse golpe desencadeia um ataque de mordida adicional. Só emendar o segundo acerto quando o primeiro conectar ajuda a minimizar a vulnerabilidade.",
  },
  {
    titleEn: "[★★★] Pull Technique (Side Tilt Attack)",
    titleJp: "引きパックンのテクニック 【横強攻撃】",
    textJp: "２段目は、少し遅れて入力しても発動する。１段目がシールドされた時、遅らせた２段目で相手の反撃に対処することも可能。",
    titleJpEn: "Pull Piranha Technique (Side Tilt Attack)",
    textJpEn: "The second hit will still come out even with a slightly delayed input. If the first hit is shielded, a delayed second hit can also be used to deal with the opponent's counterattack.",
    titlePt: "Técnica do Piranha Puxão (Ataque Inclinado Lateral)",
    textPt: "O segundo acerto ainda sai mesmo com um input levemente atrasado. Se o primeiro acerto for bloqueado, um segundo acerto atrasado também pode ser usado para lidar com o contra-ataque do oponente.",
  },
  {
    titleEn: "[★☆☆] Prickly Swing (Side Smash Attack)",
    titleJp: "イガイガスイング 【横スマッシュ攻撃】",
    textJp: "横スマッシュ攻撃を放つ瞬間は、イガイガパックンに変化する。『スーパーマリオギャラクシー2』に登場した、頭にもトゲが生えている姿。",
    titleJpEn: "Prickly Swing (Side Smash Attack)",
    textJpEn: "At the moment it unleashes the side smash attack, it turns into a Prickly Piranha Plant. This is the form with spikes growing on its head, which appeared in Super Mario Galaxy 2.",
    titlePt: "Balanço Espinhoso (Ataque Smash Lateral)",
    textPt: "No momento em que desfere o ataque smash lateral, ele se transforma em uma Piranha Plant Espinhosa. Essa é a forma com espinhos crescendo na cabeça, que apareceu em Super Mario Galaxy 2.",
  },
  {
    titleEn: "[★☆☆] Fire Breath (Back Air Attack)",
    titleJp: "火炎ふき 【後空中攻撃】",
    textJp: "口から爆炎を出して、攻撃するワザ。見た目にふさわしく、相手を大きくふっとばす。",
    titleJpEn: "Fire Breath (Back Aerial Attack)",
    textJpEn: "A move that attacks by spewing an explosive flame from its mouth. Fitting its appearance, it launches opponents a great distance.",
    titlePt: "Sopro de Fogo (Ataque Aéreo Traseiro)",
    textPt: "Um golpe que ataca cuspindo uma chama explosiva pela boca. Combinando com sua aparência, ele lança os oponentes por uma grande distância.",
  },
  {
    titleEn: "[★★☆] Flowerpot Meteor (Down Air Attack)",
    titleJp: "植木鉢メテオ / 土管メテオ 【下空中攻撃】",
    textJp: "ワザの出始めに、メテオ効果がある。浮かび上がった鉢や土管が素早く振り下ろされるため、奇襲にも向いている。",
    titleJpEn: "Flowerpot Meteor / Pipe Meteor (Down Aerial Attack)",
    textJpEn: "The start of this move has a meteor effect. Since the risen pot or pipe swings down quickly, it's also well-suited for surprise attacks.",
    titlePt: "Meteoro de Vaso / Meteoro de Tubo (Ataque Aéreo Inferior)",
    textPt: "O início desse golpe tem efeito meteoro. Como o vaso ou tubo erguido é derrubado rapidamente, também é adequado para ataques surpresa.",
  },
  {
    titleEn: "[★☆☆] Attack When Stepped On",
    titleJp: "踏まれて攻撃",
    textJp: "しゃがんでいる時、相手に踏みつけられると、自動的に噛みつく。原作でも得意とする、待ち伏せ攻撃。",
    titleJpEn: "Attack When Stepped On",
    textJpEn: "While crouching, if an opponent steps on it, it automatically bites. This is an ambush attack it's also known for in the original games.",
    titlePt: "Ataque ao Ser Pisado",
    textPt: "Enquanto está agachado, se um oponente pisar nele, ele morde automaticamente. Esse é um ataque de emboscada pelo qual ele também é conhecido nos jogos originais.",
  },
  {
    titleEn: "[★☆☆] Costumes",
    titleJp: "プレイヤーカラーによる変化",
    textJp: "パックンフラワーは、奇数カラーでは植木鉢、偶数カラーでは、土管から生えている。",
    titleJpEn: "Costumes",
    textJpEn: "Piranha Plant grows out of a flowerpot in its odd-numbered colors, and out of a pipe in its even-numbered colors.",
    titlePt: "Trajes",
    textPt: "Piranha Plant cresce de um vaso em suas cores de número ímpar, e de um tubo em suas cores de número par.",
  },
];

async function main() {
  const pp = await db.fighter.findFirst({
    where: { name: "Piranha Plant" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!pp) { console.log("Piranha Plant not found"); return; }

  await db.fighter.update({
    where: { id: pp.id },
    data: {
      curatorOverviewEn: "Piranha Plant leans hard into zoning and disjoint. Ptooie's spiked ball can be redirected left or right while it's still airborne, and holding it near the mouth lets it travel farther once launched — though it loses power with every bounce and vanishes once it's too slow to threaten anyone. Poison Breath rewards patience: the charge can be canceled into a shield, dodge, or jump without losing it, letting Piranha Plant reposition before releasing a cloud that punishes contact from the center outward and shrinks as the match gets more crowded. Long-Stem Strike is a full-commitment grab-and-bite that gains super armor while charging (lost the instant it whiffs and retracts), aimable further in the air than on the ground, and it can even bite early if you time the button before it fully extends. Its side tilt's second hit can be delayed to bait a shielding opponent into dropping their guard, and its aerials lean on gimmicks tied to its own lore — a spiky Mario Galaxy 2 form on the smash attack, a meteor effect on the way down with the flowerpot or pipe, and an automatic bite if anyone tries to stomp it while it's crouched, straight out of the source games. Between the projectile, the poison cloud, and the long-range grab, Piranha Plant is built to control space from a distance rather than fight up close.",
      curatorOverviewPt: "Piranha Plant aposta pesado em controle de espaço e alcance desconexo. A bola com espinhos do Ptooie pode ser redirecionada para esquerda ou direita ainda no ar, e segurá-la perto da boca faz ela viajar mais longe quando lançada — embora perca força a cada quique e desapareça quando fica lenta demais pra ameaçar alguém. Poison Breath recompensa a paciência: a carga pode ser cancelada num escudo, esquiva ou pulo sem se perder, permitindo que Piranha Plant se reposicione antes de soltar uma nuvem que pune mais o contato no centro do que nas bordas e encolhe conforme a partida fica mais cheia. Long-Stem Strike é um agarrão de comprometimento total que ganha superarmadura durante a carga (perdida no instante em que erra e se recolhe), mirável mais longe no ar do que no chão, e pode até morder cedo se você acertar o timing do botão antes dele se esticar completamente. O segundo acerto do ataque inclinado lateral pode ser atrasado pra fisgar um oponente que solta o escudo cedo demais, e os ataques aéreos dela se apoiam em referências à própria série — uma forma espinhosa de Mario Galaxy 2 no ataque smash, efeito meteoro na descida com o vaso ou tubo, e uma mordida automática se alguém tentar pisar nela enquanto está agachada, direto dos jogos originais. Entre o projétil, a nuvem de veneno e o agarrão de longo alcance, Piranha Plant é construída pra controlar o espaço à distância em vez de brigar de perto.",
      curatorOverviewJp: "パックンフラワーはゾーニングとリーチの噛み合わなさに強く寄せた技構成だ。「シューリンガン」の鉄球は空中にある間、左右に打ち出し直せて、口元近くで持てば発射時により遠くまで飛ぶが、跳ねるたびに威力を失い、遅くなりすぎると誰にも脅威を与えなくなって消える。「ポイズンブレス」は忍耐を報いる技だ——ためをシールド・回避・ジャンプでキャンセルしても保持できるため、パックンフラワーは毒霧を放つ前に位置を調整でき、その毒霧は中心に近いほど大きなダメージを与え、乱闘の参加人数が増えるほど持続時間が短くなる。「ロングレンジパックン」は完全に踏み込む必要のあるつかみ噛みつき技で、ため中はスーパーアーマーを得るが（外して引っ込む瞬間に失う）、地上よりも空中の方が狙いを大きく変えられ、伸びきる前でもボタンのタイミングを合わせれば早く噛みつくこともできる。横強攻撃の２段目は入力を遅らせてシールドを下げた相手を誘うことができ、空中攻撃は自身のシリーズ由来のギミックに頼っている——横スマッシュ攻撃では『スーパーマリオギャラクシー2』由来のトゲトゲの姿になり、下降中には鉢や土管によるメテオ効果があり、しゃがんでいる時に踏まれると原作そのままに自動で噛みつく。飛び道具、毒霧、そして長距離のつかみ技により、パックンフラワーは近接戦よりも距離を取って空間を支配するように作られている。",
      curatorOverviewJpEn: "Piranha Plant leans heavily into zoning and mismatched reach. \"Ptooie\"'s spiked ball can be redirected left or right while still airborne, and holding it near the mouth makes it fly farther when launched, but it loses power with each bounce and disappears once it becomes too slow to threaten anyone. \"Poison Breath\" is a move that rewards patience — the charge can be retained even when canceled into a shield, dodge, or jump, letting Piranha Plant adjust its position before releasing a poison cloud that deals more damage closer to its center, and whose duration shortens as more fighters join the brawl. \"Long-Stem Strike\" is a grab-and-bite move that requires full commitment, gaining super armor while charging (lost the instant it whiffs and retracts), and it can aim much further in the air than on the ground, even biting early if you time the button before it's fully extended. The side tilt's second hit can be delayed to bait an opponent into dropping their shield, and its aerials lean on gimmicks tied to its own series — turning spiky, as seen in Super Mario Galaxy 2, on the side smash attack, having a meteor effect from the flowerpot or pipe on the way down, and automatically biting if someone tries to step on it while crouching, straight from the source games. Between the projectile, the poison cloud, and the long-range grab, Piranha Plant is built to dominate space from a distance rather than fight up close.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_JPEN_PT)) {
    const bio = pp.bios.find(b => b.smashGameVersion === version);
    if (!bio) { console.log(`  ⚠️  Bio não encontrada: ${version}`); continue; }
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = pp.tips.find(t => t.titleEn === data.titleEn);
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

  // Bug conhecido: videoEndSec corrompido no Brawl. Corrigido com timing do usuário (34:40-34:57).
  await db.collectible.update({
    where: { id: "TROPHY-SSBB-Piranha Plant-Piranha Plant" },
    data: { videoStartSec: 2080, videoEndSec: 2097 },
  });
  console.log("✅ Vídeo SSBB (Piranha Plant) corrigido: 2080-2097");

  // Petey Piranha (SSBB) também tinha videoEndSec corrompido (128880), mas o usuário não forneceu
  // o timing correto — decisão do usuário: zerar por enquanto em vez de adivinhar.
  await db.collectible.update({
    where: { id: "TROPHY-SSBB-Piranha Plant-Petey Piranha" },
    data: { videoStartSec: null, videoEndSec: null },
  });
  console.log("✅ Vídeo corrompido do Petey Piranha (SSBB) zerado (aguardando timing correto)");

  await db.fighter.update({ where: { id: pp.id }, data: { curationStatus: "approved" } });
  console.log("✅ Piranha Plant aprovado");

  // Sem FighterMove (0 registros) — padrão de newcomer/DLC, não é lacuna.
  // Chronicle links dos troféus já corretos (Super Mario Bros., Super Mario Bros. 3, Super Mario Sunshine, New Super Mario Bros.).

  await db.$disconnect();
}
main().catch(console.error);
