import { db } from "../../lib/db";

// Textos OFICIAIS do Fox (SSBU) — texto exato do jogo, fornecido pelo usuário em 2026-07-01
// SSB64 bio JP de wikiwiki.jp (seção 64, キャラクター紹介)

const SSB64_BIO_JP = "亡き父の遺志をつぎ、やとわれ遊撃隊「スターフォックス」の若きリーダーとして宇宙狭しと転戦している。高性能戦闘機・アーウィンを駆って、ライラット系のために一肌ぬいだことは記憶に新しい。チームメイトの信頼を得るには、やや経験不足とも言われているようだ。";
const SSB64_BIO_JPEN = "Carrying on his late father's wishes, Fox fights across the cosmos as the young leader of the mercenary team \"Star Fox.\" He's fresh off a battle for the Lylat System in his high-performance Arwing fighter. He's said to still be a bit short on experience when it comes to earning the full trust of his teammates.";
const SSB64_BIO_PT = "Carregando o desejo de seu pai falecido, Fox combate pelo cosmos como jovem líder do grupo mercenário \"Star Fox.\" Ele acabou de lutar pelo sistema Lylat em seu caça de alta performance Arwing. Dizem que ainda lhe falta um pouco de experiência para conquistar totalmente a confiança de seus companheiros.";

const FOX_TIPS = [
  {
    titleEn: "[★☆☆] Fox's Origins",
    titleJp: "フォックスの初登場作品",
    textJp: "フォックスのデビュー作は、１９９２年に発売された『スターフォックス』。戦闘機「アーウィン」に乗り込み、悪の科学者アンドルフに戦いを挑む。",
    titleJpEn: "Fox's Origins",
    textJpEn: "Fox's debut was \"Star Fox,\" released in 1993. He boards the fighter \"Arwing\" to take on the evil scientist Andross.",
    titlePt: "As Origens do Fox",
    textPt: "O debut do Fox foi \"Star Fox\", lançado em 1993. Ele embarca no caça \"Arwing\" para enfrentar o cientista maligno Andross.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "正義感が強く、真面目で仲間思いの、雇われ遊撃隊「スターフォックス」のリーダー。父親が消息を絶った原因、科学者アンドルフを倒すべく、惑星ベノムへと向かう。",
    titleJpEn: "In His Series",
    textJpEn: "Fox is the leader of the mercenary team \"Star Fox\" — strong sense of justice, serious, and caring for his teammates. He heads to planet Venom to defeat Andross, the scientist responsible for his father's disappearance.",
    titlePt: "Na Série Original",
    textPt: "Fox é o líder do esquadrão mercenário \"Star Fox\" — forte senso de justiça, sério e leal aos companheiros. Ele parte para o planeta Venom para derrotar Andross, o cientista responsável pelo desaparecimento de seu pai.",
  },
  {
    titleEn: "[★☆☆] Blaster (Neutral Special)",
    titleJp: "ブラスター 【通常必殺ワザ】",
    textJp: "飛距離が長い飛び道具で、高速で連射できる。相手をひるませられないので、離れたところで使おう。",
    titleJpEn: "Blaster (Neutral Special)",
    textJpEn: "A long-range projectile that can be fired at high speed. Since it doesn't make opponents flinch, use it from a distance.",
    titlePt: "Blaster (Especial Neutro)",
    textPt: "Um projétil de longo alcance que pode ser disparado em alta velocidade. Como não faz os adversários recuarem, use-o à distância.",
  },
  {
    titleEn: "[★★☆] Fox Illusion (Side Special)",
    titleJp: "フォックスイリュージョン 【横必殺ワザ】",
    textJp: "地上で出すと、必ずガケで止まるので自滅の心配が少ない。障害物のない空中で使うと、行き過ぎて自滅につながりやすい。",
    titleJpEn: "Fox Illusion (Side Special)",
    textJpEn: "When used on the ground, it always stops at the ledge, so there's little risk of self-destruction. Using it in open air without obstacles can lead to overshooting and self-destructing.",
    titlePt: "Fox Illusion (Especial Lateral)",
    textPt: "Usado no chão, sempre para na borda, então há pouco risco de autodestruição. Usar no ar sem obstáculos pode levar a ultrapassar a borda e se autodestruir.",
  },
  {
    titleEn: "[★★☆] Using Fox Illusion Effectively (Side Special)",
    titleJp: "フォックスイリュージョンの使いどころ 【横必殺ワザ】",
    textJp: "相手のシールドで防がれると、その場で止まってしまう。反撃を受けてしまうため、乱発するよりもスキを突いて使おう。",
    titleJpEn: "Using Fox Illusion Effectively (Side Special)",
    textJpEn: "If blocked by an opponent's shield, Fox stops in place — leaving you open to counterattacks. Use it to exploit openings rather than spamming it.",
    titlePt: "Usando Fox Illusion Efetivamente (Especial Lateral)",
    textPt: "Se bloqueado pelo escudo do adversário, Fox para no lugar — deixando-o vulnerável a contra-ataques. Use-o para explorar aberturas em vez de usá-lo em excesso.",
  },
  {
    titleEn: "[★★☆] Reflector (Down Special)",
    titleJp: "リフレクターの特性 【下必殺ワザ】",
    textJp: "相手の飛び道具を反射するワザだが、最初に一瞬だけ攻撃力があるので、密着状態なら攻撃にも使える。",
    titleJpEn: "Reflector Properties (Down Special)",
    textJpEn: "Although it's a move that reflects projectiles, it briefly has attack power at the very start — so it can also be used offensively at close range.",
    titlePt: "Propriedades do Reflector (Especial Baixo)",
    textPt: "Embora seja um movimento que reflete projéteis, tem poder de ataque brevemente no início — então também pode ser usado ofensivamente em curta distância.",
  },
  {
    titleEn: "[★★★] Reflector in the Air (Down Special)",
    titleJp: "空中でのリフレクター 【下必殺ワザ】",
    textJp: "空中でリフレクターを使うと落下速度を和らげる。これを利用すれば、地上で着地直後を狙う相手の攻撃タイミングをずらすことができる。",
    titleJpEn: "Reflector in the Air (Down Special)",
    textJpEn: "Using the Reflector in the air slows Fox's fall speed. This can be used to throw off the timing of opponents waiting to attack right as you land.",
    titlePt: "Reflector no Ar (Especial Baixo)",
    textPt: "Usar o Reflector no ar reduz a velocidade de queda do Fox. Isso pode ser usado para deslocar o timing dos adversários que esperam para atacar logo após o pouso.",
  },
  {
    titleEn: "[★☆☆] Launching with Reflector (Down Special)",
    titleJp: "リフレクターでふっとばし 【下必殺ワザ】",
    textJp: "リフレクターを直接当てると、相手を低めにふっとばすことができる。場外の相手に当てることで、復帰を阻止する使い方もできる。",
    titleJpEn: "Launching with Reflector (Down Special)",
    textJpEn: "Hitting an opponent directly with the Reflector launches them at a low angle. This can also be used to hit offstage opponents and prevent their recovery.",
    titlePt: "Arremesso com o Reflector (Especial Baixo)",
    textPt: "Acertar um adversário diretamente com o Reflector o arremessa em ângulo baixo. Também pode ser usado para acertar adversários fora do palco e impedir sua recuperação.",
  },
  {
    titleEn: "[★☆☆] Team Star Fox (Final Smash)",
    titleJp: "チームスターフォックス 【最後の切りふだ】",
    textJp: "ロックオンした相手に、チームスターフォックスで総攻撃する。相手にウルフがいる場合のみ、フォックスの特別なセリフを聞ける。",
    titleJpEn: "Team Star Fox (Final Smash)",
    textJpEn: "Locks on to opponents and unleashes a full-scale attack with Team Star Fox. A special line from Fox can only be heard when Wolf is among the opponents.",
    titlePt: "Equipe Star Fox (Final Smash)",
    textPt: "Mira nos adversários e desencadeia um ataque em larga escala com a Equipe Star Fox. Uma fala especial do Fox só pode ser ouvida quando Wolf está entre os adversários.",
  },
  {
    titleEn: "[★★★] Tornado Kick (Forward Air Attack)",
    titleJp: "トルネードシャフト 【前空中攻撃】",
    textJp: "５段目と着地時の攻撃をあえて当てないことで相手をバウンドさせ、連続攻撃の起点とすることが可能。",
    titleJpEn: "Tornado Shaft (Forward Air Attack)",
    textJpEn: "By intentionally not connecting the 5th hit and the landing hit, you can make the opponent bounce and set up a follow-up combo.",
    titlePt: "Chute Tornado (Ataque Aéreo Frontal)",
    textPt: "Ao não conectar intencionalmente o 5º golpe e o golpe de pouso, você pode fazer o adversário quicar e preparar um combo de acompanhamento.",
  },
  {
    titleEn: "[★☆☆] McCloud Flip (Up Air)",
    titleJp: "テイル＆レッグ 【上空中攻撃】",
    textJp: "しっぽとキックによる２段攻撃。ダメージとふっとばし力も優秀。",
    titleJpEn: "Tail & Leg (Up Air Attack)",
    textJpEn: "A two-hit attack with a tail swipe followed by a kick. Both damage and knockback power are excellent.",
    titlePt: "Cauda & Chute (Ataque Aéreo Cima)",
    textPt: "Um ataque de dois golpes com um chicote de cauda seguido de um chute. Tanto o dano quanto o poder de arremesso são excelentes.",
  },
];

