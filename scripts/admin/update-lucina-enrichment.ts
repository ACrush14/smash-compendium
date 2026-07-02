import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "The daughter of Chrom, prince of the Holy Kingdom of Ylisse, and future Princess of Ylisse. She crossed time and space from a bleak future, initially going by the name Marth. Eventually she reveals her true identity and purpose, and travels together with a young Chrom. In Smash Bros., her swift movement and sharp swordsmanship are her appeal. She uses moves similar to Marth's, but her attack power is consistent regardless of where the sword connects.",
    pt: "A filha do Chrom, príncipe do Sagrado Reino de Ylisse, e futura Princesa de Ylisse. Ela atravessou o tempo e o espaço vinda de um futuro sombrio, inicialmente se apresentando como Marth. Eventualmente ela revela sua verdadeira identidade e propósito, e viaja junto com um jovem Chrom. Em Smash Bros., seu movimento veloz e esgrima afiada são seu apelo. Ela usa golpes semelhantes aos do Marth, mas seu poder de ataque é consistente independente de onde a espada conecta.",
  },
  SSBU: {
    jpEn: "A woman who appears in \"Fire Emblem: Awakening,\" wielding the \"Parallel Falchion.\" She is the daughter of Chrom, one of the protagonists, and the princess of the \"Holy Kingdom of Ylisse,\" descended from the Hero-King Marth. She bears the \"Brand,\" a mark in her left eye proving her royal bloodline.",
    pt: "Uma mulher que aparece em \"Fire Emblem: Awakening,\" empunhando a \"Parallel Falchion.\" Ela é filha de Chrom, um dos protagonistas, e a princesa do \"Sagrado Reino de Ylisse,\" descendente do Rei-Herói Marth. Ela carrega a \"Marca,\" um sinal em seu olho esquerdo que prova sua linhagem real.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Lucina and Marth use similar moves, but with different characteristics. While Marth's attacks are strongest at the tip of the sword, Lucina's power is consistent regardless of where the sword connects — making her easier to handle. Shield Breaker also has the special ability to chip away at an opponent's shield while attacking. Charged to maximum, it can destroy a shield in a single hit. (3DS) Fire Emblem: Awakening (2012/04)",
    pt: "A Lucina e o Marth usam golpes semelhantes, mas com características diferentes. Enquanto os ataques do Marth são mais fortes na ponta da espada, o poder da Lucina é consistente independente de onde a espada conecta — tornando-a mais fácil de usar. O Shield Breaker também tem a habilidade especial de desgastar o escudo de um adversário enquanto ataca. Carregado ao máximo, pode destruir um escudo em um único golpe. (3DS) Fire Emblem: Awakening (2012/04)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Lucina's Origins", titleJp: "ルキナの初登場作品", textJp: "ルキナのデビュー作は、２０１２年発売の『ファイアーエムブレム 覚醒』。絶望の未来からやってきた謎の剣士で、最初はマルスを名乗っていた。", titleJpEn: "Lucina's Origins", textJpEn: "Lucina's debut was in \"Fire Emblem: Awakening,\" released in 2012. A mysterious swordfighter who came from a bleak future, she initially went by the name Marth.", titlePt: "As Origens da Lucina", textPt: "O debut da Lucina foi em \"Fire Emblem: Awakening,\" lançado em 2012. Uma misteriosa espadachim vinda de um futuro sombrio, ela inicialmente se apresentou como Marth." },
  { titleEn: "[★☆☆] In Her Series", titleJp: "原作では", textJp: "クロムの娘で、「裏剣ファルシオン」とともに、未来から訪れる。左目に聖痕を持つ。現れた当初は、英雄王と同じ「マルス」を名乗り、仮面を被っていた。", titleJpEn: "In Her Series", textJpEn: "Chrom's daughter, she arrives from the future wielding the \"Parallel Falchion.\" She bears a mark on her left eye. When she first appeared, she wore a mask and went by \"Marth,\" the same name as the Hero-King.", titlePt: "Na Série Original", textPt: "Filha do Chrom, ela chega do futuro empunhando a \"Parallel Falchion.\" Ela carrega uma marca no olho esquerdo. Quando apareceu pela primeira vez, ela usava uma máscara e se apresentava como \"Marth,\" o mesmo nome do Rei-Herói." },
  { titleEn: "[★☆☆] Critical Hit (Final Smash)", titleJp: "必殺の一撃 【最後の切りふだ】", textJp: "前方に突進し、触れた相手を強くふっとばす。行き止まりが無い場所で使うとかなりの長距離を突進するので、ミスになる前にボタン入力で剣を振ろう。", titleJpEn: "Critical Hit (Final Smash)", textJpEn: "Dashes forward, launching any opponent she touches powerfully. Using it in an open area with no wall causes her to dash a considerable distance, so swing the sword with a button input before it becomes a self-destruct.", titlePt: "Critical Hit (Final Smash)", textPt: "Avança para frente, arremessando poderosamente qualquer adversário que toca. Usá-lo em uma área aberta sem parede a faz avançar uma distância considerável, então balance a espada com um input de botão antes que se torne uma autodestruição." },
  { titleEn: "[★★☆] Anti-air Slash (Up Tilt Attack)", titleJp: "アンチエアスラッシュ 【上強攻撃】", textJp: "頭上に半円を描くように前方から後方を斬りつける。後方へのダメージが大きいので、背後から接近する相手に効果的。", titleJpEn: "Anti-air Slash (Up Tilt Attack)", textJpEn: "Slashes in a semicircle overhead from front to back. It deals more damage on the back side, making it effective against opponents approaching from behind.", titlePt: "Anti-air Slash (Ataque Inclinado Cima)", textPt: "Corta em um semicírculo sobre a cabeça, da frente para trás. Causa mais dano no lado de trás, tornando-o eficaz contra adversários que se aproximam por trás." },
  { titleEn: "[★☆☆] Vs. Marth", titleJp: "マルスとの違い", textJp: "剣先が強いマルスとは異なり、剣の先端も根本も同じ攻撃力。それ以外の通常ワザや必殺ワザの基本的な性能はマルスとほぼ同じ。", titleJpEn: "Vs. Marth", textJpEn: "Unlike Marth, whose sword is strongest at the tip, Lucina's sword deals the same attack power at both the tip and the base. Aside from this, the basic properties of her standard and special moves are almost identical to Marth's.", titlePt: "Vs. Marth", textPt: "Diferente do Marth, cuja espada é mais forte na ponta, a espada da Lucina causa o mesmo poder de ataque tanto na ponta quanto na base. Além disso, as propriedades básicas de seus golpes padrão e especiais são quase idênticas às do Marth." },
];

