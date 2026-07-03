import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBB: {
    jpEn: "A veteran astronaut employed by the shipping company Hocotate Freight. He encounters the mysterious creatures known as Pikmin after crash-landing on an enigmatic planet. By giving orders to the obedient Pikmin, he has them carry his spaceship's parts and repair it. Barely making it back to the company alive, he then finds it on the verge of bankruptcy. He heads back to the planet where the Pikmin live once again, this time to repay the debt.",
    pt: "Um astronauta veterano empregado pela empresa de transporte Hocotate Freight. Ele encontra as misteriosas criaturas conhecidas como Pikmin após um pouso forçado em um planeta enigmático. Dando ordens aos obedientes Pikmin, ele os faz carregar as peças de sua nave espacial e consertá-la. Mal conseguindo voltar vivo para a empresa, ele então a encontra à beira da falência. Ele parte de volta para o planeta onde vivem os Pikmin mais uma vez, desta vez para pagar a dívida.",
  },
  SSB4: {
    jpEn: "The duo of Captain Olimar, a veteran space navigator employed by Hocotate Freight, and Pikmin, the mysterious life forms living on a certain planet. Since Olimar can't properly attack without Pikmin accompanying him, it's best to always keep several Pikmin plucked. Pikmin have different abilities depending on their color, with differences in reach and attack power, so use them wisely in battle.",
    pt: "A dupla formada pelo Capitão Olimar, um navegador espacial veterano empregado pela Hocotate Freight, e os Pikmin, as misteriosas formas de vida que habitam um certo planeta. Como o Olimar não consegue atacar adequadamente sem Pikmin o acompanhando, é melhor sempre manter vários Pikmin arrancados. Os Pikmin têm habilidades diferentes dependendo da cor, com diferenças em alcance e poder de ataque, então use-os com sabedoria na batalha.",
  },
  SSBM: {
    jpEn: "The protagonist of \"Pikmin.\" During space travel, he collides with a shooting star, becomes stranded, and crashes onto a certain lush, green planet. To escape the planet, he must search for his spaceship's parts, scattered in all directions, but the planet's atmosphere is deadly poison to Olimar. He explores the dangerous planet with the help of the mysterious native creatures known as \"Pikmin.\"\nPikmin (GC)",
    pt: "O protagonista de \"Pikmin.\" Durante uma viagem espacial, ele colide com uma estrela cadente, fica à deriva, e cai em um certo planeta verde e exuberante. Para escapar do planeta, ele precisa procurar as peças de sua nave espacial, espalhadas em todas as direções, mas a atmosfera do planeta é veneno mortal para o Olimar. Ele explora o planeta perigoso com a ajuda das misteriosas criaturas nativas conhecidas como \"Pikmin.\"\nPikmin (GC)",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Olimar's Origins", titleJp: "ピクミン＆オリマーの初登場作品", textJp: "オリマーの初登場作品は、２００１年に発売された初代『ピクミン』。ホコタテ運送に勤務するベテラン宇宙航海士で、家族を愛する働き者。", titleJpEn: "Olimar's Origins", textJpEn: "Olimar's debut was in the original \"Pikmin,\" released in 2001. A veteran space navigator employed by Hocotate Freight, and a hardworking family man.", titlePt: "As Origens do Olimar", textPt: "O debut do Olimar foi no \"Pikmin\" original, lançado em 2001. Um navegador espacial veterano empregado pela Hocotate Freight, e um trabalhador dedicado à família." },
  { titleEn: "[★☆☆] Alph's Origins", titleJp: "ピクミン＆アルフの初登場作品", textJp: "アルフの初登場作品は、２０１３年に発売された『ピクミン３』。明るく前向きな性格で、仕事に熱心な若きエンジニア。", titleJpEn: "Alph's Origins", textJpEn: "Alph's debut was in \"Pikmin 3,\" released in 2013. A cheerful, positive young engineer devoted to his work.", titlePt: "As Origens do Alph", textPt: "O debut do Alph foi em \"Pikmin 3,\" lançado em 2013. Um jovem engenheiro alegre, positivo e dedicado ao trabalho." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "宇宙船「ドルフィン号」での宇宙旅行中に事故にあい、未開の惑星に墜落。出会ったピクミンたちと協力して、宇宙船の修理を目指す。", titleJpEn: "In His Series", textJpEn: "During a space voyage aboard the ship \"Hocotate Ship,\" he has an accident and crashes onto an uncharted planet. He works together with the Pikmin he meets to repair his ship.", titlePt: "Na Série Original", textPt: "Durante uma viagem espacial a bordo da nave \"Hocotate Ship,\" ele sofre um acidente e cai em um planeta desconhecido. Ele trabalha junto com os Pikmin que encontra para consertar sua nave." },
  { titleEn: "[★☆☆] Origins of Name \"Pikmin\"", titleJp: "ピクミンの名前の由来", textJp: "「ピクミン」という名称は、オリマーの好物である野菜「ピクピクニンジン」に似ていたことから名づけられた。", titleJpEn: "Origins of Name \"Pikmin\"", textJpEn: "The name \"Pikmin\" comes from its resemblance to Olimar's favorite vegetable, the \"Pikpik Carrot.\"", titlePt: "As Origens do Nome \"Pikmin\"", textPt: "O nome \"Pikmin\" vem de sua semelhança com o vegetal favorito do Olimar, a \"Pikpik Carrot.\"" },
  { titleEn: "[★☆☆] Pikmin Pluck (Neutral Special)", titleJp: "ピクミンひっこ抜き 色 【通常必殺ワザ】", textJp: "ピクミンを引っこ抜くと、必ず赤、黄、青、白、紫の順番で出てくる。", titleJpEn: "Pikmin Pluck (Neutral Special)", textJpEn: "Plucking Pikmin always brings them out in the order red, yellow, blue, white, and purple.", titlePt: "Pikmin Pluck (Especial Neutro)", textPt: "Arrancar Pikmin sempre os traz na ordem vermelho, amarelo, azul, branco e roxo." },
  { titleEn: "[★☆☆] Pikmin Pluck's Limit (Neutral Special)", titleJp: "ピクミンひっこ抜き 数 【通常必殺ワザ】", textJp: "ひっこ抜いたピクミンは、最大３匹まで連れていける。３匹いる時にひっこ抜くと、空振りしてしまう。", titleJpEn: "Pikmin Pluck's Limit (Neutral Special)", textJpEn: "Up to 3 plucked Pikmin can be carried at a time. Plucking while already at 3 results in a whiff.", titlePt: "O Limite do Pikmin Pluck (Especial Neutro)", textPt: "Até 3 Pikmin arrancados podem ser carregados por vez. Arrancar enquanto já tem 3 resulta em um golpe vazio." },
  { titleEn: "[★☆☆] Pikmin Throw (Side Special)", titleJp: "ピクミン投げ 【横必殺ワザ】", textJp: "投げつけたピクミンが、相手にくっついて連続攻撃する。紫ピクミンだけは相手に体当たりで攻撃し、くっつかない。", titleJpEn: "Pikmin Throw (Side Special)", textJpEn: "The thrown Pikmin latches onto the opponent and attacks repeatedly. Only the purple Pikmin attacks with a body check instead of latching on.", titlePt: "Pikmin Throw (Especial Lateral)", textPt: "O Pikmin arremessado se agarra ao adversário e ataca repetidamente. Apenas o Pikmin roxo ataca com uma investida corporal em vez de se agarrar." },
  { titleEn: "[★★☆] Pikmin Hang Time (Side Special)", titleJp: "ピクミンのくっつき 【横必殺ワザ】", textJp: "投げつけたピクミンが相手にくっついている時間は、相手の蓄積ダメージが少ないほど長くなる。", titleJpEn: "Pikmin Hang Time (Side Special)", textJpEn: "The time a thrown Pikmin stays latched onto an opponent is longer the lower the opponent's accumulated damage is.", titlePt: "O Tempo de Agarre do Pikmin (Especial Lateral)", textPt: "O tempo que um Pikmin arremessado fica agarrado a um adversário é maior quanto menor for o dano acumulado do adversário." },
  { titleEn: "[★☆☆] Pikmin Order (Down Special)", titleJp: "ピクミン整列 【下必殺ワザ】", textJp: "ピクミンを整列させるときに、その並び順が変わる。うまく使えば、好きな色のピクミンで攻撃ができる。", titleJpEn: "Pikmin Order (Down Special)", textJpEn: "The order of the Pikmin changes when he lines them up. Used well, he can attack with the color of Pikmin he wants.", titlePt: "Pikmin Order (Especial Baixo)", textPt: "A ordem dos Pikmin muda quando ele os alinha. Usado bem, ele pode atacar com a cor de Pikmin que quiser." },
  { titleEn: "[★☆☆] Winged Pikmin (Up Special)", titleJp: "羽ピクミン 【上必殺ワザ】", textJp: "連れているピクミンが多いほど、上昇しにくくなる。白ピクミンが軽く、紫ピクミンが重い特徴も、上昇距離に影響する。", titleJpEn: "Winged Pikmin (Up Special)", textJpEn: "The more Pikmin he has with him, the harder it is to rise. The trait of white Pikmin being light and purple Pikmin being heavy also affects the rising distance.", titlePt: "Winged Pikmin (Especial Cima)", textPt: "Quanto mais Pikmin ele tem consigo, mais difícil é subir. A característica dos Pikmin brancos serem leves e dos roxos serem pesados também afeta a distância de subida." },
  { titleEn: "[★☆☆] Orderly Pikmin (Down Special)", titleJp: "笛でピクミン整列 【下必殺ワザ】", textJp: "散らばっているピクミンを笛の音で呼びもどす。なかなか帰ってこないピクミンも、すぐに整列させる。", titleJpEn: "Orderly Pikmin (Down Special)", textJpEn: "Calls back scattered Pikmin with the sound of a whistle. Even Pikmin that are slow to return get lined up immediately.", titlePt: "Orderly Pikmin (Especial Baixo)", textPt: "Chama de volta os Pikmin espalhados com o som de um apito. Até os Pikmin que demoram para voltar são alinhados imediatamente." },
  { titleEn: "[★☆☆] Super Armor with Pikmin Order (Down Special)", titleJp: "ピクミン整列でスーパーアーマー 【下必殺ワザ】", textJp: "出始めにスーパーアーマー効果があるため、ピクミンを呼ぶだけでなく、相手の攻撃を受けてもふっとばされずにいられる。", titleJpEn: "Super Armor with Pikmin Order (Down Special)", textJpEn: "The start of the move has a super armor effect, so besides calling Pikmin, he can avoid being launched even if hit by an opponent's attack.", titlePt: "Super Armadura com o Pikmin Order (Especial Baixo)", textPt: "O início do golpe tem um efeito de super armadura, então além de chamar os Pikmin, ele pode evitar ser arremessado mesmo se atingido pelo ataque de um adversário." },
  { titleEn: "[★★☆] End of Day (Final Smash)", titleJp: "一日の終わり 【最後の切りふだ】", textJp: "ドルフィン初号機に搭乗する時に近くにいる相手は地面に埋める。また、ドルフィン号が空中にいる相手に接触すると、相手を下に叩き落とす。", titleJpEn: "End of Day (Final Smash)", textJpEn: "Opponents nearby when he boards the Hocotate Ship are buried in the ground. Also, if the Hocotate Ship makes contact with airborne opponents, it knocks them down.", titlePt: "End of Day (Final Smash)", textPt: "Adversários próximos quando ele embarca no Hocotate Ship são enterrados no chão. Além disso, se o Hocotate Ship entrar em contato com adversários no ar, ele os derruba para baixo." },
  { titleEn: "[★★☆] Starship Landing Site (Final Smash)", titleJp: "ドルフィン初号機の落下地点 【最後の切りふだ】", textJp: "落下するドルフィン初号機は、方向入力で落下地点を調節できる。上手く操って落とし、大ダメージを狙おう。", titleJpEn: "Starship Landing Site (Final Smash)", textJpEn: "The falling Hocotate Ship's landing point can be adjusted with directional input. Steer it well to aim for big damage.", titlePt: "O Ponto de Pouso da Nave (Final Smash)", textPt: "O ponto de queda do Hocotate Ship que está caindo pode ser ajustado com input direcional. Direcione-o bem para buscar bastante dano." },
  { titleEn: "[★★☆] Smash Attack", titleJp: "スマッシュ攻撃", textJp: "ピクミン＆オリマーのスマッシュ攻撃は、３種類すべてが飛び道具。リフレクターなどで反射されてしまうので注意が必要。", titleJpEn: "Smash Attack", textJpEn: "All three of Pikmin & Olimar's smash attacks are projectiles. Be careful, as they can be reflected by things like reflectors.", titlePt: "Ataque Smash", textPt: "Todos os três ataques smash do Pikmin & Olimar são projéteis. Cuidado, pois eles podem ser refletidos por coisas como refletores." },
  { titleEn: "[★☆☆] Pikmin Left/Right Dash (Down Smash Attack)", titleJp: "ピクミン左右ダッシュ 【下スマッシュ攻撃】", textJp: "連れているピクミンが２匹いれば、前後に攻撃を出せる。ピクミンが１匹しかいない時は、正面にしか攻撃が出ない。", titleJpEn: "Pikmin Left/Right Dash (Down Smash Attack)", textJpEn: "With 2 Pikmin accompanying him, he can attack both forward and backward. With only 1 Pikmin, the attack only comes out in front.", titlePt: "Pikmin Left/Right Dash (Ataque Smash Baixo)", textPt: "Com 2 Pikmin o acompanhando, ele pode atacar tanto para frente quanto para trás. Com apenas 1 Pikmin, o ataque só sai na frente." },
  { titleEn: "[★☆☆] Tornado Attack (Neutral Air Attack)", titleJp: "竜巻アタック 【通常空中攻撃】", textJp: "オリマーが、回転して攻撃するワザ。空中攻撃の中で唯一ピクミンを使わないため、ピクミンがいなくても出せる。", titleJpEn: "Tornado Attack (Neutral Air Attack)", textJpEn: "A move where Olimar spins to attack. It's the only air attack that doesn't use Pikmin, so it can be used even without any.", titlePt: "Tornado Attack (Ataque Aéreo Neutro)", textPt: "Um golpe em que o Olimar gira para atacar. É o único ataque aéreo que não usa Pikmin, então pode ser usado mesmo sem nenhum." },
  { titleEn: "[★☆☆] Lead Pikmin", titleJp: "先頭のピクミン", textJp: "オリマーは列の先頭にいるピクミンで攻撃する。次に使うピクミンは頭上の三角のマークでわかる。", titleJpEn: "Lead Pikmin", textJpEn: "Olimar attacks with whichever Pikmin is at the front of the line. The next Pikmin to be used can be identified by the triangle mark above its head.", titlePt: "Pikmin da Frente", textPt: "O Olimar ataca com o Pikmin que está na frente da fila. O próximo Pikmin a ser usado pode ser identificado pela marca triangular acima de sua cabeça." },
  { titleEn: "[★☆☆] Pikmin's Stamina", titleJp: "ピクミンの体力", textJp: "オリマーから離れた状態のピクミンは相手の攻撃を受けると、簡単にやられてしまう。", titleJpEn: "Pikmin's Stamina", textJpEn: "Pikmin that are separated from Olimar are easily defeated if hit by an opponent's attack.", titlePt: "A Vitalidade do Pikmin", textPt: "Pikmin que estão separados do Olimar são facilmente derrotados se atingidos pelo ataque de um adversário." },
  { titleEn: "[★★★] Pikmin Flowers", titleJp: "ピクミンの花", textJp: "ピクミンの頭の葉っぱは、時間が経つと、つぼみを経て花へと変わる。成長に合わせて、ピクミンの移動速度が少しだけ上がる。", titleJpEn: "Pikmin Flowers", textJpEn: "The leaf on a Pikmin's head changes into a bud and then a flower over time. As it grows, the Pikmin's movement speed slightly increases.", titlePt: "As Flores do Pikmin", textPt: "A folha na cabeça de um Pikmin se transforma em um broto e depois em uma flor com o tempo. Conforme cresce, a velocidade de movimento do Pikmin aumenta um pouco." },
  { titleEn: "[★★☆] Red Pikmin", titleJp: "赤ピクミン", textJp: "赤ピクミンを使ったワザは、ダメージが標準の１.４倍。炎系の攻撃を受けてもやられない長所もあるけれど、投げ攻撃は弱い。", titleJpEn: "Red Pikmin", textJpEn: "Moves using red Pikmin deal 1.4 times normal damage. They also have the advantage of not being defeated by fire-based attacks, but their throw attack is weak.", titlePt: "Pikmin Vermelho", textPt: "Golpes usando Pikmin vermelhos causam 1,4 vezes o dano normal. Eles também têm a vantagem de não serem derrotados por ataques baseados em fogo, mas seu ataque de arremesso é fraco." },
  { titleEn: "[★★☆] Purple Pikmin", titleJp: "紫ピクミン", textJp: "紫ピクミンを使ったワザは、ダメージが標準の１.６倍でふっとばしも強烈。その分リーチが短く、動きが遅い。", titleJpEn: "Purple Pikmin", textJpEn: "Moves using purple Pikmin deal 1.6 times normal damage with fierce knockback. In exchange, their reach is short and they're slow-moving.", titlePt: "Pikmin Roxo", textPt: "Golpes usando Pikmin roxos causam 1,6 vezes o dano normal com arremesso feroz. Em compensação, seu alcance é curto e são lentos." },
  { titleEn: "[★★☆] Yellow Pikmin", titleJp: "黄ピクミン", textJp: "黄ピクミンは、ワザの判定が標準の１.５倍と大きく当たりやすい。また、電撃系攻撃ではやられない特性を持つ。", titleJpEn: "Yellow Pikmin", textJpEn: "Yellow Pikmin have a hitbox 1.5 times the normal size, making them easy to land hits with. They also have the trait of not being defeated by electric attacks.", titlePt: "Pikmin Amarelo", textPt: "Pikmin amarelos têm uma hitbox 1,5 vezes o tamanho normal, tornando-os fáceis de acertar. Eles também têm a característica de não serem derrotados por ataques elétricos." },
  { titleEn: "[★★☆] Blue Pikmin", titleJp: "青ピクミン", textJp: "青ピクミンを使った攻撃は、投げワザのダメージが標準の１.７倍。それ以外のワザも特にマイナス要素は無く、平均的な能力がある。", titleJpEn: "Blue Pikmin", textJpEn: "Attacks using blue Pikmin deal 1.7 times normal damage with throws. Their other moves have no particular downsides, giving them well-rounded abilities.", titlePt: "Pikmin Azul", textPt: "Ataques usando Pikmin azuis causam 1,7 vezes o dano normal em arremessos. Seus outros golpes não têm desvantagens particulares, dando-lhes habilidades equilibradas." },
  { titleEn: "[★★☆] White Pikmin", titleJp: "白ピクミン", textJp: "横必殺ワザではりついた白ピクミンが与えるダメージは、標準の２倍とかなり強力。動きが俊敏でジャンプが高いのも特徴。", titleJpEn: "White Pikmin", textJpEn: "Damage dealt by a latched-on white Pikmin from the side special is twice normal, making it quite powerful. It's also characterized by agile movement and a high jump.", titlePt: "Pikmin Branco", textPt: "O dano causado por um Pikmin branco agarrado através do especial lateral é o dobro do normal, tornando-o bastante poderoso. Também é caracterizado por movimentos ágeis e um pulo alto." },
  { titleEn: "[★☆☆] Blue Pikmin - Strong in the Water", titleJp: "水に強い青ピクミン", textJp: "原作『ピクミン』シリーズ同様、青ピクミンだけは、水に浸かっても平気。", titleJpEn: "Blue Pikmin - Strong in the Water", textJpEn: "Just like in the original \"Pikmin\" series, only blue Pikmin are unaffected by being submerged in water.", titlePt: "Pikmin Azul - Forte na Água", textPt: "Assim como na série original \"Pikmin,\" apenas os Pikmin azuis não são afetados por estarem submersos na água." },
];

