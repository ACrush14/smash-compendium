import { db } from "../../lib/db";

const TIPS = [
  { titleEn: "[★☆☆] Charge Blast (Neutral Special)", titleJp: "ガンナーチャージ 【通常必殺ワザ】", textJp: "最大までためると、かなり強力なワザ。空中でもためられる。ためは、シールドやジャンプでキャンセルできる。", titleJpEn: "Gunner Charge (Neutral Special)", textJpEn: "Charging it to maximum makes it quite a powerful move. It can also be charged in midair. The charge can be canceled with a shield or a jump.", titlePt: "Charge Blast (Especial Neutro)", textPt: "Carregar até o máximo torna o golpe bastante poderoso. Também pode ser carregado no ar. A carga pode ser cancelada com um escudo ou um pulo." },
  { titleEn: "[★☆☆] Laser Blaze (Neutral Special)", titleJp: "ラピッドショット 【通常必殺ワザ】", textJp: "アームキャノンから発射するビームは、連射することができ、当たった相手を少しひるませる。", titleJpEn: "Rapid Shot (Neutral Special)", textJpEn: "The beam fired from the arm cannon can be shot rapidly and slightly staggers any opponent it hits.", titlePt: "Laser Blaze (Especial Neutro)", textPt: "O feixe disparado do canhão de braço pode ser atirado rapidamente e atordoa levemente qualquer adversário que atingir." },
  { titleEn: "[★☆☆] Grenade Launch (Neutral Special)", titleJp: "グレネードランチャー 【通常必殺ワザ】", textJp: "山なりに飛んでいく弾は、ガケ外に出た相手の復帰阻止に役立つ。飛距離は変えられないので、弾道を見切られないように考えて使おう。", titleJpEn: "Grenade Launcher (Neutral Special)", textJpEn: "The projectile, which travels in an arc, is useful for stopping an opponent who's off the ledge from recovering. Since its range can't be changed, think about how to use it so its trajectory isn't read.", titlePt: "Grenade Launch (Especial Neutro)", textPt: "O projétil, que viaja em arco, é útil para impedir a recuperação de um adversário que está fora da borda. Como seu alcance não pode ser alterado, pense em como usá-lo para que sua trajetória não seja lida." },
  { titleEn: "[★☆☆] Flame Pillar (Side Special)", titleJp: "フレイムピラー 【横必殺ワザ】", textJp: "地面に落ちた時に出る火柱は、相手に連続ヒットする。効果時間が長く、飛び道具を相殺できるので、盾として使うこともできる。", titleJpEn: "Flame Pillar (Side Special)", textJpEn: "The pillar of fire that erupts when it lands hits an opponent multiple times. Its duration is long and it can cancel out projectiles, so it can also be used as a shield.", titlePt: "Flame Pillar (Especial Lateral)", textPt: "A coluna de fogo que surge ao pousar acerta o adversário várias vezes. Sua duração é longa e pode cancelar projéteis, então também pode ser usada como escudo." },
  { titleEn: "[★☆☆] Stealth Burst (Side Special)", titleJp: "ステルスボム 【横必殺ワザ】", textJp: "ボタンを押し続けると、着弾点が遠くへ飛び、ボタンを離したところで爆発する。爆発に巻き込まれた相手は、大きくふきとばされる。", titleJpEn: "Stealth Bomb (Side Special)", textJpEn: "Holding the button sends the impact point farther away, and it explodes when the button is released. An opponent caught in the explosion is launched a great distance.", titlePt: "Stealth Burst (Especial Lateral)", textPt: "Segurar o botão envia o ponto de impacto mais longe, e ele explode quando o botão é solto. Um adversário pego na explosão é lançado a uma grande distância." },
  { titleEn: "[★☆☆] Gunner Missile (Side Special)", titleJp: "ミサイル 【横必殺ワザ】", textJp: "通常入力では、誘導性が高いミサイルを放つ。はじき入力すると、まっすぐ飛ぶ強力なミサイルになる。", titleJpEn: "Missile (Side Special)", textJpEn: "A normal input fires a highly homing missile. A flick input turns it into a powerful missile that flies straight.", titlePt: "Gunner Missile (Especial Lateral)", textPt: "Um input normal dispara um míssil altamente teleguiado. Um input de flick o transforma em um míssil poderoso que voa reto." },
  { titleEn: "[★☆☆] Lunar Launch (Up Special)", titleJp: "ボトムシュート 【上必殺ワザ】", textJp: "真下に弾を撃ち、その反動で高く上昇する。復帰しようとしている相手に当てるのもアリ。", titleJpEn: "Bottom Shoot (Up Special)", textJpEn: "Fires a shot straight down and rises high from the recoil. It's also viable to hit an opponent who's trying to recover.", titlePt: "Lunar Launch (Especial Cima)", textPt: "Dispara um tiro diretamente para baixo e sobe alto pelo recuo. Também é viável acertar um adversário que está tentando se recuperar." },
  { titleEn: "[★☆☆] Cannon Jump Kick (Up Special)", titleJp: "キャノンジャンプキック 【上必殺ワザ】", textJp: "爆風を起こした勢いで、相手を蹴り上げる。空中の相手に爆風を当てるとメテオ効果があるが、上昇距離が短いので自滅に注意。", titleJpEn: "Cannon Jump Kick (Up Special)", textJpEn: "Kicks an opponent upward using the force of a blast. Hitting an airborne opponent with the blast has a meteor effect, but since the rising distance is short, watch out for self-destructing.", titlePt: "Cannon Jump Kick (Especial Cima)", textPt: "Chuta um adversário para cima usando a força de uma explosão. Acertar um adversário no ar com a explosão tem efeito meteoro, mas como a distância de subida é curta, cuidado para não se autoeliminar." },
  { titleEn: "[★☆☆] Arm Rocket (Up Special)", titleJp: "アームロケット 【上必殺ワザ】", textJp: "アームキャノンから、ジェットを噴射して飛び上がる。攻撃力はないが、上昇中は飛ぶ方向を調整できる。", titleJpEn: "Arm Rocket (Up Special)", textJpEn: "Launches upward by jetting from the arm cannon. It has no attack power, but the direction of flight can be adjusted while rising.", titlePt: "Arm Rocket (Especial Cima)", textPt: "Lança-se para cima jateando a partir do canhão de braço. Não tem poder de ataque, mas a direção do voo pode ser ajustada durante a subida." },
  { titleEn: "[★☆☆] Echo Reflector (Down Special)", titleJp: "リフレクター 【下必殺ワザ】", textJp: "飛び道具を反射できるリフレクターを展開する。反射した飛び道具は反射前よりも強力になる。", titleJpEn: "Reflector (Down Special)", textJpEn: "Deploys a reflector that can reflect projectiles. A reflected projectile becomes more powerful than it was before being reflected.", titlePt: "Echo Reflector (Especial Baixo)", textPt: "Implanta um refletor capaz de refletir projéteis. Um projétil refletido se torna mais poderoso do que era antes de ser refletido." },
  { titleEn: "[★☆☆] Bomb Drop (Down Special)", titleJp: "グラウンドボム 【下必殺ワザ】", textJp: "２つ目を出そうとすると、１つ目のボムは爆発する。ボムは、相手の攻撃で打ち返すことができてしまうので注意。", titleJpEn: "Ground Bomb (Down Special)", textJpEn: "Trying to place a second one causes the first bomb to explode. Be careful, as the bomb can be hit back by an opponent's attack.", titlePt: "Bomb Drop (Especial Baixo)", textPt: "Tentar colocar uma segunda faz a primeira bomba explodir. Cuidado, pois a bomba pode ser rebatida pelo ataque de um adversário." },
  { titleEn: "[★☆☆] Absorbing Vortex (Down Special)", titleJp: "アブソーバー 【下必殺ワザ】", textJp: "エネルギー系飛び道具を吸収できるバリアを張る。バリアを張り始めた時と、飛び道具を吸収する時に、一瞬だけ攻撃判定が発生する。", titleJpEn: "Absorber (Down Special)", textJpEn: "Puts up a barrier that can absorb energy-type projectiles. An attack hitbox briefly appears both when the barrier is put up and when it absorbs a projectile.", titlePt: "Absorbing Vortex (Especial Baixo)", textPt: "Ergue uma barreira capaz de absorver projéteis do tipo energia. Uma hitbox de ataque aparece brevemente tanto ao erguer a barreira quanto ao absorver um projétil." },
  { titleEn: "[★☆☆] Full Blast (Final Smash)", titleJp: "フルスロットル 【最後の切りふだ】", textJp: "上下に角度を変えられる、長射程のレーザー攻撃を放つ。当たった相手を徐々に押すので、画面端で当てると効果的。", titleJpEn: "Full Throttle (Final Smash)", textJpEn: "Fires a long-range laser attack whose angle can be changed up or down. It gradually pushes any opponent it hits, so it's effective when it connects near the edge of the screen.", titlePt: "Full Blast (Final Smash)", textPt: "Dispara um ataque de laser de longo alcance cujo ângulo pode ser mudado para cima ou para baixo. Empurra gradualmente qualquer adversário que atingir, então é eficaz quando acerta perto da borda da tela." },
  { titleEn: "[★☆☆] Mii Fighters' Origins", titleJp: "Miiの初登場作品", textJp: "Miiの初登場は２００６年。Wiiの内蔵ソフト『似顔絵チャンネル』で作成が可能。さまざまなゲームで活躍させることができる。", titleJpEn: "Mii Fighters' Debut Work", textJpEn: "Mii's debut was in 2006. They can be created using the Wii's built-in software \"Mii Channel,\" and can be featured active in a wide variety of games.", titlePt: "As Origens dos Mii Fighters", textPt: "A estreia do Mii foi em 2006. Eles podem ser criados usando o software integrado do Wii \"Canal Mii\", e podem atuar em uma grande variedade de jogos." },
];

