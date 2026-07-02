import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "The ace pilot of the mercenary team \"Star Fox,\" led by Fox. From the name \"Falco,\" people tend to assume he's modeled after a falcon, but his actual model is a pheasant.",
    pt: "O ás piloto do esquadrão mercenário \"Star Fox,\" liderado pelo Fox. Pelo nome \"Falco,\" as pessoas tendem a presumir que ele é baseado em um falcão, mas seu modelo real é um faisão.",
  },
  SSBB: {
    jpEn: "His real name is Falco Lombardi. A pilot for \"Star Fox.\" He once led a space biker gang and possesses considerable piloting skill, a true talent. He puts on a cool front and sometimes shows a lack of cooperation, but in reality he's a passionate hothead who cares about the team more than anyone. He once left \"Star Fox\" for a time.",
    pt: "Seu nome verdadeiro é Falco Lombardi. Um piloto da \"Star Fox.\" Ele já liderou uma gangue espacial de motociclistas e possui uma habilidade de pilotagem considerável, um verdadeiro talento. Ele finge ser descolado e às vezes mostra falta de cooperação, mas na verdade é um cabeça-quente apaixonado que se importa com a equipe mais do que ninguém. Ele já deixou a \"Star Fox\" por um tempo.",
  },
  SSB4: {
    jpEn: "His name is Falco Lombardi. A skilled pilot and Fox's teammate. He's cool and lacks cooperation, but is actually a passionate hothead. It's said he once led a space biker gang. In Smash Bros., he has high jumping ability, making him well-suited to aerial combat. His moveset is well-balanced across the board. Reflector, which he kicks forward, is useful for keeping opponents in check.",
    pt: "Seu nome é Falco Lombardi. Um piloto habilidoso e companheiro de equipe do Fox. Ele é descolado e falta cooperação, mas na verdade é um cabeça-quente apaixonado. Diz-se que já liderou uma gangue espacial de motociclistas. Em Smash Bros., ele tem alta capacidade de pulo, tornando-o adequado para combate aéreo. Seu conjunto de golpes é bem equilibrado em geral. O Reflector, que ele chuta para frente, é útil para manter os adversários sob controle.",
  },
  SSBM: {
    jpEn: "A pilot belonging to \"Star Fox.\" His piloting skills are certain, but he carries a cynical attitude. He refuses to talk to anyone about his life before joining the team, but it's believed he did quite reckless things in the past. He's not very cooperative, but he does show a fair amount of respect to those whose skill surpasses his own.",
    pt: "Um piloto pertencente à \"Star Fox.\" Suas habilidades de pilotagem são certeiras, mas ele carrega uma atitude cínica. Ele se recusa a falar com qualquer um sobre sua vida antes de entrar na equipe, mas acredita-se que fez coisas bem imprudentes no passado. Ele não é muito cooperativo, mas demonstra um bom respeito por aqueles cuja habilidade supera a sua.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "His jumping ability is top-tier. On the other hand, his power is modest. His long limb reach gives him a different spacing and strategy compared to Fox. The recoilless \"Blaster\" can no longer be rapid-fired, but now makes opponents flinch on hit — effective for stopping their approach. Falco Phantasm has a shorter travel distance. B: Blaster, Side+B: Falco Phantasm",
    pt: "Sua capacidade de pulo é de nível máximo. Por outro lado, seu poder é modesto. O longo alcance de seus membros lhe dá um posicionamento e estratégia diferentes em comparação ao Fox. O \"Blaster\" sem recuo não pode mais ser disparado em rajada, mas agora faz os adversários recuarem ao acertar — eficaz para impedir sua aproximação. O Falco Phantasm tem uma distância de percurso menor. B: Blaster, Lateral+B: Falco Phantasm",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "Having a high jump has many benefits, but it also comes with weaknesses in offense and defense, so understanding his strengths and weaknesses well is crucial. His maximum fall speed is fairly fast, so he can sometimes fall short of recovering as intended. Reflector launches an opponent straight up on hit. It's secretly the fastest-coming-out attack he has. Up+B: Fire Bird, Down+B: Reflector",
    pt: "Ter um pulo alto tem muitos benefícios, mas também vem com fraquezas em ataque e defesa, então entender bem seus pontos fortes e fracos é crucial. Sua velocidade máxima de queda é bem rápida, então às vezes ele pode não conseguir se recuperar como pretendido. O Reflector arremessa um adversário diretamente para cima ao acertar. É secretamente o ataque mais rápido que ele tem. Cima+B: Fire Bird, Baixo+B: Reflector",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "The Neutral Special, Blaster, is the same move as Fox's, but its properties are very different. The biggest difference is that it makes the opponent hit by it flinch. Being able to flinch and stop an approaching or dashing opponent is an advantage Fox doesn't have. Other differences include higher attack power and a slower rate of fire. Remember that its firing speed becomes faster when used in the air. (SFC) Star Fox (1993/02) (N64) Star Fox 64 (1997/04)",
    pt: "O Especial Neutro, Blaster, é o mesmo golpe do Fox, mas suas propriedades são muito diferentes. A maior diferença é que faz o adversário atingido recuar. Ser capaz de fazer recuar e impedir um adversário que se aproxima ou avança é uma vantagem que o Fox não tem. Outras diferenças incluem maior poder de ataque e uma taxa de disparo mais lenta. Lembre-se de que sua velocidade de disparo fica mais rápida quando usado no ar. (SFC) Star Fox (1993/02) (N64) Star Fox 64 (1997/04)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Falco's Origins", titleJp: "ファルコの初登場作品", textJp: "ファルコの初登場作品は、１９９３年に発売された『スターフォックス』。クールで協調性に欠けるものの、実は熱血漢。パイロットとしてのウデは確か。", titleJpEn: "Falco's Origins", textJpEn: "Falco's debut was in \"Star Fox,\" released in 1993. He's cool and lacks cooperation, but is actually a passionate hothead. His skill as a pilot is certain.", titlePt: "As Origens do Falco", textPt: "O debut do Falco foi em \"Star Fox,\" lançado em 1993. Ele é descolado e falta cooperação, mas na verdade é um cabeça-quente apaixonado. Sua habilidade como piloto é certeira." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "シリーズ1作目『スターフォックス』から登場。本名「ファルコ・ランバルディ」。アーウィンの操縦においては、フォックスに並ぶほどの腕前。実はキジがモチーフ。", titleJpEn: "In His Series", textJpEn: "He has appeared since the first game in the series, \"Star Fox.\" His real name is \"Falco Lombardi.\" His skill piloting the Arwing rivals Fox's own. His actual motif is a pheasant.", titlePt: "Na Série Original", textPt: "Ele aparece desde o primeiro jogo da série, \"Star Fox.\" Seu nome verdadeiro é \"Falco Lombardi.\" Sua habilidade em pilotar o Arwing rivaliza com a do próprio Fox. Seu motivo real é um faisão." },
  { titleEn: "[★☆☆] Blaster (Neutral Special)", titleJp: "ブラスター 【通常必殺ワザ】", textJp: "フォックスのブラスターと違い、相手をひるませる。また、地上よりも空中の方が速く連射できる。", titleJpEn: "Blaster (Neutral Special)", textJpEn: "Unlike Fox's Blaster, it makes opponents flinch. It also fires faster in the air than on the ground.", titlePt: "Blaster (Especial Neutro)", textPt: "Diferente do Blaster do Fox, ele faz os adversários recuarem. Também dispara mais rápido no ar do que no chão." },
  { titleEn: "[★★☆] Additional Attacks with Blaster (Neutral Special)", titleJp: "追撃のブラスター 【通常必殺ワザ】", textJp: "上投げ、下投げ、後ろ投げをした後、相手に追撃のブラスターを発射する。相手のダメージが多い場合は、弾が届かないこともある。", titleJpEn: "Follow-up Blaster (Neutral Special)", textJpEn: "After an up throw, down throw, or back throw, he can fire a follow-up Blaster shot at the opponent. If the opponent's damage is high, the shot may not reach them.", titlePt: "Blaster de Acompanhamento (Especial Neutro)", textPt: "Após um arremesso para cima, para baixo ou para trás, ele pode disparar um tiro de Blaster de acompanhamento no adversário. Se o dano do adversário for alto, o tiro pode não alcançá-lo." },
  { titleEn: "[★★★] Falco Phantasm (Side Special)", titleJp: "ファルコビジョン 【横必殺ワザ】", textJp: "ファルコビジョンを空中で当てるとメテオ効果がある。ステージに谷間がある時は、またぐように使うと有効。", titleJpEn: "Falco Phantasm (Side Special)", textJpEn: "Hitting an opponent with Falco Phantasm in the air has a meteor effect. When a stage has a gap, using it to straddle across is effective.", titlePt: "Falco Phantasm (Especial Lateral)", textPt: "Acertar um adversário com o Falco Phantasm no ar tem efeito meteoro. Quando um palco tem uma fenda, usá-lo para atravessar é eficaz." },
  { titleEn: "[★★★] Low Air Phantasm (Side Special)", titleJp: "低空ファルコビジョン 【横必殺ワザ】", textJp: "横方向に入力しながらジャンプの直後に必殺ワザボタンを素早く押すと、低空でファルコビジョンを使える。地上で使うより移動後のスキが少し小さい。", titleJpEn: "Low Air Phantasm (Side Special)", textJpEn: "Inputting sideways and quickly pressing the special move button right after jumping lets him use Falco Phantasm at a low height. The opening after moving is slightly smaller than using it on the ground.", titlePt: "Low Air Phantasm (Especial Lateral)", textPt: "Inputar lateralmente e pressionar rapidamente o botão do golpe especial logo após pular permite usar o Falco Phantasm em baixa altura. A abertura após o movimento é um pouco menor do que usá-lo no chão." },
  { titleEn: "[★★☆] Fire Bird (Up Special)", titleJp: "ファイアバード 【上必殺ワザ】", textJp: "フォックスの「ファイアフォックス」より慣性の影響を受け、空中で横方向に移動しながら使うと、飛び立つまで少し横へ滑る特徴がある。", titleJpEn: "Fire Bird (Up Special)", textJpEn: "It's more affected by momentum than Fox's Fire Fox — using it while moving horizontally in the air causes him to slide sideways a bit before taking off.", titlePt: "Fire Bird (Especial Cima)", textPt: "É mais afetado pelo impulso do que o Fire Fox do Fox — usá-lo enquanto se move horizontalmente no ar faz com que ele deslize um pouco para o lado antes de decolar." },
  { titleEn: "[★★☆] Reflector (Down Special)", titleJp: "リフレクターシュート 【下必殺ワザ】", textJp: "蹴り出したリフレクターは、飛び道具を反射するだけでなく、けん制攻撃としても使える。", titleJpEn: "Reflector Shoot (Down Special)", textJpEn: "The kicked-out Reflector doesn't just deflect projectiles — it can also be used as a check attack.", titlePt: "Reflector Shoot (Especial Baixo)", textPt: "O Reflector chutado não apenas reflete projéteis — também pode ser usado como um ataque de intimidação." },
  { titleEn: "[★☆☆] Team Star Fox (Final Smash)", titleJp: "チームスターフォックス 【最後の切りふだ】", textJp: "戦闘機「アーウィン」に乗り込み、チームスターフォックスで総攻撃をしかける。相手がひとりの場合と、集団を巻き込んだ場合で、ファルコのセリフが変わる。", titleJpEn: "Team Star Fox (Final Smash)", textJpEn: "Boards the fighter jet \"Arwing\" and launches an all-out assault with Team Star Fox. Falco's lines change depending on whether it catches a single opponent or a group.", titlePt: "Equipe Star Fox (Final Smash)", textPt: "Embarca no caça \"Arwing\" e lança um ataque total com a Equipe Star Fox. As falas do Falco mudam dependendo se pega um único adversário ou um grupo." },
  { titleEn: "[★★☆] Tail Cutter (Down Tilt Attack)", titleJp: "テイルカッター 【下強攻撃】", textJp: "蓄積ダメージが高い相手に当てると、大きくふっとばすことができる。スキが小さいので、少ないリスクで撃墜を狙うことができる。", titleJpEn: "Tail Cutter (Down Tilt Attack)", textJpEn: "Hitting an opponent with high accumulated damage sends them flying far. Since the opening is small, it's a low-risk option for going for a KO.", titlePt: "Tail Cutter (Ataque Inclinado Baixo)", textPt: "Acertar um adversário com dano acumulado alto o arremessa para longe. Como a abertura é pequena, é uma opção de baixo risco para buscar um KO." },
  { titleEn: "[★★★] Spinning Falco Chop (Neutral Air Attack)", titleJp: "スピニングファルコチョップ 【通常空中攻撃】", textJp: "連続ヒットの最後の攻撃が当たる前に着地し、直後に弱攻撃を使うと、連続攻撃としてつながりやすい。", titleJpEn: "Spinning Falco Chop (Neutral Air Attack)", textJpEn: "Landing before the final hit of the multi-hit sequence connects, then immediately using a jab, makes it easy to chain into a combo.", titlePt: "Spinning Falco Chop (Ataque Aéreo Neutro)", textPt: "Pousar antes que o último golpe da sequência de múltiplos acertos conecte, e então usar imediatamente um soco fraco, torna fácil encadear em um combo." },
  { titleEn: "[★☆☆] Corkscrew Meteor (Down Air Attack)", titleJp: "メテオスクリュー 【下空中攻撃】", textJp: "フォックスと比べて攻撃するまでが遅く、連続ヒットはしないが、最初の蹴りだしに、メテオ効果がある。", titleJpEn: "Corkscrew Meteor (Down Air Attack)", textJpEn: "Compared to Fox's version, it's slower to come out and doesn't hit multiple times, but the very first kick has a meteor effect.", titlePt: "Corkscrew Meteor (Ataque Aéreo Baixo)", textPt: "Comparado à versão do Fox, é mais lento para sair e não acerta múltiplas vezes, mas o primeiro chute tem efeito meteoro." },
  { titleEn: "[★☆☆] The Three Highest Jumpers", titleJp: "ジャンプ力ランキングBEST３", textJp: "１位は「ファルコ」、２位は「ゲッコウガ」、３位は「ゼロスーツサムス」。わずかな差で、４位は「ルイージ」。", titleJpEn: "Top 3 Highest Jumpers", textJpEn: "1st place: \"Falco.\" 2nd place: \"Greninja.\" 3rd place: \"Zero Suit Samus.\" 4th place, by a narrow margin: \"Luigi.\"", titlePt: "Top 3 Pulos Mais Altos", textPt: "1º lugar: \"Falco.\" 2º lugar: \"Greninja.\" 3º lugar: \"Zero Suit Samus.\" 4º lugar, por uma pequena margem: \"Luigi.\"" },
];

