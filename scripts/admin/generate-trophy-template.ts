import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const db = new PrismaClient();

async function run() {
  const trophies = await db.collectible.findMany({
    where: { type: 'TROPHY', smashGameVersion: 'SSBM' },
    orderBy: { posicaoTrofeuMelee: 'asc' },
    select: {
      posicaoTrofeuMelee: true,
      name: true,
      fighterId: true
    }
  });

  let output = `Template de Trophies - SSBM\n\n`;
  output += `Preencha o timestamp de início e fim. Exemplo: 00:00:10 a 00:00:15\n\n`;

  let currentFighter: string | null = null;

  for (const t of trophies) {
    const num = t.posicaoTrofeuMelee ? String(t.posicaoTrofeuMelee).padStart(3, '0') : '???';
    
    let isFighterTrophy = false;
    if (t.fighterId) {
       isFighterTrophy = true;
       currentFighter = t.name.split(' ')[0]; 
    } else if (t.name.includes('SMASH') && currentFighter && t.name.startsWith(currentFighter)) {
       isFighterTrophy = true;
    }

    const marker = isFighterTrophy ? '[LUTADOR]' : '';
    output += `[   a   ] - #${num} - ${t.name} ${marker}\n`;
  }

  fs.writeFileSync('C:\\Users\\ander\\Desktop\\Melee_Trophies_Template.txt', output);
  console.log('Template criado com sucesso!');
}

run().finally(() => db.$disconnect());
