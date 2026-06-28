# SmashCompendium — Architecture

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Linguagem | TypeScript 5.4 |
| UI | React 18, Tailwind CSS 3 |
| ORM | Prisma 5.22 |
| Banco | PostgreSQL (Supabase, sa-east-1) |
| Hospedagem | Vercel (free tier) |
| Scripts | `npx tsx --env-file=.env.local` |

---

## Rotas Principais

| Rota | Descrição |
|---|---|
| `/` | Home |
| `/fighters` | Lista de lutadores |
| `/fighters/[slug]` | Página do lutador (FighterDataZone) |
| `/collectibles` | TrophyViewer (troféus, spirits, stickers, GIFs) |
| `/chronicles` | Timeline de jogos/consoles |
| `/admin` | Painel de curadoria (drag-and-drop, status) |

---

## Modelos de Banco (Prisma)

```
Franchise  1──n  Fighter  1──n  FighterBio       (bios por era)
                          1──n  FighterMove      (moveset por era)
                          1──n  Collectible      (troféus, spirits, stickers, MEDIA)
                 Music           (trilhas com YouTube ID)
                 Stage           (fases por jogo)
                 ChronicleEntry  (linha do tempo de jogos/consoles)
```

### `Collectible.type` values
- `TROPHY` — troféu 3D (SSBM, SSBB, SSB4)
- `SPIRIT` — spirit (SSBU)
- `STICKER` — sticker (SSBB)
- `MEDIA` — GIFs, clipes WebM, 360° rotações (campo `assetRenderUrl`)

### Campos de vídeo
| Modelo | Campo | Uso |
|---|---|---|
| `FighterBio` | `videoStartSec / videoEndSec` | Trecho do showcase do lutador no vídeo completo |
| `Collectible` | `videoStartSec / videoEndSec` | Trecho do troféu (SSBB / SSB4) no vídeo completo |
| `Collectible` | `videoStartSec2 / videoEndSec2` | Trecho 3DS (SSB4 Both) |
| `Collectible` | `assetRender2Url` | URL do WebM 360° (SSBM) ou imagem 3DS (SSB4) |

---

## Sistema de Vídeo

`LocalVideoGif` (`components/ui/LocalVideoGif.tsx`) reproduz um trecho de um vídeo completo usando `requestAnimationFrame` para loop preciso. A URL do vídeo é construída com media fragment: `src={url + '#t=' + start + ',' + end}`.

### Vídeos completos (JAMAIS no git — muito grandes)

| Arquivo | Tamanho | Uso |
|---|---|---|
| `full_video_Zoomzike.mp4` | 2.2 GB | Showcase dos 26 lutadores Melee (ZoomZike) |
| `full_video_brawl.mp4` | 2.2 GB | Rotação de troféus Brawl |
| `full_video_ssb4_wiiu.mp4` | 519 MB | Rotação de troféus SSB4 Wii U |
| `full_video_ssb4_3ds.mp4` | 2.7 GB | Rotação de troféus SSB4 3DS |
| `full_video_trophies.mp4` | 619 MB | Troféus SSBM (ZoomZike base) |
| `full_SSB64_video.mp4` | 47 MB | Perfis SSB64 |

Esses arquivos estão no `.gitignore` e **nunca chegam ao Vercel**. Em produção precisam de CDN.

### WebM 360° SSBM (em `public/assets/media/SSBM/gifs/`)

293 arquivos (`trophy_360_1.webm` … `trophy_360_293.webm`), total ~667 MB.
Também gitignoreados. Referenciados via `Collectible.assetRender2Url`.

---

## Assets de Mídia

```
public/
  assets/
    media/          ← GITIGNORED — GIFs, WebMs, PNGs (grande)
      SSBM/
        gifs/       ← 293 trophy_360_*.webm + outros clips
  videos/           ← GITIGNORED — full_video_*.mp4
  collectibles/     ← GITIGNORED — TROPHY-*.png
```

