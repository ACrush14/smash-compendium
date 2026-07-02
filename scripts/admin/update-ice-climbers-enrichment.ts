import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "This game can be played by two people, in which case Nana appears as the Player 2 character. In two-player mode, you can cooperate, or play it as a competitive game where you race or interfere with each other.",
    pt: "Este jogo pode ser jogado por duas pessoas, e nesse caso a Nana aparece como o personagem do Jogador 2. No modo de dois jogadores, vocês podem cooperar, ou jogar como um jogo competitivo onde competem ou atrapalham um ao outro.",
  },
  SSBM: {
    jpEn: "Blue clothes is \"Popo,\" red clothes is \"Nana.\" The protagonists of \"Ice Climber,\" who relentlessly jump their way up icebergs. For some reason, vegetables like eggplants and cucumbers fall near the summit, and for some reason they conquer the peak by grabbing onto a pterosaur.",
    pt: "Roupa azul é o \"Popo,\" roupa vermelha é a \"Nana.\" Os protagonistas de \"Ice Climber,\" que sobem incansavelmente montanhas de gelo pulando. Por algum motivo, vegetais como berinjelas e pepinos caem perto do topo, e por algum motivo eles conquistam o pico se agarrando a um pterossauro.",
  },
  SSBB: {
    jpEn: "The one wearing blue is \"Popo,\" the one wearing red is \"Nana.\" Making use of excellent jumping ability and hammers, they climb to the summit while breaking blocks. Collecting vegetables along the way, they conquer the peak by finally grabbing the condor. Besides breaking blocks, the hammer can also be used to strike and drive away enemies, or to destroy icicles falling from blocks above.",
    pt: "O que veste azul é o \"Popo,\" o que veste vermelho é a \"Nana.\" Usando excelente capacidade de pulo e martelos, eles sobem até o topo enquanto quebram blocos. Coletando vegetais pelo caminho, eles conquistam o pico finalmente agarrando o condor. Além de quebrar blocos, o martelo também pode ser usado para golpear e afastar inimigos, ou destruir pingentes de gelo que caem de blocos acima.",
  },
  SSB4: {
    jpEn: "The two protagonists of an action game released in 1985. Popo wears blue. Nana wears red. They aim for the mountain peak, jumping to break blocks overhead, and drive away animals blocking their path with hammers. Conquering the mountain starts a bonus stage — collecting vegetables or successfully grabbing the condor at the summit raises your score.",
    pt: "Os dois protagonistas de um jogo de ação lançado em 1985. Popo veste azul. Nana veste vermelho. Eles miram no pico da montanha, pulando para quebrar blocos acima, e afastam animais que bloqueiam o caminho com martelos. Conquistar a montanha inicia uma fase bônus — coletar vegetais ou agarrar o condor com sucesso no topo aumenta sua pontuação.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "A quirky character that fights as a pair. If Nana falls, there's no score penalty, but combination moves become unusable, making things much harder. They're powerful together, but their aerial horizontal movement is very slow. Ice Shot fires a chunk of ice. Squall Hammer is more powerful when used by both together. B: Ice Shot, Side+B: Squall Hammer",
    pt: "Um personagem peculiar que luta em dupla. Se a Nana cair, não há penalidade de pontuação, mas os golpes combinados ficam inutilizáveis, tornando as coisas muito mais difíceis. Eles são poderosos juntos, mas seu movimento horizontal aéreo é muito lento. O Ice Shot dispara um pedaço de gelo. O Squall Hammer é mais poderoso quando usado pelos dois juntos. B: Ice Shot, Lateral+B: Squall Hammer",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "For Ice Climbers' color variations, red-toned ones make Nana the player character. The two have slightly different hairstyles. Belay covers a very large jumping distance, but be careful not to get punished on landing. Blizzard is best used up close — it occasionally freezes opponents. Up+B: Belay, Down+B: Blizzard",
    pt: "Para as variações de cor dos Ice Climbers, as de tons vermelhos tornam a Nana o personagem do jogador. Os dois têm penteados ligeiramente diferentes. O Belay cobre uma distância de salto muito grande, mas tome cuidado para não ser punido no pouso. O Blizzard é melhor usado de perto — ocasionalmente congela os adversários. Cima+B: Belay, Baixo+B: Blizzard",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Ice Climbers' Origins", titleJp: "アイスクライマーの初登場作品", textJp: "アイスクライマーの初登場は、１９８５年発売の『アイスクライマー』。男の子のポポと女の子のナナが、ハンマーを手にジャンプを駆使し、山の頂上を目指す。", titleJpEn: "Ice Climbers' Origins", textJpEn: "The Ice Climbers' debut was in \"Ice Climber,\" released in 1985. The boy Popo and the girl Nana, hammers in hand, use jumping to aim for the mountain peak.", titlePt: "As Origens dos Ice Climbers", textPt: "O debut dos Ice Climbers foi em \"Ice Climber,\" lançado em 1985. O menino Popo e a menina Nana, martelos em mãos, usam pulos para mirar no pico da montanha." },
  { titleEn: "[★☆☆] In Their Series", titleJp: "原作では", textJp: "『アイスクライマー』では、ポポとナナは、服の色以外の違いはなかった。２人同時プレイができ、協力してクリアを目指したり、邪魔しあったりできた。", titleJpEn: "In Their Series", textJpEn: "In \"Ice Climber,\" Popo and Nana had no differences besides the color of their clothes. Two players could play simultaneously, either cooperating to clear the game or interfering with each other.", titlePt: "Na Série Original", textPt: "Em \"Ice Climber,\" Popo e Nana não tinham diferenças além da cor das roupas. Dois jogadores podiam jogar simultaneamente, cooperando para completar o jogo ou atrapalhando um ao outro." },
  { titleEn: "[★☆☆] Ice from Ice Shot (Neutral Special)", titleJp: "アイスショットの氷 【通常必殺ワザ】", textJp: "ポポとナナが同時にハンマーで氷を打ち出す必殺ワザ。氷は２人なら２つ、１人なら１つになる。", titleJpEn: "Ice from Ice Shot (Neutral Special)", textJpEn: "A special move where Popo and Nana simultaneously strike out ice with their hammers. Two ice chunks fly out if both are present, one if only one is.", titlePt: "O Gelo do Ice Shot (Especial Neutro)", textPt: "Um golpe especial onde Popo e Nana golpeiam gelo simultaneamente com seus martelos. Dois pedaços de gelo saem se ambos estiverem presentes, um se apenas um estiver." },
  { titleEn: "[★☆☆] Ice Shot Reflected (Neutral Special)", titleJp: "アイスショットの反射 【通常必殺ワザ】", textJp: "アイスショットは、相手にシールドされると、跳ね返ってくることも。相手の攻撃によって跳ね返されたものだと、自分もダメージを受けてしまうので注意。", titleJpEn: "Ice Shot Reflected (Neutral Special)", textJpEn: "If an opponent shields Ice Shot, it can bounce back. If it's reflected by an opponent's attack, you'll take damage from it too — be careful.", titlePt: "Ice Shot Refletido (Especial Neutro)", textPt: "Se um adversário bloquear o Ice Shot, ele pode quicar de volta. Se for refletido por um ataque do adversário, você também sofrerá dano dele — cuidado." },
  { titleEn: "[★☆☆] Squall Hammer (Side Special)", titleJp: "トルネードハンマー 【横必殺ワザ】", textJp: "ワザが出ている時に、スティックを左右に入力すると移動でき、ボタン連打で上昇する。２人だと最後の一撃でふっとばせるが、１人の時は移動距離が短く、スキが大きい。", titleJpEn: "Squall Hammer (Side Special)", textJpEn: "While the move is active, inputting left or right on the stick lets you move, and mashing the button makes you rise. With both climbers, the final hit can launch opponents, but with just one, the travel distance is shorter and the opening is larger.", titlePt: "Squall Hammer (Especial Lateral)", textPt: "Enquanto o movimento está ativo, inputar esquerda ou direita no analógico permite se mover, e apertar o botão repetidamente faz você subir. Com os dois escaladores, o golpe final pode arremessar adversários, mas com apenas um, a distância percorrida é menor e a abertura é maior." },
  { titleEn: "[★☆☆] Belay (Up Special)", titleJp: "ゴムジャンプ 【上必殺ワザ】", textJp: "ポポに投げられたナナがジャンプして、上に向かって体当たりをする。その後、ナナにゴムで引っ張られてポポも飛び上がる。ゴムは２人をつなぐ命綱。", titleJpEn: "Belay (Up Special)", textJpEn: "Thrown by Popo, Nana jumps and tackles upward. Afterward, Popo is pulled up by an elastic cord attached to Nana and leaps as well. The cord is the lifeline connecting the two.", titlePt: "Belay (Especial Cima)", textPt: "Lançada pelo Popo, a Nana pula e ataca para cima. Depois, o Popo é puxado por uma corda elástica presa à Nana e também salta. A corda é a linha de vida que conecta os dois." },
  { titleEn: "[★☆☆] Blizzard (Down Special)", titleJp: "ブリザード 【下必殺ワザ】", textJp: "手のひらから吹雪を放ち、相手を凍結させる必殺ワザ。氷結状態の相手に当てると、さらに凍りつく時間が長くなるが、上限はある。", titleJpEn: "Blizzard (Down Special)", textJpEn: "A special move that releases a blizzard from their palms, freezing opponents. Hitting an already-frozen opponent extends the freeze duration further, though there's a cap.", titlePt: "Blizzard (Especial Baixo)", textPt: "Um golpe especial que libera uma nevasca das palmas das mãos, congelando os adversários. Acertar um adversário já congelado estende ainda mais a duração do congelamento, embora haja um limite." },
  { titleEn: "[★☆☆] Iceberg (Final Smash)", titleJp: "アイスバーグ 【最後の切りふだ】", textJp: "画面下から氷山を呼び出す、最後の切りふだ。氷山は左右に動かすことができるが、自分も一緒に動くので注意。", titleJpEn: "Iceberg (Final Smash)", textJpEn: "A Final Smash that summons an iceberg from the bottom of the screen. The iceberg can be moved left and right, but be careful — the Ice Climbers move along with it.", titlePt: "Iceberg (Final Smash)", textPt: "Um Final Smash que invoca um iceberg do fundo da tela. O iceberg pode ser movido para a esquerda e direita, mas cuidado — os Ice Climbers se movem junto com ele." },
  { titleEn: "[★☆☆] Iceberg's Condor (Final Smash)", titleJp: "アイスバーグのコンドル 【最後の切りふだ】", textJp: "氷山とともに、コンドルが出現。アイスクライマーのみ足につかまることができる。", titleJpEn: "Iceberg's Condor (Final Smash)", textJpEn: "A condor appears together with the iceberg. Only the Ice Climbers can grab onto its legs.", titlePt: "O Condor do Iceberg (Final Smash)", textPt: "Um condor aparece junto com o iceberg. Apenas os Ice Climbers podem se agarrar às suas patas." },
  { titleEn: "[★★★] Polar Bear in Iceberg (Final Smash)", titleJp: "アイスバーグのホワイトベア 【最後の切りふだ】", textJp: "氷山の中腹で、バランスを必死に取っているホワイトベア。実は、当たると氷山よりも大きく相手をふっとばす、危険なヤツ。", titleJpEn: "The Polar Bear in Iceberg (Final Smash)", textJpEn: "A polar bear desperately balancing partway up the iceberg. In fact, it's a dangerous fellow that launches opponents even harder than the iceberg itself if it hits them.", titlePt: "O Urso Polar no Iceberg (Final Smash)", textPt: "Um urso polar se equilibrando desesperadamente na metade do iceberg. Na verdade, é um sujeito perigoso que arremessa os adversários com ainda mais força que o próprio iceberg, se acertá-los." },
  { titleEn: "[★★☆] Hammer Sweep (Down Smash)", titleJp: "２人で攻撃 【下スマッシュ攻撃】", textJp: "ポポは正面を、ナナは背後を攻撃する。ポポ１人だけだと、攻撃できる範囲が狭くなるので注意。", titleJpEn: "Attacking Together (Down Smash)", textJpEn: "Popo attacks in front, Nana attacks behind. With only Popo, the attack range becomes narrower — be careful.", titlePt: "Atacando Juntos (Smash Baixo)", textPt: "O Popo ataca na frente, a Nana ataca atrás. Com apenas o Popo, o alcance do ataque fica mais estreito — cuidado." },
  { titleEn: "[★★★] Hammer Slam (Forward Air Attack)", titleJp: "ハンマードロップ 【前空中攻撃】", textJp: "空中で前転しながら、ハンマーを叩きつける。ポポの攻撃は相手を大きくふっとばし、ナナの攻撃はうまく当てるとメテオを狙える。", titleJpEn: "Hammer Drop (Forward Air Attack)", textJpEn: "Slams the hammer down while somersaulting forward in the air. Popo's attack sends opponents flying far, while Nana's attack can go for a meteor smash if it connects well.", titlePt: "Hammer Drop (Ataque Aéreo Frontal)", textPt: "Golpeia com o martelo enquanto dá um salto mortal para frente no ar. O ataque do Popo arremessa os adversários para longe, enquanto o ataque da Nana pode buscar um meteoro se conectar bem." },
  { titleEn: "[★☆☆] Grab", titleJp: "つかみ", textJp: "つかみは、ポポだけが行う。相手を投げる時、ナナはバンザイで応援してくれる。", titleJpEn: "Grab", textJpEn: "Only Popo performs the grab. When throwing an opponent, Nana cheers him on with a \"banzai\" pose.", titlePt: "Agarrão", textPt: "Apenas o Popo realiza o agarrão. Ao arremessar um adversário, a Nana o anima com uma pose de \"banzai\"." },
  { titleEn: "[★☆☆] Grabbing Popo", titleJp: "ポポがつかまれた時", textJp: "ポポがつかまれると、ナナはあわててしまい、動けなくなる。ポポが自由になれば、ナナを動かせるようになる。", titleJpEn: "When Popo Is Grabbed", textJpEn: "When Popo is grabbed, Nana panics and becomes unable to move. Once Popo is freed, Nana can be moved again.", titlePt: "Quando o Popo é Agarrado", textPt: "Quando o Popo é agarrado, a Nana entra em pânico e fica incapaz de se mover. Assim que o Popo é libertado, a Nana pode voltar a se mover." },
  { titleEn: "[★★☆] Nana", titleJp: "ナナ", textJp: "ナナはポポに比べて、少しだけふっとばされやすい。ナナがいなくなると、必殺ワザや通常攻撃の効果が弱くなる。ゴムジャンプの復帰力も弱くなってしまう。", titleJpEn: "Nana", textJpEn: "Nana is slightly more prone to being launched than Popo. If Nana is gone, the effects of special moves and standard attacks become weaker. Belay's recovery power is also weakened.", titlePt: "Nana", textPt: "A Nana é um pouco mais propensa a ser arremessada do que o Popo. Se a Nana desaparecer, os efeitos dos golpes especiais e ataques padrão ficam mais fracos. O poder de recuperação do Belay também fica enfraquecido." },
];

