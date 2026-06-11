# Sistema: Origin Games (Jogos de Origem)

**Arquivo:** `app/fighters/[slug]/page.tsx`
**Componente:** `components/ui/OriginGamesPanel.tsx`

---

## Como Funciona

Cada fighter tem uma lista de jogos de origem exibida no painel direito da página. Os dados são hardcoded em `page.tsx` em dois objetos:

```typescript
// Override por fighter (prioridade máxima)
FIGHTER_ORIGIN_GAMES: Record<string, OriginGame[]>

// Fallback por franquia
FRANCHISE_ORIGIN_GAMES: Record<string, OriginGame[]>
```

**Lógica de resolução:**
```typescript
const rawOriginGames =
  FIGHTER_ORIGIN_GAMES[fighter.name] ??     // 1. Override do fighter
  FRANCHISE_ORIGIN_GAMES[fighter.franchise.name] ?? // 2. Franquia
  [];                                         // 3. Vazio (sem works)
```

## Tipo OriginGame

```typescript
type OriginGame = {
  name: string;           // Nome EN do jogo
  titleJp?: string;       // Título JP (ex: "MOTHER2 ギーグの逆襲")
  console: string;        // Abreviação (ex: "SNES", "GBA", "NSW")
  consoleFull?: string;   // Nome completo JP
  consoleFullEn?: string; // Nome completo EN
  year: number;           // Ano JP/original
  month?: number;         // Mês JP (1-12)
  yearNa?: number;        // Ano NA
  monthNa?: number;       // Mês NA
  region?: string;        // "JP" | "NA" (para mostrar flag)
  badgeColor: string;     // Cor hex do badge de console
  iconFile?: string;      // ex: "snes.svg" → /assets/consoles/snes.svg
  boxArtPath?: string;    // ex: "/assets/games/EARTHBOUND_USA_BOX.jpg"
  boxArtPathJp?: string;  // Capa JP alternativa
  boxArtLandscape?: boolean;
  jpExclusive?: boolean;  // Mostra badge "JP ONLY"
  wikiUrl?: string;       // Link Wikipedia EN
  wikiUrlJp?: string;     // Link Wikipedia JP
};
```

## FIGHTER_ORIGIN_GAMES (overrides)

| Fighter | Jogo(s) | Motivo do override |
|---|---|---|
| Ness | EarthBound | Franquia é EarthBound, mas só Mother 2 |
| Lucas | EarthBound + Mother 3 | Dois jogos diferentes |
| Pyra | Xenoblade Chronicles 2 | Franquia DB = "Xenoblade Chronicles" (XC1) |
| Mythra | Xenoblade Chronicles 2 | Mesmo que Pyra |
| Cloud | Final Fantasy VII | Franquia genérica "Final Fantasy" |
| Sephiroth | Final Fantasy VII | Mesmo que Cloud — compartilham a mesma wiki page |

## Franquias em FRANCHISE_ORIGIN_GAMES (~42 entradas)

Todas as franquias do banco estão cobertas, incluindo:
- Nintendo clássico: Mario, DK, Zelda, Pokémon, Metroid, Kirby, Star Fox, F-Zero, Fire Emblem, Pikmin, Animal Crossing, Kid Icarus, Ice Climber, Wario, etc.
- 3rd party original: Sonic, Mega Man, Pac-Man, Street Fighter, Castlevania, Persona, Dragon Quest, Banjo-Kazooie, ARMS, Bayonetta
- DLC adicionados na sessão 19: Metal Gear, Wii Fit, Splatoon, Fatal Fury, Final Fantasy, Minecraft, Tekken, Kingdom Hearts
- Especiais: R.O.B. (Gyromite), Super Smash Bros. (Mii Channel), Game & Watch (Ball), Xenoblade Chronicles (XC1)

**Entradas adicionadas na sessão 19** (sem capas ainda):
`"Metal Gear"`, `"Wii Fit"`, `"Splatoon"`, `"Fatal Fury"`, `"Final Fantasy"`, `"Minecraft"`, `"Tekken"`, `"Kingdom Hearts"`, `"R.O.B."`, `"Super Smash Bros."`, `"Sonic the Hedgehog"` (alias), `"Xenoblade Chronicles"` (alias XC1)

## Capas Disponíveis em `public/assets/games/`

