import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Sephiroth's Origins",
    titleJp: "セフィロスの初登場作品",
    textJp: "セフィロスの初登場作品は、１９９７年発売の『ファイナルファンタジーⅦ』。圧倒的な身体能力を有し、長大な刀「正宗」を操る、神羅カンパニーのソルジャー。",
    titleJpEn: "Sephiroth's Debut Work",
    textJpEn: "Sephiroth's first appearance was in Final Fantasy VII, released in 1997. A SOLDIER of the Shinra Company with overwhelming physical abilities, who wields the long katana Masamune.",
    titlePt: "As Origens de Sephiroth",
    textPt: "A primeira aparição de Sephiroth foi em Final Fantasy VII, lançado em 1997. Um SOLDIER da Shinra Company com habilidades físicas avassaladoras, que empunha a longa katana Masamune.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "英雄とまで呼ばれた最高のソルジャーであり、多くの若者の憧憬の的だったが、ある事件を境に変貌し、クラウドの前に敵として立ちはだかった。",
    titleJpEn: "In the Original Game",
    textJpEn: "He was the greatest SOLDIER, even called a hero, and an object of admiration for many young people, but after a certain incident, he changed and stood before Cloud as an enemy.",
    titlePt: "No Jogo Original",
    textPt: "Ele foi o maior SOLDIER, chegando a ser chamado de herói, e um objeto de admiração para muitos jovens, mas depois de um certo incidente, ele mudou e se colocou diante de Cloud como um inimigo.",
  },
  {
    titleEn: "[★☆☆] Flare/Megaflare/Gigaflare (Neutral Special)",
    titleJp: "フレア / メガフレア / ギガフレア 【通常必殺ワザ】",
    textJp: "ボタンを押すと最大３段階まで力をため、離すと時間経過で爆発する火球を放つ。ためるほど、爆発は大規模になり、射程は短くなる。",
    titleJpEn: "Flare/Megaflare/Gigaflare (Neutral Special)",
    textJpEn: "Holding the button charges power up to 3 stages, and releasing it fires a fireball that explodes after a set time. The longer it's charged, the larger the explosion, but the shorter the range.",
    titlePt: "Flare/Megaflare/Gigaflare (Especial Neutro)",
    textPt: "Segurar o botão carrega energia em até 3 estágios, e soltá-lo dispara uma bola de fogo que explode depois de um tempo determinado. Quanto mais tempo carregado, maior a explosão, mas menor o alcance.",
  },
  {
    titleEn: "[★☆☆] Flare (Neutral Special)",
    titleJp: "フレア 【通常必殺ワザ】",
    textJp: "ボタンをすぐに離すと、巨大な火球を放つ。放つまでのスキが大きく、弾速もやや遅めだが、射程が長く威力が高め。",
    titleJpEn: "Flare (Neutral Special)",
    textJpEn: "Releasing the button right away fires a giant fireball. It has a large opening before it's fired and travels somewhat slowly, but it has long range and fairly high power.",
    titlePt: "Flare (Especial Neutro)",
    textPt: "Soltar o botão imediatamente dispara uma bola de fogo gigante. Há uma grande brecha antes de ser disparada e ela viaja um pouco devagar, mas tem longo alcance e poder relativamente alto.",
  },
  {
    titleEn: "[★☆☆] Gigaflare (Neutral Special)",
    titleJp: "ギガフレア 【通常必殺ワザ】",
    textJp: "放つ際のスキが非常に大きく射程が短いが、爆発は威力も規模も絶大。爆発の中心に近いほど、威力が高い。",
    titleJpEn: "Gigaflare (Neutral Special)",
    textJpEn: "The opening when firing is extremely large and the range is short, but the explosion is tremendous in both power and scale. The closer to the center of the explosion, the higher the damage.",
    titlePt: "Gigaflare (Especial Neutro)",
    textPt: "A brecha ao disparar é extremamente grande e o alcance é curto, mas a explosão é tremenda tanto em poder quanto em escala. Quanto mais perto do centro da explosão, maior o dano.",
  },
  {
    titleEn: "[★☆☆] Canceling the Charge (Neutral Special)",
    titleJp: "ワザのキャンセル 【通常必殺ワザ】",
    textJp: "かまえ中、ジャンプやシールド、回避を行うと、ワザを中断できる。ただし、ための段階は保持できない。",
    titleJpEn: "Canceling the Charge (Neutral Special)",
    textJpEn: "While readying the move, jumping, shielding, or dodging will cancel it. However, the charge level can't be held onto afterward.",
    titlePt: "Cancelando a Carga (Especial Neutro)",
    textPt: "Enquanto se prepara para o golpe, pular, usar o escudo, ou esquivar o cancela. Porém, o nível de carga não pode ser mantido depois disso.",
  },
  {
    titleEn: "[★☆☆] Shadow Flare (Side Special)",
    titleJp: "シャドウフレア 【横必殺ワザ】",
    textJp: "小さく速い弾を放つ。弾は当たった相手の周囲を回り始め、一定時間が経つと相手に向かって収束し、爆発する。",
    titleJpEn: "Shadow Flare (Side Special)",
    textJpEn: "Fires a small, fast projectile. The projectile begins orbiting an opponent it hits, and after a set time, it converges on them and explodes.",
    titlePt: "Shadow Flare (Especial Lateral)",
    textPt: "Dispara um projétil pequeno e rápido. O projétil começa a orbitar um oponente atingido, e depois de um tempo determinado, converge sobre ele e explode.",
  },
  {
    titleEn: "[★☆☆] Multiple Shadow Flares (Side Special)",
    titleJp: "シャドウフレアの数 【横必殺ワザ】",
    textJp: "相手を周回する弾の数は、５個まで増やせる。初段をボタン長押しでためたり、重ねて当てることで可能。",
    titleJpEn: "Multiple Shadow Flares (Side Special)",
    textJpEn: "The number of projectiles orbiting an opponent can be increased up to 5. This is possible by charging the first hit with a held button press, or by landing multiple hits in succession.",
    titlePt: "Múltiplos Shadow Flares (Especial Lateral)",
    textPt: "O número de projéteis orbitando um oponente pode ser aumentado até 5. Isso é possível carregando o primeiro acerto com o botão segurado, ou acertando múltiplos golpes em sucessão.",
  },
  {
    titleEn: "[★☆☆] Avoiding Shadow Flare (Side Special)",
    titleJp: "シャドウフレアを回避 【横必殺ワザ】",
    textJp: "周囲を回る弾は、収束し爆発する瞬間、シールドや回避することが可能。",
    titleJpEn: "Avoiding Shadow Flare (Side Special)",
    textJpEn: "The orbiting projectiles can still be shielded or dodged the instant they converge and explode.",
    titlePt: "Evitando o Shadow Flare (Especial Lateral)",
    textPt: "Os projéteis orbitando ainda podem ser bloqueados com escudo ou esquivados no instante em que convergem e explodem.",
  },
  {
    titleEn: "[★☆☆] Reduced Shadow Flare (Side Special)",
    titleJp: "シャドウフレアの軽減 【横必殺ワザ】",
    textJp: "周囲を回る弾は、第三者に当てると数が減っていく。反射や吸収をされることでも、数が減る。",
    titleJpEn: "Reduced Shadow Flare (Side Special)",
    textJpEn: "The number of orbiting projectiles decreases if they hit a third party. The number also decreases if they're reflected or absorbed.",
    titlePt: "Redução do Shadow Flare (Especial Lateral)",
    textPt: "O número de projéteis orbitando diminui se atingirem um terceiro lutador. O número também diminui se forem refletidos ou absorvidos.",
  },
  {
    titleEn: "[★☆☆] Blade Dash (Up Special)",
    titleJp: "一閃 【上必殺ワザ】",
    textJp: "ワザの出始めに、スティック入力で方向を決めるとその方向へ高速で斬り抜ける。ガケ外からの復帰に使える。",
    titleJpEn: "Flash Slash (Up Special)",
    textJpEn: "At the very start of the move, an input on the stick sets the direction, and Sephiroth slashes through at high speed in that direction. It can be used to recover from off the ledge.",
    titlePt: "Blade Dash (Especial Superior)",
    textPt: "Bem no início do golpe, um input no direcional define a direção, e Sephiroth corta em alta velocidade nessa direção. Pode ser usado para se recuperar de fora da borda.",
  },
  {
    titleEn: "[★☆☆] Octaslash (Up Special)",
    titleJp: "八刀一閃 【上必殺ワザ】",
    textJp: "ボタンを長押しすると、連続８回斬りつける、八刀一閃をくり出せる。強力だが、終わり際のスキが非常に大きい。",
    titleJpEn: "Octaslash (Up Special)",
    textJpEn: "Holding the button down brings out Octaslash, striking 8 times in a row. It's powerful, but leaves an extremely large opening right at the end.",
    titlePt: "Octaslash (Especial Superior)",
    textPt: "Segurar o botão desfere o Octaslash, atacando 8 vezes seguidas. É poderoso, mas deixa uma brecha extremamente grande bem no final.",
  },
  {
    titleEn: "[★☆☆] Scintilla (Down Special)",
    titleJp: "閃光 【下必殺ワザ】",
    textJp: "前方に光の障壁を張った後、障壁を閃光と化して攻撃する。障壁は、前方からの直接攻撃や飛び道具を防ぐ。",
    titleJpEn: "Flash (Down Special)",
    textJpEn: "Puts up a barrier of light in front, then turns the barrier into a flash of light to attack. The barrier blocks direct attacks and projectiles from the front.",
    titlePt: "Scintilla (Especial Inferior)",
    textPt: "Ergue uma barreira de luz à frente, e então transforma a barreira num clarão para atacar. A barreira bloqueia ataques diretos e projéteis vindos de frente.",
  },
  {
    titleEn: "[★★☆] Scintilla Characteristics (Down Special)",
    titleJp: "閃光の特徴 【下必殺ワザ】",
    textJp: "カウンターとは異なり、相手の攻撃を受けなくても、光の障壁は一定時間で閃光になる。また、閃光は相手に反射や吸収をされることがある。",
    titleJpEn: "Flash Characteristics (Down Special)",
    textJpEn: "Unlike a counter, the barrier of light turns into a flash after a set time even without being hit by an opponent's attack. The flash can also be reflected or absorbed by an opponent.",
    titlePt: "Características do Scintilla (Especial Inferior)",
    textPt: "Diferente de um counter, a barreira de luz se transforma num clarão depois de um tempo determinado, mesmo sem sofrer o ataque de um oponente. O clarão também pode ser refletido ou absorvido por um oponente.",
  },
  {
    titleEn: "[★☆☆] Scintilla's Power (Down Special)",
    titleJp: "閃光の威力 【下必殺ワザ】",
    textJp: "光の障壁は、相手の攻撃を受けると、すぐに閃光と化す。受けたダメージが大きいほど閃光の威力が上がるが、大きすぎると障壁のまま壊れる。",
    titleJpEn: "Flash's Power (Down Special)",
    textJpEn: "The barrier of light immediately turns into a flash if it's hit by an opponent's attack. The more damage taken, the higher the flash's power, but if the damage is too great, the barrier simply breaks instead.",
    titlePt: "Poder do Scintilla (Especial Inferior)",
    textPt: "A barreira de luz se transforma imediatamente num clarão se for atingida pelo ataque de um oponente. Quanto maior o dano sofrido, maior o poder do clarão, mas se o dano for grande demais, a barreira simplesmente se quebra.",
  },
  {
    titleEn: "[★☆☆] Supernova (Final Smash)",
    titleJp: "スーパーノヴァ 【最後の切りふだ】",
    textJp: "前方を広く斬り払い、当たった相手に超新星爆発で大ダメージを与える。さらに状態異常にすることがある。最初の斬り払いで、相手を３人まで巻き込める。",
    titleJpEn: "Supernova (Final Smash)",
    textJpEn: "Slashes widely in front, dealing massive damage to any opponent hit via a supernova explosion. It can also inflict a status ailment. The initial slash can catch up to 3 opponents.",
    titlePt: "Supernova (Ataque Final)",
    textPt: "Corta amplamente à frente, causando dano massivo a qualquer oponente atingido através de uma explosão de supernova. Também pode causar um efeito de status. O corte inicial pode atingir até 3 oponentes.",
  },
  {
    titleEn: "[★☆☆] Effects of Supernova (Final Smash)",
    titleJp: "スーパーノヴァの効果 【最後の切りふだ】",
    textJp: "相手を、ふらふら、ねむり、操作反転、スロー、お花のいずれかの状態にすることがある。ただし、ガケ外でワザが当たった場合は、ふらふらやねむり、操作反転状態にはならない。",
    titleJpEn: "Effects of Supernova (Final Smash)",
    textJpEn: "This move can inflict an opponent with one of the following: dizziness, sleep, reversed controls, slowness, or the flower effect. However, if it hits an opponent off the ledge, it won't cause dizziness, sleep, or reversed controls.",
    titlePt: "Efeitos do Supernova (Ataque Final)",
    textPt: "Esse golpe pode causar em um oponente um dos seguintes efeitos: tontura, sono, controles invertidos, lentidão, ou o efeito de flor. Porém, se atingir um oponente fora da borda, não causa tontura, sono, ou controles invertidos.",
  },
  {
    titleEn: "[★☆☆] Winged Form",
    titleJp: "片翼",
    textJp: "蓄積ダメージが高くなるなど不利な状況では、背中から片翼が生える。攻撃力が上がり、空中で２回ジャンプ可能になる。移動速度もわずかに上がる。",
    titleJpEn: "One Wing",
    textJpEn: "In disadvantageous situations, such as when accumulated damage is high, a single wing sprouts from Sephiroth's back. This increases his attack power and allows him to jump twice in midair. His movement speed also increases slightly.",
    titlePt: "Winged Form",
    textPt: "Em situações desvantajosas, como quando o dano acumulado está alto, uma única asa brota das costas de Sephiroth. Isso aumenta o poder de ataque dele e permite pular duas vezes no ar. A velocidade de movimento também aumenta um pouco.",
  },
  {
    titleEn: "[★★☆] Winged Form Conditions",
    titleJp: "片翼の条件",
    textJp: "片翼は、状況が自分に不利になるほど生えやすく、逆に有利な時は生えにくくなる。蓄積ダメージの他、スコアやストック数の差も影響する。",
    titleJpEn: "One Wing Conditions",
    textJpEn: "The more unfavorable Sephiroth's situation, the more likely the wing is to sprout; conversely, it's less likely to appear when he's at an advantage. Besides accumulated damage, differences in score and stock count also have an effect.",
    titlePt: "Condições do Winged Form",
    textPt: "Quanto mais desfavorável a situação de Sephiroth, mais provável é que a asa brote; por outro lado, é menos provável que apareça quando ele está em vantagem. Além do dano acumulado, diferenças na pontuação e no número de vidas também têm efeito.",
  },
  {
    titleEn: "[★☆☆] Characteristics of Slashing/Stabbing",
    titleJp: "斬撃と刺突の特徴",
    textJp: "斬撃系のワザは、刀身の中央付近の威力が高い。一方、刺突系のワザは先端の威力が高く、特に突き出した瞬間が最も高い。",
    titleJpEn: "Characteristics of Slashing and Stabbing",
    textJpEn: "Slashing-type moves deal more damage near the middle of the blade. Stabbing-type moves, on the other hand, deal more damage at the tip, and are strongest especially at the instant of the thrust.",
    titlePt: "Características de Corte e Estocada",
    textPt: "Golpes do tipo corte causam mais dano perto do meio da lâmina. Golpes do tipo estocada, por outro lado, causam mais dano na ponta, sendo mais fortes especialmente no instante da investida.",
  },
  {
    titleEn: "[★☆☆] Side Tilt Attack",
    titleJp: "横強攻撃",
    textJp: "刀を真横に振り抜いて攻撃する。リーチが長い。出始めに上下に入力すると、攻撃を上下に出し分けられる。",
    titleJpEn: "Side Tilt Attack",
    textJpEn: "Swings the katana straight across to attack. It has long reach. Inputting up or down at the very start lets Sephiroth angle the attack up or down.",
    titlePt: "Ataque Forte Lateral",
    textPt: "Golpeia com a katana na horizontal para atacar. Tem alcance longo. Inserir para cima ou para baixo bem no início permite direcionar o ataque para cima ou para baixo.",
  },
  {
    titleEn: "[★☆☆] Up Tilt Attack",
    titleJp: "上強攻撃",
    textJp: "真上に向かって刀を突き刺す。リーチが長いが、真上以外にいる相手には当てにくい。ただし、刀を振り上げる瞬間、目の前の相手を巻き込んで突き上げることができる。",
    titleJpEn: "Up Tilt Attack",
    textJpEn: "Thrusts the katana straight upward. It has long reach, but is hard to land on opponents who aren't directly above. However, the instant the katana is swung upward, it can catch and launch an opponent right in front.",
    titlePt: "Ataque Forte para Cima",
    textPt: "Estoca a katana diretamente para cima. Tem alcance longo, mas é difícil de acertar oponentes que não estejam diretamente acima. Porém, no instante em que a katana é erguida, ela pode pegar e lançar um oponente bem à frente.",
  },
  {
    titleEn: "[★★☆] Down Smash Attack",
    titleJp: "下スマッシュ攻撃",
    textJp: "斜め下に向かって刀を突き刺す。床に当たると土煙が上がり、与えるダメージが増える。この土煙は相手のシールドを削りやすいため、防御を固めている相手に有効。",
    titleJpEn: "Down Smash Attack",
    textJpEn: "Thrusts the katana diagonally downward. If it hits the floor, a cloud of dust rises, increasing the damage dealt. This dust cloud is effective at wearing down an opponent's shield, making it useful against opponents who are turtling.",
    titlePt: "Ataque Forte para Baixo",
    textPt: "Estoca a katana na diagonal para baixo. Se atingir o chão, uma nuvem de poeira se ergue, aumentando o dano causado. Essa nuvem de poeira é eficaz para desgastar o escudo do oponente, sendo útil contra oponentes na defensiva.",
  },
  {
    titleEn: "[★☆☆] Forward Air Attack",
    titleJp: "前空中攻撃",
    textJp: "前方に向かって刀を突き刺す。攻撃時間が長めで、相手をけん制しやすい。",
    titleJpEn: "Forward Air Attack",
    textJpEn: "Thrusts the katana forward. Its attack duration is fairly long, making it easy to keep opponents in check with.",
    titlePt: "Ataque Aéreo para Frente",
    textPt: "Estoca a katana para frente. A duração do ataque é relativamente longa, facilitando pressionar o oponente à distância.",
  },
  {
    titleEn: "[★☆☆] Forward Air Attack and Walls",
    titleJp: "前空中攻撃とカベ",
    textJp: "カベに刀が突き刺さると、しばらくそのまま留まることができる。さらに、そこからジャンプすることが可能。",
    titleJpEn: "Forward Air Attack and Walls",
    textJpEn: "If the katana sticks into a wall, Sephiroth can remain there for a while. From there, he can also jump.",
    titlePt: "Ataque Aéreo para Frente e Paredes",
    textPt: "Se a katana se cravar numa parede, Sephiroth pode permanecer ali por um tempo. A partir daí, ele também pode pular.",
  },
  {
    titleEn: "[★☆☆] Down Air Attack",
    titleJp: "下空中攻撃",
    textJp: "真下に向かって刀を突き刺すワザ、「獄門」をくり出す。ワザの出始めに、メテオ効果がある。",
    titleJpEn: "Down Air Attack",
    textJpEn: "Brings out \"Hell's Gate,\" a move that thrusts the katana straight down. It has a meteor effect at the very start of the move.",
    titlePt: "Ataque Aéreo Inferior",
    textPt: "Desfere o \"Hell's Gate\", um golpe que estoca a katana diretamente para baixo. Ele tem efeito meteoro bem no início do golpe.",
  },
];

