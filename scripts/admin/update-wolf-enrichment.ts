import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "First appearing in \"Star Fox 64,\" he's the leader of the rogue mercenary squad \"Star Wolf.\" Piloting the fighter craft \"Wolfen,\" built by Andross and Pigma, he stands in Star Fox's way.",
    pt: "Aparecendo pela primeira vez em \"Star Fox 64,\" ele é o líder do esquadrão mercenário desonesto \"Star Wolf.\" Pilotando a nave de combate \"Wolfen,\" construída por Andross e Pigma, ele se coloca no caminho da Star Fox.",
  },
  SSBB: {
    jpEn: "His real name is Wolf O'Donnell. Leader of the somewhat eccentric group of outlaws known as \"Star Wolf.\" He has crossed paths with Fox many times, and the two acknowledge each other as rivals. His skill as a pilot is also first-rate. He interferes with Fox due to a grudge tied to Fox's father, James. His countless accumulated misdeeds have made him a wanted man with an enormous bounty on his head.",
    pt: "Seu nome verdadeiro é Wolf O'Donnell. Líder do grupo de foras da lei um tanto excêntrico conhecido como \"Star Wolf.\" Ele cruzou caminhos com o Fox várias vezes, e os dois se reconhecem como rivais. Sua habilidade como piloto também é de primeira linha. Ele atrapalha o Fox devido a um rancor ligado ao pai do Fox, James. Suas incontáveis más ações acumuladas o tornaram um procurado com uma enorme recompensa por sua cabeça.",
  },
  SSB4: {
    jpEn: "He was once a member of Andross's elite squad, and even won aerial battles against Star Fox. However, after Andross's forces were destroyed, he no longer belonged to any organization, gathering outlaws together and naming them Star Wolf. If their interests happen to align, he and yesterday's enemy Fox will sometimes cooperate to defeat a common foe. But tomorrow, they'll be enemies again — eternal rivals.",
    pt: "Ele já foi membro do esquadrão de elite do Andross, e até venceu batalhas aéreas contra a Star Fox. Porém, depois que as forças do Andross foram destruídas, ele deixou de pertencer a qualquer organização, reunindo foras da lei e batizando-os de Star Wolf. Se seus interesses coincidirem, ele e seu inimigo de ontem, o Fox, às vezes cooperam para derrotar um inimigo em comum. Mas amanhã, eles serão inimigos novamente — rivais eternos.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Wolf's Origins", titleJp: "ウルフの初登場作品", textJp: "ウルフの初登場は、１９９７年発売の『スターフォックス64』。だが、本当は『スターフォックス2』が初登場タイトルになる予定だったとか……!?", titleJpEn: "Wolf's Origins", textJpEn: "Wolf's debut was in \"Star Fox 64,\" released in 1997. However, it's said that \"Star Fox 2\" was originally planned to be his debut title...!?", titlePt: "As Origens do Wolf", textPt: "O debut do Wolf foi em \"Star Fox 64,\" lançado em 1997. Porém, diz-se que \"Star Fox 2\" originalmente seria seu título de debut...!?" },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "自ら皇帝を名乗る科学者、アンドルフ直属の精鋭部隊「スターウルフ」を率いる。フォックスだけでなく、彼の父ジェームズにも因縁がある。パイロットの腕前は超一流。", titleJpEn: "In His Series", textJpEn: "He leads \"Star Wolf,\" the elite squad directly under the command of Andross, the scientist who declared himself emperor. He has a grudge not just with Fox, but with his father James as well. His piloting skill is top-tier.", titlePt: "Na Série Original", textPt: "Ele lidera a \"Star Wolf,\" o esquadrão de elite diretamente sob o comando do Andross, o cientista que se autoproclamou imperador. Ele tem um rancor não só com o Fox, mas também com o pai dele, James. Sua habilidade como piloto é de primeira linha." },
  { titleEn: "[★☆☆] Blaster (Neutral Special)", titleJp: "クローブラスター 【通常必殺ワザ】", textJp: "ブラスター本体のツメと、発射された弾による２段攻撃。ツメの攻撃を当てるためには、近づいてワザを出すのが効果的。攻撃力は高いが連射はできず、スキがやや大きめ。", titleJpEn: "Blaster (Neutral Special)", textJpEn: "A two-hit attack combining the blaster's claw and the fired shot. To land the claw hit, it's effective to close the distance before using the move. Its power is high, but it can't be rapid-fired and has a somewhat large opening.", titlePt: "Blaster (Especial Neutro)", textPt: "Um ataque de dois golpes combinando a garra da blaster e o tiro disparado. Para acertar o golpe da garra, é eficaz se aproximar antes de usar o golpe. Seu poder é alto, mas não pode ser disparado repetidamente e tem uma abertura um tanto grande." },
  { titleEn: "[★☆☆] Wolf Flash (Side Special)", titleJp: "ウルフフラッシュ 【横必殺ワザ】", textJp: "スティック上下入力で、飛び出す方向を少しだけ変更できる。爪が当たると、非常に強力。中心部分には、強力なメテオ効果が！", titleJpEn: "Wolf Flash (Side Special)", textJpEn: "Inputting the stick up or down can slightly change the direction he launches. If the claw connects, it's extremely powerful. The center portion has a strong meteor effect!", titlePt: "Wolf Flash (Especial Lateral)", textPt: "Inputar o analógico para cima ou para baixo pode mudar levemente a direção em que ele se lança. Se a garra conectar, é extremamente poderoso. A parte central tem um forte efeito de meteoro!" },
  { titleEn: "[★☆☆] Fire Wolf (Up Special)", titleJp: "ウルフシュート 【上必殺ワザ】", textJp: "入力した方向へ、移動しながら攻撃する。移動距離はあまり長くないが、ふっとばし力が強く、撃墜も狙える。", titleJpEn: "Fire Wolf (Up Special)", textJpEn: "Attacks while moving in the input direction. The travel distance isn't very long, but its knockback is strong, making it viable for going for a KO.", titlePt: "Fire Wolf (Especial Cima)", textPt: "Ataca enquanto se move na direção inputada. A distância percorrida não é muito longa, mas seu arremesso é forte, tornando-o viável para buscar um KO." },
  { titleEn: "[★☆☆] Reflector (Down Special)", titleJp: "リフレクター 【下必殺ワザ】", textJp: "相手が撃ってきた弾や、飛び道具を反射すると、スピードと威力を増して跳ね返す。また、展開したリフレクターは直接ヒットした相手を浮かせるため、追撃を狙える。", titleJpEn: "Reflector (Down Special)", textJpEn: "When it reflects a shot or projectile fired by an opponent, it bounces back with increased speed and power. Also, the deployed reflector launches any opponent it directly hits into the air, setting up a follow-up.", titlePt: "Reflector (Especial Baixo)", textPt: "Quando reflete um tiro ou projétil disparado por um adversário, ele ricocheteia de volta com velocidade e poder aumentados. Além disso, o reflector implantado lança para o ar qualquer adversário que atinge diretamente, preparando um acompanhamento." },
  { titleEn: "[★☆☆] Team Star Wolf (Final Smash)", titleJp: "チームスターウルフ 【最後の切りふだ】", textJp: "ロックオンした相手に、チームスターウルフで総攻撃する。相手にフォックスかファルコがいると、特別なセリフを聞ける。", titleJpEn: "Team Star Wolf (Final Smash)", textJpEn: "Launches an all-out attack from Team Star Wolf on the locked-on opponent. If the opponent is Fox or Falco, a special line of dialogue can be heard.", titlePt: "Team Star Wolf (Final Smash)", textPt: "Desencadeia um ataque total da Team Star Wolf contra o adversário travado. Se o adversário for o Fox ou o Falco, uma fala especial de diálogo pode ser ouvida." },
];

