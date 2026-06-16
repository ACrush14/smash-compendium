import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function run() {
  const t = await db.collectible.findFirst({ where: { name: 'Mario SMASH (2)' } });
  if (t) {
    console.log("Found:", t.name);
    await db.collectible.update({
      where: { id: t.id },
      data: {
        description: `Mass determines how easily a character can be sent flying, as well as a character's physical strength: Mario's mass is the standard upon which other Smash fighters are measured. His Super Jump Punch sends foes skyward in a shower of coins, while the Mario Tornado pulls in nearby foes, spins them silly, and scatters them every which way.\nUp & B: Super Jump Punch\nDown & B: Mario Tornado`
      }
    });
    console.log("Updated.");
  } else {
    console.log("Not found by exact name. Trying contains...");
    const ts = await db.collectible.findMany({ where: { name: { contains: 'Mario SMASH' } } });
    console.log("Matches:", ts.map(x => x.name));
  }
}
run().finally(() => db.$disconnect());
