import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "In his debut, \"Super Mario Land 2,\" he appeared as a villain (boss character) who seized Mario's Castle and enchanted the residents of Mario Land to make them his minions. In \"Mario & Wario,\" he was also a villain who obstructed Mario and friends by covering them with buckets. However, in \"Wario Land: Super Mario Land 3,\" he took over as the protagonist in place of Mario, and afterward became a lead-tier character with his own independent series, going on to appear in a variety of Nintendo titles including the \"Mario\" series.",
    pt: "Em seu debut, \"Super Mario Land 2,\" ele apareceu como um vilão (chefe) que tomou o Castelo do Mario e enfeitiçou os moradores de Mario Land para torná-los seus capangas. Em \"Mario & Wario,\" ele também foi um vilão que atrapalhava o Mario e seus amigos cobrindo-os com baldes. Porém, em \"Wario Land: Super Mario Land 3,\" ele assumiu o papel de protagonista no lugar do Mario, e depois disso se tornou um personagem de destaque com sua própria série independente, passando a aparecer em uma variedade de títulos da Nintendo, incluindo a série \"Mario.\"",
  },
  SSBB: {
    jpEn: "Self-proclaimed rival of Mario. He favors crude humor and valuable things, and often sets off on adventures to get his hands on hidden treasure. His signature trait is his bold action, making use of his prized superhuman strength, completely different from Mario's. Alongside his adventures, he also serves as president and CEO of the game company Wario Company. His signature title is \"WarioWare, Inc.\"",
    pt: "Autoproclamado rival do Mario. Ele gosta de humor grosseiro e coisas valiosas, e frequentemente parte em aventuras para conseguir tesouros escondidos. Sua marca registrada é sua ação ousada, aproveitando sua estimada força sobre-humana, completamente diferente da do Mario. Além de suas aventuras, ele também atua como presidente e CEO da empresa de jogos Wario Company. Seu título de destaque é \"WarioWare, Inc.\"",
  },
  SSB4: {
    jpEn: "A villain who hates Mario and is the very picture of crudeness. He can't resist a chance to make money. He has an assertive, arrogant personality and refers to himself as \"Wario-sama.\" He claims to be Mario's childhood friend, but the truth of that is unknown. In Smash Bros., he's a heavyweight with high-power moves, but surprisingly agile. \"Wario Waft\" is a fart attack whose power and explosive force keep growing the longer it goes unused.",
    pt: "Um vilão que odeia o Mario e é a própria imagem da grosseria. Ele não resiste a uma chance de ganhar dinheiro. Ele tem uma personalidade assertiva e arrogante e se refere a si mesmo como \"Wario-sama.\" Ele afirma ser amigo de infância do Mario, mas a veracidade disso é desconhecida. Em Smash Bros., ele é um peso-pesado com golpes de alto poder, mas surpreendentemente ágil. \"Wario Waft\" é um ataque de peido cujo poder e força explosiva continuam crescendo quanto mais tempo fica sem ser usado.",
  },
  SSBM: {
    jpEn: "An old acquaintance of Mario's. He tried to seize \"Mario's Castle\" but failed. Since then, he has wanted a castle of his own. Possessing superhuman strength, he performs bold actions that Mario could never imitate. He surprisingly has many talents, undergoing various transformations with the help of items and enemies' power, becoming fat or turning into a zombie.\nSuper Mario Land 2: 6 Golden Coins (11/92)",
    pt: "Um velho conhecido do Mario. Ele tentou tomar o \"Castelo do Mario,\" mas fracassou. Desde então, ele quer um castelo próprio. Possuindo força sobre-humana, ele realiza ações ousadas que o Mario jamais conseguiria imitar. Surpreendentemente, ele tem muitos talentos, passando por várias transformações com a ajuda de itens e do poder de inimigos, ficando gordo ou se transformando em zumbi.\nSuper Mario Land 2: 6 Golden Coins (11/92)",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Wario's Origins", titleJp: "ワリオの初登場作品", textJp: "１９９２年発売『スーパーマリオランド2 6つの金貨』が、ワリオの初登場作品。マリオの留守中にマリオ城を乗っ取った悪いやつ。", titleJpEn: "Wario's Origins", textJpEn: "\"Super Mario Land 2: 6 Golden Coins,\" released in 1992, is Wario's debut. The bad guy who seized Mario's Castle while Mario was away.", titlePt: "As Origens do Wario", textPt: "\"Super Mario Land 2: 6 Golden Coins,\" lançado em 1992, é o debut do Wario. O vilão que tomou o Castelo do Mario enquanto ele estava fora." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "自称「マリオのおさななじみで、最大のライバル」。お金や財宝に目がない。食べることも好きで、ニンニクが好物。", titleJpEn: "In His Series", textJpEn: "Self-proclaimed \"Mario's childhood friend and greatest rival.\" He can't resist money or treasure. He also loves eating, with garlic being his favorite food.", titlePt: "Na Série Original", textPt: "Autoproclamado \"amigo de infância e maior rival do Mario.\" Ele não resiste a dinheiro ou tesouros. Ele também adora comer, e alho é sua comida favorita." },
  { titleEn: "[★☆☆] First Starring Role", titleJp: "初主役", textJp: "初主役となったのは、１９９４年に発売された『スーパーマリオランド3 ワリオランド』。ニンニクでパワーアップし、体当たりで敵を倒す、パワフルなアクションが魅力。", titleJpEn: "First Starring Role", textJpEn: "His first starring role came in \"Wario Land: Super Mario Land 3,\" released in 1994. Its appeal lies in powerful action where he powers up with garlic and defeats enemies with body slams.", titlePt: "Primeiro Papel Principal", textPt: "Seu primeiro papel de protagonista veio em \"Wario Land: Super Mario Land 3,\" lançado em 1994. Seu apelo está em uma ação poderosa, onde ele se fortalece com alho e derrota inimigos com investidas corporais." },
  { titleEn: "[★★☆] Chomp's Traits (Neutral Special)", titleJp: "ワリオかみつきの特性 【通常必殺ワザ】", textJp: "投げワザと同じで、相手のシールドで防がれることはない。かみつき中は、少しずつ蓄積ダメージが回復していく。", titleJpEn: "Chomp's Traits (Neutral Special)", textJpEn: "Like a throw, it can't be blocked by the opponent's shield. While chomping, accumulated damage slowly heals.", titlePt: "As Características do Chomp (Especial Neutro)", textPt: "Assim como um arremesso, não pode ser bloqueado pelo escudo do adversário. Enquanto morde, o dano acumulado se cura lentamente." },
  { titleEn: "[★★☆] Chomp's Healing (Neutral Special)", titleJp: "ワリオかみつきで多めに回復 【通常必殺ワザ】", textJp: "相手にかみつくだけでなく、アイテムを食べることもできる。回復アイテムを食べると、いつもより回復量が多くなる。", titleJpEn: "Chomp's Healing (Neutral Special)", textJpEn: "Besides biting opponents, he can also eat items. Eating a healing item restores more than usual.", titlePt: "A Cura do Chomp (Especial Neutro)", textPt: "Além de morder adversários, ele também pode comer itens. Comer um item de cura restaura mais do que o normal." },
  { titleEn: "[★★☆] Chomping for Power (Neutral Special)", titleJp: "ワリオかみつきで威力アップ 【通常必殺ワザ】", textJp: "アイテムを食べると、少しガスがたまる。ガスがたまるほど下必殺ワザの威力が上がる。", titleJpEn: "Chomping for Power (Neutral Special)", textJpEn: "Eating an item builds up a bit of gas. The more gas builds up, the stronger the down special becomes.", titlePt: "Mordendo por Poder (Especial Neutro)", textPt: "Comer um item acumula um pouco de gás. Quanto mais gás se acumula, mais forte fica o especial baixo." },
  { titleEn: "[★★☆] Chomp Indigestion (Neutral Special)", titleJp: "ワリオかみつきのテクニック 【通常必殺ワザ】", textJp: "爆発アイテムを食べると、少しダメージを受けるが、その瞬間ワリオの近くにいる相手にもダメージを与える。", titleJpEn: "Chomp Indigestion (Neutral Special)", textJpEn: "Eating an explosive item deals him a bit of damage, but at that moment, opponents near Wario also take damage.", titlePt: "A Indigestão do Chomp (Especial Neutro)", textPt: "Comer um item explosivo causa um pouco de dano nele, mas nesse momento, adversários próximos ao Wario também recebem dano." },
  { titleEn: "[★☆☆] Repurposing Wario Bike (Side Special)", titleJp: "ワリオバイクの再利用 【横必殺ワザ】", textJp: "バイクが壊れると、タイヤなどの複数のパーツになる。このパーツを食べると、少しだけ体力を回復したり、おならをためたりできる。", titleJpEn: "Repurposing Wario Bike (Side Special)", textJpEn: "When the bike breaks, it splits into multiple parts like tires. Eating these parts restores a little health or builds up gas.", titlePt: "Reaproveitando a Wario Bike (Especial Lateral)", textPt: "Quando a moto quebra, ela se divide em várias partes, como pneus. Comer essas partes restaura um pouco de vida ou acumula gás." },
  { titleEn: "[★☆☆] Controlling Wario Bike (Side Special)", titleJp: "ワリオバイクの操作 【横必殺ワザ】", textJp: "上を入力すればウィリー走行、下を入力すれば前輪を下ろすことができる。前輪で相手を踏みつぶせば、大きくふっとばすことができる。", titleJpEn: "Controlling Wario Bike (Side Special)", textJpEn: "Inputting up performs a wheelie, and inputting down lowers the front wheel. Running over an opponent with the front wheel launches them with strong knockback.", titlePt: "Controlando a Wario Bike (Especial Lateral)", textPt: "Inputar cima faz um cavalo de pau, e inputar baixo abaixa a roda dianteira. Atropelar um adversário com a roda dianteira o arremessa com forte impulso." },
  { titleEn: "[★☆☆] Wario Bike Taunting (Side Special)", titleJp: "ワリオバイクでアピール 【横必殺ワザ】", textJp: "バイクに乗っている間は、アピールが専用のものになる。バイクの威力は、特に変わったりはしない。", titleJpEn: "Wario Bike Taunting (Side Special)", textJpEn: "While riding the bike, the taunt becomes a unique one just for it. The bike's power doesn't particularly change.", titlePt: "Provocando na Wario Bike (Especial Lateral)", textPt: "Enquanto anda na moto, a provocação se torna uma exclusiva para ela. O poder da moto não muda especificamente." },
  { titleEn: "[★★☆] Wario Waft (Down Special)", titleJp: "ワリオっぺ 【下必殺ワザ】", textJp: "最大ためで使うとワリオが大きく飛び上がる。接触した相手をふっとばすので、復帰時に使えば復帰を妨害しにきた相手を返り討ちにすることもできる。", titleJpEn: "Wario Waft (Down Special)", textJpEn: "Used at max charge, it makes Wario leap high into the air. Since it launches opponents on contact, using it while recovering can let him turn the tables on an opponent trying to edge-guard him.", titlePt: "Wario Waft (Especial Baixo)", textPt: "Usado com carga máxima, faz o Wario saltar bem alto no ar. Como ele arremessa adversários ao contato, usá-lo enquanto se recupera pode permitir virar o jogo contra um adversário tentando impedir sua recuperação." },
  { titleEn: "[★☆☆] Wario Waft's Gas (Down Special)", titleJp: "ワリオっぺのガス 【下必殺ワザ】", textJp: "ガスが最大までたまると、ワリオの体が光る。また、お腹にたまったガスは撃墜されてもなくならない。", titleJpEn: "Wario Waft's Gas (Down Special)", textJpEn: "When gas builds up to the maximum, Wario's body glows. Also, gas accumulated in his stomach doesn't disappear even if he's KO'd.", titlePt: "O Gás do Wario Waft (Especial Baixo)", textPt: "Quando o gás se acumula ao máximo, o corpo do Wario brilha. Além disso, o gás acumulado em sua barriga não desaparece mesmo se ele for nocauteado." },
  { titleEn: "[★☆☆] Wario-Man (Final Smash)", titleJp: "ワリオマン 【最後の切りふだ】", textJp: "ワリオマンに変身して、分身しながら一斉攻撃する。トドメのおならの威力は、下必殺ワザのおならのたまり具合とは無関係。", titleJpEn: "Wario-Man (Final Smash)", textJpEn: "Transforms into Wario-Man and attacks all at once while creating clones. The power of the finishing fart is unrelated to how much gas was built up in the down special.", titlePt: "Wario-Man (Final Smash)", textPt: "Transforma-se em Wario-Man e ataca tudo de uma vez enquanto cria clones. O poder do peido final não tem relação com o quanto de gás foi acumulado no especial baixo." },
  { titleEn: "[★☆☆] Hand Slap (Up Air Attack)", titleJp: "ハンドパッチン 【上空中攻撃】", textJp: "ほぼ真上にしか攻撃できないが、攻撃力が高く、着地した時のスキが小さい。コンボに組み込むと、大ダメージを期待できる。", titleJpEn: "Hand Slap (Up Air Attack)", textJpEn: "It can only attack almost directly above him, but has high power and a small opening when landing. Working it into a combo can lead to big damage.", titlePt: "Hand Slap (Ataque Aéreo Cima)", textPt: "Só consegue atacar quase que diretamente acima dele, mas tem alto poder e uma pequena abertura ao pousar. Incorporá-lo em um combo pode gerar bastante dano." },
  { titleEn: "[★☆☆] Shoulder Tackle (Dash Attack)", titleJp: "ショルダータックル 【ダッシュ攻撃】", textJp: "『ワリオランド』シリーズでも、象徴的なワザ。『スマブラ』でもパワフルさは健在で、ふっとばし力が強い。", titleJpEn: "Shoulder Tackle (Dash Attack)", textJpEn: "An iconic move from the \"Wario Land\" series as well. Its power remains intact in Smash Bros., with strong knockback.", titlePt: "Shoulder Tackle (Ataque em Disparada)", textPt: "Um golpe icônico também da série \"Wario Land.\" Seu poder permanece intacto em Smash Bros., com forte impulso." },
];

