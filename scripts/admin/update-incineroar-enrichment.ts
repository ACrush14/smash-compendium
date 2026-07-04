import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Incineroar's Origins",
    titleJp: "ガオガエンの初登場作品",
    textJp: "ガオガエンの初登場は、２０１６年発売の『ポケットモンスター サン・ムーン』。プロレスラーのように闘志を燃やし、「もうか」の特性を持っている。",
    titleJpEn: "Incineroar's Debut Work",
    textJpEn: "Incineroar's debut was in Pokémon Sun & Moon, released in 2016. It burns with fighting spirit like a pro wrestler, and has the Blaze ability.",
    titlePt: "As Origens de Incineroar",
    textPt: "A estreia de Incineroar foi em Pokémon Sol e Lua, lançado em 2016. Ele arde com espírito de luta como um lutador de wrestling, e possui a habilidade Blaze.",
  },
  {
    titleEn: "[★☆☆] In Its Series",
    titleJp: "原作では",
    textJp: "最初に選ぶ３匹のポケモンの１匹、ニャビーの次の進化、ニャヒートから進化する。こうげき・とくこう・ぼうぎょ・とくぼうが高く、能力のバランスの良いポケモン。",
    titleJpEn: "In the Original Games",
    textJpEn: "It evolves from Torracat, which evolves from Litten, one of the three starter Pokémon you can choose at the beginning of the game. It's a well-balanced Pokémon with high Attack, Sp. Atk, Defense, and Sp. Def.",
    titlePt: "Nos Jogos Originais",
    textPt: "Ele evolui de Torracat, que evolui de Litten, um dos três Pokémon iniciais que você pode escolher no começo do jogo. É um Pokémon bem equilibrado, com Ataque, Ataque Especial, Defesa e Defesa Especial altos.",
  },
  {
    titleEn: "[★☆☆] Darkest Lariat (Neutral Special)",
    titleJp: "DDラリアット 【通常必殺ワザ】",
    textJp: "ワザを出した直後、一瞬無敵になるうえ、相手に与えるダメージは強力。両腕をぐるぐると回している時は、スティック入力で前後に移動もできる。",
    titleJpEn: "Darkest Lariat (Neutral Special)",
    textJpEn: "Right after using the move, it becomes invincible for a moment, and it deals powerful damage to the opponent. While it's spinning its arms, you can also move it forward or backward with the stick.",
    titlePt: "Darkest Lariat (Especial Neutro)",
    textPt: "Logo após usar o golpe, ele fica invencível por um instante, e causa dano poderoso no oponente. Enquanto gira os braços, você também pode movê-lo para frente ou para trás com o direcional.",
  },
  {
    titleEn: "[★☆☆] Alolan Whip (Side Special)",
    titleJp: "ロープスイング 【横必殺ワザ】",
    textJp: "つかんだ相手を、どこからともなく現れたロープに投げ飛ばし、追撃をしかける。相手がはね返ってくる時に押すボタンのタイミングで、追撃ワザが変化する。",
    titleJpEn: "Alolan Whip (Side Special)",
    textJpEn: "Throws the grabbed opponent into ropes that appear out of nowhere and follows up with an attack. The follow-up move changes depending on the timing of the button press as the opponent bounces back.",
    titlePt: "Alolan Whip (Especial Lateral)",
    textPt: "Arremessa o oponente agarrado contra cordas que aparecem do nada e emenda com um ataque. O golpe seguinte muda dependendo do timing em que o botão é pressionado enquanto o oponente quica de volta.",
  },
  {
    titleEn: "[★☆☆] Controls during Cross Chop (Up Special)",
    titleJp: "クロスチョップ中の操作 【上必殺ワザ】",
    textJp: "急降下する時にスティックを左右に倒すと、着地する位置が少し変わる。また、急降下中にスティックを下に倒しておくと、すり抜け床を通過できる。",
    titleJpEn: "Controls during Cross Chop (Up Special)",
    textJpEn: "Tilting the stick left or right while diving down slightly changes the landing position. Also, holding the stick downward while diving lets you pass through soft platforms.",
    titlePt: "Controles durante o Cross Chop (Especial Superior)",
    textPt: "Inclinar o direcional para esquerda ou direita durante a queda muda um pouco a posição de aterrissagem. Além disso, segurar o direcional para baixo durante a queda permite atravessar plataformas soltas.",
  },
  {
    titleEn: "[★★★] Recovery after Cross Chop (Up Special)",
    titleJp: "クロスチョップからの復帰 【上必殺ワザ】",
    textJp: "クロスチョップで急降下してしまっても、空中ジャンプと横必殺ワザを使える。頑張れば復帰できるかも。",
    titleJpEn: "Recovery after Cross Chop (Up Special)",
    textJpEn: "Even after diving down with Cross Chop, you can still use your midair jump and side special. If you're lucky, you might make it back to the stage!",
    titlePt: "Recuperação após o Cross Chop (Especial Superior)",
    textPt: "Mesmo depois de mergulhar com o Cross Chop, você ainda pode usar o pulo aéreo e o especial lateral. Com sorte, talvez você consiga voltar ao palco!",
  },
  {
    titleEn: "[★☆☆] Revenge (Down Special)",
    titleJp: "リベンジ 【下必殺ワザ】",
    textJp: "相手の攻撃を受け止めると、体が赤く燃え、次にヒットさせるワザの攻撃力が上がる。しかし、投げられたり大きなダメージを受けると、効果がなくなってしまう。",
    titleJpEn: "Revenge (Down Special)",
    textJpEn: "If it blocks an opponent's attack, its body glows red and the power of the next move that lands increases. However, the effect disappears if it gets thrown or takes heavy damage.",
    titlePt: "Revenge (Especial Inferior)",
    textPt: "Se ele bloquear um ataque do oponente, seu corpo brilha em vermelho e o poder do próximo golpe que acertar aumenta. Porém, o efeito desaparece se ele for arremessado ou sofrer dano grande.",
  },
  {
    titleEn: "[★☆☆] Max Malicious Moonsault (Final Smash)",
    titleJp: "ハイパーダーククラッシャー改 【最後の切りふだ】",
    textJp: "猛烈な突進で相手を捕まえて、強力な連続攻撃を加える、最後の切りふだ。突進の距離は、かなり長い。相手がつかみはずしで抜けた直後を狙うと、当てやすい。",
    titleJpEn: "Max Malicious Moonsault (Final Smash)",
    textJpEn: "A Final Smash that charges forward furiously to grab an opponent and unleash a powerful combo. The charge covers quite a long distance. It's easier to land right after an opponent breaks free from a grab.",
    titlePt: "Max Malicious Moonsault (Ataque Final)",
    textPt: "Um Ataque Final que avança furiosamente pra agarrar um oponente e desferir um combo poderoso. A investida cobre uma distância considerável. É mais fácil de acertar logo depois que um oponente escapa de uma pegada.",
  },
  {
    titleEn: "[★★☆] Taunting after an Attack Hits",
    titleJp: "攻撃が当たった時のアピール",
    textJp: "特定のワザをヒットさせた時、プロレスラーのようなアピールを行う。アピール中も動くことは可能で、スキが増えるようなことはない。",
    titleJpEn: "Taunt When an Attack Lands",
    textJpEn: "When certain moves hit, it strikes a pose like a pro wrestler. You can still move during the taunt, so it doesn't create any extra openings.",
    titlePt: "Provocação Quando um Ataque Acerta",
    textPt: "Quando certos golpes acertam, ele faz uma pose como um lutador de wrestling. Você ainda pode se mover durante a provocação, então ela não cria brechas extras.",
  },
  {
    titleEn: "[★☆☆] The Three Slowest Walkers",
    titleJp: "走りの遅さランキングBEST３",
    textJp: "１位は「ガオガエン」、２位は「ルフレ」、３位は「プリン」。ガオガエンは、走りは遅いが、ふっとばし力が高い。",
    titleJpEn: "Top 3 Slowest Runners",
    textJpEn: "#1 is Incineroar, #2 is Robin, and #3 is Jigglypuff. Incineroar may be slow, but it has high launching power.",
    titlePt: "Top 3 Corredores Mais Lentos",
    textPt: "#1 é Incineroar, #2 é Robin, e #3 é Jigglypuff. Incineroar pode ser lento, mas tem alto poder de lançamento.",
  },
];

