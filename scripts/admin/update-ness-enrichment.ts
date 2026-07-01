import { db } from "../../lib/db";

const SSB64_BIO_JP = "オネットの町に住む平凡な少年だった『ネス』は、裏山に隕石が落ちた日から、冒険への道へ踏み出す。ふしぎなちから＝「PSI」を使うことができる彼は、さまざまな出会いを通して成長していく。性格については、ゲーム上で深く語られたこともなく、不明な点が多い。";

const BIO_DATA: Record<string, { jp?: string; jpEn: string; pt: string }> = {
  SSB4: {
    jpEn: "A boy who lives in Onett, a small town in Eagleland. He looks like an ordinary boy, but can use psychic powers. In \"MOTHER2: Giygas Strikes Back,\" he sets out on a journey to stop Giygas. In Smash Bros., he fights using PSI, a bat, and a yo-yo. PK Thunder's trajectory can be controlled — hitting yourself with it and using the momentum to tackle an opponent deals heavy damage.",
    pt: "Um garoto que vive em Onett, uma pequena cidade em Eagleland. Ele parece um garoto comum, mas pode usar poderes psíquicos. Em \"MOTHER2: Giygas Strikes Back\", ele parte em uma jornada para deter Giygas. Em Smash Bros., ele luta usando PSI, um taco e um ioiô. A trajetória do PK Thunder pode ser controlada — acertar a si mesmo com ele e usar o impulso para investir contra um adversário causa dano pesado.",
  },
  SSBB: {
    jpEn: "A boy who lived a completely ordinary life. One day, while going to look at a meteorite that fell on the mountain behind his house, he meets an alien who warns him of a future crisis, and he sets off on a journey. He can use the power of the heart, \"PSI,\" while also skillfully wielding a bat and yo-yo. He's a boy who works hard to defeat Giygas while overcoming his homesickness.",
    pt: "Um garoto que vivia uma vida completamente comum. Um dia, ao ir ver um meteorito que caiu na montanha atrás de sua casa, ele encontra um alienígena que o alerta sobre uma crise futura, e ele parte em uma jornada. Ele pode usar o poder do coração, \"PSI\", enquanto também maneja habilmente um taco e um ioiô. É um garoto que se esforça para derrotar Giygas enquanto supera sua saudade de casa.",
  },
  SSBM: {
    jpEn: "A boy who uses the power of the heart, \"PSI.\" Living an ordinary life on the outskirts of Onett, Ness set out on a journey triggered by a meteorite crashing into the mountain behind his house. He experienced many encounters and many farewells, and in the final stretch, he fought on even at the cost of his own body.",
    pt: "Um garoto que usa o poder do coração, \"PSI.\" Vivendo uma vida comum nos arredores de Onett, o Ness parte em uma jornada desencadeada por um meteorito que caiu na montanha atrás de sua casa. Ele viveu muitos encontros e muitas despedidas, e na reta final, continuou lutando mesmo ao custo do próprio corpo.",
  },
  SSBU: {
    jpEn: "The protagonist of \"MOTHER2: Giygas Strikes Back.\" The name \"Ness\" is one of the first name suggestions that appears if you choose \"leave it to chance\" on the naming screen at the start of the game — it isn't the default name. In official materials such as the manual, this character is introduced purely as \"you,\" with \"(Ness)\" added alongside as a kind of supplementary note. He closely resembles \"Ninten,\" the protagonist of \"MOTHER1,\" but they are not the same person and have no relation — this is because \"2\" has some aspects of being a remake of \"1.\"",
    pt: "O protagonista de \"MOTHER2: Giygas Strikes Back.\" O nome \"Ness\" é uma das primeiras sugestões de nome que aparece se você escolher \"deixar por conta do acaso\" na tela de nomeação no início do jogo — não é o nome padrão. Em materiais oficiais como o manual, este personagem é apresentado puramente como \"você\", com \"(Ness)\" adicionado ao lado como uma espécie de nota complementar. Ele se parece muito com \"Ninten\", o protagonista de \"MOTHER1\", mas não são a mesma pessoa e não têm relação — isso ocorre porque \"2\" tem alguns aspectos de ser um remake de \"1\".",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "Ness's own movement speed is fairly modest overall. His bat and yo-yo smash attacks show off their strength and versatility when charged with Smash Hold. PK Flash starts out weak, but grows steadily larger and stronger the longer it's charged. PK Fire deals multiple hits if it connects deeply with an opponent, and it's also effective for stopping their movement. B: PK Flash, Side+B: PK Fire",
    pt: "A própria velocidade de movimento do Ness é geralmente modesta. Seus ataques smash de taco e ioiô mostram sua força e versatilidade quando carregados com Smash Hold. O PK Flash começa fraco, mas cresce e fica mais forte quanto mais é carregado. O PK Fire causa múltiplos golpes se conectar profundamente com um adversário, e também é eficaz para interromper seu movimento. B: PK Flash, Lateral+B: PK Fire",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "Attacks that don't directly use his own limbs tend to be more powerful. PK Thunder is a projectile that can be controlled after firing. Hitting yourself with it launches you at high speed, which is useful for recovery. PSI Magnet can absorb energy-based projectiles — if you see certain Pokémon, think of it as a way to heal. Up+B: PK Thunder, Down+B: PSI Magnet",
    pt: "Ataques que não usam diretamente seus próprios membros tendem a ser mais poderosos. O PK Thunder é um projétil que pode ser controlado após ser disparado. Acertar a si mesmo com ele o lança em alta velocidade, o que é útil para recuperação. O PSI Magnet pode absorver projéteis do tipo energia — se você ver certos Pokémon, pense nisso como uma forma de cura. Cima+B: PK Thunder, Baixo+B: PSI Magnet",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Speaking of the items Ness uses, it's the bat and the yo-yo. The bat is used in his side smash attack and side taunt. For the smash attack, hitting an opponent closer to the tip of the bat rather than the base increases its power. Swinging it in time with a projectile can also reflect it. The yo-yo is used in his up and down smash attacks — its wide attack range makes it an easy move to land. (SFC) MOTHER2: Giygas Strikes Back (1994/08) (GBA) MOTHER1+2 (2003/06)",
    pt: "Falando dos itens que o Ness usa, são o taco e o ioiô. O taco é usado em seu ataque smash lateral e provocação lateral. Para o ataque smash, acertar um adversário mais perto da ponta do taco em vez da base aumenta seu poder. Balançá-lo no momento certo com um projétil também pode refleti-lo. O ioiô é usado em seus ataques smash cima e baixo — seu amplo alcance de ataque o torna um movimento fácil de acertar. (SFC) MOTHER2: Giygas Strikes Back (1994/08) (GBA) MOTHER1+2 (2003/06)",
  },
];

