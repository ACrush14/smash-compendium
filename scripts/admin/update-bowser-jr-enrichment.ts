import { db } from "../../lib/db";

const BIO_UPDATES: Record<string, { pt: string; jpEn?: string }> = {
  SSBB: {
    pt: "O filho de Bowser, que aparece em Super Mario Sunshine chamando a Princesa Peach de sua mãe — ele sente isso tão fortemente que a sequestra. Um tanto mimado pelo pai, Bowser Jr. aparenta ser do tipo egoísta. Sua babete é decorada com presas desenhadas e usada como uma máscara — provavelmente um esforço para parecer mais ameaçador.",
  },
  SSB4: {
    jpEn: "He wears a bib with a large mouth drawn on it — the son Bowser loves so dearly he'd never take his eyes off him. Father and son alike burn with obsession to defeat Mario. In \"Super Smash Bros.,\" he fights riding inside his beloved machine, the \"Junior Clown Car,\" equipped with many weapons. Bowser Jr.'s own body takes damage more easily than the vehicle part, so watch your positioning.",
    pt: "Ele usa uma babete com uma boca grande desenhada — o filho que Bowser ama tanto que não tira os olhos dele. Pai e filho ardem igualmente em obsessão para derrotar o Mario. Em \"Super Smash Bros.\", ele luta montado dentro de sua amada máquina, o \"Junior Clown Car\", equipada com muitas armas. O próprio corpo do Bowser Jr. recebe dano mais facilmente do que a parte do veículo, então cuidado com seu posicionamento.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Bowser Jr.'s Origins", titleJp: "クッパJr.の初登場作品", textJp: "クッパJr.の初登場作品は、２００２年に発売された『スーパーマリオサンシャイン』。父のクッパが溺愛するワガママ息子。", titleJpEn: "Bowser Jr.'s Debut Work", textJpEn: "Bowser Jr.'s debut work is 2002's \"Super Mario Sunshine.\" He's a spoiled son doted upon by his father, Bowser.", titlePt: "As Origens do Bowser Jr.", textPt: "O trabalho de estreia do Bowser Jr. é \"Super Mario Sunshine\", lançado em 2002. Ele é um filho mimado, idolatrado pelo pai, Bowser." },
  { titleEn: "[★☆☆] Larry's Origins", titleJp: "ラリーの初登場作品", textJp: "ラリーの初登場作品は１９８８年発売の『スーパーマリオブラザーズ3』。クッパ７人衆のひとりで、ケンカっ早い性格の特攻隊長。", titleJpEn: "Larry's Debut Work", textJpEn: "Larry's debut work is 1988's \"Super Mario Bros. 3.\" One of the seven Koopalings, he's the quick-tempered leader of the assault squad.", titlePt: "As Origens do Larry", textPt: "O trabalho de estreia do Larry é \"Super Mario Bros. 3\", lançado em 1988. Um dos sete Koopalings, ele é o líder de temperamento explosivo do esquadrão de ataque." },
  { titleEn: "[★☆☆] Roy's Origins", titleJp: "ロイの初登場作品", textJp: "ロイの初登場作品は１９８８年発売の『スーパーマリオブラザーズ3』。ピンクのサングラスをした重量級の暴走タートル。クッパ７人衆のひとり。", titleJpEn: "Roy's Debut Work", textJpEn: "Roy's debut work is 1988's \"Super Mario Bros. 3.\" A heavyweight rampaging turtle wearing pink sunglasses, he's one of the seven Koopalings.", titlePt: "As Origens do Roy", textPt: "O trabalho de estreia do Roy é \"Super Mario Bros. 3\", lançado em 1988. Uma tartaruga pesadona e destrutiva usando óculos escuros rosa, ele é um dos sete Koopalings." },
  { titleEn: "[★☆☆] Lemmy's Origins", titleJp: "レミーの初登場作品", textJp: "レミーの初登場作品は１９８８年発売の『スーパーマリオブラザーズ3』。７人衆の中で一番すばしっこく、小柄。カラフルなモヒカンが特徴。", titleJpEn: "Lemmy's Debut Work", textJpEn: "Lemmy's debut work is 1988's \"Super Mario Bros. 3.\" The smallest and quickest of the seven, he's known for his colorful mohawk.", titlePt: "As Origens do Lemmy", textPt: "O trabalho de estreia do Lemmy é \"Super Mario Bros. 3\", lançado em 1988. O menor e mais ágil dos sete, ele é conhecido por seu moicano colorido." },
  { titleEn: "[★☆☆] Ludwig's Origins", titleJp: "ルドウィッグの初登場作品", textJp: "クッパ７人衆のひとり、ルドウィッグの初登場作品は１９８８年発売の『スーパーマリオブラザーズ3』。７人衆の中で一番の頭脳派。", titleJpEn: "Ludwig's Debut Work", textJpEn: "One of the seven Koopalings, Ludwig's debut work is 1988's \"Super Mario Bros. 3.\" He's the brains of the group.", titlePt: "As Origens do Ludwig", textPt: "Um dos sete Koopalings, o trabalho de estreia do Ludwig é \"Super Mario Bros. 3\", lançado em 1988. Ele é o cérebro do grupo." },
  { titleEn: "[★☆☆] Morton's Origins", titleJp: "モートンの初登場作品", textJp: "モートンの初登場は１９８８年発売の『スーパーマリオブラザーズ3』。７人衆の中で一番大きくて、頭脳よりもパワーで攻めるタイプ。", titleJpEn: "Morton's Debut", textJpEn: "Morton's debut was 1988's \"Super Mario Bros. 3.\" The biggest of the seven, he's the type who relies on power rather than brains.", titlePt: "As Origens do Morton", textPt: "A estreia do Morton foi em \"Super Mario Bros. 3\", lançado em 1988. O maior dos sete, ele é do tipo que confia mais na força do que no cérebro." },
  { titleEn: "[★☆☆] Wendy's Origins", titleJp: "ウェンディの初登場作品", textJp: "ウェンディの初登場は１９８８年発売の『スーパーマリオブラザーズ3』。クッパ７人衆の中で唯一の女の子。おてんばでずる賢い。", titleJpEn: "Wendy's Debut", textJpEn: "Wendy's debut was 1988's \"Super Mario Bros. 3.\" The only girl among the seven Koopalings, she's tomboyish and cunning.", titlePt: "As Origens da Wendy", textPt: "A estreia da Wendy foi em \"Super Mario Bros. 3\", lançado em 1988. A única garota entre os sete Koopalings, ela é moleca e astuta." },
  { titleEn: "[★☆☆] Iggy's Origins", titleJp: "イギーの初登場作品", textJp: "イギーの初登場は１９８８年発売の『スーパーマリオブラザーズ3』。クッパ７人衆のひとり。黒縁メガネのお調子者。", titleJpEn: "Iggy's Debut", textJpEn: "Iggy's debut was 1988's \"Super Mario Bros. 3.\" One of the seven Koopalings, he's a wisecracker with black-rimmed glasses.", titlePt: "As Origens do Iggy", textPt: "A estreia do Iggy foi em \"Super Mario Bros. 3\", lançado em 1988. Um dos sete Koopalings, ele é um brincalhão de óculos de aro preto." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『スーパーマリオサンシャイン』で初登場した、クッパの息子。わがままな性格で、ピーチを「ママ」と呼び、連れ去ってしまう。", titleJpEn: "In the Original Game", textJpEn: "Bowser's son, who made his first appearance in \"Super Mario Sunshine.\" With a selfish personality, he calls Peach \"Mama\" and kidnaps her.", titlePt: "Na Série Original", textPt: "O filho de Bowser, que fez sua primeira aparição em \"Super Mario Sunshine\". Com uma personalidade egoísta, ele chama a Peach de \"Mamãe\" e a sequestra." },
  { titleEn: "[★☆☆] Clown Cannon (Neutral Special)", titleJp: "クラウンキャノン 【通常必殺ワザ】", textJp: "クッパクラウンの大砲から鉄球を撃ち出す。ボタンを押し続けるほど、鉄球のダメージと速度が上がる。", titleJpEn: "Clown Cannon (Neutral Special)", textJpEn: "Fires an iron ball from the Junior Clown Car's cannon. The longer the button is held, the more damage and speed the iron ball gains.", titlePt: "Clown Cannon (Especial Neutro)", textPt: "Dispara uma bola de ferro do canhão do Junior Clown Car. Quanto mais o botão é segurado, mais dano e velocidade a bola de ferro ganha." },
  { titleEn: "[★☆☆] Clown Kart Dash (Side Special)", titleJp: "カートダッシュ 【横必殺ワザ】", textJp: "クッパクラウンがカートになって突進する。速度が速いほどダメージが大きくなる。", titleJpEn: "Clown Kart Dash (Side Special)", textJpEn: "The Junior Clown Car becomes a kart and charges forward. The faster the speed, the greater the damage.", titlePt: "Clown Kart Dash (Especial Lateral)", textPt: "O Junior Clown Car se transforma em um kart e avança. Quanto maior a velocidade, maior o dano." },
  { titleEn: "[★★☆] Clown Kart Dash and Jump (Side Special)", titleJp: "カートダッシュ中のジャンプ 【横必殺ワザ】", textJp: "走行中にジャンプを入力すると、カートごとホップし、走行をキャンセルする。復帰に役立てたり、様々なワザにつなげたり、フェイントとしても使える。", titleJpEn: "Jumping During Clown Kart Dash (Side Special)", textJpEn: "Inputting a jump while driving makes the kart hop and cancels the dash. This can be useful for recovery, chaining into other moves, or as a feint.", titlePt: "Pulando Durante o Clown Kart Dash (Especial Lateral)", textPt: "Inputar um pulo enquanto dirige faz o kart saltar e cancela a investida. Isso pode ser útil para recuperação, emendar em outros golpes, ou como uma finta." },
  { titleEn: "[★☆☆] Abandon Ship (Up Special)", titleJp: "自爆ジャンプ 【上必殺ワザ】", textJp: "クッパクラウンを乗り捨てて大ジャンプする。乗り捨てたクッパクラウンは一定時間で爆発する。", titleJpEn: "Self-Destruct Jump (Up Special)", textJpEn: "Abandons the Junior Clown Car and performs a great leap. The abandoned car explodes after a set amount of time.", titlePt: "Abandon Ship (Especial Cima)", textPt: "Abandona o Junior Clown Car e realiza um grande salto. O carro abandonado explode após um período determinado." },
  { titleEn: "[★★☆] Abandon Ship, then Hammer Attack", titleJp: "自爆ジャンプからのハンマー攻撃 【上必殺ワザ】", textJp: "クッパクラウンから脱出した後に通常攻撃ボタンを押せば、ハンマー攻撃が行える。ふっとばし力が高く、撃墜も狙える攻撃。", titleJpEn: "Hammer Attack After Self-Destruct Jump (Up Special)", textJpEn: "Pressing the standard attack button after escaping the Junior Clown Car performs a hammer attack. It has high knockback power and can even be used to secure a KO.", titlePt: "Ataque de Martelo Após o Abandon Ship (Especial Cima)", textPt: "Apertar o botão de ataque padrão depois de escapar do Junior Clown Car realiza um ataque de martelo. Tem alto poder de arremesso e pode até ser usado para garantir um nocaute." },
  { titleEn: "[★☆☆] Mechakoopa (Down Special)", titleJp: "メカクッパ 【下必殺ワザ】", textJp: "クッパクラウンからメカクッパを出す。メカクッパは時間経過や相手に触れると爆発する。", titleJpEn: "Mechakoopa (Down Special)", textJpEn: "Releases a Mechakoopa from the Junior Clown Car. The Mechakoopa explodes over time or upon touching an opponent.", titlePt: "Mechakoopa (Especial Baixo)", textPt: "Libera um Mechakoopa do Junior Clown Car. O Mechakoopa explode com o tempo ou ao tocar um adversário." },
  { titleEn: "[★★☆] Picking Up Mechakoopa (Down Special)", titleJp: "メカクッパを拾う 【下必殺ワザ】", textJp: "取り出したメカクッパは、自分で拾うこともできる。歩かせて相手の行動を制限したり拾って投げたりと、状況に応じて使い方を選べる攻撃。", titleJpEn: "Picking Up Mechakoopa (Down Special)", textJpEn: "A released Mechakoopa can also be picked up by Bowser Jr. himself. It's an attack whose use can be chosen depending on the situation — letting it walk to restrict an opponent's movement, or picking it up and throwing it.", titlePt: "Pegando o Mechakoopa (Especial Baixo)", textPt: "Um Mechakoopa liberado também pode ser pego pelo próprio Bowser Jr. É um ataque cujo uso pode ser escolhido conforme a situação — deixá-lo andar para restringir o movimento de um adversário, ou pegá-lo e arremessá-lo." },
  { titleEn: "[★☆☆] Shadow Mario Paint (Final Smash)", titleJp: "ニセマリオペイント 【最後の切りふだ】", textJp: "ニセマリオが大きなバッテンを描き、当たるとダメージを与える。自分はペイント後にすぐに動けるので、追い打ちもできる。", titleJpEn: "Shadow Mario Paint (Final Smash)", textJpEn: "Shadow Mario paints a large X mark, dealing damage to anyone who touches it. Since he can move again immediately after painting, a follow-up attack is possible.", titlePt: "Shadow Mario Paint (Final Smash)", textPt: "O Shadow Mario pinta um grande X, causando dano em quem tocá-lo. Como ele pode se mover novamente logo após pintar, um golpe de acompanhamento é possível." },
  { titleEn: "[★☆☆] Smash Twin Drills (Side Smash Attack)", titleJp: "スマッシュツインドリル 【横スマッシュ攻撃】", textJp: "多段ヒットする攻撃のため、避けられにくい。相手にシールドされた場合も、スキが小さいので反撃を受けにくい。", titleJpEn: "Smash Twin Drills (Side Smash Attack)", textJpEn: "Since this attack hits multiple times, it's difficult to dodge. Even if blocked by an opponent's shield, the small opening it leaves makes it hard to be punished.", titlePt: "Smash Twin Drills (Ataque Smash Lateral)", textPt: "Como este ataque acerta várias vezes, é difícil de esquivar. Mesmo se bloqueado pelo escudo de um adversário, a pequena abertura que deixa torna difícil ser punido." },
  { titleEn: "[★☆☆] Junior Clown Car", titleJp: "クッパクラウン", textJp: "乗っているクッパクラウンは、受けるダメージがクッパJr.本体よりも少ない。ダメージを受けそうな時は、クッパクラウンで受ける方がいい。", titleJpEn: "Junior Clown Car", textJpEn: "The Junior Clown Car he rides in takes less damage than Bowser Jr.'s own body. When about to take damage, it's better to take the hit with the Junior Clown Car.", titlePt: "Junior Clown Car", textPt: "O Junior Clown Car em que ele anda recebe menos dano do que o próprio corpo do Bowser Jr. Ao estar prestes a receber dano, é melhor levar o golpe com o Junior Clown Car." },
];

async function main() {
  const bowserJr = await db.fighter.findFirst({
    where: { name: "Bowser Jr." },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!bowserJr) { console.log("Bowser Jr. not found"); return; }

  await db.fighter.update({
    where: { id: bowserJr.id },
    data: {
      curatorOverviewEn: "Bowser Jr. fights from inside the heavily armed Junior Clown Car, which absorbs far more punishment than his small body underneath — a built-in incentive to stay mounted and let the vehicle tank hits. Clown Kart Dash offers a fast, cancelable approach option, Mechakoopa provides zoning and stage control that can be picked back up and redeployed, and Abandon Ship doubles as recovery and a surprise hammer follow-up once he bails out. Smash Twin Drills is a multi-hit side smash safe enough to throw out with little fear of punishment. The catch is that losing the Clown Car exposes Bowser Jr.'s fragile true body, so preserving the vehicle — and reading when to eject from it — is central to how he's played.",
      curatorOverviewPt: "Bowser Jr. luta de dentro do seu fortemente armado Junior Clown Car, que absorve muito mais dano do que seu pequeno corpo por baixo — um incentivo embutido para permanecer montado e deixar o veículo aguentar os golpes. Clown Kart Dash oferece uma opção de aproximação rápida e cancelável, Mechakoopa proporciona controle de área que pode ser pego de volta e reimplantado, e Abandon Ship funciona tanto como recuperação quanto como um golpe surpresa de martelo assim que ele salta para fora. Smash Twin Drills é um ataque smash lateral com múltiplos acertos, seguro o bastante para ser usado com pouco medo de punição. A pegadinha é que perder o Clown Car expõe o corpo verdadeiro e frágil do Bowser Jr., então preservar o veículo — e saber quando ejetar dele — é central para como ele é jogado.",
      curatorOverviewJp: "クッパJr.は重武装の「クッパJr.クラウン」に乗って戦い、その乗り物は、下に隠れた小さな本体よりもはるかに多くのダメージを吸収する――乗ったままでいて乗り物に攻撃を受けさせるインセンティブが組み込まれているわけだ。「カートダッシュ」はキャンセル可能な高速接近手段を提供し、「メカクッパ」は拾って再展開できるエリア制圧・けん制を可能にし、「自爆ジャンプ」は復帰技であると同時に、脱出後の奇襲ハンマー攻撃にもつながる。「スマッシュツインドリル」は多段ヒットする横スマッシュ攻撃で、反撃をほとんど恐れずに振れるほど安全だ。落とし穴は、「クッパJr.クラウン」を失うと脆いクッパJr.の本体がむき出しになることで、乗り物を温存すること――そしてどこで脱出するかを見極めること――が、彼のプレイの中心となる。",
      curatorOverviewJpEn: "Bowser Jr. fights from inside the heavily armed \"Junior Clown Car,\" which absorbs far more damage than his small body hidden underneath — a built-in incentive to stay mounted and let the vehicle take the hits. Clown Kart Dash offers a fast, cancelable approach tool, Mechakoopa enables area control and zoning that can be picked back up and redeployed, and Abandon Ship serves as both a recovery move and a lead-in to a surprise hammer attack once he bails out. Smash Twin Drills is a multi-hit side smash safe enough to throw out with little fear of being punished. The catch is that losing the Junior Clown Car exposes Bowser Jr.'s fragile true body, so preserving the vehicle — and reading when to eject from it — is central to how he's played.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_UPDATES)) {
    const bio = bowserJr.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, ...(data.jpEn ? { contentJpEn: data.jpEn } : {}) } });
    console.log(`✅ Bio [${version}]: PT${data.jpEn ? "+JpEn" : ""} adicionado`);
  }

  const move = bowserJr.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Clown Kart Dash\" is a move where the vehicle \"Junior Clown Car\" transforms into a kart and charges forward at high speed. Changing direction causes it to spin, and hitting an opponent with the spinning wheels deals more damage than a direct charge. \"Abandon Ship\" is an Up Special that abandons the vehicle to deal damage. It's effective when dropped on an opponent's head or thrown into a group of tightly packed foes. (GC) Super Mario Sunshine (2002/07) (Wii) New Super Mario Bros. Wii (2009/12)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Clown Kart Dash\" é um golpe em que o veículo \"Junior Clown Car\" se transforma em um kart e avança em alta velocidade. Mudar de direção faz com que ele gire, e acertar um adversário com as rodas giratórias causa mais dano do que uma investida direta. \"Abandon Ship\" é um especial de cima que abandona o veículo para causar dano. É eficaz quando derrubado na cabeça de um adversário ou lançado em um grupo de inimigos aglomerados. (GC) Super Mario Sunshine (2002/07) (Wii) New Super Mario Bros. Wii (2009/12)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = bowserJr.tips.find(t => t.titleEn === data.titleEn);
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

  // SSBB Trophy: videoEndSec corrompido (144300), corrigido via VLC (39:48-40:05 = 2388-2405)
  const ssbb = await db.collectible.findFirst({ where: { name: "Bowser Jr.", type: "TROPHY", smashGameVersion: "SSBB" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbb) {
    await db.collectible.update({ where: { id: ssbb.id }, data: { fighterId: bowserJr.id, videoStartSec: 2388, videoEndSec: 2405 } });
    console.log(`✅ Trophy "Bowser Jr." [SSBB]: linkado, vídeo corrigido 2388-2405 (era ${ssbb.videoStartSec}-${ssbb.videoEndSec}, corrompido)`);
  }

  // SSB4 Trophy principal: usuário pediu janela longa (10:22-12:12 = 622-732) só no campo WiiU
  // para que os outros Koopalings apareçam na mesma sequência de vídeo. Campo 3DS (secundário) intocado.
  const main = await db.collectible.findFirst({ where: { name: "Bowser Jr.", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (main) {
    await db.collectible.update({ where: { id: main.id }, data: { videoStartSec: 622, videoEndSec: 732 } });
    console.log(`✅ Trophy "Bowser Jr." [SSB4]: vídeo WiiU ampliado para 622-732 (era ${main.videoStartSec}-${main.videoEndSec}) para mostrar os Koopalings`);
  }

  // Koopalings — trophies órfãos (fighterId: null) desde o scraping, cada um é uma variação de cor
  // do próprio Bowser Jr., não fighters separados.
  const koopalingNames = ["Larry", "Wendy", "Lemmy", "Iggy", "Ludwig", "Morton"];
  for (const name of koopalingNames) {
    const item = await db.collectible.findFirst({ where: { name, type: "TROPHY", smashGameVersion: "SSB4", fighterId: null }, select: { id: true } });
    if (item) {
      await db.collectible.update({ where: { id: item.id }, data: { fighterId: bowserJr.id } });
      console.log(`✅ Trophy "${name}" [SSB4]: linkado ao Bowser Jr.`);
    } else {
      console.log(`  ⚠️  Trophy "${name}" [SSB4] órfão não encontrado`);
    }
  }

  // NOTE: o troféu do "Roy" Koopaling parece estar FALTANDO do banco inteiramente — as duas
  // linhas SSB4 chamadas "Roy" existentes são ambas o Roy de Fire Emblem (mesmo texto de descrição,
  // pos=628, uma linkada ao fighter certo e uma órfã duplicada). Nenhuma delas é o Roy Koopa.
  // Não linkado para não corromper os dados do Roy de Fire Emblem — precisa de investigação/dado do usuário.

  await db.$disconnect();
}
main().catch(console.error);
