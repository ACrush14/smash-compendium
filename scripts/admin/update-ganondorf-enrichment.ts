import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "Regarding Ganondorf as a fighter, see respectively: \"Ganondorf (DX),\" \"Ganondorf (X),\" \"Ganondorf (3DS/Wii U),\" and \"Ganondorf (SP).\" For Ganon's appearances in Smash Bros. as a Final Smash or boss character, see \"Ganon.\"",
    pt: "Ganondorf (ガノンドロフ, Ganondorf) é um personagem jogável em Super Smash Bros. Ultimate. Ele foi oficialmente revelado junto com Ryu e o restante do elenco de retorno em 12 de junho de 2018 durante a E3 2018. Como em jogos anteriores a Super Smash Bros. for Wii U, ele é desbloqueável, em vez de estar disponível desde o início. Ganondorf é classificado como Lutador #23.",
  },
  SSBM: {
    jpEn: "A man of the Gerudo tribe, said to be born only once every hundred years. He harbors ambitions of world domination. When Link pulled the sacred sword, he plundered the \"Triforce of Power,\" one piece of the sacred triangle, from the Temple of Time. As a result, Hyrule was plunged into darkness and became a land crawling with monsters. He is ultimately defeated before Link, who gathered strength through seven years of sealed slumber, and Zelda's magic.",
    pt: "Um homem da tribo Gerudo, dito nascer apenas uma vez a cada cem anos. Ele nutre ambições de dominação mundial. Quando o Link puxou a espada sagrada, ele saqueou a \"Triforce do Poder,\" uma peça do triângulo sagrado, do Templo do Tempo. Como resultado, Hyrule foi mergulhada na escuridão e se tornou uma terra repleta de monstros. Ele é finalmente derrotado diante do Link, que reuniu forças através de sete anos de sono selado, e da magia da Zelda.",
  },
  SSBB: {
    jpEn: "A man who schemes to conquer the world using the power of the Triforce. In \"Twilight Princess,\" he grants power to Zant, ruler of the Twilight Realm, and attempts to turn the worlds of light and shadow into a world of darkness. He changes form, possessing Zelda and becoming a magical beast, attacking Link. In the end, however, he is finished off by Link and defeated.",
    pt: "Um homem que trama conquistar o mundo usando o poder da Triforce. Em \"Twilight Princess,\" ele concede poder a Zant, governante do Reino Crepuscular, e tenta transformar os mundos da luz e da sombra em um mundo de trevas. Ele muda de forma, possuindo a Zelda e se tornando uma besta mágica, atacando o Link. No final, porém, ele é finalizado pelo Link e derrotado.",
  },
  SSB4: {
    jpEn: "The great demon king who waits as Link's final opponent in most games in \"The Legend of Zelda\" series. He commands the Triforce of Power. In Smash Bros., he's a power-type fighter with slow movement speed and high attack power. Each blow unleashed from his sturdy body is heavy, and his knockback is a genuine threat. Close the distance with a dash move and deliver a heavy hit.",
    pt: "O grande rei demônio que aguarda como o adversário final do Link na maioria dos jogos da série \"The Legend of Zelda.\" Ele comanda a Triforce do Poder. Em Smash Bros., ele é um lutador do tipo força com velocidade de movimento lenta e alto poder de ataque. Cada golpe liberado de seu corpo robusto é pesado, e seu arremesso é uma ameaça genuína. Encurte a distância com um golpe de avanço e desfira um golpe pesado.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "In contrast to Falcon's power and technique, he overwhelms opponents with power alone. His movements are heavy and he doesn't jump very high, but his attack power is simply overwhelming. Being heavy, he's also hard to launch. The one-hit-kill Warlock Punch has an even larger opening and more destructive power than Falcon Punch. Flame Choke engulfs opponents in purple flames while launching them powerfully. B: Warlock Punch, Side+B: Flame Choke",
    pt: "Em contraste com o poder e técnica do Falcon, ele domina os adversários apenas com poder. Seus movimentos são pesados e ele não pula muito alto, mas seu poder de ataque é simplesmente esmagador. Por ser pesado, também é difícil de arremessar. O Warlock Punch, que mata em um só golpe, tem uma abertura ainda maior e mais poder destrutivo que o Falcon Punch. O Flame Choke envolve os adversários em chamas roxas enquanto os arremessa poderosamente. B: Warlock Punch, Lateral+B: Flame Choke",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "It seems his moves aren't actually named \"Ganon Punch\" or \"Ganon Kick.\" His slow movement can be fatal in 1-on-1 matches, but in free-for-alls, his power can rack up KOs. Even his jab can't be mashed rapidly, but each hit carries real weight. Thunder Godhand literally shocks opponents with electricity while launching them somewhat sideways. Up+B: Thunder Godhand, Down+B: Wizard's Foot",
    pt: "Parece que seus golpes não se chamam realmente \"Ganon Punch\" ou \"Ganon Kick.\" Seu movimento lento pode ser fatal em partidas 1 contra 1, mas em batalhas de todos contra todos, seu poder pode acumular vários KOs. Até seu soco fraco não pode ser encadeado rapidamente, mas cada golpe carrega peso real. O Thunder Godhand literalmente choca os adversários com eletricidade enquanto os arremessa um pouco para o lado. Cima+B: Thunder Godhand, Baixo+B: Wizard's Foot",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Warlock Punch is a special move where he charges dark power into his left fist and unleashes it with a backhand strike. It has some of the strongest power and knockback in all of Smash Bros. However, in exchange for its strength, it takes a long time to come out and has a large opening. It's better used during chaotic team battles than aimed at a single opponent in 1-on-1. Inputting backward right after pressing the special move button turns it into a turnaround attack, increasing its power even further. (64) The Legend of Zelda: Ocarina of Time (1998/11) (Wii) The Legend of Zelda: Twilight Princess (2006/12)",
    pt: "Warlock Punch é um golpe especial onde ele carrega poder sombrio no punho esquerdo e o libera com um golpe de dorso da mão. Tem um dos maiores poderes e arremesso de todo o Smash Bros. Porém, em troca dessa força, leva muito tempo para sair e tem uma grande abertura. É melhor usado durante batalhas caóticas de equipe do que mirado em um único adversário em 1 contra 1. Inputar para trás logo após pressionar o botão do golpe especial o transforma em um ataque de virada, aumentando ainda mais seu poder. (64) The Legend of Zelda: Ocarina of Time (1998/11) (Wii) The Legend of Zelda: Twilight Princess (2006/12)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『ゼルダの伝説 時のオカリナ』では、ゲルド族の王として君臨。ハイラル王に忠誠を誓うフリをし、ハイラルを自分のものにしようと企んだ。", titleJpEn: "In His Series", textJpEn: "In \"The Legend of Zelda: Ocarina of Time,\" he reigns as the King of the Gerudo. He pretends to swear loyalty to the King of Hyrule while scheming to claim Hyrule for himself.", titlePt: "Na Série Original", textPt: "Em \"The Legend of Zelda: Ocarina of Time,\" ele reina como o Rei dos Gerudo. Ele finge jurar lealdade ao Rei de Hyrule enquanto trama tomar Hyrule para si." },
  { titleEn: "[★☆☆] Ganon, The Demon King", titleJp: "魔王ガノンとは", textJp: "シリーズ第1作目『ゼルダの伝説』に最後のボスとして登場する魔王ガノン。現在のガノンドロフのような見た目ではなく、人型のイノシシのような姿をしていた。", titleJpEn: "Ganon, The Demon King", textJpEn: "Ganon, the demon king who appears as the final boss in the first game of the series, \"The Legend of Zelda.\" He didn't look like the current Ganondorf, but rather had a humanoid boar-like appearance.", titlePt: "Ganon, o Rei Demônio", textPt: "Ganon, o rei demônio que aparece como chefe final no primeiro jogo da série, \"The Legend of Zelda.\" Ele não se parecia com o Ganondorf atual, mas tinha uma aparência humanoide semelhante a um javali." },
  { titleEn: "[★★☆] Warlock Punch (Neutral Special)", titleJp: "魔人拳 【通常必殺ワザ】", textJp: "ボタンを押してからすぐに後ろ方向へ入力すると、背中側に振り返ってパンチをくり出す。威力も少し上がる。", titleJpEn: "Warlock Punch (Neutral Special)", textJpEn: "Pressing the button and immediately inputting backward makes him turn around and throw the punch behind him. Its power also increases slightly.", titlePt: "Warlock Punch (Especial Neutro)", textPt: "Pressionar o botão e imediatamente inputar para trás faz ele se virar e desferir o soco atrás. Seu poder também aumenta um pouco." },
  { titleEn: "[★★★] Midair Warlock Punch (Neutral Special)", titleJp: "空中で魔人拳 【通常必殺ワザ】", textJp: "空中で放つ魔人拳は地上よりひとまわり強力になる。ジャンプ力が低いため、足場の高さやウサギずきんなどを活用したい。", titleJpEn: "Midair Warlock Punch (Neutral Special)", textJpEn: "Warlock Punch unleashed in the air becomes even more powerful than on the ground. Since his jump is low, make use of platform height or items like the Bunny Hood.", titlePt: "Warlock Punch no Ar (Especial Neutro)", textPt: "O Warlock Punch liberado no ar se torna ainda mais poderoso do que no chão. Como seu pulo é baixo, aproveite a altura de plataformas ou itens como o Bunny Hood." },
  { titleEn: "[★★☆] Midair Flame Choke (Side Special)", titleJp: "空中で炎獄握 【横必殺ワザ】", textJp: "空中で当てると、相手を地面に叩きつけるので、相手は受け身がとれない。地上で使った時より与えるダメージも少しだけ大きくなっている。", titleJpEn: "Midair Flame Choke (Side Special)", textJpEn: "Hitting an opponent in the air slams them into the ground, so they can't tech the fall. It also deals slightly more damage than when used on the ground.", titlePt: "Flame Choke no Ar (Especial Lateral)", textPt: "Acertar um adversário no ar o arremessa contra o chão, então ele não consegue amortecer a queda. Também causa um pouco mais de dano do que quando usado no chão." },
  { titleEn: "[★★★] Flame Choke Travels (Side Special)", titleJp: "炎獄握で道連れ 【横必殺ワザ】", textJp: "空中で使えばガケ外でつかんだ相手を道連れにできる。ただし、３人以上の対戦では、炎獄握を当てる前に相手を攻撃した人にポイントが入るので注意。", titleJpEn: "Flame Choke Travels (Side Special)", textJpEn: "Using it in the air lets him take an opponent grabbed offstage down with him. However, in matches with 3 or more players, be careful — the point goes to whoever last attacked the opponent before the Flame Choke connected.", titlePt: "Flame Choke Leva Junto (Especial Lateral)", textPt: "Usá-lo no ar permite que ele leve consigo um adversário agarrado fora do palco. Porém, em partidas com 3 ou mais jogadores, cuidado — o ponto vai para quem atacou o adversário por último antes do Flame Choke conectar." },
  { titleEn: "[★☆☆] Escaping from Flame Choke (Side Special)", titleJp: "炎獄握からの脱出 【横必殺ワザ】", textJp: "空中で炎獄握を受けた時は、レバガチャで脱出することができる。ガノンドロフより蓄積ダメージが多い場合は、脱け出しづらい。", titleJpEn: "Escaping from Flame Choke (Side Special)", textJpEn: "When caught by Flame Choke in the air, you can escape by mashing the control stick. If your accumulated damage is higher than Ganondorf's, it's harder to escape.", titlePt: "Escapando do Flame Choke (Especial Lateral)", textPt: "Quando pego pelo Flame Choke no ar, você pode escapar sacudindo o analógico. Se seu dano acumulado for maior que o do Ganondorf, é mais difícil escapar." },
  { titleEn: "[★★★] Wizard's Foot (Down Special)", titleJp: "烈鬼脚 【下必殺ワザ】", textJp: "地上で出すと真横に飛び蹴りするワザ。空中で出すと急降下キックになり、ワザの出始めにメテオ効果がある。", titleJpEn: "Wizard's Foot (Down Special)", textJpEn: "Used on the ground, it's a flying side kick. Used in the air, it becomes a diving kick with a meteor effect at the very start of the move.", titlePt: "Wizard's Foot (Especial Baixo)", textPt: "Usado no chão, é um chute voador lateral. Usado no ar, se torna um chute mergulhador com efeito meteoro bem no início do movimento." },
  { titleEn: "[★☆☆] Aerial Wizard's Foot (Down Special)", titleJp: "空中で烈鬼脚 【下必殺ワザ】", textJp: "空中で出すと、強力なふっとばし力がある。下で待ち構えているファイターに対してくり出すのも、時には有効。", titleJpEn: "Aerial Wizard's Foot (Down Special)", textJpEn: "Used in the air, it has powerful knockback. It's sometimes effective to use it against a fighter waiting below.", titlePt: "Wizard's Foot no Ar (Especial Baixo)", textPt: "Usado no ar, tem um poder de arremesso poderoso. Às vezes é eficaz usá-lo contra um lutador esperando abaixo." },
  { titleEn: "[★☆☆] Ganon, The Demon King (Final Smash)", titleJp: "魔王ガノン 【最後の切りふだ】", textJp: "魔王ガノンに変身し、剣と突進のコンビネーションで、相手を葬り去る。最初の斬撃にはしびれ効果があり、ヒットするとフィニッシュの突進が当たりやすい。", titleJpEn: "Ganon, The Demon King (Final Smash)", textJpEn: "Transforms into the demon king Ganon and finishes off opponents with a combination of a sword slash and a dash. The initial slash has a stun effect, and connecting with it makes the finishing dash easier to land.", titlePt: "Ganon, o Rei Demônio (Final Smash)", textPt: "Transforma-se no rei demônio Ganon e finaliza os adversários com uma combinação de golpe de espada e investida. O golpe inicial tem efeito de atordoamento, e conectá-lo torna a investida final mais fácil de acertar." },
  { titleEn: "[★☆☆] Smash Attacks", titleJp: "スマッシュ攻撃", textJp: "すべてのスマッシュ攻撃で、剣を使用する。スキが大きいが、威力バツグン。", titleJpEn: "Smash Attacks", textJpEn: "He uses a sword for all of his smash attacks. They have large openings, but their power is exceptional.", titlePt: "Ataques Smash", textPt: "Ele usa uma espada em todos os seus ataques smash. Eles têm grandes aberturas, mas seu poder é excepcional." },
  { titleEn: "[★★☆] Volcano Kick (Up Tilt Attack)", titleJp: "爆裂蹴 【上強攻撃】", textJp: "攻撃するまでに時間がかかる分、うまく当てればスマッシュ攻撃より強力。防御されても、ジャストシールドさえされなければ１発でシールドブレイク。", titleJpEn: "Volcano Kick (Up Tilt Attack)", textJpEn: "Since it takes time to come out, landing it cleanly makes it more powerful than a smash attack. Even if blocked, it can break a shield in a single hit as long as it isn't perfectly shielded.", titlePt: "Volcano Kick (Ataque Inclinado Cima)", textPt: "Como leva tempo para sair, acertá-lo de forma limpa o torna mais poderoso que um ataque smash. Mesmo se bloqueado, pode quebrar um escudo em um único golpe, desde que não seja um bloqueio perfeito." },
  { titleEn: "[★☆☆] Leg Sweep (Down Tilt Attack)", titleJp: "掃脚 【下強攻撃】", textJp: "かがんでキックをくり出し、相手を上にふっとばす。リーチが長く、ガノンドロフのワザの中では速度も速い。", titleJpEn: "Leg Sweep (Down Tilt Attack)", textJpEn: "Crouches and delivers a kick, launching opponents upward. It has long reach and is one of Ganondorf's faster moves.", titlePt: "Leg Sweep (Ataque Inclinado Baixo)", textPt: "Agacha e desfere um chute, arremessando os adversários para cima. Tem alcance longo e é um dos golpes mais rápidos do Ganondorf." },
];

