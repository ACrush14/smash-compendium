import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "The princess of Hyrule who appears in \"The Legend of Zelda\" series. She appears in nearly every game, but like Link, each incarnation is generally a completely different person. As revealed in \"Skyward Sword,\" her true identity was once the goddess Hylia, who protected the world of Hyrule; since divine beings cannot wield the Triforce, she reincarnated as the human Zelda in order to use it to defeat the Demon King leading the forces of destruction. The Zeldas in each series are all continued reincarnations of the goddess Hylia's soul, each carrying important duties such as protecting the Triforce. In other words, they are the same being in terms of soul — this is a major difference from Link.",
    pt: "A princesa de Hyrule que aparece na série \"The Legend of Zelda.\" Ela aparece em quase todos os jogos, mas assim como o Link, cada encarnação é geralmente uma pessoa completamente diferente. Como revelado em \"Skyward Sword,\" sua verdadeira identidade foi um dia a deusa Hylia, que protegia o mundo de Hyrule; como seres divinos não podem empunhar a Triforce, ela reencarnou como a humana Zelda para poder usá-la e derrotar o Rei Demônio que lidera as forças da destruição. As Zeldas em cada jogo são todas reencarnações contínuas da alma da deusa Hylia, cada uma carregando deveres importantes como proteger a Triforce. Em outras palavras, elas são o mesmo ser em termos de alma — esta é uma grande diferença em relação ao Link.",
  },
  SSBB: {
    jpEn: "The princess of the kingdom of Hyrule. Aside from this, her setting varies slightly from game to game. In \"Ocarina of Time,\" she's targeted by Ganondorf, who seeks to seize control of the world. However, she deceives Ganondorf by transforming into a different person, Sheik. In \"Twilight Princess,\" she surrenders to Zant, who has invaded Hyrule, and becomes his prisoner.",
    pt: "A princesa do reino de Hyrule. Além disso, seu contexto varia ligeiramente de jogo para jogo. Em \"Ocarina of Time,\" ela é alvo de Ganondorf, que busca tomar controle do mundo. Porém, ela engana Ganondorf se transformando em uma pessoa diferente, Sheik. Em \"Twilight Princess,\" ela se rende a Zant, que invadiu Hyrule, e se torna sua prisioneira.",
  },
  SSB4: {
    jpEn: "The princess of the kingdom of Hyrule, who appears in \"The Legend of Zelda.\" Her appearance and position differ from game to game, but she often plays an important role in the story. In Smash Bros., she fights by enhancing her physical techniques with magic. Her movement speed is on the slower side. Newly acquired in this installment, Phantom Slash is a special move that summons a Phantom to attack opponents. Holding the button when activating it increases its range and power.",
    pt: "A princesa do reino de Hyrule, que aparece em \"The Legend of Zelda.\" Sua aparência e posição diferem de jogo para jogo, mas ela frequentemente desempenha um papel importante na história. Em Smash Bros., ela luta aprimorando suas técnicas físicas com magia. Sua velocidade de movimento é relativamente lenta. Recém-adquirido nesta versão, o Phantom Slash é um golpe especial que invoca um Fantasma para atacar os adversários. Segurar o botão ao ativá-lo aumenta seu alcance e poder.",
  },
  SSBM: {
    jpEn: "The daughter of the King of Hyrule. Following a revelation in a dream, she entrusts Link with Hyrule's future. She is the bearer of the Triforce of Wisdom. She deceived Ganondorf by transforming into Sheik. The above is based on \"Ocarina of Time\" — Zelda and Link have slightly different settings in each game.",
    pt: "A filha do Rei de Hyrule. Seguindo uma revelação em um sonho, ela confia a Link o futuro de Hyrule. Ela é a portadora da Triforce da Sabedoria. Ela enganou Ganondorf se transformando em Sheik. O acima é baseado em \"Ocarina of Time\" — Zelda e Link têm configurações ligeiramente diferentes em cada jogo.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "Her movement is somewhat sluggish and she's light, making her easy to launch, but her magic-enhanced attacks are powerful and reliable. Generally, she's a character better used by focusing on defense and counterattacking rather than relentless offense. Nayru's Love can reflect projectiles, but can also be used as a direct attack. B: Nayru's Love, Side+B: Din's Fire",
    pt: "Seu movimento é um tanto lento e ela é leve, o que a torna fácil de arremessar, mas seus ataques aprimorados por magia são poderosos e confiáveis. Geralmente, é um personagem melhor usado focando em defesa e contra-ataques em vez de ofensiva incessante. O Nayru's Love pode refletir projéteis, mas também pode ser usado como um ataque direto. B: Nayru's Love, Lateral+B: Din's Fire",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "The aerial side attack, Lightning Kick, concentrates magical power at the tip of her foot, so only the toe is a strong hit — connecting anywhere else results in just a weak kick. Many other characters also have attacks where the point of contact matters. Farore's Wind, powered by Zelda's magic, covers an especially large travel distance — though this can conversely make it hard to control. Up+B: Farore's Wind, Down+B: Sheik Change",
    pt: "O ataque aéreo lateral, Lightning Kick, concentra poder mágico na ponta do pé, então apenas a ponta do dedo é um golpe forte — conectar em qualquer outro lugar resulta apenas em um chute fraco. Muitos outros personagens também têm ataques onde o ponto de contato importa. O Farore's Wind, alimentado pela magia da Zelda, cobre uma distância de deslocamento especialmente grande — embora isso possa, inversamente, tornar difícil de controlar. Cima+B: Farore's Wind, Baixo+B: Sheik Change",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Boldly unleashed with the forward air attack, Lightning Kick. The glowing tip of her foot carries a magical property. If you can land just the glowing toe on an opponent, it deals massive damage and knockback. Din's Fire is a special move that releases an explosive orb. Holding the button increases its explosive power, and it can be guided up or down. Releasing the button triggers the explosion. (FCD) The Legend of Zelda (1986/02) (Wii) The Legend of Zelda: Twilight Princess (2006/12)",
    pt: "Liberado ousadamente com o ataque aéreo frontal, Lightning Kick. A ponta brilhante do pé carrega uma propriedade mágica. Se você conseguir acertar apenas a ponta brilhante do dedo em um adversário, causa dano e arremesso massivos. O Din's Fire é um golpe especial que libera uma esfera explosiva. Segurar o botão aumenta seu poder explosivo, e pode ser guiado para cima ou para baixo. Soltar o botão dispara a explosão. (FCD) The Legend of Zelda (1986/02) (Wii) The Legend of Zelda: Twilight Princess (2006/12)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Zelda's Origins", titleJp: "ゼルダの初登場作品", textJp: "ゼルダが初めて登場した作品は、１９８６年発売の『ゼルダの伝説』。同作品では力のトライフォースとともに魔王ガノンに囚われていた。", titleJpEn: "Zelda's Origins", textJpEn: "Zelda first appeared in \"The Legend of Zelda,\" released in 1986. In that game, she was imprisoned by the demon king Ganon, along with the Triforce of Power.", titlePt: "As Origens da Zelda", textPt: "A Zelda apareceu pela primeira vez em \"The Legend of Zelda,\" lançado em 1986. Nesse jogo, ela estava aprisionada pelo rei demônio Ganon, junto com a Triforce do Poder." },
  { titleEn: "[★☆☆] In Her Series", titleJp: "原作では", textJp: "「ゼルダ」シリーズに登場し、多くの作品でハイラル王国の王女を務めている。各作品のゼルダは一部を除いて同名の別人で、作品ごとに設定が異なる。", titleJpEn: "In Her Series", textJpEn: "She appears in the \"Zelda\" series, serving as the princess of the Kingdom of Hyrule in most games. Except for a few instances, each game's Zelda is a different person sharing the same name, with settings that vary from title to title.", titlePt: "Na Série Original", textPt: "Ela aparece na série \"Zelda,\" servindo como a princesa do Reino de Hyrule na maioria dos jogos. Exceto por algumas instâncias, a Zelda de cada jogo é uma pessoa diferente compartilhando o mesmo nome, com contextos que variam de título para título." },
  { titleEn: "[★☆☆] Special-Move Names", titleJp: "３つのワザの名前", textJp: "必殺ワザの名前は、ハイラル創世記にトライフォースを地上に残したとされる女神から取られている。それぞれ力の女神ディン、知恵の女神ネール、勇気の女神フロルである。", titleJpEn: "Special-Move Names", textJpEn: "The names of her special moves come from the goddesses said to have left the Triforce on the earth during the creation of Hyrule: Din, the Goddess of Power; Nayru, the Goddess of Wisdom; and Farore, the Goddess of Courage.", titlePt: "Os Nomes dos Golpes Especiais", textPt: "Os nomes de seus golpes especiais vêm das deusas que, segundo a lenda, deixaram a Triforce na terra durante a criação de Hyrule: Din, a Deusa do Poder; Nayru, a Deusa da Sabedoria; e Farore, a Deusa da Coragem." },
  { titleEn: "[★☆☆] Nayru's Love (Neutral Special)", titleJp: "ネールの愛 【通常必殺ワザ】", textJp: "魔法の結界を張り、相手の飛び道具を反射するワザ。身を守るだけでなく、近づいた相手にはダメージを与える。", titleJpEn: "Nayru's Love (Neutral Special)", textJpEn: "A move that puts up a magical barrier, reflecting opponents' projectiles. It not only protects her, but also damages opponents who get too close.", titlePt: "Nayru's Love (Especial Neutro)", textPt: "Um movimento que ergue uma barreira mágica, refletindo os projéteis dos adversários. Não apenas a protege, mas também causa dano aos adversários que chegam perto demais." },
  { titleEn: "[★★☆] Nayru's Love's Traits (Neutral Special)", titleJp: "ネールの愛の特性 【通常必殺ワザ】", textJp: "相手の飛び道具を反射でき、ワザの出始めは無敵状態になる。とっさの切り返し手段として、使い勝手の良いワザ。", titleJpEn: "Nayru's Love's Traits (Neutral Special)", textJpEn: "It can reflect opponents' projectiles, and grants invincibility at the very start of the move. It's a convenient move for a quick, split-second counter.", titlePt: "As Características do Nayru's Love (Especial Neutro)", textPt: "Pode refletir os projéteis dos adversários, e concede invencibilidade bem no início do movimento. É um movimento conveniente para um contra-ataque rápido e instantâneo." },
  { titleEn: "[★☆☆] Din's Fire (Side Special)", titleJp: "ディンの炎 【横必殺ワザ】", textJp: "前方に魔法弾をとばし、爆発させてダメージを与えるワザ。ボタンを押し続けるほど、飛距離と爆発の威力が上がる。", titleJpEn: "Din's Fire (Side Special)", textJpEn: "A move that launches a magic orb forward and makes it explode to deal damage. The longer the button is held, the greater the travel distance and explosive power.", titlePt: "Din's Fire (Especial Lateral)", textPt: "Um movimento que lança uma esfera mágica para frente e a faz explodir para causar dano. Quanto mais tempo o botão é segurado, maior a distância percorrida e o poder explosivo." },
  { titleEn: "[★★☆] Din's Fire's Traits (Side Special)", titleJp: "ディンの炎の特性 【横必殺ワザ】", textJp: "上下を入力することで炎の飛ぶ方向を調整できる。炎は「ボタンを離す」「一定時間経過」「地形に接触」のいずれかの条件を満たすと爆発する。", titleJpEn: "Din's Fire's Traits (Side Special)", textJpEn: "Inputting up or down adjusts the direction the flame travels. The flame explodes when one of these conditions is met: the button is released, a set amount of time passes, or it touches terrain.", titlePt: "As Características do Din's Fire (Especial Lateral)", textPt: "Inputar cima ou baixo ajusta a direção que a chama percorre. A chama explode quando uma dessas condições é atendida: o botão é solto, um tempo determinado passa, ou ela toca o terreno." },
  { titleEn: "[★☆☆] Farore's Wind (Up Special)", titleJp: "フロルの風 【上必殺ワザ】", textJp: "姿を消し、入力した方向へ移動する。消えた瞬間と出現する瞬間には、近くにいる相手にダメージを与える。", titleJpEn: "Farore's Wind (Up Special)", textJpEn: "She vanishes and moves in the input direction. Both the moment she disappears and the moment she reappears deal damage to nearby opponents.", titlePt: "Farore's Wind (Especial Cima)", textPt: "Ela desaparece e se move na direção inputada. Tanto o momento em que desaparece quanto o momento em que reaparece causam dano aos adversários próximos." },
  { titleEn: "[★☆☆] Aiming Farore's Wind (Up Special)", titleJp: "フロルの風でワープ 【上必殺ワザ】", textJp: "ワープ前に方向を入力すれば、好きな方向にワープすることができる。ワープ先までの間に地形がある時は、地形に沿った方向に移動する。", titleJpEn: "Warping with Farore's Wind (Up Special)", textJpEn: "Inputting a direction before warping lets her warp in any direction you choose. If there's terrain between her and the warp destination, she moves along the terrain instead.", titlePt: "Teleportando com o Farore's Wind (Especial Cima)", textPt: "Inputar uma direção antes de teleportar permite que ela teleporte em qualquer direção escolhida. Se houver terreno entre ela e o destino do teleporte, ela se move ao longo do terreno." },
  { titleEn: "[★★★] Feint with Farore's Wind (Up Special)", titleJp: "フロルの風でフェイント 【上必殺ワザ】", textJp: "地上ではワープ前に真下を入力すると、姿を消した後で再びその場に現れる。移動すると見せかけて、フェイントをかけることができる。", titleJpEn: "Feinting with Farore's Wind (Up Special)", textJpEn: "On the ground, inputting straight down before warping makes her vanish and reappear in the same spot. This lets her fake a movement as a feint.", titlePt: "Fintando com o Farore's Wind (Especial Cima)", textPt: "No chão, inputar diretamente para baixo antes de teleportar a faz desaparecer e reaparecer no mesmo local. Isso permite fingir um movimento como uma finta." },
  { titleEn: "[★☆☆] Charged Phantom Slash (Down Special)", titleJp: "ファントムアタックのため 【下必殺ワザ】", textJp: "ワザをためるほど、ファントムが遠くまで突進する。ためた時間によって、攻撃方法も変わる。", titleJpEn: "Charged Phantom Slash (Down Special)", textJpEn: "The longer the move is charged, the farther the Phantom dashes. The attack method also changes depending on the charge time.", titlePt: "Phantom Slash Carregado (Especial Baixo)", textPt: "Quanto mais o movimento é carregado, mais longe o Fantasma avança. O método de ataque também muda dependendo do tempo de carga." },
  { titleEn: "[★★☆] Phantom Slash's Traits (Down Special)", titleJp: "ファントムアタックの特性 【下必殺ワザ】", textJp: "ファントムが完成する前でも、必殺ワザボタンを押して攻撃することができる。組み上がっていくにつれ、攻撃力が上がり、攻撃範囲も広がる。", titleJpEn: "Phantom Slash's Traits (Down Special)", textJpEn: "You can attack by pressing the special move button even before the Phantom is fully formed. As it assembles further, its attack power increases and its attack range widens.", titlePt: "As Características do Phantom Slash (Especial Baixo)", textPt: "Você pode atacar pressionando o botão do golpe especial mesmo antes do Fantasma estar totalmente formado. Conforme ele se monta mais, seu poder de ataque aumenta e seu alcance de ataque se amplia." },
  { titleEn: "[★☆☆] Destroying the Phantom (Down Special)", titleJp: "ファントムの破壊 【下必殺ワザ】", textJp: "完成前にゼルダがダメージを受けたり、ファントム自身が大きなダメージを受けると、壊れてしまう。", titleJpEn: "Destroying the Phantom (Down Special)", textJpEn: "If Zelda takes damage before it's complete, or if the Phantom itself takes heavy damage, it breaks.", titlePt: "Destruindo o Fantasma (Especial Baixo)", textPt: "Se a Zelda sofrer dano antes de estar completo, ou se o próprio Fantasma sofrer dano pesado, ele se quebra." },
  { titleEn: "[★☆☆] Triforce of Wisdom (Final Smash)", titleJp: "知恵のトライフォース 【最後の切りふだ】", textJp: "巨大な三角形が、相手を１人だけ吸い込み封印する。吸引は徐々に強くなる。相手の蓄積ダメージが１００％以上なら、即撃墜となる。", titleJpEn: "Triforce of Wisdom (Final Smash)", textJpEn: "A giant triangle sucks in and seals away just one opponent. The suction gradually grows stronger. If the opponent's accumulated damage is 100% or higher, it's an instant KO.", titlePt: "Triforce of Wisdom (Final Smash)", textPt: "Um triângulo gigante suga e sela apenas um adversário. A sucção gradualmente fica mais forte. Se o dano acumulado do adversário for 100% ou mais, é um KO instantâneo." },
  { titleEn: "[★☆☆] Lightning Kick (Forward Air / Back Air)", titleJp: "稲妻キック 【前空中攻撃・後空中攻撃】", textJp: "ワザの出始め、つま先に強烈なふっとばし力を持つ。撃墜を狙える反面、スキが大きく、つま先以外の部分はふっとばし力が低い。", titleJpEn: "Lightning Kick (Forward Air / Back Air)", textJpEn: "At the very start of the move, the toe carries powerful knockback. While it can be used to go for a KO, it has a large opening, and any part other than the toe has low knockback power.", titlePt: "Lightning Kick (Ataque Aéreo Frontal / Traseiro)", textPt: "Bem no início do movimento, a ponta do pé carrega um poder de arremesso poderoso. Embora possa ser usado para buscar um KO, tem uma grande abertura, e qualquer parte além da ponta do pé tem baixo poder de arremesso." },
  { titleEn: "[★☆☆] Meteor Heel (Down Air Attack)", titleJp: "マイルドメテオヒール 【下空中攻撃】", textJp: "メテオ効果を持つワザ。ワザの出始めがもっとも強力だが、クリーンヒットしなくても復帰阻止に使える。", titleJpEn: "Meteor Heel (Down Air Attack)", textJpEn: "A move with a meteor effect. It's strongest right at the start, but it can still be used to prevent recovery even without a clean hit.", titlePt: "Meteor Heel (Ataque Aéreo Baixo)", textPt: "Um movimento com efeito meteoro. É mais forte bem no início, mas ainda pode ser usado para impedir a recuperação mesmo sem um golpe limpo." },
];

