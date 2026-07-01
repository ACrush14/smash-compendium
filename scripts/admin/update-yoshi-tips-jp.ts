import { db } from "../../lib/db";

// Textos do Yoshi (SSBU) extraídos de wikiwiki.jp/ssbswitch/スマちしき/ファイター em 2026-06-30
// Traduções EN/PT/JpEn feitas manualmente

const YOSHI_TIPS = [
  {
    titleEn: "[★☆☆] In Its Series",
    titleJp: "原作では",
    textJp: "『スーパーマリオワールド』で初登場以来、多くの作品で活躍してきたヨッシー。長い舌でリンゴや敵を飲み込んだり、高いジャンプ力を誇る。色違いのヨッシーも存在する。",
    titleJpEn: "In Its Series",
    textJpEn: "Since his debut in \"Super Mario World,\" Yoshi has appeared in many games. Known for swallowing apples and enemies with his long tongue, and for his impressive jumping ability. Yoshis also come in many colors.",
    titlePt: "Na Série Original",
    textPt: "Desde sua estreia em \"Super Mario World,\" Yoshi apareceu em muitos jogos. Famoso por engolir maçãs e inimigos com a longa língua, e por sua impressionante habilidade de salto. Yoshis também existem em muitas cores.",
  },
  {
    titleEn: "[★☆☆] Mario's Loyal Ally",
    titleJp: "マリオの心強い味方",
    textJp: "ヨッシーの初登場作品は『スーパーマリオワールド』。たまごに閉じ込められていたところをマリオに助けられ、一緒に冒険することに。",
    titleJpEn: "Mario's Loyal Ally",
    textJpEn: "Yoshi's debut was in \"Super Mario World.\" After being freed from an egg by Mario, Yoshi set off on an adventure together with him.",
    titlePt: "O Leal Aliado de Mario",
    textPt: "A estreia do Yoshi foi em \"Super Mario World.\" Após ser libertado de um ovo por Mario, Yoshi partiu em aventura junto com ele.",
  },
  {
    titleEn: "[★☆☆] Yoshi's Puzzle Games",
    titleJp: "ヨッシーのパズルゲーム",
    textJp: "『ヨッシーのたまご』は、「ヨッシー」の名が付くパズルゲームの第１作目。ほかには、『ヨッシーのクッキー』、『ヨッシーのパネポン』がある。",
    titleJpEn: "Yoshi's Puzzle Games",
    textJpEn: "\"Yoshi\" was the first puzzle game to bear the Yoshi name. Others include \"Yoshi's Cookie\" and \"Yoshi's Panepon.\"",
    titlePt: "Os Jogos de Puzzle do Yoshi",
    textPt: "\"Yoshi\" foi o primeiro jogo de puzzle a levar o nome de Yoshi. Outros incluem \"Yoshi's Cookie\" e \"Yoshi's Panepon.\"",
  },
  {
    titleEn: "[★★☆] Egg Lay (Neutral Special)",
    titleJp: "たまご産み【通常必殺ワザ】",
    textJp: "長い舌で捕らえた相手を飲み込んで、たまごにする。動けない相手を攻撃し放題だが、与えられるダメージは減る。",
    titleJpEn: "Egg Lay (Neutral Special)",
    textJpEn: "Swallows a caught opponent with a long tongue and turns them into an egg. The trapped opponent can be attacked freely, but the damage dealt is reduced.",
    titlePt: "Postura de Ovo (Especial Neutro)",
    textPt: "Engole um adversário capturado com a longa língua e o transforma em ovo. O adversário preso pode ser atacado livremente, mas o dano causado é reduzido.",
  },
  {
    titleEn: "[★★☆] Egg Lay off the Edge (Neutral Special)",
    titleJp: "ガケぎわでたまご産み【通常必殺ワザ】",
    textJp: "蓄積ダメージが高い相手は、たまごから抜け出しにくくなるため、ガケぎわで相手を飲み込み、たまごにしてガケの外に産み出すのが有効。",
    titleJpEn: "Egg Lay off the Edge (Neutral Special)",
    textJpEn: "Opponents with high accumulated damage have a harder time escaping the egg, so swallowing them near the ledge and laying the egg off the stage is very effective.",
    titlePt: "Postura de Ovo na Borda (Especial Neutro)",
    textPt: "Adversários com alto dano acumulado têm mais dificuldade em escapar do ovo, então engoli-los perto da borda e soltar o ovo fora do palco é muito eficaz.",
  },
  {
    titleEn: "[★★☆] Egg Form (Neutral Special)",
    titleJp: "たまご状態【通常必殺ワザ】",
    textJp: "蓄積ダメージが高いほど、長くたまご状態になってしまう。レバガチャをすると、素早くたまご状態を解除できる。",
    titleJpEn: "Egg Form (Neutral Special)",
    textJpEn: "The higher the accumulated damage, the longer the egg state lasts. Mashing the controls allows you to escape the egg state quickly.",
    titlePt: "Estado de Ovo (Especial Neutro)",
    textPt: "Quanto maior o dano acumulado, mais longo o estado de ovo dura. Agitar os controles permite escapar do estado de ovo rapidamente.",
  },
  {
    titleEn: "[★☆☆] Egg Roll (Side Special)",
    titleJp: "ごろごろたまご【横必殺ワザ】",
    textJp: "たまごになり、地面を勢いよく転がる。スティックで向きを変えることができ、スティックを傾けている方向に転がる力が高まる。",
    titleJpEn: "Egg Roll (Side Special)",
    textJpEn: "Turns into an egg and rolls powerfully across the ground. The direction can be changed with the stick, and rolling in the direction you tilt the stick increases momentum.",
    titlePt: "Rolar de Ovo (Especial Lateral)",
    textPt: "Transforma-se em ovo e rola com força pelo chão. A direção pode ser mudada com o analógico, e rolar na direção que você inclina o analógico aumenta o impulso.",
  },
  {
    titleEn: "[★☆☆] Egg Roll in the Air (Side Special)",
    titleJp: "空中でのごろごろたまご【横必殺ワザ】",
    textJp: "空中で使うと、一度地面に落ちるまでは、ダメージを与えることができない。落ちてからも転がり続けるため、地面でダメージを与えられる。",
    titleJpEn: "Egg Roll in the Air (Side Special)",
    textJpEn: "When used in the air, Yoshi cannot deal damage until it lands on the ground. After landing it continues to roll and can deal damage on the ground.",
    titlePt: "Rolar de Ovo no Ar (Especial Lateral)",
    textPt: "Quando usado no ar, o Yoshi não pode causar dano até pousar no chão. Após pousar, ele continua rolando e pode causar dano no chão.",
  },
  {
    titleEn: "[★★☆] Egg Throw's Power (Up Special)",
    titleJp: "たまご投げの勢い【上必殺ワザ】",
    textJp: "たまごを投げる勢いは、ボタンを押す長さで変わる。ちょっと押せば軽く投げ、長めに押せば力強く投げる。",
    titleJpEn: "Egg Throw's Power (Up Special)",
    textJpEn: "The force of the egg throw changes based on how long the button is pressed. A short press throws lightly; a longer press throws with more force.",
    titlePt: "Força do Arremesso de Ovo (Especial Cima)",
    textPt: "A força do arremesso do ovo muda de acordo com a duração do botão pressionado. Um pressionamento curto lança levemente; um mais longo lança com mais força.",
  },
  {
    titleEn: "[★★☆] Upward Eggs (Up Special)",
    titleJp: "真上にたまご投げ【上必殺ワザ】",
    textJp: "たまごを投げる直前にヨッシーの後ろ方向に入力すれば、たまごを真上に投げることができる。フェイントとしても有効。",
    titleJpEn: "Upward Eggs (Up Special)",
    textJpEn: "Inputting backward just before throwing the egg allows you to throw it straight up. This can also be effective as a feint.",
    titlePt: "Ovos para Cima (Especial Cima)",
    textPt: "Direcionar para trás logo antes de lançar o ovo permite jogá-lo direto para cima. Isso também pode ser eficaz como um fintar.",
  },
  {
    titleEn: "[★☆☆] A Little Eggstra Boost (Up Special)",
    titleJp: "空中でたまご投げ【上必殺ワザ】",
    textJp: "多くのファイターと違い、復帰の主力として使えるような上昇力はないが、空中で使うと、ヨッシーが少し浮き上がるため、復帰の助けにはなる。",
    titleJpEn: "A Little Eggstra Boost (Up Special)",
    textJpEn: "Unlike many fighters, it doesn't provide enough lift to be a primary recovery tool, but using it in the air causes Yoshi to float up slightly, which can help with recovery.",
    titlePt: "Um Pequeno Impulso Extra (Especial Cima)",
    textPt: "Ao contrário de muitos lutadores, não fornece sustentação suficiente para ser a ferramenta principal de recuperação, mas usá-la no ar faz o Yoshi subir levemente, o que pode ajudar na recuperação.",
  },
  {
    titleEn: "[★★☆] Yoshi Bomb's Power (Down Special)",
    titleJp: "ヒップドロップの威力【下必殺ワザ】",
    textJp: "ヒップドロップのダメージとふっとばし力は、地上で出した方が少しだけ高い。空中から出すと、ヒット後に星が出て相手に追加ダメージを与えられる。",
    titleJpEn: "Yoshi Bomb's Power (Down Special)",
    textJpEn: "The damage and knockback of Yoshi Bomb are slightly higher when used on the ground. When used from the air, stars appear after the hit and deal additional damage to the opponent.",
    titlePt: "Força do Yoshi Bomb (Especial Baixo)",
    textPt: "O dano e knockback do Yoshi Bomb são ligeiramente maiores quando usado no chão. Quando usado do ar, estrelas aparecem após o impacto e causam dano adicional ao adversário.",
  },
  {
    titleEn: "[★★☆] Break Shields with Yoshi Bomb (Down Special)",
    titleJp: "ヒップドロップでシールド削り【下必殺ワザ】",
    textJp: "ヒップドロップは、シールドを大きく削ることができる。弱攻撃などから連続して当てることで、シールドブレイクも狙える。",
    titleJpEn: "Break Shields with Yoshi Bomb (Down Special)",
    textJpEn: "Yoshi Bomb can significantly chip shields. By connecting it after a jab or other attack, shield breaking becomes a real possibility.",
    titlePt: "Quebrar Escudos com Yoshi Bomb (Especial Baixo)",
    textPt: "O Yoshi Bomb pode reduzir significativamente os escudos. Conectando-o após um jab ou outro ataque, quebrar o escudo se torna uma possibilidade real.",
  },
  {
    titleEn: "[★★☆] Platforms and Yoshi Bomb (Down Special)",
    titleJp: "ヒップドロップですり抜け床をスルー【下必殺ワザ】",
    textJp: "ワザの出始めは、自動ですり抜け床を通り抜けられる。発動中に下を入力し続けると、着地するまで、すり抜け床を抜けられる。",
    titleJpEn: "Platforms and Yoshi Bomb (Down Special)",
    textJpEn: "At the start of the move, Yoshi automatically passes through drop-through platforms. Holding down during the move allows passing through them until landing.",
    titlePt: "Plataformas e Yoshi Bomb (Especial Baixo)",
    textPt: "No início do movimento, o Yoshi passa automaticamente por plataformas permeáveis. Manter pressionado para baixo durante o movimento permite atravessá-las até pousar.",
  },
  {
    titleEn: "[★☆☆] Yoshi Stampede (Final Smash)",
    titleJp: "あつまれヨッシー【最後の切りふだ】",
    textJp: "大量のヨッシー軍団が大集合し、わき目も振らずに駆け抜ける。踏みつけられたファイターは、強烈にふっとばされる。３人まで巻き込むことができる。",
    titleJpEn: "Yoshi Stampede (Final Smash)",
    textJpEn: "A massive group of Yoshis gathers and stampedes forward without looking back. Fighters trampled are launched with great force. Up to three opponents can be caught in it.",
    titlePt: "Stampede de Yoshis (Final Smash)",
    textPt: "Um grande grupo de Yoshis se reúne e avança em disparada sem olhar para trás. Os lutadores pisoteados são arremessados com grande força. Até três adversários podem ser atingidos.",
  },
  {
    titleEn: "[★★★] Noggin Dunk (Forward Air Attack)",
    titleJp: "かいてんずつき【前空中攻撃】",
    textJp: "少し構えてから勢いよく頭を振り下ろす。威力が高く、頭の上部にはメテオ効果がある。先端ほど威力が高いため、後隙も長い。",
    titleJpEn: "Noggin Dunk (Forward Air Attack)",
    textJpEn: "After a brief windup, Yoshi swings his head down with force. It deals high damage and the upper part of the head has a meteor effect. The tip deals more damage, but has longer endlag.",
    titlePt: "Mergulho de Cabeça (Ataque Aéreo Frontal)",
    textPt: "Após um breve preparatório, o Yoshi balança a cabeça para baixo com força. Causa alto dano e a parte superior da cabeça tem efeito meteoro. A ponta causa mais dano, mas tem maior tempo de recuperação.",
  },
  {
    titleEn: "[★★☆] Flutter Kick (Down Air Attack)",
    titleJp: "ばたあしキック【下空中攻撃】",
    textJp: "ヨッシーの真下にいる相手に当てると、攻撃力が高い。相手を巻き込んで何度もヒットするので、出始めを当てて大ダメージを狙おう。",
    titleJpEn: "Flutter Kick (Down Air Attack)",
    textJpEn: "Deals high damage when hitting opponents directly below Yoshi. It hits multiple times and draws opponents in, so try to connect at the start for maximum damage.",
    titlePt: "Chute Agitado (Ataque Aéreo Baixo)",
    textPt: "Causa alto dano quando acerta adversários diretamente abaixo do Yoshi. Acerta várias vezes e atrai adversários, então tente conectar desde o início para o máximo de dano.",
  },
  {
    titleEn: "[★☆☆] Egg Shield",
    titleJp: "たまごシールド",
    textJp: "ヨッシーのシールドは、他のファイターと違い全身をたまごで包み込む。攻撃を防いでもシールドが小さくならないので、体がシールドからはみ出さない。",
    titleJpEn: "Egg Shield",
    textJpEn: "Unlike other fighters, Yoshi's shield wraps his entire body in an egg. The shield doesn't shrink when blocking attacks, so the body never sticks out from the shield.",
    titlePt: "Escudo de Ovo",
    textPt: "Ao contrário de outros lutadores, o escudo do Yoshi envolve todo o seu corpo em um ovo. O escudo não encolhe ao bloquear ataques, então o corpo nunca fica exposto fora do escudo.",
  },
  {
    titleEn: "[★☆☆] Midair Jump",
    titleJp: "空中ジャンプ",
    textJp: "空中ジャンプ中は、スーパーアーマー状態になる。強いふっとばし力を持つ攻撃には耐えられないので、蓄積ダメージが高い時は注意。",
    titleJpEn: "Midair Jump",
    textJpEn: "Yoshi enters a super armor state during his midair jump. He cannot withstand attacks with strong knockback, so be careful when at high accumulated damage.",
    titlePt: "Pulo no Ar",
    textPt: "O Yoshi entra em estado de super armadura durante seu pulo no ar. Não consegue resistir a ataques com forte knockback, então tome cuidado com alto dano acumulado.",
  },
];

