import { db } from "../../lib/db";

const TIPS = [
  {
    titleEn: "[★☆☆] Terry's Origins",
    titleJp: "テリーの初登場作品",
    textJp: "テリーの初登場は、１９９１年稼働のアーケードゲーム『餓狼伝説 ～宿命の闘い～』。個性的なキャラクター、奥行きを取り入れた２ラインバトルなどが特徴だった。",
    titleJpEn: "Terry's Debut Work",
    textJpEn: "Terry's first appearance was in the 1991 arcade game Fatal Fury: King of Fighters. It was known for its distinctive characters and Two-Line Battle system that incorporated depth into the stage.",
    titlePt: "As Origens de Terry",
    textPt: "A primeira aparição de Terry foi no jogo de arcade de 1991, Fatal Fury: King of Fighters. Ele era conhecido por seus personagens marcantes e pelo sistema de Batalha em Duas Linhas, que incorporava profundidade ao cenário.",
  },
  {
    titleEn: "[★☆☆] In His Series",
    titleJp: "原作では",
    textJp: "養父ジェフ・ボガードの仇、ギース・ハワードに復讐すべく、格闘術を学んだ。ギースに近づくため、最強武闘家「キング・オブ・ファイターズ」に出場し、勝ち抜いていく。",
    titleJpEn: "In the Original Games",
    textJpEn: "In the original games, Terry learned martial arts to avenge his adoptive father Jeff Bogard, who was killed by Geese Howard. To get close to Geese, he entered and fought his way through the \"King of Fighters\" tournament for the strongest fighters.",
    titlePt: "Nos Jogos Originais",
    textPt: "Nos jogos originais, Terry aprendeu artes marciais para vingar seu pai adotivo Jeff Bogard, morto por Geese Howard. Para se aproximar de Geese, ele entrou e venceu o torneio \"King of Fighters\", reunindo os lutadores mais fortes.",
  },
  {
    titleEn: "[★☆☆] Special-Move Strength",
    titleJp: "必殺ワザの強弱",
    textJp: "必殺ワザボタンを押す長さで、必殺ワザの強弱を使い分けることができる。長めに押すと、リーチやパワーが上がる。短めに押すと、スキが少なくなる。",
    titleJpEn: "Special-Move Strength",
    textJpEn: "How long you hold the special-move button determines the strength of the special move. Holding it longer increases reach and power. Holding it briefly reduces the move's ending lag.",
    titlePt: "Força do Golpe Especial",
    textPt: "A duração em que você segura o botão de especial determina a força do golpe especial. Segurar por mais tempo aumenta o alcance e o poder. Segurar rapidamente reduz a vulnerabilidade após o golpe.",
  },
  {
    titleEn: "[★☆☆] Power Wave (Neutral Special)",
    titleJp: "パワーウェイブ 【通常必殺ワザ】",
    textJp: "足元に拳を叩きつけて、地を這う衝撃波を走らせる。必殺ワザボタンを長めに押すと、より速く、より遠くまで届くようになる。",
    titleJpEn: "Power Wave (Neutral Special)",
    textJpEn: "Slams a fist into the ground, sending a shockwave crawling along the ground. Holding the special-move button longer makes it travel faster and reach farther.",
    titlePt: "Power Wave (Especial Neutro)",
    textPt: "Golpeia o chão com o punho, disparando uma onda de choque que se arrasta pelo chão. Segurar o botão de especial por mais tempo faz com que ela viaje mais rápido e alcance mais longe.",
  },
  {
    titleEn: "[★☆☆] Airborne Wave (Neutral Special)",
    titleJp: "空中でのパワーウェイブ 【通常必殺ワザ】",
    textJp: "地面がない場所では、拳を振り下ろして空中に衝撃波を放つ。射程は短いが、復帰阻止などに使える。",
    titleJpEn: "Airborne Power Wave (Neutral Special)",
    textJpEn: "In midair with no ground beneath him, he swings his fist downward to release a shockwave into the air. Its range is short, but it can be used for edge-guarding and similar situations.",
    titlePt: "Power Wave Aéreo (Especial Neutro)",
    textPt: "No ar, sem chão abaixo, ele golpeia com o punho para baixo, liberando uma onda de choque no ar. O alcance é curto, mas pode ser usado para impedir a recuperação do oponente, entre outras situações.",
  },
  {
    titleEn: "[★☆☆] Power Wave Hang Time (Neutral Special)",
    titleJp: "パワーウェイブでの滞空 【通常必殺ワザ】",
    textJp: "空中で出すと、最初の１回のみ、一瞬その場で滞空する。ガケ際やガケの外で、相手の復帰を阻止するのに便利。",
    titleJpEn: "Hang Time with Power Wave (Neutral Special)",
    textJpEn: "When used in midair, only the first time causes him to briefly hang in place. This is handy for stopping an opponent's recovery near or off the ledge.",
    titlePt: "Suspensão com o Power Wave (Especial Neutro)",
    textPt: "Quando usado no ar, apenas na primeira vez ele fica suspenso no lugar por um instante. Isso é útil para impedir a recuperação do oponente perto ou fora da borda.",
  },
  {
    titleEn: "[★☆☆] Two Types of Side Specials",
    titleJp: "２種類の横必殺ワザ",
    textJp: "スティックを正面に倒すと前必殺ワザ、背後に倒すと後必殺ワザが出る。どちらも、正面方向へ突進する攻撃なのは同じ。",
    titleJpEn: "Two Types of Side Specials",
    textJpEn: "Tilting the stick forward brings out the forward special, while tilting it backward brings out the backward special. Either way, both are attacks that charge forward.",
    titlePt: "Dois Tipos de Especial Lateral",
    textPt: "Inclinar o direcional para frente ativa o especial para frente, enquanto inclinar para trás ativa o especial para trás. De qualquer forma, ambos são ataques que avançam para frente.",
  },
  {
    titleEn: "[★☆☆] Burning Knuckle (Forward Tilt Special)",
    titleJp: "バーンナックル 【前必殺ワザ】",
    textJp: "一瞬両手を広げてから、拳を突き出して突進する。突進し始めた直後が、最も威力が高い。強力なワザだが、攻撃前後のスキが大きいので注意。",
    titleJpEn: "Burning Knuckle (Forward Special)",
    textJpEn: "He briefly spreads both arms wide, then thrusts a fist forward and charges. The move is at its most powerful right as the charge begins. It's a powerful move, but be careful — it leaves him vulnerable both before and after the attack.",
    titlePt: "Burning Knuckle (Especial para Frente)",
    textPt: "Ele abre os dois braços por um instante e então avança com o punho estendido. O golpe é mais poderoso logo no início da investida. É um golpe poderoso, mas cuidado — ele deixa Terry vulnerável tanto antes quanto depois do ataque.",
  },
  {
    titleEn: "[★☆☆] Burning Knuckle (Forward Tilt Special / Command-Input Move)",
    titleJp: "バーンナックルのコマンド入力 【前必殺・コマンド入力ワザ】",
    textJp: "右向き時、↓↘→＋ボタンと素早くコマンド入力すると、威力が上がる。さらに、ワザの出始めは、突き出した腕が無敵になる。",
    titleJpEn: "Burning Knuckle Command Input (Forward Special / Command-Input Move)",
    textJpEn: "While facing right, quickly entering the command ↓↘→ + button increases the move's power. In addition, the extended arm becomes invincible at the very start of the move.",
    titlePt: "Burning Knuckle via Comando (Especial para Frente / Golpe de Comando)",
    textPt: "Virado para a direita, inserir rapidamente o comando ↓↘→ + botão aumenta o poder do golpe. Além disso, o braço estendido fica invencível bem no início do golpe.",
  },
  {
    titleEn: "[★☆☆] Crack Shoot (Backward Tilt Special)",
    titleJp: "クラックシュート 【後必殺ワザ】",
    textJp: "前方に宙返りしながら踵を落とし、浴びせ蹴りをくり出す。足の末端ほど攻撃力が高く、斜め上への対空攻撃としても使える。",
    titleJpEn: "Crack Shoot (Backward Special)",
    textJpEn: "He somersaults forward while dropping his heel down in an axe-kick-like strike. The tip of the foot deals more damage, and it can also be used as a diagonal anti-air attack.",
    titlePt: "Crack Shoot (Especial para Trás)",
    textPt: "Ele dá um salto mortal para frente enquanto derruba o calcanhar num golpe de chute. A ponta do pé causa mais dano, e também pode ser usado como um ataque antiaéreo na diagonal.",
  },
  {
    titleEn: "[★☆☆] Reversed Crack Shoot (Backward Tilt Special)",
    titleJp: "背後へのクラックシュート 【後必殺ワザ】",
    textJp: "空中で、背中側へ長めにスティックを倒してボタンを押すと、背後に向かってワザを出す。ただし、コマンド入力した時は、必ず正面に向かってワザを出す。",
    titleJpEn: "Reversed Crack Shoot (Backward Special)",
    textJpEn: "In midair, holding the stick back for a longer time and pressing the button will send the move out backward. However, if the command is entered, the move will always come out facing forward.",
    titlePt: "Crack Shoot Invertido (Especial para Trás)",
    textPt: "No ar, segurar o direcional para trás por mais tempo e pressionar o botão faz o golpe sair para trás. Porém, se o comando for inserido, o golpe sempre sai virado para frente.",
  },
  {
    titleEn: "[★☆☆] Crack Shoot (Backward Tilt Special / Command-Input Move)",
    titleJp: "クラックシュートのコマンド入力 【後必殺・コマンド入力ワザ】",
    textJp: "右向き時、↓↙←＋ボタンと素早くコマンド入力すると、攻撃力とふっとばし力が上がる。",
    titleJpEn: "Crack Shoot Command Input (Backward Special / Command-Input Move)",
    textJpEn: "While facing right, quickly entering the command ↓↙← + button increases both the move's damage and knockback.",
    titlePt: "Crack Shoot via Comando (Especial para Trás / Golpe de Comando)",
    textPt: "Virado para a direita, inserir rapidamente o comando ↓↙← + botão aumenta tanto o dano quanto o poder de arremesso do golpe.",
  },
  {
    titleEn: "[★☆☆] Rising Tackle (Up Special)",
    titleJp: "ライジングタックル 【上必殺ワザ】",
    textJp: "足を上にして跳び上がり、腕を広げて回転しながら、上空を攻撃する。跳び上がる時にスティックを倒すと、少しだけ横に移動できる。",
    titleJpEn: "Rising Tackle (Up Special)",
    textJpEn: "Leaps upward feet-first, spinning with arms spread wide to attack the space above. Tilting the stick while leaping allows for a small amount of horizontal movement.",
    titlePt: "Rising Tackle (Especial Superior)",
    textPt: "Ele salta para cima com os pés à frente, girando com os braços abertos para atacar o espaço acima. Inclinar o direcional durante o salto permite um pequeno deslocamento horizontal.",
  },
  {
    titleEn: "[★☆☆] Rising Tackle Traits (Up Special)",
    titleJp: "ライジングタックルの特性 【上必殺ワザ】",
    textJp: "ワザの出始めに下半身が無敵状態になるため、上からの攻撃に打ち勝ちやすい。ただし、攻撃が終わってからのスキが大きい。",
    titleJpEn: "Rising Tackle's Traits (Up Special)",
    textJpEn: "His lower body becomes invincible at the start of the move, making it easy to beat out attacks from above. However, there's significant vulnerability after the attack ends.",
    titlePt: "Características do Rising Tackle (Especial Superior)",
    textPt: "A parte inferior do corpo dele fica invencível no início do golpe, facilitando vencer ataques vindos de cima. Porém, há uma vulnerabilidade considerável depois que o ataque termina.",
  },
  {
    titleEn: "[★☆☆] Rising Tackle (Up Special / Command-Input Move)",
    titleJp: "ライジングタックルのコマンド入力 【上必殺・コマンド入力ワザ】",
    textJp: "↓ため入力↑＋ボタンとコマンド入力すると、攻撃力と跳び上がる高さがアップする。さらに、ワザの出始めに、全身が無敵状態になる。",
    titleJpEn: "Rising Tackle Command Input (Up Special / Command-Input Move)",
    textJpEn: "Entering the command by holding ↓ then inputting ↑ + button increases both the move's power and the height of the leap. In addition, his entire body becomes invincible at the very start of the move.",
    titlePt: "Rising Tackle via Comando (Especial Superior / Golpe de Comando)",
    textPt: "Inserir o comando segurando ↓ e depois pressionando ↑ + botão aumenta tanto o poder do golpe quanto a altura do salto. Além disso, o corpo inteiro dele fica invencível bem no início do golpe.",
  },
  {
    titleEn: "[★☆☆] Power Dunk (Down Special)",
    titleJp: "パワーダンク 【下必殺ワザ】",
    textJp: "相手を蹴りで浮かせながら跳び上がり、ダンクシュートのように斜め下へ拳を叩き込む。最初の蹴りを当てれば連続攻撃できるが、空中でのスキが大きいので注意。",
    titleJpEn: "Power Dunk (Down Special)",
    textJpEn: "He leaps up while kicking the opponent into the air, then slams a fist diagonally downward like a dunk shot. Landing the first kick allows for a follow-up attack, but be careful — there's significant vulnerability while airborne.",
    titlePt: "Power Dunk (Especial Inferior)",
    textPt: "Ele salta enquanto chuta o oponente para o alto, e então crava o punho na diagonal para baixo, como uma cravada de basquete. Acertar o primeiro chute permite um ataque seguido, mas cuidado — há uma vulnerabilidade considerável enquanto está no ar.",
  },
  {
    titleEn: "[★☆☆] Power Dunk (Down Special / Command-Input Move)",
    titleJp: "パワーダンクのコマンド入力 【下必殺・コマンド入力ワザ】",
    textJp: "右向き時、→↓↘＋ボタンと素早くコマンド入力すると、威力が上がる。さらに、跳び上がる瞬間、全身が無敵になる。",
    titleJpEn: "Power Dunk Command Input (Down Special / Command-Input Move)",
    textJpEn: "While facing right, quickly entering the command →↓↘ + button increases the move's power. In addition, his entire body becomes invincible the instant he leaps.",
    titlePt: "Power Dunk via Comando (Especial Inferior / Golpe de Comando)",
    textPt: "Virado para a direita, inserir rapidamente o comando →↓↘ + botão aumenta o poder do golpe. Além disso, o corpo inteiro dele fica invencível no instante em que salta.",
  },
  {
    titleEn: "[★☆☆] Power Dunk's Meteor Effect (Down Special / Command-Input Move)",
    titleJp: "パワーダンクでメテオ 【下必殺・コマンド入力ワザ】",
    textJp: "コマンド入力で出すと、急降下の後半、突き出した拳にメテオ効果が生じる。ただし、攻撃ボタンを短めに入力した時には、効果が生じない。",
    titleJpEn: "Power Dunk's Meteor Effect (Down Special / Command-Input Move)",
    textJpEn: "When performed via command input, the second half of the sharp descent gives the extended fist a meteor effect. However, this effect doesn't occur if the attack button is pressed only briefly.",
    titlePt: "Efeito Meteoro do Power Dunk (Especial Inferior / Golpe de Comando)",
    textPt: "Quando executado via comando, a segunda metade da queda brusca confere ao punho estendido um efeito meteoro. Porém, esse efeito não ocorre se o botão de ataque for pressionado rapidamente.",
  },
  {
    titleEn: "[★☆☆] Super Special Moves",
    titleJp: "超必殺ワザ",
    textJp: "ピンチになると、コマンド入力で強力な超必殺ワザを出せるようになる。蓄積ダメージが１００％を超えるか、体力制で残り体力が約１／３を切るのが条件。",
    titleJpEn: "Super Special Moves",
    textJpEn: "When in a pinch, he can use command inputs to unleash powerful Super Special Moves. The condition is either accumulating over 100% damage, or in Stamina mode, having his remaining stamina drop below about one-third.",
    titlePt: "Golpes Super Especiais",
    textPt: "Quando em apuros, ele pode usar comandos para desferir poderosos Golpes Super Especiais. A condição é acumular mais de 100% de dano, ou, no Modo Resistência, ter a resistência restante abaixo de cerca de um terço.",
  },
  {
    titleEn: "[★☆☆] Using Super Special Moves",
    titleJp: "超必殺ワザを出せる時",
    textJp: "蓄積ダメージの近くに「Go」が表示されたら、超必殺ワザを出せる合図。ただし、空中では発動しないので、注意しよう。",
    titleJpEn: "When You Can Use a Super Special Move",
    textJpEn: "When \"Go\" appears near his damage percentage, that's the signal that he can use a Super Special Move. However, be careful — it can't be activated in midair.",
    titlePt: "Quando Usar um Golpe Super Especial",
    textPt: "Quando \"Go\" aparece perto da porcentagem de dano dele, esse é o sinal de que ele pode usar um Golpe Super Especial. Porém, cuidado — ele não pode ser ativado no ar.",
  },
  {
    titleEn: "[★☆☆] Reversed Super Special Moves",
    titleJp: "逆方向への超必殺ワザ",
    textJp: "コマンドを普段とは左右逆に入力すると、後ろ側にワザを出すことができる。",
    titleJpEn: "Reversed Super Special Moves",
    textJpEn: "Entering the command with left and right reversed from usual allows the move to come out facing backward.",
    titlePt: "Golpes Super Especiais Invertidos",
    textPt: "Inserir o comando com a esquerda e a direita invertidas em relação ao normal permite que o golpe saia virado para trás.",
  },
  {
    titleEn: "[★☆☆] The Start of Super Special Moves",
    titleJp: "超必殺ワザの出始め",
    textJp: "ワザの出始めは、スーパーアーマー状態になる。弱攻撃などに耐えて、打ち勝ちやすい。",
    titleJpEn: "The Start of a Super Special Move",
    textJpEn: "At the very start of the move, he gains Super Armor. This lets him withstand attacks like jabs and makes it easy to beat them out.",
    titlePt: "O Início de um Golpe Super Especial",
    textPt: "Bem no início do golpe, ele ganha Super Armadura. Isso permite suportar ataques como socos fracos, facilitando vencê-los.",
  },
  {
    titleEn: "[★☆☆] Power Geyser (Super Special Move)",
    titleJp: "パワーゲイザー 【超必殺ワザ】",
    textJp: "右向き時、↓↙←↙→＋ボタンと素早くコマンド入力すると、ピンチの時のみ発動できる。気の柱を目の前に吹き上げさせて攻撃するワザで、地面近くで当てるほど、威力が高い。",
    titleJpEn: "Power Geyser (Super Special Move)",
    textJpEn: "While facing right, quickly entering the command ↓↙←↙→ + button activates this move, but only while in a pinch. It's a move that shoots a pillar of energy upward right in front of him, and it deals more damage the closer to the ground it connects.",
    titlePt: "Power Geyser (Golpe Super Especial)",
    textPt: "Virado para a direita, inserir rapidamente o comando ↓↙←↙→ + botão ativa esse golpe, mas apenas quando em apuros. É um golpe que dispara um pilar de energia para cima bem à sua frente, causando mais dano quanto mais perto do chão ele acertar.",
  },
  {
    titleEn: "[★☆☆] Buster Wolf (Super Special Move)",
    titleJp: "バスターウルフ 【超必殺ワザ】",
    textJp: "右向き時、↓↘→↓↘→＋ボタンと素早くコマンド入力すると、ピンチの時のみ発動できる。拳を突き出して高速で突進し、相手に当たると、気の衝撃波で大ダメージを与える。",
    titleJpEn: "Buster Wolf (Super Special Move)",
    textJpEn: "While facing right, quickly entering the command ↓↘→↓↘→ + button activates this move, but only while in a pinch. He thrusts out a fist and charges forward at high speed, and if it connects, an energy shockwave deals massive damage.",
    titlePt: "Buster Wolf (Golpe Super Especial)",
    textPt: "Virado para a direita, inserir rapidamente o comando ↓↘→↓↘→ + botão ativa esse golpe, mas apenas quando em apuros. Ele estende o punho e avança em alta velocidade, e se acertar, uma onda de choque de energia causa dano massivo.",
  },
  {
    titleEn: "[★☆☆] Easy Commands for Super Special Moves",
    titleJp: "超必殺ワザの簡易コマンド",
    textJp: "超必殺ワザは、短めのコマンドでも発動できる。右向き時、パワーゲイザーは、↓←↓→＋ボタン。バスターウルフは、↓→↓→＋ボタン。",
    titleJpEn: "Easy Commands for Super Special Moves",
    textJpEn: "Super Special Moves can also be activated with shorter commands. While facing right, Power Geyser can be input as ↓←↓→ + button, and Buster Wolf as ↓→↓→ + button.",
    titlePt: "Comandos Simplificados para Golpes Super Especiais",
    textPt: "Golpes Super Especiais também podem ser ativados com comandos mais curtos. Virado para a direita, o Power Geyser pode ser inserido como ↓←↓→ + botão, e o Buster Wolf como ↓→↓→ + botão.",
  },
  {
    titleEn: "[★☆☆] Triple Wolf (Final Smash)",
    titleJp: "トリプルウルフ 【最後の切りふだ】",
    textJp: "トリプルゲイザーから始まり、パワーダンク、バスターウルフと３連続でつなぐ大ワザ。トリプルゲイザーで複数人をふっとばしつつ、最初に当たった１人にコンボを叩き込む。",
    titleJpEn: "Triple Wolf (Final Smash)",
    textJpEn: "A massive move that begins with Triple Geyser, then chains into Power Dunk and Buster Wolf in three consecutive parts. Triple Geyser launches multiple opponents while unleashing a combo on the first one it hits.",
    titlePt: "Triple Wolf (Ataque Final)",
    textPt: "Um golpe massivo que começa com o Triple Geyser, e depois encadeia Power Dunk e Buster Wolf em três partes consecutivas. O Triple Geyser lança múltiplos oponentes enquanto crava um combo no primeiro que for atingido.",
  },
  {
    titleEn: "[★☆☆] Triple Wolf's Pull (Final Smash)",
    titleJp: "トリプルウルフでの巻き込み 【最後の切りふだ】",
    textJp: "最初に放つ３連続の気の柱は、複数の相手に当たり、大きめのダメージを与えられる。とどめの一撃でふっとばせるのは１人だけだが、乱戦でも有効。",
    titleJpEn: "Triple Wolf's Multi-Hit (Final Smash)",
    textJpEn: "The first three consecutive pillars of energy can hit multiple opponents, dealing fairly high damage. Only one opponent can be launched by the finishing blow, but it's still effective even in chaotic free-for-alls.",
    titlePt: "Alcance Múltiplo do Triple Wolf (Ataque Final)",
    textPt: "Os três pilares de energia consecutivos iniciais podem atingir múltiplos oponentes, causando dano considerável. Apenas um oponente pode ser lançado pelo golpe final, mas ainda assim é eficaz mesmo em confrontos caóticos com vários lutadores.",
  },
  {
    titleEn: "[★★☆] Combo into a Special",
    titleJp: "通常ワザからのキャンセルコンボ",
    textJp: "弱攻撃、強攻撃など、一部の通常ワザは、相手に当てた瞬間に必殺ワザを出すと、スキをキャンセルして必殺ワザに繋げられる。",
    titleJpEn: "Cancel Combos from Standard Moves",
    textJpEn: "With some standard attacks, such as jabs and tilt attacks, using a special move the instant it connects with an opponent will cancel the ending lag and chain directly into the special move.",
    titlePt: "Combo Cancelado a partir de Golpes Padrão",
    textPt: "Com alguns golpes padrão, como socos fracos e ataques fortes, usar um golpe especial no instante em que ele acerta o oponente cancela a vulnerabilidade e encadeia diretamente no golpe especial.",
  },
  {
    titleEn: "[★★☆] Neutral Attack into a Combo",
    titleJp: "弱攻撃からのキャンセルコンボ",
    textJp: "弱攻撃の２段目は、２回ヒットする。相手へのヒットを確認してから、必殺ワザに繋ぐコンボを狙える。",
    titleJpEn: "Cancel Combo from Jab",
    textJpEn: "The second hit of his jab combo strikes twice. After confirming that it hits the opponent, he can go for a combo that chains into a special move.",
    titlePt: "Combo Cancelado a partir do Soco Fraco",
    textPt: "O segundo golpe do combo de socos fracos acerta duas vezes. Depois de confirmar que atingiu o oponente, ele pode buscar um combo que encadeia num golpe especial.",
  },
  {
    titleEn: "[★☆☆] Up Throw",
    titleJp: "上投げ",
    textJp: "他の投げ攻撃に比べると、ふっとばし力が弱い。その代わりに、攻撃後のスキが少なく、追撃を狙いやすい。",
    titleJpEn: "Up Throw",
    textJpEn: "Compared to his other throws, this one has weaker knockback. In exchange, there's little vulnerability after the attack, making it easy to go for a follow-up.",
    titlePt: "Arremesso para Cima",
    textPt: "Comparado aos outros arremessos dele, esse tem poder de arremesso mais fraco. Em compensação, há pouca vulnerabilidade após o ataque, facilitando buscar um golpe de acompanhamento.",
  },
  {
    titleEn: "[★☆☆] Dodge Attack",
    titleJp: "避け攻撃",
    textJp: "その場回避中に攻撃ボタンで、上強攻撃と同じ、避け攻撃を出せる。上半身無敵で攻撃できるため、空中の相手への反撃に有効。",
    titleJpEn: "Dodge Attack",
    textJpEn: "Pressing the attack button during a spot dodge produces a dodge attack identical to his up tilt. Since his upper body is invincible during the attack, it's effective for countering airborne opponents.",
    titlePt: "Ataque de Esquiva",
    textPt: "Pressionar o botão de ataque durante uma esquiva no lugar produz um ataque de esquiva idêntico ao ataque forte para cima dele. Como a parte superior do corpo fica invencível durante o ataque, é eficaz para contra-atacar oponentes no ar.",
  },
  {
    titleEn: "[★☆☆] Face Off 1-on-1",
    titleJp: "1on1での振り向き",
    textJp: "１対１の対戦では、自動で相手側に向く。コマンド入力する時は、向きに注意。",
    titleJpEn: "Turning to Face in 1-on-1",
    textJpEn: "In 1-on-1 battles, he automatically faces toward his opponent. Pay attention to which way he's facing when entering commands.",
    titlePt: "Virada de Frente no 1 contra 1",
    textPt: "Em batalhas 1 contra 1, ele automaticamente vira de frente para o oponente. Preste atenção para qual lado ele está virado ao inserir comandos.",
  },
];

