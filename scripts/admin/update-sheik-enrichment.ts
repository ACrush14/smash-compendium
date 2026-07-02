import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBU: {
    jpEn: "First appeared in \"The Legend of Zelda: Ocarina of Time.\" A mysterious young man who appears wherever Link goes, teaching him vital melodies with a harp. He claims to be a survivor of the Sheikah tribe, but his true identity is Zelda, magically transformed to protect herself from the demon king Ganondorf. Since it isn't just a simple disguise — even his build and eye color change — it's believed to be an advanced form of magical transformation. Because of this, even Link and Ganondorf never noticed her true identity.",
    pt: "Apareceu pela primeira vez em \"The Legend of Zelda: Ocarina of Time.\" Um jovem misterioso que aparece onde quer que o Link vá, ensinando-lhe melodias vitais com uma harpa. Ele afirma ser um sobrevivente da tribo Sheikah, mas sua verdadeira identidade é a Zelda, transformada magicamente para se proteger do rei demônio Ganondorf. Como não é apenas um disfarce simples — até mesmo sua estrutura corporal e cor dos olhos mudam — acredita-se que seja uma forma avançada de transformação mágica. Por causa disso, nem mesmo Link e Ganondorf jamais perceberam sua verdadeira identidade.",
  },
  SSBM: {
    jpEn: "Zelda's transformed form. Claiming to be a survivor of the supposedly extinct Sheikah tribe, she appears before Link and teaches him necessary melodies. Since not just her clothing but also her build, eye color, and skin color instantly change, it's believed she isn't simply in disguise, but rather transforms using extremely advanced magic.",
    pt: "A forma transformada de Zelda. Alegando ser uma sobrevivente da tribo Sheikah, supostamente extinta, ela aparece diante do Link e lhe ensina melodias necessárias. Como não apenas suas roupas, mas também sua estrutura corporal, cor dos olhos e cor da pele mudam instantaneamente, acredita-se que ela não esteja simplesmente disfarçada, mas sim se transformando usando magia extremamente avançada.",
  },
  SSBB: {
    jpEn: "The form Zelda takes to escape from Ganondorf. There's no trace of Zelda in her appearance at all. Claiming to be a survivor of the Sheikah tribe, she suddenly appears before Link. She teaches him vital ocarina melodies and vanishes in an instant, appearing as a mysterious presence. She doesn't show up often — rather, she appears at crucial moments to support Link.",
    pt: "A forma que a Zelda assume para escapar de Ganondorf. Não há absolutamente nenhum traço da Zelda em sua aparência. Alegando ser uma sobrevivente da tribo Sheikah, ela aparece repentinamente diante do Link. Ela lhe ensina melodias vitais de ocarina e desaparece em um instante, aparecendo como uma presença misteriosa. Ela não aparece com frequência — pelo contrário, ela surge em momentos cruciais para apoiar o Link.",
  },
  SSB4: {
    jpEn: "Appears in \"The Legend of Zelda: Ocarina of Time\" as a survivor of the Sheikah tribe. Her true identity is Zelda — a disguise to escape Ganondorf. She wears clothing resembling a ninja or a thief. In Smash Bros., she's a fighter that, as a complete opposite of Zelda, excels at speed-based attacks. Overwhelm opponents with a barrage of hits and pile on the damage.",
    pt: "Aparece em \"The Legend of Zelda: Ocarina of Time\" como uma sobrevivente da tribo Sheikah. Sua verdadeira identidade é a Zelda — um disfarce para escapar de Ganondorf. Ela veste roupas que lembram um ninja ou ladrão. Em Smash Bros., ela é uma lutadora que, como o completo oposto da Zelda, se destaca em ataques baseados em velocidade. Domine os adversários com uma rajada de golpes e acumule dano.",
  },
};

