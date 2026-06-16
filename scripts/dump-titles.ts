import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const db = new PrismaClient();

async function run() {
  const entries = await db.chronicleEntry.findMany({
    select: { titleNtsc: true, consoleName: true }
  });
  
  const fighters = await db.fighter.findMany({ select: { name: true } });
  
  fs.writeFileSync('chronicle_titles.json', JSON.stringify(entries, null, 2));
  fs.writeFileSync('fighter_names.json', JSON.stringify(fighters.map(f => f.name), null, 2));
  console.log('Saved data.');
  await db.$disconnect();
}

run().catch(console.error);
