import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "The target duck and the dog that appear in \"Duck Hunt.\" The dog's role is to retrieve ducks that have been shot down with the light gun. \"Duck Hunt\" was released for the Famicom in 1984. The pair enters \"Super Smash Bros.\" as a duo, showing off well-coordinated teamwork. The \"Can\" and \"Clay Pigeon\" are projectile Special moves — inputting the button again lets someone shoot them with the light gun, boosting their power and performance.",
    pt: "O pato-alvo e o cachorro que aparecem em \"Duck Hunt\". O papel do cachorro é recuperar os patos abatidos com a pistola de luz. \"Duck Hunt\" foi lançado para o Famicom em 1984. A dupla entra em \"Super Smash Bros.\" trabalhando em equipe, mostrando um trabalho em conjunto muito afinado. \"Can\" e \"Clay Pigeon\" são golpes especiais de projétil — inputar o botão novamente permite que alguém os atire com a pistola de luz, aumentando seu poder e desempenho.",
  },
};

const DUCK_HUNT_ROOTS_JP = "『ダックハント』は１９８４年にファミコンで発売され、人気を博したが、その７年前に、壁に投影したカモを撃つ同名のゲームが発売されている。";
const DUCK_HUNT_ROOTS_JPEN = "\"Duck Hunt\" was released for the Famicom in 1984 and became a hit, but seven years earlier, a game with the same name that involved shooting ducks projected onto a wall had already been released.";
const DUCK_HUNT_ROOTS_PT = "\"Duck Hunt\" foi lançado para o Famicom em 1984 e se tornou um sucesso, mas sete anos antes, um jogo com o mesmo nome que envolvia atirar em patos projetados em uma parede já havia sido lançado.";

