import { db } from "../../lib/db";

const TIPS = [
  { titleEn: "[★☆☆] Shot Put (Neutral Special)", titleJp: "鉄球投げ 【通常必殺ワザ】", textJp: "砲丸投げのように斜め上に鉄球を放り投げる。復帰してくる相手を妨害するために使うのも効果的。", titleJpEn: "Shot Put (Neutral Special)", textJpEn: "Throws an iron ball diagonally upward, like a shot put. It's also effective for interfering with an opponent who's recovering.", titlePt: "Shot Put (Especial Neutro)", textPt: "Arremessa uma bola de ferro na diagonal para cima, como um arremesso de peso. Também é eficaz para atrapalhar um adversário que está se recuperando." },
  { titleEn: "[★☆☆] Flashing Mach Punch (Neutral Special)", titleJp: "閃光マッハパンチ 【通常必殺ワザ】", textJp: "目にも止まらぬ速さで、パンチを連打する。連打が相手に当たると無敵になり、渾身のアッパーをくり出す。", titleJpEn: "Flashing Mach Punch (Neutral Special)", textJpEn: "Delivers a flurry of punches at a speed too fast to see. If the flurry connects with an opponent, it becomes invincible and unleashes an all-out uppercut.", titlePt: "Flashing Mach Punch (Especial Neutro)", textPt: "Desfere uma sequência de socos em uma velocidade rápida demais para ser vista. Se a sequência acertar um adversário, ele fica invencível e desfere um uppercut com tudo." },
  { titleEn: "[★★☆] Exploding Side Kick (Neutral Special)", titleJp: "爆裂サイドキック 【通常必殺ワザ】", textJp: "横方向に放つ強烈な蹴り。ボタンを押してすぐ後ろを入力すると、振り返って背中側を蹴る。威力も少し上がる。", titleJpEn: "Exploding Side Kick (Neutral Special)", textJpEn: "A powerful kick delivered sideways. Inputting backward right after pressing the button makes it turn around and kick behind itself, also slightly increasing its power.", titlePt: "Exploding Side Kick (Especial Neutro)", textPt: "Um chute poderoso desferido lateralmente. Inputar para trás logo após apertar o botão faz o golpe virar e chutar por trás, também aumentando levemente seu poder." },
  { titleEn: "[★☆☆] Onslaught (Side Special)", titleJp: "瞬発百裂キック 【横必殺ワザ】", textJp: "自分のダメージが多いほど、最後のキックで相手を大きくふっとばすことができる。一度使うと、しばらくの間、ふっとばし力は元に戻る。", titleJpEn: "Onslaught (Side Special)", textJpEn: "The higher its own damage, the farther the final kick can launch an opponent. After using it once, the knockback power returns to normal for a while.", titlePt: "Onslaught (Especial Lateral)", textPt: "Quanto maior o próprio dano acumulado, mais longe o chute final pode arremessar um adversário. Depois de usado uma vez, o poder de arremesso volta ao normal por um tempo." },
  { titleEn: "[★☆☆] Burning Dropkick (Side Special)", titleJp: "燃焼ドロップキック 【横必殺ワザ】", textJp: "炎をまとい、横方向に大きく飛びながらドロップキック。相手にヒットすると、反動で少し跳ね上がる。", titleJpEn: "Burning Dropkick (Side Special)", textJpEn: "Wreathed in flame, it flies a great distance sideways while delivering a dropkick. Hitting an opponent causes it to bounce back up a bit from the recoil.", titlePt: "Burning Dropkick (Especial Lateral)", textPt: "Envolto em chamas, ele voa uma grande distância lateralmente enquanto desfere um dropkick. Acertar um adversário faz com que ele quique um pouco para cima devido ao recuo." },
  { titleEn: "[★☆☆] Suplex (Side Special)", titleJp: "スープレックス 【横必殺ワザ】", textJp: "正面にダッシュしてつかみかかり、後ろに投げ飛ばす。空中でつかむと急降下するが、ステージ外へ落ちた場合、自分が先にミスとなる。", titleJpEn: "Suplex (Side Special)", textJpEn: "Dashes forward to grab an opponent and throws them backward. Grabbing one in midair causes a rapid descent, but if it falls off the stage first, it will be the one to lose a stock.", titlePt: "Suplex (Especial Lateral)", textPt: "Avança rapidamente para agarrar um adversário e o arremessa para trás. Agarrar um no ar causa uma queda rápida, mas se cair primeiro do palco, será ele quem perde um stock." },
  { titleEn: "[★★★] Soaring Axe Kick (Up Special)", titleJp: "天地キック 【上必殺ワザ】", textJp: "サマーソルトキックで急上昇し、上がり切る前にボタンを押すと、かかと落としで追撃する。かかと落としには強烈なメテオ効果があるが、地面がないとそのままミスになる。", titleJpEn: "Soaring Axe Kick (Up Special)", textJpEn: "Rises rapidly with a somersault kick; pressing the button before it finishes rising follows up with an axe-heel drop. The heel drop has a powerful meteor effect, but without solid ground below, it results in a self-destruct.", titlePt: "Soaring Axe Kick (Especial Cima)", textPt: "Sobe rapidamente com um chute em salto mortal; apertar o botão antes de terminar de subir emenda com um machado de calcanhar. O machado de calcanhar tem um forte efeito meteoro, mas sem chão sólido embaixo, resulta em autoeliminação." },
  { titleEn: "[★★☆] Soaring Axe Kick Recovery (Up Special)", titleJp: "天地キックでの復帰 【上必殺ワザ】", textJp: "復帰に使うと、ガケの上まで飛び出してしまい妨害されやすい。ちょうどガケをつかめる高さまで落ちるのを待ってから使えば邪魔されにくい。", titleJpEn: "Recovering with Soaring Axe Kick (Up Special)", textJpEn: "Using it to recover launches it up above the ledge, making it easy for opponents to interfere. Waiting until it falls to just the right height to grab the ledge before using it makes interference harder.", titlePt: "Recuperando com o Soaring Axe Kick (Especial Cima)", textPt: "Usá-lo para se recuperar o lança para cima da borda, facilitando a interferência dos adversários. Esperar cair até a altura certa para agarrar a borda antes de usá-lo dificulta a interferência." },
  { titleEn: "[★☆☆] Helicopter Kick (Up Special)", titleJp: "昇天スピンキック 【上必殺ワザ】", textJp: "ワザの途中で左右を入力すると、蹴り上げる方向を調整することができる。", titleJpEn: "Helicopter Kick (Up Special)", textJpEn: "Inputting left or right partway through the move allows the kicking direction to be adjusted.", titlePt: "Helicopter Kick (Especial Cima)", textPt: "Inputar esquerda ou direita no meio do movimento permite ajustar a direção do chute." },
  { titleEn: "[★☆☆] Thrust Uppercut (Up Special)", titleJp: "突き上げアッパーカット 【上必殺ワザ】", textJp: "強烈なアッパーで、相手を巻き込みながら上昇する。攻撃している間も、少しだけ左右に動くことができる。", titleJpEn: "Thrust Uppercut (Up Special)", textJpEn: "Rises while catching opponents with a powerful uppercut. It can move slightly left or right even while attacking.", titlePt: "Thrust Uppercut (Especial Cima)", textPt: "Sobe enquanto pega adversários com um uppercut poderoso. Pode se mover levemente para a esquerda ou direita mesmo enquanto ataca." },
  { titleEn: "[★☆☆] Head-On Assault (Down Special)", titleJp: "くい打ちヘッドバット 【下必殺ワザ】", textJp: "空中で使うと、キックを出さずにヘッドバットで急降下する。ガケのほうを向いていれば、急降下中でもつかめる。ガケや足場がないとミスになる。", titleJpEn: "Head-On Assault (Down Special)", textJpEn: "Using it in midair skips the kick and instead descends rapidly with a headbutt. If facing the ledge, it can still grab it during the rapid descent. Without a ledge or platform, it results in a self-destruct.", titlePt: "Head-On Assault (Especial Baixo)", textPt: "Usá-lo no ar pula o chute e, em vez disso, desce rapidamente com uma cabeçada. Se estiver de frente para a borda, ainda é possível agarrá-la durante a descida rápida. Sem uma borda ou plataforma, resulta em autoeliminação." },
  { titleEn: "[★☆☆] Feint Jump (Down Special)", titleJp: "反転キック 【下必殺ワザ】", textJp: "出だしは無敵で、飛び上がりながら反転。ボタンの追加入力で急降下の蹴りを放つ。下降中、もしくは着地地点に相手がいると、自動で蹴りを出す。", titleJpEn: "Feint Jump (Down Special)", textJpEn: "Invincible at the start, it leaps up while turning around. An additional button press unleashes a rapidly descending kick. If an opponent is present during the descent or at the landing spot, the kick fires automatically.", titlePt: "Feint Jump (Especial Baixo)", textPt: "Invencível no início, ele salta enquanto se vira. Um input adicional do botão libera um chute de descida rápida. Se houver um adversário durante a descida ou no local de pouso, o chute é disparado automaticamente." },
  { titleEn: "[★☆☆] Counter Throw (Down Special)", titleJp: "カウンター投げ 【下必殺ワザ】", textJp: "構えた腕で相手の攻撃を受け止めると、つかみかかって投げ飛ばす。足元への攻撃や、飛び道具による攻撃を受けた時は反撃できない。", titleJpEn: "Counter Throw (Down Special)", textJpEn: "Blocks an opponent's attack with a raised arm, then grabs and throws them. It cannot counter attacks aimed at its feet or projectile attacks.", titlePt: "Counter Throw (Especial Baixo)", textPt: "Bloqueia o ataque de um adversário com o braço erguido e então o agarra e arremessa. Não é possível contra-atacar golpes direcionados aos pés ou ataques com projéteis." },
  { titleEn: "[★★☆] Omega Blitz (Final Smash)", titleJp: "超絶ファイナルラッシュ 【最後の切りふだ】", textJp: "キックで打ち上げた相手に、するどい乱打を打ち込む。最後に強烈な三段攻撃を加えて、地面に向かって叩きつける。", titleJpEn: "Omega Blitz (Final Smash)", textJpEn: "Launches an opponent into the air with a kick, then unleashes a sharp flurry of blows. Finishes with a powerful three-hit combo, slamming them into the ground.", titlePt: "Omega Blitz (Final Smash)", textPt: "Lança um adversário ao ar com um chute e então desencadeia uma sequência afiada de golpes. Termina com um combo poderoso de três golpes, arremessando-o contra o chão." },
  { titleEn: "[★★☆] Cartwheel Kick (Up Smash Attack)", titleJp: "大回転キック 【上スマッシュ攻撃】", textJp: "蹴り上げながらバック宙をする。足の部分が無敵なので、上から攻撃してきた相手を打ち負かしやすい。", titleJpEn: "Cartwheel Kick (Up Smash Attack)", textJpEn: "Performs a backflip while kicking upward. Since its legs are invincible during the move, it's easy to beat out opponents attacking from above.", titlePt: "Cartwheel Kick (Ataque Smash Cima)", textPt: "Realiza um mortal para trás enquanto chuta para cima. Como as pernas ficam invencíveis durante o movimento, é fácil superar adversários que atacam de cima." },
  { titleEn: "[★☆☆] Mii Fighters' Origins", titleJp: "Miiの初登場作品", textJp: "Miiの初登場は２００６年。Wiiの内蔵ソフト『似顔絵チャンネル』で作成が可能。さまざまなゲームで活躍させることができる。", titleJpEn: "Mii Fighters' Debut Work", textJpEn: "Mii's debut was in 2006. They can be created using the Wii's built-in software \"Mii Channel,\" and can be featured active in a wide variety of games.", titlePt: "As Origens dos Mii Fighters", textPt: "A estreia do Mii foi em 2006. Eles podem ser criados usando o software integrado do Wii \"Canal Mii\", e podem atuar em uma grande variedade de jogos." },
];

