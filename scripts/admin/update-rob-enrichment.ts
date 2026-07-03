import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "\"Robot\" refers to the \"Family Computer Robot,\" a peripheral for the Family Computer released by Nintendo. Outside Japan, it was released under the name R.O.B. (Robotic Operating Buddy). Here, we explain the peripheral and character commonly known as \"Famicom Robo.\"",
    pt: "\"Robot\" se refere ao \"Family Computer Robot,\" um periférico para o Family Computer lançado pela Nintendo. Fora do Japão, foi lançado com o nome R.O.B. (Robotic Operating Buddy). Aqui, explicamos o periférico e o personagem comumente conhecido como \"Famicom Robo.\"",
  },
  SSBB: {
    jpEn: "Debuted as a peripheral for the Family Computer. Combined with things like the \"Gyro Set,\" it offered two types of play. By controlling Professor Hector, the TV screen would emit light, and it would move in response to that light — a mechanism that was groundbreaking for its time. In recent years, it has also appeared as a driver in \"Mario Kart DS.\"",
    pt: "Estreou como um periférico para o Family Computer. Combinado com coisas como o \"Gyro Set,\" oferecia dois tipos de jogabilidade. Controlando o Professor Hector, a tela da TV emitia luz, e ele se movia em resposta a essa luz — um mecanismo revolucionário para a época. Nos últimos anos, também apareceu como piloto em \"Mario Kart DS.\"",
  },
  SSB4: {
    jpEn: "Debuted as a Famicom peripheral in 1985. A groundbreaking system where the robot moved in sync with the game became a hot topic at the time. In Smash Bros., he's an appealing fighter with two types of projectiles and high recovery ability thanks to his hover. \"Robo Beam\" can have its angle adjusted when fired. It can't be rapid-fired, but leaving it unused for a while turns it into a powerful beam.",
    pt: "Estreou como um periférico do Famicom em 1985. Um sistema revolucionário em que o robô se movia em sincronia com o jogo se tornou um assunto muito comentado na época. Em Smash Bros., ele é um lutador atraente com dois tipos de projéteis e alta capacidade de recuperação graças ao seu hover. O \"Robo Beam\" pode ter seu ângulo ajustado ao ser disparado. Não pode ser disparado repetidamente, mas deixá-lo sem uso por um tempo o transforma em um raio poderoso.",
  },
};

