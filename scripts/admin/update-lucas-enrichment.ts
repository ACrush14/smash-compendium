import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "One of the protagonists of \"MOTHER3.\" A great fire that struck the forest near the peaceful village of Tazumily, along with the tragedy that befell Lucas's family living in the village, led to the death of Lucas's mother, Hinawa, while his twin brother Claus went missing, and his father Flint spent his days doing nothing but searching for Claus — the family was torn apart in a heartbreaking way. The village was also gradually absorbed by the \"Pigmask Army,\" led by the enemy \"King P,\" and three years later (from Chapter 4 onward), no trace of the peaceful village remained, having become fully modernized. The forest became overrun with Chimeras created by the army, which began attacking people.",
    pt: "Um dos protagonistas de \"MOTHER3.\" Um grande incêndio que atingiu a floresta perto da pacífica vila de Tazumily, junto com a tragédia que abateu a família do Lucas que vivia na vila, levou à morte da mãe do Lucas, Hinawa, enquanto seu irmão gêmeo Claus desapareceu, e seu pai Flint passou seus dias sem fazer nada além de procurar por Claus — a família foi despedaçada de forma dolorosa. A vila também foi gradualmente absorvida pelo \"Exército Pigmask,\" liderado pelo inimigo \"Rei P,\" e três anos depois (a partir do Capítulo 4), nenhum vestígio da vila pacífica restou, tendo se tornado totalmente modernizada. A floresta ficou dominada por Quimeras criadas pelo exército, que passaram a atacar pessoas.",
  },
  SSBB: {
    jpEn: "The younger twin son of Flint, living in Tazumily Village on the Nowhere Islands. He has a kind heart and can communicate with animals. On the other hand, he's shy by nature, and there was a period when he did nothing but cry because of the tragedy that struck his family. Through an adventure involving the changing nature of happiness on the Nowhere Islands, the Needles of the world, and his missing brother Claus, the boy grows up.",
    pt: "O filho gêmeo mais novo do Flint, vivendo na Vila Tazumily nas Ilhas Nowhere. Ele tem um coração gentil e pode se comunicar com animais. Por outro lado, ele é tímido por natureza, e houve um período em que ele não fazia nada além de chorar por causa da tragédia que abateu sua família. Através de uma aventura envolvendo a natureza mutável da felicidade nas Ilhas Nowhere, as Agulhas do mundo, e seu irmão desaparecido Claus, o garoto amadurece.",
  },
  SSB4: {
    jpEn: "Lucas, who was once weak-hearted and did nothing but cry. But having overcome unimaginable hardships, he must still be enjoying an adventure somewhere even now. Or perhaps he's met a good partner and started a family... no, no, that might be a bit too soon to say. For fans of the \"MOTHER\" series, both Lucas and Ness might just be eternal boys.",
    pt: "Lucas, que antes era fraco de coração e não fazia nada além de chorar. Mas tendo superado dificuldades inimagináveis, ele deve ainda estar curtindo uma aventura em algum lugar até hoje. Ou talvez ele tenha encontrado uma boa parceira e formado uma família... não, não, talvez seja um pouco cedo para dizer isso. Para os fãs da série \"MOTHER,\" tanto o Lucas quanto o Ness podem ser eternos garotos.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『MOTHER3』の主人公。父母と双子の兄「クラウス」と、タツマイリ村で暮らしていたが、火事をきっかけに、悲劇に巻き込まれてしまう。超能力PSIを使い、冒険へと旅立つ。", titleJpEn: "In His Series", textJpEn: "The protagonist of \"MOTHER3.\" He lived in Tazumily Village with his parents and his twin brother, Claus, but a fire triggers a tragedy that engulfs them. He sets off on an adventure using the psychic power PSI.", titlePt: "Na Série Original", textPt: "O protagonista de \"MOTHER3.\" Ele vivia na Vila Tazumily com seus pais e seu irmão gêmeo, Claus, mas um incêndio desencadeia uma tragédia que os envolve. Ele parte em uma aventura usando o poder psíquico PSI." },
  { titleEn: "[★☆☆] PK Freeze's Traits (Neutral Special)", titleJp: "PKフリーズの特性 【通常必殺ワザ】", textJp: "撃ち出した弾で相手を氷づけにできる。復帰の阻止に使うと効果が大きい。", titleJpEn: "PK Freeze's Traits (Neutral Special)", textJpEn: "The fired projectile can freeze the opponent solid. It's very effective when used to stop a recovery.", titlePt: "As Características do PK Freeze (Especial Neutro)", textPt: "O projétil disparado pode congelar o adversário. É muito eficaz quando usado para impedir uma recuperação." },
  { titleEn: "[★☆☆] PK Freeze's Duration (Neutral Special)", titleJp: "PKフリーズの寿命 【通常必殺ワザ】", textJp: "ボタンを押し続けることで、弾の寿命が延びる。ボタンを離した直後に攻撃判定が出るので、タイミングを見てうまく当てよう。", titleJpEn: "PK Freeze's Duration (Neutral Special)", textJpEn: "Holding the button extends the projectile's lifespan. The hitbox appears right after releasing the button, so time it well to land it.", titlePt: "A Duração do PK Freeze (Especial Neutro)", textPt: "Segurar o botão estende a duração do projétil. A hitbox aparece logo após soltar o botão, então acerte o timing para conectá-lo bem." },
  { titleEn: "[★☆☆] PK Fire's Traits (Side Special)", titleJp: "PKファイヤーの特性 【横必殺ワザ】", textJp: "ヒットすると火柱になる弾を真横に撃つワザ。射程は短いが複数のファイターにヒットさせてふっとばすことができる。", titleJpEn: "PK Fire's Traits (Side Special)", textJpEn: "A move that fires a projectile straight sideways which becomes a pillar of fire on hit. Its range is short, but it can hit and launch multiple fighters.", titlePt: "As Características do PK Fire (Especial Lateral)", textPt: "Um golpe que dispara um projétil diretamente para o lado, que se transforma em uma coluna de fogo ao acertar. Seu alcance é curto, mas pode acertar e arremessar vários lutadores." },
  { titleEn: "[★☆☆] A PK Fire Diversion (Side Special)", titleJp: "PKファイヤーでけん制 【横必殺ワザ】", textJp: "けん制攻撃として有効で、相手の飛び道具を打ち消すこともできる。スキが大きいので、連続使用には注意したい。", titleJpEn: "A PK Fire Diversion (Side Special)", textJpEn: "Effective as a zoning attack, it can also cancel out the opponent's projectiles. Since the opening is large, be careful about using it repeatedly.", titlePt: "Uma Distração com o PK Fire (Especial Lateral)", textPt: "Eficaz como um ataque de controle de espaço, ele também pode cancelar os projéteis do adversário. Como a abertura é grande, cuidado ao usá-lo repetidamente." },
  { titleEn: "[★☆☆] PK Thunder's Traits (Up Special)", titleJp: "PKサンダーの特性 【上必殺ワザ】", textJp: "ふっとばされた時の復帰に使えるが、弾が地形に当たると消えてしまうので、操作する方向に気を付けよう。", titleJpEn: "PK Thunder's Traits (Up Special)", textJpEn: "It can be used to recover after being launched, but the projectile disappears if it hits the terrain, so be careful with the direction you control it in.", titlePt: "As Características do PK Thunder (Especial Cima)", textPt: "Pode ser usado para se recuperar depois de ser arremessado, mas o projétil desaparece se atingir o cenário, então cuidado com a direção que você controla." },
  { titleEn: "[★☆☆] Multiple Attacks with PK Thunder (Up Special)", titleJp: "PKサンダーで複数攻撃 【上必殺ワザ】", textJp: "他の飛び道具やライバルにヒットしても弾は消えないので、複数のファイターを巻き込んでダメージを与えることができる。", titleJpEn: "Multiple Attacks with PK Thunder (Up Special)", textJpEn: "The projectile doesn't disappear even if it hits other projectiles or rivals, so it can catch multiple fighters and deal damage.", titlePt: "Múltiplos Ataques com o PK Thunder (Especial Cima)", textPt: "O projétil não desaparece mesmo se atingir outros projéteis ou rivais, então pode pegar vários lutadores e causar dano." },
  { titleEn: "[★☆☆] PSI Magnet (Down Special)", titleJp: "サイマグネット 【下必殺ワザ】", textJp: "飛び道具を吸収するだけでなく、自分のダメージを回復できる便利なワザ。空中で使うと滞空時間をかせげる。", titleJpEn: "PSI Magnet (Down Special)", textJpEn: "A convenient move that not only absorbs projectiles, but also restores his own damage. Using it in the air also extends his airtime.", titlePt: "PSI Magnet (Especial Baixo)", textPt: "Um golpe conveniente que não só absorve projéteis, mas também restaura o próprio dano. Usá-lo no ar também estende o tempo no ar." },
  { titleEn: "[★★☆] PSI Magnet - Movement and Disruption (Down Special)", titleJp: "サイマグネットで移動とけん制 【下必殺ワザ】", textJp: "飛び道具を吸収するワザ。吸収した瞬間に後ろへ転がって移動できる。ボタンを離した時に発生する攻撃でけん制可能。", titleJpEn: "PSI Magnet - Movement and Disruption (Down Special)", textJpEn: "A move that absorbs projectiles. The moment it absorbs one, he can roll backward to move. The attack that occurs when the button is released can be used for zoning.", titlePt: "PSI Magnet - Movimento e Controle (Especial Baixo)", textPt: "Um golpe que absorve projéteis. No momento em que absorve um, ele pode rolar para trás para se mover. O ataque que ocorre quando o botão é solto pode ser usado para controle de espaço." },
  { titleEn: "[★☆☆] PK Starstorm (Final Smash)", titleJp: "PKスターストーム 【最後の切りふだ】", textJp: "クマトラ、ボニーと一緒に、リュカに向かって流星を降らせる。スティックの上下入力で、星が集まる位置を少し高くしたり低くしたりできる。", titleJpEn: "PK Starstorm (Final Smash)", textJpEn: "Together with Kumatora and Boney, he rains down meteors toward himself. Inputting up or down on the stick can raise or lower slightly where the stars gather.", titlePt: "PK Starstorm (Final Smash)", textPt: "Junto com Kumatora e Boney, ele faz chover meteoros em sua direção. Inputar cima ou baixo no analógico pode elevar ou abaixar levemente onde as estrelas se concentram." },
  { titleEn: "[★★★] PK Smash Geyser's Pros and Cons (Up Smash Attack)", titleJp: "PKスマッシュゲイザーの長所と短所 【上スマッシュ攻撃】", textJp: "全ファイターが使うワザの中でも、かなり高いふっとばし力を誇る。攻撃後のスキも長いが、それを補ってあまりある攻撃力と範囲。", titleJpEn: "PK Smash Geyser's Pros and Cons (Up Smash Attack)", textJpEn: "Among all moves used by all fighters, it boasts remarkably high knockback. The opening after the attack is long, but its power and range more than make up for it.", titlePt: "Prós e Contras do PK Smash Geyser (Ataque Smash Cima)", textPt: "Entre todos os golpes usados por todos os lutadores, ele possui um arremesso notavelmente alto. A abertura depois do ataque é longa, mas seu poder e alcance compensam com folga." },
  { titleEn: "[★★☆] PK Smash Geyser's Traits (Up Smash Attack)", titleJp: "PKスマッシュゲイザーの特性 【上スマッシュ攻撃】", textJp: "根本を当てると最大のふっとばし力。出だしはガケにつかまった相手にも当てることができる。", titleJpEn: "PK Smash Geyser's Traits (Up Smash Attack)", textJpEn: "Hitting with the base of the move deals maximum knockback. The start of the move can also hit opponents hanging on the ledge.", titlePt: "As Características do PK Smash Geyser (Ataque Smash Cima)", textPt: "Acertar com a base do golpe causa arremesso máximo. O início do golpe também pode acertar adversários agarrados na borda." },
  { titleEn: "[★☆☆] PK Blow (Down Smash Attack)", titleJp: "PKブロウ 【下スマッシュ攻撃】", textJp: "３回の攻撃で威力は徐々に弱くなるが、攻撃範囲は広くなる。ガケつかまり中や、床下にいる相手にも当てられる。", titleJpEn: "PK Blow (Down Smash Attack)", textJpEn: "Across its three hits, power gradually weakens, but the range widens. It can also hit opponents hanging on the ledge or below platforms.", titlePt: "PK Blow (Ataque Smash Baixo)", textPt: "Ao longo de seus três golpes, o poder enfraquece gradualmente, mas o alcance se amplia. Também pode acertar adversários agarrados na borda ou abaixo de plataformas." },
  { titleEn: "[★☆☆] PK Meteor Kick (Back Air Attack)", titleJp: "PKメテオキック 【後空中攻撃】", textJp: "メテオ効果を持つ後ろ蹴り攻撃で、叩き落とす力は高い。リュカのヒザを相手に当てる気持ちで狙うと成功しやすい。", titleJpEn: "PK Meteor Kick (Back Air Attack)", textJpEn: "A backward kick attack with a meteor effect and high spiking power. Aiming to hit the opponent with Lucas's knee makes it easier to succeed.", titlePt: "PK Meteor Kick (Ataque Aéreo Trás)", textPt: "Um ataque de chute para trás com efeito de meteoro e alto poder de espancamento. Mirar para acertar o adversário com o joelho do Lucas facilita o sucesso." },
  { titleEn: "[★☆☆] PK Foot Stomp (Down Air Attack)", titleJp: "PKフットスタンプ 【下空中攻撃】", textJp: "下方向に４連続キックをお見舞いする。ジャンプの上昇中に出すと４ヒットさせやすい。最後の１発にはメテオ効果がある。", titleJpEn: "PK Foot Stomp (Down Air Attack)", textJpEn: "Delivers four consecutive kicks downward. Using it while rising during a jump makes it easier to land all four hits. The final hit has a meteor effect.", titlePt: "PK Foot Stomp (Ataque Aéreo Baixo)", textPt: "Entrega quatro chutes consecutivos para baixo. Usá-lo enquanto sobe durante um pulo facilita acertar os quatro golpes. O golpe final tem efeito de meteoro." },
  { titleEn: "[★★☆] Rope Snake's Traits (Grab Attack)", titleJp: "ヒモヘビの特性 【つかみ】", textJp: "取り出したヒモヘビで相手をつかむ。その分リーチが長い。空中ではより長く伸び、ガケつかみにも活用できる。", titleJpEn: "Rope Snake's Traits (Grab Attack)", textJpEn: "He pulls out a Rope Snake to grab the opponent, giving it long reach. In the air, it extends even further and can also be used to grab the ledge.", titlePt: "As Características da Rope Snake (Agarrão)", textPt: "Ele puxa uma Rope Snake para agarrar o adversário, dando a ela um longo alcance. No ar, ela se estende ainda mais e também pode ser usada para se agarrar na borda." },
  { titleEn: "[★★☆] Midair Rope Snake (Grab Attack)", titleJp: "空中でのヒモヘビ 【つかみ】", textJp: "空中で出しても相手をつかんで投げることはできないが、攻撃判定はあるのでけん制をするのに便利。", titleJpEn: "Midair Rope Snake (Grab Attack)", textJpEn: "Using it in the air can't grab and throw the opponent, but it does have a hitbox, making it useful for zoning.", titlePt: "Rope Snake no Ar (Agarrão)", textPt: "Usá-lo no ar não consegue agarrar e arremessar o adversário, mas tem uma hitbox, tornando-o útil para controle de espaço." },
];

