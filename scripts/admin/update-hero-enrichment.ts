import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Hero: (P1/P5 Costume) Origins",
    titleJp: "勇者(1P / 5Pカラー)の初登場作品",
    textJp: "初登場は、２０１７年発売の『ドラゴンクエストXI 過ぎ去りし時を求めて』。勇者の生まれ変わりとして国王に謁見するが、「悪魔の子」と呼ばれ、追われる身となる。",
    titleJpEn: "Hero (P1/P5 Costume): Debut Work",
    textJpEn: "His debut was in Dragon Quest XI: Echoes of an Elusive Age, released in 2017. He has an audience with the king as the reincarnation of the legendary hero, but is branded \"the Darkspawn\" and becomes a hunted man.",
    titlePt: "Hero (Traje P1/P5): As Origens",
    textPt: "Sua estreia foi em Dragon Quest XI: Echoes of an Elusive Age, lançado em 2017. Ele tem uma audiência com o rei como a reencarnação do herói lendário, mas é rotulado como \"a Cria do Demônio\" e se torna um homem caçado.",
  },
  {
    titleEn: "[★☆☆] Hero: (P2/P6 Costume) Origins",
    titleJp: "勇者(2P / 6Pカラー)の初登場作品",
    textJp: "初登場は、１９８８年発売の『ドラゴンクエストIII そして伝説へ…』。父の遺志を継いで、魔王バラモスを倒すための旅に出る。",
    titleJpEn: "Hero (P2/P6 Costume): Debut Work",
    textJpEn: "His debut was in Dragon Quest III: And Then Into Legend..., released in 1988. He carries on his father's will and sets out on a journey to defeat the Archfiend Baramos.",
    titlePt: "Hero (Traje P2/P6): As Origens",
    textPt: "Sua estreia foi em Dragon Quest III: E Então, à Lenda..., lançado em 1988. Ele carrega adiante a vontade de seu pai e parte numa jornada para derrotar o Arquidemônio Baramos.",
  },
  {
    titleEn: "[★☆☆] Hero: (P3/P7 Costume) Origins",
    titleJp: "勇者(3P / 7Pカラー)の初登場作品",
    textJp: "初登場は、１９９０年発売の『ドラゴンクエストIV 導かれし者たち』。魔物に故郷を滅ぼされて旅立ち、共に世界を救う仲間と出会う。天空人の血を引いている。",
    titleJpEn: "Hero (P3/P7 Costume): Debut Work",
    textJpEn: "His debut was in Dragon Quest IV: Chapters of the Chosen, released in 1990. After his hometown is destroyed by monsters, he sets out on a journey and meets companions who will save the world together with him. He carries the blood of the Zenithians.",
    titlePt: "Hero (Traje P3/P7): As Origens",
    textPt: "Sua estreia foi em Dragon Quest IV: Chapters of the Chosen, lançado em 1990. Depois que sua cidade natal é destruída por monstros, ele parte numa jornada e encontra companheiros que salvarão o mundo junto com ele. Ele carrega o sangue dos Zenithianos.",
  },
  {
    titleEn: "[★☆☆] Hero: (P4/P8 Costume) Origins",
    titleJp: "勇者(4P / 8Pカラー)の初登場作品",
    textJp: "初登場は、２００４年発売の『ドラゴンクエストVIII 空と海と大地と呪われし姫君』。呪いで滅びた王国の元近衛兵。姿を変えられた国王や姫と共に、呪いを解くため旅をする。",
    titleJpEn: "Hero (P4/P8 Costume): Debut Work",
    textJpEn: "His debut was in Dragon Quest VIII: Journey of the Cursed King, released in 2004. He is a former royal guardsman of a kingdom ruined by a curse. He journeys together with the king and princess, both transformed by the curse, to undo it.",
    titlePt: "Hero (Traje P4/P8): As Origens",
    textPt: "Sua estreia foi em Dragon Quest VIII: Journey of the Cursed King, lançado em 2004. Ele é um ex-guarda real de um reino arruinado por uma maldição. Ele viaja junto com o rei e a princesa, ambos transformados pela maldição, para desfazê-la.",
  },
  {
    titleEn: "[★☆☆] Charging Up Specials (Neutral, Up, Side Special)",
    titleJp: "必殺ワザのため 【通常・上・横必殺ワザ】",
    textJp: "ためるほど、放った時の威力が上がる。最大３段階まで上げられる。威力が高いほど、発動時に、より多くのMPが必要になる。",
    titleJpEn: "Charging Up Specials (Neutral, Up, Side Special)",
    textJpEn: "The more it's charged, the more power it has when unleashed. It can be raised up to a maximum of 3 levels. The higher the power, the more MP is required to activate it.",
    titlePt: "Carregando os Especiais (Especial Neutro, Superior e Lateral)",
    textPt: "Quanto mais carregado, maior o poder ao ser lançado. Pode ser elevado até um máximo de 3 níveis. Quanto maior o poder, mais MP é necessário para ativá-lo.",
  },
  {
    titleEn: "[★☆☆] Frizz/Frizzle/Kafrizz (Neutral Special)",
    titleJp: "メラ / メラミ / メラゾーマ 【通常必殺ワザ】",
    textJp: "炎の玉を放つ呪文。必殺ワザボタンでため始め、再度入力で放つ。ため中にシールドや回避、ジャンプを行うと、ための段階を保持したまま動くことができる。",
    titleJpEn: "Frizz / Frizzle / Kafrizz (Neutral Special)",
    textJpEn: "A spell that launches a fireball. Press the special-move button to start charging, and input it again to release it. If you shield, dodge, or jump while charging, you can move while keeping the charge level.",
    titlePt: "Frizz / Frizzle / Kafrizz (Especial Neutro)",
    textPt: "Um feitiço que lança uma bola de fogo. Pressione o botão de golpe especial para começar a carregar, e input novamente para soltar. Se você se defender, esquivar ou pular durante a carga, pode se mover mantendo o nível de carga.",
  },
  {
    titleEn: "[★☆☆] Zap/Zapple/Kazap (Side Special)",
    titleJp: "デイン / ライデイン / ギガデイン 【横必殺ワザ】",
    textJp: "必殺ワザボタンで剣に雷の呪文をため始め、ボタンを離すか最大までたまると、解き放つ。ため状態の保持はできない。",
    titleJpEn: "Zap / Zapple / Kazap (Side Special)",
    textJpEn: "Hold the special-move button to start charging the sword with a lightning spell, and it's released when you let go of the button or when it reaches max charge. The charge state can't be retained.",
    titlePt: "Zap / Zapple / Kazap (Especial Lateral)",
    textPt: "Segure o botão de golpe especial para começar a carregar a espada com um feitiço de raio, e ele é liberado quando você solta o botão ou quando atinge a carga máxima. O estado de carga não pode ser mantido.",
  },
  {
    titleEn: "[★☆☆] Kazap (Side Special)",
    titleJp: "ギガデイン 【横必殺ワザ】",
    textJp: "最大までためると、剣を突き上げて落雷を呼び、広範囲の回転斬りをくり出す。相手に当たると、雷の呪文で、前後にいる相手１人ずつをめがけて稲妻を落とす。",
    titleJpEn: "Kazap (Side Special)",
    textJpEn: "When fully charged, he thrusts his sword upward to call down lightning and unleashes a wide-range spinning slash. If it hits an opponent, the lightning spell drops a bolt targeting one opponent each in front and behind.",
    titlePt: "Kazap (Especial Lateral)",
    textPt: "Quando totalmente carregado, ele ergue a espada para invocar um raio e desfere um golpe giratório de longo alcance. Se acertar um oponente, o feitiço de raio derruba um raio mirando um oponente à frente e outro atrás.",
  },
  {
    titleEn: "[★☆☆] Woosh/Swoosh/Kaswoosh (Up Special)",
    titleJp: "バギ / バギマ / バギクロス 【上必殺ワザ】",
    textJp: "風の呪文をとなえて、周囲を切り裂く竜巻を足元に呼び、気流に巻かれて上昇する。ためるほど、より高くまで飛べる。MPが足りない時も、軽くホップする。",
    titleJpEn: "Woosh / Swoosh / Kaswoosh (Up Special)",
    textJpEn: "Casts a wind spell, summoning a slashing tornado at his feet, and rises up caught in the air current. The more it's charged, the higher he can fly. Even without enough MP, he'll still hop slightly.",
    titlePt: "Woosh / Swoosh / Kaswoosh (Especial Superior)",
    textPt: "Conjura um feitiço de vento, invocando um tornado cortante aos seus pés, e sobe levado pela corrente de ar. Quanto mais carregado, mais alto ele pode voar. Mesmo sem MP suficiente, ele ainda dá um pequeno salto.",
  },
  {
    titleEn: "[★☆☆] Swoosh and Kaswoosh Characteristics (Up Special)",
    titleJp: "バギマとバギクロスの特徴 【上必殺ワザ】",
    textJp: "バギマは左右に移動しやすく、バギクロスはより高くまで上昇しやすい。状況によって、うまく使い分けよう。",
    titleJpEn: "Swoosh and Kaswoosh Characteristics (Up Special)",
    textJpEn: "Swoosh makes it easier to move left and right, while Kaswoosh makes it easier to rise higher. Choose wisely depending on the situation.",
    titlePt: "Características de Swoosh e Kaswoosh (Especial Superior)",
    textPt: "Swoosh facilita o movimento para esquerda e direita, enquanto Kaswoosh facilita subir mais alto. Escolha bem dependendo da situação.",
  },
  {
    titleEn: "[★☆☆] Canceling Command Selection (Down Special)",
    titleJp: "コマンド選択のキャンセル 【下必殺ワザ】",
    textJp: "コマンドウィンドウは、ジャンプボタンかシールドボタンで閉じることができる。ただし、もう一度開けるようになるまで、少し時間がかかる。",
    titleJpEn: "Canceling Command Selection (Down Special)",
    textJpEn: "The command window can be closed with the jump button or the shield button. However, it takes a little time before it can be opened again.",
    titlePt: "Cancelando a Seleção de Comando (Especial Inferior)",
    textPt: "A janela de comando pode ser fechada com o botão de pulo ou o botão de escudo. Porém, leva um pouco de tempo até poder ser aberta novamente.",
  },
  {
    titleEn: "[★☆☆] Bang/Kaboom (Down Special)",
    titleJp: "イオ / イオナズン 【下必殺ワザ】",
    textJp: "光の呪文をとなえて、相手に当たるか時間経過で爆発する弾を放つ。イオナズンは、爆発前に相手を引き寄せ、イオより大きく強力な爆発を起こす。",
    titleJpEn: "Bang / Kaboom (Down Special)",
    textJpEn: "Casts a light spell, firing a bolt that explodes on hitting an opponent or after some time passes. Kaboom pulls the opponent in before exploding, causing a bigger and more powerful blast than Bang.",
    titlePt: "Bang / Kaboom (Especial Inferior)",
    textPt: "Conjura um feitiço de luz, disparando um projétil que explode ao acertar um oponente ou após um tempo. Kaboom puxa o oponente antes de explodir, causando uma explosão maior e mais poderosa que Bang.",
  },
  {
    titleEn: "[★☆☆] Sizz/Sizzle (Down Special)",
    titleJp: "ギラ / ベギラマ 【下必殺ワザ】",
    textJp: "高速で閃光を飛ばす、炎の呪文。閃光は、相手や地形に当たると、燃え上がる。ベギラマは、ギラよりも弾が大きくなり、威力も高い。",
    titleJpEn: "Sizz / Sizzle (Down Special)",
    textJpEn: "A fire spell that fires a fast flash of light. The flash bursts into flame upon hitting an opponent or the terrain. Sizzle's bolt is bigger than Sizz's, and it's more powerful.",
    titlePt: "Sizz / Sizzle (Especial Inferior)",
    textPt: "Um feitiço de fogo que dispara um clarão rápido. O clarão se transforma em chamas ao atingir um oponente ou o cenário. O projétil de Sizzle é maior que o de Sizz, e é mais poderoso.",
  },
  {
    titleEn: "[★☆☆] Whack/Thwack (Down Special)",
    titleJp: "ザキ / ザラキ 【下必殺ワザ】",
    textJp: "当たった相手を、たまに即撃墜する。自分や相手の蓄積ダメージが高いほど、撃墜確率が上がる。ザラキは、より広い範囲に効果がある。",
    titleJpEn: "Whack / Thwack (Down Special)",
    textJpEn: "Sometimes instantly KOs an opponent it hits. The higher the accumulated damage of either you or the opponent, the higher the chance of a KO. Thwack has an effect over a wider range.",
    titlePt: "Whack / Thwack (Especial Inferior)",
    textPt: "Às vezes nocauteia instantaneamente um oponente que atinge. Quanto maior o dano acumulado, seu ou do oponente, maior a chance de nocaute. Thwack tem efeito numa área mais ampla.",
  },
  {
    titleEn: "[★☆☆] Kamikazee (Down Special)",
    titleJp: "メガンテ 【下必殺ワザ】",
    textJp: "自爆して、周囲の相手に大ダメージを与える。自分はミスとなる。このミスは、１対１の対戦では、相手の得点になる。",
    titleJpEn: "Kamikazee (Down Special)",
    textJpEn: "Self-destructs, dealing heavy damage to nearby opponents. He himself gets KO'd. In a 1-on-1 match, this KO counts as a point for the opponent.",
    titlePt: "Kamikazee (Especial Inferior)",
    textPt: "Autodestrói-se, causando grande dano a oponentes próximos. Ele mesmo é nocauteado. Numa partida 1 contra 1, esse nocaute conta como ponto para o oponente.",
  },
  {
    titleEn: "[★☆☆] Magic Burst (Down Special)",
    titleJp: "マダンテ 【下必殺ワザ】",
    textJp: "すべてのMPを消費して、自分を中心にした大爆発を起こす。消費したMPが多いほど、爆発の範囲や威力が大きくなる。",
    titleJpEn: "Magic Burst (Down Special)",
    textJpEn: "Consumes all MP to cause a huge explosion centered on himself. The more MP consumed, the bigger the explosion's range and power.",
    titlePt: "Magic Burst (Especial Inferior)",
    textPt: "Consome todo o MP para causar uma grande explosão centrada nele mesmo. Quanto mais MP consumido, maior o alcance e poder da explosão.",
  },
  {
    titleEn: "[★☆☆] Snooze (Down Special)",
    titleJp: "ラリホー 【下必殺ワザ】",
    textJp: "相手を眠らせる弾を放つ。弾が飛ぶうちに、眠らせる範囲が徐々に広がるが、早めに当てるほど相手は深く眠る。",
    titleJpEn: "Snooze (Down Special)",
    textJpEn: "Fires a bolt that puts opponents to sleep. As the bolt travels, the area it can put to sleep gradually widens, but the sooner it hits, the deeper the opponent sleeps.",
    titlePt: "Snooze (Especial Inferior)",
    textPt: "Dispara um projétil que faz os oponentes dormirem. Enquanto o projétil viaja, a área que ele pode adormecer se expande gradualmente, mas quanto mais cedo acertar, mais profundo o oponente dorme.",
  },
  {
    titleEn: "[★☆☆] Heal (Down Special)",
    titleJp: "ホイミ 【下必殺ワザ】",
    textJp: "自分の蓄積ダメージを回復する。何回か使うと、一度ミスになるまで、選べるコマンドに出てこなくなる。",
    titleJpEn: "Heal (Down Special)",
    textJpEn: "Recovers his own accumulated damage. After using it a few times, it stops appearing as a selectable command until he's KO'd once.",
    titlePt: "Heal (Especial Inferior)",
    textPt: "Recupera seu próprio dano acumulado. Depois de usado algumas vezes, deixa de aparecer como comando selecionável até ele ser nocauteado uma vez.",
  },
  {
    titleEn: "[★☆☆] Oomph (Down Special)",
    titleJp: "バイキルト 【下必殺ワザ】",
    textJp: "しばらくの間、自分が出す直接攻撃の攻撃力とふっとばし力をアップさせる。代わりに、防御力が少しだけダウンする。",
    titleJpEn: "Oomph (Down Special)",
    textJpEn: "For a while, increases the power and launch power of his direct attacks. In exchange, his defense decreases slightly.",
    titlePt: "Oomph (Especial Inferior)",
    textPt: "Por um tempo, aumenta o poder e a força de lançamento de seus ataques diretos. Em troca, sua defesa diminui um pouco.",
  },
  {
    titleEn: "[★☆☆] Acceleratle (Down Special)",
    titleJp: "ピオリム 【下必殺ワザ】",
    textJp: "しばらくの間、自分の移動速度とジャンプ力をアップさせるが、少しだけ、ふっとばされやすくなる。",
    titleJpEn: "Acceleratle (Down Special)",
    textJpEn: "For a while, increases his movement speed and jump power, but he becomes slightly easier to launch.",
    titlePt: "Acceleratle (Especial Inferior)",
    textPt: "Por um tempo, aumenta sua velocidade de movimento e poder de pulo, mas ele fica um pouco mais fácil de ser lançado.",
  },
  {
    titleEn: "[★☆☆] Bounce (Down Special)",
    titleJp: "マホカンタ 【下必殺ワザ】",
    textJp: "しばらくの間、相手の飛び道具を反射するようになる。跳ね返したものは、受けた時より、少しだけ攻撃力が上がる。",
    titleJpEn: "Bounce (Down Special)",
    textJpEn: "For a while, reflects opponents' projectiles. Reflected projectiles have their power increased slightly compared to when they were received.",
    titlePt: "Bounce (Especial Inferior)",
    textPt: "Por um tempo, reflete os projéteis do oponente. Projéteis refletidos têm seu poder levemente aumentado em relação a quando foram recebidos.",
  },
  {
    titleEn: "[★☆☆] Kaclang (Down Special)",
    titleJp: "アストロン 【下必殺ワザ】",
    textJp: "しばらくの間、自分を鋼鉄化して、あらゆる攻撃を防ぐ。ただし、効果が切れるまで動けず、自分で解除することもできない。",
    titleJpEn: "Kaclang (Down Special)",
    textJpEn: "For a while, turns himself into metal, blocking all attacks. However, he can't move until the effect ends, and he can't cancel it himself.",
    titlePt: "Kaclang (Especial Inferior)",
    textPt: "Por um tempo, se transforma em metal, bloqueando todos os ataques. Porém, ele não pode se mover até o efeito acabar, e não pode cancelá-lo sozinho.",
  },
  {
    titleEn: "[★☆☆] Zoom (Down Special)",
    titleJp: "ルーラ 【下必殺ワザ】",
    textJp: "真上に大きく上昇してから、足場へと安全に戻ることができる。上昇中は相手の攻撃を受けないが、頭上に地形があると、頭をぶつけて落下する。",
    titleJpEn: "Zoom (Down Special)",
    textJpEn: "Rises a great distance straight up before safely returning to solid ground. He can't be hit by opponents while rising, but if there's terrain overhead, he'll hit his head and fall.",
    titlePt: "Zoom (Especial Inferior)",
    textPt: "Sobe uma grande distância bem para cima antes de retornar com segurança ao chão firme. Ele não pode ser atingido por oponentes durante a subida, mas se houver cenário acima, ele bate a cabeça e cai.",
  },
  {
    titleEn: "[★☆☆] Hocus Pocus (Down Special)",
    titleJp: "パルプンテ 【下必殺ワザ】",
    textJp: "何が起こるか分からない、運任せのワザ。他のコマンドが発動することもあれば、自分の状態や大きさが変わることもある。",
    titleJpEn: "Hocus Pocus (Down Special)",
    textJpEn: "A move that leaves everything up to chance — you never know what will happen. Sometimes it triggers another command, and sometimes it changes his own status or size.",
    titlePt: "Hocus Pocus (Especial Inferior)",
    textPt: "Um golpe que deixa tudo ao acaso — você nunca sabe o que vai acontecer. Às vezes aciona outro comando, e às vezes muda seu próprio estado ou tamanho.",
  },
  {
    titleEn: "[★☆☆] Flame Slash / Kacrackle Slash (Down Special)",
    titleJp: "かえん斬り / マヒャド斬り 【下必殺ワザ】",
    textJp: "かえん斬りは炎、マヒャド斬りは氷をまとった剣で、斬りつける。マヒャド斬りが当たると、少しの間、相手を凍らせる。",
    titleJpEn: "Flame Slash / Kacrackle Slash (Down Special)",
    textJpEn: "Slashes with a sword wreathed in flame for Flame Slash, or in ice for Kacrackle Slash. If Kacrackle Slash connects, it freezes the opponent for a short while.",
    titlePt: "Flame Slash / Kacrackle Slash (Especial Inferior)",
    textPt: "Corta com uma espada envolta em chamas no Flame Slash, ou em gelo no Kacrackle Slash. Se o Kacrackle Slash acertar, congela o oponente por um curto período.",
  },
  {
    titleEn: "[★☆☆] Hatchet Man (Down Special)",
    titleJp: "まじん斬り 【下必殺ワザ】",
    textJp: "渾身の力で、相手を斬りつける。攻撃までに少し時間がかかるが、相手に当たると必ず「かいしんのいちげき」になり、大ダメージを与える。",
    titleJpEn: "Hatchet Man (Down Special)",
    textJpEn: "Slashes the opponent with all his might. It takes a bit of time before the attack lands, but if it hits, it always becomes a \"Critical Hit,\" dealing massive damage.",
    titlePt: "Hatchet Man (Especial Inferior)",
    textPt: "Corta o oponente com toda a força. Leva um tempo até o ataque acertar, mas se acertar, sempre se torna um \"Acerto Crítico\", causando dano massivo.",
  },
  {
    titleEn: "[★☆☆] Metal Slash (Down Special)",
    titleJp: "メタル斬り 【下必殺ワザ】",
    textJp: "メタル化、またはアストロンで鋼鉄化している相手に当てると、一撃で倒せる。ただし、他の相手には、１しかダメージを与えられない。",
    titleJpEn: "Metal Slash (Down Special)",
    textJpEn: "If it hits an opponent who is metallized or turned to steel by Kaclang, it can defeat them in one hit. However, against any other opponent, it only deals 1 point of damage.",
    titlePt: "Metal Slash (Especial Inferior)",
    textPt: "Se acertar um oponente metalizado ou transformado em aço pelo Kaclang, pode derrotá-lo com um golpe só. Porém, contra qualquer outro oponente, causa apenas 1 ponto de dano.",
  },
  {
    titleEn: "[★☆☆] Psyche Up (Down Special)",
    titleJp: "ためる 【下必殺ワザ】",
    textJp: "力をためて、次に出す直接攻撃を、１回だけ強化する。相手に攻撃を当てると効果が切れるが、からぶりした時は切れない。",
    titleJpEn: "Psyche Up (Down Special)",
    textJpEn: "Builds up power to strengthen his next direct attack, just once. The effect ends once he lands a hit on the opponent, but it doesn't end if the attack whiffs.",
    titlePt: "Psyche Up (Especial Inferior)",
    textPt: "Acumula poder para fortalecer seu próximo ataque direto, só uma vez. O efeito acaba assim que ele acerta o oponente, mas não acaba se o ataque errar.",
  },
  {
    titleEn: "[★☆☆] Gigaslash (Final Smash)",
    titleJp: "ギガスラッシュ 【最後の切りふだ】",
    textJp: "広範囲を斬りつけ、相手に当たると、歴代の主人公たちを召喚。歴代主人公の力を剣に宿し、必殺の一撃を放つ。",
    titleJpEn: "Gigaslash (Final Smash)",
    textJpEn: "Slashes a wide area, and if it hits an opponent, summons the protagonists of past generations. He channels their power into his sword and unleashes a decisive finishing blow.",
    titlePt: "Gigaslash (Ataque Final)",
    textPt: "Corta uma área ampla e, se acertar um oponente, invoca os protagonistas de gerações passadas. Ele canaliza o poder deles em sua espada e desfere um golpe final decisivo.",
  },
  {
    titleEn: "[★☆☆] Side Tilt Attack",
    titleJp: "横強攻撃",
    textJp: "攻撃ボタンの追加で、２段目の攻撃を出せる。初段は盾でなぎ払い、相手の攻撃に打ち勝つことができる。",
    titleJpEn: "Side Tilt Attack",
    textJpEn: "Pressing the attack button again unleashes a second hit. The first hit sweeps with the shield, letting it overpower an opponent's attack.",
    titlePt: "Ataque Inclinado Lateral",
    textPt: "Pressionar o botão de ataque novamente desfere um segundo acerto. O primeiro acerto varre com o escudo, permitindo sobrepujar o ataque do oponente.",
  },
  {
    titleEn: "[★☆☆] Down Air Attack",
    titleJp: "下空中攻撃",
    textJp: "剣で下方を刺突する。ワザのはじめに、メテオ効果がある。",
    titleJpEn: "Down Air Attack",
    textJpEn: "Thrusts the sword downward. The move has a meteor effect at its start.",
    titlePt: "Ataque Aéreo Inferior",
    textPt: "Desfere uma estocada de espada para baixo. O golpe tem efeito meteoro no início.",
  },
  {
    titleEn: "[★☆☆] MP",
    titleJp: "MP",
    textJp: "必殺ワザを使う時、MPが足りないと、からぶりしてスキができてしまう。MPは、時間経過や、相手への攻撃で回復する。",
    titleJpEn: "MP",
    textJpEn: "If you try to use a special move without enough MP, it will whiff and leave you open. MP recovers over time and by attacking opponents.",
    titlePt: "MP",
    textPt: "Se você tentar usar um golpe especial sem MP suficiente, ele erra e deixa você vulnerável. O MP se recupera com o tempo e ao atacar oponentes.",
  },
  {
    titleEn: "[★☆☆] Critical Hit",
    titleJp: "かいしんのいちげき",
    textJp: "スマッシュ攻撃は、１／８の確率で「かいしんのいちげき」になる。相手にヒットすると、大ダメージ！",
    titleJpEn: "Critical Hit",
    textJpEn: "Smash attacks have a 1/8 chance of becoming a \"Critical Hit.\" If it hits an opponent, it deals massive damage!",
    titlePt: "Acerto Crítico",
    textPt: "Os ataques smash têm 1/8 de chance de se tornarem um \"Acerto Crítico\". Se acertar o oponente, causa dano massivo!",
  },
];