async function main() {
  const incineroar = await db.fighter.findFirst({
    where: { name: "Incineroar" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!incineroar) { console.log("Incineroar not found"); return; }

  await db.fighter.update({
    where: { id: incineroar.id },
    data: {
      curatorOverviewEn: "Incineroar's kit rewards patience and commitment. Darkest Lariat is a brief invincibility window built into a spinning attack that can also be steered forward or backward, making it a solid approach and panic option in one. Alolan Whip is a full command grab into the ropes, and the timing of the follow-up button press changes which attack lands when the opponent bounces back. Cross Chop commits hard — the descent can be nudged left or right or dropped through platforms, and even after the dive, a midair jump and Alolan Whip give a real, if risky, shot at recovering. Revenge turns a well-timed block into a damage buff on the next hit, but a throw or a big enough hit erases it instantly, so it's high-risk for high-reward. Its Final Smash is a long-range grab combo that's easiest to land right as an opponent breaks free from a normal grab, and its post-hit taunts look showy but never actually leave it open. All of that comes at the cost of being the single slowest walker in the game — but Incineroar makes up for it with some of the hardest-hitting knockback around.",
      curatorOverviewPt: "O kit de Incineroar recompensa paciência e comprometimento. Darkest Lariat é uma breve janela de invencibilidade embutida num ataque giratório que também pode ser direcionado pra frente ou pra trás, funcionando tanto como opção de aproximação quanto de pânico. Alolan Whip é uma pegada comandada completa que joga o oponente contra as cordas, e o timing do botão de acompanhamento muda qual ataque acerta quando ele quica de volta. Cross Chop é um comprometimento total — a descida pode ser ajustada pra esquerda ou direita, ou atravessar plataformas, e mesmo depois do mergulho, um pulo aéreo e o Alolan Whip dão uma chance real, embora arriscada, de recuperação. Revenge transforma um bloqueio bem cronometrado num bônus de dano no próximo acerto, mas ser arremessado ou levar um golpe grande apaga o efeito na hora, então é alto risco por alta recompensa. O Ataque Final dele é um combo de pegada de longo alcance, mais fácil de acertar logo quando um oponente escapa de uma pegada normal, e as provocações pós-acerto parecem chamativas mas nunca deixam ele realmente vulnerável. Tudo isso vem ao custo de ser o único lutador mais lento pra correr no jogo — mas Incineroar compensa com um dos maiores poderes de lançamento por aí.",
      curatorOverviewJp: "ガオガエンの技構成は、我慢と踏み込みに報いる仕組みだ。「DDラリアット」は回転攻撃に組み込まれた一瞬の無敵時間で、前後にも操作できるため、接近手段にも咄嗟の切り返しにも使える。「ロープスイング」は相手をロープに叩きつける本格的なつかみ技で、相手がはね返ってくる時のボタン入力のタイミングによって、どの追撃ワザが決まるかが変わる。「クロスチョップ」はかなり思い切った技で、急降下中は左右に着地位置をずらしたり、すり抜け床を通過したりでき、急降下してしまった後でも空中ジャンプと「ロープスイング」でリスクはあるものの本当に復帰できる可能性がある。「リベンジ」はタイミング良く受け止めることで次のヒットにダメージボーナスを与えるが、投げられたり大きなダメージを受けるとその効果は一瞬で消えてしまう、ハイリスク・ハイリターンな技だ。最後の切りふだは長距離のつかみコンボで、相手が通常のつかみから抜け出した直後が最も当てやすい。攻撃後のアピールは派手に見えるが、実際には隙は生まれない。これらすべての代償として、ガオガエンはゲーム内で唯一最も走りが遅いファイターだが、屈指のふっとばし力でそれを補っている。",
      curatorOverviewJpEn: "Incineroar's moveset is a system that rewards patience and commitment. \"Darkest Lariat\" is a moment of invincibility built into a spinning attack, and since it can also be steered forward or backward, it works as both an approach tool and a snap counter-move. \"Alolan Whip\" is a proper grab move that slams the opponent into the ropes, and the timing of the button input as the opponent bounces back determines which follow-up move lands. \"Cross Chop\" is a fairly committal move — during the dive, you can shift the landing position left or right, or pass through soft platforms, and even after diving, a midair jump plus \"Alolan Whip\" gives a genuine, if risky, chance of recovering. \"Revenge\" grants a damage bonus to the next hit if timed well, but that effect vanishes instantly if it's thrown or takes heavy damage — a high-risk, high-reward move. The Final Smash is a long-range grab combo that's easiest to land right after an opponent breaks free from a normal grab. Its taunts after landing an attack look flashy, but no real opening is created. As the cost for all of this, Incineroar is the single slowest walker in the entire game — but it makes up for that with some of the best launching power around.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = incineroar.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: incineroar.id }, data: { curationStatus: "approved" } });
  console.log("✅ Incineroar aprovado");

  // Sem FighterMove (0 registros) — newcomer exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer exclusivo do Ultimate) — fallback via FighterChronicleLink já correto (Pokémon).
  // Sem timing de vídeo novo fornecido desta vez. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.

  await db.$disconnect();
}
main().catch(console.error);
