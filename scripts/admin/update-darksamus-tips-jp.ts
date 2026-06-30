import { db } from "../../lib/db";

// Textos da Dark Samus (SSBU) extraídos de wikiwiki.jp/ssbswitch/スマちしき/ファイター em 2026-06-30
// Traduções EN/PT/JpEn feitas manualmente

const DARK_SAMUS_TIPS = [
  {
    titleEn: "[★☆☆] Dark Samus's Origins",
    titleJp: "ダークサムスの初登場作品",
    textJp: "ダークサムスの初登場は、２００３年発売の『メトロイドプライム』。サムスの遺伝子情報を取り込んだメトロイドプライムの細胞から誕生。高い知能を持つ。",
    titleJpEn: "Dark Samus's First Appearance",
    textJpEn: "Dark Samus first appeared in \"Metroid Prime,\" released in 2003. Born from cells of Metroid Prime that had absorbed Samus's genetic data, she possesses exceptional intelligence.",
    titlePt: "Primeira Aparição de Dark Samus",
    textPt: "Dark Samus apareceu pela primeira vez em \"Metroid Prime\", lançado em 2003. Ela nasceu de células do Metroid Prime que absorveram o DNA de Samus, e possui uma inteligência excepcional.",
  },
  {
    titleEn: "[★☆☆] In Her Series",
    titleJp: "原作では",
    textJp: "放射性物質「フェイゾン」をエネルギー源とするフェイゾン生命体。アームキャノンを使った攻撃や、瞬間移動、透明化などの能力も備えていた。",
    titleJpEn: "In the Original Series",
    textJpEn: "A Phazon-based life form that uses the radioactive substance \"Phazon\" as its energy source. She also possessed abilities such as Arm Cannon attacks, teleportation, and cloaking.",
    titlePt: "Na Série Original",
    textPt: "Uma forma de vida baseada em Fázon que usa a substância radioativa \"Fázon\" como fonte de energia. Ela também possuía habilidades como ataques com o Canhão de Braço, teletransporte e invisibilidade.",
  },
  {
    titleEn: "[★☆☆] Charge Shot (Neutral Special)",
    titleJp: "チャージショット【通常必殺ワザ】",
    textJp: "最大までためたチャージショットは、かなり強力。空中でも地上と同じようにためることができる。ためずに連射するのも、ひとつの使いみち。",
    titleJpEn: "Charge Shot (Neutral Special)",
    textJpEn: "A fully charged Charge Shot is quite powerful. You can charge it in the air just like on the ground. Firing it rapidly without charging is also a viable strategy.",
    titlePt: "Tiro Carregado (Especial Neutro)",
    textPt: "Um Tiro Carregado totalmente carregado é bastante poderoso. Ele pode ser carregado no ar da mesma forma que no chão. Disparar rapidamente sem carregar também é uma estratégia viável.",
  },
  {
    titleEn: "[★☆☆] Missile (Side Special)",
    titleJp: "ミサイル【横必殺ワザ】",
    textJp: "ゆるやかに相手をホーミングするミサイルを発射する。はじき入力で出すと、直進するスーパーミサイルを発射。",
    titleJpEn: "Missile (Side Special)",
    textJpEn: "Fires a missile that gently homes in on the opponent. Using a flick input fires a Super Missile that travels in a straight line.",
    titlePt: "Míssil (Especial Lateral)",
    textPt: "Dispara um míssil que persegue suavemente o adversário. Usar uma entrada rápida dispara um Super Míssil que viaja em linha reta.",
  },
  {
    titleEn: "[★☆☆] Screw Attack (Up Special)",
    titleJp: "スクリューアタック【上必殺ワザ】",
    textJp: "復帰に使う場合、ガケに背を向けて使用してしまうと、上昇が終了するまでガケにつかまれない。正面を向いて使えば、近くのガケにすぐつかまれる。",
    titleJpEn: "Screw Attack (Up Special)",
    textJpEn: "When using it for recovery, if you use it with your back to the ledge, you won't be able to grab the ledge until the ascent ends. Use it while facing the ledge to grab it immediately.",
    titlePt: "Screw Attack (Especial Cima)",
    textPt: "Ao usá-lo para recuperação, se o usar de costas para a borda, você não conseguirá agarrá-la até o fim da ascensão. Use-o de frente para a borda para agarrá-la imediatamente.",
  },
  {
    titleEn: "[★☆☆] Bomb (Down Special)",
    titleJp: "ボム【下必殺ワザ】",
    textJp: "丸くなって、その場に爆弾を落とす。落とした爆弾の爆風に当たると、少しジャンプする。",
    titleJpEn: "Bomb (Down Special)",
    textJpEn: "Curls into a ball and drops a bomb in place. Getting caught in the blast of the dropped bomb causes a small hop upward.",
    titlePt: "Bomba (Especial Baixo)",
    textPt: "Enrola-se em bola e solta uma bomba no lugar. Ser atingido pela explosão da bomba soltada provoca um pequeno salto para cima.",
  },
  {
    titleEn: "[★☆☆] Phazon Laser (Final Smash)",
    titleJp: "フェイゾンレーザー【最後の切りふだ】",
    textJp: "地形をも貫通する、巨大なレーザーを発射。照射中は、スティックで角度を変えられる。当たった相手に連続ヒットして、大ダメージを与える。",
    titleJpEn: "Phazon Laser (Final Smash)",
    textJpEn: "Fires a massive laser that even penetrates terrain. During the beam, you can change the angle with the stick. It hits opponents repeatedly for massive damage.",
    titlePt: "Laser de Fázon (Final Smash)",
    textPt: "Dispara um laser massivo que até atravessa o cenário. Durante o feixe, você pode alterar o ângulo com o analógico. Ele acerta os adversários repetidamente causando um grande dano.",
  },
];