const MOVE_DATA = [
  {
    match: (v: string, o: number) => v === "SSBM" && o === 0,
    en: "While Zelda lacks physical technique and moves sluggishly but can push through with powerful magic, Sheik is agile and graceful but lacks a decisive finishing blow. Switch between them depending on the situation to maximize their advantages. Needle Storm adjusts the number of thrown needles based on how long the button is held. Chain lets you control its movement with the stick while it's active. B: Needle Storm, Side+B: Chain",
    pt: "Enquanto a Zelda carece de técnica física e se move lentamente, mas consegue avançar com magia poderosa, a Sheik é ágil e graciosa, mas carece de um golpe final decisivo. Alterne entre elas dependendo da situação para maximizar suas vantagens. O Needle Storm ajusta o número de agulhas arremessadas com base no tempo que o botão é segurado. O Chain permite controlar seu movimento com o analógico enquanto está ativo. B: Needle Storm, Lateral+B: Chain",
  },
  {
    match: (v: string, o: number) => v === "SSBM" && o === 1,
    en: "Sheik suits a strategy of dealing damage fluidly with strong attacks. Zelda has more knockback power, so in 1-on-1 matches, switching to Zelda at an appropriate moment can sometimes be advantageous — the right tool for the right job. Vanish has a short travel distance, but explodes the instant it warps, dealing a small attack. Up+B: Vanish, Down+B: Zelda Change",
    pt: "A Sheik se encaixa em uma estratégia de causar dano fluidamente com ataques fortes. A Zelda tem mais poder de arremesso, então em partidas 1 contra 1, trocar para a Zelda no momento certo às vezes pode ser vantajoso — a ferramenta certa para o trabalho certo. O Vanish tem uma distância de deslocamento curta, mas explode no instante em que teleporta, causando um pequeno ataque. Cima+B: Vanish, Baixo+B: Zelda Change",
  },
  {
    match: (v: string, o: number) => v === "SSB4" && o === 0,
    en: "Burst Grenade is a Side Special that throws a small bomb. It pulls in nearby opponents and explodes when the button is released, when it bounces off terrain, or after a set amount of time passes. Holding the button extends its throwing distance. Bouncing Fish is a Down Special where she twists her body, spins forward once, and drops her heels together to attack. If the attack connects, Sheik gains an extra jump. (N64) The Legend of Zelda: Ocarina of Time (1998/11) (3DS) The Legend of Zelda: Ocarina of Time 3D (2011/06)",
    pt: "Burst Grenade é um Especial Lateral que arremessa uma pequena bomba. Ela puxa adversários próximos e explode quando o botão é solto, quando quica no terreno, ou após um tempo determinado passar. Segurar o botão estende a distância de arremesso. Bouncing Fish é um Especial Baixo onde ela torce o corpo, gira uma vez para frente, e desce os calcanhares juntos para atacar. Se o ataque conectar, a Sheik ganha um pulo extra. (N64) The Legend of Zelda: Ocarina of Time (1998/11) (3DS) The Legend of Zelda: Ocarina of Time 3D (2011/06)",
  },
];

