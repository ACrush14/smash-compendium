import { db } from "../../lib/db";

const SSB64_BIO_JP = "宇宙規模の大レース「F-ZERO」グランプリ常連のパイロットであるとともに、すご腕の賞金かせぎでもある。経歴などは不明な点が多いが、数多くの悪党どもにうらみを買われていることだけは間違いない。愛機「ブルーファルコン」を操り、スピードの限界に挑み続けている。";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBB: {
    pt: "Um piloto habilidoso da F-Zero e um caçador de recompensas engenhoso. Tudo o que se sabe de seu passado é que ele vem de Port Town. Ele conquistou fama e fortuna ultrapassando seus adversários em sua amada Blue Falcon. Sua incrível capacidade atlética e sua atitude de nunca desistir o tornam o piloto a quem recorrer em momentos de dificuldade.",
    jpEn: "A skilled F-Zero pilot and, at the same time, a formidable bounty hunter. Aside from the fact that he hails from Port Town, his background is shrouded in mystery. Piloting his beloved car, the \"Blue Falcon,\" he has outraced his rivals to claim countless victories. A pilot who combines a finely honed body with a spirit that never yields to any hardship.",
  },
  SSB4: {
    pt: "Na cena de corridas da F-Zero, Captain Falcon usa sua Blue Falcon para vencer em grande estilo. Com sua origem em grande parte um mistério, ele chegou ao campo de batalha de Smash Bros. para provar seu valor fora do cockpit. Ele tem velocidade e poder, e seu característico Falcon Punch deixa marcas. Comece-o no ar para surpreender seus adversários!",
    jpEn: "A racer from \"F-Zero\" who pilots the \"Blue Falcon\" to earn prize money in races. Aside from hailing from Port Town, his background is shrouded in mystery. In Smash Bros., he's a fighter who combines speed, power, and weight. \"Falcon Punch\" has an extremely large opening before it comes out, but the thrill when it connects is unmatched. Try starting it in the air or aiming for it during a chaotic melee.",
  },
  SSBU: {
    pt: "Captain Falcon (キャプテン・ファルコン, Captain Falcon) é um personagem jogável em Super Smash Bros. Ultimate. Ele foi confirmado em 12 de junho de 2018. Como no Super Smash Bros. original e em Super Smash Bros. Brawl, ele é desbloqueável, em vez de estar disponível desde o início. Captain Falcon é classificado como Lutador #11.",
    jpEn: "Regarding Captain Falcon as a fighter, see respectively: \"Captain Falcon (64),\" \"Captain Falcon (DX),\" \"Captain Falcon (X),\" \"Captain Falcon (3DS/Wii U),\" and \"Captain Falcon (SP).\"",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "He boldly combines both power and speed. His attacks are a bit sluggish to come out, but the sharp contrast between movement and attacking makes for an exhilarating playstyle. Falcon Punch is a special move with both extreme risk and extreme power. Raptor Boost shines when you launch the opponent into the air and follow up. B: Falcon Punch, Side+B: Raptor Boost",
    pt: "Ele combina ousadamente poder e velocidade. Seus ataques são um pouco lentos para sair, mas o contraste marcante entre movimento e ataque proporciona um estilo de jogo emocionante. O Falcon Punch é um golpe especial com risco extremo e poder extremo. O Raptor Boost brilha quando você lança o adversário no ar e faz um acompanhamento. B: Falcon Punch, Lateral+B: Raptor Boost",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "The forward air attack, Knee Smash, is a bit slow to come out and lacks reach, but if you can land the very start cleanly, it sends opponents flying low and far. Falcon Dive grabs an opponent and breaks away with an explosion. After breaking away, it can be used once more, strengthening recovery. Up+B: Falcon Dive, Down+B: Falcon Kick",
    pt: "O ataque aéreo frontal, Knee Smash, é um pouco lento para sair e não tem muito alcance, mas se você conseguir acertar o início de forma limpa, ele arremessa os adversários baixo e longe. O Falcon Dive agarra um adversário e se solta com uma explosão. Após se soltar, pode ser usado mais uma vez, fortalecendo a recuperação. Cima+B: Falcon Dive, Baixo+B: Falcon Kick",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Falcon Kick is a Down Special that dashes forward with a fiery kick. Used on the ground, it dashes horizontally; used in the air, it launches a flying kick diagonally downward. Its dashing speed is fast, making it effective for surprise attacks. Knee Smash, delivered with the forward air attack, is an aerial knee strike. Landing it at point-blank range against an opponent results in extremely high knockback power. (SFC) F-ZERO (1990/11) (GC) F-ZERO GX (2003/07)",
    pt: "Falcon Kick é um Especial Baixo que avança com um chute em chamas. Usado no chão, avança horizontalmente; usado no ar, dispara um chute voador na diagonal para baixo. Sua velocidade de avanço é rápida, tornando-o eficaz para ataques surpresa. O Knee Smash, entregue com o ataque aéreo frontal, é um golpe de joelho aéreo. Acertá-lo à queima-roupa contra um adversário resulta em um poder de arremesso extremamente alto. (SFC) F-ZERO (1990/11) (GC) F-ZERO GX (2003/07)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Captain Falcon's Origins", titleJp: "C・ファルコンの初登場作品", textJp: "C・ファルコンの初登場作品は１９９０年に発売された『F-ZERO』。当初、ゲーム中には登場せず、説明書に描かれているのみだった。", titleJpEn: "Captain Falcon's Origins", textJpEn: "Captain Falcon's debut was in \"F-ZERO,\" released in 1990. Initially, he didn't actually appear in the game itself — he was only depicted in the instruction manual.", titlePt: "As Origens do Captain Falcon", textPt: "O debut do Captain Falcon foi em \"F-ZERO,\" lançado em 1990. Inicialmente, ele nem aparecia no jogo em si — era retratado apenas no manual de instruções." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『F-ZERO』シリーズの主人公。凄腕の賞金稼ぎとしても、名を馳せている。超高速マシンレース「F-ZERO」のレーサーであり、パイロットとしての腕も超一流。", titleJpEn: "In His Series", textJpEn: "The protagonist of the \"F-ZERO\" series. He's also renowned as a formidable bounty hunter. He's a racer in the ultra-high-speed machine race \"F-ZERO,\" and his skill as a pilot is top-tier.", titlePt: "Na Série Original", textPt: "O protagonista da série \"F-ZERO.\" Ele também é famoso como um formidável caçador de recompensas. Ele é um corredor na corrida de máquinas ultra-velozes \"F-ZERO,\" e sua habilidade como piloto é de primeira linha." },
  { titleEn: "[★☆☆] Captain Falcon's Machine", titleJp: "C・ファルコンの愛機", textJp: "初代『F-ZERO』で操作できる青いマシンはブルーファルコン。『スマブラ』の最後の切りふだでも見ることができるC・ファルコンの愛機。", titleJpEn: "Captain Falcon's Beloved Machine", textJpEn: "The blue machine you can pilot in the original \"F-ZERO\" is the Blue Falcon. It's Captain Falcon's beloved machine, which can also be seen in his Final Smash in Smash Bros.", titlePt: "A Máquina Amada do Captain Falcon", textPt: "A máquina azul que você pode pilotar no \"F-ZERO\" original é a Blue Falcon. É a amada máquina do Captain Falcon, que também pode ser vista em seu Final Smash em Smash Bros." },
  { titleEn: "[★★★] Turn Around and Attack with Falcon Punch (Neutral Special)", titleJp: "ファルコンパンチで振り向き攻撃 【通常必殺ワザ】", textJp: "ボタンを押してからすぐに後ろ方向へ入力すると、振り向いて攻撃する。しかも少し攻撃力が上がる。", titleJpEn: "Turn Around and Attack with Falcon Punch (Neutral Special)", textJpEn: "Pressing the button and immediately inputting backward makes him turn around and attack — and it even slightly increases the attack's power.", titlePt: "Virar e Atacar com o Falcon Punch (Especial Neutro)", textPt: "Pressionar o botão e imediatamente inputar para trás faz ele se virar e atacar — e isso ainda aumenta um pouco o poder do ataque." },
  { titleEn: "[★★★] Raptor Boost (Side Special)", titleJp: "ファルコンナックル 【横必殺ワザ】", textJp: "空中で使った時に振り下ろす手にはメテオ効果がある。ファルコンの体より低い位置で相手にヒットさせるのがコツ。", titleJpEn: "Falcon Knuckle (Side Special)", textJpEn: "When used in the air, the hand that swings down has a meteor effect. The trick is to hit the opponent at a position lower than Falcon's own body.", titlePt: "Falcon Knuckle (Especial Lateral)", textPt: "Quando usado no ar, a mão que desce tem um efeito meteoro. O truque é acertar o adversário em uma posição mais baixa que o próprio corpo do Falcon." },
  { titleEn: "[★☆☆] Raptor Boost Techniques (Side Special)", titleJp: "ファルコンナックルのテクニック 【横必殺ワザ】", textJp: "地上で出す際、拳を振り上げる直前にスーパーアーマー状態になる。相手の攻撃を耐えつつ、ファルコンナックルを叩き込み、浮かせて追撃を狙おう。", titleJpEn: "Falcon Knuckle Techniques (Side Special)", textJpEn: "When used on the ground, right before raising his fist, he briefly enters a Super Armor state. Withstand the opponent's attack, land the Raptor Boost, and aim to launch them for a follow-up.", titlePt: "Técnicas do Falcon Knuckle (Especial Lateral)", textPt: "Quando usado no chão, logo antes de levantar o punho, ele entra brevemente em um estado de Super Armadura. Aguente o ataque do adversário, acerte o Raptor Boost, e busque lançá-lo para um acompanhamento." },
  { titleEn: "[★☆☆] Continuous Falcon Dives (Up Special)", titleJp: "ファルコンダイブで連続攻撃 【上必殺ワザ】", textJp: "飛び上がって相手をつかみ、爆発でふっとばすワザ。当てれば、空中でもう一度出せるようになる。", titleJpEn: "Continuous Falcon Dives (Up Special)", textJpEn: "A move where he leaps up, grabs an opponent, and blasts them away with an explosion. If it connects, he can use it once more in the air.", titlePt: "Falcon Dives Contínuos (Especial Cima)", textPt: "Um movimento onde ele salta, agarra um adversário e o arremessa com uma explosão. Se conectar, ele pode usá-lo mais uma vez no ar." },
  { titleEn: "[★★☆] Falcon Dive's Direction (Up Special)", titleJp: "ファルコンダイブの向き 【上必殺ワザ】", textJp: "かがんでいる間に左右入力すると飛ぶ角度を少し変えられる。正面に入力すれば、相手をつかむ距離を大きく伸ばすことができる。", titleJpEn: "Falcon Dive's Direction (Up Special)", textJpEn: "Inputting left or right while crouched slightly changes the angle of the leap. Inputting forward can greatly extend the distance at which he grabs an opponent.", titlePt: "A Direção do Falcon Dive (Especial Cima)", textPt: "Inputar esquerda ou direita enquanto agachado muda levemente o ângulo do salto. Inputar para frente pode estender bastante a distância em que ele agarra um adversário." },
  { titleEn: "[★★☆] Falcon Kick (Down Special)", titleJp: "ファルコンキック 【下必殺ワザ】", textJp: "もっとも攻撃力が高いのはワザの出始めで、移動するほど低くなっていく。空中で使うと、地上よりも攻撃力が減りにくい。", titleJpEn: "Falcon Kick (Down Special)", textJpEn: "The attack's power is highest right at the start of the move and gradually decreases the further it travels. When used in the air, the power decreases more slowly than on the ground.", titlePt: "Falcon Kick (Especial Baixo)", textPt: "O poder do ataque é maior bem no início do movimento e diminui gradualmente conforme avança. Quando usado no ar, o poder diminui mais lentamente do que no chão." },
  { titleEn: "[★☆☆] Blue Falcon (Final Smash)", titleJp: "ブルーファルコン 【最後の切りふだ】", textJp: "ブルーファルコンを呼び寄せ、当たった相手を『F-ZERO』のコース上に飛ばす。猛烈なスピードで突進する愛車が、相手をふっとばす。", titleJpEn: "Blue Falcon (Final Smash)", textJpEn: "Summons the Blue Falcon, sending any opponent it hits flying onto an \"F-ZERO\" racetrack. His beloved car charges in at tremendous speed, launching the opponent.", titlePt: "Blue Falcon (Final Smash)", textPt: "Convoca a Blue Falcon, enviando qualquer adversário que ela atinge para uma pista de corrida de \"F-ZERO.\" Seu amado carro avança em velocidade tremenda, arremessando o adversário." },
  { titleEn: "[★★☆] Blue Falcon Animation (Final Smash)", titleJp: "ブルーファルコンの演出 【最後の切りふだ】", textJp: "地上か空中、使った場所によって相手に当たった後の決めポーズが違う。地上で誰にも当たらずにワザが失敗した時は、あからさまに悔しがる。", titleJpEn: "Blue Falcon Animation (Final Smash)", textJpEn: "The finishing pose after hitting an opponent differs depending on whether it was used on the ground or in the air. If used on the ground and it fails to hit anyone, he visibly shows his frustration.", titlePt: "Animação do Blue Falcon (Final Smash)", textPt: "A pose final após acertar um adversário é diferente dependendo se foi usado no chão ou no ar. Se usado no chão e não acertar ninguém, ele demonstra visivelmente sua frustração." },
  { titleEn: "[★★★] Wheel Kick (Up Tilt Attack)", titleJp: "ホイールキック 【上強攻撃】", textJp: "当たった相手を叩きつける、メテオ効果があるワザ。ガケ際に立って、場外のファイターを狙えば効果的。", titleJpEn: "Wheel Kick (Up Tilt Attack)", textJpEn: "A move with a meteor effect that slams down any opponent it hits. It's effective when standing near the ledge and aiming at fighters offstage.", titlePt: "Wheel Kick (Ataque Inclinado Cima)", textPt: "Um movimento com efeito meteoro que arremessa para baixo qualquer adversário que atinge. É eficaz quando parado perto da borda e mirando em lutadores fora do palco." },
  { titleEn: "[★★☆] Knee Smash (Forward Air Attack)", titleJp: "ストライキングニー 【前空中攻撃】", textJp: "ワザの出始めに勢いよくひざを突き出す。その瞬間を相手に当てると、強烈にふっとばせる。", titleJpEn: "Striking Knee (Forward Air Attack)", textJpEn: "He thrusts his knee out forcefully right at the start of the move. Hitting an opponent in that exact instant sends them flying powerfully.", titlePt: "Striking Knee (Ataque Aéreo Frontal)", textPt: "Ele estende o joelho com força bem no início do movimento. Acertar um adversário nesse instante exato o arremessa poderosamente." },
  { titleEn: "[★☆☆] Overhead Kick (Up Air Attack)", titleJp: "オーバーヘッドキック 【上空中攻撃】", textJp: "けん制にも、コンボにも使いやすい。当て方次第では、前空中攻撃や下空中攻撃までつながり、撃墜も狙える。", titleJpEn: "Overhead Kick (Up Air Attack)", textJpEn: "Easy to use both as a check and in combos. Depending on how it connects, it can lead into forward or down air attacks, opening up KO opportunities.", titlePt: "Overhead Kick (Ataque Aéreo Cima)", textPt: "Fácil de usar tanto como intimidação quanto em combos. Dependendo de como conecta, pode levar a ataques aéreos frontal ou baixo, abrindo oportunidades de KO." },
];