const TIPS = [
  { titleEn: "[★☆☆] R.O.B.'s Origins", titleJp: "ロボットの初登場作品", textJp: "ロボットはファミコンの周辺機器として、１９８５年に登場。ゲームと連動して実際のロボットが動くという画期的なシステムが当時話題に。", titleJpEn: "R.O.B.'s Origins", textJpEn: "R.O.B. debuted as a Famicom peripheral in 1985. A groundbreaking system in which an actual robot moved in sync with the game became a hot topic at the time.", titlePt: "As Origens do R.O.B.", textPt: "O R.O.B. estreou como um periférico do Famicom em 1985. Um sistema revolucionário em que um robô real se movia em sincronia com o jogo se tornou um assunto muito comentado na época." },
  { titleEn: "[★☆☆] In His Series", titleJp: "原作では", textJp: "光線銃型コントローラー技術を応用した、ファミコンと連動して動くロボットのおもちゃ。『ジャイロセット』『ブロックセット』の２種類。ロボット単体の型番はHVC-012。", titleJpEn: "In His Series", textJpEn: "A robot toy that moves in sync with the Famicom, applying light gun controller technology. There were two types: the \"Gyro Set\" and the \"Block Set.\" The model number for the robot alone was HVC-012.", titlePt: "Na Série Original", textPt: "Um brinquedo robô que se move em sincronia com o Famicom, aplicando tecnologia de controlador tipo pistola de luz. Havia dois tipos: o \"Gyro Set\" e o \"Block Set.\" O número de modelo do robô sozinho era HVC-012." },
  { titleEn: "[★★★] Color Variations", titleJp: "1Pカラーと2Pカラー", textJp: "日本版の1Pカラーは紅白の２色で2Pカラーはライトグレー。海外は逆。それぞれ日本版と海外版のファミコンロボットの色が元になっている。", titleJpEn: "Color Variations", textJpEn: "The Japanese version's 1P color is red and white, while the 2P color is light gray. Overseas, it's reversed. Each is based on the colors of the Japanese and overseas versions of the Famicom Robot.", titlePt: "Variações de Cor", textPt: "A cor 1P da versão japonesa é vermelho e branco, enquanto a cor 2P é cinza claro. No exterior, é invertido. Cada uma é baseada nas cores das versões japonesa e internacional do Famicom Robot." },
  { titleEn: "[★☆☆] Robo Beam (Neutral Special)", titleJp: "ロボビーム 【通常必殺ワザ】", textJp: "エネルギーがたまっていれば、目からビームを発射。どの程度たまっているかは、頭の赤いランプで確認できる。", titleJpEn: "Robo Beam (Neutral Special)", textJpEn: "If energy is charged, he fires a beam from his eyes. How much is charged can be checked via the red lamp on his head.", titlePt: "Robo Beam (Especial Neutro)", textPt: "Se a energia estiver carregada, ele dispara um raio pelos olhos. O quanto está carregado pode ser verificado pela lâmpada vermelha em sua cabeça." },
  { titleEn: "[★★☆] Aiming the Robo Beam (Neutral Special)", titleJp: "ロボビームの撃ち分け 【通常必殺ワザ】", textJp: "発射するビームは上下の撃ちわけができる。地面に当たったビームは反射して方向が変わる。", titleJpEn: "Aiming the Robo Beam (Neutral Special)", textJpEn: "The fired beam can be aimed up or down. A beam that hits the ground reflects and changes direction.", titlePt: "Mirando o Robo Beam (Especial Neutro)", textPt: "O raio disparado pode ser mirado para cima ou para baixo. Um raio que atinge o chão reflete e muda de direção." },
  { titleEn: "[★★☆] Pointblank Robo Beam (Neutral Special)", titleJp: "接近でのロボビーム 【通常必殺ワザ】", textJp: "まったくエネルギーがたまっていないとビームは出せないけれど、目の付近にいる相手にはダメージを与えることができる。", titleJpEn: "Pointblank Robo Beam (Neutral Special)", textJpEn: "The beam can't be fired with zero energy charged, but it can still deal damage to opponents near his eyes.", titlePt: "Robo Beam à Queima-Roupa (Especial Neutro)", textPt: "O raio não pode ser disparado com energia zerada, mas ainda pode causar dano a adversários perto de seus olhos." },
  { titleEn: "[★★☆] Charging Robo Beam (Neutral Special)", titleJp: "ロボビームのチャージ 【通常必殺ワザ】", textJp: "ビームは、撃たないでいる間に勝手にたまり、ためた時間によって３段階に変化する。乱闘開始時は最初から２段階目までたまっている。", titleJpEn: "Charging Robo Beam (Neutral Special)", textJpEn: "The beam charges automatically while not being fired, changing across 3 stages based on how long it charges. At the start of a brawl, it's already charged to the second stage.", titlePt: "Carregando o Robo Beam (Especial Neutro)", textPt: "O raio se carrega automaticamente enquanto não é disparado, mudando por 3 estágios dependendo de quanto tempo carrega. No início de uma partida, ele já está carregado até o segundo estágio." },
  { titleEn: "[★★☆] Robo Beam Path Changes (Neutral Special)", titleJp: "ロボビームの軌道変化 【通常必殺ワザ】", textJp: "ビームが地形に浅い角度で当たると、一度だけ軌道が変わる。深い角度で地形に当たった場合は、軌道が変わらずその場で消滅する。", titleJpEn: "Robo Beam Path Changes (Neutral Special)", textJpEn: "If the beam hits terrain at a shallow angle, its trajectory changes once. If it hits terrain at a steep angle, the trajectory doesn't change and it disappears on the spot.", titlePt: "Mudanças na Trajetória do Robo Beam (Especial Neutro)", textPt: "Se o raio atingir o cenário em um ângulo raso, sua trajetória muda uma vez. Se atingir o cenário em um ângulo acentuado, a trajetória não muda e ele desaparece no local." },
  { titleEn: "[★★☆] Arm Rotor (Side Special)", titleJp: "アームスピン 【横必殺ワザ】", textJp: "回っている腕で、相手の飛び道具をはね返せる。ボタン連打で腕の回転時間を少しのばせる。", titleJpEn: "Arm Rotor (Side Special)", textJpEn: "The spinning arm can knock back an opponent's projectiles. Mashing the button slightly extends the arm's spinning time.", titlePt: "Arm Rotor (Especial Lateral)", textPt: "O braço giratório pode repelir projéteis do adversário. Apertar o botão repetidamente estende levemente o tempo de rotação do braço." },
  { titleEn: "[★☆☆] Robo Burner (Up Special)", titleJp: "ロボバーナー 【上必殺ワザ】", textJp: "ロボバーナーの燃料は、地上にいると少しずつ回復する。空中戦ばかりすると、なかなか回復できないので注意。", titleJpEn: "Robo Burner (Up Special)", textJpEn: "Robo Burner's fuel gradually recovers while on the ground. Be careful, as fighting only in the air makes it hard to recover fuel.", titlePt: "Robo Burner (Especial Cima)", textPt: "O combustível do Robo Burner se recupera gradualmente enquanto no chão. Cuidado, pois lutar apenas no ar dificulta a recuperação de combustível." },
  { titleEn: "[★★★] Robo Burner Fuel Consumption (Up Special)", titleJp: "ロボバーナーの燃費 【上必殺ワザ】", textJp: "バーナーを噴射して飛行する。上を入力し続けるより、必殺ワザボタンを連打した方が燃費が良く、より長く飛べる。", titleJpEn: "Robo Burner Fuel Consumption (Up Special)", textJpEn: "Fires the burner to fly. Mashing the special move button gives better fuel efficiency and lets him fly longer than continuously holding up.", titlePt: "O Consumo de Combustível do Robo Burner (Especial Cima)", textPt: "Dispara o queimador para voar. Apertar o botão de golpe especial repetidamente dá melhor economia de combustível e permite voar mais tempo do que segurar cima continuamente." },
  { titleEn: "[★★☆] Robo Burner Care (Up Special)", titleJp: "ロボバーナーの注意点 【上必殺ワザ】", textJp: "ガケにつかまっている間は、ロボバーナーの燃料が回復しない。復帰後は地上に上がって燃料を回復させないと、次の復帰で燃料切れの恐れが。", titleJpEn: "Robo Burner Care (Up Special)", textJpEn: "Robo Burner's fuel doesn't recover while hanging on a ledge. After recovering, if he doesn't get on the ground to refuel, he risks running out of fuel on the next recovery.", titlePt: "Cuidados com o Robo Burner (Especial Cima)", textPt: "O combustível do Robo Burner não se recupera enquanto agarrado na borda. Depois de se recuperar, se ele não subir ao chão para reabastecer, corre o risco de ficar sem combustível na próxima recuperação." },
  { titleEn: "[★★★] Canceling Robo Burner (Up Special)", titleJp: "ロボバーナーの中断 【上必殺ワザ】", textJp: "途中でワザを止めたり別の攻撃を出しても、燃料が続く限りまた使える。ガケの外側で追撃を狙ったり、復帰中に飛び道具を避けたりしやすい。", titleJpEn: "Canceling Robo Burner (Up Special)", textJpEn: "Even if the move is stopped partway or another attack is used, it can be used again as long as fuel remains. This makes it easy to go for a follow-up beyond the ledge or dodge projectiles while recovering.", titlePt: "Cancelando o Robo Burner (Especial Cima)", textPt: "Mesmo que o golpe seja interrompido no meio ou outro ataque seja usado, ele pode ser usado novamente enquanto houver combustível. Isso facilita buscar um acompanhamento além da borda ou esquivar de projéteis enquanto se recupera." },
  { titleEn: "[★☆☆] Gyro (Down Special)", titleJp: "ジャイロ 【下必殺ワザ】", textJp: "発射したジャイロをアイテムとして拾った時に、ためなおすことができる。ステージに落ちたままだと、次のジャイロは発射できない。", titleJpEn: "Gyro (Down Special)", textJpEn: "A fired Gyro can be recharged when picked up as an item. If it stays on the stage, the next Gyro can't be fired.", titlePt: "Gyro (Especial Baixo)", textPt: "Um Gyro disparado pode ser recarregado quando pego como item. Se ele permanecer no palco, o próximo Gyro não pode ser disparado." },
  { titleEn: "[★☆☆] Guided Robo Beam (Final Smash)", titleJp: "誘導ロボビーム 【最後の切りふだ】", textJp: "素早い誘導レーザーをばらまいた後、巨大ビームを放つ。ビームは上下に操作できるので、逃げる相手をとらえよう。", titleJpEn: "Guided Robo Beam (Final Smash)", textJpEn: "After scattering fast homing lasers, he fires a giant beam. The beam can be aimed up and down, so use it to catch fleeing opponents.", titlePt: "Guided Robo Beam (Final Smash)", textPt: "Depois de espalhar lasers de perseguição rápidos, ele dispara um raio gigante. O raio pode ser mirado para cima e para baixo, então use-o para pegar adversários fugindo." },
  { titleEn: "[★☆☆] AirN (Neutral Air Attack)", titleJp: "AirN 【通常空中攻撃】", textJp: "周囲３６０度を、バーナーで攻撃できる便利なワザ。着地後のスキが少ないため、小ジャンプからワザを出しても、次の攻撃に繋げやすい。", titleJpEn: "AirN (Neutral Air Attack)", textJpEn: "A convenient move that attacks 360 degrees around him with the burner. With little landing lag, it's easy to follow up even if used from a short hop.", titlePt: "AirN (Ataque Aéreo Neutro)", textPt: "Um golpe conveniente que ataca 360 graus ao redor dele com o queimador. Com pouca abertura de pouso, é fácil emendar um acompanhamento mesmo se usado a partir de um pulo curto." },
  { titleEn: "[★☆☆] Air Boosters (Back Air Attack)", titleJp: "AirB 【後空中攻撃】", textJp: "台座の部分から後ろ方向にバーナーを噴射する。反動で少しだけ前方向に移動する。", titleJpEn: "Air Boosters (Back Air Attack)", textJpEn: "Fires the burner backward from his base. The recoil moves him slightly forward.", titlePt: "Air Boosters (Ataque Aéreo Trás)", textPt: "Dispara o queimador para trás a partir de sua base. O recuo o move levemente para frente." },
];