async function main() {
  const ic = await db.fighter.findFirst({
    where: { name: "Ice Climbers" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!ic) { console.log("Ice Climbers not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: ic.id },
    data: {
      curatorOverviewEn: "The Ice Climbers, Popo and Nana, are Smash's only true duo fighter — controlled as one but attacking as two, with devastating combination moves like Belay and dual Ice Shots when both climbers survive. Losing Nana cripples their power significantly, making protecting her as important as offense. A technical, high-ceiling character rewarding players who master desyncing both climbers for simultaneous attacks.",
      curatorOverviewPt: "Os Ice Climbers, Popo e Nana, são a única dupla verdadeira do Smash — controlados como um só, mas atacando como dois, com golpes combinados devastadores como Belay e Ice Shots duplos quando ambos os escaladores sobrevivem. Perder a Nana enfraquece significativamente seu poder, tornando protegê-la tão importante quanto atacar. Um personagem técnico e de alto teto que recompensa jogadores que dominam a dessincronização dos dois escaladores para ataques simultâneos.",
      curatorOverviewJp: "アイスクライマーのポポとナナは、スマブラで唯一の真のデュオファイター――一人のように操作しながら二人で攻撃し、両者が生存していればゴムジャンプや二重アイスショットなどの強力な連携ワザを繰り出せる。ナナを失うとその力は大幅に落ちるため、彼女を守ることは攻撃と同じくらい重要だ。両者の動きを分離させ同時攻撃を極めたプレイヤーに応える、テクニカルでポテンシャルの高いファイターである。",
      curatorOverviewJpEn: "Popo and Nana, the Ice Climbers, are Smash's only true duo fighter — controlled as one, yet attacking as two, unleashing powerful combination moves like Belay and dual Ice Shots when both survive. Losing Nana severely weakens their power, making protecting her just as important as attacking. A technical, high-potential fighter that rewards players who master desyncing the pair for simultaneous attacks.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = ic.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Moves EN+PT+JpEn
  for (const m of ic.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = ic.tips.find(t => t.titleEn === data.titleEn);
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

  await db.$disconnect();
}
main().catch(console.error);
