import { db } from "@/lib/db";

async function main() {
  const fighters = await db.fighter.updateMany({
    where: { curationStatus: { not: "approved" } },
    data: { curationStatus: "approved" },
  });

  const collectibles = await db.collectible.updateMany({
    where: { curationStatus: { not: "approved" } },
    data: { curationStatus: "approved" },
  });

  console.log("Fighters approved:", fighters.count);
  console.log("Collectibles approved:", collectibles.count);

  await db.$disconnect();
}

main();
