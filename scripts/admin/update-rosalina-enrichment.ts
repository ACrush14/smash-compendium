import { db } from "../../lib/db";

const TIPS = [
  { titleEn: "[★☆☆] Rosalina & Luma's Origins", titleJp: "ロゼッタ＆チコの初登場作品", textJp: "ロゼッタ＆チコの初登場は２００７年発売の『スーパーマリオギャラクシー』。ロゼッタは、チコとともに星の世界を旅する、謎の多い女性。", titleJpEn: "Rosalina & Luma's Origins", textJpEn: "Rosalina & Luma's debut was in \"Super Mario Galaxy,\" released in 2007. Rosalina is an enigmatic woman who travels through a world of stars together with a Luma.", titlePt: "As Origens da Rosalina & Luma", textPt: "O debut da Rosalina & Luma foi em \"Super Mario Galaxy,\" lançado em 2007. A Rosalina é uma mulher enigmática que viaja por um mundo de estrelas junto com um Luma." },
  { titleEn: "[★☆☆] In Their Series", titleJp: "原作では", textJp: "宇宙に浮かぶ「ほうき星の天文台」の主。謎のおいたちを持つ女性。星の子「チコ」たちが流れる星になるまで、ともに旅をしている。", titleJpEn: "In Their Series", textJpEn: "The mistress of the \"Comet Observatory\" floating in space. A woman with a mysterious past. She travels together with the star children called \"Lumas\" until they become shooting stars.", titlePt: "Na Série Original", textPt: "A senhora do \"Comet Observatory\" flutuando no espaço. Uma mulher com um passado misterioso. Ela viaja junto com as crianças-estrela chamadas \"Lumas\" até que elas se tornem estrelas cadentes." },
  { titleEn: "[★☆☆] Luma's Color", titleJp: "チコの色", textJp: "いろんな色のチコがいるけれど、能力は一緒。「黄色」「赤」「緑」「青」「クリーム色」「黒(バトラー)」の６種類。", titleJpEn: "Luma's Color", textJpEn: "There are Lumas of various colors, but their abilities are the same. There are 6 types: \"yellow,\" \"red,\" \"green,\" \"blue,\" \"cream,\" and \"black (Butler).\"", titlePt: "A Cor do Luma", textPt: "Existem Lumas de várias cores, mas suas habilidades são as mesmas. Há 6 tipos: \"amarelo,\" \"vermelho,\" \"verde,\" \"azul,\" \"creme,\" e \"preto (Butler).\"" },
  { titleEn: "[★☆☆] Luma Shot (Neutral Special)", titleJp: "チコシュート 【通常必殺ワザ】", textJp: "チコが前方に突進して体当たりし、相手を強くふっとばす。ためるほど威力が上がり、飛距離が延びる。", titleJpEn: "Luma Shot (Neutral Special)", textJpEn: "Luma charges forward and body-checks the opponent, launching them with strong knockback. Charging it increases its power and extends its range.", titlePt: "Luma Shot (Especial Neutro)", textPt: "O Luma avança e dá uma investida corporal no adversário, arremessando-o com forte impulso. Carregá-lo aumenta seu poder e estende seu alcance." },
  { titleEn: "[★★☆] Luma Shot Charges Forth (Neutral Special)", titleJp: "チコシュートで衝突 【通常必殺ワザ】", textJp: "相手に当たってもチコは進み続けるけれど、当たるごとに速度と威力が減少する。", titleJpEn: "Luma Shot Charges Forth (Neutral Special)", textJpEn: "Even after hitting an opponent, Luma keeps moving forward, but its speed and power decrease with each hit.", titlePt: "O Luma Shot Continua Avançando (Especial Neutro)", textPt: "Mesmo depois de acertar um adversário, o Luma continua avançando, mas sua velocidade e poder diminuem a cada acerto." },
  { titleEn: "[★☆☆] Robust Luma (Neutral Special)", titleJp: "ふっとびづらいチコ 【通常必殺ワザ】", textJp: "チコシュートで飛ばしたチコは、ロゼッタのそばにいる時よりもふっとびにくい。チコを守るために、あえてチコを切り離していた方が良いこともある。", titleJpEn: "Robust Luma (Neutral Special)", textJpEn: "A Luma launched with Luma Shot is harder to launch than when it's staying by Rosalina's side. To protect Luma, it can sometimes be better to deliberately keep it separated.", titlePt: "O Luma Resistente (Especial Neutro)", textPt: "Um Luma lançado com o Luma Shot é mais difícil de arremessar do que quando está ao lado da Rosalina. Para proteger o Luma, às vezes pode ser melhor mantê-lo propositalmente separado." },
  { titleEn: "[★☆☆] Luma's Direction (Neutral Special)", titleJp: "チコの自動振り向き 【通常必殺ワザ】", textJp: "チコシュートで飛ばしたチコは、弱攻撃などの一部のワザを使用した時に、近くにいるファイターの方を自動で向いて、攻撃してくれる。", titleJpEn: "Luma's Direction (Neutral Special)", textJpEn: "A Luma launched with Luma Shot automatically turns to face nearby fighters and attacks them when certain moves, like the neutral attack, are used.", titlePt: "A Direção do Luma (Especial Neutro)", textPt: "Um Luma lançado com o Luma Shot automaticamente se vira para encarar lutadores próximos e os ataca quando certos golpes, como o ataque neutro, são usados." },
  { titleEn: "[★★☆] Rebound Blows (Neutral Special)", titleJp: "戻りつつ攻撃 【通常必殺ワザ】", textJp: "チコシュートで遠くに飛ばしたチコは、呼び戻す最中に攻撃できる。ロゼッタに接近してくるファイターへの不意打ちやけん制に使える。", titleJpEn: "Rebound Blows (Neutral Special)", textJpEn: "A Luma launched far away with Luma Shot can attack while being called back. This can be used as a surprise attack or zoning tool against fighters approaching Rosalina.", titlePt: "Golpes de Retorno (Especial Neutro)", textPt: "Um Luma lançado para longe com o Luma Shot pode atacar enquanto é chamado de volta. Isso pode ser usado como um ataque surpresa ou ferramenta de controle de espaço contra lutadores se aproximando da Rosalina." },
  { titleEn: "[★☆☆] Star Bits (Side Special)", titleJp: "スターピース 【横必殺ワザ】", textJp: "チコがスターピースを発射して攻撃するワザ。スターピースは上中下の３方向へバラバラに飛ぶ。", titleJpEn: "Star Bits (Side Special)", textJpEn: "A move where Luma fires Star Bits to attack. The Star Bits scatter in three directions: up, middle, and down.", titlePt: "Star Bits (Especial Lateral)", textPt: "Um golpe em que o Luma dispara Star Bits para atacar. Os Star Bits se espalham em três direções: cima, meio e baixo." },
  { titleEn: "[★★☆] Launch Star (Up Special)", titleJp: "ギャラクシージャンプ 【上必殺ワザ】", textJp: "飛び上がる直前にロゼッタの後ろ方向に入力することで、真上に上昇することができる。復帰に高度が必要な時などに有効。", titleJpEn: "Launch Star (Up Special)", textJpEn: "Inputting the direction behind Rosalina right before launching lets her rise straight upward. Effective when height is needed for recovery.", titlePt: "Launch Star (Especial Cima)", textPt: "Inputar a direção atrás da Rosalina pouco antes de se lançar permite subir diretamente para cima. Eficaz quando altura é necessária para a recuperação." },
  { titleEn: "[★★☆] Gravitational Pull (Down Special)", titleJp: "アイテムキャプチャー 【下必殺ワザ】", textJp: "広い範囲の飛び道具を引き寄せられる。ネスが復帰に使うために出したPKサンダーを引き寄せるなど、使いどころによってはかなり強力。", titleJpEn: "Gravitational Pull (Down Special)", textJpEn: "Can pull in projectiles across a wide area. It can be quite powerful depending on when it's used, such as pulling in Ness's PK Thunder that he fired for recovery.", titlePt: "Gravitational Pull (Especial Baixo)", textPt: "Pode puxar projéteis em uma área ampla. Pode ser bem poderoso dependendo de quando é usado, como puxar o PK Thunder que o Ness disparou para se recuperar." },
  { titleEn: "[★☆☆] Pulling in Items (Down Special)", titleJp: "引き寄せたアイテム 【下必殺ワザ】", textJp: "引き寄せたアイテムを、手に持つことができる。アイテムにもなる飛び道具に対して、特に有効。", titleJpEn: "Pulling in Items (Down Special)", textJpEn: "A pulled-in item can be held in her hand. Especially effective against projectiles that can also become items.", titlePt: "Puxando Itens (Especial Baixo)", textPt: "Um item puxado pode ser segurado na mão dela. Especialmente eficaz contra projéteis que também podem se tornar itens." },
  { titleEn: "[★☆☆] Grand Star (Final Smash)", titleJp: "グランドスター 【最後の切りふだ】", textJp: "グランドスターが流星をばらまきながら、巨大化して最後に爆発する。流星に当たった相手は、グランドスターへ引き寄せられる。", titleJpEn: "Grand Star (Final Smash)", textJpEn: "The Grand Star scatters meteors while growing larger, then explodes at the end. Opponents hit by the meteors are pulled toward the Grand Star.", titlePt: "Grand Star (Final Smash)", textPt: "A Grand Star espalha meteoros enquanto cresce, depois explode no final. Adversários atingidos pelos meteoros são puxados em direção à Grand Star." },
  { titleEn: "[★☆☆] Controlling Luma", titleJp: "チコの操作", textJp: "ロゼッタが動けない時でも攻撃を出せるが、ロゼッタが投げられ中、ふっとばされた直後は出せない。", titleJpEn: "Controlling Luma", textJpEn: "Luma can attack even when Rosalina can't move, but not while Rosalina is being thrown or immediately after being launched.", titlePt: "Controlando o Luma", textPt: "O Luma pode atacar mesmo quando a Rosalina não pode se mover, mas não enquanto a Rosalina está sendo arremessada ou logo depois de ser arremessada." },
  { titleEn: "[★★☆] Luma Regeneration", titleJp: "チコが復活するまでの時間", textJp: "チコが復活するまでの時間は、相手ファイターの人数によって変わる。１対１の場合は長く、４人対戦の場合は短くなる。", titleJpEn: "Luma Regeneration", textJpEn: "The time it takes for Luma to respawn changes depending on the number of opposing fighters. It's longer in 1-on-1 matches and shorter in 4-player matches.", titlePt: "A Regeneração do Luma", textPt: "O tempo que leva para o Luma renascer muda dependendo do número de lutadores adversários. É mais longo em partidas 1 contra 1 e mais curto em partidas de 4 jogadores." },
  { titleEn: "[★★☆] Luma at Low Health", titleJp: "体力の少ないチコ", textJp: "チコの残り体力がわずかになると、うつむき、つかれた様子になる。この時、通常必殺ワザでロゼッタの元に戻ってくる速度は、遅くなる。", titleJpEn: "Luma at Low Health", textJpEn: "When Luma's remaining health gets low, it hangs its head and looks tired. At this point, the speed at which it returns to Rosalina via the neutral special slows down.", titlePt: "O Luma com Pouca Vida", textPt: "Quando a vida restante do Luma fica baixa, ele abaixa a cabeça e parece cansado. Nesse momento, a velocidade com que ele retorna à Rosalina pelo especial neutro diminui." },
  { titleEn: "[★☆☆] Luma's Reactions", titleJp: "チコの動き", textJp: "チコがそばにいる時、ロゼッタが相手をつかむとチコがおどりだす。ロゼッタが攻撃を受けると、チコは両手をバタバタさせてあわてる。", titleJpEn: "Luma's Reactions", textJpEn: "When Luma is nearby, it starts dancing if Rosalina grabs an opponent. If Rosalina takes damage, Luma flails its hands in panic.", titlePt: "As Reações do Luma", textPt: "Quando o Luma está por perto, ele começa a dançar se a Rosalina agarrar um adversário. Se a Rosalina receber dano, o Luma agita as mãos em pânico." },
];

