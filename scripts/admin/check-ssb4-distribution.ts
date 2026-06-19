import { db } from '../../lib/db';

async function main() {
  // Contar por versão exata
  const versions = ['SSBM', 'SSBB', 'SSB4', 'SSB4_WIIU', 'SSB4_3DS', 'SSBU'];
  for (const v of versions) {
    const total  = await db.collectible.count({ where: { type: 'TROPHY', smashGameVersion: v } });
    const withTs = await db.collectible.count({ where: { type: 'TROPHY', smashGameVersion: v, videoStartSec: { not: null } } });
    if (total > 0) console.log(`${v.padEnd(12)} total: ${total.toString().padStart(4)} | com ts: ${withTs.toString().padStart(4)} | sem ts: ${(total - withTs).toString().padStart(4)}`);
  }

  console.log('\n--- SSB4_3DS sem timestamp (primeiros 20) ---');
  const missing3ds = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: 'SSB4_3DS', videoStartSec: null },
    select: { name: true, posicaoTrofeuSsb4: true },
    orderBy: { posicaoTrofeuSsb4: 'asc' },
    take: 20,
  });
  missing3ds.forEach(t => console.log(`  #${t.posicaoTrofeuSsb4?.toString().padStart(3) ?? '?'} ${t.name}`));
}

main().catch(console.error).finally(() => db.$disconnect());
