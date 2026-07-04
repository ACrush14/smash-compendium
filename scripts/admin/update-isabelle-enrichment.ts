import { db } from "../../lib/db";

const BIO_JPEN_PT: Record<string, { jpEn: string; pt: string }> = {
  SSB4: {
    jpEn: "Known as Shizu-chan, she is a town hall employee. She becomes the player-mayor's capable... well, slightly clumsy secretary, and teaches you all sorts of things about village life. She wears her long hair tied up in a round bun on top of her head, looking just like a Shih Tzu... or rather, she is one. She has a twin younger brother named Kent.",
    pt: "Conhecida como Shizu-chan, ela é funcionária da prefeitura. Ela se torna a secretária competente... bem, um pouco desastrada, do jogador que é prefeito, e ensina todo tipo de coisa sobre a vida na vila. Ela usa o cabelo comprido preso em um coque redondo no topo da cabeça, parecendo exatamente um Shih Tzu... ou melhor, ela é um. Ela tem um irmão gêmeo mais novo chamado Kent.",
  },
};

const TIPS = [
  {
    titleEn: "[★☆☆] Isabelle's Origins",
    titleJp: "しずえの初登場作品",
    textJp: "しずえの初登場作品は、２０１２年に発売された『とびだせ どうぶつの森』。成り行きで村長となってしまう主人公の秘書となり、サポートしてくれる。",
    titleJpEn: "Isabelle's Debut Work",
    textJpEn: "Isabelle's debut was in Animal Crossing: New Leaf, released in 2012. She becomes the secretary of the protagonist, who ends up becoming mayor almost by chance, and supports them.",
    titlePt: "As Origens de Isabelle",
    textPt: "A estreia de Isabelle foi em Animal Crossing: New Leaf, lançado em 2012. Ela se torna a secretária do protagonista, que acaba virando prefeito quase por acaso, e o apoia.",
  },
  {
    titleEn: "[★☆☆] In Her Series",
    titleJp: "原作では",
    textJp: "住民からは「しずちゃん」の愛称で親しまれ、相談ごとにいつでも乗ってくれる。ちょっぴりドジだが、なにごとも全力で頑張る。",
    titleJpEn: "In the Original Games",
    textJpEn: "She's affectionately known by the residents as \"Shizu-chan,\" and is always ready to lend an ear for advice. She's a little clumsy, but she gives her all in everything she does.",
    titlePt: "Nos Jogos Originais",
    textPt: "Ela é carinhosamente chamada pelos moradores de \"Shizu-chan\", e está sempre disposta a ouvir e aconselhar. Ela é um pouco desastrada, mas se esforça ao máximo em tudo que faz.",
  },
  {
    titleEn: "[★☆☆] Pocket (Neutral Special)",
    titleJp: "しまう / とり出す 【通常必殺ワザ】",
    textJp: "アイテムや相手の飛び道具をポケットにしまうことができる。必殺ワザボタンを押すと、しまったモノをとり出す。",
    titleJpEn: "Put Away / Take Out (Neutral Special)",
    textJpEn: "You can put items or an opponent's projectiles away in your pocket. Press the special-move button to take out whatever you put away.",
    titlePt: "Guardar / Retirar (Especial Neutro)",
    textPt: "Você pode guardar itens ou projéteis do oponente no bolso. Pressione o botão de golpe especial para retirar o que foi guardado.",
  },
  {
    titleEn: "[★☆☆] Toss with Fishing Rod (Side Special)",
    titleJp: "つりざおの投げ 【横必殺ワザ】",
    textJp: "針を飛ばし、引っかかった相手を引き寄せ、ふっとばす。針を戻す時にも、引っかけられる。前後上下４方向に投げ分けが可能。アイテムに使えば、入手もできる。",
    titleJpEn: "Fishing Rod Throw (Side Special)",
    textJpEn: "Casts the hook out, pulling in and launching whichever opponent gets caught. The hook can also catch someone while it's being reeled back. It can be thrown in four directions — forward, backward, up, and down — and can also be used to obtain items.",
    titlePt: "Arremesso da Vara de Pescar (Especial Lateral)",
    textPt: "Lança o anzol, puxando e lançando quem for fisgado. O anzol também pode fisgar alguém enquanto está sendo recolhido de volta. Pode ser arremessado em quatro direções — frente, trás, cima e baixo — e também pode ser usado pra obter itens.",
  },
  {
    titleEn: "[★☆☆] Fishing Rod's Hook (Side Special)",
    titleJp: "つりざおのつり針 【横必殺ワザ】",
    textJp: "ガケに針が引っかかれば、復帰することができる。ボタンを押せば、素早く戻れる。近くにいる相手に針を引っかけ、道連れを狙うこともできる。",
    titleJpEn: "Fishing Rod's Hook (Side Special)",
    textJpEn: "If the hook catches the ledge, you can recover with it. Press the button to return quickly. You can also hook a nearby opponent and aim to take them down with you.",
    titlePt: "Anzol da Vara de Pescar (Especial Lateral)",
    textPt: "Se o anzol fisgar a borda, você pode se recuperar com ele. Pressione o botão para voltar rapidamente. Você também pode fisgar um oponente próximo e tentar levá-lo junto na queda.",
  },
  {
    titleEn: "[★☆☆] Balloon Trip (Up Special)",
    titleJp: "バルーントリップ 【上必殺ワザ】",
    textJp: "「むらびと」と違い、ウサギの形をしたバルーンが付いているブランコで、浮き上がる。性能はほぼ同じだが、見た目がかわいい。",
    titleJpEn: "Balloon Trip (Up Special)",
    textJpEn: "Unlike the Villager, she rises up on a swing attached to rabbit-shaped balloons. The performance is nearly identical, but it looks a lot cuter.",
    titlePt: "Balloon Trip (Especial Superior)",
    textPt: "Ao contrário do Villager, ela sobe em um balanço preso a balões em formato de coelho. O desempenho é quase idêntico, mas o visual é muito mais fofo.",
  },
  {
    titleEn: "[★☆☆] Lloid Trap (Down Special)",
    titleJp: "しかけハニワくん 【下必殺ワザ】",
    textJp: "ハニワくんを埋めた地面の上を相手が通ると、反応して上昇、攻撃する。下必殺ワザを再入力すれば、好きなタイミングで上昇させることができる。",
    titleJpEn: "Lloid Trap (Down Special)",
    textJpEn: "If an opponent walks over the buried Lloid, it reacts by rising up and attacking. Inputting Down Special again lets you make Lloid rise up at a moment of your choosing.",
    titlePt: "Armadilha Lloid (Especial Inferior)",
    textPt: "Se um oponente passar por cima do Lloid enterrado, ele reage subindo e atacando. Inputar o especial inferior novamente permite fazer o Lloid subir no momento que você escolher.",
  },
  {
    titleEn: "[★☆☆] Dream Town Hall (Final Smash)",
    titleJp: "うるわしのマイオフィス 【最後の切りふだ】",
    textJp: "たぬきちが駆けつけ、相手を閉じ込めながら役場を作り、最後に爆発して周囲にいる相手ごとふっとばす。役場は『とびだせ どうぶつの森』のデザイン。",
    titleJpEn: "Dream Town Hall (Final Smash)",
    textJpEn: "Tom Nook rushes in and builds the Town Hall around the trapped opponent, and it finally explodes, launching anyone caught nearby. The Town Hall's design is from Animal Crossing: New Leaf.",
    titlePt: "Prefeitura dos Sonhos (Ataque Final)",
    textPt: "Tom Nook aparece correndo e constrói a Prefeitura em volta do oponente preso, que finalmente explode, lançando qualquer um que esteja por perto. O design da Prefeitura é de Animal Crossing: New Leaf.",
  },
];

