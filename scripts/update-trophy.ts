import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function run() {
  const mario = await db.fighter.findFirst({ where: { name: 'Mario' }});
  if (!mario) return;

  const trophies = await db.collectible.findMany({
    where: { fighterId: mario.id, smashGameVersion: 'SSBM', type: 'TROPHY' }
  });

  console.log("Trophies found:", trophies.map(t => t.name));

  const smash2 = trophies.find(t => t.name.includes('SMASH (2)') || t.name === 'Smash 2');
  if (smash2) {
    await db.collectible.update({
      where: { id: smash2.id },
      data: {
        description: `Mass determines how easily a character can be sent flying, as well as a character's physical strength: Mario's mass is the standard upon which other Smash fighters are measured. His Super Jump Punch sends foes skyward in a shower of coins, while the Mario Tornado pulls in nearby foes, spins them silly, and scatters them every which way.
Up & B: Super Jump Punch
Down & B: Mario Tornado`
      }
    });
    console.log("Updated trophy:", smash2.name);
  }
}
run().finally(() => db.$disconnect());
