import { db } from "../../lib/db";

const TIPS = [
  { titleEn: "[★☆☆] Pichu's Origins", titleJp: "ピチューの初登場作品", textJp: "ピチューのデビュー作は、１９９９年発売の『ポケットモンスター 金・銀』。ピカチュウ同士かライチュウ同士の♂♀を預けて、見つかるタマゴから生まれる。", titleJpEn: "Pichu's Origins", textJpEn: "Pichu's debut was in \"Pocket Monsters Gold & Silver,\" released in 1999. It's born from an egg found by depositing a male and female Pikachu, or a male and female Raichu, together.", titlePt: "As Origens do Pichu", textPt: "O debut do Pichu foi em \"Pocket Monsters Gold & Silver,\" lançado em 1999. Ele nasce de um ovo encontrado ao deixar um Pikachu macho e fêmea, ou um Raichu macho e fêmea, juntos." },
  { titleEn: "[★☆☆] In Its Series", titleJp: "原作では", textJp: "ピカチュウよりも、電気をためることが苦手。ちょっとした刺激で不意に放電したり、自分で感電してしまうことがある。", titleJpEn: "In Its Series", textJpEn: "It's even worse than Pikachu at storing electricity. It may suddenly discharge from the slightest stimulus, or even shock itself.", titlePt: "Na Série Original", textPt: "É ainda pior que o Pikachu em armazenar eletricidade. Pode descarregar repentinamente com o menor estímulo, ou até se chocar." },
  { titleEn: "[★☆☆] Thunder Jolt (Neutral Special)", titleJp: "でんげき 【通常必殺ワザ】", textJp: "ピカチュウの「でんげき」よりも、速く小さな軌道で飛んでいく。使うとダメージを受けるが、攻撃力はピカチュウよりも少しだけ高い。", titleJpEn: "Thunder Jolt (Neutral Special)", textJpEn: "It flies faster and along a smaller trajectory than Pikachu's Thunder Jolt. Using it damages Pichu, but its attack power is slightly higher than Pikachu's.", titlePt: "Thunder Jolt (Especial Neutro)", textPt: "Voa mais rápido e em uma trajetória menor que o Thunder Jolt do Pikachu. Usá-lo causa dano no Pichu, mas seu poder de ataque é um pouco maior que o do Pikachu." },
  { titleEn: "[★☆☆] Skull Bash (Side Special)", titleJp: "ロケットずつき 【横必殺ワザ】", textJp: "最大までためる時間がかなり長いが、ためきった時の攻撃力はすさまじい。ただし、勢いで自滅するリスクもある。", titleJpEn: "Skull Bash (Side Special)", textJpEn: "It takes quite a long time to charge fully, but the attack power once fully charged is tremendous. However, there's also a risk of self-destructing from the momentum.", titlePt: "Skull Bash (Especial Lateral)", textPt: "Leva bastante tempo para carregar totalmente, mas o poder de ataque quando totalmente carregado é tremendo. Porém, também há o risco de se autodestruir pelo impulso." },
  { titleEn: "[★☆☆] Agility (Up Special)", titleJp: "こうそくいどう 【上必殺ワザ】", textJp: "ピカチュウより長距離を移動することができる。自分はダメージを受けるが、相手に当たってもダメージを与えられない。", titleJpEn: "Agility (Up Special)", textJpEn: "It can travel a longer distance than Pikachu's version. Pichu takes damage from using it, but it deals no damage even if it hits an opponent.", titlePt: "Agility (Especial Cima)", textPt: "Pode percorrer uma distância maior que a versão do Pikachu. O Pichu sofre dano ao usá-lo, mas não causa dano mesmo se acertar um adversário." },
  { titleEn: "[★☆☆] Thunder (Down Special)", titleJp: "かみなり 【下必殺ワザ】", textJp: "上空からかみなりを落として、強力な放電で周りの相手をふっとばす。自分にかみなりがヒットすると、ダメージを受けてしまう。", titleJpEn: "Thunder (Down Special)", textJpEn: "Drops a bolt of lightning from above, launching nearby opponents with a powerful discharge. If the lightning hits Pichu itself, it takes damage.", titlePt: "Thunder (Especial Baixo)", textPt: "Solta um raio do alto, arremessando os adversários próximos com uma descarga poderosa. Se o raio atingir o próprio Pichu, ele sofre dano." },
  { titleEn: "[★☆☆] Volt Tackle (Final Smash)", titleJp: "ボルテッカー 【最後の切りふだ】", textJp: "電撃の球となって画面内を反射しまくり、相手を追い詰める。ピカチュウよりも攻撃力とふっとばし力が強い反面、自分も大きなダメージを受ける。", titleJpEn: "Volt Tackle (Final Smash)", textJpEn: "Becomes a ball of electricity that bounces repeatedly around the screen, cornering opponents. Its attack power and knockback are stronger than Pikachu's version, but Pichu also takes heavy damage in return.", titlePt: "Volt Tackle (Final Smash)", textPt: "Torna-se uma bola de eletricidade que quica repetidamente pela tela, encurralando os adversários. Seu poder de ataque e arremesso são mais fortes que a versão do Pikachu, mas o Pichu também sofre dano pesado em troca." },
  { titleEn: "[★☆☆] Damage from Electricity", titleJp: "電気によるダメージ", textJp: "電気をまとうワザを使うと、自分自身もダメージを受けてしまう。その分、攻撃力とふっとばし力が高い。", titleJpEn: "Damage from Electricity", textJpEn: "Using moves that involve electricity damages Pichu itself as well. In exchange, their attack power and knockback are higher.", titlePt: "Dano por Eletricidade", textPt: "Usar golpes que envolvem eletricidade também causa dano no próprio Pichu. Em troca, o poder de ataque e arremesso deles é maior." },
  { titleEn: "[★☆☆] The Three Lightest Fighters", titleJp: "軽さランキングBEST３", textJp: "１位は「ピチュー」、２位は「プリン」、３位は「Mr.ゲーム＆ウォッチ」と「ゼニガメ」。体が軽いためふっとばされやすいが、連続攻撃からは抜け出しやすい。", titleJpEn: "Top 3 Lightest Fighters", textJpEn: "1st place: \"Pichu.\" 2nd place: \"Jigglypuff.\" 3rd place (tied): \"Mr. Game & Watch\" and \"Squirtle.\" Lighter fighters are easier to launch, but also easier to escape combos with.", titlePt: "Top 3 Lutadores Mais Leves", textPt: "1º lugar: \"Pichu.\" 2º lugar: \"Jigglypuff.\" 3º lugar (empate): \"Mr. Game & Watch\" e \"Squirtle.\" Lutadores mais leves são mais fáceis de arremessar, mas também mais fáceis de escapar de combos." },
];

async function main() {
  const pichu = await db.fighter.findFirst({
    where: { name: "Pichu" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!pichu) { console.log("Pichu not found"); return; }

  let updated = 0;
  for (const data of TIPS) {
    const tip = pichu.tips.find(t => t.titleEn === data.titleEn);
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
