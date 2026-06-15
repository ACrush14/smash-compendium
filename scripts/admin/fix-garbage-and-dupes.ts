/**
 * fix-garbage-and-dupes.ts
 * Limpa entradas inválidas, duplicatas "/" e padroniza PlayStation.
 * Dry run: npx tsx --env-file=.env.local scripts/admin/fix-garbage-and-dupes.ts --dry-run
 */

import { db } from "../../lib/db";

const DRY = process.argv.includes("--dry-run");
let deleted = 0;
let updated = 0;

async function del(title: string, reason: string) {
  const entry = await db.chronicleEntry.findFirst({ where: { titleNtsc: title } });
  if (!entry) { console.log(`  [NOT FOUND] "${title}"`); return; }
  const links = await db.fighterChronicleLink.count({ where: { chronicleEntryId: entry.id } });
  if (!DRY) await db.chronicleEntry.delete({ where: { id: entry.id } });
  console.log(`  [${DRY ? "DRY" : "DELETE"}] "${title}" (${links} links) — ${reason}`);
  deleted++;
}

async function setConsole(title: string, console_: string) {
  const entry = await db.chronicleEntry.findFirst({ where: { titleNtsc: title } });
  if (!entry) { console.log(`  [NOT FOUND] "${title}"`); return; }
  if (entry.consoleName === console_) { console.log(`  [SKIP] "${title}" já é ${console_}`); return; }
  if (!DRY) await db.chronicleEntry.update({ where: { id: entry.id }, data: { consoleName: console_ } });
  console.log(`  [${DRY ? "DRY" : "OK"}] "${title}" ${entry.consoleName} → ${console_}`);
  updated++;
}

// Delete entries by partial title match
async function delContains(contains: string, reason: string) {
  const entries = await db.chronicleEntry.findMany({ where: { titleNtsc: { contains } } });
  for (const e of entries) {
    const links = await db.fighterChronicleLink.count({ where: { chronicleEntryId: e.id } });
    if (!DRY) await db.chronicleEntry.delete({ where: { id: e.id } });
    console.log(`  [${DRY ? "DRY" : "DELETE"}] "${e.titleNtsc}" (${links} links) — ${reason}`);
    deleted++;
  }
}

