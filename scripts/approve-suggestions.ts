import { db } from "../lib/db";

async function approveAll() {
  const result = await db.fighterSuggestion.updateMany({
    where: { approved: false },
    data: { approved: true },
  });
  console.log(`Approved ${result.count} suggestions.`);
}

approveAll();
