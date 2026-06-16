import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const MISSING_3RD_PARTY_GAMES = [
  { titleNtsc: "Sonic the Hedgehog", consoleName: "Sega Genesis", releaseDateNtsc: "1991/06/23" },
  { titleNtsc: "Sonic Adventure 2", consoleName: "Nintendo GameCube", releaseDateNtsc: "2001/06/18" },
  { titleNtsc: "Sonic Generations", consoleName: "Nintendo 3DS", releaseDateNtsc: "2011/11/01" },
  
  { titleNtsc: "Metal Gear Solid", consoleName: "PlayStation", releaseDateNtsc: "1998/09/03" },
  { titleNtsc: "Metal Gear Solid 3: Snake Eater", consoleName: "PlayStation 2", releaseDateNtsc: "2004/11/17" },
  
  { titleNtsc: "Final Fantasy VII", consoleName: "PlayStation", releaseDateNtsc: "1997/01/31" },
  
  { titleNtsc: "Persona 5", consoleName: "PlayStation 4", releaseDateNtsc: "2016/09/15" },
  
  { titleNtsc: "Dragon Quest III", consoleName: "Family Computer", releaseDateNtsc: "1988/02/10" },
  { titleNtsc: "Dragon Quest VIII", consoleName: "PlayStation 2", releaseDateNtsc: "2004/11/27" },
  { titleNtsc: "Dragon Quest XI", consoleName: "Nintendo Switch", releaseDateNtsc: "2017/07/29" },
  
  { titleNtsc: "Banjo-Kazooie", consoleName: "Nintendo 64", releaseDateNtsc: "1998/06/29" },
  
  { titleNtsc: "Fatal Fury", consoleName: "Neo Geo", releaseDateNtsc: "1991/11/25" },
  { titleNtsc: "The King of Fighters '94", consoleName: "Neo Geo", releaseDateNtsc: "1994/08/25" },
  
  { titleNtsc: "Minecraft", consoleName: "PC", releaseDateNtsc: "2011/11/18" },
  
  { titleNtsc: "Tekken", consoleName: "Arcade", releaseDateNtsc: "1994/12/09" },
  
  { titleNtsc: "Kingdom Hearts", consoleName: "PlayStation 2", releaseDateNtsc: "2002/03/28" },
  
  { titleNtsc: "Castlevania", consoleName: "Nintendo Entertainment System", releaseDateNtsc: "1986/09/26" },
  { titleNtsc: "Castlevania: Symphony of the Night", consoleName: "PlayStation", releaseDateNtsc: "1997/03/20" }
];