async function main() {
  const lucas = await db.fighter.findFirst({
    where: { name: "Lucas" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!lucas) { console.log("Lucas not found"); return; }

  await db.fighter.update({
    where: { id: lucas.id },
    data: {
      curatorOverviewEn: "Lucas, the psychic-powered protagonist of MOTHER3, is a zoning specialist built around PK Fire, PK Freeze, and PK Thunder — a trio of projectiles that control space, disrupt recoveries, and threaten multi-hit damage. PSI Magnet absorbs enemy projectiles into free healing, and his Up Smash boasts the single highest knockback of any move in the game. Fragile and reliant on careful spacing, Lucas rewards players who use his tools to control the fight from range before closing in for the kill.",
      curatorOverviewPt: "Lucas, o protagonista com poderes psíquicos de MOTHER3, é um especialista em controle de espaço construído em torno de PK Fire, PK Freeze e PK Thunder — um trio de projéteis que controlam o espaço, atrapalham recuperações e ameaçam dano de múltiplos acertos. PSI Magnet absorve projéteis inimigos transformando-os em cura gratuita, e seu Smash Cima possui o maior arremesso individual de qualquer golpe do jogo. Frágil e dependente de posicionamento cuidadoso, o Lucas recompensa jogadores que usam suas ferramentas para controlar a luta à distância antes de partir para o abate.",
      curatorOverviewJp: "『MOTHER3』の超能力を持つ主人公リュカは、PKファイヤー、PKフリーズ、PKサンダーという３つの飛び道具を中心に据えた空間制圧の専門家だ――空間を制し、復帰を妨害し、複数ヒットのダメージを脅かす。サイマグネットは相手の飛び道具を吸収して無料の回復に変え、上スマッシュ攻撃はゲーム内のどのワザよりも高い単発ふっとばし力を誇る。脆く、慎重な間合い管理に依存するリュカは、道具を使って遠距離から戦いを制し、その後仕留めにいくプレイヤーに応える。",
      curatorOverviewJpEn: "Lucas, the psychic-powered protagonist of MOTHER3, is a space-control specialist built around three projectiles — PK Fire, PK Freeze, and PK Thunder — that control space, disrupt recoveries, and threaten multi-hit damage. PSI Magnet absorbs enemy projectiles and converts them into free healing, and his Up Smash boasts the single highest knockback of any move in the game. Fragile and reliant on careful spacing, Lucas rewards players who use his tools to control the fight from range before moving in for the finish.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = lucas.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = lucas.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "The up special \"PK Thunder\" pierces through opponents it hits, allowing it to catch multiple people. Hitting himself with it to launch into a body check is a powerful move that deals multiple hits before a final launch. The up smash attack boasts the highest knockback power among all fighters. Its range is also wide, but it's strongest when it hits right around Lucas immediately after activation. (GBA) MOTHER3 (2003/06)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "O especial cima \"PK Thunder\" atravessa os adversários que atinge, permitindo pegar várias pessoas. Acertar a si mesmo com ele para se lançar em um golpe corporal é um golpe poderoso que causa múltiplos acertos antes de um arremesso final. O ataque smash cima tem o maior poder de arremesso entre todos os lutadores. Seu alcance também é amplo, mas é mais forte quando acerta bem perto do Lucas logo após a ativação. (GBA) MOTHER3 (2003/06)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = lucas.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fix: main "Lucas" SSB4 trophy — WiiU 1:23:10-1:23:20, 3DS 1:12:28-1:12:38
  const mainTrophy = await db.collectible.findFirst({ where: { name: "Lucas", smashGameVersion: "SSB4", type: "TROPHY", fighterId: lucas.id }, select: { id: true } });
  if (mainTrophy) {
    await db.collectible.update({ where: { id: mainTrophy.id }, data: { videoStartSec: 4990, videoEndSec: 5000, videoStartSec2: 4348, videoEndSec2: 4358 } });
    console.log("✅ SSB4 Trophy \"Lucas\": vídeo -> WiiU 4990-5000, 3DS 4348-4358");
  }

  // Delete exact-duplicate orphan "Lucas" (same pos/video as the already-linked trophy)
  const dupeLucas = await db.collectible.findFirst({ where: { name: "Lucas", smashGameVersion: "SSB4", type: "TROPHY", fighterId: null }, select: { id: true } });
  if (dupeLucas) {
    await db.collectible.delete({ where: { id: dupeLucas.id } });
    console.log("✅ Orphan duplicado \"Lucas\" (mesmo pos/vídeo do já vinculado) removido");
  }

  // Link "Lucas (2)" per user decision
  const lucas2 = await db.collectible.findFirst({ where: { name: "Lucas (2)", smashGameVersion: "SSB4" }, select: { id: true } });
  if (lucas2) {
    await db.collectible.update({ where: { id: lucas2.id }, data: { fighterId: lucas.id } });
    console.log("✅ \"Lucas (2)\": linkado ao fighterId do Lucas");
  }

  // Link + normalize "PK Starstorm (Lucas)" for both SSBB and SSB4_WIIU
  const starstormWiiU = await db.collectible.findFirst({ where: { name: "PK Starstorm (Lucas)", smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
  if (starstormWiiU) {
    await db.collectible.update({ where: { id: starstormWiiU.id }, data: { smashGameVersion: "SSB4", fighterId: lucas.id } });
    console.log("✅ \"PK Starstorm (Lucas)\" [SSB4_WIIU]: normalizado SSB4, linkado");
  }
  const starstormSSBB = await db.collectible.findFirst({ where: { name: "PK Starstorm (Lucas)", smashGameVersion: "SSBB" }, select: { id: true } });
  if (starstormSSBB) {
    await db.collectible.update({ where: { id: starstormSSBB.id }, data: { fighterId: lucas.id } });
    console.log("✅ \"PK Starstorm (Lucas)\" [SSBB]: linkado");
  }

  await db.$disconnect();
}
main().catch(console.error);
