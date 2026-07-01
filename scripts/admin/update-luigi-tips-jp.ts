import { db } from "../../lib/db";

// SSB64 bio JP — wikiwiki.jp/smashbros/ルイージ (64キャラクター紹介)
const SSB64_BIO_JP = "兄であるマリオの陰に隠れがちだが、実はひそかな人気者である。マリオより長身で、ジャンプ力も勝っている。『スーパーマリオ64』には出番が無かったが、『マリオカート64』ではその健在ぶりをいかんなく発揮した。控えめな印象があるだけに、今回のエントリーに期待してるファンも多い。";
const SSB64_BIO_JPEN = "Though often hidden in the shadow of his older brother Mario, he's actually secretly quite popular. He's taller than Mario and has a higher jump. He didn't appear in \"Super Mario 64,\" but he fully showed off his presence in \"Mario Kart 64.\" Precisely because he tends to stay in the background, many fans have high hopes for his entry this time.";
const SSB64_BIO_PT = "Embora costume ficar à sombra de seu irmão mais velho, Mario, ele é secretamente bastante popular. É mais alto que o Mario e pula mais alto. Não apareceu em \"Super Mario 64\", mas mostrou totalmente sua presença em \"Mario Kart 64\". Justamente por tender a ficar em segundo plano, muitos fãs têm grandes esperanças para sua participação desta vez.";

