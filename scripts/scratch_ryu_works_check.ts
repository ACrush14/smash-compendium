import { db } from "../lib/db";
async function main() {
  const ryu = await db.fighter.findFirst({ where: { name: "Ryu" }, select: { id: true } });
  if (!ryu) { console.log("not found"); return; }

  const links = await db.fighterChronicleLink.findMany({
    where: { fighterId: ryu.id },
    include: { chronicleEntry: true },
  });
  console.log(`FighterChronicleLink count: ${links.length}`);
  links.forEach(l => console.log(`  era=${l.era ?? l.smashGameVersion ?? "?"} chronicleEntry="${l.chronicleEntry?.titleNtsc}" (${l.chronicleEntry?.id})`));

  // Also check via CollectibleChronicleLink through trophies
  const trophies = await db.collectible.findMany({ where: { fighterId: ryu.id, type: "TROPHY" }, select: { id: true, name: true, smashGameVersion: true, sourceGame: true } });
  console.log("\nTrophies + sourceGame:");
  trophies.forEach(t => console.log(`  [${t.smashGameVersion}] "${t.name}" sourceGame="${t.sourceGame}"`));

  await db.$disconnect();
}
main().catch(console.error);