const NESS_TIPS = [
  { titleEn: "[★☆☆] Ness's Origins", titleJp: "ネスの初登場作品", textJp: "ネスの初登場作品は１９９４年発売の『MOTHER2 ギーグの逆襲』。見た目はごく普通の少年だが、超能力が使える。４人家族の長男。", titleJpEn: "Ness's Origins", textJpEn: "Ness's debut was in \"MOTHER2: Giygas Strikes Back,\" released in 1994. He looks like an ordinary boy, but he can use psychic powers. He's the eldest son in a family of four.", titlePt: "As Origens do Ness", textPt: "O debut do Ness foi em \"MOTHER2: Giygas Strikes Back,\" lançado em 1994. Ele parece um garoto comum, mas pode usar poderes psíquicos. Ele é o filho mais velho de uma família de quatro." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "『MOTHER2』の主人公。名前と専用のPSI名称を、決めることができた。未来の使者より命運を託され、侵略者ギーグの計画を阻止するために立ち向かう。", titleJpEn: "In His Series", textJpEn: "The protagonist of \"MOTHER2.\" Players could choose his name and the names of his personal PSI powers. Entrusted with fate by a messenger from the future, he stands against the invader Giygas to stop his plans.", titlePt: "Na Série Original", textPt: "O protagonista de \"MOTHER2.\" Os jogadores podiam escolher seu nome e os nomes de seus poderes PSI pessoais. Confiado com o destino por um mensageiro do futuro, ele enfrenta o invasor Giygas para impedir seus planos." },
  { titleEn: "[★☆☆] Homesickness", titleJp: "ホームシック", textJp: "『MOTHER2 ギーグの逆襲』で、ネスはときどきホームシックになって、まともに戦えなくなる。家に帰るか、母親に電話すると回復する。", titleJpEn: "Homesickness", textJpEn: "In \"MOTHER2: Giygas Strikes Back,\" Ness occasionally becomes homesick and can't fight properly. Going home or calling his mother cures it.", titlePt: "Saudades de Casa", textPt: "Em \"MOTHER2: Giygas Strikes Back,\" o Ness ocasionalmente fica com saudades de casa e não consegue lutar direito. Voltar para casa ou ligar para a mãe cura isso." },
  { titleEn: "[★☆☆] Ness's Little Sister", titleJp: "ネスの妹", textJp: "ネスにはトレーシーという妹がいる。エスカルゴ運送でアルバイトをしており、持ち物を預けたり、届けたりする際の電話応対をしてくれる。", titleJpEn: "Ness's Little Sister", textJpEn: "Ness has a younger sister named Tracy. She works part-time for Escargo Express, and handles phone calls when you deposit or have items delivered.", titlePt: "A Irmã Mais Nova do Ness", textPt: "O Ness tem uma irmã mais nova chamada Tracy. Ela trabalha meio período na Escargo Express e atende as ligações quando você deposita ou recebe itens entregues." },
  { titleEn: "[★☆☆] Ness's PSI Powers", titleJp: "ネスの使うPSI", textJp: "ネスが使うPKファイヤーやPKサンダーは、原作では使えなかったPSI。原作『MOTHER2 ギーグの逆襲』では仲間のポーラが使っていた。", titleJpEn: "Ness's PSI Powers", textJpEn: "The PK Fire and PK Thunder that Ness uses were PSI powers he couldn't actually use in the original game. In \"MOTHER2: Giygas Strikes Back,\" it was his companion Paula who used them.", titlePt: "Os Poderes PSI do Ness", textPt: "O PK Fire e o PK Thunder que o Ness usa eram poderes PSI que ele não podia realmente usar no jogo original. Em \"MOTHER2: Giygas Strikes Back,\" era sua companheira Paula quem os usava." },
  { titleEn: "[★☆☆] Enlarging PK Flash (Neutral Special)", titleJp: "PKフラッシュの拡大 【通常必殺ワザ】", textJp: "ボタンを押し続けてためることで、威力と攻撃範囲が広がる。左右へのスティック入力で、動かすこともできる。", titleJpEn: "Enlarging PK Flash (Neutral Special)", textJpEn: "Holding the button to charge increases its power and attack range. You can also move it by inputting left or right on the stick.", titlePt: "Ampliando o PK Flash (Especial Neutro)", textPt: "Segurar o botão para carregar aumenta seu poder e alcance de ataque. Você também pode movê-lo inputando esquerda ou direita no analógico." },
  { titleEn: "[★☆☆] PK Fire (Side Special)", titleJp: "PKファイヤーの特徴 【横必殺ワザ】", textJp: "前方の相手を燃やす超能力を放つワザ。相手に当たると、火柱が出てしばらく燃え続ける。", titleJpEn: "PK Fire's Characteristics (Side Special)", textJpEn: "A move that unleashes a psychic power to set an opponent in front on fire. When it hits, a pillar of flame appears and keeps burning for a while.", titlePt: "As Características do PK Fire (Especial Lateral)", textPt: "Um movimento que libera um poder psíquico para incendiar um adversário à frente. Quando acerta, uma coluna de fogo aparece e continua queimando por um tempo." },
  { titleEn: "[★★☆] Aerial PK Fire (Side Special)", titleJp: "空中でPKファイヤー 【横必殺ワザ】", textJp: "PKファイヤーは地上で出すより、空中で出した方が、次の行動へのスキが小さい。空中では斜め下方向に飛ぶため、着地直前に出すと、離れたファイターには当てにくい。", titleJpEn: "Aerial PK Fire (Side Special)", textJpEn: "Using PK Fire in the air leaves a smaller opening for the next action than using it on the ground. In the air it travels diagonally downward, so using it right before landing makes it hard to hit fighters who are far away.", titlePt: "PK Fire no Ar (Especial Lateral)", textPt: "Usar o PK Fire no ar deixa uma abertura menor para a próxima ação do que usá-lo no chão. No ar, ele viaja na diagonal para baixo, então usá-lo bem antes de pousar dificulta acertar lutadores distantes." },
  { titleEn: "[★☆☆] PK Thunder's Bolt (Up Special)", titleJp: "PKサンダーの弾 【上必殺ワザ】", textJp: "発射した雷の弾を自由に動かすことができる。動かしている間は、無防備になるので注意。", titleJpEn: "PK Thunder's Bolt (Up Special)", textJpEn: "You can freely move the thunder projectile after firing it. Be careful, as you're defenseless while controlling it.", titlePt: "O Raio do PK Thunder (Especial Cima)", textPt: "Você pode mover livremente o projétil de raio após dispará-lo. Cuidado, pois você fica indefeso enquanto o controla." },
  { titleEn: "[★★☆] PK Thunder's Characteristics (Up Special)", titleJp: "PKサンダーの特性 【上必殺ワザ】", textJp: "電撃の尾の部分が相手に当たっても消滅することはない。また、撃った直後の一瞬は、相手に電撃が直撃しても消滅しない。", titleJpEn: "PK Thunder's Characteristics (Up Special)", textJpEn: "The trailing part of the electric bolt doesn't disappear even if it hits an opponent. Also, for a brief moment right after firing, the bolt won't vanish even if it directly hits an opponent.", titlePt: "As Características do PK Thunder (Especial Cima)", textPt: "A parte final do raio elétrico não desaparece mesmo se atingir um adversário. Além disso, por um breve momento logo após disparar, o raio não desaparece mesmo se atingir diretamente um adversário." },
  { titleEn: "[★☆☆] Sneaky PK Thunder Play (Up Special)", titleJp: "PKサンダーでけん制 【上必殺ワザ】", textJp: "方向入力で自由に動かせるので、復帰しようとする相手がいるときにガケ付近で回転するように動かすなど、けん制として使うことができる。", titleJpEn: "Feinting with PK Thunder (Up Special)", textJpEn: "Since it can be freely moved with directional input, you can use it as a check — for example, spinning it near the ledge when an opponent is trying to recover.", titlePt: "Intimidando com o PK Thunder (Especial Cima)", textPt: "Como pode ser movido livremente com o input direcional, você pode usá-lo como intimidação — por exemplo, girando-o perto da borda quando um adversário está tentando se recuperar." },
  { titleEn: "[★☆☆] PK Thunder Tackle (Up Special)", titleJp: "PKサンダーで体当たり 【上必殺ワザ】", textJp: "発射した電撃を自分に当てると強力な体当たり攻撃を行う。当たる角度によって飛んでいく向きが変わるので、復帰にも使える。", titleJpEn: "PK Thunder Tackle (Up Special)", textJpEn: "Hitting yourself with the fired bolt triggers a powerful tackle attack. The direction you fly changes depending on the angle of the hit, so it can also be used for recovery.", titlePt: "Investida do PK Thunder (Especial Cima)", textPt: "Acertar a si mesmo com o raio disparado desencadeia um poderoso ataque de investida. A direção do voo muda dependendo do ângulo do impacto, então também pode ser usado para recuperação." },
  { titleEn: "[★★☆] PK Thunder Usage (Up Special)", titleJp: "衝突からのPKサンダー 【上必殺ワザ】", textJp: "PKサンダーによる体当たり時、カベや地面に衝突したら、すぐに上必殺ワザ入力。落下せずにもう一度PKサンダーを出すことができる。", titleJpEn: "PK Thunder After a Collision (Up Special)", textJpEn: "When tackling with PK Thunder, if you collide with a wall or the ground, input Up Special again immediately. You can use PK Thunder once more without falling.", titlePt: "PK Thunder Após uma Colisão (Especial Cima)", textPt: "Ao investir com o PK Thunder, se você colidir com uma parede ou o chão, inpute o Especial Cima novamente imediatamente. Você pode usar o PK Thunder mais uma vez sem cair." },
  { titleEn: "[★☆☆] PSI Magnet (Down Special)", titleJp: "サイマグネット 【下必殺ワザ】", textJp: "エネルギー系の飛び道具を吸収することができる。吸収すると蓄積ダメージが回復する。", titleJpEn: "PSI Magnet (Down Special)", textJpEn: "It can absorb energy-based projectiles. Absorbing them heals accumulated damage.", titlePt: "PSI Magnet (Especial Baixo)", textPt: "Pode absorver projéteis do tipo energia. Absorvê-los cura o dano acumulado." },
  { titleEn: "[★☆☆] PK Starstorm (Final Smash)", titleJp: "PKスターストーム 【最後の切りふだ】", textJp: "ポーラとプーの支援を受けて放つと、天から無数の流星が降り注ぐ。左右の入力で、流星が降り注ぐ範囲を少し操作できる。", titleJpEn: "PK Starstorm (Final Smash)", textJpEn: "When unleashed with support from Paula and Poo, countless meteors rain down from the sky. Left/right input lets you slightly control the range where the meteors fall.", titlePt: "PK Starstorm (Final Smash)", textPt: "Quando desencadeado com o apoio de Paula e Poo, incontáveis meteoros caem do céu. O input esquerda/direita permite controlar levemente a área onde os meteoros caem." },
  { titleEn: "[★☆☆] Batter Up! (Side Smash Attack)", titleJp: "バットスイング 【横スマッシュ攻撃】", textJp: "スキが大きいが、バットで強烈にふっとばす。さらに、相手の飛び道具を打ち返すことも可能。", titleJpEn: "Bat Swing (Side Smash Attack)", textJpEn: "It has a large opening, but it sends opponents flying powerfully with the bat. It can also reflect opponents' projectiles.", titlePt: "Balanço de Taco (Ataque Smash Lateral)", textPt: "Tem uma grande abertura, mas arremessa os adversários poderosamente com o taco. Também pode refletir projéteis de adversários." },
  { titleEn: "[★☆☆] Around the World (Up Smash Attack)", titleJp: "シャトルループ 【上スマッシュ攻撃】", textJp: "ヨーヨーを前にのばしたあと、後ろに振り上げる。威力が高いだけでなく、攻撃できる範囲が広いので便利。", titleJpEn: "Shuttle Loop (Up Smash Attack)", textJpEn: "Extends the yo-yo forward, then swings it up behind. Not only is it powerful, its wide attack range makes it convenient.", titlePt: "Shuttle Loop (Ataque Smash Cima)", textPt: "Estende o ioiô para frente, depois o balança para cima e para trás. Além de poderoso, seu amplo alcance de ataque o torna conveniente." },
  { titleEn: "[★★☆] Reverse PK Throw (Backward Throw)", titleJp: "リバースPKスルー 【後ろ投げ】", textJp: "相手の蓄積ダメージによってふっとばし力が大きく変わる。ダメージのたまった相手に対しては撃墜を狙うワザとして十分使える。", titleJpEn: "Reverse PK Throw (Backward Throw)", textJpEn: "Its knockback power changes greatly depending on the opponent's accumulated damage. Against an opponent with high damage, it's a solid option for going for a KO.", titlePt: "Reverse PK Throw (Arremesso Traseiro)", textPt: "Seu poder de arremesso muda bastante dependendo do dano acumulado do adversário. Contra um adversário com muito dano, é uma opção sólida para buscar um KO." },
  { titleEn: "[★★☆] Yo-yo Attack with Charged Smash", titleJp: "スマッシュホールドでヨーヨー攻撃", textJp: "上と下のスマッシュ攻撃は、スマッシュホールド中でもヨーヨーでダメージを与えられる。", titleJpEn: "Yo-yo Attack During Smash Hold", textJpEn: "The up and down smash attacks can deal damage with the yo-yo even while holding the charge.", titlePt: "Ataque de Ioiô Durante o Smash Hold", textPt: "Os ataques smash cima e baixo podem causar dano com o ioiô mesmo enquanto segura a carga." },
  { titleEn: "[★★★] Pursuing off the Stage", titleJp: "ガケ外での追撃", textJp: "下空中攻撃によるメテオ効果や、前/後空中攻撃の押し出しなど、ガケの外で追撃するワザが豊富。追いかけすぎて自滅しないように。", titleJpEn: "Pursuing off the Stage", textJpEn: "With the meteor effect from the down air attack and the pushing knockback of the forward/back air attacks, Ness has plenty of moves for chasing opponents off the stage. Be careful not to chase too far and self-destruct.", titlePt: "Perseguindo Fora do Palco", textPt: "Com o efeito meteoro do ataque aéreo baixo e o empurrão dos ataques aéreos frontal/traseiro, o Ness tem vários movimentos para perseguir adversários para fora do palco. Cuidado para não perseguir demais e se autodestruir." },
  { titleEn: "[★★☆] Aim for the Fences", titleJp: "スイートスポットは先端", textJp: "バットの先端を当てるほど、相手をよくふっとばせる。これはアイテムのホームランバットもネスの横スマッシュ攻撃も同じ。", titleJpEn: "The Sweet Spot Is the Tip", textJpEn: "The closer you hit with the tip of the bat, the more powerfully it sends opponents flying. This applies both to the Home-Run Bat item and Ness's side smash attack.", titlePt: "O Ponto Ideal é a Ponta", textPt: "Quanto mais perto da ponta do taco você acertar, mais poderosamente arremessa os adversários. Isso se aplica tanto ao item Taco de Home Run quanto ao ataque smash lateral do Ness." },
];