async function main() {
  const g = await db.fighter.findFirst({
    where: { name: "Ganondorf" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!g) { console.log("Ganondorf not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: g.id },
    data: {
      curatorOverviewEn: "Ganondorf, the King of Evil, is Smash's ultimate power fighter — every attack is bone-crushingly slow but devastatingly heavy, headlined by the Warlock Punch, one of the strongest single hits in the game. His movement is sluggish and his frame is easy to punish, but landing a clean hit can end a stock in an instant. He rewards patient players who read openings rather than force engagements.",
      curatorOverviewPt: "Ganondorf, o Rei do Mal, é o lutador de poder definitivo do Smash — cada ataque é devastadoramente lento, mas brutalmente pesado, com destaque para o Warlock Punch, um dos golpes mais fortes do jogo. Seu movimento é lento e sua estrutura é fácil de punir, mas acertar um golpe limpo pode encerrar uma vida instantaneamente. Ele recompensa jogadores pacientes que leem aberturas em vez de forçar confrontos.",
      curatorOverviewJp: "悪の帝王ガノンドロフは、スマブラ屈指のパワーファイター――すべての攻撃は骨も砕けるほど遅いが、その分凄まじく重い。中でも魔人拳は、ゲーム屈指の単発火力を誇る。動きは鈍重で隙が多く、狙われやすいが、一撃をクリーンヒットさせればストックを瞬時に奪える。無理に仕掛けず、相手の隙を読む忍耐強いプレイヤーに応えるファイターだ。",
      curatorOverviewJpEn: "Ganondorf, the King of Evil, is one of Smash's premier power fighters — every attack is bone-crushingly slow but hits with tremendous weight, and Warlock Punch stands out as one of the strongest single hits in the game. His movement is sluggish with many openings, making him an easy target, but landing a clean hit can instantly take a stock. He suits patient players who read openings rather than force engagements.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = g.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 5006-5040 -> 1116-1137 (18:36-18:57 ZoomZike VLC confirmed)
  const bioSsbm = g.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 1116, videoEndSec: 1137 } });
    console.log("✅ Bio SSBM video: 5006-5040 -> 1116-1137 (18:36-18:57)");
  }

  // Fix Trophy "Ganondorf" SSBM to match (already correct: 1116-1137)
  const meleeTrophy = await db.collectible.findFirst({ where: { name: "Ganondorf", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (meleeTrophy) {
    console.log(`ℹ️  Trophy Ganondorf SSBM já correto: ${meleeTrophy.videoStartSec}-${meleeTrophy.videoEndSec}`);
  }

  // Fix SSBB Trophy corrupted (3395-3397, only 2s) -> 3398-3410 (56:38-56:50 VLC confirmed)
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "Ganondorf", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 3398, videoEndSec: 3410 } });
    console.log(`✅ SSBB Trophy Ganondorf: ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} -> 3398-3410 (56:38-56:50)`);
  }

  // Fix corrupted SSB4 secondary (3DS) video fields
  const ssb4Main = await db.collectible.findFirst({ where: { name: "Ganondorf", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (ssb4Main) {
    await db.collectible.update({ where: { id: ssb4Main.id }, data: { videoStartSec2: 2021, videoEndSec2: 2032 } });
    console.log(`✅ SSB4 Trophy "Ganondorf" secundário (3DS): -> 2021-2032 (33:41-33:52)`);
  }
  const ssb4Alt = await db.collectible.findFirst({ where: { name: "Ganondorf (Alt.)", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (ssb4Alt && ssb4Alt.videoStartSec2 != null) {
    await db.collectible.update({ where: { id: ssb4Alt.id }, data: { videoEndSec2: ssb4Alt.videoStartSec2 + 11 } });
    console.log(`✅ SSB4 Trophy "Ganondorf (Alt.)" secundário (3DS): videoEndSec2 corrompido -> ${ssb4Alt.videoStartSec2 + 11} (11s de duração, seguindo padrão do par principal)`);
  }

  console.log("\n⚠️  SSB4 WiiU (campo primário, 2166-2177) NÃO foi alterado -- aguardando confirmação do usuário sobre '35:48-36:58' (70s, fora do padrão)");

  // Moves EN+PT+JpEn
  for (const m of g.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = g.tips.find(t => t.titleEn === data.titleEn);
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
