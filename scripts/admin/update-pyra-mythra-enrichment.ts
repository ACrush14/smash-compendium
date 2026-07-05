import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Pyra/Mythra's Origins",
    titleJp: "ホムラ / ヒカリの初登場作品",
    textJp: "ホムラとヒカリの初登場作品は、２０１７年発売の『ゼノブレイド２』。ブレイドという亜種生命体で、その中でも「天の聖杯」と呼ばれる特別な存在。",
    titleJpEn: "Pyra/Mythra's Debut Work",
    textJpEn: "Pyra and Mythra's first appearance was in Xenoblade Chronicles 2, released in 2017. They're Blades, a subspecies of life-form, and among them, a special existence called the \"Aegis.\"",
    titlePt: "As Origens de Pyra/Mythra",
    textPt: "A primeira aparição de Pyra e Mythra foi em Xenoblade Chronicles 2, lançado em 2017. Elas são Blades, uma subespécie de forma de vida, e entre elas, uma existência especial chamada \"Aegis\".",
  },
  {
    titleEn: "[★☆☆] Pyra/Mythra: In Their Series",
    titleJp: "ホムラ / ヒカリ ： 原作では",
    textJp: "ホムラとヒカリは、同じブレイドの別人格。だが性格は正反対で、容姿も大きく異なる。本来の人格だったヒカリが、かつてとある理由で自らを封印し、ホムラを作り出した。",
    titleJpEn: "In the Original Game",
    textJpEn: "Pyra and Mythra are different personalities of the same Blade. However, their personalities are complete opposites, and their appearances are also very different. Mythra, who was the original personality, once sealed herself away for a certain reason and created Pyra.",
    titlePt: "No Jogo Original",
    textPt: "Pyra e Mythra são personalidades diferentes da mesma Blade. Porém, suas personalidades são completamente opostas, e suas aparências também são bem diferentes. Mythra, que era a personalidade original, certa vez se selou por um determinado motivo e criou Pyra.",
  },
  {
    titleEn: "[★☆☆] Pyra/Mythra: Rex",
    titleJp: "ホムラ / ヒカリ ： レックス",
    textJp: "レックスは、『ゼノブレイド２』における主人公。ホムラ、ヒカリと絆を結んだドライバーである彼は、『スマブラ』では最後の切りふだや勝利した時の演出などに登場する。",
    titleJpEn: "Rex",
    textJpEn: "Rex is the protagonist of Xenoblade Chronicles 2. As the Driver who forged a bond with Pyra and Mythra, he appears in Super Smash Bros. during the Final Smash and victory scenes, among other moments.",
    titlePt: "Rex",
    textPt: "Rex é o protagonista de Xenoblade Chronicles 2. Como o Driver que formou um vínculo com Pyra e Mythra, ele aparece em Super Smash Bros. durante o Ataque Final e as cenas de vitória, entre outros momentos.",
  },
  {
    titleEn: "[★☆☆] Pyra/Mythra: Their Own Traits",
    titleJp: "ホムラ / ヒカリ ： それぞれの特徴",
    textJp: "ホムラはパワーに優れる。特に横スマッシュ攻撃のふっとばし力が高い。ヒカリはスピードに優れる。また、うまく回避すると反撃向きの特性が発動する。",
    titleJpEn: "Their Own Traits",
    textJpEn: "Pyra excels at power, especially with the high knockback of her side smash attack. Mythra excels at speed, and dodging well activates a trait suited for counterattacking.",
    titlePt: "Características Próprias",
    textPt: "Pyra se destaca em poder, especialmente com o alto poder de arremesso do ataque forte lateral dela. Mythra se destaca em velocidade, e esquivar bem ativa uma característica voltada para contra-ataques.",
  },
  {
    titleEn: "[★☆☆] Pyra/Mythra: Swap to Pyra / Swap to Mythra (Down Special)",
    titleJp: "ホムラチェンジ / ヒカリチェンジ 【下必殺ワザ】",
    textJp: "乱闘中、いつでも何度でもホムラとヒカリを切り替えられる。切り替え中は一瞬無敵になるが、スキも生じる。",
    titleJpEn: "Swap to Pyra / Swap to Mythra (Down Special)",
    textJpEn: "During a brawl, Pyra and Mythra can be swapped at any time, as many times as needed. Swapping grants a moment of invincibility, but it also creates an opening.",
    titlePt: "Trocar para Pyra / Trocar para Mythra (Especial Inferior)",
    textPt: "Durante uma partida, é possível trocar entre Pyra e Mythra a qualquer momento, quantas vezes forem necessárias. A troca concede um instante de invencibilidade, mas também cria uma brecha.",
  },
  {
    titleEn: "[★☆☆] Pyra: Flame Nova (Neutral Special)",
    titleJp: "ホムラ ： フレイムノヴァ 【通常必殺ワザ】",
    textJp: "剣を自分を中心に回転させ、周囲の相手をふっとばす。ボタン長押しで力をため、回転の威力と回数をアップできるが、ための保持はできない。",
    titleJpEn: "Pyra: Flame Nova (Neutral Special)",
    textJpEn: "Spins the sword around herself, launching opponents nearby. Holding the button charges power, increasing the strength and number of spins, but the charge can't be held indefinitely.",
    titlePt: "Pyra: Flame Nova (Especial Neutro)",
    textPt: "Gira a espada ao redor de si mesma, lançando oponentes próximos. Segurar o botão carrega energia, aumentando a força e o número de giros, mas a carga não pode ser mantida indefinidamente.",
  },
  {
    titleEn: "[★☆☆] Pyra: Flame Nova and Moving (Neutral Special)",
    titleJp: "ホムラ ： フレイムノヴァ中の移動 【通常必殺ワザ】",
    textJp: "剣が回転している間、スティックを左右に倒すと、回転を続けながらわずかに前後に移動できる。",
    titleJpEn: "Pyra: Flame Nova and Moving (Neutral Special)",
    textJpEn: "While the sword is spinning, tilting the stick left or right allows Pyra to move slightly forward and backward while continuing to spin.",
    titlePt: "Pyra: Flame Nova e Movimento (Especial Neutro)",
    textPt: "Enquanto a espada está girando, inclinar o direcional para a esquerda ou direita permite que Pyra se mova um pouco para frente e para trás enquanto continua girando.",
  },
  {
    titleEn: "[★☆☆] Pyra: Blazing End (Side Special)",
    titleJp: "ホムラ ： ブレイズエンド 【横必殺ワザ】",
    textJp: "剣を投げ、前方を薙ぎ払う。剣は、投げられた先で少し回転し続けてから手元に戻る。剣が戻るまでの間、移動はできるが、攻撃はできない。",
    titleJpEn: "Pyra: Blazing End (Side Special)",
    textJpEn: "Throws the sword, sweeping across the area in front. The sword keeps spinning a bit at its destination before returning to her hand. While it's returning, Pyra can move, but not attack.",
    titlePt: "Pyra: Blazing End (Especial Lateral)",
    textPt: "Arremessa a espada, varrendo a área à frente. A espada continua girando um pouco em seu destino antes de retornar à mão dela. Enquanto retorna, Pyra pode se mover, mas não atacar.",
  },
  {
    titleEn: "[★☆☆] Pyra: Blazing End and Flicking the Stick (Side Special)",
    titleJp: "ホムラ ： はじき入力でブレイズエンド 【横必殺ワザ】",
    textJp: "はじき入力でワザを出すと、剣の飛距離が伸びる。その分手元に戻るまでの時間が少し長くなるので、状況に応じて使い分けよう。",
    titleJpEn: "Pyra: Blazing End and Flicking the Stick (Side Special)",
    textJpEn: "Using a flick input brings out the move with a longer throwing distance. In exchange, it takes a bit longer for the sword to return, so use it depending on the situation.",
    titlePt: "Pyra: Blazing End com Input Rápido (Especial Lateral)",
    textPt: "Usar um input rápido no direcional executa o golpe com uma distância de arremesso maior. Em troca, leva um pouco mais de tempo para a espada retornar, então use de acordo com a situação.",
  },
  {
    titleEn: "[★☆☆] Pyra: Beginning of Blazing End (Side Special)",
    titleJp: "ホムラ ： ブレイズエンドの出始め 【横必殺ワザ】",
    textJp: "ワザの出始め、目の前をすくい上げるように攻撃する。相手に当てると、ふっとばして剣の回転に巻き込みやすい。はじき入力で、攻撃力とふっとばし力がアップする。",
    titleJpEn: "Pyra: Beginning of Blazing End (Side Special)",
    textJpEn: "At the very start of the move, Pyra attacks by scooping upward right in front. If it hits an opponent, it launches them, making it easy to catch them in the sword's spin. A flick input increases both the damage and knockback.",
    titlePt: "Pyra: Início do Blazing End (Especial Lateral)",
    textPt: "Bem no início do golpe, Pyra ataca golpeando para cima bem à frente. Se atingir um oponente, o lança, facilitando pegá-lo no giro da espada. Um input rápido no direcional aumenta tanto o dano quanto o poder de arremesso.",
  },
  {
    titleEn: "[★☆☆] Pyra: Blazing End near a Wall (Side Special)",
    titleJp: "ホムラ ： カベ際でのブレイズエンド 【横必殺ワザ】",
    textJp: "カベに近すぎる場所などでワザを出すと、剣はぶつかって、回転することなく手元に戻ってきてしまう。",
    titleJpEn: "Pyra: Blazing End near a Wall (Side Special)",
    textJpEn: "Using this move too close to a wall causes the sword to collide with it and return to Pyra's hand without spinning.",
    titlePt: "Pyra: Blazing End Perto de uma Parede (Especial Lateral)",
    textPt: "Usar esse golpe muito perto de uma parede faz a espada colidir com ela e retornar à mão de Pyra sem girar.",
  },
  {
    titleEn: "[★☆☆] Pyra: Prominence Revolt (Up Special)",
    titleJp: "ホムラ ： プロミネンスリボルト 【上必殺ワザ】",
    textJp: "大きくジャンプした後、下突きしながら急降下する。急降下中はメテオ効果がある。さらに着地の際、突き立てた剣の前方に大きな火柱を生じさせる。",
    titleJpEn: "Pyra: Prominence Revolt (Up Special)",
    textJpEn: "After a big jump, Pyra plunges downward with a downward thrust. It has a meteor effect while diving. Additionally, upon landing, a large pillar of flame erupts in front of the planted sword.",
    titlePt: "Pyra: Prominence Revolt (Especial Superior)",
    textPt: "Depois de um grande salto, Pyra mergulha para baixo com uma estocada descendente. Ela tem efeito meteoro durante o mergulho. Além disso, ao aterrissar, um grande pilar de fogo irrompe à frente da espada cravada.",
  },
  {
    titleEn: "[★☆☆] Pyra: Moving during Prominence Revolt (Up Special)",
    titleJp: "ホムラ ： プロミネンスリボルト中の移動 【上必殺ワザ】",
    textJp: "ジャンプ中、スティックを左右に倒すと、少し前後に移動できる。",
    titleJpEn: "Pyra: Moving during Prominence Revolt (Up Special)",
    textJpEn: "While jumping, tilting the stick left or right allows for a small amount of forward and backward movement.",
    titlePt: "Pyra: Movimento Durante o Prominence Revolt (Especial Superior)",
    textPt: "Durante o salto, inclinar o direcional para a esquerda ou direita permite um pequeno deslocamento para frente e para trás.",
  },
  {
    titleEn: "[★☆☆] Pyra: Burning Sword (Final Smash)",
    titleJp: "ホムラ ： バーニングソード 【最後の切りふだ】",
    textJp: "レックスが相手を３人まで巻き込み、巨大な火柱でふっとばす。ヒカリと比べて与えるダメージは控えめだが、ふっとばし力が高く撃墜を狙いやすい。",
    titleJpEn: "Pyra: Burning Sword (Final Smash)",
    textJpEn: "Rex catches up to 3 opponents, launching them with a giant pillar of flame. Compared to Mythra's version, the damage dealt is modest, but the knockback is high, making it easy to go for a KO.",
    titlePt: "Pyra: Burning Sword (Ataque Final)",
    textPt: "Rex atinge até 3 oponentes, lançando-os com um pilar de fogo gigante. Comparado com a versão de Mythra, o dano causado é moderado, mas o poder de arremesso é alto, facilitando buscar um nocaute.",
  },
  {
    titleEn: "[★☆☆] Pyra: Flare Smash (Side Smash)",
    titleJp: "ホムラ ： フレアスマッシュ 【横スマッシュ攻撃】",
    textJp: "ホムラの横スマッシュ攻撃は、攻撃力とふっとばし力が極めて高い。攻撃に優れたホムラだけが持つ、早くから撃墜を狙える特性。",
    titleJpEn: "Pyra: Flare Smash (Side Smash)",
    textJpEn: "Pyra's side smash attack has extremely high damage and knockback. It's a trait unique to power-focused Pyra, letting her go for KOs early on.",
    titlePt: "Pyra: Flare Smash (Ataque Forte Lateral)",
    textPt: "O ataque forte lateral de Pyra tem dano e poder de arremesso extremamente altos. É uma característica exclusiva da Pyra, focada em poder, que permite buscar nocautes desde cedo.",
  },
  {
    titleEn: "[★☆☆] Mythra: Lightning Buster (Neutral Special)",
    titleJp: "ヒカリ ： ライトニングバスター 【通常必殺ワザ】",
    textJp: "袈裟斬りしてから、前方を広く攻撃する斬撃を３回くり出す。最大ためで４回斬る。長押しで威力と攻撃範囲がアップする。ための保持はできない。",
    titleJpEn: "Mythra: Lightning Buster (Neutral Special)",
    textJpEn: "After a diagonal slash, Mythra unleashes 3 more slashes that attack a wide area in front. At maximum charge, she slashes 4 times. Holding the button increases both power and range, but the charge can't be held indefinitely.",
    titlePt: "Mythra: Lightning Buster (Especial Neutro)",
    textPt: "Depois de um corte diagonal, Mythra desfere mais 3 cortes que atacam uma ampla área à frente. Na carga máxima, ela corta 4 vezes. Segurar o botão aumenta tanto o poder quanto o alcance, mas a carga não pode ser mantida indefinidamente.",
  },
  {
    titleEn: "[★☆☆] Mythra: Invincibility during Lightning Buster (Neutral Special)",
    titleJp: "ヒカリ ： ライトニングバスターの無敵 【通常必殺ワザ】",
    textJp: "ワザの出始め、袈裟斬りの間は無敵になる。相手の攻撃にうまく合わせれば、一方的に反撃できる。",
    titleJpEn: "Mythra: Invincibility during Lightning Buster (Neutral Special)",
    textJpEn: "At the very start of the move, during the diagonal slash, Mythra is invincible. If timed well against an opponent's attack, she can counterattack one-sidedly.",
    titlePt: "Mythra: Invencibilidade Durante o Lightning Buster (Especial Neutro)",
    textPt: "Bem no início do golpe, durante o corte diagonal, Mythra fica invencível. Se cronometrado bem contra o ataque de um oponente, ela pode contra-atacar sem sofrer dano.",
  },
  {
    titleEn: "[★☆☆] Mythra: Turning during Lightning Buster (Neutral Special)",
    titleJp: "ヒカリ ： ライトニングバスター中の振り向き 【通常必殺ワザ】",
    textJp: "剣を振り下ろす前にスティックを背後に倒すと、振り向いて攻撃を放てる。背後に生じるスキが大きいワザなので、放つべき向きを見極めよう。",
    titleJpEn: "Mythra: Turning during Lightning Buster (Neutral Special)",
    textJpEn: "Tilting the stick backward before swinging the sword down lets Mythra turn around and attack that way. Since this move leaves a large opening behind her, choose the right direction to use it in.",
    titlePt: "Mythra: Virando-se Durante o Lightning Buster (Especial Neutro)",
    textPt: "Inclinar o direcional para trás antes de golpear com a espada permite que Mythra se vire e ataque naquela direção. Como esse golpe deixa uma grande brecha atrás dela, escolha bem a direção para usá-lo.",
  },
  {
    titleEn: "[★☆☆] Mythra: Lightning Buster and Enemies behind You (Neutral Special)",
    titleJp: "ヒカリ ： ライトニングバスターと背後 【通常必殺ワザ】",
    textJp: "最初の袈裟斬り時、すぐ後ろに相手がいると、回転斬りに巻き込んで前方にふっとばせる。",
    titleJpEn: "Mythra: Lightning Buster and Enemies Behind You (Neutral Special)",
    textJpEn: "If an opponent is right behind Mythra during the initial diagonal slash, they can be caught in the spinning slash and launched forward.",
    titlePt: "Mythra: Lightning Buster e Inimigos Atrás (Especial Neutro)",
    textPt: "Se um oponente estiver bem atrás de Mythra durante o corte diagonal inicial, ele pode ser pego pelo corte giratório e lançado para frente.",
  },
  {
    titleEn: "[★☆☆] Mythra: Photon Edge (Side Special)",
    titleJp: "ヒカリ ： フォトンエッジ 【横必殺ワザ】",
    textJp: "前方に突進し、素早く跳び回りながら５回斬りつける。非常に広い範囲を攻撃できる。ただし跳び回っている間も相手の攻撃は当たるため、飛び道具には気をつけよう。",
    titleJpEn: "Mythra: Photon Edge (Side Special)",
    textJpEn: "Charges forward, slashing 5 times while quickly leaping around. It can attack a very wide area. However, Mythra can still be hit by opponents' attacks while leaping around, so watch out for projectiles.",
    titlePt: "Mythra: Photon Edge (Especial Lateral)",
    textPt: "Avança, cortando 5 vezes enquanto salta rapidamente ao redor. Pode atacar uma área muito ampla. Porém, Mythra ainda pode ser atingida pelos ataques do oponente enquanto salta, então cuidado com projéteis.",
  },
  {
    titleEn: "[★☆☆] Mythra: Photon Edge and Stage Edges (Side Special)",
    titleJp: "ヒカリ ： フォトンエッジとガケ 【横必殺ワザ】",
    textJp: "長距離を突進するため、ガケ外に大きくふっとばされた時の復帰に有効。逆にガケ際から外へ出すと、ガケを飛び出して自滅してしまうので注意。",
    titleJpEn: "Mythra: Photon Edge and Stage Edges (Side Special)",
    textJpEn: "Since it charges a long distance, it's effective for recovering after being launched far off the stage. Conversely, be careful — using it near the edge and going off the stage will cause Mythra to self-destruct.",
    titlePt: "Mythra: Photon Edge e as Bordas do Cenário (Especial Lateral)",
    textPt: "Como avança uma longa distância, é eficaz para se recuperar depois de ser lançada para longe do cenário. Por outro lado, cuidado — usá-lo perto da borda e sair do cenário fará Mythra se autodestruir.",
  },
  {
    titleEn: "[★☆☆] Mythra: Ray of Punishment (Up Special)",
    titleJp: "ヒカリ ： パニッシュメントレイ 【上必殺ワザ】",
    textJp: "前方を斬り上げながらジャンプした後、斜め下に光の弾を発射する。弾は、相手か地面に当たると炸裂する。",
    titleJpEn: "Mythra: Ray of Punishment (Up Special)",
    textJpEn: "After jumping while slashing upward in front, Mythra fires an orb of light diagonally downward. The orb bursts when it hits an opponent or the ground.",
    titlePt: "Mythra: Ray of Punishment (Especial Superior)",
    textPt: "Depois de saltar cortando para cima à frente, Mythra dispara uma esfera de luz na diagonal para baixo. A esfera explode ao atingir um oponente ou o chão.",
  },
  {
    titleEn: "[★☆☆] Mythra: Chroma Dust (Up Special)",
    titleJp: "ヒカリ ： レインボーダスト 【上必殺ワザ】",
    textJp: "弾を発射するまでにもう一度必殺ワザボタンで、弾を拡散させながら連射する。広範囲を攻撃でき、相手を横方向へふっとばすため、復帰阻止などに使いやすい。",
    titleJpEn: "Mythra: Chroma Dust (Up Special)",
    textJpEn: "Pressing the special-move button again before the orb is fired causes it to spread out and fire rapidly. It can attack a wide area and launches opponents sideways, making it easy to use for edge-guarding and similar situations.",
    titlePt: "Mythra: Chroma Dust (Especial Superior)",
    textPt: "Pressionar o botão de especial novamente antes da esfera ser disparada faz com que ela se espalhe e dispare rapidamente. Pode atacar uma área ampla e lança oponentes para o lado, facilitando o uso para impedir recuperações, entre outras situações.",
  },
  {
    titleEn: "[★☆☆] Mythra: Chroma Dust in the Original Game (Up Special)",
    titleJp: "ヒカリ ： 原作でのレインボーダスト 【上必殺ワザ】",
    textJp: "レインボーダストは、『ゼノブレイド２ 黄金の国イーラ』で登場した。原作では、ピンチの時に強力な威力を発揮する必殺技だった。",
    titleJpEn: "Mythra: Chroma Dust in the Original Game (Up Special)",
    textJpEn: "Chroma Dust first appeared in Xenoblade Chronicles 2: Torna – The Golden Country. In the original game, it was a powerful finishing move that showed its true strength when in a pinch.",
    titlePt: "Mythra: Chroma Dust no Jogo Original (Especial Superior)",
    textPt: "O Chroma Dust apareceu pela primeira vez em Xenoblade Chronicles 2: Torna – The Golden Country. No jogo original, era um poderoso golpe final que mostrava toda sua força quando em apuros.",
  },
  {
    titleEn: "[★☆☆] Mythra: Sacred Arrow (Final Smash)",
    titleJp: "ヒカリ ： セイクリッドアロー 【最後の切りふだ】",
    textJp: "レックスが斬りつけた相手の上空から、幾つもの光の矢を降らせる。ホムラと比べてふっとばし力は弱いが、攻撃範囲が広く連続ヒットで大ダメージを狙える。",
    titleJpEn: "Mythra: Sacred Arrow (Final Smash)",
    textJpEn: "Rex slashes the opponent, then rains down countless arrows of light from above. Compared to Pyra's version, the knockback is weaker, but the attack range is wide, allowing for massive damage through multiple hits.",
    titlePt: "Mythra: Sacred Arrow (Ataque Final)",
    textPt: "Rex corta o oponente, e então faz chover incontáveis flechas de luz do céu. Comparado com a versão de Pyra, o poder de arremesso é mais fraco, mas o alcance do ataque é amplo, permitindo dano massivo por múltiplos acertos.",
  },
  {
    titleEn: "[★☆☆] Mythra: Foresight",
    titleJp: "ヒカリ ： 因果律予測",
    textJp: "回避の直前に相手の攻撃が当たると、受けるダメージを軽減しつつ、短時間スロー効果が発動する。自分は早めに動き出せるため、反撃のチャンス。",
    titleJpEn: "Mythra: Foresight",
    textJpEn: "If an opponent's attack lands right before Mythra dodges, the damage she takes is reduced, and a brief slow effect activates. Since she can act sooner than the opponent, it creates a chance to counterattack.",
    titlePt: "Mythra: Foresight",
    textPt: "Se o ataque de um oponente acertar bem antes de Mythra esquivar, o dano que ela sofre é reduzido, e um breve efeito de lentidão é ativado. Como ela pode agir antes do oponente, isso cria uma chance de contra-ataque.",
  },
  {
    titleEn: "[★★☆] Pyra/Mythra: Neutral Attack",
    titleJp: "ホムラ / ヒカリ ： 弱攻撃",
    textJp: "弱攻撃の３段目は、ホムラとヒカリで特徴が異なる。ホムラはふっとばし力が高い。ヒカリは上方向にふっとばすため、追撃を狙いやすい。",
    titleJpEn: "Pyra/Mythra: Neutral Attack",
    textJpEn: "The third hit of the neutral attack has different characteristics for Pyra and Mythra. Pyra's has high knockback. Mythra's launches upward, making it easier to go for a follow-up.",
    titlePt: "Pyra/Mythra: Ataque Fraco",
    textPt: "O terceiro golpe do ataque fraco tem características diferentes para Pyra e Mythra. O de Pyra tem alto poder de arremesso. O de Mythra lança para cima, facilitando buscar um golpe de acompanhamento.",
  },
  {
    titleEn: "[★☆☆] Pyra/Mythra: Up Smash Attack",
    titleJp: "ホムラ / ヒカリ ： 上スマッシュ攻撃",
    textJp: "正面の相手を巻き込んで打ち上げつつ、頭上を広めにカバーできるが、スキが大きめ。ホムラは一撃でふっとばし、ヒカリは連続攻撃の後ふっとばす。",
    titleJpEn: "Pyra/Mythra: Up Smash Attack",
    textJpEn: "Catches and launches an opponent in front while covering a fairly wide area overhead, but leaves a fairly large opening. Pyra launches with a single hit, while Mythra launches after a series of hits.",
    titlePt: "Pyra/Mythra: Ataque Forte para Cima",
    textPt: "Pega e lança um oponente à frente enquanto cobre uma área razoavelmente ampla acima, mas deixa uma brecha razoavelmente grande. Pyra lança com um único golpe, enquanto Mythra lança depois de uma sequência de golpes.",
  },
  {
    titleEn: "[★☆☆] Pyra/Mythra: Down Smash Attack",
    titleJp: "ホムラ / ヒカリ ： 下スマッシュ攻撃",
    textJp: "剣とキックで前後を同時に攻撃する。剣のほうがキックより攻撃力が高い。前後を広くカバーできるが、頭上からの攻撃には無防備。",
    titleJpEn: "Pyra/Mythra: Down Smash Attack",
    textJpEn: "Attacks in front and behind at the same time with the sword and a kick. The sword deals more damage than the kick. It covers a wide area in front and behind, but leaves them defenseless against attacks from above.",
    titlePt: "Pyra/Mythra: Ataque Forte para Baixo",
    textPt: "Ataca na frente e atrás ao mesmo tempo com a espada e um chute. A espada causa mais dano do que o chute. Cobre uma ampla área na frente e atrás, mas deixa desprotegida contra ataques vindos de cima.",
  },
  {
    titleEn: "[★★☆] Pyra/Mythra: Neutral Air Attack",
    titleJp: "ホムラ / ヒカリ ： 通常空中攻撃",
    textJp: "ホムラは高威力で大きくふっとばし、ヒカリは連続ヒットさせつつ追撃を狙いやすい。どちらの場合も間合いが広いが、着地のスキが大きい。",
    titleJpEn: "Pyra/Mythra: Neutral Air Attack",
    textJpEn: "Pyra's deals high damage and launches far, while Mythra's hits multiple times, making it easy to go for a follow-up. Either way, the range is wide, but the landing lag is large.",
    titlePt: "Pyra/Mythra: Ataque Aéreo Neutro",
    textPt: "O de Pyra causa alto dano e lança para longe, enquanto o de Mythra acerta múltiplas vezes, facilitando buscar um golpe de acompanhamento. De qualquer forma, o alcance é amplo, mas a vulnerabilidade ao aterrissar é grande.",
  },
  {
    titleEn: "[★★☆] Pyra/Mythra: Down Air Attack",
    titleJp: "ホムラ / ヒカリ ： 下空中攻撃",
    textJp: "ホムラのみ、真下を薙ぐ瞬間にメテオ効果がある。ヒカリはメテオ効果がない代わりに、スキが少ない。",
    titleJpEn: "Pyra/Mythra: Down Air Attack",
    textJpEn: "Only Pyra's has a meteor effect at the instant she sweeps straight down. Mythra's lacks the meteor effect, but leaves less of an opening in exchange.",
    titlePt: "Pyra/Mythra: Ataque Aéreo Inferior",
    textPt: "Apenas o de Pyra tem efeito meteoro no instante em que varre diretamente para baixo. O de Mythra não tem efeito meteoro, mas em troca deixa menos brecha.",
  },
];

