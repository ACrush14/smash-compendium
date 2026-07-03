import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "A Fighting/Steel-type \"Aura Pokémon.\" Length: 1.2m, Weight: 54.0kg, National Pokédex No. 448. It has the ability to catch the \"Aura\" given off by living creatures, and can even understand human speech. A well-trained Lucario can use Aura to sense who is up to a kilometer away, and even what they're feeling. It speaks in movies and in Smash Bros., but this is said to be something like telepathy. A male appears in the anime and in Smash Bros., but females also exist.",
    pt: "Um Pokémon Aura do tipo Lutador/Metálico. Comprimento: 1,2m, Peso: 54,0kg, Nº 448 na Pokédex Nacional. Ele tem a habilidade de captar a \"Aura\" emitida por criaturas vivas, e pode até entender a fala humana. Um Lucario bem treinado pode usar a Aura para sentir quem está até um quilômetro de distância, e até o que essa pessoa está sentindo. Ele fala em filmes e em Smash Bros., mas isso é dito ser algo como telepatia. Um macho aparece no anime e em Smash Bros., mas fêmeas também existem.",
  },
  SSBB: {
    jpEn: "An Aura Pokémon. It can catch something like an energy possessed by living things, called Aura. The only Pokémon with both the Fighting and Steel types. A very affectionate Riolu evolves into Lucario if it levels up during the morning or daytime. It excels at Aura-based moves like \"Dark Pulse\" and the powerful, never-miss \"Aura Sphere.\"",
    pt: "Um Pokémon Aura. Ele pode captar algo como uma energia possuída por seres vivos, chamada Aura. O único Pokémon com os tipos Lutador e Metálico ao mesmo tempo. Um Riolu muito afetuoso evolui para Lucario se sobe de nível durante a manhã ou o dia. Ele se destaca em golpes baseados em Aura como \"Dark Pulse\" e o poderoso, nunca-erra \"Aura Sphere.\"",
  },
  SSB4: {
    jpEn: "A Fighting/Steel-type Aura Pokémon that reads its opponent's movements and thoughts through Aura. It's said that Lucario can see opponents even when they're invisible. Through the power of Aura, the more accumulated damage it has, the more its attack power rises — up to about triple at maximum. Its charged \"Aura Sphere\" becomes tremendously destructive when its attack power is raised.",
    pt: "Um Pokémon Aura do tipo Lutador/Metálico que lê os movimentos e pensamentos do adversário através da Aura. Diz-se que o Lucario consegue ver adversários mesmo quando estão invisíveis. Através do poder da Aura, quanto mais dano acumulado ele tem, mais seu poder de ataque aumenta — até cerca de três vezes no máximo. Seu \"Aura Sphere\" carregado se torna tremendamente destrutivo quando seu poder de ataque está elevado.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Lucario's Origins", titleJp: "ルカリオの初登場作品", textJp: "ルカリオの初登場作品は、『ポケットモンスター ダイヤモンド・パール』。波導をキャッチして相手の考えや動きを読み取ることができるポケモン。", titleJpEn: "Lucario's Origins", textJpEn: "Lucario's debut was in \"Pokémon Diamond & Pearl.\" A Pokémon that can catch Aura to read its opponent's thoughts and movements.", titlePt: "As Origens do Lucario", textPt: "O debut do Lucario foi em \"Pokémon Diamond & Pearl.\" Um Pokémon que pode captar Aura para ler os pensamentos e movimentos do adversário." },
  { titleEn: "[★☆☆] In Its Series", titleJp: "原作では", textJp: "はもんポケモン、リオルの進化形。生物が発する波導をキャッチすることができる。その能力で、相手の居場所を見破ったり、人の言葉も理解すると言われている。", titleJpEn: "In Its Series", textJpEn: "The evolved form of Riolu, the Emanation Pokémon. It can catch the Aura given off by living creatures. With this ability, it's said to be able to pinpoint an opponent's location and even understand human speech.", titlePt: "Na Série Original", textPt: "A forma evoluída do Riolu, o Pokémon Emanação. Ele pode captar a Aura emitida por criaturas vivas. Com essa habilidade, diz-se que ele consegue localizar exatamente onde um adversário está e até entender a fala humana." },
  { titleEn: "[★★☆] Aura Sphere (Neutral Special)", titleJp: "はどうだん 【通常必殺ワザ】", textJp: "ためている最中のはどうだんも、触れた相手にダメージを与えられる。空中から相手の真上に下りて、ためながら相手を攻撃することも可能。", titleJpEn: "Aura Sphere (Neutral Special)", textJpEn: "Even while charging, Aura Sphere deals damage to any opponent that touches it. It can also be used to attack an opponent from directly above while descending from the air and charging.", titlePt: "Aura Sphere (Especial Neutro)", textPt: "Mesmo enquanto carrega, o Aura Sphere causa dano a qualquer adversário que o tocar. Também pode ser usado para atacar um adversário diretamente de cima enquanto desce do ar e carrega." },
  { titleEn: "[★☆☆] Force Palm (Side Special)", titleJp: "はっけい 【横必殺ワザ】", textJp: "かまえた後に踏み込み、前方に波導を発生させる。波導の力が高いほど、リーチが伸びダメージも大きくなる。", titleJpEn: "Force Palm (Side Special)", textJpEn: "After taking a stance, he steps forward and generates Aura in front of him. The higher the power of Aura, the longer the reach and the greater the damage.", titlePt: "Force Palm (Especial Lateral)", textPt: "Depois de assumir uma postura, ele avança e gera Aura à sua frente. Quanto maior o poder da Aura, maior o alcance e o dano." },
  { titleEn: "[★★☆] Force Palm Throws (Side Special)", titleJp: "投げワザのはっけい 【横必殺ワザ】", textJp: "相手に密着してくり出せば、投げワザとなる。強力なふっとばし力を持っており、波導がたまっていれば、まさに一撃必殺。", titleJpEn: "Force Palm Throws (Side Special)", textJpEn: "Used at point-blank range against an opponent, it becomes a throw. It has powerful knockback, and with Aura built up, it can be a true one-hit KO.", titlePt: "Force Palm como Arremesso (Especial Lateral)", textPt: "Usado à queima-roupa contra um adversário, ele se torna um arremesso. Tem um arremesso poderoso, e com Aura acumulada, pode ser um verdadeiro nocaute de um golpe só." },
  { titleEn: "[★★☆] Projectiles and Force Palm (Side Special)", titleJp: "飛び道具のはっけい 【横必殺ワザ】", textJp: "相手から離れた位置で出すと飛び道具となり、反射されるリスクが生まれる。波導がたまっている時ほど、リーチや威力が上がる。", titleJpEn: "Projectiles and Force Palm (Side Special)", textJpEn: "Used from a distance from the opponent, it becomes a projectile, creating a risk of being reflected. The more Aura is built up, the greater the reach and power.", titlePt: "Projéteis e o Force Palm (Especial Lateral)", textPt: "Usado a uma distância do adversário, ele se torna um projétil, criando o risco de ser refletido. Quanto mais Aura acumulada, maior o alcance e o poder." },
  { titleEn: "[★☆☆] Extreme Speed (Up Special)", titleJp: "しんそく 【上必殺ワザ】", textJp: "飛びたい方向を入力することで、移動方向を変えられる。波導の力が高いほど、移動できる距離が長くなる。", titleJpEn: "Extreme Speed (Up Special)", textJpEn: "Inputting the desired direction can change the direction of travel. The higher the power of Aura, the longer the distance he can move.", titlePt: "Extreme Speed (Especial Cima)", textPt: "Inputar a direção desejada pode mudar a direção do movimento. Quanto maior o poder da Aura, maior a distância que ele pode se mover." },
  { titleEn: "[★★☆] Launching with Extreme Speed (Up Special)", titleJp: "しんそくでふっとばす 【上必殺ワザ】", textJp: "移動を終える時に、近くにいる相手をふっとばす。波導がたまれば遠くの相手にも瞬時に近づいて攻撃できるが、行き過ぎて自滅しないように。", titleJpEn: "Launching with Extreme Speed (Up Special)", textJpEn: "When the movement ends, it launches nearby opponents. With Aura built up, it can instantly close the distance to attack even a far-away opponent, but be careful not to overshoot and self-destruct.", titlePt: "Arremessando com o Extreme Speed (Especial Cima)", textPt: "Quando o movimento termina, arremessa adversários próximos. Com Aura acumulada, pode fechar instantaneamente a distância para atacar até um adversário distante, mas cuidado para não ultrapassar e se autodestruir." },
  { titleEn: "[★☆☆] Aura Storm (Final Smash)", titleJp: "はどうのあらし 【最後の切りふだ】", textJp: "上空から下方向に向けて、はどうのあらしを浴びせる。発射中に、左右に狙いをつけることができる。", titleJpEn: "Aura Storm (Final Smash)", textJpEn: "Unleashes a storm of Aura from the sky downward. The aim can be adjusted left and right while firing.", titlePt: "Aura Storm (Final Smash)", textPt: "Libera uma tempestade de Aura do céu para baixo. A mira pode ser ajustada para esquerda e direita durante o disparo." },
  { titleEn: "[★★☆] Grab Attack", titleJp: "つかみはどう 【つかみ】", textJp: "波導の影響を受けた攻撃力になるため、蓄積ダメージが高い状態で連射すれば、かなりのダメージを与えられる。", titleJpEn: "Grab Attack", textJpEn: "Its attack power is affected by Aura, so mashing it while accumulated damage is high can deal considerable damage.", titlePt: "Ataque de Agarrão", textPt: "Seu poder de ataque é afetado pela Aura, então repeti-lo enquanto o dano acumulado é alto pode causar dano considerável." },
  { titleEn: "[★☆☆] Aura", titleJp: "波導の力", textJp: "波導の力は蓄積ダメージに応じて上昇し、１９０％で最高になり、攻撃力がおよそ２.５倍になる。乱闘に負けている時はさらに強力に……。", titleJpEn: "Aura", textJpEn: "The power of Aura rises with accumulated damage, peaking at 190%, where attack power becomes roughly 2.5 times normal. It grows even stronger when he's losing the brawl...", titlePt: "Aura", textPt: "O poder da Aura aumenta conforme o dano acumulado, atingindo o pico em 190%, onde o poder de ataque se torna cerca de 2,5 vezes o normal. Ele fica ainda mais forte quando está perdendo a luta..." },
];

