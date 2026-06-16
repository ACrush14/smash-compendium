import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const FIGHTER_MAIN_GAMES: Record<string, string[]> = {
  // Super Mario
  "Mario": ["Super Mario Bros.", "Super Mario Bros. 2", "Super Mario Bros. 3", "Super Mario World", "Super Mario 64", "Super Mario Sunshine", "Super Mario Galaxy", "Super Mario Odyssey"],
  "Donkey Kong": ["Donkey Kong", "Donkey Kong Country", "Donkey Kong Country 2: Diddy's Kong Quest", "Donkey Kong 64", "Donkey Kong Country Returns", "Donkey Kong Country: Tropical Freeze"],
  "Link": ["The Legend of Zelda", "Zelda II - The Adventure of Link", "The Legend of Zelda: A Link to the Past", "The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Twilight Princess", "The Legend of Zelda: Skyward Sword", "The Legend of Zelda: Breath of the Wild"],
  "Samus": ["Metroid", "Super Metroid", "Metroid Fusion", "Metroid Prime", "Metroid: Other M", "Metroid: Samus Returns"],
  "Dark Samus": ["Metroid Prime 2: Echoes", "Metroid Prime 3: Corruption"],
  "Yoshi": ["Super Mario World", "Super Mario World 2: Yoshi's Island", "Yoshi's Story", "Yoshi's Woolly World", "Yoshi's Crafted World"],
  "Kirby": ["Kirby's Dream Land", "Kirby's Adventure", "Kirby Super Star", "Kirby 64: The Crystal Shards", "Kirby's Return to Dream Land", "Kirby: Planet Robobot", "Kirby Star Allies"],
  "Fox": ["Star Fox", "Star Fox 64", "Star Fox Adventures", "Star Fox: Assault", "Star Fox Zero"],
  "Pikachu": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon Yellow Version: Special Pikachu Edition", "Pokémon Gold Version", "Pokémon Silver Version", "Pokémon Sun", "Pokémon Moon"],
  "Luigi": ["Mario Bros.", "Super Mario Bros.", "Super Mario World", "Luigi's Mansion", "Luigi's Mansion: Dark Moon", "Luigi's Mansion 3"],
  "Ness": ["EarthBound"],
  "Captain Falcon": ["F-Zero", "F-Zero X", "F-Zero GX"],
  "Jigglypuff": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon Gold Version", "Pokémon Silver Version"],
  
  // Melee
  "Peach": ["Super Mario Bros.", "Super Mario Bros. 2", "Super Mario World", "Super Mario 64", "Super Princess Peach", "Super Mario Odyssey"],
  "Daisy": ["Super Mario Land", "Mario Tennis", "Mario Party 3"],
  "Bowser": ["Super Mario Bros.", "Super Mario Bros. 3", "Super Mario World", "Super Mario 64", "Super Mario Sunshine", "Super Mario Galaxy", "Super Mario Odyssey"],
  "Ice Climbers": ["Ice Climber"],
  "Sheik": ["The Legend of Zelda: Ocarina of Time"],
  "Zelda": ["The Legend of Zelda", "The Legend of Zelda: A Link to the Past", "The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: Twilight Princess", "The Legend of Zelda: A Link Between Worlds", "The Legend of Zelda: Breath of the Wild"],
  "Dr. Mario": ["Dr. Mario"],
  "Pichu": ["Pokémon Gold Version", "Pokémon Silver Version"],
  "Falco": ["Star Fox", "Star Fox 64", "Star Fox: Assault", "Star Fox Command"],
  "Marth": ["Fire Emblem: Shadow Dragon and the Blade of Light", "Fire Emblem: Mystery of the Emblem", "Fire Emblem: Shadow Dragon"],
  "Lucina": ["Fire Emblem Awakening"],
  "Young Link": ["The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: Majora's Mask"],
  "Ganondorf": ["The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Twilight Princess"],
  "Mewtwo": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon X", "Pokémon Y"],
  "Roy": ["Fire Emblem: The Binding Blade"],
  "Chrom": ["Fire Emblem Awakening"],
  "Mr. Game & Watch": ["Ball", "Fire", "Chef", "Judge", "Octopus"],
  
  // Brawl
  "Meta Knight": ["Kirby's Adventure", "Kirby Super Star", "Kirby's Return to Dream Land"],
  "Pit": ["Kid Icarus", "Kid Icarus: Uprising"],
  "Dark Pit": ["Kid Icarus: Uprising"],
  "Zero Suit Samus": ["Metroid: Zero Mission"],
  "Wario": ["Super Mario Land 2: 6 Golden Coins", "Wario Land: Super Mario Land 3", "WarioWare, Inc.: Mega Microgame$!", "WarioWare: Smooth Moves"],
  "Snake": ["Metal Gear", "Metal Gear Solid", "Metal Gear Solid 2: Sons of Liberty", "Metal Gear Solid 3: Snake Eater", "Metal Gear Solid 4: Guns of the Patriots"],
  "Ike": ["Fire Emblem: Path of Radiance", "Fire Emblem: Radiant Dawn"],
  "Pokémon Trainer": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon FireRed Version", "Pokémon LeafGreen Version"],
  "Squirtle": ["Pokémon Red Version", "Pokémon Blue Version"],
  "Ivysaur": ["Pokémon Red Version", "Pokémon Blue Version"],
  "Charizard": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon X", "Pokémon Y"],
  "Diddy Kong": ["Donkey Kong Country", "Donkey Kong Country 2: Diddy's Kong Quest", "Donkey Kong 64", "Donkey Kong Country Returns"],
  "Lucas": ["Mother 3"],
  "Sonic": ["Sonic the Hedgehog", "Sonic the Hedgehog 2", "Sonic Adventure", "Sonic Adventure 2", "Sonic Colors", "Sonic Generations"],
  "King Dedede": ["Kirby's Dream Land", "Kirby's Adventure", "Kirby Super Star", "Kirby's Return to Dream Land"],
  "Olimar": ["Pikmin", "Pikmin 2", "Pikmin 3"],
  "Lucario": ["Pokémon Diamond Version", "Pokémon Pearl Version", "Pokémon X", "Pokémon Y"],
  "R.O.B.": ["Gyromite", "Stack-Up"],
  "Toon Link": ["The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Phantom Hourglass", "The Legend of Zelda: Spirit Tracks"],
  "Wolf": ["Star Fox 64", "Star Fox: Assault", "Star Fox Command"],
  
  // SSB4
  "Villager": ["Animal Crossing", "Animal Crossing: Wild World", "Animal Crossing: City Folk", "Animal Crossing: New Leaf"],
  "Mega Man": ["Mega Man", "Mega Man 2", "Mega Man 3", "Mega Man 4"],
  "Wii Fit Trainer": ["Wii Fit", "Wii Fit Plus", "Wii Fit U"],
  "Rosalina & Luma": ["Super Mario Galaxy", "Super Mario Galaxy 2", "Super Mario 3D World"],
  "Little Mac": ["Punch-Out!!", "Super Punch-Out!!"],
  "Greninja": ["Pokémon X", "Pokémon Y"],
  "Mii Brawler": ["Mii Channel", "Wii Sports", "Tomodachi Life"],
  "Mii Swordfighter": ["Mii Channel", "Wii Sports Resort", "Miitopia"],
  "Mii Gunner": ["Mii Channel", "Wii Party", "Super Smash Bros. for Nintendo 3DS / Wii U"],
  "Palutena": ["Kid Icarus", "Kid Icarus: Uprising"],
  "Pac-Man": ["Pac-Man", "Pac-Land"],
  "Robin": ["Fire Emblem Awakening"],
  "Shulk": ["Xenoblade Chronicles"],
  "Bowser Jr.": ["Super Mario Sunshine", "New Super Mario Bros.", "Super Mario Galaxy"],
  "Duck Hunt": ["Duck Hunt"],
  "Ryu": ["Street Fighter", "Street Fighter II"],
  "Ken": ["Street Fighter", "Street Fighter II"],
  "Cloud": ["Final Fantasy VII"],
  "Corrin": ["Fire Emblem Fates: Birthright", "Fire Emblem Fates: Conquest"],
  "Bayonetta": ["Bayonetta", "Bayonetta 2"],
  
  // Ultimate
  "Inkling": ["Splatoon", "Splatoon 2"],
  "Ridley": ["Metroid", "Super Metroid", "Metroid: Zero Mission", "Metroid Prime", "Metroid: Samus Returns"],
  "Simon": ["Castlevania", "Castlevania II: Simon's Quest"],
  "Richter": ["Castlevania: Rondo of Blood", "Castlevania: Symphony of the Night"],
  "King K. Rool": ["Donkey Kong Country", "Donkey Kong Country 2: Diddy's Kong Quest", "Donkey Kong 64"],
  "Isabelle": ["Animal Crossing: New Leaf", "Animal Crossing: Happy Home Designer"],
  "Incineroar": ["Pokémon Sun", "Pokémon Moon"],
  "Piranha Plant": ["Super Mario Bros.", "Super Mario Bros. 3", "Super Mario World", "Super Mario Galaxy"],
  "Joker": ["Persona 5"],
  "Hero": ["Dragon Quest III", "Dragon Quest IV", "Dragon Quest VIII", "Dragon Quest XI S: Echoes of an Elusive Age - Definitive Edition"],
  "Banjo & Kazooie": ["Banjo-Kazooie", "Banjo-Tooie"],
  "Terry": ["Fatal Fury", "The King of Fighters '94"],
  "Byleth": ["Fire Emblem: Three Houses"],
  "Min Min": ["ARMS"],
  "Steve": ["Minecraft"],
  "Sephiroth": ["Final Fantasy VII"],
  "Pyra": ["Xenoblade Chronicles 2"],
  "Mythra": ["Xenoblade Chronicles 2"],
  "Kazuya": ["Tekken"],
  "Sora": ["Kingdom Hearts"]
};