**Imagens de troféu** (`assetRenderUrl` para TROPHYs): URLs externas do `ssb.wiki.gallery` — chegam ao Vercel normalmente. O `next.config.mjs` usa `unoptimized: true` para não consumir o limite de 5.000 transformações/mês do free tier.

---

## CDN — Estratégia de Migração

### Configuração

Em `lib/media-config.ts`, a função `cdnUrl(localPath)` e o objeto `FULL_VIDEOS` prefixam todos os paths locais com `process.env.NEXT_PUBLIC_CDN_BASE_URL` quando definido. Sem a variável, os paths voltam ao localhost (dev funciona, deploy não).

### Fase 1 — Trophy 360 WebMs (667 MB → Cloudflare R2 grátis)

1. Criar bucket no Cloudflare R2 (10 GB grátis)
2. Instalar SDK: `npm install @aws-sdk/client-s3 @aws-sdk/lib-storage`
3. Adicionar ao `.env.local`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
4. Executar: `npx tsx --env-file=.env.local scripts/admin/upload-trophy360-to-r2.ts`
5. Habilitar "Public Access" no bucket → copiar URL pública
6. Adicionar `NEXT_PUBLIC_CDN_BASE_URL=https://pub-xxx.r2.dev` no `.env.local` e no Vercel

### Fase 2 — Vídeos completos por lutador (SSBM showcase)

Os vídeos completos (2–2.7 GB) não cabem nem no R2 grátis (10 GB total) de forma viável para todos.

Solução: **split por lutador** com ffmpeg + upload dos clips individuais.

1. Executar: `npx tsx --env-file=.env.local scripts/admin/split-fighters-video.ts`
2. Resultado em `public/videos/clips/ssbm_{slug}.mp4` (~26 clips × ~40–80 MB)
3. Upload dos clips para R2 (total estimado: ~1 GB)
4. Com `NEXT_PUBLIC_CDN_BASE_URL` definido, os clips resolvem automaticamente via `FULL_VIDEOS`

> **Nota:** os timestamps do DB (Bio.videoStartSec/videoEndSec) apontam para o vídeo completo. Após split, é necessário atualizar os timestamps para 0 → duração do clip por lutador — ou hospedar o vídeo completo num CDN com ≥ 3 GB disponíveis.

---

## Convenções de Código

- Scripts: sempre `npx tsx --env-file=.env.local scripts/...` — **nunca** `ts-node`
- Aprovações: `curationStatus = "approved"` **nunca via script** — somente manual via `/admin`
- Migrations: **nunca** `prisma migrate dev` — usar `$executeRawUnsafe` nos scripts
- Versioning: cada commit incrementa `APP_VERSION` em `lib/version.ts` (ex: V00.111)
- `prisma generate`: parar o dev server primeiro (DLL lock no Windows)

---

## Variáveis de Ambiente

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Conexão Prisma → Supabase PostgreSQL |
| `ANTHROPIC_API_KEY` | Scripts de curadoria com Claude |
| `GEMINI_API_KEY` | Tradução de bios/moves |
| `YOUTUBE_API_KEY` | Busca de músicas |
| `NEXT_PUBLIC_CDN_BASE_URL` | Base URL do CDN (Cloudflare R2) para vídeos/assets |
| `R2_ACCOUNT_ID` | Upload de assets para R2 (scripts admin) |
| `R2_ACCESS_KEY_ID` | Upload R2 |
| `R2_SECRET_ACCESS_KEY` | Upload R2 |
| `R2_BUCKET_NAME` | Nome do bucket R2 |

---

## Deploy

- **Vercel** — push na branch `master` dispara deploy automático
- `unoptimized: true` em `next.config.mjs` — evita consumir cota de Image Optimization (5.000/mês)
- Só um branch (`master`) — sem feature branches por enquanto
- Repositório: `ACrush14/smash-compendium`
