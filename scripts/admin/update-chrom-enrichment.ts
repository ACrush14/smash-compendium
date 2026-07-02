import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "A descendant of the hero Marth and prince of the Holy Kingdom of Ylisse. He shows excellent leadership, forming a militia for the sake of his country and serving as its captain. Though he appears blunt and composed, it's said that he often breaks things during sword training when he gets too fired up. When summoned during Robin's Final Smash, the two unleash a combination of sword and magic together.",
    pt: "Um descendente do herói Marth e príncipe do Sagrado Reino de Ylisse. Ele demonstra excelente liderança, formando uma milícia pelo bem de seu país e servindo como seu capitão. Embora pareça brusco e composto, diz-se que ele frequentemente quebra coisas durante o treino de espada quando fica animado demais. Quando convocado durante o Final Smash da Robin, os dois desencadeiam uma combinação de espada e magia juntos.",
  },
  SSBU: {
    jpEn: "One of the two protagonists of \"Fire Emblem: Awakening.\" Though he is the prince of the Holy Kingdom of Ylisse, he personally leads a militia group to protect his country's peace. He is also a distant descendant of Marth and Lucina's father, and like them, he is an inheritor of the \"Divine Sword Falchion.\" However, at the start of the story, its power is sealed, making it the \"Parallel Falchion.\" On his right shoulder is the \"Brand,\" proof that he is the legitimate heir to the Ylissean royal family.",
    pt: "Um dos dois protagonistas de \"Fire Emblem: Awakening.\" Embora seja o príncipe do Sagrado Reino de Ylisse, ele mesmo lidera um grupo de milícia para proteger a paz de seu país. Ele também é um descendente distante do Marth e pai da Lucina, e como eles, é um herdeiro da \"Espada Divina Falchion.\" Porém, no início da história, seu poder está selado, tornando-a a \"Parallel Falchion.\" Em seu ombro direito está a \"Marca,\" prova de que ele é o herdeiro legítimo da família real de Ylisse.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Chrom's Origins", titleJp: "クロムの初登場作品", textJp: "クロムの初登場は、２０１２年発売の『ファイアーエムブレム 覚醒』。王家に伝わる「封剣ファルシオン」を携え、英雄王マルスの血統の証である聖痕を持つ。", titleJpEn: "Chrom's Origins", textJpEn: "Chrom's debut was in \"Fire Emblem: Awakening,\" released in 2012. He wields the \"Falchion,\" a sword passed down through the royal family, and bears the Brand, proof of his bloodline descending from the Hero-King Marth.", titlePt: "As Origens do Chrom", textPt: "O debut do Chrom foi em \"Fire Emblem: Awakening,\" lançado em 2012. Ele empunha a \"Falchion,\" uma espada passada pela família real, e carrega a Marca, prova de sua linhagem descendente do Rei-Herói Marth." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "イーリス聖王国王子であり、クロム自警団の団長。不器用だが、仲間思いで熱い性格。「封剣ファルシオン」を手に、隣国ペレジアの陰謀に立ち向かう。娘にルキナを持つ。", titleJpEn: "In His Series", textJpEn: "The prince of the Holy Kingdom of Ylisse and captain of his own militia group. He's clumsy but caring toward his companions and has a passionate personality. Wielding the \"Falchion,\" he stands against the schemes of the neighboring nation of Plegia. His daughter is Lucina.", titlePt: "Na Série Original", textPt: "O príncipe do Sagrado Reino de Ylisse e capitão de seu próprio grupo de milícia. Ele é desajeitado, mas atencioso com seus companheiros e tem uma personalidade apaixonada. Empunhando a \"Falchion,\" ele enfrenta as tramas da nação vizinha, Plegia. Sua filha é a Lucina." },
  { titleEn: "[★☆☆] Flare Blade (Neutral Special)", titleJp: "エクスプロージョン 【通常必殺ワザ】", textJp: "剣を振り下ろし、相手を斬る。ためている間は向きを変えられるが、ため過ぎると自分もダメージを受ける。", titleJpEn: "Flare Blade (Neutral Special)", textJpEn: "Swings the sword down to slash an opponent. The direction can be changed while charging, but charging too long damages Chrom himself.", titlePt: "Flare Blade (Especial Neutro)", textPt: "Balança a espada para baixo para cortar um adversário. A direção pode ser mudada enquanto carrega, mas carregar por tempo demais causa dano no próprio Chrom." },
  { titleEn: "[★☆☆] Double-Edge Dance (Side Special)", titleJp: "マーベラスコンビネーション 【横必殺ワザ】", textJp: "追加入力により、４段目まで連続でワザを出す。上、横、下の方向入力で連続ワザの種類が変わる。", titleJpEn: "Double-Edge Dance (Side Special)", textJpEn: "Additional inputs let him chain the move up to a fourth hit. The type of follow-up changes depending on whether up, sideways, or down is input.", titlePt: "Double-Edge Dance (Especial Lateral)", textPt: "Inputs adicionais permitem encadear o movimento até um quarto golpe. O tipo de acompanhamento muda dependendo se cima, lateral ou baixo é inputado." },
  { titleEn: "[★☆☆] Soaring Slash (Up Special)", titleJp: "翔流斬 【上必殺ワザ】", textJp: "上空へ斬り上げて、さらに地面に叩き落とす。発動後は地面に着地するまでキャンセルできないので、ガケ付近では注意。", titleJpEn: "Soaring Slash (Up Special)", textJpEn: "Slashes upward, then slams the opponent down to the ground. Once activated, it can't be canceled until landing on the ground, so be careful near ledges.", titlePt: "Soaring Slash (Especial Cima)", textPt: "Corta para cima, depois arremessa o adversário contra o chão. Uma vez ativado, não pode ser cancelado até pousar no chão, então cuidado perto de bordas." },
  { titleEn: "[★☆☆] Counter (Down Special)", titleJp: "カウンター 【下必殺ワザ】", textJp: "タイミングよく相手の攻撃に合わせ必殺ワザを入力すると、攻撃してきた相手にダメージを与えられる。", titleJpEn: "Counter (Down Special)", textJpEn: "Inputting the special move with good timing against an opponent's attack deals damage back to the attacker.", titlePt: "Counter (Especial Baixo)", textPt: "Inputar o golpe especial com bom timing contra o ataque de um adversário causa dano de volta no atacante." },
  { titleEn: "[★☆☆] Awakening Aether (Final Smash)", titleJp: "覚醒天空 【最後の切りふだ】", textJp: "一気に相手に近づき斬り上げるワザ「太陽」から、斬り抜けるワザ「月光」へつなぐコンビネーション。", titleJpEn: "Awakening Aether (Final Smash)", textJpEn: "A combination move that rushes toward the opponent with an upward slash called \"Sol,\" then follows up with a cutting-through move called \"Luna.\"", titlePt: "Awakening Aether (Final Smash)", textPt: "Um movimento combinado que avança até o adversário com um corte ascendente chamado \"Sol,\" seguido por um movimento de corte total chamado \"Luna.\"" },
];

