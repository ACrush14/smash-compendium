import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBB: {
    jpEn: "A young man living in the Bronx who loves fighting. He meets Doc Louis, a once-renowned professional boxer who had fallen into drowning his days in drink, and the two aim for the top of the WVBA together. With a small body, he wins victory after victory against opponents several times his size. Storing up the \"☆\" earned by hitting opponents lets him unleash an uppercut with even greater attack power.",
    pt: "Um jovem que mora no Bronx e adora brigar. Ele conhece o Doc Louis, um boxeador profissional outrora renomado que havia se afogado em bebida, e os dois miram o topo da WVBA juntos. Com um corpo pequeno, ele conquista vitória após vitória contra adversários muitas vezes maiores que ele. Acumular a \"☆\" ganha ao acertar adversários permite liberar um uppercut com um poder de ataque ainda maior.",
  },
  SSB4: {
    jpEn: "A small-statured boxer who bravely fights big, tough opponents in the \"Punch-Out!!\" series. In Smash Bros. too, he's a fighter whose punches, delivered from a small body, hit hard. The gauge above his damage display fills up when he takes damage or attacks, and turns into \"K.O.\" when fully charged. Pressing the special move button during this state unleashes a one-hit-KO uppercut.",
    pt: "Um boxeador de estatura pequena que luta bravamente contra adversários grandes e fortes na série \"Punch-Out!!\" Em Smash Bros. também, ele é um lutador cujos socos, entregues por um corpo pequeno, batem forte. O medidor acima da exibição de dano se enche quando ele recebe dano ou ataca, e se transforma em \"K.O.\" quando totalmente carregado. Apertar o botão de golpe especial nesse estado libera um uppercut de nocaute em um golpe só.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Little Mac's Origins", titleJp: "リトル・マックの初登場作品", textJp: "『パンチアウト!!』がはじめて登場したのは１９８４年。主人公のボクサーに「リトル・マック」と名前が付いたのは後のファミコン版から。", titleJpEn: "Little Mac's Origins", textJpEn: "\"Punch-Out!!\" first appeared in 1984. The protagonist boxer was given the name \"Little Mac\" starting from the later Famicom version.", titlePt: "As Origens do Little Mac", textPt: "\"Punch-Out!!\" apareceu pela primeira vez em 1984. O boxeador protagonista recebeu o nome \"Little Mac\" a partir da versão posterior para Famicom." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『パンチアウト!!』の主人公、アメリカ合衆国・ブロンクス出身、１７歳のボクサー。世界ヘビー級チャンピオンを目指し、自分よりも大柄な対戦相手たちを倒していく。", titleJpEn: "In His Series", textJpEn: "The protagonist of \"Punch-Out!!,\" a 17-year-old boxer from the Bronx, United States. He aims to become the world heavyweight champion, defeating opponents much larger than himself.", titlePt: "Na Série Original", textPt: "O protagonista de \"Punch-Out!!,\" um boxeador de 17 anos do Bronx, Estados Unidos. Ele busca se tornar o campeão mundial dos pesos-pesados, derrotando adversários muito maiores que ele." },
  { titleEn: "[★☆☆] Unique Traits", titleJp: "特徴", textJp: "蓄積ダメージが高くなると、顔にアザやばんそうこうが増える。また、ボクサーなので足を使った攻撃が一切無い。", titleJpEn: "Unique Traits", textJpEn: "As accumulated damage increases, bruises and bandages appear more on his face. Also, being a boxer, he has no attacks that use his legs at all.", titlePt: "Características Únicas", textPt: "Conforme o dano acumulado aumenta, mais hematomas e curativos aparecem em seu rosto. Além disso, por ser um boxeador, ele não tem absolutamente nenhum golpe que use as pernas." },
  { titleEn: "[★★☆] Straight Lunge (Neutral Special)", titleJp: "気合いストレート 【通常必殺ワザ】", textJp: "ためている最中や突進中はスーパーアーマー効果があり、ある程度の攻撃を耐えて攻撃できる。最大までためると、通常時より効果が強くなる。", titleJpEn: "Straight Lunge (Neutral Special)", textJpEn: "While charging or lunging, he has a super armor effect, allowing him to endure a certain amount of damage and attack anyway. Charging to maximum makes the effect stronger than usual.", titlePt: "Straight Lunge (Especial Neutro)", textPt: "Enquanto carrega ou avança, ele tem um efeito de super armadura, permitindo suportar uma certa quantidade de dano e atacar mesmo assim. Carregar ao máximo torna o efeito mais forte que o normal." },
  { titleEn: "[★★☆] Flipped Straight Lunge (Neutral Special)", titleJp: "気合いストレートの反転 【通常必殺ワザ】", textJp: "気合いストレートを放つ時、背中側へスティックを倒しておけば、ため具合に関係なく、向き直って出すことができる。", titleJpEn: "Flipped Straight Lunge (Neutral Special)", textJpEn: "When firing Straight Lunge, tilting the stick behind him lets him turn around and use it, regardless of how much it's charged.", titlePt: "Straight Lunge Invertido (Especial Neutro)", textPt: "Ao disparar o Straight Lunge, inclinar o analógico para trás permite virar e usá-lo, independentemente de quanto está carregado." },
  { titleEn: "[★☆☆] Charging KO Uppercut (Neutral Special)", titleJp: "K.O.アッパーカットへの変化 【通常必殺ワザ】", textJp: "ダメージを受けたり攻撃を当てるとK.O.ゲージがたまる。満タンになると、一撃必殺のK.O.アッパーカットが使える。", titleJpEn: "Charging KO Uppercut (Neutral Special)", textJpEn: "Taking damage or landing attacks fills the K.O. Gauge. When it's full, the one-hit-KO K.O. Uppercut can be used.", titlePt: "Carregando o KO Uppercut (Especial Neutro)", textPt: "Receber dano ou acertar ataques enche o K.O. Gauge. Quando está cheio, o K.O. Uppercut de nocaute em um golpe só pode ser usado." },
  { titleEn: "[★★★] Jolt Haymaker (Side Special)", titleJp: "ジョルトブロー 【横必殺ワザ】", textJp: "地上で出すとワザの出始めは無敵状態になる。しかし、空中で出すと無敵状態にならないので注意。", titleJpEn: "Jolt Haymaker (Side Special)", textJpEn: "Using it on the ground grants invincibility at the start of the move. However, be careful, as using it in the air doesn't grant invincibility.", titlePt: "Jolt Haymaker (Especial Lateral)", textPt: "Usá-lo no chão concede invencibilidade no início do golpe. Porém, cuidado, pois usá-lo no ar não concede invencibilidade." },
  { titleEn: "[★☆☆] Jolt Haymaker Warning (Side Special)", titleJp: "ジョルトブローの注意点 【横必殺ワザ】", textJp: "空中で使った後も動けるが、着地するまでは、もう一度出すことはできない。ステージへ戻る時に使う場合は、要注意。", titleJpEn: "Jolt Haymaker Warning (Side Special)", textJpEn: "He can still move after using it in the air, but it can't be used again until he lands. Be especially careful when using it to return to the stage.", titlePt: "Cuidados com o Jolt Haymaker (Especial Lateral)", textPt: "Ele ainda pode se mover depois de usá-lo no ar, mas não pode ser usado novamente até pousar. Cuidado especial ao usá-lo para voltar ao palco." },
  { titleEn: "[★★☆] Jolt Haymaker's Movement Range (Side Special)", titleJp: "ジョルトブローの移動距離 【横必殺ワザ】", textJp: "飛んでいる途中でボタンを押すと早めにパンチが出せる。その分移動距離も短くなるので、状況によって使い分けよう。", titleJpEn: "Jolt Haymaker's Movement Range (Side Special)", textJpEn: "Pressing the button while flying delivers the punch earlier. In exchange, the travel distance becomes shorter, so use it depending on the situation.", titlePt: "O Alcance do Jolt Haymaker (Especial Lateral)", textPt: "Apertar o botão enquanto voa entrega o soco mais cedo. Em troca, a distância percorrida fica mais curta, então use-o dependendo da situação." },
  { titleEn: "[★★☆] Rising Uppercut (Up Special)", titleJp: "ライジングアッパーカット 【上必殺ワザ】", textJp: "強力なアッパーカットをしながら上昇する。空中より地上で出した方がより高く上昇できる。", titleJpEn: "Rising Uppercut (Up Special)", textJpEn: "Rises while delivering a powerful uppercut. Using it on the ground allows for a higher rise than using it in the air.", titlePt: "Rising Uppercut (Especial Cima)", textPt: "Sobe enquanto entrega um uppercut poderoso. Usá-lo no chão permite uma subida mais alta do que usá-lo no ar." },
  { titleEn: "[★☆☆] Slip Counter (Down Special)", titleJp: "スリッピングカウンター 【下必殺ワザ】", textJp: "ダメージを受けたと見せかけて反撃するカウンターワザ。反撃中は無敵なので相手にジャマされない。", titleJpEn: "Slip Counter (Down Special)", textJpEn: "A counter move that feigns taking damage before striking back. He's invincible during the counterattack, so he can't be interrupted.", titlePt: "Slip Counter (Especial Baixo)", textPt: "Um golpe de contra-ataque que finge receber dano antes de revidar. Ele fica invencível durante o contra-ataque, então não pode ser interrompido." },
  { titleEn: "[★☆☆] Giga Mac Rush (Final Smash)", titleJp: "ギガ・マックラッシュ 【最後の切りふだ】", textJp: "ギガ・マックに変身し、猛烈な乱打を加える。最後に繰り出される、必殺のアッパーカットは強烈。", titleJpEn: "Giga Mac Rush (Final Smash)", textJpEn: "Transforms into Giga Mac and unleashes a furious flurry of blows. The final, decisive uppercut he delivers is devastating.", titlePt: "Giga Mac Rush (Final Smash)", textPt: "Transforma-se em Giga Mac e desencadeia uma fúria de golpes. O uppercut final e decisivo que ele entrega é devastador." },
  { titleEn: "[★★☆] Straight Smash (Side Smash Attack)", titleJp: "スマッシュストレート 【横スマッシュ攻撃】", textJp: "横スマッシュ攻撃を使う時に上を入力しておくと、攻撃がアッパーカットに代わり、上方向へふっとばせる。", titleJpEn: "Straight Smash (Side Smash Attack)", textJpEn: "Inputting up while using the side smash attack changes the attack into an uppercut, launching opponents upward.", titlePt: "Straight Smash (Ataque Smash Lateral)", textPt: "Inputar cima enquanto usa o ataque smash lateral muda o ataque para um uppercut, arremessando os adversários para cima." },
  { titleEn: "[★★☆] Angled Straight Smash (Side Smash Attack)", titleJp: "スマッシュストレートの変化 【横スマッシュ攻撃】", textJp: "横スマッシュ攻撃は、入力直後にスティックを上下どちらかに倒すと、ワザが変化。上入力では相手を高く打ち上げ、下入力では攻撃力が高いワザを出せる。", titleJpEn: "Angled Straight Smash (Side Smash Attack)", textJpEn: "The side smash attack changes if the stick is tilted up or down right after inputting it. Inputting up launches opponents high, while inputting down delivers a higher-power move.", titlePt: "Straight Smash Angulado (Ataque Smash Lateral)", textPt: "O ataque smash lateral muda se o analógico for inclinado para cima ou para baixo logo depois de inputado. Inputar cima lança os adversários alto, enquanto inputar baixo entrega um golpe de maior poder." },
  { titleEn: "[★☆☆] Weak Jab (Neutral Air Attack)", titleJp: "苦手ジャブ 【通常空中攻撃】", textJp: "すべての空中攻撃の中で、最もパンチを出すのが早い。スキも小さいというメリットもあるが、ダメージやふっとばし力は弱い。", titleJpEn: "Weak Jab (Neutral Air Attack)", textJpEn: "The fastest punch to come out among all his aerial attacks. It also has the advantage of a small opening, but its damage and knockback are weak.", titlePt: "Weak Jab (Ataque Aéreo Neutro)", textPt: "O soco mais rápido a sair entre todos os seus ataques aéreos. Também tem a vantagem de uma pequena abertura, mas seu dano e arremesso são fracos." },
  { titleEn: "[★☆☆] Power Meter", titleJp: "K.O.ゲージ", textJp: "K.O.ゲージが満タンになった後、時間が経ってからふっとばされると、K.O.ゲージがなくなってしまう。", titleJpEn: "Power Meter", textJpEn: "If he's launched after some time has passed since the K.O. Gauge became full, the K.O. Gauge disappears.", titlePt: "Power Meter", textPt: "Se ele for arremessado depois de um tempo ter passado desde que o K.O. Gauge ficou cheio, o K.O. Gauge desaparece." },
];