async function main() {
  const olimar = await db.fighter.findFirst({
    where: { name: { contains: "Olimar" } },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!olimar) { console.log("Olimar not found"); return; }

  await db.fighter.update({
    where: { id: olimar.id },
    data: {
      curatorOverviewEn: "Olimar commands a rotating army of five Pikmin colors, each with distinct multipliers and traits — red deals bonus damage and resists fire, purple hits hardest but moves slowest, yellow has an oversized hitbox and resists electricity, blue excels at throws and swims freely, and white latches on for double damage from Pikmin Throw. Managing pluck order, positioning, and color matchups is the whole game; without Pikmin, Olimar himself is nearly helpless. A supremely technical zoner, he rewards players who track their Pikmin queue as closely as their opponent.",
      curatorOverviewPt: "Olimar comanda um exército rotativo de cinco cores de Pikmin, cada uma com multiplicadores e características distintas — o vermelho causa dano bônus e resiste a fogo, o roxo bate mais forte mas se move mais devagar, o amarelo tem uma hitbox superdimensionada e resiste a choques elétricos, o azul se destaca em arremessos e nada livremente, e o branco se agarra causando o dobro de dano com o Pikmin Throw. Gerenciar a ordem de arrancar, posicionamento e combinações de cores é o jogo inteiro; sem Pikmin, o próprio Olimar é quase indefeso. Um lutador de controle de espaço supremamente técnico, ele recompensa jogadores que acompanham sua fila de Pikmin tão de perto quanto o adversário.",
      curatorOverviewJp: "オリマーは、それぞれ異なる倍率と特性を持つ５色のピクミンからなるローテーション軍団を率いる――赤は追加ダメージを与え炎に耐性があり、紫は最も強く打つが最も遅く動き、黄は判定が特大で電撃に耐性があり、青は投げに秀で自由に泳ぎ、白はピクミン投げでくっつくと２倍のダメージを与える。ひっこ抜く順番、位置取り、色の相性を管理することがゲームのすべてだ。ピクミンがいなければ、オリマー自身はほぼ無力になる。極めて技術的な空間制圧型ファイターである彼は、相手と同じくらい自分のピクミンの列を注視するプレイヤーに応える。",
      curatorOverviewJpEn: "Olimar commands a rotating army of five Pikmin colors, each with distinct multipliers and traits — red deals bonus damage and resists fire, purple hits hardest but moves the slowest, yellow has an oversized hitbox and resists electric attacks, blue excels at throws and swims freely, and white latches on for double damage from Pikmin Throw. Managing the pluck order, positioning, and color matchups is essentially the whole game; without Pikmin, Olimar himself is nearly helpless. A supremely technical space-control fighter, he rewards players who track their Pikmin queue as closely as their opponent.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = olimar.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = olimar.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "Pikmin can be useful for things besides attacking. For example, throwing a Pikmin at a carrier item like a crate makes it latch on and attack it — it can even destroy it. Also, timing a thrown Pikmin against an opponent's charging move or ranged attack can partially cancel it out. Don't forget to restock if your Pikmin get scattered. (GC) Pikmin (2001/10) (GC) Pikmin 2 (2004/04)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "Os Pikmin podem ser úteis para outras coisas além de atacar. Por exemplo, arremessar um Pikmin contra um item transportador como uma caixa faz com que ele se agarre e ataque — ele pode até destruí-lo. Além disso, cronometrar um Pikmin arremessado contra um golpe de avanço ou ataque à distância do adversário pode cancelá-lo parcialmente. Não se esqueça de repor se seus Pikmin se dispersarem. (GC) Pikmin (2001/10) (GC) Pikmin 2 (2004/04)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = olimar.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fixes
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: { contains: "Olimar" }, smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 7522, videoEndSec: 7538 } });
    console.log(`✅ SSBB Trophy: ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} -> 7522-7538 (2:05:22-2:05:38)`);
  }

  const mainSSB4 = await db.collectible.findFirst({ where: { name: "Olimar", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (mainSSB4) {
    await db.collectible.update({ where: { id: mainSSB4.id }, data: { videoStartSec: 5800, videoEndSec: 5811 } });
    console.log(`✅ SSB4 Trophy "Olimar" WiiU: ${mainSSB4.videoStartSec}-${mainSSB4.videoEndSec} -> 5800-5811 (1:36:40-1:36:51)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
