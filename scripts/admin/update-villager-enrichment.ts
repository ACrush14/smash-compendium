import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "An energetic boy who came from \"Animal Crossing.\" He lived a leisurely life in a village far removed from fighting, but joins Smash Bros. starting with this title. His cheerful smile is memorable, but he has a surprisingly powerful set of moves, like dropping bowling balls or hitting opponents with felled trees. \"Balloon Trip,\" which offers excellent recovery, lets him soar through the sky just like in \"Balloon Fight.\"",
    pt: "Um garoto cheio de energia vindo de \"Animal Crossing.\" Ele vivia uma vida tranquila em uma vila bem distante de qualquer luta, mas se junta à Smash Bros. a partir deste título. Seu sorriso alegre é marcante, mas ele tem um arsenal surpreendentemente poderoso, como derrubar bolas de boliche ou acertar adversários com árvores derrubadas. \"Balloon Trip,\" que oferece uma excelente recuperação, o faz voar pelo céu assim como em \"Balloon Fight.\"",
  },
  SSBU: {
    jpEn: "Villager is the player character in the \"Animal Crossing\" series, a general name given to them in \"Super Smash Bros. for Nintendo 3DS / Wii U.\"",
    pt: "Villager é o personagem jogável da série \"Animal Crossing,\" um nome geral dado a eles em \"Super Smash Bros. for Nintendo 3DS / Wii U.\"",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Villager's Origins", titleJp: "むらびとの初登場作品", textJp: "むらびとの初登場作品は、２００１年発売の『どうぶつの森』。どうぶつが住む村で自由気ままに暮らす、ふつうの人。", titleJpEn: "Villager's Origins", textJpEn: "Villager's debut was in \"Animal Crossing,\" released in 2001. An ordinary person living a carefree life in a village inhabited by animals.", titlePt: "As Origens do Villager", textPt: "O debut do Villager foi em \"Animal Crossing,\" lançado em 2001. Uma pessoa comum vivendo uma vida despreocupada em uma vila habitada por animais." },
  { titleEn: "[★☆☆] In Their Series", titleJp: "原作では", textJp: "『どうぶつの森』の主人公。どうぶつたちの住む世界で、自由なスローライフを送る。住民のどうぶつたちがしゃべるのは、「どうぶつ語」という独自の言葉。", titleJpEn: "In Their Series", textJpEn: "The protagonist of \"Animal Crossing.\" They lead a free, slow-paced life in a world inhabited by animals. The animal residents speak their own unique language called \"Animalese.\"", titlePt: "Na Série Original", textPt: "O protagonista de \"Animal Crossing.\" Eles levam uma vida livre e tranquila em um mundo habitado por animais. Os moradores animais falam sua própria língua única chamada \"Animalês.\"" },
  { titleEn: "[★☆☆] Pocket (Neutral Special)", titleJp: "しまう / とり出す 【通常必殺ワザ】", textJp: "アイテムや相手の飛び道具をポケットにしまうことができる。必殺ワザボタンを押すと、しまったモノをとり出す。", titleJpEn: "Pocket (Neutral Special)", textJpEn: "Can stow items or an opponent's projectiles into their pocket. Pressing the special move button takes out the stowed item.", titlePt: "Pocket (Especial Neutro)", textPt: "Pode guardar itens ou projéteis do adversário no bolso. Apertar o botão de golpe especial retira o item guardado." },
  { titleEn: "[★☆☆] Lloid Rocket (Side Special)", titleJp: "ハニワくんロケット 【横必殺ワザ】", textJp: "ワザが発動する時にボタンを押したままにすると、ハニワくんロケットに乗ることができる。", titleJpEn: "Lloid Rocket (Side Special)", textJpEn: "Holding the button when the move activates lets them ride the Lloid Rocket.", titlePt: "Lloid Rocket (Especial Lateral)", textPt: "Segurar o botão quando o golpe é ativado permite montar no Lloid Rocket." },
  { titleEn: "[★★☆] Lloid Rocket's Power (Side Special)", titleJp: "ハニワくんロケットの威力 【横必殺ワザ】", textJp: "ハニワくんロケットに乗っていると、威力が高くなる。さらに、ボタンを押すといつでも降りることができる。", titleJpEn: "Lloid Rocket's Power (Side Special)", textJpEn: "Riding the Lloid Rocket increases its power. Also, pressing the button lets them get off at any time.", titlePt: "O Poder do Lloid Rocket (Especial Lateral)", textPt: "Montar no Lloid Rocket aumenta seu poder. Além disso, apertar o botão permite descer a qualquer momento." },
  { titleEn: "[★☆☆] Balloon Trip (Up Special)", titleJp: "バルーントリップ 【上必殺ワザ】", textJp: "むらびとの上必殺ワザ「バルーントリップ」の名前の由来は、１９８５年にファミコンで発売された『バルーンファイト』のモード名。", titleJpEn: "Balloon Trip (Up Special)", textJpEn: "The name of Villager's up special \"Balloon Trip\" comes from the mode name in \"Balloon Fight,\" released for the Famicom in 1985.", titlePt: "Balloon Trip (Especial Cima)", textPt: "O nome do especial cima do Villager, \"Balloon Trip,\" vem do nome do modo em \"Balloon Fight,\" lançado para o Famicom em 1985." },
  { titleEn: "[★☆☆] Balloon Trip's Balloons (Up Special)", titleJp: "バルーントリップの風船 【上必殺ワザ】", textJp: "風船に攻撃が当たると割れてしまう。１個割れると上昇力が弱まり、２個とも割れると落下する。", titleJpEn: "Balloon Trip's Balloons (Up Special)", textJpEn: "If an attack hits the balloons, they pop. Popping one weakens the rising force, and popping both causes them to fall.", titlePt: "Os Balões do Balloon Trip (Especial Cima)", textPt: "Se um ataque atingir os balões, eles estouram. Estourar um enfraquece a força de subida, e estourar os dois faz cair." },
  { titleEn: "[★☆☆] Timber (Down Special)", titleJp: "タネ植え / 水やり / 伐採 【下必殺ワザ】", textJp: "タネ植え、水やり、伐採、という３段階のワザ。タネ植えは地上でしか成功せず、失敗するとスキが大きいので注意。", titleJpEn: "Timber (Down Special)", textJpEn: "A three-stage move: planting a seed, watering it, and felling the tree. Planting only succeeds on the ground, and failing creates a large opening, so be careful.", titlePt: "Timber (Especial Baixo)", textPt: "Um golpe de três estágios: plantar uma semente, regá-la e derrubar a árvore. Plantar só é bem-sucedido no chão, e falhar cria uma grande abertura, então cuidado." },
  { titleEn: "[★★☆] Timber Techniques (Down Special)", titleJp: "タネ植え / 水やり / 伐採のテクニック 【下必殺ワザ】", textJp: "ジョウロで水をまいている間も横方向に移動することができる。また、他のむらびとが植えた芽や木にも、水やりや伐採をすることが可能。", titleJpEn: "Timber Techniques (Down Special)", textJpEn: "They can move sideways even while watering with the watering can. It's also possible to water or fell sprouts and trees planted by other Villagers.", titlePt: "Técnicas do Timber (Especial Baixo)", textPt: "Eles podem se mover lateralmente mesmo enquanto regam com o regador. Também é possível regar ou derrubar brotos e árvores plantados por outros Villagers." },
  { titleEn: "[★★☆] Timber (Down Special)", titleJp: "伐採 【下必殺ワザ】", textJp: "オノの一撃は結構強い。木を出しておいて、オノを使いこなすのもアリ。", titleJpEn: "Felling Trees (Down Special)", textJpEn: "A hit from the axe is quite strong. Leaving a tree standing and mastering the axe is also a viable option.", titlePt: "Derrubando Árvores (Especial Baixo)", textPt: "Um golpe do machado é bem forte. Deixar uma árvore em pé e dominar o uso do machado também é uma opção viável." },
  { titleEn: "[★☆☆] If a Tree Falls in a Battle... (Down Special)", titleJp: "伐採した木で攻撃 【下必殺ワザ】", textJp: "切り倒した木を相手に当てると大ダメージ。倒れた木から飛び出してくる木材は、拾って投げれば飛び道具に。", titleJpEn: "If a Tree Falls in a Battle... (Down Special)", textJpEn: "Hitting an opponent with a felled tree deals big damage. The lumber that flies out from a fallen tree can be picked up and thrown as a projectile.", titlePt: "Se uma Árvore Cai em uma Batalha... (Especial Baixo)", textPt: "Acertar um adversário com uma árvore derrubada causa muito dano. A madeira que sai voando de uma árvore caída pode ser pega e arremessada como um projétil." },
  { titleEn: "[★☆☆] Dream Home (Final Smash)", titleJp: "ゆめのマイハウス 【最後の切りふだ】", textJp: "たぬきちが駆けつけ、相手を囲む家をテキパキと建てる。よく見ると、むらびとがたぬきちに「ベル」を渡しているのがわかる。", titleJpEn: "Dream Home (Final Smash)", textJpEn: "Tom Nook rushes in and briskly builds a house around the opponent. If you look closely, you can see Villager handing Tom Nook \"Bells.\"", titlePt: "Dream Home (Final Smash)", textPt: "Tom Nook corre até lá e constrói rapidamente uma casa ao redor do adversário. Se você olhar de perto, pode ver o Villager entregando \"Bells\" ao Tom Nook." },
  { titleEn: "[★★☆] Bowling Ball (Side Smash Attack)", titleJp: "ボウリングのたま 【横スマッシュ攻撃】", textJp: "相手より上のガケ際に立ち、ガケの外側に向かって使えば、ボウリング玉を真下に落ちる飛び道具のように使うこともできる。", titleJpEn: "Bowling Ball (Side Smash Attack)", textJpEn: "Standing at a ledge above an opponent and using it toward the edge can turn the bowling ball into a projectile that drops straight down.", titlePt: "Bowling Ball (Ataque Smash Lateral)", textPt: "Ficar em pé em uma borda acima de um adversário e usá-lo em direção à borda pode transformar a bola de boliche em um projétil que cai diretamente para baixo." },
  { titleEn: "[★☆☆] Dig (Down Smash Attack)", titleJp: "穴ほり 【下スマッシュ攻撃】", textJp: "前後をスコップで攻撃し、ヒットした相手を地面に埋める。埋めた後は、強力な攻撃を当てるチャンス。", titleJpEn: "Dig (Down Smash Attack)", textJpEn: "Attacks forward and back with a shovel, burying any opponent it hits in the ground. After burying them, there's a chance to land a powerful attack.", titlePt: "Dig (Ataque Smash Baixo)", textPt: "Ataca para frente e para trás com uma pá, enterrando qualquer adversário que atinge no chão. Depois de enterrar, há uma chance de acertar um golpe poderoso." },
  { titleEn: "[★★★] Downward Turnips (Down Air Attack)", titleJp: "下カブ 【下空中攻撃】", textJp: "カブの数は１～３個でランダム。カブが多いほどダメージも大きくなり、メテオ効果も強くなる。", titleJpEn: "Downward Turnips (Down Air Attack)", textJpEn: "The number of turnips is random, from 1 to 3. The more turnips, the greater the damage and the stronger the meteor effect.", titlePt: "Downward Turnips (Ataque Aéreo Baixo)", textPt: "O número de nabos é aleatório, de 1 a 3. Quanto mais nabos, maior o dano e mais forte o efeito de meteoro." },
  { titleEn: "[★☆☆] Net (Grab)", titleJp: "あみ締め 【つかみ】", textJp: "アイテムにむしあみをかぶせると、しまうことができる。しまったアイテムは、必殺ワザボタンで取り出せる。", titleJpEn: "Net (Grab)", textJpEn: "Covering an item with the bug net lets them stow it away. Stowed items can be taken out with the special move button.", titlePt: "Net (Agarrão)", textPt: "Cobrir um item com a rede de insetos permite guardá-lo. Itens guardados podem ser retirados com o botão de golpe especial." },
];