async function main() {
  const fox = await db.fighter.findFirst({
    where: { name: "Fox" },
    select: {
      id: true,
      tips: { select: { id: true, titleEn: true } },
      bios: { select: { id: true, smashGameVersion: true, contentJp: true } },
    },
  });
  if (!fox) { console.log("Fox not found"); return; }
  console.log(`Fox (${fox.id}): ${fox.tips.length} tips, ${fox.bios.length} bios`);

  // Fix SSB64 bio JP (currently "NOT FOUND")
  const bio64 = fox.bios.find(b => b.smashGameVersion === "SSB64");
  if (bio64 && (!bio64.contentJp || bio64.contentJp === "NOT FOUND")) {
    await db.fighterBio.update({
      where: { id: bio64.id },
      data: { contentJp: SSB64_BIO_JP, contentJpEn: SSB64_BIO_JPEN, contentPt: SSB64_BIO_PT },
    });
    console.log("✅ Bio SSB64: JP + JpEn + PT adicionados");
  } else {
    console.log("  ⏭️  Bio SSB64 JP já existe, pulando");
  }

  // Update tips
  let updated = 0;
  for (const data of FOX_TIPS) {
    const tip = fox.tips.find(t => t.titleEn === data.titleEn);
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

  console.log(`\n✅ ${updated}/${FOX_TIPS.length} tips atualizadas`);
  await db.$disconnect();
}
main().catch(console.error);
