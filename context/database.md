# Sistema: Database

**Schema:** `prisma/schema.prisma`
**ORM:** Prisma 5.22
**Banco:** Supabase PostgreSQL (sa-east-1)
**Conexão:** Session Pooler IPv4 — `aws-1-sa-east-1.pooler.supabase.com:5432`

**Última atualização:** 2026-06-06

---

## Modelos e Estado Atual

### Fighter (87 registros)
```
id, rosterNumber, name (unique), franchiseId
imageUrl?               — render 3D do SSBU (87/87 ✅)
curatorOverviewEn/Pt/Jp/JpEn?  — texto curatorial (só Ness tem)
musicYoutubeId/Title/Artist?   — música icônica
musicStatus?            — "pending_review" | "approved" (87 em pending_review)
```

### FighterBio (todos os 87 fighters têm bios ✅)
```
fighterId, smashGameVersion ("SSB64"|"SSBM"|"SSBB"|"SSB4"|"SSBU")
contentEn (obrigatório), contentPt?, contentJp?, contentJpEn?
```

### FighterWork ✅ COMPLETO — 219 entradas (87/87 fighters)
```
fighterId, gameId, isDebut (bool)
```
Populado via `scripts/admin/populate-fighter-works.ts` em 2026-06-06.
Todos os 87 fighters mapeados aos jogos Smash que aparecem.

### Game (5 registros — todos os jogos Smash) ✅
```
id (fixo): "game-SSB64" | "game-SSBM" | "game-SSBB" | "game-SSB4" | "game-SSBU"
titleEn, releaseYear, platform
```
| ID | Título | Ano | Plataforma |
|---|---|---|---|
| `game-SSB64` | Super Smash Bros. | 1999 | N64 |
| `game-SSBM` | Super Smash Bros. Melee | 2001 | GCN |
| `game-SSBB` | Super Smash Bros. Brawl | 2008 | Wii |
| `game-SSB4` | Super Smash Bros. for Wii U / 3DS | 2014 | WiiU |
| `game-SSBU` | Super Smash Bros. Ultimate | 2018 | NSW |

### Collectible
```
type: "TROPHY" | "SPIRIT" | "STICKER" | "SPRITE" | "MEDIA"
smashGameVersion: "SSB64"|"SSBM"|"SSBB"|"SSB4"|"SSBU"|"ORIGIN"
```
| Tipo | Count | Cobertura |
|---|---|---|
| TROPHY | 901 | 71/87 fighters |
| SPIRIT | 1582 | 84/87 fighters |
| STICKER | 707 | 55/87 fighters |
| SPRITE | 37 | Sprites de origem |
| MEDIA | 6 | Ativos de mídia |

### ChronicleEntry (947 registros)
```
consoleName, titleNtsc, titlePal?, titleJp?
releaseDateNtsc/Pal/Jp?
wikiUrl?      — 389 com / 558 sem
boxArtUrl?    — 263 com / 684 sem
```

### Demais modelos
- `Franchise` — 54 franquias cadastradas
- `FighterTip` — tips SSBU (só Ness tem dados)
- `FighterSuggestion` — sugestões aprovadas de usuários
- `Stage`, `Music`, `StageMusic` — sem dados ainda

---

## Como Consultar

```typescript
// Em scripts:
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
// ...
await db.$disconnect();

// No app (Next.js):
import { db } from "@/lib/db";  // singleton
```

## Queries Úteis

```typescript
// Fighters sem troféus (16 fighters)
db.fighter.findMany({
  where: { collectibles: { none: { type: "TROPHY" } } },
  select: { name: true, rosterNumber: true }
})

// ChronicleEntry sem wikiUrl (558)
db.chronicleEntry.findMany({
  where: { wikiUrl: null },
  orderBy: { consoleName: "asc" }
})

// Collectibles por tipo e fighter
db.collectible.findMany({
  where: { fighter: { name: "Mario" }, type: "TROPHY" },
  orderBy: { smashGameVersion: "asc" }
})

// Ver todas as aparições de um fighter
db.fighterWork.findMany({
  where: { fighter: { name: "Mario" } },
  include: { game: true },
  orderBy: { game: { releaseYear: "asc" } }
})
```

## Versões Smash (smashGameVersion)

| Valor | Jogo | Ano | Game ID |
|---|---|---|---|
| `SSB64` | Super Smash Bros. | 1999 | `game-SSB64` |
| `SSBM` | Super Smash Bros. Melee | 2001 | `game-SSBM` |
| `SSBB` | Super Smash Bros. Brawl | 2008 | `game-SSBB` |
| `SSB4` | Super Smash Bros. for Wii U / 3DS | 2014 | `game-SSB4` |
| `SSBU` | Super Smash Bros. Ultimate | 2018 | `game-SSBU` |
| `ORIGIN` | Jogo de origem do personagem | — | — |

## Dashboard de Status

```bash
npx tsx --env-file=.env.local scripts/admin/check-status.ts
```
