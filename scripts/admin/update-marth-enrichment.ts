import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "Marth is a character who appears in \"Fire Emblem: Shadow Dragon and the Blade of Light,\" its sequel \"Fire Emblem: Mystery of the Emblem,\" and their Nintendo DS remakes.",
    pt: "Marth é um personagem que aparece em \"Fire Emblem: Shadow Dragon and the Blade of Light,\" sua sequência \"Fire Emblem: Mystery of the Emblem,\" e seus remakes para Nintendo DS.",
  },
  SSBM: {
    jpEn: "The prince of the Kingdom of Altea, descended from the hero Anri. Driven from his homeland by the invasion of the Doluna Empire, Marth rises up together with his companions. Wielding the divine sword Falchion, he defeats the dark dragon Medeus. Afterward, he loses his kingdom once again to the invasion of King Hardin of Akaneia, and sets out on a journey while suffering the betrayal of former comrades.",
    pt: "O príncipe do Reino de Altea, descendente do herói Anri. Expulso de sua terra natal pela invasão do Império Doluna, Marth se levanta junto com seus companheiros. Empunhando a espada divina Falchion, ele derrota o dragão sombrio Medeus. Depois, ele perde seu reino novamente para a invasão do Rei Hardin de Akaneia, e parte em uma jornada enquanto sofre a traição de antigos companheiros.",
  },
  SSBB: {
    jpEn: "The prince of the Kingdom of Altea, carrying the blood of the hero Anri. Driven from his homeland by Medeus of the Kingdom of Doluna, he stands against Medeus with a small band of companions. Using the divine sword \"Falchion,\" he defeats the dark dragon Medeus. However, he is once again drawn into the chaos of war by the invasion of Hardin, who became Emperor of Akaneia, and loses his beloved homeland.",
    pt: "O príncipe do Reino de Altea, carregando o sangue do herói Anri. Expulso de sua terra natal por Medeus do Reino de Doluna, ele enfrenta Medeus com um pequeno grupo de companheiros. Usando a espada divina \"Falchion,\" ele derrota o dragão sombrio Medeus. Porém, ele é novamente arrastado para o caos da guerra pela invasão de Hardin, que se tornou Imperador de Akaneia, e perde sua amada terra natal.",
  },
  SSB4: {
    jpEn: "The original protagonist of the \"Fire Emblem\" series. The legitimate prince of the Kingdom of Altea, descended from the hero Anri, who defeated an evil dragon. In Smash Bros., he's a fighter characterized by flowing swordsmanship. Attacks deal more damage when they connect with the tip of the sword rather than the base. \"Counter\" is a special move that retaliates when timed with an opponent's attack, and it's effective from any direction.",
    pt: "O protagonista original da série \"Fire Emblem.\" O legítimo príncipe do Reino de Altea, descendente do herói Anri, que derrotou um dragão maligno. Em Smash Bros., ele é um lutador caracterizado por uma esgrima fluida. Os ataques causam mais dano quando conectam com a ponta da espada em vez da base. \"Counter\" é um golpe especial que retalia quando cronometrado com o ataque de um adversário, e é eficaz em qualquer direção.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "He possesses graceful swordsmanship. His sword speed is faster than Link's, but lacks a bit of power. While nimble, he's also floaty and easy to launch. Shield Breaker increases in power the longer it's charged. Dancing Blade lets him unleash a four-hit combo through stick direction and precisely timed button presses. B: Shield Breaker, Side+B: Dancing Blade",
    pt: "Ele possui uma esgrima graciosa. A velocidade de sua espada é mais rápida que a do Link, mas falta um pouco de poder. Embora ágil, ele também é leve e fácil de arremessar. O Shield Breaker aumenta de poder quanto mais é carregado. O Dancing Blade permite liberar um combo de quatro golpes através da direção do analógico e pressões de botão precisamente cronometradas. B: Shield Breaker, Lateral+B: Dancing Blade",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "The tip of Marth's sword has higher attack power. Try to keep some distance from opponents, landing graceful, grazing sword strikes. Dolphin Slash comes out quickly, but watch out for the landing afterward. Counter is a convenient move that retaliates against an attack — against opponents who rely heavily on Counter, use a grab instead. Up+B: Dolphin Slash, Down+B: Counter",
    pt: "A ponta da espada do Marth tem maior poder de ataque. Tente manter alguma distância dos adversários, acertando golpes de espada graciosos e de raspão. O Dolphin Slash sai rapidamente, mas cuidado com o pouso depois. O Counter é um golpe conveniente que retalia contra um ataque — contra adversários que dependem muito do Counter, use um agarrão. Cima+B: Dolphin Slash, Baixo+B: Counter",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Marth's Origins", titleJp: "マルスの初登場作品", textJp: "マルスが初めて登場した作品は、１９９０年にファミコンで発売されたシリーズ第１作目『ファイアーエムブレム 暗黒竜と光の剣』。", titleJpEn: "Marth's Origins", textJpEn: "Marth first appeared in the series' first installment, \"Fire Emblem: Shadow Dragon and the Blade of Light,\" released for the Famicom in 1990.", titlePt: "As Origens do Marth", textPt: "O Marth apareceu pela primeira vez no primeiro jogo da série, \"Fire Emblem: Shadow Dragon and the Blade of Light,\" lançado para o Famicom em 1990." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "シリーズ第1作『ファイアーエムブレム 暗黒竜と光の剣』の主人公。祖国を追われた、アリティア王国の王子。マルス専用の武器、レイピアを持っている。", titleJpEn: "In His Series", textJpEn: "The protagonist of the first game in the series, \"Fire Emblem: Shadow Dragon and the Blade of Light.\" The prince of the Kingdom of Altea, driven from his homeland. He carries the Rapier, a weapon exclusive to Marth.", titlePt: "Na Série Original", textPt: "O protagonista do primeiro jogo da série, \"Fire Emblem: Shadow Dragon and the Blade of Light.\" O príncipe do Reino de Altea, expulso de sua terra natal. Ele carrega a Rapier, uma arma exclusiva do Marth." },
  { titleEn: "[★★☆] Shield Breaker (Neutral Special)", titleJp: "シールドブレイカー 【通常必殺ワザ】", textJp: "スキは大きいが、相手のシールドを削りやすい。最大までためると、一撃でシールドブレイクできる。", titleJpEn: "Shield Breaker (Neutral Special)", textJpEn: "It has a large opening, but easily chips away at an opponent's shield. Charged to maximum, it can break a shield in a single hit.", titlePt: "Shield Breaker (Especial Neutro)", textPt: "Tem uma grande abertura, mas desgasta facilmente o escudo de um adversário. Carregado ao máximo, pode quebrar um escudo em um único golpe." },
  { titleEn: "[★★☆] Midair Shield Breaker (Neutral Special)", titleJp: "空中でシールドブレイカー 【通常必殺ワザ】", textJp: "空中で使うと、少しだけ前進する。最大までためると移動量が大きくなり、奇襲や復帰に使えることも。", titleJpEn: "Midair Shield Breaker (Neutral Special)", textJpEn: "Using it in the air moves him forward slightly. Charged to maximum, the travel distance increases, and it can even be used for surprise attacks or recovery.", titlePt: "Shield Breaker no Ar (Especial Neutro)", textPt: "Usá-lo no ar o move ligeiramente para frente. Carregado ao máximo, a distância percorrida aumenta, e pode até ser usado para ataques surpresa ou recuperação." },
  { titleEn: "[★★☆] Shield Breaker Techniques (Neutral Special)", titleJp: "シールドブレイカーのテクニック 【通常必殺ワザ】", textJp: "ワザを出す瞬間に上下に入力することで、剣を突き出す方向を変えられる。相手の頭にヒットさせると、与えるダメージが少しだけアップする。", titleJpEn: "Shield Breaker Techniques (Neutral Special)", textJpEn: "Inputting up or down the instant the move comes out changes the direction the sword thrusts. Hitting an opponent's head deals slightly more damage.", titlePt: "Técnicas do Shield Breaker (Especial Neutro)", textPt: "Inputar cima ou baixo no instante em que o movimento sai muda a direção do estocada da espada. Acertar a cabeça de um adversário causa um pouco mais de dano." },
  { titleEn: "[★☆☆] Dancing Blade Combo (Side Special)", titleJp: "マーベラスコンビネーション 【横必殺ワザ】", textJp: "追加入力により４段目まで連続でワザを出す。上、横、下の方向入力で連続ワザの種類が変わる。", titleJpEn: "Dancing Blade Combo (Side Special)", textJpEn: "Additional inputs let him chain the move up to a fourth hit. The type of follow-up changes depending on whether up, sideways, or down is input.", titlePt: "Combo do Dancing Blade (Especial Lateral)", textPt: "Inputs adicionais permitem encadear o movimento até um quarto golpe. O tipo de acompanhamento muda dependendo se cima, lateral ou baixo é inputado." },
  { titleEn: "[★☆☆] Dancing Blade's Color (Side Special)", titleJp: "マーベラスコンビネーションの色 【横必殺ワザ】", textJp: "攻撃する高さによって、剣の軌跡の色が変わる。上段は青、中段は赤、下段は緑。", titleJpEn: "Dancing Blade's Color (Side Special)", textJpEn: "The color of the sword's trail changes depending on the height of the attack. Blue for high, red for mid, and green for low.", titlePt: "A Cor do Dancing Blade (Especial Lateral)", textPt: "A cor do rastro da espada muda dependendo da altura do ataque. Azul para alto, vermelho para médio, e verde para baixo." },
  { titleEn: "[★★☆] Dancing Blade's Sideways Swing (Side Special)", titleJp: "マーベラスコンビネーション・横 【横必殺ワザ】", textJp: "上や下を入力せずに４段目を出すと、当たった相手を横にふっとばす。上や下よりもふっとばし力が高い。", titleJpEn: "Dancing Blade's Sideways Swing (Side Special)", textJpEn: "Using the fourth hit without inputting up or down sends the opponent flying sideways. Its knockback is higher than the up or down versions.", titlePt: "O Golpe Lateral do Dancing Blade (Especial Lateral)", textPt: "Usar o quarto golpe sem inputar cima ou baixo arremessa o adversário lateralmente. Seu arremesso é maior que as versões cima ou baixo." },
  { titleEn: "[★★☆] Dancing Blade Up (Side Special)", titleJp: "マーベラスコンビネーション・上 【横必殺ワザ】", textJp: "上を入力しながら４段目を出すと、当たった相手を上にふっとばし、追撃を狙いやすい。", titleJpEn: "Dancing Blade Up (Side Special)", textJpEn: "Inputting up while using the fourth hit launches the opponent upward, making it easy to go for a follow-up.", titlePt: "Dancing Blade Cima (Especial Lateral)", textPt: "Inputar cima enquanto usa o quarto golpe arremessa o adversário para cima, tornando fácil buscar um acompanhamento." },
  { titleEn: "[★★☆] Dancing Blade Down (Side Special)", titleJp: "マーベラスコンビネーション・下 【横必殺ワザ】", textJp: "下を入力しながら４段目を出すと、相手の足元を連続で攻撃する。すべて当たれば大きなダメージ。", titleJpEn: "Dancing Blade Down (Side Special)", textJpEn: "Inputting down while using the fourth hit repeatedly attacks the opponent's feet. Landing all hits deals significant damage.", titlePt: "Dancing Blade Baixo (Especial Lateral)", textPt: "Inputar baixo enquanto usa o quarto golpe ataca repetidamente os pés do adversário. Acertar todos os golpes causa dano significativo." },
  { titleEn: "[★★☆] Aerial Dancing Blade (Side Special)", titleJp: "空中でマーベラスコンビネーション 【横必殺ワザ】", textJp: "マーベラスコンビネーションの１段目を空中で使うと少し体が浮き上がる。小ジャンプ中に使えば、着地までの間に追加で空中攻撃を使える。", titleJpEn: "Aerial Dancing Blade (Side Special)", textJpEn: "Using the first hit of Dancing Blade in the air makes his body rise slightly. If used during a short hop, an additional aerial attack can be used before landing.", titlePt: "Dancing Blade no Ar (Especial Lateral)", textPt: "Usar o primeiro golpe do Dancing Blade no ar faz o corpo dele subir levemente. Se usado durante um pulo curto, um ataque aéreo adicional pode ser usado antes de pousar." },
  { titleEn: "[★☆☆] Dolphin Slash (Up Special)", titleJp: "ドルフィンスラッシュ 【上必殺ワザ】", textJp: "ワザをくり出す前に無敵状態になるが、地上よりも空中で使った方がタイミングが速い。慣れれば、相手のコンボに割り込むような使い方もできる。", titleJpEn: "Dolphin Slash (Up Special)", textJpEn: "He becomes invincible right before unleashing the move, and the timing comes faster when used in the air than on the ground. With practice, it can even be used to interrupt an opponent's combo.", titlePt: "Dolphin Slash (Especial Cima)", textPt: "Ele fica invencível logo antes de liberar o movimento, e o timing sai mais rápido quando usado no ar do que no chão. Com prática, pode até ser usado para interromper o combo de um adversário." },
  { titleEn: "[★☆☆] Counter (Down Special)", titleJp: "カウンター 【下必殺ワザ】", textJp: "カウンターした相手の攻撃に応じてダメージが変わる。スマッシュ攻撃をカウンターできれば撃墜も狙える。", titleJpEn: "Counter (Down Special)", textJpEn: "The damage dealt changes depending on the attack that was countered. If he successfully counters a smash attack, it can even go for a KO.", titlePt: "Counter (Especial Baixo)", textPt: "O dano causado muda dependendo do ataque que foi contra-atacado. Se ele conseguir contra-atacar um ataque smash, pode até buscar um KO." },
  { titleEn: "[★☆☆] Critical Hit (Final Smash)", titleJp: "必殺の一撃 【最後の切りふだ】", textJp: "猛スピードで突進する、最後の切りふだ。行き過ぎたときは、ボタンを押せばその場で止まれる。", titleJpEn: "Critical Hit (Final Smash)", textJpEn: "A Final Smash where he dashes forward at tremendous speed. If he overshoots, pressing the button lets him stop in place.", titlePt: "Critical Hit (Final Smash)", textPt: "Um Final Smash onde ele avança para frente em velocidade tremenda. Se ele ultrapassar o alvo, pressionar o botão permite que ele pare no lugar." },
  { titleEn: "[★☆☆] Dragon Killer (Side Smash)", titleJp: "ドラゴンキラー 【横スマッシュ攻撃】", textJp: "剣先は驚異的なふっとばし力を誇る。狙って当てるのは難しいが、その分キレイに当てられれば、爽快感バツグンのワザ。", titleJpEn: "Dragon Killer (Side Smash)", textJpEn: "The tip of the sword boasts tremendous knockback. It's difficult to aim precisely, but landing it cleanly makes for an exceptionally satisfying move.", titlePt: "Dragon Killer (Smash Lateral)", textPt: "A ponta da espada possui um poder de arremesso tremendo. É difícil mirar com precisão, mas acertá-lo de forma limpa torna-se um movimento excepcionalmente satisfatório." },
  { titleEn: "[★☆☆] About Face (Back Air)", titleJp: "アッパースイング 【後空中攻撃】", textJp: "ワザを出し終えると、空中で向きを変える。攻撃しながら向きを変えられる、珍しいワザ。", titleJpEn: "Upper Swing (Back Air)", textJpEn: "Once the move finishes, he turns around in midair. An unusual move that lets him change direction while attacking.", titlePt: "Upper Swing (Ataque Aéreo Traseiro)", textPt: "Assim que o movimento termina, ele se vira no ar. Um movimento incomum que permite mudar de direção enquanto ataca." },
  { titleEn: "[★☆☆] Sword Characteristics", titleJp: "剣の性質", textJp: "マルスの剣を使った攻撃は、剣先が強く、根本が弱い。うまく剣先が当たる間合いを保って戦おう。", titleJpEn: "Sword Characteristics", textJpEn: "Attacks using Marth's sword are strong at the tip and weak at the base. Fight while maintaining the spacing needed to consistently land the tip.", titlePt: "Características da Espada", textPt: "Ataques usando a espada do Marth são fortes na ponta e fracos na base. Lute mantendo o espaçamento necessário para acertar consistentemente a ponta." },
  { titleEn: "[★☆☆] The Three Fastest Walkers", titleJp: "早歩きランキングBEST３", textJp: "１位は「マルス」と「ルキナ」の２名が同記録、３位は「フォックス」。歩行は、走行よりスキが少ない。乱闘では、歩く速さも重要。", titleJpEn: "Top 3 Fastest Walkers", textJpEn: "1st place is a tie between \"Marth\" and \"Lucina.\" 3rd place: \"Fox.\" Walking has fewer openings than running. In a brawl, walking speed matters too.", titlePt: "Top 3 Andares Mais Rápidos", textPt: "O 1º lugar é um empate entre \"Marth\" e \"Lucina.\" 3º lugar: \"Fox.\" Andar tem menos aberturas do que correr. Em uma batalha, a velocidade ao andar também importa." },
];

