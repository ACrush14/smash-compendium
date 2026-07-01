import { db } from "../../lib/db";

// Textos OFICIAIS do Kirby (SSBU) — texto exato do jogo, fornecido pelo usuário em 2026-06-30
// Vários titleJp estavam errados na versão anterior; todos corrigidos aqui

const KIRBY_TIPS = [
  {
    titleEn: "[★☆☆] Kirby's Origins",
    titleJp: "カービィの初登場作品",
    textJp: "カービィのデビュー作は１９９２年に発売された『星のカービィ』。デデデ大王に盗まれた食べ物と秘宝を取り戻すためデデデ山に向かう。",
    titleJpEn: "Kirby's Origins",
    textJpEn: "Kirby's debut was in \"Kirby's Dream Land,\" released in 1992. He set out for Mt. Dedede to reclaim food and treasure stolen by King Dedede.",
    titlePt: "As Origens do Kirby",
    textPt: "O debut do Kirby foi em \"Kirby's Dream Land,\" lançado em 1992. Ele partiu para o Monte Dedede para recuperar alimentos e tesouros roubados pelo Rei Dedede.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "なんでも吸い込むくいしんぼうで、敵を吸い込めば、能力をコピーして使うことができる。空気を吸い込んで風船のようにふくらみ、手をパタパタさせて飛ぶホバリングも得意。",
    titleJpEn: "In His Series",
    textJpEn: "A greedy fellow who swallows just about anything — swallow an enemy and you can copy its ability. He's also skilled at hovering, puffing up with air like a balloon and flapping his tiny arms to fly.",
    titlePt: "Na Série Original",
    textPt: "Um ser guloso que engole praticamente tudo — engole um inimigo e pode copiar sua habilidade para usar. Ele também é excelente a planar, enchendo-se de ar como um balão e batendo os bracinhos para voar.",
  },
  {
    titleEn: "[★☆☆] Kirby's Copy Abilities",
    titleJp: "カービィのコピー能力",
    textJp: "通常必殺ワザ「すいこみ」で見られる、相手のワザをコピーする能力は、ファミコン版『星のカービィ 夢の泉の物語』で初めて使えるようになった。",
    titleJpEn: "Kirby's Copy Abilities",
    textJpEn: "The ability to copy opponent moves seen with Inhale (Neutral Special) was first introduced in the Famicom game \"Kirby's Adventure.\"",
    titlePt: "As Habilidades de Cópia do Kirby",
    textPt: "A habilidade de copiar movimentos dos adversários vista com a Inalação (Especial Neutro) foi introduzida pela primeira vez no Famicom em \"Kirby's Adventure.\"",
  },
  {
    titleEn: "[★☆☆] Beginners and Experts Alike",
    titleJp: "初心者も上級者も",
    textJp: "カービィのデビュー作『星のカービィ』は初心者でも遊びやすい難易度。さらに、本編をクリアすると難易度の高いモードで遊ぶこともできる。",
    titleJpEn: "Beginners and Experts Alike",
    textJpEn: "Kirby's debut game \"Kirby's Dream Land\" is easy enough for beginners to enjoy. And once you clear the main story, a more challenging mode becomes available.",
    titlePt: "Para Iniciantes e Especialistas",
    textPt: "O jogo de estreia do Kirby, \"Kirby's Dream Land,\" é fácil o suficiente para iniciantes aproveitarem. E após terminar a história principal, um modo mais desafiador fica disponível.",
  },
  {
    titleEn: "[★☆☆] Multiplayer Kirby",
    titleJp: "カービィシリーズ初の２人同時プレイ",
    textJp: "カービィシリーズ７作目『星のカービィ スーパーデラックス』では、シリーズ初の要素として、２人同時プレイが可能になった。",
    titleJpEn: "First Co-op in the Kirby Series",
    textJpEn: "The 7th Kirby game, \"Kirby Super Star,\" introduced co-op play for the first time in the series, allowing two players to play simultaneously.",
    titlePt: "Primeiro Co-op da Série Kirby",
    textPt: "O 7º jogo Kirby, \"Kirby Super Star,\" introduziu o modo cooperativo pela primeira vez na série, permitindo que dois jogadores joguem simultaneamente.",
  },
  {
    titleEn: "[★☆☆] Inhale (Neutral Special)",
    titleJp: "すいこみ 【通常必殺ワザ】",
    textJp: "相手をほおばったまま、攻撃ボタンを押すと吐き出す。吐き出した相手をぶつけて攻撃することもできる。",
    titleJpEn: "Inhale (Neutral Special)",
    textJpEn: "While holding an opponent in your mouth, press the attack button to spit them out. You can also use the spat-out opponent as a projectile to hit others.",
    titlePt: "Inalação (Especial Neutro)",
    textPt: "Segure um adversário na boca e pressione o botão de ataque para cuspí-lo. Você também pode usar o adversário cusipido como projétil para acertar outros.",
  },
  {
    titleEn: "[★★☆] Inhale Items (Neutral Special)",
    titleJp: "アイテムのすいこみ 【通常必殺ワザ】",
    textJp: "一部のアイテムを吸い込める。ダメージを少しだけ回復できるが、爆発物を吸い込むとダメージを受ける。",
    titleJpEn: "Inhale Items (Neutral Special)",
    textJpEn: "Some items can be swallowed. Kirby recovers a small amount of damage, but swallowing explosives will damage him instead.",
    titlePt: "Inalar Itens (Especial Neutro)",
    textPt: "Alguns itens podem ser engolidos. O Kirby recupera uma pequena quantidade de dano, mas engolir explosivos causará dano nele.",
  },
  {
    titleEn: "[★☆☆] Inhale's Projectiles (Neutral Special)",
    titleJp: "すいこみの星型弾 【通常必殺ワザ】",
    textJp: "すいこんだファイターを吐き出し、発射する星型弾。そのファイターが重ければ重いほど、攻撃力が上がる。",
    titleJpEn: "Inhale's Star Shot (Neutral Special)",
    textJpEn: "The star-shaped projectile fired when spitting out a swallowed fighter. The heavier the fighter, the higher the attack power.",
    titlePt: "Estrela da Inalação (Especial Neutro)",
    textPt: "O projétil em forma de estrela disparado ao cuspir um lutador engolido. Quanto mais pesado o lutador, maior o poder de ataque.",
  },
  {
    titleEn: "[★☆☆] Hammer Flip (Side Special)",
    titleJp: "ハンマー 【横必殺ワザ】",
    textJp: "最大までためると強力な「鬼ごろし火炎ハンマー」に変化。ただし、ため続けると自分もダメージを受ける。",
    titleJpEn: "Hammer Flip (Side Special)",
    textJpEn: "Charging to full power transforms it into the mighty \"Gigaton Hammer.\" However, holding the charge too long will damage Kirby himself.",
    titlePt: "Hammer Flip (Especial Lateral)",
    textPt: "Carregar ao máximo o transforma no poderoso \"Martelo Gigante.\" No entanto, segurar a carga por muito tempo danificará o próprio Kirby.",
  },
  {
    titleEn: "[★★★] Charged Up Hammer Flip (Side Special)",
    titleJp: "鬼ごろし火炎ハンマー 【横必殺ワザ】",
    textJp: "最大までためると放てる鬼ごろし火炎ハンマーは、地上で使った時だけ振り始めに一瞬カービィが無敵になる。",
    titleJpEn: "Gigaton Hammer (Side Special)",
    textJpEn: "The fully charged Gigaton Hammer grants Kirby a brief moment of invincibility at the very start of the swing — but only when used on the ground.",
    titlePt: "Martelo Gigante (Especial Lateral)",
    textPt: "O Martelo Gigante totalmente carregado concede ao Kirby um breve momento de invencibilidade no início do balanço — mas apenas quando usado no chão.",
  },
  {
    titleEn: "[★☆☆] Final Cutter (Up Special)",
    titleJp: "ファイナルカッター 【上必殺ワザ】",
    textJp: "ジャンプしながら斬り上げ、真下に向かって斬り下ろす。斬り下ろし直後に出る衝撃波でもダメージを与えられる。",
    titleJpEn: "Final Cutter (Up Special)",
    textJpEn: "Slashes upward with a jump, then cuts straight down. The shockwave released just after the downward slash can also deal damage.",
    titlePt: "Final Cutter (Especial Cima)",
    textPt: "Corta para cima com um salto, depois corta direto para baixo. A onda de choque liberada logo após o corte descendente também pode causar dano.",
  },
  {
    titleEn: "[★★☆] Canceling Stone (Down Special)",
    titleJp: "ストーンの解除 【下必殺ワザ】",
    textJp: "ストーン状態の時に、もう一度必殺ワザボタンを押すとストーン状態を解除できる。フェイントとして有効。",
    titleJpEn: "Canceling Stone (Down Special)",
    textJpEn: "While in Stone form, press the special move button again to cancel it. Effective as a feint.",
    titlePt: "Cancelar Pedra (Especial Baixo)",
    textPt: "Enquanto estiver em forma de Pedra, pressione o botão de movimento especial novamente para cancelá-lo. Eficaz como um fintar.",
  },
  {
    titleEn: "[★☆☆] Stone Transformation (Down Special)",
    titleJp: "ストーンで変身 【下必殺ワザ】",
    textJp: "ワザを出すたびにカービィの姿がランダムに変化。しかし、どの姿でもワザの性能は同じ。",
    titleJpEn: "Stone Transformation (Down Special)",
    textJpEn: "Kirby's form changes randomly each time the move is used. However, the move's properties are the same regardless of which form he takes.",
    titlePt: "Transformação em Pedra (Especial Baixo)",
    textPt: "A forma do Kirby muda aleatoriamente a cada vez que o movimento é usado. No entanto, as propriedades do movimento são as mesmas independentemente da forma assumida.",
  },
  {
    titleEn: "[★☆☆] Ultra Sword (Final Smash)",
    titleJp: "ウルトラソード 【最後の切りふだ】",
    textJp: "ウルトラソードで斬りつけ、連続攻撃する最後の切りふだ。地形があっても当たるうえに、動きが大きいので周りを巻き込みやすい。",
    titleJpEn: "Ultra Sword (Final Smash)",
    textJpEn: "A Final Smash that slashes with the Ultra Sword, delivering a continuous combo. It hits through terrain, and its wide sweeping motion easily catches nearby opponents.",
    titlePt: "Ultra Sword (Final Smash)",
    textPt: "Um Final Smash que corta com a Ultra Sword, realizando um combo contínuo. Acerta através do terreno, e seu amplo movimento de varredura facilmente pega adversários próximos.",
  },
  {
    titleEn: "[★☆☆] Squish Kick (Down Tilt Attack)",
    titleJp: "ローキック 【下強攻撃】",
    textJp: "攻撃を当てた相手を、たまに転倒させることができる。相手の状態をよく見て、転倒したらつかみやスマッシュ攻撃で追撃しよう。",
    titleJpEn: "Low Kick (Down Tilt Attack)",
    textJpEn: "This attack can occasionally trip opponents it hits. Watch carefully — if they trip, follow up with a grab or smash attack.",
    titlePt: "Chute Baixo (Ataque Inclinado Baixo)",
    textPt: "Este ataque pode ocasionalmente fazer adversários tropeçarem. Observe com atenção — se eles tropecarem, faça um acompanhamento com um agarrão ou ataque smash.",
  },
  {
    titleEn: "[★☆☆] Burning (Dash Attack)",
    titleJp: "バーニング 【ダッシュ攻撃】",
    textJp: "炎を体にまとい、スクリューしながら相手に突っ込む。地面に沿って進むため、ガケからは飛び出さない。",
    titleJpEn: "Burning (Dash Attack)",
    textJpEn: "Kirby charges at the opponent cloaked in flames while spinning. Because he travels along the ground, he won't fly off a ledge.",
    titlePt: "Queimadura (Ataque em Disparada)",
    textPt: "O Kirby avança em direção ao adversário envolto em chamas enquanto gira. Como ele avança pelo chão, não voará de uma borda.",
  },
  {
    titleEn: "[★★☆] Lucario Copy Ability",
    titleJp: "ルカリオのコピー能力",
    textJp: "ルカリオをコピーすると使えるようになる「はどうだん」は、カービィの蓄積ダメージが高くなっても強くならない。",
    titleJpEn: "Lucario Copy Ability",
    textJpEn: "The \"Aura Sphere\" available when copying Lucario does NOT become stronger as Kirby accumulates damage.",
    titlePt: "Habilidade de Cópia do Lucario",
    textPt: "O \"Raio de Aura\" disponível ao copiar o Lucario NÃO fica mais forte à medida que o Kirby acumula dano.",
  },
  {
    titleEn: "[★★☆] Rosalina & Luma Copy Ability",
    titleJp: "ロゼッタ＆チコのコピー能力",
    textJp: "ロゼッタ＆チコをコピーすると飛ばせるようになるチコは、突進するとすぐに消えてしまうため、遠隔操作はできない。",
    titleJpEn: "Rosalina & Luma Copy Ability",
    textJpEn: "The Luma that can be launched when copying Rosalina & Luma disappears immediately upon charging, so remote control is not possible.",
    titlePt: "Habilidade de Cópia de Rosalina & Luma",
    textPt: "O Luma que pode ser lançado ao copiar Rosalina & Luma desaparece imediatamente ao avançar, então o controle remoto não é possível.",
  },
  {
    titleEn: "[★★☆] Miinhale",
    titleJp: "Miiをすいこみ",
    textJp: "Miiをコピーしたカービィは、頭にコピーしたMiiのお面をかぶる。どのMiiをコピーしたか分かりやすいが、装備しているぼうしは反映されない。",
    titleJpEn: "Miinhale",
    textJpEn: "A Kirby who has copied a Mii Fighter wears a mask of that Mii on his head. It's easy to tell which Mii was copied, but the Mii's equipped hat is not reflected.",
    titlePt: "Inalação de Mii",
    textPt: "Um Kirby que copiou um Mii Fighter usa uma máscara daquele Mii na cabeça. É fácil distinguir qual Mii foi copiado, mas o chapéu equipado pelo Mii não é refletido.",
  },
  {
    titleEn: "[★★★] Copy Copying",
    titleJp: "コピーをコピー",
    textJp: "必殺ワザをコピーしているカービィをコピーすれば、コピーしているワザを相手から奪いとることが可能。奪われた相手はコピー状態を解かれる。",
    titleJpEn: "Copy Copying",
    textJpEn: "If you copy a Kirby who has already copied a special move, you can steal that move from them. The Kirby who was stolen from loses their copy.",
    titlePt: "Copiar a Cópia",
    textPt: "Se você copiar um Kirby que já copiou um movimento especial, você pode roubar esse movimento dele. O Kirby roubado perde sua cópia.",
  },
  {
    titleEn: "[★☆☆] Copying Another Kirby",
    titleJp: "カービィ同士でのコピー",
    textJp: "コピー能力を持っていないカービィをすいこんでも、何も変化は起きないが、コピー能力を持っているカービィをすいこむと、相手の能力を奪うことができる。",
    titleJpEn: "Copying Another Kirby",
    textJpEn: "Swallowing a Kirby with no Copy Ability does nothing. But swallowing a Kirby who has one lets you steal their ability.",
    titlePt: "Copiar Outro Kirby",
    textPt: "Engolir um Kirby sem Habilidade de Cópia não faz nada. Mas engolir um Kirby que tem uma permite roubar a habilidade dele.",
  },
  {
    titleEn: "[★☆☆] Taunt",
    titleJp: "アピール",
    textJp: "アピールには、コピー能力を解除する効果がある。うまく使えば、相手の能力を使いわけながら戦える。",
    titleJpEn: "Taunt",
    textJpEn: "Taunting also cancels Kirby's current Copy Ability. Used skillfully, this lets you switch between abilities mid-battle.",
    titlePt: "Provocação",
    textPt: "Provocar também cancela a Habilidade de Cópia atual do Kirby. Usado com habilidade, isso permite alternar entre habilidades durante a batalha.",
  },
  {
    titleEn: "[★☆☆] Jump",
    titleJp: "ジャンプ",
    textJp: "カービィは空中で５回までジャンプできる。遠くまでふっとばされても、復帰しやすいファイター。",
    titleJpEn: "Jump",
    textJpEn: "Kirby can jump up to five times in the air. Even when launched far away, he's a fighter who can easily recover.",
    titlePt: "Pulo",
    textPt: "O Kirby pode pular até cinco vezes no ar. Mesmo quando lançado longe, ele é um lutador que pode facilmente se recuperar.",
  },
  {
    titleEn: "[★☆☆] The Jump Masters",
    titleJp: "連続ジャンプ回数ランキングBEST５",
    textJp: "１位は「カービィ」、「メタナイト」、「プリン」が６回で並んだ。４位は５回の「デデデ」。５位は「ピット」と「ブラックピット」で４回。",
    titleJpEn: "Top 5 Multi-Jump Rankings",
    textJpEn: "1st place: \"Kirby,\" \"Meta Knight,\" and \"Jigglypuff\" tied at 6 jumps. 4th place: \"King Dedede\" with 5. 5th place: \"Pit\" and \"Dark Pit\" with 4.",
    titlePt: "Top 5 Ranking de Pulos Consecutivos",
    textPt: "1º lugar: \"Kirby\", \"Meta Knight\" e \"Jigglypuff\" empatam com 6 saltos. 4º lugar: \"Rei Dedede\" com 5. 5º lugar: \"Pit\" e \"Dark Pit\" com 4.",
  },
];

async function main() {
  const kirby = await db.fighter.findFirst({
    where: { name: "Kirby" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!kirby) { console.log("Kirby not found"); return; }

  console.log(`Found Kirby (${kirby.id}) with ${kirby.tips.length} tips`);

  let updated = 0;
  for (const data of KIRBY_TIPS) {
    const tip = kirby.tips.find(t => t.titleEn === data.titleEn);
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

  // Fix SSBB trophy timing
  const ssbbTrophy = await db.collectible.findFirst({
    where: { name: "Kirby", smashGameVersion: "SSBB", type: "TROPHY" },
    select: { id: true, videoStartSec: true, videoEndSec: true },
  });
  if (ssbbTrophy) {
    await db.collectible.update({
      where: { id: ssbbTrophy.id },
      data: { videoStartSec: 4487, videoEndSec: 4498 },
    });
    console.log(`✅ SSBB Trophy Kirby: ${ssbbTrophy.videoStartSec}–${ssbbTrophy.videoEndSec} → 4487–4498s (1:14:47–1:14:58)`);
  }

  console.log(`\n✅ ${updated}/${KIRBY_TIPS.length} tips atualizadas`);
  await db.$disconnect();
}
main().catch(console.error);