async function main() {
  const terry = await db.fighter.findFirst({
    where: { name: { contains: "Terry", mode: "insensitive" } },
    select: { id: true, tips: { select: { id: true, titleEn: true } } },
  });
  if (!terry) { console.log("Terry not found"); return; }

  await db.fighter.update({
    where: { id: terry.id },
    data: {
      curatorOverviewEn: "Terry brings a distinctly different execution layer to Ultimate: every special move has a simple version and a stronger command-input version pulled straight from Fatal Fury's fighting-game roots. Power Wave scales with how long you hold the button — longer holds travel farther and faster, short taps keep him safer — and the very first aerial use lets him hang in place for a beat, which is a real tool for edge-guarding. The side specials split by direction instead of by button: tilting toward the opponent gives Burning Knuckle, tilting away gives Crack Shoot, and both have a quarter-circle or half-circle command input that trades a slightly harder input for more damage, more knockback, or a window of invincibility. Rising Tackle and Power Dunk follow the same pattern, with their command versions granting full-body invincibility on top of the power boost — Power Dunk's command version also adds a meteor effect on the way down that a simple button tap doesn't get. The real hook is the Super Special Move system: once Terry crosses 100% damage (or drops below a third of his stamina), a \"Go\" indicator appears and unlocks Power Geyser and Buster Wolf, devastating command-input finishers that are otherwise unavailable — reversible by mirroring the input direction, and opening with a window of super armor that shrugs off jabs. Triple Wolf, his Final Smash, is built the same way: Triple Geyser hits a crowd before chaining into Power Dunk and Buster Wolf on whoever it caught first. It's a moveset that rewards learning the inputs — the safe, simple version of every move is always there as a fallback, but the ceiling is entirely locked behind command inputs most Ultimate fighters don't have.",
      curatorOverviewPt: "Terry traz uma camada de execução bem diferente para o Ultimate: todo golpe especial tem uma versão simples e uma versão mais forte via comando, direto das raízes de jogo de luta de Fatal Fury. O Power Wave escala conforme o tempo que você segura o botão — segurar mais tempo faz ele viajar mais longe e mais rápido, toques curtos deixam Terry mais seguro — e o primeiríssimo uso aéreo o deixa suspenso no lugar por um instante, uma ferramenta real para impedir recuperações. Os especiais laterais se dividem pela direção, não pelo botão: inclinar na direção do oponente dá o Burning Knuckle, inclinar para o outro lado dá o Crack Shoot, e ambos têm um comando em quarto ou meio círculo que troca um input um pouco mais difícil por mais dano, mais poder de arremesso, ou uma janela de invencibilidade. Rising Tackle e Power Dunk seguem o mesmo padrão, com suas versões via comando concedendo invencibilidade no corpo todo além do aumento de poder — a versão via comando do Power Dunk também adiciona um efeito meteoro na descida, algo que o toque simples do botão não tem. O verdadeiro atrativo é o sistema de Golpes Super Especiais: quando Terry ultrapassa 100% de dano (ou cai abaixo de um terço da resistência), um indicador \"Go\" aparece e libera o Power Geyser e o Buster Wolf, finalizadores devastadores via comando que ficam indisponíveis fora dessa condição — reversíveis ao espelhar a direção do input, e abrindo com uma janela de super armadura que ignora socos fracos. O Triple Wolf, o Ataque Final dele, segue a mesma lógica: o Triple Geyser acerta um grupo antes de encadear Power Dunk e Buster Wolf em quem foi atingido primeiro. É um kit que recompensa quem aprende os comandos — a versão simples e segura de cada golpe está sempre disponível como alternativa, mas o teto de potencial fica todo trancado atrás de comandos que a maioria dos lutadores do Ultimate não tem.",
      curatorOverviewJp: "テリーは『Ultimate』にまったく異質な操作の層を持ち込む——すべての必殺ワザに、シンプル版と、格闘ゲーム『餓狼伝説』の血統そのままの、より強力なコマンド入力版が存在する。「パワーウェイブ」はボタンを押す長さでスケールする——長く押すほど遠く速く飛び、短く押せば身を安全に保てる——そして空中での最初の一発だけ、その場で一瞬滞空できる。これは復帰阻止の実用的な武器になる。横必殺ワザは、ボタンではなく方向で分かれている。相手側に倒せば「バーンナックル」、逆側に倒せば「クラックシュート」。どちらも波動拳や昇龍拳のようなコマンド入力があり、少し難しい入力と引き換えに、ダメージ増加、ふっとばし力アップ、あるいは無敵時間を得られる。「ライジングタックル」と「パワーダンク」も同じ構造で、コマンド版は威力アップに加えて全身無敵を得る——「パワーダンク」のコマンド版は、さらに落下中にメテオ効果まで付く。単純なボタン入力ではこの効果は得られない。真の目玉は「超必殺ワザ」システムだ。蓄積ダメージが１００％を超える（または体力制で残り体力が約１／３を切る）と、「Go」のサインが表示され、「パワーゲイザー」と「バスターウルフ」——それ以外では使えない強烈なコマンド入力の切り札——が解禁される。入力方向を逆にすれば逆側にも出せて、出始めにはスーパーアーマーがあり、弱攻撃程度なら耐えて打ち勝てる。最後の切りふだ「トリプルウルフ」も同じ発想で作られている。「トリプルゲイザー」で複数人を巻き込みつつ、最初に当たった相手にそのまま「パワーダンク」「バスターウルフ」と繋いでいく。コマンドを覚えるほど報われる技構成で、どの技にも安全でシンプルな代替が常に用意されている一方、真の実力の天井は、『Ultimate』の多くのファイターが持たないコマンド入力の先にしかない。",
      curatorOverviewJpEn: "Terry brings an entirely different layer of execution into Ultimate — every special move has a simple version, and a more powerful command-input version straight from the fighting-game bloodline of Fatal Fury. \"Power Wave\" scales with how long the button is held — holding longer sends it farther and faster, while a short press keeps him safer — and only the very first midair use lets him hang in place for an instant, a genuinely practical tool for edge-guarding. The side specials are split by direction rather than by button: tilting toward the opponent brings out \"Burning Knuckle,\" tilting the other way brings out \"Crack Shoot.\" Both have a Hadouken- or Shoryuken-style command input that trades a slightly harder input for increased damage, more knockback, or a window of invincibility. \"Rising Tackle\" and \"Power Dunk\" follow the same structure, with their command versions gaining full-body invincibility on top of the power increase — the command version of \"Power Dunk\" even adds a meteor effect while falling, something a simple button press can't get. The real highlight is the \"Super Special Move\" system: once accumulated damage exceeds 100% (or, in Stamina mode, remaining stamina drops below about a third), a \"Go\" sign appears, unlocking \"Power Geyser\" and \"Buster Wolf\" — devastating command-input finishers otherwise unusable. Reversing the input direction sends them out the other way, and they open with Super Armor, letting him withstand and beat out something like a jab. The Final Smash \"Triple Wolf\" is built with the same idea: \"Triple Geyser\" catches multiple opponents while chaining straight into \"Power Dunk\" and \"Buster Wolf\" on whoever was hit first. It's a moveset that rewards learning the commands — every move always has a safe, simple alternative available, but the true ceiling of his potential lies only beyond command inputs that most fighters in Ultimate don't have.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  let updated = 0;
  for (const data of TIPS) {
    const tip = terry.tips.find(t => t.titleEn === data.titleEn);
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

  await db.fighter.update({ where: { id: terry.id }, data: { curationStatus: "approved" } });
  console.log("✅ Terry aprovado");

  // Sem FighterMove (0 registros) — newcomer DLC exclusivo do Ultimate, não é lacuna.
  // Nenhum troféu existe (newcomer DLC) — fallback via FighterChronicleLink já lista Fatal Fury/KOF corretamente.
  // Sem timing de vídeo novo fornecido. SSBU bio JP ausente — aprovado direto, padrão já estabelecido.

  await db.$disconnect();
}
main().catch(console.error);
