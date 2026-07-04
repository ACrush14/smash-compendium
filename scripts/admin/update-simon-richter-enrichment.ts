import { db } from "../../lib/db";

const SIMON_TIPS = [
  {
    titleEn: "[★☆☆] Simon's Origins",
    titleJp: "シモンの初登場作品",
    textJp: "シモンの初登場は、１９８６年発売の『悪魔城ドラキュラ』。不思議な力を秘めたムチを武器に、復活したドラキュラを倒すべく単身城へ乗り込む。",
    titleJpEn: "Simon's Debut Work",
    textJpEn: "Simon's debut was in 1986's Castlevania. Armed with a whip that holds a mysterious power, he storms the castle alone to defeat the resurrected Dracula.",
    titlePt: "As Origens de Simon",
    textPt: "A estreia de Simon foi em Castlevania, lançado em 1986. Armado com um chicote que guarda um poder misterioso, ele invade sozinho o castelo para derrotar o Drácula ressuscitado.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "代々ドラキュラと戦った、「ヴァンパイアハンター」ベルモンド一族の血を受け継ぐ。ムチだけでなく、短剣・オノ・聖水・クロス・懐中時計のサブウェポンも巧みに操る。",
    titleJpEn: "In the Original Games",
    textJpEn: "He carries on the bloodline of the Belmont clan, the \"vampire hunters\" who fought Dracula generation after generation. Besides the whip, he also skillfully wields sub-weapons like daggers, axes, Holy Water, crosses, and even a pocket watch.",
    titlePt: "Nos Jogos Originais",
    textPt: "Ele carrega o sangue do clã Belmont, os \"caçadores de vampiros\" que lutaram contra Drácula geração após geração. Além do chicote, ele também maneja com habilidade subarmas como adagas, machados, água benta, cruzes e até um relógio de bolso.",
  },
  {
    titleEn: "[★☆☆] Axe (Neutral Special)",
    titleJp: "斧 【通常必殺ワザ】",
    textJp: "山なりに飛んでいく、飛び道具。スティックの左右入力で、投げる位置を調整できる。ステージを貫通していくので、思わぬ位置の相手に当たることもある。",
    titleJpEn: "Axe (Neutral Special)",
    textJpEn: "A projectile that arcs through the air when thrown. You can adjust the throwing position with left/right stick input. It pierces through the stage, so it can sometimes hit an opponent in an unexpected spot.",
    titlePt: "Machado (Especial Neutro)",
    textPt: "Um projétil que voa em arco quando arremessado. Você pode ajustar a posição do lançamento com o direcional esquerda/direita. Ele atravessa o cenário, então às vezes pode acertar um oponente em um local inesperado.",
  },
  {
    titleEn: "[★☆☆] Cross (Side Special)",
    titleJp: "クロス 【横必殺ワザ】",
    textJp: "はじき入力で、飛距離と威力がアップする。行きと戻りで２回攻撃を当てられるが、行きの方が攻撃力が高い。",
    titleJpEn: "Cross (Side Special)",
    textJpEn: "A flick input increases the distance and power. It can hit twice, both on the way out and the way back, but the outward throw deals more damage.",
    titlePt: "Cruz (Especial Lateral)",
    textPt: "Um input rápido aumenta o alcance e o poder. Pode acertar duas vezes, na ida e na volta, mas o lançamento de ida causa mais dano.",
  },
  {
    titleEn: "[★☆☆] Uppercut (Up Special)",
    titleJp: "アッパー 【上必殺ワザ】",
    textJp: "飛び上がりながら、連続ヒットするアッパーをくり出す。最後の一撃が、相手をもっとも遠くへふっとばす。",
    titleJpEn: "Uppercut (Up Special)",
    textJpEn: "Unleashes a multi-hit uppercut while leaping upward. The final hit sends the opponent flying the farthest.",
    titlePt: "Uppercut (Especial Superior)",
    textPt: "Desfere um soco ascendente de múltiplos acertos enquanto salta para cima. O golpe final é o que lança o oponente mais longe.",
  },
  {
    titleEn: "[★☆☆] Holy Water (Down Special)",
    titleJp: "聖水 【下必殺ワザ】",
    textJp: "前方に聖水の入った瓶を投げる。相手や地形に当たると、赤い火柱が上がる。火柱の連続攻撃で相手の動きを抑え、ムチなどで追撃するのが効果的。",
    titleJpEn: "Holy Water (Down Special)",
    textJpEn: "Throw a bottle of Holy Water forward. If it hits an opponent or the terrain, a red pillar of flame rises up. It's effective to pin down the opponent's movement with repeated hits from the flame pillar, then follow up with the whip or other attacks.",
    titlePt: "Água Benta (Especial Inferior)",
    textPt: "Arremessa um frasco de água benta para frente. Se atingir um oponente ou o cenário, uma coluna de fogo vermelha se ergue. É eficaz conter o movimento do oponente com acertos repetidos da coluna de fogo e depois seguir com o chicote ou outros ataques.",
  },
  {
    titleEn: "[★☆☆] Grand Cross (Final Smash)",
    titleJp: "グランドクロス 【最後の切りふだ】",
    textJp: "前方に巨大な棺を出現させ、触れた相手を封じ込める。聖水の火柱で拘束したり、相手が倒れている時を狙うと当てやすい。",
    titleJpEn: "Grand Cross (Final Smash)",
    textJpEn: "Summons a giant coffin in front of him that traps any opponent it touches. It's easier to land if you restrain the opponent with the Holy Water's flame pillar first, or target them while they're down.",
    titlePt: "Cruz Suprema (Ataque Final)",
    textPt: "Invoca um caixão gigante à frente que prende qualquer oponente que tocar nele. É mais fácil de acertar se você primeiro prender o oponente com a coluna de fogo da água benta, ou mirar nele enquanto está caído.",
  },
  {
    titleEn: "[★☆☆] Sliding (Down Tilt Attack)",
    titleJp: "スライディング 【下強攻撃】",
    textJp: "スライディング中、再度攻撃ボタンを押せば、追加の飛び蹴りに派生することが可能。コンボや奇襲に利用できる。",
    titleJpEn: "Sliding (Down Tilt Attack)",
    textJpEn: "While sliding, press the attack button again to follow up with an additional flying kick. It can be used for combos or surprise attacks.",
    titlePt: "Deslizamento (Ataque Inclinado Baixo)",
    textPt: "Durante o deslizamento, pressione o botão de ataque novamente para emendar um chute voador adicional. Pode ser usado em combos ou ataques surpresa.",
  },
  {
    titleEn: "[★☆☆] Holding the Whip",
    titleJp: "ウィップホールド",
    textJp: "攻撃ボタンを押し続けると、その場でムチを垂らしたままにできる。スティックをぐるぐると回転させれば、振り回すように動かせる。",
    titleJpEn: "Whip Hold",
    textJpEn: "Hold down the attack button to let the whip dangle in place. Rotate the control stick in a circular motion to swing it around.",
    titlePt: "Segurando o Chicote",
    textPt: "Segure o botão de ataque para deixar o chicote pendurado no lugar. Gire o direcional em movimento circular para balançá-lo.",
  },
];