const CURATOR_EN = "Pyra and Mythra are played as one character with two completely different game plans, swapped freely via the down special at the cost of a brief vulnerability window on either side of the invincible swap frame. Pyra is built around commitment and raw power: Flame Nova is a chargeable spinning hit that can't hold its charge indefinitely, Blazing End throws her sword out to sweep an area and leaves her unable to attack until it spins back into her hand, and Prominence Revolt doubles as a meteor-smash recovery that plants a pillar of flame on landing. Her side smash, Flare Smash, is one of the hardest-hitting smashes in the game, letting her look for kills earlier than most fighters. Mythra trades that power for speed and safety: Lightning Buster opens with a brief window of invincibility that rewards well-timed reads, Photon Edge is a five-hit flurry that covers enormous space but still leaves her vulnerable to projectiles mid-dash, and her up special, Chroma Dust, can be held to spread its shot into a wide edge-guarding tool instead of a single orb. Foresight, unique to Mythra, works like a built-in perfect-shield — dodging an attack at the right instant reduces the damage and slows the opponent down just enough to punish. Their shared moves show the same split even in mirrored animations: Pyra's down smash, up smash, and airs all hit harder and launch farther, while Mythra's equivalents chain into follow-ups or leave less recovery time instead. The character is really a constant risk assessment: stay in Pyra for a heavy-hitting punish, or swap to Mythra when speed and safety matter more — and the swap itself is free enough to do it mid-neutral without much cost.";
const CURATOR_PT = "Pyra e Mythra são jogadas como um único personagem com dois planos de jogo completamente diferentes, trocadas livremente pelo especial inferior ao custo de uma breve janela de vulnerabilidade em ambos os lados do quadro de invencibilidade da troca. Pyra é construída em torno de comprometimento e poder bruto: o Flame Nova é um golpe giratório carregável que não pode manter a carga indefinidamente, o Blazing End arremessa a espada dela para varrer uma área e a deixa incapaz de atacar até a espada girar de volta para a mão dela, e o Prominence Revolt funciona também como uma recuperação com golpe meteoro que crava um pilar de fogo ao aterrissar. O ataque forte lateral dela, Flare Smash, é um dos ataques fortes mais poderosos do jogo, permitindo que ela busque nocautes mais cedo do que a maioria dos lutadores. Mythra troca esse poder por velocidade e segurança: o Lightning Buster abre com uma breve janela de invencibilidade que recompensa leituras bem cronometradas, o Photon Edge é uma rajada de cinco acertos que cobre um espaço enorme, mas ainda a deixa vulnerável a projéteis durante a investida, e o especial superior dela, o Chroma Dust, pode ser segurado para espalhar o disparo numa ferramenta ampla de bloqueio de recuperação em vez de uma única esfera. O Foresight, exclusivo de Mythra, funciona como um escudo perfeito embutido — esquivar de um ataque no instante certo reduz o dano e desacelera o oponente o suficiente para puni-lo. Os golpes compartilhados delas mostram a mesma divisão mesmo em animações espelhadas: o ataque forte para baixo, o ataque forte para cima e os aéreos de Pyra batem mais forte e lançam mais longe, enquanto os equivalentes de Mythra encadeiam em golpes de acompanhamento ou deixam menos tempo de recuperação em troca. A personagem é, na prática, uma avaliação constante de risco: permanecer como Pyra para uma punição pesada, ou trocar para Mythra quando velocidade e segurança importam mais — e a própria troca é barata o suficiente para ser feita no meio do neutro sem muito custo.";
const CURATOR_JP = "ホムラとヒカリは、下必殺ワザでいつでも自由に切り替えられる、まったく異なる２つの戦い方を持つ１人のキャラクターとしてプレイされる——切り替えの無敵フレームの前後には、どちらも短い隙が生じる。ホムラは踏み込みと生の威力を軸に組まれている——「フレイムノヴァ」はチャージ可能な回転攻撃だが、ためを無期限に保持することはできず、「ブレイズエンド」は剣を投げて広範囲を薙ぎ払うが、剣が手元に戻ってくるまで攻撃できなくなり、「プロミネンスリボルト」はメテオ効果のある復帰技を兼ねていて、着地時に火柱を立てる。横スマッシュ攻撃「フレアスマッシュ」は、このゲーム屈指の高威力スマッシュで、他の多くのファイターより早い段階から撃墜を狙える。ヒカリはその威力を速さと安全性に変える——「ライトニングバスター」は出だしに短い無敵時間があり、読みが当たれば大きな見返りがある。「フォトンエッジ」は５回連続で攻撃する跳び回りワザで、非常に広い空間をカバーするが、突進中も飛び道具には無防備なまま。上必殺ワザ「レインボーダスト」は、ボタンを押し続けることで、単発の弾を拡散させ、広い復帰阻止ツールに変えられる。ヒカリだけが持つ「因果律予測」は、内蔵型の完璧回避のように機能する——正しいタイミングで攻撃を回避すれば、受けるダメージが減り、相手を少しだけ遅くして反撃のチャンスを作る。共有する技でも、同じ役割分担が鏡写しのモーションに表れている——ホムラの下スマッシュ、上スマッシュ、空中攻撃はどれもより強く、より遠くへふっとばし、ヒカリの同じ技は追撃に繋がるか、復帰までの時間を短くする。このキャラクターは、実質的に絶え間ないリスク評価だ——重い一撃を狙うならホムラのまま、速さと安全性が重要な場面ならヒカリに切り替える——そして切り替え自体のコストは十分に軽く、間合いの取り合いの最中でも気軽に行える。";
const CURATOR_JPEN = "Pyra and Mythra are played as a single character with two completely different playstyles, freely swapped at any time via the down special — a short opening appears on both sides of the invincible swap frame. Pyra is built around commitment and raw power — \"Flame Nova\" is a chargeable spinning attack, though the charge can't be held indefinitely; \"Blazing End\" throws the sword out to sweep a wide area, but she can't attack again until the sword returns to her hand; \"Prominence Revolt\" doubles as a recovery move with a meteor effect, planting a pillar of flame upon landing. Her side smash, \"Flare Smash,\" is one of the highest-damage smash attacks in the game, letting her look for KOs earlier than most other fighters. Mythra converts that power into speed and safety — \"Lightning Buster\" has a brief window of invincibility at the start, paying off big if the read is correct. \"Photon Edge\" is a five-hit leaping flurry that covers a very wide space, but leaves her defenseless against projectiles even while dashing around. Her up special, \"Chroma Dust,\" can have its button held down to spread a single orb into a wide edge-guarding tool instead. \"Foresight,\" unique to Mythra, functions like a built-in perfect dodge — dodging an attack at the right timing reduces the damage taken and slows the opponent down just enough to create a chance to counterattack. Even their shared moves show the same division of roles in mirrored animations — Pyra's down smash, up smash, and aerials all hit harder and launch farther, while Mythra's equivalents either chain into follow-ups or shorten the recovery time instead. This character is essentially a constant risk assessment — stay as Pyra to go for a heavy-hitting punish, or swap to Mythra when speed and safety matter more — and the swap itself costs little enough to be done casually even in the middle of a neutral exchange.";

