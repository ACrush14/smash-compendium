export interface ParsedTemplate {
  n64BiosEn?: string;
  n64BiosJp?: string;
  n64WorksEn?: string;
  n64WorksJp?: string;

  meleeTrophyEn?: string;
  meleeTrophyJp?: string;
  meleeWorksEn?: string;
  meleeWorksJp?: string;
  meleeSmash1En?: string;
  meleeSmash1Jp?: string;
  meleeSmash2En?: string;
  meleeSmash2Jp?: string;

  brawlTrophyEn?: string;
  brawlTrophyJp?: string;
  brawlWorksEn?: string;
  brawlWorksJp?: string;
  brawlAltEn?: string;
  brawlAltJp?: string;

  smash4TrophyEn?: string;
  smash4TrophyJp?: string;
  smash4WorksEn?: string;
  smash4WorksJp?: string;
  smash4AltEn?: string;
  smash4AltJp?: string;

  ultimateFanEn?: string;
  ultimateTipsEn?: string;
  ultimateTipsJp?: string;
  ultimateWorksEn?: string;
}

const KEY_MAPPINGS: Record<string, keyof ParsedTemplate> = {
  "n64 bios": "n64BiosEn",
  "n64 bios jp": "n64BiosJp",
  "n64 works": "n64WorksEn",
  "n64 works jp": "n64WorksJp",

  "melee trophy": "meleeTrophyEn",
  "melee trophy jp": "meleeTrophyJp",
  "melee works": "meleeWorksEn",
  "melee works jp": "meleeWorksJp",
  "melee smash 1": "meleeSmash1En",
  "melee smash 1 jp": "meleeSmash1Jp",
  "melee smash 2": "meleeSmash2En",
  "melee smash 2 jp": "meleeSmash2Jp",

  "brawl trophy": "brawlTrophyEn",
  "brawl trophy jp": "brawlTrophyJp",
  "brawl works": "brawlWorksEn",
  "brawl works jp": "brawlWorksJp",
  "brawl alt": "brawlAltEn",
  "brawl alt jp": "brawlAltJp",

  "smash 4 trophy": "smash4TrophyEn",
  "smash 4 trophy jp": "smash4TrophyJp",
  "smash 4 works": "smash4WorksEn",
  "smash 4 works jp": "smash4WorksJp",
  "smash 4 alt": "smash4AltEn",
  "smash 4 alt jp": "smash4AltJp",

  "ultimate fan description": "ultimateFanEn",
  "ultimate fighter tips": "ultimateTipsEn",
  "ultimate fighter tips jp": "ultimateTipsJp",
  "ultimate works": "ultimateWorksEn",
};

export function parseFighterTemplate(text: string): ParsedTemplate {
  const result: ParsedTemplate = {};
  
  // Normalize line endings
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  
  let currentKey: keyof ParsedTemplate | null = null;
  let currentBuffer: string[] = [];

  const saveBuffer = () => {
    if (currentKey && currentBuffer.length > 0) {
      result[currentKey] = currentBuffer.join("\n").trim();
    }
  };

  for (let line of lines) {
    // Check if line starts with a known key
    // A key is typically followed by a colon, e.g., "N64 Bios:" or "Smash 4 Trophy :"
    const match = line.match(/^([A-Za-z0-9 ]+)\s*:/);
    if (match) {
      const potentialKey = (match[1] || "").trim().toLowerCase();
      if (KEY_MAPPINGS[potentialKey]) {
        saveBuffer();
        currentKey = KEY_MAPPINGS[potentialKey];
        
        // The rest of the line after the colon is the start of the value
        const restOfLine = line.substring(match[0].length).trim();
        currentBuffer = restOfLine ? [restOfLine] : [];
        continue;
      }
    }

    // If it's not a new key, append to current buffer
    if (currentKey) {
      currentBuffer.push(line);
    }
  }

  saveBuffer();
  
  return result;
}
