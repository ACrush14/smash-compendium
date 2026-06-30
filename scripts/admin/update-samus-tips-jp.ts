import { db } from "../../lib/db";

// Textos da Samus (SSBU) extraídos de wikiwiki.jp/ssbswitch/スマちしき/ファイター em 2026-06-30
// Traduções EN/PT/JpEn feitas manualmente

const SAMUS_TIPS = [
  {
    titleEn: "[★☆☆] Samus's Origins",
    titleJp: "サムスの初登場作品",
    textJp: "サムス・アランの初登場作品は１９８６年発売の『メトロイド』。謎解き要素の強い、SFアクション・アドベンチャーゲーム。",
    titleJpEn: "Samus's First Appearance",
    textJpEn: "Samus Aran's first appearance was in \"Metroid,\" released in 1986. It's an SF action-adventure game with strong puzzle-solving elements.",
    titlePt: "Primeira Aparição de Samus",
    textPt: "A primeira aparição de Samus Aran foi em \"Metroid\", lançado em 1986. É um jogo de ação e aventura de ficção científica com fortes elementos de puzzle.",
  },
  {
    titleEn: "[★☆☆] In Her Series",
    titleJp: "原作では",
    textJp: "ビームやミサイルなど、多くの機能を備えた、鳥人族製のパワードスーツを着用。鳥人族から受け継いだ戦闘技術とスーツを駆使して戦う、銀河のバウンティハンター。",
    titleJpEn: "In the Original Series",
    textJpEn: "She wears a Power Suit made by the Chozo, equipped with many functions such as beams and missiles. A galactic bounty hunter who fights using combat techniques and the suit inherited from the Chozo.",
    titlePt: "Na Série Original",
    textPt: "Ela usa um Power Suit fabricado pelos Chozo, equipado com diversas funções como raios e mísseis. Uma caçadora de recompensas galáctica que combate usando as técnicas de luta e o traje herdados dos Chozo.",
  },
  {
    titleEn: "[★☆☆] Multiple Endings",
    titleJp: "マルチエンディング",
    textJp: "初代『メトロイド』はクリアまでの時間によって、エンディングに登場するサムスの姿が変わる。短ければサムスの正体が明らかになる。",
    titleJpEn: "Multiple Endings",
    textJpEn: "In the original \"Metroid,\" the appearance of Samus in the ending changes depending on how quickly you clear the game. A faster clear time reveals Samus's true identity.",
    titlePt: "Múltiplos Finais",
    textPt: "No \"Metroid\" original, a aparência de Samus no final do jogo muda de acordo com o tempo que você leva para completá-lo. Um tempo mais rápido revela a verdadeira identidade de Samus.",
  },
  {
    titleEn: "[★☆☆] A Parental Bond?",
    titleJp: "メトロイドの親?",
    textJp: "『スーパーメトロイド』に登場する「ベビーメトロイド」は、サムスのことを母親だと思っており、宇宙科学アカデミーで保護されている。",
    titleJpEn: "A Metroid's Parent?",
    textJpEn: "The \"Baby Metroid\" that appears in \"Super Metroid\" believes Samus to be its mother, and is under the protection of the Ceres Space Colony.",
    titlePt: "Um Laço Materno?",
    textPt: "O \"Baby Metroid\" que aparece em \"Super Metroid\" acredita que Samus é sua mãe e é mantido sob proteção na Colônia Espacial Ceres.",
  },
  {
    titleEn: "[★☆☆] Charge Shot (Neutral Special)",
    titleJp: "チャージショット【通常必殺ワザ】",
    textJp: "最大までためたチャージショットは、かなり強力。空中でも、地上と同じようにためることができる。ためずに連射することも可能。",
    titleJpEn: "Charge Shot (Neutral Special)",
    textJpEn: "A fully charged Charge Shot is quite powerful. You can charge it in the air just like on the ground. It's also possible to fire rapidly without charging.",
    titlePt: "Tiro Carregado (Especial Neutro)",
    textPt: "Um Tiro Carregado totalmente carregado é bastante poderoso. Ele pode ser carregado no ar da mesma forma que no chão. Também é possível disparar rapidamente sem carregar.",
  },
  {
    titleEn: "[★☆☆] Missile (Side Special)",
    titleJp: "ミサイル【横必殺ワザ】",
    textJp: "ゆるやかに相手をホーミングするミサイルを発射する。はじき入力で出すと、直進するスーパーミサイルを発射。",
    titleJpEn: "Missile (Side Special)",
    textJpEn: "Fires a missile that gently homes in on the opponent. Using a flick input fires a Super Missile that travels in a straight line instead.",
    titlePt: "Míssil (Especial Lateral)",
    textPt: "Dispara um míssil que persegue suavemente o adversário. Usar uma entrada rápida dispara um Super Míssil que viaja em linha reta.",
  },
  {
    titleEn: "[★☆☆] Super Missile (Side Special)",
    titleJp: "スーパーミサイル【横必殺ワザ】",
    textJp: "はじき入力で発射したスーパーミサイルは、しばらくとどまった後、直進する。ホーミングするミサイルと使い分ければ、さらに避けられにくくなる。",
    titleJpEn: "Super Missile (Side Special)",
    textJpEn: "A Super Missile fired with a flick input pauses briefly before traveling straight ahead. Mixing it with the homing Missile makes your attacks even harder to avoid.",
    titlePt: "Super Míssil (Especial Lateral)",
    textPt: "Um Super Míssil disparado com entrada rápida pausa brevemente antes de seguir em frente. Combiná-lo com o Míssil de rastreamento torna seus ataques ainda mais difíceis de desviar.",
  },
  {
    titleEn: "[★☆☆] Screw Attack (Up Special)",
    titleJp: "スクリューアタック【上必殺ワザ】",
    textJp: "復帰に使う場合、ガケに背を向けて使用してしまうと、上昇が終了するまでガケにつかまれない。正面を向いて使えば近くのガケにすぐつかまれる。",
    titleJpEn: "Screw Attack (Up Special)",
    textJpEn: "When using it for recovery, if you use it with your back to the ledge, you won't be able to grab the ledge until the ascent ends. Use it while facing the ledge to grab it immediately.",
    titlePt: "Screw Attack (Especial Cima)",
    textPt: "Ao usá-lo para recuperação, se o usar de costas para a borda, você não conseguirá agarrá-la até o fim da ascensão. Use-o de frente para a borda para agarrá-la imediatamente.",
  },
  {
    titleEn: "[★☆☆] Bomb (Down Special)",
    titleJp: "ボム【下必殺ワザ】",
    textJp: "丸くなって、その場に爆弾を落とす。落とした爆弾の爆風に当たると、少しジャンプする。",
    titleJpEn: "Bomb (Down Special)",
    textJpEn: "Curls into a ball and drops a bomb in place. Getting caught in the blast of the dropped bomb causes a small hop upward.",
    titlePt: "Bomba (Especial Baixo)",
    textPt: "Enrola-se em bola e solta uma bomba no lugar. Ser atingido pela explosão da bomba soltada provoca um pequeno salto para cima.",
  },
  {
    titleEn: "[★☆☆] Zero Laser (Final Smash)",
    titleJp: "ゼロレーザー【最後の切りふだ】",
    textJp: "レーザーを照射する前に、近くのファイターを少し引き寄せる。照射中は、上下の入力で射出角度を変えることができる。",
    titleJpEn: "Zero Laser (Final Smash)",
    textJpEn: "Before firing the laser, it slightly pulls in nearby fighters. While firing, you can change the angle of the beam with up/down inputs.",
    titlePt: "Zero Laser (Final Smash)",
    textPt: "Antes de disparar o laser, ele atrai levemente os lutadores próximos. Durante o disparo, você pode alterar o ângulo do feixe com entradas para cima/baixo.",
  },
  {
    titleEn: "[★★☆] Straight and Cannon Hammer (Neutral Attack)",
    titleJp: "ストレートとアームキャノンハンマー【弱攻撃】",
    textJp: "１段目と２段目の間は相手のシールドが間に合うことが多い。１段目を当てた直後に距離をとるなどして、２段目を使わない方が良い場合もある。",
    titleJpEn: "Straight and Arm Cannon Hammer (Neutral Attack)",
    textJpEn: "The opponent often has time to shield between the first and second hits. It's sometimes better to skip the second hit — try creating distance right after landing the first.",
    titlePt: "Direto e Martelo do Canhão (Ataque Neutro)",
    textPt: "O adversário frequentemente tem tempo de usar o escudo entre o primeiro e o segundo golpe. Às vezes é melhor não usar o segundo golpe — tente criar distância logo após acertar o primeiro.",
  },
  {
    titleEn: "[★★☆] Midair Grapple Beam (Grab Attack)",
    titleJp: "空中グラップリングビーム【つかみ】",
    textJp: "小ジャンプでバックしつつ、空中でつかみを入力してグラップリングビームを放てば、相手をけん制しつつ後退することが可能。",
    titleJpEn: "Midair Grapple Beam (Grab)",
    textJpEn: "Short hop backward while pressing grab in the air to fire the Grapple Beam — this lets you retreat while keeping the opponent in check.",
    titlePt: "Grapple Beam Aéreo (Agarrar)",
    textPt: "Faça um pequeno salto para trás enquanto pressiona agarrar no ar para disparar o Grapple Beam — isso permite recuar enquanto mantém o adversário sob pressão.",
  },
];

