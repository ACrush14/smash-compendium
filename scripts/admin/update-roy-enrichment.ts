import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "The protagonist of \"Fire Emblem: The Binding Blade.\" He leads the troops of Pherae into battle in place of his ailing father. He's the only character who can class-change into Master Lord and equip the \"Binding Blade.\" In Smash Bros., unlike other swordsmen, the base of his sword is stronger. Use his mobility to quickly close in on opponents and fight at the close range he excels at!",
    pt: "O protagonista de \"Fire Emblem: The Binding Blade.\" Ele lidera as tropas de Pherae em batalha no lugar de seu pai doente. Ele é o único personagem que pode mudar de classe para Master Lord e equipar a \"Binding Blade.\" Em Smash Bros., diferente de outros espadachins, a base de sua espada é mais forte. Use sua mobilidade para se aproximar rapidamente dos adversários e lutar na distância curta em que ele se destaca!",
  },
  SSBM: {
    jpEn: "The son of the lord who governs the city of Pherae and its surrounding territory. In place of his father, felled by illness, he leads the army of Pherae into battle, boldly standing against the invasion of the Kingdom of Bern. Along the way, he meets Princess Guinevere of the Kingdom of Bern, and this encounter becomes the catalyst that transforms his own destiny into something that moves the entire continent.",
    pt: "O filho do senhor que governa a cidade de Pherae e seu território ao redor. No lugar de seu pai, derrubado pela doença, ele lidera o exército de Pherae em batalha, enfrentando corajosamente a invasão do Reino de Bern. Ao longo do caminho, ele encontra a Princesa Guinevere do Reino de Bern, e esse encontro se torna o catalisador que transforma seu próprio destino em algo que move o continente inteiro.",
  },
  SSBU: {
    jpEn: "The protagonist of \"Fire Emblem: The Binding Blade.\" The heir of Pherae, the easternmost territory of the Lycia region. Fifteen years old. His father is Eliwood, one of the protagonists of the following game, \"The Blazing Blade.\" He is the \"Child of Flame\" prophesied by the great sage Athos on his deathbed to save the land of Elibe from a baleful star. A boy imagined through fire — his element is fire, his hair is a vivid red, and his signature weapon, the Binding Blade, can unleash flame. Called back from his studies in Ostia due to a crisis in his homeland of Pherae, he sets out with his retainers in accordance with the Lycian Alliance's pact, taking his ailing father's place — but the allied army has already been destroyed. Entrusted with the remaining troops and an only daughter by his father's ally Hector, who senses his own death approaching, Roy throws himself fully into the war as the commander of an army.",
    pt: "O protagonista de \"Fire Emblem: The Binding Blade.\" O herdeiro de Pherae, o território mais oriental da região de Lycia. Quinze anos. Seu pai é Eliwood, um dos protagonistas do jogo seguinte, \"The Blazing Blade.\" Ele é a \"Criança da Chama\" profetizada pelo grande sábio Athos em seu leito de morte para salvar a terra de Elibe de uma estrela funesta. Um garoto imaginado através do fogo — seu elemento é o fogo, seu cabelo é vermelho vívido, e sua arma característica, a Binding Blade, pode liberar chamas. Chamado de volta de seus estudos em Ostia devido a uma crise em sua terra natal, Pherae, ele parte com seus vassalos de acordo com o pacto da Aliança de Lycia, assumindo o lugar de seu pai doente — mas o exército aliado já foi destruído. Confiado com as tropas restantes e uma filha única por Hector, aliado de seu pai que sente a própria morte se aproximando, Roy se lança de corpo e alma na guerra como comandante de um exército.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "The Binding Blade, once wielded by the hero \"Hartmut,\" is large for Roy, giving him reach but slightly slower movement. His attack power is decent, but he's a bit weak in the air. Flare Blade becomes a one-hit kill when charged to maximum. Double-Edge Dance has different properties from Marth's version. B: Flare Blade, Side+B: Double-Edge Dance",
    pt: "A Binding Blade, antes empunhada pelo herói \"Hartmut,\" é grande para o Roy, dando-lhe alcance, mas um movimento um pouco mais lento. Seu poder de ataque é decente, mas ele é um pouco fraco no ar. O Flare Blade se torna uma morte instantânea quando carregado ao máximo. O Double-Edge Dance tem propriedades diferentes da versão do Marth. B: Flare Blade, Lateral+B: Double-Edge Dance",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "The properties of his sword attacks are the opposite of Marth's — hitting with the center of the blade deals higher damage. Charge forward fearlessly. Blazer is a bit slower than Marth's Dolphin Slash, but is more powerful and also sets opponents on fire. Counter's follow-up hit has different qualities than Marth's version. Up+B: Blazer, Down+B: Counter",
    pt: "As propriedades dos ataques de espada dele são o oposto do Marth — acertar com o centro da lâmina causa mais dano. Avance sem medo. O Blazer é um pouco mais lento que o Dolphin Slash do Marth, mas é mais poderoso e também incendeia os adversários. O golpe de acompanhamento do Counter tem qualidades diferentes da versão do Marth. Cima+B: Blazer, Baixo+B: Counter",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "The Neutral Special, Flare Blade, is a move that unleashes an explosive flame forward. Holding the button lets it be charged. At maximum power, Roy himself also takes fire damage. The Side Special, Double-Edge Dance, can branch differently from the second hit onward by combining up/down inputs. Use the up and down variations skillfully depending on the situation. (GBA) Fire Emblem: The Binding Blade (2002/03)",
    pt: "O Especial Neutro, Flare Blade, é um golpe que libera uma chama explosiva para frente. Segurar o botão permite carregá-lo. No poder máximo, o próprio Roy também sofre dano de fogo. O Especial Lateral, Double-Edge Dance, pode ramificar de forma diferente a partir do segundo golpe combinando inputs cima/baixo. Use as variações cima e baixo com habilidade dependendo da situação. (GBA) Fire Emblem: The Binding Blade (2002/03)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『ファイアーエムブレム 封印の剣』の主人公。「若き獅子」や「炎の子」と呼ばれる。年齢は１５歳と、歴代の主人公の中でも若い。『烈火の剣』主人公エリウッドの息子。", titleJpEn: "In His Series", textJpEn: "The protagonist of \"Fire Emblem: The Binding Blade.\" Called the \"Young Lion\" or \"Child of Flame.\" At 15 years old, he's one of the youngest protagonists in the series' history. The son of Eliwood, the protagonist of \"The Blazing Blade.\"", titlePt: "Na Série Original", textPt: "O protagonista de \"Fire Emblem: The Binding Blade.\" Chamado de \"Jovem Leão\" ou \"Criança da Chama.\" Aos 15 anos, ele é um dos protagonistas mais jovens da história da série. Filho de Eliwood, o protagonista de \"The Blazing Blade.\"" },
  { titleEn: "[★☆☆] Boosting Flare Blade (Neutral Special)", titleJp: "エクスプロージョンの攻撃力アップ 【通常必殺ワザ】", textJp: "ボタンを押し続けると徐々に攻撃力がアップする。最大までためるか、ボタンを離した瞬間にワザが発動。", titleJpEn: "Boosting Flare Blade (Neutral Special)", textJpEn: "Holding the button gradually increases its attack power. The move activates either when fully charged or the instant the button is released.", titlePt: "Aumentando o Flare Blade (Especial Neutro)", textPt: "Segurar o botão aumenta gradualmente seu poder de ataque. O movimento ativa quando totalmente carregado ou no instante em que o botão é solto." },
  { titleEn: "[★☆☆] Overpower with Flare Blade (Neutral Special)", titleJp: "エクスプロージョンで威圧 【通常必殺ワザ】", textJp: "相手をガケ外に飛ばした後に、ガケ際でこのワザをためて待ち構えておくと、復帰にプレッシャーを与えられる。", titleJpEn: "Overpower with Flare Blade (Neutral Special)", textJpEn: "After launching an opponent offstage, charging this move while waiting at the ledge puts pressure on their recovery.", titlePt: "Dominando com o Flare Blade (Especial Neutro)", textPt: "Depois de arremessar um adversário para fora do palco, carregar este movimento enquanto espera na borda pressiona sua recuperação." },
  { titleEn: "[★★☆] Flare Blade Techniques (Neutral Special)", titleJp: "エクスプロージョンのテクニック 【通常必殺ワザ】", textJp: "ボタンを押したまま背中方向にスティックを倒すと、攻撃をためたまま振り向ける。うまく使えば、緊急回避で背後に回る相手を攻撃できる。", titleJpEn: "Flare Blade Techniques (Neutral Special)", textJpEn: "Holding the button while tilting the stick backward lets him turn around while keeping the charge. Used well, this can hit an opponent who dodges behind him.", titlePt: "Técnicas do Flare Blade (Especial Neutro)", textPt: "Segurar o botão enquanto inclina o analógico para trás permite que ele se vire mantendo a carga. Usado bem, isso pode acertar um adversário que se esquiva atrás dele." },
  { titleEn: "[★☆☆] Double-Edge Dance Patterns (Side Special)", titleJp: "マーベラスコンビネーションのパターン 【横必殺ワザ】", textJp: "このワザは必殺ワザボタンの追加入力で４連続攻撃になる。上下方向との組み合わせでフィニッシュが３パターンに変化。", titleJpEn: "Double-Edge Dance Patterns (Side Special)", textJpEn: "This move can be chained into a four-hit combo with additional inputs of the special move button. Combining it with up or down input changes the finish into 3 patterns.", titlePt: "Padrões do Double-Edge Dance (Especial Lateral)", textPt: "Este movimento pode ser encadeado em um combo de quatro golpes com inputs adicionais do botão de golpe especial. Combiná-lo com input cima ou baixo muda o final em 3 padrões." },
  { titleEn: "[★★☆] Double-Edge Dance Techniques (Side Special)", titleJp: "マーベラスコンビネーションのテクニック 【横必殺ワザ】", textJp: "３発目を上に派生させてから４発目を横に派生させることで４発目の攻撃力が高い根本の部分をヒットさせやすい。", titleJpEn: "Double-Edge Dance Techniques (Side Special)", textJpEn: "Branching the third hit upward before branching the fourth hit sideways makes it easier to land the fourth hit's high-damage base portion.", titlePt: "Técnicas do Double-Edge Dance (Especial Lateral)", textPt: "Ramificar o terceiro golpe para cima antes de ramificar o quarto golpe lateralmente torna mais fácil acertar a parte da base do quarto golpe, que causa mais dano." },
  { titleEn: "[★★☆] Blazer's Traits (Up Special)", titleJp: "ブレイザーの特性 【上必殺ワザ】", textJp: "ワザの出だしに全身無敵がある。地上で出すと攻撃を耐えるタイミングがあり、撃墜も狙いやすい。", titleJpEn: "Blazer's Traits (Up Special)", textJpEn: "The very start of the move grants full-body invincibility. Used on the ground, there's a window where it can withstand attacks, making it easier to go for a KO.", titlePt: "As Características do Blazer (Especial Cima)", textPt: "O início do movimento concede invencibilidade total ao corpo. Usado no chão, há uma janela onde pode resistir a ataques, tornando mais fácil buscar um KO." },
  { titleEn: "[★☆☆] Turning Blazer (Up Special)", titleJp: "振り向いてブレイザー 【上必殺ワザ】", textJp: "ワザを出してから上昇するまでの間に、素早く後ろを入力することで振り返ってワザを出すことができる。", titleJpEn: "Turning Blazer (Up Special)", textJpEn: "Quickly inputting backward between using the move and rising lets him turn around and unleash the move behind him.", titlePt: "Girando o Blazer (Especial Cima)", textPt: "Inputar rapidamente para trás entre usar o movimento e subir permite que ele se vire e libere o movimento atrás dele." },
  { titleEn: "[★☆☆] Blazer's Angle (Up Special)", titleJp: "ブレイザーの角度 【上必殺ワザ】", textJp: "飛び上がる時に左右の入力で横への角度を調整できる。横に移動した分、上昇力が下がるので復帰時は注意が必要。", titleJpEn: "Blazer's Angle (Up Special)", textJpEn: "The horizontal angle can be adjusted with left/right input while leaping. Since horizontal movement reduces vertical lift, be careful when using it for recovery.", titlePt: "O Ângulo do Blazer (Especial Cima)", textPt: "O ângulo horizontal pode ser ajustado com input esquerda/direita ao saltar. Como o movimento horizontal reduz a elevação vertical, cuidado ao usá-lo para recuperação." },
  { titleEn: "[★☆☆] Counter (Down Special)", titleJp: "カウンター 【下必殺ワザ】", textJp: "空中でのカウンターは、地上で成功した時よりもふっとばし力が下がる。ここぞという勝負の一瞬は、地上でどっしりと構えるとよいかもしれない。", titleJpEn: "Counter (Down Special)", textJpEn: "Counter used in the air has lower knockback than when it succeeds on the ground. For a crucial moment, it may be better to stand your ground firmly.", titlePt: "Counter (Especial Baixo)", textPt: "O Counter usado no ar tem menor poder de arremesso do que quando bem-sucedido no chão. Para um momento crucial, pode ser melhor ficar firme no chão." },
  { titleEn: "[★☆☆] Counter's Attack Power (Down Special)", titleJp: "カウンターの攻撃力 【下必殺ワザ】", textJp: "ワザが成立するまでが少し遅く、受け付け時間も短いが成功すると相手の攻撃力を１.３５倍にして反撃するので強力。", titleJpEn: "Counter's Attack Power (Down Special)", textJpEn: "It takes a bit longer to activate and the acceptance window is short, but if it succeeds, it counters at 1.35 times the opponent's attack power, making it very powerful.", titlePt: "O Poder de Ataque do Counter (Especial Baixo)", textPt: "Leva um pouco mais para ativar e a janela de aceitação é curta, mas se for bem-sucedido, contra-ataca com 1,35 vezes o poder de ataque do adversário, tornando-o muito poderoso." },
  { titleEn: "[★★☆] Using Counter (Down Special)", titleJp: "カウンターの使い方 【下必殺ワザ】", textJp: "ガケ外まで、追撃を狙ってくる相手に対して出すのも選択肢の１つとして有効。しかしロイは落下が速いので注意しよう。", titleJpEn: "Using Counter (Down Special)", textJpEn: "Using it against an opponent chasing you off the stage for a follow-up is also a valid option. However, be careful since Roy falls quickly.", titlePt: "Usando o Counter (Especial Baixo)", textPt: "Usá-lo contra um adversário que persegue você para fora do palco buscando um acompanhamento também é uma opção válida. Porém, cuidado, pois o Roy cai rapidamente." },
  { titleEn: "[★☆☆] Critical Hit (Final Smash)", titleJp: "必殺の一撃 【最後の切りふだ】", textJp: "炎をまといながら回す剣が、周りの相手をまきこむ。相手の集団に飛びこんでくり出せば、一掃できる。", titleJpEn: "Critical Hit (Final Smash)", textJpEn: "His flame-wreathed spinning sword catches nearby opponents. Diving into a group of opponents with it can wipe them all out.", titlePt: "Critical Hit (Final Smash)", textPt: "Sua espada giratória envolta em chamas pega os adversários próximos. Mergulhar em um grupo de adversários com ela pode eliminá-los a todos." },
  { titleEn: "[★☆☆] Slash (Neutral Attack)", titleJp: "リフトスラッシュ 【弱攻撃】", textJp: "逆手に持った剣を下から上に振り上げて攻撃する。弱攻撃コンボは無いが、出が早く、１発のダメージは高め。", titleJpEn: "Lift Slash (Neutral Attack)", textJpEn: "Swings the reverse-gripped sword upward from below to attack. There's no jab combo, but it comes out fast and deals decent damage per hit.", titlePt: "Lift Slash (Ataque Neutro)", textPt: "Balança a espada empunhada de forma invertida de baixo para cima para atacar. Não há combo de soco fraco, mas sai rápido e causa dano decente por golpe." },
  { titleEn: "[★☆☆] Sharp Edge (Side Tilt Attack)", titleJp: "オーバーバッシュ 【横強攻撃】", textJp: "大きく前に踏み込んで攻撃するので、ロイの強みである根本の判定を当てやすい。攻撃力も高いので積極的に狙いたい。", titleJpEn: "Overbash (Side Tilt Attack)", textJpEn: "He steps forward significantly to attack, making it easy to land the base of the blade — Roy's strength. Its attack power is also high, so aim for it actively.", titlePt: "Overbash (Ataque Inclinado Lateral)", textPt: "Ele dá um grande passo à frente para atacar, tornando fácil acertar a base da lâmina — o ponto forte do Roy. Seu poder de ataque também é alto, então mire nele ativamente." },
  { titleEn: "[★☆☆] Low Stab (Down Tilt Attack)", titleJp: "ロースラスト 【下強攻撃】", textJp: "剣を素早く突き出すしゃがみ攻撃のため、スキが少ない。威力は低くなるがけん制ワザとして先端ヒットを狙うのもあり。", titleJpEn: "Low Thrust (Down Tilt Attack)", textJpEn: "A crouching attack that quickly thrusts the sword, leaving little opening. Its power is lower, but landing the tip as a check attack is also viable.", titlePt: "Low Thrust (Ataque Inclinado Baixo)", textPt: "Um ataque agachado que estoca rapidamente a espada, deixando pouca abertura. Seu poder é menor, mas acertar a ponta como um ataque de intimidação também é viável." },
  { titleEn: "[★☆☆] Flame Sword (Up Smash Attack)", titleJp: "フレイムソード 【上スマッシュ攻撃】", textJp: "上スマッシュ攻撃の「フレイムソード」は、真上に剣を突く炎属性のワザ。剣を持った腕は無敵で、対空にも使える。", titleJpEn: "Flame Sword (Up Smash Attack)", textJpEn: "The up smash attack, Flame Sword, thrusts the sword straight up with a fire property. The arm holding the sword is invincible, making it also usable against airborne opponents.", titlePt: "Flame Sword (Ataque Smash Cima)", textPt: "O ataque smash cima, Flame Sword, estoca a espada diretamente para cima com propriedade de fogo. O braço que segura a espada é invencível, tornando-o também útil contra adversários no ar." },
  { titleEn: "[★☆☆] Double Slash (Neutral Air Attack)", titleJp: "ダブルスラッシュ 【通常空中攻撃】", textJp: "空中で剣を横に振り回す２段攻撃。早く出せるので、けん制ワザとして相手に近づく手段にもなる。", titleJpEn: "Double Slash (Neutral Air Attack)", textJpEn: "A two-hit attack that swings the sword sideways in the air. Since it comes out fast, it also serves as a means to close in on opponents as a check.", titlePt: "Double Slash (Ataque Aéreo Neutro)", textPt: "Um ataque de dois golpes que balança a espada lateralmente no ar. Como sai rápido, também serve como meio de se aproximar dos adversários como intimidação." },
  { titleEn: "[★☆☆] Half Moon (Down Air Attack)", titleJp: "メテオドロップ 【下空中攻撃】", textJp: "根本ヒットでメテオ効果があるワザ。真下には強いが左右への判定は狭いので、しっかり相手を狙って出そう。", titleJpEn: "Meteor Drop (Down Air Attack)", textJpEn: "A move with a meteor effect when it hits with the base. Strong directly below, but its horizontal hitbox is narrow, so aim carefully at your opponent.", titlePt: "Meteor Drop (Ataque Aéreo Baixo)", textPt: "Um movimento com efeito meteoro quando acerta com a base. Forte diretamente abaixo, mas sua hitbox horizontal é estreita, então mire com cuidado no adversário." },
  { titleEn: "[★☆☆] Slam (Downward Throw)", titleJp: "グラブドロップ 【下投げ】", textJp: "つかんだ相手を真下に叩きつけるワザ。投げられたファイターはロイの正面に浮くので追撃のチャンス。", titleJpEn: "Grab Drop (Downward Throw)", textJpEn: "Slams the grabbed opponent straight down. The thrown fighter floats right in front of Roy, giving a chance for a follow-up.", titlePt: "Grab Drop (Arremesso Baixo)", textPt: "Arremessa o adversário agarrado diretamente para baixo. O lutador arremessado flutua bem na frente do Roy, dando uma chance de acompanhamento." },
  { titleEn: "[★☆☆] Sword Characteristics", titleJp: "剣の性質", textJp: "マルスとは異なり、ロイの攻撃は剣の根本に近いほど強力になる。相手の懐に飛びこんで密着すれば、重い一撃を与えられる。", titleJpEn: "Sword Characteristics", textJpEn: "Unlike Marth, Roy's attacks become more powerful the closer they connect to the base of the sword. Diving in close to an opponent lets him deal a heavy blow.", titlePt: "Características da Espada", textPt: "Diferente do Marth, os ataques do Roy se tornam mais poderosos quanto mais perto conectam da base da espada. Mergulhar perto de um adversário permite que ele desfira um golpe pesado." },
];

