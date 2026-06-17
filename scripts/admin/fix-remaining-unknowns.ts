import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

const updates: Record<string, string> = {
  "Minecraft: Wii U Edition": "Wii U",
  "Super Mario Bros. Wonder": "Nintendo Switch",
  "Princess Peach: Showtime!": "Nintendo Switch",
  "Dragon Quest V: Hand of the Heavenly Bride": "Super Nintendo Entertainment System",
  "Pikmin 4": "Nintendo Switch",
  "New Super Mario Bros. U Deluxe": "Nintendo Switch",
  "Dragon Quest IV: Chapters of the Chosen": "Family Computer",
  "Kingdom Hearts HD 1.5 ReMIX": "PlayStation 3",
  "Xenoblade Chronicles 3": "Nintendo Switch",
  "Ultra Street Fighter II: The Final Challengers": "Nintendo Switch",
  "Tekken: Blood Vengeance": "Movies/TV",
  "Minecraft: Pocket Edition": "Mobile",
  "Famicom Detective Club: The Missing Heir": "Famicom Disk System",
  "Famicom Disk System": "Famicom Disk System",
  "Chibi-Robo! Photo Finder": "Nintendo 3DS",
  "Rayman Legends: Definitive Edition": "Nintendo Switch",
  "Dragon Quest II: Luminaries of the Legendary Line": "Family Computer",
  "Banjo-Kazooie": "Nintendo 64",
  "Dragon Quest III: The Seeds of Salvation": "Family Computer",
  "Zelda: Ocarina of Time": "Nintendo 64",
  "Bomberman": "Family Computer",
  "Virtua Fighter": "Arcade",
  "Super Smash Bros. for Nintendo 3DS / Wii U": "Nintendo 3DS",
  "Nintendo Labo: VR Kit": "Nintendo Switch",
  "Tetris 99": "Nintendo Switch",
  "Art of Fighting 3": "Neo Geo",
  "Snipperclips": "Nintendo Switch",
  "No More Heroes": "Wii",
  "No More Heroes 3": "Nintendo Switch",
  "Moero! Nekketsu Rhythm Damashii: Osu! Tatakae! Ouendan 2": "Nintendo DS",
  "Culdcept": "PlayStation 2",
  "And-Kensaku": "Wii",
  "Pokémon: Let's Go, Eevee!": "Nintendo Switch",
  "Nintendo Labo: Vehicle Kit": "Nintendo Switch",
  "Pokémon Sword & Shield": "Nintendo Switch",
  "Astral Chain": "Nintendo Switch",
  "Dragon Quest XI: Echoes of an Elusive Age": "PlayStation 4",
  "Ring Fit Adventure": "Nintendo Switch",
  "Paper Mario: The Origami King": "Nintendo Switch",
  "Hyrule Warriors: Age of Calamity": "Nintendo Switch",
  "Minecraft: Xbox One Edition": "Xbox One",
  "Super Mario 3D World + Bowser's Fury": "Nintendo Switch",
  "Tekken 5": "Arcade",
  "Splatoon 3": "Nintendo Switch",
  "Hades": "PC",
  "Pokémon Scarlet & Violet": "Nintendo Switch",
  "Pokémon Scarlet & Violet: The Hidden Treasure of Area Zero": "Nintendo Switch",
  "Ghosts 'n Goblins": "Arcade",
  "Pokémon: Let's Go, Pikachu!": "Nintendo Switch",
  "Xenoblade Chronicles 2: Torna ~ The Golden Country": "Nintendo Switch",
  "Napoleon": "Game Boy Advance",
  "Nintendoji": "Nintendo DS",
  "Nintendo Labo: Robot Kit": "Nintendo Switch",
  "Metroid Dread": "Nintendo Switch",
  "Animal Crossing: New Horizons": "Nintendo Switch",
  "Psycho Soldier": "Arcade",
  "Ralf: TNK IIIClark: Ikari Warriors": "Arcade",
  "Renegade": "Arcade",
  "Marvelous: Mouhitotsu no Takarajima": "Super Nintendo Entertainment System",
  "Calciobit": "Game Boy Advance",
  "Nintendo Pocket Football Club": "Nintendo 3DS",
  "Yakuman": "Game Boy",
  "X": "Game Boy",
  "Panel de Pon": "Super Nintendo Entertainment System",
  "Sujin Taisen: Number Battles": "Nintendo DS",
  "Fossil Fighters": "Nintendo DS",
  "Tōjin Makyō Den: Heracles no Eikō": "Family Computer",
  "Looksley's Line Up": "Nintendo DS",
  "Tsukutte Utau: Saru Band": "Nintendo DS",
  "Takt of Magic": "Wii",
  "Nintendo News section": "Wii U",
  "BoxBoy!": "Nintendo 3DS",
  "Sushi Striker: The Way of Sushido": "Nintendo 3DS",
  "Samurai Shodown": "Neo Geo"
};

async function run() {
  let count = 0;
  for (const [title, consoleName] of Object.entries(updates)) {
    const result = await db.chronicleEntry.updateMany({
      where: { titleNtsc: title },
      data: { consoleName }
    });
    if (result.count > 0) {
      count += result.count;
      console.log(`[✓] ${title} -> ${consoleName}`);
    }
  }
  console.log(`\nFixed ${count} entries.`);
}

run().finally(() => db.$disconnect());