async function main() {
  const lucina = await db.fighter.findFirst({
    where: { name: "Lucina" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!lucina) { console.log("Lucina not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: lucina.id },
    data: {
      curatorOverviewEn: "Lucina, Chrom's daughter and Marth's Echo Fighter, wields the same swift, technical swordplay — but with one key difference: her blade deals consistent damage along its entire length, not just the tip. This trade-off makes her more forgiving and beginner-friendly than Marth while sacrificing his devastating tipper damage, appealing to players who value consistency over maximum reward.",
      curatorOverviewPt: "Lucina, filha do Chrom e Echo Fighter do Marth, empunha a mesma esgrima veloz e técnica — mas com uma diferença fundamental: sua lâmina causa dano consistente em todo seu comprimento, não só na ponta. Essa troca a torna mais tolerante a erros e amigável para iniciantes do que o Marth, sacrificando o dano devastador da ponta dele, atraindo jogadores que valorizam consistência acima de recompensa máxima.",
      curatorOverviewJp: "クロムの娘であり、マルスのエコーファイターであるルキナは、同じ俊敏でテクニカルな剣術を操る――しかし重要な違いが一つある。彼女の剣は剣先だけでなく、その全長にわたって一定のダメージを与える。この代償により、マルスよりも扱いやすく初心者向きになる一方、彼の強力な剣先ダメージを犠牲にしており、最大リターンよりも安定性を重視するプレイヤーに向いている。",
      curatorOverviewJpEn: "Chrom's daughter and Marth's Echo Fighter, Lucina wields the same swift, technical swordplay — but with one key difference: her sword deals consistent damage across its entire length, not just the tip. This trade-off makes her more forgiving and beginner-friendly than Marth, sacrificing his powerful tipper damage in exchange, and suits players who value consistency over maximum reward.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for both bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = lucina.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Moves EN+PT+JpEn
  for (const m of lucina.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = lucina.tips.find(t => t.titleEn === data.titleEn);
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

  await db.$disconnect();
}
main().catch(console.error);
