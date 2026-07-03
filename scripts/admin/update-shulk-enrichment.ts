import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "The protagonist of \"Xenoblade Chronicles.\" A handsome, research-loving young man. He sets out on a journey with his friends to defeat the Mechon that attacked his hometown. His greatest feature in \"Super Smash Bros.\" is an ability shift called \"Monado Arts.\" Activating one raises certain stats such as attack power, defense, or speed. Since other stats drop as a tradeoff, he should be played by switching Arts to fit the situation.",
    pt: "O protagonista de \"Xenoblade Chronicles\". Um jovem bonito e apaixonado por pesquisa. Ele parte em uma jornada com seus amigos para derrotar os Mechon que atacaram sua cidade natal. Sua maior característica em \"Super Smash Bros.\" é uma mudança de habilidade chamada \"Monado Arts\". Ativá-la aumenta certos atributos, como poder de ataque, defesa ou velocidade. Como outros atributos caem como contrapartida, ele deve ser jogado trocando de Arts conforme a situação.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Shulk's Origins", titleJp: "シュルクの初登場作品", textJp: "シュルクの初登場作品は、２０１０年に発売された『ゼノブレイド』。防衛隊兵器開発局の研究員で、好奇心旺盛な心優しき少年。", titleJpEn: "Shulk's Debut Work", textJpEn: "Shulk's debut work is 2010's \"Xenoblade Chronicles.\" He's a researcher at the Colony 9 Defense Force's weapons development lab, a kind-hearted young man brimming with curiosity.", titlePt: "As Origens do Shulk", textPt: "O trabalho de estreia do Shulk é \"Xenoblade Chronicles\", lançado em 2010. Ele é um pesquisador no laboratório de desenvolvimento de armas da Força de Defesa da Colônia 9, um jovem gentil e cheio de curiosidade." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『ゼノブレイド』に登場する主人公で、基本的に性格は温和で争いごとを好まないが、どんな敵にも恐れず立ち向かう勇敢さを内に秘めている。", titleJpEn: "In the Original Game", textJpEn: "The protagonist who appears in \"Xenoblade Chronicles.\" He's generally gentle-natured and dislikes conflict, but he holds within him the courage to face any enemy without fear.", titlePt: "Na Série Original", textPt: "O protagonista que aparece em \"Xenoblade Chronicles\". Ele é geralmente de natureza gentil e não gosta de conflitos, mas guarda dentro de si a coragem de enfrentar qualquer inimigo sem medo." },
  { titleEn: "[★☆☆] Up Taunt", titleJp: "上アピール", textJp: "上アピール時に発する「穏やかじゃないですね」という言葉は、『ゼノブレイド』でクエストを受注した時のセリフ。", titleJpEn: "Up Taunt", textJpEn: "The line \"This is getting kind of intense!\" that he says during his up taunt is a line from \"Xenoblade Chronicles\" spoken when accepting a quest.", titlePt: "Provocação Cima", textPt: "A frase \"Isso está ficando meio intenso!\", dita durante sua provocação cima, é uma fala de \"Xenoblade Chronicles\" dita ao aceitar uma missão." },
  { titleEn: "[★☆☆] Summertime Shulk", titleJp: "水着のシュルク", textJp: "シュルクの8Pカラーは海が似合う「海パン姿」。原作『ゼノブレイド』では、防具を一切装備しないとこの姿になる。", titleJpEn: "Swimsuit Shulk", textJpEn: "Shulk's 8P color is a pair of swim trunks that suit the beach. In the original game \"Xenoblade Chronicles,\" this is how he looks when no armor at all is equipped.", titlePt: "Shulk de Sunga", textPt: "A cor 8P do Shulk é uma sunga que combina com a praia. No jogo original \"Xenoblade Chronicles\", é assim que ele aparece quando nenhuma armadura está equipada." },
  { titleEn: "[★☆☆] Monado Arts (Neutral Special)", titleJp: "モナドアーツ 【通常必殺ワザ】", textJp: "「翔」「疾」「盾」「斬」「撃」から選んだモードにチェンジ。各モードチェンジをすると一定時間能力が変化する。", titleJpEn: "Monado Arts (Neutral Special)", textJpEn: "Switches to a mode chosen from Jump, Speed, Shield, Buster, and Smash. Each mode change alters his abilities for a set amount of time.", titlePt: "Monado Arts (Especial Neutro)", textPt: "Muda para um modo escolhido entre Jump, Speed, Shield, Buster e Smash. Cada mudança de modo altera suas habilidades por um período determinado." },
  { titleEn: "[★☆☆] Monado Arts - Speed (Neutral Special)", titleJp: "モナドアーツ「疾」 【通常必殺ワザ】", textJp: "「スピード(疾)」は移動速度が強化されるが、与えるダメージとジャンプ力が下がってしまう。", titleJpEn: "Monado Arts: Speed (Neutral Special)", textJpEn: "\"Speed\" boosts movement speed, but reduces damage dealt and jump height.", titlePt: "Monado Arts: Speed (Especial Neutro)", textPt: "\"Speed\" aumenta a velocidade de movimento, mas reduz o dano causado e a altura do pulo." },
  { titleEn: "[★★☆] Monado Arts - Shield (Neutral Special)", titleJp: "モナドアーツ「盾」 【通常必殺ワザ】", textJp: "「シールド(盾)」はシールドの能力が強化されるが、移動速度やジャンプ、与えるダメージが下がる。", titleJpEn: "Monado Arts: Shield (Neutral Special)", textJpEn: "\"Shield\" boosts shield strength, but reduces movement speed, jump, and damage dealt.", titlePt: "Monado Arts: Shield (Especial Neutro)", textPt: "\"Shield\" aumenta a força do escudo, mas reduz a velocidade de movimento, o pulo e o dano causado." },
  { titleEn: "[★★☆] Monado Arts - Buster (Neutral Special)", titleJp: "モナドアーツ「斬」 【通常必殺ワザ】", textJp: "「バスター(斬)」は与えるダメージが多くなるが、ふっとばし力が大きく下がり、受けるダメージが多くなる。", titleJpEn: "Monado Arts: Buster (Neutral Special)", textJpEn: "\"Buster\" increases damage dealt, but greatly reduces knockback power and increases damage taken.", titlePt: "Monado Arts: Buster (Especial Neutro)", textPt: "\"Buster\" aumenta o dano causado, mas reduz muito o poder de arremesso e aumenta o dano recebido." },
  { titleEn: "[★★☆] Monado Arts - Smash (Neutral Special)", titleJp: "モナドアーツ「撃」 【通常必殺ワザ】", textJp: "「スマッシュ(撃)」はふっとばし力が強化されるが、与えるダメージが下がり、ふっとばされやすくなる。", titleJpEn: "Monado Arts: Smash (Neutral Special)", textJpEn: "\"Smash\" boosts knockback power, but reduces damage dealt and makes it easier to be launched.", titlePt: "Monado Arts: Smash (Especial Neutro)", textPt: "\"Smash\" aumenta o poder de arremesso, mas reduz o dano causado e torna mais fácil ser arremessado." },
  { titleEn: "[★★☆] Monado Arts - Jump (Neutral Special)", titleJp: "モナドアーツ「翔」 【通常必殺ワザ】", textJp: "「ジャンプ(翔)」はジャンプや空中ジャンプの高さだけでなく、エアスラッシュを使った時の上昇量も上がる。復帰に心強いモナドアーツ。", titleJpEn: "Monado Arts: Jump (Neutral Special)", textJpEn: "\"Jump\" increases not only the height of jumps and midair jumps, but also how far he rises when using Air Slash. A reassuring Monado Art for recovery.", titlePt: "Monado Arts: Jump (Especial Neutro)", textPt: "\"Jump\" aumenta não só a altura dos pulos e pulos aéreos, mas também o quanto ele sobe ao usar o Air Slash. Um Monado Art reconfortante para recuperação." },
  { titleEn: "[★★☆] Monado Arts and Being Launched (Neutral Special)", titleJp: "ふっとばされた時のモナドアーツ 【通常必殺ワザ】", textJp: "ふっとばされている途中でも、モナドアーツは変更可能。ガケの外側に大きくふっとばされた時は、素早く「翔」に変更できれば生存率が上がる。", titleJpEn: "Monado Arts While Being Launched (Neutral Special)", textJpEn: "Monado Arts can be changed even while being launched. When launched far off the ledge, quickly switching to \"Jump\" can increase your chance of survival.", titlePt: "Monado Arts Enquanto é Arremessado (Especial Neutro)", textPt: "Os Monado Arts podem ser trocados mesmo enquanto é arremessado. Ao ser arremessado para longe da borda, trocar rapidamente para \"Jump\" pode aumentar sua chance de sobrevivência." },
  { titleEn: "[★★☆] Limitations of Monado Arts (Neutral Special)", titleJp: "モナドアーツの連続使用制限 【通常必殺ワザ】", textJp: "同じアーツを連続して使用することはできない。効果が切れてから一定時間経つと、再使用できるようになる。", titleJpEn: "Consecutive Use Limit for Monado Arts (Neutral Special)", textJpEn: "The same Art cannot be used consecutively. After a set amount of time passes once its effect ends, it becomes usable again.", titlePt: "Limite de Uso Consecutivo dos Monado Arts (Especial Neutro)", textPt: "O mesmo Art não pode ser usado consecutivamente. Depois que um período determinado passa desde o fim de seu efeito, ele se torna utilizável novamente." },
  { titleEn: "[★☆☆] Canceling Monado Arts (Neutral Special)", titleJp: "モナドアーツのキャンセル 【通常必殺ワザ】", textJp: "通常必殺ワザを素早く３回入力することで、現在使用しているモナドアーツをキャンセルすることができる。", titleJpEn: "Canceling Monado Arts (Neutral Special)", textJpEn: "Inputting the Neutral Special quickly three times in a row cancels the Monado Art currently in use.", titlePt: "Cancelando os Monado Arts (Especial Neutro)", textPt: "Inputar o especial neutro rapidamente três vezes seguidas cancela o Monado Art atualmente em uso." },
  { titleEn: "[★★★] Chain Attack and Monado Arts (Neutral Special)", titleJp: "チェインアタックとモナドアーツ 【通常必殺ワザ】", textJp: "モナドアーツは最後の切りふだにも影響する。例えば「バスター(斬)」を使えば、ふっとばし力は下がるが攻撃力が上がるので、大ダメージを狙える。", titleJpEn: "Chain Attack and Monado Arts (Neutral Special)", textJpEn: "Monado Arts also affect the Final Smash. For example, using \"Buster\" lowers knockback power but raises attack power, allowing for heavy damage.", titlePt: "Chain Attack e os Monado Arts (Especial Neutro)", textPt: "Os Monado Arts também afetam o Final Smash. Por exemplo, usar \"Buster\" reduz o poder de arremesso, mas aumenta o poder de ataque, permitindo dano pesado." },
  { titleEn: "[★☆☆] Shortcuts for Monado Arts (Neutral Special)", titleJp: "モナドアーツのショートカット 【通常必殺ワザ】", textJp: "必殺ワザボタンを押したままで、モナドアーツ一覧が表示できる。スティック入力で、使用したいモナドアーツを選んでボタンを離せば、すぐに切り替わる。", titleJpEn: "Monado Arts Shortcut (Neutral Special)", textJpEn: "Holding down the special move button displays the list of Monado Arts. Selecting the desired Art with the control stick and releasing the button switches to it immediately.", titlePt: "Atalho para os Monado Arts (Especial Neutro)", textPt: "Segurar o botão de golpe especial exibe a lista de Monado Arts. Selecionar o Art desejado com o analógico e soltar o botão troca para ele imediatamente." },
  { titleEn: "[★☆☆] Back Slash (Side Special)", titleJp: "バックスラッシュ 【横必殺ワザ】", textJp: "前方に飛び上がって剣を振り下ろす。相手の後ろから当てると、より高いダメージを与える。", titleJpEn: "Back Slash (Side Special)", textJpEn: "Leaps forward and swings the sword downward. Hitting an opponent from behind deals higher damage.", titlePt: "Back Slash (Especial Lateral)", textPt: "Salta para frente e desfere a espada para baixo. Acertar um adversário por trás causa mais dano." },
  { titleEn: "[★☆☆] Back Slash Details (Side Special)", titleJp: "バックスラッシュ 【横必殺ワザ】", textJp: "モナドを振り下ろしながら落下した後、少し経つとガケをつかむことができる。また、振り下ろし中は、スティックの左右入力で少しだけ移動できる。", titleJpEn: "Back Slash Details (Side Special)", textJpEn: "After falling while swinging the Monado downward, the ledge can be grabbed once a bit of time has passed. Also, while swinging it down, slight left-right movement is possible with the control stick.", titlePt: "Detalhes do Back Slash (Especial Lateral)", textPt: "Depois de cair enquanto desfere o Monado para baixo, a borda pode ser agarrada após um pouco de tempo. Além disso, enquanto desfere o golpe, é possível se mover levemente para a esquerda ou direita com o analógico." },
  { titleEn: "[★☆☆] Air Slash (Up Special)", titleJp: "エアスラッシュ 【上必殺ワザ】", textJp: "上昇中に通常攻撃ボタンを入力すると、前方に攻撃しつつ、少しだけ高い位置まで飛べる。下り始めてから入力しても無効。", titleJpEn: "Air Slash (Up Special)", textJpEn: "Inputting the standard attack button while rising attacks forward while also allowing him to fly a bit higher. It has no effect if input after he starts descending.", titlePt: "Air Slash (Especial Cima)", textPt: "Inputar o botão de ataque padrão enquanto sobe ataca para frente e também permite que ele voe um pouco mais alto. Não tem efeito se inputado depois que ele começa a descer." },
  { titleEn: "[★★☆] Length of Vision (Down Special)", titleJp: "ビジョンの効果時間 【下必殺ワザ】", textJp: "強力なカウンターワザだが、連続で使用すると受付時間が短くなっていく。短くなった効果時間は、下必殺ワザを使わないでいると徐々に回復する。", titleJpEn: "Vision's Duration (Down Special)", textJpEn: "A powerful counter move, but its window shortens the more it's used consecutively. The shortened duration gradually recovers if the Down Special isn't used for a while.", titlePt: "A Duração do Vision (Especial Baixo)", textPt: "Um golpe de contra-ataque poderoso, mas sua janela encurta quanto mais é usado consecutivamente. A duração encurtada se recupera gradualmente se o especial baixo não for usado por um tempo." },
  { titleEn: "[★★★] Strike from Behind with Vision (Down Special)", titleJp: "ビジョンで回り込み 【下必殺ワザ】", textJp: "カウンター成功時に相手の方向を入力していると、回り込んで攻撃する。回り込んだ方が強くふっとばせるが、空中で使った時は回り込めない。", titleJpEn: "Circling Around with Vision (Down Special)", textJpEn: "Inputting toward the opponent when the counter succeeds makes him circle around to attack. Circling around launches with more power, but this isn't possible when used in the air.", titlePt: "Contornando com o Vision (Especial Baixo)", textPt: "Inputar em direção ao adversário quando o contra-ataque tem sucesso faz com que ele o contorne para atacar. Contornar arremessa com mais poder, mas isso não é possível quando usado no ar." },
  { titleEn: "[★☆☆] Shouts in Chain Attack (Final Smash)", titleJp: "チェインアタックの掛け声 【最後の切りふだ】", textJp: "ワザの開始時にダンバン、リキ、フィオルンのいずれかに呼びかける。それぞれ攻撃中のセリフが異なるけれど、ワザの性能自体は変わらない。", titleJpEn: "Chain Attack's Battle Cry (Final Smash)", textJpEn: "At the start of the move, he calls out to either Dunban, Riki, or Fiora. Each has different lines during the attack, but the move's performance itself doesn't change.", titlePt: "O Grito de Chain Attack (Final Smash)", textPt: "No início do golpe, ele chama Dunban, Riki ou Fiora. Cada um tem falas diferentes durante o ataque, mas o desempenho do golpe em si não muda." },
  { titleEn: "[★☆☆] Chain Attack (Final Smash)", titleJp: "チェインアタック 【最後の切りふだ】", textJp: "未来視ビジョンの円に当たった相手を巻き込む、最後の切りふだ。ダンバン、リキ、フィオルンの３人と連携し、連続攻撃を叩き込む。", titleJpEn: "Chain Attack (Final Smash)", textJpEn: "A Final Smash that catches any opponent hit by the Foresight Vision circle. He teams up with Dunban, Riki, and Fiora to unleash a barrage of attacks.", titlePt: "Chain Attack (Final Smash)", textPt: "Um Final Smash que pega qualquer adversário atingido pelo círculo da Visão de Previsão. Ele se junta a Dunban, Riki e Fiora para desencadear uma sequência de ataques." },
  { titleEn: "[★☆☆] Behind Thrust (Back Air Attack)", titleJp: "ビハインドスラスト 【後空中攻撃】", textJp: "背後に向けて剣を振り抜く、リーチがとても長いワザ。ただ、モナドで斬りつけるまでが、少し遅い。", titleJpEn: "Behind Thrust (Back Air Attack)", textJpEn: "A move with very long reach that swings the sword out behind him. However, it takes a bit of time before the Monado actually slashes.", titlePt: "Behind Thrust (Ataque Aéreo de Trás)", textPt: "Um golpe com alcance muito longo que desfere a espada por trás. No entanto, leva um pouco de tempo até o Monado realmente cortar." },
];