async function main() {
  const wolf = await db.fighter.findFirst({
    where: { name: "Wolf" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!wolf) { console.log("Wolf not found"); return; }

  await db.fighter.update({
    where: { id: wolf.id },
    data: {
      curatorOverviewEn: "Wolf, leader of the mercenary squad Star Wolf and Fox's eternal rival, fights with a heavier, more aggressive spin on the Star Fox toolkit — Blaster combines a melee claw with a ranged shot, Wolf Flash delivers a devastating meteor when it connects at its center, and Fire Wolf trades distance for raw knockback. His Reflector launches opponents directly on contact, adding an offensive edge missing from Fox and Falco's versions. Powerful but with slightly more startup than his rivals, Wolf rewards players willing to commit to close-range aggression.",
      curatorOverviewPt: "Wolf, líder do esquadrão mercenário Star Wolf e rival eterno do Fox, luta com uma versão mais pesada e agressiva do arsenal da Star Fox — Blaster combina uma garra corpo a corpo com um tiro à distância, Wolf Flash entrega um meteoro devastador quando conecta em seu centro, e Fire Wolf troca distância por arremesso bruto. Seu Reflector arremessa adversários diretamente ao contato, adicionando um viés ofensivo ausente nas versões do Fox e do Falco. Poderoso mas com uma preparação um pouco mais lenta que seus rivais, o Wolf recompensa jogadores dispostos a se comprometer com agressão de curto alcance.",
      curatorOverviewJp: "スターウルフのリーダーでフォックスの永遠のライバル、ウルフは、スターフォックスの戦法をより重く攻撃的にアレンジして戦う――ブラスターは近接のツメと遠距離の一撃を組み合わせ、ウルフフラッシュは中心で当たると壊滅的なメテオを放ち、ウルフシュートは距離と引き換えに生のふっとばし力を得る。リフレクターは接触した相手を直接浮かせ、フォックスやファルコのバージョンにはない攻撃的な側面を加える。強力だがライバルたちよりやや発生が遅いウルフは、近距離での積極的な攻めに徹するプレイヤーに応える。",
      curatorOverviewJpEn: "Wolf, leader of the mercenary squad Star Wolf and Fox's eternal rival, fights with a heavier, more aggressive take on the Star Fox toolkit — Blaster combines a close-range claw with a ranged shot, Wolf Flash unleashes a devastating meteor effect when it connects at its center, and Fire Wolf trades distance for raw knockback. Reflector launches opponents directly into the air on contact, adding an offensive edge that Fox's and Falco's versions lack. Powerful but with slightly slower startup than his rivals, Wolf rewards players committed to close-range aggression.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = wolf.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = wolf.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fix: main SSB4 trophy "Wolf O'Donnell" — WiiU 59:44-59:55, 3DS 53:31-53:42
  const mainTrophy = await db.collectible.findFirst({ where: { name: "Wolf O'Donnell", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (mainTrophy) {
    await db.collectible.update({ where: { id: mainTrophy.id }, data: { videoStartSec: 3584, videoEndSec: 3595, videoStartSec2: 3211, videoEndSec2: 3222 } });
    console.log(`✅ SSB4 Trophy "Wolf O'Donnell": WiiU 3584-3595, 3DS 3211-3222 (corrigido de secundário corrompido)`);
  }

  // Link "Wolfen" [SSB4_3DS] — corrupted video (3146-277, end<start), clear
  const wolfen3ds = await db.collectible.findFirst({ where: { name: "Wolfen", smashGameVersion: "SSB4_3DS" }, select: { id: true } });
  if (wolfen3ds) {
    await db.collectible.update({ where: { id: wolfen3ds.id }, data: { smashGameVersion: "SSB4", fighterId: wolf.id, videoStartSec: null, videoEndSec: null } });
    console.log("✅ \"Wolfen\" [SSB4_3DS]: normalizado SSB4, linkado, vídeo corrompido limpo");
  }

  // Link "Wolfen (Assault)" [SSB4_WIIU] — clear video to avoid SSB4-era conflict
  // ("Wolf O'Donnell" doesn't exact-match the fighter's short name "Wolf", so a second
  // video-bearing SSB4 trophy risks non-deterministic selection)
  const wolfenAssault = await db.collectible.findFirst({ where: { name: "Wolfen (Assault)", smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
  if (wolfenAssault) {
    await db.collectible.update({ where: { id: wolfenAssault.id }, data: { smashGameVersion: "SSB4", fighterId: wolf.id, videoStartSec: null, videoEndSec: null } });
    console.log("✅ \"Wolfen (Assault)\" [SSB4_WIIU]: normalizado SSB4, linkado, vídeo limpo (evita conflito com \"Wolf O'Donnell\")");
  }

  // Link "Wolfen" [SSBB] and "Landmaster (Wolf)" [SSBB] — no conflict, main "Wolf" trophy exact-matches
  for (const name of ["Wolfen", "Landmaster (Wolf)"]) {
    const item = await db.collectible.findFirst({ where: { name, smashGameVersion: "SSBB" }, select: { id: true } });
    if (item) {
      await db.collectible.update({ where: { id: item.id }, data: { fighterId: wolf.id } });
      console.log(`✅ "${name}" [SSBB]: linkado`);
    }
  }

  // NOTE: "Wolf Link" [SSB4_WIIU] is intentionally NOT linked — it's an unrelated Zelda trophy
  // (Link's wolf form from Twilight Princess), a false positive from the "Wolf" name search.

  await db.$disconnect();
}
main().catch(console.error);
