import { db } from "../../lib/db";

const SSBM_BIO_JP = "リンクのこどもの時の姿。リンクが青年の姿で出る作品はあまり多くなく、むしろこどもの姿のほうが本当のリンクと言える。「時のオカリナ」では、マスターソードを使うには無理がある身の丈だったが、時の神殿の力により7年の時を超え、立派な青年になって正当な所持者となる。";
const SSBM_BIO_JPEN = "The form of Link during his childhood. There aren't many games where Link appears as a young adult — the child form could even be considered the \"true\" Link. In \"Ocarina of Time,\" his body was too small to properly wield the Master Sword, but through the power of the Temple of Time, he crosses seven years to become a proper young adult and its rightful wielder.";
const SSBM_BIO_PT = "A encarnação mais jovem do Link é frequentemente considerada o verdadeiro Link: ele era um garoto no primeiríssimo jogo de The Legend of Zelda, e apareceu como jovem na maioria dos jogos subsequentes. Desde seu debut no NES original em 1987, a aparência do Link mudou repetidamente, cada vez acrescentando ao mistério de sua história incomparável.";

const SSBU_BIO_PT = "Young Link (こどもリンク, Young Link) é um personagem jogável em Super Smash Bros. Ultimate. Ele foi oficialmente confirmado como jogável junto com seu sucessor Toon Link e o restante do elenco de retorno em 12 de junho de 2018. Embora as mudanças feitas no Link não fossem suficientes para alterar o status do Young Link como um clone, ele não é classificado como um Echo Fighter. Como tal, Young Link é classificado como Lutador #22.";
const SSBU_BIO_JPEN = "Young Link is a character who appears in \"The Legend of Zelda\" series, given this name in \"Super Smash Bros. Melee\" to distinguish him from the adult Link. Here, it refers to the Link from \"The Legend of Zelda: Ocarina of Time\" and \"The Legend of Zelda: Majora's Mask.\"";

