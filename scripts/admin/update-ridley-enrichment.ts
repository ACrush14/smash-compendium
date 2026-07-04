import { db } from "../../lib/db";

const BIO_JPEN_PT: Record<string, { jpEn: string; pt: string }> = {
  SSBB: {
    jpEn: "A leader of the Space Pirates. He has the appearance of a pterosaur, but boasts high intelligence and is also brutal. He steals the baby Metroid that Samus brought back to the Space Science Academy, and plans to exploit the Metroid for evil purposes. Using his wings, he flies freely in all directions, attacking with flames spat from his mouth and by swinging his long tail. He is the very perpetrator who killed Samus's parents, and the bond of fate between the two runs deep.",
    pt: "Um dos líderes dos Piratas Espaciais. Tem a aparência de um pterossauro, mas possui grande inteligência e também é brutal. Ele rouba o Bebê Metroid que Samus havia levado de volta à Academia de Ciência Espacial, planejando explorar o Metroid para fins malignos. Usando suas asas, voa livremente em todas as direções, atacando com chamas cuspidas pela boca e golpes de sua longa cauda. Ele é o verdadeiro responsável pelo assassinato dos pais de Samus, e o laço do destino entre os dois é profundo.",
  },
  SSB4: {
    jpEn: "A rival who stands in Samus's way throughout the series. In Smash Bros., he appears on the Pyrosphere stage as a common enemy to all fighters. If you launch him or knock him down, he becomes an ally to whichever fighter landed the last hit, and fights alongside them. If he is KO'd in a timed brawl, the fighter who defeated him gains 1 additional KO point.",
    pt: "Um rival que se põe no caminho de Samus ao longo de toda a série. Em Super Smash Bros., ele aparece no cenário Piroesfera como um inimigo comum a todos os lutadores. Se for arremessado ou derrubado, ele se torna aliado do lutador que desferiu o último golpe, lutando ao seu lado. Se for nocauteado em uma partida por tempo, o lutador que o derrotou ganha 1 ponto de nocaute adicional.",
  },
  SSBM: {
    jpEn: "A leader of the Space Pirates of Zebes. Despite his appearance, he possesses high intelligence. After the \"SR388 Incident,\" in which Samus brought back a Metroid larva, he stormed the Space Academy, driving it to ruin and recapturing the Metroid. Soaring through the air on wicked wings, he is Samus's archenemy.",
    pt: "Um dos líderes dos Piratas Espaciais de Zebes. Apesar da aparência, possui grande inteligência. Após o \"Incidente SR388\", no qual Samus trouxe de volta uma larva de Metroid, ele invadiu a Academia Espacial, levando-a à destruição e recapturando o Metroid. Voando pelos ares com asas malignas, é o arqui-inimigo de Samus.",
  },
};

