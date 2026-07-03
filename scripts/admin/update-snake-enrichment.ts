import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBB: {
    jpEn: "A former member of the FOXHOUND unit, with an IQ of 180 and fluency in six languages. An infiltration mission specialist who completes his objectives under any circumstances. As a result, he has come to be known by names such as \"the Legendary Mercenary\" and \"the Man Who Makes the Impossible Possible.\" He has saved the world three times from the clutches of the nuclear-armed bipedal tank, Metal Gear.\nMetal Gear Solid",
    pt: "Um ex-membro da unidade FOXHOUND, com QI de 180 e fluência em seis idiomas. Um especialista em missões de infiltração que cumpre seus objetivos sob quaisquer circunstâncias. Como resultado, passou a ser conhecido por nomes como \"o Mercenário Lendário\" e \"o Homem que Torna o Impossível Possível.\" Ele salvou o mundo três vezes das garras do tanque bípede armado com armas nucleares, Metal Gear.\nMetal Gear Solid",
  },
  SSBU: {
    jpEn: "The protagonist of the \"Metal Gear\" series. An expert in infiltration operations, skilled in various fields such as firearms, close combat, and languages. The name \"Solid Snake\" is a codename; his real name is David, though his family name is unknown. IQ of 180, fluent in six languages. Born in 1972, he has a background of going from a member of the American special forces unit FOXHOUND to becoming a mercenary. Commonly known as \"the Man Who Makes the Impossible Possible\" and \"the Legendary Hero.\" He has repeatedly saved the world from the nuclear threat posed by the bipedal, nuclear-armed tank known as \"Metal Gear.\"",
    pt: "O protagonista da série \"Metal Gear.\" Um especialista em operações de infiltração, habilidoso em diversas áreas como armas de fogo, combate corpo a corpo e idiomas. O nome \"Solid Snake\" é um codinome; seu nome verdadeiro é David, embora seu sobrenome seja desconhecido. QI de 180, fluente em seis idiomas. Nascido em 1972, ele tem um histórico de ter saído de membro da unidade das forças especiais americanas FOXHOUND para se tornar mercenário. Conhecido popularmente como \"o Homem que Torna o Impossível Possível\" e \"o Herói Lendário.\" Ele salvou o mundo repetidamente da ameaça nuclear representada pelo tanque bípede armado com armas nucleares conhecido como \"Metal Gear.\"",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Snake's Origins", titleJp: "スネークの初登場作品", textJp: "スネークの初登場は、１９８７年発売の『メタルギア』。装備も武器も現地調達という条件下で、スニーキングミッションに挑む。", titleJpEn: "Snake's Origins", textJpEn: "Snake's debut was in \"Metal Gear,\" released in 1987. He takes on a sneaking mission under the condition that his gear and weapons must all be procured on-site.", titlePt: "As Origens do Snake", textPt: "O debut do Snake foi em \"Metal Gear,\" lançado em 1987. Ele encara uma missão de infiltração sob a condição de que todo seu equipamento e armas devem ser conseguidos no local." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "敵のアジトに単独潜入し、テロリストの計画を食い止めるべく、死闘を繰り広げる。隠密行動を行うか、銃や爆弾などを使って、派手に暴れるかはプレイヤー次第。", titleJpEn: "In His Series", textJpEn: "He infiltrates the enemy's hideout alone, engaging in a life-or-death struggle to stop the terrorists' plans. Whether to act stealthily or go loud using guns and bombs is up to the player.", titlePt: "Na Série Original", textPt: "Ele se infiltra sozinho no esconderijo inimigo, travando uma luta de vida ou morte para impedir os planos dos terroristas. Se agir furtivamente ou causar estrago usando armas e bombas fica a critério do jogador." },
  { titleEn: "[★☆☆] Hand Grenade (Neutral Special)", titleJp: "手榴弾 【通常必殺ワザ】", textJp: "ピンを抜いてから約２.５秒で爆発する。投げてぶつけても相手はひるまない。爆発には自分も巻き込まれるので、タイミングを見計らう必要がある。", titleJpEn: "Hand Grenade (Neutral Special)", textJpEn: "It explodes about 2.5 seconds after the pin is pulled. Throwing it and hitting the opponent doesn't flinch them. Since he can also be caught in the explosion himself, careful timing is required.", titlePt: "Hand Grenade (Especial Neutro)", textPt: "Ela explode cerca de 2,5 segundos depois que o pino é puxado. Arremessá-la e acertar o adversário não o atordoa. Como ele também pode ser pego na explosão, um timing cuidadoso é necessário." },
  { titleEn: "[★★☆] Holding Hand Grenade (Neutral Special)", titleJp: "手榴弾の所持 【通常必殺ワザ】", textJp: "必殺ワザボタンを押し続けると、手榴弾を持ったまま移動できる。前後へ歩くこともでき、ジャンプや空中ジャンプも可能。", titleJpEn: "Holding Hand Grenade (Neutral Special)", textJpEn: "Holding the special move button lets him move while holding the grenade. He can walk forward and backward, and jumping and air jumping are also possible.", titlePt: "Segurando a Hand Grenade (Especial Neutro)", textPt: "Segurar o botão de golpe especial permite que ele se mova enquanto segura a granada. Ele pode andar para frente e para trás, e pular e pular no ar também são possíveis." },
  { titleEn: "[★☆☆] Throwing the Hand Grenade (Neutral Special)", titleJp: "手榴弾の投げ分け 【通常必殺ワザ】", textJp: "スティックを倒す方向によって、近・中・遠の３通りの距離へ投げ分けられる。シールドボタンを押すと、投げずにその場に落とす。", titleJpEn: "Throwing the Hand Grenade (Neutral Special)", textJpEn: "The direction the stick is tilted determines whether it's thrown a short, medium, or long distance. Pressing the shield button drops it in place instead of throwing it.", titlePt: "Arremessando a Hand Grenade (Especial Neutro)", textPt: "A direção em que o analógico é inclinado determina se ela é arremessada a uma distância curta, média ou longa. Apertar o botão de escudo a deixa cair no lugar em vez de arremessá-la." },
  { titleEn: "[★☆☆] Remote Missile (Side Special)", titleJp: "リモコンミサイル 【横必殺ワザ】", textJp: "発射後はミサイルを自由に操作できるが、自分自身は動けなくなる。相手が自分に攻撃しようとしたら、シールドボタンを押してキャンセルだ。", titleJpEn: "Remote Missile (Side Special)", textJpEn: "After firing, the missile can be freely controlled, but he himself becomes unable to move. If an opponent tries to attack him, press the shield button to cancel.", titlePt: "Remote Missile (Especial Lateral)", textPt: "Depois de disparado, o míssil pode ser controlado livremente, mas ele mesmo fica incapaz de se mover. Se um adversário tentar atacá-lo, aperte o botão de escudo para cancelar." },
  { titleEn: "[★☆☆] Cypher (Up Special)", titleJp: "サイファー 【上必殺ワザ】", textJp: "上昇中に攻撃や回避などを行うと、サイファーを手放すことができる。空中でダメージを受けると、もう一度使える。", titleJpEn: "Cypher (Up Special)", textJpEn: "Performing an attack or dodge while rising lets him release the Cypher. If he takes damage in the air, it can be used again.", titlePt: "Cypher (Especial Cima)", textPt: "Realizar um ataque ou esquiva enquanto sobe permite que ele solte o Cypher. Se ele receber dano no ar, pode ser usado novamente." },
  { titleEn: "[★☆☆] C4 (Down Special)", titleJp: "C4爆弾 【下必殺ワザ】", textJp: "足元に設置したC4爆弾は、もう一度下必殺ワザを入力することで爆発する。空中でわざと自爆することで、復帰に使うこともできる。", titleJpEn: "C4 (Down Special)", textJpEn: "The C4 explosive placed at his feet detonates when the down special is input again. Deliberately self-detonating in the air can also be used for recovery.", titlePt: "C4 (Especial Baixo)", textPt: "O explosivo C4 colocado aos seus pés detona quando o especial baixo é inputado novamente. Detonar-se propositalmente no ar também pode ser usado para recuperação." },
  { titleEn: "[★★☆] C4 - Butterfly Form (Down Special)", titleJp: "C4爆弾 バタフライ型 【下必殺ワザ】", textJp: "たまに、C4爆弾ではなく、バタフライ型C3爆弾を設置する。見た目は違うが、中身は同じ。", titleJpEn: "C4 - Butterfly Form (Down Special)", textJpEn: "Occasionally, instead of C4, he sets a butterfly-shaped C3 explosive. It looks different, but it's the same underneath.", titlePt: "C4 - Formato Borboleta (Especial Baixo)", textPt: "Ocasionalmente, em vez do C4, ele coloca um explosivo C3 em formato de borboleta. A aparência é diferente, mas o conteúdo é o mesmo." },
  { titleEn: "[★★★] C4 Placement (Down Special)", titleJp: "C4爆弾の設置場所 【下必殺ワザ】", textJp: "C4爆弾は床だけではなく、カベや相手にもくっつけることができる。時間が経つと自動的に爆発してしまうので、起爆のタイミングには注意が必要。", titleJpEn: "C4 Placement (Down Special)", textJpEn: "The C4 explosive can be stuck not just to the floor, but also to walls and opponents. Since it automatically explodes after time passes, careful attention to detonation timing is needed.", titlePt: "Posicionamento do C4 (Especial Baixo)", textPt: "O explosivo C4 pode ser colado não só no chão, mas também em paredes e adversários. Como ele explode automaticamente após um tempo, é preciso ter cuidado com o timing da detonação." },
  { titleEn: "[★☆☆] Covering Fire (Final Smash)", titleJp: "援護射撃 【最後の切りふだ】", textJp: "最後の切りふだでは、ロックオンした相手に５発のミサイルを撃つ。ロックオンに失敗しても、ミサイルは飛ぶ。", titleJpEn: "Covering Fire (Final Smash)", textJpEn: "In the Final Smash, he fires 5 missiles at the locked-on opponent. Even if the lock-on fails, the missiles still fly.", titlePt: "Covering Fire (Final Smash)", textPt: "No Final Smash, ele dispara 5 mísseis contra o adversário travado. Mesmo se o travamento falhar, os mísseis ainda voam." },
  { titleEn: "[★☆☆] Silent Takedown (Downward Throw)", titleJp: "拘束解放 【下投げ】", textJp: "相手をその場に寝かせて必ずダウンさせることができる、特殊な投げワザ。相手の受けているダメージが高いほど、その後の状況が有利になる。", titleJpEn: "Silent Takedown (Downward Throw)", textJpEn: "A special throw that always knocks the opponent down flat on the spot. The higher the opponent's accumulated damage, the more favorable the situation that follows.", titlePt: "Silent Takedown (Arremesso Baixo)", textPt: "Um arremesso especial que sempre derruba o adversário no chão no local. Quanto maior o dano acumulado do adversário, mais favorável fica a situação que se segue." },
  { titleEn: "[★☆☆] Cardboard Box", titleJp: "ダンボール", textJp: "アピールでは、スネークが愛するダンボールに隠れる。相手ファイターが近づいて、ダンボールを拾うと……。", titleJpEn: "Cardboard Box", textJpEn: "In his taunt, Snake hides in his beloved cardboard box. If an opposing fighter approaches and picks up the box...", titlePt: "Cardboard Box", textPt: "Em sua provocação, o Snake se esconde em sua amada caixa de papelão. Se um lutador adversário se aproximar e pegar a caixa..." },
  { titleEn: "[★★☆] Attack with the Cardboard Box", titleJp: "ダンボールで攻撃", textJp: "アピールで被るダンボールは、捨てた時に相手にダメージを与えられる。背中側にダンボールを落とすため、攻撃として使う場合は、向きに注意。", titleJpEn: "Attack with the Cardboard Box", textJpEn: "The cardboard box worn during the taunt can deal damage to opponents when discarded. Since the box drops behind him, be mindful of his facing direction when using it as an attack.", titlePt: "Atacando com a Cardboard Box", textPt: "A caixa de papelão usada durante a provocação pode causar dano aos adversários quando descartada. Como a caixa cai atrás dele, é preciso prestar atenção na direção em que ele está virado ao usá-la como ataque." },
];

