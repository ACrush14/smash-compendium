import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Byleth's Origins",
    titleJp: "ベレト / ベレスの初登場作品",
    textJp: "ベレトとベレスの初登場は、２０１９年発売の『ファイアーエムブレム 風花雪月』。士官学校の教師として、３つの学級から１つを選んで担任し、生徒たちを導いていく。",
    titleJpEn: "Byleth's Debut Work",
    textJpEn: "Byleth's first appearance was in Fire Emblem: Three Houses, released in 2019. As a teacher at an officers academy, they choose one of three houses to become homeroom teacher for, and guide the students.",
    titlePt: "As Origens de Byleth",
    textPt: "A primeira aparição de Byleth foi em Fire Emblem: Three Houses, lançado em 2019. Como professor(a) numa academia de oficiais, ele(a) escolhe uma das três casas para ser o professor titular, e guia os estudantes.",
  },
  {
    titleEn: "[★☆☆] In Their Series",
    titleJp: "原作では",
    textJp: "傭兵として生きていたが、士官学校の生徒たちを助けたことをきっかけに、教師となった。学校では生徒たちを教え育て、戦場では彼らを指揮しながら共に戦う。",
    titleJpEn: "In the Original Game",
    textJpEn: "Byleth lived as a mercenary, but became a teacher after helping the students of an officers academy. At school, they teach and raise the students, and on the battlefield, they command and fight alongside them.",
    titlePt: "No Jogo Original",
    textPt: "Byleth vivia como mercenário(a), mas se tornou professor(a) depois de ajudar os estudantes de uma academia de oficiais. Na escola, ensina e forma os estudantes, e no campo de batalha, os comanda e luta ao lado deles.",
  },
  {
    titleEn: "[★☆☆] Four Weapons",
    titleJp: "４つの武器",
    textJp: "各ワザでは、剣、斧、槍、弓と、４つの武器を使いこなす。剣はベレトとベレスが、他は教え子とする３学級の級長が原作で使う、英雄の遺産とされる武器。",
    titleJpEn: "Four Weapons",
    textJpEn: "Across their moves, Byleth wields four weapons: sword, axe, lance, and bow. The sword is Byleth's own, while the other three are the Heroes' Relics used in the original game by the house leaders among their students.",
    titlePt: "Quatro Armas",
    textPt: "Ao longo dos golpes, Byleth empunha quatro armas: espada, machado, lança e arco. A espada é a própria de Byleth, enquanto as outras três são as Relíquias dos Heróis usadas no jogo original pelos líderes das casas entre seus estudantes.",
  },
  {
    titleEn: "[★☆☆] Failnaught (Neutral Special)",
    titleJp: "魔弓 フェイルノート 【通常必殺ワザ】",
    textJp: "必殺ワザボタンで弓を引き絞り、一定時間で矢を放つ。放つまでに時間がかかるが、矢のスピードが速く、飛距離が長い。",
    titleJpEn: "Failnaught (Neutral Special)",
    textJpEn: "Holding the special-move button draws the bow, releasing an arrow after a set amount of time. It takes time to fire, but the arrow travels fast and covers a long distance.",
    titlePt: "Failnaught (Especial Neutro)",
    textPt: "Segurar o botão de especial estica o arco, disparando uma flecha depois de um tempo determinado. Leva tempo para disparar, mas a flecha viaja rápido e cobre uma longa distância.",
  },
  {
    titleEn: "[★☆☆] Failnaught Charged (Neutral Special)",
    titleJp: "魔弓 フェイルノートのチャージ 【通常必殺ワザ】",
    textJp: "ボタン長押しでチャージすると、長距離を横一直線に貫く光線を放つ。射線上の相手に、ほぼ放った瞬間に当たる、威力絶大の一撃。",
    titleJpEn: "Failnaught Charged (Neutral Special)",
    textJpEn: "Holding the button down to charge releases a beam of light that pierces straight across a long distance. It's a devastating blow that hits opponents in its line of fire almost the instant it's fired.",
    titlePt: "Failnaught Carregado (Especial Neutro)",
    textPt: "Segurar o botão para carregar libera um feixe de luz que perfura em linha reta por uma longa distância. É um golpe devastador que atinge oponentes na linha de disparo quase no instante em que é disparado.",
  },
  {
    titleEn: "[★☆☆] Canceling Failnaught (Neutral Special)",
    titleJp: "魔弓 フェイルノートの中断 【通常必殺ワザ】",
    textJp: "弓を引き絞っている途中は、回避やシールドが可能。ただし、ため状態の保持はできない。また、ボタン長押しでチャージを始めた後は、回避もシールドもできなくなる。",
    titleJpEn: "Canceling Failnaught (Neutral Special)",
    textJpEn: "While drawing the bow, Byleth can still dodge or shield. However, the charge can't be held afterward. Also, once charging begins by holding the button down, dodging and shielding are no longer possible.",
    titlePt: "Cancelando o Failnaught (Especial Neutro)",
    textPt: "Enquanto estica o arco, Byleth ainda pode esquivar ou usar o escudo. Porém, a carga não pode ser mantida depois disso. Além disso, assim que a carga começa ao segurar o botão, esquivar e usar o escudo deixam de ser possíveis.",
  },
  {
    titleEn: "[★☆☆] Turning with Failnaught (Neutral Special)",
    titleJp: "魔弓 フェイルノート中の振り向き 【通常必殺ワザ】",
    textJp: "弓を引き絞っている間、背中側へ入力すると、引き絞りを中断せずに背後を振り向ける。ただし、ボタン長押しでチャージを始めた後は、振り向けない。",
    titleJpEn: "Turning Around with Failnaught (Neutral Special)",
    textJpEn: "While drawing the bow, inputting toward the back will turn Byleth around without interrupting the draw. However, once charging begins by holding the button down, they can no longer turn around.",
    titlePt: "Virando-se com o Failnaught (Especial Neutro)",
    textPt: "Enquanto estica o arco, inserir o direcional para trás vira Byleth de costas sem interromper o estiramento. Porém, assim que a carga começa ao segurar o botão, não é mais possível se virar.",
  },
  {
    titleEn: "[★☆☆] Areadbhar (Side Special)",
    titleJp: "魔槍 アラドヴァル 【横必殺ワザ】",
    textJp: "槍で大きく弧を描くようにして、前方の広い範囲を斬り上げる。リーチが長く、前方から上空までを広くカバーできる。刃の部分の威力が、最も高い。",
    titleJpEn: "Areadbhar (Side Special)",
    textJpEn: "Swings the lance in a large arc, slashing upward across a wide area in front. It has long reach, covering a broad range from in front all the way up above. The blade portion deals the most damage.",
    titlePt: "Areadbhar (Especial Lateral)",
    textPt: "Golpeia com a lança num grande arco, cortando para cima numa ampla área à frente. Tem alcance longo, cobrindo uma faixa ampla desde a frente até bem acima. A parte da lâmina causa o maior dano.",
  },
  {
    titleEn: "[★☆☆] Flicking the Stick with Areadbhar (Side Special)",
    titleJp: "魔槍 アラドヴァルのはじき入力 【横必殺ワザ】",
    textJp: "はじき入力して出すと、前進しながら斬り上げる。威力が高い刃の部分を当てられるように、相手との間合いで使い分けよう。",
    titleJpEn: "Flicking the Stick with Areadbhar (Side Special)",
    textJpEn: "Using a flick input brings out the move while advancing forward as it slashes upward. Use the distance to the opponent to decide which version lets you land the high-damage blade portion.",
    titlePt: "Direcional Rápido com o Areadbhar (Especial Lateral)",
    textPt: "Usar um input rápido no direcional executa o golpe avançando para frente enquanto corta para cima. Use a distância até o oponente para decidir qual versão permite acertar a parte da lâmina, de maior dano.",
  },
  {
    titleEn: "[★☆☆] Using Areadbhar in the Air (Side Special)",
    titleJp: "空中での発動 【横必殺ワザ】",
    textJp: "空中で出すと、斜め下から斜め上までを広く攻撃する。はじき入力して出すと、少しだけ前進できる。",
    titleJpEn: "Using It in Midair (Side Special)",
    textJpEn: "Using this move in midair attacks a wide range from diagonally below to diagonally above. Using a flick input allows for a small amount of forward movement.",
    titlePt: "Usando no Ar (Especial Lateral)",
    textPt: "Usar esse golpe no ar ataca uma faixa ampla desde a diagonal inferior até a diagonal superior. Usar um input rápido no direcional permite um pequeno deslocamento para frente.",
  },
  {
    titleEn: "[★☆☆] Sword of the Creator (Up Special)",
    titleJp: "魔剣 天帝の剣 【上必殺ワザ】",
    textJp: "斜め上へと剣を伸ばす。相手に当たると、剣を縮めて急接近し、相手を踏みつけてジャンプする。ジャンプの後は、空中で自由に動ける。",
    titleJpEn: "Sword of the Creator (Up Special)",
    textJpEn: "Extends the sword diagonally upward. If it hits an opponent, the sword retracts to close the distance quickly, and Byleth footstools off them and jumps. After the jump, they can move freely in the air.",
    titlePt: "Sword of the Creator (Especial Superior)",
    textPt: "Estende a espada na diagonal para cima. Se atingir um oponente, a espada se retrai para se aproximar rapidamente, e Byleth pisa no oponente e pula. Depois do pulo, pode se mover livremente no ar.",
  },
  {
    titleEn: "[★☆☆] Sword of the Creator and Walls (Up Special)",
    titleJp: "魔剣 天帝の剣とカベ 【上必殺ワザ】",
    textJp: "カベに剣先が刺さると、剣を縮めて急接近し、カベを蹴ってジャンプする。続けて、空中ジャンプや攻撃が可能。",
    titleJpEn: "Sword of the Creator and Walls (Up Special)",
    textJpEn: "If the tip of the sword sticks into a wall, it retracts to close the distance quickly, and Byleth kicks off the wall to jump. They can then follow up with a midair jump or an attack.",
    titlePt: "Sword of the Creator e Paredes (Especial Superior)",
    textPt: "Se a ponta da espada se cravar numa parede, ela se retrai para se aproximar rapidamente, e Byleth chuta a parede para pular. Em seguida, pode encadear um pulo aéreo ou um ataque.",
  },
  {
    titleEn: "[★☆☆] Sword of the Creator and Edges (Up Special)",
    titleJp: "魔剣 天帝の剣とガケ 【上必殺ワザ】",
    textJp: "ガケ近くの空中で使うと、剣先をガケに刺してぶら下がる。ボタンやスティック上を入力すると、剣を縮めてガケにつかまり、復帰できる。",
    titleJpEn: "Sword of the Creator and Ledges (Up Special)",
    textJpEn: "Using this in midair near a ledge sticks the tip of the sword into the ledge, letting Byleth hang from it. Pressing the button or tilting the stick up retracts the sword and grabs the ledge, allowing recovery.",
    titlePt: "Sword of the Creator e Bordas (Especial Superior)",
    textPt: "Usar esse golpe no ar perto de uma borda crava a ponta da espada na borda, deixando Byleth pendurado(a) nela. Pressionar o botão ou inclinar o direcional para cima retrai a espada e agarra a borda, permitindo a recuperação.",
  },
  {
    titleEn: "[★★☆] Sword of the Creator and Footstooling Opponents (Up Special)",
    titleJp: "魔剣 天帝の剣で踏みつけ 【上必殺ワザ】",
    textJp: "相手の蓄積ダメージが５０％以上の時は、踏みつけにメテオ効果が生じる。また、剣をより伸ばした状態で当てるほど、踏みつけた時の威力が上がる。",
    titleJpEn: "Footstooling Opponents with Sword of the Creator (Up Special)",
    textJpEn: "When an opponent's accumulated damage is 50% or higher, the footstool gains a meteor effect. Additionally, the more the sword is extended when it connects, the higher the footstool's power will be.",
    titlePt: "Pisando em Oponentes com o Sword of the Creator (Especial Superior)",
    textPt: "Quando o dano acumulado do oponente é 50% ou mais, a pisada ganha efeito meteoro. Além disso, quanto mais estendida a espada estiver ao acertar, maior é o poder da pisada.",
  },
  {
    titleEn: "[★☆☆] Aymr (Down Special)",
    titleJp: "魔斧 アイムール 【下必殺ワザ】",
    textJp: "斧を構えて力をため、力の限り振り下ろす。発動までに時間がかかり、スキが大きいが、当たれば威力絶大。",
    titleJpEn: "Aymr (Down Special)",
    textJpEn: "Readies the axe, charges up power, and swings it down with all its might. It takes time to activate and leaves a large opening, but it deals tremendous damage if it connects.",
    titlePt: "Aymr (Especial Inferior)",
    textPt: "Prepara o machado, carrega força, e o golpeia para baixo com toda a força. Leva tempo para ativar e deixa uma grande brecha, mas causa dano tremendo se acertar.",
  },
  {
    titleEn: "[★☆☆] Turn and Attack with Aymr (Down Special)",
    titleJp: "魔斧 アイムール中の振り向き 【下必殺ワザ】",
    textJp: "斧を構えてすぐ背中側にスティックを入力すると、背後に向かってワザを出せる。",
    titleJpEn: "Turning Around During Aymr (Down Special)",
    textJpEn: "Inputting the stick toward the back right after readying the axe lets Byleth send the move out behind them.",
    titlePt: "Virando-se Durante o Aymr (Especial Inferior)",
    textPt: "Inserir o direcional para trás logo depois de preparar o machado permite que Byleth desfira o golpe para trás.",
  },
  {
    titleEn: "[★☆☆] Aymr's Super Armor (Down Special)",
    titleJp: "魔斧 アイムール中のスーパーアーマー 【下必殺ワザ】",
    textJp: "地上で力をためた後、斧を振りかぶってから下ろすまでは、スーパーアーマー状態になる。",
    titleJpEn: "Aymr's Super Armor (Down Special)",
    textJpEn: "After charging power on the ground, from the moment the axe is raised until it comes down, Byleth gains Super Armor.",
    titlePt: "Super Armadura do Aymr (Especial Inferior)",
    textPt: "Depois de carregar força no chão, desde o momento em que o machado é erguido até ele descer, Byleth ganha Super Armadura.",
  },
  {
    titleEn: "[★☆☆] Progenitor God Ruptured Heaven (Final Smash)",
    titleJp: "神祖破天 【最後の切りふだ】",
    textJp: "剣を伸ばし、前方の広範囲を攻撃する。当たった相手を３人まで巻き込み、ソティスの力を宿して、荒れ狂う天帝の剣で渾身の一撃を放つ。",
    titleJpEn: "Progenitor God Ruptured Heaven (Final Smash)",
    textJpEn: "Extends the sword to attack a wide area in front. Up to 3 opponents caught by it are drawn in, and then, imbued with Sothis's power, Byleth unleashes an all-out strike with a raging Sword of the Creator.",
    titlePt: "Progenitor God Ruptured Heaven (Ataque Final)",
    textPt: "Estende a espada para atacar uma ampla área à frente. Até 3 oponentes atingidos são arrastados, e então, imbuído(a) com o poder de Sothis, Byleth desfere um golpe com tudo usando um enfurecido Sword of the Creator.",
  },
  {
    titleEn: "[★★☆] Side Smash Attack",
    titleJp: "横スマッシュ攻撃",
    textJp: "槍を突き出して、前方の長い距離を攻撃する。槍の先端が、最も攻撃力が高い。攻撃方向を上下に調整でき、上方向に出した時の攻撃力が特に高い。",
    titleJpEn: "Side Smash Attack",
    textJpEn: "Thrusts the lance forward, attacking a long distance ahead. The tip of the lance deals the most damage. The attack's direction can be adjusted up or down, and its power is especially high when angled upward.",
    titlePt: "Ataque Forte Lateral",
    textPt: "Estende a lança para frente, atacando uma longa distância à frente. A ponta da lança causa o maior dano. A direção do ataque pode ser ajustada para cima ou para baixo, e o poder é especialmente alto quando direcionado para cima.",
  },
  {
    titleEn: "[★☆☆] Up Smash Attack",
    titleJp: "上スマッシュ攻撃",
    textJp: "上に向かって、剣を伸ばしながら振り回す。攻撃範囲が広く、攻撃時間も長いため、上空の相手に打ち勝ちやすい。",
    titleJpEn: "Up Smash Attack",
    textJpEn: "Swings the sword upward while extending it. Since the attack range is wide and the attack duration is long, it's easy to beat out opponents above.",
    titlePt: "Ataque Forte para Cima",
    textPt: "Golpeia com a espada para cima enquanto a estende. Como a área de ataque é ampla e a duração do ataque é longa, é fácil vencer oponentes acima.",
  },
  {
    titleEn: "[★☆☆] Down Smash Attack",
    titleJp: "下スマッシュ攻撃",
    textJp: "回転しながら、足元をすくうように斧を振り回す。前後を攻撃でき、攻撃力、ふっとばし力が共に高いが、スキが大きめ。",
    titleJpEn: "Down Smash Attack",
    textJpEn: "Spins while swinging the axe as if to sweep the feet out from under an opponent. It can hit both in front and behind, and both its damage and knockback are high, but it leaves a fairly large opening.",
    titlePt: "Ataque Forte para Baixo",
    textPt: "Gira enquanto golpeia com o machado como se varresse os pés do oponente. Pode atingir tanto na frente quanto atrás, e tanto o dano quanto o poder de arremesso são altos, mas deixa uma brecha considerável.",
  },
  {
    titleEn: "[★★☆] Down Air Attack",
    titleJp: "下空中攻撃",
    textJp: "斧を振りかぶって、真下へと振り下ろす。振り下ろしきる瞬間、斧の先端にメテオ効果がある。",
    titleJpEn: "Down Air Attack",
    textJpEn: "Raises the axe and swings it straight down. At the instant the swing completes, the tip of the axe has a meteor effect.",
    titlePt: "Ataque Aéreo Inferior",
    textPt: "Ergue o machado e o golpeia diretamente para baixo. No instante em que o golpe se completa, a ponta do machado tem efeito meteoro.",
  },
  {
    titleEn: "[★☆☆] Attacks Using the Lance",
    titleJp: "槍を使った攻撃",
    textJp: "横必殺ワザ、横スマッシュ攻撃、前空中攻撃、後空中攻撃は、槍で攻撃する。先端の刃の威力が高く、リーチが長いのが特徴。",
    titleJpEn: "Attacks Using the Lance",
    textJpEn: "The side special, side smash attack, forward air attack, and back air attack all use the lance. They're characterized by the high power of the blade tip and their long reach.",
    titlePt: "Ataques com a Lança",
    textPt: "O especial lateral, o ataque forte lateral, o ataque aéreo para frente e o ataque aéreo para trás usam a lança. Eles se caracterizam pelo alto poder da ponta da lâmina e pelo alcance longo.",
  },
  {
    titleEn: "[★☆☆] Attacks Using the Axe",
    titleJp: "斧を使った攻撃",
    textJp: "下必殺ワザ、下スマッシュ攻撃、下空中攻撃は、斧で攻撃する。スキが大きいが、威力が高いのが特徴。",
    titleJpEn: "Attacks Using the Axe",
    textJpEn: "The down special, down smash attack, and down air attack all use the axe. They're characterized by a large opening but high power.",
    titlePt: "Ataques com o Machado",
    textPt: "O especial inferior, o ataque forte para baixo e o ataque aéreo inferior usam o machado. Eles se caracterizam por uma grande brecha, mas alto poder.",
  },
];

