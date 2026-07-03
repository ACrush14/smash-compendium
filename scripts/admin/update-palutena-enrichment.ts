import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBB: {
    jpEn: "The goddess who rules Angel Land. She governs light, and had been shining it down so that humans could live happily. However, when she banished the other goddess Medusa, who brought misfortune to mankind, to the underworld, war broke out between Palutena and Medusa. Palutena was captured by Medusa and imprisoned deep within a temple. She gave a bow and arrow to her royal guard Pit, entrusting him with the hope of defeating Medusa.",
    pt: "A deusa que governa Angel Land. Palutena banhava a terra com raios de luz, usando seus poderes para o bem da humanidade. Mas Medusa, que por seu ódio à humanidade foi banida para o submundo, declara guerra contra Palutena e vence, capturando e mantendo a deusa presa nas profundezas de um templo. Palutena confia a Pit um arco sagrado e a missão de derrotar Medusa.",
  },
  SSB4: {
    jpEn: "In \"Kid Icarus: Uprising,\" she is the goddess of light who communicates with Pit via telepathy and supports him in battle with a power called \"Miracles.\" In \"Super Smash Bros.,\" she wields a variety of special moves such as \"Teleport\" and \"Heavenly Light.\" Depending on which special moves are chosen through customization, she can become a fighter specialized for anything from close range to long range.",
    pt: "Em Kid Icarus: Uprising, a deusa da luz usa telepatia para se comunicar e concede milagres para apoiar Pit em sua aventura. Em Smash Bros., ela tem à disposição golpes especiais como Warp e Heavenly Light. Ela é muito adaptável — você pode personalizá-la para ser uma lutadora de longo ou curto alcance!",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Palutena's Origins", titleJp: "パルテナの初登場作品", textJp: "パルテナの初登場作品は、１９８６年発売の『光神話 パルテナの鏡』。当時はエンディングの１カットのみの出演だった。", titleJpEn: "Palutena's Debut Work", textJpEn: "Palutena's debut work is 1986's \"Kid Icarus: Of Myths and Monsters\" (Hikari Shinwa: Palutena no Kagami). At the time, she only appeared in a single cut of the ending.", titlePt: "As Origens da Palutena", textPt: "O trabalho de estreia da Palutena é \"Kid Icarus\", lançado em 1986. Na época, ela apareceu apenas em um único corte do final do jogo." },
  { titleEn: "[★☆☆] In Her Series", titleJp: "原作では", textJp: "『パルテナの鏡』における、天界「エンジェランド」を統治する女神。ピットが仕える存在で、「光の女神」とも呼ばれる人間の守護神。", titleJpEn: "In the Original Games", textJpEn: "In \"Kid Icarus,\" she is the goddess who rules over the heavenly realm of Angel Land. Pit serves her, and she is also known as the \"Goddess of Light,\" the guardian deity of humankind.", titlePt: "Na Série Original", textPt: "Em \"Kid Icarus\", ela é a deusa que governa o reino celestial de Angel Land. Pit a serve, e ela também é conhecida como a \"Deusa da Luz\", a divindade guardiã da humanidade." },
  { titleEn: "[★☆☆] Explosive Flame (Side Special)", titleJp: "爆炎 【横必殺ワザ】", textJp: "少し離れた場所に爆発を発生させる。近くにいる相手を巻き込みながら連続ヒットし、最後に大きくふっとばす。", titleJpEn: "Explosive Flame (Side Special)", textJpEn: "Causes an explosion a short distance away. It hits any opponents caught nearby multiple times before finally launching them a great distance.", titlePt: "Explosive Flame (Especial Lateral)", textPt: "Causa uma explosão a uma curta distância. Acerta múltiplas vezes quaisquer adversários próximos antes de finalmente lançá-los a uma grande distância." },
  { titleEn: "[★★☆] Explosive Flame Positioning (Side Special)", titleJp: "爆炎の位置 【横必殺ワザ】", textJp: "はじき入力でワザを出すと、爆炎がより遠くに出現。相手との距離をよく見て、的確な位置に爆炎を起こそう。", titleJpEn: "Explosive Flame's Position (Side Special)", textJpEn: "Using a flick input for the move makes the explosion appear farther away. Watch the distance to the opponent carefully and try to trigger the explosion at the right spot.", titlePt: "A Posição do Explosive Flame (Especial Lateral)", textPt: "Usar um input de flick para o golpe faz a explosão aparecer mais longe. Observe bem a distância até o adversário e tente causar a explosão no local certo." },
  { titleEn: "[★☆☆] Warp (Up Special)", titleJp: "テレポート 【上必殺ワザ】", textJp: "姿を消して、少し離れた位置にワープする。ワープする直前に方向入力すれば、移動方向を調節できる。", titleJpEn: "Teleport (Up Special)", textJpEn: "Disappears and warps to a spot a short distance away. Inputting a direction right before warping allows the direction of movement to be adjusted.", titlePt: "Warp (Especial Cima)", textPt: "Desaparece e se teleporta para um local a uma curta distância. Inputar uma direção logo antes de se teleportar permite ajustar a direção do movimento." },
  { titleEn: "[★☆☆] Counter/Reflect Barrier (Down Special)", titleJp: "カウンター / 反射盤 【下必殺ワザ】", textJp: "盾を構え、相手の攻撃にはカウンターを返し、飛び道具は反射盤で跳ね返す。どちらも自動で返すが、カウンターと反射盤は、同時には出せない。", titleJpEn: "Counter / Reflect Barrier (Down Special)", textJpEn: "Raises a shield, countering an opponent's attack or bouncing back a projectile with the reflect barrier. Both happen automatically, but the counter and the reflect barrier can't be used at the same time.", titlePt: "Counter/Reflect Barrier (Especial Baixo)", textPt: "Ergue um escudo, contra-atacando o golpe de um adversário ou rebatendo um projétil com a barreira de reflexo. Ambos acontecem automaticamente, mas o contra-ataque e a barreira de reflexo não podem ser usados ao mesmo tempo." },
  { titleEn: "[★☆☆] Black Hole Laser (Final Smash)", titleJp: "ブラックホール+波動ビーム 【最後の切りふだ】", textJp: "最後の切りふだは、ブラックホールで相手の動きを封じ、ビームで攻撃する。ビームの角度は少しずつ変化し、最後に大きくふっとばす。", titleJpEn: "Black Hole + Wave Beam (Final Smash)", textJpEn: "Her Final Smash seals opponents' movement with a black hole, then attacks with a beam. The beam's angle gradually changes, finally launching them a great distance.", titlePt: "Black Hole Laser (Final Smash)", textPt: "Seu Final Smash prende o movimento dos adversários com um buraco negro e então ataca com um feixe. O ângulo do feixe muda gradualmente, lançando-os por fim a uma grande distância." },
  { titleEn: "[★★☆] Purging Kick (Down Air Attack)", titleJp: "追放キック 【下空中攻撃】", textJp: "メテオ効果を持つワザの中では、かなり素早く出せる。ふっとんでいる相手を狙っていきたいが、スキはそれなりにある。", titleJpEn: "Banishing Kick (Down Air Attack)", textJpEn: "Among moves with a meteor effect, this one comes out quite quickly. While it's tempting to aim it at a launched opponent, it does leave a fair opening.", titlePt: "Purging Kick (Ataque Aéreo Baixo)", textPt: "Entre os golpes com efeito meteoro, este sai bem rápido. Apesar de tentador mirá-lo em um adversário arremessado, ele deixa uma abertura considerável." },
  { titleEn: "[★★☆] Attacks Using a Shield", titleJp: "盾を使った攻撃", textJp: "ダッシュ攻撃と、後空中攻撃で使う盾は、受けた攻撃を無効化できる。相手とワザ同士がぶつかり合っても、まず負けることがない。", titleJpEn: "Attacks Using a Shield", textJpEn: "The shield used in the dash attack and back air attack can nullify attacks it receives. Even if it clashes directly with an opponent's move, it will almost never lose.", titlePt: "Ataques Usando um Escudo", textPt: "O escudo usado no ataque de investida e no ataque aéreo de trás pode anular os ataques que recebe. Mesmo que colida diretamente com o golpe de um adversário, quase nunca perde." },
];

