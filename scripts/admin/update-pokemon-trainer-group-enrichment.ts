import { db } from "../../lib/db";

// ===================== CURATOR OVERVIEWS =====================
const CURATOR: Record<string, { en: string; pt: string; jp: string; jpEn: string }> = {
  "Pokémon Trainer": {
    en: "Pokémon Trainer commands a rotating team of three — Squirtle, Ivysaur, and Charizard — each with a wildly different playstyle, swapped freely via Pokémon Change. Squirtle offers speed and a spinning shell rush, Ivysaur controls space with seeds and vines, and Charizard brings raw power and aerial pressure. Mastering the trio means reading the matchup and switching before your current Pokémon runs out of answers — a fighter who rewards adaptability over commitment to one game plan.",
    pt: "O Treinador Pokémon comanda uma equipe rotativa de três — Squirtle, Ivysaur e Charizard — cada um com um estilo de jogo radicalmente diferente, trocados livremente via Pokémon Change. Squirtle oferece velocidade e uma investida giratória de carapaça, Ivysaur controla o espaço com sementes e vinhas, e Charizard traz poder bruto e pressão aérea. Dominar o trio significa ler o confronto e trocar antes que seu Pokémon atual fique sem respostas — um lutador que recompensa adaptabilidade em vez de compromisso com um único plano de jogo.",
    jp: "ポケモントレーナーは、性格の大きく異なる３匹――ゼニガメ、フシギソウ、リザードン――から成るローテーションチームを指揮し、ポケモンチェンジで自由に入れ替える。ゼニガメはスピードと回転する甲羅突進を、フシギソウはタネとツルで空間を制圧し、リザードンは生の火力と空中制圧を持ち込む。この３匹を使いこなす鍵は、対面を読み、今のポケモンが手詰まりになる前に切り替えることにある――一つの戦略に固執するのではなく、適応力を発揮するプレイヤーに応えるファイターだ。",
    jpEn: "Pokémon Trainer commands a rotating team of three vastly different Pokémon — Squirtle, Ivysaur, and Charizard — freely swapped via Pokémon Change. Squirtle brings speed and a spinning shell charge, Ivysaur controls space with seeds and vines, and Charizard brings raw firepower and aerial dominance. The key to mastering these three lies in reading the matchup and switching before the current Pokémon runs out of answers — a fighter who rewards adaptability rather than commitment to a single strategy.",
  },
  Squirtle: {
    en: "Squirtle is the speed demon of the Pokémon Trainer trio — small, fast, and evasive, with Withdraw letting it spin-dash into opponents damage-free and Water Gun disrupting recoveries from range. Its low weight makes it easy to launch, but its mobility and combo potential punish anyone who lets their guard down.",
    pt: "Squirtle é o demônio da velocidade do trio do Treinador Pokémon — pequeno, rápido e evasivo, com Withdraw permitindo avançar girando contra adversários sem sofrer dano e Water Gun atrapalhando recuperações à distância. Seu peso baixo o torna fácil de arremessar, mas sua mobilidade e potencial de combo punem quem baixa a guarda.",
    jp: "ゼニガメは、ポケモントレーナー三匹の中のスピード担当――小柄で素早く回避に長け、からにこもるで無傷のまま相手に突進でき、みずでっぽうは遠距離から復帰を妨害する。体重が軽いためふっとばされやすいが、その機動力とコンボ性能は油断した相手を罰する。",
    jpEn: "Squirtle is the speed demon of the Pokémon Trainer trio — small, fast, and evasive, with Withdraw letting it spin-charge into opponents without taking damage, and Water Gun disrupting recoveries from a distance. Its light weight makes it easy to launch, but its mobility and combo potential punish anyone who lets their guard down.",
  },
  Ivysaur: {
    en: "Ivysaur controls neutral like no other Pokémon on the team — Bullet Seed peppers opponents at range, Razor Leaf arcs unpredictably, and Vine Whip offers exceptional multi-use recovery with edge-grab potential. It's fragile and its Up Smash is slow to come out, but its zoning tools make it a nightmare to approach carelessly.",
    pt: "Ivysaur controla o neutro como nenhum outro Pokémon da equipe — Bullet Seed crivam os adversários à distância, Razor Leaf voa em arcos imprevisíveis, e Vine Whip oferece uma recuperação excepcional de múltiplos usos com potencial de agarrar bordas. É frágil e seu Ataque Smash Cima sai devagar, mas suas ferramentas de controle de espaço o tornam um pesadelo para se aproximar descuidadamente.",
    jp: "フシギソウは、チームの中で誰よりも中距離戦を支配する――タネマシンガンは遠距離から相手を撃ち抜き、はっぱカッターは予測不能な軌道を描き、つるのムチはガケつかまりの可能性を持つ多用途な優れた復帰を提供する。脆く、上スマッシュ攻撃の発生も遅いが、その空間制圧の道具は不用意に近づく相手にとって悪夢となる。",
    jpEn: "Ivysaur controls the mid-range game like no other Pokémon on the team — Bullet Seed peppers opponents from a distance, Razor Leaf traces an unpredictable arc, and Vine Whip offers an excellent multi-use recovery with ledge-grab potential. It's fragile and its Up Smash is slow to come out, but its space-control tools make it a nightmare for anyone approaching carelessly.",
  },
  Charizard: {
    en: "Charizard is the heavyweight of the trio, trading Squirtle's speed and Ivysaur's zoning for raw power and aerial dominance — Flare Blitz obliterates anyone caught in its path (at a cost to Charizard itself), Fly grants strong vertical recovery, and Flamethrower zones with sustained pressure. Big, tough, and hard-hitting, it rewards players willing to commit to close-range aggression.",
    pt: "Charizard é o peso-pesado do trio, trocando a velocidade do Squirtle e o controle de espaço do Ivysaur por poder bruto e domínio aéreo — Flare Blitz obliteram quem for pego em seu caminho (a um custo para o próprio Charizard), Fly concede uma forte recuperação vertical, e Flamethrower controla espaço com pressão sustentada. Grande, resistente e com golpes fortes, ele recompensa jogadores dispostos a se comprometer com agressão de curto alcance.",
    jp: "リザードンはトリオの中の重量級で、ゼニガメの速さやフシギソウの空間制圧の代わりに、生の火力と空中制圧を持ち込む――フレアドライブはその軌道上の相手を粉砕する（自らも代償を払うが）、そらをとぶは強力な縦の復帰を与え、かえんほうしゃは持続的な圧力で空間を制する。大きく、頑丈で、一撃が重い彼は、近距離での積極的な攻めに徹するプレイヤーに応える。",
    jpEn: "Charizard is the heavyweight of the trio, trading Squirtle's speed and Ivysaur's space control for raw firepower and aerial dominance — Flare Blitz obliterates anyone caught in its path (at a cost to Charizard itself), Fly grants strong vertical recovery, and Flamethrower controls space with sustained pressure. Big, tough, and hard-hitting, it rewards players committed to close-range aggression.",
  },
};