const TIPS = [
  { titleEn: "[★☆☆] Sheik's Origins", titleJp: "シークの初登場作品", textJp: "シークのデビュー作は１９９８年発売の『ゼルダの伝説 時のオカリナ』。その正体はゼルダ姫で、ガノンドロフから逃れるために変装した姿。", titleJpEn: "Sheik's Origins", textJpEn: "Sheik's debut was in \"The Legend of Zelda: Ocarina of Time,\" released in 1998. Her true identity is Princess Zelda, disguised to escape from Ganondorf.", titlePt: "As Origens da Sheik", textPt: "O debut da Sheik foi em \"The Legend of Zelda: Ocarina of Time,\" lançado em 1998. Sua verdadeira identidade é a Princesa Zelda, disfarçada para escapar de Ganondorf." },
  { titleEn: "[★☆☆] In Her Series", titleJp: "原作では", textJp: "マスターソードを抜き、大人となったリンクの前に現れる、謎の青年。物語のなかで幾度となく現れ、ハープを使いながらリンクにメロディを教える。", titleJpEn: "In Her Series", textJpEn: "A mysterious young man who appears before the now-adult Link after he pulls the Master Sword. He appears many times throughout the story, teaching Link melodies while playing a harp.", titlePt: "Na Série Original", textPt: "Um jovem misterioso que aparece diante do Link, agora adulto, depois que ele puxa a Master Sword. Ele aparece muitas vezes ao longo da história, ensinando melodias ao Link enquanto toca uma harpa." },
  { titleEn: "[★☆☆] Breath of the Wild", titleJp: "ブレス オブ ザ ワイルド", textJp: "『ゼルダの伝説　ブレス オブ ザ ワイルド』では、シークのamiiboを読み込むことでまれに「シークのマスク」を入手できる。「忍びシリーズ」と合わせて、シークを再現。", titleJpEn: "Breath of the Wild", textJpEn: "In \"The Legend of Zelda: Breath of the Wild,\" scanning Sheik's amiibo can rarely give you the \"Shiek Mask.\" Combined with the \"Stealth Set,\" it recreates Sheik's look.", titlePt: "Breath of the Wild", textPt: "Em \"The Legend of Zelda: Breath of the Wild,\" ler o amiibo da Sheik pode raramente dar a você a \"Máscara da Sheik.\" Combinada com o \"Conjunto Furtivo,\" ela recria o visual da Sheik." },
  { titleEn: "[★☆☆] Needle Storm (Neutral Special)", titleJp: "仕込針 【通常必殺ワザ】", textJp: "空中でため始めることも可能で、ためるほど発射する針の数が増える。針は発射位置から離れるほど威力が弱くなっていく。", titleJpEn: "Needle Storm (Neutral Special)", textJpEn: "It can also be charged starting in the air, and the longer it charges, the more needles are fired. The needles weaken in power the farther they travel from where they were fired.", titlePt: "Needle Storm (Especial Neutro)", textPt: "Também pode ser carregado começando no ar, e quanto mais tempo carrega, mais agulhas são disparadas. As agulhas enfraquecem quanto mais longe viajam de onde foram disparadas." },
  { titleEn: "[★★☆] Burst Grenade (Side Special)", titleJp: "炸裂丸 【横必殺ワザ】", textJp: "必殺ワザボタンを押し続けることで、爆弾を遠くまで飛ばせる。地上では大差ないけれど、空中でうまく使えば飛距離が３倍以上に。", titleJpEn: "Burst Grenade (Side Special)", textJpEn: "Holding the special move button lets you throw the bomb farther. On the ground it doesn't make much difference, but used well in the air, the throwing distance can more than triple.", titlePt: "Burst Grenade (Especial Lateral)", textPt: "Segurar o botão do golpe especial permite arremessar a bomba mais longe. No chão não faz muita diferença, mas usado bem no ar, a distância de arremesso pode mais que triplicar." },
  { titleEn: "[★☆☆] Burst Grenade as an Item (Side Special)", titleJp: "炸裂丸のアイテム変化 【横必殺ワザ】", textJp: "ピンを抜く前の炸裂丸に攻撃を当てると、炸裂丸が少しふっとんでから爆発する。ピンを抜く前にシークが攻撃を受けると、炸裂丸はアイテムとして地面に落ちる。", titleJpEn: "Burst Grenade as an Item (Side Special)", textJpEn: "Hitting the Burst Grenade before its pin is pulled sends it flying a short distance before it explodes. If Sheik is hit before pulling the pin, the Burst Grenade drops to the ground as an item.", titlePt: "Burst Grenade como Item (Especial Lateral)", textPt: "Acertar o Burst Grenade antes do pino ser puxado o faz voar uma curta distância antes de explodir. Se a Sheik for atingida antes de puxar o pino, o Burst Grenade cai no chão como um item." },
  { titleEn: "[★★☆] Bouncing Fish's Potential (Down Special)", titleJp: "跳魚の追加入力 【下必殺ワザ】", textJp: "追加のボタン入力で、かかと落としを早めに出すことが可能。１発目が当たった後、すぐ２発目を出して空振りすれば着地前のスキが小さくなる。", titleJpEn: "Extra Input for Bouncing Fish (Down Special)", textJpEn: "An additional button input lets you bring out the heel drop earlier. After the first hit connects, immediately whiffing a second heel drop reduces the vulnerability before landing.", titlePt: "Input Extra do Bouncing Fish (Especial Baixo)", textPt: "Um input adicional de botão permite trazer o chute de calcanhar mais cedo. Depois que o primeiro golpe conecta, errar imediatamente um segundo chute de calcanhar reduz a vulnerabilidade antes do pouso." },
  { titleEn: "[★★☆] Bouncing Fish's Reach (Down Special)", titleJp: "跳魚の移動距離 【下必殺ワザ】", textJp: "左右を入力することで、移動距離をかなり大きく調整できる。フェイントや意表をついた攻撃として使い分けることができる。", titleJpEn: "Bouncing Fish's Reach (Down Special)", textJpEn: "Inputting left or right lets you significantly adjust the travel distance. It can be used strategically as a feint or a surprise attack.", titlePt: "O Alcance do Bouncing Fish (Especial Baixo)", textPt: "Inputar esquerda ou direita permite ajustar significativamente a distância percorrida. Pode ser usado estrategicamente como uma finta ou um ataque surpresa." },
  { titleEn: "[★☆☆] Sheikah Dance (Final Smash)", titleJp: "宵闇乱舞 【最後の切りふだ】", textJp: "高速で突進し、当たった相手を連続で斬りつける。巻き込めるのは１人のみだが、その分、当てやすく威力が強い。", titleJpEn: "Sheikah Dance (Final Smash)", textJpEn: "Dashes at high speed and repeatedly slashes any opponent it hits. Only one opponent can be caught, but in exchange it's easier to land and hits harder.", titlePt: "Sheikah Dance (Final Smash)", textPt: "Avança em alta velocidade e corta repetidamente qualquer adversário que atinge. Apenas um adversário pode ser pego, mas em troca é mais fácil de acertar e bate mais forte." },
  { titleEn: "[★★☆] Cycle Kick (Side Tilt Attack)", titleJp: "円弧 【横強攻撃】", textJp: "攻撃のスピードが速く、当たった相手を軽く浮き上がらせるので、そのまま連続で同じ攻撃を当てたり、連続攻撃につなげたりしやすい。", titleJpEn: "Cycle Kick (Side Tilt Attack)", textJpEn: "This attack is fast and slightly launches opponents it hits, making it easy to follow up with the same attack repeatedly or chain into a combo.", titlePt: "Cycle Kick (Ataque Inclinado Lateral)", textPt: "Este ataque é rápido e lança levemente os adversários que atinge, tornando fácil fazer um acompanhamento com o mesmo ataque repetidamente ou encadear em um combo." },
  { titleEn: "[★★☆] Razor Wing (Up Smash Attack)", titleJp: "割符 【上スマッシュ攻撃】", textJp: "シークが手を振り上げた時に攻撃を当てると、相手を上にふっとばし、振り下ろした時に当てると、横にふっとばせる。", titleJpEn: "Razor Wing (Up Smash Attack)", textJpEn: "Hitting an opponent while Sheik raises her hand launches them upward; hitting them while she swings it down launches them horizontally.", titlePt: "Razor Wing (Ataque Smash Cima)", textPt: "Acertar um adversário enquanto a Sheik levanta a mão o arremessa para cima; acertá-lo enquanto ela abaixa a mão o arremessa horizontalmente." },
  { titleEn: "[★☆☆] Hatchet (Forward Air)", titleJp: "鉈 【前空中攻撃】", textJp: "攻撃力は低いものの、ワザの出が速くスキが小さい。蓄積ダメージが少ない相手には連続ヒットするので、コンボを決めやすい。", titleJpEn: "Hatchet (Forward Air)", textJpEn: "Although its attack power is low, it comes out quickly with a small opening. Against opponents with low accumulated damage, it hits multiple times, making it easy to land combos.", titlePt: "Hatchet (Ataque Aéreo Frontal)", textPt: "Embora seu poder de ataque seja baixo, ele sai rapidamente com uma pequena abertura. Contra adversários com pouco dano acumulado, acerta múltiplas vezes, tornando fácil conectar combos." },
];