async function main() {
  const roy = await db.fighter.findFirst({
    where: { name: "Roy" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!roy) { console.log("Roy not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: roy.id },
    data: {
      curatorOverviewEn: "Roy, the Young Lion of Fire Emblem: The Binding Blade, wields a sword with inverted properties from Marth's — his blade hits hardest at the base, rewarding players who fight up close rather than at range. His explosive Flare Blade and fiery Blazer add real damage output, but his heavier, hilt-focused style demands aggression and precise spacing to land his sword's sweet spot.",
      curatorOverviewPt: "Roy, o Jovem Leão de Fire Emblem: The Binding Blade, empunha uma espada com propriedades invertidas em relação à do Marth — sua lâmina bate mais forte na base, recompensando jogadores que lutam de perto em vez de à distância. Seu explosivo Flare Blade e o flamejante Blazer adicionam dano real, mas seu estilo mais pesado e focado no punho exige agressividade e posicionamento preciso para acertar o ponto ideal da espada.",
      curatorOverviewJp: "『ファイアーエムブレム 封印の剣』の若き獅子ロイは、マルスとは正反対の性質を持つ剣を操る――彼の剣は根元で最も強く、遠距離ではなく近距離での戦いを好むプレイヤーに報いる。爆発的なエクスプロージョンと炎をまとうブレイザーが確かなダメージ源となるが、柄寄りを重視する重量級のスタイルは、剣の急所を当てるための積極性と正確な間合い管理を要求する。",
      curatorOverviewJpEn: "Roy, the Young Lion of \"Fire Emblem: The Binding Blade,\" wields a sword with properties opposite to Marth's — his blade is strongest at the base, rewarding players who prefer close-range fighting over ranged combat. The explosive Flare Blade and fire-wreathed Blazer provide solid damage output, but his heavier, hilt-focused style demands aggression and precise spacing to land the sword's sweet spot.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 3 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = roy.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 4968-5002 -> 2392-2411 (39:52-40:11 ZoomZike VLC confirmed)
  const bioSsbm = roy.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 2392, videoEndSec: 2411 } });
    console.log("✅ Bio SSBM video: 4968-5002 -> 2392-2411 (39:52-40:11)");
  }

  // Fix orphaned SSB4 "Roy" trophy: link fighterId + apply user's exact VLC timing
  const ssb4Main = await db.collectible.findFirst({ where: { name: "Roy", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, fighterId: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true } });
  if (ssb4Main) {
    await db.collectible.update({
      where: { id: ssb4Main.id },
      data: { fighterId: roy.id, videoStartSec: 5245, videoEndSec: 5256, videoStartSec2: 4573, videoEndSec2: 4584 },
    });
    console.log(`✅ SSB4 Trophy "Roy": fighterId linkado (era null) + timing WiiU ${ssb4Main.videoStartSec}-${ssb4Main.videoEndSec}->5245-5256, 3DS ${ssb4Main.videoStartSec2}-${ssb4Main.videoEndSec2}->4573-4584`);
  }

  // Fix orphaned "Critical Hit (Roy)" trophy: link fighterId + normalize smashGameVersion
  const critHit = await db.collectible.findFirst({ where: { name: "Critical Hit (Roy)", smashGameVersion: "SSB4_WIIU", type: "TROPHY" }, select: { id: true } });
  if (critHit) {
    await db.collectible.update({ where: { id: critHit.id }, data: { fighterId: roy.id, smashGameVersion: "SSB4" } });
    console.log("✅ 'Critical Hit (Roy)': fighterId linkado + smashGameVersion normalizado SSB4_WIIU -> SSB4");
  }

  // Moves EN+PT+JpEn
  for (const m of roy.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = roy.tips.find(t => t.titleEn === data.titleEn);
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

  console.log("\nℹ️  'Roy (2)' (SSB4, pos=255, timing corrompido, fighterId null) e 'King Roy' (SSB4_3DS, fighterId null) deixados intocados -- não fica claro se são o mesmo troféu principal; como estão órfãos, não aparecem na página e não causam conflito.");
  console.log("ℹ️  SSBB: confirmado pelo usuário que Roy não tem troféu no Brawl (não jogável nessa era) -- nenhuma ação necessária.");

  await db.$disconnect();
}
main().catch(console.error);
