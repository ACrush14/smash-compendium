import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "The protagonist of the \"Sonic\" series. His full name is \"Sonic the Hedgehog.\" True to his name, the \"Speed-of-Sound Hedgehog\" excels at running so fast that the shockwave of his dash can sometimes bowl over enemies. His favorite food is a piping-hot chili dog. He enjoys upbeat music like rock and Eurobeat, and also dabbles in DJing and breakdancing.\nAge: 15. Height: 100cm. Weight: 35kg. He has a straightforward personality and hates anything crooked. He can be a bit rough around the edges, but is generally friendly to others. He prefers freedom over following others' orders, and dislikes any suppression of freedom. If the player doesn't move Sonic, he may even hurry the player along — perhaps a bit of impatience born from his speed.",
    pt: "O protagonista da série \"Sonic.\" Seu nome completo é \"Sonic the Hedgehog.\" Fiel ao seu nome, o \"Ouriço da Velocidade do Som\" se destaca por correr tão rápido que a onda de choque de sua disparada às vezes pode derrubar inimigos. Sua comida favorita é um chili dog bem quente. Ele gosta de músicas animadas como rock e Eurobeat, e também se aventura em DJing e breakdance.\nIdade: 15 anos. Altura: 100cm. Peso: 35kg. Ele tem uma personalidade direta e odeia qualquer coisa desonesta. Ele pode ser um pouco rude às vezes, mas geralmente é amigável com os outros. Ele prefere a liberdade a seguir ordens de outros, e não gosta de nenhuma supressão da liberdade. Se o jogador não mover o Sonic, ele pode até apressar o jogador — talvez um pouco de impaciência nascida de sua velocidade.",
  },
  SSBB: {
    jpEn: "The world's fastest supersonic hedgehog. Sonic the Hedgehog. He loves being free and easygoing, and hates anything crooked. Staying still is out of the question. Whatever happens, it's no problem. He's honest to his own sense of justice, and can be a bit short-tempered, but he keeps his promises. He never betrays. He can't leave someone in trouble alone. But he's not too fond of the water.",
    pt: "O ouriço supersônico mais rápido do mundo. Sonic the Hedgehog. Ele adora ser livre e despreocupado, e odeia qualquer coisa desonesta. Ficar parado está fora de questão. Aconteça o que acontecer, não é problema. Ele é honesto com seu próprio senso de justiça, e pode ser um pouco impaciente, mas cumpre suas promessas. Ele nunca trai. Ele não consegue deixar alguém em apuros sozinho. Mas ele não gosta muito de água.",
  },
  SSB4: {
    jpEn: "The star of the \"Sonic the Hedgehog\" series, a supersonic hedgehog. He has a free-spirited, cool personality, but a strong sense of justice. His weakness is that he can't swim. In Smash Bros., his supersonic speed remains intact, making him the fastest runner of all fighters. Use his speed to keep moving and avoid being targeted. His various moves are simple, with ease of use being their appeal.",
    pt: "O astro da série \"Sonic the Hedgehog,\" um ouriço supersônico. Ele tem uma personalidade livre e descolada, mas um forte senso de justiça. Sua fraqueza é não saber nadar. Em Smash Bros., sua velocidade supersônica permanece intacta, tornando-o o corredor mais rápido entre todos os lutadores. Use sua velocidade para continuar se movendo e evitar ser alvejado. Seus vários golpes são simples, com a facilidade de uso sendo seu apelo.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Sonic's Origins", titleJp: "ソニックの初登場作品", textJp: "ソニックの初登場は１９９１年稼働のアーケードレースゲーム『ラッドモビール』。フロントガラス上部にユラユラ揺れるマスコットとして出演している。", titleJpEn: "Sonic's Origins", textJpEn: "Sonic's debut was in the arcade racing game \"Rad Mobile,\" which released in 1991. He appeared as a mascot swaying above the windshield.", titlePt: "As Origens do Sonic", textPt: "O debut do Sonic foi no jogo de corrida arcade \"Rad Mobile,\" lançado em 1991. Ele apareceu como um mascote balançando acima do para-brisa." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "スピード感あふれる、横スクロールアクション『ソニック・ザ・ヘッジホッグ』で初主演。方向ボタンとジャンプボタンのみの、シンプルな操作方法で、高速アクションをくり広げる。", titleJpEn: "In His Series", textJpEn: "He made his starring debut in the speed-filled side-scrolling action game \"Sonic the Hedgehog.\" With simple controls using only the directional buttons and a jump button, he unleashes high-speed action.", titlePt: "Na Série Original", textPt: "Ele fez seu debut como protagonista no jogo de ação de rolagem lateral cheio de velocidade \"Sonic the Hedgehog.\" Com controles simples usando apenas os botões direcionais e um botão de pulo, ele desencadeia ação em alta velocidade." },
  { titleEn: "[★☆☆] Homing Attack (Neutral Special)", titleJp: "ホーミングアタック 【通常必殺ワザ】", textJp: "力をためながらソニックが上昇し、最大までたまると自動で攻撃を行う。途中でボタンを押せばすぐ攻撃するが、相手に当たらないと大きなスキが生まれる。", titleJpEn: "Homing Attack (Neutral Special)", textJpEn: "Sonic rises while charging power, and attacks automatically once fully charged. Pressing the button partway through attacks immediately, but if it doesn't hit an opponent, a large opening is created.", titlePt: "Homing Attack (Especial Neutro)", textPt: "O Sonic sobe enquanto carrega poder, e ataca automaticamente quando totalmente carregado. Apertar o botão no meio ataca imediatamente, mas se não acertar um adversário, uma grande abertura é criada." },
  { titleEn: "[★☆☆] Spin Dash (Side Special)", titleJp: "スピンダッシュ 【横必殺ワザ】", textJp: "地上のスピンダッシュのみ、走り出した直後に短い時間だが無敵になる。うまく狙えば、相手の強力な攻撃を避けつつ反撃することも可能。", titleJpEn: "Spin Dash (Side Special)", textJpEn: "Only the grounded Spin Dash grants brief invincibility right after starting to run. Timed well, it can be used to dodge a powerful attack while countering.", titlePt: "Spin Dash (Especial Lateral)", textPt: "Apenas o Spin Dash no chão concede breve invencibilidade logo depois de começar a correr. Bem cronometrado, pode ser usado para esquivar de um ataque poderoso enquanto contra-ataca." },
  { titleEn: "[★★☆] Spring Jump (Up Special)", titleJp: "スプリングジャンプ 【上必殺ワザ】", textJp: "空中で出すとスプリングが落ちて、下の相手に攻撃できる。復帰しながら相手のジャマをすることができる。", titleJpEn: "Spring Jump (Up Special)", textJpEn: "Using it in the air drops the spring, allowing it to attack opponents below. He can interfere with opponents while recovering.", titlePt: "Spring Jump (Especial Cima)", textPt: "Usá-lo no ar derruba a mola, permitindo atacar adversários abaixo. Ele pode atrapalhar adversários enquanto se recupera." },
  { titleEn: "[★★☆] Spring Jump Care (Up Special)", titleJp: "スプリングジャンプの注意点 【上必殺ワザ】", textJp: "スプリングで跳ねた後も、攻撃や回避をすることができる。ただし、空中ジャンプや各必殺ワザは使うことができない。", titleJpEn: "Spring Jump Care (Up Special)", textJpEn: "After bouncing off the spring, he can still attack or dodge. However, air jumps and special moves can't be used.", titlePt: "Cuidados com o Spring Jump (Especial Cima)", textPt: "Depois de quicar na mola, ele ainda pode atacar ou esquivar. Porém, pulos aéreos e golpes especiais não podem ser usados." },
  { titleEn: "[★★☆] Spin Charge (Down Special)", titleJp: "スピンチャージ 【下必殺ワザ】", textJp: "突進中にジャンプ入力をすると、スピンしたままはねる。そのまま相手を攻撃したり、ほかの攻撃を出すことも可能。", titleJpEn: "Spin Charge (Down Special)", textJpEn: "Inputting jump during the charge makes him bounce while still spinning. He can attack opponents directly this way, or use other attacks.", titlePt: "Spin Charge (Especial Baixo)", textPt: "Inputar pulo durante o avanço o faz quicar enquanto ainda gira. Ele pode atacar adversários diretamente dessa forma, ou usar outros ataques." },
  { titleEn: "[★★☆] Boosting Spin Charge (Down Special)", titleJp: "スピンチャージの威力アップ 【下必殺ワザ】", textJp: "ワザの発生時、下方向に入力しながらボタンを連打すると、与えるダメージと移動スピードがアップする。", titleJpEn: "Boosting Spin Charge (Down Special)", textJpEn: "When the move activates, mashing the button while inputting downward increases both damage dealt and movement speed.", titlePt: "Potencializando o Spin Charge (Especial Baixo)", textPt: "Quando o golpe é ativado, apertar o botão repetidamente enquanto inputa para baixo aumenta tanto o dano causado quanto a velocidade de movimento." },
  { titleEn: "[★★☆] Spin Charge Care (Down Special)", titleJp: "スピンチャージの注意点 【下必殺ワザ】", textJp: "ためている途中にジャンプを入力すると、スピンジャンプを行える。空中ジャンプをした後は、一旦着地するまでスピンジャンプが使えない。", titleJpEn: "Spin Charge Care (Down Special)", textJpEn: "Inputting jump while charging lets him perform a spin jump. After using an air jump, the spin jump can't be used again until he lands.", titlePt: "Cuidados com o Spin Charge (Especial Baixo)", textPt: "Inputar pulo enquanto carrega permite realizar um spin jump. Depois de usar um pulo aéreo, o spin jump não pode ser usado novamente até pousar." },
  { titleEn: "[★☆☆] Super Sonic (Final Smash)", titleJp: "スーパーソニック 【最後の切りふだ】", textJp: "スーパーソニックとなり、絶え間なく高速体当たりを続ける。変身が終わった瞬間にも、近くにいる相手をふっとばす効果がある。", titleJpEn: "Super Sonic (Final Smash)", textJpEn: "He becomes Super Sonic and continuously performs high-speed body checks. The moment the transformation ends also has the effect of launching nearby opponents.", titlePt: "Super Sonic (Final Smash)", textPt: "Ele se torna Super Sonic e realiza continuamente investidas corporais em alta velocidade. O momento em que a transformação termina também tem o efeito de arremessar adversários próximos." },
  { titleEn: "[★★★] Shooting Star Kick (Down Air Attack)", titleJp: "流星キック 【下空中攻撃】", textJp: "地上からジャンプ、スプリングジャンプと連続で使った後に下空中攻撃を出すなどして、ワザの後半に着地すると、スキが少し減る。", titleJpEn: "Shooting Star Kick (Down Air Attack)", textJpEn: "Landing during the latter half of the move, such as by using it after a jump and Spring Jump in succession from the ground, slightly reduces the opening.", titlePt: "Shooting Star Kick (Ataque Aéreo Baixo)", textPt: "Pousar durante a segunda metade do golpe, como usá-lo após um pulo e um Spring Jump em sequência a partir do chão, reduz um pouco a abertura." },
  { titleEn: "[★☆☆] The Three Fastest Fighters", titleJp: "走行速度ランキングBEST３", textJp: "走行速度ランキングBEST３。１位は「ソニック」、２位は「C・ファルコン」、３位は「リトル・マック」。逆に、もっとも遅いのは「ガオガエン」。", titleJpEn: "The Three Fastest Fighters", textJpEn: "Top 3 Running Speed Rankings. 1st place is \"Sonic,\" 2nd is \"Captain Falcon,\" and 3rd is \"Little Mac.\" On the other hand, the slowest is \"Incineroar.\"", titlePt: "Os Três Lutadores Mais Rápidos", textPt: "Ranking dos 3 lutadores mais rápidos. O 1º lugar é o \"Sonic,\" o 2º é o \"Captain Falcon,\" e o 3º é o \"Little Mac.\" Por outro lado, o mais lento é o \"Incineroar.\"" },
];

