/**
 * seed-fighter-chronicle-works.ts
 *
 * Cria FighterChronicleLink para TODOS os lutadores com base em
 * um mapa curado de palavras-chave que são buscadas no DB.
 *
 * Cada keyword é buscada como substring (case-insensitive) em titleNtsc.
 * Múltiplas ChronicleEntries que correspondem ao mesmo jogo (ex.: versões SNES + GBA)
 * são todas linkadas — o site mostra a melhor disponível.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/admin/seed-fighter-chronicle-works.ts
 *   npx tsx --env-file=.env.local scripts/admin/seed-fighter-chronicle-works.ts --dry
 *   npx tsx --env-file=.env.local scripts/admin/seed-fighter-chronicle-works.ts --fighter Sora
 */
import { db } from "../../lib/db";

const DRY  = process.argv.includes("--dry");
const ONLY = process.argv.includes("--fighter")
  ? process.argv[process.argv.indexOf("--fighter") + 1]
  : null;

// ─────────────────────────────────────────────────────────────────────────────
// MAPA CURADO: fighter name → keywords (substring em titleNtsc, case-insensitive)
// ─────────────────────────────────────────────────────────────────────────────
const FIGHTER_WORKS: Record<string, string[]> = {

  // ─── MARIO UNIVERSE ───────────────────────────────────────────────────────
  "Mario": [
    "Super Mario Bros.", "Super Mario World", "Super Mario 64",
    "Super Mario Sunshine", "Super Mario Galaxy", "Super Mario 3D Land",
    "Super Mario 3D World", "Super Mario Odyssey",
  ],
  "Luigi": [
    "Super Mario Bros.", "Super Mario World", "Super Mario 64",
    "Super Mario Sunshine", "Luigi's Mansion", "Super Mario Galaxy",
    "Super Mario 3D Land", "Super Mario 3D World", "Super Mario Odyssey",
  ],
  "Peach": [
    "Super Mario Bros.", "Super Mario World", "Super Mario 64",
    "Super Mario Sunshine", "Super Mario Galaxy",
    "Super Mario 3D Land", "Super Mario 3D World", "Super Mario Odyssey",
  ],
  "Bowser": [
    "Super Mario Bros.", "Super Mario World", "Super Mario 64",
    "Super Mario Sunshine", "Super Mario Galaxy",
    "Super Mario 3D Land", "Super Mario 3D World", "Super Mario Odyssey",
  ],
  "Bowser Jr.": [
    "Super Mario Bros.", "Super Mario Sunshine",
    "Super Mario 3D World", "Super Mario Odyssey",
  ],
  "Rosalina & Luma": ["Super Mario Galaxy", "Super Mario 3D World"],
  "Daisy": ["Super Mario Land", "Super Mario Odyssey"],
  "Dr. Mario": ["Dr. Mario"],
  "Piranha Plant": [
    "Super Mario Bros.", "Super Mario World", "Super Mario 64",
    "Super Mario Sunshine", "Super Mario Odyssey",
  ],

  // ─── DONKEY KONG UNIVERSE ─────────────────────────────────────────────────
  "Donkey Kong": [
    "Donkey Kong Country", "Donkey Kong Country 2", "Donkey Kong Country 3",
    "Donkey Kong 64", "Donkey Kong Country Returns", "Donkey Kong Country: Tropical Freeze",
  ],
  "Diddy Kong": [
    "Donkey Kong Country", "Donkey Kong Country 2",
    "Donkey Kong 64", "Donkey Kong Country Returns", "Donkey Kong Country: Tropical Freeze",
  ],
  "King K. Rool": [
    "Donkey Kong Country", "Donkey Kong Country 2", "Donkey Kong Country 3", "Donkey Kong 64",
  ],

  // ─── ZELDA UNIVERSE ───────────────────────────────────────────────────────
  "Link": [
    "The Legend of Zelda", "Zelda II", "A Link to the Past", "Link's Awakening",
    "Ocarina of Time", "Majora's Mask", "Oracle of Ages", "Oracle of Seasons",
    "Four Swords", "Wind Waker", "Minish Cap", "Twilight Princess",
    "Phantom Hourglass", "Spirit Tracks", "Skyward Sword",
    "A Link Between Worlds", "Tri Force Heroes", "Breath of the Wild",
  ],
  "Zelda": [
    "The Legend of Zelda", "Zelda II", "A Link to the Past", "Link's Awakening",
    "Ocarina of Time", "Majora's Mask", "Wind Waker", "Twilight Princess",
    "Spirit Tracks", "Skyward Sword", "A Link Between Worlds", "Breath of the Wild",
  ],
  "Sheik": ["Ocarina of Time"],
  "Ganondorf": [
    "A Link to the Past", "Ocarina of Time", "Majora's Mask",
    "Wind Waker", "Four Swords Adventures", "Twilight Princess",
  ],
  "Young Link": [
    "Ocarina of Time", "Majora's Mask",
    "Oracle of Ages", "Oracle of Seasons", "Four Swords",
  ],
  "Toon Link": [
    "Wind Waker", "Four Swords", "Minish Cap",
    "Phantom Hourglass", "Spirit Tracks",
  ],

  // ─── SAMUS / METROID UNIVERSE ─────────────────────────────────────────────
  "Samus": ["Metroid"],   // "Metroid" matches todas as entradas Metroid no DB
  "Zero Suit Samus": ["Metroid"],
  "Ridley": ["Metroid"],
  "Dark Samus": ["Metroid Prime"],

  // ─── YOSHI UNIVERSE ───────────────────────────────────────────────────────
  "Yoshi": [
    "Yoshi's Island", "Yoshi's Story", "Yoshi Topi Wapi", "Yoshi's New Island",
    "Yoshi's Woolly World", "Yoshi's Crafted World",
    "Super Mario World 2",
  ],

  // ─── KIRBY UNIVERSE ───────────────────────────────────────────────────────
  "Kirby": ["Kirby"],
  "Meta Knight": ["Kirby"],
  "King Dedede": [
    "Kirby's Dream Land", "Kirby's Dream Land 2", "Kirby's Dream Land 3",
    "Kirby Super Star", "Kirby 64", "Kirby: Nightmare in Dream Land",
    "Kirby Air Ride", "Kirby: Squeak Squad", "Kirby Super Star Ultra",
    "Kirby's Return to Dream Land", "Kirby: Triple Deluxe",
    "Kirby: Planet Robobot", "Kirby Star Allies",
  ],

  // ─── STAR FOX UNIVERSE ────────────────────────────────────────────────────
  "Fox": ["Star Fox", "Starwing", "Lylat Wars"],
  "Falco": ["Star Fox", "Starwing", "Lylat Wars"],
  "Wolf": ["Star Fox 64", "Star Fox Assault", "Star Fox Command"],

  // ─── POKÉMON UNIVERSE ─────────────────────────────────────────────────────
  "Pikachu": [
    "Pokémon Red", "Pokémon Yellow", "Pokémon Gold", "Pokémon FireRed",
    "Pokémon HeartGold", "Pokémon X &", "Pokémon Sun", "Pokémon Sword",
  ],
  "Pichu": ["Pokémon Gold", "Pokémon HeartGold"],
  "Mewtwo": [
    "Pokémon Red", "Pokémon FireRed", "Pokémon HeartGold", "Pokémon X &", "Pokémon Sword",
  ],
  "Jigglypuff": [
    "Pokémon Red", "Pokémon Yellow", "Pokémon FireRed", "Pokémon HeartGold",
    "Pokémon X &", "Pokémon Sword",
  ],
  "Squirtle": [
    "Pokémon Red", "Pokémon Yellow", "Pokémon FireRed",
    "Pokémon HeartGold", "Pokémon X &", "Pokémon Sword",
  ],
  "Ivysaur": [
    "Pokémon Red", "Pokémon Yellow", "Pokémon FireRed",
    "Pokémon HeartGold", "Pokémon X &", "Pokémon Sword",
  ],
  "Charizard": [
    "Pokémon Red", "Pokémon Yellow", "Pokémon FireRed",
    "Pokémon HeartGold", "Pokémon X &", "Pokémon Sword",
  ],
  "Pokémon Trainer": [
    "Pokémon Red", "Pokémon Yellow", "Pokémon FireRed",
    "Pokémon HeartGold", "Pokémon X &", "Pokémon Sword",
  ],
  "Lucario": [
    "Pokémon Diamond", "Pokémon HeartGold", "Pokémon Black",
    "Pokémon X &", "Pokémon Sun", "Pokémon Sword",
  ],
  "Greninja": ["Pokémon X &", "Pokémon Sun", "Pokémon Sword"],
  "Incineroar": ["Pokémon Sun", "Pokémon Sword"],

  // ─── EARTHBOUND / MOTHER ──────────────────────────────────────────────────
  "Ness": ["EarthBound", "Mother"],
  "Lucas": ["Mother 3", "EarthBound Beginnings", "EarthBound"],

  // ─── F-ZERO ───────────────────────────────────────────────────────────────
  "Captain Falcon": ["F-Zero"],

  // ─── ICE CLIMBERS ─────────────────────────────────────────────────────────
  "Ice Climbers": ["Ice Climber"],

  // ─── MR. GAME & WATCH ─────────────────────────────────────────────────────
  "Mr. Game & Watch": ["Game & Watch Gallery"],

  // ─── WARIO UNIVERSE ───────────────────────────────────────────────────────
  "Wario": ["Wario Land", "WarioWare"],

  // ─── KID ICARUS ───────────────────────────────────────────────────────────
  "Pit": ["Kid Icarus"],
  "Palutena": ["Kid Icarus"],
  "Dark Pit": ["Kid Icarus: Uprising"],

  // ─── FIRE EMBLEM ──────────────────────────────────────────────────────────
  "Marth": [
    "Fire Emblem: Shadow Dragon and the Blade of Light",
    "Fire Emblem: Shadow Dragon",
    "Fire Emblem: New Mystery of the Emblem",
  ],
  "Roy": [
    "Fire Emblem: The Binding Blade",
    "Fire Emblem Awakening",
  ],
  "Ike": [
    "Fire Emblem: Path of Radiance",
    "Fire Emblem: Radiant Dawn",
  ],
  "Lucina": ["Fire Emblem Awakening"],
  "Robin": ["Fire Emblem Awakening"],
  "Corrin": ["Fire Emblem Fates"],
  "Chrom": ["Fire Emblem Awakening", "Fire Emblem Fates"],
  "Byleth": ["Fire Emblem: Three Houses"],

  // ─── ANIMAL CROSSING ──────────────────────────────────────────────────────
  "Villager": ["Animal Crossing"],
  "Isabelle": ["Animal Crossing"],

  // ─── PIKMIN ───────────────────────────────────────────────────────────────
  "Olimar": ["Pikmin"],

  // ─── XENOBLADE ────────────────────────────────────────────────────────────
  "Shulk": ["Xenoblade Chronicles"],
  "Pyra": ["Xenoblade Chronicles 2"],
  "Mythra": ["Xenoblade Chronicles 2"],

  // ─── MEGA MAN ─────────────────────────────────────────────────────────────
  "Mega Man": [
    "Mega Man", "Mega Man 2", "Mega Man 3", "Mega Man 4",
    "Mega Man 5", "Mega Man 6", "Mega Man 7", "Mega Man 8",
    "Mega Man 9", "Mega Man 10", "Mega Man X",
  ],

  // ─── SONIC ────────────────────────────────────────────────────────────────
  "Sonic": [
    "Sonic the Hedgehog", "Sonic CD", "Sonic Adventure",
    "Sonic Heroes", "Sonic Rush", "Sonic Unleashed",
    "Sonic Generations", "Sonic Lost World", "Sonic Forces",
  ],

  // ─── PAC-MAN ──────────────────────────────────────────────────────────────
  "Pac-Man": ["PAC-MAN", "Pac-Land"],

  // ─── LITTLE MAC ───────────────────────────────────────────────────────────
  "Little Mac": ["Punch-Out"],

  // ─── DUCK HUNT ────────────────────────────────────────────────────────────
  "Duck Hunt": ["Duck Hunt"],

  // ─── WII FIT TRAINER ──────────────────────────────────────────────────────
  "Wii Fit Trainer": ["Wii Fit"],

  // ─── R.O.B. ───────────────────────────────────────────────────────────────
  "R.O.B.": ["Gyromite", "Stack-Up"],

  // ─── MII FIGHTERS ─────────────────────────────────────────────────────────
  "Mii Brawler":     ["Mii"],
  "Mii Swordfighter": ["Mii"],
  "Mii Gunner":      ["Mii"],

  // ─── SNAKE ────────────────────────────────────────────────────────────────
  "Snake": ["Metal Gear"],

  // ─── RYU / KEN ────────────────────────────────────────────────────────────
  "Ryu": ["Street Fighter"],
  "Ken": ["Street Fighter"],

  // ─── CLOUD / SEPHIROTH ────────────────────────────────────────────────────
  "Cloud": ["Final Fantasy VII"],
  "Sephiroth": ["Final Fantasy VII"],

  // ─── BAYONETTA ────────────────────────────────────────────────────────────
  "Bayonetta": ["Bayonetta"],

  // ─── JOKER ────────────────────────────────────────────────────────────────
  "Joker": ["Persona 5"],

  // ─── HERO ─────────────────────────────────────────────────────────────────
  "Hero": ["Dragon Quest"],

  // ─── BANJO & KAZOOIE ──────────────────────────────────────────────────────
  "Banjo & Kazooie": ["Banjo"],

  // ─── TERRY ────────────────────────────────────────────────────────────────
  "Terry": ["Fatal Fury"],

  // ─── MIN MIN ──────────────────────────────────────────────────────────────
  "Min Min": ["ARMS"],

  // ─── STEVE ────────────────────────────────────────────────────────────────
  "Steve": ["Minecraft"],

  // ─── KAZUYA ───────────────────────────────────────────────────────────────
  "Kazuya": ["Tekken"],

  // ─── SORA ─────────────────────────────────────────────────────────────────
  "Sora": ["Kingdom Hearts"],

  // ─── SIMON / RICHTER ──────────────────────────────────────────────────────
  "Simon": ["Castlevania"],
  "Richter": ["Castlevania"],

  // ─── INKLING ──────────────────────────────────────────────────────────────
  "Inkling": ["Splatoon"],
};

