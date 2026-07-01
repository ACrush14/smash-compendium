import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "The princess of the \"Mushroom Kingdom\" who appears in the \"Mario\" series. In many titles, such as the \"Super Mario\" series, she's kidnapped by Bowser, which serves as the catalyst for Mario and friends' adventures.",
    pt: "A princesa do \"Reino dos Cogumelos\" que aparece na série \"Mario.\" Em muitos títulos, como a série \"Super Mario,\" ela é sequestrada por Bowser, o que serve como catalisador para as aventuras do Mario e seus amigos.",
  },
  SSBM: {
    jpEn: "The princess of the Mushroom Kingdom. She is the ruler of her own castle. Toads are stationed within the castle as her guards, but they easily allow Bowser to invade. The princess also enjoys golf and tennis, and being so magnanimous, she'll even happily play with Bowser.",
    pt: "A princesa do Reino dos Cogumelos. Ela é a governante de seu próprio castelo. Toads estão posicionados dentro do castelo como seus guardas, mas facilmente permitem que Bowser invada. A princesa também gosta de golfe e tênis, e sendo tão magnânima, ela até joga alegremente com Bowser.",
  },
  SSBB: {
    jpEn: "The princess of the Mushroom Kingdom. Her long blonde hair suits her pink dress perfectly. Despite having a large number of Toad retainers, she ends up kidnapped by Bowser. Though she's usually the one being rescued, she was finally cast in the leading role in \"Super Princess Peach,\" where she rescues Mario and Luigi, who usually rescue her.",
    pt: "A princesa do Reino dos Cogumelos. Seu longo cabelo loiro combina perfeitamente com seu vestido rosa. Apesar de ter um grande número de guardas Toad, ela acaba sequestrada por Bowser. Embora normalmente seja ela quem é resgatada, ela finalmente foi escalada para o papel principal em \"Super Princess Peach,\" onde resgata Mario e Luigi, que normalmente a resgatam.",
  },
  SSB4: {
    jpEn: "The princess of the Mushroom Kingdom. She combines not just cuteness but strength as well. In Smash Bros., she wants to move like a true princess — gracefully dodging attacks with her exclusive \"Floating\" ability, or thrusting out Toad to block attacks. Beyond Toad, she also carries a cunning array of hidden tools — an umbrella, a frying pan, a tennis racket, a golf club, and more.",
    pt: "A princesa do Reino dos Cogumelos. Ela combina não apenas fofura, mas também força. Em Smash Bros., ela quer se mover como uma verdadeira princesa — esquivando-se graciosamente de ataques com sua habilidade exclusiva de \"Flutuação,\" ou colocando o Toad para bloquear ataques. Além do Toad, ela também carrega um arsenal astuto de ferramentas escondidas — um guarda-chuva, uma frigideira, uma raquete de tênis, um taco de golfe e mais.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "She possesses \"Floating,\" an extremely rare special ability in Smash Bros. Combined with Peach Parasol, her travel distance rivals actual flight, letting her recover quite safely. However, being lightweight, a single hard hit sending her off-screen can be fatal. Its attack power isn't very high, so it's best used with survival in mind. B: Toad, Side+B: Peach Bomber",
    pt: "Ela possui \"Flutuação\", uma habilidade especial extremamente rara em Smash Bros. Combinada com o Peach Parasol, sua distância de viagem rivaliza com o voo real, permitindo uma recuperação bastante segura. Porém, por ser leve, um único golpe forte que a arremesse para fora da tela pode ser fatal. Seu poder de ataque não é muito alto, então é melhor usá-lo pensando em sobrevivência. B: Toad, Lateral+B: Peach Bomber",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "The side smash attack randomly selects one of three items — frying pan, golf club, or tennis racket — each with different power and reach. Toad quietly blocks an opponent's attack and counters with spores. It's fine — she's a princess, after all. Up+B: Peach Parasol, Down+B: Vegetable",
    pt: "O ataque smash lateral seleciona aleatoriamente um de três itens — frigideira, taco de golfe ou raquete de tênis — cada um com poder e alcance diferentes. O Toad bloqueia discretamente o ataque do adversário e contra-ataca com esporos. Tudo bem — afinal, ela é uma princesa. Cima+B: Peach Parasol, Baixo+B: Vegetal",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Princess or not, she won't shy away from farm work if it means winning a fight. Her Down Special, Vegetable, pulls a vegetable from the ground and throws it at an opponent. The power of the vegetable pulled varies by its expression — a normal or smiling face deals average damage, while an old-man-like face packs more punch. Rarely, a Bob-omb or Mr. Saturn might come out instead. (FC) Super Mario Bros. (1985/09) (NDS) Super Princess Peach (2005/10)",
    pt: "Princesa ou não, ela não vai fugir do trabalho no campo se isso significar vencer uma luta. Seu Especial Baixo, Vegetal, arranca um vegetal do chão e o arremessa em um adversário. O poder do vegetal arrancado varia conforme sua expressão — um rosto normal ou sorridente causa dano médio, enquanto um rosto de idoso tem mais força. Raramente, um Bob-omb ou Mr. Saturn pode sair no lugar. (FC) Super Mario Bros. (1985/09) (NDS) Super Princess Peach (2005/10)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Princess of the Mushroom Kingdom", titleJp: "キノコ王国のお姫様", textJp: "ピーチ姫が初めて登場した作品は、『スーパーマリオブラザーズ』。“ピーチ姫がクッパにさらわれ、マリオが助ける”という物語の原点。", titleJpEn: "Princess of the Mushroom Kingdom", textJpEn: "Princess Peach first appeared in \"Super Mario Bros.\" It's the origin of the story where \"Princess Peach is kidnapped by Bowser, and Mario rescues her.\"", titlePt: "A Princesa do Reino dos Cogumelos", textPt: "A Princesa Peach apareceu pela primeira vez em \"Super Mario Bros.\" É a origem da história em que \"a Princesa Peach é sequestrada por Bowser, e o Mario a resgata.\"" },
  { titleEn: "[★☆☆] In Her Series", titleJp: "原作では", textJp: "２００５年に発売された『スーパープリンセスピーチ』では主役として登場。クッパにさらわれたマリオ達を救い出すべく、カッサーと協力して冒険した。", titleJpEn: "In Her Series", textJpEn: "In \"Super Princess Peach,\" released in 2005, she appears as the main protagonist. She adventures together with Perry to rescue Mario and friends, who were kidnapped by Bowser.", titlePt: "Na Série Original", textPt: "Em \"Super Princess Peach,\" lançado em 2005, ela aparece como a protagonista principal. Ela se aventura junto com Perry para resgatar Mario e amigos, que foram sequestrados por Bowser." },
  { titleEn: "[★☆☆] Nurse Peach", titleJp: "ナース姿", textJp: "マリオが医者として登場する『ドクターマリオ』では、ピーチ姫もナースに。ただしゲーム中には登場せず、説明書だけで見ることができる。", titleJpEn: "Nurse Peach", textJpEn: "In \"Dr. Mario,\" where Mario appears as a doctor, Princess Peach also becomes a nurse. However, she doesn't actually appear in the game itself — she can only be seen in the instruction manual.", titlePt: "Enfermeira Peach", textPt: "Em \"Dr. Mario,\" onde o Mario aparece como médico, a Princesa Peach também se torna enfermeira. Porém, ela não aparece de fato no jogo em si — pode ser vista apenas no manual de instruções." },
  { titleEn: "[★★☆] Peach Parasol Descent (Up Special)", titleJp: "ピーチパラソルの開閉 【上必殺ワザ】", textJp: "ワザを出した後の落下中、下入力でカサを閉じ、上入力でまた開く。カサを閉じた状態は落下速度が速い。", titleJpEn: "Opening and Closing Peach Parasol (Up Special)", textJpEn: "While falling after using the move, input down to close the umbrella and up to open it again. With the umbrella closed, the fall speed is faster.", titlePt: "Abrindo e Fechando o Peach Parasol (Especial Cima)", textPt: "Enquanto cai após usar o movimento, inpute baixo para fechar o guarda-chuva e cima para abri-lo novamente. Com o guarda-chuva fechado, a velocidade de queda é maior." },
  { titleEn: "[★★☆] Open and Shut Peach Parasol (Up Special)", titleJp: "ピーチパラソルとガケつかまり 【上必殺ワザ】", textJp: "パラソルを広げている間は、背中がガケに近づいてもつかまることができない。下を入力してパラソルを閉じていれば背中側のガケにつかまれる。", titleJpEn: "Peach Parasol and Ledge Grabs (Up Special)", textJpEn: "While the parasol is open, she can't grab a ledge even if her back gets close to it. If you input down to close the parasol, she can grab a ledge behind her.", titlePt: "Peach Parasol e Agarrar Bordas (Especial Cima)", textPt: "Enquanto o guarda-chuva está aberto, ela não consegue se agarrar a uma borda mesmo se suas costas se aproximarem dela. Se você inputar baixo para fechar o guarda-chuva, ela pode se agarrar a uma borda atrás dela." },
  { titleEn: "[★☆☆] Vegetable (Down Special)", titleJp: "野菜ひっこ抜き 【下必殺ワザ】", textJp: "ひっこ抜ける野菜の種類は全部で８種類あり、表情によって攻撃力が違う。しわくちゃ顔は特に強力で、はじき入力で投げればダメージが３０％を超える。", titleJpEn: "Vegetable (Down Special)", textJpEn: "There are eight total types of vegetables that can be pulled, each with different attack power based on its expression. The wrinkled-face one is especially powerful — throwing it with a flick input can deal over 30% damage.", titlePt: "Vegetal (Especial Baixo)", textPt: "Existem oito tipos totais de vegetais que podem ser arrancados, cada um com poder de ataque diferente baseado em sua expressão. O de rosto enrugado é especialmente poderoso — arremessá-lo com um input rápido pode causar mais de 30% de dano." },
  { titleEn: "[★★★] Rare \"Vegetables\" (Down Special)", titleJp: "レアな野菜ひっこ抜き 【下必殺ワザ】", textJp: "ごくまれに野菜ではなくボムへいやどせいさんをひっこ抜くことがある。ボムへいは２５０分の１、どせいさんは１６６分の１の確率。", titleJpEn: "Rare Vegetables (Down Special)", textJpEn: "Very rarely, she pulls out a Bob-omb or Mr. Saturn instead of a vegetable. The chance is 1 in 250 for a Bob-omb and 1 in 166 for Mr. Saturn.", titlePt: "Vegetais Raros (Especial Baixo)", textPt: "Muito raramente, ela arranca um Bob-omb ou um Mr. Saturn em vez de um vegetal. A chance é de 1 em 250 para o Bob-omb e 1 em 166 para o Mr. Saturn." },
  { titleEn: "[★☆☆] Peach Blossom (Final Smash)", titleJp: "ピーチブラッサム 【最後の切りふだ】", textJp: "魅惑のダンスで周りの相手を深い眠りに誘い、回復アイテムの桃を３個出現させる。さらにダメージも与える。相手との距離が近いほど、効果が大きくなる。", titleJpEn: "Peach Blossom (Final Smash)", textJpEn: "A captivating dance lulls nearby opponents into a deep sleep and spawns three Peach items for healing. It also deals damage — the closer the opponent, the greater the effect.", titlePt: "Peach Blossom (Final Smash)", textPt: "Uma dança cativante embala os adversários próximos em um sono profundo e gera três itens Pêssego para cura. Também causa dano — quanto mais perto o adversário, maior o efeito." },
  { titleEn: "[★☆☆] Diverse Weapons (Side Smash Attack)", titleJp: "道具の使い分け 【横スマッシュ攻撃】", textJp: "横スマッシュ攻撃時、上下にスティック入力することで、道具を使い分ける。上でフライパン、下でテニスラケット、入力なしでゴルフクラブとなる。", titleJpEn: "Choosing Tools (Side Smash Attack)", textJpEn: "During a side smash attack, inputting up or down on the stick selects which tool to use. Up gives the frying pan, down gives the tennis racket, and no input gives the golf club.", titlePt: "Escolhendo Ferramentas (Ataque Smash Lateral)", textPt: "Durante um ataque smash lateral, inputar cima ou baixo no analógico seleciona qual ferramenta usar. Cima dá a frigideira, baixo dá a raquete de tênis, e sem input dá o taco de golfe." },
  { titleEn: "[★★☆] A Tool for Every Job (Side Smash Attack)", titleJp: "道具の特徴 【横スマッシュ攻撃】", textJp: "フライパンはダメージが大きく、テニスラケットは低めにふっとばす。ゴルフクラブはワザのリーチが長い。", titleJpEn: "Tool Characteristics (Side Smash Attack)", textJpEn: "The frying pan deals high damage, the tennis racket launches opponents at a lower angle, and the golf club has a long reach.", titlePt: "Características das Ferramentas (Ataque Smash Lateral)", textPt: "A frigideira causa alto dano, a raquete de tênis arremessa os adversários em um ângulo mais baixo, e o taco de golfe tem um alcance longo." },
  { titleEn: "[★★☆] Ribbon Dance (Up Smash)", titleJp: "リボンダンス 【上スマッシュ攻撃】", textJp: "真上に向かって、強烈な一撃をくり出す。上にいる相手だけでなく、地上で密着した相手にも当てられる。", titleJpEn: "Ribbon Dance (Up Smash)", textJpEn: "Delivers a powerful strike straight upward. It can hit not only opponents above but also grounded opponents pressed right against her.", titlePt: "Ribbon Dance (Smash Cima)", textPt: "Entrega um golpe poderoso diretamente para cima. Pode acertar não apenas adversários acima, mas também adversários no chão bem próximos a ela." },
  { titleEn: "[★☆☆] Attacking with Toad (Grab)", titleJp: "キノピオも攻撃 【つかみ】", textJp: "つかみを成功させると、ピーチ姫を守っている「キノピオ」が出現。つかみ攻撃や投げる前に、ピーチ姫と息の合ったコンビネーション攻撃を見せる。", titleJpEn: "Toad Attacks Too (Grab)", textJpEn: "On a successful grab, \"Toad,\" who protects Princess Peach, appears. Before the grab attack or throw, he and Peach perform a well-coordinated combination attack.", titlePt: "O Toad Também Ataca (Agarrão)", textPt: "Ao conseguir um agarrão com sucesso, o \"Toad\", que protege a Princesa Peach, aparece. Antes do ataque de agarrão ou arremesso, ele e a Peach realizam um ataque combinado bem coordenado." },
  { titleEn: "[★☆☆] Gliding", titleJp: "浮遊", textJp: "ジャンプを入力し続けると、空中浮遊することができる。浮遊しながら攻撃することも可能。", titleJpEn: "Floating", textJpEn: "Holding the jump input lets her float in the air. She can also attack while floating.", titlePt: "Flutuação", textPt: "Segurar o input de pulo permite que ela flutue no ar. Ela também pode atacar enquanto flutua." },
  { titleEn: "[★★★] Low Gliding", titleJp: "超低空浮遊", textJp: "しゃがみ中にジャンプボタンを押し続けると、地面スレスレを浮遊する。空中攻撃を超低空で出せるので、攻撃の幅が広がる。", titleJpEn: "Ultra-Low Floating", textJpEn: "Holding the jump button while crouching lets her float just barely above the ground. This lets her use aerial attacks at an extremely low height, widening her attacking options.", titlePt: "Flutuação Ultra-Baixa", textPt: "Segurar o botão de pulo enquanto agachada permite que ela flutue bem rente ao chão. Isso permite usar ataques aéreos em uma altura extremamente baixa, ampliando suas opções de ataque." },
  { titleEn: "[★☆☆] Floating with Vegetables", titleJp: "野菜を持って浮遊", textJp: "浮遊中は、アイテムを持った状態でも、アイテムを投げずに空中攻撃できる。「野菜ひっこ抜き」と組み合わせることで、戦いの幅を広げられる。", titleJpEn: "Floating While Holding a Vegetable", textJpEn: "While floating, she can perform aerial attacks even while holding an item, without throwing it. Combining this with Vegetable widens her tactical options in battle.", titlePt: "Flutuando com um Vegetal", textPt: "Enquanto flutua, ela pode realizar ataques aéreos mesmo segurando um item, sem arremessá-lo. Combinar isso com o Vegetal amplia suas opções táticas na batalha." },
];

