import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Min Min's Origins",
    titleJp: "ミェンミェンの初登場作品",
    textJp: "ミェンミェンの初登場作品は、２０１７年発売の『ARMS』。おいしいラーメンで有名な麺天飯食堂の看板娘で、宣伝のためグランプリに参戦した。",
    titleJpEn: "Min Min's Debut Work",
    textJpEn: "Min Min's first appearance was in ARMS, released in 2017. She's the poster girl of the Mintendo Noodle House, famous for its delicious ramen, and entered the Grand Prix to promote it.",
    titlePt: "As Origens de Min Min",
    textPt: "A primeira aparição de Min Min foi em ARMS, lançado em 2017. Ela é a garota-propaganda da Mintendo Noodle House, famosa por seu delicioso ramen, e entrou no Grand Prix para promovê-la.",
  },
  {
    titleEn: "[★☆☆] In Her Series",
    titleJp: "原作では",
    textJp: "普段は小柄で腕も細いが、力をためると左腕が龍に変化し、パンチが強力になる。空中でキックを放って、相手のアームを蹴り落とすのも得意。",
    titleJpEn: "In the Original Game",
    textJpEn: "She's normally petite with slender arms, but when she charges up power, her left arm transforms into a dragon, making her punches more powerful. She's also skilled at kicking in midair to knock down an opponent's ARM.",
    titlePt: "No Jogo Original",
    textPt: "Ela normalmente é pequena e de braços finos, mas quando carrega energia, seu braço esquerdo se transforma num dragão, tornando seus socos mais poderosos. Ela também é habilidosa em chutar no ar para derrubar o ARM do oponente.",
  },
  {
    titleEn: "[★☆☆] Punch",
    titleJp: "パンチ",
    textJp: "攻撃ボタンで左、必殺ワザボタンで右のアームを使ったパンチをくり出す。どちらも、はじき入力でスマッシュ攻撃になり、射程と威力がアップする。",
    titleJpEn: "Punch",
    textJpEn: "The attack button throws a punch with the left ARM, and the special-move button throws one with the right ARM. Both become smash attacks with a flick input, increasing their range and power.",
    titlePt: "Soco",
    textPt: "O botão de ataque desfere um soco com o ARM esquerdo, e o botão de especial desfere um com o ARM direito. Ambos se tornam ataques fortes com um input rápido no direcional, aumentando o alcance e o poder.",
  },
  {
    titleEn: "[★☆☆] Punching Power",
    titleJp: "パンチの威力",
    textJp: "はじき入力しながら出したパンチは、アームが伸び切る直前が最も強い。出始めや伸び切った瞬間は、威力が落ちる。",
    titleJpEn: "Punch Power",
    textJpEn: "A punch thrown with a flick input is strongest right before the ARM fully extends. Its power drops at the very start and at the instant it's fully extended.",
    titlePt: "Poder do Soco",
    textPt: "Um soco desferido com input rápido no direcional é mais forte pouco antes do ARM se estender completamente. O poder cai bem no início e no instante em que ele se estende por completo.",
  },
  {
    titleEn: "[★☆☆] The ARM's Charged Smash",
    titleJp: "アームのスマッシュホールド",
    textJp: "地上ではじき入力した時、攻撃ボタンか必殺ワザボタンを押し続けると、スマッシュホールドして力をため、ワザの特性が変わる。",
    titleJpEn: "The ARM's Smash Hold",
    textJpEn: "When using a flick input on the ground, holding down the attack button or special-move button triggers a Smash Hold, charging power and changing the move's characteristics.",
    titlePt: "Smash Hold do ARM",
    textPt: "Ao usar um input rápido no direcional no chão, segurar o botão de ataque ou o botão de especial ativa um Smash Hold, carregando energia e alterando as características do golpe.",
  },
  {
    titleEn: "[★☆☆] Shifting ARM Arc",
    titleJp: "上下への打ち分け",
    textJp: "アームは、地上で左右にくり出すとき、発射する直前に上下に方向入力すると、弧を描くように曲げられる。曲がり方は、アームの種類によって異なる。",
    titleJpEn: "Aiming Up or Down",
    textJpEn: "When firing an ARM to the side on the ground, inputting up or down right before launching it will bend its path into an arc. How it curves depends on the type of ARM.",
    titlePt: "Mirando para Cima ou para Baixo",
    textPt: "Ao disparar um ARM para o lado no chão, inserir para cima ou para baixo pouco antes de lançá-lo curva sua trajetória num arco. A forma da curva depende do tipo de ARM.",
  },
  {
    titleEn: "[★☆☆] Punching and...",
    titleJp: "パンチ中の行動",
    textJp: "アームを伸ばしている最中も、移動やジャンプ、もう片方のアームによる攻撃が可能。ただし、スマッシュ攻撃中は、もう片方のアームによる攻撃しかできない。",
    titleJpEn: "Actions While Punching",
    textJpEn: "Even while an ARM is extended, Min Min can still move, jump, and attack with the other ARM. However, during a smash attack, only an attack with the other ARM is possible.",
    titlePt: "Ações Durante o Soco",
    textPt: "Mesmo com um ARM estendido, Min Min ainda pode se mover, pular, e atacar com o outro ARM. Porém, durante um ataque forte, só é possível atacar com o outro ARM.",
  },
  {
    titleEn: "[★☆☆] Attack Forward and Backward",
    titleJp: "前後への攻撃",
    textJp: "アームを伸ばして攻撃している最中、スティックを反対側に倒しながらもう片方のアームのボタンを押すと、両方のアームで前後同時に攻撃できる。",
    titleJpEn: "Attacking Forward and Backward",
    textJpEn: "While attacking with an extended ARM, tilting the stick the opposite way and pressing the other ARM's button lets Min Min attack forward and backward at the same time with both ARMs.",
    titlePt: "Atacando para Frente e para Trás",
    textPt: "Enquanto ataca com um ARM estendido, inclinar o direcional para o lado oposto e pressionar o botão do outro ARM permite que Min Min ataque para frente e para trás ao mesmo tempo com os dois ARMs.",
  },
  {
    titleEn: "[★☆☆] When the ARM Bounces Back",
    titleJp: "アームの跳ね返り",
    textJp: "くり出したアームは、カベや床にぶつかると跳ね返る。また、シールドされても跳ね返り、スキができる。",
    titleJpEn: "When the ARM Bounces Back",
    textJpEn: "A launched ARM bounces back if it hits a wall or floor. It also bounces back if blocked by a shield, leaving an opening.",
    titlePt: "Quando o ARM Ricocheteia",
    textPt: "Um ARM lançado ricocheteia se atingir uma parede ou o chão. Ele também ricocheteia se for bloqueado por um escudo, deixando uma brecha.",
  },
  {
    titleEn: "[★☆☆] Changing into a Dragon",
    titleJp: "龍への変化",
    textJp: "左腕は、相手を投げるか切りふだスタンバイで龍に変化し、攻撃力が上がる。相手を投げた場合は、しばらく経つか動けない状態になると、元の腕に戻る。",
    titleJpEn: "Transforming into a Dragon",
    textJpEn: "The left arm transforms into a dragon after throwing an opponent or when Final Smash Meter is full and on standby, increasing its power. If it transformed from a throw, it will return to normal after a while, or once Min Min becomes unable to act.",
    titlePt: "Transformando-se em Dragão",
    textPt: "O braço esquerdo se transforma num dragão depois de arremessar um oponente ou quando o Medidor de Ataque Final está cheio em espera, aumentando seu poder. Se a transformação veio de um arremesso, ele volta ao normal depois de um tempo, ou assim que Min Min ficar incapaz de agir.",
  },
  {
    titleEn: "[★☆☆] Three ARMS in One",
    titleJp: "３つのアーム",
    textJp: "右のアームは、３種類ある。ホットリングは曲げやすく、相手に当てやすい。メガボルトは、遅いが威力が高い。ドラゴンは、伸びた後さらにレーザーを出せる。",
    titleJpEn: "Three Types of ARMs",
    textJpEn: "There are 3 types of right ARM. Ramram curves easily and is easy to land on opponents. Megawatt is slow but powerful. Dragon can fire a laser after extending.",
    titlePt: "Três Tipos de ARM",
    textPt: "Existem 3 tipos de ARM direito. O Ramram curva com facilidade e é fácil de acertar no oponente. O Megawatt é lento, mas poderoso. O Dragon pode disparar um laser depois de se estender.",
  },
  {
    titleEn: "[★☆☆] Ramram",
    titleJp: "ホットリング",
    textJp: "ホットリングは、弧を描くように飛ぶ軽いアーム。威力は低めだが、素早く伸びてよく曲がり、相手をけん制しやすい。飛んでいる間は、カベや床をすり抜ける。",
    titleJpEn: "Hot Ring",
    textJpEn: "The Hot Ring is a light ARM that flies in an arc. Its power is on the lower side, but it extends quickly and curves well, making it easy to keep opponents in check with. While in flight, it passes through walls and floors.",
    titlePt: "Ramram",
    textPt: "O Ramram é um ARM leve que voa descrevendo um arco. Seu poder é relativamente baixo, mas se estende rapidamente e curva bem, facilitando pressionar o oponente à distância. Enquanto está voando, ele atravessa paredes e o chão.",
  },
  {
    titleEn: "[★☆☆] Megawatt",
    titleJp: "メガボルト",
    textJp: "メガボルトは、力をためると電撃を帯びる、鉄球のような重いアーム。伸びるのが遅くあまり曲がらないが、代わりに高い威力を誇り、とどめの一撃に最適。",
    titleJpEn: "Megavolt",
    textJpEn: "Megavolt is a heavy, iron-ball-like ARM that becomes charged with electricity when power is built up. It extends slowly and doesn't curve much, but in exchange it boasts high power, making it ideal for a finishing blow.",
    titlePt: "Megawatt",
    textPt: "O Megawatt é um ARM pesado, parecido com uma bola de ferro, que fica carregado de eletricidade quando a força é acumulada. Ele se estende devagar e não curva muito, mas em troca tem alto poder, sendo ideal para o golpe final.",
  },
  {
    titleEn: "[★☆☆] Dragon",
    titleJp: "ドラゴン",
    textJp: "ドラゴンは、龍のような形をしたアームで、左右両方に装備できる。スマッシュ攻撃時、伸びきる瞬間にボタンを押していると、近くの相手へレーザーを放つ。",
    titleJpEn: "Dragon",
    textJpEn: "Dragon is an ARM shaped like a dragon, and it can be equipped on either the left or right arm. During a smash attack, if the button is still held at the moment it fully extends, it fires a laser at nearby opponents.",
    titlePt: "Dragon",
    textPt: "O Dragon é um ARM em formato de dragão, e pode ser equipado tanto no braço esquerdo quanto no direito. Durante um ataque forte, se o botão ainda estiver pressionado no momento em que ele se estende por completo, ele dispara um laser em oponentes próximos.",
  },
  {
    titleEn: "[★☆☆] ARMS Jump (Up Special)",
    titleJp: "アームジャンプ 【上必殺ワザ】",
    textJp: "アームを伸ばしていない時に地上で出すと、アームを支えにジャンプする。跳び上がる瞬間、全身が無敵になる。ボタン長押しでより高く跳び、無敵時間も伸びる。",
    titleJpEn: "ARMS Jump (Up Special)",
    textJpEn: "Using this on the ground while no ARM is extended launches Min Min into the air using her ARMs for support. Her whole body becomes invincible the instant she leaps. Holding the button down lets her jump higher and extends the duration of invincibility.",
    titlePt: "ARMS Jump (Especial Superior)",
    textPt: "Usar esse golpe no chão enquanto nenhum ARM está estendido lança Min Min para o alto usando os ARMs como apoio. Seu corpo inteiro fica invencível no instante em que ela salta. Segurar o botão permite pular mais alto e estende a duração da invencibilidade.",
  },
  {
    titleEn: "[★☆☆] Maneuvering the ARMS Jump (Up Special)",
    titleJp: "アームジャンプの左右移動 【上必殺ワザ】",
    textJp: "跳び上がる前にスティックを左右に倒しておくと、斜めにジャンプできる。落下中も、少し左右に移動できる。",
    titleJpEn: "Moving Left and Right with ARMS Jump (Up Special)",
    textJpEn: "Tilting the stick left or right before leaping allows for a diagonal jump. Min Min can also move slightly left or right while falling.",
    titlePt: "Movendo-se para os Lados com o ARMS Jump (Especial Superior)",
    textPt: "Inclinar o direcional para a esquerda ou direita antes de saltar permite um pulo na diagonal. Min Min também pode se mover um pouco para os lados enquanto cai.",
  },
  {
    titleEn: "[★☆☆] Using ARM Hook (Up Special)",
    titleJp: "アームフックで復帰 【上必殺ワザ】",
    textJp: "空中で出すと、左のアームを斜め上に伸ばす。ガケに当てると、つかまってぶら下がる。ボタンやスティック上入力で、アームを縮めて復帰できる。",
    titleJpEn: "Recovering with ARM Hook (Up Special)",
    textJpEn: "Using this in midair extends the left ARM diagonally upward. If it hits a ledge, Min Min grabs on and hangs from it. Pressing the button or tilting the stick up retracts the ARM to recover.",
    titlePt: "Recuperando-se com o ARM Hook (Especial Superior)",
    textPt: "Usar esse golpe no ar estende o ARM esquerdo na diagonal para cima. Se atingir uma borda, Min Min se agarra e fica pendurada nela. Pressionar o botão ou inclinar o direcional para cima retrai o ARM para se recuperar.",
  },
  {
    titleEn: "[★☆☆] ARM Change (Down Special)",
    titleJp: "アームチェンジ 【下必殺ワザ】",
    textJp: "右のアームを、ホットリング、メガボルト、ドラゴンの順で切り替える。攻撃中や動けない時以外は、いつでも切り替えられる。",
    titleJpEn: "ARM Change (Down Special)",
    textJpEn: "Switches the right ARM in the order Hot Ring, Megavolt, Dragon. It can be switched at any time, except while attacking or unable to act.",
    titlePt: "ARM Change (Especial Inferior)",
    textPt: "Troca o ARM direito na ordem Ramram, Megawatt, Dragon. Pode ser trocado a qualquer momento, exceto enquanto ataca ou está incapaz de agir.",
  },
  {
    titleEn: "[★☆☆] ARMS Rush (Final Smash)",
    titleJp: "ARMSラッシュ 【最後の切りふだ】",
    textJp: "左腕を龍に変化させて、パンチをくり出す。当たった相手を１人だけ巻き込んで、駆けつけたARMSファイターたちと共に次々とパンチを叩き込み、相手を大きくふっとばす。",
    titleJpEn: "ARMS Rush (Final Smash)",
    textJpEn: "Transforms the left arm into a dragon and throws a punch. It catches only one opponent that it hits, and together with ARMS fighters who rush in, they land punch after punch, sending the opponent flying far.",
    titlePt: "ARMS Rush (Ataque Final)",
    textPt: "Transforma o braço esquerdo num dragão e desfere um soco. Ele atinge apenas um oponente, e junto com lutadores de ARMS que chegam correndo, eles desferem soco após soco, lançando o oponente longe.",
  },
  {
    titleEn: "[★☆☆] Kung Fu Combo and Flurry Attack",
    titleJp: "カンフーコンボと百裂攻撃",
    textJp: "地上で攻撃ボタンか必殺ワザボタンを短く押すと、３段階までキック攻撃をくり出せる。このコンボ中にボタンを連打すると、百裂攻撃になる。",
    titleJpEn: "Kung Fu Combo and Flurry Attack",
    textJpEn: "Briefly pressing the attack button or special-move button on the ground can bring out up to 3 stages of kick attacks. Mashing the button during this combo turns it into a flurry attack.",
    titlePt: "Kung Fu Combo e Ataque de Rajada",
    textPt: "Pressionar rapidamente o botão de ataque ou o botão de especial no chão pode desferir até 3 estágios de ataques de chute. Apertar o botão repetidamente durante esse combo o transforma num ataque de rajada.",
  },
  {
    titleEn: "[★☆☆] Reflecting Projectiles (Up Smash Attack)",
    titleJp: "飛び道具の反射",
    textJp: "上スマッシュ攻撃でくり出すキックは、相手の飛び道具を反射することができる。跳ね返したものは、受けた時より、少しスピードと威力が上がる。",
    titleJpEn: "Reflecting Projectiles",
    textJpEn: "The kick thrown out by the up smash attack can reflect an opponent's projectile. A reflected projectile gains a slight boost in speed and power compared to when it was received.",
    titlePt: "Refletindo Projéteis",
    textPt: "O chute desferido pelo ataque forte para cima pode refletir o projétil de um oponente. Um projétil refletido ganha um pequeno aumento de velocidade e poder em comparação a quando foi recebido.",
  },
  {
    titleEn: "[★☆☆] Neutral Air Attack",
    titleJp: "通常空中攻撃",
    textJp: "アームを回転するように振り回して攻撃する。威力や回転する速さは、装備しているアームによって異なる。",
    titleJpEn: "Neutral Air Attack",
    textJpEn: "Attacks by swinging the ARM around in a spinning motion. The power and spinning speed vary depending on the equipped ARM.",
    titlePt: "Ataque Aéreo Neutro",
    textPt: "Ataca girando o ARM numa rotação. O poder e a velocidade de rotação variam de acordo com o ARM equipado.",
  },
];