// Tips SSBU oficiais — wikiwiki.jp/ssbswitch (fornecido pelo usuário 2026-07-01)
const LUIGI_TIPS = [
  {
    titleEn: "[★☆☆] Luigi's Origins",
    titleJp: "ルイージの初登場作品",
    textJp: "ルイージの初登場作品は１９８３年発売の『マリオブラザーズ』。当初は白いシャツに白い帽子、緑のオーバーオール姿だった。",
    titleJpEn: "Luigi's Origins",
    textJpEn: "Luigi's debut was \"Mario Bros.,\" released in 1983. He originally wore a white shirt, a white cap, and green overalls.",
    titlePt: "As Origens do Luigi",
    textPt: "O debut do Luigi foi \"Mario Bros.\", lançado em 1983. Originalmente ele usava camisa branca, boné branco e macacão verde.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "『マリオシリーズ』で、主に2Pキャラクターとして登場する、マリオの双子の弟。少し臆病だが、マリオを助けるために奮闘する一面も。",
    titleJpEn: "In His Series",
    textJpEn: "In the \"Mario\" series, he mainly appears as the Player 2 character — Mario's twin younger brother. He's a bit cowardly, but also strives hard to help Mario.",
    titlePt: "Na Série Original",
    textPt: "Na série \"Mario\", ele geralmente aparece como o personagem do Jogador 2 — o irmão gêmeo mais novo do Mario. Ele é um pouco covarde, mas também se esforça bastante para ajudar o Mario.",
  },
  {
    titleEn: "[★☆☆] First Starring Role",
    titleJp: "初めての主役",
    textJp: "大々的に主役として活躍したのは、２００１年発売の『ルイージマンション』。「オバキューム」の登場もこの作品から。定番であるジャンプアクションがなかった。",
    titleJpEn: "First Starring Role",
    textJpEn: "His big break as the main protagonist came in \"Luigi's Mansion,\" released in 2001. The Poltergust also debuted in this game, which notably had no jump action — a series staple elsewhere.",
    titlePt: "Primeiro Papel Principal",
    textPt: "Seu grande destaque como protagonista veio em \"Luigi's Mansion\", lançado em 2001. O Poltergust também estreou neste jogo, que notavelmente não tinha ação de pulo — um elemento comum na série em outros títulos.",
  },
  {
    titleEn: "[★☆☆] Fireball (Neutral Special)",
    titleJp: "ファイアボール 【通常必殺ワザ】",
    textJp: "まっすぐ飛ぶ緑の火球は、飛距離こそマリオより短いけれど、威力はルイージの方が少し高く、カベで反射する特徴がある。",
    titleJpEn: "Fireball (Neutral Special)",
    textJpEn: "The green fireball flies straight and travels a shorter distance than Mario's, but Luigi's has slightly more power and bounces off walls.",
    titlePt: "Bola de Fogo (Especial Neutro)",
    textPt: "A bola de fogo verde voa reto e percorre uma distância menor que a do Mario, mas a do Luigi tem um pouco mais de poder e quica em paredes.",
  },
  {
    titleEn: "[★★☆] Green Missile's Vulnerability (Side Special)",
    titleJp: "ルイージロケットのスキ 【横必殺ワザ】",
    textJp: "カベに当たると、頭がカベに突きささることがある。頭が抜けるまでは一切行動できないので、スキだらけ。",
    titleJpEn: "Green Missile's Vulnerability (Side Special)",
    textJpEn: "If it hits a wall, Luigi's head can get stuck in it. He can't act at all until his head comes free, leaving him completely open.",
    titlePt: "Vulnerabilidade do Green Missile (Especial Lateral)",
    textPt: "Se atingir uma parede, a cabeça do Luigi pode ficar presa nela. Ele não consegue agir até a cabeça se soltar, ficando completamente vulnerável.",
  },
  {
    titleEn: "[★★☆] Overzealous Green Missile (Side Special)",
    titleJp: "ルイージロケットの暴発 【横必殺ワザ】",
    textJp: "１/１０の確率で暴発することがある。威力が大きいが飛距離も長いので、自滅に注意。",
    titleJpEn: "Overzealous Green Missile (Side Special)",
    textJpEn: "There's a 1-in-10 chance of a misfire. It hits harder and travels farther, but watch out for self-destructing.",
    titlePt: "Green Missile Descontrolado (Especial Lateral)",
    textPt: "Há uma chance de 1 em 10 de disparo acidental. Bate mais forte e viaja mais longe, mas cuidado para não se autodestruir.",
  },
  {
    titleEn: "[★☆☆] Exhausting Green Missile (Side Special)",
    titleJp: "ルイージロケットのため 【横必殺ワザ】",
    textJp: "ためすぎると、息切れしてワザが出ずに終わる。ルイージの体のふるえが止まったら、たまった合図。",
    titleJpEn: "Exhausting Green Missile (Side Special)",
    textJpEn: "Charging too long makes Luigi run out of breath and the move fizzles out. When Luigi's body stops shaking, that's the sign it's fully charged.",
    titlePt: "Carregar o Green Missile em Excesso (Especial Lateral)",
    textPt: "Carregar por tempo demais faz o Luigi ficar sem fôlego e o movimento falhar. Quando o corpo do Luigi para de tremer, é o sinal de que está totalmente carregado.",
  },
  {
    titleEn: "[★★☆] Super Jump Punch (Up Special)",
    titleJp: "スーパージャンプパンチ 【上必殺ワザ】",
    textJp: "相手に密着して、出始めてすぐの攻撃をクリーンヒットさせると、攻撃力、ふっとばし力ともに強力なアッパーになる。",
    titleJpEn: "Super Jump Punch (Up Special)",
    textJpEn: "If you're right up against an opponent and land a clean hit at the very start of the move, it becomes a powerful uppercut with strong damage and knockback.",
    titlePt: "Super Jump Punch (Especial Cima)",
    textPt: "Se você estiver bem próximo de um adversário e acertar um golpe limpo bem no início do movimento, ele se torna um poderoso uppercut com forte dano e arremesso.",
  },
  {
    titleEn: "[★★☆] Using Luigi Cyclone (Down Special)",
    titleJp: "ルイージサイクロンで上昇 【下必殺ワザ】",
    textJp: "ワザを出している最中にボタン連打で、体が上昇する。出始めは無敵状態になり、近くの相手を引き寄せる。",
    titleJpEn: "Rising with Luigi Cyclone (Down Special)",
    textJpEn: "Mashing the button while the move is active makes Luigi rise. At the very start, he becomes invincible and pulls in nearby opponents.",
    titlePt: "Subindo com o Luigi Cyclone (Especial Baixo)",
    textPt: "Apertar o botão repetidamente enquanto o movimento está ativo faz o Luigi subir. No início, ele fica invencível e puxa adversários próximos.",
  },
  {
    titleEn: "[★★☆] Landing Luigi Cyclone (Down Special)",
    titleJp: "ルイージサイクロンで着地 【下必殺ワザ】",
    textJp: "空中でルイージサイクロンを使いながら着地すると、左右どちらか入力した方向に滑るので、相手からの追撃を避けるような使い方もできる。",
    titleJpEn: "Landing with Luigi Cyclone (Down Special)",
    textJpEn: "If you use Luigi Cyclone in the air and land while using it, Luigi slides in whichever direction you input, which can be used to avoid an opponent's follow-up attacks.",
    titlePt: "Pousando com o Luigi Cyclone (Especial Baixo)",
    textPt: "Se você usar o Luigi Cyclone no ar e pousar enquanto o usa, o Luigi desliza na direção que você inputar, o que pode ser usado para evitar ataques de acompanhamento do adversário.",
  },
  {
    titleEn: "[★☆☆] Poltergust G-00 (Final Smash)",
    titleJp: "オバキューム 【最後の切りふだ】",
    textJp: "背負ったオバキュームで、周りのファイターのみならず、アイテムまでも吸い込む。フィニッシュで、吸い込んだファイターやアイテムを吐き出し、ふっとばす。",
    titleJpEn: "Poltergust G-00 (Final Smash)",
    textJpEn: "With the Poltergust on his back, Luigi sucks in not only nearby fighters but also items. At the finish, he spits out and launches everything he swallowed.",
    titlePt: "Poltergust G-00 (Final Smash)",
    textPt: "Com o Poltergust nas costas, o Luigi suga não apenas os lutadores próximos, mas também itens. No final, ele expele e arremessa tudo o que engoliu.",
  },
  {
    titleEn: "[★☆☆] Lead Headbutt (Up Smash Attack)",
    titleJp: "スマッシュヘッドバット 【上スマッシュ攻撃】",
    textJp: "正面の相手に当てると、相手はルイージの背後の方にふっとぶ。背後の相手に当てると、相手はルイージの正面の方にふっとぶ。",
    titleJpEn: "Smash Headbutt (Up Smash Attack)",
    textJpEn: "Hitting an opponent in front sends them flying behind Luigi. Hitting an opponent behind him sends them flying in front of Luigi.",
    titlePt: "Cabeçada Smash (Up Smash Attack)",
    textPt: "Acertar um adversário na frente o arremessa para trás do Luigi. Acertar um adversário atrás dele o arremessa para a frente do Luigi.",
  },
  {
    titleEn: "[★★☆] Luigi Kick (Neutral Air Attack)",
    titleJp: "ルイージキック 【通常空中攻撃】",
    textJp: "当たった相手をほぼ真上にふっとばすという特徴がある。相手の飛ぶ方向が分かりやすい分、連続攻撃を狙いやすい。",
    titleJpEn: "Luigi Kick (Neutral Air Attack)",
    textJpEn: "This attack sends opponents flying almost straight up. Since the launch direction is predictable, it's easy to set up follow-up combos.",
    titlePt: "Chute do Luigi (Ataque Aéreo Neutro)",
    textPt: "Este ataque arremessa os adversários quase que diretamente para cima. Como a direção do lançamento é previsível, é fácil preparar combos de acompanhamento.",
  },
  {
    titleEn: "[★★★] Down Taunt",
    titleJp: "下アピール",
    textJp: "ルイージの下アピールには、強いメテオ効果がある。ガケにつかまっている相手の手に当たれば気持ちいい！",
    titleJpEn: "Down Taunt",
    textJpEn: "Luigi's down taunt has a strong meteor effect. Landing it on the hand of an opponent hanging from the ledge feels great!",
    titlePt: "Provocação Baixo",
    textPt: "A provocação baixo do Luigi tem um forte efeito meteoro. Acertar a mão de um adversário pendurado na borda é muito satisfatório!",
  },
  {
    titleEn: "[★☆☆] Luigi's Air Superiority",
    titleJp: "マリオとルイージの能力の違い",
    textJp: "『スーパーマリオブラザーズ2』で、初めてマリオとルイージに能力差がついた。ルイージはマリオよりジャンプ力が高く、滑りやすい。",
    titleJpEn: "The Difference Between Mario and Luigi's Abilities",
    textJpEn: "In \"Super Mario Bros. 2,\" Mario and Luigi first had differing abilities. Luigi jumps higher than Mario, and is more prone to sliding.",
    titlePt: "A Diferença de Habilidades Entre Mario e Luigi",
    textPt: "Em \"Super Mario Bros. 2\", Mario e Luigi tiveram habilidades diferentes pela primeira vez. O Luigi pula mais alto que o Mario e é mais propenso a deslizar.",
  },
];