const TIPS = [
  { titleEn: "[★☆☆] Duck Hunt's Origins", titleJp: "ダックハントのルーツ", textJp: DUCK_HUNT_ROOTS_JP, titleJpEn: "Duck Hunt's Roots", textJpEn: DUCK_HUNT_ROOTS_JPEN, titlePt: "As Raízes do Duck Hunt", textPt: DUCK_HUNT_ROOTS_PT },
  { titleEn: "[★☆☆] Duck Hunt Duo's Origins", titleJp: "ダックハントのルーツ", textJp: DUCK_HUNT_ROOTS_JP, titleJpEn: "Duck Hunt's Roots", textJpEn: DUCK_HUNT_ROOTS_JPEN, titlePt: "As Raízes do Duck Hunt", textPt: DUCK_HUNT_ROOTS_PT },
  { titleEn: "[★☆☆] In Their Series", titleJp: "原作では", textJp: "専用の、光線銃型コントローラー「ガン」を使って遊ぶ。草むらから飛び立ったカモをガンで撃つと、イヌが捕まえて回収する。", titleJpEn: "In the Original Game", textJpEn: "Played using a dedicated light-gun-shaped controller called the \"Gun.\" Shooting a duck that flies up out of the bushes with the Gun causes the dog to catch and retrieve it.", titlePt: "Na Série Original", textPt: "Jogado usando um controle dedicado em formato de pistola de luz chamado \"Gun\". Atirar em um pato que voa para fora dos arbustos com a Gun faz o cachorro pegá-lo e recuperá-lo." },
  { titleEn: "[★☆☆] Duck Hunt's Sales", titleJp: "『ダックハント』の売り上げ", textJp: "『ダックハント』の売り上げは２,８３１万本。驚異的なセールスは、海外においてファミコン(NES)とセット販売されたことが影響している。", titleJpEn: "\"Duck Hunt\"'s Sales", textJpEn: "\"Duck Hunt\" sold 28.31 million copies. This remarkable sales figure was influenced by it being bundled together with the Famicom (NES) overseas.", titlePt: "As Vendas de \"Duck Hunt\"", textPt: "\"Duck Hunt\" vendeu 28,31 milhões de cópias. Esse número extraordinário de vendas foi influenciado pelo fato de ter sido vendido junto com o Famicom (NES) no exterior." },
  { titleEn: "[★☆☆] Trick Shot (Neutral Special)", titleJp: "トリックショット 【通常必殺ワザ】", textJp: "相手に当たると爆発するカンを蹴り、ボタンを押して射撃。射撃すると、カンを前方へ跳ねさせられる。", titleJpEn: "Trick Shot (Neutral Special)", textJpEn: "Kicks a can that explodes on contact with an opponent, then fires at it by pressing the button. Shooting it makes the can bounce forward.", titlePt: "Trick Shot (Especial Neutro)", textPt: "Chuta uma lata que explode ao entrar em contato com um adversário, e então atira nela apertando o botão. Atirar nela faz a lata quicar para frente." },
  { titleEn: "[★☆☆] Risks with Trick Shot (Neutral Special)", titleJp: "トリックショットのリスク 【通常必殺ワザ】", textJp: "カンがダックハントの近くにある時に第三者からの射撃を行うと、ダックハントが目をふさいでふせてしまうため、スキができてしまう。", titleJpEn: "The Risk of Trick Shot (Neutral Special)", textJpEn: "If the can is shot by a third party while it's near Duck Hunt, the duo covers their eyes and crouches down, creating an opening.", titlePt: "O Risco do Trick Shot (Especial Neutro)", textPt: "Se a lata for atingida por um terceiro enquanto está perto do Duck Hunt, a dupla cobre os olhos e se agacha, criando uma abertura." },
  { titleEn: "[★★☆] Trick Shot Anytime (Neutral Special)", titleJp: "いつでもトリックショット 【通常必殺ワザ】", textJp: "相手をつかんだり、相手につかまれている間や、ダックジャンプを使用している途中でも第三者からの射撃でカンを撃つことはできる。", titleJpEn: "Trick Shot Anytime (Neutral Special)", textJpEn: "The can can still be shot by a third party even while grabbing an opponent, being grabbed, or in the middle of using Duck Jump.", titlePt: "Trick Shot a Qualquer Momento (Especial Neutro)", textPt: "A lata ainda pode ser atingida por um terceiro mesmo enquanto agarra um adversário, é agarrado, ou está no meio do uso do Duck Jump." },
  { titleEn: "[★☆☆] Trick Shot Techniques (Neutral Special)", titleJp: "トリックショットのテクニック 【通常必殺ワザ】", textJp: "カンは必殺ワザボタンでの射撃のほか、攻撃を当てて動かすこともできる。遠くからぶつけたり、カンと一緒に攻め込んだりと、さまざまな使い方がある。", titleJpEn: "Trick Shot Techniques (Neutral Special)", textJpEn: "Besides shooting it with the special move button, the can can also be moved by hitting it with other attacks. There are various ways to use it, such as ramming it from a distance or advancing alongside it.", titlePt: "As Técnicas do Trick Shot (Especial Neutro)", textPt: "Além de atirar nela com o botão de golpe especial, a lata também pode ser movida ao ser atingida por outros ataques. Há várias formas de usá-la, como acertá-la à distância ou avançar junto com ela." },
  { titleEn: "[★☆☆] Clay Shooting (Side Special)", titleJp: "クレー射撃 【横必殺ワザ】", textJp: "はじき入力で、クレーを投げる速度が変わる。ボタンを押せばガンマンが射撃し、クレーにヒットすれば近くの相手にダメージ。", titleJpEn: "Clay Shooting (Side Special)", textJpEn: "A flick input changes the speed at which the clay pigeon is thrown. Pressing the button makes the gunman fire, and if he hits the clay pigeon, it damages nearby opponents.", titlePt: "Clay Shooting (Especial Lateral)", textPt: "Um input de flick muda a velocidade em que o prato de argila é arremessado. Apertar o botão faz o atirador disparar, e se ele acertar o prato, isso causa dano em adversários próximos." },
  { titleEn: "[★☆☆] Duck Jump (Up Special)", titleJp: "ダックジャンプ 【上必殺ワザ】", textJp: "カモがイヌを持ち上げながら上昇するが、着地まで無防備になる。上昇後少し経てば、攻撃や空中回避でキャンセルできる。", titleJpEn: "Duck Jump (Up Special)", textJpEn: "The duck rises while carrying the dog, but they're left defenseless until landing. After a bit of time has passed since rising, it can be canceled with an attack or a midair dodge.", titlePt: "Duck Jump (Especial Cima)", textPt: "O pato sobe enquanto carrega o cachorro, mas ficam indefesos até pousar. Depois de um pouco de tempo desde a subida, pode ser cancelado com um ataque ou uma esquiva aérea." },
  { titleEn: "[★☆☆] Wild Gunman (Down Special)", titleJp: "ワイルドガンマン 【下必殺ワザ】", textJp: "ドット絵のガンマンが出現して前方に銃を撃つ。出現するガンマンはランダムで、種類によって性能が違う。", titleJpEn: "Wild Gunman (Down Special)", textJpEn: "A pixel-art gunman appears and fires his gun forward. The gunman that appears is random, and each type has different performance.", titlePt: "Wild Gunman (Especial Baixo)", textPt: "Um atirador em pixel art aparece e dispara sua arma para frente. O atirador que aparece é aleatório, e cada tipo tem um desempenho diferente." },
  { titleEn: "[★★☆] Defeated Wild Gunman (Down Special)", titleJp: "ワイルドガンマンのやられ 【下必殺ワザ】", textJp: "ガンマン達は一定のダメージを受けるとやられてしまう。黒服は上半身を、ノッポは下半身を攻撃されると、専用のやられ演出になる。", titleJpEn: "Defeating a Wild Gunman (Down Special)", textJpEn: "The gunmen go down after taking a certain amount of damage. Hitting the one in black on his upper body, or the lanky one on his lower body, triggers a unique defeat animation.", titlePt: "Derrotando o Wild Gunman (Especial Baixo)", textPt: "Os atiradores caem depois de receber uma certa quantidade de dano. Acertar o de terno preto na parte superior do corpo, ou o magricela na parte inferior, aciona uma animação de derrota exclusiva." },
  { titleEn: "[★☆☆] Wild Gunman Order (Down Special)", titleJp: "ワイルドガンマンの順番 【下必殺ワザ】", textJp: "順番はランダムだが、５人全員が登場するまで、同じガンマンは出ない。登場したガンマンを４人目まで覚えておけば、次のガンマンがわかる。", titleJpEn: "Wild Gunman's Order (Down Special)", textJpEn: "The order is random, but the same gunman won't appear again until all five have shown up. If you remember the first four that appeared, you'll know who the next one will be.", titlePt: "A Ordem do Wild Gunman (Especial Baixo)", textPt: "A ordem é aleatória, mas o mesmo atirador não aparece novamente até que todos os cinco tenham surgido. Se você lembrar dos primeiros quatro que apareceram, saberá quem será o próximo." },
  { titleEn: "[★★★] Wild Gunman Attack Power (Down Special)", titleJp: "ワイルドガンマンの攻撃力 【下必殺ワザ】", textJp: "攻撃力は、ソンブレロ＞ボス＞黒服＞ノッポ＝ヒゲの順に高い。ヒゲは、射撃するまでに時間がかかるけれど、攻撃力は特に強くない。", titleJpEn: "Wild Gunman's Attack Power (Down Special)", textJpEn: "Attack power, from highest to lowest: sombrero guy, boss, guy in black, then a tie between the lanky one and the bearded one. The bearded one takes a while to fire, but his attack power isn't especially strong.", titlePt: "O Poder de Ataque do Wild Gunman (Especial Baixo)", textPt: "Poder de ataque, do maior para o menor: o de sombrero, o chefe, o de terno preto, e depois um empate entre o magricela e o barbudo. O barbudo demora para atirar, mas seu poder de ataque não é especialmente forte." },
  { titleEn: "[★★★] Wild Gunman Range (Down Special)", titleJp: "ワイルドガンマンの射程 【下必殺ワザ】", textJp: "射程距離は、ノッポ＞ボス＝黒服＝ヒゲ＞ソンブレロの順に長い。ソンブレロは、攻撃力が少し高い分、射程距離が短い。", titleJpEn: "Wild Gunman's Range (Down Special)", textJpEn: "Range, from longest to shortest: the lanky one, then a tie between the boss, the guy in black, and the bearded one, then the sombrero guy. The sombrero guy's shorter range makes up for his slightly higher attack power.", titlePt: "O Alcance do Wild Gunman (Especial Baixo)", textPt: "Alcance, do maior para o menor: o magricela, depois um empate entre o chefe, o de terno preto e o barbudo, e depois o de sombrero. O alcance menor do de sombrero compensa seu poder de ataque um pouco maior." },
  { titleEn: "[★★★] Wild Gunman Speed (Down Special)", titleJp: "ワイルドガンマンのスピード 【下必殺ワザ】", textJp: "射撃するまでの時間は、ボス＞黒服＞ソンブレロ＞ヒゲ＞ノッポの順に短い。ボスは、他の能力も平均的に高く、その名に恥じない実力。", titleJpEn: "Wild Gunman's Speed (Down Special)", textJpEn: "Time to fire, from shortest to longest: the boss, the guy in black, the sombrero guy, the bearded one, then the lanky one. The boss also has above-average stats across the board, living up to his name.", titlePt: "A Velocidade do Wild Gunman (Especial Baixo)", textPt: "Tempo até atirar, do menor para o maior: o chefe, o de terno preto, o de sombrero, o barbudo, e depois o magricela. O chefe também tem atributos acima da média em geral, fazendo jus ao nome." },
  { titleEn: "[★☆☆] NES Zapper Posse (Final Smash)", titleJp: "光線銃セット 【最後の切りふだ】", textJp: "『ダックハント』に加えて『ワイルドガンマン』、『ホーガンズアレイ』と、光線銃シリーズが勢ぞろいする。", titleJpEn: "Light Gun Series Set (Final Smash)", textJpEn: "In addition to \"Duck Hunt,\" the entire Light Gun Series lineup gathers together, including \"Wild Gunman\" and \"Hogan's Alley.\"", titlePt: "NES Zapper Posse (Final Smash)", textPt: "Além de \"Duck Hunt\", toda a formação da Light Gun Series se reúne, incluindo \"Wild Gunman\" e \"Hogan's Alley\"." },
  { titleEn: "[★☆☆] Zapper (Side Smash)", titleJp: "ザッパー 【横スマッシュ攻撃】", textJp: "ためて攻撃をすると、少しだけリーチが伸びる。届かないと油断しているファイターに、不意打ちで当てることもできる。", titleJpEn: "Zapper (Side Smash Attack)", textJpEn: "Charging the attack extends its reach a bit. It can catch fighters off guard who think it won't reach them.", titlePt: "Zapper (Ataque Smash Lateral)", textPt: "Carregar o ataque estende um pouco seu alcance. Isso pode pegar de surpresa lutadores que acham que ele não vai alcançá-los." },
  { titleEn: "[★☆☆] Wild Duck (Up Air Attack)", titleJp: "暴れダック 【上空中攻撃】", textJp: "上方向に、カモが３回クチバシで突く。最後のひと突きは大きくふっとばすので、トドメに使いやすい。", titleJpEn: "Wild Duck (Up Air Attack)", textJpEn: "The duck pecks upward three times with its beak. The final peck launches with great force, making it easy to use as a finisher.", titlePt: "Wild Duck (Ataque Aéreo Cima)", textPt: "O pato bica para cima três vezes com o bico. A última bicada arremessa com grande força, tornando fácil usá-la como finalizador." },
  { titleEn: "[★☆☆] Can and Clay Pigeons", titleJp: "クレーとカンの共存", textJp: "クレーが飛んでいる時は、トリックショットのカンを出すことができない。逆に、カンを出した後ならば、クレーを出せる。", titleJpEn: "Cans and Clay Pigeons Coexisting", textJpEn: "While the clay pigeon is flying, Trick Shot's can cannot be brought out. Conversely, once the can has been brought out, the clay pigeon can be used.", titlePt: "A Coexistência de Cans e Clay Pigeons", textPt: "Enquanto o clay pigeon está voando, a lata do Trick Shot não pode ser convocada. Por outro lado, depois que a lata é convocada, o clay pigeon pode ser usado." },
];

