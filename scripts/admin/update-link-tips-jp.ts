import { db } from "../../lib/db";

// Textos do Link (SSBU) extraídos de wikiwiki.jp/ssbswitch em 2026-06-29
// Traduções EN/PT/JpEn feitas manualmente

const LINK_TIPS = [
  {
    titleEn: "[★☆☆] Link's Origins",
    titleJp: "リンクの初登場作品",
    textJp: "リンクの初登場作品は１９８６年に発売された『ゼルダの伝説』。当時から、ブーメラン、弓矢、爆弾など、多彩なアイテムを使いこなしていた。",
    titleJpEn: "Link's First Appearance",
    textJpEn: "Link's first appearance was in \"The Legend of Zelda,\" released in 1986. Even back then, he was already adept at using a wide variety of items like the boomerang, bow and arrows, and bombs.",
    titlePt: "Primeira Aparição do Link",
    textPt: "A primeira aparição do Link foi em \"The Legend of Zelda\", lançado em 1986. Já naquela época, ele dominava uma grande variedade de itens, como o bumerangue, o arco e flecha e as bombas.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "『ゼルダの伝説』シリーズの主人公。剣と盾を装備し、とがった耳が特徴的な若者。爆弾や弓矢などの道具を、戦いに利用するだけでなく、謎解きに使うのも作品の特徴。",
    titleJpEn: "In the Original Series",
    textJpEn: "The protagonist of \"The Legend of Zelda\" series. A young man with pointed ears who wields a sword and shield. A hallmark of the series is using tools like bombs and a bow not only in battle, but also for solving puzzles.",
    titlePt: "Na Série Original",
    textPt: "O protagonista da série \"The Legend of Zelda\". Um jovem de orelhas pontiagudas que empunha espada e escudo. Uma marca registrada da série é usar ferramentas como bombas e arco não só em batalha, mas também para resolver puzzles.",
  },
  {
    titleEn: "[★☆☆] Who Is the Hero?",
    titleJp: "『ゼルダの伝説』の主人公はリンク",
    textJp: "『ゼルダの伝説』シリーズで、主人公であるリンクの名前が付いている作品は、『リンクの冒険』と『リンクのボウガントレーニング』の２作品のみ。",
    titleJpEn: "The Protagonist of Zelda Is Link",
    textJpEn: "In \"The Legend of Zelda\" series, only two games have the protagonist Link's name in the title: \"Zelda II: The Adventure of Link\" and \"Link's Crossbow Training.\"",
    titlePt: "O Protagonista de Zelda É o Link",
    textPt: "Na série \"The Legend of Zelda\", apenas dois jogos têm o nome do protagonista Link no título: \"Zelda II: The Adventure of Link\" e \"Link's Crossbow Training\".",
  },
  {
    titleEn: "[★☆☆] Clothing \"of the Wild\"",
    titleJp: "息吹の勇者服",
    textJp: "2Pカラーの「息吹の勇者服」は、シリーズ伝統の緑の服。『ブレス オブ ザ ワイルド』では、「試練の祠」全クリアが入手条件となっている。",
    titleJpEn: "Tunic of the Wild",
    textJpEn: "The 2P color \"Tunic of the Wild\" is the series' traditional green tunic. In \"Breath of the Wild,\" it can be obtained by clearing all Shrines of Trials.",
    titlePt: "Roupa do Herói (Breath)",
    textPt: "A cor do 2º jogador, a \"Roupa do Herói\", é a clássica roupa verde da série. Em \"Breath of the Wild\", ela é obtida ao completar todos os Santuários de Prova.",
  },
  {
    titleEn: "[★☆☆] Bow and Arrows (Neutral Special)",
    titleJp: "弓矢【通常必殺ワザ】",
    textJp: "ためるほど、矢の飛距離と威力がアップする。矢は地面やカベに刺さる。刺さった矢はアイテムとして拾うことができ、持ってワザを使うと、２本同時に放つ。",
    titleJpEn: "Bow and Arrows (Neutral Special)",
    textJpEn: "The longer you charge, the greater the arrow's range and power. Arrows stick into the ground and walls. Stuck arrows can be picked up as items — use a move while holding one to fire two arrows at once.",
    titlePt: "Arco e Flecha (Especial Neutro)",
    textPt: "Quanto mais carregado, maior o alcance e o poder da flecha. As flechas ficam presas no chão e nas paredes. Flechas presas podem ser coletadas como itens — use um golpe enquanto segura uma para disparar duas ao mesmo tempo.",
  },
  {
    titleEn: "[★☆☆] Boomerang (Side Special)",
    titleJp: "ブーメラン【横必殺ワザ】",
    textJp: "投げた瞬間がもっとも強く、はじき入力で飛距離や威力がアップする。戻ってくるブーメランをキャッチしなければ、そのまま飛んでいってしまう。",
    titleJpEn: "Boomerang (Side Special)",
    textJpEn: "It's strongest the moment it's thrown, and a flick input increases its range and power. If you don't catch the boomerang on its return, it keeps flying away.",
    titlePt: "Bumerangue (Especial Lateral)",
    textPt: "É mais forte no momento do lançamento, e uma entrada rápida aumenta alcance e poder. Se não pegar o bumerangue na volta, ele continua voando e se perde.",
  },
  {
    titleEn: "[★★☆] Remote Bomb Recovery (Down Special)",
    titleJp: "リモコンバクダンで復帰【下必殺ワザ】",
    textJp: "大きくふっとばされてしまった時、リモコンバクダンを使って自爆すれば、ステージに戻れることも……!?　狙うのは非常に難しいが、奥の手の復帰手段。",
    titleJpEn: "Remote Bomb Recovery (Down Special)",
    textJpEn: "When launched far off stage, you can potentially use the Remote Bomb to self-destruct and make it back...!? It's extremely difficult to pull off, but it serves as a last-resort recovery option.",
    titlePt: "Recuperação com Bomba Remota (Especial Baixo)",
    textPt: "Quando arremessado para longe do palco, é possível usar a Bomba Remota para se autoexplodir e retornar...!? É extremamente difícil de executar, mas funciona como um recurso de recuperação de último recurso.",
  },
  {
    titleEn: "[★★☆] Remote Bomb's Traits (Down Special)",
    titleJp: "リモコンバクダンの特性【下必殺ワザ】",
    textJp: "好きなタイミングで起爆できるが、爆発はリンク自身もダメージを受ける。取り出してから一定時間経つか、炎属性の攻撃を受けることでも爆発する。",
    titleJpEn: "Remote Bomb's Properties (Down Special)",
    textJpEn: "You can detonate it at any time, but Link himself takes damage from the explosion. It also explodes after a set time has passed since pulling it out, or if it's hit by a fire-type attack.",
    titlePt: "Propriedades da Bomba Remota (Especial Baixo)",
    textPt: "Pode ser detonada a qualquer momento, mas o próprio Link sofre dano da explosão. Ela também explode após um certo tempo, ou se atingida por um ataque de fogo.",
  },
  {
    titleEn: "[★☆☆] Ancient Bow and Arrow (Final Smash)",
    titleJp: "古代兵装の弓矢【最後の切りふだ】",
    textJp: "最後の切りふだは、青く輝く必殺の矢を放ち、当たった相手を爆発でふっとばす。カベや地面に当たっても爆発が起こり、複数の相手をまとめて飛ばすことも可能。",
    titleJpEn: "Ancient Bow and Arrow (Final Smash)",
    textJpEn: "This Final Smash fires a glowing blue arrow of destruction that blasts opponents away with an explosion on hit. It also explodes upon hitting a wall or the ground, and can launch multiple opponents at once.",
    titlePt: "Arco Antigo (Final Smash)",
    textPt: "Este Final Smash dispara uma flecha azul brilhante que derruba adversários com uma explosão ao acertar. Também explode ao atingir paredes ou o chão, podendo arremessar múltiplos adversários de uma vez.",
  },
  {
    titleEn: "[★☆☆] Sword Slice (Side Smash Attack)",
    titleJp: "スマッシュ斬り【横スマッシュ攻撃】",
    textJp: "リンクの蓄積ダメージが０％の場合、または体力制で体力が満タンの場合のみ、横スマッシュ攻撃で、ソードビームを放つことができる。",
    titleJpEn: "Sword Slice (Side Smash Attack)",
    textJpEn: "Only when Link's accumulated damage is 0%, or when HP is full in Stamina Mode, can he fire a Sword Beam with his side smash attack.",
    titlePt: "Golpe de Espada (Smash Lateral)",
    textPt: "Somente quando o dano acumulado do Link é 0%, ou com HP cheio no Modo Estamina, ele pode disparar um Raio de Espada com seu Smash lateral.",
  },
  {
    titleEn: "[★☆☆] Double Sword Slice (Side Smash Attack)",
    titleJp: "二段スマッシュ斬り【横スマッシュ攻撃】",
    textJp: "ボタンを追加入力すると、２段目の攻撃が出せる。１段目より２段目の方がふっとばし力が大きい。",
    titleJpEn: "Two-Stage Sword Slice (Side Smash Attack)",
    textJpEn: "Pressing the button again triggers a second hit. The second hit has greater launch power than the first.",
    titlePt: "Golpe Duplo de Espada (Smash Lateral)",
    textPt: "Pressionar o botão novamente desencadeia um segundo golpe. O segundo golpe tem maior poder de arremesso que o primeiro.",
  },
  {
    titleEn: "[★☆☆] Link's Air Attacks",
    titleJp: "リンクの空中攻撃",
    textJp: "リンクの上空中攻撃である「上突き」、下空中攻撃である「下突き」は『リンクの冒険』で初登場。原作では町の人から習得することで使える。",
    titleJpEn: "Link's Aerial Attacks",
    textJpEn: "Link's up aerial \"Upward Thrust\" and down aerial \"Downward Thrust\" first appeared in \"Zelda II: The Adventure of Link.\" In the original game, they are learned from townspeople.",
    titlePt: "Ataques Aéreos do Link",
    textPt: "O ataque aéreo superior \"Thrust para Cima\" e o inferior \"Thrust para Baixo\" do Link apareceram pela primeira vez em \"Zelda II: The Adventure of Link\". No jogo original, são aprendidos com habitantes da cidade.",
  },
  {
    titleEn: "[★★☆] Jump Slash (Dash Attack)",
    titleJp: "ジャンプ斬り【ダッシュ攻撃】",
    textJp: "スマッシュ攻撃に引けをとらないふっとばし力を持つ。ダメージは、剣先を当てた方が高くなる。",
    titleJpEn: "Jump Slash (Dash Attack)",
    textJpEn: "Has launch power that rivals a smash attack. Damage is higher when the tip of the sword connects.",
    titlePt: "Golpe do Salto (Ataque de Corrida)",
    textPt: "Possui poder de arremesso que rivaliza com um Smash. O dano é maior quando a ponta da espada acerta.",
  },
  {
    titleEn: "[★★☆] Hylian Shield's Strength",
    titleJp: "盾",
    textJp: "どんなに強力な飛び道具でも、盾で受け止められる。一切ダメージを受けず、ガードのスキも少ない。",
    titleJpEn: "The Shield",
    textJpEn: "Link's shield can block any projectile, no matter how powerful. He takes no damage at all, and the window of vulnerability after guarding is small.",
    titlePt: "Escudo Hylian (Força)",
    textPt: "O escudo do Link pode bloquear qualquer projétil, por mais poderoso que seja. Ele não sofre nenhum dano e a janela de vulnerabilidade após o bloqueio é pequena.",
  },
  {
    titleEn: "[★☆☆] Hylian Shield's Limits",
    titleJp: "盾の効果",
    textJp: "リンクの盾は、相手の飛び道具を防ぐ効果がある。攻撃中など、盾を構えていない時は防げないので注意。",
    titleJpEn: "Shield Effect",
    textJpEn: "Link's shield has the effect of deflecting opponents' projectiles. Note that it cannot block them when Link is attacking or otherwise not holding his shield up.",
    titlePt: "Limitações do Escudo Hylian",
    textPt: "O escudo do Link tem o efeito de deflectir os projéteis dos adversários. Atenção: ele não bloqueia durante ataques ou quando o Link não está com o escudo levantado.",
  },
];

async function main() {
  const link = await db.fighter.findFirst({
    where: { name: "Link" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!link) { console.log("Link not found"); return; }

  console.log(`Found Link (${link.id}) with ${link.tips.length} tips`);

  let updated = 0;
  for (const data of LINK_TIPS) {
    const tip = link.tips.find(t => t.titleEn === data.titleEn);
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

  console.log(`\n✅ ${updated}/${LINK_TIPS.length} tips atualizadas`);
  await db.$disconnect();
}
main().catch(console.error);
