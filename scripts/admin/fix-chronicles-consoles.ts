/**
 * fix-chronicles-consoles.ts
 * Corrige erros sistemáticos de consoleName nos ChronicleEntry.
 * Rodado em 2026-06-15 por Anderson Crush.
 *
 * Operações:
 * 1. Padroniza nomes de consoles (GAME BOY → Game Boy, etc.)
 * 2. Corrige Pokémon/Zelda em consoles errados
 * 3. Move jogos 3DS classificados como DS
 * 4. Move filmes/séries de TV para consoleName="Movies/TV"
 * 5. Move "Classic NES Series" de NES para Game Boy Advance
 * 6. Corrige outros erros evidentes
 *
 * Uso: npx tsx --env-file=.env.local scripts/admin/fix-chronicles-consoles.ts
 * Dry run: npx tsx --env-file=.env.local scripts/admin/fix-chronicles-consoles.ts --dry-run
 */

import { db } from "../../lib/db";

const DRY = process.argv.includes("--dry-run");
let updated = 0;

async function rename(from: string, to: string) {
  const count = await db.chronicleEntry.count({ where: { consoleName: from } });
  if (count === 0) return;
  if (!DRY) await db.chronicleEntry.updateMany({ where: { consoleName: from }, data: { consoleName: to } });
  console.log(`  [${DRY ? "DRY" : "OK"}] "${from}" → "${to}" (${count} entradas)`);
  updated += count;
}

async function fixByTitle(titles: string[], newConsole: string, note?: string) {
  for (const title of titles) {
    const entry = await db.chronicleEntry.findFirst({ where: { titleNtsc: title } });
    if (!entry) { console.log(`  [NOT FOUND] "${title}"`); continue; }
    if (entry.consoleName === newConsole) { console.log(`  [SKIP] "${title}" já é ${newConsole}`); continue; }
    if (!DRY) await db.chronicleEntry.update({ where: { id: entry.id }, data: { consoleName: newConsole } });
    console.log(`  [${DRY ? "DRY" : "OK"}] "${title}" ${entry.consoleName} → ${newConsole}${note ? " | " + note : ""}`);
    updated++;
  }
}

async function fixByTitleLike(titleContains: string, newConsole: string, note?: string) {
  const entries = await db.chronicleEntry.findMany({
    where: { titleNtsc: { contains: titleContains } },
    select: { id: true, titleNtsc: true, consoleName: true },
  });
  for (const e of entries) {
    if (e.consoleName === newConsole) continue;
    if (!DRY) await db.chronicleEntry.update({ where: { id: e.id }, data: { consoleName: newConsole } });
    console.log(`  [${DRY ? "DRY" : "OK"}] "${e.titleNtsc}" ${e.consoleName} → ${newConsole}${note ? " | " + note : ""}`);
    updated++;
  }
}

async function setMoviesTV(titles: string[]) {
  for (const title of titles) {
    const entry = await db.chronicleEntry.findFirst({ where: { titleNtsc: title } });
    if (!entry) { console.log(`  [NOT FOUND] "${title}"`); continue; }
    if (entry.consoleName === "Movies/TV") continue;
    if (!DRY) await db.chronicleEntry.update({ where: { id: entry.id }, data: { consoleName: "Movies/TV" } });
    console.log(`  [${DRY ? "DRY" : "OK"}] "${title}" ${entry.consoleName} → Movies/TV`);
    updated++;
  }
}