async function main() {
  const ness = await db.fighter.findFirst({
    where: { name: "Ness" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true, contentJp: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!ness) { console.log("Ness not found"); return; }

  // Fix SSB64 bio JP
  const bio64 = ness.bios.find(b => b.smashGameVersion === "SSB64");
  if (bio64 && (!bio64.contentJp || bio64.contentJp === "NOT FOUND")) {
    await db.fighterBio.update({ where: { id: bio64.id }, data: { contentJp: SSB64_BIO_JP } });
    console.log("✅ Bio SSB64: JP adicionado");
  }

  // Add PT+JpEn for SSB4/SSBB/SSBM/SSBU
  for (const [version, data] of Object.entries(BIO_DATA)) {
    const bio = ness.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 5126-5140 -> 2238-2257 (matches trophy Ness in ZoomZike)
  const bioSsbm = ness.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 2238, videoEndSec: 2257 } });
    console.log("✅ Bio SSBM video: 5126-5140 -> 2238-2257 (37:18-37:37)");
  }

  // Fix SSBB Trophy timing: 7035-7036 (broken) -> 7036-7052 (1:57:16-1:57:32)
  const ssbbTrophy = await db.collectible.findFirst({
    where: { name: "Ness", smashGameVersion: "SSBB", type: "TROPHY" },
    select: { id: true },
  });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 7036, videoEndSec: 7052 } });
    console.log("✅ SSBB Trophy Ness: 7035-7036 (corrupted) -> 7036-7052 (1:57:16-1:57:32)");
  }

  // Moves EN+PT
  for (const m of ness.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of NESS_TIPS) {
    const tip = ness.tips.find(t => t.titleEn === data.titleEn);
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
  console.log(`✅ ${updated}/${NESS_TIPS.length} tips atualizadas`);

  await db.$disconnect();
}
main().catch(console.error);
