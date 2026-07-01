import { db } from "../../lib/db";

const SSB64_BIO_JP = "大きくまるいひとみがポイントの、ふうせんポケモン。ここちよい歌をうたい、聞くものをねむりにさそう。おこるとプクーッとふくれる。ふうせんポケモンなのでからだが軽く、かよわくてふっとびやすい。";
const SSB64_BIO_JPEN = "A Balloon Pokémon whose big, round eyes are its main feature. It sings a pleasant song that lulls listeners to sleep. When angered, it puffs up with a \"pu-KUU\" sound. Being a Balloon Pokémon, its body is light, frail, and prone to being sent flying.";
const SSB64_BIO_PT = "Um Pokémon Balão cujo principal destaque são seus grandes olhos redondos. Ele canta uma canção agradável que faz os ouvintes adormecerem. Quando irritado, ele se enche como um balão com um som de \"pu-KUU\". Por ser um Pokémon Balão, seu corpo é leve, frágil e propenso a ser arremessado.";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBB: {
    jpEn: "A Balloon Pokémon. It draws opponents in close with its big, round eyes, then sings a pleasant song that puts them to sleep. The secret behind the song's unfailing effectiveness lies in its wavelength — Jigglypuff can sing at whatever frequency makes its opponent sleepiest. It also possesses \"Attract Body,\" which infatuates anyone who touches it. Using a Moon Stone, it evolves into Wigglytuff.",
    pt: "Um Pokémon Balão. Ele atrai os adversários com seus grandes olhos redondos, depois canta uma canção agradável que os faz adormecer. O segredo por trás da eficácia infalível da canção está em seu comprimento de onda — Jigglypuff pode cantar em qualquer frequência que deixe o adversário com mais sono. Ele também possui o \"Corpo Sedutor\", que enfeitiça quem o toca. Usando uma Pedra Lunar, ele evolui para Wigglytuff.",
  },
  SSB4: {
    jpEn: "A Normal/Fairy-type Balloon Pokémon with the special skill of putting opponents to sleep with a soothing lullaby. In Smash Bros., its characteristics include being able to jump up to six times total and having outstanding aerial mobility. It performs best when fighting primarily in the air. Be careful, though — it gets launched offstage easily on a shield break, and its light weight makes it very easy to knock away.",
    pt: "Um Pokémon Balão do tipo Normal/Fada com a habilidade especial de fazer os adversários adormecerem com uma canção de ninar relaxante. Em Smash Bros., suas características incluem poder pular até seis vezes no total e ter uma mobilidade aérea excepcional. Ele tem melhor desempenho quando luta principalmente no ar. Cuidado, porém — ele é facilmente arremessado para fora do palco ao quebrar o escudo, e seu peso leve o torna muito fácil de ser arremessado.",
  },
  SSBM: {
    jpEn: "A Balloon Pokémon. It draws opponents in with its big, round eyes, sings a pleasant song, and puts them to sleep. When something upsets it, it puffs up like a balloon with a \"puu\" sound. It may look adorable at first glance, but it knows a wide variety of moves. Using a Moon Stone, it evolves into Wigglytuff.",
    pt: "Um Pokémon Balão. Ele atrai os adversários com seus grandes olhos redondos, canta uma canção agradável e os faz adormecer. Quando algo o incomoda, ele se enche como um balão com um som de \"puu\". Pode parecer adorável à primeira vista, mas conhece uma grande variedade de golpes. Usando uma Pedra Lunar, ele evolui para Wigglytuff.",
  },
  SSBU: {
    jpEn: "Regarding Jigglypuff as a fighter, see respectively: \"Jigglypuff (64),\" \"Jigglypuff (DX),\" \"Jigglypuff (X),\" \"Jigglypuff (3DS/Wii U),\" and \"Jigglypuff (SP).\"",
    pt: "Jigglypuff (プリン, Purin) é um personagem jogável em Super Smash Bros. Ultimate. Foi revelado junto com o colega lutador Pokémon Pichu e o restante dos veteranos em 12 de junho de 2018. Como em suas aparições anteriores a Super Smash Bros. for Wii U, ele é desbloqueável, em vez de estar disponível desde o início. Jigglypuff é classificado como Lutador #12, o último número de lutador dos veteranos originais do Super Smash Bros.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "Its regular attacks are frail and light, making it easy to send flying. However, it dances through the air with tremendous aerial control. Since mastering aerial combat is key to mastering Smash Bros., it's expected to shine a little. Rollout lets it spin at high speed and tackle opponents — watch out for self-destructing. Pound is good at chipping away shields and also helps with recovery. B: Rollout, Side+B: Pound",
    pt: "Seus ataques regulares são frágeis e leves, facilitando que seja arremessado. No entanto, ele dança pelo ar com um controle aéreo tremendo. Como dominar o combate aéreo é fundamental para dominar o Smash Bros., espera-se que ele se destaque um pouco. O Rollout permite girar em alta velocidade e investir contra os adversários — cuidado com a autodestruição. O Pound é bom para desgastar escudos e também ajuda na recuperação. B: Rollout, Lateral+B: Pound",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "Landing Sing can put an opponent to sleep. It has no effect on airborne opponents. Rest puts Jigglypuff itself into a deep sleep — but at the very instant it falls asleep, a powerful attack comes out from its center. If used skillfully while pressed against an opponent, it can send them flying a great distance. Jigglypuff's Final Smash. Up+B: Sing, Down+B: Rest",
    pt: "Acertar o Sing pode fazer um adversário adormecer. Não tem efeito em adversários no ar. O Rest faz o próprio Jigglypuff entrar em um sono profundo — mas no exato instante em que adormece, um ataque poderoso sai de seu centro. Se usado com habilidade enquanto pressionado contra um adversário, pode arremessá-lo por uma grande distância. O Final Smash do Jigglypuff. Cima+B: Sing, Baixo+B: Rest",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Rest is a Down Special that deals a devastating blow to an opponent, but leaves Jigglypuff itself in a deep sleep. When the move comes out, hitting an opponent with the center of its body sends them flying straight up with tremendous force. However, it's not easy to land, and even if it hits, it leaves a large opening afterward, making it tricky to use effectively. It also deals gradual damage to the opponent even after the hit. (GB) Pocket Monsters Red & Green (1996/02) (3DS) Pocket Monsters X & Y (2013/10)",
    pt: "Rest é um Especial Baixo que causa um golpe devastador em um adversário, mas deixa o próprio Jigglypuff em um sono profundo. Quando o movimento sai, acertar um adversário com o centro do corpo o arremessa direto para cima com força tremenda. Porém, não é fácil de acertar, e mesmo que acerte, deixa uma grande abertura depois, tornando difícil usá-lo com eficácia. Também causa dano gradual ao adversário mesmo após o impacto. (GB) Pocket Monsters Red & Green (1996/02) (3DS) Pocket Monsters X & Y (2013/10)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Jigglypuff's Origins", titleJp: "プリンの初登場作品", textJp: "プリンの初登場作品は１９９６年発売の『ポケットモンスター 赤・緑』。相手を心地よい歌で眠らせるのが得意なポケモン。", titleJpEn: "Jigglypuff's Origins", textJpEn: "Jigglypuff's debut was in \"Pocket Monsters Red & Green,\" released in 1996. It's a Pokémon skilled at putting opponents to sleep with a pleasant song.", titlePt: "As Origens do Jigglypuff", textPt: "O debut do Jigglypuff foi em \"Pocket Monsters Red & Green,\" lançado em 1996. É um Pokémon habilidoso em fazer os adversários adormecerem com uma canção agradável." },
  { titleEn: "[★☆☆] In Its Series", titleJp: "原作では", textJp: "『ポケットモンスター 赤・緑』から登場している、ふうせんポケモン。『ポケットモンスター X・Y』からは、新たなタイプ「フェアリー」が追加された。", titleJpEn: "In Its Series", textJpEn: "A Balloon Pokémon that has appeared since \"Pocket Monsters Red & Green.\" Starting with \"Pocket Monsters X & Y,\" it gained a new type: Fairy.", titlePt: "Na Série Original", textPt: "Um Pokémon Balão que aparece desde \"Pocket Monsters Red & Green.\" A partir de \"Pocket Monsters X & Y,\" ele ganhou um novo tipo: Fada." },
  { titleEn: "[★★☆] Rollout's Vulnerability (Neutral Special)", titleJp: "ころがるのスキ 【通常必殺ワザ】", textJp: "相手に当たると軽く跳ね上がり、その後は横にしか移動できなくなる。復帰に使う時は、空中で相手に当たらないように注意。", titleJpEn: "Rollout's Vulnerability (Neutral Special)", textJpEn: "When it hits an opponent, it bounces up slightly, and afterward can only move horizontally. When using it for recovery, be careful not to hit an opponent in the air.", titlePt: "A Vulnerabilidade do Rollout (Especial Neutro)", textPt: "Quando atinge um adversário, quica levemente para cima e, depois disso, só pode se mover horizontalmente. Ao usá-lo para recuperação, tome cuidado para não acertar um adversário no ar." },
  { titleEn: "[★☆☆] Turning with Rollout (Neutral Special)", titleJp: "ころがる状態でのターン 【通常必殺ワザ】", textJp: "地上で進行方向と逆に入力すれば、ターンすることができる。空中ではターンできないが、同じ操作で減速することは可能。", titleJpEn: "Turning with Rollout (Neutral Special)", textJpEn: "On the ground, inputting the opposite direction of travel lets you turn around. In the air, you can't turn, but the same input can slow you down.", titlePt: "Virando com o Rollout (Especial Neutro)", textPt: "No chão, inputar a direção oposta à do movimento permite virar. No ar, você não pode virar, mas o mesmo input pode desacelerá-lo." },
  { titleEn: "[★★☆] Pound (Side Special)", titleJp: "はたく 【横必殺ワザ】", textJp: "横に移動しつつ相手をはたく。空中では何回も出せるので、ジャンプと組み合わせれば、長く滞空できる。", titleJpEn: "Pound (Side Special)", textJpEn: "Moves sideways while slapping the opponent. In the air, it can be used multiple times, so combining it with jumps lets you stay airborne for a long time.", titlePt: "Pound (Especial Lateral)", textPt: "Move-se lateralmente enquanto bate no adversário. No ar, pode ser usado várias vezes, então combiná-lo com pulos permite ficar no ar por muito tempo." },
  { titleEn: "[★★☆] Using Pound (Side Special)", titleJp: "はたくの応用 【横必殺ワザ】", textJp: "相手のシールドに当てると大きく削ることができる。空中では、攻撃が出る前に上か下を入力すれば、移動方向をかすかに調節できる。", titleJpEn: "Using Pound (Side Special)", textJpEn: "Hitting an opponent's shield with it can chip away a large amount. In the air, inputting up or down before the attack comes out lets you slightly adjust the direction of movement.", titlePt: "Usando o Pound (Especial Lateral)", textPt: "Acertar o escudo de um adversário com ele pode desgastar bastante. No ar, inputar cima ou baixo antes do ataque sair permite ajustar levemente a direção do movimento." },
  { titleEn: "[★☆☆] Sing (Up Special)", titleJp: "うたう 【上必殺ワザ】", textJp: "地上にいる相手に歌を聴かせると、相手を眠らせる。相手の蓄積ダメージが多いほど眠る時間が長い。", titleJpEn: "Sing (Up Special)", textJpEn: "Making a grounded opponent hear the song puts them to sleep. The more accumulated damage the opponent has, the longer they stay asleep.", titlePt: "Sing (Especial Cima)", textPt: "Fazer um adversário no chão ouvir a canção o coloca para dormir. Quanto mais dano acumulado o adversário tiver, mais tempo ele fica dormindo." },
  { titleEn: "[★★☆] Pursue with Sing (Up Special)", titleJp: "うたうで追撃 【上必殺ワザ】", textJp: "空中でうたっている間、少しだけ左右に動くことができる。回避で逃げた相手を追いかけたり、ガケぎわギリギリの復帰で使ったり。", titleJpEn: "Pursue with Sing (Up Special)", textJpEn: "While singing in the air, you can move slightly left and right. Use it to chase an opponent who dodged away, or for a precise recovery right at the ledge.", titlePt: "Perseguindo com o Sing (Especial Cima)", textPt: "Enquanto canta no ar, você pode se mover levemente para a esquerda e direita. Use-o para perseguir um adversário que se esquivou, ou para uma recuperação precisa bem na borda." },
  { titleEn: "[★☆☆] Rest (Down Special)", titleJp: "ねむる 【下必殺ワザ】", textJp: "当てにくいが、うまく当てれば相手を強烈にふっとばせる。相手に密着したり、相手の攻撃に合わせて出すのがコツ。", titleJpEn: "Rest (Down Special)", textJpEn: "Hard to land, but if you connect well, it sends opponents flying powerfully. The trick is to use it pressed against an opponent, or timed with their attack.", titlePt: "Rest (Especial Baixo)", textPt: "Difícil de acertar, mas se conectar bem, arremessa os adversários poderosamente. O truque é usá-lo pressionado contra um adversário, ou cronometrado com o ataque dele." },
  { titleEn: "[★★☆] Rest Techniques (Down Special)", titleJp: "ねむるのテクニック 【下必殺ワザ】", textJp: "何かに当てれば、外した時よりも、少しだけ早く動くことができる。撃墜した相手から、反撃されづらくなるかも。", titleJpEn: "Rest Techniques (Down Special)", textJpEn: "If it connects with something, you can act slightly sooner than if it whiffs. This might make it harder for a KO'd opponent to retaliate.", titlePt: "Técnicas do Rest (Especial Baixo)", textPt: "Se conectar com algo, você pode agir um pouco mais cedo do que se errar. Isso pode dificultar que um adversário nocauteado retalie." },
  { titleEn: "[★★☆] Farewell Gift (Down Special)", titleJp: "お花で追加ダメージ 【下必殺ワザ】", textJp: "「ねむる」でふっとばした相手の頭には、お花が咲く。撃墜できなくても、お花による追加ダメージを与えられる。", titleJpEn: "Extra Damage from the Flower (Down Special)", textJpEn: "A flower blooms on the head of an opponent launched by Rest. Even if it doesn't KO them, the flower deals additional damage.", titlePt: "Dano Extra com a Flor (Especial Baixo)", textPt: "Uma flor desabrocha na cabeça de um adversário arremessado pelo Rest. Mesmo que não o nocauteie, a flor causa dano adicional." },
  { titleEn: "[★☆☆] Puff Up (Final Smash)", titleJp: "おおきくなる 【最後の切りふだ】", textJp: "その場でどんどん大きくなり、フィニッシュで相手を大きくふっとばす。ステージによっては逃げられやすいが、戦場など逃げ場の無いステージでは強力。", titleJpEn: "Growing Big (Final Smash)", textJpEn: "It keeps growing bigger on the spot, then sends opponents flying far with the finish. On some stages it's easy to escape, but on stages with nowhere to run, like Battlefield, it's very powerful.", titlePt: "Crescendo (Final Smash)", textPt: "Ele continua crescendo no lugar, depois arremessa os adversários para longe no final. Em alguns palcos é fácil escapar, mas em palcos sem lugar para fugir, como o Battlefield, é muito poderoso." },
  { titleEn: "[★★☆] Jiggly Split (Down Smash Attack)", titleJp: "りょうあしげり 【下スマッシュ攻撃】", textJp: "正面と後ろに同時に攻撃することができ、蹴り出した時の足は無敵状態。当たった相手を、横方向にふっとばす。", titleJpEn: "Double Kick (Down Smash Attack)", textJpEn: "It can attack both in front and behind at the same time, and the leg that kicks out becomes invincible. It sends any opponent it hits flying horizontally.", titlePt: "Chute Duplo (Ataque Smash Baixo)", textPt: "Pode atacar simultaneamente na frente e atrás, e a perna que chuta fica invencível. Arremessa horizontalmente qualquer adversário que atinge." },
  { titleEn: "[★☆☆] Jiggly Ram (Dash Attack)", titleJp: "ダイビング 【ダッシュ攻撃】", textJp: "蓄積ダメージが高い相手に当てれば、撃墜を狙える。ワザの後半を当てれば、シールドされても手痛い反撃は受けづらい。", titleJpEn: "Diving (Dash Attack)", textJpEn: "Hitting an opponent with high accumulated damage can go for a KO. If you connect with the latter part of the move, even if shielded, you're less likely to take a painful counterattack.", titlePt: "Mergulho (Ataque em Disparada)", textPt: "Acertar um adversário com dano acumulado alto pode buscar um KO. Se conectar com a parte final do movimento, mesmo que bloqueado, é menos provável sofrer um contra-ataque doloroso." },
  { titleEn: "[★★☆] Shield", titleJp: "シールド", textJp: "プリンがシールドブレイクすると、蓄積ダメージに関係なくとても高く上にふっとぶ。天井がないとミスになってしまうほど。", titleJpEn: "Shield", textJpEn: "When Jigglypuff's shield breaks, it flies extremely high upward regardless of accumulated damage — enough that without a ceiling, it can result in a self-destruct.", titlePt: "Escudo", textPt: "Quando o escudo do Jigglypuff quebra, ele voa extremamente alto para cima independentemente do dano acumulado — o suficiente para que, sem um teto, possa resultar em uma autodestruição." },
  { titleEn: "[★☆☆] Aerial Expert", titleJp: "得意分野は空中戦", textJp: "空中では５回ジャンプできるうえ、地上を走るよりずっと早く移動できる。相手を浮かせるなどして、自分に有利な状況で戦おう。", titleJpEn: "Aerial Expert", textJpEn: "It can jump five times in the air, and moves much faster in the air than running on the ground. Launch opponents into the air and fight under conditions that favor you.", titlePt: "Especialista Aéreo", textPt: "Pode pular cinco vezes no ar, e se move muito mais rápido no ar do que correndo no chão. Lance os adversários no ar e lute em condições que o favoreçam." },
];