async function main() {
  const minmin = await db.fighter.findFirst({
    where: { name: { contains: "Min Min", mode: "insensitive" } },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!minmin) { console.log("Min Min not found"); return; }

  await db.fighter.update({
    where: { id: minmin.id },
    data: {
      curatorOverviewEn: "Min Min plays less like a single attacker and more like two independent arms sharing a body: the attack button throws the left ARM, the special-move button throws the right, and either one can be flicked into a smash version with more reach and power — or held into a Smash Hold that charges up and changes the move's properties entirely. Whichever ARM is out, she's still free to walk, jump, and throw a punch with the other one, and angling the stick as she fires lets both ARMs strike forward and backward at once. The catch is that an extended ARM isn't safe to leave hanging: it bounces off walls, floors, and shields alike, leaving her open if it doesn't land clean. The right ARM cycles through three completely different tools — Ramram curves easily and phases through terrain for quick pressure, Megawatt is slow and barely curves but hits like a truck, and Dragon can fire a laser at the peak of a smash if the button's still held — while the left arm periodically turns into a dragon after a throw or once her Final Smash is charged, hitting much harder until it reverts. Recovery options split the same way: ARMS Jump launches her upward with a full-body invincibility window that gets longer the more it's charged, while ARM Hook is a tether that can grab a ledge from a diagonal reach. Even her grounded combo game rewards restraint — short taps chain into a 3-hit kung fu combo that turns into a flurry attack if the button is mashed, and her up smash doubles as a projectile reflector. Every one of her tools trades a little safety for a lot of range, which makes patience and spacing her real weapon.",
      curatorOverviewPt: "Min Min joga menos como uma atacante única e mais como dois braços independentes dividindo um corpo: o botão de ataque desfere o ARM esquerdo, o botão de especial desfere o direito, e qualquer um dos dois pode virar uma versão forte com um input rápido no direcional, ganhando mais alcance e poder — ou ser segurado num Smash Hold que carrega energia e muda completamente as propriedades do golpe. Seja qual for o ARM em uso, ela ainda pode andar, pular, e desferir um soco com o outro, e inclinar o direcional enquanto dispara permite que os dois ARMs ataquem para frente e para trás ao mesmo tempo. O problema é que um ARM estendido não é seguro de deixar solto: ele ricocheteia em paredes, chão e escudos igualmente, deixando-a exposta se não acertar de forma limpa. O ARM direito alterna entre três ferramentas completamente diferentes — o Ramram curva com facilidade e atravessa o cenário para pressão rápida, o Megawatt é lento e quase não curva, mas acerta como um caminhão, e o Dragon pode disparar um laser no auge de um ataque forte se o botão ainda estiver pressionado — enquanto o braço esquerdo periodicamente se transforma num dragão depois de um arremesso ou quando o Ataque Final está carregado, acertando muito mais forte até reverter. As opções de recuperação se dividem da mesma forma: o ARMS Jump a lança para cima com uma janela de invencibilidade total que fica mais longa quanto mais carregada, enquanto o ARM Hook é um gancho que pode agarrar uma borda com um alcance diagonal. Até seu jogo de combo no chão recompensa a contenção — toques curtos encadeiam num combo de kung fu de 3 acertos que vira um ataque de rajada se o botão for apertado repetidamente, e seu ataque forte para cima também funciona como refletor de projéteis. Cada uma das ferramentas dela troca um pouco de segurança por muito alcance, o que torna a paciência e o posicionamento sua verdadeira arma.",
      curatorOverviewJp: "ミェンミェンは、１人の攻撃者というより、２本の独立した腕を１つの体で共有しているかのようにプレイされる——攻撃ボタンで左のアーム、必殺ワザボタンで右のアームを繰り出し、どちらもはじき入力でリーチとパワーが上がるスマッシュ版に変えられる——あるいはボタンを押し続けてスマッシュホールドし、力をためてワザの特性をまったく別物に変えることもできる。どちらのアームを出していても、彼女は自由に歩き、ジャンプし、もう片方の腕でパンチをくり出せる。発射しながらスティックを傾ければ、両方のアームで前後同時に攻撃することも可能だ。ただし、伸ばしたアームは放置していても安全ではない——カベにも床にもシールドにも同じように跳ね返り、きれいに当たらなければスキだらけになる。右のアームは、まったく性質の異なる３つの道具を切り替えて使う——ホットリングはよく曲がり、地形をすり抜けて素早いけん制ができ、メガボルトは遅くあまり曲がらないが強烈な一撃を持ち、ドラゴンはボタンを押し続けたままスマッシュのピークを迎えるとレーザーを放てる——一方で左腕は、相手を投げた後や最後の切りふだが準備万端になると定期的に龍へと変化し、元に戻るまでずっと強く攻撃できる。復帰手段も同じように分かれている——アームジャンプは全身無敵の時間を伴って彼女を打ち上げ、チャージするほどその時間は長くなる。一方アームフックは斜め方向にリーチするガケつかまり技だ。地上のコンボですら我慢が報われる作りになっている——短い入力を続けるとカンフーコンボが３段まで繋がり、ボタンを連打すれば百裂攻撃に変わる。そして上スマッシュ攻撃は飛び道具の反射役も兼ねている。彼女の道具はどれも、多少の安全性と引き換えに大きなリーチを手に入れる仕組みで、そのぶん我慢強さと間合い管理こそが彼女の本当の武器になる。",
      curatorOverviewJpEn: "Min Min plays less like a single attacker and more like two independent arms sharing one body — the attack button brings out the left ARM, the special-move button brings out the right, and either one can be turned into a smash version with more reach and power via a flick input, or held down into a Smash Hold that charges power and completely changes the move's properties. Whichever ARM is out, she remains free to walk, jump, and throw a punch with the other arm. Tilting the stick while firing even lets both ARMs attack forward and backward at the same time. However, an extended ARM isn't safe to leave out — it bounces back off walls, floors, and shields alike, leaving her wide open if it doesn't land cleanly. The right ARM cycles between three tools with completely different properties — Hot Ring curves well and passes through terrain for quick pressure, Megavolt is slow and barely curves but carries devastating power, and Dragon can fire a laser if the button is still held right as a smash attack peaks — while the left arm periodically transforms into a dragon after throwing an opponent or once the Final Smash is fully charged, hitting much harder until it reverts. Her recovery options split the same way — ARMS Jump launches her upward with a window of full-body invincibility that grows longer the more it's charged, while ARM Hook is a ledge-grab move that reaches out diagonally. Even her grounded combo game is built to reward patience — short inputs chain into a kung fu combo of up to 3 hits, which turns into a flurry attack if the button is mashed. And the up smash attack doubles as a projectile reflector. Every one of her tools trades a bit of safety for greater reach, which makes patience and spacing her true weapon.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = minmin.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: minmin.id }, data: { curationStatus: "approved" } });
  console.log("✅ Min Min aprovada");

  // Sem FighterMove (0 registros) — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista ARMS corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.
  // Achado curioso preservado, não é erro: o ARM oficialmente localizado como "Ramram" (EN) se chama
  // "ホットリング" ("Hot Ring") no texto JP original — mantido fiel em cada idioma, sem reconciliar.

  await db.$disconnect();
}
main().catch(console.error);