async function main() {
  const hero = await db.fighter.findFirst({
    where: { name: "Hero" },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!hero) { console.log("Hero not found"); return; }

  await db.fighter.update({
    where: { id: hero.id },
    data: {
      curatorOverviewEn: "Hero runs on a resource system unlike anyone else in the game: every special move costs MP, which only regenerates over time or by dealing damage, so using it carelessly leaves him unable to act on his best options. Frizz, Zap, and Woosh can all be charged up to three levels for more power (and a steeper MP cost), and the charge itself can be banked mid-charge by shielding, dodging, or jumping without losing it — except for Zap, which has to be released or maxed out immediately. But the real signature is Down Special: instead of one fixed move, it opens a command menu that randomly offers up to a handful of roughly twenty different spells each time — direct-damage bolts, a sleep projectile, full heal, temporary buffs to power or speed, a projectile reflect, a metal transformation that can't be canceled early, a recovery teleport, an outright coin-flip effect, sword-infusion slashes, a guaranteed critical hit that's slow to come out, an instant-KO chance that scales with both fighters' damage, and even a self-destruct that hands the opponent the KO in 1v1. Because the options are random, Hero's Down Special play is as much about accepting what the game hands you as it is about a fixed game plan — and on top of all of that, every smash attack still carries the same 1-in-8 shot at a critical hit that any of his sword swings do.",
      curatorOverviewPt: "Hero funciona com um sistema de recursos diferente de qualquer outro personagem do jogo: todo golpe especial custa MP, que só se regenera com o tempo ou causando dano, então usá-lo sem cuidado deixa ele incapaz de agir com suas melhores opções. Frizz, Zap e Woosh podem ser carregados até três níveis pra mais poder (e um custo de MP maior), e a própria carga pode ser guardada no meio do processo se ele se defender, esquivar ou pular sem perdê-la — exceto Zap, que precisa ser solto ou chegar ao máximo imediatamente. Mas a verdadeira marca registrada é o Especial Inferior: em vez de um golpe fixo, ele abre um menu de comando que oferece aleatoriamente um punhado entre cerca de vinte feitiços diferentes a cada vez — projéteis de dano direto, um projétil de sono, cura completa, buffs temporários de poder ou velocidade, um reflexo de projétil, uma transformação em metal que não pode ser cancelada cedo, um teletransporte de recuperação, um efeito de puro cara-ou-coroa, golpes de espada com elemento, um acerto crítico garantido mas lento de sair, uma chance de nocaute instantâneo que escala com o dano dos dois lutadores, e até uma autodestruição que entrega o nocaute ao oponente em partidas 1 contra 1. Como as opções são aleatórias, jogar com o Especial Inferior de Hero é tanto sobre aceitar o que o jogo te dá quanto sobre um plano de jogo fixo — e além de tudo isso, todo ataque smash ainda carrega a mesma chance de 1 em 8 de virar um acerto crítico que qualquer um dos golpes de espada dele tem.",
      curatorOverviewJp: "勇者は、このゲームの他の誰とも違う資源システムで動いている。すべての必殺ワザはMPを消費し、時間経過か相手への攻撃でしか回復しないため、無計画に使うと一番良い選択肢が使えなくなってしまう。「メラ」「デイン」「バギ」は最大３段階までためて威力を上げられる（その分MP消費も増える）が、ため自体はシールド・回避・ジャンプでキャンセルしても保持できる——ただし「デイン」だけは、ボタンを離すか最大までたまったら即座に解き放たれる。しかし本当の特徴は下必殺ワザだ。固定の技一つではなく、毎回約２０種類の呪文からいくつかをランダムに提示するコマンドメニューが開く——直接ダメージを与える弾、眠らせる弾、完全回復、攻撃力や速度の一時的な強化、飛び道具の反射、途中でキャンセルできない鋼鉄化、復帰用のテレポート、まさに運任せの効果、属性をまとった斬撃、発動は遅いが必ず「かいしんのいちげき」になる一撃、両者の蓄積ダメージに応じて確率が上がる即撃墜、そして１対１では相手に撃墜ポイントを与えてしまう自爆まである。選択肢がランダムであるため、勇者の下必殺ワザの立ち回りは、固定の戦術というよりも、ゲームが差し出すものを受け入れることに近い——そのうえ、彼の剣による攻撃と同様、スマッシュ攻撃にも１／８の確率で「かいしんのいちげき」が発生する。",
      curatorOverviewJpEn: "Hero operates on a resource system unlike anyone else in this game. Every special move consumes MP, which only recovers over time or by attacking the opponent, so using it carelessly leaves him unable to use his best options. \"Frizz,\" \"Zap,\" and \"Woosh\" can all be charged up to three levels for more power (costing more MP accordingly), and the charge itself can be retained even if canceled with a shield, dodge, or jump — except for \"Zap,\" which is released the instant you let go of the button or it reaches maximum charge. But the true signature move is Down Special. Instead of one fixed move, it opens a command menu that randomly offers a handful of choices from roughly twenty different spells each time — bolts that deal direct damage, a sleep projectile, a full heal, temporary boosts to power or speed, a projectile reflect, a metal transformation that can't be canceled partway through, a recovery teleport, an effect that's pure chance, elemental sword slashes, a hit that's slow to land but is always a guaranteed \"Critical Hit,\" an instant-KO chance whose odds rise with both fighters' accumulated damage, and even a self-destruct that hands the KO point to the opponent in a 1-on-1 match. Because the options are random, Hero's Down Special play is less about a fixed strategy and more about accepting whatever the game offers — and on top of all that, just like his sword attacks, his smash attacks also carry a 1-in-8 chance of a \"Critical Hit.\"",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = hero.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: hero.id }, data: { curationStatus: "approved" } });
  console.log("✅ Hero aprovado");

  // Sem FighterMove (0 registros) — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista os jogos Dragon Quest corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.

  await db.$disconnect();
}
main().catch(console.error);