async function main() {
  const zelda = await db.fighter.findFirst({
    where: { name: "Zelda" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!zelda) { console.log("Zelda not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: zelda.id },
    data: {
      curatorOverviewEn: "Zelda, Princess of Hyrule, wields raw magical power that Sheik lacks — devastating spells like Din's Fire, Nayru's Love, and the summonable Phantom give her some of the hardest-hitting single attacks in Smash, at the cost of slow, vulnerable movement. Her Lightning Kick sourspots aside, precisely landing her toe-tipped magic and spacing carefully rewards patient, high-risk, high-reward play.",
      curatorOverviewPt: "Zelda, Princesa de Hyrule, empunha um poder mágico bruto que a Sheik não tem — feitiços devastadores como Din's Fire, Nayru's Love e o invocável Phantom lhe dão alguns dos ataques individuais mais fortes do Smash, ao custo de um movimento lento e vulnerável. Deixando de lado os pontos fracos do Lightning Kick, acertar precisamente sua magia na ponta do pé e posicionar-se com cuidado recompensa um jogo paciente, de alto risco e alta recompensa.",
      curatorOverviewJp: "ハイラルの王女ゼルダは、シークには無い生の魔力を操る――ディンの炎、ネールの愛、そして召喚可能なファントムといった強烈な呪文は、スマブラでも屈指の単発火力を誇るが、その代償として動きは遅く隙が多い。稲妻キックの弱点部分を除けば、足先の魔法を正確に当て、慎重な間合い管理を行うことが、忍耐強くハイリスク・ハイリターンなプレイを求めるファイターだ。",
      curatorOverviewJpEn: "Zelda, Princess of Hyrule, wields raw magic that Sheik lacks — devastating spells like Din's Fire, Nayru's Love, and the summonable Phantom give her some of the hardest single-hit power in Smash, at the cost of slow movement and vulnerability. Setting aside Lightning Kick's weak spots, precisely landing her toe-tip magic and carefully managing spacing suits patient, high-risk, high-reward players.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = zelda.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 4596-4636 -> 1023-1041 (17:03-17:21 ZoomZike VLC confirmed)
  const bioSsbm = zelda.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 1023, videoEndSec: 1041 } });
    console.log("✅ Bio SSBM video: 4596-4636 -> 1023-1041 (17:03-17:21)");
  }

  // Fix Trophy "Zelda" SSBM to match
  const meleeTrophy = await db.collectible.findFirst({ where: { name: "Zelda", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true } });
  if (meleeTrophy) {
    await db.collectible.update({ where: { id: meleeTrophy.id }, data: { videoStartSec: 1023, videoEndSec: 1041 } });
    console.log("✅ Trophy Zelda SSBM: -> 1023-1041");
  }

  // Fix SSBB Trophy corrupted end (3334-201060) -- no VLC timing given yet, null the end
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "Zelda", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy && ssbbTrophy.videoEndSec != null && ssbbTrophy.videoEndSec > 7200) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoEndSec: null } });
    console.log(`⚠️  SSBB Trophy Zelda: videoEndSec corrompido (${ssbbTrophy.videoEndSec}) limpo -- aguarda timing do usuário via VLC`);
  }

  // Fix SSB4 primary "Zelda" video with user's WiiU timing: 2082-2092 (34:42-34:52)
  const ssb4Main = await db.collectible.findFirst({ where: { name: "Zelda", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssb4Main) {
    await db.collectible.update({ where: { id: ssb4Main.id }, data: { videoStartSec: 2082, videoEndSec: 2092 } });
    console.log(`✅ SSB4 Trophy "Zelda": ${ssb4Main.videoStartSec}-${ssb4Main.videoEndSec} -> 2082-2092 (34:42-34:52)`);
  }

  // Fix corrupted SSB4 secondary video field on "Zelda (Alt.)" -- apply 10s duration pattern from start
  const ssb4Alt = await db.collectible.findFirst({ where: { name: "Zelda (Alt.)", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (ssb4Alt && ssb4Alt.videoEndSec2 != null && ssb4Alt.videoEndSec2 > 7200 && ssb4Alt.videoStartSec2 != null) {
    await db.collectible.update({ where: { id: ssb4Alt.id }, data: { videoEndSec2: ssb4Alt.videoStartSec2 + 10 } });
    console.log(`✅ SSB4 Trophy "Zelda (Alt.)": videoEndSec2 corrompido -> ${ssb4Alt.videoStartSec2 + 10} (10s de duração)`);
  }

  // Moves EN+PT+JpEn
  for (const m of zelda.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = zelda.tips.find(t => t.titleEn === data.titleEn);
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