async function run() {
  console.log("Iniciando a vinculação de jogos principais (Works Geral)...");
  
  // Pega todos os lutadores
  const fighters = await db.fighter.findMany();
  let linksAdded = 0;
  
  for (const fighter of fighters) {
    const titles = FIGHTER_MAIN_GAMES[fighter.name];
    if (!titles || titles.length === 0) continue;
    
    // Busca as entradas do chronicle pelos títulos exatos
    const entries = await db.chronicleEntry.findMany({
      where: {
        titleNtsc: { in: titles }
      }
    });
    
    if (entries.length === 0) {
      console.log(`\${fighter.name}: Nenhum jogo encontrado no Chronicle.`);
      continue;
    }
    
    // Vincula preservando as entradas que já existem (skipDuplicates)
    // Usamos displayOrder 99 para que o jogo de origem (Debut, com order menor) fique primeiro.
    const data = entries.map(e => ({
      fighterId: fighter.id,
      chronicleEntryId: e.id,
      displayOrder: 99
    }));
    
    const res = await db.fighterChronicleLink.createMany({
      data,
      skipDuplicates: true
    });
    
    if (res.count > 0) {
      console.log(`\${fighter.name}: Adicionado \${res.count} jogos principais.`);
      linksAdded += res.count;
    }
  }
  
  console.log(`Finalizado. Total de novos vínculos criados: \${linksAdded}.`);
  await db.$disconnect();
}

run().catch(console.error);