async function main() {
  const rosalina = await db.fighter.findFirst({
    where: { name: { contains: "Rosalina" } },
    select: {
      id: true,
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!rosalina) { console.log("Rosalina & Luma not found"); return; }

  await db.fighter.update({
    where: { id: rosalina.id },
    data: {
      curatorOverviewEn: "Rosalina & Luma is a two-body fighter that doubles her offensive presence — Luma can be sent out to attack, latch onto opponents, or return while striking, effectively giving Rosalina a second set of hitboxes she can position independently. Gravitational Pull yanks in items and projectiles from a wide radius, and Launch Star provides flexible, adjustable recovery. Losing Luma temporarily weakens her considerably, so protecting it becomes a core part of the matchup. Rosalina & Luma rewards players who manage two bodies at once and use spacing to keep both safe.",
      curatorOverviewPt: "Rosalina & Luma é uma lutadora de dois corpos que duplica sua presença ofensiva — o Luma pode ser enviado para atacar, grudar em adversários ou retornar enquanto ataca, efetivamente dando à Rosalina um segundo conjunto de hitboxes que pode posicionar de forma independente. Gravitational Pull puxa itens e projéteis de um amplo raio, e Launch Star oferece uma recuperação flexível e ajustável. Perder o Luma a enfraquece consideravelmente por um tempo, então protegê-lo se torna uma parte fundamental do confronto. Rosalina & Luma recompensa jogadores que gerenciam dois corpos ao mesmo tempo e usam posicionamento para manter ambos seguros.",
      curatorOverviewJp: "ロゼッタ＆チコは、２つの体を持ち攻撃的な存在感を２倍にするファイターだ――チコは攻撃に出したり、相手にくっつけたり、攻撃しながら呼び戻したりでき、事実上ロゼッタに独立して配置できる２組目の判定を与える。アイテムキャプチャーは広い範囲からアイテムや飛び道具を引き寄せ、ギャラクシージャンプは柔軟で調整可能な復帰を提供する。チコを失うと一時的にかなり弱体化するため、チコを守ることが対戦の核心部分となる。ロゼッタ＆チコは、２つの体を同時に管理し、間合いを使って両方を安全に保つプレイヤーに応える。",
      curatorOverviewJpEn: "Rosalina & Luma is a two-body fighter who doubles her offensive presence — Luma can be sent out to attack, latch onto opponents, or return while striking, effectively giving Rosalina a second, independently positionable set of hitboxes. Gravitational Pull draws in items and projectiles from a wide area, and Launch Star provides flexible, adjustable recovery. Losing Luma weakens her considerably for a time, making protecting it central to the matchup. Rosalina & Luma rewards players who manage two bodies at once and use spacing to keep both of them safe.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  const move = rosalina.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Gravitational Pull\" is a special move that swings her wand to pull in all nearby items. It can even pull in items located behind pass-through platforms. \"Launch Star\" is an up special that launches her diagonally. It has no attacking ability, but its vertical and horizontal travel distance is long, giving it high recovery power. The direction of flight can also be adjusted to some degree. (Wii) Super Mario Galaxy (2007/11) (Wii U) Super Mario 3D World (2013/11)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Gravitational Pull\" é um golpe especial que balança sua varinha para puxar todos os itens próximos. Ele pode até puxar itens localizados atrás de plataformas atravessáveis. \"Launch Star\" é um especial cima que a lança na diagonal. Não tem capacidade de ataque, mas sua distância de deslocamento vertical e horizontal é longa, dando-lhe alto poder de recuperação. A direção do voo também pode ser ajustada até certo ponto. (Wii) Super Mario Galaxy (2007/11) (Wii U) Super Mario 3D World (2013/11)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = rosalina.tips.find(t => t.titleEn === data.titleEn);
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

  // Link orphaned SSB4 trophies, video timing — WiiU 09:47-09:58, 3DS 09:50-10:00
  const mainTrophy = await db.collectible.findFirst({ where: { name: "Rosalina & Luma", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true } });
  if (mainTrophy) {
    await db.collectible.update({ where: { id: mainTrophy.id }, data: { fighterId: rosalina.id, videoStartSec: 587, videoEndSec: 598, videoStartSec2: 590, videoEndSec2: 600 } });
    console.log("✅ \"Rosalina & Luma\" [SSB4]: linkado, vídeo -> WiiU 587-598, 3DS 590-600");
  }
  const altTrophy = await db.collectible.findFirst({ where: { name: "Rosalina & Luma (Alt.)", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true } });
  if (altTrophy) {
    await db.collectible.update({ where: { id: altTrophy.id }, data: { fighterId: rosalina.id } });
    console.log("✅ \"Rosalina & Luma (Alt.)\" [SSB4]: linkado (vídeo já era válido, mantido)");
  }

  await db.$disconnect();
}
main().catch(console.error);
