import { db } from "../../lib/db";

// SSB64 bio JP — smashwiki.info/ピカチュウ (キャラクター紹介)
const SSB64_BIO_JP = "ほっぺたの りょうがわに ちいさい でんきぶくろを もつ。 ピンチのときに ほうでんする。（ポケモン図鑑より）";
const SSB64_BIO_JPEN = "Has small electric pouches on both cheeks. When in danger, it discharges electricity. (From the Pokédex)";
const SSB64_BIO_PT = "Tem pequenas bolsas elétricas em ambas as bochechas. Quando em perigo, descarrega eletricidade. (Do Pokédex)";

// Tips SSBU oficiais — wikiwiki.jp (fornecido pelo usuário 2026-07-01)
const PIKACHU_TIPS = [
  {
    titleEn: "[★☆☆] Pikachu's Origins",
    titleJp: "ピカチュウの初登場作品",
    textJp: "ピカチュウのデビュー作は、１９９６年に発売された『ポケットモンスター 赤・緑』。トキワのもりで運が良ければ手に入るポケモン。そのかわいらしさから人気に。",
    titleJpEn: "Pikachu's Origins",
    textJpEn: "Pikachu's debut was \"Pocket Monsters Red & Green,\" released in 1996. It's a Pokémon you can get with luck in Viridian Forest, and its cuteness made it a fan favorite.",
    titlePt: "As Origens do Pikachu",
    textPt: "O debut do Pikachu foi \"Pocket Monsters Red & Green\", lançado em 1996. É um Pokémon que pode ser obtido com sorte na Floresta de Viridian, e sua fofura o tornou um favorito dos fãs.",
  },
  {
    titleEn: "[★☆☆] In Its Series",
    titleJp: "原作では",
    textJp: "『ポケットモンスター 赤・緑』では出現率が低い、でんきタイプのねずみポケモン。『ポケットモンスター ピカチュウ』では、最初にオーキド博士からもらえた。",
    titleJpEn: "In Its Series",
    textJpEn: "In \"Pocket Monsters Red & Green,\" it's a rare Electric-type Mouse Pokémon with low encounter rates. In \"Pocket Monsters Pikachu,\" it was the starter Pokémon given by Professor Oak.",
    titlePt: "Na Série Original",
    textPt: "Em \"Pocket Monsters Red & Green\", é um raro Pokémon Rato do tipo Elétrico com baixa taxa de encontro. Em \"Pocket Monsters Pikachu\", foi o Pokémon inicial dado pelo Professor Carvalho.",
  },
  {
    titleEn: "[★☆☆] Pikachu Libre",
    titleJp: "マスクド・ピカチュウ",
    textJp: "マスクをかぶったピカチュウは「マスクド・ピカチュウ」。しっぽを確認してみるとわかるが、実はメス。",
    titleJpEn: "Masked Pikachu",
    textJpEn: "The masked Pikachu is known as \"Masked Pikachu.\" Check its tail and you'll see it's actually female.",
    titlePt: "Pikachu Mascarado",
    textPt: "O Pikachu mascarado é conhecido como \"Pikachu Mascarado.\" Verifique a cauda e você verá que é na verdade fêmea.",
  },
  {
    titleEn: "[★☆☆] Thunder Jolt (Neutral Special)",
    titleJp: "でんげき 【通常必殺ワザ】",
    textJp: "「でんげき」は地形に沿ってはねながら進む。ガケにつかまっている相手に攻撃することも可能。",
    titleJpEn: "Thunder Jolt (Neutral Special)",
    textJpEn: "Thunder Jolt bounces along the terrain as it travels. It can even hit opponents hanging on the ledge.",
    titlePt: "Choque Elétrico (Especial Neutro)",
    textPt: "O Choque Elétrico quica pelo terreno enquanto avança. Pode até acertar adversários pendurados na borda.",
  },
  {
    titleEn: "[★★☆] Skull Bash (Side Special)",
    titleJp: "ロケットずつき 【横必殺ワザ】",
    textJp: "はじき入力すると、少したまった状態からワザをためることができる。最大までためるのにかかる時間も短縮することができる。",
    titleJpEn: "Skull Bash (Side Special)",
    textJpEn: "Using a flick input lets you start charging from a partially charged state. This also reduces the time needed to reach maximum charge.",
    titlePt: "Cabeçada Foguete (Especial Lateral)",
    textPt: "Usar uma entrada rápida permite começar a carregar a partir de um estado parcialmente carregado. Isso também reduz o tempo necessário para atingir a carga máxima.",
  },
  {
    titleEn: "[★★☆] Quick Attack (Up Special)",
    titleJp: "でんこうせっか 【上必殺ワザ】",
    textJp: "空中で移動が終了すると、落下から着地まで大きいスキができるけれど、地面に衝突するように着地すると、少しだけ早く行動できる。",
    titleJpEn: "Quick Attack (Up Special)",
    textJpEn: "When the dash ends in midair, there's a large window of vulnerability from the fall until landing. However, if you crash directly into the ground, you can act slightly sooner.",
    titlePt: "Ataque Rápido (Especial Cima)",
    textPt: "Quando o avanço termina no ar, há uma grande janela de vulnerabilidade desde a queda até o pouso. Porém, se você colidir diretamente com o chão, pode agir um pouco mais cedo.",
  },
  {
    titleEn: "[★☆☆] Controlling Quick Attack (Up Special)",
    titleJp: "でんこうせっかで移動 【上必殺ワザ】",
    textJp: "好きな方向へ、素早く移動しつつ攻撃するワザ。２回まで移動できるが、続けて同じ方向へは動けない。",
    titleJpEn: "Controlling Quick Attack (Up Special)",
    textJpEn: "A move that quickly dashes and attacks in any chosen direction. You can dash up to twice, but cannot dash in the same direction consecutively.",
    titlePt: "Controlando o Ataque Rápido (Especial Cima)",
    textPt: "Um movimento que avança rapidamente e ataca em qualquer direção escolhida. Você pode avançar até duas vezes, mas não pode avançar na mesma direção consecutivamente.",
  },
  {
    titleEn: "[★★★] Thunder (Down Special)",
    titleJp: "かみなり 【下必殺ワザ】",
    textJp: "雲から出た直後の「かみなり」にメテオの効果がある。相手を上に投げてから出すと強力な連携ワザに。",
    titleJpEn: "Thunder (Down Special)",
    textJpEn: "The Thunder bolt right as it exits the cloud has a meteor effect. Using it after throwing an opponent upward makes for a powerful combo.",
    titlePt: "Trovão (Especial Baixo)",
    textPt: "O raio bem ao sair da nuvem tem efeito meteoro. Usá-lo após arremessar um adversário para cima resulta em um poderoso combo.",
  },
  {
    titleEn: "[★★☆] Electric Discharge with Thunder (Down Special)",
    titleJp: "かみなりで放電 【下必殺ワザ】",
    textJp: "かみなりを自分で受けて放電すると、自分の周囲を攻撃できる。落ちだしてすぐのかみなりは地形を貫通するので、すり抜け床の下でも使える。",
    titleJpEn: "Electric Discharge with Thunder (Down Special)",
    textJpEn: "Receiving Thunder yourself triggers an electric discharge that attacks the surrounding area. Thunder fired at the very start of its fall passes through terrain, so it can be used below pass-through platforms.",
    titlePt: "Descarga Elétrica com Trovão (Especial Baixo)",
    textPt: "Receber o Trovão você mesmo desencadeia uma descarga elétrica que ataca a área ao redor. O Trovão disparado no início da queda atravessa o terreno, então pode ser usado abaixo de plataformas passantes.",
  },
  {
    titleEn: "[★☆☆] Volt Tackle (Final Smash)",
    titleJp: "ボルテッカー 【最後の切りふだ】",
    textJp: "電撃をまとって突進し、相手に当たると画面内を縦横無尽に反射する。カメラは固定されるが、画面の外に逃げることはできる。",
    titleJpEn: "Volt Tackle (Final Smash)",
    textJpEn: "Charges cloaked in electricity, and upon hitting an opponent, bounces freely across the screen. The camera locks in place, but opponents can escape off-screen.",
    titlePt: "Volt Tackle (Final Smash)",
    textPt: "Avança envolto em eletricidade e, ao acertar um adversário, quica livremente pela tela. A câmera trava no lugar, mas os adversários podem escapar para fora da tela.",
  },
  {
    titleEn: "[★☆☆] Headbutt (Neutral Attack)",
    titleJp: "ずつき 【弱攻撃】",
    textJp: "攻撃ボタンを押し続けるだけで連打できる。相手に連続ヒットするとピカチュウ自身が少しずつ後退するので、空振りしないように切り上げよう。",
    titleJpEn: "Headbutt (Neutral Attack)",
    textJpEn: "Holding the attack button keeps it going. When it hits consecutively, Pikachu itself gradually backs up, so stop before you start whiffing.",
    titlePt: "Cabeçada (Ataque Neutro)",
    textPt: "Segurar o botão de ataque mantém o ataque contínuo. Quando acerta consecutivamente, o próprio Pikachu recua gradualmente, então pare antes de começar a errar.",
  },
  {
    titleEn: "[★☆☆] Electric Flower (Down Smash)",
    titleJp: "ねずみはなび 【下スマッシュ攻撃】",
    textJp: "ピカチュウ自身が回転しながら周囲を巻き込む、スマッシュ攻撃。向いている方向にふっとばせるので、ガケ際で使うとかなり強力。",
    titleJpEn: "Mouse Fireworks (Down Smash)",
    textJpEn: "A smash attack where Pikachu spins and hits the surrounding area. It launches opponents in the direction Pikachu is facing, making it very powerful near the ledge.",
    titlePt: "Fogos de Rato (Down Smash)",
    textPt: "Um ataque smash onde o Pikachu gira e acerta a área ao redor. Arremessa os adversários na direção que o Pikachu está encarando, tornando-o muito poderoso perto da borda.",
  },
  {
    titleEn: "[★☆☆] Neutral Air Attack",
    titleJp: "通常空中攻撃",
    textJp: "電気を身にまとい、周囲を攻撃する。リーチは短いが、向きを気にせず出せる。攻撃が出るまでが早く、当てた後も追撃しやすい便利なワザ。",
    titleJpEn: "Neutral Air Attack",
    textJpEn: "Wraps itself in electricity to attack the surrounding area. Short reach, but can be used without worrying about facing direction. Comes out fast and easy to follow up after connecting.",
    titlePt: "Ataque Aéreo Neutro",
    textPt: "Envolve-se em eletricidade para atacar a área ao redor. Alcance curto, mas pode ser usado sem se preocupar com a direção. Sai rápido e fácil de fazer follow-up após conectar.",
  },
  {
    titleEn: "[★☆☆] Glider (Back Air Attack)",
    titleJp: "グライダー 【後空中攻撃】",
    textJp: "素早く出せて、多段ヒットで相手を巻き込みやすい。リーチが短いため、相手にかなり接近しないと当たらない。",
    titleJpEn: "Glider (Back Air Attack)",
    textJpEn: "Comes out quickly and easily catches opponents with multiple hits. Short reach, so you need to get quite close for it to connect.",
    titlePt: "Planador (Ataque Aéreo Traseiro)",
    textPt: "Sai rapidamente e facilmente pega os adversários com múltiplos golpes. Alcance curto, então você precisa se aproximar bastante para conectar.",
  },
  {
    titleEn: "[★★☆] Electric Screw (Down Air Attack)",
    titleJp: "でんげきスクリュー 【下空中攻撃】",
    textJp: "ワザの出始めに、メテオ効果がある。ピカチュウは復帰も得意なので、場外の相手に積極的に狙いたい。",
    titleJpEn: "Electric Screw (Down Air Attack)",
    textJpEn: "Has a meteor effect at the very start of the move. Since Pikachu excels at recovery, actively aim this at offstage opponents.",
    titlePt: "Parafuso Elétrico (Ataque Aéreo Baixo)",
    textPt: "Tem efeito meteoro no início do movimento. Como o Pikachu é excelente em recuperação, mire ativamente nos adversários fora do palco.",
  },
];