async function main() {
  const yoshi = await db.fighter.findFirst({
    where: { name: "Yoshi" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!yoshi) { console.log("Yoshi not found"); return; }

  console.log(`Found Yoshi (${yoshi.id}) with ${yoshi.tips.length} tips`);

  let updated = 0;
  for (const data of YOSHI_TIPS) {
    const tip = yoshi.tips.find(t => t.titleEn === data.titleEn);
    if (!tip) {
      console.log(`  ⚠️  Tip not found: "${data.titleEn}"`);
      continue;
    }
    await db.fighterTip.update({
      where: { id: tip.id },
      data: {
        titleJp: data.titleJp,
        textJp: data.textJp,
        titleJpEn: data.titleJpEn,
        textJpEn: data.textJpEn,
        titlePt: data.titlePt,
        textPt: data.textPt,
      },
    });
    console.log(`  ✅ ${data.titleEn}`);
    updated++;
  }

  // Fix SSB64 contentJp (NOT FOUND → real JP text from smashwiki.info)
  const bio64 = await db.fighterBio.findFirst({
    where: { fighter: { name: "Yoshi" }, smashGameVersion: "SSB64" },
    select: { id: true, contentJp: true },
  });
  if (bio64) {
    await db.fighterBio.update({
      where: { id: bio64.id },
      data: {
        contentJp: `ヨッシーアイランドに住む、心優しい恐竜。かつてはマリオのパートナーであったが徐々にその存在感を強め、いろいろなゲームに顔を見せている。のみこんだものを瞬時にたまごにし、それを使った攻撃を最も得意とする。さまざまな色のヨッシーがおり、その知能は赤ちゃん時代でさえ高いといえる。`,
        contentJpEn: `A gentle-hearted dinosaur from Yoshi's Island. Once Mario's partner, Yoshi has gradually established his own presence and appeared in many games. His specialty is instantly turning swallowed objects into eggs and using them as weapons. Yoshis come in many colors, and their intelligence is high even in infancy.`,
      },
    });
    console.log("✅ SSB64 bio JP/JpEn corrigido (era NOT FOUND)");
  }

  // Curator Overview (4 languages)
  await db.fighter.update({
    where: { name: "Yoshi" },
    data: {
      curatorOverviewEn: `Yoshi is one of the most beloved faces in the Smash roster — a dinosaur who has grown from Mario's loyal mount to protagonist of his own series. His egg-based toolkit defines his playstyle: Egg Lay traps opponents, Egg Roll baits and punishes, and Egg Throw zones while aiding recovery. His standout traits are his unique Egg Shield (which never shrinks) and his super-armored midair jump, making him surprisingly durable. He rewards players who can blend zoning tools with reads on opponents trying to close in.`,
      curatorOverviewPt: `Yoshi é um dos rostos mais queridos do elenco do Smash — um dinossauro que passou de fiel montaria de Mario a protagonista de sua própria série. Sua mecânica de ovos define seu estilo de jogo: a Postura de Ovo prende adversários, o Rolar de Ovo engana e pune, e o Arremesso de Ovo controla o espaço enquanto auxilia na recuperação. Seus diferenciais são o escudo de ovo único (que nunca encolhe) e o super pulo no ar com armadura, tornando-o surpreendentemente resistente. Recompensa jogadores que sabem combinar controle de espaço com leituras dos adversários.`,
      curatorOverviewJp: `ヨッシーはスマブラロスターの中でも屈指の人気を誇るキャラクター。マリオの相棒から自身のシリーズ主役へと成長した恐竜だ。たまごを軸にした独自のスタイルが特徴——「たまご産み」は相手を拘束し、「ごろごろたまご」は読み合いから反撃し、「たまご投げ」は距離を置きながら復帰もこなす。縮まないたまごシールドとスーパーアーマー付きの空中ジャンプが彼を際立たせており、接近を試みる相手を読みながらゾーニング技術を織り交ぜる上級者向けのキャラクターだ。`,
      curatorOverviewJpEn: `Yoshi is one of the most beloved faces in the Smash roster — a dinosaur who has grown from Mario's loyal mount to protagonist of his own series. His egg-based toolkit defines his playstyle: Egg Lay traps opponents, Egg Roll baits and punishes, and Egg Throw zones while aiding recovery. His standout traits are his unique Egg Shield (which never shrinks) and his super-armored midair jump, making him surprisingly durable. He rewards players who can blend zoning tools with reads on opponents trying to close in.`,
    },
  });
  console.log("✅ Curator Overview salvo (4 idiomas)");

  console.log(`\n✅ ${updated}/${YOSHI_TIPS.length} tips atualizadas`);
  await db.$disconnect();
}
main().catch(console.error);