async function main() {
  const sheik = await db.fighter.findFirst({
    where: { name: "Sheik" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
      tips: { select: { id: true, titleEn: true } },
    },
  });
  if (!sheik) { console.log("Sheik not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: sheik.id },
    data: {
      curatorOverviewEn: "Sheik, Princess Zelda's swift alter ego, is one of Smash's fastest and most technical fighters — trading Zelda's raw magic power for blistering speed, rapid needle pressure, and combo-heavy strikes. Her attacks come out quickly but lack finishing power, rewarding players who chain hits relentlessly and build damage over sheer volume rather than single devastating blows.",
      curatorOverviewPt: "Sheik, o veloz alter ego da Princesa Zelda, é uma das lutadoras mais rápidas e técnicas do Smash — trocando o poder mágico bruto da Zelda por velocidade estonteante, pressão constante de agulhas e golpes voltados para combos. Seus ataques saem rapidamente, mas carecem de poder de finalização, recompensando jogadores que encadeiam golpes incansavelmente e acumulam dano pelo volume em vez de golpes únicos devastadores.",
      curatorOverviewJp: "ゼルダ姫の俊敏な変身形態シークは、スマブラで最も速く、最もテクニカルなファイターの一人――ゼルダの生の魔力の代わりに、目にも留まらぬ速さ、絶え間ない針攻撃、そしてコンボ主体の打撃を持つ。攻撃の発生は速いが決定力に欠けるため、単発の強力な一撃より、絶え間なく攻撃を連ね、量でダメージを積み重ねるプレイヤーに適している。",
      curatorOverviewJpEn: "Sheik, Princess Zelda's swift transformed form, is one of Smash's fastest and most technical fighters — trading Zelda's raw magic power for blinding speed, relentless needle pressure, and combo-focused strikes. Her attacks come out quickly but lack finishing power, suiting players who chain attacks relentlessly and stack damage through volume rather than a single devastating hit.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Add PT+JpEn for all 4 bios
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = sheik.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Fix Bio SSBM video: 4637-4671 -> 1041-1059 (17:21-17:39 ZoomZike VLC confirmed)
  const bioSsbm = sheik.bios.find(b => b.smashGameVersion === "SSBM");
  if (bioSsbm) {
    await db.fighterBio.update({ where: { id: bioSsbm.id }, data: { videoStartSec: 1041, videoEndSec: 1059 } });
    console.log("✅ Bio SSBM video: 4637-4671 -> 1041-1059 (17:21-17:39)");
  }

  // Fix Trophy "Sheik" SSBM to match
  const trophy = await db.collectible.findFirst({ where: { name: "Sheik", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true } });
  if (trophy) {
    await db.collectible.update({ where: { id: trophy.id }, data: { videoStartSec: 1041, videoEndSec: 1059 } });
    console.log("✅ Trophy Sheik SSBM: -> 1041-1059");
  }

  // Fix corrupted SSB4 secondary video fields (videoEndSec2 = 120600/121260, impossible values)
  const ssb4Trophies = await db.collectible.findMany({
    where: { fighter: { name: "Sheik" }, type: "TROPHY", smashGameVersion: "SSB4" },
    select: { id: true, name: true, videoEndSec2: true },
  });
  for (const t of ssb4Trophies) {
    if (t.videoEndSec2 != null && t.videoEndSec2 > 7200) {
      await db.collectible.update({ where: { id: t.id }, data: { videoStartSec2: null, videoEndSec2: null } });
      console.log(`✅ SSB4 Trophy "${t.name}": videoStartSec2/videoEndSec2 corrompidos (${t.videoEndSec2}) limpos`);
    }
  }

  // Moves EN+PT+JpEn
  for (const m of sheik.moves) {
    const data = MOVE_DATA.find(d => d.match(m.smashGameVersion, m.order));
    if (!data) continue;
    await db.fighterMove.update({ where: { id: m.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.en } });
    console.log(`✅ Move [${m.smashGameVersion}] order ${m.order}: EN+PT+JpEn adicionados`);
  }

  // Tips
  let updated = 0;
  for (const data of TIPS) {
    const tip = sheik.tips.find(t => t.titleEn === data.titleEn);
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
