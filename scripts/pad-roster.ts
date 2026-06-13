import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Fetching fighters...");
  const fighters = await db.fighter.findMany();
  
  let updated = 0;
  for (const f of fighters) {
    const padded = f.rosterNumber.replace(/^\d+/, (m) => m.padStart(2, '0'));
    if (padded !== f.rosterNumber) {
      await db.fighter.update({
        where: { id: f.id },
        data: { rosterNumber: padded }
      });
      console.log(`Updated ${f.name}: ${f.rosterNumber} -> ${padded}`);
      updated++;
    }
  }
  
  console.log(`Finished! Updated ${updated} fighters.`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
