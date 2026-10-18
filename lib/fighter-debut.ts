/**
 * Jogo do Smash em que o lutador estreou como JOGÁVEL. O número do roster segue a ordem oficial de estreia:
 * 01–12 Smash 64 · 13–26 Melee · 27–44 Brawl · 45–63 Smash 4 · 64–82 Ultimate.
 * Clones/ecos têm sufixo "e" e estreiam depois do original (por isso a lista de exceções).
 * (Não use o conteúdo do banco para isso: troféus de Melee/Brawl existem para personagens que ainda não eram jogáveis.)
 */
export type SmashEra = "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU";

const ECHO_DEBUT: Record<string, SmashEra> = {
  "Lucina":    "SSB4",
  "Dark Pit":  "SSB4",
  "Dark Samus": "SSBU",
  "Daisy":     "SSBU",
  "Chrom":     "SSBU",
  "Ken":       "SSBU",
  "Richter":   "SSBU",
};

export function smashDebutEra(rosterNumber: string, name: string): SmashEra | null {
  if (ECHO_DEBUT[name]) return ECHO_DEBUT[name]!;
  const n = parseInt(rosterNumber, 10); // "33-35" -> 33, "13e" -> 13
  if (!Number.isFinite(n)) return null;
  if (n <= 12) return "SSB64";
  if (n <= 26) return "SSBM";
  if (n <= 44) return "SSBB";
  if (n <= 63) return "SSB4";
  return "SSBU";
}
