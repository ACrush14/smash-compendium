import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "His body proportions vary by title, but he generally has a penguin-like appearance at around 2 to 3 heads tall, with his yellow, pouty lips standing out prominently. His body color is blue, and he wears a red robe and red hat with yellow gloves and a stomach wrap. In early appearances, he wore the stomach wrap directly over his torso, but starting with \"Kirby Super Star,\" he wears yellow clothing underneath it. In \"Kirby Air Ride,\" he appears with a design close to his look in \"Smash 4\" and \"Ultimate,\" including a total of four color variations.\nUnusual among \"Kirby\" characters, who often have very simple designs, Dedede — with his many decorations, protrusions, and complex mouth shape — is said to be a character that's a headache for designers.",
    pt: "Suas proporções corporais variam de acordo com o jogo, mas ele geralmente tem uma aparência semelhante a um pinguim de cerca de 2 a 3 cabeças de altura, com seus lábios amarelos e carnudos se destacando bastante. Sua cor corporal é azul, e ele usa um robe vermelho e um chapéu vermelho com luvas amarelas e uma faixa na barriga. Nas primeiras aparições, ele usava a faixa diretamente sobre o torso, mas a partir de \"Kirby Super Star,\" ele passou a usar roupas amarelas por baixo dela. Em \"Kirby Air Ride,\" ele aparece com um design próximo ao seu visual em \"Smash 4\" e \"Ultimate,\" incluindo um total de quatro variações de cor.\nIncomum entre os personagens de \"Kirby,\" que geralmente têm designs muito simples, o Dedede — com suas muitas decorações, protuberâncias e forma de boca complexa — é considerado um personagem que dá dor de cabeça para os designers.",
  },
  SSBM: {
    jpEn: "The self-proclaimed king of Dream Land. Though he calls himself the great king, he doesn't actually perform any administrative duties, and the citizens all live however they please.\nKirby's Dream Land (8/92)",
    pt: "O autoproclamado rei de Dream Land. Embora se autodenomine o grande rei, ele não realiza nenhuma função administrativa de fato, e os cidadãos vivem como bem entendem.\nKirby's Dream Land (8/92)",
  },
  SSBB: {
    jpEn: "The self-proclaimed great king of the astonishingly peaceful nation of Dream Land. He repeatedly commits acts unbecoming of a king, such as stealing all of his country's food or all the stars from the night sky. However, he's not malicious, and occasionally does good things too.",
    pt: "O autoproclamado grande rei da surpreendentemente pacífica nação de Dream Land. Ele repetidamente comete atos indignos de um rei, como roubar toda a comida de seu país ou todas as estrelas do céu noturno. Porém, ele não é malicioso, e ocasionalmente também faz coisas boas.",
  },
  SSB4: {
    jpEn: "The self-proclaimed great king of Dream Land. Being self-proclaimed, he apparently has no interest in the country's politics. A glutton who steals food from all over the country. In Smash Bros., he's a heavyweight fighter whose appeal lies in the bold blows delivered with his hammer. He's slow-moving, but can jump four times in the air, making recovery easy. The destructive power of his fully-charged \"Jet Hammer\" is top-class.",
    pt: "O autoproclamado grande rei de Dream Land. Sendo autoproclamado, ele aparentemente não tem interesse na política do país. Um glutão que rouba comida de todo o país. Em Smash Bros., ele é um lutador peso-pesado cujo apelo está nos golpes ousados entregues com seu martelo. Ele se move devagar, mas pode pular quatro vezes no ar, facilitando a recuperação. O poder destrutivo de seu \"Jet Hammer\" totalmente carregado é de primeira classe.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] King Dedede's Origins", titleJp: "デデデの初登場作品", textJp: "デデデの初登場作品は、１９９２年発売の初代『星のカービィ』。プププランドの自称大王で、国中の食べ物を奪うほどの食いしん坊。", titleJpEn: "King Dedede's Origins", textJpEn: "King Dedede's debut was in the original \"Kirby's Dream Land,\" released in 1992. The self-proclaimed great king of Dream Land, and a glutton who steals food from all over the country.", titlePt: "As Origens do King Dedede", textPt: "O debut do King Dedede foi no \"Kirby's Dream Land\" original, lançado em 1992. O autoproclamado grande rei de Dream Land, e um glutão que rouba comida de todo o país." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『星のカービィ』では、プププランドのすべての食べ物を奪った張本人。プププランドの大王と名乗っており、子分にワドルディなどを従えている。", titleJpEn: "In His Series", textJpEn: "In \"Kirby's Dream Land,\" he's the very culprit who stole all the food from Dream Land. He calls himself the great king of Dream Land, and has minions like Waddle Dee under his command.", titlePt: "Na Série Original", textPt: "Em \"Kirby's Dream Land,\" ele é o próprio culpado por roubar toda a comida de Dream Land. Ele se autodenomina o grande rei de Dream Land, e tem capangas como o Waddle Dee sob seu comando." },
  { titleEn: "[★☆☆] Masked Dedede", titleJp: "マスクド・デデデ", textJp: "『星のカービィ ウルトラスーパーデラックス』の「大王の逆襲」にて登場した姿。いつもの木製ハンマーではなく、機械じかけのニューデデデハンマーを装備している。", titleJpEn: "Masked Dedede", textJpEn: "The appearance he takes in \"Revenge of the King\" from \"Kirby Super Star Ultra.\" Instead of his usual wooden hammer, he's equipped with the mechanical New Dedede Hammer.", titlePt: "Masked Dedede", textPt: "A aparência que ele assume em \"Revenge of the King\" de \"Kirby Super Star Ultra.\" Em vez de seu martelo de madeira habitual, ele está equipado com o mecânico New Dedede Hammer." },
  { titleEn: "[★☆☆] Inhale (Neutral Special)", titleJp: "すいこみ 【通常必殺ワザ】", textJp: "相手を吸い込んだまま、もう一度ボタンを押すと吐き出す。吐き出した相手をぶつけて攻撃ができる。", titleJpEn: "Inhale (Neutral Special)", textJpEn: "While holding an opponent inhaled, pressing the button again spits them out. He can attack by hitting others with the spat-out opponent.", titlePt: "Inhale (Especial Neutro)", textPt: "Enquanto segura um adversário engolido, apertar o botão novamente o cospe. Ele pode atacar acertando outros com o adversário cuspido." },
  { titleEn: "[★☆☆] Inhale (Neutral Special)", titleJp: "すいこみの特徴 【通常必殺ワザ】", textJp: "カービィの「すいこみ」と違ってコピー能力がない。その代わり、吸い込む範囲がかなり広い。", titleJpEn: "Inhale's Characteristics (Neutral Special)", textJpEn: "Unlike Kirby's \"Inhale,\" it has no copy ability. In exchange, its inhaling range is quite wide.", titlePt: "As Características do Inhale (Especial Neutro)", textPt: "Diferente do \"Inhale\" do Kirby, não tem habilidade de cópia. Em compensação, seu alcance de sucção é bem amplo." },
  { titleEn: "[★☆☆] Inhaling Projectiles (Neutral Special)", titleJp: "飛び道具のすいこみ 【通常必殺ワザ】", textJp: "相手の飛び道具を吸い込み、吐き出して撃ち返すことができる。吐き出した飛び道具は、威力が上がる。", titleJpEn: "Inhaling Projectiles (Neutral Special)", textJpEn: "He can inhale an opponent's projectile and spit it back out. The spat-out projectile deals increased power.", titlePt: "Engolindo Projéteis (Especial Neutro)", textPt: "Ele pode engolir o projétil de um adversário e cuspi-lo de volta. O projétil cuspido causa poder aumentado." },
  { titleEn: "[★★☆] Inhale Techniques (Neutral Special)", titleJp: "すいこみのテクニック 【通常必殺ワザ】", textJp: "横必殺ワザで出現するゴルドーも、吸い込んで吐き出すことができる。吐き出した後はスキも小さいので、コンボの１つとして使える。", titleJpEn: "Inhale Techniques (Neutral Special)", textJpEn: "The Gordo that appears from the side special can also be inhaled and spat out. Since the opening after spitting it out is small, it can be used as part of a combo.", titlePt: "Técnicas do Inhale (Especial Neutro)", textPt: "O Gordo que aparece do especial lateral também pode ser engolido e cuspido. Como a abertura depois de cuspi-lo é pequena, pode ser usado como parte de um combo." },
  { titleEn: "[★★☆] Gordo Throw (Side Special)", titleJp: "ゴルドー投げ 【横必殺ワザ】", textJp: "ゴルドーはぶつかったカベに突き刺さることがある。ガケの近くに突き刺すことができれば、相手の復帰を邪魔することも可能。", titleJpEn: "Gordo Throw (Side Special)", textJpEn: "The Gordo can sometimes get stuck in a wall it hits. If it can be lodged near a ledge, it can also interfere with an opponent's recovery.", titlePt: "Gordo Throw (Especial Lateral)", textPt: "O Gordo às vezes pode ficar preso em uma parede que atinge. Se puder ser cravado perto de uma borda, também pode atrapalhar a recuperação de um adversário." },
  { titleEn: "[★★☆] Returning Gordo (Side Special)", titleJp: "ゴルドーの打ち返し 【横必殺ワザ】", textJp: "投げたゴルドーは、相手に攻撃されると打ち返されてしまうが、攻撃を当てたり、近くで横必殺ワザを入力することで、さらに返すこともできる。", titleJpEn: "Returning Gordo (Side Special)", textJpEn: "The thrown Gordo gets knocked back if attacked by an opponent, but landing an attack on it or inputting the side special nearby can knock it back again.", titlePt: "O Retorno do Gordo (Especial Lateral)", textPt: "O Gordo arremessado é rebatido se atacado por um adversário, mas acertar um ataque nele ou inputar o especial lateral por perto pode rebatê-lo novamente." },
  { titleEn: "[★★☆] Gordo Throw's Many Tricks (Side Special)", titleJp: "ゴルドー投げの打ち分け 【横必殺ワザ】", textJp: "打つ前に方向を入力すると、上中下の３方向にゴルドーを打ち分けられる。打つ方向ではね方が変化する。", titleJpEn: "Gordo Throw's Many Tricks (Side Special)", textJpEn: "Inputting a direction before hitting it lets him strike the Gordo in one of three directions: up, middle, or down. The direction it's hit changes how it bounces.", titlePt: "Os Truques do Gordo Throw (Especial Lateral)", textPt: "Inputar uma direção antes de acertá-lo permite golpear o Gordo em uma de três direções: cima, meio ou baixo. A direção do golpe muda como ele quica." },
  { titleEn: "[★☆☆] Super Dedede Jump (Up Special)", titleJp: "スーパーデデデジャンプ 【上必殺ワザ】", textJp: "勢いよくジャンプした後、急降下して相手を押しつぶす。空中で必殺ワザボタンか、上方向にスティックを入力すると、キャンセルできる。", titleJpEn: "Super Dedede Jump (Up Special)", textJpEn: "After jumping forcefully, he dives down to crush opponents. It can be canceled by inputting the special move button or the stick upward while in the air.", titlePt: "Super Dedede Jump (Especial Cima)", textPt: "Depois de pular com força, ele mergulha para esmagar adversários. Pode ser cancelado inputando o botão de golpe especial ou o analógico para cima enquanto no ar." },
  { titleEn: "[★★☆] Jet Hammer (Down Special)", titleJp: "ジェットハンマー 【下必殺ワザ】", textJp: "ボタンを押し続けてため状態を維持できるが、最大ため状態では、徐々にダメージを受けるので注意。", titleJpEn: "Jet Hammer (Down Special)", textJpEn: "Holding the button maintains the charge, but be careful, as at maximum charge, he gradually takes damage.", titlePt: "Jet Hammer (Especial Baixo)", textPt: "Segurar o botão mantém a carga, mas cuidado, pois na carga máxima, ele recebe dano gradualmente." },
  { titleEn: "[★★☆] Jet Hammer's Characteristics (Down Special)", titleJp: "ジェットハンマーの特性 【下必殺ワザ】", textJp: "デデデの蓄積ダメージが１００％以上になっている時には、最大までためた状態でため続けても、ダメージを受けない。", titleJpEn: "Jet Hammer's Characteristics (Down Special)", textJpEn: "When Dedede's accumulated damage is 100% or higher, continuing to hold the charge at maximum no longer deals him damage.", titlePt: "As Características do Jet Hammer (Especial Baixo)", textPt: "Quando o dano acumulado do Dedede está em 100% ou mais, continuar segurando a carga no máximo não causa mais dano nele." },
  { titleEn: "[★☆☆] Dede-rush (Final Smash)", titleJp: "デデラッシュ 【最後の切りふだ】", textJp: "設置したリングの上で、デデデミサイルからのハンマーの一撃。金あみもろとも相手をふっとばす、豪快な最後の切りふだ。", titleJpEn: "Dede-rush (Final Smash)", textJpEn: "On the set-up ring, a hammer blow follows the Dedede Missile. A bold Final Smash that launches opponents along with the wire cage.", titlePt: "Dede-rush (Final Smash)", textPt: "No ringue montado, um golpe de martelo segue o Dedede Missile. Um Final Smash ousado que arremessa os adversários junto com a gaiola de arame." },
  { titleEn: "[★☆☆] Rolling (Down Tilt Attack)", titleJp: "ころがり 【下強攻撃】", textJp: "寝転がった状態から、側転で前に移動する。ダッシュ攻撃のように、移動しながら攻撃ができる。", titleJpEn: "Rolling (Down Tilt Attack)", textJpEn: "Moves forward with a cartwheel from a lying-down position. Like a dash attack, he can attack while moving.", titlePt: "Rolling (Ataque Inclinado Baixo)", textPt: "Move-se para frente com uma cambalhota a partir de uma posição deitada. Assim como um ataque em disparada, ele pode atacar enquanto se move." },
  { titleEn: "[★☆☆] Belly Flop (Dash Attack)", titleJp: "ずっこけ 【ダッシュ攻撃】", textJp: "スキが大きいかわりに、相手を大きくふっとばすことができる。シリーズ最初の作品『星のカービィ』から、デデデが使っているワザ。", titleJpEn: "Belly Flop (Dash Attack)", textJpEn: "In exchange for a large opening, it can launch opponents far. A move Dedede has used since the very first game in the series, \"Kirby's Dream Land.\"", titlePt: "Belly Flop (Ataque em Disparada)", textPt: "Em troca de uma grande abertura, pode arremessar os adversários para longe. Um golpe que o Dedede usa desde o primeiro jogo da série, \"Kirby's Dream Land.\"" },
  { titleEn: "[★★☆] Hovering", titleJp: "ホバリング", textJp: "大きく息をすいこみ、浮遊する。かつてカービィに負けたデデデが、対抗するために特訓して身につけた、努力のたまもの。", titleJpEn: "Hovering", textJpEn: "Takes a big breath and hovers. A fruit of hard training King Dedede undertook to compete with Kirby after once losing to him.", titlePt: "Hovering", textPt: "Toma um grande fôlego e flutua. Um fruto do treino árduo que o King Dedede realizou para competir com o Kirby depois de perder para ele uma vez." },
];