async function main() {
  const duckHunt = await db.fighter.findFirst({
    where: { name: "Duck Hunt" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!duckHunt) { console.log("Duck Hunt not found"); return; }

  await db.fighter.update({
    where: { id: duckHunt.id },
    data: {
      curatorOverviewEn: "Duck Hunt fights as a duo built around ricocheting projectiles rather than direct engagement — Trick Shot and Clay Shooting both let a well-timed follow-up shot deal bonus damage to anyone standing near the can or the clay pigeon, rewarding smart positioning over raw aggression. Wild Gunman summons one of five randomized silhouettes with wildly different speed, range, and power, giving Duck Hunt genuine unpredictability as a projectile. Duck Jump offers height and horizontal control for recovery, though the duo is left completely exposed while airborne. It's a fighter built on midrange trickery and reading opponents' positioning rather than one with a single dominant tool, making patience and spacing far more valuable than raw stats.",
      curatorOverviewPt: "Duck Hunt luta como uma dupla construída em torno de projéteis com ricochete em vez de confronto direto — Trick Shot e Clay Shooting permitem que um tiro de acompanhamento bem cronometrado cause dano extra em qualquer um perto da lata ou do prato de argila, recompensando um bom posicionamento em vez de agressividade pura. Wild Gunman convoca uma de cinco silhuetas aleatórias com velocidade, alcance e poder radicalmente diferentes, dando ao Duck Hunt uma imprevisibilidade genuína como projétil. Duck Jump oferece altura e controle horizontal para recuperação, embora a dupla fique completamente exposta enquanto está no ar. É um lutador construído em torno de truques de médio alcance e leitura do posicionamento do adversário, em vez de ter uma única ferramenta dominante, tornando paciência e posicionamento muito mais valiosos do que atributos brutos.",
      curatorOverviewJp: "ダックハントは、直接対決ではなく跳ね返る飛び道具を軸に組み立てられたデュオとして戦う――「トリックショット」と「クレー射撃」は、どちらもタイミングの良い追撃射撃によって、カンやクレーの近くにいる相手にボーナスダメージを与えられ、無闇な攻めよりも賢い位置取りに応える。「ワイルドガンマン」は速度・射程・攻撃力が大きく異なる５種類のシルエットからランダムに１体を呼び出し、飛び道具としての本物の予測不能性をダックハントに与える。「ダックジャンプ」は復帰のための高さと横方向の制御を提供するが、空中にいる間、デュオは完全に無防備になる。単一の突出した武器を持つファイターというより、中距離でのトリックと相手の位置取りの読みを軸に組み立てられたファイターであり、生のステータスよりも忍耐と間合い管理がはるかに重要になる。",
      curatorOverviewJpEn: "Duck Hunt fights as a duo built around ricocheting projectiles rather than direct confrontation — both Trick Shot and Clay Shooting let a well-timed follow-up shot deal bonus damage to anyone near the can or clay pigeon, rewarding smart positioning over reckless aggression. Wild Gunman randomly calls forth one of five silhouettes with wildly different speed, range, and attack power, giving Duck Hunt real unpredictability as a projectile. Duck Jump provides height and horizontal control for recovery, though the duo is left completely defenseless while in the air. Rather than a fighter with one standout weapon, it's built around midrange trickery and reading an opponent's positioning, making patience and spacing far more valuable than raw stats.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = duckHunt.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = duckHunt.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Duck Jump\" is an Up Special where the duck flies while grabbing the dog by the rear, which is quite endearing. It rises high and is easy to steer left and right, making it useful for recovery. Duck Hunt's side smash attack can also strike a rival a short distance away thanks to a third-party gunshot, and can hit up to three times when at point-blank range. Charging it further extends its range. (FC) Duck Hunt (1984/04)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Duck Jump\" é um especial de cima no qual o pato voa segurando o cachorro pela traseira, o que é bem adorável. Ele sobe alto e é fácil de guiar para a esquerda e direita, sendo útil para recuperação. O ataque smash lateral do Duck Hunt também pode atingir um rival a uma curta distância graças a um tiro de terceiros, e pode acertar até três vezes à queima-roupa. Carregá-lo estende ainda mais seu alcance. (FC) Duck Hunt (1984/04)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = duckHunt.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fix (usuário via VLC): WiiU 1:57:04-1:57:15 = 7024-7035 no troféu principal
  const main = await db.collectible.findFirst({ where: { name: "Duck Hunt", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (main) {
    await db.collectible.update({ where: { id: main.id }, data: { videoStartSec: 7024, videoEndSec: 7035 } });
    console.log(`✅ Trophy "Duck Hunt" [SSB4]: vídeo WiiU corrigido 7024-7035 (era ${main.videoStartSec}-${main.videoEndSec})`);
  }

  await db.$disconnect();
}
main().catch(console.error);