async function main() {
  const isabelle = await db.fighter.findFirst({
    where: { name: "Isabelle" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!isabelle) { console.log("Isabelle not found"); return; }

  await db.fighter.update({
    where: { id: isabelle.id },
    data: {
      curatorOverviewEn: "Isabelle's kit is a Villager reskin on the surface, but her tools push toward setups instead of pure reaction. Pocket works the same as Villager's Pocket, banking an item or projectile for later, but her side special is a full grapple: Fishing Rod Toss hooks an opponent and launches them in any of four directions, and the same hook doubles as recovery, letting her snag the ledge or drag a nearby opponent down with her off-stage. Lloid Trap turns Down Special into a delayed-fuse landmine — bury it, then trigger the pop-up whenever you want instead of waiting for someone to walk over it, which is a real edge over Villager's more passive Timber trap. Her Final Smash traps an opponent inside a Town Hall that detonates outward, catching anyone standing nearby. Between the four-way fishing rod and an on-demand trap, she trades a bit of Villager's straightforward toolkit for more precise timing and positioning options.",
      curatorOverviewPt: "O kit de Isabelle é uma versão reskinada do Villager na superfície, mas suas ferramentas empurram para armadilhas montadas em vez de reação pura. Pocket funciona igual ao Pocket do Villager, guardando um item ou projétil pra usar depois, mas o especial lateral dela é um agarrão completo: o Arremesso da Vara de Pescar fisga um oponente e o lança em qualquer uma das quatro direções, e o mesmo anzol funciona como recuperação, deixando ela se pendurar na borda ou puxar um oponente próximo pra queda junto com ela fora do palco. A Armadilha Lloid transforma o especial inferior numa mina de tempo ajustável — enterre-a e depois acione o disparo quando quiser, em vez de esperar alguém passar por cima, o que é uma vantagem real sobre a armadilha Timber mais passiva do Villager. O Ataque Final dela prende um oponente dentro de uma Prefeitura que explode pra fora, pegando qualquer um que esteja por perto. Entre a vara de pescar de quatro direções e uma armadilha sob demanda, ela troca um pouco da simplicidade do kit do Villager por opções mais precisas de tempo e posicionamento.",
      curatorOverviewJp: "しずえの技構成は見た目こそむらびとの色違いだが、彼女の技は純粋な反応よりも仕込みに寄っている。「しまう」はむらびとの「ポケット」と同じ働きをし、アイテムや飛び道具を後で使うために取っておけるが、横必殺ワザはがっつりとした引っかけ技だ。「つりざおの投げ」は相手を引っかけて４方向のどこへでも打ち出せ、同じ針は復帰技も兼ねており、ガケをつかんだり、場外で近くの相手を道連れにしたりできる。「しかけハニワくん」は下必殺ワザを時限式の地雷に変え、埋めた後、相手が通るのを待つのではなく好きなタイミングで発動させられる——これはむらびとの受動的な「木」の罠に対する明確な強みだ。最後の切りふだは相手を役場の中に閉じ込め、外側に向かって爆発し、周囲にいる相手を巻き込む。４方向のつりざおとオンデマンドの罠により、彼女はむらびとの分かりやすい技構成の一部を、より精密なタイミングと位置取りの選択肢と引き換えている。",
      curatorOverviewJpEn: "On the surface, Isabelle's moveset is just a palette swap of Villager's, but her moves lean more toward setups than pure reaction. \"Put Away\" works the same as Villager's \"Pocket,\" letting her bank an item or projectile to use later, but her side special is a proper grab move: \"Fishing Rod Throw\" hooks an opponent and can launch them in any of four directions, and the same hook doubles as a recovery move, letting her grab the ledge or drag a nearby opponent down with her off-stage. \"Lloid Trap\" turns Down Special into a timed landmine — after burying it, instead of waiting for an opponent to walk over it, she can trigger it whenever she wants, which is a clear advantage over Villager's more passive Timber trap. Her Final Smash traps an opponent inside the Town Hall, which then explodes outward, catching anyone nearby. Between the four-directional fishing rod and an on-demand trap, she trades part of Villager's straightforward moveset for more precise timing and positioning options.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_JPEN_PT)) {
    const bio = isabelle.bios.find(b => b.smashGameVersion === version);
    if (!bio) { console.log(`  ⚠️  Bio não encontrada: ${version}`); continue; }
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = isabelle.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: isabelle.id }, data: { curationStatus: "approved" } });
  console.log("✅ Isabelle aprovada");

  // Sem FighterMove (0 registros) — padrão semi-clone, não é lacuna.
  // Trofeu único SSB4 já com vídeo/link corretos — sem timing novo fornecido desta vez.

  await db.$disconnect();
}
main().catch(console.error);
