import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Sora's Origins",
    titleJp: "ソラの初登場作品",
    textJp: "ソラの初登場作品は、２００２年発売の『キングダム ハーツ』。故郷を闇に飲まれ、離れ離れになった幼なじみのリクとカイリを探すべく、冒険の旅に出た。",
    titleJpEn: "Sora's Debut Work",
    textJpEn: "Sora's first appearance was in Kingdom Hearts, released in 2002. After his home was swallowed by darkness, he set out on a journey to find his childhood friends Riku and Kairi, who had been separated from him.",
    titlePt: "As Origens de Sora",
    textPt: "A primeira aparição de Sora foi em Kingdom Hearts, lançado em 2002. Depois que seu lar foi engolido pela escuridão, ele partiu numa jornada para encontrar seus amigos de infância Riku e Kairi, dos quais havia sido separado.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "デスティニーアイランド出身の、明るく元気な少年。キーブレードに選ばれた者として、幾つもの世界を巡り、「心」にまつわる冒険を繰り広げる。",
    titleJpEn: "In the Original Game",
    textJpEn: "A cheerful, energetic boy from Destiny Islands. As one chosen by the Keyblade, he travels through numerous worlds on an adventure revolving around \"hearts.\"",
    titlePt: "No Jogo Original",
    textPt: "Um garoto alegre e cheio de energia, de Destiny Islands. Como alguém escolhido pela Keyblade, ele viaja por vários mundos numa aventura girando em torno dos \"corações\".",
  },
  {
    titleEn: "[★☆☆] Move Features",
    titleJp: "ワザの特徴",
    textJp: "キーブレードの振り抜きはゆるやか。攻撃が当たる時間が長めなので、出してしまえば打ち勝ちやすい。ただし、ワザ前後のスキはやや大きめ。",
    titleJpEn: "Move Features",
    textJpEn: "Sora's Keyblade swings are unhurried. Since the attack stays active for a fairly long time, it's easy to beat out opponents once it's out. However, the opening before and after the move is somewhat large.",
    titlePt: "Características dos Golpes",
    textPt: "Os golpes da Keyblade de Sora são desapressados. Como o ataque permanece ativo por um tempo relativamente longo, é fácil vencer oponentes assim que ele sai. Porém, a brecha antes e depois do golpe é um pouco grande.",
  },
  {
    titleEn: "[★☆☆] Magic (Neutral Special)",
    titleJp: "まほう 【通常必殺ワザ】",
    textJp: "ファイガ、サンダガ、ブリザガの３種が、まほうを撃つたびに入れ替わる。ファイガは連射が効き、サンダガは威力が高く、ブリザガは相手を凍らせることができる。",
    titleJpEn: "Magic (Neutral Special)",
    textJpEn: "The three spells Firaga, Thundaga, and Blizzaga cycle each time magic is cast. Firaga can be fired rapidly, Thundaga deals high damage, and Blizzaga can freeze opponents.",
    titlePt: "Magia (Especial Neutro)",
    textPt: "As três magias Firaga, Thundaga e Blizzaga se alternam a cada vez que a magia é lançada. Firaga pode ser disparada rapidamente, Thundaga causa alto dano, e Blizzaga pode congelar oponentes.",
  },
  {
    titleEn: "[★☆☆] Firaga (Neutral Special)",
    titleJp: "ファイガ 【通常必殺ワザ】",
    textJp: "ボタン連打で連射でき、遠くにいる相手へのけん制に使いやすい。まほうの中では射程が長く、当てやすいワザ。",
    titleJpEn: "Firaga (Neutral Special)",
    textJpEn: "Mashing the button allows rapid fire, making it easy to use to keep distant opponents in check. Among the spells, it has long range and is easy to land.",
    titlePt: "Firaga (Especial Neutro)",
    textPt: "Apertar o botão repetidamente permite disparo rápido, facilitando pressionar oponentes distantes. Entre as magias, tem longo alcance e é fácil de acertar.",
  },
  {
    titleEn: "[★☆☆] Thundaga (Neutral Special)",
    titleJp: "サンダガ 【通常必殺ワザ】",
    textJp: "前方の広範囲に稲妻を落とし、当たった相手を上方向にふっとばす。ワザ前後のスキが大きく当てづらいが、うまく３段目まで当てれば大ダメージも狙える。",
    titleJpEn: "Thundaga (Neutral Special)",
    textJpEn: "Drops lightning bolts across a wide area in front, launching hit opponents upward. It leaves a large opening before and after, making it hard to land, but landing all 3 hits can deal massive damage.",
    titlePt: "Thundaga (Especial Neutro)",
    textPt: "Derruba raios numa ampla área à frente, lançando oponentes atingidos para cima. Deixa uma grande brecha antes e depois, dificultando acertá-la, mas acertar os 3 golpes pode causar dano massivo.",
  },
  {
    titleEn: "[★☆☆] Thundaga in the Air (Neutral Special)",
    titleJp: "空中でのサンダガ 【通常必殺ワザ】",
    textJp: "空中で出すと、地上よりも近くに、より短い間隔で稲妻が落ちる。ワザの間合いが変わるので気をつけよう。",
    titleJpEn: "Thundaga in the Air (Neutral Special)",
    textJpEn: "Using this in midair drops the lightning bolts closer together and at shorter intervals than on the ground. Be careful, since the move's range changes.",
    titlePt: "Thundaga no Ar (Especial Neutro)",
    textPt: "Usar essa magia no ar derruba os raios mais próximos entre si e em intervalos mais curtos do que no chão. Cuidado, pois o alcance do golpe muda.",
  },
  {
    titleEn: "[★☆☆] Blizzaga (Neutral Special)",
    titleJp: "ブリザガ 【通常必殺ワザ】",
    textJp: "氷の弾は拡散しながら飛び、当たると相手を凍らせる。相手の蓄積ダメージが高いほど、長く凍る。相手の近くでワザを出し、全弾命中させることでも、凍る時間が長くなる。",
    titleJpEn: "Blizzaga (Neutral Special)",
    textJpEn: "The ice shots spread out as they fly, freezing an opponent on contact. The higher the opponent's accumulated damage, the longer they stay frozen. Using the move close to an opponent so all the shots connect also extends the freeze duration.",
    titlePt: "Blizzaga (Especial Neutro)",
    textPt: "Os projéteis de gelo se espalham enquanto voam, congelando um oponente ao contato. Quanto maior o dano acumulado do oponente, mais tempo ele fica congelado. Usar a magia perto de um oponente para que todos os projéteis acertem também estende a duração do congelamento.",
  },
  {
    titleEn: "[★☆☆] Sonic Blade Additional Inputs (Side Special)",
    titleJp: "ソニックレイヴの追加入力 【横必殺ワザ】",
    textJp: "突進中にスティックを倒すと、その方向へさらに突進できる。２回まで追加で突進可能。",
    titleJpEn: "Sonic Blade Additional Inputs (Side Special)",
    textJpEn: "Tilting the stick while charging lets Sora charge further in that direction. He can charge up to 2 additional times.",
    titlePt: "Inputs Adicionais do Sonic Blade (Especial Lateral)",
    textPt: "Inclinar o direcional durante o avanço permite que Sora avance mais naquela direção. Ele pode avançar até 2 vezes adicionais.",
  },
  {
    titleEn: "[★☆☆] Charge Opponents With Sonic Blade (Side Special)",
    titleJp: "ソニックレイヴで相手へ突進 【横必殺ワザ】",
    textJp: "突進中、近くに相手がいる時に必殺ワザボタンを押すと、最も近い相手へと自動的に突進する。スティック追加入力で突進した時より、少し威力が高い。",
    titleJpEn: "Charging at Opponents With Sonic Blade (Side Special)",
    textJpEn: "While charging, if an opponent is nearby and the special-move button is pressed, Sora automatically charges toward the closest opponent. This deals slightly more damage than charging via an additional stick input.",
    titlePt: "Avançando contra Oponentes com o Sonic Blade (Especial Lateral)",
    textPt: "Durante o avanço, se um oponente estiver por perto e o botão de especial for pressionado, Sora avança automaticamente em direção ao oponente mais próximo. Isso causa um pouco mais de dano do que avançar via um input adicional no direcional.",
  },
  {
    titleEn: "[★★☆] Sonic Blade Charge Speed (Side Special)",
    titleJp: "ソニックレイヴの突進速度 【横必殺ワザ】",
    textJp: "突進するたびに、速度が少しずつ落ちる。相手に当たったり、シールドされたりした場合にも速度が落ちるため、やみくもに突進してスキをさらさないよう注意。",
    titleJpEn: "Sonic Blade Charge Speed (Side Special)",
    textJpEn: "The speed decreases a little each time Sora charges. It also decreases if he hits an opponent or is blocked by a shield, so be careful not to recklessly charge and expose an opening.",
    titlePt: "Velocidade de Avanço do Sonic Blade (Especial Lateral)",
    textPt: "A velocidade diminui um pouco a cada vez que Sora avança. Ela também diminui se ele atingir um oponente ou for bloqueado por um escudo, então cuidado para não avançar de forma imprudente e expor uma brecha.",
  },
  {
    titleEn: "[★☆☆] Sonic Blade and Edges (Side Special)",
    titleJp: "ソニックレイヴとガケ 【横必殺ワザ】",
    textJp: "ガケの外で、必殺ワザボタンで最後の突進をすると、復帰方向へ向かう。",
    titleJpEn: "Sonic Blade and Edges (Side Special)",
    textJpEn: "Off the edge of the stage, pressing the special-move button for the final charge sends Sora toward the direction of recovery.",
    titlePt: "Sonic Blade e Bordas (Especial Lateral)",
    textPt: "Fora da borda do cenário, pressionar o botão de especial para o avanço final envia Sora na direção da recuperação.",
  },
  {
    titleEn: "[★☆☆] Shifting During Aerial Sweep (Up Special)",
    titleJp: "エリアルスイープ中の入力 【上必殺ワザ】",
    textJp: "上昇中にスティック左右入力で、わずかに左右に移動できる。また、ワザの終わり際にソニックレイヴを出せる。復帰や逃げにも使いやすい。",
    titleJpEn: "Shifting During Aerial Sweep (Up Special)",
    textJpEn: "Inputting left or right on the stick while ascending allows for a slight amount of horizontal movement. Additionally, Sonic Blade can be used right at the end of the move, making it easy to use for recovery or to escape.",
    titlePt: "Deslocamento Durante o Aerial Sweep (Especial Superior)",
    textPt: "Inserir para a esquerda ou direita no direcional durante a subida permite um leve deslocamento horizontal. Além disso, o Sonic Blade pode ser usado bem no final do golpe, facilitando seu uso para recuperação ou fuga.",
  },
  {
    titleEn: "[★☆☆] Counterattack (Down Special)",
    titleJp: "カウンター 【下必殺ワザ】",
    textJp: "相手の直接攻撃をはじき、相手の姿勢を崩しながら反撃できる。また、飛び道具を受け流すこともできる。受けた攻撃が強いほど、反撃の威力がアップする。",
    titleJpEn: "Counterattack (Down Special)",
    textJpEn: "Deflects an opponent's direct attack, countering while breaking their stance. It can also parry projectiles. The stronger the attack received, the higher the counterattack's power.",
    titlePt: "Counterattack (Especial Inferior)",
    textPt: "Desvia o ataque direto de um oponente, contra-atacando enquanto quebra a postura dele. Também pode aparar projéteis. Quanto mais forte o ataque recebido, maior o poder do contra-ataque.",
  },
  {
    titleEn: "[★☆☆] Countering Behind You (Down Special)",
    titleJp: "背後へのカウンター 【下必殺ワザ】",
    textJp: "背後からの攻撃にも反撃できる。ただし、相手の攻撃を受けられる範囲が狭いため、正面から受けるよりも難しい。",
    titleJpEn: "Countering Behind You (Down Special)",
    textJpEn: "Sora can also counter attacks coming from behind. However, since the range for receiving the opponent's attack is narrower, it's harder than countering from the front.",
    titlePt: "Contra-atacando por Trás (Especial Inferior)",
    textPt: "Sora também pode contra-atacar ataques vindos de trás. Porém, como a área para receber o ataque do oponente é mais estreita, é mais difícil do que contra-atacar de frente.",
  },
  {
    titleEn: "[★☆☆] Sealing the Keyhole (Final Smash)",
    titleJp: "鍵穴の封印 【最後の切りふだ】",
    textJp: "正面に鍵穴を開き、近くの相手を３人まで巻き込める。ワザの終わり際、相手の蓄積ダメージが１００％を超えていると、即撃墜となる。",
    titleJpEn: "Sealing the Keyhole (Final Smash)",
    textJpEn: "Opens a keyhole in front, catching up to 3 nearby opponents. Right at the end of the move, any opponent with over 100% accumulated damage is instantly KO'd.",
    titlePt: "Sealing the Keyhole (Ataque Final)",
    textPt: "Abre uma fechadura à frente, atingindo até 3 oponentes próximos. Bem no final do golpe, qualquer oponente com mais de 100% de dano acumulado é nocauteado instantaneamente.",
  },
  {
    titleEn: "[★☆☆] Caught in Sealing the Keyhole (Final Smash)",
    titleJp: "鍵穴の封印への巻き込み 【最後の切りふだ】",
    textJp: "最初に放つビームは、当たった相手を鍵穴の方向へふっとばし、攻撃に巻き込む。ふっとばす人数に制限はないが、その後の攻撃に巻き込めるのは３人まで。",
    titleJpEn: "Caught in Sealing the Keyhole (Final Smash)",
    textJpEn: "The initial beam launches any opponent it hits toward the keyhole, catching them in the attack. There's no limit to how many opponents can be launched, but only up to 3 can be caught in the follow-up attack.",
    titlePt: "Sendo Pego pelo Sealing the Keyhole (Ataque Final)",
    textPt: "O feixe inicial lança qualquer oponente atingido em direção à fechadura, prendendo-o no ataque. Não há limite de quantos oponentes podem ser lançados, mas apenas até 3 podem ser pegos no ataque seguinte.",
  },
  {
    titleEn: "[★☆☆] Combo Attacks",
    titleJp: "コンビネーション",
    textJp: "一部の攻撃は、ボタンを連打か長押しすると、３回までコンボを繋げられる。弱攻撃、横強攻撃、通常・前空中攻撃でコンボ可能。",
    titleJpEn: "Combo Attacks",
    textJpEn: "Some attacks can chain up to 3 hits in a combo by mashing or holding down the button. Combos are possible with the neutral attack, side tilt attack, and neutral/forward air attacks.",
    titlePt: "Ataques em Combo",
    textPt: "Alguns ataques podem encadear até 3 acertos num combo ao apertar repetidamente ou segurar o botão. Combos são possíveis com o ataque fraco, o ataque forte lateral, e os ataques aéreos neutro/para frente.",
  },
  {
    titleEn: "[★☆☆] Side Tilt Attack's Combo",
    titleJp: "横強攻撃のコンビネーション",
    textJp: "横強攻撃は、単発で出せばふっとばし力が高まる。コンボで出せばダメージが上がる。状況に応じて使い分けよう。",
    titleJpEn: "Side Tilt Attack's Combo",
    textJpEn: "Using the side tilt attack as a single hit increases its knockback. Using it as a combo increases the damage instead. Choose depending on the situation.",
    titlePt: "Combo do Ataque Forte Lateral",
    textPt: "Usar o ataque forte lateral como um golpe único aumenta o poder de arremesso. Usá-lo como combo aumenta o dano em vez disso. Escolha de acordo com a situação.",
  },
  {
    titleEn: "[★☆☆] Neutral Attack Combo and Tilt Attack Combo",
    titleJp: "弱攻撃コンボと強攻撃コンボの違い",
    textJp: "弱攻撃からのコンボは、威力が低いが素早く出せる。横強攻撃からのコンボは、威力が高いが時間がかかる。",
    titleJpEn: "Neutral Attack Combo and Tilt Attack Combo",
    textJpEn: "Combos starting from the neutral attack deal low damage but come out quickly. Combos starting from the side tilt attack deal high damage but take longer.",
    titlePt: "Combo do Ataque Fraco e Combo do Ataque Forte",
    textPt: "Combos iniciados pelo ataque fraco causam pouco dano, mas saem rapidamente. Combos iniciados pelo ataque forte lateral causam alto dano, mas demoram mais.",
  },
  {
    titleEn: "[★★★] Combos after a Down Tilt Attack",
    titleJp: "下強攻撃からのコンビネーション",
    textJp: "ヒットすると、相手を軽く打ち上げ、コンビネーションや上必殺ワザでの追撃を狙いやすい。上強攻撃へ繋いだ後、さらに空中でのコンビネーションなどを狙うことも可能。",
    titleJpEn: "Combos after a Down Tilt Attack",
    textJpEn: "If it hits, it lightly launches the opponent upward, making it easy to follow up with a combo or the up special. After chaining into the up tilt attack, it's also possible to go for a combo in the air afterward.",
    titlePt: "Combos Depois de um Ataque Forte para Baixo",
    textPt: "Se acertar, lança o oponente levemente para cima, facilitando emendar um combo ou o especial superior. Depois de encadear no ataque forte para cima, também é possível buscar um combo no ar em seguida.",
  },
  {
    titleEn: "[★★☆] Combos in the Air",
    titleJp: "空中でのコンビネーション",
    textJp: "通常空中攻撃からのコンボは、左右入力しないほうが繋げやすい。前空中攻撃からのコンボは、相手の方向にスティックを倒し続けるほうが繋げやすい。",
    titleJpEn: "Combos in the Air",
    textJpEn: "Combos starting from the neutral air attack are easier to chain without inputting left or right. Combos starting from the forward air attack are easier to chain by continuing to hold the stick toward the opponent.",
    titlePt: "Combos no Ar",
    textPt: "Combos iniciados pelo ataque aéreo neutro são mais fáceis de encadear sem inserir para a esquerda ou direita. Combos iniciados pelo ataque aéreo para frente são mais fáceis de encadear continuando a segurar o direcional na direção do oponente.",
  },
  {
    titleEn: "[★★☆] Using Combos in the Air",
    titleJp: "空中でのコンビネーションの使い分け",
    textJp: "通常空中攻撃からのコンボは、初段を当てやすい。前空中攻撃からのコンボは、相手を左右に追い込みやすい。",
    titleJpEn: "Using Combos in the Air",
    textJpEn: "Combos starting from the neutral air attack are easy to land the first hit with. Combos starting from the forward air attack are easy to use to corner an opponent to the side.",
    titlePt: "Usando Combos no Ar",
    textPt: "Combos iniciados pelo ataque aéreo neutro são fáceis de acertar no primeiro golpe. Combos iniciados pelo ataque aéreo para frente são fáceis de usar para encurralar um oponente para o lado.",
  },
  {
    titleEn: "[★☆☆] Dash Attack",
    titleJp: "ダッシュ攻撃",
    textJp: "移動距離が長く、相手に攻撃を当てられる時間も長く続く。遠くから攻撃してくる相手との距離を縮め、反撃したい時に使いやすい。",
    titleJpEn: "Dash Attack",
    textJpEn: "It travels a long distance, and the window for landing the attack on an opponent also lasts a long time. It's easy to use when wanting to close the distance on an opponent attacking from afar and counterattack.",
    titlePt: "Ataque de Corrida",
    textPt: "Ele percorre uma longa distância, e a janela para acertar o ataque num oponente também dura bastante tempo. É fácil de usar quando se quer fechar a distância contra um oponente atacando de longe e contra-atacar.",
  },
  {
    titleEn: "[★☆☆] Up Smash Attack",
    titleJp: "上スマッシュ攻撃",
    textJp: "相手を真上に大きくふっとばすため、上方向への撃墜に使いやすい。ワザの出始めで正面の相手を巻き込み、打ち上げることができる。",
    titleJpEn: "Up Smash Attack",
    textJpEn: "Since it launches opponents far straight upward, it's easy to use for upward KOs. At the very start of the move, it can catch an opponent in front and launch them upward.",
    titlePt: "Ataque Forte para Cima",
    textPt: "Como lança oponentes para longe diretamente para cima, é fácil de usar para nocautes na vertical. Bem no início do golpe, ele pode pegar um oponente à frente e lançá-lo para cima.",
  },
  {
    titleEn: "[★☆☆] Down Smash Attack",
    titleJp: "下スマッシュ攻撃",
    textJp: "ワザの出始め、わずかな間無敵になる。相手のガケのぼり攻撃などへのカウンターに使いやすい。また、相手にシールドされた際、シールドを削りやすい。",
    titleJpEn: "Down Smash Attack",
    textJpEn: "At the very start of the move, Sora is briefly invincible. It's easy to use as a counter against an opponent's ledge-climbing attack, among other situations. It's also effective at wearing down an opponent's shield if it's blocked.",
    titlePt: "Ataque Forte para Baixo",
    textPt: "Bem no início do golpe, Sora fica brevemente invencível. É fácil de usar como contra-ataque contra o ataque de subida de borda do oponente, entre outras situações. Também é eficaz para desgastar o escudo do oponente se for bloqueado.",
  },
  {
    titleEn: "[★☆☆] Down Air Attack",
    titleJp: "下空中攻撃",
    textJp: "急降下しつつ全方位を攻撃できる。ガケ外で急降下しても、上必殺ワザ、横必殺ワザと繋げば助かることもある。",
    titleJpEn: "Down Air Attack",
    textJpEn: "Attacks in all directions while diving downward. Even if Sora dives off the edge of the stage, he can sometimes save himself by following up with the up special or side special.",
    titlePt: "Ataque Aéreo Inferior",
    textPt: "Ataca em todas as direções enquanto mergulha para baixo. Mesmo se Sora mergulhar para fora da borda do cenário, às vezes ele pode se salvar emendando o especial superior ou o especial lateral.",
  },
  {
    titleEn: "[★☆☆] Final Blow in Stamina Battles",
    titleJp: "体力制のとどめ",
    textJp: "体力制の時、相手の体力を０にして決着をつけると、原作にちなんだ特別な演出が発生する。",
    titleJpEn: "Final Blow in Stamina Battles",
    textJpEn: "In Stamina battles, finishing an opponent off by reducing their stamina to 0 triggers a special cutscene inspired by the original games.",
    titlePt: "Golpe Final em Batalhas de Resistência",
    textPt: "Em batalhas de Resistência, finalizar um oponente reduzindo a resistência dele a 0 ativa uma cena especial inspirada nos jogos originais.",
  },
];

