import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "For Diddy Kong as a fighter, see \"Diddy Kong (X),\" \"Diddy Kong (3DS/Wii U),\" and \"Diddy Kong (SP)\" respectively.",
    pt: "Para o Diddy Kong como lutador, veja respectivamente \"Diddy Kong (X),\" \"Diddy Kong (3DS/Wii U)\" e \"Diddy Kong (SP).\"",
  },
  SSBB: {
    jpEn: "Donkey Kong's partner. Characterized by quick movements that make full use of his small body, and a long tail. He usually follows behind Donkey Kong. He has also gone to rescue Donkey Kong when he was captured, together with his girlfriend, Dixie Kong. He's skilled with barrels, whether playing music or competing in races.",
    pt: "O parceiro do Donkey Kong. Caracterizado por movimentos rápidos que aproveitam bem seu corpo pequeno, e uma longa cauda. Ele geralmente segue atrás do Donkey Kong. Ele também já foi resgatar o Donkey Kong quando este foi capturado, junto com sua namorada, Dixie Kong. Ele é habilidoso com barris, seja tocando música ou competindo em corridas.",
  },
  SSB4: {
    jpEn: "Donkey Kong's dependable partner. His red cap, red shirt, and the \"Rocketbarrel Boost\" on his back are his trademarks. In Smash Bros., he excels at moving quickly to attack. \"Rocketbarrel Boost\" can extend its flight distance by holding the button when activated, and the direction of ascent can be adjusted left and right. It's also effective to trip opponents with \"Banana Peel\" and aim a painful blow at the opening it creates.",
    pt: "O parceiro confiável do Donkey Kong. Seu boné vermelho, camisa vermelha, e o \"Rocketbarrel Boost\" nas costas são suas marcas registradas. Em Smash Bros., ele se destaca em se mover rapidamente para atacar. O \"Rocketbarrel Boost\" pode estender sua distância de voo segurando o botão ao ser ativado, e a direção da subida pode ser ajustada para esquerda e direita. Também é eficaz derrubar adversários com \"Banana Peel\" e mirar um golpe doloroso na abertura que isso cria.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Diddy Kong's Origins", titleJp: "ディディーコングの初登場作品", textJp: "身軽ですばしっこいディディーコングの初登場作品は、１９９４年発売の『スーパードンキーコング』。ドンキーコングを助ける相棒として活躍。", titleJpEn: "Diddy Kong's Origins", textJpEn: "The light and nimble Diddy Kong's debut was in \"Donkey Kong Country,\" released in 1994. He was active as a partner who helps Donkey Kong.", titlePt: "As Origens do Diddy Kong", textPt: "O debut do ágil e leve Diddy Kong foi em \"Donkey Kong Country,\" lançado em 1994. Ele atuou como um parceiro que ajuda o Donkey Kong." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『スーパードンキーコング』では、ドンキーコングの親友であり、相棒として登場。パワーがないため倒せない敵もいるが、素早いダッシュやジャンプ力の高さが魅力。", titleJpEn: "In His Series", textJpEn: "In \"Donkey Kong Country,\" he appears as Donkey Kong's best friend and partner. He lacks the power to defeat some enemies, but his fast dash and high jumping ability are his appeal.", titlePt: "Na Série Original", textPt: "Em \"Donkey Kong Country,\" ele aparece como o melhor amigo e parceiro do Donkey Kong. Ele não tem poder suficiente para derrotar alguns inimigos, mas sua corrida rápida e alta capacidade de pulo são seu apelo." },
  { titleEn: "[★★☆] Peanut Popgun (Neutral Special)", titleJp: "ピーナッツ・ポップガン 【通常必殺ワザ】", textJp: "ためると威力が上がるが、ためすぎるとその場で大爆発。その爆発にうまく相手を巻き込めれば、かなりのダメージ。", titleJpEn: "Peanut Popgun (Neutral Special)", textJpEn: "Charging increases its power, but charging too much causes a huge explosion on the spot. If an opponent is successfully caught in that explosion, it deals considerable damage.", titlePt: "Peanut Popgun (Especial Neutro)", textPt: "Carregar aumenta seu poder, mas carregar demais causa uma grande explosão no local. Se um adversário for pego com sucesso nessa explosão, causa dano considerável." },
  { titleEn: "[★☆☆] Peanut Popgun's Sign (Neutral Special)", titleJp: "ピーナッツ・ポップガンの合図 【通常必殺ワザ】", textJp: "ワザをためすぎると暴発する。ディディーコングが手で帽子を押さえたら、暴発前の合図。", titleJpEn: "Peanut Popgun's Sign (Neutral Special)", textJpEn: "Charging the move too much causes it to backfire. When Diddy Kong holds his hat with his hand, that's the sign it's about to backfire.", titlePt: "O Sinal do Peanut Popgun (Especial Neutro)", textPt: "Carregar o golpe demais faz com que ele dispare por acidente. Quando o Diddy Kong segura seu boné com a mão, esse é o sinal de que está prestes a disparar acidentalmente." },
  { titleEn: "[★★☆] Peanut Popgun Projectiles (Neutral Special)", titleJp: "ピーナッツ・ポップガンの弾 【通常必殺ワザ】", textJp: "撃ち出したピーナッツは、相手がタイミングよくボタンを押すとキャッチできる。適度にためて速い弾を撃てば、相手にタイミングを計られにくい。", titleJpEn: "Peanut Popgun Projectiles (Neutral Special)", textJpEn: "The fired peanut can be caught by an opponent who presses the button with good timing. Charging it moderately and firing a fast shot makes it harder for the opponent to time it.", titlePt: "Os Projéteis do Peanut Popgun (Especial Neutro)", textPt: "O amendoim disparado pode ser pego por um adversário que aperta o botão no timing certo. Carregar moderadamente e disparar um tiro rápido dificulta que o adversário acerte o timing." },
  { titleEn: "[★★☆] Monkey Flip (Side Special)", titleJp: "モンキーフリップ 【横必殺ワザ】", textJp: "空中の相手をつかむと、地上より振りほどかれるのが早い。すぐにボタンを入力して次の行動につなげよう。", titleJpEn: "Monkey Flip (Side Special)", textJpEn: "Grabbing an airborne opponent gets shaken off faster than on the ground. Input the button quickly to move into the next action.", titlePt: "Monkey Flip (Especial Lateral)", textPt: "Agarrar um adversário no ar faz com que ele se solte mais rápido do que no chão. Inpute o botão rapidamente para passar para a próxima ação." },
  { titleEn: "[★★☆] Monkey Flip to Flying Kick (Side Special)", titleJp: "モンキーフリップからのとび蹴り 【横必殺ワザ】", textJp: "とびかかり中に攻撃ボタンを押すと、とび蹴りになる。とび蹴りは威力も高く、ふっとばし力もある。", titleJpEn: "Monkey Flip to Flying Kick (Side Special)", textJpEn: "Pressing the attack button while leaping turns it into a flying kick. The flying kick has both high power and strong knockback.", titlePt: "Do Monkey Flip ao Chute Voador (Especial Lateral)", textPt: "Apertar o botão de ataque enquanto salta o transforma em um chute voador. O chute voador tem tanto alto poder quanto forte arremesso." },
  { titleEn: "[★☆☆] Uses for Monkey Flip (Side Special)", titleJp: "モンキーフリップの使い分け 【横必殺ワザ】", textJp: "しがみついた後、攻撃ボタンを押すと横にふっとばし、ジャンプを入力すると、相手を踏み台にしてジャンプする。", titleJpEn: "Uses for Monkey Flip (Side Special)", textJpEn: "After clinging on, pressing the attack button launches the opponent sideways, while inputting jump uses the opponent as a springboard to jump.", titlePt: "Usos do Monkey Flip (Especial Lateral)", textPt: "Depois de se agarrar, apertar o botão de ataque arremessa o adversário lateralmente, enquanto inputar pulo usa o adversário como um trampolim para pular." },
  { titleEn: "[★★☆] Monkey Flip Technique (Side Special)", titleJp: "モンキーフリップのテクニック 【横必殺ワザ】", textJp: "しがみついて相手を踏み台にしてジャンプした後は、空中にいる間にもう一度モンキーフリップを使うことができる。複数の相手と戦う時などに。", titleJpEn: "Monkey Flip Technique (Side Special)", textJpEn: "After clinging on and jumping off an opponent as a springboard, Monkey Flip can be used once more while in the air. Useful when fighting multiple opponents.", titlePt: "Técnica do Monkey Flip (Especial Lateral)", textPt: "Depois de se agarrar e pular usando um adversário como trampolim, o Monkey Flip pode ser usado mais uma vez enquanto está no ar. Útil ao lutar contra vários adversários." },
  { titleEn: "[★★☆] Monkey Flip's Characteristics (Side Special)", titleJp: "モンキーフリップの特性 【横必殺ワザ】", textJp: "飛び蹴りを行わなければ、ワザが終わった後にモンキーフリップ以外のワザを使うことができる。バレルジェットにつなげることで、遠い距離の復帰も可能。", titleJpEn: "Monkey Flip's Characteristics (Side Special)", textJpEn: "If the flying kick isn't performed, moves other than Monkey Flip can be used after it ends. Following up with Rocketbarrel Boost also enables recovery from long distances.", titlePt: "As Características do Monkey Flip (Especial Lateral)", textPt: "Se o chute voador não for realizado, golpes além do Monkey Flip podem ser usados depois que ele termina. Fazer um acompanhamento com o Rocketbarrel Boost também permite recuperação a longas distâncias." },
  { titleEn: "[★★☆] Steering Rocketbarrel Boost (Up Special)", titleJp: "バレルジェットで移動 【上必殺ワザ】", textJp: "ためている間に方向を入力すれば飛ぶ方向を変えられる。また、飛んでいる最中も移動方向を調整できる。", titleJpEn: "Steering Rocketbarrel Boost (Up Special)", textJpEn: "Inputting a direction while charging can change the direction of flight. The direction of movement can also be adjusted while flying.", titlePt: "Direcionando o Rocketbarrel Boost (Especial Cima)", textPt: "Inputar uma direção enquanto carrega pode mudar a direção do voo. A direção do movimento também pode ser ajustada enquanto voa." },
  { titleEn: "[★★☆] Rocketbarrel Boost (Up Special)", titleJp: "バレルジェット 【上必殺ワザ】", textJp: "バレルジェットを出しているときに攻撃を受けると、バレルジェットだけが飛んでいってしまう。", titleJpEn: "Rocketbarrel Boost (Up Special)", textJpEn: "If Diddy Kong takes a hit while using Rocketbarrel Boost, only the barrel jet flies off.", titlePt: "Rocketbarrel Boost (Especial Cima)", textPt: "Se o Diddy Kong receber um golpe enquanto usa o Rocketbarrel Boost, apenas o barril a jato sai voando." },
  { titleEn: "[★★☆] Warnings for Rocketbarrel Boost (Up Special)", titleJp: "バレルジェットの注意点 【上必殺ワザ】", textJp: "真横へ飛び出すことも可能。シールド中の相手もすり抜けて飛んでいくので反撃されにくいが、ガケから飛び出すと何もできずに落下してしまう。", titleJpEn: "Warnings for Rocketbarrel Boost (Up Special)", textJpEn: "It's also possible to launch straight sideways. Since it passes through opponents who are shielding, it's hard to be punished, but launching off a ledge leaves him falling helplessly.", titlePt: "Cuidados com o Rocketbarrel Boost (Especial Cima)", textPt: "Também é possível ser lançado diretamente para o lado. Como ele atravessa adversários que estão bloqueando, é difícil ser punido, mas ser lançado para fora de uma borda o deixa caindo indefeso." },
  { titleEn: "[★★★] Rocketbarrel Boost Techniques (Up Special)", titleJp: "バレルジェットのテクニック 【上必殺ワザ】", textJp: "すり抜けられる足場をギリギリ通り過ぎるように使用すると、着地間際に バレルジェットが足場にぶつかって爆発する。足場上にいる相手への攻撃に。", titleJpEn: "Rocketbarrel Boost Techniques (Up Special)", textJpEn: "Using it to barely pass by a pass-through platform makes the barrel jet collide with the platform and explode just before landing. Useful as an attack against opponents standing on the platform.", titlePt: "Técnicas do Rocketbarrel Boost (Especial Cima)", textPt: "Usá-lo para passar raspando por uma plataforma atravessável faz o barril a jato colidir com a plataforma e explodir pouco antes de pousar. Útil como ataque contra adversários em cima da plataforma." },
  { titleEn: "[★★☆] Rocketbarrel Boost Cut Loose (Up Special)", titleJp: "切り離しバレルジェット 【上必殺ワザ】", textJp: "使用中に攻撃を受けて切り離されたバレルジェットは、スティック入力で、少し操作することができる。", titleJpEn: "Rocketbarrel Boost Cut Loose (Up Special)", textJpEn: "The Rocketbarrel that gets separated after taking a hit during use can be slightly controlled with the control stick.", titlePt: "O Rocketbarrel Solto (Especial Cima)", textPt: "O Rocketbarrel que se separa após receber um golpe durante o uso pode ser levemente controlado com o analógico." },
  { titleEn: "[★☆☆] Banana Peel (Down Special)", titleJp: "バナナのかわ 【下必殺ワザ】", textJp: "後ろにバナナのかわを放り投げる。バナナのかわは踏んだりぶつかった相手を転ばせる。", titleJpEn: "Banana Peel (Down Special)", textJpEn: "Tosses a banana peel behind him. The banana peel trips opponents who step on it or hit it.", titlePt: "Banana Peel (Especial Baixo)", textPt: "Arremessa uma casca de banana para trás. A casca de banana derruba adversários que pisam nela ou colidem com ela." },
  { titleEn: "[★★☆] Banana Peel (Down Special)", titleJp: "バナナのかわのポイント 【下必殺ワザ】", textJp: "自分で出したバナナのかわがあると、次のかわを出せない。また、２回投げると消える。", titleJpEn: "Banana Peel's Key Point (Down Special)", textJpEn: "If he already has a banana peel out, he can't throw another one. Also, it disappears after being thrown twice.", titlePt: "O Ponto-Chave da Banana Peel (Especial Baixo)", textPt: "Se ele já tiver uma casca de banana no campo, não pode jogar outra. Além disso, ela desaparece depois de ser arremessada duas vezes." },
  { titleEn: "[★★☆] Items and Banana Peel (Down Special)", titleJp: "アイテムとバナナのかわ 【下必殺ワザ】", textJp: "アイテムを持っている時に使うと、持っているアイテムもバナナのかわと一緒に放り投げる。ただし、両手で持っているアイテムは投げられない。", titleJpEn: "Items and Banana Peel (Down Special)", textJpEn: "Using it while holding an item throws the held item along with the banana peel. However, items held with both hands can't be thrown this way.", titlePt: "Itens e a Banana Peel (Especial Baixo)", textPt: "Usá-lo enquanto segura um item arremessa o item junto com a casca de banana. Porém, itens segurados com as duas mãos não podem ser arremessados dessa forma." },
  { titleEn: "[★☆☆] Hyper Rocketbarrel (Final Smash)", titleJp: "ハイパーバレルジェット 【最後の切りふだ】", textJp: "新型バレルジェットで、画面内を縦横無尽に突進する。最後の一撃は、もっとも攻撃に当たっていた相手を狙うが、まわりも巻き込める。", titleJpEn: "Hyper Rocketbarrel (Final Smash)", textJpEn: "Using a new model Rocketbarrel, he charges freely across the screen. The final blow targets whichever opponent was hit the most, but can also catch others nearby.", titlePt: "Hyper Rocketbarrel (Final Smash)", textPt: "Usando um novo modelo de Rocketbarrel, ele avança livremente pela tela. O golpe final mira no adversário que foi mais atingido, mas também pode pegar outros por perto." },
  { titleEn: "[★☆☆] Hand Clap (Down Tilt Attack)", titleJp: "ハンドクラップ 【下強攻撃】", textJp: "素早くワザを出せてスキも小さいので、地上でのけん制に使いやすい。当てた後は追撃のチャンスで、状況によっては上スマッシュ攻撃も狙える。", titleJpEn: "Hand Clap (Down Tilt Attack)", textJpEn: "Since it comes out quickly with a small opening, it's easy to use for ground zoning. After landing it, there's a chance to follow up, and depending on the situation, an up smash attack can even be aimed for.", titlePt: "Hand Clap (Ataque Inclinado Baixo)", textPt: "Como sai rapidamente com uma pequena abertura, é fácil de usar para controle de espaço no chão. Depois de acertá-lo, há uma chance de acompanhamento, e dependendo da situação, um ataque smash cima pode até ser buscado." },
  { titleEn: "[★☆☆] Screw Kick (Forward Air Attack)", titleJp: "スクリューキック 【前空中攻撃】", textJp: "リーチが長く、攻撃が当たる時間も長いため、相手の行動を制限しやすい。空中でのけん制や、ダッシュから小ジャンプした後の攻撃として、活用できる。", titleJpEn: "Screw Kick (Forward Air Attack)", textJpEn: "With long reach and a long active hitbox duration, it's easy to restrict the opponent's options. It can be used for aerial zoning or as an attack after a short hop from a dash.", titlePt: "Screw Kick (Ataque Aéreo Frente)", textPt: "Com longo alcance e uma longa duração de hitbox ativa, é fácil restringir as opções do adversário. Pode ser usado para controle de espaço aéreo ou como um ataque depois de um pulo curto a partir de uma disparada." },
];

