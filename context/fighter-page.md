# Sistema: Página do Fighter

**Rota:** `/fighters/[slug]`
**Arquivo principal:** `app/fighters/[slug]/page.tsx` (Server Component)

---

## Arquitetura

```
page.tsx (Server Component)
  ├── Carrega do banco: fighter, bios, trophies, originAssets (SPRITE+SPIRIT+MEDIA)
  ├── Computa: erasToShow, appearances, vaultAssets, originWorkGames
  └── FighterPageLayout
        ├── Esquerda (5 cols): MediaVaultViewer
        │     └── Carrossel de assets: sprites, renders, troféus, spirits, GIFs
        └── Direita (7 cols): FighterRightPanel (Client — gerencia lang state)
              ├── OriginGamesPanel       — jogos de origem com capas
              ├── FighterDataZone        — bio, troféus, works, tips
              └── SuggestionPanel        — sugestões de usuários
```

## Dados Carregados no page.tsx

```typescript
const [fighter, trophies, originAssets] = await Promise.all([
  db.fighter.findFirst({
    include: { franchise, bios, works: { include: { game } }, tips, suggestions }
  }),
  db.collectible.findMany({ where: { type: "TROPHY" } }),
  db.collectible.findMany({ where: { type: { in: ["SPRITE", "SPIRIT", "MEDIA"] } } }),
]);
```

**Nota:** Stickers são carregados em `stickersMapSerialized` mas **está sempre vazio** (bug pendente — popular corretamente).

## Componentes Principais

### FighterDataZone (`components/ui/FighterDataZone.tsx`)
Client component que recebe:
```typescript
{
  fighterId, franchiseName,
  curatorOverviewEn/Pt/Jp/JpEn?,
  erasToShow: string[],          // ex: ["SSB64", "SSBM", "SSBU"]
  bios: SerializedBio[],
  trophiesMap: Record<string, SerializedCollectible[]>,
  stickersMap: Record<string, SerializedCollectible[]>,  // sempre {} (bug)
  appearances: string[],         // eras onde o fighter aparece
  fichaCounters: { eras, trophies, stickers, spirits },
  originWorkGames?: WorkGame[],  // jogos de origem
  fightersTips?: FighterTip[],
}
```

Seções renderizadas:
1. **Profile** — contadores (eras, troféus, stickers, spirits) + curatorOverview
2. **Timeline** — por era: bio, troféus, stickers, works (origin games)

### OriginGamesPanel (`components/ui/OriginGamesPanel.tsx`)
Exibe jogos de origem com capa. Ver `context/origin-games.md`.

### MediaVaultViewer (`components/ui/MediaVaultViewer.tsx`)
Carrossel da esquerda. Ver `context/media-vault.md`.

## erasToShow — Como é Calculado

```typescript
const erasSet = new Set<string>();
for (const v of appearances) erasSet.add(v);     // de FighterWork
for (const b of biosOrdered) erasSet.add(b.smashGameVersion);  // de FighterBio
for (const [v] of trophiesByGame) erasSet.add(v); // de Collectible TROPHY
const erasToShow = GAME_ORDER.filter(v => erasSet.has(v));
```

**Consequência:** fighters sem FighterWork mas com bios ainda têm eras no timeline (graças aos bios).

## vaultAssets — Ordem Cronológica

O Media Vault monta assets nesta ordem:
1. ORIGIN — sprites de pixel art (`type: "SPRITE"`)
2. GIFs de origem (`FIGHTER_GIFS[name]["ORIGIN"]`)
3. SSBM — render Melee, troféus Melee, GIFs
4. SSBB — troféus Brawl, GIFs
5. SSB4 — troféus SSB4 (só Wii U, 3DS filtrados), GIFs
6. SSBU — render oficial, spirits (`type: "SPIRIT"`), GIFs

## Fighter Mais Completo (referência)

**Ness** — tem todos os dados:
- Sprite EarthBound + GIFs por era
- 3 troféus Melee + 1 Brawl + 5 SSB4 (imagens)
- Render SSBU + spirit #563
- Bio EN para todas as eras
- Tips SSBU em `lib/fighters-tips.ts`
- `curatorOverviewEn` preenchido

## Pendências na Página do Fighter

| Item | Status | Arquivo |
|---|---|---|
| 86 fighters sem ETL completo | ⚠️ Pendente | `context/etl-scrapers.md` |
| stickersMapSerialized sempre vazio | 🐛 Bug | `page.tsx` ~linha 330 |
| Spirits exibidos só no vault, não no timeline | ⚠️ Feature | `FighterDataZone.tsx` |
| FighterWork para todos os fighters | ✅ Completo (2026-06-06) | `scripts/admin/populate-fighter-works.ts` |

## FighterWork — Jogos Smash

Tabela M:N Fighter ↔ Game populada via `scripts/admin/populate-fighter-works.ts`.
**219 entradas criadas** para os 87 fighters nos 5 jogos Smash.

| Game ID | Jogo | Ano |
|---|---|---|
| `game-SSB64` | Super Smash Bros. | 1999 |
| `game-SSBM` | Super Smash Bros. Melee | 2001 |
| `game-SSBB` | Super Smash Bros. Brawl | 2008 |
| `game-SSB4` | Super Smash Bros. for Wii U / 3DS | 2014 |
| `game-SSBU` | Super Smash Bros. Ultimate | 2018 |
