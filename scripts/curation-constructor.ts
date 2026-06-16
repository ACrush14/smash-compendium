import { db } from "../lib/db";

export interface FighterCurationData {
  fighterName: string;
  generalGames: string[];
  
  n64: {
    bioEn?: string;
    worksEn?: string[];
    bioJp?: string;
    worksJp?: string[];
  };
  
  melee: {
    trophyEn?: string;
    worksEn?: string[];
    smash1En?: string;
    smash2En?: string;
    
    trophyJp?: string;
    worksJp?: string[];
    smash1Jp?: string;
    smash2Jp?: string;
  };
  
  brawl: {
    trophyEn?: string;
    worksEn?: string[];
    altEn?: string;
    
    trophyJp?: string;
    worksJp?: string[];
    altJp?: string;
  };
  
  ssb4: {
    trophyJp?: string;
    worksJp?: string[];
    altJp?: string;
  };
  
  ultimate: {
    fanDescription?: string;
    tipsEn?: string;
    tipsJp?: string;
  };
}

/**
 * Construtor do Fighter (Manual Curation Ingestor)
 * Processa o template manual do usuário e popula o banco de forma relacional.
 */
export async function constructFighterCuration(data: FighterCurationData) {
  console.log(`Construindo curadoria para: ${data.fighterName}...`);
  // Toda a lógica de upsert relacional nas tabelas FighterBio, Collectible, FighterTip irá aqui.
}