async function main() {
  const sephiroth = await db.fighter.findFirst({
    where: { name: { contains: "Sephiroth", mode: "insensitive" } },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!sephiroth) { console.log("Sephiroth not found"); return; }

  await db.fighter.update({
    where: { id: sephiroth.id },
    data: {
      curatorOverviewEn: "Sephiroth's neutral special is a three-stage bet: charging longer trades range for a bigger detonation, from a fast long-range Flare to a devastating but short-ranged Gigaflare, and the charge can be canceled entirely with a jump, shield, or dodge if the read goes bad. Shadow Flare turns a single small projectile into a stacking threat — up to 5 can orbit an opponent at once, built up by charging the first hit or landing several in succession, and while the opponent can still shield or dodge the moment they converge and detonate, the count only drops if they hit a different target or get reflected or absorbed. His up special, Blade Dash, is a direction-select recovery slash, while its heavier form, Octaslash, is an eight-hit flurry that hits hard but leaves him extremely exposed at the very end. Scintilla is a barrier rather than a true counter — it automatically turns into a damaging flash after enough time passes even if never touched, and if an opponent does hit it, the flash scales with the damage absorbed, though too much damage just breaks the barrier outright instead of empowering it. His whole kit escalates further with One Wing, an automatic transformation triggered by being at a disadvantage (high damage, being down on stocks or score) that boosts his power, speed, and grants a second midair jump — the worse things look, the more likely it triggers. Between the length-based damage on his slashes and thrusts, long-reaching tilts, and a forward air that can stick into a wall for an extra jump, Sephiroth plays a spacing game built around his sword's absurd reach, while his real ceiling is locked behind reading when to commit to a slow, telegraphed finisher like Octaslash or Gigaflare.",
      curatorOverviewPt: "O especial neutro de Sephiroth é uma aposta em três estágios: carregar por mais tempo troca alcance por uma detonação maior, indo de um Flare rápido de longo alcance até um Gigaflare devastador mas de curto alcance, e a carga pode ser cancelada completamente com um pulo, escudo, ou esquiva se a leitura der errado. O Shadow Flare transforma um único projétil pequeno numa ameaça acumulável — até 5 podem orbitar um oponente ao mesmo tempo, conseguidos ao carregar o primeiro acerto ou acertar vários em sucessão, e embora o oponente ainda possa usar escudo ou esquivar no instante em que convergem e detonam, a contagem só diminui se atingirem um alvo diferente ou forem refletidos ou absorvidos. O especial superior dele, Blade Dash, é um corte de recuperação com direção selecionável, enquanto sua versão mais pesada, Octaslash, é uma rajada de oito acertos que bate forte, mas o deixa extremamente exposto bem no final. O Scintilla é uma barreira, não um counter de verdade — ela se transforma automaticamente num clarão danoso depois de tempo suficiente, mesmo sem nunca ser tocada, e se um oponente a atingir, o clarão escala com o dano absorvido, embora dano demais simplesmente quebre a barreira em vez de fortalecê-la. O kit inteiro dele escala ainda mais com o Winged Form, uma transformação automática ativada por estar em desvantagem (dano alto, atrás em vidas ou pontuação) que aumenta seu poder, velocidade, e concede um segundo pulo aéreo — quanto pior a situação parecer, mais provável é que ative. Entre o dano baseado na distância dos cortes e estocadas, ataques fortes de alcance longo, e um aéreo para frente que pode se cravar numa parede para um pulo extra, Sephiroth joga um jogo de posicionamento construído em torno do alcance absurdo da espada, enquanto seu verdadeiro teto fica trancado atrás de saber quando se comprometer com um finalizador lento e visível como o Octaslash ou o Gigaflare.",
      curatorOverviewJp: "セフィロスの通常必殺ワザは３段階の賭けだ——長くためるほどリーチと引き換えに爆発が大きくなり、速く届く長射程の「フレア」から、射程は短いが絶大な威力を誇る「ギガフレア」まで幅がある。かまえ中はジャンプ、シールド、回避でいつでもキャンセルでき、読みが外れた時の保険になる。「シャドウフレア」は、小さな単発の弾を積み重ね可能な脅威に変える——最大５発まで相手の周りを回らせられ、初段をためるか複数回当てることで増やせる。相手は収束して爆発する瞬間にシールドや回避で防げるが、弾の数は別の相手に当たるか、反射・吸収されない限り減らない。上必殺ワザ「一閃」は方向を選べる復帰斬りで、より重い「八刀一閃」は８回連続の斬撃だが、終わり際に非常に大きなスキを晒す。「閃光」はカウンターというより障壁だ——一定時間が経てば、触れられなくても自動的にダメージのある閃光に変わり、相手に攻撃された場合は受けたダメージ量に応じて閃光の威力がスケールするが、ダメージが大きすぎると強化されるどころか障壁そのものが壊れてしまう。セフィロスの技構成全体は「片翼」でさらに跳ね上がる——蓄積ダメージが高い、ストックやスコアで劣勢といった不利な状況で自動的に発動する変身で、攻撃力・移動速度が上がり、空中ジャンプが１回増える。状況が悪化するほど発動しやすい。斬撃と刺突で威力の出る場所が違う点、リーチの長い強攻撃、そしてカベに突き刺さって追加ジャンプできる前空中攻撃を組み合わせ、セフィロスは刀の異常なリーチを軸にした間合い管理のゲームをプレイする。その一方で、真の実力の天井は、八刀一閃やギガフレアのような遅くて見え見えの大技にいつ踏み込むかを読み切れるかどうかの先にある。",
      curatorOverviewJpEn: "Sephiroth's neutral special is a three-stage gamble — the longer it's charged, the more range is traded for a bigger explosion, ranging from the fast, long-reaching \"Flare\" to the short-ranged but tremendously powerful \"Gigaflare.\" While readying the move, it can be canceled at any time with a jump, shield, or dodge, serving as insurance if the read goes wrong. \"Shadow Flare\" turns a single small projectile into a stackable threat — up to 5 can be made to orbit an opponent, built up by charging the first hit or landing multiple hits. The opponent can still block or dodge the instant the orbiters converge and explode, but the count only decreases if they hit a different opponent or get reflected or absorbed. The up special \"Blade Dash\" is a direction-selectable recovery slash, while its heavier version, \"Octaslash,\" is an eight-hit combo that leaves an extremely large opening right at the end. \"Scintilla\" is more of a barrier than a true counter — after enough time passes, it automatically turns into a damaging flash even without being touched, and if it is hit by an opponent, the flash's power scales with the amount of damage absorbed, though too much damage simply breaks the barrier outright instead of empowering it. Sephiroth's entire moveset escalates further with \"One Wing,\" a transformation that automatically triggers under disadvantageous conditions — high accumulated damage, or being behind in stocks or score — boosting his attack power and movement speed, and granting one extra midair jump. The worse the situation gets, the more likely it is to trigger. Combining the fact that slashes and thrusts deal damage from different parts of the blade, long-reaching tilt attacks, and a forward air that can stick into a wall for an extra jump, Sephiroth plays a spacing game built around his sword's absurd reach. Meanwhile, the true ceiling of his potential lies in reading exactly when to commit to a slow, heavily telegraphed finisher like Octaslash or Gigaflare.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = sephiroth.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: sephiroth.id }, data: { curationStatus: "approved" } });
  console.log("✅ Sephiroth aprovado");

  // Sem FighterMove (0 registros) — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista Final Fantasy VII corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.
  // Achados curiosos preservados, não são erro: "Blade Dash" (EN) = "一閃" ("Flash Slash", literal) no JP;
  // "Scintilla" (EN) = "閃光" ("Flash", literal) no JP — mantidos fiéis em cada idioma, sem reconciliar,
  // mesmo padrão já visto em Min Min (Ramram/Hot Ring) e Isabelle (Kent/Digby).

  await db.$disconnect();
}
main().catch(console.error);
