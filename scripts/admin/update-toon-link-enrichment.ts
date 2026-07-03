import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "Toon Link is a character who appears in the \"Legend of Zelda\" series, a name given to him in \"Super Smash Bros. Brawl.\" Here, it refers to the version of Link from \"The Legend of Zelda: The Wind Waker\" and similar titles.",
    pt: "Toon Link é um personagem que aparece na série \"The Legend of Zelda,\" um nome dado a ele em \"Super Smash Bros. Brawl.\" Aqui, refere-se à versão do Link de \"The Legend of Zelda: The Wind Waker\" e títulos semelhantes.",
  },
  SSBB: {
    jpEn: "The Link from \"The Wind Waker\" and \"Phantom Hourglass.\" He lived peacefully on Outset Island, but when his little sister was captured by a giant bird, he set off to rescue her. His large, cat-like eyes are striking, making his changes in expression easy to read. In \"The Wind Waker,\" he could cling to walls and crawl, among other actions. This green outfit is worn to celebrate a boy's 12th birthday, styled after the legendary hero.",
    pt: "O Link de \"The Wind Waker\" e \"Phantom Hourglass.\" Ele vivia pacificamente na Ilha Outset, mas quando sua irmã caçula foi capturada por um pássaro gigante, ele partiu para resgatá-la. Seus grandes olhos parecidos com os de um gato são marcantes, tornando fácil ler suas mudanças de expressão. Em \"The Wind Waker,\" ele conseguia se agarrar a paredes e rastejar, entre outras ações. Essa roupa verde é usada para celebrar o 12º aniversário de um menino, inspirada no herói lendário.",
  },
  SSB4: {
    jpEn: "A child version of Link drawn in a cartoon-like style, depicted in \"The Legend of Zelda: The Wind Waker\" and similar titles. Sometimes also called \"Cat-Eyed Link.\" In Smash Bros., he uses moves similar to the adult Link, but is a different type of fighter — smaller in size, faster when running, and doesn't use kicks. Take advantage of his quick movement and abundant projectiles to outmaneuver your opponents.",
    pt: "Uma versão criança do Link desenhada em um estilo cartunesco, retratada em \"The Legend of Zelda: The Wind Waker\" e títulos semelhantes. Às vezes também chamado de \"Link de Olhos de Gato.\" Em Smash Bros., ele usa golpes parecidos com os do Link adulto, mas é um tipo diferente de lutador — menor em tamanho, mais rápido ao correr, e não usa chutes. Aproveite seu movimento rápido e abundância de projéteis para superar seus adversários.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Toon Link's Origins", titleJp: "トゥーンリンクの初登場作品", textJp: "トゥーンリンクの初登場は２００２年発売の『ゼルダの伝説 風のタクト』。アニメ絵のようになり、これまでのリンクとは違う魅力が感じられる作品。", titleJpEn: "Toon Link's Origins", textJpEn: "Toon Link's debut was in \"The Legend of Zelda: The Wind Waker,\" released in 2002. A title with a cartoon-like art style that gave a different appeal from previous Links.", titlePt: "As Origens do Toon Link", textPt: "O debut do Toon Link foi em \"The Legend of Zelda: The Wind Waker,\" lançado em 2002. Um título com um estilo de arte cartunesco que trouxe um apelo diferente dos Links anteriores." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『ゼルダの伝説 風のタクト』は、プロロ島に住む少年リンクの誕生日から始まる。しゃべる船「赤獅子の王」に乗り、大海原を舞台に冒険をくり広げる。", titleJpEn: "In His Series", textJpEn: "\"The Legend of Zelda: The Wind Waker\" begins on the birthday of Link, a boy living on Outset Island. He sails on the talking ship \"King of Red Lions,\" adventuring across the great ocean.", titlePt: "Na Série Original", textPt: "\"The Legend of Zelda: The Wind Waker\" começa no aniversário do Link, um garoto que vive na Ilha Outset. Ele navega no navio falante \"King of Red Lions,\" aventurando-se pelo grande oceano." },
  { titleEn: "[★★☆] Hero's Bow (Neutral Special)", titleJp: "勇者の弓 【通常必殺ワザ】", textJp: "撃った後のスキが少ないため、連続攻撃をしかけやすい。空中で移動しながら撃てば、攻めにも守りにも使える。", titleJpEn: "Hero's Bow (Neutral Special)", textJpEn: "It has little opening after firing, making it easy to follow up with continuous attacks. Firing while moving in the air lets it be used for both offense and defense.", titlePt: "Hero's Bow (Especial Neutro)", textPt: "Tem pouca abertura depois de disparar, facilitando emendar ataques contínuos. Disparar enquanto se move no ar permite usá-lo tanto para ataque quanto para defesa." },
  { titleEn: "[★☆☆] Hero's Bow Techniques (Neutral Special)", titleJp: "勇者の弓のテクニック 【通常必殺ワザ】", textJp: "ためずに撃った矢はあまり遠くまで飛ばず、下降して地面に落ちる。わざとためずに撃って、下側を狙うこともできる。", titleJpEn: "Hero's Bow Techniques (Neutral Special)", textJpEn: "An arrow fired without charging doesn't travel far and descends to the ground. It can also be fired deliberately without charging to aim at a low target.", titlePt: "Técnicas do Hero's Bow (Especial Neutro)", textPt: "Uma flecha disparada sem carregar não voa longe e desce até o chão. Também pode ser disparada propositalmente sem carregar para mirar em um alvo baixo." },
  { titleEn: "[★☆☆] Boomerang (Side Special)", titleJp: "ブーメラン 【横必殺ワザ】", textJp: "もどってくる時は相手を貫通する攻撃になる。自分への誘導性能があるので、投げた後に上下に移動して、複数の相手を巻き込むような攻撃も狙える。", titleJpEn: "Boomerang (Side Special)", textJpEn: "On its way back, it becomes an attack that pierces through opponents. Since it homes back to him, moving up or down after throwing it can set up an attack that catches multiple opponents.", titlePt: "Boomerang (Especial Lateral)", textPt: "No caminho de volta, ele se torna um ataque que atravessa adversários. Como ele retorna em direção a ele, mover-se para cima ou para baixo depois de arremessá-lo pode preparar um ataque que pega vários adversários." },
  { titleEn: "[★☆☆] Bomb (Down Special)", titleJp: "バクダン 【下必殺ワザ】", textJp: "バクダンを相手に当てた時、トゥーンリンクは爆発に巻き込まれないが、地面に当たったり、時間経過で爆発してしまった場合は、爆発に巻き込まれる。", titleJpEn: "Bomb (Down Special)", textJpEn: "When a Bomb hits an opponent directly, Toon Link isn't caught in the explosion, but if it hits the ground or detonates from time running out, he will be caught in the blast.", titlePt: "Bomb (Especial Baixo)", textPt: "Quando uma Bomb atinge um adversário diretamente, o Toon Link não é pego na explosão, mas se ela atingir o chão ou detonar pelo tempo esgotado, ele será pego na explosão." },
  { titleEn: "[★☆☆] Triforce Slash (Final Smash)", titleJp: "トライフォースラッシュ 【最後の切りふだ】", textJp: "左手から光を放ち、当たった相手をトライフォースに閉じ込め、斬撃をくり出す。トゥーンリンクと相手との間にカベがあると、ヒットしない。", titleJpEn: "Triforce Slash (Final Smash)", textJpEn: "Fires light from his left hand, trapping any opponent it hits inside a Triforce and unleashing a barrage of slashes. It won't connect if there's a wall between Toon Link and the opponent.", titlePt: "Triforce Slash (Final Smash)", textPt: "Dispara luz da mão esquerda, prendendo qualquer adversário atingido dentro de uma Triforce e desferindo uma rajada de cortes. Não conecta se houver uma parede entre o Toon Link e o adversário." },
  { titleEn: "[★☆☆] Half-Moon Slash (Up Tilt Attack)", titleJp: "半月斬り 【上強攻撃】", textJp: "スキが小さく、連続で出せるのでお手玉を狙いやすい。相手を浮かせた後は、上スマッシュ攻撃や空中攻撃で追撃を狙える。", titleJpEn: "Half-Moon Slash (Up Tilt Attack)", textJpEn: "It has a small opening and can be used repeatedly, making it easy to juggle opponents. After launching an opponent into the air, an up smash attack or aerial attack can be aimed as a follow-up.", titlePt: "Half-Moon Slash (Ataque Inclinado Cima)", textPt: "Tem uma pequena abertura e pode ser usado repetidamente, facilitando fazer malabarismo com os adversários. Depois de lançar um adversário para o ar, um ataque smash cima ou ataque aéreo pode ser buscado como acompanhamento." },
  { titleEn: "[★☆☆] Two Part Slash (Neutral Air Attack)", titleJp: "二段斬り 【通常空中攻撃】", textJp: "剣を前後に振り払う。威力は控えめだが攻撃が出るのが速く、小さな時間差で前と後ろを連続で攻撃することができる。", titleJpEn: "Two Part Slash (Neutral Air Attack)", textJpEn: "Swings the sword forward and back. Its power is modest, but it comes out quickly, allowing him to attack in front and behind in quick succession.", titlePt: "Two Part Slash (Ataque Aéreo Neutro)", textPt: "Balança a espada para frente e para trás. Seu poder é modesto, mas sai rapidamente, permitindo atacar na frente e atrás em rápida sucessão." },
  { titleEn: "[★☆☆] Sword Plant (Down Air Attack)", titleJp: "下突き急降下 【下空中攻撃】", textJp: "リンクの下空中攻撃と違い、相手に当たってもホップしない。そのためガケの外側では、よほど高い所から使わない限り自滅しやすい。", titleJpEn: "Sword Plant (Down Air Attack)", textJpEn: "Unlike Link's down air attack, it doesn't hop even if it hits an opponent. Because of this, using it beyond the ledge risks self-destructing unless done from quite a high position.", titlePt: "Sword Plant (Ataque Aéreo Baixo)", textPt: "Diferente do ataque aéreo baixo do Link, ele não quica mesmo se acertar um adversário. Por causa disso, usá-lo além da borda arrisca a autodestruição, a menos que feito de uma posição bem alta." },
  { titleEn: "[★☆☆] Midair Hookshot (Grab Attack)", titleJp: "空中フックショット 【つかみ】", textJp: "空中でつかみを入力してもフックショットを撃てる。攻撃に使えるほか、ガケに当てればつかまることも可能だが、相手をつかむことはできない。", titleJpEn: "Midair Hookshot (Grab Attack)", textJpEn: "Inputting grab in the air also fires the Hookshot. It can be used as an attack, and hitting a ledge with it allows grabbing on, though it can't grab an opponent.", titlePt: "Midair Hookshot (Agarrão)", textPt: "Inputar agarrar no ar também dispara o Hookshot. Pode ser usado como um ataque, e acertar uma borda com ele permite se agarrar, embora não possa agarrar um adversário." },
  { titleEn: "[★★☆] Midair Hookshot Techniques (Grab Attack)", titleJp: "空中フックショットのテクニック 【つかみ】", textJp: "フックショットが出ている時に着地してもスキが少ない。着地直前に撃てば、相手をけん制しつつ着地できるうえ、着地後に攻撃にうつりやすい。", titleJpEn: "Midair Hookshot Techniques (Grab Attack)", textJpEn: "Landing while the Hookshot is out has little lag. Firing it right before landing lets him zone the opponent while landing, and makes it easy to move into an attack afterward.", titlePt: "Técnicas do Midair Hookshot (Agarrão)", textPt: "Pousar enquanto o Hookshot está fora tem pouca abertura. Dispará-lo pouco antes de pousar permite controlar o espaço do adversário enquanto pousa, e facilita passar para um ataque depois." },
  { titleEn: "[★☆☆] Hero's Shield", titleJp: "盾でのガード", textJp: "盾で防御できる位置がリンクより低く、体が小さいため攻撃を防ぎやすい。その分リンクと違い、微速歩行以外の移動中は盾で攻撃を防げない。", titleJpEn: "Hero's Shield", textJpEn: "The position his shield can block is lower than Link's, and his small body makes it easy to block attacks. However, unlike Link, he can't block attacks with his shield while moving, except when walking very slowly.", titlePt: "Hero's Shield", textPt: "A posição em que seu escudo pode bloquear é mais baixa que a do Link, e seu corpo pequeno facilita bloquear ataques. Porém, diferente do Link, ele não pode bloquear ataques com o escudo enquanto se move, exceto ao andar bem devagar." },
];

