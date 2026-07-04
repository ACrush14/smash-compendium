import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "A mysterious squid that transforms into human form. In order to become the coolest one in town, it wages daily Turf Wars against its rivals. Even in human form, squid traits remain around the eyes, ears, and hairstyle. It pays a great deal of attention to fashion, so take a good look at its stylish outfit.",
    pt: "Uma lula misteriosa que se transforma em forma humana. Para se tornar o(a) mais estiloso(a) da cidade, ela trava Turf Wars diárias contra seus rivais. Mesmo em forma humana, traços de lula permanecem ao redor dos olhos, orelhas e penteado. Ela dá muita atenção à moda, então dê uma boa olhada em seu visual estiloso.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Inkling's Origins", titleJp: "インクリングの初登場作品", textJp: "インクリングの初登場は、２０１５年に発売された『スプラトゥーン』。ヒトとイカの姿を切り替えつつ、ブキから放つインクで地面や壁を塗りまくって戦う。", titleJpEn: "Inkling's Debut Work", textJpEn: "Inkling's debut work is 2015's \"Splatoon.\" It fights by switching between human and squid forms while covering the ground and walls with ink fired from its weapon.", titlePt: "As Origens do Inkling", textPt: "O trabalho de estreia do Inkling é \"Splatoon\", lançado em 2015. Ele luta alternando entre formas humana e de lula enquanto cobre o chão e as paredes com tinta disparada de sua arma." },
  { titleEn: "[★☆☆] In Their Series", titleJp: "原作では", textJp: "地面や壁にインクを塗ると、イカの姿でその中を泳いで移動できる。水に落ちると、体のインクが溶け出して溺れてしまう。", titleJpEn: "In the Original Game", textJpEn: "Covering the ground and walls with ink allows swimming through it in squid form. Falling into water dissolves the ink in its body, causing it to drown.", titlePt: "Na Série Original", textPt: "Cobrir o chão e as paredes com tinta permite nadar através dela em forma de lula. Cair na água dissolve a tinta em seu corpo, fazendo com que se afogue." },
  { titleEn: "[★☆☆] Splattershot (Neutral Special)", titleJp: "スプラシューター 【通常必殺ワザ】", textJp: "長押しで遠くまでインクを射出、向きを上下に調整できる。攻撃力は低いが、相手にたくさんのインクを塗れる。", titleJpEn: "Splattershot (Neutral Special)", textJpEn: "Holding the button shoots ink far, and the angle can be adjusted up or down. Attack power is low, but it can cover an opponent in plenty of ink.", titlePt: "Splattershot (Especial Neutro)", textPt: "Segurar o botão dispara tinta a longa distância, e o ângulo pode ser ajustado para cima ou para baixo. O poder de ataque é baixo, mas pode cobrir um adversário com bastante tinta." },
  { titleEn: "[★☆☆] Splat Roller (Side Special)", titleJp: "スプラローラー 【横必殺ワザ】", textJp: "勢いよく走りながら、スプラローラーで地面にインクを塗りまくる。地上にいるファイターに当てると、相手を埋めることができる。", titleJpEn: "Splat Roller (Side Special)", textJpEn: "Runs forward with force, covering the ground in ink with the Splat Roller. Hitting a grounded fighter with it can bury them.", titlePt: "Splat Roller (Especial Lateral)", textPt: "Corre para frente com força, cobrindo o chão de tinta com o Splat Roller. Acertar um lutador no chão com ele pode enterrá-lo." },
  { titleEn: "[★☆☆] Super Jump (Up Special)", titleJp: "スーパージャンプ 【上必殺ワザ】", textJp: "勢いよく上空に飛び出すので、ステージへの復帰に使うことができる。飛び出す時と着地した時、近くにいる相手をふっ飛ばす。", titleJpEn: "Super Jump (Up Special)", textJpEn: "Launches forcefully into the sky, so it can be used to recover to the stage. It launches nearby opponents both at takeoff and on landing.", titlePt: "Super Jump (Especial Cima)", textPt: "Lança-se com força para o céu, então pode ser usado para se recuperar de volta ao palco. Lança adversários próximos tanto na decolagem quanto no pouso." },
  { titleEn: "[★☆☆] Splat Bomb (Down Special)", titleJp: "スプラッシュボム 【下必殺ワザ】", textJp: "ためると遠くに投げることができ、与えるダメージとインク量が増える。ためなければ目の前に投げるので、けん制手段としても使える。", titleJpEn: "Splat Bomb (Down Special)", textJpEn: "Charging it allows it to be thrown farther, increasing damage dealt and the amount of ink. Without charging, it's thrown right in front, so it can also be used as a way to keep foes in check.", titlePt: "Splat Bomb (Especial Baixo)", textPt: "Carregá-lo permite arremessá-lo mais longe, aumentando o dano causado e a quantidade de tinta. Sem carregar, é arremessado bem à frente, então também pode ser usado como uma forma de conter adversários." },
  { titleEn: "[★☆☆] Killer Wail (Final Smash)", titleJp: "メガホンレーザー 【最後の切りふだ】", textJp: "メガホンは、空中にも地上にも設置でき、地面などを貫通するレーザーを発射する。置いた後は、インクリングは自由に操作でき、レーザーの角度も連動して変えられる。", titleJpEn: "Killer Wail (Final Smash)", textJpEn: "The megaphone can be placed either in midair or on the ground, and it fires a laser that pierces through terrain. After placing it, Inkling can move freely, and the laser's angle changes in sync.", titlePt: "Killer Wail (Final Smash)", textPt: "O megafone pode ser colocado no ar ou no chão, e dispara um laser que atravessa o terreno. Depois de colocá-lo, o Inkling pode se mover livremente, e o ângulo do laser muda em sincronia." },
  { titleEn: "[★★★] Killer Wail after Being KO'd (Final Smash)", titleJp: "撃墜後のメガホンレーザー 【最後の切りふだ】", textJp: "最後の切りふだ中にインクリングが撃墜されても、レーザーは残り、操作もできる。", titleJpEn: "Killer Wail After Being KO'd (Final Smash)", textJpEn: "Even if the Inkling is KO'd during the Final Smash, the laser remains and can still be controlled.", titlePt: "Killer Wail Após Ser Nocauteado (Final Smash)", textPt: "Mesmo se o Inkling for nocauteado durante o Final Smash, o laser permanece e ainda pode ser controlado." },
  { titleEn: "[★★☆] Slosher (Down Smash)", titleJp: "バケットスロッシャー 【下スマッシュ攻撃】", textJp: "バケットスロッシャーに入れたインクをまき散らす、下スマッシュ攻撃。相手にインクをぶつける攻撃としては、最大級の効果を持つ。", titleJpEn: "Slosher (Down Smash Attack)", textJpEn: "A down smash attack that flings ink from the Slosher bucket. It has some of the best effect among moves that splash ink onto opponents.", titlePt: "Slosher (Ataque Smash Baixo)", textPt: "Um ataque smash baixo que arremessa tinta do balde do Slosher. Tem um dos melhores efeitos entre os golpes que espalham tinta nos adversários." },
  { titleEn: "[★☆☆] Refilling Ink", titleJp: "インクの補充", textJp: "シールドしながら必殺ワザボタンで、インクを補充できる。インク残量がない時に、地上で通常必殺ワザ、下必殺ワザを入力しても補充できる。", titleJpEn: "Refilling Ink", textJpEn: "Ink can be refilled by holding shield and pressing the special move button. When completely out of ink, inputting the Neutral Special or Down Special on the ground also refills it.", titlePt: "Reabastecendo Tinta", textPt: "A tinta pode ser reabastecida segurando o escudo e apertando o botão de golpe especial. Quando a tinta acaba completamente, inputar o especial neutro ou baixo no chão também a reabastece." },
  { titleEn: "[★☆☆] Running Out of Ink", titleJp: "インク切れ", textJp: "インク残量がないと、必殺ワザやスマッシュ攻撃の威力が下がる。シールドしながら必殺ワザボタンの長押しで、補充できる。", titleJpEn: "Running Out of Ink", textJpEn: "Without ink remaining, special moves and smash attacks lose power. Holding down the special move button while shielding refills it.", titlePt: "Ficando Sem Tinta", textPt: "Sem tinta restante, os golpes especiais e ataques smash perdem poder. Segurar o botão de golpe especial enquanto se defende a reabastece." },
  { titleEn: "[★☆☆] \"C'mon!\" and \"Booyah!\"", titleJp: "カモン！とナイス！", textJp: "上アピールは、原作『スプラトゥーン』で味方を呼ぶ際に使用した「カモン！」。下アピールは、同じく原作で味方を褒め称える際に使用した「ナイス！」。", titleJpEn: "\"C'mon!\" and \"Nice!\"", textJpEn: "The up taunt is \"C'mon!\", used in the original \"Splatoon\" to call over teammates. The down taunt is likewise \"Nice!\", used in the original game to praise teammates.", titlePt: "\"C'mon!\" e \"Booyah!\"", textPt: "A provocação cima é \"C'mon!\", usada no jogo original \"Splatoon\" para chamar os companheiros de equipe. A provocação baixo é, da mesma forma, \"Nice!\", usada no jogo original para elogiar os companheiros de equipe." },
  { titleEn: "[★☆☆] Hydrophobic Fighters", titleJp: "水嫌い", textJp: "リザードンとインクリングは、水が苦手。水に浸かっている間は、少しずつダメージを受ける。", titleJpEn: "Fighters Who Dislike Water", textJpEn: "Charizard and Inkling aren't fond of water. While submerged in it, they gradually take damage.", titlePt: "Lutadores que Não Gostam de Água", textPt: "Charizard e Inkling não gostam de água. Enquanto submersos nela, sofrem dano gradualmente." },
];