const TIPS = [
  {
    titleEn: "[★☆☆] Ridley's Origins",
    titleJp: "リドリーの初登場作品",
    textJp: "リドリーの初登場作品は、１９８６年に発売された『メトロイド』。ノルフェアの深部で、ボスとして登場。攻撃は跳ねる火の玉のみだが、かなりの強敵。",
    titleJpEn: "Ridley's Debut Work",
    textJpEn: "Ridley's first appearance was in Metroid, released in 1986. He appeared as a boss deep within Norfair. His only attack was a bouncing fireball, but he was still quite a formidable foe.",
    titlePt: "As Origens de Ridley",
    textPt: "A estreia de Ridley foi em Metroid, lançado em 1986. Ele apareceu como chefe nas profundezas de Norfair. Seu único ataque era uma bola de fogo saltitante, mas ainda assim era um inimigo bastante formidável.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "サムスの宿敵として、様々な場面で形態を変えながら敵対することになる。Wiiで登場した『METROID Other M』では、リドリーの成長過程を確認できる。",
    titleJpEn: "In the Original Games",
    textJpEn: "As Samus's archenemy, he confronts her again and again across the series, changing forms each time. In Metroid: Other M for Wii, you can trace Ridley's growth process.",
    titlePt: "Nos Jogos Originais",
    textPt: "Como arqui-inimigo de Samus, ele a enfrenta repetidas vezes ao longo da série, mudando de forma a cada aparição. Em Metroid: Other M, lançado para Wii, é possível acompanhar o processo de crescimento de Ridley.",
  },
  {
    titleEn: "[★☆☆] Plasma Breath (Neutral Special)",
    titleJp: "リドリーブレス 【通常必殺ワザ】",
    textJp: "口にエネルギーをため、炎の弾を発射する。ためればためるほど弾の数は増えるが、この時、口に攻撃を受けると、爆発して大ダメージを受けてしまう。",
    titleJpEn: "Ridley Breath (Neutral Special)",
    textJpEn: "Charge energy in his mouth and fire balls of flame. The longer you charge, the more fireballs are released, but if his mouth is hit while charging, it will explode and deal heavy damage.",
    titlePt: "Sopro de Ridley (Especial Neutro)",
    textPt: "Acumula energia na boca e dispara bolas de fogo. Quanto mais tempo carregar, maior o número de bolas de fogo lançadas, mas se a boca for atingida durante a carga, ela explode e causa grande dano.",
  },
  {
    titleEn: "[★☆☆] Space Pirate Rush (Side Special)",
    titleJp: "グラビングスクラッチ 【横必殺ワザ】",
    textJp: "つかんだファイターを地面にこすりつけながら前進し、ダメージを与えるワザ。前進中にボタンを押すか、ガケに到達すると投げ飛ばす。",
    titleJpEn: "Grabbing Scratch (Side Special)",
    textJpEn: "A move that grabs a fighter and drags them along the ground while advancing forward, dealing damage. Press the button while advancing, or reach the edge of a cliff, to throw the opponent.",
    titlePt: "Arranhão Agarrador (Especial Lateral)",
    textPt: "Uma técnica que agarra um lutador e o arrasta pelo chão enquanto avança, causando dano. Pressione o botão durante o avanço, ou alcance a borda de um penhasco, para arremessar o oponente.",
  },
  {
    titleEn: "[★☆☆] Airborne Space Pirate Rush (Side Special)",
    titleJp: "グラビングスクラッチでのミス 【横必殺ワザ】",
    textJp: "空中にいる相手に突進しつかむと、そのままの勢いで、一気に落下していく。足場に気をつけないと、自分も落ちてしまう。追加でボタン入力すれば、相手を離す。",
    titleJpEn: "Grabbing Scratch Whiff (Side Special)",
    textJpEn: "If you charge and grab an airborne opponent, you'll plummet downward together with that same momentum. Be careful of your footing, or you'll fall too. Press the button again to release the opponent.",
    titlePt: "Arranhão Agarrador no Ar (Especial Lateral)",
    textPt: "Se avançar e agarrar um oponente no ar, ambos despencam juntos com o mesmo impulso. Tome cuidado com o local de queda, ou você também cairá. Pressione o botão novamente para soltar o oponente.",
  },
  {
    titleEn: "[★★☆] Escaping from Space Pirate Rush (Side Special)",
    titleJp: "グラビングスクラッチからの脱出 【横必殺ワザ】",
    textJp: "つかまれた相手は、レバガチャで脱出できる。リドリーよりも相手の蓄積ダメージが高ければ高いほど、脱出は難しくなる。",
    titleJpEn: "Escaping the Grabbing Scratch (Side Special)",
    textJpEn: "An opponent who is grabbed can escape by rapidly waggling the control stick. The higher the opponent's accumulated damage compared to Ridley's, the harder it is to escape.",
    titlePt: "Escapando do Arranhão Agarrador (Especial Lateral)",
    textPt: "O oponente agarrado pode escapar sacudindo repetidamente o direcional. Quanto maior o dano acumulado do oponente em relação a Ridley, mais difícil é escapar.",
  },
  {
    titleEn: "[★☆☆] Wing Blitz (Up Special)",
    titleJp: "リドリーチャージ 【上必殺ワザ】",
    textJp: "浮いた後、上下左右にスティックを入力することで、その方向へ突進する。下方向へ突進する時は、メテオ効果があるキックをくり出す。",
    titleJpEn: "Ridley Charge (Up Special)",
    textJpEn: "After rising into the air, input the stick up, down, left, or right to dash in that direction. When dashing downward, he unleashes a kick with a meteor effect.",
    titlePt: "Investida de Ridley (Especial Superior)",
    textPt: "Após subir no ar, incline o direcional para cima, baixo, esquerda ou direita para avançar naquela direção. Ao avançar para baixo, ele desfere um chute com efeito meteoro.",
  },
  {
    titleEn: "[★☆☆] Skewer (Down Special)",
    titleJp: "デススタッブ 【下必殺ワザ】",
    textJp: "しっぽの先端を相手に突き刺すと、クリティカルヒットとなり、大ダメージを与える。何人かが乱闘して、密集しているところが狙いやすい。体力制で使うと、特に効果的。",
    titleJpEn: "Death Stab (Down Special)",
    textJpEn: "Stabbing an opponent with the tip of the tail lands a critical hit, dealing heavy damage. It's easier to aim when several fighters are grouped together in a brawl. It's especially effective in Stamina mode.",
    titlePt: "Espetada Mortal (Especial Inferior)",
    textPt: "Espetar um oponente com a ponta da cauda resulta em um acerto crítico, causando grande dano. É mais fácil de acertar quando vários lutadores estão agrupados na confusão. É especialmente eficaz no modo Resistência.",
  },
  {
    titleEn: "[★☆☆] Plasma Scream (Final Smash)",
    titleJp: "デストロイビーム 【最後の切りふだ】",
    textJp: "スターシップに叩きつけ、熱光線を浴びせる。相手を２体まで巻き込める。ワザ終了時、蓄積ダメージが１００％を超えた相手は、その場で爆発する。",
    titleJpEn: "Destroy Beam (Final Smash)",
    textJpEn: "Slam opponents against his starship and blast them with a heat ray. Up to two fighters can be caught in this move. When it ends, any opponent with more than 100% accumulated damage will explode on the spot.",
    titlePt: "Raio Destruidor (Ataque Final)",
    textPt: "Arremessa os oponentes contra sua nave estelar e os atinge com um raio de calor. Até dois lutadores podem ser atingidos por essa técnica. Ao final do golpe, oponentes com mais de 100% de dano acumulado explodem instantaneamente.",
  },
];