async function main() {
  const snake = await db.fighter.findFirst({
    where: { name: "Snake" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!snake) { console.log("Snake not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: snake.id },
    data: {
      curatorOverviewEn: "Snake, the legendary FOXHOUND infiltrator, fights like no one else in Smash — Hand Grenades can be held, walked with, and thrown to three different distances, Remote Missile lets him pilot ordnance while frozen in place, and C4 turns the whole stage into a minefield. His taunt hides him inside a beloved cardboard box, which doubles as a surprise attack when discarded. A master of setups and stage control, Snake rewards players who plan several steps ahead rather than reacting move to move.",
      curatorOverviewPt: "Snake, o lendário infiltrador da FOXHOUND, luta como ninguém mais no Smash — Hand Grenades podem ser seguradas, carregadas ao andar e arremessadas em três distâncias diferentes, Remote Missile permite pilotar um míssil enquanto fica parado no lugar, e C4 transforma o palco inteiro em um campo minado. Sua provocação o esconde dentro de sua amada caixa de papelão, que também funciona como um ataque surpresa quando descartada. Um mestre em armadilhas e controle de palco, o Snake recompensa jogadores que planejam vários passos à frente em vez de reagir golpe a golpe.",
      curatorOverviewJp: "伝説のFOXHOUND潜入工作員スネークは、スマブラの中で誰とも違う戦い方をする――手榴弾は持ち歩いたまま移動でき、３通りの距離に投げ分けられ、リモコンミサイルはその場に固まったままミサイルを操縦し、C4爆弾はステージ全体を地雷原に変える。アピールでは愛するダンボールに隠れ、捨てた時には奇襲攻撃としても機能する。仕掛けとステージコントロールの達人であるスネークは、一手一手反応するのではなく、数手先まで計画するプレイヤーに応える。",
      curatorOverviewJpEn: "Snake, the legendary FOXHOUND infiltrator, fights like no one else in Smash — Hand Grenades can be carried while moving and thrown to three different distances, Remote Missile lets him pilot the missile while frozen in place, and C4 turns the entire stage into a minefield. His taunt hides him inside his beloved cardboard box, which also functions as a surprise attack when discarded. A master of setups and stage control, Snake rewards players who plan several moves ahead rather than reacting one hit at a time.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Bios PT+JpEn
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = snake.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = snake.tips.find(t => t.titleEn === data.titleEn);
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

  // Link orphaned "Naked Snake" SSBB — clear video to avoid conflict with already-linked "Iroquois Pliskin" SSBB trophy
  const nakedSnake = await db.collectible.findFirst({ where: { name: "Naked Snake", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true } });
  if (nakedSnake) {
    await db.collectible.update({ where: { id: nakedSnake.id }, data: { fighterId: snake.id, videoStartSec: null, videoEndSec: null } });
    console.log(`✅ "Naked Snake" [SSBB]: fighterId linkado, vídeo limpo (evita conflito com "Iroquois Pliskin" já vinculado)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