async function main() {
  const rob = await db.fighter.findFirst({
    where: { name: "R.O.B." },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!rob) { console.log("R.O.B. not found"); return; }

  await db.fighter.update({
    where: { id: rob.id },
    data: {
      curatorOverviewEn: "R.O.B., the sole non-video-game peripheral turned fighter, is a zoner built on resource management — Robo Beam charges automatically over time into a devastating blast, Gyro provides a reusable projectile that can be recharged, and Arm Rotor reflects incoming attacks. His real standout is Robo Burner: a fuel-based recovery that refills on the ground but never on the ledge, demanding careful planning to avoid running dry mid-air. Methodical and resourceful, R.O.B. rewards players who manage his beam charge and fuel gauge as carefully as their positioning.",
      curatorOverviewPt: "R.O.B., o único periférico não-videogame transformado em lutador, é um controlador de espaço construído em torno de gerenciamento de recursos — Robo Beam carrega automaticamente com o tempo até um golpe devastador, Gyro oferece um projétil reutilizável que pode ser recarregado, e Arm Rotor reflete ataques recebidos. Seu grande destaque é o Robo Burner: uma recuperação baseada em combustível que se reabastece no chão mas nunca na borda, exigindo planejamento cuidadoso para evitar ficar sem combustível no ar. Metódico e engenhoso, o R.O.B. recompensa jogadores que gerenciam a carga do raio e o medidor de combustível com tanto cuidado quanto seu posicionamento.",
      curatorOverviewJp: "唯一のビデオゲーム以外の周辺機器出身のファイターであるロボットは、リソース管理を中心に据えた空間制圧型だ――ロボビームは時間とともに自動でたまり壊滅的な一撃になり、ジャイロは再充電可能な再利用型飛び道具を提供し、アームスピンは受けた攻撃を反射する。真の見どころはロボバーナーだ――地上では回復するがガケでは決して回復しない燃料式の復帰で、空中で燃料切れにならないよう慎重な計画が求められる。着実で工夫に富むロボットは、位置取りと同じくらい丁寧にビームのチャージと燃料メーターを管理するプレイヤーに応える。",
      curatorOverviewJpEn: "R.O.B., the only fighter to originate from a non-video-game peripheral, is a space-control fighter built on resource management — Robo Beam charges automatically over time into a devastating blast, Gyro provides a reusable, rechargeable projectile, and Arm Rotor reflects incoming attacks. His true standout is Robo Burner: a fuel-based recovery that refuels on the ground but never on the ledge, demanding careful planning to avoid running out of fuel mid-air. Methodical and resourceful, R.O.B. rewards players who manage his beam charge and fuel gauge as carefully as their positioning.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = rob.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  const move = rob.moves.find(m => m.smashGameVersion === "SSB4" && m.order === 0);
  if (move) {
    const en = "\"S3\" is R.O.B.'s side smash attack. Landing it at point-blank range increases its power. Also, continuing to input up or down before attacking can change the direction the beam fires. \"Gyro\" is a down special that launches a spinning top. While charging, inputting left or right allows for an emergency evasive roll. Charging can also be resumed partway through. (FC) Family Computer Robot (1985/07) (NDS) Mario Kart DS (2005/12)";
    await db.fighterMove.update({
      where: { id: move.id },
      data: {
        descEn: en, descJpEn: en,
        descPt: "\"S3\" é o ataque smash lateral do R.O.B. Acertá-lo à queima-roupa aumenta seu poder. Além disso, continuar inputando cima ou baixo antes de atacar pode mudar a direção em que o raio é disparado. \"Gyro\" é um especial baixo que lança um pião giratório. Enquanto carrega, inputar esquerda ou direita permite um rolamento de esquiva de emergência. A carga também pode ser retomada de onde parou. (FC) Family Computer Robot (1985/07) (NDS) Mario Kart DS (2005/12)",
      },
    });
    console.log("✅ Move [SSB4] EX: EN+PT+JpEn adicionados");
  }

  let updated = 0;
  for (const data of TIPS) {
    const tip = rob.tips.find(t => t.titleEn === data.titleEn);
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

  // Video fixes
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "R.O.B.", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 8350, videoEndSec: 8367 } });
    console.log(`✅ SSBB Trophy: ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} -> 8350-8367 (2:19:10-2:19:27)`);
  }

  const mainSSB4 = await db.collectible.findFirst({ where: { name: "R.O.B.", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (mainSSB4) {
    await db.collectible.update({ where: { id: mainSSB4.id }, data: { videoStartSec: 6092, videoEndSec: 6102 } });
    console.log(`✅ SSB4 Trophy "R.O.B." WiiU: ${mainSSB4.videoStartSec}-${mainSSB4.videoEndSec} -> 6092-6102 (1:41:32-1:41:42)`);
  }

  // Link orphaned item trophies (SSBB accessories)
  for (const name of ["R.O.B. Blaster", "R.O.B. Sentry", "R.O.B. Launcher"]) {
    const item = await db.collectible.findFirst({ where: { name, smashGameVersion: "SSBB" }, select: { id: true } });
    if (item) {
      await db.collectible.update({ where: { id: item.id }, data: { fighterId: rob.id } });
      console.log(`✅ "${name}": linkado`);
    }
  }

  await db.$disconnect();
}
main().catch(console.error);
