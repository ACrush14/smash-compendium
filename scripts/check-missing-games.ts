import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const chronicles = await db.chronicleEntry.findMany({ select: { titleNtsc: true } });
  const chronSet = new Set(chronicles.map(c => c.titleNtsc.toLowerCase().replace(/[^a-z0-9]/g, '')));
  
  const spirits = await db.collectible.findMany({ 
    where: { type: 'SPIRIT', posicaoSpiritSsbu: { gte: 1115 } }, // the user said "aí no Coleções" referring to the new spirits we just scraped, but let's check all or just the new ones? 
    select: { sourceGame: true, spiritArtworkSource: true } 
  });
  
  const missing = new Set();
  for (const s of spirits) {
    if (s.sourceGame) {
      const n = s.sourceGame.replace(/\s*\(\d{4}\)$/, '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (n && n !== 'nintendo' && n !== 'originalgame' && n !== 'superfamicom' && !chronSet.has(n)) missing.add(s.sourceGame);
    }
    if (s.spiritArtworkSource) {
      const n = s.spiritArtworkSource.replace(/\s*\(\d{4}\)$/, '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (n && n !== 'nintendo' && !chronSet.has(n)) missing.add(s.spiritArtworkSource);
    }
  }
  console.log(Array.from(missing).join('\n'));
}

main().finally(() => db.$disconnect());