// Entradas que jamais devem aparecer como "work" de um lutador
const EXCLUDE_TITLES = new Set([
  "Super Smash Bros.", "Super Smash Bros. Melee", "Super Smash Bros. Brawl",
  "Super Smash Bros. for Nintendo 3DS", "Super Smash Bros. for Wii U",
  "Super Smash Bros. Ultimate",
]);

// ─── HELPERS ────────────────────────────────────────────────────────────────
function parseYear(date: string | null): number {
  if (!date) return 9999;
  const m = date.match(/(\d{4})/);
  return m ? parseInt(m[1]!) : 9999;
}

async function main() {
  if (DRY) console.log("[DRY RUN]\n");

  // Carrega todos os ChronicleEntries uma só vez
  const allEntries = await db.chronicleEntry.findMany({
    select: { id: true, titleNtsc: true, releaseDateNtsc: true },
  });
  const entryMap = new Map(allEntries.map(e => [e.id, e]));

  // Carrega todos os lutadores
  const fighters = await db.fighter.findMany({
    include: { chronicleLinks: { select: { chronicleEntryId: true } } },
    orderBy: { rosterNumber: "asc" },
  });

  const fighterMap = new Map(fighters.map(f => [f.name, f]));

  const names = ONLY ? [ONLY] : Object.keys(FIGHTER_WORKS);
  let totalNew = 0, totalSkipped = 0, totalMiss = 0;

  for (const name of names) {
    const keywords = FIGHTER_WORKS[name];
    if (!keywords) continue;

    const fighter = fighterMap.get(name);
    if (!fighter) {
      console.log(`  MISS lutador: "${name}"`);
      totalMiss++;
      continue;
    }

    const existingIds = new Set(fighter.chronicleLinks.map(l => l.chronicleEntryId));

    // Coleta todas as ChronicleEntries que correspondem a qualquer keyword
    const matched = new Map<string, typeof allEntries[0]>();
    for (const kw of keywords!) {
      const kwLower = kw.toLowerCase();
      for (const e of allEntries) {
        if (!e.titleNtsc) continue;
        if (EXCLUDE_TITLES.has(e.titleNtsc)) continue;
        if (e.titleNtsc.toLowerCase().includes(kwLower)) {
          matched.set(e.id, e);
        }
      }
    }

    if (matched.size === 0) {
      console.log(`  ⚠ ${name.padEnd(20)} — nenhuma ChronicleEntry encontrada`);
      continue;
    }

    // Ordena por data de lançamento
    const sorted = [...matched.values()].sort(
      (a, b) => parseYear(a.releaseDateNtsc) - parseYear(b.releaseDateNtsc)
    );

    let displayOrder = 1;
    let newLinks = 0;
    const newTitles: string[] = [];

    for (const entry of sorted) {
      if (!existingIds.has(entry.id)) {
        if (!DRY) {
          await db.fighterChronicleLink.upsert({
            where: { fighterId_chronicleEntryId: { fighterId: fighter.id, chronicleEntryId: entry.id } },
            create: {
              fighterId: fighter.id,
              chronicleEntryId: entry.id,
              displayOrder,
              isDebut: displayOrder === 1 && existingIds.size === 0,
            },
            update: { displayOrder },
          });
          existingIds.add(entry.id);
        }
        newLinks++;
        newTitles.push(entry.titleNtsc ?? "?");
      }
      displayOrder++;
    }

    if (newLinks > 0) {
      console.log(`  ✅ ${name.padEnd(22)} +${newLinks} links (total ${sorted.length})`);
      if (DRY) console.log(`     → ${newTitles.slice(0, 5).join(", ")}${newTitles.length > 5 ? "…" : ""}`);
      totalNew += newLinks;
    } else {
      totalSkipped++;
      if (DRY) console.log(`  ✓  ${name.padEnd(22)} já completo (${sorted.length} links)`);
    }
  }

  console.log(`\n${"═".repeat(52)}`);
  console.log(`  Novos FighterChronicleLinks : ${totalNew}`);
  console.log(`  Lutadores já completos      : ${totalSkipped}`);
  console.log(`  Lutadores não encontrados   : ${totalMiss}`);
  console.log(`${"═".repeat(52)}`);

  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
