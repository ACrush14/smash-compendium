import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "One of the protagonists who appears in the \"Fire Emblem\" series. A hero who once led the fallen nation of Crimea to restoration, and also served as captain of the Greil Mercenaries. In this Smash Bros. title, he joins as the \"hero\" Ike, standing against the massive Begnion Empire. He's characterized by heavy-hitting swordsmanship, a fighter with the power to send even heavyweight rivals flying with bold force.",
    pt: "Um dos protagonistas que aparece na série \"Fire Emblem.\" Um herói que uma vez conduziu a nação caída de Crimea à restauração, e também serviu como capitão dos Greil Mercenaries. Neste título de Smash Bros., ele participa como o \"herói\" Ike, enfrentando o enorme Império de Begnion. Ele é caracterizado por uma esgrima de golpes pesados, um lutador com o poder de arremessar até rivais pesados com força ousada.",
  },
  SSBB: {
    jpEn: "A member of the Greil Mercenaries, based in the Kingdom of Crimea. He isn't much of a talker and gives off a blunt impression, but in truth he's a passionate man with something burning deep in his heart. He was a key figure in the restoration of the Kingdom of Crimea. In Radiant Dawn, he grows into a fine, principled young man of deep honor, and leads the Greil Mercenaries to aid the Laguz Alliance as its captain.",
    pt: "Um membro dos Greil Mercenaries, baseados no Reino de Crimea. Ele não é muito de falar e dá uma impressão brusca, mas na verdade é um homem apaixonado com algo ardendo no fundo do coração. Ele foi uma figura-chave na restauração do Reino de Crimea. Em Radiant Dawn, ele amadurece e se torna um jovem exemplar e íntegro, de profunda honra, e lidera os Greil Mercenaries em auxílio à Laguz Alliance como seu capitão.",
  },
  SSBU: {
    jpEn: "The protagonist of \"Fire Emblem: Path of Radiance.\" Captain of the Greil Mercenaries, and Greil's son. When his homeland, the Kingdom of Crimea, was invaded and destroyed by the neighboring nation of Daein, he encounters Princess Elincia of Crimea, who narrowly escaped Daein's clutches, and is asked for help by her, now with nowhere else to turn. After many twists and turns, the Crimean army is restored and rises up. He is granted the rank of general, along with a title of nobility. In the end, after defeating Daein's King Ashnard, he is celebrated as a hero.",
    pt: "O protagonista de \"Fire Emblem: Path of Radiance.\" Capitão dos Greil Mercenaries, e filho de Greil. Quando sua terra natal, o Reino de Crimea, foi invadida e destruída pela nação vizinha de Daein, ele encontra a Princesa Elincia de Crimea, que escapou por pouco das garras de Daein, e é pedido por ajuda por ela, agora sem mais nenhum lugar para recorrer. Após muitas reviravoltas, o exército da Crimea é restaurado e se levanta. Ele recebe o posto de general, junto com um título de nobreza. No final, após derrotar o Rei Ashnard de Daein, ele é celebrado como um herói.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Ike's Origins", titleJp: "アイクの初登場作品", textJp: "アイクの初登場作品は、２００５年にゲームキューブで発売された『ファイアーエムブレム 蒼炎の軌跡』。両手剣を軽々と扱う豪腕の戦士。", titleJpEn: "Ike's Origins", textJpEn: "Ike's debut was in \"Fire Emblem: Path of Radiance,\" released for the GameCube in 2005. A powerfully-armed warrior who wields a two-handed sword with ease.", titlePt: "As Origens do Ike", textPt: "O debut do Ike foi em \"Fire Emblem: Path of Radiance,\" lançado para o GameCube em 2005. Um guerreiro de braços poderosos que empunha uma espada de duas mãos com facilidade." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "グレイル傭兵団の団長を務める。口数が少なく無愛想だが、情に厚く心根は優しい。『ファイアーエムブレム 蒼炎の軌跡』の主人公であり、続編『暁の女神』にも登場。", titleJpEn: "In His Series", textJpEn: "Serves as captain of the Greil Mercenaries. He's a man of few words and blunt, but deeply compassionate and gentle at heart. He's the protagonist of \"Fire Emblem: Path of Radiance,\" and also appears in its sequel, \"Radiant Dawn.\"", titlePt: "Na Série Original", textPt: "Serve como capitão dos Greil Mercenaries. Ele é um homem de poucas palavras e brusco, mas profundamente compassivo e gentil de coração. Ele é o protagonista de \"Fire Emblem: Path of Radiance,\" e também aparece em sua sequência, \"Radiant Dawn.\"" },
  { titleEn: "[★☆☆] Radiance and Radiant", titleJp: "蒼炎と暁", textJp: "奇数カラーで『蒼炎の軌跡』のアイク、偶数カラーで『暁の女神』のアイクとなる。見た目や声が変わっているが、強さは同じ。", titleJpEn: "Radiance and Radiant", textJpEn: "Odd-numbered colors depict Ike from \"Path of Radiance,\" while even-numbered colors depict Ike from \"Radiant Dawn.\" His appearance and voice change, but his strength stays the same.", titlePt: "Radiance e Radiant", textPt: "Cores de número ímpar retratam o Ike de \"Path of Radiance,\" enquanto cores de número par retratam o Ike de \"Radiant Dawn.\" Sua aparência e voz mudam, mas sua força permanece a mesma." },
  { titleEn: "[★☆☆] Eruption (Neutral Special)", titleJp: "噴火 【通常必殺ワザ】", textJp: "ボタン長押しでためることができ、ための段階に応じて追加の爆炎があがる。最大で合計３つの爆炎が放たれ、少し離れた相手にも当たる。", titleJpEn: "Eruption (Neutral Special)", textJpEn: "Holding the button charges it, and additional pillars of flame rise depending on the charge stage. At maximum, a total of three pillars of flame are unleashed, hitting opponents even a bit further away.", titlePt: "Eruption (Especial Neutro)", textPt: "Segurar o botão carrega o golpe, e colunas de fogo adicionais surgem dependendo do estágio de carga. No máximo, um total de três colunas de fogo são liberadas, atingindo até adversários um pouco mais distantes." },
  { titleEn: "[★☆☆] Eruption at the Edge (Neutral Special)", titleJp: "ガケ際で噴火 【通常必殺ワザ】", textJp: "攻撃範囲は、左右だけでなく上下にも広い。ガケ際で使い、復帰してく相手を待ちぶせると効果的。", titleJpEn: "Eruption at the Edge (Neutral Special)", textJpEn: "Its range is wide not just left and right, but also up and down. It's effective when used at the edge to ambush opponents trying to recover.", titlePt: "Eruption na Borda (Especial Neutro)", textPt: "Seu alcance é amplo não só para os lados, mas também para cima e para baixo. É eficaz quando usado na borda para emboscar adversários tentando se recuperar." },
  { titleEn: "[★☆☆] Quick Draw (Side Special)", titleJp: "居合斬り 【横必殺ワザ】", textJp: "空中で居合斬りを当てたり、シールドされた後は、すぐに入力を行えば次の行動に移れる。何もしないと、落下しかできなくなってしまうので、復帰をする時は特に重要。", titleJpEn: "Quick Draw (Side Special)", textJpEn: "If Quick Draw connects in the air or gets shielded, inputting immediately afterward lets him move into his next action. If nothing is input, he can only fall, so this is especially important when recovering.", titlePt: "Quick Draw (Especial Lateral)", textPt: "Se o Quick Draw conectar no ar ou for bloqueado, inputar imediatamente depois permite passar para a próxima ação. Se nada for inputado, ele só consegue cair, então isso é especialmente importante ao se recuperar." },
  { titleEn: "[★☆☆] Quick Draw's Traits (Side Special)", titleJp: "居合斬りの特徴 【横必殺ワザ】", textJp: "落下し始めてから少し経ったタイミングで着地すると、着地のスキが大幅に少なくなる。", titleJpEn: "Quick Draw's Traits (Side Special)", textJpEn: "Landing a short while after he starts falling greatly reduces the landing lag.", titlePt: "As Características do Quick Draw (Especial Lateral)", textPt: "Pousar um pouco depois de começar a cair reduz bastante a abertura do pouso." },
  { titleEn: "[★★★] Aether and Super Armor (Up Special)", titleJp: "天空とスーパーアーマー 【上必殺ワザ】", textJp: "ワザの出始めはスーパーアーマー状態になる。相手を強引に打ち上げることが可能。", titleJpEn: "Aether and Super Armor (Up Special)", textJpEn: "The start of the move grants super armor. This allows him to forcefully launch opponents upward.", titlePt: "Aether e Super Armadura (Especial Cima)", textPt: "O início do golpe concede super armadura. Isso permite arremessar os adversários para cima à força." },
  { titleEn: "[★★★] Meteor with Aether (Up Special)", titleJp: "天空でメテオ 【上必殺ワザ】", textJp: "斬り下ろす時には、攻撃にメテオ効果がある。着地するまでまっすぐ落ちるので、ミスしないように注意。", titleJpEn: "Meteor with Aether (Up Special)", textJpEn: "When he slashes downward, the attack has a meteor effect. Since he falls straight down until landing, be careful not to make a mistake.", titlePt: "Meteoro com o Aether (Especial Cima)", textPt: "Quando ele golpeia para baixo, o ataque tem um efeito de meteoro. Como ele cai diretamente até pousar, cuidado para não cometer um erro." },
  { titleEn: "[★☆☆] Counter (Down Special)", titleJp: "カウンター 【下必殺ワザ】", textJp: "構え中に、相手から攻撃を受けると、相手の攻撃を無効化して反撃する。相手の攻撃によって、カウンターのダメージが変わる。", titleJpEn: "Counter (Down Special)", textJpEn: "If he's attacked while in his stance, he negates the opponent's attack and counterattacks. The damage of the counter changes depending on the opponent's attack.", titlePt: "Counter (Especial Baixo)", textPt: "Se ele for atacado enquanto está em sua posição, anula o ataque do adversário e contra-ataca. O dano do contra-ataque muda dependendo do ataque do adversário." },
  { titleEn: "[★☆☆] Great Aether (Final Smash)", titleJp: "大天空 【最後の切りふだ】", textJp: "空中でも使用でき、周囲をなぎ払う。少し上にいる相手も、巻き込むことができる。最後の斬り下ろしは、地面に大きな爆発を起こし、まわりの相手にもダメージを与える。", titleJpEn: "Great Aether (Final Smash)", textJpEn: "It can also be used in the air, sweeping through the surrounding area. Opponents positioned slightly above can also be caught. The final downward slash causes a large explosion on the ground, dealing damage to nearby opponents as well.", titlePt: "Great Aether (Final Smash)", textPt: "Também pode ser usado no ar, varrendo a área ao redor. Adversários posicionados um pouco acima também podem ser pegos. O golpe final para baixo causa uma grande explosão no chão, causando dano também aos adversários próximos." },
  { titleEn: "[★☆☆] Neutral Attack", titleJp: "弱攻撃", textJp: "パンチ、キック、剣叩きつけの３段攻撃。アイクのワザの中では、比較的早く出せるので便利。", titleJpEn: "Neutral Attack", textJpEn: "A three-hit combo of a punch, a kick, and a sword slam. It comes out relatively quickly among Ike's moves, making it convenient.", titlePt: "Ataque Neutro", textPt: "Um combo de três golpes: um soco, um chute e uma batida de espada. Ele sai relativamente rápido entre os golpes do Ike, tornando-o conveniente." },
  { titleEn: "[★★★] Cast Off (Down Smash Attack)", titleJp: "振り払い 【下スマッシュ攻撃】", textJp: "後ろ側への攻撃は、斬りつけた直後だけダメージが大きい。上手く当てれば正面より後ろ側の方がダメージが高く、大きくふっとばせる。", titleJpEn: "Cast Off (Down Smash Attack)", textJpEn: "The attack toward the back deals more damage only immediately after the slash. If landed well, the back side deals more damage than the front and launches opponents with greater force.", titlePt: "Cast Off (Ataque Smash Baixo)", textPt: "O ataque para trás causa mais dano apenas imediatamente após o corte. Se acertado bem, o lado de trás causa mais dano que a frente e arremessa os adversários com mais força." },
  { titleEn: "[★★☆] Repositioning Slash (Back Air Attack)", titleJp: "振り向き斬り 【後空中攻撃】", textJp: "アイクの空中攻撃の中でもっとも早く出せる上に、ダメージも高め。大振りな攻撃が多いファイターだけに、早い攻撃は相手の意表をつきやすい。", titleJpEn: "Repositioning Slash (Back Air Attack)", textJpEn: "It's the fastest of Ike's aerial attacks to come out, and also deals relatively high damage. Since he's a fighter with mostly slow, sweeping attacks, a fast attack can easily catch opponents off guard.", titlePt: "Repositioning Slash (Ataque Aéreo Trás)", textPt: "É o mais rápido dos ataques aéreos do Ike, e também causa dano relativamente alto. Como ele é um lutador com golpes majoritariamente lentos e amplos, um ataque rápido pode facilmente pegar os adversários de surpresa." },
  { titleEn: "[★☆☆] Rising Swing (Up Air Attack)", titleJp: "振り上げ 【上空中攻撃】", textJp: "攻撃範囲が縦横にとても広く、相手と多少離れていても当たる。通常空中攻撃や、下投げ、上投げから、コンボにつなげることが狙えるワザ。", titleJpEn: "Rising Swing (Up Air Attack)", textJpEn: "Its range is very wide both vertically and horizontally, connecting even if the opponent is somewhat far away. A move that can be aimed to combo from a neutral air attack, down throw, or up throw.", titlePt: "Rising Swing (Ataque Aéreo Cima)", textPt: "Seu alcance é muito amplo tanto vertical quanto horizontalmente, conectando mesmo se o adversário estiver um pouco distante. Um golpe que pode ser buscado para combar a partir de um ataque aéreo neutro, arremesso baixo ou arremesso cima." },
  { titleEn: "[★★☆] Repeated Edge Grabbing", titleJp: "連続ガケつかまりの上限回数", textJp: "アイクの「天空」など、一部のワザには連続でガケつかまりをできる回数に上限があり、一度着地するまでガケにつかまれなくなる。", titleJpEn: "Repeated Edge Grabbing", textJpEn: "For some of Ike's moves, like Aether, there's a limit to how many times he can grab the ledge in a row, and after reaching it, he can't grab the ledge again until he lands.", titlePt: "Limite de Agarrões Consecutivos na Borda", textPt: "Para alguns dos golpes do Ike, como o Aether, há um limite de quantas vezes seguidas ele pode se agarrar à borda, e depois de atingir esse limite, ele não pode se agarrar à borda novamente até pousar." },
];

