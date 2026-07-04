import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] King K. Rool's Origins",
    titleJp: "キングクルールの初登場作品",
    textJp: "キングクルールの初登場は、１９９４年に発売された『スーパードンキーコング』。ドンキーコング達のバナナを盗んでいった、クレムリン軍団の司令長官。",
    titleJpEn: "King K. Rool's Debut Work",
    textJpEn: "King K. Rool's debut was in Donkey Kong Country, released in 1994. He is the commander-in-chief of the Kremling Krew, who stole the Kongs' bananas.",
    titlePt: "As Origens de King K. Rool",
    textPt: "A estreia de King K. Rool foi em Donkey Kong Country, lançado em 1994. Ele é o comandante-chefe do Exército Kremling, que roubou as bananas dos Kongs.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "『スーパードンキーコング』のラスボスで登場し、戦いの途中でやられたフリをする。「THE END？」で終わる偽のエンディングのあと、起き上がって攻撃をしかけてくる。",
    titleJpEn: "In the Original Games",
    textJpEn: "He appears as the final boss of Donkey Kong Country, feigning defeat partway through the battle. After the fake ending that reads \"THE END?\", he gets back up and attacks again.",
    titlePt: "Nos Jogos Originais",
    textPt: "Ele aparece como o chefe final de Donkey Kong Country, fingindo estar derrotado no meio da batalha. Após o final falso que exibe \"THE END?\", ele se levanta e ataca novamente.",
  },
  {
    titleEn: "[★☆☆] Blunderbuss (Neutral Special)",
    titleJp: "パイレーツキャノン 【通常必殺ワザ】",
    textJp: "海賊銃を取り出し、スピードは遅いが攻撃力の高い鉄球を発射する。必殺ワザボタンを押し続けると、鉄球を吸い込んでから撃ち出して攻撃できる。",
    titleJpEn: "Pirate Cannon (Neutral Special)",
    textJpEn: "Pulls out a pirate-themed firearm and fires an iron ball that's slow but powerful. If you keep holding the special-move button, you can suck the iron ball back in and then fire it out again.",
    titlePt: "Canhão Pirata (Especial Neutro)",
    textPt: "Saca uma arma de fogo com tema pirata e dispara uma bola de ferro que é lenta, mas poderosa. Se continuar segurando o botão de golpe especial, você pode sugar a bola de ferro de volta e depois dispará-la novamente.",
  },
  {
    titleEn: "[★☆☆] Blunderbuss Suck Up (Neutral Special)",
    titleJp: "パイレーツキャノンの吸い込み 【通常必殺ワザ】",
    textJp: "ファイターを吸い込むだけではなく、発射した鉄球も吸い込める。吸い込んだ後は、スティックで正面、真上、後方の３方向に打ち出せる。",
    titleJpEn: "Pirate Cannon Suction (Neutral Special)",
    textJpEn: "It can suck in not just fighters, but also the iron ball that was fired. After sucking something in, you can launch it in one of three directions with the stick: forward, straight up, or backward.",
    titlePt: "Sucção do Canhão Pirata (Especial Neutro)",
    textPt: "Pode sugar não só lutadores, mas também a bola de ferro disparada. Depois de sugar algo, você pode lançá-lo em três direções com o direcional: para frente, para cima, ou para trás.",
  },
  {
    titleEn: "[★★☆] Slipping through Platforms while Vacuuming (Neutral Special)",
    titleJp: "吸い込み中のすり抜け床 【通常必殺ワザ】",
    textJp: "必殺ワザボタン長押しによる銃の吸い込み攻撃中は、下入力で、すり抜け床を降りることができる。",
    titleJpEn: "Slipping Through Platforms While Sucking In (Neutral Special)",
    textJpEn: "While using the gun's suction attack by holding the special-move button, you can drop through soft platforms by pressing down on the stick.",
    titlePt: "Atravessando Plataformas Durante a Sucção (Especial Neutro)",
    textPt: "Enquanto usa o ataque de sucção da arma segurando o botão de golpe especial, você pode descer por plataformas soltas pressionando o direcional para baixo.",
  },
  {
    titleEn: "[★☆☆] Crownerang (Side Special)",
    titleJp: "クラウンスロー 【横必殺ワザ】",
    textJp: "王冠をブーメランのように投げるワザ。動作中にスーパーアーマー効果があり、弱い攻撃なら耐えられる。投げた王冠をキャッチし損ねたら、回収するまで使えない。",
    titleJpEn: "Crown Throw (Side Special)",
    textJpEn: "A move that throws the crown like a boomerang. While it's in motion, King K. Rool has super armor and can withstand weak attacks. If he fails to catch the thrown crown, he can't use it again until he retrieves it.",
    titlePt: "Arremesso da Coroa (Especial Lateral)",
    textPt: "Uma técnica que arremessa a coroa como um bumerangue. Enquanto ela está em movimento, King K. Rool tem superarmadura e resiste a ataques fracos. Se ele não conseguir pegar a coroa de volta, não pode usá-la novamente até recuperá-la.",
  },
  {
    titleEn: "[★☆☆] The Crown as an Item (Side Special)",
    titleJp: "アイテムになる王冠 【横必殺ワザ】",
    textJp: "地面に落ちた王冠は、他のファイターがアイテムとして利用することもできる。場外へ消えてしまった王冠は、一定時間が経過するとステージ上に復活する。",
    titleJpEn: "The Crown as an Item (Side Special)",
    textJpEn: "A crown that falls to the ground can also be picked up and used as an item by other fighters. A crown that vanishes off the edge of the stage will reappear on the stage after some time has passed.",
    titlePt: "A Coroa como Item (Especial Lateral)",
    textPt: "Uma coroa que cai no chão também pode ser pega e usada como item por outros lutadores. Uma coroa que desaparece para fora do palco reaparece no palco depois de um tempo.",
  },
  {
    titleEn: "[★☆☆] Propellerpack (Up Special)",
    titleJp: "フライングバックパック 【上必殺ワザ】",
    textJp: "スティックを倒した方向に進み、かなりの距離を移動できる。プロペラ部分で攻撃することもできる。",
    titleJpEn: "Flying Backpack (Up Special)",
    textJpEn: "Moves in the direction the stick is tilted, covering quite a long distance. You can also attack with the propeller part.",
    titlePt: "Mochila Voadora (Especial Superior)",
    textPt: "Move-se na direção em que o direcional é inclinado, cobrindo uma distância considerável. Você também pode atacar com a parte da hélice.",
  },
  {
    titleEn: "[★☆☆] Gut Check (Down Special)",
    titleJp: "ボディカウンター 【下必殺ワザ】",
    textJp: "おなかを突き出すカウンターワザ。おなかで受けた攻撃に対して反撃する。直接攻撃だけではなく、飛び道具も反射できるが、背中側からの攻撃には効果なし。",
    titleJpEn: "Body Counter (Down Special)",
    textJpEn: "A counter move where he thrusts out his belly. He counterattacks against attacks received on his belly. It can reflect not only direct attacks but also projectiles, though it has no effect against attacks from behind.",
    titlePt: "Contra-ataque Corporal (Especial Inferior)",
    textPt: "Uma técnica de contra-ataque em que ele estufa a barriga. Ele revida contra ataques recebidos na barriga. Pode refletir não só ataques diretos, mas também projéteis, embora não tenha efeito contra ataques vindos de trás.",
  },
  {
    titleEn: "[★★☆] Gut Check Behind (Down Special)",
    titleJp: "背後へのボディカウンター 【下必殺ワザ】",
    textJp: "カウンター成功後、すぐにキングクルールの後ろ方向へ入力すれば、ふり返ってカウンター攻撃を出すこともできる。",
    titleJpEn: "Body Counter Behind (Down Special)",
    textJpEn: "After a successful counter, if you immediately input the direction behind King K. Rool, he can turn around and unleash a counterattack.",
    titlePt: "Contra-ataque Corporal Reverso (Especial Inferior)",
    textPt: "Após um contra-ataque bem-sucedido, se você inputar imediatamente a direção atrás de King K. Rool, ele pode se virar e desferir um contra-ataque.",
  },
  {
    titleEn: "[★☆☆] Blast-o-Matic (Final Smash)",
    titleJp: "ブラストマティック 【最後の切りふだ】",
    textJp: "要塞島に搭載された兵器、「ブラストマティック砲」でDKアイランドごと撃ち抜く。突進でふっとばした相手、すべてを巻き込むことができる。",
    titleJpEn: "Blast-o-Matic (Final Smash)",
    textJpEn: "Blasts through Donkey Kong Island itself with the \"Blast-o-Matic Cannon,\" a weapon mounted on the fortress island. It can catch every opponent launched by the initial charge.",
    titlePt: "Blast-o-Matic (Ataque Final)",
    textPt: "Destrói a própria Ilha do Donkey Kong com o \"Canhão Blast-o-Matic\", uma arma montada na ilha-fortaleza. Pode envolver todos os oponentes lançados pela investida inicial.",
  },
  {
    titleEn: "[★☆☆] Piledriver (Downward Throw)",
    titleJp: "パイルハンマー 【下投げ】",
    textJp: "つかんだファイターを地面に埋めることができる。相手の蓄積ダメージが高いほど、埋まっている時間が長くなる。",
    titleJpEn: "Piledriver (Down Throw)",
    textJpEn: "Can bury a grabbed fighter into the ground. The higher the opponent's accumulated damage, the longer they stay buried.",
    titlePt: "Cravação (Arremesso para Baixo)",
    textPt: "Pode enterrar um lutador agarrado no chão. Quanto maior o dano acumulado do oponente, mais tempo ele fica enterrado.",
  },
  {
    titleEn: "[★★★] Belly Super Armor",
    titleJp: "おなかのスーパーアーマー",
    textJp: "横強攻撃や通常空中攻撃など、一部のワザは、おなかのスーパーアーマー状態になり、相手のワザを耐えながら攻撃することができる。",
    titleJpEn: "Belly Super Armor",
    textJpEn: "Some moves, such as the side tilt attack and neutral aerial attack, put his belly into a super armor state, letting him attack while withstanding the opponent's moves.",
    titlePt: "Superarmadura da Barriga",
    textPt: "Alguns golpes, como o ataque inclinado lateral e o ataque aéreo neutro, colocam sua barriga em estado de superarmadura, permitindo atacar enquanto resiste aos golpes do oponente.",
  },
  {
    titleEn: "[★★★] Belly Crack",
    titleJp: "おなかのヒビ",
    textJp: "おなかのスーパーアーマーはとても頼りになるが、おなかで攻撃を受けるとどんどんヒビが入っていき、限界を超えるとふらふら状態になってしまう。",
    titleJpEn: "Belly Crack",
    textJpEn: "The belly's super armor is very reliable, but taking hits on the belly causes cracks to gradually form, and once it exceeds its limit, he'll enter a dazed state.",
    titlePt: "Rachadura na Barriga",
    textPt: "A superarmadura da barriga é bem confiável, mas receber ataques na barriga faz rachaduras aparecerem gradualmente, e quando ultrapassa o limite, ele entra em estado atordoado.",
  },
];

