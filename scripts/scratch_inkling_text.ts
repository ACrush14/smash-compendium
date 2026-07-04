import { db } from "../lib/db";
async function main() {
  const f = await db.fighter.findFirst({
    where: { name: "Inkling" },
    select: {
      bios: { select: { smashGameVersion: true, contentEn: true, contentJp: true } },
      tips: { select: { id: true, titleEn: true, textEn: true }, orderBy: { id: "asc" } },
    },
  });
  console.log(JSON.stringify(f, null, 2));
  await db.$disconnect();
}
main().catch(console.error);
