import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "The princess of \"Sarasaland,\" who appears in the \"Mario\" series. Her personality is described as \"cheerful and energetic\" and \"strong-willed and a bit selfish.\" The \"Super Mario Land\" instruction manual introduces her as \"a slightly tomboyish princess, bursting with energy.\"",
    pt: "A princesa de \"Sarasaland,\" que aparece na série \"Mario.\" Sua personalidade é descrita como \"alegre e enérgica\" e \"determinada e um pouco egoísta.\" O manual de instruções de \"Super Mario Land\" a apresenta como \"uma princesa um pouco moleca, transbordando de energia.\"",
  },
  SSBM: {
    jpEn: "The princess of Sarasaland. When the space alien Tatanga hypnotically took control of Sarasaland, she met Mario, who came to her rescue. Compared to Peach, her personality seems more lively and tomboyish. Ever since \"Mario Golf,\" the impression has stuck: Peach goes with Mario, and Daisy goes with Luigi.",
    pt: "A princesa de Sarasaland. Quando o alienígena espacial Tatanga tomou controle hipnótico de Sarasaland, ela conheceu o Mario, que veio resgatá-la. Comparada à Peach, sua personalidade parece mais animada e moleca. Desde \"Mario Golf,\" a impressão ficou: Peach combina com Mario, e Daisy combina com Luigi.",
  },
  SSBB: {
    jpEn: "The princess of Sarasaland. Her personality is bright and cheerful, with clearly expressed emotions. She began appearing in the series after Mario rescued Sarasaland, which had been taken over by the space alien Tatanga. She usually wears a yellow and white dress, but appears in a sportier look in \"Super Mario Strikers,\" where she scores bold, powerful shots.",
    pt: "A princesa de Sarasaland. Sua personalidade é alegre e animada, com emoções claramente expressas. Ela começou a aparecer na série depois que o Mario resgatou Sarasaland, que havia sido tomada pelo alienígena espacial Tatanga. Ela geralmente usa um vestido amarelo e branco, mas aparece com um visual mais esportivo em \"Super Mario Strikers,\" onde marca chutes ousados e poderosos.",
  },
  SSB4: {
    jpEn: "Daisy is the same technique type as Peach, but she's also skilled at powerful shots. The soft pink and vivid orange colors seem to represent the difference between their types. Their voices when hitting a shot, their poses when scoring — the two are similar, yet somehow different. Are you Team Peach? Team Daisy? Or both?",
    pt: "A Daisy é do mesmo tipo técnico que a Peach, mas também é habilidosa em tacadas poderosas. As cores rosa suave e laranja vívido parecem representar a diferença entre os tipos das duas. Suas vozes ao acertar uma tacada, suas poses ao marcar pontos — as duas são parecidas, mas de alguma forma diferentes. Você é Time Peach? Time Daisy? Ou os dois?",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Daisy's Origins", titleJp: "デイジーの初登場作品", textJp: "デイジーの初登場は、１９８９年発売の『スーパーマリオランド』。宇宙怪人タタンガの手から救出され、スカイポップ号でマリオと一緒に脱出する。", titleJpEn: "Daisy's Origins", textJpEn: "Daisy's debut was in \"Super Mario Land,\" released in 1989. Rescued from the space alien Tatanga, she escapes together with Mario aboard the Sky Pop.", titlePt: "As Origens da Daisy", textPt: "O debut da Daisy foi em \"Super Mario Land,\" lançado em 1989. Resgatada do alienígena espacial Tatanga, ela escapa junto com o Mario a bordo do Sky Pop." },
  { titleEn: "[★☆☆] In Her Series", titleJp: "原作では", textJp: "サラサランドのお姫様。ピーチ姫に比べると、活発でおてんばな性格。スポーツやパーティに全力で取り組み、周囲に元気を振りまく。", titleJpEn: "In Her Series", textJpEn: "The princess of Sarasaland. Compared to Princess Peach, she has a livelier, more tomboyish personality. She throws herself fully into sports and parties, spreading energy to those around her.", titlePt: "Na Série Original", textPt: "A princesa de Sarasaland. Comparada à Princesa Peach, ela tem uma personalidade mais animada e moleca. Ela se dedica totalmente a esportes e festas, espalhando energia para quem está ao redor." },
  { titleEn: "[★☆☆] Toad (Neutral Special)", titleJp: "キノピオガード 【通常必殺ワザ】", textJp: "キノピオが、身を挺してデイジーを守ってくれる。キノピオに攻撃が当たると、カウンターをくり出し、目の前の相手をまとめてふっとばす。", titleJpEn: "Toad Guard (Neutral Special)", textJpEn: "Toad throws himself in front to protect Daisy. If Toad is hit by an attack, he counters, sending any opponents in front flying together.", titlePt: "Guarda do Toad (Especial Neutro)", textPt: "O Toad se joga na frente para proteger a Daisy. Se o Toad for atingido por um ataque, ele contra-ataca, arremessando juntos quaisquer adversários à frente." },
  { titleEn: "[★☆☆] Daisy Bomber (Side Special)", titleJp: "デイジーボンバー 【横必殺ワザ】", textJp: "相手に向かって、強烈なヒップアタックをお見舞いする。何度でも、空中でも使用できるので、復帰にも役立つ。", titleJpEn: "Daisy Bomber (Side Special)", textJpEn: "Delivers a powerful hip attack toward an opponent. It can be used any number of times, even in the air, making it useful for recovery too.", titlePt: "Daisy Bomber (Especial Lateral)", textPt: "Entrega um poderoso ataque de quadril em direção a um adversário. Pode ser usado quantas vezes for necessário, até mesmo no ar, sendo útil também para recuperação." },
  { titleEn: "[★☆☆] Daisy Parasol (Up Special)", titleJp: "デイジーパラソル 【上必殺ワザ】", textJp: "上空にジャンプしつつパラソルを開き、ゆっくり着地する。パラソルにはダメージ判定があるので、復帰以外にも使える。", titleJpEn: "Daisy Parasol (Up Special)", textJpEn: "Jumps upward while opening a parasol, then descends slowly. The parasol has a damage hitbox, so it can be used for more than just recovery.", titlePt: "Daisy Parasol (Especial Cima)", textPt: "Salta para cima enquanto abre um guarda-chuva, depois desce lentamente. O guarda-chuva tem uma hitbox de dano, então pode ser usado além da recuperação." },
  { titleEn: "[★☆☆] Vegetable (Down Special)", titleJp: "野菜ひっこ抜き 【下必殺ワザ】", textJp: "ひっこ抜ける野菜の種類は全部で８種類あり、表情によって攻撃力が違う。しわくちゃ顔は特に強力で、はじき入力で投げれば、与えるダメージは３０％を超える。", titleJpEn: "Vegetable (Down Special)", textJpEn: "There are eight total types of vegetables that can be pulled, each with different attack power based on its expression. The wrinkled-face one is especially powerful — throwing it with a flick input can deal over 30% damage.", titlePt: "Vegetal (Especial Baixo)", textPt: "Existem oito tipos totais de vegetais que podem ser arrancados, cada um com poder de ataque diferente baseado em sua expressão. O de rosto enrugado é especialmente poderoso — arremessá-lo com um input rápido pode causar mais de 30% de dano." },
  { titleEn: "[★☆☆] Daisy Blossom (Final Smash)", titleJp: "デイジーブラッサム 【最後の切りふだ】", textJp: "魅惑のダンスで相手を眠らせる、デイジーの最後の切りふだ。出てきたヒナギクを拾うと、ダメージを回復する効果がある。", titleJpEn: "Daisy Blossom (Final Smash)", textJpEn: "Daisy's Final Smash — a captivating dance that puts opponents to sleep. Picking up the daisies that appear heals damage.", titlePt: "Daisy Blossom (Final Smash)", textPt: "O Final Smash da Daisy — uma dança cativante que faz os adversários adormecerem. Pegar as margaridas que aparecem cura dano." },
];

