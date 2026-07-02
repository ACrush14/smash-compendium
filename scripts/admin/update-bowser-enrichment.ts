import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "A giant turtle who leads the Koopa Troop, and Mario's eternal rival. Male, and typically refers to himself with the archaic first-person pronoun \"wagahai.\" He has a son, Bowser Jr. Since he was a baby around the same time as Mario and friends in \"Yoshi's Island,\" his age is thought to be around the same as theirs — or perhaps a few years older, since he could already speak. His signature move is the scorching fire he breathes from his mouth, though other details about him vary from title to title.",
    pt: "Uma tartaruga gigante que lidera a Tropa Koopa, e o eterno rival do Mario. Do sexo masculino, e tipicamente se refere a si mesmo com o pronome arcaico de primeira pessoa \"wagahai.\" Ele tem um filho, Bowser Jr. Como ele era um bebê na mesma época que o Mario e amigos em \"Yoshi's Island,\" acredita-se que sua idade seja próxima à deles — ou talvez alguns anos mais velho, já que ele já conseguia falar. Seu golpe característico é o fogo escaldante que sopra da boca, embora outros detalhes sobre ele variem de jogo para jogo.",
  },
  SSBB: {
    jpEn: "The great demon king of the Koopa race, in an eternal rivalry with Mario. He targets Mario with a wide variety of attacks — breathing fire from his mouth, scattering hammers, and assaulting from vehicles like the Koopa Clown Car. He possesses monstrous strength to match his massive body. Perhaps having grown up watching his father, his only son, Bowser Jr., also causes trouble for Mario.",
    pt: "O grande rei demônio da raça Koopa, em uma rivalidade eterna com o Mario. Ele ataca o Mario com uma grande variedade de golpes — soprando fogo pela boca, espalhando martelos e atacando de veículos como o Koopa Clown Car. Ele possui uma força monstruosa à altura de seu corpo enorme. Talvez por ter crescido observando o pai, seu único filho, Bowser Jr., também causa problemas para o Mario.",
  },
  SSB4: {
    jpEn: "The boss of the Koopa Troop, who kidnaps Peach and continues facing off against his eternal rival, Mario. Despite being a villain, he has a somewhat bumbling side, and sometimes even ends up acting alongside Mario. In Smash Bros., his characteristics are devastating attacks that make the most of his massive body and a resistance to being launched. Since he won't flinch from very weak attacks, don't sweat the small stuff — overwhelm opponents with powerful moves.",
    pt: "O chefe da Tropa Koopa, que sequestra a Peach e continua enfrentando seu eterno rival, o Mario. Apesar de ser um vilão, ele tem um lado meio desajeitado, e às vezes até acaba agindo ao lado do Mario. Em Smash Bros., suas características são ataques devastadores que aproveitam ao máximo seu corpo enorme e uma resistência a ser arremessado. Como ele não recua com ataques muito fracos, não se preocupe com detalhes — domine os adversários com golpes poderosos.",
  },
  SSBM: {
    jpEn: "Mario's archenemy. The head of the Koopa clan. He persistently kidnaps Peach to lure Mario in. Yet even this Bowser has seven children. Leading his army and making use of cutting-edge machines, he constantly torments Mario with monstrous strength matching his massive body and scorching fire breathed from his mouth.",
    pt: "O arquiinimigo do Mario. O chefe do clã Koopa. Ele persistentemente sequestra a Peach para atrair o Mario. Mesmo assim, este Bowser tem sete filhos. Liderando seu exército e usando máquinas de ponta, ele constantemente atormenta o Mario com uma força monstruosa à altura de seu corpo enorme e fogo escaldante soprado pela boca.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "In a sense, one of the strongest characters, combining weight that resists launching with powerful attacks. However, he's extremely sluggish, with slow movement and attack speed. Since his strengths and weaknesses are both extreme, he selects his player and favorable situations carefully. When facing a Bowser, it's especially effective to chain attacks continuously to lock down his offense. B: Fire Breath, Side+B: Bite",
    pt: "De certa forma, um dos personagens mais fortes, combinando peso que resiste a arremessos com ataques poderosos. Porém, ele é extremamente lento, com velocidade de movimento e ataque baixas. Como seus pontos fortes e fracos são ambos extremos, ele exige um jogador experiente e situações favoráveis. Ao enfrentar um Bowser, é especialmente eficaz encadear ataques continuamente para travar sua ofensiva. B: Fire Breath, Lateral+B: Bite",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "Fire Breath breathes fire continuously. Breathing for too long tires him out and shrinks the flame. Bite claws at opponents hit from a distance, but actually bites when they're close. Whirling Fortress lets him move sideways at high speed on the ground, and helps with recovery in the air. Bowser Bomb has both high power and a large opening. Up+B: Whirling Fortress, Down+B: Bowser Bomb",
    pt: "O Fire Breath sopra fogo continuamente. Soprar por muito tempo o cansa e reduz a chama. O Bite arranha os adversários atingidos de longe, mas na verdade morde quando estão perto. O Whirling Fortress permite que ele se mova lateralmente em alta velocidade no chão, e ajuda na recuperação no ar. O Bowser Bomb tem tanto alto poder quanto uma grande abertura. Cima+B: Whirling Fortress, Baixo+B: Bowser Bomb",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Bowser Bomb is a Down Special that uses his heavy, massive body to fall and deal damage with his rear. Used on the ground, he first jumps, but just before jumping he thrusts his horns upward, dealing damage. If the horns connect, the subsequent falling attack also hits in a combo. His Up Special, Whirling Fortress, gains slightly more lift if you mash the button while using it in the air. (FC) Super Mario Bros. (1985/09) (N64) Super Mario 64 (1996/06)",
    pt: "O Bowser Bomb é um Especial Baixo que usa seu corpo pesado e enorme para cair e causar dano com a traseira. Usado no chão, ele primeiro pula, mas logo antes de pular ele empurra os chifres para cima, causando dano. Se os chifres conectarem, o ataque de queda seguinte também acerta em combo. Seu Especial Cima, Whirling Fortress, ganha um pouco mais de impulso se você apertar o botão repetidamente enquanto o usa no ar. (FC) Super Mario Bros. (1985/09) (N64) Super Mario 64 (1996/06)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] King of the Koopas", titleJp: "カメ族の大魔王", textJp: "マリオの永遠のライバルであるクッパは、『スーパーマリオブラザーズ』で初登場した。全８ワールドでマリオを待ち構えるが、本物はワールド８のみ。", titleJpEn: "King of the Koopas", textJpEn: "Bowser, Mario's eternal rival, first appeared in \"Super Mario Bros.\" He waits for Mario in all 8 worlds, but only the one in World 8 is the real Bowser.", titlePt: "O Rei dos Koopas", textPt: "Bowser, o eterno rival do Mario, apareceu pela primeira vez em \"Super Mario Bros.\" Ele espera pelo Mario em todos os 8 mundos, mas apenas o do Mundo 8 é o Bowser de verdade." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "世界の平和を乱す、カメ族の大魔王。マリオたちの永遠の宿敵。クッパ軍団を従えて、キノコ王国に襲いかかり、自らの野望を果たそうとする。", titleJpEn: "In His Series", textJpEn: "The great demon king of the Koopa race, who disturbs world peace. The eternal archenemy of Mario and friends. Commanding the Koopa Troop, he assaults the Mushroom Kingdom to fulfill his own ambitions.", titlePt: "Na Série Original", textPt: "O grande rei demônio da raça Koopa, que perturba a paz mundial. O eterno arquiinimigo do Mario e amigos. Comandando a Tropa Koopa, ele ataca o Reino dos Cogumelos para realizar suas próprias ambições." },
  { titleEn: "[★☆☆] A Bowser Impostor?!", titleJp: "にせクッパ!?", textJp: "『スーパーマリオブラザーズ2』には、青いクッパが登場する。倒すとその先にいつもの緑のクッパがいる。『スマブラ』では、8Pカラーで青いクッパになる。", titleJpEn: "A Bowser Impostor?!", textJpEn: "In \"Super Mario Bros. 2,\" a blue Bowser appears. Defeat him and the usual green Bowser is waiting beyond. In Smash Bros., Bowser's 8P color makes him blue.", titlePt: "Um Bowser Impostor?!", textPt: "Em \"Super Mario Bros. 2,\" um Bowser azul aparece. Derrote-o e o Bowser verde de sempre estará além. Em Smash Bros., a cor 8P do Bowser o deixa azul." },
  { titleEn: "[★★☆] Aim Fire Breath (Neutral Special)", titleJp: "クッパブレスの向き 【通常必殺ワザ】", textJp: "方向入力で炎を吐く方向を調節可能。相手が地上にいる時は少し上に炎を吐けば抜け出されにくい。炎の勢いは段々弱くなるのでやめ時が肝心。", titleJpEn: "Aiming Fire Breath (Neutral Special)", textJpEn: "Directional input adjusts the angle of the fire breath. If an opponent is on the ground, aiming the fire slightly upward makes it harder for them to escape. The fire's intensity gradually weakens, so knowing when to stop is key.", titlePt: "Mirando o Fire Breath (Especial Neutro)", textPt: "O input direcional ajusta o ângulo do sopro de fogo. Se um adversário estiver no chão, mirar o fogo um pouco para cima dificulta que ele escape. A intensidade do fogo enfraquece gradualmente, então saber quando parar é essencial." },
  { titleEn: "[★☆☆] The Power of Fire Breath (Neutral Special)", titleJp: "クッパブレスのチャージ時間 【通常必殺ワザ】", textJp: "炎の勢いは、一度弱まっても時間がたてば段々回復する。炎が一番弱くなってから、再び一番強くなるまでにかかる時間は約１２秒。", titleJpEn: "Fire Breath's Charge Time (Neutral Special)", textJpEn: "Even after the fire's intensity weakens, it gradually recovers over time. It takes about 12 seconds from the fire's weakest point to return to full strength.", titlePt: "Tempo de Carga do Fire Breath (Especial Neutro)", textPt: "Mesmo depois que a intensidade do fogo enfraquece, ela se recupera gradualmente com o tempo. Leva cerca de 12 segundos desde o ponto mais fraco do fogo até retornar à força máxima." },
  { titleEn: "[★★☆] Flying Slam (Side Special)", titleJp: "ダイビングプレス 【横必殺ワザ】", textJp: "空中では、クッパと相手の両方とも左右入力で落下位置をずらせる。蓄積ダメージが少ない方が、有利に動かせる。", titleJpEn: "Flying Slam (Side Special)", textJpEn: "In the air, both Bowser and the grabbed opponent can shift their falling position with left/right input. Whoever has less accumulated damage can move more effectively.", titlePt: "Flying Slam (Especial Lateral)", textPt: "No ar, tanto o Bowser quanto o adversário agarrado podem deslocar sua posição de queda com input esquerda/direita. Quem tem menos dano acumulado consegue se mover com mais eficácia." },
  { titleEn: "[★☆☆] Flying Slam Entanglement (Side Special)", titleJp: "ダイビングプレスで巻き添え 【横必殺ワザ】", textJp: "つかんだ相手を地上に叩きつけて、ふっとばす。落下中に接触した他の相手を巻き込んで、まとめてふっとばすこともできる。奈落へ落ちると相手より先に自滅するので注意。", titleJpEn: "Flying Slam Entanglement (Side Special)", textJpEn: "Slams the grabbed opponent into the ground, launching them. Other opponents touched during the fall can also get caught up and launched together. Be careful — falling into a pit causes Bowser to self-destruct before the opponent.", titlePt: "Envolvimento do Flying Slam (Especial Lateral)", textPt: "Arremessa o adversário agarrado contra o chão, lançando-o. Outros adversários tocados durante a queda também podem ser pegos e lançados juntos. Cuidado — cair em um buraco faz o Bowser se autodestruir antes do adversário." },
  { titleEn: "[★★☆] Whirling Tip for Whirling Fortress (Up Special)", titleJp: "スピニングシェルで上昇 【上必殺ワザ】", textJp: "空中で出した時にボタンを連打すれば、少しだけ高く飛ぶことができる。", titleJpEn: "Rising with Whirling Fortress (Up Special)", textJpEn: "If you mash the button while using it in the air, you can gain a bit more height.", titlePt: "Subindo com o Whirling Fortress (Especial Cima)", textPt: "Se você apertar o botão repetidamente enquanto o usa no ar, pode ganhar um pouco mais de altura." },
  { titleEn: "[★★☆] Counter with Whirling Fortress (Up Special)", titleJp: "スピニングシェルでカウンター 【上必殺ワザ】", textJp: "地上で相手の攻撃をシールドした直後、シールドをキャンセルして相手の方向に入力しながら使えば、カウンターのような使い方ができる。", titleJpEn: "Counter with Whirling Fortress (Up Special)", textJpEn: "Immediately after shielding an opponent's attack on the ground, canceling the shield and using it while inputting toward the opponent lets you use it almost like a counter.", titlePt: "Contra-atacando com o Whirling Fortress (Especial Cima)", textPt: "Logo após bloquear o ataque de um adversário no chão, cancelar o escudo e usá-lo enquanto inputa em direção ao adversário permite usá-lo quase como um contra-ataque." },
  { titleEn: "[★★☆] Bowser Bomb (Down Special)", titleJp: "クッパドロップ 【下必殺ワザ】", textJp: "地上で出すと、最初に相手をツノで突き上げる。ツノが当たれば、その後の急降下攻撃も当たりやすい。", titleJpEn: "Bowser Bomb (Down Special)", textJpEn: "When used on the ground, it first pierces upward with his horns. If the horns connect, the follow-up dive attack is more likely to hit as well.", titlePt: "Bowser Bomb (Especial Baixo)", textPt: "Quando usado no chão, primeiro perfura para cima com seus chifres. Se os chifres conectarem, o ataque de mergulho seguinte também tem mais chance de acertar." },
  { titleEn: "[★★☆] Bowser Bomb the Ledge (Down Special)", titleJp: "クッパドロップ中のガケつかまり 【下必殺ワザ】", textJp: "落下中、近くにガケがあればつかまることができる。上空から地上にすぐに下りられて便利だけれど、ガケから離れすぎると自滅してしまう。", titleJpEn: "Grabbing the Ledge During Bowser Bomb (Down Special)", textJpEn: "While falling, he can grab a nearby ledge if one is close. It's convenient for quickly descending from high in the air to the ground, but drifting too far from the ledge results in self-destruction.", titlePt: "Agarrando a Borda Durante o Bowser Bomb (Especial Baixo)", textPt: "Enquanto cai, ele pode se agarrar a uma borda próxima, se houver uma. É conveniente para descer rapidamente do alto até o chão, mas se afastar demais da borda resulta em autodestruição." },
  { titleEn: "[★★★] Bowser Bomb—the Shield Breaker (Down Special)", titleJp: "クッパドロップでシールドブレイク 【下必殺ワザ】", textJp: "シールドを張っている相手の真上に落下すると、うまく当たれば１発でシールドブレイクすることができる。", titleJpEn: "Bowser Bomb the Shield Breaker (Down Special)", textJpEn: "Falling directly onto an opponent who is shielding can break their shield in a single hit if it connects well.", titlePt: "Bowser Bomb Quebra-Escudos (Especial Baixo)", textPt: "Cair diretamente sobre um adversário que está bloqueando pode quebrar o escudo dele em um único golpe, se conectar bem." },
  { titleEn: "[★☆☆] Giga Bowser Punch (Final Smash)", titleJp: "ギガクッパパンチ 【最後の切りふだ】", textJp: "ギガクッパの巨大パンチは、当たる場所によって、ふっとぶ方向が変わる。相手の蓄積ダメージが高いと、手前にふっとばし即撃墜となる。", titleJpEn: "Giga Bowser Punch (Final Smash)", textJpEn: "Giga Bowser's giant punch sends opponents flying in different directions depending on where it connects. If the opponent's accumulated damage is high, it launches them toward the camera for an instant KO.", titlePt: "Giga Bowser Punch (Final Smash)", textPt: "O soco gigante do Giga Bowser arremessa os adversários em direções diferentes dependendo de onde conecta. Se o dano acumulado do adversário for alto, ele os arremessa em direção à câmera para um KO instantâneo." },
  { titleEn: "[★☆☆] Tough Guy", titleJp: "ひるみにくい体", textJp: "クッパの体は非常に打たれ強い。蓄積ダメージが少ない時は、相手から弱い攻撃を受けてもひるまない。", titleJpEn: "A Body That Doesn't Flinch Easily", textJpEn: "Bowser's body is extremely resilient. When his accumulated damage is low, he doesn't flinch from weak attacks.", titlePt: "Um Corpo Que Não Recua Facilmente", textPt: "O corpo do Bowser é extremamente resistente. Quando seu dano acumulado é baixo, ele não recua com ataques fracos." },
  { titleEn: "[★☆☆] Altering Landing Timing", titleJp: "着地のタイミングをずらす", textJp: "空中から着地するまでの間、地上にいる相手にジャマされそうになったら、下空中攻撃や下必殺ワザを使えば、着地のタイミングをずらせる。", titleJpEn: "Altering Landing Timing", textJpEn: "If a grounded opponent is about to interfere while you're falling from the air, using the down air attack or down special lets you alter your landing timing.", titlePt: "Alterando o Timing de Pouso", textPt: "Se um adversário no chão estiver prestes a interferir enquanto você cai do ar, usar o ataque aéreo baixo ou o especial baixo permite alterar o timing do seu pouso." },
  { titleEn: "[★☆☆] Super Armor", titleJp: "スーパーアーマー", textJp: "蓄積ダメージが低い間は、弱い攻撃にひるまない。強攻撃やスマッシュ攻撃の出始めは、さらに強いスーパーアーマー効果がある。", titleJpEn: "Super Armor", textJpEn: "While accumulated damage is low, he doesn't flinch from weak attacks. The very start of his strong attacks and smash attacks has an even stronger Super Armor effect.", titlePt: "Super Armadura", textPt: "Enquanto o dano acumulado é baixo, ele não recua com ataques fracos. O início de seus ataques fortes e ataques smash tem um efeito de Super Armadura ainda mais forte." },
  { titleEn: "[★☆☆] The Three Heaviest Fighters", titleJp: "重さランキングBEST３", textJp: "１位は「クッパ」、２位は「キングクルール」、３位は「ドンキーコング」と「デデデ」。体が重いファイターは攻撃が強く、ふっとばされにくい。", titleJpEn: "Top 3 Heaviest Fighters", textJpEn: "1st place: \"Bowser.\" 2nd place: \"King K. Rool.\" 3rd place (tied): \"Donkey Kong\" and \"King Dedede.\" Heavier fighters hit harder and are harder to launch.", titlePt: "Top 3 Lutadores Mais Pesados", textPt: "1º lugar: \"Bowser.\" 2º lugar: \"King K. Rool.\" 3º lugar (empate): \"Donkey Kong\" e \"Rei Dedede.\" Lutadores mais pesados batem mais forte e são mais difíceis de arremessar." },
];

