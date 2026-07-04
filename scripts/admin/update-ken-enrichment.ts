import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSB4: {
    jpEn: "Ryu's greatest rival and best friend, appearing since \"Street Fighter.\" He met Ryu as a boy and they share the same master. He married his girlfriend Eliza and has a son named Mel. He later inherited the Masters Foundation and became its president. The red headband Ryu wears around his forehead was originally a ribbon Ken used to tie back his hair, which he gave to Ryu.",
    pt: "O maior rival e melhor amigo do Ryu, presente desde \"Street Fighter\". Ele conheceu o Ryu quando era criança e compartilham o mesmo mestre. Ele se casou com sua namorada Eliza e tem um filho chamado Mel. Mais tarde, herdou a Masters Foundation e se tornou seu presidente. A bandana vermelha que o Ryu usa na testa era originalmente uma fita que o Ken usava para prender o cabelo, que ele deu ao Ryu.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] Ken's Origins", titleJp: "ケンの初登場作品", textJp: "ケンの初登場は、１９８７年のアーケード版、『ストリートファイター』。2P側のキャラクターとして初登場した。見た目以外、リュウとの違いはなかった。", titleJpEn: "Ken's Debut Work", textJpEn: "Ken's debut was in the 1987 arcade version of \"Street Fighter.\" He first appeared as the P2 character. Aside from his appearance, there was no difference from Ryu.", titlePt: "As Origens do Ken", textPt: "A estreia do Ken foi na versão de arcade de 1987 de \"Street Fighter\". Ele apareceu primeiro como o personagem do Jogador 2. Além da aparência, não havia diferença em relação ao Ryu." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "リュウの兄弟弟子にして親友、そして最大のライバル。アメリカを代表する財団、マスターズ家の御曹司。", titleJpEn: "In the Original Games", textJpEn: "Ryu's fellow disciple and best friend, and also his greatest rival. He's the heir to the Masters family, a leading American foundation.", titlePt: "Na Série Original", textPt: "Colega de treino e melhor amigo do Ryu, e também seu maior rival. Ele é o herdeiro da família Masters, uma importante fundação americana." },
  { titleEn: "[★☆☆] Hadoken (Neutral Special)", titleJp: "波動拳 【通常必殺ワザ】", textJp: "ボタンを長く押すほど、飛ぶスピード、距離、与えるダメージが強くなる。リュウとは形状が異なり、波動拳の中に手の構えが残る。", titleJpEn: "Hadoken (Neutral Special)", textJpEn: "The longer the button is held, the greater the speed, distance, and damage dealt. Its shape differs from Ryu's, with the shape of his hand stance remaining visible inside the Hadoken.", titlePt: "Hadoken (Especial Neutro)", textPt: "Quanto mais tempo o botão é segurado, maior a velocidade, distância e dano causado. Sua forma é diferente da do Ryu, com o formato da postura da mão permanecendo visível dentro do Hadoken." },
  { titleEn: "[★☆☆] Tatsumaki Senpukyaku (Side Special)", titleJp: "竜巻旋風脚 【横必殺ワザ】", textJp: "多段ヒットするため、全て当てればダメージが高い。コンボに組み込めば、大ダメージを狙える。↓↙←＋必殺ワザボタンで出すと、さらに威力アップ。", titleJpEn: "Tatsumaki Senpukyaku (Side Special)", textJpEn: "Since it hits multiple times, landing all the hits deals high damage. Working it into a combo can lead to big damage. Inputting ↓↙← + the special move button increases its power even further.", titlePt: "Tatsumaki Senpukyaku (Especial Lateral)", textPt: "Como acerta várias vezes, conectar todos os golpes causa muito dano. Incorporá-lo a um combo pode levar a um grande dano. Inputar ↓↙← + o botão de golpe especial aumenta ainda mais seu poder." },
  { titleEn: "[★☆☆] Shoryuken (Up Special / Command-Input Move)", titleJp: "昇龍拳(弱・中) 【上必殺・コマンド入力ワザ】", textJp: "コマンド入力時は、無敵時間が延び、攻撃力もアップ。弱は着地のスキが少なく、中は２ヒットする。", titleJpEn: "Shoryuken - Light/Medium (Up Special / Command-Input Move)", textJpEn: "Using the command input extends the invincibility time and boosts attack power. The light version leaves a smaller opening on landing, while the medium version hits twice.", titlePt: "Shoryuken - Fraco/Médio (Especial Cima / Golpe por Comando)", textPt: "Usar o input de comando estende o tempo de invencibilidade e aumenta o poder de ataque. A versão fraca deixa uma abertura menor ao pousar, enquanto a versão média acerta duas vezes." },
  { titleEn: "[★☆☆] Flaming Shoryuken (Up Special - Heavy)", titleJp: "ファイヤー昇龍拳(強) 【上必殺ワザ】", textJp: "ボタン押しっぱなしで、炎をまとったファイヤー昇龍拳が出せる。リュウと比べて、横方向へのふっとばし力が高く、３ヒットするため攻撃力が高い。", titleJpEn: "Fire Shoryuken - Heavy (Up Special)", textJpEn: "Holding down the button unleashes the flame-wreathed Fire Shoryuken. Compared to Ryu's, it has higher horizontal knockback power and deals more damage since it hits three times.", titlePt: "Fire Shoryuken - Forte (Especial Cima)", textPt: "Segurar o botão libera o Fire Shoryuken envolto em chamas. Comparado ao do Ryu, tem maior poder de arremesso horizontal e causa mais dano por acertar três vezes." },
  { titleEn: "[★★☆] Focus Attack (Down Special)", titleJp: "セービングアタック 【下必殺ワザ】", textJp: "構えている間は、一発だけ攻撃を受け止めることができる。最大までためた回し蹴りをくらわせると、相手はゆっくりと倒れてダウンする。", titleJpEn: "Focus Attack (Down Special)", textJpEn: "While holding the stance, he can withstand one attack. Landing the fully charged spin kick makes the opponent slowly fall and go down.", titlePt: "Focus Attack (Especial Baixo)", textPt: "Enquanto mantém a postura, ele pode aguentar um ataque. Acertar o chute giratório totalmente carregado faz o adversário cair lentamente e desabar." },
  { titleEn: "[★☆☆] Shippu Jinraikyaku (Final Smash)", titleJp: "疾風迅雷脚 【最後の切りふだ】", textJp: "密着するぐらい近くに相手がいれば、豪快な連続蹴りを繰り出す「疾風迅雷脚」になる。連続攻撃中は、途中から上昇していき、最後の一撃で大きく蹴りとばす。", titleJpEn: "Shippu Jinraikyaku (Final Smash)", textJpEn: "If an opponent is close enough to be right up against him, it becomes \"Shippu Jinraikyaku,\" unleashing a spectacular flurry of kicks. Partway through the combo, he rises into the air, finishing with a powerful kick that launches the opponent.", titlePt: "Shippu Jinraikyaku (Final Smash)", textPt: "Se um adversário estiver perto o suficiente para ficar colado nele, o golpe se torna \"Shippu Jinraikyaku\", desencadeando uma sequência espetacular de chutes. No meio do combo, ele sobe ao ar, terminando com um chute poderoso que lança o adversário." },
  { titleEn: "[★☆☆] Shinryuken (Final Smash)", titleJp: "神龍拳 【最後の切りふだ】", textJp: "相手が離れていれば「神龍拳」になり、周囲のファイターを巻き込んでダメージを与える。頭上にいる相手にも当てられるため、下から狙うこともできる。", titleJpEn: "Shinryuken (Final Smash)", textJpEn: "If the opponent is far away, it becomes \"Shinryuken,\" dealing damage to any fighters caught nearby. Since it can also hit opponents overhead, it can be aimed from below as well.", titlePt: "Shinryuken (Final Smash)", textPt: "Se o adversário estiver longe, o golpe se torna \"Shinryuken\", causando dano em quaisquer lutadores por perto. Como também pode acertar adversários acima, também pode ser mirado de baixo." },
  { titleEn: "[★☆☆] Hell Wheel (Backward Throw)", titleJp: "地獄車 【後ろ投げ】", textJp: "リュウの「巴投げ」と異なり、後ろへ一回転して投げ飛ばす「地獄車」を使う。投げの移動距離がある分、リュウの後ろ投げよりステージ端へ追い込みやすい。", titleJpEn: "Hell Wheel (Backward Throw)", textJpEn: "Unlike Ryu's \"Tomoe Nage,\" Ken uses \"Hell Wheel,\" rolling backward once before throwing the opponent. Since the throw covers distance, it's easier to corner opponents toward the edge of the stage than with Ryu's backward throw.", titlePt: "Hell Wheel (Arremesso de Trás)", textPt: "Diferente do \"Tomoe Nage\" do Ryu, o Ken usa o \"Hell Wheel\", rolando para trás uma vez antes de arremessar o adversário. Como o arremesso percorre distância, é mais fácil encurralar adversários em direção à borda do palco do que com o arremesso de trás do Ryu." },
  { titleEn: "[★☆☆] Nata Otoshi Geri (Command-Input Move)", titleJp: "鉈落とし蹴り 【コマンド入力専用ワザ】", textJp: "右向き時、→↘↓＋攻撃ボタンで出す。上段横回し蹴り。通常ワザをキャンセルして出すことも可能。", titleJpEn: "Nata Otoshi Geri (Command-Input Exclusive Move)", textJpEn: "When facing right, input →↘↓ + the attack button. A high roundhouse kick. It can also be performed by canceling a standard move.", titlePt: "Nata Otoshi Geri (Golpe Exclusivo por Comando)", textPt: "Ao virar para a direita, inputar →↘↓ + o botão de ataque. Um chute giratório alto. Também pode ser realizado cancelando um golpe padrão." },
  { titleEn: "[★☆☆] Oosoto Mawashi Geri (Command-Input Move)", titleJp: "大外回し蹴り 【コマンド入力専用ワザ】", textJp: "右向き時、←↙↓↘→＋攻撃ボタンで出す。通常ワザをキャンセルして出すことも可能。", titleJpEn: "Oosoto Mawashi Geri (Command-Input Exclusive Move)", textJpEn: "When facing right, input ←↙↓↘→ + the attack button. It can also be performed by canceling a standard move.", titlePt: "Oosoto Mawashi Geri (Golpe Exclusivo por Comando)", textPt: "Ao virar para a direita, inputar ←↙↓↘→ + o botão de ataque. Também pode ser realizado cancelando um golpe padrão." },
  { titleEn: "[★☆☆] Inazuma Kick (Command-Input Move)", titleJp: "稲妻かかと割り 【コマンド入力専用ワザ】", textJp: "右向き時、→↘↓＋攻撃ボタンか、←↙↓↘→＋攻撃ボタンでワザを出した後、ボタンを押し続けると出せる。シールドを大きく削ることができるワザ。", titleJpEn: "Inazuma Kick (Command-Input Exclusive Move)", textJpEn: "While facing right, after performing →↘↓ + the attack button or ←↙↓↘→ + the attack button, holding down the button executes this move. It can chip away a large amount of shield.", titlePt: "Inazuma Kick (Golpe Exclusivo por Comando)", textPt: "Ao virar para a direita, depois de realizar →↘↓ + o botão de ataque ou ←↙↓↘→ + o botão de ataque, segurar o botão executa este golpe. Pode desgastar uma grande quantidade do escudo." },
];

