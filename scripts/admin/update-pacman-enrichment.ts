import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "The round, yellow character controlled in \"PAC-MAN.\" The game itself has been certified by Guinness World Records as the \"most successful arcade machine in the world.\" In \"Super Smash Bros.,\" he's characterized by a number of moves based on the original game. \"Power Pellet\" lets him change direction while the button is held down when activated, and its power is extremely strong when charged to maximum.",
    pt: "O personagem redondo e amarelo de PAC-MAN, reconhecido pelo Guinness World Records como o \"jogo de arcade de maior sucesso comercial\". Em Smash Bros., ele usa vários golpes inspirados no PAC-MAN original. Dê um wakawaka nos adversários carregando o golpe Power Pellet e mirando neles.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] PAC-MAN's Origins", titleJp: "パックマンの初登場作品", textJp: "パックマンの初登場は１９８０年に登場した同名作品。世界でもっとも成功したアーケードゲームとして、ギネス記録に認定されている。", titleJpEn: "PAC-MAN's Debut Work", textJpEn: "PAC-MAN made his debut in the 1980 game of the same name. It's been certified by Guinness World Records as the most successful arcade game in the world.", titlePt: "As Origens do PAC-MAN", textPt: "O PAC-MAN fez sua estreia no jogo homônimo de 1980. Ele foi certificado pelo Guinness World Records como o jogo de arcade de maior sucesso do mundo." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "１９８０年に発売されたアーケードゲーム『パックマン』の、プレイヤーキャラクター。モンスターをかわしながら、迷路の中に置かれたエサを食べる「ドットイート」ゲーム。", titleJpEn: "In the Original Game", textJpEn: "The player character of the 1980 arcade game \"PAC-MAN.\" It's a \"dot-eating\" game where the player dodges monsters while eating pellets placed throughout a maze.", titlePt: "Na Série Original", textPt: "O personagem jogável do jogo de arcade \"PAC-MAN\", lançado em 1980. É um jogo de \"comer pontos\" no qual o jogador desvia de monstros enquanto come pastilhas espalhadas por um labirinto." },
  { titleEn: "[★☆☆] Cutscene Easter Egg", titleJp: "コミカルなアニメーション", textJp: "『パックマン』では、一定数のラウンドをクリアするとアニメーションが展開される。なかには、アカベエのヒミツが見られるものも。", titleJpEn: "Comical Animation", textJpEn: "In \"PAC-MAN,\" clearing a set number of rounds unlocks an animated cutscene. In one of them, you can even see Blinky's secret.", titlePt: "Easter Egg de Cutscene", textPt: "Em \"PAC-MAN\", completar um determinado número de rounds desbloqueia uma cutscene animada. Em uma delas, é possível até ver o segredo do Blinky." },
  { titleEn: "[★☆☆] Highscore Battle", titleJp: "『パックマン』ハイスコア競争", textJp: "全２５６面の最高スコアは、すべての面でパーフェクトクリアすると３３３万３３６０点。パーフェクトが達成されてから、その後はタイムアタックが競われている。", titleJpEn: "\"PAC-MAN\" High Score Competition", textJpEn: "The highest possible score across all 256 stages, achieved by getting a perfect clear on every stage, is 3,333,360 points. Once a perfect score is achieved, players then compete over completion time.", titlePt: "Competição de Recorde de \"PAC-MAN\"", textPt: "A pontuação máxima possível em todas as 256 fases, obtida ao conseguir um clear perfeito em todas elas, é 3.333.360 pontos. Uma vez alcançada a pontuação perfeita, os jogadores passam a competir pelo tempo de conclusão." },
  { titleEn: "[★★☆] Cherry Bonus Fruit (Neutral Special)", titleJp: "フルーツターゲット チェリー 【通常必殺ワザ】", textJp: "フルーツターゲット「チェリー」は、山なりに短く飛ぶ。地面に落ちると１回バウンドする。", titleJpEn: "Bonus Fruit: Cherry (Neutral Special)", textJpEn: "The Cherry Bonus Fruit flies a short distance in an arc. It bounces once when it hits the ground.", titlePt: "Cherry Bonus Fruit (Especial Neutro)", textPt: "A fruta bônus Cherry voa uma curta distância em arco. Ela quica uma vez ao atingir o chão." },
  { titleEn: "[★★☆] Orange Bonus Fruit (Neutral Special)", titleJp: "フルーツターゲット オレンジ 【通常必殺ワザ】", textJp: "フルーツターゲット「オレンジ」は、ダメージが低いけれどまっすぐ飛び、速度も速いので相手に当てやすい。", titleJpEn: "Bonus Fruit: Orange (Neutral Special)", textJpEn: "The Orange Bonus Fruit deals low damage, but it flies straight and fast, making it easy to hit opponents with.", titlePt: "Orange Bonus Fruit (Especial Neutro)", textPt: "A fruta bônus Orange causa pouco dano, mas voa reto e rápido, tornando fácil acertar os adversários com ela." },
  { titleEn: "[★★☆] Strawberry Bonus Fruit (Neutral Special)", titleJp: "フルーツターゲット ストロベリー 【通常必殺ワザ】", textJp: "フルーツターゲット「ストロベリー」は少し遠くまで飛び、地面に落ちると２回バウンドする。", titleJpEn: "Bonus Fruit: Strawberry (Neutral Special)", textJpEn: "The Strawberry Bonus Fruit flies a bit farther and bounces twice when it hits the ground.", titlePt: "Strawberry Bonus Fruit (Especial Neutro)", textPt: "A fruta bônus Strawberry voa um pouco mais longe e quica duas vezes ao atingir o chão." },
  { titleEn: "[★★☆] Melon Bonus Fruit (Neutral Special)", titleJp: "フルーツターゲット メロン 【通常必殺ワザ】", textJp: "フルーツターゲット「メロン」は、投げた後の動きが遅く、相手に当てにくいが、その分ダメージは高い。", titleJpEn: "Bonus Fruit: Melon (Neutral Special)", textJpEn: "The Melon Bonus Fruit moves slowly after being thrown, making it hard to hit opponents with, but it deals correspondingly high damage.", titlePt: "Melon Bonus Fruit (Especial Neutro)", textPt: "A fruta bônus Melon se move devagar depois de arremessada, tornando difícil acertar adversários com ela, mas causa um dano correspondentemente alto." },
  { titleEn: "[★★☆] Apple Bonus Fruit (Neutral Special)", titleJp: "フルーツターゲット アップル 【通常必殺ワザ】", textJp: "フルーツターゲット「アップル」は、下方向に投げた後、何度もバウンドしながら飛んでいく。", titleJpEn: "Bonus Fruit: Apple (Neutral Special)", textJpEn: "The Apple Bonus Fruit, when thrown downward, travels along bouncing repeatedly.", titlePt: "Apple Bonus Fruit (Especial Neutro)", textPt: "A fruta bônus Apple, quando arremessada para baixo, viaja quicando repetidamente." },
  { titleEn: "[★★☆] Key Bonus...Fruit? (Neutral Special)", titleJp: "フルーツターゲット カギ 【通常必殺ワザ】", textJp: "「カギ」は、回転しながらまっすぐ高速で飛んでいく。フルーツターゲットの中でダメージが一番高い。", titleJpEn: "Bonus Fruit: Key (Neutral Special)", textJpEn: "The Key flies straight ahead at high speed while spinning. It deals the highest damage among all the Bonus Fruit.", titlePt: "Key Bonus...Fruit? (Especial Neutro)", textPt: "A Key voa reto para frente em alta velocidade enquanto gira. Ela causa o maior dano entre todas as frutas bônus." },
  { titleEn: "[★☆☆] Boss Galaxian (Neutral Special)", titleJp: "ボス・ギャラクシアン 【通常必殺ワザ】", textJp: "フルーツターゲット「ボス・ギャラクシアン」は、少し進んで１回転し、直進する。同じファイターに２回以上当たるため、コンボも狙える。", titleJpEn: "Boss Galaxian (Neutral Special)", textJpEn: "The Boss Galaxian Bonus Fruit moves forward a bit, spins once, and continues forward. Since it can hit the same fighter two or more times, it can also be used to set up combos.", titlePt: "Boss Galaxian (Especial Neutro)", textPt: "A fruta bônus Boss Galaxian avança um pouco, gira uma vez e continua em frente. Como pode acertar o mesmo lutador duas vezes ou mais, também pode ser usada para montar combos." },
  { titleEn: "[★☆☆] Bell Bonus Fruit (Neutral Special)", titleJp: "フルーツターゲット ベル 【通常必殺ワザ】", textJp: "フルーツターゲット「ベル」は、当てたファイターをしびれさせる。スマッシュ攻撃など、強力なワザで追撃するチャンス。", titleJpEn: "Bonus Fruit: Bell (Neutral Special)", textJpEn: "The Bell Bonus Fruit stuns any fighter it hits. It's a great chance to follow up with a smash attack or another powerful move.", titlePt: "Bell Bonus Fruit (Especial Neutro)", textPt: "A fruta bônus Bell atordoa qualquer lutador que atingir. É uma ótima chance de emendar com um ataque smash ou outro golpe poderoso." },
  { titleEn: "[★☆☆] Canceling Bonus Fruit (Neutral Special)", titleJp: "フルーツターゲットのキャンセル 【通常必殺ワザ】", textJp: "ジャンプやシールドで、キャンセル可能。もう一度ボタンを押すと、途中から再開。再開時、押したままでためを続けるが、すぐにボタンを放すと、フルーツを投げる。", titleJpEn: "Canceling Bonus Fruit (Neutral Special)", textJpEn: "This can be canceled with a jump or a shield. Pressing the button again resumes it partway through. When resuming, holding the button continues the charge, but releasing it immediately throws the fruit.", titlePt: "Cancelando o Bonus Fruit (Especial Neutro)", textPt: "Isso pode ser cancelado com um pulo ou um escudo. Apertar o botão novamente retoma o golpe de onde parou. Ao retomar, segurar o botão continua a carga, mas soltá-lo imediatamente arremessa a fruta." },
  { titleEn: "[★☆☆] Power Pellet (Side Special)", titleJp: "パワーエサ 【横必殺ワザ】", textJp: "先端のパワーエサに攻撃を当てられると、ワザがキャンセルされる。復帰に便利なワザだが、相手が近くにいる時はパワーエサの軌道に注意。", titleJpEn: "Power Pellet (Side Special)", textJpEn: "If the Power Pellet at the tip is hit by an attack, the move is canceled. It's a useful move for recovery, but watch the Power Pellet's path when an opponent is nearby.", titlePt: "Power Pellet (Especial Lateral)", textPt: "Se a Power Pellet na ponta for atingida por um ataque, o golpe é cancelado. É um golpe útil para recuperação, mas fique atento à trajetória da Power Pellet quando um adversário estiver por perto." },
  { titleEn: "[★☆☆] Pac-Jump (Up Special)", titleJp: "パックンジャンプ 【上必殺ワザ】", textJp: "トランポリンを設置して大きくジャンプする。はねるたびに、ジャンプする高さが上がっていく。", titleJpEn: "Pac-Jump (Up Special)", textJpEn: "Sets up a trampoline and jumps high. Each time it bounces, the jump height increases.", titlePt: "Pac-Jump (Especial Cima)", textPt: "Instala um trampolim e pula alto. A cada quique, a altura do pulo aumenta." },
  { titleEn: "[★☆☆] Fire Hydrant (Down Special)", titleJp: "消火栓 【下必殺ワザ】", textJp: "地面に消火栓を設置する。消火栓から噴き出す水でファイターを押し出す。", titleJpEn: "Fire Hydrant (Down Special)", textJpEn: "Places a fire hydrant on the ground. The water spraying out of it pushes fighters back.", titlePt: "Fire Hydrant (Especial Baixo)", textPt: "Coloca um hidrante no chão. A água que jorra dele empurra os lutadores para trás." },
  { titleEn: "[★★☆] Aerial Fire Hydrant (Down Special)", titleJp: "空中で消火栓 【下必殺ワザ】", textJp: "空中で使うと、地面に落下する消火栓自体で攻撃できる。復帰しようとしている相手の真上で使うのも有効。", titleJpEn: "Fire Hydrant in Midair (Down Special)", textJpEn: "Using it in midair lets the falling hydrant itself act as an attack. It's also effective to use it directly above an opponent who's trying to recover.", titlePt: "Fire Hydrant no Ar (Especial Baixo)", textPt: "Usá-lo no ar faz o próprio hidrante em queda agir como um ataque. Também é eficaz usá-lo diretamente acima de um adversário tentando se recuperar." },
  { titleEn: "[★★☆] Attack Using Fire Hydrant (Down Special)", titleJp: "消火栓を利用した攻撃 【下必殺ワザ】", textJp: "噴き出る水に当たると、パックマン自身も押し出される。これを利用して、攻撃をためつつ、背中から押させることで相手に近づいて攻撃することも可能。", titleJpEn: "Attack Using the Fire Hydrant (Down Special)", textJpEn: "Getting hit by the spraying water pushes PAC-MAN himself back as well. This can be used to charge an attack while letting the water push him from behind toward an opponent for a close-range hit.", titlePt: "Ataque Usando o Fire Hydrant (Especial Baixo)", textPt: "Ser atingido pela água que jorra também empurra o próprio PAC-MAN. Isso pode ser usado para carregar um ataque enquanto a água o empurra por trás em direção a um adversário para um golpe de perto." },
  { titleEn: "[★★☆] Tumbling Fire Hydrant (Down Special)", titleJp: "転がる消火栓 【下必殺ワザ】", textJp: "消火栓を急な坂の上で出すと、地面に固定されずに転がっていく。転がる消火栓を当てれば相手にダメージを与えることができる。", titleJpEn: "Tumbling Fire Hydrant (Down Special)", textJpEn: "Placing a hydrant on a steep slope makes it roll instead of staying fixed to the ground. Hitting an opponent with the rolling hydrant deals damage.", titlePt: "Fire Hydrant Rolante (Especial Baixo)", textPt: "Colocar um hidrante em uma ladeira íngreme faz com que ele role em vez de ficar fixo no chão. Acertar um adversário com o hidrante rolante causa dano." },
  { titleEn: "[★★☆] Launching Fire Hydrant (Down Special)", titleJp: "消火栓をふっとばす 【下必殺ワザ】", textJp: "消火栓がふっとぶ方向は、最後に当てたワザに応じて変化する。どのワザで、どの方向に消火栓が飛ぶか覚えておこう。", titleJpEn: "Launching the Fire Hydrant (Down Special)", textJpEn: "The direction the fire hydrant is launched changes depending on the last move that hit it. Try to remember which moves send it flying in which directions.", titlePt: "Lançando o Fire Hydrant (Especial Baixo)", textPt: "A direção em que o hidrante é lançado muda de acordo com o último golpe que o atingiu. Tente lembrar quais golpes o lançam em quais direções." },
  { titleEn: "[★☆☆] Super PAC-MAN (Final Smash)", titleJp: "スーパーパックマン 【最後の切りふだ】", textJp: "巨大なスーパーパックマンとなって、相手を食べてふっとばす、最後の切りふだ。画面端までいくとループして、反対側から出現し、どんどん加速していく。", titleJpEn: "Super PAC-MAN (Final Smash)", textJpEn: "A Final Smash in which he becomes a giant Super PAC-MAN, eating opponents and launching them. Reaching the edge of the screen loops him around to appear on the opposite side, and he keeps accelerating as he goes.", titlePt: "Super PAC-MAN (Final Smash)", textPt: "Um Final Smash no qual ele se torna um Super PAC-MAN gigante, comendo adversários e lançando-os. Ao chegar na borda da tela, ele dá a volta e reaparece do lado oposto, acelerando cada vez mais conforme avança." },
  { titleEn: "[★★☆] PAC Dash Bite (Dash Attack)", titleJp: "パックダッシュバイト 【ダッシュ攻撃】", textJp: "直線的に突進するため読まれやすいが、スキが非常に小さい。シールドされても反撃を受けにくいため、使いやすいワザの１つ。", titleJpEn: "Pac Dash Bite (Dash Attack)", textJpEn: "Since it dashes forward in a straight line, it's easy to read, but it leaves very little opening. Even if shielded, it's unlikely to be punished, making it one of the more usable moves.", titlePt: "PAC Dash Bite (Ataque de Investida)", textPt: "Como avança para frente em linha reta, é fácil de ler, mas deixa uma abertura muito pequena. Mesmo se bloqueado, dificilmente é punido, tornando-o um dos golpes mais úteis." },
  { titleEn: "[★★☆] About the Trampoline", titleJp: "トランポリンについて", textJp: "トランポリンは、自分以外のファイターに攻撃されると、耐久力が減ってしまう。攻撃力の高いワザほど、耐久力は大きく減る。", titleJpEn: "About the Trampoline", textJpEn: "The trampoline's durability decreases when it's attacked by a fighter other than PAC-MAN. The more powerful the move, the more its durability decreases.", titlePt: "Sobre o Trampolim", textPt: "A durabilidade do trampolim diminui quando é atacado por um lutador que não seja o PAC-MAN. Quanto mais poderoso o golpe, mais sua durabilidade diminui." },
];

