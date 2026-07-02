import { db } from "../../lib/db";

const BIO_PT_JPEN: Record<string, { pt: string; jpEn: string }> = {
  SSBM: {
    jpEn: "Released beginning in 1980, \"Game & Watch\" is the ancestor of portable liquid crystal games. The character was solid black, but had personality and approachability. 39 different games were sold in Japan, totaling over 12 million units (over 43 million including overseas). It once became a huge boom. Pictured at left is the particularly popular \"Fire\" model. Fire (GW) Manhole (GW)",
    pt: "Lançado a partir de 1980, \"Game & Watch\" é o ancestral dos jogos portáteis de cristal líquido. O personagem era totalmente preto, mas tinha personalidade e simpatia. Foram vendidos 39 jogos diferentes no Japão, totalizando mais de 12 milhões de unidades (mais de 43 milhões incluindo o exterior). Já foi um grande sucesso. À esquerda está o modelo particularmente popular \"Fire\". Fire (GW) Manhole (GW)",
  },
  SSBB: {
    jpEn: "\"Game & Watch\" is the original portable game console, debuting in 1980. The solid black character oozes personality. When it first released, the game content was mostly simple, but as the times progressed, the technology evolved too. There was the \"Multi Screen\" series, playable across two screens. True to the name \"Game & Watch,\" the games also had a clock function.",
    pt: "\"Game & Watch\" é o console de jogos portátil original, estreando em 1980. O personagem totalmente preto exala personalidade. Quando foi lançado, o conteúdo dos jogos era em sua maioria simples, mas conforme os tempos avançaram, a tecnologia também evoluiu. Havia a série \"Multi Screen\", jogável em duas telas. Fiel ao nome \"Game & Watch\", os jogos também tinham função de relógio.",
  },
  SSB4: {
    jpEn: "\"Game & Watch\" was a handheld game console released in 1980 that became the root of the Game Boy and Nintendo DS. In Smash Bros., its choppy, LCD-animated character joins the fight. With movement that sets it apart from its rivals, it gives off a unique atmosphere. It has an array of powerful, easy-to-use moves, but true to its paper-thin appearance, it's easily sent flying.",
    pt: "\"Game & Watch\" foi um console de jogos portátil lançado em 1980 que se tornou a raiz do Game Boy e do Nintendo DS. Em Smash Bros., seu personagem animado em LCD, com movimentos truncados, entra na luta. Com movimentos que o diferenciam de seus rivais, ele passa uma atmosfera única. Ele tem um arsenal de golpes poderosos e fáceis de usar, mas fiel à sua aparência fina como papel, é facilmente arremessado.",
  },
};

