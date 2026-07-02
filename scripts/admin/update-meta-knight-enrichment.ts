import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "A masked swordsman with an air of coolness who appears in the \"Kirby\" series. Considered Kirby's rival. His cape transforms into wings, letting him fly through the sky. In Smash Bros., he's characterized by swift swordsmanship and strong anti-air performance. He can jump five times in the air and has a special move that gains significant height, giving him excellent recovery. Actively engage in aerial combat to take down your opponents.",
    pt: "Um espadachim mascarado com um ar de estilo que aparece na série \"Kirby.\" Considerado o rival do Kirby. Sua capa se transforma em asas, permitindo voar pelo céu. Em Smash Bros., ele é caracterizado por uma esgrima veloz e forte desempenho antiaéreo. Ele pode pular cinco vezes no ar e tem um golpe especial que ganha altura significativa, dando-lhe uma excelente recuperação. Engaje ativamente em combate aéreo para derrubar seus adversários.",
  },
  SSBB: {
    jpEn: "The head who leads the Meta-Knights, and something of a rival to Kirby. He boasts considerable swordsmanship. Holding to a code of chivalry, he once intentionally handed his sword to Kirby to challenge him to single combat. The cape on his back becomes wings, letting him fly through the sky. He's briefly shown his bare face once, but his relationship with Kirby remains shrouded in mystery.",
    pt: "O líder que comanda os Meta-Knights, e algo como um rival do Kirby. Ele possui uma esgrima considerável. Seguindo um código de cavalaria, ele certa vez entregou intencionalmente sua espada ao Kirby para desafiá-lo a um combate individual. A capa em suas costas se torna asas, permitindo voar pelo céu. Ele mostrou brevemente seu rosto uma vez, mas sua relação com o Kirby continua envolta em mistério.",
  },
  SSBU: {
    jpEn: "A cool guy who values chivalry, standing out amid the peaceful Dream Land. His mask and sword are his trademarks. The wings that suddenly sprout when he flies are his transformed cape. In some games since \"Kirby's Return to Dream Land,\" the wings are depicted as being part of his body.",
    pt: "Um cara descolado que valoriza a cavalaria, destacando-se no meio da pacífica Dream Land. Sua máscara e espada são suas marcas registradas. As asas que surgem repentinamente quando ele voa são sua capa transformada. Em alguns jogos desde \"Kirby's Return to Dream Land,\" as asas são retratadas como parte de seu corpo.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Meta Knight's Origins", titleJp: "メタナイトの初登場作品", textJp: "メタナイトの初登場作品、『星のカービィ 夢の泉の物語』。カービィの前に立ちはだかるボスだが、時には助けてくれる謎の存在。", titleJpEn: "Meta Knight's Origins", textJpEn: "Meta Knight's debut was in \"Kirby's Adventure.\" He's a boss who stands in Kirby's way, but also a mysterious presence who sometimes helps him.", titlePt: "As Origens do Meta Knight", textPt: "O debut do Meta Knight foi em \"Kirby's Adventure.\" Ele é um chefe que se coloca no caminho do Kirby, mas também uma presença misteriosa que às vezes o ajuda." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『星のカービィ 夢の泉の物語』で初登場。「メタナイト軍団」を従えている。仮面をつけているが、カービィとの勝負に負けると、仮面が割れ素顔がかいま見える。", titleJpEn: "In His Series", textJpEn: "First appeared in \"Kirby's Adventure.\" He commands the \"Meta-Knights.\" He wears a mask, but when he loses to Kirby, the mask breaks and his bare face is briefly glimpsed.", titlePt: "Na Série Original", textPt: "Apareceu pela primeira vez em \"Kirby's Adventure.\" Ele comanda os \"Meta-Knights.\" Ele usa uma máscara, mas quando perde para o Kirby, a máscara se quebra e seu rosto é brevemente vislumbrado." },
  { titleEn: "[★☆☆] Galacta Knight", titleJp: "ギャラクティックナイト", textJp: "7Pカラーは『星のカービィ ウルトラスーパーデラックス』に登場した、銀河最強の戦士「ギャラクティックナイト」のカラーリング。", titleJpEn: "Galacta Knight", textJpEn: "The 7P color is the coloring of \"Galacta Knight,\" the strongest warrior in the galaxy, who appeared in \"Kirby Super Star Ultra.\"", titlePt: "Galacta Knight", textPt: "A cor 7P é a coloração do \"Galacta Knight,\" o guerreiro mais forte da galáxia, que apareceu em \"Kirby Super Star Ultra.\"" },
  { titleEn: "[★☆☆] Dark Meta Knight", titleJp: "ダークメタナイト", textJp: "8Pカラーは『星のカービィ 鏡の大迷宮』に登場した、メタナイトのカゲ「ダークメタナイト」のカラーリング。", titleJpEn: "Dark Meta Knight", textJpEn: "The 8P color is the coloring of \"Dark Meta Knight,\" Meta Knight's shadow, who appeared in \"Kirby & The Amazing Mirror.\"", titlePt: "Dark Meta Knight", textPt: "A cor 8P é a coloração do \"Dark Meta Knight,\" a sombra do Meta Knight, que apareceu em \"Kirby & The Amazing Mirror.\"" },
  { titleEn: "[★☆☆] Mach Tornado (Neutral Special)", titleJp: "マッハトルネイド 【通常必殺ワザ】", textJp: "回転して体のまわりに竜巻を発生させる。竜巻は、弱い飛び道具を打ち消す効果がある。", titleJpEn: "Mach Tornado (Neutral Special)", textJpEn: "Spins to generate a tornado around his body. The tornado has the effect of canceling out weak projectiles.", titlePt: "Mach Tornado (Especial Neutro)", textPt: "Gira para gerar um tornado ao redor do corpo. O tornado tem o efeito de cancelar projéteis fracos." },
  { titleEn: "[★☆☆] Drill Rush (Side Special)", titleJp: "ドリルラッシュ 【横必殺ワザ】", textJp: "ドリルのように回転しながら突撃する。突撃中は進む方向を調整することができる。", titleJpEn: "Drill Rush (Side Special)", textJpEn: "Spins like a drill while charging forward. The direction of travel can be adjusted during the charge.", titlePt: "Drill Rush (Especial Lateral)", textPt: "Gira como uma broca enquanto avança. A direção do avanço pode ser ajustada durante a carga." },
  { titleEn: "[★★★] Drill Rush Technique (Side Special)", titleJp: "ドリルラッシュのテクニック 【横必殺ワザ】", textJp: "地面に押し付ける形で方向転換すると、体が地面にぶつかりホップする。攻撃を読まれてシールドされたら、ホップを利用して反撃リスクを減らせる。", titleJpEn: "Drill Rush Technique (Side Special)", textJpEn: "Turning in a way that presses toward the ground makes his body hit the ground and hop. If the attack is read and shielded, using the hop can reduce the risk of a counterattack.", titlePt: "Técnica do Drill Rush (Especial Lateral)", textPt: "Virar de forma que pressione em direção ao chão faz o corpo bater no chão e quicar. Se o ataque for lido e bloqueado, usar o quique pode reduzir o risco de um contra-ataque." },
  { titleEn: "[★☆☆] Shuttle Loop (Up Special)", titleJp: "シャトルループ 【上必殺ワザ】", textJp: "飛び上がりながら突き、一回転してもう一度突き上げる。高威力でワザの始まりも早く、撃墜を狙うのに役立つ。", titleJpEn: "Shuttle Loop (Up Special)", textJpEn: "Thrusts while leaping, spins once, and thrusts upward again. It has high power and comes out quickly, useful for going for a KO.", titlePt: "Shuttle Loop (Especial Cima)", textPt: "Estoca enquanto salta, gira uma vez, e estoca para cima novamente. Tem alto poder e sai rapidamente, útil para buscar um KO." },
  { titleEn: "[★★☆] Shuttle Loop with Care (Up Special)", titleJp: "シャトルループの注意 【上必殺ワザ】", textJp: "ふっとばし力が強く、真上に突き上げるので上空に逃げたファイターへの追い討ちに適しているが、使用後は着地するまでスキだらけ。", titleJpEn: "Shuttle Loop with Care (Up Special)", textJpEn: "Its knockback is strong and it thrusts straight up, making it suited for chasing down fighters fleeing upward, but after use, there's a large opening until he lands.", titlePt: "Cuidados com o Shuttle Loop (Especial Cima)", textPt: "Seu arremesso é forte e estoca diretamente para cima, tornando-o adequado para perseguir lutadores que fogem para cima, mas depois de usado, há uma grande abertura até ele pousar." },
  { titleEn: "[★★☆] Shuttle Loop's Characteristics (Up Special)", titleJp: "シャトルループの特性 【上必殺ワザ】", textJp: "地上で使うより空中で使った方がほんの少しだけ攻撃が早く出る。そのかわり１発目の攻撃は地上で当てた方が空中より少しだけ強い。", titleJpEn: "Shuttle Loop's Characteristics (Up Special)", textJpEn: "Used in the air, the attack comes out just slightly faster than on the ground. However, the first hit is slightly stronger when landed on the ground than in the air.", titlePt: "As Características do Shuttle Loop (Especial Cima)", textPt: "Usado no ar, o ataque sai um pouco mais rápido do que no chão. Porém, o primeiro golpe é um pouco mais forte quando conecta no chão do que no ar." },
  { titleEn: "[★★☆] Dimensional Cape (Down Special)", titleJp: "ディメンションマント 【下必殺ワザ】", textJp: "マントに身を包み、少しのあいだ姿を消して移動する。ボタンを押したままにすると、出現したときに攻撃できる。", titleJpEn: "Dimensional Cape (Down Special)", textJpEn: "Wraps himself in his cape and moves while invisible for a short time. Holding the button lets him attack when he reappears.", titlePt: "Dimensional Cape (Especial Baixo)", textPt: "Envolve-se na capa e se move enquanto invisível por um curto tempo. Segurar o botão permite atacar quando reaparece." },
  { titleEn: "[★★☆] Dimensional Cape Techniques (Down Special)", titleJp: "ディメンションマントのテクニック 【下必殺ワザ】", textJp: "姿を消している間、メタナイトは入力している方向に移動する。入力が無ければ移動しないので、その場に居座って意表をつくこともできる。", titleJpEn: "Dimensional Cape Techniques (Down Special)", textJpEn: "While invisible, Meta Knight moves in the direction being input. With no input, he doesn't move, so he can stay in place to catch opponents off guard.", titlePt: "Técnicas do Dimensional Cape (Especial Baixo)", textPt: "Enquanto invisível, o Meta Knight se move na direção inputada. Sem input, ele não se move, então pode ficar parado no lugar para pegar os adversários de surpresa." },
  { titleEn: "[★★☆] Dimensional Cape Warning (Down Special)", titleJp: "ディメンションマントの注意 【下必殺ワザ】", textJp: "姿を消している間、メタナイトは入力している方向に移動できるが、後方に移動すると、攻撃力とふっとばし力が下がってしまう。", titleJpEn: "Dimensional Cape Warning (Down Special)", textJpEn: "While invisible, Meta Knight can move in the direction being input, but moving backward reduces both his attack power and knockback.", titlePt: "Cuidados com o Dimensional Cape (Especial Baixo)", textPt: "Enquanto invisível, o Meta Knight pode se mover na direção inputada, mas se mover para trás reduz tanto seu poder de ataque quanto seu arremesso." },
  { titleEn: "[★☆☆] Darkness Illusion (Final Smash)", titleJp: "ダークネスイリュージョン 【最後の切りふだ】", textJp: "雷撃を起こし、周囲の相手を巻き込んで連続攻撃をする。最後は横方向に斬り抜けて、相手を大きくふっとばす。", titleJpEn: "Darkness Illusion (Final Smash)", textJpEn: "Unleashes a lightning strike, catching nearby opponents in a barrage of hits. It finishes with a horizontal slash that sends opponents flying far.", titlePt: "Darkness Illusion (Final Smash)", textPt: "Libera um raio, pegando os adversários próximos em uma rajada de golpes. Termina com um corte horizontal que arremessa os adversários para longe." },
  { titleEn: "[★☆☆] Flurry Attack (Neutral Attack)", titleJp: "乱れ斬り", textJp: "攻撃ボタンを１回押すだけで、すぐ百裂攻撃になる。メタナイトには単発の弱攻撃はない。", titleJpEn: "Flurry Attack (Neutral Attack)", textJpEn: "Pressing the attack button just once immediately becomes a rapid-hit combo. Meta Knight has no single-hit jab.", titlePt: "Flurry Attack (Ataque Neutro)", textPt: "Pressionar o botão de ataque apenas uma vez imediatamente se torna um combo de golpes rápidos. O Meta Knight não tem soco fraco de golpe único." },
  { titleEn: "[★☆☆] Third Attack's Launch Power (Side Tilt Attack)", titleJp: "３段階目でふっとばし 【横強攻撃】", textJp: "ボタンを押していくと、３段階目まで強攻撃が出せる。３段階目の攻撃を当てれば、ふっとばせる。", titleJpEn: "Third Attack's Launch Power (Side Tilt Attack)", textJpEn: "Continuing to press the button lets him deliver the tilt attack up to a third stage. Landing the third stage sends opponents flying.", titlePt: "O Poder de Arremesso do Terceiro Golpe (Ataque Inclinado Lateral)", textPt: "Continuar pressionando o botão permite entregar o ataque inclinado até um terceiro estágio. Acertar o terceiro estágio arremessa os adversários." },
  { titleEn: "[★☆☆] Midair Up Sweep (Up Air Attack)", titleJp: "空中上なぎ 【上空中攻撃】", textJp: "相手を斜め上に軽くふっとばすワザで、再度空中上なぎを狙える。その後で上必殺ワザを当てれば、さらに上空へ相手をふっとばせる。", titleJpEn: "Midair Up Sweep (Up Air Attack)", textJpEn: "A move that lightly launches opponents diagonally upward, allowing for another Midair Up Sweep. Following up with the Up Special afterward sends the opponent even higher.", titlePt: "Midair Up Sweep (Ataque Aéreo Cima)", textPt: "Um movimento que arremessa levemente os adversários na diagonal para cima, permitindo outro Midair Up Sweep. Fazer um acompanhamento com o Especial Cima depois arremessa o adversário ainda mais alto." },
  { titleEn: "[★★☆] Trample (Downward Throw)", titleJp: "踏みつけ 【下投げ】", textJp: "相手を斜め上に飛ばすので、連続攻撃の起点にしやすい。蓄積ダメージが低ければ、下投げ後にダッシュ攻撃から前空中攻撃などを当てることも可能。", titleJpEn: "Trample (Downward Throw)", textJpEn: "Sends the opponent flying diagonally upward, making it easy to set up a combo. If accumulated damage is low, following the down throw with a dash attack into a forward air attack is also possible.", titlePt: "Trample (Arremesso Baixo)", textPt: "Arremessa o adversário na diagonal para cima, facilitando preparar um combo. Se o dano acumulado for baixo, seguir o arremesso baixo com um ataque em disparada seguido de um ataque aéreo frontal também é possível." },
  { titleEn: "[★☆☆] Falling Defenseless", titleJp: "無防備な落下状態", textJp: "メタナイトのすべての必殺ワザは、空中で使った後に無防備な落下状態になる。空中戦が得意なファイターだが、必殺ワザの扱いには注意。", titleJpEn: "Falling Defenseless", textJpEn: "All of Meta Knight's special moves leave him falling defenseless after being used in the air. He's a fighter skilled in aerial combat, but be careful with how you use his specials.", titlePt: "Caindo Indefeso", textPt: "Todos os golpes especiais do Meta Knight o deixam caindo indefeso após serem usados no ar. Ele é um lutador habilidoso em combate aéreo, mas cuidado com como você usa seus especiais." },
];

