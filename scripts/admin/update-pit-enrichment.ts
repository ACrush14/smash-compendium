import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "The protagonist of the \"Kid Icarus\" series. An angel who lives in the sky realm of \"Angel Land,\" and captain of the royal guard of Palutena, goddess of light. He is the strongest warrior in Palutena's army, considered a talent that stands head and shoulders above the rest.",
    pt: "O protagonista da série \"Kid Icarus.\" Um anjo que vive no reino celestial de \"Angel Land,\" e capitão da guarda real de Palutena, deusa da luz. Ele é o guerreiro mais forte do exército de Palutena, considerado um talento que se destaca muito acima dos demais.",
  },
  SSBB: {
    jpEn: "Captain of the royal guard that protects Palutena, goddess of light, of Angel Land. The dark goddess Medusa conquers the underworld, the surface world, and the heavens, imprisoning Palutena in the sky. Pit escapes from the underworld where he had been imprisoned, and sets off toward the heavens wielding the bow bestowed on him by Palutena. Along the way, he obtains the Three Sacred Treasures to challenge Medusa.",
    pt: "Capitão da guarda real que protege Palutena, deusa da luz, de Angel Land. A deusa das trevas, Medusa, conquista o submundo, a superfície e os céus, aprisionando Palutena no céu. Pit escapa do submundo onde estava aprisionado, e parte rumo aos céus empunhando o arco concedido por Palutena. No caminho, ele obtém os Três Tesouros Sagrados para desafiar Medusa.",
  },
  SSB4: {
    jpEn: "An angel who is captain of Palutena's royal guard. The wings on his back can't fly on their own, but Palutena's miracle lets him fly for five minutes. In Smash Bros., he has excellent recovery thanks to a special move that lets him rise high and a total of four jumps. He's also equipped with a projectile and a reflecting move. An all-around fighter capable of fighting in many styles regardless of distance or opponent type.",
    pt: "Um anjo que é capitão da guarda real de Palutena. As asas em suas costas não conseguem voar sozinhas, mas o milagre de Palutena permite que ele voe por cinco minutos. Em Smash Bros., ele tem uma excelente recuperação graças a um golpe especial que o eleva bastante e a um total de quatro pulos. Ele também está equipado com um projétil e um golpe de reflexão. Um lutador versátil, capaz de lutar de várias formas independentemente da distância ou do tipo de adversário.",
  },
  SSBM: {
    jpEn: "Captain of the royal guard of Palutena's army. Imprisoned in the dungeons of the underworld, he seizes an opening and escapes. He rises up to defeat the dark goddess Medusa, who has conquered the underworld, the surface, and the heavens, and to save Palutena, goddess of light, sealed deep within the celestial shrine. The wings on his back cannot fly, but in the final battle, he takes flight with the sacred treasure, the \"Wings of Pegasus.\"\nKid Icarus (7/87)",
    pt: "Capitão da guarda real do exército de Palutena. Aprisionado nas masmorras do submundo, ele aproveita uma brecha e escapa. Ele se levanta para derrotar a deusa das trevas Medusa, que conquistou o submundo, a superfície e os céus, e para salvar Palutena, deusa da luz, selada nas profundezas do santuário celestial. As asas em suas costas não conseguem voar, mas na batalha final, ele alça voo com o tesouro sagrado, as \"Asas de Pégaso.\"\nKid Icarus (7/87)",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Pit's Origins", titleJp: "ピットの初登場作品", textJp: "ピットの初登場作品は、１９８６年発売の『光神話 パルテナの鏡』。三種の神器を集め、闇の女神メデューサ討伐を目指す。", titleJpEn: "Pit's Origins", textJpEn: "Pit's debut was in \"Kid Icarus,\" released in 1986. He gathers the Three Sacred Treasures, aiming to defeat the dark goddess Medusa.", titlePt: "As Origens do Pit", textPt: "O debut do Pit foi em \"Kid Icarus,\" lançado em 1986. Ele reúne os Três Tesouros Sagrados, com o objetivo de derrotar a deusa das trevas Medusa." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『光神話 パルテナの鏡』の主人公。光の女神パルテナに従事する、親衛隊長の天使。闇の女神メデューサに幽閉されていたが、三種の神器を取り返しながら、討伐を目指す。", titleJpEn: "In His Series", textJpEn: "The protagonist of \"Kid Icarus.\" An angel serving as captain of the royal guard to Palutena, goddess of light. He was imprisoned by the dark goddess Medusa, but aims to defeat her while recovering the Three Sacred Treasures.", titlePt: "Na Série Original", textPt: "O protagonista de \"Kid Icarus.\" Um anjo que serve como capitão da guarda real de Palutena, deusa da luz. Ele foi aprisionado pela deusa das trevas Medusa, mas busca derrotá-la enquanto recupera os Três Tesouros Sagrados." },
  { titleEn: "[★☆☆] Pit vs. Dark Pit", titleJp: "ピットとブラックピットの違い", textJp: "ピットとブラックピットの能力は同等、しかし髪や服の色、一部の神器などが異なる。また、乱闘に勝った時には、それぞれ違う曲が流れる。", titleJpEn: "Pit vs. Dark Pit", textJpEn: "Pit and Dark Pit have equivalent abilities, but differ in hair and clothing color and some of their weapons. Also, different music plays for each when they win a brawl.", titlePt: "Pit vs. Dark Pit", textPt: "Pit e Dark Pit têm habilidades equivalentes, mas diferem na cor do cabelo e das roupas e em algumas de suas armas. Além disso, uma música diferente toca para cada um quando vencem uma partida." },
  { titleEn: "[★☆☆] Pit and the Hammer", titleJp: "ピットとハンマー", textJp: "ピットがハンマーを使う時は、片手の手首だけで振り、上げ下げの２パターンを交互に繰り返す。原作を忠実に再現した動き。", titleJpEn: "Pit and the Hammer", textJpEn: "When Pit uses the Hammer, he swings it with just the wrist of one hand, alternating between two patterns of raising and lowering it. A motion faithfully recreated from his original series.", titlePt: "Pit e o Hammer", textPt: "Quando o Pit usa o Hammer, ele o balança apenas com o pulso de uma das mãos, alternando entre dois padrões de levantar e abaixar. Um movimento fielmente recriado de sua série original." },
  { titleEn: "[★★☆] Palutena Bow (Neutral Special)", titleJp: "パルテナの神弓 【通常必殺ワザ】", textJp: "発射前に上入力すると、矢を真上にも発射できる。発射後は、矢の軌道をコントロールすることができる。", titleJpEn: "Palutena Bow (Neutral Special)", textJpEn: "Inputting up before firing lets the arrow be shot straight upward as well. After firing, the arrow's trajectory can be controlled.", titlePt: "Palutena Bow (Especial Neutro)", textPt: "Inputar cima antes de disparar também permite atirar a flecha diretamente para cima. Depois de disparada, a trajetória da flecha pode ser controlada." },
  { titleEn: "[★★★] Palutena Bow's Direction and Timing (Neutral Special)", titleJp: "パルテナの神弓の向きとタイミング 【通常必殺ワザ】", textJp: "最大までためると自動で矢を発射するが、構える向きを変えている間は矢を撃たない。向きを連続で変え続けて発射タイミングをずらすこともできる。", titleJpEn: "Palutena Bow's Direction and Timing (Neutral Special)", textJpEn: "Charging to the max automatically fires the arrow, but the arrow isn't shot while the aiming direction is being changed. Continuously changing direction can also be used to delay the firing timing.", titlePt: "Direção e Timing do Palutena Bow (Especial Neutro)", textPt: "Carregar ao máximo dispara a flecha automaticamente, mas a flecha não é disparada enquanto a direção de mira está sendo mudada. Mudar de direção continuamente também pode ser usado para atrasar o momento do disparo." },
  { titleEn: "[★☆☆] Upperdash Arm (Side Special)", titleJp: "豪腕ダッシュアッパー 【横必殺ワザ】", textJp: "左手に豪腕を装着して突進、豪快なアッパーをくり出す。突進中は相手の飛び道具をはじくことができる。", titleJpEn: "Upperdash Arm (Side Special)", textJpEn: "Equips a mighty arm on the left hand and charges forward, delivering a powerful uppercut. During the charge, opponents' projectiles can be deflected.", titlePt: "Upperdash Arm (Especial Lateral)", textPt: "Equipa um braço poderoso na mão esquerda e avança, entregando um golpe ascendente poderoso. Durante o avanço, projéteis dos adversários podem ser defletidos." },
  { titleEn: "[★★☆] Upperdash Arm Techniques (Side Special)", titleJp: "豪腕ダッシュアッパーのタイミング 【横必殺ワザ】", textJp: "空中で出すと、ふっとばし力が弱くなる代わりに、アッパー後のスキが小さくなる。復帰する時、ガケの上で待ち構えている相手に向かって突進するのも手だ。", titleJpEn: "Upperdash Arm Techniques (Side Special)", textJpEn: "Using it in the air weakens the knockback, but reduces the opening after the uppercut. When recovering, charging toward an opponent waiting above the ledge can also be a viable option.", titlePt: "Técnicas do Upperdash Arm (Especial Lateral)", textPt: "Usá-lo no ar enfraquece o arremesso, mas reduz a abertura depois do golpe ascendente. Ao se recuperar, avançar contra um adversário esperando acima da borda também pode ser uma opção viável." },
  { titleEn: "[★☆☆] Power of Flight (Up Special)", titleJp: "飛翔の奇跡 【上必殺ワザ】", textJp: "翼が輝き、直前に入力した方向に飛行する。非常に長い距離を飛行するので、復帰力が高い。", titleJpEn: "Power of Flight (Up Special)", textJpEn: "The wings shine, and he flies in the direction input just beforehand. Since he flies a very long distance, his recovery power is high.", titlePt: "Power of Flight (Especial Cima)", textPt: "As asas brilham, e ele voa na direção inputada pouco antes. Como ele voa uma distância muito longa, seu poder de recuperação é alto." },
  { titleEn: "[★☆☆] Power of Flight's Vulnerability (Up Special)", titleJp: "飛翔の奇跡のスキ 【上必殺ワザ】", textJp: "推進力が強く、ガケからかなり離れても復帰できるけれど、飛び始めてからワザの後に着地するまで、ほぼ無防備になるので要注意。", titleJpEn: "Power of Flight's Vulnerability (Up Special)", textJpEn: "Its thrust is strong, allowing recovery from quite far off the ledge, but from the moment he starts flying until he lands after the move ends, he's nearly defenseless, so be careful.", titlePt: "A Vulnerabilidade do Power of Flight (Especial Cima)", textPt: "Seu impulso é forte, permitindo a recuperação mesmo bem longe da borda, mas do momento em que ele começa a voar até pousar depois do movimento terminar, ele fica quase indefeso, então cuidado." },
  { titleEn: "[★☆☆] Guardian Orbitars (Down Special)", titleJp: "衛星ガーディアンズ 【下必殺ワザ】", textJp: "相手の攻撃を防ぎ、飛び道具を反射することもできる。盾の部分に当たった相手は、少し押し出される。", titleJpEn: "Guardian Orbitars (Down Special)", textJpEn: "Blocks the opponent's attacks, and can also reflect projectiles. Opponents that hit the shield portion get pushed back slightly.", titlePt: "Guardian Orbitars (Especial Baixo)", textPt: "Bloqueia os ataques do adversário, e também pode refletir projéteis. Adversários que acertam a parte do escudo são empurrados levemente para trás." },
  { titleEn: "[★★☆] Guardian Orbitars' Recovery Time (Down Special)", titleJp: "衛星ガーディアンズの復活 【下必殺ワザ】", textJp: "盾は、攻撃を受け過ぎると壊れてしまい、しばらく使えなくなる。壊れてから１０秒たてば盾が復活して、また使えるようになる。", titleJpEn: "Guardian Orbitars' Recovery Time (Down Special)", textJpEn: "The shields break if they take too much damage, becoming unusable for a while. Ten seconds after breaking, the shields recover and can be used again.", titlePt: "O Tempo de Recuperação do Guardian Orbitars (Especial Baixo)", textPt: "Os escudos se quebram se receberem dano demais, ficando inutilizáveis por um tempo. Dez segundos depois de quebrarem, os escudos se recuperam e podem ser usados novamente." },
  { titleEn: "[★☆☆] Lightning Chariot (Final Smash)", titleJp: "光の戦車 【最後の切りふだ】", textJp: "光の戦車を呼び出してステージを飛び去り、照準で狙いをつける。照準内のゲージが無くなると、突進をくり出す。乱戦中を狙えば、まとめてふっとばせる。", titleJpEn: "Lightning Chariot (Final Smash)", textJpEn: "Summons the Chariot of Light and flies across the stage, taking aim with a reticle. When the gauge inside the reticle empties, he charges forward. Aiming during a chaotic scramble can launch multiple opponents at once.", titlePt: "Lightning Chariot (Final Smash)", textPt: "Convoca o Chariot of Light e voa pelo palco, mirando com uma retícula. Quando o medidor dentro da retícula se esvazia, ele avança. Mirar durante uma confusão caótica pode arremessar vários adversários de uma vez." },
  { titleEn: "[★☆☆] Lightning Chariot Timing (Final Smash)", titleJp: "光の戦車のタイミング 【最後の切りふだ】", textJp: "制限時間内に、照準で狙いをつけて突進する、最後の切りふだ。時間経過だけでなく、攻撃ボタンか必殺ワザボタンの入力で、すぐに出せる。", titleJpEn: "Lightning Chariot Timing (Final Smash)", textJpEn: "A Final Smash that aims with a reticle and charges within a time limit. It can be triggered immediately not only by time passing, but also by inputting the attack button or special move button.", titlePt: "O Timing do Lightning Chariot (Final Smash)", textPt: "Um Final Smash que mira com uma retícula e avança dentro de um limite de tempo. Pode ser acionado imediatamente não só pela passagem do tempo, mas também inputando o botão de ataque ou o botão de golpe especial." },
  { titleEn: "[★★☆] Anti-air Attack (Up Tilt Attack)", titleJp: "アンチエアキック 【上強攻撃】", textJp: "当てた相手を空中に浮かせる、２段蹴り。蓄積ダメージにほとんど関係なく浮かせられ、その後も攻め続けることができる。", titleJpEn: "Anti-air Attack (Up Tilt Attack)", textJpEn: "A two-hit kick that launches opponents it hits into the air. It launches them regardless of accumulated damage, and offense can continue afterward.", titlePt: "Anti-air Attack (Ataque Inclinado Cima)", textPt: "Um chute de dois golpes que lança os adversários atingidos para o ar. Ele os lança independentemente do dano acumulado, e a ofensiva pode continuar depois." },
  { titleEn: "[★★☆] Under-Arc Slash (Down Air Attack)", titleJp: "アンダースラッシュ 【下空中攻撃】", textJp: "下に向けて剣を振り抜くワザで、威力が高め。剣が真下に来たタイミングで相手に当てると、メテオになる。", titleJpEn: "Under-Arc Slash (Down Air Attack)", textJpEn: "A move that swings the sword downward with relatively high power. Hitting the opponent at the moment the sword points straight down turns it into a meteor smash.", titlePt: "Under-Arc Slash (Ataque Aéreo Baixo)", textPt: "Um golpe que balança a espada para baixo com poder relativamente alto. Acertar o adversário no momento em que a espada aponta diretamente para baixo o transforma em um meteoro." },
  { titleEn: "[★★★] Smash Taunts", titleJp: "スマッシュアピール", textJp: "「エンジェランド」でピットを操作中に下アピールを一瞬だけ入力すると、スマッシュアピールを行える。１回の乱闘につき１回だけ使える。", titleJpEn: "Smash Taunts", textJpEn: "While controlling Pit on the \"Angel Land\" stage, briefly inputting the down taunt lets him perform a Smash Taunt. It can only be used once per brawl.", titlePt: "Smash Taunts", textPt: "Enquanto controla o Pit no palco \"Angel Land,\" inputar brevemente a provocação baixo permite que ele realize uma Smash Taunt. Só pode ser usada uma vez por partida." },
];

