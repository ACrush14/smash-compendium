# Sistema: Música Icônica dos Fighters

**Admin:** `/admin/music`
**Campos no Fighter:** `musicYoutubeId`, `musicTitle`, `musicArtist`, `musicStatus`

---

## Estado Atual

- **87/87 fighters** com `musicStatus = "pending_review"`
- Nenhum aprovado ainda
- YouTube IDs precisam ser revisados manualmente em `/admin/music`

## Schema

```prisma
model Fighter {
  musicYoutubeId  String?  // ID do YouTube (ex: "OsQEEHUuLGg")
  musicTitle      String?  // Título da música (ex: "Bein' Friends")
  musicArtist     String?  // Artista/compositor (ex: "Shogo Sakai · Melee Remix")
  musicStatus     String?  // "pending_review" | "approved"
}
```

## Como Funciona na Página do Fighter

A música é exibida em algum componente da página (player ou badge). A fonte de dados segue esta lógica:

```typescript
// Em page.tsx
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

## Como Aprovar Músicas

1. Acessar `/admin/music`
2. Ouvir cada faixa (YouTube embed)
3. Aprovar ou substituir o ID

## Como Atualizar via Script

```typescript
// Para aprovar em lote após revisão manual:
await db.fighter.updateMany({
  where: { musicStatus: "approved" },  // já aprovados
  data: { musicStatus: "approved" }    // noop, só exemplo
});

// Para atualizar uma música específica:
await db.fighter.update({
  where: { name: "Mario" },
  data: {
    musicYoutubeId: "NOVO_ID_YOUTUBE",
    musicTitle: "Super Mario Bros. Theme",
    musicArtist: "Koji Kondo",
    musicStatus: "approved"
  }
});
```

## Modelos Stage/Music (pendentes)

```prisma
model Music  { id, title, franchiseId, arranger?, isRemix }
model Stage  { id, name, franchiseId, smashDebutVersion }
model StageMusic { stageId, musicId }  // M:N
```

Estes modelos existem no schema mas **não têm dados ainda**. ETL para stages e músicas não foi implementado.