// ===================== BIOS PT+JpEn =====================
const BIOS: Record<string, Record<string, { pt: string; jpEn: string }>> = {
  "Pokémon Trainer": {
    SSB4: {
      jpEn: "Misty, Brock, Cynthia, Iris, and Ash. What do they have in common? That's right—they're all Pokémon Trainers! The one introduced here, who suits his red cap so well, is also a Pokémon Trainer who was active in Smash Bros. Brawl. Competitive, a lover of Pokémon, and caring toward friends... maybe that's one more thing they all have in common. And maybe, just maybe, something you share with them too.",
      pt: "Misty, Brock, Cynthia, Iris e Ash. O que eles têm em comum? Isso mesmo — todos são Treinadores Pokémon! Aquele apresentado aqui, que combina tão bem com seu boné vermelho, também é um Treinador Pokémon que se destacou em Smash Bros. Brawl. Competitivo, apaixonado por Pokémon e atencioso com os amigos... talvez essa seja mais uma coisa que todos têm em comum. E talvez, só talvez, algo que você também compartilhe com eles.",
    },
    SSBB: {
      jpEn: "People who raise Pokémon as partners and battle with them. In battle, a trainer gives orders to their Pokémon and uses items. It's no exaggeration to say a single strategic decision by the trainer can decide victory or defeat. Pouring their love into their Pokémon, sharing anger, sadness, and joy together, they continue their journey of adventure in pursuit of becoming the strongest Pokémon Trainer.",
      pt: "Pessoas que criam Pokémon como parceiros e lutam com eles. Em batalha, um treinador dá ordens ao seu Pokémon e usa itens. Não é exagero dizer que uma única decisão estratégica do treinador pode decidir vitória ou derrota. Derramando seu amor em seus Pokémon, compartilhando raiva, tristeza e alegria juntos, eles continuam sua jornada de aventura em busca de se tornarem o Treinador Pokémon mais forte.",
    },
    SSBU: {
      jpEn: "\"Pokémon Trainer\" is a general term for the people who appear in the \"Pokémon\" series, referring mainly to those who catch, raise, and battle with Pokémon. Here, we explain both the protagonist of the \"Pokémon\" games and the Pokémon Trainer who joins the fight as a fighter in \"Smash Bros.\"",
      pt: "\"Treinador Pokémon\" é um termo geral para as pessoas que aparecem na série \"Pokémon,\" referindo-se principalmente àqueles que capturam, criam e batalham com Pokémon. Aqui, explicamos tanto o protagonista dos jogos \"Pokémon\" quanto o Treinador Pokémon que participa da luta como lutador em \"Smash Bros.\"",
    },
  },
  Squirtle: {
    SSB4: {
      jpEn: "Many Pokémon Trainers receive a Pokémon from Professor Oak before setting off on their journey. Squirtle is one of the three beginner-friendly choices. Its name might sound like it could bring good fortune, but that's not the reason for its popularity—it's really about its adorableness. When it senses danger, it pulls its limbs into its shell. Then, it shoots a burst of water from its mouth.",
      pt: "Muitos Treinadores Pokémon recebem um Pokémon do Professor Carvalho antes de partir em sua jornada. Squirtle é uma das três escolhas amigáveis para iniciantes. Seu nome pode até soar como algo que traz sorte, mas não é esse o motivo de sua popularidade — é realmente sua fofura. Quando sente perigo, ele recolhe os membros para dentro da carapaça. Depois, dispara um jato de água pela boca.",
    },
    SSBB: {
      jpEn: "A Tiny Turtle Pokémon. When danger approaches, it pulls its limbs into its shell to protect itself from enemy attacks. When it also hides its neck, it forcefully sprays water from its mouth. Its shell not only protects it, but also reduces water resistance while swimming. It evolves into Wartortle upon leveling up.",
      pt: "Um Pokémon Tartaruguinha. Quando o perigo se aproxima, ele recolhe os membros para dentro da carapaça para se proteger de ataques inimigos. Quando também esconde o pescoço, ele lança água com força pela boca. Sua carapaça não só o protege, mas também reduz a resistência da água enquanto nada. Ele evolui para Wartortle ao subir de nível.",
    },
    SSBM: {
      jpEn: "A Tiny Turtle Pokémon. When things get dangerous, it protects itself by pulling its limbs into its shell while shooting water from its mouth. One of the three Pokémon given by Professor Oak in Pokémon \"Red,\" \"Green,\" and \"Blue.\" It evolves into \"Wartortle.\"\nPokémon Red & Blue (9/98)",
      pt: "Um Pokémon Tartaruguinha. Quando as coisas ficam perigosas, ele se protege recolhendo os membros para dentro da carapaça enquanto dispara água pela boca. Um dos três Pokémon entregues pelo Professor Carvalho em Pokémon \"Red,\" \"Green\" e \"Blue.\" Ele evolui para \"Wartortle.\"\nPokémon Red & Blue (9/98)",
    },
  },
  Ivysaur: {
    SSB4: {
      jpEn: "The first time many witnessed a Pokémon evolve was the moment Bulbasaur turned into Ivysaur... Those former boys and girls never forget that scene. The excitement and bewilderment of Bulbasaur's farewell and Ivysaur's arrival coming at once. That Ivysaur, too, will eventually face its own moment of evolution, carrying within it a future where its bud will bloom into flower.",
      pt: "A primeira vez que muitos testemunharam um Pokémon evoluir foi o momento em que o Bulbasaur se transformou em Ivysaur... Aqueles antigos garotos e garotas nunca esquecem aquela cena. A empolgação e a perplexidade da despedida do Bulbasaur e da chegada do Ivysaur acontecendo ao mesmo tempo. Esse Ivysaur também, eventualmente, enfrentará seu próprio momento de evolução, carregando em si um futuro em que seu broto desabrochará em flor.",
    },
    SSBB: {
      jpEn: "A Seed Pokémon. The evolved form of Bulbasaur. It has a bud on its back, and its legs and hips grow stronger to support it. Once the bud grows large enough, it's said the Pokémon can no longer stand on two legs alone. Upon leveling up, it evolves into Venusaur. At that point, the large bud on its back absorbs nutrients and blooms into a magnificent, large flower.",
      pt: "Um Pokémon Semente. A forma evoluída do Bulbasaur. Ele tem um broto nas costas, e suas pernas e quadril ficam mais fortes para sustentá-lo. Quando o broto cresce o suficiente, diz-se que o Pokémon não consegue mais ficar em pé apenas com duas pernas. Ao subir de nível, ele evolui para Venusaur. Nesse momento, o grande broto em suas costas absorve nutrientes e desabrocha em uma magnífica flor grande.",
    },
  },
  Charizard: {
    SSB4: {
      jpEn: "A Fire/Flying-type Flame Pokémon. It breathes scorching flames from its mouth hot enough to melt anything. It flies through the sky seeking strong opponents, but never breathes fire on anyone weaker than itself. In Smash Bros., its appeal lies in destructive moves delivered from its large body. The special move \"Flare Blitz,\" where it wraps itself in flame and charges, has extremely high power, but it also takes damage itself.",
      pt: "Um Pokémon Chama do tipo Fogo/Voador. Ele sopra chamas escaldantes pela boca, quentes o suficiente para derreter qualquer coisa. Ele voa pelo céu em busca de adversários fortes, mas nunca sopra fogo em alguém mais fraco do que ele. Em Smash Bros., seu apelo está em golpes destrutivos entregues por seu grande corpo. O golpe especial \"Flare Blitz,\" no qual ele se envolve em chamas e avança, tem poder extremamente alto, mas também causa dano nele mesmo.",
    },
    SSBB: {
      jpEn: "A Flame Pokémon. It breathes scorching flames hot enough to burn even rocks to ash, and can fly as high as 1,400 meters above the ground. It has a proud heart and never breathes fire at anyone weaker than itself. It flies through the sky seeking opponents stronger than itself. Its signature move, \"Flamethrower,\" is a reliable technique.",
      pt: "Um Pokémon Chama. Ele sopra chamas escaldantes quentes o suficiente para queimar até rochas até virarem cinzas, e pode voar a até 1.400 metros de altura. Ele tem um coração orgulhoso e nunca sopra fogo em alguém mais fraco do que ele. Ele voa pelo céu em busca de adversários mais fortes do que ele. Seu golpe característico, \"Flamethrower,\" é uma técnica confiável.",
    },
    SSBM: {
      jpEn: "A Flame Pokémon. The evolved form of Charmeleon. It can fly up to 1,400 meters above the ground using its wings. It breathes scorching flames from its mouth hot enough to melt almost anything. The flame on its tail serves as a barometer of its vitality. It's a representative Pokémon of the Fire type.\nPokémon Red & Blue (9/98)",
      pt: "Um Pokémon Chama. A forma evoluída do Charmeleon. Ele pode voar a até 1.400 metros de altura usando as asas. Ele sopra chamas escaldantes pela boca, quentes o suficiente para derreter quase tudo. A chama em sua cauda serve como um indicador de sua vitalidade. É um Pokémon representativo do tipo Fogo.\nPokémon Red & Blue (9/98)",
    },
  },
};

