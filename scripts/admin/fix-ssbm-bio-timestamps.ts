import { db } from '../../lib/db';

async function main() {
  // Busca troféus com nomes que incluem Fox, Falco, Samus, Olimar
  const candidates = await db.collectible.findMany({
    where: {
      type: 'TROPHY', smashGameVersion: 'SSBM',
      name: { in: ['Fox McCloud', 'Falco Lombardi', 'Samus Aran', 'Captain Olimar'] },
    },
    select: { name: true, videoStartSec: true, videoEndSec: true },
  });
  console.log('Troféus encontrados:');
  candidates.forEach(c => console.log(' ', c.name, c.videoStartSec, c.videoEndSec));

  // Busca FighterBios pelo nome do fighter
  const fighters = ['Fox', 'Falco', 'Samus', 'Olimar'];
  for (const name of fighters) {
    const bio = await db.fighterBio.findFirst({
      where: { smashGameVersion: 'SSBM', fighter: { name } },
      select: { id: true, videoStartSec: true },
    });
    if (bio) console.log(`FighterBio ${name}: id=${bio.id} videoStartSec=${bio.videoStartSec}`);
    else console.log(`FighterBio ${name}: não encontrado`);
  }

  // Mapeamento manual correto
  const fixes: { fighter: string; trophy: string }[] = [
    { fighter: 'Fox',    trophy: 'Fox McCloud' },
    { fighter: 'Falco',  trophy: 'Falco Lombardi' },
    { fighter: 'Samus',  trophy: 'Samus Aran' },
    { fighter: 'Olimar', trophy: 'Captain Olimar' },
  ];

  for (const fix of fixes) {
    const trophy = candidates.find(c => c.name === fix.trophy);
    if (!trophy || trophy.videoStartSec == null) {
      console.log(`[SKIP] ${fix.fighter} → "${fix.trophy}" sem timestamp`);
      continue;
    }
    const bio = await db.fighterBio.findFirst({
      where: { smashGameVersion: 'SSBM', fighter: { name: fix.fighter } },
      select: { id: true },
    });
    if (!bio) { console.log(`[SKIP] FighterBio de ${fix.fighter} não encontrado`); continue; }

    await db.fighterBio.update({
      where: { id: bio.id },
      data: { videoStartSec: trophy.videoStartSec, videoEndSec: trophy.videoEndSec },
    });
    console.log(`[FIX]  ${fix.fighter} → "${fix.trophy}" @ ${trophy.videoStartSec}s–${trophy.videoEndSec}s`);
  }
}

main().catch(console.error).finally(() => db.$disconnect());