async function main() {
  console.log(`SmashCompendium — fix-garbage-and-dupes ${DRY ? "(DRY RUN)" : ""}\n`);

  // ── 1. LIXO — IDIOMAS ────────────────────────────────────────────────────
  console.log("=== 1. Idiomas (não são jogos) ===");
  for (const lang of ["Chinese", "Dutch", "English", "French", "German", "Italian", "Japanese", "Korean", "Portuguese", "Russian", "Spanish"]) {
    await del(lang, "idioma — não é jogo");
  }

  // ── 2. LIXO — FRAGMENTOS DE TEXTO WIKIPEDIA ─────────────────────────────
  console.log("\n=== 2. Fragmentos de texto Wikipedia ===");
  const wikiFragments = [
    "It and Pichu are also the only playable Pokémon to be in the first stage of their respective evolutionary lines.",
    "It can use Blast Burn like Red .",
    "It has an idle pose that sees it turn its head and spit out an ember like Ash's did during its disobedient phase.",
    "It is voiced by Shin'ichirō Miki, who voices Ash's and Red's.",
    "It knows Flare Blitz like Red's does in Pokémon HeartGold and SoulSilver versions.",
    "Its up throw's animation is similar to Ash and Red's when they use Seismic Toss.",
  ];
  for (const frag of wikiFragments) {
    await del(frag, "fragmento de texto Wikipedia");
  }

  // ── 3. LIXO — PERSONAGENS COMO JOGOS ────────────────────────────────────
  console.log("\n=== 3. Personagens listados como jogos ===");
  await del("Charizard", "nome de personagem, não jogo");
  await del("Ivysaur", "nome de personagem, não jogo");
  await del("Squirtle", "nome de personagem, não jogo");

  // ── 4. LIXO — METAENTRADAS / ACESSÓRIOS ─────────────────────────────────
  console.log("\n=== 4. Metaentradas e acessórios ===");
  await del("Pokémon universe", "entidade genérica, não jogo");
  await del("Characters", "genérico, sem sentido");
  await del("R.O.B.", "acessório de hardware NES, não jogo");
  await del("Super Scope", "light gun SNES, não jogo");
  await del("Game & Watch", "linha de hardware, não jogo específico");
  await del("Disk System", "placeholder do Famicom Disk System");

  // ── 5. POKÉMON DUPLICATAS "/" → DELETAR ──────────────────────────────────
  console.log("\n=== 5. Pokémon duplicatas com \"/\" (manter versões com \"&\") ===");
  const slashDupes = [
    "Pokémon Black/White",
    "Pokémon Black 2/White 2",
    "Pokémon Diamond/Pearl",
    "Pokémon FireRed/LeafGreen",
    "Pokémon Gold/Silver",
    "Pokémon HeartGold/SoulSilver",
    "Pokémon Omega Ruby/Alpha Sapphire",
    "Pokémon Red/Blue",
    "Pokémon Ruby/Sapphire",
    "Pokémon X/Y",
  ];
  for (const t of slashDupes) {
    await del(t, "duplicata — versão com & já existe");
  }

  // ── 6. POKÉMON "&" AINDA SEM CONSOLE → ATRIBUIR ─────────────────────────
  console.log("\n=== 6. Pokémon \"&\" ainda Unknown → atribuir console ===");
  await setConsole("Pokémon Black 2 & Pokémon White 2", "Nintendo DS");
  await setConsole("Pokémon FireRed & Pokémon LeafGreen", "Game Boy Advance");
  await setConsole("Pokémon HeartGold & Pokémon SoulSilver", "Nintendo DS");
  await setConsole("Pokémon Platinum", "Nintendo DS");

  // ── 7. OUTROS CASOS IDENTIFICADOS ───────────────────────────────────────
  console.log("\n=== 7. Casos identificados nesta sessão ===");
  await setConsole("Magic Made Fun", "Nintendo DS");
  await setConsole("Demon World[sic]", "Nintendo Entertainment System"); // Famicom JP exclusive

  // ── 8. PLAYSTATION → PLAYSTATION 1 ───────────────────────────────────────
  // "PlayStation" (2 entradas) são duplicatas de "PlayStation 1" (10 entradas)
  // Migra FighterChronicleLinks antes de deletar para não perder conexões
  console.log("\n=== 8. PlayStation → deletar duplicatas (padrão: PlayStation 1) ===");
  const psEntries = await db.chronicleEntry.findMany({
    where: { consoleName: "PlayStation" },
    select: { id: true, titleNtsc: true },
  });
  for (const e of psEntries) {
    const ps1 = await db.chronicleEntry.findFirst({ where: { titleNtsc: e.titleNtsc, consoleName: "PlayStation 1" } });
    if (ps1) {
      // Migrate fighter links to PlayStation 1 version (skip if link already exists)
      const fighterLinks = await db.fighterChronicleLink.findMany({ where: { chronicleEntryId: e.id } });
      let migrated = 0;
      for (const link of fighterLinks) {
        const exists = await db.fighterChronicleLink.findUnique({
          where: { fighterId_chronicleEntryId: { fighterId: link.fighterId, chronicleEntryId: ps1.id } },
        });
        if (!exists) {
          if (!DRY) await db.fighterChronicleLink.create({
            data: { fighterId: link.fighterId, chronicleEntryId: ps1.id, isDebut: link.isDebut, displayOrder: link.displayOrder },
          });
          migrated++;
        }
      }
      if (!DRY) await db.chronicleEntry.delete({ where: { id: e.id } });
      console.log(`  [${DRY ? "DRY" : "DELETE"}] "${e.titleNtsc}" [PlayStation] — duplicata PS1 (${fighterLinks.length} links, ${migrated} migrados)`);
      deleted++;
    } else {
      if (!DRY) await db.chronicleEntry.update({ where: { id: e.id }, data: { consoleName: "PlayStation 1" } });
      console.log(`  [${DRY ? "DRY" : "RENAME"}] "${e.titleNtsc}" PlayStation → PlayStation 1 (sem duplicata)`);
      updated++;
    }
  }

  console.log(`\n✅ ${deleted} deletados, ${updated} atualizados`);
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
