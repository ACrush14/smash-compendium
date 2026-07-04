import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "Joins the fight from \"Final Fantasy VII.\" The massive single-edged Buster Sword is a memento from Zack, and Cloud's beloved blade. As a former SOLDIER of the Shinra Company, he was living life as a mercenary. Taking on a request from Avalanche, the resistance opposing Shinra, to blow up a Mako Reactor became the catalyst that set Cloud's own fate into motion.",
    pt: "Entra na luta vindo de \"Final Fantasy VII\". A enorme espada de um único fio, a Buster Sword, é uma lembrança de Zack e a lâmina querida de Cloud. Como ex-SOLDIER da Shinra Company, ele vivia como mercenário. Aceitar um pedido da Avalanche, a resistência que se opõe à Shinra, para explodir um Reator Mako se tornou o catalisador que colocou o destino do próprio Cloud em movimento.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "反神羅組織アバランチに雇われており、「元ソルジャーのなんでも屋」を名乗っている。「興味ないね」が口癖。あまり多くを語ろうとしない。", titleJpEn: "In the Original Game", textJpEn: "He's employed by Avalanche, the anti-Shinra organization, calling himself a \"former SOLDIER who does odd jobs.\" \"Not interested\" is his catchphrase. He doesn't try to say much.", titlePt: "Na Série Original", textPt: "Ele é contratado pela Avalanche, a organização anti-Shinra, se autodenominando um \"ex-SOLDIER que faz bicos\". \"Não me interessa\" é sua frase característica. Ele não tenta falar muito." },
  { titleEn: "[★☆☆] Limit Break", titleJp: "リミットブレイク", textJp: "リミットゲージが最大になった状態のことを“リミットブレイク”と呼ぶ。この状態になると必殺ワザが変化し性能がアップする。", titleJpEn: "Limit Break", textJpEn: "The state when the Limit Gauge is full is called \"Limit Break.\" Entering this state changes his special moves and boosts their performance.", titlePt: "Limit Break", textPt: "O estado em que o Limit Gauge está cheio é chamado de \"Limit Break\". Entrar nesse estado muda seus golpes especiais e aumenta seu desempenho." },
  { titleEn: "[★☆☆] Limit Break's Charge", titleJp: "リミットブレイクの解除", textJp: "リミットブレイク状態は、「必殺ワザを１回使用する」「自分が撃墜される」「一定時間が経過する」のいずれかを満たすと、解除されてしまう。", titleJpEn: "Releasing Limit Break", textJpEn: "The Limit Break state ends when any of the following occur: using a special move once, being KO'd, or a set amount of time passing.", titlePt: "Encerrando o Limit Break", textPt: "O estado de Limit Break termina quando qualquer uma das seguintes situações ocorre: usar um golpe especial uma vez, ser nocauteado, ou um tempo determinado passar." },
  { titleEn: "[★☆☆] Blade Beam (Neutral Special)", titleJp: "破晄撃 【通常必殺ワザ】", textJp: "地形に沿って地面を削りながら進む衝撃波を放つ。見た目通り、縦に判定が大きいので、小ジャンプではかわされづらい。", titleJpEn: "Blade Beam (Neutral Special)", textJpEn: "Releases a shockwave that travels along the terrain, carving into the ground. As it looks, its vertical hitbox is large, making it hard to dodge with a short hop.", titlePt: "Blade Beam (Especial Neutro)", textPt: "Libera uma onda de choque que viaja ao longo do terreno, cortando o chão. Como aparenta, sua hitbox vertical é grande, tornando difícil de esquivar com um pulo curto." },
  { titleEn: "[★★☆] Blade Beam During Limit Break (Neutral Special)", titleJp: "リミットブレイク中の破晄撃 【通常必殺ワザ】", textJp: "リミットブレイク版はヒットすると炸裂して連続ヒットする。相手の蓄積ダメージが高ければそのまま撃墜も狙える！", titleJpEn: "Blade Beam During Limit Break (Neutral Special)", textJpEn: "The Limit Break version explodes on hit for multiple hits. If the opponent's accumulated damage is high enough, it can even score a KO outright!", titlePt: "Blade Beam Durante o Limit Break (Especial Neutro)", textPt: "A versão de Limit Break explode ao acertar, causando múltiplos golpes. Se o dano acumulado do adversário for alto o suficiente, pode até conseguir um nocaute diretamente!" },
  { titleEn: "[★☆☆] Blade Beam and Projectiles (Neutral Special)", titleJp: "破晄撃と飛び道具 【通常必殺ワザ】", textJp: "リミットブレイク版は相手の飛び道具と相殺せずにすり抜ける。相手の飛び道具に合わせて使えば硬直中にヒットを狙える。", titleJpEn: "Blade Beam and Projectiles (Neutral Special)", textJpEn: "The Limit Break version passes through the opponent's projectiles instead of canceling them out. Timing it with the opponent's projectile lets you aim for a hit while they're in recovery.", titlePt: "Blade Beam e Projéteis (Especial Neutro)", textPt: "A versão de Limit Break atravessa os projéteis do adversário em vez de cancelá-los. Cronometrar com o projétil do adversário permite mirar um acerto enquanto ele está em recuperação." },
  { titleEn: "[★☆☆] Cross Slash (Side Special)", titleJp: "凶斬り 【横必殺ワザ】", textJp: "２回まで追加入力できる３連撃。攻撃が空振りしていると追加攻撃は出せないが、ヒットしていれば連打でも出せる。", titleJpEn: "Cross Slash (Side Special)", textJpEn: "A three-hit combo with up to two additional inputs. If the attack whiffs, the follow-up can't be performed, but if it connects, it can also be done by mashing the button.", titlePt: "Cross Slash (Especial Lateral)", textPt: "Um combo de três golpes com até dois inputs adicionais. Se o ataque errar, o acompanhamento não pode ser realizado, mas se acertar, também pode ser feito apertando o botão repetidamente." },
  { titleEn: "[★★☆] Cross Slash During Limit Break (Side Special)", titleJp: "リミットブレイク中の凶斬り 【横必殺ワザ】", textJp: "リミットブレイク版は追加入力なしで一気に凶の字を書き上げる。撃墜も狙えるふっとばし力の高さが魅力的。", titleJpEn: "Cross Slash During Limit Break (Side Special)", textJpEn: "The Limit Break version completes the full \"X\" slash in one go without needing additional inputs. Its high knockback power, capable of scoring KOs, is its appeal.", titlePt: "Cross Slash Durante o Limit Break (Especial Lateral)", textPt: "A versão de Limit Break completa todo o corte em \"X\" de uma só vez, sem precisar de inputs adicionais. Seu alto poder de arremesso, capaz de garantir nocautes, é seu grande atrativo." },
  { titleEn: "[★☆☆] Climhazzard (Up Special)", titleJp: "クライムハザード 【上必殺ワザ】", textJp: "上昇中に必殺ワザボタンを追加入力すると急降下攻撃が出る。急降下中は左右の移動ができないので復帰に使う時は注意。", titleJpEn: "Climhazzard (Up Special)", textJpEn: "Inputting the special move button again while rising triggers a rapid descent attack. Left and right movement isn't possible during the descent, so be careful when using it for recovery.", titlePt: "Climhazzard (Especial Cima)", textPt: "Inputar o botão de golpe especial novamente enquanto sobe aciona um ataque de descida rápida. Não é possível se mover para os lados durante a descida, então cuidado ao usá-lo para recuperação." },
  { titleEn: "[★★☆] Climhazzard During Limit Break (Up Special)", titleJp: "リミットブレイク中のクライムハザード 【上必殺ワザ】", textJp: "リミットブレイク版は上昇距離が大きく伸びて、横に移動もできる。復帰で使うことができれば、とても心強い！", titleJpEn: "Climhazzard During Limit Break (Up Special)", textJpEn: "The Limit Break version rises a much greater distance and can also move sideways. It's extremely reassuring when used for recovery!", titlePt: "Climhazzard Durante o Limit Break (Especial Cima)", textPt: "A versão de Limit Break sobe uma distância muito maior e também pode se mover lateralmente. É extremamente reconfortante quando usado para recuperação!" },
  { titleEn: "[★☆☆] Limit Charge (Down Special)", titleJp: "リミットチャージ 【下必殺ワザ】", textJp: "ためている最中に攻撃を受けると、リミットゲージが減ってしまう。相手の行動や位置を確認して、安全を確保してからためるのが基本となる。", titleJpEn: "Limit Charge (Down Special)", textJpEn: "Getting hit while charging reduces the Limit Gauge. As a general rule, check the opponent's actions and position, and ensure safety before charging.", titlePt: "Limit Charge (Especial Baixo)", textPt: "Ser atingido enquanto carrega reduz o Limit Gauge. Como regra geral, verifique as ações e a posição do adversário, e garanta segurança antes de carregar." },
  { titleEn: "[★☆☆] Canceling Limit Charge (Down Special)", titleJp: "リミットチャージのキャンセル 【下必殺ワザ】", textJp: "チャージ中にシールドボタン、スティック左右入力、またはジャンプで、チャージ行動をキャンセルできる。スキを見つけて効率よくためよう。", titleJpEn: "Canceling Limit Charge (Down Special)", textJpEn: "The charging action can be canceled during charge with the shield button, a left or right stick input, or a jump. Find openings and charge efficiently.", titlePt: "Cancelando o Limit Charge (Especial Baixo)", textPt: "A ação de carregar pode ser cancelada durante a carga com o botão de escudo, um input lateral no analógico, ou um pulo. Encontre aberturas e carregue com eficiência." },
  { titleEn: "[★★☆] Finishing Touch (Down Special)", titleJp: "画竜点睛 【下必殺ワザ】", textJp: "リミットブレイク中に下必殺ワザを出すと、「画竜点睛」になる。竜巻の威力は低いがふっとばし力は高く、撃墜を狙いやすい。", titleJpEn: "Finishing Touch (Down Special)", textJpEn: "Using the Down Special during Limit Break becomes \"Finishing Touch.\" The tornado has low damage but high knockback power, making it easy to aim for a KO.", titlePt: "Finishing Touch (Especial Baixo)", textPt: "Usar o especial baixo durante o Limit Break se torna \"Finishing Touch\". O tornado tem baixo dano, mas alto poder de arremesso, tornando fácil mirar um nocaute." },
  { titleEn: "[★☆☆] Omnislash (Final Smash)", titleJp: "超究武神覇斬 【最後の切りふだ】", textJp: "奇数カラーでは、相手を空中に斬り上げ、激しく斬りつけ、地面に叩きつけるように斬り下ろす。地面に叩きつけた時の衝撃で、周囲の相手もまとめてふっとばす。", titleJpEn: "Omnislash (Final Smash)", textJpEn: "With odd-numbered colors, he slashes the opponent up into the air, strikes them fiercely, and finishes with a downward slash that slams them into the ground. The impact of the slam launches any nearby opponents as well.", titlePt: "Omnislash (Final Smash)", textPt: "Com as cores ímpares, ele corta o adversário para o ar, o golpeia com fúria e termina com um corte para baixo que o arremessa contra o chão. O impacto do arremesso também lança quaisquer adversários próximos." },
  { titleEn: "[★☆☆] Omnislash Ver. 5 (Final Smash)", titleJp: "超究武神覇斬ver.5 【最後の切りふだ】", textJp: "偶数カラーでは、相手を空中に斬り上げた後、６本に分離した剣で次々と斬りつけ、とどめに斬り下ろす。奇数カラーの切りふだと、与えるダメージや、かかる時間は同じ。", titleJpEn: "Omnislash Ver. 5 (Final Smash)", textJpEn: "With even-numbered colors, after slashing the opponent up into the air, he strikes them repeatedly with a sword split into six blades, finishing with a downward slash. Damage dealt and time taken are the same as the odd-numbered Final Smash.", titlePt: "Omnislash Ver. 5 (Final Smash)", textPt: "Com as cores pares, depois de cortar o adversário para o ar, ele o golpeia repetidamente com uma espada dividida em seis lâminas, terminando com um corte para baixo. O dano causado e o tempo gasto são os mesmos do Final Smash de cores ímpares." },
  { titleEn: "[★☆☆] Sliding (Down Tilt Attack)", titleJp: "スライディング 【下強攻撃】", textJp: "姿勢の低いスライディングキック。一定の距離を前進でき、位置が高い飛び道具の下をくぐって抜けることができる。", titleJpEn: "Sliding (Down Tilt Attack)", textJpEn: "A low-profile sliding kick. It advances a set distance forward and can pass underneath projectiles positioned high up.", titlePt: "Sliding (Ataque Baixo)", textPt: "Um chute deslizante de perfil baixo. Avança uma distância determinada para frente e pode passar por baixo de projéteis posicionados no alto." },
  { titleEn: "[★☆☆] Triple Buster (Side Smash Attack)", titleJp: "トリプルバスター 【横スマッシュ攻撃】", textJp: "素早く３回斬るワザ。３段目の攻撃力とふっとばし力が高い。初段は攻撃力が低いので、カウンターを受けても被害が少ない。", titleJpEn: "Triple Buster (Side Smash Attack)", textJpEn: "A move that slashes three times in quick succession. The third hit has high damage and knockback power. The first hit deals low damage, so even if it's countered, the damage taken is small.", titlePt: "Triple Buster (Ataque Smash Lateral)", textPt: "Um golpe que corta três vezes em rápida sucessão. O terceiro golpe tem alto dano e poder de arremesso. O primeiro golpe causa pouco dano, então mesmo se contra-atacado, o dano recebido é pequeno." },
  { titleEn: "[★☆☆] Double Thrust (Down Smash Attack)", titleJp: "ダブルスラスト 【下スマッシュ攻撃】", textJp: "前後に剣を突いて、ヒットした相手を自分の真後ろに飛ばす。ガケを背負っている状況で出せば、不利な状況を変えられる。", titleJpEn: "Double Thrust (Down Smash Attack)", textJpEn: "Thrusts the sword forward and backward, launching any opponent hit directly behind him. Using it with his back to the ledge can turn an unfavorable situation around.", titlePt: "Double Thrust (Ataque Smash Baixo)", textPt: "Estoca a espada para frente e para trás, lançando qualquer adversário atingido diretamente para trás dele. Usá-lo com as costas para a borda pode reverter uma situação desfavorável." },
  { titleEn: "[★☆☆] Meteor Slash (Forward Air Attack)", titleJp: "メテオスラッシュ 【前空中攻撃】", textJp: "頭の後ろから大きく振りかぶって目の前に剣を叩きつける攻撃。剣の先端を当てるようにするとメテオ効果がある。", titleJpEn: "Meteor Slash (Forward Air Attack)", textJpEn: "An attack where he winds up big from behind his head and slams the sword down in front of him. Hitting with the tip of the sword gives it a meteor effect.", titlePt: "Meteor Slash (Ataque Aéreo Frente)", textPt: "Um ataque em que ele arma um golpe grande por trás da cabeça e crava a espada à frente. Acertar com a ponta da espada dá a ele um efeito meteoro." },
];

