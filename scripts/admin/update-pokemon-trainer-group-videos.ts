import { db } from "../../lib/db";

async function main() {
  const trainer = await db.fighter.findFirst({ where: { name: "Pokémon Trainer" }, select: { id: true } });
  const squirtle = await db.fighter.findFirst({ where: { name: "Squirtle" }, select: { id: true } });
  const ivysaur = await db.fighter.findFirst({ where: { name: "Ivysaur" }, select: { id: true } });
  const charizard = await db.fighter.findFirst({ where: { name: "Charizard" }, select: { id: true } });
  if (!trainer || !squirtle || !ivysaur || !charizard) { console.log("❌ fighter missing"); return; }

  // ===== Pokémon Trainer =====
  const trainerSSBB = await db.collectible.findFirst({ where: { name: "Pokémon Trainer", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true } });
  if (trainerSSBB) {
    await db.collectible.update({ where: { id: trainerSSBB.id }, data: { videoStartSec: 5502, videoEndSec: 5519 } });
    console.log("✅ Trainer SSBB trophy video -> 5502-5519 (1:31:42-1:31:59)");
  }
  const trainerSSB4 = await db.collectible.findFirst({ where: { name: "Pokémon Trainer", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true } });
  if (trainerSSB4) {
    await db.collectible.update({ where: { id: trainerSSB4.id }, data: { videoStartSec: 4778, videoEndSec: 4788, videoStartSec2: 4174, videoEndSec2: 4195 } });
    console.log("✅ Trainer SSB4 trophy video -> WiiU 4778-4788, 3DS 4174-4195");
  }
  const trainerAltCostume = await db.collectible.findFirst({ where: { name: { contains: "Pokémon Trainer (Pokémon X" } }, select: { id: true, videoStartSec: true, videoEndSec: true } });
  if (trainerAltCostume) {
    await db.collectible.update({
      where: { id: trainerAltCostume.id },
      data: { smashGameVersion: "SSB4", fighterId: trainer.id, videoStartSec: null, videoEndSec: null, videoStartSec2: trainerAltCostume.videoStartSec, videoEndSec2: trainerAltCostume.videoEndSec },
    });
    console.log("✅ Trainer alt-costume trophy (Pokémon X&Y): normalizado SSB4, linkado, vídeo movido para campo secundário (3DS)");
  }

  // ===== Squirtle =====
  const squirtleSSBM = await db.collectible.findFirst({ where: { name: "Squirtle", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true } });
  if (squirtleSSBM) {
    await db.collectible.update({ where: { id: squirtleSSBM.id }, data: { fighterId: squirtle.id, videoStartSec: 1894, videoEndSec: 1907 } });
    console.log("✅ Squirtle SSBM trophy: linkado, vídeo -> 1894-1907 (31:34-31:47)");
  }
  const squirtleSSBB = await db.collectible.findFirst({ where: { name: "Squirtle", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true } });
  if (squirtleSSBB) {
    await db.collectible.update({ where: { id: squirtleSSBB.id }, data: { fighterId: squirtle.id, videoStartSec: 5556, videoEndSec: 5572 } });
    console.log("✅ Squirtle SSBB trophy: linkado, vídeo -> 5556-5572 (1:32:36-1:32:52)");
  }
  const squirtleSSB4 = await db.collectible.findFirst({ where: { name: "Squirtle", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true } });
  if (squirtleSSB4) {
    await db.collectible.update({ where: { id: squirtleSSB4.id }, data: { fighterId: squirtle.id, videoStartSec: 4655, videoEndSec: 4665, videoStartSec2: 4065, videoEndSec2: 4076 } });
    console.log("✅ Squirtle SSB4 trophy: linkado, vídeo -> WiiU 4655-4665, 3DS 4065-4076");
  }
  const squirtleBio = await db.fighterBio.findFirst({ where: { fighterId: squirtle.id, smashGameVersion: "SSBM" }, select: { id: true } });
  if (squirtleBio) {
    await db.fighterBio.update({ where: { id: squirtleBio.id }, data: { videoStartSec: 2471, videoEndSec: 2487 } });
    console.log("✅ Squirtle SSBM bio vídeo (ZoomZike) -> 2471-2487 (41:11-41:27)");
  }

  // ===== Ivysaur =====
  const ivysaurSSBB = await db.collectible.findFirst({ where: { name: "Ivysaur", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true } });
  if (ivysaurSSBB) {
    await db.collectible.update({ where: { id: ivysaurSSBB.id }, data: { fighterId: ivysaur.id, videoStartSec: 5573, videoEndSec: 5590 } });
    console.log("✅ Ivysaur SSBB trophy: linkado, vídeo -> 5573-5590 (1:32:53-1:33:10)");
  }
  const ivysaurSSB4 = await db.collectible.findFirst({ where: { name: "Ivysaur", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true } });
  if (ivysaurSSB4) {
    await db.collectible.update({ where: { id: ivysaurSSB4.id }, data: { fighterId: ivysaur.id, videoStartSec: 4632, videoEndSec: 4643, videoStartSec2: 4044, videoEndSec2: 4055 } });
    console.log("✅ Ivysaur SSB4 trophy: linkado, vídeo -> WiiU 4632-4643, 3DS 4044-4055");
  }
  const ivysaurSSBM = await db.collectible.findFirst({ where: { name: "Ivysaur", smashGameVersion: "SSBM", type: "TROPHY" } });
  if (!ivysaurSSBM) {
    await db.collectible.create({
      data: { name: "Ivysaur", type: "TROPHY", smashGameVersion: "SSBM", fighterId: ivysaur.id, videoStartSec: 1867, videoEndSec: 1879 },
    });
    console.log("✅ Ivysaur SSBM trophy: criado (só vídeo — texto oficial não encontrado, pendente) -> 1867-1879 (31:07-31:19)");
  }

  // ===== Charizard =====
  const charizardSSBM = await db.collectible.findFirst({ where: { name: "Charizard", smashGameVersion: "SSBM", type: "TROPHY" }, select: { id: true } });
  if (charizardSSBM) {
    await db.collectible.update({ where: { id: charizardSSBM.id }, data: { fighterId: charizard.id, videoStartSec: 1880, videoEndSec: 1893 } });
    console.log("✅ Charizard SSBM trophy: linkado, vídeo -> 1880-1893 (31:20-31:33)");
  }
  const charizardSSBB = await db.collectible.findFirst({ where: { name: "Charizard", smashGameVersion: "SSBB", type: "TROPHY" }, select: { id: true } });
  if (charizardSSBB) {
    await db.collectible.update({ where: { id: charizardSSBB.id }, data: { fighterId: charizard.id, videoStartSec: 5539, videoEndSec: 5555 } });
    console.log("✅ Charizard SSBB trophy: linkado, vídeo -> 5539-5555 (1:32:19-1:32:35)");
  }
  const charizardSSB4 = await db.collectible.findFirst({ where: { name: "Charizard", smashGameVersion: "SSB4", type: "TROPHY" }, select: { id: true } });
  if (charizardSSB4) {
    await db.collectible.update({ where: { id: charizardSSB4.id }, data: { fighterId: charizard.id, videoStartSec: 3785, videoEndSec: 3795, videoStartSec2: 3330, videoEndSec2: 3341 } });
    console.log("✅ Charizard SSB4 trophy: linkado, vídeo -> WiiU 3785-3795, 3DS 3330-3341");
  }
  const charizardAlt = await db.collectible.findFirst({ where: { name: "Charizard (Alt.)", smashGameVersion: "SSB4" }, select: { id: true } });
  if (charizardAlt) {
    await db.collectible.update({ where: { id: charizardAlt.id }, data: { fighterId: charizard.id } });
    console.log("✅ Charizard (Alt.) SSB4: linkado (vídeo já era válido, mantido)");
  }
  const charizardMega = await db.collectible.findFirst({ where: { name: "Mega Evolution (Charizard)", smashGameVersion: "SSB4_WIIU" }, select: { id: true } });
  if (charizardMega) {
    await db.collectible.update({ where: { id: charizardMega.id }, data: { smashGameVersion: "SSB4", fighterId: charizard.id } });
    console.log("✅ Mega Evolution (Charizard): normalizado SSB4, linkado (vídeo mantido)");
  }
  const charizardBio = await db.fighterBio.findFirst({ where: { fighterId: charizard.id, smashGameVersion: "SSBM" }, select: { id: true } });
  if (charizardBio) {
    await db.fighterBio.update({ where: { id: charizardBio.id }, data: { videoStartSec: 2450, videoEndSec: 2470 } });
    console.log("✅ Charizard SSBM bio vídeo (ZoomZike) -> 2450-2470 (40:50-41:10)");
  }

  await db.$disconnect();
}
main().catch(console.error);