async function main() {
  const gnw = await db.fighter.findFirst({
    where: { name: "Mr. Game & Watch" },
    select: {
      id: true,
      bios: { select: { id: true, smashGameVersion: true } },
      moves: { select: { id: true, smashGameVersion: true, order: true } },
    },
  });
  if (!gnw) { console.log("Mr. Game & Watch not found"); return; }

  // Curator Overview
  await db.fighter.update({
    where: { id: gnw.id },
    data: {
      curatorOverviewEn: "Mr. Game & Watch, the flat 2D relic of Nintendo's earliest handhelds, fights with a bizarre, unpredictable toolkit — Chef lobs sausages, Judge rolls the dice on nine different effects, Fire launches him with a rescue helicopter, and Oil Panic turns absorbed projectiles into a devastating counterattack. His paper-thin design makes him easy to launch, but his quirky hitboxes and random-number chaos make him a persistent nightmare to read.",
      curatorOverviewPt: "Mr. Game & Watch, a relíquia 2D achatada dos primeiros portáteis da Nintendo, luta com um arsenal bizarro e imprevisível — Chef arremessa salsichas, Judge sorteia entre nove efeitos diferentes, Fire o lança com um helicóptero de resgate, e Oil Panic transforma projéteis absorvidos em um contra-ataque devastador. Seu design fino como papel o torna fácil de arremessar, mas suas hitboxes peculiares e o caos dos números aleatórios o tornam um pesadelo constante de se ler.",
      curatorOverviewJp: "任天堂初期の携帯ゲーム機の平面的な遺物、Mr.ゲーム＆ウォッチは、奇妙で予測不能な戦法で戦う――シェフはソーセージを投げ、ジャッジは９種類の効果からランダムに決まり、ファイアは救助ヘリで彼を打ち上げ、オイルパニックは吸収した飛び道具を強烈な反撃に変える。紙のように薄い見た目のせいでふっとばされやすいが、癖のある判定と乱数の混沌により、読みにくい強敵であり続ける。",
      curatorOverviewJpEn: "Mr. Game & Watch, the flat 2D relic of Nintendo's earliest handheld consoles, fights with a bizarre and unpredictable toolkit — Chef throws sausages, Judge is randomly decided among nine different effects, Fire launches him with a rescue helicopter, and Oil Panic turns absorbed projectiles into a fierce counterattack. His paper-thin appearance makes him easy to launch, but his quirky hitboxes and the chaos of random numbers keep him a persistently hard-to-read threat.",
    },
  });
  console.log("✅ Curator Overview (4 langs)");

  // Bios PT+JpEn (SSBM, SSBB, SSB4 — SSBU still missing official JP source)
  for (const [version, data] of Object.entries(BIO_PT_JPEN)) {
    const bio = gnw.bios.find(b => b.smashGameVersion === version);
    if (!bio) continue;
    await db.fighterBio.update({ where: { id: bio.id }, data: { contentPt: data.pt, contentJpEn: data.jpEn } });
    console.log(`✅ Bio [${version}]: PT+JpEn adicionados`);
  }

  // Moves EN+PT+JpEn
  const moveTexts: Record<string, { en: string; pt: string; jpEn: string }> = {
    "SSBM-0": {
      en: "A resident of a flat world. His appearance, and his very existence, radiate considerable impact and personality. Black. Extremely black. And extremely flat. \"Chef\" is a projectile that launches sausages. \"Judge\" has its attack type decided by a random number. Rolling a \"7\" is Lucky 7, causing a food item to appear. B: Chef; Side+B: Judge",
      pt: "Um habitante de um mundo plano. Sua aparência, e sua própria existência, irradiam um impacto e uma personalidade consideráveis. Preto. Extremamente preto. E extremamente plano. \"Chef\" é um projétil que lança salsichas. \"Judge\" tem seu tipo de ataque decidido por um número aleatório. Tirar um \"7\" é o Lucky 7, fazendo um item de comida aparecer. B: Chef; Lateral+B: Judge",
      jpEn: "A resident of a flat world. His appearance, and his very existence, radiate considerable impact and personality. Black. Extremely black. And extremely flat. \"Chef\" is a projectile that launches sausages. \"Judge\" has its attack type decided by a random number. Rolling a \"7\" is Lucky 7, causing a food item to appear. B: Chef; Side+B: Judge",
    },
    "SSBM-1": {
      en: "A senior figure among Nintendo characters, he's relatively lightweight and doesn't have many attacks that boast standout power, so he may struggle a little. \"Fire\" summons a rescue team that literally saves him when he's about to fall. \"Oil Panic\" absorbs projectiles up to three times, then releases their combined damage. Up+B: Fire; Down+B: Oil Panic",
      pt: "Uma figura veterana entre os personagens da Nintendo, ele é relativamente leve e não tem muitos ataques que se destacam por sua força, então pode enfrentar um pouco de dificuldade. \"Fire\" convoca uma equipe de resgate que literalmente o salva quando está prestes a cair. \"Oil Panic\" absorve projéteis até três vezes, depois libera o dano combinado. Cima+B: Fire; Baixo+B: Oil Panic",
      jpEn: "A senior figure among Nintendo characters, he's relatively lightweight and doesn't have many attacks that boast standout power, so he may struggle a little. \"Fire\" summons a rescue team that literally saves him when he's about to fall. \"Oil Panic\" absorbs projectiles up to three times, then releases their combined damage. Up+B: Fire; Down+B: Oil Panic",
    },
    "SSB4-0": {
      en: "Oil Panic is a special move that stores projectiles in a container, converting them to oil to attack the opponent. It can be charged up to three times, and releases when full. Some projectiles fill it up in a single hit. The oil's power changes based on the projectile absorbed — a fully charged Samus Charge Shot fills the container in one hit alone, with enough destructive power for a single KO. (GW) Game & Watch (1980/04)",
      pt: "Oil Panic é um golpe especial que armazena projéteis em um recipiente, convertendo-os em óleo para atacar o adversário. Pode ser carregado até três vezes, e é liberado quando está cheio. Alguns projéteis o enchem em um único golpe. O poder do óleo muda de acordo com o projétil absorvido — um Charge Shot totalmente carregado da Samus enche o recipiente em um único golpe, com poder destrutivo suficiente para um KO só com isso. (GW) Game & Watch (1980/04)",
      jpEn: "Oil Panic is a special move that stores projectiles in a container, converting them to oil to attack the opponent. It can be charged up to three times, and releases when full. Some projectiles fill it up in a single hit. The oil's power changes based on the projectile absorbed — a fully charged Samus Charge Shot fills the container in one hit alone, with enough destructive power for a single KO. (GW) Game & Watch (1980/04)",
    },
  };
  for (const [key, data] of Object.entries(moveTexts)) {
    const [version, orderStr] = key.split("-");
    const move = gnw.moves.find(m => m.smashGameVersion === version && m.order === Number(orderStr));
    if (!move) { console.log(`  ⚠️  Move não encontrado: ${key}`); continue; }
    await db.fighterMove.update({ where: { id: move.id }, data: { descEn: data.en, descPt: data.pt, descJpEn: data.jpEn } });
    console.log(`✅ Move [${key}]: EN+PT+JpEn adicionados`);
  }

  // Video fixes
  const ssbbTrophy = await db.collectible.findFirst({ where: { name: "Mr. Game & Watch", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssbbTrophy) {
    await db.collectible.update({ where: { id: ssbbTrophy.id }, data: { videoStartSec: 8318, videoEndSec: 8332 } });
    console.log(`✅ SSBB Trophy: ${ssbbTrophy.videoStartSec}-${ssbbTrophy.videoEndSec} -> 8318-8332 (2:18:38-2:18:52)`);
  }

  const ssb4Main = await db.collectible.findFirst({ where: { name: "Mr. Game & Watch", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (ssb4Main) {
    await db.collectible.update({ where: { id: ssb4Main.id }, data: { videoStartSec: 5379, videoEndSec: 5390 } });
    console.log(`✅ SSB4 Trophy "Mr. Game & Watch" WiiU: ${ssb4Main.videoStartSec}-${ssb4Main.videoEndSec} -> 5379-5390 (1:29:39-1:29:50)`);
  }

  await db.$disconnect();
}
main().catch(console.error);