| Arquivo | Jogo |
|---|---|
| `EARTHBOUND_USA_BOX.jpg` | EarthBound (SNES NA) |
| `MOTHER2_JP_BOX.png` | MOTHER2 (Super Famicom JP) |
| `MOTHER3_JP_BOX.jpg` | MOTHER3 (GBA JP) |
| `SUPER_MARIO_BROS_NES_BOX.png` | Super Mario Bros. |
| `DONKEY_KONG_ARC_BOX.jpg` | Donkey Kong (arcade flyer) |
| `DKC_SNES_BOX.png` | Donkey Kong Country |
| `ZELDA_NES_BOX.png` | The Legend of Zelda |
| `METROID_NES_BOX.jpg` | Metroid |
| `KIRBY_DREAMLAND_GB_BOX.png` | Kirby's Dream Land |
| `STARFOX_SNES_BOX.jpg` | Star Fox |
| `POKEMON_RED_BLUE_GB_BOX.webp` | Pokémon Red/Blue |
| `FZERO_SNES_BOX.jpg` | F-Zero |
| `FZERO_X_N64_BOX.jpg` | F-Zero X |
| `FZERO_GX_GCN_BOX.png` | F-Zero GX |
| `FZERO_GPLEGEND_GBA_BOX.gif` | F-Zero GP Legend |
| `FZERO_CLIMAX_GBA_BOX.png` | F-Zero Climax |
| `FIRE_EMBLEM_NES_BOX.jpg` | Fire Emblem |
| `PIKMIN_GCN_BOX.jpg` | Pikmin |
| `ANIMAL_CROSSING_N64_BOX.png` | Animal Forest (N64) |
| `KID_ICARUS_NES_BOX.png` | Kid Icarus |
| `ICE_CLIMBER_NES_BOX.jpg` | Ice Climber |
| `WARIO_LAND_GB_BOX.png` | Wario Land |
| `YOSHIS_ISLAND_SNES_BOX.jpg` | Yoshi's Island |
| `XENOBLADE_WII_BOX.png` | Xenoblade Chronicles |
| `PUNCHOUT_NES_BOX.jpg` | Punch-Out!! |
| `DUCK_HUNT_NES_BOX.jpg` | Duck Hunt |
| `SONIC_GEN_BOX.jpg` | Sonic the Hedgehog (Mega Drive) |
| `MEGA_MAN_NES_BOX.jpg` | Mega Man |
| `PAC_MAN_ARC_BOX.png` | Pac-Man |
| `SF2_ARC_BOX.jpg` | Street Fighter II |
| `CASTLEVANIA_NES_BOX.png` | Castlevania |
| `PERSONA5_PS4_BOX.jpg` | Persona 5 |
| `DRAGON_QUEST_NES_BOX.jpg` | Dragon Quest |
| `BANJO_KAZOOIE_N64_BOX.png` | Banjo-Kazooie |
| `ARMS_NSW_BOX.jpg` | ARMS |
| `BAYONETTA_PS3_BOX.png` | Bayonetta |

## Capas Faltantes

Desde sessão 24, fighters sem `boxArtPath` local buscam `boxArtUrl` automaticamente do `ChronicleEntry` no banco.
**Fluxo:** adicionar boxArtUrl na entrada do Chronicle via `/admin/chronicles` → o fighter já exibe a capa.

| Fighter(s) | Jogo | Chronicle existe? | boxArtUrl no banco? |
|---|---|---|---|
| Snake | Metal Gear Solid (PS, 1998) | ✅ | ✅ (buscar no admin) |
| Wii Fit Trainer | Wii Fit (Wii, 2007) | ✅ adicionado sessão 24 | ❌ preencher |
| Inkling | Splatoon (Wii U, 2015) | ✅ | ✅ |
| Terry | Fatal Fury (Neo Geo, 1991) | ✅ adicionado sessão 24 | ❌ preencher |
| Cloud + Sephiroth | Final Fantasy VII (PS, 1997) | ✅ | ✅ |
| Steve + Alex | Minecraft (NSW, 2018) | ✅ adicionado sessão 24 | ❌ preencher |
| Kazuya | Tekken (ARC, 1994) | ✅ | ✅ |
| Sora | Kingdom Hearts (PS2, 2002) | ✅ | ✅ |
| R.O.B. | Gyromite (NES, 1985) | ✅ | ✅ |
| Mii Fighters | Mii (Wii, 2006) | ✅ adicionado sessão 24 | ❌ preencher |
| Pyra + Mythra | Xenoblade Chronicles 2 (NSW, 2017) | ✅ | ✅ |

**Para preencher capas via Chronicle:**
1. Ir em `/admin/chronicles`
2. Buscar o título do jogo
3. Adicionar a URL da imagem no campo boxArtUrl e salvar
4. A capa aparece automaticamente na página do fighter

**Alternativa (capa local):**
1. Colocar a imagem em `public/assets/games/ARQUIVO.jpg`
2. Adicionar `boxArtPath: "/assets/games/ARQUIVO.jpg"` na entrada em `page.tsx`

## Regra de Exibição das Capas

```typescript
// Em componentes de UI — SEMPRE usar <img> com height fixo e width auto
<img
  src={boxArtPath}
  alt={gameName}
  style={{ height: 300, width: "auto" }}
/>
// Nunca <Image fill> — quebra proporções (cada console tem formato diferente)
```

## Exibição por Idioma

| Lang | Título | Data | Console | Capa |
|---|---|---|---|---|
| EN / PT | `name` | `yearNa.monthNa` | `consoleFullEn` | `boxArtPath` |
| JP / JP+EN | `titleJp` | `year.month` | `consoleFull` | `boxArtPathJp` |