async function main() {
  const darkSamus = await db.fighter.findFirst({
    where: { name: "Dark Samus" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!darkSamus) { console.log("Dark Samus not found"); return; }

  console.log(`Found Dark Samus (${darkSamus.id}) with ${darkSamus.tips.length} tips`);

  let updated = 0;
  for (const data of DARK_SAMUS_TIPS) {
    const tip = darkSamus.tips.find(t => t.titleEn === data.titleEn);
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

  // Curator Overview
  await db.fighter.update({
    where: { name: "Dark Samus" },
    data: {
      curatorOverviewEn: `Dark Samus is Samus's echo — same weapons, same frame, entirely different energy. Where Samus fires charged plasma, Dark Samus pulses with Phazon, the radioactive corruption that drove the Metroid Prime saga. As an echo fighter she plays identically to her counterpart, making her the choice for players who want Samus's precise zoning game wrapped in a haunting, alien aesthetic. She is not a villain wearing a familiar suit — she is something born from the suit itself.`,
      curatorOverviewPt: `Dark Samus é o eco de Samus — mesmas armas, mesmos frames, energia completamente diferente. Onde Samus dispara plasma carregado, Dark Samus pulsa com Fázon, a corrupção radioativa que moveu a saga Metroid Prime. Como echo fighter, ela joga de forma idêntica à sua contraparte, sendo a escolha para quem quer o preciso jogo de zoneamento de Samus embrulhado em uma estética alienígena e perturbadora. Ela não é uma vilã usando um traje familiar — ela é algo que nasceu do próprio traje.`,
      curatorOverviewJp: `ダークサムスはサムスのエコーファイター——同じ武器、同じ動作、まったく異なるエネルギー。サムスが充電プラズマを撃つ場所で、ダークサムスはメトロイドプライムサーガを席巻した放射性汚染物質「フェイゾン」を放つ。エコーファイターとして操作感はサムスと同一だが、不気味で異質なオーラに包まれている。彼女は見慣れたスーツを纏う敵ではなく、そのスーツ自体から生まれた存在だ。`,
      curatorOverviewJpEn: `Dark Samus is Samus's echo — same weapons, same frame, entirely different energy. Where Samus fires charged plasma, Dark Samus pulses with Phazon, the radioactive corruption that drove the Metroid Prime saga. As an echo fighter she plays identically to her counterpart, making her the choice for players who want Samus's precise zoning game wrapped in a haunting, alien aesthetic. She is not a villain wearing a familiar suit — she is something born from the suit itself.`,
    },
  });
  console.log("✅ Curator Overview salvo (4 idiomas)");

  console.log(`\n✅ ${updated}/${DARK_SAMUS_TIPS.length} tips atualizadas`);
  await db.$disconnect();
}
main().catch(console.error);