async function main() {
  const cloud = await db.fighter.findFirst({
    where: { name: "Cloud" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!cloud) { console.log("Cloud not found"); return; }

  await db.fighter.update({
    where: { id: cloud.id },
    data: {
      curatorOverviewEn: "Cloud is built entirely around Limit Break — a temporary power-up state that transforms every special move into a stronger version once his gauge fills. Limit Charge fuels the gauge but leaves him vulnerable while doing so, so timing when to charge is as important as any of his attacks. Once active, Blade Beam multi-hits and can even KO outright, Cross Slash unloads its full three-hit combo instantly, Climhazzard turns into an excellent vertical-and-horizontal recovery, and his Down Special becomes Finishing Touch, a low-damage tornado that reliably KOs at absurdly low percents. His Omnislash Final Smash is one of the most visually devastating in the game. The tradeoff for all this power is a resource that has to be earned safely and spent wisely — Cloud rewards patient charging and precise timing over constant aggression.",
      curatorOverviewPt: "Cloud é construído inteiramente em torno do Limit Break — um estado temporário de poder aumentado que transforma cada golpe especial em uma versão mais forte assim que seu medidor enche. Limit Charge alimenta o medidor, mas o deixa vulnerável enquanto isso, então cronometrar quando carregar é tão importante quanto qualquer um de seus ataques. Uma vez ativo, Blade Beam acerta múltiplas vezes e pode até nocautear diretamente, Cross Slash libera seu combo completo de três golpes instantaneamente, Climhazzard se torna uma excelente recuperação vertical e horizontal, e seu especial baixo se torna Finishing Touch, um tornado de baixo dano que nocauteia de forma confiável em porcentagens absurdamente baixas. Seu Final Smash Omnislash é um dos mais devastadores visualmente do jogo. A contrapartida de todo esse poder é um recurso que precisa ser conquistado com segurança e gasto com sabedoria — Cloud recompensa carga paciente e cronometragem precisa em vez de agressividade constante.",
      curatorOverviewJp: "クラウドは完全に「リミットブレイク」を軸に組み立てられている――ゲージが満タンになると、すべての必殺ワザがより強力なバージョンに変化する一時的な強化状態だ。「リミットチャージ」はゲージを溜める手段だが、その間は無防備になるため、いつ溜めるかのタイミングは、彼のどの攻撃にも劣らず重要だ。発動中は、「破晄撃」が連続ヒットし一撃必殺すら狙えるようになり、「凶斬り」は追加入力なしで３連撃を即座に繰り出し、「クライムハザード」は縦横に優れた復帰技へと変わり、下必殺ワザは低ダメージながら異常に低い蓄積ダメージから確実に撃墜できる竜巻「画竜点睛」となる。最後の切りふだ「超究武神覇斬」は、ゲーム屈指の視覚的な迫力を誇る。この力の代償は、安全に稼ぎ、賢く使わなければならないリソースであることだ――クラウドは、絶え間ない攻勢よりも、我慢強いチャージと正確なタイミングを応えるファイターである。",
      curatorOverviewJpEn: "Cloud is built entirely around \"Limit Break\" — a temporary power-up state that transforms every special move into a stronger version once his gauge fills. \"Limit Charge\" is his means of filling the gauge, but he's left defenseless while doing so, so timing when to charge matters as much as any of his attacks. Once active, \"Blade Beam\" hits multiple times and can even secure a one-hit KO, \"Cross Slash\" instantly unleashes its three-hit combo without additional inputs, \"Climhazzard\" becomes an excellent recovery both vertically and horizontally, and his Down Special becomes \"Finishing Touch,\" a low-damage tornado that reliably KOs even at abnormally low accumulated damage. His Final Smash, \"Omnislash,\" boasts some of the most visually striking impact in the game. The price of this power is a resource that must be earned safely and spent wisely — Cloud is a fighter who rewards patient charging and precise timing over constant offense.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = cloud.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = cloud.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "When the Limit Gauge fills completely, Cloud becomes wreathed in a blue aura and enters Limit Break, enhancing the performance of each Special move for one use. The Down Special transforms into \"Finishing Touch,\" a big overhead sword swing that kicks up tornadoes in front and behind. It deals only 1 damage but has high knockback power, making it possible to score a KO even when the opponent's damage is still low. Final Fantasy VII (1997/01)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "Quando o Limit Gauge enche completamente, o Cloud fica envolto em uma aura azul e entra em Limit Break, aprimorando o desempenho de cada golpe especial por um uso. O especial baixo se transforma em \"Finishing Touch\", um grande golpe de espada por cima da cabeça que levanta tornados à frente e atrás. Causa apenas 1 de dano, mas tem alto poder de arremesso, tornando possível conseguir um nocaute mesmo quando o dano do adversário ainda está baixo. Final Fantasy VII (1997/01)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = cloud.tips.find(t => t.titleEn === data.titleEn);
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

  // Mesmo bug do Ryu/Ken: troféu SSB4 sem CollectibleChronicleLink cairia no fallback de
  // FighterChronicleLink. Nesse caso só há 1 entrada (Final Fantasy VII, PS1, correta),
  // mas linkamos direto no troféu por robustez, evitando depender do fallback.
  const trophy = await db.collectible.findFirst({ where: { name: "Cloud", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true } });
  const ff7 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Final Fantasy VII", consoleName: "PlayStation 1" }, select: { id: true } });
  if (trophy && ff7) {
    await db.collectibleChronicleLink.upsert({
      where: { collectibleId_chronicleEntryId: { collectibleId: trophy.id, chronicleEntryId: ff7.id } },
      update: {},
      create: { collectibleId: trophy.id, chronicleEntryId: ff7.id },
    });
    console.log(`✅ Trophy "Cloud" [SSB4]: linkado ao ChronicleEntry "Final Fantasy VII" (PS1)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