async function main() {
  const lucario = await db.fighter.findFirst({
    where: { name: "Lucario" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!lucario) { console.log("Lucario not found"); return; }

  await db.fighter.update({
    where: { id: lucario.id },
    data: {
      curatorOverviewEn: "Lucario is a comeback fighter whose entire kit scales with damage taken — Aura powers up every move as his percent climbs, turning Force Palm into a one-hit KO and Aura Sphere into a screen-filling threat at high damage. Extreme Speed offers a controllable recovery that gets longer the more he's hurt, and his Final Smash rains Aura from above. Weak early but terrifying past 100%, Lucario rewards players willing to survive the early game to unleash devastating power in the late game.",
      curatorOverviewPt: "Lucario é um lutador de virada cuja habilidade inteira escala com o dano recebido — a Aura potencializa cada golpe conforme sua porcentagem sobe, transformando Force Palm em um nocaute de um golpe só e Aura Sphere em uma ameaça que domina a tela em alto dano. Extreme Speed oferece uma recuperação controlável que fica mais longa quanto mais ele está machucado, e seu Final Smash faz chover Aura do alto. Fraco no início mas aterrorizante depois de 100%, o Lucario recompensa jogadores dispostos a sobreviver ao início do jogo para liberar poder devastador no final.",
      curatorOverviewJp: "ルカリオは、受けたダメージに応じてすべての技が強化される逆転型ファイターだ――波導は蓄積ダメージが上がるにつれてすべての技を強化し、高ダメージ時にはっけいが一撃必殺に、はどうだんが画面を覆う脅威になる。しんそくは、傷つくほど距離が伸びる操作可能な復帰を提供し、最後の切りふだは上空から波導を降らせる。序盤は弱いが100%を超えると恐ろしくなるルカリオは、序盤を生き延びて終盤に壊滅的な力を解き放つプレイヤーに応える。",
      curatorOverviewJpEn: "Lucario is a comeback fighter whose entire kit powers up based on damage taken — Aura strengthens every move as his accumulated damage rises, turning Force Palm into a one-hit KO and Aura Sphere into a screen-covering threat at high damage. Extreme Speed provides a controllable recovery that extends further the more he's hurt, and his Final Smash rains Aura down from above. Weak early on but terrifying past 100%, Lucario rewards players willing to survive the early game and unleash devastating power in the late game.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = lucario.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = lucario.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Extreme Speed\" is an up special that launches forcefully in the input direction. The trajectory can be slightly adjusted while moving. The more accumulated damage he has, the further he can fly. \"Force Palm\" is a side special that attacks with the power of Aura. Using it near an opponent grabs and attacks them, dealing more damage than when used from farther away. (NDS) Pokémon Diamond & Pearl (2006/09) (3DS) Pokémon X & Y (2013/10)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Extreme Speed\" é um especial cima que se lança com força na direção inputada. A trajetória pode ser levemente ajustada durante o movimento. Quanto mais dano acumulado ele tem, mais longe pode voar. \"Force Palm\" é um especial lateral que ataca com o poder da Aura. Usá-lo perto de um adversário o agarra e ataca, causando mais dano do que quando usado de mais longe. (NDS) Pokémon Diamond & Pearl (2006/09) (3DS) Pokémon X & Y (2013/10)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = lucario.tips.find(t => t.titleEn === data.titleEn);
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

  // Fix: SSBB trophy was orphaned (fighterId null) — this is why Brawl video wasn't showing at all.
  // Link it and apply the user's fresh Brawl timing.
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "Lucario", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { fighterId: lucario.id, videoStartSec: 5591, videoEndSec: 5608 } });
    console.log("✅ SSBB Trophy \"Lucario\": linkado (estava órfão — por isso o vídeo do Brawl não aparecia), vídeo -> 5591-5608 (1:33:11-1:33:28)");
  }

  // WiiU video fix on main SSB4 trophy
  const mainSSB4 = await db.collectible.findFirst({ where: { name: "Lucario", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (mainSSB4) {
    await db.collectible.update({ where: { id: mainSSB4.id }, data: { videoStartSec: 3752, videoEndSec: 3762 } });
    console.log(`✅ SSB4 Trophy "Lucario" WiiU: ${mainSSB4.videoStartSec}-${mainSSB4.videoEndSec} -> 3752-3762 (1:02:32-1:02:42)`);
  }

  // Link + normalize orphaned "Mega Evolution (Lucario)" [SSB4_WIIU]
  const mega = await db.collectible.findFirst({ where: { name: "Mega Evolution (Lucario)", smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
  if (mega) {
    await db.collectible.update({ where: { id: mega.id }, data: { smashGameVersion: "SSB4", fighterId: lucario.id } });
    console.log("✅ \"Mega Evolution (Lucario)\": normalizado SSB4, linkado");
  }

  await db.$disconnect();
}
main().catch(console.error);
