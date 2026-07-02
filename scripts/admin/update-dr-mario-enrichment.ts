import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "Regarding Dr. Mario as a fighter, see respectively: \"Dr. Mario (DX),\" \"Dr. Mario (3DS/Wii U),\" and \"Dr. Mario (SP).\"",
    pt: "Dr. Mario (ドクターマリオ, Doctor Mario) é um personagem jogável em Super Smash Bros. Ultimate. Ele foi oficialmente revelado em 12 de junho de 2018, junto com R.O.B., Duck Hunt e o restante do elenco de retorno. Embora o Dr. Mario continue sendo um clone próximo do Mario, ele não é classificado como um Echo Fighter. Como tal, Dr. Mario é classificado como Lutador #18.",
  },
  SSBM: {
    jpEn: "Nurse Peach cries out, \"A new strain of virus has been discovered and it's multiplying rapidly!\" And so, with a freshly prepared miracle cure in hand, Dr. Mario sets out to disinfect the viruses. \"Dr. Mario\" is a so-called falling-block puzzle game. You line up capsules matching the virus colors to clear them away.",
    pt: "A enfermeira Peach grita: \"Uma nova cepa de vírus foi descoberta e está se multiplicando rapidamente!\" E assim, com um remédio milagroso recém-preparado em mãos, o Dr. Mario parte para desinfetar os vírus. \"Dr. Mario\" é um chamado jogo de quebra-cabeça de blocos caindo. Você alinha cápsulas que combinam com as cores dos vírus para eliminá-los.",
  },
  SSB4: {
    jpEn: "Mario as he appears in an action puzzle game released in 1990. In stark contrast to his usual adventurer style, he appears here as a \"doctor\" clad in a white coat. In Smash Bros., he's a well-rounded fighter who throws medicine capsules and gracefully deflects opponents' attacks with his white coat. Compared to regular Mario, he's a bit sluggish, but the power of each of his moves is increased.",
    pt: "O Mario como aparece em um jogo de quebra-cabeça de ação lançado em 1990. Em forte contraste com seu estilo aventureiro habitual, ele aparece aqui como um \"médico\" vestindo um jaleco branco. Em Smash Bros., ele é um lutador versátil que arremessa cápsulas de remédio e desvia graciosamente os ataques dos adversários com seu jaleco branco. Comparado ao Mario normal, ele é um pouco mais lento, mas o poder de cada um de seus golpes é maior.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "His performance doesn't differ much from Mario's, but a lot has quietly changed. Lack of exercise has left him a touch slower on his feet, and he throws capsules instead of fireballs. They deal slightly more damage, and their bounce and flight trajectory differ. Landing a hit produces the distinctive sound of a virus being cleared. B: Capsule, Side+B: Super Sheet",
    pt: "Seu desempenho não difere muito do Mario, mas muita coisa mudou silenciosamente. A falta de exercício o deixou um pouco mais lento nos pés, e ele arremessa cápsulas em vez de bolas de fogo. Elas causam um pouco mais de dano, e seu quique e trajetória de voo são diferentes. Acertar um golpe produz o som característico de um vírus sendo eliminado. B: Capsule, Lateral+B: Super Sheet",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "Various things have changed, sometimes slightly, sometimes significantly, but he can basically be played the same way as Mario. Nothing feels out of place, but there are differences — for example, compared to Mario's Cape, Super Sheet's hitbox is shorter horizontally and taller vertically. Dr. Tornado sends opponents flying in a different direction once the move fully connects. Up+B: Super Jump Punch, Down+B: Dr. Tornado",
    pt: "Várias coisas mudaram, às vezes ligeiramente, às vezes significativamente, mas ele basicamente pode ser jogado da mesma forma que o Mario. Nada parece fora do lugar, mas há diferenças — por exemplo, comparado à Capa do Mario, a hitbox do Super Sheet é mais curta horizontalmente e mais alta verticalmente. O Dr. Tornado arremessa os adversários em uma direção diferente assim que o golpe conecta completamente. Cima+B: Super Jump Punch, Baixo+B: Dr. Tornado",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Dr. Mario has a bit of a different flavor from regular Mario. Specifically, his move power is higher compared to Mario, but he's heavier. Because of this, he's slightly weaker at recovering. He could be described as an all-rounder leaning a bit toward the heavyweight side. Unlike Mario, Dr. Tornado is a Down Special that catches multiple opponents and launches them at the end. It can move left and right, and mashing the button lets him rise. (FC) Dr. Mario (1990/07) (Wii) Dr. Mario & Germ Buster (2008/03)",
    pt: "O Dr. Mario tem um sabor um pouco diferente do Mario normal. Especificamente, o poder de seus golpes é maior comparado ao Mario, mas ele é mais pesado. Por causa disso, ele é um pouco mais fraco na recuperação. Ele pode ser descrito como um lutador versátil inclinado um pouco para o lado peso-pesado. Diferente do Mario, o Dr. Tornado é um Especial Baixo que pega múltiplos adversários e os arremessa no final. Pode se mover para esquerda e direita, e apertar o botão repetidamente permite que ele suba. (FC) Dr. Mario (1990/07) (Wii) Dr. Mario & Germ Buster (2008/03)",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 1,
    en: "Dr. Mario's Final Smash, where he spreads his arms wide and launches two massive capsules forward. The two capsules fly out in a spiraling pattern, clearing away nearby viruses as they go. Its wide attack range makes it easy to catch opponents, who take continuous damage and get pushed offstage. Escaping is also difficult.",
    pt: "O Final Smash do Dr. Mario, onde ele estende os braços e lança duas cápsulas enormes para frente. As duas cápsulas voam em um padrão espiral, eliminando os vírus próximos enquanto avançam. Seu amplo alcance de ataque facilita pegar os adversários, que sofrem dano contínuo e são empurrados para fora do palco. Escapar também é difícil.",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Dr. Mario's Origins", titleJp: "ドクターマリオの初登場作品", textJp: "『ドクターマリオ』は、１９９０年に発売されたパズルゲーム。マリオは、ある病院でウイルスの研究をし、特効薬を作っていた。", titleJpEn: "Dr. Mario's Origins", textJpEn: "\"Dr. Mario\" is a puzzle game released in 1990. Mario was researching viruses at a hospital and developing a miracle cure.", titlePt: "As Origens do Dr. Mario", textPt: "\"Dr. Mario\" é um jogo de quebra-cabeça lançado em 1990. O Mario estava pesquisando vírus em um hospital e desenvolvendo um remédio milagroso." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "ファミリーコンピュータとゲームボーイで、同時発売された『ドクターマリオ』。白衣を着たマリオが、特効薬のカプセルを使って、ウイルスを退治するパズルゲーム。", titleJpEn: "In His Series", textJpEn: "\"Dr. Mario\" was released simultaneously for the Family Computer and Game Boy. It's a puzzle game where Mario, wearing a white coat, uses miracle cure capsules to defeat viruses.", titlePt: "Na Série Original", textPt: "\"Dr. Mario\" foi lançado simultaneamente para o Family Computer e Game Boy. É um jogo de quebra-cabeça onde o Mario, vestindo um jaleco branco, usa cápsulas de remédio milagroso para derrotar vírus." },
  { titleEn: "[★☆☆] Capsules (Neutral Special)", titleJp: "カプセル 【通常必殺ワザ】", textJp: "マリオのファイアボールより、大きく跳ねながら飛ぶ。物理系の飛び道具なので、エネルギーを吸収する必殺ワザは効かない。", titleJpEn: "Capsules (Neutral Special)", textJpEn: "It bounces higher as it flies compared to Mario's Fireball. Since it's a physical projectile, special moves that absorb energy don't work against it.", titlePt: "Capsules (Especial Neutro)", textPt: "Ela quica mais alto enquanto voa em comparação com a Fireball do Mario. Como é um projétil físico, golpes especiais que absorvem energia não funcionam contra ela." },
  { titleEn: "[★★★] Capsule Types (Neutral Special)", titleJp: "カプセルの種類 【通常必殺ワザ】", textJp: "カプセルは全部で９種類。赤、青、黄色の組み合わせでできている。出現はランダムで、どの色が出ても効果に違いは無い。", titleJpEn: "Capsule Types (Neutral Special)", textJpEn: "There are nine total capsule types, made up of combinations of red, blue, and yellow. Which one appears is random, but there's no difference in effect regardless of color.", titlePt: "Tipos de Capsules (Especial Neutro)", textPt: "Existem nove tipos totais de cápsulas, feitas de combinações de vermelho, azul e amarelo. Qual delas aparece é aleatório, mas não há diferença de efeito independente da cor." },
  { titleEn: "[★☆☆] Super Sheet (Side Special)", titleJp: "スーパーシーツ 【横必殺ワザ】", textJp: "マリオのマントに比べて、横方向の射程距離が短い。その分上下には広い範囲に攻撃できるので、相手を少し引きつけて使うのがコツ。", titleJpEn: "Super Sheet (Side Special)", textJpEn: "Compared to Mario's Cape, its horizontal reach is shorter. In exchange, it covers a wider range vertically, so the trick is to lure the opponent in a bit before using it.", titlePt: "Super Sheet (Especial Lateral)", textPt: "Comparado à Capa do Mario, seu alcance horizontal é menor. Em troca, cobre uma faixa mais ampla verticalmente, então o truque é atrair o adversário um pouco antes de usá-lo." },
  { titleEn: "[★☆☆] Super Jump Punch (Up Special)", titleJp: "スーパージャンプパンチ 【上必殺ワザ】", textJp: "連続ヒットはしないがダメージが大きく、ワザの出始めに、強いふっとばし力を持つ。出るタイミングが早く、シールドキャンセルからも出せるため、混戦でも使いやすい。", titleJpEn: "Super Jump Punch (Up Special)", textJpEn: "It doesn't hit multiple times, but deals high damage, with strong knockback right at the start of the move. Since it comes out quickly and can be used out of a shield cancel, it's easy to use even in chaotic team battles.", titlePt: "Super Jump Punch (Especial Cima)", textPt: "Não acerta múltiplas vezes, mas causa alto dano, com forte poder de arremesso bem no início do movimento. Como sai rapidamente e pode ser usado a partir de um cancelamento de escudo, é fácil de usar mesmo em batalhas caóticas." },
  { titleEn: "[★★☆] Dr. Tornado (Down Special)", titleJp: "ドクタートルネード 【下必殺ワザ】", textJp: "ワザの途中でボタンを連打することで、上昇することができる。終了時のスキが大きいので復帰に活用するのは難しい。", titleJpEn: "Dr. Tornado (Down Special)", textJpEn: "Mashing the button partway through the move lets him rise. Since there's a large opening at the end, it's difficult to rely on for recovery.", titlePt: "Dr. Tornado (Especial Baixo)", textPt: "Apertar o botão repetidamente no meio do movimento permite que ele suba. Como há uma grande abertura no final, é difícil confiar nele para recuperação." },
  { titleEn: "[★☆☆] Doctor Finale (Final Smash)", titleJp: "ドクターファイナル 【最後の切りふだ】", textJp: "特大のカプセルが２つ、相手を巻き込んで飛んでいく。発動中は無敵で、空中で使うと少しの間だけ落下しない。", titleJpEn: "Doctor Finale (Final Smash)", textJpEn: "Two oversized capsules fly out, catching opponents in their path. He's invincible while it's active, and using it in the air prevents falling for a short time.", titlePt: "Doctor Finale (Final Smash)", textPt: "Duas cápsulas enormes voam, pegando os adversários em seu caminho. Ele fica invencível enquanto está ativo, e usá-lo no ar impede a queda por um curto tempo." },
  { titleEn: "[★★☆] Ear, Nose, and Throat (Up Smash)", titleJp: "スマッシュヘッドバット 【上スマッシュ攻撃】", textJp: "後方斜め上方向に、大きくふっとばす。ガケ際に追いつめられた時に当てられれば、形勢逆転できる。", titleJpEn: "Smash Headbutt (Up Smash)", textJpEn: "Sends opponents flying far in a diagonal upward-backward direction. If it connects when cornered at the ledge, it can turn the tables.", titlePt: "Smash Headbutt (Smash Cima)", textPt: "Arremessa os adversários longe em uma direção diagonal para cima e para trás. Se conectar quando encurralado na borda, pode virar o jogo." },
  { titleEn: "[★★☆] Dr. Kick (Neutral Air)", titleJp: "ドクターキック 【通常空中攻撃】", textJp: "出始めのダメージが低く、終わりのほうが高くなる珍しいワザ。うまく終わりぎわを当てて、ふっとばそう。", titleJpEn: "Dr. Kick (Neutral Air)", textJpEn: "An unusual move where the damage starts low and increases toward the end. Try to land the tail end for a stronger launch.", titlePt: "Dr. Kick (Ataque Aéreo Neutro)", textPt: "Um movimento incomum onde o dano começa baixo e aumenta em direção ao final. Tente acertar o final para um arremesso mais forte." },
  { titleEn: "[★★★] Dr. Punch (Forward Air Attack)", titleJp: "ドクターグーパンチ 【前空中攻撃】", textJp: "マリオと違い、どのタイミングで当ててもメテオ効果が発生しない。拳が正面に来た時の攻撃力が一番強く、相手を大きくふっとばす。", titleJpEn: "Dr. Punch (Forward Air Attack)", textJpEn: "Unlike Mario's, no meteor effect occurs regardless of when it connects. Its power is greatest when the fist is directly in front, sending opponents flying far.", titlePt: "Dr. Punch (Ataque Aéreo Frontal)", textPt: "Diferente do golpe do Mario, nenhum efeito meteoro ocorre independente de quando conecta. Seu poder é maior quando o punho está bem à frente, arremessando os adversários para longe." },
  { titleEn: "[★☆☆] CLEAR! (Down Air Attack)", titleJp: "全力メテオキック 【下空中攻撃】", textJp: "マリオの下空中攻撃とは違い、メテオを狙える。強力だが、復帰は苦手なので狙いすぎに注意。", titleJpEn: "Full-Power Meteor Kick (Down Air Attack)", textJpEn: "Unlike Mario's down air attack, this one can go for a meteor smash. It's powerful, but since he's weak at recovering, be careful not to overuse it.", titlePt: "Chute Meteoro Total (Ataque Aéreo Baixo)", textPt: "Diferente do ataque aéreo baixo do Mario, este pode buscar um meteoro. É poderoso, mas como ele é fraco na recuperação, cuidado para não usá-lo demais." },
  { titleEn: "[★★☆] Hospital Bed (Downward Throw)", titleJp: "スルーダウン 【下投げ】", textJp: "ドクターマリオの下投げは、マリオと違い投げた相手がより急な角度で跳ね上がるので、空中攻撃などで追撃を狙いやすい。", titleJpEn: "Through Down (Down Throw)", textJpEn: "Unlike Mario's, Dr. Mario's down throw launches the thrown opponent at a steeper angle, making it easier to follow up with an aerial attack.", titlePt: "Through Down (Arremesso Baixo)", textPt: "Diferente do Mario, o arremesso baixo do Dr. Mario lança o adversário arremessado em um ângulo mais íngreme, tornando mais fácil fazer um acompanhamento com um ataque aéreo." },
];