async function main() {
  const samus = await db.fighter.findFirst({
    where: { name: "Samus" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!samus) { console.log("Samus not found"); return; }

  console.log(`Found Samus (${samus.id}) with ${samus.tips.length} tips`);

  let updated = 0;
  for (const data of SAMUS_TIPS) {
    const tip = samus.tips.find(t => t.titleEn === data.titleEn);
    if (!tip) {
      console.log(`  ⚠️  Tip not found: "${data.titleEn}"`);
      continue;
    }
    await db.fighterTip.update({
      where: { id: tip.id },
      data: {
        titleJp: data.titleJp,
        textJp: data.textJp,
        titleJpEn: data.titleJpEn,
        textJpEn: data.textJpEn,
        titlePt: data.titlePt,
        textPt: data.textPt,
      },
    });
    console.log(`  ✅ ${data.titleEn}`);
    updated++;
  }

  // Fix SSB64 bio contentJp "NOT FOUND" → null
  const ssb64Bio = await db.fighterBio.findFirst({
    where: { fighter: { name: "Samus" }, smashGameVersion: "SSB64" },
    select: { id: true, contentJp: true },
  });
  if (ssb64Bio && ssb64Bio.contentJp === "NOT FOUND") {
    await db.fighterBio.update({ where: { id: ssb64Bio.id }, data: { contentJp: null, contentJpEn: null } });
    console.log("\n✅ SSB64 bio contentJp corrigido (NOT FOUND → null)");
  }

  // Curator Overview
  await db.fighter.update({
    where: { name: "Samus" },
    data: {
      curatorOverviewEn: `Samus Aran carries the galaxy on her shoulders — and her Arm Cannon. One of Smash's most iconic zoning characters, she builds space with relentless projectiles: a charged laser that rewards patience, homing and straight-traveling missiles that force opponents to commit, and a Bomb for tricky escapes. Her game is about controlling distance and forcing reactions, then punishing overextensions with heavyweight knockback. Beneath the Power Suit lies the franchise's greatest twist — but in Smash, Samus doesn't need the reveal to make an impression.`,
      curatorOverviewPt: `Samus Aran carrega a galáxia nos ombros — e no Canhão de Braço. Uma das personagens de zoneamento mais icônicas do Smash, ela controla o espaço com projéteis implacáveis: um laser carregado que recompensa a paciência, mísseis de rastreamento e diretos que forçam o adversário a se comprometer, e uma Bomba para escapes engenhosos. Seu jogo é sobre controlar a distância, forçar reações e punir com knockback pesado. Sob o Power Suit está a maior reviravolta da franquia — mas no Smash, Samus não precisa de revelações para impressionar.`,
      curatorOverviewJp: `サムス・アランは銀河とアームキャノンを背負って戦う。スマブラ屈指のゾーニングキャラクターで、チャージショット・ミサイル・ボムなどの飛び道具で相手との間合いを支配する。満タンのチャージショットは忍耐の申し子——ホーミングと直進を使い分けるミサイルで相手の動きを制限し、重い吹っ飛ばし力で隙を確実に仕留める。パワードスーツの下に秘められたものはシリーズ最大のどんでん返し——しかしスマブラでは、そのスーツだけで圧倒的な存在感を放つ。`,
      curatorOverviewJpEn: `Samus Aran carries the galaxy on her back — and in her Arm Cannon. One of Smash's premier zoning characters, she commands space with relentless projectiles: a Charge Shot that rewards patience, homing and straight-line missiles that lock down opponents, and a Bomb for clever escapes. Her style is about controlling distance, forcing reactions, and punishing with weighty knockback. Beneath the Power Suit lies the franchise's greatest twist — but in Smash, that suit alone makes an unforgettable impression.`,
    },
  });
  console.log("✅ Curator Overview salvo (4 idiomas)");

  console.log(`\n✅ ${updated}/${SAMUS_TIPS.length} tips atualizadas`);
  await db.$disconnect();
}
main().catch(console.error);