async function main() {
  const villager = await db.fighter.findFirst({
    where: { name: "Villager" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true }, orderBy: { id: "asc" } },
    },
  });
  if (!villager) { console.log("Villager not found"); return; }

  await db.fighter.update({
    where: { id: villager.id },
    data: {
      curatorOverviewEn: "Villager, the deceptively cheerful resident of Animal Crossing, hides a surprisingly deadly toolkit behind a friendly smile — Pocket steals items and even projectiles out of the air, Timber grows a tree that can be felled onto opponents for huge damage, and Lloid Rocket doubles as both an attack and a mobile mount. Balloon Trip offers excellent recovery, while a bowling ball dropped from a ledge becomes a lethal vertical projectile. Whimsical on the surface but calculated underneath, Villager rewards players who set up traps and punish opponents who wander into them.",
      curatorOverviewPt: "Villager, o morador enganosamente alegre de Animal Crossing, esconde um arsenal surpreendentemente mortal por trás de um sorriso amigável — Pocket rouba itens e até projéteis do ar, Timber faz crescer uma árvore que pode ser derrubada sobre adversários para muito dano, e Lloid Rocket funciona tanto como um ataque quanto uma montaria móvel. Balloon Trip oferece uma excelente recuperação, enquanto uma bola de boliche derrubada de uma borda se torna um projétil vertical letal. Divertido na superfície mas calculista por dentro, o Villager recompensa jogadores que preparam armadilhas e punem adversários que caem nelas.",
      curatorOverviewJp: "『どうぶつの森』の見た目に反して陽気な住人むらびとは、フレンドリーな笑顔の裏に驚くほど凶悪な戦法を隠し持っている――しまう/とり出すはアイテムや飛び道具さえも空中で奪い、タネ植え/水やり/伐採は木を育てて相手にぶつけ大ダメージを与え、ハニワくんロケットは攻撃とモバイルな乗り物を兼ねる。バルーントリップは優れた復帰を提供し、ガケから落とすボウリングのたまは致命的な縦の飛び道具になる。表面的には気まぐれだが内側では計算され尽くしたむらびとは、罠を仕掛けそこに迷い込んだ相手を罰するプレイヤーに応える。",
      curatorOverviewJpEn: "Villager, the deceptively cheerful resident of Animal Crossing, hides a surprisingly ruthless approach behind a friendly smile — Pocket steals items and even projectiles right out of the air, Timber grows a tree that can be felled onto opponents for massive damage, and Lloid Rocket doubles as both an attack and a mobile mount. Balloon Trip provides excellent recovery, while a bowling ball dropped from a ledge becomes a deadly vertical projectile. Whimsical on the surface but thoroughly calculated underneath, Villager rewards players who set traps and punish opponents who stumble into them.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = villager.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = villager.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "An ordinary girl who came from \"Animal Crossing.\" Using the neutral special, she carefully stows away items including boxes, and even incoming projectiles or beams. Stowed items can be used with the special move button. The down special involves planting a seed, watering it, and then felling the grown tree to deal damage. It's also possible to leave the tree standing and deal direct damage to an opponent with the axe. (N64) Animal Crossing (2001/04) (3DS) Animal Crossing: New Leaf (2012/11)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "Uma garota comum vinda de \"Animal Crossing.\" Usando o especial neutro, ela guarda cuidadosamente itens, incluindo caixas, e até projéteis ou raios recebidos. Itens guardados podem ser usados com o botão de golpe especial. O especial baixo envolve plantar uma semente, regá-la, e depois derrubar a árvore crescida para causar dano. Também é possível deixar a árvore em pé e causar dano direto em um adversário com o machado. (N64) Animal Crossing (2001/04) (3DS) Animal Crossing: New Leaf (2012/11)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // Tips — index-matched (2 duplicate "Timber (Down Special)" titles)
  if (villager.tips.length !== TIPS.length) {
    console.log(`⚠️ Mismatch: DB has ${villager.tips.length} tips, expected ${TIPS.length}`);
  } else {
    for (let i = 0; i < villager.tips.length; i++) {
      const tip = villager.tips[i];
      const data = TIPS[i];
      await db.fighterTip.update({
        where: { id: tip.id },
        data: { titleJp: data.titleJp, textJp: data.textJp, titleJpEn: data.titleJpEn, textJpEn: data.textJpEn, titlePt: data.titlePt, textPt: data.textPt },
      });
    }
    console.log(`✅ ${villager.tips.length}/${TIPS.length} tips atualizadas`);
  }

  await db.$disconnect();
}
main().catch(console.error);
