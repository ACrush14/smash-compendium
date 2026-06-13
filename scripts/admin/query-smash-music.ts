import { db } from "../../lib/db";

async function main() {
  // Encontrar a franquia Smash Bros
  const franchises = await db.franchise.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const smash = franchises.find(f => f.name.toLowerCase().includes("smash"));
  console.log("Franquias candidatas:", franchises.map(f => f.name).filter(n => n.toLowerCase().includes("smash") || n.toLowerCase().includes("nintendo") || n.toLowerCase().includes("original")));
  if (smash) console.log("Franquia Smash:", smash);

  // Músicas compostas originalmente para um jogo Smash Bros
  const originals = await db.music.findMany({
    where: {
      OR: [
        { sourceGame: { contains: "Smash Bros", mode: "insensitive" } },
        { sourceGame: { contains: "Super Smash", mode: "insensitive" } },
      ],
    },
    select: { id: true, title: true, sourceGame: true, compositionType: true, youtubeId: true, franchiseId: true },
    orderBy: [{ sourceGame: "asc" }, { title: "asc" }],
  });

  // Log de mudanças (processadas)
  const { readFileSync } = await import("fs");
  let processedIds = new Set<string>();
  try {
    const changes = JSON.parse(readFileSync("scripts/admin/replace-changes.json", "utf-8"));
    for (const c of changes) processedIds.add(c.id);
  } catch { /* sem log ainda */ }

  const done = originals.filter(t => processedIds.has(t.id) || !!t.youtubeId);
  const pending = originals.filter(t => !processedIds.has(t.id) && !t.youtubeId);

  console.log(`\n=== Originais do Smash: ${originals.length} total ===`);
  console.log(`✅ Com YouTube ID: ${done.length}`);
  console.log(`❌ Sem YouTube ID: ${pending.length}`);

  console.log("\n--- COM YouTube (processadas) ---");
  for (const t of done) console.log(`  ✅ ${t.title} | sourceGame: ${t.sourceGame ?? "-"}`);

  console.log("\n--- SEM YouTube (pendentes) ---");
  for (const t of pending) console.log(`  ❌ ${t.title} | sourceGame: ${t.sourceGame ?? "-"}`);
}

main().catch(console.error).finally(() => process.exit(0));