async function main() {
  const dedede = await db.fighter.findFirst({
    where: { name: "King Dedede" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true }, orderBy: { id: "asc" } },
    },
  });
  if (!dedede) { console.log("King Dedede not found"); return; }

  await db.fighter.update({
    where: { id: dedede.id },
    data: {
      curatorOverviewEn: "King Dedede, Dream Land's self-proclaimed monarch, is a heavyweight built around disruption — Inhale swallows opponents and projectiles with a wide reach but no copy ability, Gordo Throw plants a persistent hazard that can bounce back to punish careless approaches, and Jet Hammer offers devastating charged power at the risk of self-damage. Four jumps and Hovering give him surprisingly strong recovery for his size. Slow but relentless, Dedede rewards players who control the stage with Gordos while waiting for a heavy opening.",
      curatorOverviewPt: "King Dedede, o monarca autoproclamado de Dream Land, é um peso-pesado construído em torno da disrupção — Inhale engole adversários e projéteis com amplo alcance mas sem habilidade de cópia, Gordo Throw planta um obstáculo persistente que pode voltar para punir abordagens descuidadas, e Jet Hammer oferece poder carregado devastador com o risco de causar dano em si mesmo. Quatro pulos e Hovering lhe dão uma recuperação surpreendentemente forte para seu tamanho. Lento mas implacável, o Dedede recompensa jogadores que controlam o palco com Gordos enquanto esperam uma abertura pesada.",
      curatorOverviewJp: "デデデ大王、プププランドの自称君主は、妨害を中心に据えた重量級だ――すいこみは相手や飛び道具を広い範囲で飲み込むがコピー能力はなく、ゴルドー投げは不用意な接近を罰する持続的な障害物を設置し、ジェットハンマーは自傷のリスクと引き換えに壊滅的なためワザの威力を提供する。４回のジャンプとホバリングは、その体格に対して驚くほど強い復帰力を与える。遅いが執拗なデデデは、重い一撃のチャンスを待ちながらゴルドーでステージを制圧するプレイヤーに応える。",
      curatorOverviewJpEn: "King Dedede, Dream Land's self-proclaimed monarch, is a heavyweight built around disruption — Inhale swallows opponents and projectiles across a wide range but has no copy ability, Gordo Throw sets up a persistent obstacle that punishes careless approaches, and Jet Hammer offers devastating charged power at the risk of self-damage. Four jumps and Hovering give him surprisingly strong recovery for his size. Slow but relentless, Dedede rewards players who control the stage with Gordos while waiting for a heavy opening.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = dedede.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = dedede.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"Gordo Throw\" is a side special that hits a Gordo with his hammer. The struck Gordo bounces along the ground, reverses direction when it hits a wall, and disappears after a set time. It sometimes gets stuck in a wall and stops there. If an opponent attacks the Gordo, its direction of travel changes, and it can come back toward him. If it returns, inputting the side special again can hit it back. (GB) Kirby's Dream Land (1992/04) (3DS) Kirby: Triple Deluxe (2014/01)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Gordo Throw\" é um especial lateral que acerta um Gordo com seu martelo. O Gordo atingido quica pelo chão, inverte a direção ao bater em uma parede, e desaparece após um tempo determinado. Às vezes ele fica preso em uma parede e para ali. Se um adversário atacar o Gordo, sua direção de movimento muda, e ele pode voltar em direção ao Dedede. Se voltar, inputar o especial lateral novamente pode rebatê-lo. (GB) Kirby's Dream Land (1992/04) (3DS) Kirby: Triple Deluxe (2014/01)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  // Tips — index-matched (2 duplicate "Inhale (Neutral Special)" titles)
  if (dedede.tips.length !== TIPS.length) {
    console.log(`⚠️ Mismatch: DB has ${dedede.tips.length} tips, expected ${TIPS.length}`);
  } else {
    for (let i = 0; i < dedede.tips.length; i++) {
      const tip = dedede.tips[i];
      const data = TIPS[i];
      await db.fighterTip.update({
        where: { id: tip.id },
        data: { titleJp: data.titleJp, textJp: data.textJp, titleJpEn: data.titleJpEn, textJpEn: data.textJpEn, titlePt: data.titlePt, textPt: data.textPt },
      });
    }
    console.log(`✅ ${dedede.tips.length}/${TIPS.length} tips atualizadas`);
  }

  // Video fixes
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "King Dedede", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 4546, videoEndSec: 4563 } });
    console.log(`✅ SSBB Trophy: ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} -> 4546-4563 (1:15:46-1:16:03)`);
  }

  const mainSSB4 = await db.collectible.findFirst({ where: { name: "King Dedede", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec2: true, videoEndSec2: true } });
  if (mainSSB4) {
    await db.collectible.update({ where: { id: mainSSB4.id }, data: { videoStartSec2: 2810, videoEndSec2: 2821 } });
    console.log(`✅ SSB4 Trophy "King Dedede" secundário corrompido -> 2810-2821 (46:50-47:01)`);
  }

  // Fix corrupted "King Dedede (Alt.)" secondary field (was 2821-169920)
  const altTrophy = await db.collectible.findFirst({ where: { name: "King Dedede (Alt.)", smashGameVersion: "SSB4" }, select: { id: true } });
  if (altTrophy) {
    await db.collectible.update({ where: { id: altTrophy.id }, data: { videoStartSec2: 2821, videoEndSec2: 2832 } });
    console.log("✅ SSB4 Trophy \"King Dedede (Alt.)\" secundário corrompido -> 2821-2832");
  }

  // Link + normalize orphaned "Dedede Burst" [SSB4_WIIU]
  const burst = await db.collectible.findFirst({ where: { name: "Dedede Burst", smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
  if (burst) {
    await db.collectible.update({ where: { id: burst.id }, data: { smashGameVersion: "SSB4", fighterId: dedede.id } });
    console.log("✅ \"Dedede Burst\": normalizado SSB4, linkado");
  }

  await db.$disconnect();
}
main().catch(console.error);