async function main() {
  const byleth = await db.fighter.findFirst({
    where: { name: { contains: "Byleth", mode: "insensitive" } },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!byleth) { console.log("Byleth not found"); return; }

  await db.fighter.update({
    where: { id: byleth.id },
    data: {
      curatorOverviewEn: "Byleth's kit is built around four different weapons, split cleanly by move type: the sword for tilts/aerials/dash attack, the bow for the neutral special, the lance for the side special and several smash/air attacks, and the axe for the down special and its own smash/air attacks. Failnaught rewards patience — holding the button charges a beam that pierces in a straight line for enormous damage, and Byleth can still dodge or shield while merely drawing the bow, though once the hold crosses into a full charge, both defensive options and the ability to turn around disappear. Areadbhar trades a wide arcing slash for reach, with a flick input trading a little travel distance for landing the higher-damage blade tip more reliably. Sword of the Creator is a genuinely flexible recovery: it can footstool an opponent to bounce off them into free aerial movement, stick into a wall to kick off it, or plant into a ledge to hang and reel back in — and if the opponent it hits is already above 50% damage, the footstool itself turns into a meteor smash. Aymr is the opposite of subtle — a slow, heavily telegraphed axe swing that grants full super armor from the moment it's raised to the moment it lands, so it can be thrown out through weaker attacks on the way to its massive payoff. The Final Smash extends the sword to catch up to three opponents at once before finishing with the full might of the Sword of the Creator. Between the four weapons and their very different risk profiles — instant but committed axe reads, patient bow charges, and a recovery special that doubles as an offensive tool — Byleth plays less like one fighter and more like four toolkits sharing a body.",
      curatorOverviewPt: "O kit de Byleth é construído em torno de quatro armas diferentes, divididas claramente por tipo de golpe: a espada para ataques inclinados/aéreos/dash, o arco para o especial neutro, a lança para o especial lateral e vários ataques fortes/aéreos, e o machado para o especial inferior e seus próprios ataques fortes/aéreos. O Failnaught recompensa a paciência — segurar o botão carrega um feixe que perfura em linha reta causando dano enorme, e Byleth ainda pode esquivar ou usar o escudo enquanto apenas estica o arco, embora, assim que a segurada vira carga completa, tanto as opções defensivas quanto a capacidade de se virar desapareçam. O Areadbhar troca alcance por um corte amplo em arco, com um input rápido no direcional trocando um pouco de deslocamento por acertar com mais confiabilidade a ponta da lâmina, de maior dano. O Sword of the Creator é uma recuperação genuinamente flexível: pode pisar num oponente para saltar dele até um movimento aéreo livre, cravar numa parede para chutá-la, ou se prender numa borda para pendurar e se puxar de volta — e se o oponente atingido já estiver acima de 50% de dano, a própria pisada se transforma num golpe meteoro. O Aymr é o oposto da sutileza — um golpe de machado lento e muito visível que concede super armadura completa desde o momento em que é erguido até o momento em que desce, então pode ser lançado através de ataques mais fracos a caminho de sua recompensa massiva. O Ataque Final estende a espada para pegar até três oponentes de uma vez antes de finalizar com toda a força do Sword of the Creator. Entre as quatro armas e seus perfis de risco bem diferentes — leituras de machado instantâneas mas comprometidas, cargas pacientes de arco, e um especial de recuperação que também funciona como ferramenta ofensiva — Byleth joga menos como um único lutador e mais como quatro kits de ferramentas dividindo um só corpo.",
      curatorOverviewJp: "ベレト/ベレスの技構成は、４つの異なる武器を軸に組まれており、技の種類ごとにはっきりと分かれている——剣は強攻撃・空中攻撃・ダッシュ攻撃、弓は通常必殺ワザ、槍は横必殺ワザと複数のスマッシュ・空中攻撃、斧は下必殺ワザとそれ専用のスマッシュ・空中攻撃を担当する。「魔弓フェイルノート」は我慢が報われる技だ——ボタンを押し続けると一直線を貫く光線をチャージでき、絶大なダメージを与えるが、単に弓を引き絞っている間はベレト/ベレスは回避やシールドを維持できる。ただし引き絞りが完全なチャージに切り替わると、防御手段も振り向く能力も失われる。「魔槍アラドヴァル」は広い弧を描く斬撃とリーチを引き換えにする技で、はじき入力を使えば、多少の移動距離と引き換えに、より高威力な刃の部分をより確実に当てられる。「魔剣天帝の剣」は本当に柔軟な復帰技だ——相手を踏みつけて跳ね返り自由な空中行動に移ったり、カベに突き刺して蹴って跳んだり、ガケに突き刺してぶら下がって引き寄せたりできる——そして相手の蓄積ダメージがすでに５０％を超えていれば、踏みつけ自体がメテオ効果を持つ一撃に変わる。「魔斧アイムール」はその対極にある——発動が遅く、非常に見え見えの斧の一振りだが、振りかぶってから振り下ろすまでスーパーアーマーを得られるため、相手の弱い攻撃を受け流しながら莫大な見返りへと突き進める。最後の切りふだは剣を伸ばして最大３人までの相手を巻き込んでから、「天帝の剣」の全力をもって仕留める。４つの武器とその大きく異なるリスク特性——瞬発的だが踏み込みの大きい斧の読み合い、我慢強い弓のチャージ、そして復帰技でありながら攻撃的な道具にもなる上必殺ワザ——を併せ持つベレト/ベレスは、１人のファイターというより、４つの技構成を１つの体で共有しているかのようにプレイされる。",
      curatorOverviewJpEn: "Byleth's moveset is built around four distinct weapons, clearly divided by move type — the sword handles tilts, aerials, and the dash attack; the bow handles the neutral special; the lance handles the side special and several smash and aerial attacks; and the axe handles the down special along with its own dedicated smash and aerial attacks. \"Failnaught\" is a move that rewards patience — holding the button down charges a beam that pierces in a straight line, dealing tremendous damage, and Byleth can still dodge or shield while merely drawing the bow. However, once the draw shifts into a full charge, both the defensive options and the ability to turn around are lost. \"Areadbhar\" trades reach for a wide arcing slash, and using a flick input lets you trade a bit of travel distance for more reliably landing the higher-damage blade portion. \"Sword of the Creator\" is a genuinely flexible recovery move — it can footstool an opponent and bounce off into free aerial movement, stick into a wall and kick off it, or stick into a ledge to hang and pull back in. And if the opponent's accumulated damage is already above 50%, the footstool itself turns into a blow with a meteor effect. \"Aymr\" is the opposite — a slow, very telegraphed axe swing, but it grants Super Armor from the moment it's raised until it comes down, letting Byleth push through an opponent's weaker attacks on the way to a massive payoff. The Final Smash extends the sword to catch up to three opponents at once before finishing them off with the full power of the \"Sword of the Creator.\" Combining four weapons with dramatically different risk profiles — an instant but heavily committed axe read, a patient bow charge, and an up special that's a recovery tool and an offensive tool at once — Byleth plays less like a single fighter and more like four movesets sharing one body.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = byleth.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: byleth.id }, data: { curationStatus: "approved" } });
  console.log("✅ Byleth aprovado(a)");

  // Sem FighterMove (0 registros) — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista Fire Emblem/Three Houses corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.

  await db.$disconnect();
}
main().catch(console.error);