async function main() {
  const peach = await db.fighter.findFirst({
    where: { name: "Peach" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!peach) { console.log("Peach not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: peach.id },
    data: {
      curatorOverviewEn: "Princess Peach brings elegance and unpredictability to Smash Bros. — her signature Float lets her control the air like no one else, while her random-item Side Smash and vegetable-pulling Down Special keep opponents guessing. She rewards patient, technical players who use her mobility to dictate the pace of a match rather than trading blows head-on.",
      curatorOverviewPt: "A Princesa Peach traz elegância e imprevisibilidade ao Smash Bros. — sua Flutuação característica lhe dá controle do ar como ninguém, enquanto seu Smash Lateral com item aleatório e seu Especial Baixo de arrancar vegetais mantêm os adversários no escuro. Ela recompensa jogadores pacientes e técnicos que usam sua mobilidade para ditar o ritmo da partida em vez de trocar golpes diretamente.",
      curatorOverviewJp: "ピーチ姫はスマブラに優雅さと予測不能性をもたらす――代名詞の「空中浮遊」で誰よりも空を制し、ランダムな道具を使う横スマッシュや野菜をひっこ抜く下必殺ワザが相手を惑わせる。真っ向勝負を避け、機動力で試合のペースを支配する、忍耐強くテクニカルなプレイヤーに適したファイターだ。",
      curatorOverviewJpEn: "Princess Peach brings elegance and unpredictability to Smash Bros. — her signature Floating gives her control of the air like no other, while her random-tool side smash and vegetable-pulling down special keep opponents guessing. She's suited for patient, technical players who dictate the pace of a match with mobility rather than trading blows head-on.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = peach.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 4562-4595 -> 120-136 (02:00-02:16 ZoomZike VLC confirmed)
  const bioSsbm = peach.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 120, videoEndSec: 136 } });
    console.log("✅ Bio SSBM video: 4562-4595 -> 120-136 (02:00-02:16)");
  }

  // Fix Trophy "Peach" SSBM to match (was 119-136)
  const trophy = await db.collectible.findFirst({ where: { name: "Peach", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true } });
  if (trophy) {
    await db.collectible.update({ where: { id: trophy.id }, data: { videoStartSec: 120, videoEndSec: 136 } });
    console.log("✅ Trophy Peach SSBM: 119-136 -> 120-136");
  }

  // Moves EN+PT+JpEn
  for (const m of peach.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = peach.tips.find(t => t.titleEn === data.titleEn);
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