// Ivysaur SSB4 bio JP text was missing entirely — from smashwiki.info screenshot
const IVYSAUR_SSB4_JP = "ポケモンが進化するのは初めて目撃したのは、フシギダネがフシギソウに変わったとき……。かつての少年少女は、あのシーンを忘れない。フシギダネとの別れと、フシギソウとの出会い。それらが同時にやって来たことの興奮と戸惑い。そのフシギソウもやがては進化の時を迎え、ツボミが花開く未来を背負っていたことを知る。";

// ===================== TIPS (32, all attached to Pokémon Trainer, index-matched due to duplicate titles) =====================
const TIPS = [
  // Trainer (0-3)
  { titleJp: "ポケモントレーナー", textJp: "「ゼニガメ」「フシギソウ」「リザードン」が戦っている間、後ろで指示を出している。カラーバリエーションを変えると、女の子のポケモントレーナーを選べる。", titleJpEn: "Pokémon Trainer", textJpEn: "While Squirtle, Ivysaur, and Charizard fight, he gives orders from behind. Changing the color variation lets you select a girl Pokémon Trainer.", titlePt: "Treinador Pokémon", textPt: "Enquanto Squirtle, Ivysaur e Charizard lutam, ele dá ordens por trás. Mudar a variação de cor permite selecionar uma treinadora Pokémon." },
  { titleJp: "ポケモントレーナー ： しぐさ", textJp: "アピールした時や、ポケモンがダメージを与えたり受けたりした時に、いろいろなしぐさをする。男の子と、女の子トレーナーで変わる。", titleJpEn: "Pokémon Trainer: Mannerisms", textJpEn: "He makes various gestures during taunts or when his Pokémon deals or takes damage. These differ between the boy and girl trainers.", titlePt: "Treinador Pokémon: Maneirismos", textPt: "Ele faz vários gestos durante provocações ou quando seu Pokémon causa ou recebe dano. Isso muda entre os treinadores menino e menina." },
  { titleJp: "ポケモントレーナー ： ポケモンチェンジ 【下必殺ワザ】", textJp: "ゼニガメ → フシギソウ → リザードンの順に、入れ替えが可能。何度でも入れ替え可能なので、好きなポケモンを使おう。", titleJpEn: "Pokémon Trainer: Pokémon Change (Down Special)", textJpEn: "Swaps in the order Squirtle → Ivysaur → Charizard. Since swapping can be done any number of times, use whichever Pokémon you like.", titlePt: "Treinador Pokémon: Pokémon Change (Especial Baixo)", textPt: "Troca na ordem Squirtle → Ivysaur → Charizard. Como a troca pode ser feita quantas vezes forem necessárias, use o Pokémon que preferir." },
  { titleJp: "ポケモントレーナー ： さんみいったい 【最後の切りふだ】", textJp: "最後の切りふだは、３匹のポケモンが総攻撃をしかける。どのポケモンが発動しても、効果は同じ。", titleJpEn: "Pokémon Trainer: Triple Finish (Final Smash)", textJpEn: "The Final Smash unleashes an all-out attack from all three Pokémon. The effect is the same no matter which Pokémon activates it.", titlePt: "Treinador Pokémon: Triple Finish (Final Smash)", textPt: "O Final Smash desencadeia um ataque total dos três Pokémon. O efeito é o mesmo não importa qual Pokémon o ative." },
  // Squirtle (4-11)
  { titleJp: "ゼニガメの初登場作品", textJp: "ゼニガメの初登場は、１９９６年発売の『ポケットモンスター 赤・緑』。主にみずタイプのわざを得意とする、かめのこポケモン。", titleJpEn: "Squirtle's Origins", textJpEn: "Squirtle's debut was in \"Pokémon Red & Green,\" released in 1996. A Tiny Turtle Pokémon that mainly excels at Water-type moves.", titlePt: "As Origens do Squirtle", textPt: "O debut do Squirtle foi em \"Pokémon Red & Green,\" lançado em 1996. Um Pokémon Tartaruguinha que se destaca principalmente em golpes do tipo Água." },
  { titleJp: "ゼニガメ ： 原作では", textJp: "『ポケットモンスター 赤・緑』の最初に、オーキド博士からもらえる３匹のうちの１匹。つりざおを入手するまで、序盤では貴重なみずタイプ。四足歩行も、二足歩行もできる。", titleJpEn: "Squirtle: In Its Series", textJpEn: "One of the three Pokémon given by Professor Oak at the start of \"Pokémon Red & Green.\" A valuable Water-type early on, until the player obtains a fishing rod. It can move on all fours or walk on two legs.", titlePt: "Squirtle: Na Série Original", textPt: "Um dos três Pokémon entregues pelo Professor Carvalho no início de \"Pokémon Red & Green.\" Um valioso tipo Água no início do jogo, até o jogador conseguir uma vara de pescar. Ele pode se mover em quatro patas ou andar sobre duas pernas." },
  { titleJp: "ゼニガメ ： みずでっぽう 【通常必殺ワザ】", textJp: "口から勢いよく水を発射し、相手を強く押し流す。ダメージは与えられないが、復帰の邪魔をすることができる。", titleJpEn: "Squirtle: Water Gun (Neutral Special)", textJpEn: "Fires a powerful jet of water from its mouth, pushing the opponent back forcefully. It deals no damage, but can interfere with recovery.", titlePt: "Squirtle: Water Gun (Especial Neutro)", textPt: "Dispara um forte jato de água pela boca, empurrando o adversário com força. Não causa dano, mas pode atrapalhar a recuperação." },
  { titleJp: "ゼニガメ ： からにこもる 【横必殺ワザ】", textJp: "回転しながら素早く移動し、相手に突進する。からにこもっている間はダメージを受けない。", titleJpEn: "Squirtle: Withdraw (Side Special)", textJpEn: "Spins rapidly while moving, charging into the opponent. It takes no damage while withdrawn into its shell.", titlePt: "Squirtle: Withdraw (Especial Lateral)", textPt: "Gira rapidamente enquanto se move, avançando contra o adversário. Não recebe dano enquanto está recolhido na carapaça." },
  { titleJp: "ゼニガメ ： からにこもるの突進 【横必殺ワザ】", textJp: "突進と逆方向にスティックを入力していれば、すべって行く距離を縮められる。相手やシールドにぶつかった時は、通り抜けずに跳ね返されてしまう。", titleJpEn: "Squirtle: Advancing with Withdraw (Side Special)", textJpEn: "Inputting the stick in the opposite direction of the charge shortens the sliding distance. When it hits an opponent or a shield, it doesn't pass through and instead bounces back.", titlePt: "Squirtle: Avançando com o Withdraw (Especial Lateral)", textPt: "Inputar o analógico na direção oposta ao avanço encurta a distância de deslizamento. Quando atinge um adversário ou um escudo, não atravessa e é repelido de volta." },
  { titleJp: "ゼニガメ ： からにこもるの弱点 【横必殺ワザ】", textJp: "突進中に上から踏まれてしまうと、ひっくり返り無防備に。起き上がるまでの間、動くことができないため、大きなスキができてしまう。", titleJpEn: "Squirtle: Withdraw's Weakness (Side Special)", textJpEn: "If it's stomped on from above during the charge, it flips over and becomes defenseless. Since it can't move until it gets back up, this creates a large opening.", titlePt: "Squirtle: A Fraqueza do Withdraw (Especial Lateral)", textPt: "Se for pisoteado por cima durante o avanço, ele vira de costas e fica indefeso. Como não pode se mover até se levantar, isso cria uma grande abertura." },
  { titleJp: "ゼニガメ ： たきのぼり 【上必殺ワザ】", textJp: "上昇中にスティック前後入力で、のぼる方向を少しだけ変えられる。復帰だけではなく、上空にいる相手への追撃も狙える。", titleJpEn: "Squirtle: Waterfall (Up Special)", textJpEn: "Inputting the stick forward or back while rising slightly changes the direction of ascent. It can be used not only for recovery, but also to chase down opponents above.", titlePt: "Squirtle: Waterfall (Especial Cima)", textPt: "Inputar o analógico para frente ou para trás enquanto sobe muda levemente a direção da subida. Pode ser usado não só para recuperação, mas também para perseguir adversários acima." },
  { titleJp: "ゼニガメ ： さんみいったい 【最後の切りふだ】", textJp: "手もちポケモン３匹の力を結集した、最後の切りふだ。ゼニガメによるハイドロポンプは上下に広く、相手を吸いよせる効果がある。", titleJpEn: "Squirtle: Triple Finish (Final Smash)", textJpEn: "A Final Smash that combines the power of all three Pokémon on the team. Squirtle's Hydro Pump has wide vertical range and has the effect of pulling the opponent in.", titlePt: "Squirtle: Triple Finish (Final Smash)", textPt: "Um Final Smash que combina o poder dos três Pokémon da equipe. O Hydro Pump do Squirtle tem amplo alcance vertical e tem o efeito de puxar o adversário para dentro." },
  // Ivysaur (12-20)
  { titleJp: "フシギソウの初登場作品", textJp: "フシギソウの初登場は、１９９６年発売の『ポケットモンスター 赤・緑』。相性が良いため、いわタイプ、みずタイプ相手の序盤のジム戦で活躍した。", titleJpEn: "Ivysaur's Origins", textJpEn: "Ivysaur's debut was in \"Pokémon Red & Green,\" released in 1996. Thanks to good type matchups, it excelled in early gym battles against Rock- and Water-type opponents.", titlePt: "As Origens do Ivysaur", textPt: "O debut do Ivysaur foi em \"Pokémon Red & Green,\" lançado em 1996. Graças a boas vantagens de tipo, ele se destacava em batalhas de ginásio iniciais contra adversários dos tipos Pedra e Água." },
  { titleJp: "フシギソウ ： 原作では", textJp: "最初に選ぶ３匹のポケモンのうちの１匹、フシギダネの２段階目の進化形。最初の３匹の中で一番早く、３段階目のフシギバナへ進化することができる。", titleJpEn: "Ivysaur: In Its Series", textJpEn: "The second-stage evolution of Bulbasaur, one of the three starter Pokémon. Among the three starters, it can evolve into its third stage, Venusaur, the earliest.", titlePt: "Ivysaur: Na Série Original", textPt: "A evolução de segundo estágio do Bulbasaur, um dos três Pokémon iniciais. Entre os três iniciais, ele pode evoluir para seu terceiro estágio, Venusaur, mais cedo do que os outros." },
  { titleJp: "フシギソウ ： タネマシンガン 【通常必殺ワザ】", textJp: "飛ばすタネだけでなく、自分の体でも相手を打ち上げることができる。近くにいる相手をまとめて巻き込むことも可能。", titleJpEn: "Ivysaur: Bullet Seed (Neutral Special)", textJpEn: "It can launch opponents not just with the seeds it fires, but also with its own body. Nearby opponents can also be caught together.", titlePt: "Ivysaur: Bullet Seed (Especial Neutro)", textPt: "Pode arremessar adversários não só com as sementes que dispara, mas também com o próprio corpo. Adversários próximos também podem ser pegos juntos." },
  { titleJp: "フシギソウ ： タネマシンガンの発射時間 【通常必殺ワザ】", textJp: "必殺ワザボタンを長押しすることで、タネマシンガンを発射する時間が延びる。横から近づく相手には注意が必要だが、うまく当てれば大ダメージを狙える。", titleJpEn: "Ivysaur: Bullet Seed Firing Time (Neutral Special)", textJpEn: "Holding the special move button extends the duration Bullet Seed is fired. Caution is needed against opponents approaching from the side, but landing it well can lead to big damage.", titlePt: "Ivysaur: Tempo de Disparo do Bullet Seed (Especial Neutro)", textPt: "Segurar o botão de golpe especial estende a duração em que o Bullet Seed é disparado. É preciso cuidado com adversários se aproximando pela lateral, mas acertá-lo bem pode gerar bastante dano." },
  { titleJp: "フシギソウ ： はっぱカッター 【横必殺ワザ】", textJp: "はじき入力で、より遠くへはっぱを打ち出すことができる。飛ぶ方向は一定ではないため、真横ではなく斜めに飛ぶこともある。", titleJpEn: "Ivysaur: Razor Leaf (Side Special)", textJpEn: "A flick input lets it launch the leaf further away. Since the direction it flies isn't fixed, it can sometimes fly diagonally instead of straight sideways.", titlePt: "Ivysaur: Razor Leaf (Especial Lateral)", textPt: "Um input rápido permite lançar a folha mais longe. Como a direção do voo não é fixa, às vezes ela pode voar na diagonal em vez de reto para o lado." },
  { titleJp: "フシギソウ ： つるのムチ 【上必殺ワザ】", textJp: "空中で何度も使用でき、発射する向きを少しだけ変えられる。落下しそうになった時、つるのムチがガケをつかめば、復帰することもできる。", titleJpEn: "Ivysaur: Vine Whip (Up Special)", textJpEn: "It can be used multiple times in the air, and the firing direction can be changed slightly. If it's about to fall, grabbing the ledge with Vine Whip can also allow it to recover.", titlePt: "Ivysaur: Vine Whip (Especial Cima)", textPt: "Pode ser usado várias vezes no ar, e a direção de disparo pode ser mudada levemente. Se estiver prestes a cair, agarrar a borda com o Vine Whip também pode permitir a recuperação." },
  { titleJp: "フシギソウ ： さんみいったい 【最後の切りふだ】", textJp: "手もちポケモン３匹の力を結集した、最後の切りふだ。フシギソウによるソーラービームは射程が長く、当たった相手を拘束する。", titleJpEn: "Ivysaur: Triple Finish (Final Smash)", textJpEn: "A Final Smash that combines the power of all three Pokémon on the team. Ivysaur's Solar Beam has long range and restrains the opponent it hits.", titlePt: "Ivysaur: Triple Finish (Final Smash)", textPt: "Um Final Smash que combina o poder dos três Pokémon da equipe. O Solar Beam do Ivysaur tem longo alcance e imobiliza o adversário que atinge." },
  { titleJp: "フシギソウ ： ばくれつフラワー 【上スマッシュ攻撃】", textJp: "非常に強いふっとばし力を持つが、ワザが出るのが遅く当てるのが難しい。相手の着地する場所や、回避での移動先を読んで、早めに出して狙おう。", titleJpEn: "Ivysaur: Exploding Flower (Up Smash)", textJpEn: "It has extremely strong knockback, but comes out slowly and is difficult to land. Try reading where the opponent will land or dodge to and use it early.", titlePt: "Ivysaur: Exploding Flower (Ataque Smash Cima)", textPt: "Tem um arremesso extremamente forte, mas sai devagar e é difícil de acertar. Tente ler onde o adversário vai pousar ou para onde vai esquivar, e use-o com antecedência." },
  { titleJp: "フシギソウ ： ツボミの花粉", textJp: "上スマッシュ攻撃、上下空中攻撃はツボミの花粉で攻撃を行う。当たれば相手を大きくふっとばす。", titleJpEn: "Ivysaur: Pollen from Bloom", textJpEn: "The up smash attack and the up/down air attacks use the pollen from its bud to attack. If it hits, it launches the opponent far.", titlePt: "Ivysaur: Pólen da Flor", textPt: "O ataque smash cima e os ataques aéreos cima/baixo usam o pólen de seu broto para atacar. Se acertar, arremessa o adversário para longe." },
  // Charizard (21-31)
  { titleJp: "リザードンの初登場作品", textJp: "リザードンのデビュー作は１９９６年発売の『ポケットモンスター 赤・緑』。リザードンは『赤』のパッケージイラストにもなった。", titleJpEn: "Charizard's Origins", textJpEn: "Charizard's debut was in \"Pokémon Red & Green,\" released in 1996. Charizard also became the cover art for \"Pokémon Red.\"", titlePt: "As Origens do Charizard", textPt: "O debut do Charizard foi em \"Pokémon Red & Green,\" lançado em 1996. O Charizard também se tornou a arte de capa de \"Pokémon Red.\"" },
  { titleJp: "リザードン ： 原作では", textJp: "『ポケットモンスター 赤』のパッケージを飾った、かえんポケモン。なんでも溶かしてしまうほどの、高熱の炎をはき出すが、自分より弱い者には向けない。", titleJpEn: "Charizard: In Its Series", textJpEn: "A Flame Pokémon that graced the cover of \"Pokémon Red.\" It breathes extremely hot flames capable of melting almost anything, but never directs them at anyone weaker than itself.", titlePt: "Charizard: Na Série Original", textPt: "Um Pokémon Chama que estampou a capa de \"Pokémon Red.\" Ele sopra chamas extremamente quentes capazes de derreter quase tudo, mas nunca as direciona contra alguém mais fraco do que ele." },
  { titleJp: "リザードン ： かえんほうしゃ 【通常必殺ワザ】", textJp: "ボタンを押したままにすることで炎を出し続けられる。だんだん炎の勢いが弱まっていくので注意。", titleJpEn: "Charizard: Flamethrower (Neutral Special)", textJpEn: "Holding the button lets it keep breathing fire. Be careful, as the flame's intensity gradually weakens.", titlePt: "Charizard: Flamethrower (Especial Neutro)", textPt: "Segurar o botão permite continuar soprando fogo. Cuidado, pois a intensidade da chama enfraquece gradualmente." },
  { titleJp: "リザードン ： フレアドライブ 【横必殺ワザ】", textJp: "炎を身にまとって勢いよく突進する。威力やふっとばし力が高いが、自分もダメージを受ける。", titleJpEn: "Charizard: Flare Blitz (Side Special)", textJpEn: "Wraps itself in flame and charges forward forcefully. It has high power and knockback, but it also takes damage itself.", titlePt: "Charizard: Flare Blitz (Especial Lateral)", textPt: "Envolve-se em chamas e avança com força. Tem alto poder e arremesso, mas também recebe dano." },
  { titleJp: "リザードン ： フレアドライブの特性 【横必殺ワザ】", textJp: "突進中に、ファイターや障害物にぶつかると爆発する。突進が直撃しなくても、近くのファイターを爆発に巻き込める。", titleJpEn: "Charizard: Flare Blitz (Side Special)", textJpEn: "If it hits a fighter or an obstacle during the charge, it explodes. Even if the charge doesn't land directly, nearby fighters can still be caught in the explosion.", titlePt: "Charizard: Flare Blitz (Especial Lateral)", textPt: "Se atingir um lutador ou um obstáculo durante o avanço, ele explode. Mesmo que o avanço não conecte diretamente, lutadores próximos ainda podem ser pegos na explosão." },
  { titleJp: "リザードン ： そらをとぶ 【上必殺ワザ】", textJp: "横へはあまり移動できず、ワザ終了後のスキも大きいが、ふっとばし力は強い。シールドで攻撃を防いでからの反撃手段としても、頼れるワザ。", titleJpEn: "Charizard: Fly (Up Special)", textJpEn: "It doesn't move very far sideways and has a large opening after the move ends, but its knockback is strong. It's also a reliable counterattack option after blocking an attack with a shield.", titlePt: "Charizard: Fly (Especial Cima)", textPt: "Não se move muito para os lados e tem uma grande abertura depois que o golpe termina, mas seu arremesso é forte. Também é uma opção confiável de contra-ataque depois de bloquear um ataque com o escudo." },
  { titleJp: "リザードン ： さんみいったい 【最後の切りふだ】", textJp: "手もちポケモン３匹の力を結集した、最後の切りふだ。リザードンによるだいもんじは絶え間なく打ち出され、ダメージが大きい。", titleJpEn: "Charizard: Triple Finish (Final Smash)", textJpEn: "A Final Smash that combines the power of all three Pokémon on the team. Charizard's Fire Blast fires continuously and deals heavy damage.", titlePt: "Charizard: Triple Finish (Final Smash)", textPt: "Um Final Smash que combina o poder dos três Pokémon da equipe. O Fire Blast do Charizard dispara continuamente e causa muito dano." },
  { titleJp: "リザードン ： はねあげ 【上強攻撃】", textJp: "翼の部分はダメージを受けない。上空から攻撃されるときに使うと打ち勝ちやすい。", titleJpEn: "Charizard: Wing Thrust (Up Tilt Attack)", textJpEn: "Its wing portion takes no damage. It's easy to win trades against attacks coming from above when used.", titlePt: "Charizard: Wing Thrust (Ataque Inclinado Cima)", textPt: "A parte da asa não recebe dano. É fácil vencer trocas contra ataques vindos de cima quando usado." },
  { titleJp: "リザードン ： くうちゅうしっぽ 【後空中攻撃】", textJp: "長い尻尾を、大きく後ろになぎ払う空中ワザ。尻尾の先端にある炎は威力が高く、相手ファイターを大きくふっとばせる。", titleJpEn: "Charizard: Aerial Tail (Back Air Attack)", textJpEn: "An aerial move that sweeps its long tail widely behind it. The flame at the tip of the tail has high power and can launch opposing fighters far.", titlePt: "Charizard: Aerial Tail (Ataque Aéreo Trás)", textPt: "Um golpe aéreo que varre a longa cauda amplamente para trás. A chama na ponta da cauda tem alto poder e pode arremessar os lutadores adversários para longe." },
  { titleJp: "リザードン ： 空中ジャンプ", textJp: "リザードンは空中ジャンプを２回することができる。ジャンプの高さは１回目より２回目の空中ジャンプの方が低くなる。", titleJpEn: "Charizard: Midair Jump", textJpEn: "Charizard can perform two air jumps. The second air jump is lower than the first.", titlePt: "Charizard: Pulo Aéreo", textPt: "O Charizard pode realizar dois pulos aéreos. O segundo pulo aéreo é mais baixo que o primeiro." },
  { titleJp: "水嫌い", textJp: "リザードンとインクリングは、水が苦手。水に浸かっている間は、少しずつダメージを受ける。", titleJpEn: "Hydrophobic Fighters", textJpEn: "Charizard and Inkling dislike water. While submerged in water, they gradually take damage.", titlePt: "Lutadores Hidrofóbicos", textPt: "Charizard e Inkling não gostam de água. Enquanto submersos na água, eles recebem dano gradualmente." },
];