async function main() {
  const ken = await db.fighter.findFirst({
    where: { name: "Ken" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!ken) { console.log("Ken not found"); return; }

  await db.fighter.update({
    where: { id: ken.id },
    data: {
      curatorOverviewEn: "Ken plays like Ryu's more aggressive, combo-hungry mirror — same fundamentals, but every tool leans harder into pressure and follow-through. His Shoryuken variants hit multiple times and can be held down for a flaming, three-hit version with stronger horizontal knockback, while his backward throw covers extra distance to corner opponents near the edge instead of setting up a tech situation like Ryu's. His Final Smash splits the same way as Ryu's by distance, but Shippu Jinraikyaku turns a close-range read into an extended flurry of kicks rather than a single strike. Anyone comfortable with fighting-game inputs will find Ken rewards relentless offense and combo extensions more than Ryu's more balanced, punish-focused kit.",
      curatorOverviewPt: "Ken joga como um espelho mais agressivo e voltado a combos do Ryu — os mesmos fundamentos, mas cada ferramenta pende mais para pressão e continuidade. Suas variantes de Shoryuken acertam várias vezes e podem ser seguradas para uma versão flamejante de três golpes com arremesso horizontal mais forte, enquanto seu arremesso de trás percorre mais distância para encurralar adversários perto da borda em vez de montar uma situação de tech como o do Ryu. Seu Final Smash se divide da mesma forma que o do Ryu por distância, mas o Shippu Jinraikyaku transforma uma leitura de curto alcance em uma sequência estendida de chutes em vez de um golpe único. Quem estiver confortável com inputs de jogo de luta vai perceber que o Ken recompensa mais a ofensiva implacável e extensões de combo do que o kit mais equilibrado e focado em punição do Ryu.",
      curatorOverviewJp: "ケンは、リュウをより攻撃的でコンボ志向にした鏡写しのような存在だ――基本は同じだが、あらゆる武器がより強く圧力と継続にシフトしている。彼の昇龍拳のバリエーションは複数回ヒットし、ボタンを押し続けることでより強い横ふっとばしを持つ３ヒットの炎の昇龍拳を出せる一方、後ろ投げはリュウのような受け身状況を作るのではなく、より長い距離を移動してガケ際に相手を追い込む。最後の切りふだはリュウと同様に距離で分岐するが、「疾風迅雷脚」は近距離の読みを、単発の一撃ではなく延々と続く蹴りのラッシュへと変える。格闘ゲームの入力に慣れているプレイヤーなら、ケンがリュウのよりバランスの取れた反撃重視のキットよりも、容赦ない攻勢とコンボの延長を得意とすることに気づくはずだ。",
      curatorOverviewJpEn: "Ken is like a more aggressive, combo-oriented mirror of Ryu — the fundamentals are the same, but every tool shifts harder toward pressure and follow-through. His Shoryuken variants hit multiple times, and holding the button unleashes a three-hit flaming Shoryuken with stronger horizontal knockback, while his backward throw travels a longer distance to corner opponents near the ledge rather than setting up a tech situation like Ryu's. His Final Smash splits by distance just like Ryu's, but Shippu Jinraikyaku turns a close-range read into an extended flurry of kicks rather than a single hit. Players comfortable with fighting-game inputs will find that Ken rewards relentless offense and combo extension more than Ryu's more balanced, punish-focused kit.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = ken.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = ken.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fix (usuário via VLC): WiiU 2:18:06-2:18:24 = 8286-8304
  const main = await db.collectible.findFirst({ where: { name: "Ken", type: "TROPHY", smashGameVersion: "SSB4" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (main) {
    await db.collectible.update({ where: { id: main.id }, data: { videoStartSec: 8286, videoEndSec: 8304 } });
    console.log(`✅ Trophy "Ken" [SSB4]: vídeo WiiU corrigido 8286-8304 (era ${main.videoStartSec}-${main.videoEndSec})`);
  }

  // Mesmo bug do Ryu: troféu SSB4 sem CollectibleChronicleLink, cai no fallback com os 11 jogos
  // da franquia inteira em vez de só o jogo de origem (Street Fighter, 1987, arcade).
  if (main) {
    const streetFighter1 = await db.chronicleEntry.findFirst({ where: { titleNtsc: "Street Fighter" }, select: { id: true } });
    if (streetFighter1) {
      await db.collectibleChronicleLink.upsert({
        where: { collectibleId_chronicleEntryId: { collectibleId: main.id, chronicleEntryId: streetFighter1.id } },
        update: {},
        create: { collectibleId: main.id, chronicleEntryId: streetFighter1.id },
      });
      console.log(`✅ Trophy "Ken" [SSB4]: linkado ao ChronicleEntry "Street Fighter" (Works agora mostra só o jogo de origem)`);
    }
  }

  await db.$disconnect();
}
main().catch(console.error);