async function main() {
  const ike = await db.fighter.findFirst({
    where: { name: "Ike" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!ike) { console.log("Ike not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: ike.id },
    data: {
      curatorOverviewEn: "Ike, captain of the Greil Mercenaries, is Smash's heaviest hitter with a blade — every swing of his massive sword carries huge knockback, from the three-stage Eruption pillars to the super-armored launch of Aether. Counter punishes anyone who attacks blindly, and Quick Draw doubles as a mobility tool if canceled with a follow-up input. Slow but devastating, Ike rewards patient players who commit to reads rather than button-mashing.",
      curatorOverviewPt: "Ike, capitão dos Greil Mercenaries, é o golpeador mais pesado do Smash com uma lâmina — cada balanço de sua espada enorme carrega um arremesso imenso, desde as colunas de três estágios do Eruption até o lançamento com super armadura do Aether. Counter pune quem ataca às cegas, e Quick Draw também funciona como ferramenta de mobilidade se cancelado com um input de acompanhamento. Lento mas devastador, o Ike recompensa jogadores pacientes que se comprometem com leituras em vez de apertar botões aleatoriamente.",
      curatorOverviewJp: "グレイル傭兵団団長のアイクは、剣を使うスマブラ最強クラスの一撃を誇る――３段階の噴火の柱から、スーパーアーマー状態で打ち上げる天空まで、剣の一振り一振りが強烈なふっとばし力を持つ。カウンターは無闇に攻撃してくる相手を罰し、居合斬りは追加入力でキャンセルすれば機動力としても使える。遅いが強烈な威力を持つアイクは、ボタン連打ではなく読みに徹する忍耐強いプレイヤーに応える。",
      curatorOverviewJpEn: "Ike, captain of the Greil Mercenaries, boasts some of Smash's most powerful blade strikes — from the three-stage pillars of Eruption to the super-armored launch of Aether, every swing of his sword carries fierce knockback. Counter punishes opponents who attack recklessly, and Quick Draw also serves as a mobility tool when canceled with a follow-up input. Slow but devastatingly powerful, Ike rewards patient players who commit to reads rather than mashing buttons.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Bios PT+JpEn
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = ike.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Move EN+PT+JpEn
  const move = ike.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "The side smash attack \"Cleave,\" which cleaves opponents in two with his two-handed sword, has some of the strongest knockback in all of Smash Bros. Its startup is slow, but it's a move worth going for whenever possible. \"Eruption\" is a special move that stabs the sword into the ground, creating a pillar of fire that deals damage. Charging it too much causes self-damage, so it's best to release it just short of maximum charge. (GC) Fire Emblem: Path of Radiance (2005/04) (Wii) Fire Emblem: Radiant Dawn (2007/02)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "O ataque smash lateral \"Cleave,\" que corta os adversários ao meio com sua espada de duas mãos, tem um dos arremessos mais fortes de todo o Smash Bros. Sua preparação é lenta, mas é um golpe que vale a pena buscar sempre que possível. \"Eruption\" é um golpe especial que crava a espada no chão, criando uma coluna de fogo que causa dano. Carregá-lo demais causa dano ao próprio Ike, então é melhor soltá-lo um pouco antes da carga máxima. (GC) Fire Emblem: Path of Radiance (2005/04) (Wii) Fire Emblem: Radiant Dawn (2007/02)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = ike.tips.find(t => t.titleEn === data.titleEn);
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