async function main() {
  const kkr = await db.fighter.findFirst({
    where: { name: "King K. Rool" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!kkr) { console.log("King K. Rool not found"); return; }

  let updated = 0;
  for (const data of TIPS) {
    const tip = kkr.tips.find(t => t.titleEn === data.titleEn);
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

  // Bug: troféu SSBB órfão (fighterId null) — vídeo já estava correto (3127-3144 = 52:07-52:24), só faltava o link.
  await db.collectible.update({
    where: { id: "TROPHY-SSBB-King_K_Rool" },
    data: { fighterId: kkr.id },
  });
  console.log("✅ Troféu SSBB órfão linkado ao fighterId de King K. Rool");

  // Bug: videoEndSec2 corrompido (112800) no troféu SSB4 — corrigido pra 1880 (31:20, 3DS)
  await db.collectible.update({
    where: { id: "TROPHY-SSB4-King K. Rool-King K. Rool" },
    data: { videoEndSec2: 1880 },
  });
  console.log("✅ Vídeo 3DS do troféu SSB4 corrigido: 1869-1880");

  await db.fighter.update({
    where: { id: kkr.id },
    data: {
      curatorOverviewEn: "King K. Rool's whole kit revolves around his belly and his gun. Blunderbuss fires a slow cannonball that can be sucked back in and redirected three ways, and holding the suck-in lets him drop through soft platforms — useful for both offense and getting under a ledge. Gut Check is a full-body counter that reflects projectiles as well as melee hits (just not from behind), and a handful of his other moves put his belly in super armor outright, letting him tank a hit and swing back — though enough belly damage cracks that armor and leaves him dazed. Crownerang doubles as a projectile and a temporary super armor state while it's out, but drop it and it becomes a pickup item on the ground until he recovers it. Piledriver buries an opponent for longer the more damage they're carrying, and Blast-o-Matic can wipe out an entire group caught in its initial blast — between the belly gimmick and the gun, he punishes players who don't respect his neutral game.",
      curatorOverviewPt: "Todo o kit de King K. Rool gira em torno da barriga e da arma. Blunderbuss dispara uma bala de canhão lenta que pode ser sugada de volta e redirecionada em três direções, e segurar a sucção permite atravessar plataformas soltas — útil tanto pra ataque quanto pra passar por baixo de uma borda. Gut Check é um contra-ataque de corpo inteiro que reflete tanto projéteis quanto golpes corpo a corpo (só não pelas costas), e vários de seus outros golpes colocam a barriga em superarmadura, permitindo aguentar um golpe e revidar — embora dano suficiente na barriga rache essa armadura e o deixe atordoado. Crownerang funciona tanto como projétil quanto como um estado temporário de superarmadura enquanto está no ar, mas se ele não pegá-la de volta, ela vira um item no chão até ele recuperá-la. Piledriver enterra um oponente por mais tempo quanto maior o dano acumulado dele, e Blast-o-Matic pode varrer um grupo inteiro pego na explosão inicial — entre a mecânica da barriga e a arma, ele pune quem não respeita o jogo neutro dele.",
      curatorOverviewJp: "キングクルールの戦術はすべて、おなかと銃を中心に構成されている。「パイレーツキャノン」は遅い砲弾を発射し、吸い込んで３方向に打ち出し直せる。吸い込みを長押しすれば、すり抜け床を降りることもでき、攻撃にも着地にも役立つ。「ボディカウンター」は直接攻撃だけでなく飛び道具も反射する全身カウンターだ（背後からの攻撃には無効）。他にもいくつかの技はおなかがスーパーアーマー状態になり、相手の攻撃を耐えながら反撃できるが、おなかへのダメージが蓄積するとその装甲にヒビが入り、ふらふら状態になってしまう。「クラウンスロー」は飛び道具であると同時に、飛んでいる間は一時的なスーパーアーマー状態も兼ねるが、キャッチし損ねると回収するまで地面のアイテムになってしまう。「パイルハンマー」は相手の蓄積ダメージが高いほど埋まる時間が長くなり、「ブラストマティック」は最初の爆風に巻き込んだ相手をまとめて一掃できる——おなかのギミックと銃の組み合わせにより、彼の中央戦術を軽視するプレイヤーを厳しく罰する。",
      curatorOverviewJpEn: "All of King K. Rool's tactics are built around his belly and his gun. \"Pirate Cannon\" fires a slow cannonball that can be sucked in and fired out again in three directions. Holding the suction also lets him drop through soft platforms, useful both for attacking and for landing. \"Body Counter\" is a full-body counter that reflects not just direct attacks but projectiles too (though it doesn't work against attacks from behind). Several of his other moves also put his belly into a super armor state, letting him counterattack while withstanding the opponent's attack, but as damage accumulates on his belly, cracks form in that armor, and eventually he'll enter a dazed state. \"Crown Throw\" is a projectile that also doubles as a temporary super armor state while it's in flight, but if he fails to catch it, it becomes a pickup item on the ground until he retrieves it. \"Piledriver\" buries an opponent longer the higher their accumulated damage, and \"Blast-o-Matic\" can wipe out every opponent caught in its initial blast at once — between the belly gimmick and the gun, he harshly punishes players who don't respect his neutral game.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  await db.fighter.update({ where: { id: kkr.id }, data: { curationStatus: "approved" } });
  console.log("✅ King K. Rool aprovado");

  await db.$disconnect();
}
main().catch(console.error);