async function main() {
  const palutena = await db.fighter.findFirst({
    where: { name: "Palutena" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!palutena) { console.log("Palutena not found"); return; }

  await db.fighter.update({
    where: { id: palutena.id },
    data: {
      curatorOverviewEn: "Palutena, the Goddess of Light from Kid Icarus, is one of the most customizable fighters in Smash — her real strength lies almost entirely in which special moves the player equips. As a default, Explosive Flame provides solid area denial, Warp offers a safe teleporting recovery, and Counter/Reflect Barrier lets her punish both physical attacks and projectiles in a single stance. Her back air and dash attack are protected by an active shield that nullifies incoming hits outright, letting her win trades she has no business winning. Black Hole Laser is one of the best Final Smashes in the game, trapping and then blasting anyone caught nearby. The tradeoff for all this utility is a fighter with no single standout tool — Palutena rewards players who build a kit suited to their own playstyle rather than following a fixed gameplan.",
      curatorOverviewPt: "Palutena, a Deusa da Luz de Kid Icarus, é uma das lutadoras mais personalizáveis do Smash — sua verdadeira força está quase inteiramente em quais golpes especiais o jogador equipar. Como padrão, Explosive Flame oferece uma boa negação de área, Warp oferece uma recuperação segura por teleporte, e Counter/Reflect Barrier permite punir tanto ataques físicos quanto projéteis em uma única postura. Seu ataque aéreo de trás e ataque de investida são protegidos por um escudo ativo que anula golpes recebidos completamente, permitindo que ela vença trocas que não deveria vencer. Black Hole Laser é um dos melhores Final Smashes do jogo, prendendo e então atacando com um feixe qualquer um por perto. A contrapartida de toda essa versatilidade é uma lutadora sem nenhuma ferramenta única de destaque — Palutena recompensa jogadores que constroem um kit adequado ao próprio estilo de jogo, em vez de seguir um plano fixo.",
      curatorOverviewJp: "『光神話 パルテナの鏡』の光の女神、パルテナは、スマブラの中でも屈指のカスタマイズ性を誇るファイターだ――その真の強さは、プレイヤーがどの必殺ワザを装備するかにほぼ完全に依存している。デフォルトでは、「爆炎」が堅実なエリア制圧を、「テレポート」が安全な瞬間移動復帰を提供し、「カウンター / 反射盤」は一つの構えで物理攻撃と飛び道具の両方を罰することができる。後空中攻撃とダッシュ攻撃は、受けた攻撃を完全に無効化するアクティブな盾で守られており、本来勝てないはずの打ち合いにも勝つことができる。「ブラックホール+波動ビーム」はゲーム屈指の最後の切りふだで、近くにいる相手を封じ込めた後にビームで攻撃する。この万能性の代償は、突出した単一の強みを持たないファイターであることだ――パルテナは、決まった攻略法に従うのではなく、自分自身のプレイスタイルに合った構成を組むプレイヤーに応える。",
      curatorOverviewJpEn: "Palutena, the Goddess of Light from \"Kid Icarus,\" is one of the most customizable fighters in Smash — her true strength depends almost entirely on which special moves the player equips. By default, Explosive Flame provides solid area control, Warp offers a safe teleporting recovery, and Counter/Reflect Barrier lets her punish both physical attacks and projectiles from a single stance. Her back air and dash attack are protected by an active shield that completely nullifies incoming attacks, letting her win exchanges she otherwise shouldn't. Black Hole Laser is one of the best Final Smashes in the game, sealing nearby opponents in place before blasting them with a beam. The price for all this versatility is a fighter with no single standout strength — Palutena rewards players who build a setup suited to their own playstyle rather than following a fixed strategy.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = palutena.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = palutena.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "One of her Side Specials, \"Reflect Barrier,\" creates a panel in front of her that reflects all attacks and projectiles. Unlike the reflecting moves used by other fighters, the barrier stays in place, allowing her to act freely. Since it can push away any opponent who touches the panel, it's effective against opponents recovering near the ledge. Using it while pressed against an opponent also deals damage. (FCD) Kid Icarus (1986/12) (3DS) Kid Icarus: Uprising (2012/03)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "Um de seus golpes especiais laterais, \"Reflect Barrier\", cria um painel à sua frente que reflete todos os ataques e projéteis. Diferente dos golpes de reflexo usados por outros lutadores, a barreira permanece no lugar, permitindo que ela aja livremente. Como pode empurrar qualquer adversário que tocar o painel, é eficaz contra adversários se recuperando perto da borda. Usá-lo enquanto pressionado contra um adversário também causa dano. (FCD) Kid Icarus (1986/12) (3DS) Kid Icarus: Uprising (2012/03)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = palutena.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fix (usuário via VLC): Brawl 2:03:35-2:03:52 = 7415-7432
  const ssbb = await db.collectible.findFirst({ where: { name: "Palutena", type: "TROPHY", smashGameVersion: "SSBB" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbb) {
    await db.collectible.update({ where: { id: ssbb.id }, data: { videoStartSec: 7415, videoEndSec: 7432 } });
    console.log(`✅ Trophy "Palutena" [SSBB]: vídeo corrigido 7415-7432 (era ${ssbb.videoStartSec}-${ssbb.videoEndSec})`);
  }

  // Video fix SSB4: WiiU 1:32:31-1:32:41 = 5551-5561 | 3DS 1:21:04-1:21:15 = 4864-4875
  // videoStartSec2/videoEndSec2 estavam com valores de outra parte do vídeo (6597-6608), corrompidos
  const main = await db.collectible.findFirst({ where: { name: "Palutena", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true } });
  if (main) {
    await db.collectible.update({ where: { id: main.id }, data: { videoStartSec: 5551, videoEndSec: 5561, videoStartSec2: 4864, videoEndSec2: 4875 } });
    console.log(`✅ Trophy "Palutena" [SSB4]: vídeo corrigido WiiU 5551-5561 | 3DS 4864-4875 (era ${main.videoStartSec}-${main.videoEndSec} | ${main.videoStartSec2}-${main.videoEndSec2})`);
  }

  // Alt costume trophy: mesma corrupção no campo 3DS, corrigido por inferência de offset (+14s, igual ao offset do campo WiiU entre principal e Alt.)
  const alt = await db.collectible.findFirst({ where: { name: "Palutena (Alt.)", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (alt) {
    await db.collectible.update({ where: { id: alt.id }, data: { videoStartSec2: 4878, videoEndSec2: 4889 } });
    console.log(`✅ Trophy "Palutena (Alt.)" [SSB4]: videoStartSec2/videoEndSec2 corrigidos para 4878-4889 (era ${alt.videoStartSec2}-${alt.videoEndSec2}, corrompido)`);
  }

  // NOTE: "Pseudo-Palutena" [SSB4_3DS], "Palutena Bow" [SSB4_3DS], "Palutena's Bow" [SSBB] e
  // "Palutena's Temple" [SSB4_WIIU] são intencionalmente NÃO linkados — são itens/arma/palco
  // relacionados, não a própria fighter (mesmo padrão de "Mach Rider" no Little Mac).

  await db.$disconnect();
}
main().catch(console.error);