async function main() {
  const gunner = await db.fighter.findFirst({
    where: { name: "Mii Gunner" },
    select: {
      id: true,
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!gunner) { console.log("Mii Gunner not found"); return; }

  await db.fighter.update({
    where: { id: gunner.id },
    data: {
      curatorOverviewEn: "Mii Gunner is the ranged specialist of the Mii Fighter trio, built around zoning with grenades, missiles, and lasers rather than close combat. Charge Blast rewards patient spacing with a devastating fully-charged hit, while Flame Pillar doubles as both a projectile shield and a zoning tool. Its recovery, Arm Rocket or Lunar Launch, is serviceable but predictable, and its melee options are weak up close — Mii Gunner wants distance at all times. Echo Reflector punishes opposing projectile-heavy fighters, and Full Blast turns any stray hit near the ledge into a stock. Like all Mii Fighters, its full identity depends on which specials the player equips.",
      curatorOverviewPt: "Mii Gunner é o especialista em alcance do trio Mii Fighter, construído em torno de controle de área com granadas, mísseis e lasers em vez de combate corpo a corpo. Charge Blast recompensa o posicionamento paciente com um golpe devastador quando totalmente carregado, enquanto Flame Pillar funciona tanto como escudo contra projéteis quanto como ferramenta de controle de área. Sua recuperação, Arm Rocket ou Lunar Launch, é funcional mas previsível, e suas opções corpo a corpo são fracas de perto — o Mii Gunner sempre quer distância. Echo Reflector pune adversários que dependem de projéteis, e Full Blast transforma qualquer acerto perto da borda em um stock perdido. Como todos os Mii Fighters, sua identidade completa depende de quais especiais o jogador equipar.",
      curatorOverviewJp: "Mii 射撃タイプは、Miiファイター３タイプの中で遠距離を専門とする存在で、近接戦闘ではなくグレネード、ミサイル、レーザーによる圧力を軸に据えている。「ガンナーチャージ」は我慢強い間合い管理にフルチャージの強烈な一撃で応え、「フレイムピラー」は飛び道具への盾とけん制の両方をこなす。復帰技である「アームロケット」や「ボトムシュート」は実用的だが読まれやすく、近接での選択肢は弱いため、Mii 射撃タイプは常に距離を取りたい。「リフレクター」は飛び道具に依存する相手を罰し、「フルスロットル」はガケ際でのかすった一撃さえもストック獲得に変える。すべてのMiiファイターと同様、その完全な個性は装備する必殺ワザに依存する。",
      curatorOverviewJpEn: "Mii Gunner is the ranged specialist among the Mii Fighter trio, built around pressuring with grenades, missiles, and lasers rather than close combat. Charge Blast rewards patient spacing with a devastating fully-charged hit, while Flame Pillar serves as both a shield against projectiles and a zoning tool. Its recovery moves, Arm Rocket and Lunar Launch, are practical but easy to read, and its close-range options are weak, so Mii Gunner always wants to keep its distance. Echo Reflector punishes projectile-reliant opponents, and Full Blast turns even a glancing hit near the ledge into a stock. Like all Mii Fighters, its complete identity depends on which special moves are equipped.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = gunner.tips.find(t => t.titleEn === data.titleEn);
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

  // Mii Gunner já vinha linkado (fighterId setado) desde o scraping, ao contrário
  // de Mii Brawler e Mii Swordfighter — sem timing novo fornecido pelo usuário desta vez,
  // vídeo existente (76-91 | 48-60 principal, 101-113 | 60-70 Alt.) já plausível, não mexido.

  await db.$disconnect();
}
main().catch(console.error);