async function main() {
  const ridley = await db.fighter.findFirst({
    where: { name: "Ridley" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!ridley) { console.log("Ridley not found"); return; }

  await db.fighter.update({
    where: { id: ridley.id },
    data: {
      curatorOverviewEn: "Ridley's kit centers on his tail and grab game. Space Pirate Rush is a command grab that drags grounded opponents forward for damage, but performed in the air it becomes a different move entirely — Ridley clutches an airborne opponent and plummets with them, a risky mutual fall that can steal a stock if he doesn't have to worry about his own landing. Skewer rewards patience: its critical-hit tail stab does far more damage the more clustered opponents are, and it's especially punishing in Stamina matches, where percent is health. Plasma Breath is a charge-and-release projectile that trades reward for risk, since taking a hit to the mouth mid-charge causes a damaging backfire. Wing Blitz doubles as recovery and offense, letting him choose a direction on the fly and finishing a downward charge with a meteor smash. And unusually, his Final Smash, Plasma Scream, keeps dealing its finishing damage — instantly KOing anyone over 100% — even if Ridley himself is knocked out first, so a well-timed Final Smash can secure a KO no matter what happens to him.",
      curatorOverviewPt: "O kit de Ridley gira em torno da cauda e do jogo de agarrões. Space Pirate Rush é uma pegada comandada que arrasta oponentes no chão para causar dano, mas, quando executada no ar, se transforma em outro golpe: Ridley agarra um oponente aéreo e despenca junto com ele, uma queda mútua arriscada que pode custar um stock se ele não precisar se preocupar com seu próprio pouso. Skewer recompensa a paciência: sua estocada de cauda com acerto crítico causa muito mais dano quanto mais agrupados estiverem os oponentes, e é especialmente punitiva em partidas de Resistência, onde a porcentagem é a própria vida. Plasma Breath é um projétil de carregar-e-soltar que troca recompensa por risco, já que levar um golpe na boca durante a carga causa uma explosão prejudicial. Wing Blitz funciona tanto como recuperação quanto como ataque, permitindo escolher a direção na hora e finalizar uma carga para baixo com um golpe meteoro. E, de forma incomum, seu Ataque Final, Plasma Scream, continua causando seu dano decisivo — nocauteando instantaneamente quem estiver acima de 100% — mesmo que o próprio Ridley seja nocauteado primeiro, então um Ataque Final bem cronometrado pode garantir um nocaute independentemente do que aconteça com ele.",
      curatorOverviewJp: "リドリーの戦術は尻尾とつかみ技を中心に構成されている。「グラビングスクラッチ」は地上の相手を前方に引きずりながらダメージを与えるつかみ技だが、空中で発動するとまったく別の技になる。空中の相手をつかんで一緒に落下していく、リスクの高い相打ちのような展開になり、自分の着地さえ気にしなければストックを奪うことも可能だ。「デススタッブ」は忍耐が報われる技で、相手が密集しているほどクリティカルヒットの尻尾突きのダメージが大きくなり、パーセントがそのまま体力になる体力制の対戦では特に強力な一撃となる。「リドリーブレス」はためて放つ飛び道具だが、ためている最中に口を攻撃されると自爆してしまうハイリスク・ハイリターンな技だ。「リドリーチャージ」は復帰技と攻撃技を兼ね備えており、その場で方向を選べるうえ、下方向へのチャージはメテオスマッシュで締めくくれる。そして珍しいことに、最後の切りふだ「デストロイビーム」は、リドリー自身が先に撃墜されたとしても、蓄積ダメージ100%を超えた相手を即座に撃墜する効果が発動し続けるため、タイミングさえ合えば自分がどうなろうと確実に一撃を決められる。",
      curatorOverviewJpEn: "Ridley's tactics are built around his tail and grab techniques. \"Grabbing Scratch\" is a grab move that drags a grounded opponent forward while dealing damage, but when used in the air, it becomes an entirely different move: he grabs an airborne opponent and falls together with them, a high-risk mutual-fall scenario that can steal a stock if he doesn't need to worry about his own landing. \"Death Stab\" is a move where patience pays off — the more clustered the opponents are, the greater the damage from its critical-hit tail stab, making it an especially powerful finisher in Stamina matches, where percentage is literally health. \"Ridley Breath\" is a charge-and-release projectile, but it's a high-risk, high-reward move, since getting hit in the mouth while charging causes it to backfire. \"Ridley Charge\" doubles as both a recovery move and an attack, letting him choose a direction on the spot, and a downward charge can be finished off with a meteor smash. And unusually, his Final Smash, \"Destroy Beam,\" continues its effect of instantly KOing any opponent over 100% damage even if Ridley himself is KO'd first, so as long as the timing lines up, he can land a guaranteed hit no matter what happens to him.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_JPEN_PT)) {
    const bio = ridley.bios.find(b => b.smashGameVersion === version);
    if (!bio) { console.log(`  ⚠️  Bio não encontrada: ${version}`); continue; }
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = ridley.tips.find(t => t.titleEn === data.titleEn);
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

  // Vídeo Brawl corrigido via VLC (1:09:58 - 1:10:32 = 4198-4232s), valores antigos (4187/4222) estavam levemente errados.
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "Ridley", type: "TROPHY", smashGameVersion: "SSBB" } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 4198, videoEndSec: 4232 } });
    console.log("✅ Vídeo SSBB (Brawl) corrigido: 4198-4232");
  }

  // Sem FighterMove (0 registros) — nunca existiu texto "EX" scrapeado para Ridley, não é lacuna.
  // CollectibleChronicleLink de ambos os troféus (SSBB: Metroid FDS JP + Super Metroid; SSBM: Metroid) já corretos — sem bug de Works.
  // WiiU 45:29 (timestamp único, sem par fim) e SSBU bio JP: pendências levadas ao usuário separadamente.

  await db.$disconnect();
}
main().catch(console.error);
