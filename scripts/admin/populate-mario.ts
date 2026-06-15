import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const mario = await db.fighter.findUnique({ where: { name: "Mario" } });
  if (!mario) return;

  // 1. N64 Bios
  const n64En = "Although best known as the mustachioed plumber who battles the Turtle Tribe with his distinct jumping action, this internationally-famous hero has also acted as a referee, a driver, and even a doctor! He's been linked to Peach of Mushroom Kingdom, but to this day their true relationship remains a mystery.";
  const n64Pt = "Embora mais conhecido como o encanador bigodudo que batalha a Tribo das Tartarugas com seus pulos distintos, este herói mundialmente famoso também já atuou como juiz, motorista e até médico! Ele tem sido ligado a Peach do Reino do Cogumelo, mas até hoje a verdadeira relação deles permanece um mistério.";
  const n64Jp = "ジャンプアクションでカメ一族と戦うヒゲの配管工……として有名ですが、実はレフェリーやドライバー、医者もこなす国際的ヒーローです。\nキノコ王国のピーチ姫との仲を噂されていますが、二人の真の関係はいまだ謎に包まれています。";
  const n64JpEn = "Although famous as a mustachioed plumber who fights the turtle tribe with his jumping action, he is actually an international hero who has worked as a referee, driver, and doctor. He's rumored to be involved with Princess Peach of the Mushroom Kingdom, but the true nature of their relationship remains a mystery.";

  await db.fighterBio.upsert({
    where: { fighterId_smashGameVersion: { fighterId: mario.id, smashGameVersion: "SSB64" } },
    update: { contentEn: n64En, contentPt: n64Pt, contentJp: n64Jp, contentJpEn: n64JpEn },
    create: { fighterId: mario.id, smashGameVersion: "SSB64", contentEn: n64En, contentPt: n64Pt, contentJp: n64Jp, contentJpEn: n64JpEn }
  });

  // 2. Melee Descriptions
  const meleeSmashEn = "Mario is a true videogame superstar; he's easily the most famous character in the Nintendo universe. Known for his positive attitude, his overalls, and his trademark mustache, Mario is instantly recognizable across the globe. He's incredibly versatile, so he can fill virtually any role, but his main claim to fame is his jumping ability.";
  const meleeSmashPt = "Mario é uma verdadeira superestrela dos videogames; ele é facilmente o personagem mais famoso do universo Nintendo. Conhecido por sua atitude positiva, seu macacão e seu bigode característico, Mario é instantaneamente reconhecível em todo o mundo. Ele é incrivelmente versátil, podendo assumir praticamente qualquer papel, mas sua fama principal vem de sua habilidade de pular.";
  const meleeSmashJp = "世界でいちばん有名なゲームキャラクターといえる、ミスターニンテンドー。\nトレードマークは、オーバーオールに立派なヒゲ。\n持ち前の明るい性格と、バツグンの運動神経でどんな活躍でもこなす。\n中でも、ジャンプによるアクションはお手のものである。";
  const meleeSmashJpEn = "Mr. Nintendo, arguably the most famous game character in the world. His trademark is his overalls and magnificent mustache. With his innate cheerful personality and outstanding athleticism, he can handle any situation. Above all, his jumping action is his specialty.";

  await db.fighterBio.upsert({
    where: { fighterId_smashGameVersion: { fighterId: mario.id, smashGameVersion: "SSBM" } },
    update: { contentEn: meleeSmashEn, contentPt: meleeSmashPt, contentJp: meleeSmashJp, contentJpEn: meleeSmashJpEn },
    create: { fighterId: mario.id, smashGameVersion: "SSBM", contentEn: meleeSmashEn, contentPt: meleeSmashPt, contentJp: meleeSmashJp, contentJpEn: meleeSmashJpEn }
  });

  // 3. Other Works (Chronicles)
  const games = [
    "Super Mario Bros. 3", "Super Mario World", "Super Mario 64", 
    "Super Mario Sunshine", "Super Mario Galaxy", "Super Mario 3D Land", 
    "Super Mario 3D World", "Super Mario Odyssey"
  ];

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    // Find chronicle entry
    const ce = await db.chronicleEntry.findFirst({
      where: { titleNtsc: { contains: game, mode: "insensitive" } }
    });
    if (ce) {
      await db.fighterChronicleLink.upsert({
        where: { fighterId_chronicleEntryId: { fighterId: mario.id, chronicleEntryId: ce.id } },
        update: { displayOrder: i + 1 },
        create: { fighterId: mario.id, chronicleEntryId: ce.id, displayOrder: i + 1, isDebut: false }
      });
    }
  }

  // 4. Update Media Assets (GIFs and YouTube)
  // We can add them as Collectibles with type="MEDIA"
  const medias = [
    { name: "Super Mario 64 Gameplay", type: "MEDIA", assetRenderUrl: "https://media.giphy.com/media/WZdlab0U3AkSc/giphy.gif", sourceType: "Giphy" },
    { name: "Super Mario Sunshine Gameplay", type: "MEDIA", assetRenderUrl: "https://media.giphy.com/media/1zpLN0bPW5o3Mnrfiy/giphy.gif", sourceType: "Giphy" },
    { name: "Mario Youtube Video 1", type: "MEDIA", assetRenderUrl: "https://www.youtube.com/embed/TrR2nhdzeW4?start=2239", sourceType: "YouTube" },
    { name: "Mario Youtube Video 2", type: "MEDIA", assetRenderUrl: "https://www.youtube.com/embed/x2SDodHPR1E", sourceType: "YouTube" }
  ];

  for (const media of medias) {
    const existing = await db.collectible.findFirst({ where: { name: media.name, fighterId: mario.id } });
    if (!existing) {
      await db.collectible.create({
        data: {
          fighterId: mario.id,
          type: media.type,
          name: media.name,
          smashGameVersion: "SSBU",
          assetRenderUrl: media.assetRenderUrl,
          sourceType: media.sourceType,
        }
      });
    }
  }

  console.log("Mario PoC successfully seeded.");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