async function main() {
  const wario = await db.fighter.findFirst({
    where: { name: "Wario" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!wario) { console.log("Wario not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: wario.id },
    data: {
      curatorOverviewEn: "Wario, Mario's crude self-proclaimed rival, is a deceptively agile heavyweight who wins fights through sheer unpredictability — Wario Chomp bites through shields and projectiles alike, Wario Bike breaks into edible parts that heal or build gas, and Wario Waft turns held-in flatulence into an escalating explosive threat that only gets scarier the longer it's saved. His Wario-Man Final Smash unleashes a frenzy of cloned attacks. Gross, greedy, and surprisingly technical, he punishes opponents who forget just how much damage a heavyweight with real speed can do.",
      curatorOverviewPt: "Wario, o rival grosseiro e autoproclamado do Mario, é um peso-pesado enganosamente ágil que vence lutas através da pura imprevisibilidade — Wario Chomp morde através de escudos e projéteis, Wario Bike se quebra em partes comestíveis que curam ou acumulam gás, e Wario Waft transforma flatulência retida em uma ameaça explosiva crescente que só fica mais assustadora quanto mais tempo é guardada. Seu Final Smash Wario-Man desencadeia uma fúria de ataques clonados. Grosseiro, ganancioso e surpreendentemente técnico, ele pune adversários que esquecem o quanto de dano um peso-pesado com velocidade de verdade pode causar.",
      curatorOverviewJp: "マリオの自称ライバルであり下品なワリオは、見た目に反して機敏な重量級で、純粋な予測不能さで戦いを制す――ワリオかみつきはシールドも飛び道具もかみ砕き、ワリオバイクは壊れると食べられるパーツになり回復やガス蓄積に使え、ワリオっぺはためこんだおならを、ためればためるほど恐ろしくなる爆発的な脅威に変える。最後の切りふだ「ワリオマン」は分身しての猛攻を放つ。下品で欲張りで、意外にもテクニカルな彼は、本物の速さを持つ重量級がどれほどのダメージを出せるかを忘れた相手を罰する。",
      curatorOverviewJpEn: "Wario, Mario's self-proclaimed, crude rival, is a deceptively agile heavyweight who wins fights through sheer unpredictability — Wario Chomp bites through both shields and projectiles, Wario Bike breaks apart into edible parts that heal or build up gas, and Wario Waft turns held-in flatulence into an explosive threat that grows scarier the longer it's saved. His Final Smash \"Wario-Man\" unleashes a barrage of cloned attacks. Gross, greedy, and surprisingly technical, he punishes opponents who forget just how much damage a heavyweight with real speed can deal.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Bios PT+JpEn
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = wario.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Move EN+PT+JpEn
  const move = wario.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Wario Chomp\" is a special move that bites down on things like the opponent's projectiles. Holding the button keeps his mouth open, making it easier to chomp. Healing items restore more when eaten than when simply picked up. The side special \"Wario Bike\" lets him ditch the bike and jump while moving sideways. Since the up special can also be used afterward, it can be used for recovery. (GB) Super Mario Land 2: 6 Golden Coins (1992/10) (GBA) WarioWare, Inc.: Mega Microgame$ (2003/03)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Wario Chomp\" é um golpe especial que morde coisas como os projéteis do adversário. Segurar o botão mantém a boca aberta, facilitando a mordida. Itens de cura restauram mais quando comidos do que quando simplesmente pegos. O especial lateral \"Wario Bike\" permite que ele largue a moto e pule enquanto se move lateralmente. Como o especial cima também pode ser usado depois, isso pode ser usado para recuperação. (GB) Super Mario Land 2: 6 Golden Coins (1992/10) (GBA) WarioWare, Inc.: Mega Microgame$ (2003/03)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = wario.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fix: SSBM bio + trophy (ZoomZike 03:28-03:46)
  const ssbmBio = await db.fighterBio.findFirst({ where: { fighterId: wario.id, smashGameVersion: "SSBM" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbmBio) {
    await db.fighterBio.update({ where: { id: ssbmBio.id }, data: { videoStartSec: 208, videoEndSec: 226 } });
    console.log(`✅ Bio [SSBM]: ${ssbmBio.videoStartSec}-${ssbmBio.videoEndSec} -> 208-226 (03:28-03:46)`);
  }
  const ssbmTrophy = await db.collectible.findFirst({ where: { name: "Wario", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbmTrophy) {
    await db.collectible.update({ where: { id: ssbmTrophy.id }, data: { videoStartSec: 208, videoEndSec: 226 } });
    console.log(`✅ SSBM Trophy: ${ssbmTrophy.videoStartSec}-${ssbmTrophy.videoEndSec} -> 208-226 (03:28-03:46)`);
  }

  // Link orphaned "Wario Bike" [SSB4] — already normalized, video already valid, no conflict (exact-name "Wario" wins mainTrophyWithVideo)
  const bikeSSB4 = await db.collectible.findFirst({ where: { name: "Wario Bike", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true } });
  if (bikeSSB4) {
    await db.collectible.update({ where: { id: bikeSSB4.id }, data: { fighterId: wario.id } });
    console.log(`✅ "Wario Bike" [SSB4]: fighterId linkado`);
  }

  // Link + normalize "Wario-Man" [SSB4_WIIU] — no conflict (exact-name "Wario" wins for SSB4 era)
  const warioManSSB4 = await db.collectible.findFirst({ where: { name: "Wario-Man", smashGameVersion: "SSB4_WIIU", type: "TROPHY" }, select: { id: true } });
  if (warioManSSB4) {
    await db.collectible.update({ where: { id: warioManSSB4.id }, data: { smashGameVersion: "SSB4", fighterId: wario.id } });
    console.log(`✅ "Wario-Man" [SSB4_WIIU]: normalizado para SSB4, fighterId linkado`);
  }

  // Link + normalize "Wario + Bruiser Wario + Growlster" [SSB4_3DS] — corrupted duration (1502-90780), clear video
  const comboTrophy = await db.collectible.findFirst({ where: { name: "Wario + Bruiser Wario + Growlster", smashGameVersion: "SSB4_3DS", type: "TROPHY" }, select: { id: true } });
  if (comboTrophy) {
    await db.collectible.update({ where: { id: comboTrophy.id }, data: { smashGameVersion: "SSB4", fighterId: wario.id, videoStartSec: null, videoEndSec: null } });
    console.log(`✅ "Wario + Bruiser Wario + Growlster" [SSB4_3DS]: normalizado, fighterId linkado, vídeo corrompido limpo`);
  }

  // Link "Wario-Man" [SSBB] — clear video to avoid conflict with already-linked "Wario Bike" SSBB trophy (no exact-name "Wario" trophy exists in SSBB era)
  const warioManSSBB = await db.collectible.findFirst({ where: { name: "Wario-Man", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true } });
  if (warioManSSBB) {
    await db.collectible.update({ where: { id: warioManSSBB.id }, data: { fighterId: wario.id, videoStartSec: null, videoEndSec: null } });
    console.log(`✅ "Wario-Man" [SSBB]: fighterId linkado, vídeo limpo (evita conflito com "Wario Bike" já vinculado)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