const MOVES = [
  {
    order: 0,
    descJp: "リンクよりもふっとびやすく、コキリの剣使用時の攻撃力はやはり低め。しかし装備の軽さにより、リンク最大の弱点であるフットワークが軽やかになっている。小ささとあいまって、リンクと異なる個性がある。やや上級者向け。”ブーメラン”は、リンクよりも誘導性が高まっている。 B:炎の弓矢 横+B:ブーメラン",
    descEn: "He's more prone to being launched than Link, and his attack power with the Kokiri Sword is also somewhat low. However, thanks to his lighter equipment, his footwork — Link's greatest weakness — becomes much lighter. Combined with his small size, he has a distinct personality from Link. Somewhat suited for advanced players. Boomerang has better homing than Link's version. B: Fire Arrow, Side+B: Boomerang",
    descPt: "Ele é mais propenso a ser arremessado do que o Link, e seu poder de ataque com a Kokiri Sword também é um pouco baixo. Porém, graças ao seu equipamento mais leve, seu jogo de pés — a maior fraqueza do Link — se torna muito mais ágil. Combinado com seu tamanho pequeno, ele tem uma personalidade distinta do Link. Um tanto adequado para jogadores avançados. O Boomerang tem uma melhor perseguição do que a versão do Link. B: Fire Arrow, Lateral+B: Boomerang",
  },
  {
    order: 1,
    descJp: "身軽なため、三角飛びも使える。三角飛びは、空中でカベにぶつかった時に反対方向にスティックをはじくと使える。”ターゲットをこわせ!!”で思うぞんぶん練習できる。”回転斬り”は、地上でも連続ヒットするようになった。”爆弾”も、目立たないが連続ヒットしている。 上B:回転斬り 下+B:爆弾",
    descEn: "Being nimble, he can also use wall jumps. Wall jumps can be used by flicking the stick in the opposite direction when hitting a wall in the air. You can practice this to your heart's content in \"Break the Targets!!\" Spin Attack now hits multiple times even on the ground. Bomb also hits multiple times, though it's not very noticeable. Up+B: Spin Attack, Down+B: Bomb",
    descPt: "Por ser ágil, ele também pode usar saltos de parede. Saltos de parede podem ser usados balançando o analógico na direção oposta ao atingir uma parede no ar. Você pode praticar isso à vontade em \"Break the Targets!!\" O Spin Attack agora acerta múltiplas vezes mesmo no chão. O Bomb também acerta múltiplas vezes, embora não seja muito perceptível. Cima+B: Spin Attack, Baixo+B: Bomb",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Young Link's Origins", titleJp: "こどもリンクの初登場作品", textJp: "こどもリンクの初登場は、１９９８年発売の『ゼルダの伝説 時のオカリナ』。コキリの森に住む少年。森の守り神デクの樹よりハイラルに迫る危機を知らされる。", titleJpEn: "Young Link's Origins", textJpEn: "Young Link's debut was in \"The Legend of Zelda: Ocarina of Time,\" released in 1998. A boy living in Kokiri Forest, he learns of a crisis threatening Hyrule from the Great Deku Tree, the forest's guardian spirit.", titlePt: "As Origens do Young Link", textPt: "O debut do Young Link foi em \"The Legend of Zelda: Ocarina of Time,\" lançado em 1998. Um garoto que vive na Floresta Kokiri, ele descobre sobre uma crise ameaçando Hyrule através da Grande Árvore Deku, o espírito guardião da floresta." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "魔盗賊ガノンドロフの野望を阻止するため、妖精ナビィと共に冒険に出る。マスターソードを抜き、７年間の眠りについた後、「時の勇者」として覚醒する。", titleJpEn: "In His Series", textJpEn: "He sets out on an adventure together with the fairy Navi to stop the ambitions of the thief-sorcerer Ganondorf. After pulling the Master Sword and sleeping for seven years, he awakens as the \"Hero of Time.\"", titlePt: "Na Série Original", textPt: "Ele parte em uma aventura junto com a fada Navi para deter as ambições do ladrão-feiticeiro Ganondorf. Após puxar a Master Sword e dormir por sete anos, ele desperta como o \"Herói do Tempo.\"" },
  { titleEn: "[★☆☆] Fire Arrow (Neutral Special)", titleJp: "炎の弓矢 【通常必殺ワザ】", textJp: "こどもリンクが放つ矢は、ヒットした対象を燃やす効果がある。アイテムの火薬箱を離れた場所から爆発させるなど、便利に使える。", titleJpEn: "Fire Arrow (Neutral Special)", textJpEn: "The arrow Young Link fires has the effect of setting whatever it hits on fire. It's useful for things like detonating a Crate from a distance.", titlePt: "Fire Arrow (Especial Neutro)", textPt: "A flecha que o Young Link dispara tem o efeito de incendiar o que atinge. É útil para coisas como detonar um Barril de Pólvora à distância." },
  { titleEn: "[★☆☆] Boomerang (Side Special)", titleJp: "ブーメラン 【横必殺ワザ】", textJp: "戻って来る時にも攻撃が当たるため、相手の動きを封じるのに役立つ。ちなみに、こどもリンクが使うブーメランは『時のオカリナ』時代のもの。", titleJpEn: "Boomerang (Side Special)", textJpEn: "Since it also deals damage on the way back, it's useful for restricting an opponent's movement. Incidentally, the boomerang Young Link uses is the one from the \"Ocarina of Time\" era.", titlePt: "Boomerang (Especial Lateral)", textPt: "Como também causa dano no caminho de volta, é útil para restringir o movimento de um adversário. A propósito, o bumerangue que o Young Link usa é o da era de \"Ocarina of Time.\"" },
  { titleEn: "[★☆☆] Boomerang's Flight Distance (Side Special)", titleJp: "ブーメランの飛距離 【横必殺ワザ】", textJp: "スティックを倒す強さに応じて飛距離が変わるが、リンクの中では一番短い。その分、投げる瞬間のダメージが高いという特徴がある。", titleJpEn: "Boomerang's Flight Distance (Side Special)", textJpEn: "The travel distance changes depending on how far the stick is tilted, but it's the shortest among the Links. In exchange, it deals higher damage at the moment of throwing.", titlePt: "A Distância do Boomerang (Especial Lateral)", textPt: "A distância percorrida muda dependendo de quanto o analógico é inclinado, mas é a mais curta entre os Links. Em troca, causa mais dano no momento do arremesso." },
  { titleEn: "[★☆☆] Spin Attack (Up Special)", titleJp: "回転斬り 【上必殺ワザ】", textJp: "回転しながら、連続ヒットで相手を巻き込む。地上では、ボタン長押しで攻撃力が増す。ふっとばし力は低いがスキが少ないため、空中攻撃でコンボを狙える。", titleJpEn: "Spin Attack (Up Special)", textJpEn: "Spins while catching opponents with multiple hits. On the ground, holding the button increases its attack power. Its knockback is low, but with a small opening, it can be used to go for aerial combos.", titlePt: "Spin Attack (Especial Cima)", textPt: "Gira enquanto pega os adversários com múltiplos golpes. No chão, segurar o botão aumenta seu poder de ataque. Seu arremesso é baixo, mas com uma pequena abertura, pode ser usado para buscar combos aéreos." },
  { titleEn: "[★☆☆] Bomb (Down Special)", titleJp: "爆弾 【下必殺ワザ】", textJp: "投げつけた爆弾に巻き込まれたファイターは、最大４回ヒットする。連続ヒットする分、リンクやトゥーンリンクと比べて与えるダメージが高くなる。", titleJpEn: "Bomb (Down Special)", textJpEn: "A fighter caught by a thrown bomb can be hit up to four times. Because of the multiple hits, it deals more total damage compared to Link's or Toon Link's version.", titlePt: "Bomb (Especial Baixo)", textPt: "Um lutador pego por uma bomba arremessada pode ser atingido até quatro vezes. Por causa dos múltiplos golpes, causa mais dano total comparado à versão do Link ou do Toon Link." },
  { titleEn: "[★☆☆] Bomb Blast (Down Special)", titleJp: "爆弾の爆風 【下必殺ワザ】", textJp: "爆弾を相手に直接ぶつけたとき、その爆風には自分は当たらない。至近距離で投げつけても大丈夫。", titleJpEn: "Bomb Blast (Down Special)", textJpEn: "When a bomb directly hits an opponent, he isn't caught by the resulting blast himself. It's safe to throw it even at point-blank range.", titlePt: "Explosão da Bomb (Especial Baixo)", textPt: "Quando uma bomba atinge diretamente um adversário, ele mesmo não é pego pela explosão resultante. É seguro arremessá-la mesmo à queima-roupa." },
  { titleEn: "[★☆☆] Triforce Slash (Final Smash)", titleJp: "トライフォースラッシュ 【最後の切りふだ】", textJp: "左手から放つトライフォースの力がヒットすると、拘束して連続で斬りつける。フィニッシュで周りの相手を巻き込むことができる。", titleJpEn: "Triforce Slash (Final Smash)", textJpEn: "If the power of the Triforce released from his left hand hits an opponent, it binds them and repeatedly slashes them. The finishing blow can catch nearby opponents as well.", titlePt: "Triforce Slash (Final Smash)", textPt: "Se o poder da Triforce liberado da mão esquerda dele acertar um adversário, ele o prende e o corta repetidamente. O golpe final também pode pegar adversários próximos." },
  { titleEn: "[★★☆] Down Taunt", titleJp: "下アピール", textJp: "飲んでいるのは、ロンロン牧場名物の「ロンロン牛乳」。原作と違って、飲み干してもダメージは回復しない。", titleJpEn: "Down Taunt", textJpEn: "What he's drinking is \"Lon Lon Milk,\" the specialty of Lon Lon Ranch. Unlike in the original game, drinking it doesn't heal any damage.", titlePt: "Provocação Baixo", textPt: "O que ele está bebendo é o \"Leite Lon Lon,\" a especialidade do Rancho Lon Lon. Diferente do jogo original, bebê-lo não cura nenhum dano." },
  { titleEn: "[★☆☆] Differences from Other Links", titleJp: "他のリンクとの違い", textJp: "リンクの中では、ふっとばし力が低めなので、コンボを繋げやすい。空中での動きやワザの出が速く、着地後のスキも少ない。唯一、百裂攻撃ができる。", titleJpEn: "Differences from Other Links", textJpEn: "Among the Links, his knockback power is on the lower side, making it easier to chain combos. His aerial movement and move speed are fast, and he has a smaller opening after landing. He's the only one who can perform a rapid-hit combo attack.", titlePt: "Diferenças em Relação aos Outros Links", textPt: "Entre os Links, seu poder de arremesso é relativamente baixo, tornando mais fácil encadear combos. Seu movimento aéreo e velocidade de golpes são rápidos, e ele tem uma abertura menor após pousar. Ele é o único que pode realizar um ataque de combo de golpes rápidos." },
];

