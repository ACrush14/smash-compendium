/**
 * fix-unknown-consoles.ts
 * Atribui consoleName correto a entradas Unknown confirmadas pelo usuário.
 * Dry run: npx tsx --env-file=.env.local scripts/admin/fix-unknown-consoles.ts --dry-run
 */

import { db } from "../../lib/db";

const DRY = process.argv.includes("--dry-run");
let updated = 0;
let created = 0;
let deleted = 0;

async function setConsole(title: string, console_: string) {
  const entry = await db.chronicleEntry.findFirst({ where: { titleNtsc: title } });
  if (!entry) { console.log(`  [NOT FOUND] "${title}"`); return; }
  if (entry.consoleName === console_) { console.log(`  [SKIP] "${title}" já é ${console_}`); return; }
  if (!DRY) await db.chronicleEntry.update({ where: { id: entry.id }, data: { consoleName: console_ } });
  console.log(`  [${DRY ? "DRY" : "OK"}] "${title}" → ${console_}`);
  updated++;
}

async function deleteEntry(title: string, reason: string) {
  const entry = await db.chronicleEntry.findFirst({ where: { titleNtsc: title } });
  if (!entry) { console.log(`  [NOT FOUND] "${title}"`); return; }
  if (!DRY) await db.chronicleEntry.delete({ where: { id: entry.id } });
  console.log(`  [${DRY ? "DRY" : "DELETE"}] "${title}" — ${reason}`);
  deleted++;
}

async function createEntry(data: { titleNtsc: string; titleJp?: string; consoleName: string; releaseDateNtsc?: string }) {
  const exists = await db.chronicleEntry.findFirst({ where: { titleNtsc: data.titleNtsc, consoleName: data.consoleName } });
  if (exists) { console.log(`  [SKIP] "${data.titleNtsc}" [${data.consoleName}] já existe`); return; }
  if (!DRY) await db.chronicleEntry.create({ data });
  console.log(`  [${DRY ? "DRY" : "CREATE"}] "${data.titleNtsc}" → ${data.consoleName}`);
  created++;
}