async function main() {
  const tl = await db.fighter.findFirst({
    where: { name: "Toon Link" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!tl) { console.log("Toon Link not found"); return; }

  await db.fighter.update({
    where: { id: tl.id },
    data: {
      curatorOverviewEn: "Toon Link, the cartoon-styled hero of The Wind Waker, is a nimble zoner with the same three-projectile toolkit as his adult counterpart — Hero's Bow, Boomerang, and Bomb — but built into a smaller, faster frame with a low shield that blocks more attacks. His Boomerang pierces on the return trip, his bombs can be tossed in any direction for constant zoning, and his light weight extends his aerial hang time. Fast and evasive rather than powerful, Toon Link rewards players who peck away with projectiles and punish approaches rather than trading blows directly.",
      curatorOverviewPt: "Toon Link, o herói de estilo cartunesco de The Wind Waker, é um controlador de espaço ágil com o mesmo arsenal de três projéteis de sua contraparte adulta — Hero's Bow, Boomerang e Bomb — mas em um corpo menor e mais rápido, com um escudo baixo que bloqueia mais ataques. Seu Boomerang perfura na viagem de volta, suas bombas podem ser arremessadas em qualquer direção para controle de espaço constante, e seu peso leve estende seu tempo no ar. Rápido e evasivo em vez de poderoso, o Toon Link recompensa jogadores que desgastam com projéteis e punem aproximações em vez de trocar golpes diretamente.",
      curatorOverviewJp: "『風のタクト』のアニメ調の英雄トゥーンリンクは、成人版と同じ３種類の飛び道具――勇者の弓、ブーメラン、バクダン――を持つ機敏な空間制圧型ファイターだが、より小さく速い体に、より多くの攻撃を防げる低い盾を備えている。ブーメランは戻る際に相手を貫通し、バクダンはあらゆる方向に投げて絶え間ない牽制ができ、軽い体重は空中滞空時間を延ばす。パワーよりも速さと回避を重視するトゥーンリンクは、真正面から打ち合うのではなく飛び道具で相手を削り、接近を罰するプレイヤーに応える。",
      curatorOverviewJpEn: "Toon Link, the cartoon-styled hero of The Wind Waker, is a nimble space-control fighter with the same three projectiles as his adult counterpart — Hero's Bow, Boomerang, and Bomb — but housed in a smaller, faster body with a lower shield that blocks more attacks. His Boomerang pierces opponents on the way back, his bombs can be thrown in any direction for constant zoning, and his light weight extends his time in the air. Prioritizing speed and evasion over power, Toon Link rewards players who chip away with projectiles and punish approaches rather than trading blows head-on.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = tl.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = tl.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "Toon Link's Bomb has low power, but a wide blast radius that makes it easy to hit opponents with — a useful projectile. It can be thrown up, down, left, or right, making it handy for zoning. The up special \"Spin Attack\" — because he's lighter, he stays airborne longer when used in the air compared to Link. His side smash attack is the easiest way to launch opponents; the second hit reaches further and deals more power. (GC) The Legend of Zelda: The Wind Waker (2002/12) (DS) The Legend of Zelda: Spirit Tracks (2009/12)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "A Bomb do Toon Link tem baixo poder, mas um raio de explosão amplo que facilita acertar adversários — um projétil útil. Pode ser arremessada para cima, baixo, esquerda ou direita, tornando-a útil para controle de espaço. O especial cima \"Spin Attack\" — como ele é mais leve, fica no ar por mais tempo quando usado no ar em comparação com o Link. Seu ataque smash lateral é a forma mais fácil de arremessar adversários; o segundo golpe alcança mais longe e causa mais poder. (GC) The Legend of Zelda: The Wind Waker (2002/12) (DS) The Legend of Zelda: Spirit Tracks (2009/12)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = tl.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fixes: main SSB4 trophy — WiiU 36:20-36:31, 3DS 34:01-34:12
  const mainTrophy = await db.collectible.findFirst({ where: { name: "Toon Link", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (mainTrophy) {
    await db.collectible.update({ where: { id: mainTrophy.id }, data: { videoStartSec: 2180, videoEndSec: 2191, videoStartSec2: 2041, videoEndSec2: 2052 } });
    console.log(`✅ SSB4 Trophy "Toon Link": WiiU 2180-2191, 3DS 2041-2052 (36:20-36:31 / 34:01-34:12)`);
  }

  // Fix corrupted "Toon Link (Alt.)" secondary field (was 2053-123840)
  const altTrophy = await db.collectible.findFirst({ where: { name: "Toon Link (Alt.)", smashGameVersion: "SSB4" }, select: { id: true } });
  if (altTrophy) {
    await db.collectible.update({ where: { id: altTrophy.id }, data: { videoStartSec2: 2052, videoEndSec2: 2063 } });
    console.log("✅ SSB4 Trophy \"Toon Link (Alt.)\" secundário corrompido -> 2052-2063");
  }

  // Link + normalize orphaned "Triforce Slash (Toon Link)" for both SSBB and SSB4_WIIU
  const triforceWiiU = await db.collectible.findFirst({ where: { name: "Triforce Slash (Toon Link)", smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
  if (triforceWiiU) {
    await db.collectible.update({ where: { id: triforceWiiU.id }, data: { smashGameVersion: "SSB4", fighterId: tl.id } });
    console.log("✅ \"Triforce Slash (Toon Link)\" [SSB4_WIIU]: normalizado SSB4, linkado");
  }
  const triforceSSBB = await db.collectible.findFirst({ where: { name: "Triforce Slash (Toon Link)", smashGameVersion: "SSBB" }, select: { id: true } });
  if (triforceSSBB) {
    await db.collectible.update({ where: { id: triforceSSBB.id }, data: { fighterId: tl.id } });
    console.log("✅ \"Triforce Slash (Toon Link)\" [SSBB]: linkado");
  }

  await db.$disconnect();
}
main().catch(console.error);
