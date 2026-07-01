import { db } from "../../lib/db";

// Aprovação EXPLICITAMENTE solicitada pelo usuário em 2026-07-01:
// "Considere todos os personagens até o Luigi como terminados"

const NAMES = ["Link", "Samus", "Yoshi", "Kirby", "Fox", "Pikachu", "Luigi"];

async function main() {
  const result = await db.fighter.updateMany({
    where: { name: { in: NAMES } },
    data: { curationStatus: "approved" },
  });
  console.log(`✅ ${result.count} lutadores marcados como approved: ${NAMES.join(", ")}`);
  await db.$disconnect();
}
main().catch(console.error);