async function main() {
  const pikachu = await db.fighter.findFirst({
    where: { name: "Pikachu" },
    select: {
      id: true,
      tips: { select: { id: true, titleEn: true } },
      bios: { select: { id: true, smashGameVersion: true, contentJp: true } },
    },
  });
  if (!pikachu) { console.log("Pikachu not found"); return; }
  console.log(`Pikachu (${pikachu.id}): ${pikachu.tips.length} tips`);

  // Fix SSB64 bio JP
  const bio64 = pikachu.bios.find(b => b.smashGameVersion === "SSB64");
  if (bio64 && (!bio64.contentJp || bio64.contentJp === "NOT FOUND")) {
    await db.fighterBio.update({
      where: { id: bio64.id },
      data: { contentJp: SSB64_BIO_JP, contentJpEn: SSB64_BIO_JPEN, contentPt: SSB64_BIO_PT },
    });
    console.log("✅ Bio SSB64: JP + JpEn + PT adicionados");
  }

  // Update tips
  let updated = 0;
  for (const data of PIKACHU_TIPS) {
    const tip = pikachu.tips.find(t => t.titleEn === data.titleEn);
    if (!tip) { console.log(`  ⚠️  Tip não encontrada: "${data.titleEn}"`); continue; }
    await db.fighterTip.update({
      where: { id: tip.id },
      data: {
        titleJp: data.titleJp, textJp: data.textJp,
        titleJpEn: data.titleJpEn, textJpEn: data.textJpEn,
        titlePt: data.titlePt, textPt: data.textPt,
      },
    });
    console.log(`  ✅ ${data.titleEn}`);
    updated++;
  }

  console.log(`\n✅ ${updated}/${PIKACHU_TIPS.length} tips atualizadas`);
  await db.$disconnect();
}
main().catch(console.error);