async function main() {
  const dm = await db.fighter.findFirst({
    where: { name: "Dr. Mario" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!dm) { console.log("Dr. Mario not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: dm.id },
    data: {
      curatorOverviewEn: "Dr. Mario, the medically-inclined counterpart to Mario, trades speed and combo potential for raw power and weight. His Megavitamin capsules hit harder and bounce differently than Mario's Fireballs, and moves like Super Jump Punch and Dr. Tornado carry heavier knockback. A slower, more deliberate heavyweight variant of Mario's balanced toolkit, rewarding players who land clean, damaging hits over rapid pressure.",
      curatorOverviewPt: "Dr. Mario, a versão médica do Mario, troca velocidade e potencial de combo por poder bruto e peso. Suas cápsulas de Megavitamina batem mais forte e quicam diferente das Fireballs do Mario, e golpes como Super Jump Punch e Dr. Tornado carregam mais arremesso. Uma variante mais lenta e deliberada, peso-pesada, do kit equilibrado do Mario, recompensando jogadores que acertam golpes limpos e danosos em vez de pressão rápida.",
      curatorOverviewJp: "医師の顔を持つマリオの分身、ドクターマリオは、スピードとコンボ性能の代わりに、生の威力と重さを手に入れた。彼のメガビタミンカプセルは、マリオのファイアボールよりも強く、跳ね方も異なる。スーパージャンプパンチやドクタートルネードといったワザは、より重いふっとばし力を持つ。マリオのバランス型のワザセットを、より遅く、より慎重な重量級として再構築したファイターであり、素早い圧力よりも一撃一撃を確実に決めるプレイヤーに適している。",
      curatorOverviewJpEn: "Dr. Mario, Mario's medically-styled counterpart, trades speed and combo potential for raw power and weight. His Megavitamin capsules hit harder than Mario's Fireballs and bounce differently, and moves like Super Jump Punch and Dr. Tornado carry heavier knockback. He reworks Mario's balanced toolkit into a slower, more deliberate heavyweight, suiting players who land solid, deliberate hits over rapid pressure.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 3 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = dm.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Moves EN+PT+JpEn
  for (const m of dm.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = dm.tips.find(t => t.titleEn === data.titleEn);
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