async function main() {
  const bowser = await db.fighter.findFirst({
    where: { name: "Bowser" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!bowser) { console.log("Bowser not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: bowser.id },
    data: {
      curatorOverviewEn: "Bowser, the towering King of the Koopas, has been Mario's arch-nemesis since the very first game — and one of Smash's heaviest, hardest-hitting brawlers. His attacks resist flinching thanks to natural super armor, and moves like Whirling Fortress, Bowser Bomb, and the devastating Flying Slam grab punish anyone who gets too close. Success with Bowser means embracing the trade — absorb hits, land the big ones, and let his sheer weight carry the match.",
      curatorOverviewPt: "Bowser, o imponente Rei dos Koopas, é o arquiinimigo do Mario desde o primeiro jogo — e um dos lutadores mais pesados e contundentes do Smash. Seus ataques resistem a recuar graças à super armadura natural, e golpes como Whirling Fortress, Bowser Bomb e o devastador agarrão Flying Slam punem quem chega perto demais. O sucesso com o Bowser significa abraçar a troca de golpes — absorver ataques, acertar os grandes e deixar seu peso decidir a partida.",
      curatorOverviewJp: "カメ族の王者クッパは、初代作品からマリオの宿敵であり続け、スマブラでも最も重く、最も打撃力の高いファイターの一人。天性のスーパーアーマーによって攻撃にひるみにくく、スピニングシェル、クッパドロップ、そして強烈なダイビングプレスのつかみが、近づきすぎた相手を罰する。クッパで勝つには打ち合いを受け入れることが鍵――攻撃を受け止め、大技を叩き込み、その圧倒的な重さで試合を制すのだ。",
      curatorOverviewJpEn: "Bowser, King of the Koopas, has remained Mario's archenemy since the original game — and is one of Smash's heaviest, hardest-hitting fighters. His natural Super Armor makes him resistant to flinching, and moves like Whirling Fortress, Bowser Bomb, and the devastating Flying Slam grab punish anyone who gets too close. Winning with Bowser means embracing the exchange — absorb hits, land the big ones, and let his overwhelming weight decide the match.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = bowser.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 5374-5392 -> 172-190 (02:52-03:10 ZoomZike VLC confirmed)
  const bioSsbm = bowser.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 172, videoEndSec: 190 } });
    console.log("✅ Bio SSBM video: 5374-5392 -> 172-190 (02:52-03:10)");
  }

  // Fix Trophy "Bowser" SSBM to match
  const trophy = await db.collectible.findFirst({ where: { name: "Bowser", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true } });
  if (trophy) {
    await db.collectible.update({ where: { id: trophy.id }, data: { videoStartSec: 172, videoEndSec: 190 } });
    console.log("✅ Trophy Bowser SSBM: -> 172-190");
  }

  // Moves EN+PT+JpEn
  for (const m of bowser.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = bowser.tips.find(t => t.titleEn === data.titleEn);
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