async function main() {
  const luigi = await db.fighter.findFirst({
    where: { name: "Luigi" },
    select: {
      id: true,
      tips: { select: { id: true, titleEn: true } },
      bios: { select: { id: true, smashGameVersion: true, contentJp: true } },
    },
  });
  if (!luigi) { console.log("Luigi not found"); return; }
  console.log(`Luigi (${luigi.id}): ${luigi.tips.length} tips`);

  const bio64 = luigi.bios.find(b => b.smashGameVersion === "SSB64");
  if (bio64 && (!bio64.contentJp || bio64.contentJp === "NOT FOUND")) {
    await db.fighterBio.update({
      where: { id: bio64.id },
      data: { contentJp: SSB64_BIO_JP, contentJpEn: SSB64_BIO_JPEN, contentPt: SSB64_BIO_PT },
    });
    console.log("✅ Bio SSB64: JP + JpEn + PT adicionados");
  } else {
    console.log(`  ⏭️  Bio SSB64 JP já existe: "${bio64?.contentJp?.slice(0, 30)}..."`);
  }

  let updated = 0;
  for (const data of LUIGI_TIPS) {
    const tip = luigi.tips.find(t => t.titleEn === data.titleEn);
    if (!tip) { console.log(`  ⚠️  Tip não encontrada: "${data.titleEn}"`); continue; }
    await db.fighterTip.update({
      where: { id: tip.id },
      data: {
        titleJp: data.titleJp, textJp: data.textJp,
        titleJpEn: data.titleJpEn, textJpEn: data.textJpEn,
        titlePt: data.titlePt, textPt: data.textPt,
      },
    });
    console.log(`  ✅ ${data.titleEn}`);
    updated++;
  }

  console.log(`\n✅ ${updated}/${LUIGI_TIPS.length} tips atualizadas`);
  await db.$disconnect();
}
main().catch(console.error);