async function main() {
  const chrom = await db.fighter.findFirst({
    where: { name: "Chrom" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!chrom) { console.log("Chrom not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: chrom.id },
    data: {
      curatorOverviewEn: "Chrom, prince of Ylisse and Roy's Echo Fighter, wields the same sword techniques as his fellow Fire Emblem lord — hilt-heavy Double-Edge Dance combos, a chargeable Flare Blade, and a punishing Counter — but with a notable twist: unlike Roy, Chrom's sword deals no meaningful damage variance based on where it connects, trading his sweetspot mechanic for consistency across the board.",
      curatorOverviewPt: "Chrom, príncipe de Ylisse e Echo Fighter do Roy, empunha as mesmas técnicas de espada de seu colega senhor de Fire Emblem — combos do Double-Edge Dance focados no punho, um Flare Blade carregável e um punitivo Counter — mas com uma reviravolta notável: diferente do Roy, a espada do Chrom não tem variação significativa de dano dependendo de onde conecta, trocando o mecanismo de ponto ideal por consistência geral.",
      curatorOverviewJp: "イーリスの王子クロムは、ロイのエコーファイターとして同じ剣技を操る――柄側を重視したマーベラスコンビネーションのコンボ、ためられるエクスプロージョン、そして手痛いカウンター。しかし顕著な違いが一つある。ロイとは異なり、クロムの剣は当たる場所による大きなダメージの違いがなく、急所によるダメージ変動の代わりに全体的な一貫性を持つ。",
      curatorOverviewJpEn: "Chrom, prince of Ylisse and Roy's Echo Fighter, wields the same sword techniques as his fellow Fire Emblem lord — hilt-focused Double-Edge Dance combos, a chargeable Flare Blade, and a punishing Counter. However, there's one notable difference: unlike Roy, Chrom's sword has no significant damage variance depending on where it connects, trading sweetspot damage variation for overall consistency.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for both bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = chrom.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = chrom.tips.find(t => t.titleEn === data.titleEn);
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