async function main() {
  const marth = await db.fighter.findFirst({
    where: { name: "Marth" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!marth) { console.log("Marth not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: marth.id },
    data: {
      curatorOverviewEn: "Marth, the original hero of Fire Emblem, brought technical swordplay to Smash — his blade deals maximum damage at the tip and less near the hilt, rewarding precise spacing over brute force. Shield Breaker punishes campers, Dancing Blade offers flexible four-hit combos, and Counter punishes aggression. A graceful but floaty fighter who demands disciplined range control.",
      curatorOverviewPt: "Marth, o herói original de Fire Emblem, trouxe a esgrima técnica para o Smash — sua lâmina causa dano máximo na ponta e menos perto do punho, recompensando o posicionamento preciso em vez da força bruta. O Shield Breaker pune jogadores defensivos, o Dancing Blade oferece combos flexíveis de quatro golpes, e o Counter pune a agressividade. Um lutador gracioso, mas leve, que exige controle disciplinado de distância.",
      curatorOverviewJp: "『ファイアーエムブレム』初代の英雄マルスは、スマブラにテクニカルな剣術をもたらした――彼の剣は剣先で最大のダメージを与え、柄に近いほど弱くなるため、力任せよりも正確な間合い管理が求められる。シールドブレイカーは待ちの相手を罰し、マーベラスコンビネーションは柔軟な４段連続ワザを提供し、カウンターは攻撃的な相手を罰する。優雅だが浮きやすいファイターであり、規律ある間合いコントロールを要求する。",
      curatorOverviewJpEn: "Marth, the original hero of \"Fire Emblem,\" brought technical swordplay to Smash — his sword deals the most damage at the tip and weakens closer to the hilt, demanding precise spacing over raw power. Shield Breaker punishes defensive opponents, Dancing Blade offers a flexible four-hit combo, and Counter punishes aggressive ones. A graceful but floaty fighter who requires disciplined range control.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = marth.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Set Bio SSBM video (was missing entirely) using existing trophy "Marth" SSBM timing (2373-2392)
  const bioSsbm = marth.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 2373, videoEndSec: 2392 } });
    console.log("✅ Bio SSBM video: (vazio) -> 2373-2392 (trophy Marth timing)");
  }

  // Moves EN+PT+JpEn
  for (const m of marth.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = marth.tips.find(t => t.titleEn === data.titleEn);
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

  console.log("\n⚠️  SSBB Trophy Marth timing pendente de confirmação -- valor atual 7249-7251 (só 2s, corrompido). Usuário enviou '2:00:55 - 2:00:11' mas o fim vem antes do início (typo). Aguardando confirmação do timing correto.");

  await db.$disconnect();
}
main().catch(console.error);