async function main() {
  const shulk = await db.fighter.findFirst({
    where: { name: "Shulk" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!shulk) { console.log("Shulk not found"); return; }

  await db.fighter.update({
    where: { id: shulk.id },
    data: {
      curatorOverviewEn: "Shulk, the protagonist of Xenoblade Chronicles, is built entirely around Monado Arts — five stances (Jump, Speed, Shield, Buster, and Smash) that each trade one strength for a corresponding weakness, and which can even be swapped mid-launch to save a stock. His Back Slash and Air Slash give him strong mobility and edgeguard tools, while Vision offers one of the best counters in the game, though its window shrinks with repeated use. Chain Attack, his Final Smash, scales with whichever Art is active, turning Buster mode into a chance for massive damage. Shulk rewards players who plan several steps ahead, constantly re-evaluating which tradeoff suits the moment rather than committing to a single mode.",
      curatorOverviewPt: "Shulk, o protagonista de Xenoblade Chronicles, é construído inteiramente em torno dos Monado Arts — cinco posturas (Jump, Speed, Shield, Buster e Smash) que trocam cada uma um ponto forte por uma fraqueza correspondente, e que podem até ser trocadas no meio de um arremesso para salvar um stock. Seu Back Slash e Air Slash lhe dão fortes ferramentas de mobilidade e edge guard, enquanto o Vision oferece um dos melhores contra-ataques do jogo, embora sua janela encolha com o uso repetido. Chain Attack, seu Final Smash, escala com o Art ativo no momento, transformando o modo Buster em uma chance de dano massivo. Shulk recompensa jogadores que planejam vários passos à frente, reavaliando constantemente qual compromisso se encaixa no momento em vez de se prender a um único modo.",
      curatorOverviewJp: "『ゼノブレイド』の主人公、シュルクは、完全に「モナドアーツ」を軸に組み立てられたファイターだ――「翔」「疾」「盾」「斬」「撃」の５つの構えは、それぞれ１つの強みと引き換えに１つの弱みを持ち、ふっとばされている最中でさえストックを救うために切り替えることができる。「バックスラッシュ」と「エアスラッシュ」は強力な機動力とガケ狩り性能を与え、「ビジョン」はゲーム屈指のカウンターを提供するが、連続使用でその受付時間は狭まっていく。最後の切りふだ「チェインアタック」は、発動中のアーツに応じて性能が変化し、「バスター(斬)」であれば大ダメージのチャンスとなる。シュルクは、単一のモードに固執するのではなく、その瞬間に合ったトレードオフを常に見極めながら、数手先を読むプレイヤーに応える。",
      curatorOverviewJpEn: "Shulk, the protagonist of \"Xenoblade Chronicles,\" is built entirely around Monado Arts — five stances (Jump, Speed, Shield, Buster, and Smash), each trading one strength for a corresponding weakness, which can even be switched mid-launch to save a stock. Back Slash and Air Slash give him strong mobility and edge-guarding tools, while Vision offers one of the best counters in the game, though its window narrows with repeated use. His Final Smash, Chain Attack, changes performance depending on the Art currently active, with Buster mode becoming a chance for massive damage. Shulk rewards players who think several moves ahead, constantly reassessing which tradeoff fits the moment rather than committing to a single mode.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = shulk.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = shulk.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Air Slash\" is an Up Special that launches opponents upward while jumping. Pressing the button before reaching the peak lands a follow-up that sends them flying sideways. \"Back Slash\" is a Side Special where he swings his extended sword downward. It has a wide range but leaves a big opening. Landing it from behind an opponent greatly increases its power, and using it in the air keeps its hitbox active until he lands. (Wii) Xenoblade Chronicles (2010/06)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Air Slash\" é um especial de cima que lança os adversários para cima enquanto pula. Apertar o botão antes de atingir o ápice emenda um golpe que os arremessa lateralmente. \"Back Slash\" é um especial lateral no qual ele desfere sua espada estendida para baixo. Tem um alcance amplo, mas deixa uma grande abertura. Acertá-lo por trás de um adversário aumenta muito seu poder, e usá-lo no ar mantém sua hitbox ativa até ele pousar. (Wii) Xenoblade Chronicles (2010/06)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = shulk.tips.find(t => t.titleEn === data.titleEn);
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

  // Nenhum timing de vídeo novo fornecido pelo usuário para Shulk — dados existentes já plausíveis, não mexidos.

  await db.$disconnect();
}
main().catch(console.error);