async function main() {
  const cf = await db.fighter.findFirst({
    where: { name: "Captain Falcon" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true, contentJp: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!cf) { console.log("Captain Falcon not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: cf.id },
    data: {
      curatorOverviewEn: "Captain Falcon, ace F-Zero pilot and legendary bounty hunter, has been a Smash Bros. mainstay since the original 1999 game. Defined by the devastating (if slow) Falcon Punch, the combo-friendly Knee Smash, and blistering dash speed, he's an aggressive rush-down fighter who rewards players willing to read their opponent and commit to punishing openings.",
      curatorOverviewPt: "Captain Falcon, ás piloto de F-Zero e lendário caçador de recompensas, é presença constante no Smash Bros. desde o jogo original de 1999. Definido pelo devastador (porém lento) Falcon Punch, o combo-friendly Knee Smash e sua velocidade de corrida impressionante, ele é um lutador agressivo que recompensa jogadores dispostos a ler o adversário e se comprometer com punições certeiras.",
      curatorOverviewJp: "F-ZEROのエースパイロットにして伝説のバウンティ・ハンター、キャプテン・ファルコンは、１９９９年の初代スマブラからシリーズの常連ファイター。強力だが遅い「ファルコンパンチ」、コンボに強い「ニースマッシュ」、そして圧倒的なダッシュ速度が特徴。相手を読み切り、確実にパニッシュを決める攻撃的なプレイスタイルを持つプレイヤーに適したファイターだ。",
      curatorOverviewJpEn: "Captain Falcon, F-Zero's ace pilot and legendary bounty hunter, has been a series staple since the original 1999 Smash Bros. Defined by the powerful but slow Falcon Punch, the combo-friendly Knee Smash, and overwhelming dash speed, he's suited for aggressive players who read their opponents and land decisive punishes.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Create missing SSBM bio
  const hasSsbm = cf.bios.some(b => b.smashGameVersion === "SSBM");
  if (!hasSsbm) {
    await db.fighterBio.create({
      data: {
        fighterId: cf.id,
        smashGameVersion: "SSBM",
        contentEn: "Usually a relentless bounty hunter, Captain Falcon shifts gears to become a race pilot once the F-Zero Grand Prix begins. His beloved racer, the Blue Falcon, can exceed the speed of sound, and he knows how to drive it; he'll go down as one of the all-time greats. Now 36 years old, Captain Falcon wears his F-Zero X visor.",
        contentJp: "ふだんは筋金入り、凄腕のバウンティ・ハンターだがF-ZEROグランプリが始まると、レースに参加。愛機ブルーファルコンで音速を超える。後に伝説のパイロットとして語られることになる。目がついているバイザーは『F-ZERO X』仕様。この当時36歳である。",
        contentPt: "Normalmente um implacável caçador de recompensas, Captain Falcon muda de marcha para se tornar piloto de corrida quando o Grande Prêmio F-Zero começa. Sua amada máquina, a Blue Falcon, pode ultrapassar a velocidade do som, e ele sabe como pilotá-la; ele será lembrado como um dos maiores de todos os tempos. Agora com 36 anos, Captain Falcon usa seu visor do F-Zero X.",
        contentJpEn: "Normally a hardened, skilled bounty hunter, he joins the race once the F-Zero Grand Prix begins. In his beloved Blue Falcon, he exceeds the speed of sound, and will later be spoken of as a legendary pilot. His eyes are covered by a visor styled after \"F-Zero X.\" At this point, he is 36 years old.",
        videoStartSec: 1381,
        videoEndSec: 1402,
      },
    });
    console.log("✅ Bio SSBM criada (não existia) — texto + timing 1381-1402 (Capt. Falcon trophy)");
  }

  // Fix SSB64 bio JP
  const bio64 = cf.bios.find(b => b.smashGameVersion === "SSB64");
  if (bio64 && (!bio64.contentJp || bio64.contentJp === "NOT FOUND")) {
    await db.fighterBio.update({ where: { id: bio64.id }, data: { contentJp: SSB64_BIO_JP } });
    console.log("✅ Bio SSB64: JP adicionado");
  }

  // Add PT+JpEn for SSBB/SSB4/SSBU
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = cf.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Moves EN+PT+JpEn
  for (const m of cf.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = cf.tips.find(t => t.titleEn === data.titleEn);
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

  // SSB64_WORKS reminder — needs manual add to page.tsx
  console.log("\n⚠️  Lembrete: adicionar SSB64_WORKS no page.tsx: F-ZERO (SNES) + F-ZERO X (N64)");

  await db.$disconnect();
}
main().catch(console.error);