async function main() {
  console.log(`SmashCompendium — fix-chronicles-consoles ${DRY ? "(DRY RUN)" : ""}\n`);

  // ── 1. PADRONIZAÇÃO DE NOMES ──────────────────────────────────────────────
  console.log("=== 1. Padronização de nomes de consoles ===");
  await rename("GAME BOY ADVANCE", "Game Boy Advance");
  await rename("Game Boy Advance",  "Game Boy Advance"); // já correto — não faz nada
  await rename("GAME BOY",          "Game Boy");
  await rename("GAME & WATCH",      "Game & Watch");
  await rename("VIRTUAL BOY",       "Virtual Boy");
  await rename("Disk System",       "Famicom Disk System");
  // Duplicatas lowercase/uppercase → merge
  await rename("Game Boy",          "Game Boy");          // já OK após rename acima
  // PlayStation
  await rename("PS",   "PlayStation");
  await rename("PS2",  "PlayStation 2");
  await rename("PS3",  "PlayStation 3");
  await rename("PS4",  "PlayStation 4");
  // Sega
  await rename("NEO",  "Neo Geo");
  await rename("GEN",  "Sega Genesis");
  // Miscelânea
  await rename("Movie", "Movies/TV");

  // ── 2. POKÉMON / ZELDA EM CONSOLES ERRADOS ──────────────────────────────
  console.log("\n=== 2. Pokémon / Zelda em consoles errados ===");

  // N64 → Game Boy Color
  await fixByTitle([
    "Pokémon Gold & Pokémon Silver",
    "The Legend of Zelda: Oracle of Seasons & The Legend of Zelda: Oracle of Ages",
    "Pikachu's Rescue Adventure",
    "Pikachu's Vacation",
    "Pokémon the Movie 2000",
    "Pokémon: Indigo League",
  ], "Game Boy Color", "estava em N64");

  // GCN → Game Boy Advance
  await fixByTitle([
    "Pokémon Ruby & Pokémon Sapphire",
  ], "Game Boy Advance", "estava em GCN — duplicata; GBA tem Ruby Version e Sapphire Version separados");

  // GCN → Movies/TV
  await fixByTitle([
    "Pokémon Heroes",
    "Pokémon: Lucario and the Mystery of Mew",
    "Pokémon: Master Quest",
  ], "Movies/TV", "filme/série Pokémon erroneamente em GCN");

  // Wii → Nintendo DS
  await fixByTitle([
    "Pokémon Black & Pokémon White",
    "Pokémon Diamond & Pokémon Pearl",
  ], "Nintendo DS", "estava em Wii");

  // Wii U → Nintendo 3DS
  await fixByTitle([
    "Pokémon X & Pokémon Y",
    "Pokémon Omega Ruby & Pokémon Alpha Sapphire",
    "Pokémon Sun & Pokémon Moon",
    "Pokémon the Movie: Genesect and the Legend Awakened",
    "Pokémon the Movie: Volcanion and the Mechanical Marvel",
  ], "Nintendo 3DS", "estava em Wii U");

  // ── 3. 3DS CLASSIFICADOS COMO "Nintendo DS" ───────────────────────────────
  console.log("\n=== 3. Jogos de 3DS classificados como Nintendo DS ===");
  const ds_to_3ds = [
    // Fire Emblem 3DS
    "Fire Emblem Awakening",
    "Fire Emblem Echoes: Shadows of Valentia",
    "Fire Emblem Fates",
    // Kid Icarus
    "Kid Icarus: Uprising",
    // Kirby 3DS
    "Kirby: Planet Robobot",
    "Kirby: Triple Deluxe",
    // Luigi's Mansion 3DS
    "Luigi's Mansion: Dark Moon",
    // Mario & Luigi 3DS
    "Mario & Luigi: Dream Team",
    "Mario & Luigi: Paper Jam",
    // Mario Kart 3DS
    "Mario Kart 7",
    // Mario Party 3DS
    "Mario Party: Island Tour",
    "Mario Party: Star Rush",
    // Mario vs DK 3DS (Mini-Land Mayhem is DS, skip)
    // New SMB 2 3DS
    "New Super Mario Bros. 2",
    // Yoshi 3DS
    "Yoshi's New Island",
    // Zelda 3DS
    "The Legend of Zelda: A Link Between Worlds",
    "The Legend of Zelda: Majora's Mask 3D",
    "The Legend of Zelda: Ocarina of Time 3D",
    "The Legend of Zelda: Tri Force Heroes",
    // Star Fox 3DS
    "Star Fox 64 3D",
    // Metroid 3DS
    "Metroid Prime: Federation Force",
    "Metroid: Samus Returns",
    // Pilotwings 3DS
    "Pilotwings Resort",
    // WarioWare 3DS
    "WarioWare Gold",
    // Animal Crossing 3DS
    "Animal Crossing: Happy Home Designer",
    // Dr. Mario 3DS
    "Dr. Mario: Miracle Cure",
    // Detective Pikachu 3DS
    "Detective Pikachu: Birth of a New Duo",
    // Hey! Pikmin 3DS
    "Hey! Pikmin",
    // Kirby 3DS
    "Kirby Super Star Ultra",   // actually DS — keep this out
  ];
  // Remove Kirby Super Star Ultra from list — it IS DS
  const filtered_3ds = ds_to_3ds.filter(t => t !== "Kirby Super Star Ultra");
  await fixByTitle(filtered_3ds, "Nintendo 3DS");

  // ── 4. MOVIES / TV ───────────────────────────────────────────────────────
  console.log("\n=== 4. Filmes e séries de TV → Movies/TV ===");
  await setMoviesTV([
    // Pokémon anime/filmes
    "Pokémon: Indigo League",
    "Pokémon: Master Quest",
    "Pikachu's Vacation",
    "Pikachu's Rescue Adventure",
    "Pokémon the Movie 2000",
    "Pokémon Heroes",
    "Pokémon: Lucario and the Mystery of Mew",
    "Pokémon the Movie: Genesect and the Legend Awakened",
    "Pokémon the Movie: Volcanion and the Mechanical Marvel",
    // Sonic online/não-jogo
    "Sonic Channel",
    "Sonic the Hedgehog Online Trading Cards",
    "Sonic Jump",           // mobile game — ambíguo, mas não é console
  ]);

  // ── 5. CLASSIC NES SERIES → GAME BOY ADVANCE ────────────────────────────
  console.log("\n=== 5. Classic NES Series → Game Boy Advance ===");
  await fixByTitleLike("Classic NES Series:", "Game Boy Advance", "cartucho GBA — original NES permanece separado");

  // ── 6. OUTROS ERROS CLAROS ──────────────────────────────────────────────
  console.log("\n=== 6. Outros erros claros ===");

  // Fire Emblem original é NES (Famicom), não SNES
  await fixByTitle(
    ["Fire Emblem: Shadow Dragon and the Blade of Light"],
    "Nintendo Entertainment System",
    "Famicom 1990 — estava em SNES"
  );

  // Sonic 2 e 3 são Sega Genesis, não SNES
  await fixByTitle(
    ["Sonic the Hedgehog 2", "Sonic the Hedgehog 3"],
    "Sega Genesis",
    "estava em SNES"
  );

  // Mega Man 2: The Power Fighters é Arcade, não SNES
  await fixByTitle(
    ["Mega Man 2: The Power Fighters"],
    "Arcade",
    "jogo de arcade — estava em SNES"
  );

  // Donkey Kong Country no Game Boy (2003) é port GBA
  await fixByTitle(
    ["Donkey Kong Country"],
    "Game Boy Advance",
    "versão 2003 é port GBA — estava em Game Boy"
  );

  // Wii U Pokémon movies
  await fixByTitle(
    ["Sonic Jump", "Sonic Channel", "Sonic the Hedgehog Online Trading Cards"],
    "Movies/TV",
    "não são jogos de console"
  );

  console.log(`\n✅ Total de entradas ${DRY ? "que seriam" : ""} atualizadas: ${updated}`);
  await db.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