async function main() {
  const jiggs = await db.fighter.findFirst({
    where: { name: "Jigglypuff" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true, contentJp: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!jiggs) { console.log("Jigglypuff not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: jiggs.id },
    data: {
      curatorOverviewEn: "Jigglypuff, the Balloon Pokémon, has been a Smash Bros. staple since the very first game — despite its adorable, harmless appearance. Master of aerial mobility with up to six jumps, its Rollout, Pound, and devastating Rest give it real KO power, but its featherweight frame means it can be launched by nearly anything. Success with Jigglypuff means staying airborne and picking your moments.",
      curatorOverviewPt: "Jigglypuff, o Pokémon Balão, é presença constante no Smash Bros. desde o primeiro jogo — apesar de sua aparência adorável e inofensiva. Mestre da mobilidade aérea com até seis pulos, seus golpes Rollout, Pound e o devastador Rest lhe dão poder real de KO, mas seu corpo leve como pena significa que pode ser arremessado por quase qualquer coisa. O sucesso com Jigglypuff significa permanecer no ar e escolher bem seus momentos.",
      curatorOverviewJp: "ふうせんポケモン、プリンは、そのかわいらしく無害な見た目にもかかわらず、初代スマブラからシリーズの常連ファイター。最大６回のジャンプによる優れた空中機動力を武器に、「ころがる」「はたく」、そして強烈な「ねむる」で確かな撃墜力を持つ。しかし羽毛のように軽い体は、ほとんどどんな攻撃でもふっとばされてしまう。プリンで勝つ鍵は、空中に留まり、タイミングを見極めることだ。",
      curatorOverviewJpEn: "Jigglypuff, the Balloon Pokémon, has been a series regular since the original Smash Bros. — despite its cute, harmless appearance. Armed with excellent aerial mobility from up to six jumps, Rollout, Pound, and a devastating Rest give it real KO power. However, its feather-light body means it can be sent flying by almost any attack. The key to winning with Jigglypuff is staying airborne and picking your timing.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Fix SSB64 bio JP
  const bio64 = jiggs.bios.find(b => b.smashGameVersion === "SSB64");
  if (bio64 && (!bio64.contentJp || bio64.contentJp === "NOT FOUND")) {
    await db.fighterBio.update({ where: { id: bio64.id }, data: { contentJp: SSB64_BIO_JP, contentJpEn: SSB64_BIO_JPEN, contentPt: SSB64_BIO_PT } });
    console.log("✅ Bio SSB64: JP+JpEn+PT adicionados");
  }

  // Add PT+JpEn for SSBB/SSB4/SSBM/SSBU
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = jiggs.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 4450-4488 -> 2541-2559 (42:21-42:39 ZoomZike VLC confirmed)
  const bioSsbm = jiggs.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 2541, videoEndSec: 2559 } });
    console.log("✅ Bio SSBM video: 4450-4488 -> 2541-2559 (42:21-42:39)");
  }

  // Fix Trophy "Jigglypuff" SSBM to match
  const trophy = await db.collectible.findFirst({ where: { name: "Jigglypuff", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true } });
  if (trophy) {
    await db.collectible.update({ where: { id: trophy.id }, data: { videoStartSec: 2541, videoEndSec: 2559 } });
    console.log("✅ Trophy Jigglypuff SSBM: -> 2541-2559");
  }

  // Moves EN+PT+JpEn
  for (const m of jiggs.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = jiggs.tips.find(t => t.titleEn === data.titleEn);
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
