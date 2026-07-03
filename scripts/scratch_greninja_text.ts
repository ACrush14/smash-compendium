import { db } from "../lib/db";
async function main() {
  const f = await db.fighter.findFirst({
    where: { name: "Greninja" },
    select: {
      bios: { select: { id: true, smashGameVersion: true, contentEn: true, contentJp: true } },
      moves: { select: { id: true, smashGameVersion: true, label: true, descEn: true, descJp: true } },
      tips: { select: { id: true, titleEn: true, textEn: true } , orderBy: { id: "asc" }},
    },
  });
  console.log(JSON.stringify(f, null, 2));
  await db.$disconnect();
}
main().catch(console.error);