async function processFighter(namePart: string, label: string) {
  const fighter = await db.fighter.findFirst({
    where: { name: { contains: namePart, mode: "insensitive" } },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!fighter) { console.log(`${label} not found`); return; }

  await db.fighter.update({
    where: { id: fighter.id },
    data: {
      curatorOverviewEn: CURATOR_EN,
      curatorOverviewPt: CURATOR_PT,
      curatorOverviewJp: CURATOR_JP,
      curatorOverviewJpEn: CURATOR_JPEN,
    },
  });
  console.log(`✅ ${label}: Curator Overview (4 langs)`);

  let updated = 0;
  for (const data of TIPS) {
    const tip = fighter.tips.find(t => t.titleEn === data.titleEn);
    if (!tip) { console.log(`  ⚠️  ${label}: Tip não encontrada: "${data.titleEn}"`); continue; }
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
  console.log(`✅ ${label}: ${updated}/${TIPS.length} tips atualizadas`);

  await db.fighter.update({ where: { id: fighter.id }, data: { curationStatus: "approved" } });
  console.log(`✅ ${label} aprovada`);
}

async function main() {
  await processFighter("Pyra", "Pyra");
  await processFighter("Mythra", "Mythra");

  // Sem FighterMove (0 registros) em nenhuma das duas — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista Xenoblade Chronicles 2 corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente em ambas — aprovado direto, padrão já estabelecido.
  // Pyra e Mythra são 2 Fighter records completos e distintos, NÃO um par Echo — corrigido rosterNumber
  // (Mythra "79e"->"80", Kazuya "80"->"81", Sora "81"->"82") via fix-pyra-mythra-numbering.ts antes deste script.
  // As 31 tips oficiais descrevem a dupla em conjunto (perspectiva compartilhada "Pyra/Mythra:"), por isso
  // o mesmo conteúdo (JP/PT/JpEn/curator) é aplicado igualmente às duas Fighter records.

  await db.$disconnect();
}
main().catch(console.error);