async function main() {
  const brawler = await db.fighter.findFirst({
    where: { name: "Mii Brawler" },
    select: {
      id: true,
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!brawler) { console.log("Mii Brawler not found"); return; }

  await db.fighter.update({
    where: { id: brawler.id },
    data: {
      curatorOverviewEn: "Mii Brawler is the melee-focused member of the fully customizable Mii Fighter trio, trading range for raw close-quarters power. Its neutral special options range from the long-range Shot Put to the flurrying Flashing Mach Punch, while Soaring Axe Kick doubles as both a devastating meteor smash and a recovery tool — though a mistimed use near the ledge leaves it painfully exposed. Suplex and Onslaught punish careless approaches, and Counter Throw rewards patient, read-based play. Like all Mii Fighters, its exact toolkit depends entirely on which special moves the player equips, making it one of the most build-dependent fighters in the game.",
      curatorOverviewPt: "Mii Brawler é o membro focado em combate corpo a corpo do trio totalmente customizável dos Mii Fighters, trocando alcance por poder bruto de perto. Suas opções de especial neutro vão do Shot Put de longo alcance ao Flashing Mach Punch, uma rajada de socos, enquanto o Soaring Axe Kick funciona tanto como um devastador meteoro quanto como uma ferramenta de recuperação — embora um uso mal cronometrado perto da borda o deixe dolorosamente exposto. Suplex e Onslaught punem aproximações descuidadas, e Counter Throw recompensa um jogo paciente e baseado em leitura. Como todos os Mii Fighters, seu kit exato depende inteiramente de quais golpes especiais o jogador equipar, tornando-o um dos lutadores mais dependentes de build do jogo.",
      curatorOverviewJp: "Mii 格闘タイプは、完全にカスタマイズ可能なMiiファイター３タイプの中で近接戦闘に特化した存在で、間合いを犠牲にして生の接近戦力を得ている。通常必殺ワザは、長射程の「鉄球投げ」から連打型の「閃光マッハパンチ」まで幅広く選べ、「天地キック」は強烈なメテオ技であると同時に復帰技としても機能する――ただしガケ際でのタイミングを誤ると手痛い隙をさらすことになる。「スープレックス」や「瞬発百裂キック」は不用意な接近を罰し、「カウンター投げ」は我慢強く相手を読むプレイに応える。すべてのMiiファイターと同様、その正確な戦い方はプレイヤーがどの必殺ワザを装備するかに完全に依存しており、ゲーム屈指の構築依存型ファイターとなっている。",
      curatorOverviewJpEn: "Mii Brawler is the close-combat specialist among the fully customizable Mii Fighter trio, sacrificing range for raw close-quarters power. Its Neutral Special options range widely, from the long-range Shot Put to the rapid-fire Flashing Mach Punch, while Soaring Axe Kick functions both as a devastating meteor move and as a recovery tool — though mistiming it near the ledge leaves it painfully exposed. Suplex and Onslaught punish careless approaches, and Counter Throw rewards patient, read-based play. Like all Mii Fighters, its exact playstyle depends entirely on which special moves the player equips, making it one of the most build-dependent fighters in the game.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = brawler.tips.find(t => t.titleEn === data.titleEn);
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

  // Orphaned trophies: "Mii Brawler" e "Mii Brawler (Alt.)" nunca foram linkados desde o scraping
  const main = await db.collectible.findFirst({ where: { name: "Mii Brawler", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true, videoStartSec: true, videoEndSec: true, videoStartSec2: true, videoEndSec2: true } });
  if (main) {
    await db.collectible.update({ where: { id: main.id }, data: { fighterId: brawler.id, videoStartSec: 2, videoEndSec: 13, videoStartSec2: 5, videoEndSec2: 15 } });
    console.log(`✅ Trophy "Mii Brawler" [SSB4]: linkado, vídeo WiiU 2-13 | 3DS 5-15 (era ${main.videoStartSec}-${main.videoEndSec} | ${main.videoStartSec2}-${main.videoEndSec2})`);
  }
  const alt = await db.collectible.findFirst({ where: { name: "Mii Brawler (Alt.)", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true } });
  if (alt) {
    await db.collectible.update({ where: { id: alt.id }, data: { fighterId: brawler.id } });
    console.log(`✅ Trophy "Mii Brawler (Alt.)" [SSB4]: linkado (vídeo mantido, já plausível)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
