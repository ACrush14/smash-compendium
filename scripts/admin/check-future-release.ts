import { db } from "../../lib/db";

async function main() {
  const entry = await db.chronicleEntry.findFirst({
    where: { titleNtsc: "Future Release" },
  });
  console.log(JSON.stringify(entry, null, 2));
  await db.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