const RICHTER_TIPS = [
  {
    titleEn: "[★☆☆] Richter's Origins",
    titleJp: "リヒターの初登場作品",
    textJp: "リヒターの初登場は１９９３年発売の『悪魔城ドラキュラX 血の輪廻(ロンド)』。囚われた恋人アネットの救出と、ドラキュラ伯爵を倒すために城へと乗り込む。",
    titleJpEn: "Richter's Debut Work",
    textJpEn: "Richter's debut was in Castlevania: Rondo of Blood, released in 1993. He storms the castle to rescue his captured lover Annette and defeat Count Dracula.",
    titlePt: "As Origens de Richter",
    textPt: "A estreia de Richter foi em Castlevania: Rondo of Blood, lançado em 1993. Ele invade o castelo para resgatar sua amada capturada, Annette, e derrotar o Conde Drácula.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "先祖代々伝わる聖なるムチと、様々なサブウェポンや宙返りのような体術も使う。続編の『悪魔城ドラキュラX 月下の夜想曲』では、ルート次第でラスボスとして登場。",
    titleJpEn: "In the Original Games",
    textJpEn: "He wields the holy whip passed down through his ancestors, along with various sub-weapons and acrobatic techniques like somersaults. In the sequel, Castlevania: Symphony of the Night, he can appear as the final boss depending on the route taken.",
    titlePt: "Nos Jogos Originais",
    textPt: "Ele usa o chicote sagrado transmitido por seus ancestrais, junto com várias subarmas e técnicas acrobáticas como cambalhotas. Na sequência, Castlevania: Symphony of the Night, ele pode aparecer como chefe final dependendo da rota escolhida.",
  },
  {
    titleEn: "[★☆☆] Axe (Neutral Special)",
    titleJp: "斧 【通常必殺ワザ】",
    textJp: "山なりに飛んでいく、飛び道具。スティックの左右入力で、投げる位置を調整できる。ステージを貫通するため、離れた位置にいる相手を狙うことができる。",
    titleJpEn: "Axe (Neutral Special)",
    textJpEn: "A projectile that arcs through the air when thrown. You can adjust the throwing position with left/right stick input. Since it pierces through the stage, you can target opponents even in a distant spot.",
    titlePt: "Machado (Especial Neutro)",
    textPt: "Um projétil que voa em arco quando arremessado. Você pode ajustar a posição do lançamento com o direcional esquerda/direita. Como atravessa o cenário, você pode mirar em oponentes mesmo em um local distante.",
  },
  {
    titleEn: "[★☆☆] Cross (Side Special)",
    titleJp: "クロス 【横必殺ワザ】",
    textJp: "はじき入力で、飛距離と威力がアップする。行きと戻りで２回攻撃を当てられるが、行きの方が攻撃力が高い。",
    titleJpEn: "Cross (Side Special)",
    textJpEn: "A flick input increases the distance and power. It can hit twice, both on the way out and the way back, but the outward throw deals more damage.",
    titlePt: "Cruz (Especial Lateral)",
    textPt: "Um input rápido aumenta o alcance e o poder. Pode acertar duas vezes, na ida e na volta, mas o lançamento de ida causa mais dano.",
  },
  {
    titleEn: "[★☆☆] Uppercut (Up Special)",
    titleJp: "アッパー 【上必殺ワザ】",
    textJp: "飛び上がりながら連続ヒットするアッパーをくり出すワザ。最後の一撃が、相手をもっとも遠くへふっとばす。",
    titleJpEn: "Uppercut (Up Special)",
    textJpEn: "A move that unleashes a multi-hit uppercut while leaping upward. The final hit sends the opponent flying the farthest.",
    titlePt: "Uppercut (Especial Superior)",
    textPt: "Uma técnica que desfere um soco ascendente de múltiplos acertos enquanto salta para cima. O golpe final é o que lança o oponente mais longe.",
  },
  {
    titleEn: "[★☆☆] Holy Water (Down Special)",
    titleJp: "聖水 【下必殺ワザ】",
    textJp: "前方に聖水の入った瓶を投げる。相手や地形に当たると、青い火柱が上がる。火柱の連続攻撃で相手の動きを抑え、ムチなどで追撃するのが効果的。",
    titleJpEn: "Holy Water (Down Special)",
    textJpEn: "Throw a bottle of Holy Water forward. If it hits an opponent or the terrain, a blue pillar of flame rises up. It's effective to pin down the opponent's movement with repeated hits from the flame pillar, then follow up with the whip or other attacks.",
    titlePt: "Água Benta (Especial Inferior)",
    textPt: "Arremessa um frasco de água benta para frente. Se atingir um oponente ou o cenário, uma coluna de fogo azul se ergue. É eficaz conter o movimento do oponente com acertos repetidos da coluna de fogo e depois seguir com o chicote ou outros ataques.",
  },
  {
    titleEn: "[★☆☆] Grand Cross (Final Smash)",
    titleJp: "グランドクロス 【最後の切りふだ】",
    textJp: "前方に巨大な棺を出現させ、触れた相手を封じ込める。聖水の火柱で拘束したり、相手が倒れている時を狙うと当てやすい。",
    titleJpEn: "Grand Cross (Final Smash)",
    textJpEn: "Summons a giant coffin in front of him that traps any opponent it touches. It's easier to land if you restrain the opponent with the Holy Water's flame pillar first, or target them while they're down.",
    titlePt: "Cruz Suprema (Ataque Final)",
    textPt: "Invoca um caixão gigante à frente que prende qualquer oponente que tocar nele. É mais fácil de acertar se você primeiro prender o oponente com a coluna de fogo da água benta, ou mirar nele enquanto está caído.",
  },
];