async function main() {
  const sora = await db.fighter.findFirst({
    where: { name: { contains: "Sora", mode: "insensitive" } },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!sora) { console.log("Sora not found"); return; }

  await db.fighter.update({
    where: { id: sora.id },
    data: {
      curatorOverviewEn: "As the very last fighter added to Ultimate's roster, Sora closes things out with a moveset built around choice under pressure. His neutral special rotates through three spells every cast — Firaga for rapid-fire chip damage at range, Thundaga for a slow but devastating multi-hit that can be dodged if you don't commit, and Blizzaga for a freeze that lasts longer the more damage the target has already taken — so landing the spell you actually want means timing your casts around the rotation. Sonic Blade turns his side special into a three-part dash chain: each additional input can be redirected, or aimed automatically at the nearest opponent for slightly more damage, but every dash — whether it connects, gets shielded, or whiffs — bleeds off speed, so stringing all three together recklessly just leaves him exposed. His up special, Aerial Sweep, tacks on a late-window Sonic Blade for extra recovery distance, and Counterattack doubles as both a conventional counter and a projectile parry, scaling its payback with how hard the initial hit would have landed. Nearly every one of his normals branches into a combo if the button is held or mashed, with single hits trading damage for knockback and vice versa — the neutral attack combos in fast for cheap damage, while the side tilt combos slower for much more. His Final Smash, Sealing the Keyhole, catches up to three opponents in a follow-up blast that becomes an unconditional KO on anyone already past 100%. It's a kit that rewards reading the spell rotation, spacing the dash chain, and choosing the right combo route over just mashing buttons — a fitting final lesson for the roster's last addition.",
      curatorOverviewPt: "Como o último lutador adicionado ao elenco do Ultimate, Sora encerra tudo com um moveset construído em torno de escolhas sob pressão. O especial neutro dele alterna entre três magias a cada lançamento — Firaga para dano rápido de disparo repetido à distância, Thundaga para um golpe múltiplo lento mas devastador que pode ser esquivado se você não se comprometer, e Blizzaga para um congelamento que dura mais quanto mais dano o alvo já tiver sofrido — então acertar a magia que você realmente quer significa cronometrar seus lançamentos em torno do rodízio. O Sonic Blade transforma o especial lateral dele numa corrente de avanço em três partes: cada input adicional pode ser redirecionado, ou mirado automaticamente no oponente mais próximo por um pouco mais de dano, mas cada avanço — seja acertando, sendo bloqueado, ou errando — perde velocidade, então encadear os três de forma imprudente só o deixa exposto. O especial superior dele, o Aerial Sweep, adiciona um Sonic Blade numa janela tardia para distância extra de recuperação, e o Counterattack funciona tanto como um contra-ataque convencional quanto como uma aparada de projétil, escalando sua recompensa de acordo com a força do golpe inicial que teria acertado. Quase todos os golpes normais dele se ramificam num combo se o botão for segurado ou apertado repetidamente, com golpes únicos trocando dano por poder de arremesso e vice-versa — o ataque fraco encadeia rápido por pouco dano, enquanto o ataque forte lateral encadeia mais devagar por muito mais. O Ataque Final dele, o Sealing the Keyhole, pega até três oponentes numa explosão seguinte que se torna um nocaute incondicional em qualquer um já acima de 100%. É um kit que recompensa ler o rodízio de magias, gerenciar o espaçamento da corrente de avanço, e escolher a rota de combo certa em vez de simplesmente apertar botões — uma lição final adequada para a última adição do elenco.",
      curatorOverviewJp: "『Ultimate』のロスターに最後に追加されたファイターとして、ソラはプレッシャーの中での選択を軸にした技構成でシリーズを締めくくる。通常必殺ワザは唱えるたびに３種類の魔法を巡る——遠距離での連射チップダメージ向きの「ファイガ」、踏み込まなければ避けられる、遅いが強烈な複数ヒットの「サンダガ」、相手がすでに受けているダメージが多いほど長く続く「ブリザガ」の凍結——だから本当に欲しい魔法を当てるには、巡ってくるタイミングに合わせて唱える必要がある。「ソニックレイヴ」は横必殺ワザを３段階の突進の連鎖に変える——追加入力ごとに方向を変えられ、あるいは最も近い相手へ自動で狙いを定めて少し高い威力を出せるが、当たっても、シールドされても、外れても、突進のたびに速度は落ちていく。だから無闇に３回続けて突進すると、隙をさらすだけになる。上必殺ワザ「エリアルスイープ」は、終わり際にソニックレイヴを追加でき、復帰の距離を伸ばせる。「カウンター」は通常のカウンターと飛び道具の受け流しを兼ねており、当たるはずだった最初の一撃が強いほど、返しの威力も上がる。通常ワザのほとんどは、ボタンを押し続けるか連打すればコンボに分岐し、単発ならふっとばし、コンボならダメージという形で使い分けられる——弱攻撃からのコンボは安いダメージで素早く、横強攻撃からのコンボは遅いがずっと大きい。最後の切りふだ「鍵穴の封印」は最大３人の相手を後続の爆発に巻き込み、すでに１００％を超えている相手には条件なしの即撃墜となる。魔法の巡りを読み、突進の連鎖の間合いを管理し、ボタン連打だけに頼らず正しいコンボのルートを選ぶことを報いる技構成——ロスター最後の追加を飾るにふさわしい、締めくくりの教訓だ。",
      curatorOverviewJpEn: "As the very last fighter added to Ultimate's roster, Sora closes out the series with a moveset built around making choices under pressure. His neutral special cycles through three spells each time it's cast — \"Firaga,\" suited for rapid-fire chip damage at range; \"Thundaga,\" a slow but powerful multi-hit that can be dodged if you don't commit; and \"Blizzaga,\" a freeze that lasts longer the more damage the target has already taken. Because of this, landing the spell you actually want means timing your cast to match the rotation. \"Sonic Blade\" turns the side special into a three-stage dash chain — each additional input can change direction, or automatically aim at the nearest opponent for slightly higher damage — but the dash loses speed every time, whether it connects, gets shielded, or misses. That means recklessly chaining all three dashes together just leaves an opening. The up special, \"Aerial Sweep,\" lets Sora add a Sonic Blade at the very end, extending his recovery distance. \"Counterattack\" doubles as both a normal counter and a projectile parry, with the strength of the payback scaling with how strong the original hit would have been. Most of Sora's standard moves branch into a combo if the button is held down or mashed, letting him choose between a single hit for knockback or a combo for damage — the neutral attack combos in quickly for cheap damage, while the side tilt attack combos more slowly for much more. His Final Smash, \"Sealing the Keyhole,\" catches up to 3 opponents in a follow-up blast that becomes an unconditional KO against anyone already past 100% damage. A moveset that rewards reading the spell rotation, managing the spacing of the dash chain, and choosing the right combo route instead of relying on simply mashing buttons — a fitting final lesson to close out the roster's last addition.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = sora.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: sora.id }, data: { curationStatus: "approved" } });
  console.log("✅ Sora aprovado — ROSTER COMPLETO!");

  // Sem FighterMove (0 registros) — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista os 7 jogos Kingdom Hearts corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.

  await db.$disconnect();
}
main().catch(console.error);
