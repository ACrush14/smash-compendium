import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "National Pokédex No. 150, a Psychic-type \"Genetic Pokémon.\" Created by a single scientist based on the genes of the Mythical Pokémon \"Mew.\" Most of its genes are shared with Mew, but its combat power has been pushed to the extreme, making it vastly different from Mew in both appearance and personality. It's said to think of nothing but defeating enemies and to possess the most savage heart of any Pokémon; when not fighting, it remains completely still, conserving its power. According to the research journal readable in the \"Pokémon Mansion\" in \"Pocket Monsters Red & Green,\" its birthday is February 6th.",
    pt: "No. 150 da Pokédex Nacional, um \"Pokémon Genético\" do tipo Psíquico. Criado por um único cientista com base nos genes do Pokémon Mítico \"Mew.\" A maior parte de seus genes é compartilhada com o Mew, mas seu poder de combate foi levado ao extremo, tornando-o muito diferente do Mew tanto em aparência quanto em personalidade. Diz-se que só pensa em derrotar inimigos e possui o coração mais selvagem de todos os Pokémon; quando não está lutando, permanece completamente imóvel, conservando seu poder. Segundo o diário de pesquisa que pode ser lido na \"Mansão Pokémon\" em \"Pocket Monsters Red & Green,\" seu aniversário é 6 de fevereiro.",
  },
  SSBB: {
    jpEn: "A Genetic Pokémon. Created by human hands after a single scientist spent many years recombining the genes of the Mythical Pokémon Mew. However, it differs greatly from the original Mew in both size and personality, and is said to possess the most savage heart of any Pokémon. Its combat abilities are considerable, and it uses Psychic-type moves.",
    pt: "Um Pokémon Genético. Criado por mãos humanas depois que um único cientista passou muitos anos recombinando os genes do Pokémon Mítico Mew. Porém, difere muito do Mew original tanto em tamanho quanto em personalidade, e diz-se que possui o coração mais selvagem de todos os Pokémon. Suas habilidades de combate são consideráveis, e usa golpes do tipo Psíquico.",
  },
  SSB4: {
    jpEn: "A Pokémon whose combat abilities were pushed to the extreme by manipulating the genes of the Mythical Pokémon \"Mew.\" It's said that Mew's gentle, calm heart was not passed on, and that its high intelligence is used only for defeating enemies. But is that really true? Might there not be an anguish etched into its expression, deeper even than that of the humans who created it...?",
    pt: "Um Pokémon cujas habilidades de combate foram levadas ao extremo pela manipulação dos genes do Pokémon Mítico \"Mew.\" Diz-se que o coração gentil e calmo do Mew não foi transmitido, e que sua alta inteligência é usada apenas para derrotar inimigos. Mas será mesmo verdade? Não haveria uma angústia gravada em sua expressão, mais profunda até do que a dos humanos que o criaram...?",
  },
  SSBM: {
    jpEn: "A Genetic Pokémon. Said to have been created from the genes of the Mythical Pokémon \"Mew\" through many years of research by a single scientist. That said, it differs greatly from Mew in both size and personality, and its combat abilities have been enhanced.",
    pt: "Um Pokémon Genético. Dito ter sido criado a partir dos genes do Pokémon Mítico \"Mew\" através de muitos anos de pesquisa de um único cientista. Dito isso, difere muito do Mew tanto em tamanho quanto em personalidade, e suas habilidades de combate foram aprimoradas.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "Because it uses powerful ESP, it often barely uses its own limbs at all. Its body is large, but since it floats in the air, it's easy to launch. Shadow Ball travels along a distinctive trajectory. Charging it increases its power. Confusion controls an opponent and slams them into the ground. B: Shadow Ball, Side+B: Confusion",
    pt: "Por usar PES poderoso, muitas vezes mal utiliza os próprios membros. Seu corpo é grande, mas como flutua no ar, é fácil de arremessar. O Shadow Ball percorre uma trajetória distinta. Carregá-lo aumenta seu poder. O Confusion controla um adversário e o arremessa contra o chão. B: Shadow Ball, Lateral+B: Confusion",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "Mewtwo's movement is never quick, but its ESP-based throwing moves are relatively strong. Teleport has a short travel distance in exchange for a small opening. It's reliable when used to confuse opponents. Disable is an unusual move that stuns an opponent by locking eyes with Mewtwo. It doesn't work at all against an opponent facing the opposite direction. Up+B: Teleport, Down+B: Disable",
    pt: "O movimento do Mewtwo nunca é rápido, mas seus golpes de arremesso baseados em PES são relativamente fortes. O Teleport tem uma distância de deslocamento curta em troca de uma pequena abertura. É confiável quando usado para confundir os adversários. O Disable é um golpe incomum que atordoa um adversário ao cruzar o olhar com o Mewtwo. Não funciona de jeito nenhum contra um adversário virado para a direção oposta. Cima+B: Teleport, Baixo+B: Disable",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "The Side Special, Confusion, is a special grab move that combines the properties of reflection and throwing. A reflected projectile not only changes direction — it's also treated as Mewtwo's own attack. The stun duration from the Down Special, Disable, grows longer the more accumulated damage the opponent has. Since it's an attack delivered with an intense glare, it has no effect on an opponent whose back is turned. (GB) Pocket Monsters Red & Green (1996/02) (3DS) Pocket Monsters X & Y (2013/10)",
    pt: "O Especial Lateral, Confusion, é um golpe especial de agarrão que combina as propriedades de reflexão e arremesso. Um projétil refletido não apenas muda de direção — também é tratado como um ataque do próprio Mewtwo. A duração do atordoamento do Especial Baixo, Disable, cresce quanto maior for o dano acumulado do adversário. Como é um ataque entregue com um olhar intenso, não tem efeito em um adversário que está de costas. (GB) Pocket Monsters Red & Green (1996/02) (3DS) Pocket Monsters X & Y (2013/10)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Mewtwo's Origins", titleJp: "ミュウツーの初登場作品", textJp: "『ポケットモンスター 赤・緑』にて初登場。ポケモンリーグを制覇したトレーナーが、ハナダシティの洞窟で出会えた。", titleJpEn: "Mewtwo's Origins", textJpEn: "First appeared in \"Pocket Monsters Red & Green.\" Trainers who conquered the Pokémon League could encounter it in a cave near Cerulean City.", titlePt: "As Origens do Mewtwo", textPt: "Apareceu pela primeira vez em \"Pocket Monsters Red & Green.\" Treinadores que conquistaram a Liga Pokémon podiam encontrá-lo em uma caverna perto de Cerulean City." },
  { titleEn: "[★☆☆] In Its Series", titleJp: "原作では", textJp: "幻のポケモン「ミュウ」の遺伝子を、組みかえて生み出されたポケモン。戦闘能力がとても高く、ポケモンの中で一番凶暴な心を持つという。", titleJpEn: "In Its Series", textJpEn: "A Pokémon created by recombining the genes of the Mythical Pokémon \"Mew.\" Its combat ability is extremely high, and it's said to possess the most savage heart of any Pokémon.", titlePt: "Na Série Original", textPt: "Um Pokémon criado pela recombinação dos genes do Pokémon Mítico \"Mew.\" Sua habilidade de combate é extremamente alta, e diz-se que possui o coração mais selvagem de todos os Pokémon." },
  { titleEn: "[★☆☆] Mega Mewtwo Y", titleJp: "メガミュウツーY", textJp: "最後の切りふだで、ミュウツーがメガシンカした姿。原作では「ミュウツナイトY」を持っていると、メガシンカできる。", titleJpEn: "Mega Mewtwo Y", textJpEn: "The form Mewtwo takes through Mega Evolution during its Final Smash. In the original games, holding the \"Mewtwonite Y\" allows it to Mega Evolve.", titlePt: "Mega Mewtwo Y", textPt: "A forma que o Mewtwo assume através da Mega Evolução durante seu Final Smash. Nos jogos originais, portar a \"Mewtwonita Y\" permite a Mega Evolução." },
  { titleEn: "[★☆☆] Charging Shadow Ball (Neutral Special)", titleJp: "シャドーボールのため 【通常必殺ワザ】", textJp: "ためるほど威力が強くなるが、発射時の反動も大きくなる。特に空中で最大ためで放つと、かなり大きく後ずさりする。", titleJpEn: "Charging Shadow Ball (Neutral Special)", textJpEn: "The longer it's charged, the stronger it becomes, but the recoil upon firing also increases. Firing it at maximum charge in the air in particular causes a considerable backward recoil.", titlePt: "Carregando o Shadow Ball (Especial Neutro)", textPt: "Quanto mais tempo é carregado, mais forte fica, mas o recuo ao disparar também aumenta. Disparar na carga máxima no ar em particular causa um recuo considerável para trás." },
  { titleEn: "[★★☆] Holding Charge on Shadow Ball (Neutral Special)", titleJp: "シャドーボールの維持 【通常必殺ワザ】", textJp: "最大までためても自動でワザが終わらない。シールドボタンでワザをキャンセルすると、ためを維持したまま行動できる。", titleJpEn: "Holding Charge on Shadow Ball (Neutral Special)", textJpEn: "The move doesn't end automatically even when charged to maximum. Canceling it with the shield button lets Mewtwo act while retaining the charge.", titlePt: "Mantendo a Carga do Shadow Ball (Especial Neutro)", textPt: "O movimento não termina automaticamente mesmo quando carregado ao máximo. Cancelá-lo com o botão de escudo permite que o Mewtwo aja mantendo a carga." },
  { titleEn: "[★☆☆] Confusion (Side Special)", titleJp: "ねんりき 【横必殺ワザ】", textJp: "前方の相手を超能力でひっくりかえす、特殊なつかみワザ。飛び道具の向きを変えて、相手に送り返すこともできる。", titleJpEn: "Confusion (Side Special)", textJpEn: "A special grab move that flips an opponent in front using psychic power. It can also change the direction of a projectile and send it back at an opponent.", titlePt: "Confusion (Especial Lateral)", textPt: "Um golpe especial de agarrão que vira um adversário à frente usando poder psíquico. Também pode mudar a direção de um projétil e enviá-lo de volta a um adversário." },
  { titleEn: "[★★☆] Confusion's Traits (Side Special)", titleJp: "ねんりきの特性 【横必殺ワザ】", textJp: "ひっくりかえされた相手が動けるようになるまでの時間は、蓄積ダメージが多いほど長くなるため、追撃を狙える場合もある。", titleJpEn: "Confusion's Traits (Side Special)", textJpEn: "The time before a flipped opponent can move again grows longer the more accumulated damage they have, so it's sometimes possible to go for a follow-up.", titlePt: "As Características do Confusion (Especial Lateral)", textPt: "O tempo antes que um adversário virado possa se mover novamente aumenta quanto mais dano acumulado ele tiver, então às vezes é possível buscar um acompanhamento." },
  { titleEn: "[★☆☆] Teleport (Up Special)", titleJp: "テレポート 【上必殺ワザ】", textJp: "姿を消して、一瞬で離れた位置にワープする。ワープ中、姿を消している間は完全な無敵状態になる。", titleJpEn: "Teleport (Up Special)", textJpEn: "Vanishes and instantly warps to a distant position. While invisible during the warp, it's completely invincible.", titlePt: "Teleport (Especial Cima)", textPt: "Desaparece e teleporta instantaneamente para uma posição distante. Enquanto invisível durante o teleporte, fica completamente invencível." },
  { titleEn: "[★★☆] Teleport Landing Position (Up Special)", titleJp: "テレポートの着地場所 【上必殺ワザ】", textJp: "ワープが終わった時に地上にいるとピタッと止まるが、空中にいると少しだけ速度を引きつぐ。", titleJpEn: "Teleport Landing Position (Up Special)", textJpEn: "If it's on the ground when the warp ends, it stops instantly, but if it's in the air, it retains a bit of momentum.", titlePt: "Posição de Pouso do Teleport (Especial Cima)", textPt: "Se estiver no chão quando o teleporte termina, para instantaneamente, mas se estiver no ar, mantém um pouco de impulso." },
  { titleEn: "[★★☆] Teleport's Traits (Up Special)", titleJp: "テレポートの特性 【上必殺ワザ】", textJp: "ワープ中に地形に当たると、滑って移動する。方向入力で移動先を変えられるので、うまく調節しよう。", titleJpEn: "Teleport's Traits (Up Special)", textJpEn: "If it hits terrain during the warp, it slides along it. The destination can be adjusted with directional input, so use it to fine-tune your positioning.", titlePt: "As Características do Teleport (Especial Cima)", textPt: "Se atingir o terreno durante o teleporte, desliza ao longo dele. O destino pode ser ajustado com o input direcional, então use isso para ajustar seu posicionamento." },
  { titleEn: "[★☆☆] Disable (Down Special)", titleJp: "かなしばり 【下必殺ワザ】", textJp: "相手の蓄積ダメージが高いほど気絶させる時間が長くなる。反射されると、自分が気絶してしまうので注意しよう。", titleJpEn: "Disable (Down Special)", textJpEn: "The higher the opponent's accumulated damage, the longer they're stunned. Be careful — if it's reflected, Mewtwo itself gets stunned instead.", titlePt: "Disable (Especial Baixo)", textPt: "Quanto maior o dano acumulado do adversário, mais tempo ele fica atordoado. Cuidado — se for refletido, o próprio Mewtwo fica atordoado." },
  { titleEn: "[★★☆] Warnings for Disable (Down Special)", titleJp: "かなしばりの注意点 【下必殺ワザ】", textJp: "強烈な眼力で相手を気絶させる特殊なワザ。背中を向けている相手には、効果が無いので注意しよう。", titleJpEn: "Warnings for Disable (Down Special)", textJpEn: "A special move that stuns opponents with an intense glare. Watch out — it has no effect on an opponent whose back is turned.", titlePt: "Cuidados com o Disable (Especial Baixo)", textPt: "Um golpe especial que atordoa os adversários com um olhar intenso. Cuidado — não tem efeito em um adversário que está de costas." },
  { titleEn: "[★★★] Disable Techniques (Down Special)", titleJp: "かなしばりのテクニック 【下必殺ワザ】", textJp: "ワザをくり出す直前、一瞬だけ無敵になるため、相手の攻撃を避けられる。相手が攻撃しようとした時、すかさず出すと強力。", titleJpEn: "Disable Techniques (Down Special)", textJpEn: "Right before the move comes out, it's briefly invincible, letting it dodge an opponent's attack. Using it the instant an opponent tries to attack is very powerful.", titlePt: "Técnicas do Disable (Especial Baixo)", textPt: "Bem antes do movimento sair, fica brevemente invencível, permitindo esquivar do ataque de um adversário. Usá-lo no instante em que um adversário tenta atacar é muito poderoso." },
  { titleEn: "[★☆☆] Psystrike (Final Smash)", titleJp: "サイコブレイク 【最後の切りふだ】", textJp: "メガミュウツーYにメガシンカして放つ弾は、地形や相手を貫通する。触れた相手は動きを封じられ、ダメージを与える精神攻撃でふっとばされる。", titleJpEn: "Psystrike (Final Smash)", textJpEn: "Mega Evolving into Mega Mewtwo Y, the projectile it fires pierces through terrain and opponents. Any opponent touched has their movement locked and is launched by a damaging mental attack.", titlePt: "Psystrike (Final Smash)", textPt: "Ao Mega Evoluir para Mega Mewtwo Y, o projétil disparado atravessa terreno e adversários. Qualquer adversário tocado tem seu movimento travado e é arremessado por um ataque mental que causa dano." },
  { titleEn: "[★☆☆] Tail Sweep (Down Tilt Attack)", titleJp: "アンダースラップ 【下強攻撃】", textJp: "先端と根本を当てた時で、相手のふっとぶ方向が変化する。うまく相手を浮かせる方向を調節して、追撃を狙おう。", titleJpEn: "Undersweep (Down Tilt Attack)", textJpEn: "The direction an opponent is launched changes depending on whether they're hit by the tip or the base. Adjust the launch direction skillfully and aim for a follow-up.", titlePt: "Undersweep (Ataque Inclinado Baixo)", textPt: "A direção em que um adversário é arremessado muda dependendo se é atingido pela ponta ou pela base. Ajuste habilmente a direção de lançamento e busque um acompanhamento." },
  { titleEn: "[★☆☆] Shadow Blast (Side Smash Attack)", titleJp: "シャドーブラスト 【横スマッシュ攻撃】", textJp: "根本で当てるよりも、先端で当てる方が威力が大きい。使いどころを見極めて、先端の衝撃波を当てていこう。", titleJpEn: "Shadow Blast (Side Smash Attack)", textJpEn: "It deals more damage when it connects with the tip rather than the base. Time it well to land the shockwave at the tip.", titlePt: "Shadow Blast (Ataque Smash Lateral)", textPt: "Causa mais dano quando conecta com a ponta em vez da base. Cronometre bem para acertar a onda de choque na ponta." },
  { titleEn: "[★☆☆] Galaxy Force (Up Smash Attack)", titleJp: "ギャラクシーフォース 【上スマッシュ攻撃】", textJp: "ワザの出始めから当てると、連続ヒットによって相手が抜け出しづらく、最後の１発まで当たりやすい。", titleJpEn: "Galaxy Force (Up Smash Attack)", textJpEn: "Landing it from the very start of the move makes it hard for the opponent to escape the multiple hits, making it easy to land the final blow too.", titlePt: "Galaxy Force (Ataque Smash Cima)", textPt: "Acertá-lo bem no início do movimento dificulta a fuga do adversário dos múltiplos golpes, tornando fácil acertar também o golpe final." },
  { titleEn: "[★☆☆] Shadow Bomb (Down Smash Attack)", titleJp: "シャドーボム 【下スマッシュ攻撃】", textJp: "足先方向にしか判定がなくダメージもあまり大きくないが、その分、ふっとばし力がとても大きい。", titleJpEn: "Shadow Bomb (Down Smash Attack)", textJpEn: "The hitbox only covers the direction of its feet and its damage isn't very high, but in exchange, its knockback is very strong.", titlePt: "Shadow Bomb (Ataque Smash Baixo)", textPt: "A hitbox cobre apenas a direção dos pés e seu dano não é muito alto, mas em troca, seu poder de arremesso é muito forte." },
  { titleEn: "[★☆☆] Body Spark (Neutral Air Attack)", titleJp: "ボディスパーク 【通常空中攻撃】", textJp: "威力は低いが、後ろ方向にも判定があり連続ヒットする。うまく当てると、最後に相手を軽くふっとばす。", titleJpEn: "Body Spark (Neutral Air Attack)", textJpEn: "Its power is low, but it also has a hitbox behind Mewtwo and hits multiple times. Landing it well sends the opponent flying lightly at the end.", titlePt: "Body Spark (Ataque Aéreo Neutro)", textPt: "Seu poder é baixo, mas também tem uma hitbox atrás do Mewtwo e acerta múltiplas vezes. Acertá-lo bem arremessa levemente o adversário no final." },
  { titleEn: "[★☆☆] Shadow Scratch (Forward Air Attack)", titleJp: "シャドースクラッチ 【前空中攻撃】", textJp: "リーチは短いが、ワザの出が速く空中の相手を狙いやすい。ふっとばし力も高く、登り攻撃で繰り出せば非常に強力。", titleJpEn: "Shadow Scratch (Forward Air Attack)", textJpEn: "Its reach is short, but it comes out quickly, making it easy to aim at airborne opponents. Its knockback is also high, making it very powerful when used as a rising attack.", titlePt: "Shadow Scratch (Ataque Aéreo Frontal)", textPt: "Seu alcance é curto, mas sai rapidamente, tornando fácil mirar em adversários no ar. Seu arremesso também é alto, tornando-o muito poderoso quando usado como um ataque ascendente." },
  { titleEn: "[★☆☆] Shadow Cannon (Forward Throw)", titleJp: "シャドーマシンガン 【前投げ】", textJp: "相手を放り投げて、「シャドーボール」を５連射する。１発の弾のダメージは低いが、相手を貫通して飛んでいく。", titleJpEn: "Shadow Machine Gun (Forward Throw)", textJpEn: "Throws the opponent, then fires five rapid Shadow Balls. Each shot deals low damage, but they pierce through the opponent as they travel.", titlePt: "Shadow Machine Gun (Arremesso Frontal)", textPt: "Arremessa o adversário, depois dispara cinco Shadow Balls rápidos. Cada disparo causa baixo dano, mas atravessam o adversário enquanto viajam." },
  { titleEn: "[★★☆] Psychic Whirlwind (Up Throw)", titleJp: "ワールスルー 【上投げ】", textJp: "全ファイターの投げワザの中で、トップクラスのふっとばし力を誇る。天井がない状況では、特に有効。", titleJpEn: "Whirl Through (Up Throw)", textJpEn: "It boasts some of the strongest knockback among all fighters' throws. It's especially effective in situations without a ceiling.", titlePt: "Whirl Through (Arremesso Cima)", textPt: "Possui um dos poderes de arremesso mais fortes entre todos os arremessos dos lutadores. É especialmente eficaz em situações sem teto." },
  { titleEn: "[★☆☆] Mewtwo's Launchability", titleJp: "ミュウツーのふっとびやすさ", textJp: "見た目に反してとても軽く、ふっとびやすい。攻撃ばかりでなく、守り方や避け方も重要。", titleJpEn: "Mewtwo's Launchability", textJpEn: "Despite its appearance, it's very light and easy to launch. Not just offense — how it defends and dodges matters just as much.", titlePt: "A Facilidade de Arremesso do Mewtwo", textPt: "Apesar de sua aparência, é muito leve e fácil de arremessar. Não só o ataque — como ele se defende e se esquiva importa igualmente." },
];