async function main() {
  const pacman = await db.fighter.findFirst({
    where: { name: "Pac-Man" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!pacman) { console.log("Pac-Man not found"); return; }

  await db.fighter.update({
    where: { id: pacman.id },
    data: {
      curatorOverviewEn: "Pac-Man brings his entire arcade legacy into the fight, turning bonus fruit — Cherry, Orange, Strawberry, Melon, Apple, the Key, Boss Galaxian, and the stunning Bell — into a rotating arsenal of projectiles with wildly different speeds, arcs, and payoffs. Fire Hydrant doubles as a mobile wall, a meteor-capable falling hazard, and a way to close distance by riding its spray, while Pac-Jump's trampoline offers a recovery that gets higher with every bounce, at the cost of a fragile object opponents can destroy. Power Pellet is a serviceable horizontal recovery that risks getting canceled by a well-placed hit. Pac-Man rewards players who master fruit selection on the fly and use the hydrant as both a weapon and a shield, rather than fighters looking for a single reliable answer to every situation.",
      curatorOverviewPt: "Pac-Man traz todo o seu legado de arcade para a luta, transformando as frutas bônus — Cherry, Orange, Strawberry, Melon, Apple, a Key, Boss Galaxian e a atordoante Bell — em um arsenal rotativo de projéteis com velocidades, trajetórias e recompensas radicalmente diferentes. Fire Hydrant funciona tanto como uma parede móvel, um perigo em queda com efeito meteoro, quanto como uma forma de encurtar distância cavalgando o jato de água, enquanto o trampolim do Pac-Jump oferece uma recuperação que fica mais alta a cada quique, ao custo de ser um objeto frágil que os adversários podem destruir. Power Pellet é uma recuperação horizontal funcional que corre o risco de ser cancelada por um golpe bem posicionado. Pac-Man recompensa jogadores que dominam a escolha de frutas em tempo real e usam o hidrante tanto como arma quanto como escudo, em vez de lutadores que buscam uma única resposta confiável para toda situação.",
      curatorOverviewJp: "パックマンは、アーケードの遺産をそのまま戦いに持ち込み、フルーツターゲット――チェリー、オレンジ、ストロベリー、メロン、アップル、カギ、ボス・ギャラクシアン、そしてしびれさせるベル――を、速度も弾道も見返りも大きく異なる回転式の飛び道具アーセナルへと変える。「消火栓」は移動する壁、メテオ効果を持つ落下ギミック、そして水流に乗って距離を詰める手段を兼ねる一方、「パックンジャンプ」のトランポリンは、はねるたびに高くなる復帰を提供するが、相手に破壊されうる脆いオブジェクトであるという代償を払う。「パワーエサ」は実用的な横復帰技だが、うまく攻撃を当てられるとキャンセルされてしまう危険がある。パックマンは、その場でフルーツの選択をマスターし、消火栓を武器と盾の両方として使いこなすプレイヤーに応えるファイターであり、あらゆる状況に対する単一の確実な答えを求めるファイターではない。",
      curatorOverviewJpEn: "Pac-Man brings his entire arcade legacy into the fight, turning Bonus Fruit — Cherry, Orange, Strawberry, Melon, Apple, the Key, Boss Galaxian, and the stunning Bell — into a rotating arsenal of projectiles with wildly different speeds, trajectories, and payoffs. Fire Hydrant doubles as a mobile wall, a falling hazard with a meteor effect, and a way to close distance by riding its spray, while Pac-Jump's trampoline offers a recovery that gets higher with each bounce, at the cost of being a fragile object that opponents can destroy. Power Pellet is a practical horizontal recovery move, but it risks being canceled if hit cleanly. Pac-Man rewards players who master fruit selection on the fly and use the hydrant as both weapon and shield, rather than fighters looking for one reliable answer to every situation.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = pacman.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = pacman.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Fire Hydrant\" is a Down Special that pushes opponents back with water. The hydrant itself can also be dropped on a rival's head or launched by attacking it. Be careful, though — getting hit by a hydrant that an opponent attacked will deal damage. The Up Special \"Pac-Jump\" summons a trampoline that can be used to jump up to three times. The third jump rises especially high, making it useful for recovery. (AC) Pac-Man (1980/07) (AC) Pac-Land (1984/08)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Fire Hydrant\" é um golpe especial baixo que empurra os adversários para trás com água. O próprio hidrante também pode ser derrubado na cabeça de um rival ou lançado ao ser atacado. Cuidado, porém — ser atingido por um hidrante que um adversário atacou causa dano. O especial de cima \"Pac-Jump\" convoca um trampolim que pode ser usado para pular até três vezes. O terceiro pulo sobe especialmente alto, sendo útil para recuperação. (AC) Pac-Man (1980/07) (AC) Pac-Land (1984/08)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = pacman.tips.find(t => t.titleEn === data.titleEn);
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

  // NOTE: "Rocketbarrel Pack" [SSB4] e [SSBB], órfãos que contêm "Pac" (de "Backpack"),
  // são itens do Donkey Kong Country, falso positivo da busca por substring — não linkados.

  await db.$disconnect();
}
main().catch(console.error);