async function main() {
  const falco = await db.fighter.findFirst({
    where: { name: "Falco" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!falco) { console.log("Falco not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: falco.id },
    data: {
      curatorOverviewEn: "Falco Lombardi, Fox's teammate and Star Fox's ace pilot, trades Fox's raw speed for a devastating aerial game — the highest jump in Smash, a hard-hitting flinch-inducing Blaster, and powerful aerial attacks make him a genuine threat above the stage. His moves come out slower and he falls faster than Fox, demanding sharper timing, but reward players who dominate vertical space and aerial combat.",
      curatorOverviewPt: "Falco Lombardi, companheiro de equipe do Fox e ás piloto da Star Fox, troca a velocidade bruta do Fox por um jogo aéreo devastador — o pulo mais alto do Smash, um Blaster contundente que faz o adversário recuar, e ataques aéreos poderosos o tornam uma ameaça genuína acima do palco. Seus golpes saem mais lentamente e ele cai mais rápido que o Fox, exigindo um timing mais preciso, mas recompensa jogadores que dominam o espaço vertical e o combate aéreo.",
      curatorOverviewJp: "フォックスの仲間でありスターフォックスのエースパイロット、ファルコ・ランバルディは、フォックスの生のスピードの代わりに、破壊的な空中戦を手に入れた――スマブラ屈指の高いジャンプ力、相手をひるませる強力なブラスター、そして強力な空中ワザが、ステージ上空で本物の脅威となる。ワザの発生はフォックスより遅く、落下速度も速いため、より正確なタイミングが求められるが、垂直方向の空間と空中戦を制するプレイヤーに報いるファイターだ。",
      curatorOverviewJpEn: "Fox's teammate and Star Fox's ace pilot, Falco Lombardi trades Fox's raw speed for a devastating aerial game — Smash's highest jump, a powerful flinch-inducing Blaster, and strong aerial moves make him a real threat above the stage. His moves come out slower than Fox's and he falls faster, demanding more precise timing, but reward players who control vertical space and aerial combat.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = falco.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 4896-4932 -> 1539-1558 (25:39-25:58 ZoomZike VLC confirmed)
  const bioSsbm = falco.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 1539, videoEndSec: 1558 } });
    console.log("✅ Bio SSBM video: 4896-4932 -> 1539-1558 (25:39-25:58)");
  }

  // Fix Trophy "Falco Lombardi" SSBM to match
  const trophy = await db.collectible.findFirst({ where: { name: "Falco Lombardi", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (trophy) {
    await db.collectible.update({ where: { id: trophy.id }, data: { videoStartSec: 1539, videoEndSec: 1558 } });
    console.log(`✅ Trophy Falco Lombardi SSBM: ${trophy.videoStartSec}-${trophy.videoEndSec} -> 1539-1558`);
  }

  // Moves EN+PT+JpEn
  for (const m of falco.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = falco.tips.find(t => t.titleEn === data.titleEn);
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