async function main() {
  const yl = await db.fighter.findFirst({
    where: { name: "Young Link" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!yl) { console.log("Young Link not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: yl.id },
    data: {
      curatorOverviewEn: "Young Link, the childhood incarnation of Hyrule's hero, is often considered the 'true' Link — appearing in most games in the series. In Smash, he trades Link's power for exceptional lightness and speed: quicker aerials, a fire-tipped arrow, a farther-homing boomerang, and a rare multi-hit jab. Less prone to launching but hitting for less, he rewards aggressive, combo-focused players over Link's heavier, more deliberate style.",
      curatorOverviewPt: "Young Link, a encarnação infantil do herói de Hyrule, é frequentemente considerado o Link 'verdadeiro' — aparecendo na maioria dos jogos da série. No Smash, ele troca o poder do Link por leveza e velocidade excepcionais: ataques aéreos mais rápidos, uma flecha em chamas, um bumerangue com melhor perseguição, e um raro soco de múltiplos golpes. Menos propenso a ser arremessado, mas batendo com menos força, ele recompensa jogadores agressivos e focados em combos, em vez do estilo mais pesado e deliberado do Link.",
      curatorOverviewJp: "ハイラルの勇者の少年時代の姿であるこどもリンクは、シリーズのほとんどの作品に登場することから、しばしば『本物の』リンクとみなされる。スマブラでは、リンクの威力の代わりに、卓越した軽さとスピードを手に入れた――より速い空中ワザ、炎をまとった矢、誘導性の高いブーメラン、そして貴重な百裂攻撃を持つ。ふっとばされにくい反面、与えるダメージは少なめで、リンクの重厚で慎重なスタイルとは対照的に、攻撃的でコンボ重視のプレイヤーに応えるファイターだ。",
      curatorOverviewJpEn: "Young Link, the childhood form of Hyrule's hero, is often considered the 'true' Link since he appears in most games in the series. In Smash, he trades Link's power for exceptional lightness and speed — faster aerials, a fire-imbued arrow, a boomerang with better homing, and a rare rapid-jab attack. Harder to launch but hitting for less, he suits aggressive, combo-focused players in contrast to Link's heavier, more deliberate style.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Fix Bio SSBM: add JP + JpEn, replace messy markdown PT with clean translation
  const bioSsbm = yl.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({
      where: { id: bioSsbm.id },
      data: { contentJp: SSBM_BIO_JP, contentJpEn: SSBM_BIO_JPEN, contentPt: SSBM_BIO_PT },
    });
    console.log("✅ Bio SSBM: JP adicionado + JpEn + PT corrigido (removido markdown)");
  }

  // Bio SSBU: add PT + JpEn
  const bioSsbu = yl.bios.find(b => b.smashGameVersion === "SSBU");
  if (bioSsbu) {
    await db.fighterBio.update({
      where: { id: bioSsbu.id },
      data: { contentPt: SSBU_BIO_PT, contentJpEn: SSBU_BIO_JPEN },
    });
    console.log("✅ Bio SSBU: PT+JpEn adicionados");
  }

  // Create the 2 missing SSBM moves (scrape gap -- 0 FighterMove records existed)
  for (const m of MOVES) {
    await db.fighterMove.create({
      data: {
        fighterId: yl.id,
        smashGameVersion: "SSBM",
        label: "SMASH",
        order: m.order,
        descJp: m.descJp,
        descEn: m.descEn,
        descPt: m.descPt,
        descJpEn: m.descEn,
      },
    });
    console.log(`✅ Move [SSBM] SMASH order ${m.order} criada (não existia)`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = yl.tips.find(t => t.titleEn === data.titleEn);
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