async function main() {
  const daisy = await db.fighter.findFirst({
    where: { name: "Daisy" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!daisy) { console.log("Daisy not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: daisy.id },
    data: {
      curatorOverviewEn: "Princess Daisy of Sarasaland brings Peach's technical toolkit — Floating, Toad, and vegetable-pulling — with a spunkier, more athletic edge. As Peach's Echo Fighter, she plays nearly identically but with slight stat differences, rewarding the same patient, aerial-focused approach with a livelier flair.",
      curatorOverviewPt: "A Princesa Daisy de Sarasaland traz o conjunto técnico da Peach — Flutuação, Toad e arrancar vegetais — com um toque mais animado e atlético. Como Echo Fighter da Peach, ela joga de forma quase idêntica, mas com pequenas diferenças de status, recompensando a mesma abordagem paciente e focada no ar, com um estilo mais vivaz.",
      curatorOverviewJp: "サラサランドのデイジー姫は、ピーチの技術的な武器――空中浮遊、キノピオ、野菜ひっこ抜き――を、より快活でアスレチックな個性で引き継ぐ。ピーチのエコーファイターとして、ほぼ同一のプレイスタイルながらわずかなステータスの違いがあり、忍耐強く空中戦を重視する同じアプローチに、より生き生きとした魅力を加える。",
      curatorOverviewJpEn: "Princess Daisy of Sarasaland carries Peach's technical toolkit — Floating, Toad, and vegetable-pulling — with a livelier, more athletic personality. As Peach's Echo Fighter, she plays nearly identically with slight stat differences, rewarding the same patient, aerial-focused approach with extra spirit.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = daisy.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = daisy.tips.find(t => t.titleEn === data.titleEn);
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