async function main() {
  const inkling = await db.fighter.findFirst({
    where: { name: "Inkling" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!inkling) { console.log("Inkling not found"); return; }

  await db.fighter.update({
    where: { id: inkling.id },
    data: {
      curatorOverviewEn: "Inkling introduces the Splatoon series' core mechanic to Smash: ink management. Every special move consumes ink, and running dry weakens both specials and smash attacks, forcing constant attention to the ink meter alongside the fight itself. Splattershot and Splat Roller both cover the stage and opponents in paint, and while covered-in-ink foes take more damage, refilling requires shielding — trading offense for a moment of vulnerability. Super Jump doubles as recovery and a launching attack on both takeoff and landing, and Killer Wail keeps functioning even after Inkling is KO'd during the Final Smash, letting a well-placed laser rack up damage regardless. As one of the few fighters who takes damage in water, Inkling also has to watch stage hazards other characters can ignore entirely.",
      curatorOverviewPt: "Inkling introduz a mecânica central da série Splatoon no Smash: o gerenciamento de tinta. Todo golpe especial consome tinta, e ficar sem ela enfraquece tanto os especiais quanto os ataques smash, forçando atenção constante ao medidor de tinta junto com a própria luta. Splattershot e Splat Roller cobrem tanto o palco quanto os adversários de tinta, e enquanto adversários cobertos de tinta recebem mais dano, reabastecer exige se defender — trocando ofensiva por um momento de vulnerabilidade. Super Jump funciona tanto como recuperação quanto como um ataque de lançamento na decolagem e no pouso, e Killer Wail continua funcionando mesmo depois que o Inkling é nocauteado durante o Final Smash, permitindo que um laser bem posicionado acumule dano de qualquer forma. Sendo um dos poucos lutadores que sofre dano na água, o Inkling também precisa ficar atento a perigos de palco que outros personagens podem ignorar completamente.",
      curatorOverviewJp: "インクリングは『スプラトゥーン』シリーズの中核となるメカニクス、インク管理をスマブラに持ち込んでいる。すべての必殺ワザはインクを消費し、インクが切れると必殺ワザとスマッシュ攻撃の両方の威力が下がるため、戦い自体と並行してインクゲージへの絶え間ない注意が求められる。「スプラシューター」と「スプラローラー」はステージと相手の両方をペイントで覆い、インクを塗られた相手は受けるダメージが増える一方、補充にはシールドが必要で、攻撃と引き換えに一瞬無防備になる。「スーパージャンプ」は復帰技であると同時に飛び出しと着地の両方でふっとばし攻撃を兼ね、「メガホンレーザー」はインクリングが最後の切りふだ中に撃墜されても機能し続けるため、うまく設置されたレーザーはどのみちダメージを稼ぐことができる。水中でダメージを受ける数少ないファイターの一人として、インクリングは他のキャラクターが完全に無視できるステージの危険にも気を配らなければならない。",
      curatorOverviewJpEn: "Inkling brings the \"Splatoon\" series' core mechanic to Smash: ink management. Every special move consumes ink, and running out weakens both special moves and smash attacks, requiring constant attention to the ink gauge alongside the fight itself. \"Splattershot\" and \"Splat Roller\" both cover the stage and opponents in paint, and while inked opponents take more damage, refilling requires shielding, trading offense for a moment of vulnerability. \"Super Jump\" doubles as a recovery move and a launching attack on both takeoff and landing, and \"Killer Wail\" keeps functioning even after Inkling is KO'd during the Final Smash, so a well-placed laser can still rack up damage regardless. As one of the few fighters who takes damage underwater, Inkling also has to watch out for stage hazards that other characters can completely ignore.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = inkling.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = inkling.tips.find(t => t.titleEn === data.titleEn);
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

  // Nenhum FighterMove (0 registros) — sem texto de figura "EX" scrapeado para Inkling, não é lacuna.
  // Nenhum timing de vídeo novo fornecido pelo usuário desta vez — dados existentes mantidos.
  // CollectibleChronicleLink do troféu já aponta corretamente para "Splatoon" (Wii U) — sem bug de Works aqui.

  await db.$disconnect();
}
main().catch(console.error);