// Limite: 2 de lançamento + Até 5 famosos = Max 7
const FIGHTER_MAIN_GAMES: Record<string, string[]> = {
  // Super Mario
  "Mario": ["Donkey Kong", "Super Mario Bros.", "Super Mario World", "Super Mario 64", "Super Mario Galaxy", "Super Mario Odyssey"],
  "Donkey Kong": ["Donkey Kong", "Donkey Kong Country", "Donkey Kong 64", "Donkey Kong Country Returns", "Donkey Kong Country: Tropical Freeze"],
  "Link": ["The Legend of Zelda", "The Legend of Zelda: A Link to the Past", "The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Twilight Princess", "The Legend of Zelda: Breath of the Wild"],
  "Samus": ["Metroid", "Super Metroid", "Metroid Prime", "Metroid Fusion", "Metroid: Samus Returns", "Metroid Dread"],
  "Dark Samus": ["Metroid Prime 2: Echoes", "Metroid Prime 3: Corruption"],
  "Yoshi": ["Super Mario World", "Super Mario World 2: Yoshi's Island", "Yoshi's Story", "Yoshi's Woolly World", "Yoshi's Crafted World"],
  "Kirby": ["Kirby's Dream Land", "Kirby's Adventure", "Kirby Super Star", "Kirby's Return to Dream Land", "Kirby Star Allies"],
  "Fox": ["Star Fox", "Star Fox 64", "Star Fox Adventures", "Star Fox: Assault", "Star Fox Zero"],
  "Pikachu": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon Yellow Version: Special Pikachu Edition", "Pokémon Gold Version", "Pokémon Silver Version"],
  "Luigi": ["Mario Bros.", "Super Mario Bros.", "Super Mario World", "Luigi's Mansion", "Luigi's Mansion 3"],
  "Ness": ["EarthBound"],
  "Captain Falcon": ["F-Zero", "F-Zero X", "F-Zero GX"],
  "Jigglypuff": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon Gold Version", "Pokémon Silver Version"],
  
  // Melee
  "Peach": ["Super Mario Bros.", "Super Mario Bros. 2", "Super Mario 64", "Super Princess Peach", "Super Mario Odyssey"],
  "Daisy": ["Super Mario Land", "Mario Tennis", "Mario Party 3"],
  "Bowser": ["Super Mario Bros.", "Super Mario Bros. 3", "Super Mario 64", "Super Mario Galaxy", "Super Mario Odyssey"],
  "Ice Climbers": ["Ice Climber"],
  "Sheik": ["The Legend of Zelda: Ocarina of Time"],
  "Zelda": ["The Legend of Zelda", "The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: Twilight Princess", "The Legend of Zelda: A Link Between Worlds", "The Legend of Zelda: Breath of the Wild"],
  "Dr. Mario": ["Dr. Mario"],
  "Pichu": ["Pokémon Gold Version", "Pokémon Silver Version"],
  "Falco": ["Star Fox", "Star Fox 64", "Star Fox: Assault"],
  "Marth": ["Fire Emblem: Shadow Dragon and the Blade of Light", "Fire Emblem: Mystery of the Emblem"],
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
  "Wario": ["Super Mario Land 2: 6 Golden Coins", "Wario Land: Super Mario Land 3", "WarioWare, Inc.: Mega Microgame$!"],
  "Snake": ["Metal Gear", "Metal Gear Solid", "Metal Gear Solid 3: Snake Eater"],
  "Ike": ["Fire Emblem: Path of Radiance", "Fire Emblem: Radiant Dawn"],
  "Pokémon Trainer": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon FireRed Version", "Pokémon LeafGreen Version"],
  "Squirtle": ["Pokémon Red Version", "Pokémon Blue Version"],
  "Ivysaur": ["Pokémon Red Version", "Pokémon Blue Version"],
  "Charizard": ["Pokémon Red Version", "Pokémon Blue Version", "Pokémon X", "Pokémon Y"],
  "Diddy Kong": ["Donkey Kong Country", "Donkey Kong Country 2: Diddy's Kong Quest", "Donkey Kong 64", "Donkey Kong Country Returns"],
  "Lucas": ["Mother 3"],
  "Sonic": ["Sonic the Hedgehog", "Sonic Adventure 2", "Sonic Generations"],
  "King Dedede": ["Kirby's Dream Land", "Kirby's Adventure", "Kirby Super Star", "Kirby's Return to Dream Land"],
  "Olimar": ["Pikmin", "Pikmin 2", "Pikmin 3"],
  "Lucario": ["Pokémon Diamond Version", "Pokémon Pearl Version", "Pokémon X", "Pokémon Y"],
  "R.O.B.": ["Gyromite", "Stack-Up"],
  "Toon Link": ["The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Phantom Hourglass", "The Legend of Zelda: Spirit Tracks"],
  "Wolf": ["Star Fox 64", "Star Fox: Assault", "Star Fox Command"],
  
  // SSB4
  "Villager": ["Animal Crossing", "Animal Crossing: Wild World", "Animal Crossing: New Leaf"],
  "Mega Man": ["Mega Man", "Mega Man 2", "Mega Man 3"],
  "Wii Fit Trainer": ["Wii Fit", "Wii Fit Plus"],
  "Rosalina & Luma": ["Super Mario Galaxy", "Super Mario 3D World"],
  "Little Mac": ["Punch-Out!!", "Super Punch-Out!!"],
  "Greninja": ["Pokémon X", "Pokémon Y"],
  "Mii Brawler": ["Mii Channel", "Wii Sports"],
  "Mii Swordfighter": ["Mii Channel", "Wii Sports Resort"],
  "Mii Gunner": ["Mii Channel", "Wii Party"],
  "Palutena": ["Kid Icarus", "Kid Icarus: Uprising"],
  "Pac-Man": ["Pac-Man"],
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
  "Ridley": ["Metroid", "Super Metroid", "Metroid Prime"],
  "Simon": ["Castlevania", "Castlevania II: Simon's Quest"],
  "Richter": ["Castlevania: Rondo of Blood", "Castlevania: Symphony of the Night"],
  "King K. Rool": ["Donkey Kong Country", "Donkey Kong 64"],
  "Isabelle": ["Animal Crossing: New Leaf", "Animal Crossing: Happy Home Designer"],
  "Incineroar": ["Pokémon Sun", "Pokémon Moon"],
  "Piranha Plant": ["Super Mario Bros.", "Super Mario Bros. 3", "Super Mario 64"],
  "Joker": ["Persona 5"],
  "Hero": ["Dragon Quest III", "Dragon Quest VIII", "Dragon Quest XI"],
  "Banjo & Kazooie": ["Banjo-Kazooie"],
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
  console.log("Iniciando a inserção de jogos Third-Party faltantes no Chronicle...");
  for (const game of MISSING_3RD_PARTY_GAMES) {
    const exists = await db.chronicleEntry.findFirst({ where: { titleNtsc: game.titleNtsc } });
    if (!exists) {
      await db.chronicleEntry.create({
        data: {
          consoleName: game.consoleName,
          titleNtsc: game.titleNtsc,
          releaseDateNtsc: game.releaseDateNtsc,
          id: `custom_chr_${game.titleNtsc.replace(/[^a-zA-Z0-9]/g, '')}`
        }
      });
      console.log(`+ Inserido ${game.titleNtsc}`);
    }
  }

  console.log("Removendo vínculos antigos de works (displayOrder = 99)...");
  await db.fighterChronicleLink.deleteMany({
    where: { displayOrder: 99 }
  });

  console.log("Iniciando a vinculação limitada de jogos principais (Works Geral)...");
  
  const fighters = await db.fighter.findMany();
  let linksAdded = 0;
  
  for (const fighter of fighters) {
    const titles = FIGHTER_MAIN_GAMES[fighter.name];
    if (!titles || titles.length === 0) continue;
    
    const entries = await db.chronicleEntry.findMany({
      where: { titleNtsc: { in: titles } }
    });
    
    if (entries.length === 0) continue;
    
    // Sort array so that it respects the requested limit of maximum 7 elements total.
    // Our object defines exactly the ones we want.
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
      console.log(`${fighter.name}: ${res.count} jogos mapeados.`);
      linksAdded += res.count;
    }
  }
  
  console.log(`Finalizado! Total de ${linksAdded} novos links injetados no Works Geral com as regras rígidas.`);
  await db.$disconnect();
}

run().catch(console.error);