async function main() {
  const dk = await db.fighter.findFirst({
    where: { name: "Diddy Kong" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!dk) { console.log("Diddy Kong not found"); return; }

  await db.fighter.update({
    where: { id: dk.id },
    data: {
      curatorOverviewEn: "Diddy Kong, Donkey Kong's quick and clever sidekick, is a technical zoner built around his signature Banana Peel — a persistent trap that punishes careless approaches and sets up devastating follow-ups. Peanut Popgun offers a charged projectile with a risky self-damaging overcharge, while Monkey Flip grabs airborne or grounded opponents into extra mobility, and Rocketbarrel Boost provides flexible, steerable recovery. Small, fast, and trap-heavy, Diddy rewards players who control neutral through banana placement rather than brute force.",
      curatorOverviewPt: "Diddy Kong, o companheiro rápido e astuto do Donkey Kong, é um lutador técnico de controle de espaço construído em torno de sua Banana Peel característica — uma armadilha persistente que pune abordagens descuidadas e prepara acompanhamentos devastadores. Peanut Popgun oferece um projétil carregável com um sobrecarregamento arriscado que causa dano a si mesmo, enquanto Monkey Flip agarra adversários no ar ou no chão para mobilidade extra, e Rocketbarrel Boost oferece uma recuperação flexível e direcionável. Pequeno, rápido e cheio de armadilhas, o Diddy recompensa jogadores que controlam o neutro através do posicionamento de bananas em vez de força bruta.",
      curatorOverviewJp: "ドンキーコングの素早く賢い相棒ディディーコングは、代名詞のバナナのかわを中心に据えたテクニカルな空間制圧型ファイター――不用意な接近を罰し、強力な追撃を用意する持続的な罠だ。ピーナッツ・ポップガンはためられる飛び道具を提供するが、ためすぎると自分にもダメージを与えるリスクがある。一方、モンキーフリップは空中でも地上でも相手をつかんで追加の機動力を得られ、バレルジェットは柔軟で操作可能な復帰を可能にする。小柄で素早く、罠を多用するディディーは、力任せではなくバナナの配置で中距離戦を制するプレイヤーに応える。",
      curatorOverviewJpEn: "Diddy Kong, Donkey Kong's quick and clever partner, is a technical space-control fighter built around his signature Banana Peel — a persistent trap that punishes careless approaches and sets up powerful follow-ups. Peanut Popgun provides a chargeable projectile, though overcharging risks damaging himself. Monkey Flip, meanwhile, grabs opponents in the air or on the ground for extra mobility, and Rocketbarrel Boost enables flexible, controllable recovery. Small, fast, and trap-heavy, Diddy rewards players who control the mid-range through banana placement rather than brute force.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = dk.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = dk.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Banana Peel,\" thrown backward with the down special, is treated the same as a regular item. Be careful, since if a rival picks it up, it can be used against you instead. \"Monkey Flip\" is a side special that leaps forward in a rolling jump to grab an opponent. Pressing the button while jumping delivers a kick attack. After grabbing, the button delivers an additional attack, while a jump input lets him leap high. (SFC) Donkey Kong Country (1994/11) (N64) Donkey Kong Country 2: Diddy's Kong Quest (1995/11)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Banana Peel,\" arremessada para trás com o especial baixo, é tratada da mesma forma que um item comum. Cuidado, pois se um rival a pegar, ela pode ser usada contra você. \"Monkey Flip\" é um especial lateral que salta para frente em um pulo giratório para agarrar um adversário. Apertar o botão durante o pulo libera um ataque de chute. Depois de agarrar, o botão libera um ataque adicional, enquanto um input de pulo permite saltar bem alto. (SFC) Donkey Kong Country (1994/11) (N64) Donkey Kong Country 2: Diddy's Kong Quest (1995/11)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = dk.tips.find(t => t.titleEn === data.titleEn);
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