async function main() {
  const pit = await db.fighter.findFirst({
    where: { name: "Pit" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!pit) { console.log("Pit not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: pit.id },
    data: {
      curatorOverviewEn: "Pit, captain of Palutena's royal guard, is a well-rounded fighter built for versatility — Palutena Bow bends its arrows mid-flight, Upperdash Arm deflects projectiles while charging, Guardian Orbitars block and reflect, and Power of Flight grants one of the longest recoveries in the game. With four jumps and tools for nearly every situation, Pit rewards players who adapt their approach on the fly rather than sticking to one game plan.",
      curatorOverviewPt: "Pit, capitão da guarda real de Palutena, é um lutador versátil e completo — Palutena Bow curva suas flechas em pleno voo, Upperdash Arm defleta projéteis enquanto avança, Guardian Orbitars bloqueia e reflete, e Power of Flight concede uma das maiores recuperações do jogo. Com quatro pulos e ferramentas para quase toda situação, o Pit recompensa jogadores que adaptam sua abordagem na hora, em vez de seguir um único plano de jogo.",
      curatorOverviewJp: "パルテナ軍親衛隊隊長のピットは、あらゆる状況に対応できる万能型ファイター――パルテナの神弓は飛行中に矢の軌道を曲げ、豪腕ダッシュアッパーは突進中に飛び道具をはじき、衛星ガーディアンズは防御と反射をこなし、飛翔の奇跡はゲーム屈指の長距離復帰を可能にする。４回のジャンプとほぼすべての状況に対応する手段を備えたピットは、一つの戦略に固執せず、その場で立ち回りを変えられるプレイヤーに応える。",
      curatorOverviewJpEn: "Pit, captain of Palutena's royal guard, is an all-around fighter built to handle nearly any situation — Palutena Bow bends its arrow's trajectory mid-flight, Upperdash Arm deflects projectiles while dashing, Guardian Orbitars handles both blocking and reflecting, and Power of Flight enables one of the longest recoveries in the game. With four jumps and tools for almost every situation, Pit rewards players who adapt their play on the spot rather than sticking to a single strategy.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Bios PT+JpEn
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = pit.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Move EN+PT+JpEn
  const move = pit.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "The side special \"Upperdash Arm\" swings the arm up in a big motion, launching the opponent upward. Its knockback is high enough to go for edge KOs. If the dash is dodged and Pit falls off-stage, the up special lets him recover without creating much of an opening. \"Palutena Bow\" is a special move whose arrow trajectory can be changed. It can also fire straight up, and can be charged. (FCD) Kid Icarus (1986/12) (3DS) Kid Icarus: Uprising (2012/03)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "O especial lateral \"Upperdash Arm\" balança o braço para cima em um movimento amplo, arremessando o adversário para cima. Seu arremesso é forte o suficiente para buscar KOs na borda. Se o avanço for esquivado e o Pit cair fora do palco, o especial cima permite que ele se recupere sem criar muita abertura. \"Palutena Bow\" é um golpe especial cuja trajetória da flecha pode ser mudada. Também pode atirar diretamente para cima, e pode ser carregado. (FCD) Kid Icarus (1986/12) (3DS) Kid Icarus: Uprising (2012/03)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = pit.tips.find(t => t.titleEn === data.titleEn);
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