async function main() {
  const sonic = await db.fighter.findFirst({
    where: { name: "Sonic" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!sonic) { console.log("Sonic not found"); return; }

  await db.fighter.update({
    where: { id: sonic.id },
    data: {
      curatorOverviewEn: "Sonic, the fastest fighter in Smash by a wide margin, wins through relentless movement — Spin Dash grants brief invincibility on activation, Homing Attack tracks down evasive opponents, and Spring Jump provides flexible vertical recovery with an aerial variant that harasses opponents below. His raw ground speed lets him dictate pace and bait mistakes before most fighters can react. Fragile and commitment-punished when he whiffs, Sonic rewards players who use speed to control neutral rather than trading blows head-on.",
      curatorOverviewPt: "Sonic, o lutador mais rápido do Smash por uma margem enorme, vence através de movimento incessante — Spin Dash concede breve invencibilidade ao ativar, Homing Attack persegue adversários evasivos, e Spring Jump oferece uma recuperação vertical flexível com uma variante aérea que atrapalha adversários abaixo. Sua velocidade bruta no chão permite ditar o ritmo e provocar erros antes que a maioria dos lutadores consiga reagir. Frágil e punido quando erra um compromisso, o Sonic recompensa jogadores que usam a velocidade para controlar o neutro em vez de trocar golpes de frente.",
      curatorOverviewJp: "スマブラで圧倒的に最速のファイター、ソニックは絶え間ない動きで勝利をつかむ――スピンダッシュは発動時に短い無敵を得られ、ホーミングアタックは回避的な相手を追跡し、スプリングジャンプは下にいる相手を妨害する空中バリエーションを持つ柔軟な縦の復帰を提供する。地上での生の速さにより、ほとんどのファイターが反応できるより先にペースを支配しミスを誘発できる。脆く、空振りすると罰せられるソニックは、真正面から打ち合うのではなく速さで中距離戦を制するプレイヤーに応える。",
      curatorOverviewJpEn: "Sonic, by far the fastest fighter in Smash, wins through relentless movement — Spin Dash grants brief invincibility upon activation, Homing Attack tracks down evasive opponents, and Spring Jump offers flexible vertical recovery with an aerial variant that harasses opponents below. His raw ground speed lets him dictate the pace and bait out mistakes before most fighters can react. Fragile and punished for committing to whiffed moves, Sonic rewards players who use speed to control the mid-range rather than trading blows head-on.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = sonic.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = sonic.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Spring Jump,\" delivered as the up special, is a move that lets him bounce on a spring to jump high into the air. He becomes invincible for a short time right after the jump begins. Special moves can't be used while jumping, but regular moves and dodges can. It's useful not just for recovery, but also for escaping chaotic scrambles. This spring can also be used by rivals. Sonic the Hedgehog (1991/07) (Wii) Sonic Lost World (2013/10)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Spring Jump,\" entregue como o especial cima, é um golpe que permite quicar em uma mola para pular bem alto no ar. Ele fica invencível por um curto tempo logo depois que o pulo começa. Golpes especiais não podem ser usados durante o pulo, mas golpes normais e esquivas podem. É útil não só para recuperação, mas também para escapar de confusões caóticas. Essa mola também pode ser usada por rivais. Sonic the Hedgehog (1991/07) (Wii) Sonic Lost World (2013/10)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = sonic.tips.find(t => t.titleEn === data.titleEn);
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

  // Rename orphaned "Sonic the Hedgehog Sonic" -> "Sonic" (the real main trophy, garbled name from scraping),
  // link fighterId, apply user's WiiU/3DS video timing
  const mainTrophy = await db.collectible.findFirst({ where: { name: "Sonic the Hedgehog Sonic", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true } });
  if (mainTrophy) {
    await db.collectible.update({
      where: { id: mainTrophy.id },
      data: { name: "Sonic", fighterId: sonic.id, videoStartSec: 7701, videoEndSec: 7712, videoStartSec2: 7048, videoEndSec2: 7058 },
    });
    console.log("✅ \"Sonic the Hedgehog Sonic\" renomeado para \"Sonic\", linkado, vídeo -> WiiU 7701-7712, 3DS 7048-7058");
  }

  // Link + normalize "Metal Sonic" [SSB4_3DS]
  const metalSonic = await db.collectible.findFirst({ where: { name: "Metal Sonic", smashGameVersion: "SSB4_3DS" }, select: { id: true } });
  if (metalSonic) {
    await db.collectible.update({ where: { id: metalSonic.id }, data: { smashGameVersion: "SSB4", fighterId: sonic.id } });
    console.log("✅ \"Metal Sonic\": normalizado SSB4, linkado");
  }

  // Link + normalize "Super Sonic" [SSB4_WIIU] — no conflict, exact-name "Sonic" wins mainTrophyWithVideo for SSB4
  const superSonicWiiU = await db.collectible.findFirst({ where: { name: "Super Sonic", smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
  if (superSonicWiiU) {
    await db.collectible.update({ where: { id: superSonicWiiU.id }, data: { smashGameVersion: "SSB4", fighterId: sonic.id } });
    console.log("✅ \"Super Sonic\" [SSB4_WIIU]: normalizado SSB4, linkado");
  }

  // Link "Super Sonic" [SSBB] — clear video to avoid conflict (no exact-name "Sonic" trophy exists in SSBB era; main SSBB trophy is named "Sonic The Hedgehog")
  const superSonicSSBB = await db.collectible.findFirst({ where: { name: "Super Sonic", smashGameVersion: "SSBB" }, select: { id: true } });
  if (superSonicSSBB) {
    await db.collectible.update({ where: { id: superSonicSSBB.id }, data: { fighterId: sonic.id, videoStartSec: null, videoEndSec: null } });
    console.log("✅ \"Super Sonic\" [SSBB]: linkado, vídeo limpo (evita conflito com \"Sonic The Hedgehog\" já vinculado)");
  }

  await db.$disconnect();
}
main().catch(console.error);