// ===================== VIDEO TIMING (converted to seconds) =====================
const VIDEO = {
  zoomZike: { squirtle: [2471, 2487], charizard: [2450, 2470], ivysaur: [2431, 2449] }, // ZoomZike (SSBM bio)
  melee3d: { squirtle: [1894, 1907], charizard: [1880, 1893], ivysaur: [1867, 1879] },  // Melee Trophies 3D (SSBM collectible)
  brawl: { trainer: [5502, 5519], charizard: [5539, 5555], squirtle: [5556, 5572], ivysaur: [5573, 5590] },
  wiiu: { ivysaur: [4632, 4643], squirtle: [4655, 4665], charizard: [3785, 3795], trainer: [4778, 4788] },
  n3ds: { ivysaur: [4044, 4055], squirtle: [4065, 4076], charizard: [3330, 3341], trainer: [4174, 4195] },
};

async function main() {
  const fighters: Record<string, { id: string }> = {};
  for (const name of ["Pokémon Trainer", "Squirtle", "Ivysaur", "Charizard"]) {
    const f = await db.fighter.findFirst({ where: { name }, select: { id: true } });
    if (!f) { console.log(`❌ ${name} not found`); return; }
    fighters[name] = f;
  }

  // ---- Curator overviews ----
  for (const [name, c] of Object.entries(CURATOR)) {
    await db.fighter.update({ where: { id: fighters[name].id }, data: { curatorOverviewEn: c.en, curatorOverviewPt: c.pt, curatorOverviewJp: c.jp, curatorOverviewJpEn: c.jpEn } });
    console.log(`✅ Curator Overview [${name}]`);
  }

  // ---- Bios PT+JpEn ----
  for (const [name, versions] of Object.entries(BIOS)) {
    const bios = await db.fighterBio.findMany({ where: { fighterId: fighters[name].id }, select: { id: true, smashGameVersion: true } });
    for (const [version, data] of Object.entries(versions)) {
      const bio = bios.find(b => b.smashGameVersion === version);
      if (!bio) { console.log(`  ⚠️ Bio [${name}/${version}] not found`); continue; }
      await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
      console.log(`✅ Bio [${name}/${version}]: PT+JpEn`);
    }
  }

  // Ivysaur SSB4 bio JP was missing — set it, then apply PT/JpEn already defined above
  const ivysaurSSB4Bio = await db.fighterBio.findFirst({ where: { fighterId: fighters.Ivysaur.id, smashGameVersion: "SSB4" }, select: { id: true } });
  if (ivysaurSSB4Bio) {
    await db.fighterBio.update({ where: { id: ivysaurSSB4Bio.id }, data: { contentJp: IVYSAUR_SSB4_JP } });
    console.log("✅ Bio [Ivysaur/SSB4]: JP texto oficial adicionado (estava faltando)");
  }

  // Create Ivysaur SSBM bio (video-only — no confirmed official JP trophy text found)
  const ivysaurSSBMBio = await db.fighterBio.findFirst({ where: { fighterId: fighters.Ivysaur.id, smashGameVersion: "SSBM" } });
  if (!ivysaurSSBMBio) {
    await db.fighterBio.create({ data: { fighterId: fighters.Ivysaur.id, smashGameVersion: "SSBM", contentEn: "NOT FOUND", videoStartSec: VIDEO.zoomZike.ivysaur[0], videoEndSec: VIDEO.zoomZike.ivysaur[1] } });
    console.log("✅ Bio [Ivysaur/SSBM]: criado (só vídeo — texto oficial NOT FOUND, pendente)");
  }

  // ---- Charizard SSB4 move ----
  const charizardMove = await db.fighterMove.findFirst({ where: { fighterId: fighters.Charizard.id, smashGameVersion: "SSB4", order: 0 }, select: { id: true } });
  if (charizardMove) {
    const en = "\"Flamethrower\" is a move that keeps breathing fire as long as the button is held. Its intensity gradually weakens, but stopping the fire lets it recover over time. \"Rock Smash\" is a down special that headbutts a rock and sends the scattered fragments flying at opponents. While using Rock Smash, it won't flinch from an opponent's attack, but if the rock is destroyed by a clashing attack, the move can fail. (GB) Pokémon Red & Green (1996/02) (GBA) Pokémon X & Y (2013/10)";
    await db.fighterMove.update({
      where: { id: charizardMove.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"Flamethrower\" é um golpe que continua soprando fogo enquanto o botão é segurado. Sua intensidade enfraquece gradualmente, mas parar de soprar fogo permite que se recupere com o tempo. \"Rock Smash\" é um especial baixo que dá uma cabeçada em uma rocha e arremessa os fragmentos espalhados contra os adversários. Enquanto usa o Rock Smash, ele não se atordoa com o ataque de um adversário, mas se a rocha for destruída por um ataque que colide, o golpe pode falhar. (GB) Pokémon Red & Green (1996/02) (GBA) Pokémon X & Y (2013/10)",
      },
    });
    console.log("✅ Move [Charizard/SSB4] EX: EN+PT+JpEn");
  }

  // ---- Tips (32, all on Pokémon Trainer, index-matched) ----
  const trainerTips = await db.fighterTip.findMany({ where: { fighterId: fighters["Pokémon Trainer"].id }, select: { id: true, titleEn: true }, orderBy: { id: "asc" } });
  if (trainerTips.length !== TIPS.length) {
    console.log(`⚠️ Mismatch: DB has ${trainerTips.length} tips, expected ${TIPS.length}`);
  } else {
    for (let i = 0; i < trainerTips.length; i++) {
      const tip = trainerTips[i];
      const data = TIPS[i];
      await db.fighterTip.update({
        where: { id: tip.id },
        data: { titleJp: data.titleJp, textJp: data.textJp, titleJpEn: data.titleJpEn, textJpEn: data.textJpEn, titlePt: data.titlePt, textPt: data.textPt },
      });
    }
    console.log(`✅ ${trainerTips.length}/${TIPS.length} tips atualizadas (Pokémon Trainer)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