async function main() {
  const mt = await db.fighter.findFirst({
    where: { name: "Mewtwo" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!mt) { console.log("Mewtwo not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: mt.id },
    data: {
      curatorOverviewEn: "Mewtwo, the genetically engineered psychic Pokémon, is Smash's premier zoning fighter — floaty jumps, long-reaching telekinetic grabs, and a chargeable Shadow Ball let it control space from a distance most fighters can't match. Its featherweight, oversized frame makes it exceptionally easy to launch, demanding careful spacing and defensive discipline to offset its raw psychic power.",
      curatorOverviewPt: "Mewtwo, o Pokémon psíquico geneticamente criado, é o principal lutador de controle de espaço do Smash — saltos flutuantes, agarrões telecinéticos de longo alcance e um Shadow Ball carregável permitem controlar a distância como poucos outros lutadores conseguem. Seu corpo leve e superdimensionado o torna excepcionalmente fácil de arremessar, exigindo posicionamento cuidadoso e disciplina defensiva para compensar seu poder psíquico bruto.",
      curatorOverviewJp: "遺伝子操作によって生まれたエスパーポケモン、ミュウツーは、スマブラ屈指のゾーニング系ファイター――浮遊感のあるジャンプ、長い間合いを誇る念力のつかみワザ、そしてためられるシャドーボールにより、他の多くのファイターにはできない距離での空間支配が可能だ。羽根のように軽く大柄な体は非常にふっとびやすいため、その生の念力を活かすには慎重な間合い管理と防御の徹底が求められる。",
      curatorOverviewJpEn: "Mewtwo, the genetically engineered psychic Pokémon, is one of Smash's premier zoning fighters — floaty jumps, long-reaching psychic grab moves, and a chargeable Shadow Ball let it control space at a distance most other fighters can't match. Its feather-light, oversized body is extremely easy to launch, requiring careful spacing and thorough defense to make the most of its raw psychic power.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = mt.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 4708-4747 -> 2788-2807 (46:28-46:47 ZoomZike VLC confirmed)
  const bioSsbm = mt.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 2788, videoEndSec: 2807 } });
    console.log("✅ Bio SSBM video: 4708-4747 -> 2788-2807 (46:28-46:47)");
  }

  // Fix Trophy "Mewtwo" SSBM to match
  const meleeTrophy = await db.collectible.findFirst({ where: { name: "Mewtwo", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (meleeTrophy) {
    await db.collectible.update({ where: { id: meleeTrophy.id }, data: { videoStartSec: 2788, videoEndSec: 2807 } });
    console.log(`✅ Trophy Mewtwo SSBM: ${meleeTrophy.videoStartSec}-${meleeTrophy.videoEndSec} -> 2788-2807`);
  }

  // Fix orphaned SSBB Trophy (fighterId was null) + timing: 6476-6498 (1:47:56-1:48:18 VLC confirmed)
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "Mewtwo", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, fighterId: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { fighterId: mt.id, videoStartSec: 6476, videoEndSec: 6498 } });
    console.log(`✅ SSBB Trophy Mewtwo: fighterId linkado (era null) + timing ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} -> 6476-6498 (1:47:56-1:48:18)`);
  }

  // Fix SSB4 primary (Wii U) video: 3889-3899 (1:04:49-1:04:59 VLC confirmed)
  const ssb4Main = await db.collectible.findFirst({ where: { name: "Mewtwo", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true } });
  if (ssb4Main) {
    await db.collectible.update({ where: { id: ssb4Main.id }, data: { videoStartSec: 3889, videoEndSec: 3899, videoStartSec2: 3395, videoEndSec2: 3407 } });
    console.log(`✅ SSB4 Trophy "Mewtwo": primário -> 3889-3899 (WiiU), secundário -> 3395-3407 (3DS, corrompido antes: ${ssb4Main.videoStartSec2}-${ssb4Main.videoEndSec2})`);
  }

  // Fix corrupted SSB4 "Mewtwo (Alt.)" secondary field
  const ssb4Alt = await db.collectible.findFirst({ where: { name: "Mewtwo (Alt.)", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (ssb4Alt && ssb4Alt.videoStartSec2 != null) {
    await db.collectible.update({ where: { id: ssb4Alt.id }, data: { videoEndSec2: ssb4Alt.videoStartSec2 + 12 } });
    console.log(`✅ SSB4 Trophy "Mewtwo (Alt.)" secundário: videoEndSec2 corrompido -> ${ssb4Alt.videoStartSec2 + 12} (12s de duração, seguindo padrão do par principal)`);
  }

  // Moves EN+PT+JpEn
  for (const m of mt.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = mt.tips.find(t => t.titleEn === data.titleEn);
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