async function main() {
  console.log(`SmashCompendium — fix-unknown-consoles ${DRY ? "(DRY RUN)" : ""}\n`);

  // ── FAMICOM DISK SYSTEM ───────────────────────────────────────────────────
  console.log("=== Famicom Disk System ===");
  await setConsole("3D Hot Rally", "Famicom Disk System");
  await setConsole("Famicom Detective Club Part II", "Famicom Disk System");

  // ── SUPER NINTENDO ────────────────────────────────────────────────────────
  console.log("\n=== Super Nintendo Entertainment System ===");
  await deleteEntry("Kirby Fun Pak[sic]sic", "typo duplicado — manter Kirby's Fun Pak");
  await setConsole("Kirby's Fun Pak", "Super Nintendo Entertainment System");
  await setConsole("Starwing", "Super Nintendo Entertainment System");

  // ── NINTENDO 64 ───────────────────────────────────────────────────────────
  console.log("\n=== Nintendo 64 ===");
  await setConsole("Custom Robo 2", "Nintendo 64");
  await setConsole("Lylat Wars", "Nintendo 64");
  await setConsole("Mega Man 64", "Nintendo 64");
  await setConsole("Sin and Punishment", "Nintendo 64");

  // ── GAME BOY / GAME BOY COLOR ─────────────────────────────────────────────
  console.log("\n=== Game Boy / Game Boy Color ===");
  await deleteEntry("Pokémon Yellow", "duplicata — manter Pokémon Yellow: Special Pikachu Edition");
  await setConsole("Pokémon Yellow: Special Pikachu Edition", "Game Boy");
  await setConsole("Pokémon Crystal", "Game Boy Color");
  await setConsole("Card Hero", "Game Boy Color");
  await setConsole("Kaeru no Tame ni Kane wa Naru", "Game Boy");

  // ── GAME BOY ADVANCE ──────────────────────────────────────────────────────
  console.log("\n=== Game Boy Advance ===");
  await setConsole("Chosoju Mecha MG", "Game Boy Advance");
  await setConsole("Densetsu no Stafy", "Game Boy Advance");
  await setConsole("Densetsu no Stafy 2", "Game Boy Advance");
  await setConsole("Densetsu no Stafy 3", "Game Boy Advance"); // user correction: GBA not DS
  await setConsole("Pokémon Emerald", "Game Boy Advance");
  await setConsole("WarioWare, Inc.: Minigame Mania", "Game Boy Advance");

  // ── NINTENDO DS ───────────────────────────────────────────────────────────
  console.log("\n=== Nintendo DS ===");
  await setConsole("Daigasso! Band Brothers", "Nintendo DS");
  await setConsole("Densetsu no Stafy 4", "Nintendo DS");
  await setConsole("Freshly-Picked Tingle's Rosy Rupeeland", "Nintendo DS");
  await setConsole("Kirby: Mouse Attack", "Nintendo DS");      // EU name de Kirby: Squeak Squad
  await setConsole("Kirby: Power Paintbrush", "Nintendo DS");  // EU name de Kirby: Canvas Curse
  await setConsole("Mario Slam Basketball", "Nintendo DS");
  await setConsole("Osu! Tatakae! Ouendan!", "Nintendo DS");
  await setConsole("Osu! Tatakae! Ouendan! 2", "Nintendo DS");
  await setConsole("The Legendary Starfy", "Nintendo DS");
  await setConsole("Tingle's Rupeeland", "Nintendo DS");

  // ── NINTENDO 3DS ──────────────────────────────────────────────────────────
  console.log("\n=== Nintendo 3DS ===");
  await setConsole("BIT.TRIP SAGA", "Nintendo 3DS");
  await setConsole("Dillon's Rolling Western", "Nintendo 3DS");
  await setConsole("Luigi's Mansion 2", "Nintendo 3DS");       // EU name de Dark Moon
  await setConsole("Sonic Generations", "Nintendo 3DS");
  await setConsole("Steel Diver", "Nintendo 3DS");
  // Sonic Generations também existe em PS3 e Xbox 360
  await createEntry({ titleNtsc: "Sonic Generations", consoleName: "PlayStation 3", releaseDateNtsc: "11/01/2011" });
  await createEntry({ titleNtsc: "Sonic Generations", consoleName: "Xbox 360", releaseDateNtsc: "11/01/2011" });

  // ── NINTENDO GAMECUBE ─────────────────────────────────────────────────────
  console.log("\n=== Nintendo GameCube ===");
  await setConsole("Doshin the Giant", "Nintendo GameCube");
  await setConsole("Mario Smash Football", "Nintendo GameCube");
  await setConsole("Shadow the Hedgehog", "Nintendo GameCube");

  // ── WII ───────────────────────────────────────────────────────────────────
  console.log("\n=== Wii ===");
  await setConsole("Art Academy: First Semester", "Wii");
  await setConsole("Beat the Beat: Rhythm Paradise", "Wii");
  await setConsole("Captain Rainbow", "Wii");
  await setConsole("Pandora's Tower", "Wii");
  await setConsole("Project Zero 2: Wii Edition", "Wii");
  await setConsole("Rayman Origins", "Wii");
  await setConsole("Sonic and the Secret Rings", "Wii");
  await setConsole("The Last Story", "Wii");
  await setConsole("Zangeki no Reginleiv", "Wii");

  // ── WII U ─────────────────────────────────────────────────────────────────
  console.log("\n=== Wii U ===");
  await setConsole("Art Academy: SketchPad", "Wii U");
  await setConsole("New Super Luigi U", "Wii U");
  await setConsole("Rayman Legends", "Wii U");
  await setConsole("The Wonderful 101", "Wii U");

  // ── FATAL FRAME II — PS2 + GCN ───────────────────────────────────────────
  console.log("\n=== Fatal Frame II ===");
  await setConsole("Fatal Frame II: Crimson Butterfly", "PlayStation 2");
  await createEntry({ titleNtsc: "Fatal Frame II: Crimson Butterfly", consoleName: "Nintendo GameCube", releaseDateNtsc: "09/26/2003" });

  // ── ARCADE ────────────────────────────────────────────────────────────────
  console.log("\n=== Arcade ===");
  await setConsole("Galaga", "Arcade");
  await setConsole("Sheriff", "Arcade");
  await setConsole("Xevious", "Arcade");

  console.log(`\n✅ ${updated} atualizados, ${created} criados, ${deleted} deletados`);
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
