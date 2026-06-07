# Sistema: Música — Fighter + Tracks

---

## 1. Música Icônica dos Fighters

**Admin:** `/admin/music`  
**Campos no Fighter:** `musicYoutubeId`, `musicTitle`, `musicArtist`, `musicStatus`

### Estado Atual
- **87/87 fighters** com `musicStatus = "pending_review"`
- Nenhum aprovado ainda
- YouTube IDs precisam ser revisados manualmente em `/admin/music`
- Aprovar inline na checklist `/admin/fighters` também (botão **✓ aprovar**)

### Schema (no modelo Fighter)
```prisma
model Fighter {
  musicYoutubeId  String?  // ID do YouTube (ex: "OsQEEHUuLGg")
  musicTitle      String?  // Título da música (ex: "Bein' Friends")
  musicArtist     String?  // Artista/compositor (ex: "Shogo Sakai · Melee Remix")
  musicStatus     String?  // "pending_review" | "approved"
}
```

### Como Funciona na Página do Fighter
```typescript
const music = fighter.musicYoutubeId
  ? { youtubeId: fighter.musicYoutubeId, title: fighter.musicTitle, artist: fighter.musicArtist }
  : FIGHTER_MUSIC_FALLBACK[fighter.name] ?? null;
```

**Fallback hardcoded** (só Ness tem):
```typescript
const FIGHTER_MUSIC_FALLBACK: Record<string, MusicTrack> = {
  "Ness": { youtubeId: "OsQEEHUuLGg", title: "Bein' Friends", artist: "Shogo Sakai · Melee Remix" },
};
```

---

## 2. Music Tracks (Modelo `Music`) — SSBWiki SSBU

**Admin:** `/admin/music-tracks`  
**Total no banco (Sessão 22):** 1.119 faixas (1.079 inseridas + 29 atualizadas do scraper)

### Schema completo
```prisma
model Music {
  id              String     @id @default(cuid())
  title           String
  franchiseId     String
  arranger        String?
  isRemix         Boolean    @default(false)
  // Campos SSBWiki (adicionados Sessão 22):
  youtubeId       String?    // ID do YouTube extraído da wiki
  duration        String?    // "MM:SS"
  sourceGame      String?    // Jogo de origem (ex: "Super Mario Bros.")
  compositionType String?    // "Original" | "New Remix" | "Melee Remix" | "SSB4 Remix" | etc.
  notes           String?    // Créditos, arrangers, supervisors da wiki
  franchise       Franchise  @relation(fields: [franchiseId], references: [id])
  stages          StageMusic[]
  @@index([franchiseId])
}
```

### Distribuição por Franquia (principais)
| Franquia | Faixas |
|---|---|
| Super Smash Bros. | 113 |
| Other | 107 (trailers, não-listadas) |
| Street Fighter | 38 |
| Kirby | 38 |
| Fire Emblem | 52 |
| Tekken | 39 |
| Fatal Fury | 50 |
| Mario | 91 |

### Admin Editor (`/admin/music-tracks`)
- Filtros: franquia, compositionType, busca por título
- Paginação: 50 por página
- Cada faixa expansível com edição inline de todos os campos
- Preview de thumbnail YouTube
- Link direto para YouTube
- Botões Salvar / Deletar

### API Routes
| Endpoint | Método | Função |
|---|---|---|
| `GET /api/admin/music-tracks` | GET | Listar com filtros (`franchise`, `compositionType`, `q`, `page`, `limit`) |
| `POST /api/admin/music-tracks` | POST | Criar faixa com todos os campos |
| `PATCH /api/admin/music-tracks/[id]` | PATCH | Atualizar qualquer campo |
| `DELETE /api/admin/music-tracks/[id]` | DELETE | Deletar (remove StageMusic primeiro) |

### Construtor (`/admin/create` → tipo "Música")
Campos disponíveis: title, franchiseId, youtubeId, duration, sourceGame, compositionType, arranger, isRemix, notes

### Tipos de compositionType
```
"Original" | "New Remix" | "New Arrangement" |
"Melee Remix" | "Brawl Remix" | "SSB4 Remix" | "Other Remix"
```

### Scraper
`scripts/scrapers/scrape-ssbu-music-full.ts` — scrapeou SSBWiki Music (SSBU) em Sessão 22.  
Rodado uma vez. 1.108 faixas da wiki + 11 pré-existentes = 1.119 total.

### Migração de schema
`scripts/admin/add-music-ssbu-fields.ts` — adicionou colunas via raw SQL (`IF NOT EXISTS`).  
Depois executar `npx prisma generate` para regenerar o cliente.
