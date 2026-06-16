import { db } from "../../lib/db";
const kws = ["Pokémon", "Splatoon", "ARMS", "Tekken", "Minecraft", "Metal Gear", "Fatal Fury",
  "King of Fighters", "Wii Fit", "Pac-Land", "Dr. Mario", "Yoshi", "Luigi's Mansion",
  "Wario", "Pikmin", "Mario Kart", "Mario Party", "Paper Mario", "Mario & Luigi", "Captain Toad"];
(async () => {
  for (const kw of kws) {
    const n = await db.chronicleEntry.count({ where: { titleNtsc: { contains: kw, mode: "insensitive" } } });
    if (n > 0) console.log(`${kw}: ${n}`);
    else console.log(`${kw}: 0 ← FALTANDO`);
  }
  await db.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
