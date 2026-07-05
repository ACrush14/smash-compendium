import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Joker's Origins",
    titleJp: "ジョーカーの初登場作品",
    textJp: "ジョーカーの初登場作品は、２０１６年発売の『ペルソナ５』。正義感が強い青年で、悪人を改心させる「心の怪盗団」のリーダー。",
    titleJpEn: "Joker's Debut Work",
    textJpEn: "Joker's debut was in Persona 5, released in 2016. He's a young man with a strong sense of justice, and the leader of the \"Phantom Thieves of Hearts,\" who reform wrongdoers.",
    titlePt: "As Origens de Joker",
    textPt: "A estreia de Joker foi em Persona 5, lançado em 2016. Ele é um jovem com um forte senso de justiça, e o líder dos \"Ladrões Fantasmas do Coração\", que reformam pessoas más.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "とある事件をきっかけに、秀尽学園に転入し、ペルソナ能力に目覚めた。怪盗の姿になると、普段とは雰囲気ががらりと変わる。",
    titleJpEn: "In the Original Games",
    textJpEn: "Triggered by a certain incident, he transfers to Shujin Academy and awakens to his Persona ability. When he takes on his Phantom Thief form, his atmosphere completely changes from his usual self.",
    titlePt: "Nos Jogos Originais",
    textPt: "Após um certo incidente, ele se transfere para a Academia Shujin e desperta sua habilidade Persona. Quando assume sua forma de Ladrão Fantasma, sua atmosfera muda completamente em relação ao seu eu de todo dia.",
  },
  {
    titleEn: "[★☆☆] Gun / Gun Special (Neutral Special)",
    titleJp: "ガン / ガンスペシャル 【通常必殺ワザ】",
    textJp: "左手の銃で、素早く射撃を行う。ボタン長押しか連打で、連続射撃できる。アルセーヌ召喚中は、射撃回数が増え、強化される。",
    titleJpEn: "Gun / Gun Special (Neutral Special)",
    textJpEn: "Fires quickly with the gun in his left hand. Holding the button or pressing it repeatedly allows continuous fire. While Arsène is summoned, the number of shots increases and the move is strengthened.",
    titlePt: "Gun / Gun Special (Especial Neutro)",
    textPt: "Dispara rapidamente com a arma na mão esquerda. Segurar o botão ou pressioná-lo repetidamente permite disparos contínuos. Enquanto Arsène está invocado, o número de tiros aumenta e o golpe é fortalecido.",
  },
  {
    titleEn: "[★★☆] Jumping during Gun / Gun Special (Neutral Special)",
    titleJp: "ガン / ガンスペシャル中のジャンプ 【通常必殺ワザ】",
    textJp: "地上で射撃後、ジャンプボタンを押すと、飛び上がりながら真下に連射する。スティック入力すれば、空中で左右に移動もできる。",
    titleJpEn: "Jumping during Gun / Gun Special (Neutral Special)",
    textJpEn: "After firing on the ground, pressing the jump button makes him leap up while firing rapidly straight down. Inputting the stick also lets him move left or right in the air.",
    titlePt: "Pulando durante Gun / Gun Special (Especial Neutro)",
    textPt: "Após atirar no chão, pressionar o botão de pulo faz ele saltar enquanto dispara rapidamente para baixo. Inputar o direcional também permite se mover para esquerda ou direita no ar.",
  },
  {
    titleEn: "[★☆☆] Dodging during Gun / Gun Special (Neutral Special)",
    titleJp: "ガン / ガンスペシャル中の回避射撃 【通常必殺ワザ】",
    textJp: "一度撃った後、必殺ワザボタンを押しながら左右にスティック入力で、回避しながら射撃をくり出せる。",
    titleJpEn: "Dodging during Gun / Gun Special (Neutral Special)",
    textJpEn: "After firing once, holding the special-move button while inputting the stick left or right lets him fire while dodging.",
    titlePt: "Esquivando durante Gun / Gun Special (Especial Neutro)",
    textPt: "Após atirar uma vez, segurar o botão de golpe especial enquanto inputa o direcional para esquerda ou direita permite atirar enquanto esquiva.",
  },
  {
    titleEn: "[★☆☆] Vulnerability While Gun Dodging (Neutral Special)",
    titleJp: "回避射撃のスキ 【通常必殺ワザ】",
    textJp: "回避しながらの射撃中は、通常の回避よりも短い時間、無敵になる。ただし、通常の回避と同じように、その後の回避や、回避射撃のスキが増える。",
    titleJpEn: "Openings from Dodge-Firing (Neutral Special)",
    textJpEn: "While firing while dodging, he becomes invincible for a shorter time than a normal dodge. However, just like a normal dodge, repeated dodges or dodge-fires afterward will increase his vulnerability.",
    titlePt: "Brechas do Tiro-Esquiva (Especial Neutro)",
    textPt: "Ao atirar enquanto esquiva, ele fica invencível por um tempo mais curto do que uma esquiva normal. Porém, assim como numa esquiva normal, esquivas ou tiros-esquiva repetidos depois aumentam sua vulnerabilidade.",
  },
  {
    titleEn: "[★★☆] Gun / Gun Special in the Air (Neutral Special)",
    titleJp: "空中でのガン / ガンスペシャル 【通常必殺ワザ】",
    textJp: "空中で一度撃った後、スティックを上に倒しながらボタンを押すと乱れ撃ち、下に倒しながらボタンを押すと、真下への射撃に繋げられる。",
    titleJpEn: "Gun / Gun Special in the Air (Neutral Special)",
    textJpEn: "After firing once in the air, tilting the stick up while pressing the button unleashes rapid fire, and tilting it down while pressing the button lets him follow up with a shot straight down.",
    titlePt: "Gun / Gun Special no Ar (Especial Neutro)",
    textPt: "Após atirar uma vez no ar, inclinar o direcional para cima enquanto pressiona o botão libera uma rajada, e inclinar para baixo enquanto pressiona o botão permite emendar com um tiro para baixo.",
  },
  {
    titleEn: "[★☆☆] Eiha (Side Special)",
    titleJp: "エイハ 【横必殺ワザ】",
    textJp: "継続ダメージを与える弾を、斜めに発射する。弾は、相手に当たると炸裂し、相手を浮かせる。",
    titleJpEn: "Eiha (Side Special)",
    textJpEn: "Fires a bolt diagonally that deals damage over time. The bolt explodes on hitting an opponent, launching them into the air.",
    titlePt: "Eiha (Especial Lateral)",
    textPt: "Dispara um raio na diagonal que causa dano contínuo. O raio explode ao acertar um oponente, lançando-o para o ar.",
  },
  {
    titleEn: "[★☆☆] Eigaon (Side Special)",
    titleJp: "エイガオン 【横必殺ワザ】",
    textJp: "アルセーヌ召喚中は、エイハよりも弾が大きく速い、エイガオンを使える。ふっとばし力や継続ダメージが強化され、地形に当たると炸裂する。",
    titleJpEn: "Eigaon (Side Special)",
    textJpEn: "While Arsène is summoned, he can use Eigaon, whose bolt is bigger and faster than Eiha's. Its launch power and continuous damage are strengthened, and it explodes on hitting the terrain.",
    titlePt: "Eigaon (Especial Lateral)",
    textPt: "Enquanto Arsène está invocado, ele pode usar Eigaon, cujo raio é maior e mais rápido que o de Eiha. Seu poder de lançamento e dano contínuo são reforçados, e explode ao atingir o cenário.",
  },
  {
    titleEn: "[★★☆] Eiha/Eigaon Damage (Side Special)",
    titleJp: "エイハ / エイガオンのダメージ 【横必殺ワザ】",
    textJp: "攻撃が当たった時のダメージよりも、継続ダメージを合計したほうが大きい。",
    titleJpEn: "Eiha / Eigaon Damage (Side Special)",
    textJpEn: "The total continuous damage ends up being greater than the damage from the initial hit itself.",
    titlePt: "Dano de Eiha / Eigaon (Especial Lateral)",
    textPt: "O dano contínuo total acaba sendo maior do que o dano do acerto inicial em si.",
  },
  {
    titleEn: "[★☆☆] Grappling Hook (Up Special)",
    titleJp: "ワイヤーアクション 【上必殺ワザ】",
    textJp: "斜め上にワイヤーを射出し、当たった相手を引き寄せて、投げ飛ばす。空中でガケに当てれば、復帰にも使える。アイテムに使えば、入手できる。",
    titleJpEn: "Wire Action (Up Special)",
    textJpEn: "Fires a wire diagonally upward, pulling in and throwing any opponent it hits. Hitting the ledge while airborne lets it be used for recovery as well. Using it on an item lets him obtain it.",
    titlePt: "Wire Action (Especial Superior)",
    textPt: "Dispara um cabo na diagonal para cima, puxando e arremessando qualquer oponente que atingir. Acertar a borda enquanto está no ar também permite usá-lo para recuperação. Usá-lo num item permite obtê-lo.",
  },
  {
    titleEn: "[★☆☆] Wings of Rebellion (Up Special)",
    titleJp: "反逆の翼 【上必殺ワザ】",
    textJp: "アルセーヌ召喚中に使える、その翼の力で飛翔するワザ。大きく上昇できるが、攻撃には使えない。",
    titleJpEn: "Wings of Rebellion (Up Special)",
    textJpEn: "A move usable while Arsène is summoned, flying with the power of his wings. It can rise a great distance, but it can't be used to attack.",
    titlePt: "Wings of Rebellion (Especial Superior)",
    textPt: "Um golpe utilizável enquanto Arsène está invocado, voando com o poder de suas asas. Ele pode subir uma grande distância, mas não pode ser usado para atacar.",
  },
  {
    titleEn: "[★★☆] Wings of Rebellion and Moving Left and Right (Up Special)",
    titleJp: "反逆の翼と左右移動 【上必殺ワザ】",
    textJp: "飛び上がる前にスティックを左右に倒しておくと、上昇の角度を少し変えられる。落下中も、スティック入力で少しだけ移動可能。",
    titleJpEn: "Wings of Rebellion and Left/Right Movement (Up Special)",
    textJpEn: "Tilting the stick left or right before rising lets you slightly change the angle of ascent. Even while falling, stick input allows a small amount of movement.",
    titlePt: "Wings of Rebellion e Movimento Lateral (Especial Superior)",
    textPt: "Inclinar o direcional para esquerda ou direita antes de subir permite mudar um pouco o ângulo da subida. Mesmo durante a queda, o input do direcional permite uma pequena movimentação.",
  },
  {
    titleEn: "[★☆☆] Rebel's Guard (Down Special)",
    titleJp: "反逆ガード 【下必殺ワザ】",
    textJp: "ワザ発動でかまえを取り、相手の攻撃を受け止める。受けるダメージを減らせるうえ、反逆ゲージが大きくたまる。",
    titleJpEn: "Rebel's Guard (Down Special)",
    textJpEn: "Using this move takes a stance and blocks the opponent's attack. It reduces the damage taken, and also builds up the Rebellion Gauge significantly.",
    titlePt: "Rebel's Guard (Especial Inferior)",
    textPt: "Usar esse golpe assume uma postura e bloqueia o ataque do oponente. Isso reduz o dano recebido, e também acumula bastante o Medidor de Rebelião.",
  },
  {
    titleEn: "[★☆☆] After Rebel's Guard (Down Special)",
    titleJp: "反逆ガードからの行動 【下必殺ワザ】",
    textJp: "ボタンを押したままにすると、攻撃を受け止める時間を延ばすことができる。相手の攻撃を受け止めた時、ボタンを離すと、反撃して相手を引き離す。",
    titleJpEn: "Action after Rebel's Guard (Down Special)",
    textJpEn: "Holding the button down extends how long the block lasts. When an opponent's attack is blocked, releasing the button counterattacks and pushes them away.",
    titlePt: "Ação após o Rebel's Guard (Especial Inferior)",
    textPt: "Segurar o botão prolonga por quanto tempo o bloqueio dura. Quando um ataque do oponente é bloqueado, soltar o botão desfere um contra-ataque e o empurra para longe.",
  },
  {
    titleEn: "[★☆☆] Tetrakarn / Makarakarn (Down Special)",
    titleJp: "テトラカーン / マカラカーン 【下必殺ワザ】",
    textJp: "アルセーヌ召喚中のワザで、相手の直接攻撃をテトラカーンでカウンターする。飛び道具を受けると、マカラカーンで反射する。",
    titleJpEn: "Tetrakarn / Makarakarn (Down Special)",
    textJpEn: "A move usable while Arsène is summoned. It counters an opponent's direct attacks with Tetrakarn. When it takes a projectile, Makarakarn reflects it.",
    titlePt: "Tetrakarn / Makarakarn (Especial Inferior)",
    textPt: "Um golpe utilizável enquanto Arsène está invocado. Ele contra-ataca ataques diretos do oponente com Tetrakarn. Ao receber um projétil, Makarakarn o reflete.",
  },
  {
    titleEn: "[★☆☆] All-Out Attack (Final Smash)",
    titleJp: "総攻撃 【最後の切りふだ】",
    textJp: "正面にダッシュし、相手に当たると、怪盗団の仲間と共に総攻撃を仕掛ける。登場するメンバーの組み合わせは２パターン、セリフは６パターンある。",
    titleJpEn: "All-Out Attack (Final Smash)",
    textJpEn: "Dashes forward, and if it connects with an opponent, unleashes an All-Out Attack together with his Phantom Thief allies. There are 2 patterns of which members appear, and 6 patterns of spoken lines.",
    titlePt: "All-Out Attack (Ataque Final)",
    textPt: "Avança para frente e, se acertar um oponente, desfere um All-Out Attack junto com seus aliados Ladrões Fantasmas. Existem 2 padrões de quais membros aparecem, e 6 padrões de falas.",
  },
  {
    titleEn: "[★★☆] Charging with All-Out Attack (Final Smash)",
    titleJp: "総攻撃での突進 【最後の切りふだ】",
    textJp: "最初のダッシュで、４人まで相手を巻き込める。相手にヒットしなくても、即座に逆方向にスティック入力すれば、反転ダッシュできる。",
    titleJpEn: "Charging with All-Out Attack (Final Smash)",
    textJpEn: "The initial dash can catch up to four opponents. Even if it doesn't hit anyone, immediately inputting the stick in the opposite direction lets him dash back the other way.",
    titlePt: "Investida do All-Out Attack (Ataque Final)",
    textPt: "A investida inicial pode pegar até quatro oponentes. Mesmo que não acerte ninguém, inputar imediatamente o direcional na direção oposta permite avançar de volta na outra direção.",
  },
  {
    titleEn: "[★☆☆] End the Battle with an All-Out Attack (Final Smash)",
    titleJp: "総攻撃で試合終了 【最後の切りふだ】",
    textJp: "終了時に相手の蓄積ダメージが高いと、即撃墜できる。この撃墜で試合が終わると、そのまま対戦結果表示に繋がる、特別な演出を見られるかも。",
    titleJpEn: "Ending the Match with All-Out Attack (Final Smash)",
    textJpEn: "If the opponent's accumulated damage is high enough by the end, they can be KO'd instantly. If this KO ends the match, you might get to see a special presentation leading straight into the results screen.",
    titlePt: "Encerrando a Partida com All-Out Attack (Ataque Final)",
    textPt: "Se o dano acumulado do oponente estiver alto o suficiente ao final, ele pode ser nocauteado instantaneamente. Se esse nocaute encerrar a partida, você pode ver uma apresentação especial que leva direto à tela de resultado.",
  },
  {
    titleEn: "[★★☆] Down Air Attack",
    titleJp: "下空中攻撃",
    textJp: "アルセーヌを召喚している間は、下空中攻撃にメテオ効果が追加される。",
    titleJpEn: "Down Air Attack",
    textJpEn: "While Arsène is summoned, the down aerial attack gains an added meteor effect.",
    titlePt: "Ataque Aéreo Inferior",
    textPt: "Enquanto Arsène está invocado, o ataque aéreo inferior ganha um efeito meteoro adicional.",
  },
  {
    titleEn: "[★☆☆] Rebellion Gauge",
    titleJp: "反逆ゲージ",
    textJp: "ダメージを受けたり、反逆ガードで攻撃を受けたりすると、反逆ゲージがたまる。満タンになると、アルセーヌが登場。必殺ワザが変化し、通常ワザも強化される。",
    titleJpEn: "Rebellion Gauge",
    textJpEn: "Taking damage, or blocking an attack with Rebel's Guard, fills up the Rebellion Gauge. Once it's full, Arsène appears. Special moves change, and standard moves are also strengthened.",
    titlePt: "Medidor de Rebelião",
    textPt: "Receber dano, ou bloquear um ataque com o Rebel's Guard, enche o Medidor de Rebelião. Quando ele fica cheio, Arsène aparece. Os golpes especiais mudam, e os golpes normais também são reforçados.",
  },
  {
    titleEn: "[★☆☆] Rebellion Gauge and Arsene",
    titleJp: "反逆ゲージとアルセーヌ",
    textJp: "アルセーヌが登場している間は、反逆ゲージが増えない。ゲージは、時間経過やジョーカーへのダメージで減り、なくなるとアルセーヌが退場する。",
    titleJpEn: "Rebellion Gauge and Arsène",
    textJpEn: "While Arsène is present, the Rebellion Gauge doesn't increase. The gauge decreases over time or from damage taken by Joker, and once it's empty, Arsène leaves.",
    titlePt: "Medidor de Rebelião e Arsène",
    textPt: "Enquanto Arsène está presente, o Medidor de Rebelião não aumenta. O medidor diminui com o tempo ou com dano recebido por Joker, e quando esvazia, Arsène vai embora.",
  },
  {
    titleEn: "[★★☆] Rebellion Gauge in Team Battle",
    titleJp: "チーム乱闘での反逆ゲージ",
    textJp: "チーム乱闘中は、チームメイトがダメージを受けたり、撃墜されたときにも、反逆ゲージが少したまる。",
    titleJpEn: "Rebellion Gauge in Team Battles",
    textJpEn: "During Team Battles, the Rebellion Gauge also fills up a little when a teammate takes damage or is KO'd.",
    titlePt: "Medidor de Rebelião em Partidas em Equipe",
    textPt: "Em Partidas em Equipe, o Medidor de Rebelião também enche um pouco quando um companheiro de equipe recebe dano ou é nocauteado.",
  },
  {
    titleEn: "[★☆☆] Special Cinematics for When Arsene Is Summoned",
    titleJp: "アルセーヌ召喚の特別な演出",
    textJp: "１対１、または相手がすべてCPのときだけ、アルセーヌの出現に合わせて、カットインが入ることがある。",
    titleJpEn: "Special Presentation for Arsène's Summon",
    textJpEn: "Only in 1-on-1 matches, or when all opponents are CPUs, a cut-in may play timed with Arsène's appearance.",
    titlePt: "Apresentação Especial para a Invocação de Arsène",
    textPt: "Só em partidas 1 contra 1, ou quando todos os oponentes são CPUs, um corte especial pode aparecer sincronizado com o surgimento de Arsène.",
  },
];