async function applyTips(fighterName: string, tipsData: typeof SIMON_TIPS) {
  const f = await db.fighter.findFirst({
    where: { name: fighterName },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!f) { console.log(`${fighterName} not found`); return; }

  let updated = 0;
  for (const data of tipsData) {
    const tip = f.tips.find(t => t.titleEn === data.titleEn);
    if (!tip) { console.log(`  ⚠️  Tip não encontrada (${fighterName}): "${data.titleEn}"`); continue; }
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
  console.log(`✅ ${fighterName}: ${updated}/${tipsData.length} tips atualizadas`);
}

async function main() {
  await applyTips("Simon", SIMON_TIPS);
  await applyTips("Richter", RICHTER_TIPS);

  await db.fighter.update({
    where: { id: (await db.fighter.findFirstOrThrow({ where: { name: "Simon" } })).id },
    data: {
      curatorOverviewEn: "Simon plays like a zoner built around whip range and hard-to-avoid projectiles. Axe arcs over shields and travels through the whole stage, so it can catch opponents in spots they don't expect, and Cross rewards a flick input with a stronger throw that hits both going out and coming back. Holy Water is the centerpiece of his neutral game: its flame pillar locks an opponent in place, which sets up follow-up whip hits or, better yet, Grand Cross — a command grab that's far easier to land on someone already pinned by fire or knocked down. Uppercut doubles as recovery and a strong vertical kill option thanks to its multi-hit into a big final launch, and outside of straight damage, Sliding into a follow-up kick and the idle Whip Hold both give him extra tools for combos, spacing, or catching a rolling opponent off guard.",
      curatorOverviewPt: "Simon joga como um controlador de zona construído em torno do alcance do chicote e projéteis difíceis de evitar. O Machado voa em arco por cima de escudos e atravessa o cenário inteiro, podendo pegar oponentes em posições inesperadas, e a Cruz recompensa um input rápido com um lançamento mais forte que acerta tanto na ida quanto na volta. Água Benta é a peça central do seu jogo neutro: sua coluna de fogo prende o oponente no lugar, preparando o terreno para golpes de chicote em sequência ou, melhor ainda, a Cruz Suprema — uma pegada comandada muito mais fácil de acertar em alguém já preso pelo fogo ou caído. Uppercut funciona tanto como recuperação quanto como uma forte opção de nocaute vertical graças aos múltiplos acertos que terminam num grande lançamento final, e além do dano puro, o Deslizamento com chute em sequência e o Chicote em espera parado dão a ele ferramentas extras para combos, controle de espaço, ou pegar um oponente rolando de surpresa.",
      curatorOverviewJp: "シモンはムチのリーチと避けにくい飛び道具を軸にしたゾーニング型のファイターだ。「斧」はシールドの上を山なりに越え、ステージ全体を貫通するため、相手の思わぬ位置に当たることがある。「クロス」ははじき入力で強化された投げが行きと帰りの両方で命中する。「聖水」は彼の中央戦術の要で、火柱が相手をその場に縛り付け、ムチでの追撃や、さらに強力な「グランドクロス」——既に炎で拘束されているか倒れている相手にはるかに当てやすいつかみ技——への布石となる。「アッパー」は復帰技と、連続ヒットから大きな最終ふっとばしにつながる強力な縦の撃墜手段を兼ねる。純粋なダメージ以外にも、「スライディング」からの追加キックと、その場で待機する「ウィップホールド」が、コンボや間合い管理、転がる相手への奇襲といった追加の武器を彼に与えている。",
      curatorOverviewJpEn: "Simon is a zoning-type fighter built around his whip's reach and hard-to-avoid projectiles. \"Axe\" arcs over shields and pierces through the entire stage, so it can sometimes hit an opponent in an unexpected spot. \"Cross\" hits with a throw strengthened by a flick input, landing on both the way out and the way back. \"Holy Water\" is the core of his neutral game: the flame pillar pins the opponent in place, setting up whip follow-ups or, even better, \"Grand Cross\" — a grab move that's far easier to land on an opponent already restrained by fire or knocked down. \"Uppercut\" doubles as a recovery move and a strong vertical KO option thanks to its multi-hit leading into a large final launch. Beyond pure damage, the follow-up kick from \"Sliding\" and the idle \"Whip Hold\" give him extra tools for combos, spacing management, and ambushing a rolling opponent.",
    },
  });
  console.log("✅ Simon: Curator Overview (4 langs)");

  await db.fighter.update({
    where: { id: (await db.fighter.findFirstOrThrow({ where: { name: "Richter" } })).id },
    data: {
      curatorOverviewEn: "As Simon's Echo Fighter, Richter runs the exact same whip-and-Holy-Water zoning kit, down to Axe's stage-piercing arc and Grand Cross punishing a pinned or grounded opponent — the only real difference is cosmetic, with his Holy Water throwing up a blue flame pillar instead of red. If you already know Simon's spacing game around Axe, Cross, and the fire-pillar setups into Grand Cross, that knowledge carries over to Richter one-for-one.",
      curatorOverviewPt: "Como Echo Fighter de Simon, Richter usa exatamente o mesmo kit de zoneamento com chicote e Água Benta, incluindo o arco do Machado que atravessa o cenário e a Cruz Suprema punindo um oponente preso ou caído — a única diferença real é estética, com sua Água Benta erguendo uma coluna de fogo azul em vez de vermelha. Quem já domina o jogo de posicionamento de Simon em torno do Machado, da Cruz e das armadilhas de fogo que preparam a Cruz Suprema, leva esse conhecimento direto para Richter.",
      curatorOverviewJp: "シモンのエコーファイターであるリヒターは、ステージを貫通する「斧」の軌道や、拘束・ダウン中の相手を punish する「グランドクロス」も含め、まったく同じムチと聖水を軸にしたゾーニング戦術を使う——唯一の実質的な違いは見た目で、彼の「聖水」は赤ではなく青い火柱を上げる。シモンの「斧」「クロス」、そして火柱から「グランドクロス」へとつなげる立ち回りをすでに理解していれば、その知識はそのままリヒターにも通用する。",
      curatorOverviewJpEn: "Richter, Simon's Echo Fighter, uses the exact same whip-and-Holy-Water-based zoning tactics, including \"Axe's\" stage-piercing trajectory and \"Grand Cross\" punishing a restrained or downed opponent — the only real difference is visual, with his \"Holy Water\" raising a blue flame pillar instead of red. If you already understand Simon's positioning around \"Axe,\" \"Cross,\" and setting up \"Grand Cross\" from the flame pillar, that knowledge carries directly over to Richter.",
    },
  });
  console.log("✅ Richter: Curator Overview (4 langs)");

  await db.$disconnect();
}
main().catch(console.error);