async function main() {
  const mk = await db.fighter.findFirst({
    where: { name: "Meta Knight" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!mk) { console.log("Meta Knight not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: mk.id },
    data: {
      curatorOverviewEn: "Meta Knight, Kirby's masked rival, is Smash's premier aerial harasser — five jumps, a wing-cape that lets him soar, and blazingly fast sword strikes make him nearly impossible to pin down in the air. Mach Tornado, Shuttle Loop, and Dimensional Cape give him relentless offense and evasive utility, but every special leaves him helpless afterward, demanding a fighter who reads openings rather than gambling on every swing.",
      curatorOverviewPt: "Meta Knight, o rival mascarado do Kirby, é o principal incomodador aéreo do Smash — cinco pulos, uma capa-asa que permite voar, e golpes de espada extremamente rápidos o tornam quase impossível de pregar no ar. Mach Tornado, Shuttle Loop e Dimensional Cape lhe dão ofensiva implacável e utilidade evasiva, mas todo especial o deixa indefeso depois, exigindo um jogador que lê aberturas em vez de arriscar em cada golpe.",
      curatorOverviewJp: "カービィの仮面のライバル、メタナイトは、スマブラ屈指の空中撹乱型ファイター――５回のジャンプ、飛行を可能にする翼のマント、そして目にも留まらぬ剣技で、空中では捉えるのがほぼ不可能な存在だ。マッハトルネイド、シャトルループ、そしてディメンションマントが容赦ない攻めと回避の柔軟性を与えるが、必殺ワザを使うたびにその後無防備になるため、闇雲に振り回すのではなく相手の隙を読むプレイヤーが求められる。",
      curatorOverviewJpEn: "Meta Knight, Kirby's masked rival, is one of Smash's premier aerial harassment fighters — five jumps, a winged cape enabling flight, and blindingly fast swordplay make him nearly impossible to pin down in the air. Mach Tornado, Shuttle Loop, and Dimensional Cape grant relentless offense and evasive flexibility, but every special leaves him vulnerable afterward, requiring a player who reads openings rather than swinging blindly.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 3 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = mk.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix SSBB Trophy timing: 4498-4517 -> 4517-4535 (1:15:17-1:15:35 VLC confirmed)
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "Meta Knight", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 4517, videoEndSec: 4535 } });
    console.log(`✅ SSBB Trophy Meta Knight: ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} -> 4517-4535 (1:15:17-1:15:35)`);
  }

  // Fix corrupted SSB4 "Meta Knight (Alt.)" secondary video field (videoEndSec2 was ~46.8h)
  const ssb4Alt = await db.collectible.findFirst({ where: { name: "Meta Knight (Alt.)", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (ssb4Alt && ssb4Alt.videoStartSec2 != null && ssb4Alt.videoEndSec2 != null && ssb4Alt.videoEndSec2 > 7200) {
    await db.collectible.update({ where: { id: ssb4Alt.id }, data: { videoEndSec2: ssb4Alt.videoStartSec2 + 11 } });
    console.log(`✅ SSB4 Trophy "Meta Knight (Alt.)" secundário: videoEndSec2 corrompido -> ${ssb4Alt.videoStartSec2 + 11} (11s de duração, seguindo padrão do par principal)`);
  }

  // Move EN+PT+JpEn
  const move = mk.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const text = "Dimensional Cape is a teleportation move. Inputting a direction before he reappears changes where he emerges, and holding the button turns it into an attack. It's convenient for surprise attacks or escaping chaotic scrambles. Mach Tornado is a Neutral Special that attacks multiple opponents at once. Mashing the button raises him higher, and left/right input lets him move as well. (FC) Kirby's Adventure (1993/03) (SFC) Kirby Super Star (1996/03)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: text, descJpEn: text,
        descPt: "Dimensional Cape é um golpe de teleporte. Inputar uma direção antes dele reaparecer muda onde ele emerge, e segurar o botão o transforma em um ataque. É conveniente para ataques surpresa ou para escapar de confusões caóticas. Mach Tornado é um Especial Neutro que ataca vários adversários de uma vez. Apertar o botão repetidamente o eleva mais alto, e o input esquerda/direita também permite que ele se mova. (FC) Kirby's Adventure (1993/03) (SFC) Kirby Super Star (1996/03)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = mk.tips.find(t => t.titleEn === data.titleEn);
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