async function main() {
  const joker = await db.fighter.findFirst({
    where: { name: "Joker" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!joker) { console.log("Joker not found"); return; }

  await db.fighter.update({
    where: { id: joker.id },
    data: {
      curatorOverviewEn: "Joker's entire kit revolves around building toward Arsène. Outside of the Persona, his neutral is built on Gun — a fast, spammable projectile that cancels into an aerial jump for a downward barrage, or into a dodge with brief but shrinking invincibility if you lean on it too often — while Eiha adds a damage-over-time bolt whose lingering damage actually outweighs the initial hit. None of that damage is wasted, since every hit charges the Rebellion Gauge, and blocking with Rebel's Guard fills it even faster while reducing the damage taken. Once the gauge is full, Arsène takes over: Eiha upgrades into the bigger, faster Eigaon, Rebel's Guard becomes a proper counter against both melee and projectiles with Tetrakarn/Makarakarn, Wings of Rebellion turns the up special into a pure vertical recovery with real distance, and even the down aerial picks up a meteor effect. The catch is that the gauge only drains once Arsène is out — it doesn't refill during that window, so the buffed kit is a limited resource, not a permanent upgrade. And when the Final Smash connects, All-Out Attack can end a stock outright against high enough damage, with a bonus cinematic if it closes out the match entirely.",
      curatorOverviewPt: "Todo o kit de Joker gira em torno de construir o caminho até Arsène. Fora da Persona, o jogo neutro dele se apoia no Gun — um projétil rápido e espamável que cancela num pulo aéreo pra uma rajada descendente, ou numa esquiva com invencibilidade breve, mas cada vez menor se você abusar demais — enquanto Eiha adiciona um raio de dano contínuo cujo dano prolongado na verdade supera o do acerto inicial. Nenhum desse dano é desperdiçado, já que todo acerto carrega o Medidor de Rebelião, e bloquear com Rebel's Guard enche ele ainda mais rápido enquanto reduz o dano recebido. Quando o medidor enche, Arsène assume: Eiha vira o maior e mais rápido Eigaon, Rebel's Guard se torna um contra-ataque de verdade tanto contra corpo a corpo quanto projéteis com Tetrakarn/Makarakarn, Wings of Rebellion transforma o especial superior numa recuperação vertical pura com alcance de verdade, e até o ataque aéreo inferior ganha efeito meteoro. A pegadinha é que o medidor só esvazia enquanto Arsène está fora — ele não se enche de novo nessa janela, então o kit reforçado é um recurso limitado, não um upgrade permanente. E quando o Ataque Final conecta, o All-Out Attack pode encerrar um stock diretamente contra dano alto o suficiente, com um cinemático bônus se ele fechar a partida por completo.",
      curatorOverviewJp: "ジョーカーの技構成はすべて、アルセーヌへの道のりを築くことを中心にしている。ペルソナの力を借りない間は、彼の中央戦術は「ガン」に支えられている——連発できる速い飛び道具で、空中ジャンプにキャンセルして下方向への連射に繋げたり、頼りすぎると無敵時間がどんどん短くなる回避にキャンセルしたりできる——一方「エイハ」は継続ダメージを与える弾を追加し、その持続ダメージの合計は実は最初の一撃を上回る。そのダメージは無駄にならない。どの一撃も反逆ゲージをためるし、「反逆ガード」で受け止めればさらに速くたまり、なおかつ受けるダメージも減らせるからだ。ゲージが満タンになると、アルセーヌが登場する。「エイハ」はより大きく速い「エイガオン」に強化され、「反逆ガード」は「テトラカーン/マカラカーン」により近接・飛び道具の両方に対する本格的なカウンターになり、「反逆の翼」は上必殺ワザを本当の距離のある純粋な垂直復帰技に変え、下空中攻撃にさえメテオ効果が加わる。落とし穴は、ゲージはアルセーヌが登場している間しか減らないということ——その間はたまらないため、強化された技構成は永続的なアップグレードではなく限られた資源なのだ。そして最後の切りふだが決まれば、「総攻撃」は十分な蓄積ダメージがあればそのままストックを奪い切ることができ、それで試合が終われば特別な演出のおまけまで見られる。",
      curatorOverviewJpEn: "All of Joker's moveset centers on building the path toward Arsène. Outside of relying on the Persona, his neutral game is supported by \"Gun\" — a fast, spammable projectile that can be canceled into a midair jump leading into a downward barrage, or into a dodge whose invincibility gets shorter and shorter if you lean on it too much — while \"Eiha\" adds a bolt that deals continuous damage, and the total of that lingering damage actually exceeds the initial hit. None of that damage goes to waste, since every hit charges the Rebellion Gauge, and blocking with \"Rebel's Guard\" fills it even faster while also reducing the damage taken. Once the gauge is full, Arsène appears. \"Eiha\" upgrades into the bigger, faster \"Eigaon,\" \"Rebel's Guard\" becomes a proper counter against both melee and projectiles via \"Tetrakarn/Makarakarn,\" \"Wings of Rebellion\" turns the up special into a pure vertical recovery move with real range, and even the down aerial gains a meteor effect. The catch is that the gauge only drains while Arsène is out — it doesn't refill during that window — so the upgraded moveset is a limited resource rather than a permanent upgrade. And when the Final Smash lands, \"All-Out Attack\" can take a stock outright given high enough accumulated damage, with a bonus cinematic if it ends the match entirely.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = joker.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: joker.id }, data: { curationStatus: "approved" } });
  console.log("✅ Joker aprovado");

  // Sem FighterMove (0 registros) — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista Persona 5/Royal corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.

  await db.$disconnect();
}
main().catch(console.error);