async function main() {
  const mac = await db.fighter.findFirst({
    where: { name: "Little Mac" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!mac) { console.log("Little Mac not found"); return; }

  await db.fighter.update({
    where: { id: mac.id },
    data: {
      curatorOverviewEn: "Little Mac, the undersized boxer from Punch-Out!!, is a ground-based glass cannon — his fists hit harder than any fighter his size has a right to, and his Power Meter builds toward a guaranteed one-hit KO uppercut with every exchange. Straight Lunge grants super armor to trade through incoming attacks, and Slip Counter punishes overextension. His fatal flaw is a near-nonexistent recovery and total helplessness in the air, making him a nightmare to fight on the ground but trivial to edge-guard. Little Mac rewards players who stay grounded, bait attacks into his armor, and never get caught off the stage.",
      curatorOverviewPt: "Little Mac, o boxeador de estatura pequena de Punch-Out!!, é um canhão de vidro focado no chão — seus punhos batem mais forte do que qualquer lutador de seu tamanho deveria conseguir, e seu Power Meter se acumula rumo a um uppercut garantido de nocaute em um golpe a cada troca. Straight Lunge concede super armadura para trocar golpes contra ataques recebidos, e Slip Counter pune o excesso de confiança. Sua falha fatal é uma recuperação quase inexistente e total impotência no ar, tornando-o um pesadelo para enfrentar no chão mas trivial de impedir na borda. O Little Mac recompensa jogadores que permanecem no chão, provocam ataques contra sua armadura, e nunca são pegos fora do palco.",
      curatorOverviewJp: "パンチアウト!!の小柄なボクサー、リトル・マックは、地上に特化したガラスの大砲だ――彼の拳は、その体格からは考えられないほど強く当たり、パワーメーターは交戦のたびに確定の一撃必殺アッパーカットへと近づいていく。気合いストレートはスーパーアーマーを付与し、相手の攻撃と引き換えに打ち合え、スリッピングカウンターは無理な攻めを罰する。彼の致命的な弱点は、ほぼ存在しない復帰力と空中での完全な無力さで、地上で戦うには悪夢だが、ガケでは容易に狩れる存在にしている。リトル・マックは、地上にとどまり、相手の攻撃を誘ってアーマーで受け、決してステージ外で捕まらないプレイヤーに応える。",
      curatorOverviewJpEn: "Little Mac, the undersized boxer from Punch-Out!!, is a ground-based glass cannon — his fists hit far harder than his size should allow, and his Power Meter builds toward a guaranteed one-hit-KO uppercut with every exchange. Straight Lunge grants super armor to trade through incoming attacks, and Slip Counter punishes overextension. His fatal weakness is a nearly nonexistent recovery and total helplessness in the air, making him a nightmare to fight on the ground but easy prey at the ledge. Little Mac rewards players who stay grounded, bait attacks into his armor, and never get caught off-stage.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = mac.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = mac.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "Little Mac faces any opponent with his fists. Activating the special move \"Straight Lunge\" first puts him into a charging state. Pressing the button again unleashes a right straight punch forward with power based on the charge. The knockback at maximum charge is immense. While charging, and while attacking at maximum charge, he won't flinch from the opponent's attacks. (FC) Punch-Out!! (1987/11) (Wii) Punch-Out!! (2009/07)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "O Little Mac enfrenta qualquer adversário com os punhos. Ativar o golpe especial \"Straight Lunge\" primeiro o coloca em um estado de carga. Apertar o botão novamente libera um soco reto direito para frente com poder baseado na carga. O arremesso na carga máxima é imenso. Enquanto carrega, e ao atacar com carga máxima, ele não se atordoa com os ataques do adversário. (FC) Punch-Out!! (1987/11) (Wii) Punch-Out!! (2009/07)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = mac.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fix: SSBB "Little Mac" — appears only as an Assist Trophy, not a fighter, in Brawl
  const ssbbAssist = await db.collectible.findFirst({ where: { name: "Little Mac", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true } });
  if (ssbbAssist) {
    await db.collectible.update({ where: { id: ssbbAssist.id }, data: { fighterId: mac.id, videoStartSec: 8525, videoEndSec: 8542 } });
    console.log("✅ SSBB Trophy \"Little Mac\" (Assist Trophy): linkado, vídeo -> 8525-8542 (2:22:05-2:22:22)");
  }

  // Link + normalize legitimate orphans (SSB4_WIIU)
  for (const name of ["Little Mac (Captain Rainbow)", "Giga Mac"]) {
    const item = await db.collectible.findFirst({ where: { name, smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
    if (item) {
      await db.collectible.update({ where: { id: item.id }, data: { smashGameVersion: "SSB4", fighterId: mac.id } });
      console.log(`✅ "${name}" [SSB4_WIIU]: normalizado SSB4, linkado`);
    }
  }

  // NOTE: "Mach Rider" [SSBM] is intentionally NOT linked — unrelated retro character,
  // a false positive from the "Mac" substring search.

  await db.$disconnect();
}
main().catch(console.error);
