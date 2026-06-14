# SmashCompendium — Contexto do Projeto

> Documento vivo. Fonte única de verdade para todos os assistentes (Claude Code, Antigravity/Gemini).
> Atualizado em: 2026-06-14 (sessão 21 — Conclusão do Scraper de Spirits do SmashWiki e Refatoração de Abas da UI)

---

## 1. Visão Geral

**SmashCompendium** é um museu digital fan-made do Super Smash Bros.
Preserva e exibe, por lutador, a totalidade do seu acervo oficial ao longo de toda a série:
troféus, spirits, stickers, sprites de origem, biografias bilíngues, dicas in-game e jogos de origem.

- **Propósito:** Projeto acadêmico/fan-made. Sem fins comerciais.
- **Cobertura:** SSB64 → Melee → Brawl → SSB4 → SSBU (87 lutadores).
- **Status:** Em desenvolvimento ativo. Ness é o lutador piloto com dados completos.

---

## 2. Tech Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14.2 (App Router, Server Components) |
| Banco de dados | PostgreSQL via Supabase (região sa-east-1) |
| ORM | Prisma 5.22 |
| Estilo | Tailwind CSS |
| Runtime de scripts | `tsx` (esbuild — **nunca ts-node**) |
| Scraping | `cheerio` 1.2 + `fetch` nativo (Node 24) |
| Linguagem | TypeScript |

### Conexão Supabase
- **Usar sempre:** Session Pooler IPv4 → `aws-1-sa-east-1.pooler.supabase.com:5432`
- **Nunca usar:** conexão direta (é IPv6-only, falha em rede doméstica)
- `DATABASE_URL` fica em `.env.local`; exportar manualmente para o Prisma CLI

---

## 3. Schema do Banco (Prisma)

Arquivo: `prisma/schema.prisma`

### `Franchise`
Franquia de origem de um lutador (Mario, Zelda, EarthBound, etc).
```
id          String   — CUID
name        String   — único
svgIconUrl  String?  — ícone da franquia
fighters    Fighter[]
games       Game[]
stages      Stage[]
musicTracks Music[]
```

### `Fighter`
Os 87 lutadores do SSBU.
```
id                  String   — CUID
rosterNumber        String   — número no roster (ex: "01", "14")
name                String   — único (ex: "Ness")
franchiseId         String
imageUrl            String?  — render principal (URL externa ssbwiki)
selectAnimationUrl  String?  — GIF de seleção
curatorOverviewEn   String?  — nota curatorial em inglês (fan-made)
curatorOverviewPt   String?  — nota curatorial em português
curatorOverviewJp   String?  — nota curatorial em japonês (original)
curatorOverviewJpEn String?  — tradução EN da nota curatorial JP
musicYoutubeId      String?  — YouTube video ID da trilha icônica (ex: "OsQEEHUuLGg")
musicTitle          String?  — título da faixa (ex: "Bein' Friends")
musicArtist         String?  — compositor/artista (ex: "Shogo Sakai · Melee Remix")
musicStatus         String?  — "pending_review" | "approved" (padrão: "pending_review")
tips                FighterTip[]
suggestions         FighterSuggestion[]
```
**Música:** Todos os 87 lutadores têm `musicYoutubeId` populado via `scrape-fighter-music.ts`.
Revisar e aprovar em `/admin/music` (teclado: A=aprovar, ←→=navegar).

### `FighterBio`
Texto biográfico in-game por versão do Smash.
```
id                  String  — CUID
fighterId           String
smashGameVersion    String  — "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU"
contentEn           String  — texto oficial em inglês (obrigatório)
contentPt           String? — tradução PT-BR (curadoria)
contentJp           String? — texto original japonês
contentJpEn         String? — tradução EN do texto JP
@@unique([fighterId, smashGameVersion])
```
**ATENÇÃO:** Os valores reais no banco são `"SSBM"` e `"SSBB"` (NÃO "MELEE"/"BRAWL"). Usar sempre as siglas corretas.

### `Game`
Jogos de origem dos personagens (não os jogos do Smash).
```
id             String    — CUID
titleEn        String    — título em inglês
titleJp        String?   — título japonês original
releaseDate    DateTime?
releaseYear    Int?
releaseMonth   Int?
releaseRegion  String?   — "JP" | "NA" | "PAL"
platform       String    — "NES" | "SNES" | "N64" | "GCN" | etc.
consoleIconUrl String?   — path local ex: /assets/consoles/snes.svg
boxArtUrl      String?   — URL da capa do jogo
franchiseId    String
```

### `FighterWork`
Relação M:N entre lutador e jogo de origem.
```
fighterId  String  — PK composta
gameId     String  — PK composta
isDebut    Boolean — true se é a primeira aparição do personagem
```

### `Collectible`
Troféus, Spirits, Stickers e Sprites. Tipo central de acervo.
```
id               String  — CUID
fighterId        String?
type             String  — "TROPHY" | "SPIRIT" | "STICKER" | "SPRITE"
smashGameVersion String  — "MELEE" | "BRAWL" | "SSB4" | "SSBU" | "ORIGIN"
name             String
nameJp           String?
description      String? — campo legado, mantido para compat
descriptionNa    String? — descrição região América do Norte (NTSC)
descriptionEu    String? — descrição região Europa (PAL)
descriptionEn    String? — descrição EN curada
descriptionPt    String? — descrição PT-BR curada
descriptionJp    String? — descrição japonesa
descriptionJpEn  String? — tradução EN da descrição JP
sourceType       String  — default "Official"
assetRenderUrl   String? — URL da imagem do coletável
orderIndex       Int?    — legado genérico
posicaoTrofeuMelee Int?  — posição oficial (Melee)
posicaoTrofeuBrawl Int?  — posição oficial (Brawl)
posicaoTrofeuSsb4  Int?  — posição oficial (SSB4)
posicaoSpiritSsbu  Int?  — número do Spirit (Ultimate)
@@index([type, smashGameVersion])
```

**Valores válidos para `type`:**
- `"TROPHY"` — troféus (Melee, Brawl, SSB4, SSBU)
- `"SPIRIT"` — spirits (SSBU)
- `"STICKER"` — adesivos (Brawl)
- `"SPRITE"` — pixel art do jogo de origem
- `"MEDIA"` — mídias variadas: clay model, artworks, GIFs de origem

**Convenções de tipo especial:**
- `type = "SPRITE"` + `smashGameVersion = "ORIGIN"` → sprite do jogo de origem (ex: NessSprite.gif)
- `type = "SPIRIT"` + `smashGameVersion = "SSBU"` → spirit do Ultimate
- `type = "MEDIA"` → qualquer mídia não-coletável; nome identifica o asset ("Clay Model", "GIF - PK Magnet", etc.)

### `FighterSuggestion`
Sugestões de visitantes por seção/era de cada lutador. Sistema de feedback público.
```
id          String   — CUID
fighterId   String
section     String   — "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU" | "general"
authorName  String   — nome do visitante (máx 80 chars)
message     String   — sugestão em texto livre (máx 1000 chars)
createdAt   DateTime @default(now())
@@index([fighterId, section])
```
- Tabela criada via `prisma db push` em 2026-06-05
- API: `GET /api/suggestions?fighterId=X&section=Y` (últimas 50) | `POST /api/suggestions` (cria)
- UI: `SuggestionPanel` (painel fixo, sempre aberto) no final da página do personagem, abaixo de toda a Linha do Tempo. Usa `section="general"` — sugestões são por personagem, não por era.

### `Stage` / `Music` / `StageMusic`
Fases e músicas — modelos existem no schema, ingestão ainda pendente.
**Nota:** A música do lutador agora fica direto em `Fighter.musicYoutubeId` (não via Stage→Music).

### `ChronicleEntry` (Novo na Sessão 16)
Jogos do Nintendo Chronicle (SmashWiki), unificando variações NTSC, PAL e JP.
```
id              String   — CUID
consoleName     String   — ex: "Nintendo 64"
titleNtsc       String   — ex: "Star Fox 64" (Ou "JP EXCLUSIVE")
titlePal        String?  — ex: "Lylat Wars"
titleJp         String?  — ex: "Star Fox 64" (Japonês)
titleJpEn       String?  — Tradução EN do título JP Exclusive
titleJpPt       String?  — Tradução PT do título JP Exclusive
releaseDateNtsc String?
releaseDatePal  String?
releaseDateJp   String?
unlockCriteria  String?
wikiUrl         String?  — URL de referência usada para o merge regional
```

---

## 4. Estrutura de Arquivos

```
/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home — busca URL-state + stats + ETL log
│   ├── layout.tsx              # Layout raiz
│   ├── globals.css
│   ├── fighters/
│   │   └── [slug]/
│   │       └── page.tsx        # FighterProfile — layout Split-Vault
│   ├── collectibles/
│   │   └── page.tsx
│   ├── games/
│   └── api/
│       ├── suggestions/
│       │   └── route.ts         # GET + POST /api/suggestions (NEW sessão 11)
│       ├── collectibles/ fighters/ games/ translate/
│
├── components/
│   ├── fighter/
│   │   ├── BioTranslator.tsx    # Tabs EN/JP/PT-BR por era
│   │   ├── FighterDataZone.tsx  # Zona direita — header + ficha + timeline
│   │   ├── FighterRightPanel.tsx# Wrapper cliente do painel direito (controla lang state)
│   │   ├── MediaVaultViewer.tsx # Zona esquerda — render + carrossel
│   │   ├── OriginGamesPanel.tsx # Painel de jogos de origem do personagem
│   │   ├── SuggestionPanel.tsx  # Acordeão de sugestões por era (NEW sessão 11)
│   │   └── SearchBar.tsx
│   ├── vault/                  # Componentes de acervo/galeria
│   └── ui/                     # Componentes base (botões, badges, etc)
│
├── scripts/
│   ├── seed.ts                 # Orquestrador principal de ETL
│   ├── scrapers/
│   │   ├── index.ts            # Entry point dos scrapers
│   │   ├── character-article.ts# Scraper SSBWiki — textos (bio, troféus, stickers)
│   │   ├── fetch-images.ts     # Scraper SSBWiki — imagens (render, troféus, sprite, spirit)
│   │   ├── fighters.ts         # Bulk insert dos 87 fighters
│   │   ├── collectibles.ts     # Scraper de coletáveis
│   │   ├── stages.ts           # Scraper de stages (pendente)
│   │   ├── music.ts            # Scraper de músicas (pendente)
│   │   └── utils.ts            # Rate limiter (politeDelay), fetchHtml, helpers
│   └── seed/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── assets/
│       └── consoles/           # Ícones SVG/PNG dos consoles (22 arquivos)
│           │
│           │  — Nintendo domésticos —
│           ├── nes.svg                  ← NES (americano) — Inkscape 2025
│           ├── famicom.svg              ← Family Computer (japonês)
│           ├── snes.svg                 ← SNES wordmark completo (americano)
│           ├── super-famicom.svg        ← Nintendo Super Famicom texto (japonês)
│           ├── super-famicom-symbol.svg ← Super Famicom 4 círculos coloridos
│           ├── n64.svg                  ← Nintendo 64 wordmark azul+vermelho
│           ├── gcn.svg                  ← Nintendo GameCube oficial
│           ├── wii.svg                  ← Wii logo cinza+azul
│           ├── wiiu.svg                 ← Wii U logo
│           ├── switch.svg               ← Nintendo Switch N-mark
│           ├── virtualboy.svg           ← Virtual Boy
│           │
│           │  — Nintendo portáteis —
│           ├── gb.svg                   ← Game Boy colorido
│           ├── gbc.svg                  ← Game Boy Color (SVG — novo)
│           ├── gbc.png                  ← Game Boy Color (PNG — legado)
│           ├── gba.svg                  ← Game Boy Advance
│           ├── ds.svg / ds.png          ← Nintendo DS
│           └── 3ds.svg                  ← Nintendo 3DS
│           │
│           │  — Sega —
│           ├── gen.svg                  ← Sega Genesis (americano)
│           │
│           │  — Sony —
│           ├── ps1.svg                  ← PlayStation 1 (novo)
│           ├── ps2.svg                  ← PlayStation 2 (novo)
│           ├── ps3.svg                  ← PlayStation 3
│           └── ps4.svg                  ← PlayStation 4
│           │
│           │  — Pendentes (não encontrados no Wikimedia) —
│           │    Game & Watch, MSX, Sega Mega Drive (JP)
│
│       └── gifs/               # GIFs animados por era (9 arquivos ativos — sessão 10)
│           ├── ness-melee-pk.gif        ← Melee (SSBM) — PK Fire
│           ├── ness-melee-2.gif         ← Melee (SSBM) — Entrada em cena
│           ├── ness-mother2-1.gif       ← Brawl (SSBB) — Troféu animado
│           ├── ness-smash-anim.gif      ← Brawl (SSBB) — Gameplay
│           ├── ness-mother2-2.gif       ← Smash 4 (SSB4) — Card troféu
│           ├── ness-smash4.gif          ← Smash 4 (SSB4) — Gameplay Wii U
│           ├── jeff-mother2.gif         ← Ultimate (SSBU) — Assist Trophy Jeff
│           ├── ness-ultimate-1.gif      ← Ultimate (SSBU) — Gameplay
│           └── ness-ultimate-2.gif      ← Ultimate (SSBU) — PK Thunder
│           (paula/poo removidos — eram troféus Melee irrelevantes)
│
│       └── games/              # Box art dos jogos Smash (12 arquivos — adicionados 2026-06-05)
│           ├── SSB64_USA_BOX.jpg
│           ├── SSB64_JP_BOX.jpg
│           ├── SSBMELEE_USA_BOX.jpg
│           ├── SSBMELEE_JP_BOX.jpg
│           ├── SSBBRAWL_USA_BOX.webp
│           ├── SSBBRAWL_JP_BOX.jpg
│           ├── SSBWIIU_USA_BOX.jpg    ← SSB4 Wii U
│           ├── SSBWIIU_JP_BOX.jpg
│           ├── SSB3DS_USA_BOX.jpg     ← SSB4 3DS
│           ├── SSB3DS_JP_BOX.jpg
│           ├── SSBULTIMATE_USA_BOX.jpg
│           └── SSBULTIMATE_JP_BOX.jpg
│
├── lib/
├── types/
├── tailwind.config.ts
├── next.config.mjs             # Domínios permitidos: ssbwiki.com, ssb.wiki.gallery
├── tsconfig.json               # module: esnext, moduleResolution: bundler
└── CONTEXT.md                  # este arquivo
```

---

## 5. Rotas & Páginas

### `/` — Home
- Barra de busca com URL-state (`?q=`)
- Stats reais do banco (contagem de fighters, troféus, etc.)
- ETL log (últimas ingestões)

### `/fighters/[slug]` — FighterProfile
Layout **Split-Vault** — a regra mais importante da UI:

```
┌─────────────────────────────────────────────────────┐
│  Zona Esquerda (col-span-5)  │  Zona Direita (col-span-7) │
│  MediaVaultViewer            │  FighterDataZone           │
│                              │                            │
│  • Render principal          │  • Header sticky           │
│  • Sprite de origem          │  • Ficha Catalográfica     │
│  • Carrossel de troféus/     │  • OriginGamesPanel        │
│    stickers/sprites          │  • Linha do Tempo          │
│                              │    (BioTranslator por era) │
│  SEM texto de coletáveis     │  SEM imagens de coletáveis │
└─────────────────────────────────────────────────────┘
```

**Regra estrita:** `<Image>` de coletáveis NUNCA na zona direita.

Container: `h-screen overflow-hidden flex flex-col`
- Left: `col-span-5 relative` → inner div `absolute inset-0`
- Right: `col-span-7 relative` → inner div `absolute inset-0 overflow-y-auto`

### `BioTranslator`
- Prop `compact` → botões EN/JP/PT-BR no canto superior direito de cada era
- Itera eras cronológicas: SSB64 → Melee → Brawl → SSB4 → SSBU

---

## 6. ETL Pipeline

### Como executar scripts
```bash
# SEMPRE usar npx tsx — nunca ts-node
npx tsx scripts/seed.ts
npx tsx scripts/scrapers/fetch-images.ts
```

### Rate Limit
- `politeDelay()` em `utils.ts`: 1.5s + jitter entre requisições para não sobrecarregar SSBWiki
- **Wikimedia Commons:** usar 2-3s de delay + exponential backoff para HTTP 429

### Fluxo de Ingestão (Ness como exemplo)
1. `fighters.ts` → insere os 87 fighters no banco
2. `character-article.ts` → scrapa SSBWiki, extrai bio + troféus + stickers
3. `fetch-images.ts` → baixa imagens: render, sprite (seção "Background"), spirit (seção "Spirit")
4. Resultado: Collectibles com `assetRenderUrl` preenchido

### Detalhes do Scraper `character-article.ts`
- Itera todos os pares `dt/dd` dentro de `<dl>` (fix para Melee com 3 troféus)
- Detecção NTSC/PAL via ícones de bandeira (flag `width ≤ 25px`) → `descriptionNa` / `descriptionEu`
- IDs de troféu com sufixo de índice (`-1`, `-2`) para desambiguação

### Fontes de Dados Aprovadas
| Fonte | Uso |
|---|---|
| `ssbwiki.com` | Fonte principal EN — textos, imagens, troféus, stickers, bios |
| `ssb.wiki.gallery` | CDN de imagens do SSBWiki |
| `smashwiki.info` | **Fonte de bios em japonês (JP)** — sob demanda, por personagem. URL: `smashwiki.info/<nome-em-JP>`. Estrutura: `<dl>` com pares `<dt>/<dd>` — igual ao ssbwiki EN. Usar `character-article.ts` adaptado para JP. |
| `ssbuspirits.com/spirits/<slug-en>` | **Descrição dos Spirits em inglês**. Texto no campo `span.wixui-rich-text__text` ou `div` correspondente. Ex: Ness = Spirit #563, texto EN inserido no banco como `Collectible.descriptionEn`. |
| `ssbinfo.com` | Fonte adicional, ainda não explorada |
| `upload.wikimedia.org` | Logos SVG de consoles |

---

## 7. Sistema de Design

### Paleta
```
Fundo base:     slate-950  (#020617)
Superfícies:    slate-900 / slate-800
Acentos:        amber-400 / amber-500  (dourado)
Texto primário: white / slate-100
Texto muted:    slate-400 / slate-500
Bordas:         slate-700 / slate-800
```

### Tipografia
- Metadados e labels técnicos → `font-mono`
- Textos de UI → sans-serif padrão Tailwind

### Estética
- Tema: **museu/arquivo de dados**
- Bordas anguladas com `clipPath polygon` — estilo HUD
- Linhas finas (1px) em slate-700
- Sem bordas arredondadas exageradas

### Next.js Image
- Domínios permitidos em `next.config.mjs`: `www.ssbwiki.com`, `ssb.wiki.gallery`
- Usar sempre `<Image>` do Next.js para troféus e renders — **nunca `<img>` raw**

---

## 8. Ícones de Console — Mapeamento Regional

| Platform no banco | Região | Arquivo |
|---|---|---|
| `NES` | NA | `/assets/consoles/nes.svg` |
| `NES` | JP | `/assets/consoles/famicom.svg` |
| `SNES` | NA | `/assets/consoles/snes.svg` |
| `SNES` | JP | `/assets/consoles/super-famicom.svg` |
| `N64` | ambas | `/assets/consoles/n64.svg` |
| `GCN` | ambas | `/assets/consoles/gcn.svg` |
| `Wii` | ambas | `/assets/consoles/wii.svg` |
| `WiiU` | ambas | `/assets/consoles/wiiu.svg` |
| `Switch` | ambas | `/assets/consoles/switch.svg` |
| `VirtualBoy` | ambas | `/assets/consoles/virtualboy.svg` |
| `GB` | ambas | `/assets/consoles/gb.svg` |
| `GBC` | ambas | `/assets/consoles/gbc.svg` *(+ gbc.png legado)* |
| `GBA` | ambas | `/assets/consoles/gba.svg` |
| `DS` | ambas | `/assets/consoles/ds.svg` |
| `3DS` | ambas | `/assets/consoles/3ds.svg` |
| `GEN` / `MegaDrive` | NA | `/assets/consoles/gen.svg` |
| `PS1` | ambas | `/assets/consoles/ps1.svg` |
| `PS2` | ambas | `/assets/consoles/ps2.svg` |
| `PS3` | ambas | `/assets/consoles/ps3.svg` |
| `PS4` | ambas | `/assets/consoles/ps4.svg` |

**Lógica de renderização regional:** se `Game.releaseRegion === "JP"`:
- `platform === "NES"` → exibir `famicom.svg`
- `platform === "SNES"` → exibir `super-famicom.svg`
- demais plataformas → mesmo ícone independente de região

**Ícones ainda sem SVG (pendente):** Game & Watch, MSX, Sega Mega Drive (JP/versão japonesa)

---

## 9. Convenções Técnicas

### TypeScript/Build
- `tsconfig.json`: `"module": "esnext"`, `"moduleResolution": "bundler"` (padrão Next.js)
- Scripts ETL: **sempre `npx tsx`**, nunca `ts-node`

### PowerShell (Windows)
- Diretórios com colchetes (`app/fighters/[slug]`): usar `-LiteralPath`
- Ex: `Remove-Item -LiteralPath "app/fighters/[slug]"`

### Prisma
- Migrações: `npx prisma db push` (não usar `migrate dev` em produção)
- Seed manual via scripts `tsx`

### Naming de Collectibles
- `smashGameVersion`: sempre em CAPS (`"MELEE"`, `"BRAWL"`, `"SSB4"`, `"SSBU"`, `"ORIGIN"`)
- `type`: sempre em CAPS (`"TROPHY"`, `"SPIRIT"`, `"STICKER"`, `"SPRITE"`)

---

## 10. Estado Atual dos Dados (2026-06-05)

### Ness (lutador piloto — completo)
- Bio SSB64 in-game ✓
- 3 troféus Melee com imagens ✓ (3 URLs únicas)
- 1 troféu Brawl com imagem ✓
- 5 troféus SSB4 no banco — **3DS excluídos do vault e da ficha** (só Wii U exibido: 2 URLs únicas) ✓
- Sticker Brawl — **removido do vault e da ficha catalográfica** (STICKERS: 0) ✓
- Render SSBU ✓
- Sprite EarthBound (NessSprite.gif, type=SPRITE) ✓
- Clay Model + Melee Artwork + 3 GIFs de moveset (type=MEDIA) ✓
- **Spirit SSBU inserido** (id=SPIRIT-SSBU-Ness-563, Spirit #563, descriptionEn preenchida, sem imagem ainda) ✓
- **Vault total: 23 artefatos únicos** (ordem cronológica — sessão 12)

### Outros 86 fighters
- Cadastrados no banco (sem imagens) ✓
- ETL de conteúdo ainda não rodado ✗

---

## 11. Box Art dos Jogos Smash e Jogos de Origem (2026-06-05)

### 11.1 Box arts dos 5 jogos Smash

`GameMetaEntry` em `lib/smash-meta.ts` foi expandido com 5 campos:

```ts
boxArtUsa?:   string;    // /assets/games/SSB64_USA_BOX.jpg
boxArtJp?:    string;    // /assets/games/SSB64_JP_BOX.jpg
boxArtAlt?:   string;    // segundo box art (ex: Wii U para SSB4)
boxArtAltJp?: string;
consoleIcon?: string;    // /assets/consoles/n64.svg — injetado na EraHeader
```

Arquivos em `public/assets/games/` (12 imagens):

| Jogo | USA | JP |
|---|---|---|
| SSB64 | SSB64_USA_BOX.jpg (380×262, paisagem) | SSB64_JP_BOX.jpg (480×693, retrato) |
| Melee | SSBMELEE_USA_BOX.jpg | SSBMELEE_JP_BOX.jpg |
| Brawl | SSBBRAWL_USA_BOX.webp | SSBBRAWL_JP_BOX.jpg |
| Smash 4 | SSBWIIU_USA_BOX.jpg + SSB3DS_USA_BOX.jpg | SSBWIIU_JP_BOX.jpg + SSB3DS_JP_BOX.jpg |
| Ultimate | SSBULTIMATE_USA_BOX.jpg | SSBULTIMATE_JP_BOX.jpg |

### 11.2 Box arts dos jogos de origem (EarthBound, Mother 3)

Baixados do Wikimedia Commons e salvos em `public/assets/games/`:

| Jogo | Arquivo | Dimensões | Orientação |
|---|---|---|---|
| EarthBound (SNES NA) | EARTHBOUND_USA_BOX.jpg | 369×270 | Paisagem |
| Mother 3 (GBA JP) | MOTHER3_JP_BOX.jpg | 396×252 | Paisagem |

Fonte: `upload.wikimedia.org` (EarthBound_Box.jpg, Deluxe_package.jpg)

O tipo `OriginGame` em `OriginGamesPanel.tsx` foi expandido com:
```ts
boxArtPath?:      string;   // /assets/games/...
boxArtLandscape?: boolean;  // true = paisagem → container 200×146; false = retrato → 120×172
```

`FRANCHISE_ORIGIN_GAMES` em `page.tsx` já possui as entradas preenchidas para EarthBound.

---

## 12. Pendências Prioritárias

| # | Tarefa | Prioridade | Status |
|---|---|---|---|
| 19 | **🔒 Desativar Deployment Protection no Vercel** | — | ✅ Resolvido |
| 14 | **Página "Coleções"** — grid de cards estilo Spirit Board | Alta | ✅ Concluído (sessão 16) |
| 15 | **Página "Chronicles"** — lista cronológica dark theme | — | ✅ Concluído (sessão 16) |
| 20 | **Capas dos Jogos (Box Arts)** | Alta | ✅ Concluído (sessão 16) |
| CF-1 | **Fix Captain Falcon — Olimar/Falcon Flyer trophies** | Alta | ✅ Concluído (sessão 18) |
| CF-2 | **SSBU Tips (1.513 tips)** — todos os 87 fighters | Alta | ✅ Concluído (sessão 18) |
| CF-3 | **Spirit descriptions** — ssbuspirits.com | Alta | ✅ 54/87 salvos (sessão 18) |
| CF-5 | **F-Zero origin games** — 5 jogos adicionados | Alta | ✅ Concluído (sessão 18) |
| CF-6 | **Música por personagem** — 87/87 curados + admin page | Alta | ✅ Concluído (sessão 18) |
| MUSIC | **Revisão de músicas** — aprovar/corrigir no `/admin/music` | Alta | 🟡 Pendente revisão (87 pending_review) |
| CF-4 | **Media Vault — ordem/fotos** | Alta | 🔴 Pendente |
| 1 | **ETL em massa** — bio EN + troféus + imagens para os outros 86 fighters | Alta | 🟡 Rodando no Background |
| 21 | **Mass Downloader de Imagens** — baixar os 4.000 troféus offline | Alta | 🟡 Rodando no Background |
| 18 | **Área de comentários por personagem** | Alta | 🔴 Pendente |
| 8 | **Página `/fighters`** — lista geral com filtros | Média | 🔴 Pendente |
| 17 | **Curator notes** EN+PT+JP — aguarda `ANTHROPIC_API_KEY` | Média | 🟡 Pronto, não rodado |
| 6 | **Bio JP** — `contentJp` null para 86 fighters | Média | 🟡 Rodando no Background |
| 12 | **Moderação de sugestões** | — | ✅ Resolvido |

**Resolvidos nesta sessão (sessão 20 — 2026-06-06):**
- ✅ **Schema Collectible:** Adicionados campos nominais de posição (`posicaoTrofeuMelee`, `posicaoTrofeuBrawl`, `posicaoTrofeuSsb4`, `posicaoSpiritSsbu`).
- ✅ **Scrapers SmashWiki:** Corrigidos erros 404 (novas URLs) e 429 (`politeDelay` aumentado para 3s + backoff) e em andamento para todo o banco.
- ✅ **UI Chronicles:** Fontes das datas foram aumentadas (`text-base` para NTSC e `text-sm` para JP).
- ✅ **Chronicles Boxarts:** Scraper atualizado para filtrar melhor SVGs, ícones wiki e lidar com URLs com backoff. Em andamento no background.

**Resolvidos nesta sessão (sessão 4 a 14):**
- ✅ Layout visual completo da página do lutador, carrossel deduplicado, moderação, music player.

**Resolvidos nesta sessão (sessão 16 — 2026-06-06):**
- ✅ **Página Chronicles:** Layout Grid com Capas dinâmicas. Box Arts de SmashWiki injetadas via ETL.
- ✅ **Página Coleções:** Spirit Board replicado com perfeição.
- ✅ **Navegação horizontal de consoles (Tab Bar)** usando `searchParams` via URL (Mantém RSC).
- ✅ **Ordenação Oficial de Jogos:** A ordenação escolhe a data NTSC/JP/PAL mais antiga.
- ✅ **Script de Tradução:** Bypass no Google Translate para extrair títulos JP EXCLUSIVE para inglês e português.
- ✅ **Ordenação Global de Troféus:** Captura de `orderIndex` direto das listas-mestras (List of trophies) para organizar os 4.000 itens cronologicamente.
- ✅ **Mass Image Downloader:** Script construído para baixar o acervo de URLs e persistir tudo no HD local.

**Resolvidos nesta sessão (sessão 11 — 2026-06-05):**
- ✅ Deduplicação do vault por URL — 27 → 25 artefatos (SSB4 tinha 2 pares de renders idênticos)
- ✅ Sublabel dos GIFs EarthBound corrigido: "Gameplay de origem · EarthBound (SNES, 1995)" em vez de "Moveset em ação · SSBU"
- ✅ Sistema de sugestões completo: schema `FighterSuggestion`, API `/api/suggestions`, componente `SuggestionPanel` por era

**Resolvidos nesta sessão (sessão 12 — 2026-06-05):**
- ✅ Vault reordenado cronologicamente (ORIGIN → SSBM → SSBB → SSB4 → SSBU)
- ✅ Sticker Brawl removido do vault e da ficha
- ✅ Troféus 3DS filtrados (`is3DSTrophy`) — vault exibe só Wii U
- ✅ Spirit SSBU inserido no banco (Spirit #563, texto EN via ssbuspirits.com)
- ✅ Fontes JP documentadas: `smashwiki.info` (bio JP) + `ssbuspirits.com` (spirit EN)
- ✅ Player de música implementado (`MusicPlayer.tsx`) — YouTube IFrame API, estilo HUD do site
- ✅ Ness: "Bein' Friends" (Shogo Sakai, 3:50) funcionando no painel esquerdo

**Resolvidos nesta sessão (sessão 16 — 2026-06-06):**
- ✅ Página Chronicles: Layout Grid com "Capas" CSS dinâmicas baseadas no logo do console.
- ✅ Página Chronicles: Navegação horizontal de consoles (Tab Bar) usando `searchParams` via URL para manter a página como RSC.
- ✅ Ordenação de jogos por data mundial (A ordenação agora escolhe a data NTSC/JP/PAL mais antiga).
- ✅ Script de Tradução (ETL): Bypass gratuito na API do Google Translate extraindo e traduzindo os títulos `JP EXCLUSIVE` para inglês e português. Adicionado no Schema.

---

## 15. Refactor Visual da Página `/fighters/[slug]` (sessão 4 — 2026-06-05)

### 15.1 Arquitetura do Header (FighterRightPanel)

O header foi dividido em duas zonas:

**Sticky header (96px, compacto):**
- Meta row: `#10 · EARTHBOUND`
- Nome do lutador (fonte reduzida para `clamp(2rem, 2.8vw, 3rem)`)
- Badges de aparições compactos no canto direito (texto simples)

**Corpo scrollável (não sticky):**
1. `OriginGamesPanel` — ocupa largura total, jogos em `flex-row flex-wrap`
2. **"PRIMEIRA APARIÇÃO"** — box arts USA + JP do jogo de estreia, lado a lado
3. "Também em" — badges dos outros jogos do roster
4. Separador
5. `FighterDataZone` (idioma + ficha + timeline)

**Regra crítica:** o sticky header NÃO pode ultrapassar ~120px de altura. Todo conteúdo visual pesado (origin games, box arts grandes) vai no corpo scrollável.

### 15.2 Primeira Aparição — Box Arts do Debut

Dois containers lado a lado, mesma altura (214px):
- **USA** (paisagem para SSB64): `width: 310, height: 214`, `object-contain`, label "USA"
- **JP** (retrato para SSB64): `width: 148, height: 214`, `object-contain`, label "JP"

As dimensões se adaptam à orientação real de cada jogo. SSB64 USA é paisagem (380×262), SSB64 JP é retrato (480×693).

### 15.3 EraHeader (Linha do Tempo) — Estado Final

Layout atual em `components/ui/FighterDataZone.tsx`:

```
┌──────────────────────────────────────────────────────────────┐
│ [Bloco esq 150px]  │ [Texto centro]  │ [Box arts flex-1]     │
│  console icon       │  NINTENDO 64    │  ████████ │ ████████  │
│  SSB 64 (1.4rem)   │  Smash · 1999   │  USA      │ JP        │
│  1999 (12px)        │  (shrink-0)     │  (flex-1) │ (flex-1)  │
└──────────────────────────────────────────────────────────────┘
height: 180 (fixo — NÃO usar minHeight, quebra o fill do Next.js)
```

**Implementação crítica:**
```tsx
// Container pai — height FIXO obrigatório para Image fill funcionar
<div style={{ background: meta.eraHeaderBg, height: 180 }}>

  {/* Bloco esquerdo: width: 150, borderRight */}
  {/* Texto central: shrink-0, px-5, não cresce */}

  {/* Box arts: flex-1, items-stretch, gap-px */}
  <div className="flex flex-1 items-stretch gap-px">
    {meta.boxArtUsa && (
      <div className="relative flex-1 overflow-hidden border-l border-white/10">
        <Image fill className="object-cover object-top" sizes="30vw" />
      </div>
    )}
    {meta.boxArtJp && (  /* opacity: 0.85 */ }
    {meta.boxArtAlt && ( /* SSB4: terceira caixa */ }
    {meta.boxArtAltJp && ( /* SSB4: quarta caixa */ }
  </div>
</div>
```

- Console icons: `filter: "brightness(0) invert(1)"` — brancos sobre fundo colorido
- Box arts: `object-cover object-top` — corta pelo topo para mostrar sempre o logo/título
- Badge "★ DEBUT" **removido permanentemente**
- Texto mínimo: 12px em todo o cabeçalho
- SSB4 exibe até 4 box arts (Wii U USA + Wii U JP + 3DS USA + 3DS JP)

### 15.4 Nota Curatorial

Texto da nota curatorial clarificado: `text-slate-300` → `text-slate-100`

### 15.5 OriginGamesPanel

- Jogos em layout horizontal (`flex-row flex-wrap`) em vez de coluna vertical
- Container ocupa `w-full` (sem `minWidth` fixo)
- Box art real abaixo de cada jogo quando disponível (`boxArtPath`), senão placeholder tracejado
- Dimensões do box art por orientação:
  - Paisagem → container `200×146px`
  - Retrato → container `120×172px`
  - Ambos com `object-contain` (sem corte)

---

## 13. Atualização Crítica de ETL: Rate Limits, Ultimate Spirits e Fighter Tips

Precisamos resolver a falha de Rate Limit no download dos SVGs dos consoles e expandir o banco de dados e o scraper para capturar o acervo textual da era Super Smash Bros. Ultimate.

Execute as seguintes diretrizes estritas:

### 13.1 Extração Segura de SVGs (Anti-Rate Limit)
- Refatore o script de download do Wikimedia Commons. Abandone as requisições puramente paralelas.
- Implemente um *delay* de 2 a 3 segundos entre cada requisição e uma lógica de *retry* com *exponential backoff* para lidar com HTTP 429.
- Salve os SVGs limpos em `public/assets/consoles/` (ex: `super-famicom.svg`). O arquivo `snes.svg` já existe e deve ser ignorado no download.
- No `FighterProfile`, implemente a renderização regional: se a origem do jogo no banco for Japão (JP), exiba o ícone do Super Famicom; se for NA, exiba o SNES.

### 13.2 Expansão do Schema (Ultimate Era)
Atualize o `prisma/schema.prisma` para acomodar os novos tipos de dados textuais:
- Adicione um novo modelo `FighterTip` para armazenar as dicas in-game (ex: "Ness's Origins", "Homesickness").

```prisma
model FighterTip {
  id          String   @id @default(cuid())
  fighterId   String
  title       String
  description String   @db.Text
  fighter     Fighter  @relation(fields: [fighterId], references: [id], onDelete: Cascade)
}
```

- Atualize o modelo `Collectible` ou garanta que o campo `type` aceite a string `"Spirit"`.

### 13.3 Scraper de Spirits (ssbuspirits.com)
Atualize o `scripts/seed.ts` (ou crie um scraper dedicado) para visitar `https://www.ssbuspirits.com/spirits/[nome-do-lutador-em-minusculas]`.

Usando o cheerio, localize a tag `span.wixui-rich-text__text` (ou a div correspondente que envolve o texto descritivo do Spirit).

Salve esse texto no banco de dados associado ao lutador com o tipo `Spirit` e a era `Ultimate`.

### 13.4 Ingestão Estática de Fighter Tips
Como os Tips virão de capturas de tela do usuário, crie um arquivo estático em `data/fighter_tips.json` com a seguinte estrutura de exemplo:

```json
{
  "Ness": [
    { "title": "Ness's Origins", "description": "Ness first appeared in the SNES title EarthBound..." },
    { "title": "Homesickness", "description": "In EarthBound, Ness occasionally gets homesick..." }
  ]
}
```

Adicione uma etapa no script de ETL que leia este JSON e popule a tabela `FighterTip` correspondente a cada lutador.

Rode o `npx prisma db push` para aplicar o `FighterTip`, ajuste a interface para exibir os Spirits e os Tips na linha do tempo do Ultimate, e execute os scripts de extração.

> Ao usar um arquivo JSON para os *Tips*, você mantém o banco de dados limpo e pode ir alimentando o sistema gradativamente sempre que tirar novas capturas de tela do seu Switch.

---

## 14. Padrões de Colaboração AI

### Fluxo de Rotação
O projeto usa um sistema de **rotação de IAs** onde o contexto é explicitamente passado via este arquivo:

```
Claude Code → Antigravity (Gemini) → Claude Code → ...
```

**Regra obrigatória:** Ao terminar uma sessão de trabalho, **sempre atualizar** este `CONTEXT.md` antes de finalizar. A próxima IA lê este arquivo no início da sessão.

### Responsabilidades por IA
- **Claude Code** → implementação técnica, ETL, schema, bug fixes, scrapers
- **Antigravity (Gemini)** → design, correções visuais, fixes de layout, UX
- **Ambas** → podem fazer qualquer coisa; o contexto é compartilhado igualmente

### Comportamento do Usuário
- O usuário valida resultados **visualmente no browser** (`localhost:3001` — porta 3000 já em uso)
- Prefere **execução direta** sem excesso de perguntas
- Quando há bloqueio técnico (ex: conexão banco), precisa de instruções claras de 1-2 passos
- **PowerShell no Windows** — usar sintaxe correta (ver seção 9)
- Variável de ambiente do DB: `$env:DATABASE_URL="postgresql://..."` antes de qualquer `npx tsx` de script

### Como Executar Scripts com DB
```powershell
# Sempre setar DATABASE_URL antes de scripts tsx
$env:DATABASE_URL="postgresql://postgres.qmhxtkexygrqozunabnv:Majorasmask2001@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
npx tsx scripts/seed.ts
```

---

## 16. Correções Visuais — Sessão 5 (2026-06-05)

### 16.1 GIFs no MediaVaultViewer (CRÍTICO)

**Problema:** `next/image` otimiza e **mata a animação** de GIFs (ex: `NessSprite.gif`).

**Solução aplicada em `components/ui/MediaVaultViewer.tsx`:**
- Adicionada função `IS_GIF(url)` que detecta se a URL termina em `.gif`
- Prop `unoptimized={IS_GIF(active.url)}` na imagem principal
- Prop `unoptimized={IS_GIF(asset.url)}` nas thumbnails do carrossel
- `imageRendering: "pixelated"` para GIFs (pixel art nítido)

```tsx
const IS_GIF = (url: string | null) => !!url && url.toLowerCase().endsWith(".gif");
// No <Image>:
unoptimized={IS_GIF(active.url)}
```

### 16.2 EraHeader — Box Arts com `fill` (CRÍTICO)

**Problema:** `<Image fill>` do Next.js **exige** que o container pai tenha **altura explícita** (não apenas `minHeight`). Com `minHeight: 180`, o `fill` não conseguia calcular a dimensão e a imagem não aparecia.

**Solução aplicada em `components/ui/FighterDataZone.tsx`:**
```tsx
// ANTES (quebrado):
style={{ background: meta.eraHeaderBg, minHeight: 180 }}

// DEPOIS (correto):
style={{ background: meta.eraHeaderBg, height: 180 }}
```

Também adicionado suporte a `boxArtAltJp` que estava faltando no render da EraHeader (SSB4 tem 4 box arts: Wii U USA, Wii U JP, 3DS USA, 3DS JP).

### 16.3 Dados do Ness no Banco (referência)

```json
{
  "imageUrl": "https://ssb.wiki.gallery/images/8/82/Ness_SSBU.png",
  "biosCount": 2,
  "worksCount": 1,
  "works": ["Super Smash Bros."]
}
```

Collectibles do Ness:
- **SPRITE** `ORIGIN`: `NessSprite.gif` (ssb.wiki.gallery) ✓
- **TROPHY** `SSBM`: 3 troféus com imagem ✓
- **TROPHY** `SSBB`: 1 troféu com imagem ✓
- **TROPHY** `SSB4`: 7 troféus (alguns sem imagem) ✓
- **STICKER** `SSBB`: 1 sticker (sem imagem — bug pendente) ✗
- **SPIRIT** `SSBU`: ainda não scrapado ✗

### 16.4 Domínios permitidos no Next.js (`next.config.mjs`)

```
www.ssbwiki.com          → imagens do SSBWiki
ssb.wiki.gallery         → CDN de imagens do SSBWiki (USAR ESTE)
earthbound.fandom.com    → fandom EarthBound
static.wikia.nocookie.net→ CDN Wikia/Fandom
upload.wikimedia.org     → logos SVG de consoles
```

**Importante:** as imagens de troféus do Ness vêm de `ssb.wiki.gallery` (não de `www.ssbwiki.com`). Ambos estão permitidos.

### 16.5 Servidor de Desenvolvimento

- Porta **3000** estava em uso → Next.js escolhe automaticamente a **3001**
- URL de desenvolvimento: `http://localhost:3001`
- Rodar com: `npm run dev` dentro de `d:\Super Smash Bros Museum`

### 16.6 PT-BR Tab — Degradação Graceful (sem ANTHROPIC_API_KEY)

**Problema:** `ANTHROPIC_API_KEY` está vazia em `.env.local`. `/api/translate` retorna 500, gerando erros no log do servidor.

**Solução aplicada em `FighterDataZone.tsx`:**
- Adicionado estado `ptUnavailable: boolean`
- Quando a API retorna status não-OK ou `{ error: "..." }`, seta `ptUnavailable = true`
- O tab PT-BR fica desabilitado (`cursor-not-allowed`, cinza escuro) e exibe `✕` ao lado
- Tooltip: `"Tradução indisponível (configure ANTHROPIC_API_KEY)"`
- Para **habilitar a tradução PT-BR**: adicionar chave válida da Anthropic em `.env.local`:
  ```
  ANTHROPIC_API_KEY="sk-ant-..."
  ```

### 16.7 UI e Localização — Sessão 6 (2026-06-05)

**OriginGamesPanel (EN/PT-BR vs JP/JP+EN):**
- **EN/PT-BR:** Exibe "EarthBound" · 1995.06 · Super Nintendo Entertainment System · NA (com capa `EARTHBOUND_USA_BOX.jpg`).
- **JP/JP+EN:** Exibe "MOTHER2 ギーグの逆襲" · 1994.08 · Super Family Computer (Super Famicom) · JP (com capa original `MOTHER2_JP_BOX.png`, baixada do Wikimedia).
- Modelo expandido para suportar `boxArtPathJp`.

**FighterDataZone:**
- Label "IDIOMA GLOBAL:" e "WORKS:" com tamanho aumentado para `13px`.
- Título do jogo em Works (EarthBound) dobrado de tamanho para `22px`.
- O label "Bios" agora só aparece na era de estreia (N64).
- Título da seção de acervo alterado conforme idioma: "Trophies" (EN) / "Troféus" (PT-BR) / "フィギュア" (JP).

**Badge DEBUT (Primeira Aparição):**
- Removido da seção estática isolada no `FighterRightPanel`.
- Agora é renderizado dinamicamente dentro do próprio `EraHeader` da era de estreia (ex: bloco SSB64), aparecendo sobre o ícone do console.

**Links da Wikipedia Dinâmicos (por região):**
- No `EraHeader`, cada box art é um link individual: **Capas USA → Wikipedia EN**, **Capas JP → Wikipedia JP**.
- O painel informativo esquerdo do `EraHeader` usa o idioma ativo do usuário para escolher o link.
- No `OriginGamesPanel`, o bloco inteiro (título + capa) linka dinamicamente baseado no modo de idioma (JP → Wiki JP, EN → Wiki EN).
- Na seção `Works` do `FighterDataZone`, a mesma lógica de idioma é aplicada.
- Propriedades: `wikiUrlUsa` e `wikiUrlJp` em `GameMetaEntry` (smash-meta.ts) + `wikiUrl`/`wikiUrlJp` em `OriginGame` (page.tsx) e `WorkGame` (FighterDataZone.tsx).

**DATABASE_URL — Transaction Pooler:**
- Alterado de Session Pooler (porta 5432) para **Transaction Pooler (porta 6543)** com `pgbouncer=true&connection_limit=5`.
- Motivo: o pool de 15 conexões do Session mode esgotava com múltiplos restarts do dev server.
- **IMPORTANTE:** Para operações que exigem Session mode (como `prisma db push` ou `prisma migrate`), é necessário temporariamente usar porta 5432.

**Schema Prisma — Modelo FighterTip (preparado, não migrado):**
- Modelo `FighterTip` adicionado ao `schema.prisma` com campos `titleEn`, `textEn`, `titlePt`, `textPt`, `titleJp`, `textJp`.
- Relação `tips FighterTip[]` adicionada ao modelo `Fighter`.
- Script ETL criado em `scripts/scrapers/seed-tips.ts` + dados em `data/fighter_tips.json`.
- **Pendente:** executar `prisma db push` (requer session mode port 5432 temporariamente) e rodar o seed.

**Raspagem e Injeção de Textos em Japonês (Smash Wiki):**
- Textos da Bio do SSB64 e Troféus de SSBM, SSBB e SSB4 foram extraídos do SmashWiki (seção "ゲーム中の解説") e salvos no banco.
- O script `scripts/scrapers/copy-trophy-to-bio.ts` foi rodado para copiar as descrições dos Troféus principais de SSBM, SSBB e SSB4 para atuar como suas respectivas `FighterBio.contentJp`, visto que essas eras não possuem texto descritivo nativo (além do troféu) no SmashWiki.
- A Bio de Ultimate (SSBU) foi alimentada com a citação oficial japonesa do site do Smash Bros.

**Deploy na Vercel:**
- O projeto foi linkado via Vercel CLI.
- As variáveis de ambiente de produção (ex: `DATABASE_URL` conectada ao Transaction Pooler 6543) foram configuradas na Vercel.
- O erro de tipagem no `FighterTip` foi corrigido e a build foi concluída com sucesso para Produção.

---

## 17. Estado Atual da UI — Para a Próxima IA (2026-06-05)

> **Leia esta seção primeiro.** Resume o que está pronto e o que entra na próxima sprint.

### O que está funcionando (não mexa sem motivo)

| Componente | Arquivo | Estado |
|---|---|---|
| Sticky header compacto | `FighterRightPanel.tsx` | ✅ 96px, nome + badges |
| Showcase (origin games) | `OriginGamesPanel.tsx` | ✅ Localização dinâmica (Mother 2 + Capa JP vs EarthBound NA) |
| Badge DEBUT | `FighterDataZone.tsx` | ✅ Posicionado nativamente no EraHeader da primeira aparição |
| EraHeader (timeline) | `FighterDataZone.tsx` | ✅ `height:180` fixo, box arts preenchendo com `fill` |
| boxArtAltJp no EraHeader | `FighterDataZone.tsx` | ✅ SSB4 agora exibe 4 caixas (WiiU USA/JP + 3DS USA/JP) |
| Nota curatorial | `FighterDataZone.tsx` | ✅ text-slate-100 |
| Tipografia Localizada | `FighterDataZone.tsx` | ✅ Labels "WORKS" e "Idioma Global" em 13px, Trophies/Troféus/フィギュア dinâmico |
| GIFs no MediaVault | `MediaVaultViewer.tsx` | ✅ `unoptimized` + `pixelated` para .gif |
| Traduções Estáticas (PT & JP_EN) | `DB` + `FighterDataZone.tsx` | ✅ Traduções estáticas carregadas do DB; Ness pilotado |
| Localização de propriedades JP | `FighterDataZone.tsx` | ✅ Esconde textos null/em inglês na tab JP |
| Injeção Smash Tips JP | `inject-jp-tips.ts` | ✅ Scraping do wikiwiki.jp extraindo `<dt>` e `<dd>` para `titleJp` e `textJp` da era SSBU |
| Ícones de console | `public/assets/consoles/` | ✅ 25 arquivos (SVG+PNG), mapeados em `smash-meta.ts` |
| Box arts dos jogos Smash | `public/assets/games/` | ✅ 15 imagens (USA+JP para 5 jogos + EarthBound + Mother 3 + Mother 2 JP) |
| GIFs por era no MediaVault | `public/assets/gifs/` | ✅ 9 GIFs ativos (2 Melee + 2 Brawl + 2 SSB4 + 3 Ultimate) |
| Ordem definitiva do Vault | `page.tsx` → `vaultAssets` | ✅ Clay → Sprite → Melee → Brawl → SSB4 → Ultimate (**25 artefatos**, dedup ativo) |
| Labels descritivos no Vault | `MediaVaultViewer.tsx` | ✅ 13px label + 11px sublabel com plataforma e ano |
| Deduplicação vault por URL | `page.tsx` → `dedupedVaultAssets` | ✅ Filter Set<url> no final do assembly — sessão 11 |
| Sublabel GIFs EarthBound | `page.tsx` → `pushMedia` | ✅ "Gameplay de origem · EarthBound (SNES, 1995)" — sessão 11 |
| SuggestionPanel por personagem | `SuggestionPanel.tsx` + `FighterDataZone.tsx` | ✅ Painel único, sempre aberto, no final da página — `section="general"` — sessão 15 |
| API sugestões | `app/api/suggestions/route.ts` | ✅ GET + POST, tabela `FighterSuggestion` no banco — sessão 11 |

### Arquitetura do FIGHTER_GIFS (page.tsx)

```ts
type GifEra   = "ORIGIN" | "SSB64" | "SSBM" | "SSBB" | "SSB4" | "SSBU";
type GifEntry = { url: string; label: string; sublabel: string };
const FIGHTER_GIFS: Record<string, Partial<Record<GifEra, GifEntry[]>>>
```

- Definido em `app/fighters/[slug]/page.tsx` junto com `FIGHTER_ORIGIN_GAMES`
- `pushGifs(era)` injeta os GIFs no ponto certo do `vaultAssets`
- `pushMedia(filter, assetType, sublabelFn)` injeta MEDIA assets do banco em posições específicas
- Para adicionar GIFs de outro lutador: adicionar entrada em `FIGHTER_GIFS[fighterName]`

### Mapeamento correto dos GIFs do Ness (após reclassificação sessão 10)

| Arquivo | Era real | Conteúdo |
|---|---|---|
| `ness-melee-pk.gif` | SSBM | Ataque PK Fire em batalha |
| `ness-melee-2.gif` | SSBM | Entrada em cena / movimentação |
| `ness-mother2-1.gif` | SSBB | Troféu 3D animado do Brawl |
| `ness-smash-anim.gif` | SSBB | Gameplay Brawl |
| `ness-mother2-2.gif` | SSB4 | Card de troféu Smash 4 |
| `ness-smash4.gif` | SSB4 | Gameplay Wii U |
| `ness-ultimate-1.gif` | SSBU | Gameplay Ultimate |
| `ness-ultimate-2.gif` | SSBU | Ataque PK Thunder |
| `jeff-mother2.gif` | SSBU | Cena com Jeff (Assist Trophy) |
| ~~`paula-mother2.gif`~~ | removido | Era troféu Melee da Paula (irrelevante) |
| ~~`poo-mother2.gif`~~ | removido | Era troféu Melee do Poo (irrelevante) |

### Ordem definitiva do vaultAssets (23 artefatos para Ness — sessão 12)

**Regra de ouro: ordem cronológica estrita por ano de lançamento.**

```
ORIGIN (1994 — EarthBound/SNES)
  1   🕹️ Sprite EarthBound       SPRITE DB — pixel art original (Super Famicom, 1994)
  2   🎬 GIF - PK Magnet         MEDIA DB — gameplay de origem (EarthBound)
  3   🎬 GIF - Yo-Yo             MEDIA DB — gameplay de origem (EarthBound)
  4   🎬 GIF - Bat               MEDIA DB — gameplay de origem (EarthBound)

SSBM (2001 — GameCube)
  5   🧱 Clay Model              MEDIA DB — modelo de argila Melee
  6   🖼️ Melee Artwork           MEDIA DB — arte oficial
  7   🏆 Troféu Melee            TROPHY DB — NessTrophy.png
  8   🏆 Troféu Melee            TROPHY DB — NessTrophy2.png
  9   🏆 Troféu Melee            TROPHY DB — (3ª URL única)
 10   🎬 Ness · PK Fire          GIF FIGHTER_GIFS
 11   🎬 Ness · Entrada em cena  GIF FIGHTER_GIFS

SSBB (2008 — Wii)
 12   🏆 Troféu Brawl            TROPHY DB
 13   🎬 Ness · Troféu Brawl     GIF FIGHTER_GIFS
 14   🎬 Ness · Animação Brawl   GIF FIGHTER_GIFS

SSB4 (2014 — Wii U) ← 3DS EXCLUÍDOS (is3DSTrophy)
 15   🏆 NessTrophyWiiU.png      TROPHY DB — Wii U padrão
 16   🏆 NessAltTrophyWiiU.png   TROPHY DB — Wii U alternativo
 17   🎬 Ness · Troféu Smash 4   GIF FIGHTER_GIFS
 18   🎬 Ness · Gameplay Smash 4 GIF FIGHTER_GIFS

SSBU (2018 — Switch)
 19   🎨 Ness — Render Oficial   RENDER — Ness_SSBU.png
 20   👻 Ness — Spirit           SPIRIT DB — Spirit #563 (sem imagem ainda)
 21   🎬 Ness · Ultimate         GIF FIGHTER_GIFS
 22   🎬 Ness · PK Thunder       GIF FIGHTER_GIFS
 23   🎬 Ness + Jeff · Cena      GIF FIGHTER_GIFS
```

**Regras do vault (imutáveis):**
- Stickers: **removidos do vault** (decisão de curadoria — sessão 12)
- Troféus 3DS: **filtrados por `is3DSTrophy(url)`** — URLs com "3ds" na string excluídas
- Spirits sem imagem: incluídos no vault (mostram placeholder até imagem ser adicionada)
- Deduplicação: `dedupedVaultAssets` filtra por `Set<url>`; itens com `url === null` sempre passam

### Labels no MediaVaultViewer (sessão 10)
- **Label** (nome do asset): `text-[13px] font-semibold uppercase` — era `text-[10px]`
- **Sublabel** (descrição): `text-[11px] leading-snug` — era `text-[9px] truncate`
- Sublabels agora incluem plataforma e ano: ex. *"Troféu 3D oficial · Super Smash Bros. Melee (GameCube, 2001)"*
- `truncate` removido do sublabel — texto quebra em múltiplas linhas

### O que fazer na próxima sessão (ordem sugerida)

1. **ETL em massa** → rodar scrapers para os outros 86 fighters (bio EN + troféus + imagens) — ÚLTIMA GRANDE DEMANDA
2. **Bio JP** → adaptar `character-article.ts` para scraping do `smashwiki.info` por lutador (JP)
3. **Spirit — imagem** → buscar URL da imagem do Spirit do Ness (ssb.wiki.gallery ou ssbwiki)
4. **Box arts de outros franchises** → Mario, Zelda, Kirby, etc. para o OriginGamesPanel
5. **Página `/fighters`** → lista geral com filtros por franquia/era
6. **DB cleanup** → deletar rows 3DS do SSB4 do banco (IDs: `TROPHY-SSB4-Ness-Ness-4`, `TROPHY-SSB4-Ness-Ness`, `TROPHY-SSB4-Ness-Ness (Alt.)`)

### Regras de ouro que nunca mudam

1. `height: 180` **fixo** no EraHeader — NÃO usar `minHeight` (quebra o `fill` do Next.js)
2. Sticky header ≤ 120px — conteúdo visual pesado vai no corpo scrollável
3. Scripts ETL: sempre `npx tsx`, nunca `ts-node`
4. Banco: sempre Session Pooler IPv4 (`aws-1-sa-east-1.pooler.supabase.com:5432`)
5. PowerShell: `$env:DATABASE_URL="..."` antes de qualquer script
6. Imagens colecionáveis: NUNCA na zona direita do Split-Vault
7. Texto mínimo: 12px em toda a UI (regra de museu)
8. GIFs: usar `unoptimized` no `<Image>` do Next.js

---

## 18. Protocolo de Handoff entre IAs

```
Claude Code → Antigravity (Gemini) → Claude Code → ...
```

### Ao TERMINAR uma sessão (qualquer IA):
1. Atualizar o `>Atualizado em:` no topo deste arquivo
2. Atualizar a seção **17** com o estado atual da UI
3. Marcar pendências como ✅ na tabela da seção 12
4. Documentar qualquer nova decisão arquitetural nas seções numeradas
5. **Nunca deixar o projeto em estado quebrado** — se algo não funcionou, documentar o motivo

### Ao INICIAR uma sessão (qualquer IA):
1. Ler este arquivo inteiro antes de qualquer código
2. Verificar a seção 17 (estado atual) e a seção 12 (pendências)
3. Iniciar `npm run dev` e confirmar que o Ness renderiza — porta pode ser **3000 ou 3001** (se 3000 estiver em uso, Next.js auto-detecta 3001)
4. Acessar `http://localhost:3001/fighters/Ness` (ou 3000 se disponível)
5. Só então começar a trabalhar

### Responsabilidades
- **Claude Code** → implementação técnica, ETL, schema, bug fixes, scrapers, lógica de dados
- **Antigravity (Gemini)** → decisões visuais, correções de layout, UX, design system
- **Ambas** → podem implementar qualquer coisa; o importante é documentar aqui

---

## 19. Traduções Estáticas e Acervo Extra (Sessão 7 - 2026-06-05)
### 19.1 Remoção do Fallback de Tradução Dinâmica
- Foi removido o uso do `/api/translate` no client-side em `FighterDataZone.tsx`.
- Todo o sistema de tradução PT-BR e JP_EN agora é estático, alimentado pelos campos criados no Prisma (`curatorOverviewEn`, `curatorOverviewPt`, `titleJpEn`, `textJpEn`, etc).
- `Ness` foi utilizado como piloto, com todas as suas strings traduzidas manualmente no banco de dados.

### 19.2 UI e Localização JP_EN
- Quando a aba de tradução literal (JP_EN) está ativa, o sistema de UI agora substitui a string "ネス" diretamente por "Ness" nas strings de cabeçalho.
- Tamanho das fontes padronizado: descrições (`text-sm`), títulos das Tips (`text-xs`), títulos de Troféus/Stickers (`text-[11px]`).
- Retirado o itálico (italic) que estava em todas as descrições de Melee, Brawl e SSB4, uniformizando com as descrições de Ultimate e 64.

### 19.3 Fundo Dinâmico (Franchise)
- A propriedade `svgIconUrl` de `Franchise` passou a ser consumida pela tela do `FighterDataZone`.
- Adicionada imagem em fundo translúcido (`opacity-10 scale-[1.5] invert`) usando o SVG do logo da franquia associada (ex: `EarthboundSymbol.svg`).

### 19.4 MediaVaultViewer e Giphy
- Modificado o `MediaVaultViewer.tsx` para suportar formalmente as tipagens de `clay`, `art` e `gif`, substituindo os `placeholder-X` temporários.
- Os gifs (como PK Magnet, Bat e Yo-yo de Giphy), modelos Clay e artes originais foram salvos fisicamente em `public/assets/media/ness` e adicionados ao Prisma na tabela `Collectible` (com `type: "MEDIA"`), sendo renderizados pela "Galeria".

---

## 20. Sistema de Sugestões de Visitantes (Sessão 11 — 2026-06-05)

### 20.1 Arquitetura

Visitantes podem deixar sugestões de conteúdo por era/seção na página de cada lutador.

**Fluxo:**
1. Visitante vê o painel "SUGGESTIONS" já aberto no final da página do personagem
2. Preenche nome (máx 80 chars) + mensagem (máx 1000 chars)
3. `POST /api/suggestions` → salva no banco com `section="general"`
4. Lista de sugestões existentes carregada por `GET /api/suggestions?fighterId=X&section=general` no mount

### 20.2 Componentes

**`components/ui/SuggestionPanel.tsx`** (client component)
- Props: `fighterId: string`, `section: string`, `lang?: UILang`
- Sempre visível — sem acordeão. Carrega sugestões no mount (`useEffect` sem dependência de estado aberto)
- Form: `input[name]` + `textarea[message]` + botão "Send" (i18n)
- Estados: loading | enviando | enviado (feedback "Sent!" por 3s) | erro
- Sugestões exibidas com timestamp relativo (`timeAgo()`: "agora / Xmin / Xh / Xd")
- Totalmente i18n via `t(lang, key)` — responde ao idioma global selecionado

**`app/api/suggestions/route.ts`** (server route)
- `GET ?fighterId&section` → últimas 50 sugestões ordenadas por `createdAt DESC`
- `POST` → valida campos, verifica fighter existe, insere `FighterSuggestion`
- Validações: campos obrigatórios, nome ≤ 80 chars, mensagem ≤ 1000 chars

### 20.3 Integração no FighterDataZone

- `FighterDataZoneProps` inclui `fighterId: string`
- `SuggestionPanel` renderizado UMA vez, após a `<section>` da Linha do Tempo, fora do `erasToShow.map(...)`
- `section="general"` — todas as sugestões do personagem ficam em uma só lista
- Prop `lang={lang}` repassada para que os labels mudem com o idioma global

### 20.4 Sugestões Visíveis Publicamente

As sugestões são públicas — todos os visitantes podem ver o que os outros deixaram.
Sem moderação por enquanto (pode adicionar campo `approved: Boolean` futuramente).

---

## 21. Player de Música por Lutador (implementado — sessão 12)

### 21.1 Arquitetura (implementada)

**Granularidade:** 1 música por lutador (global para o vault inteiro).

**Componente:** `components/ui/MusicPlayer.tsx`
- Props: `youtubeId: string`, `title: string`, `artist?: string`
- Carrega YouTube IFrame API dinamicamente via `<script>` tag
- Controla o player via `window.YT.Player` (API oficial)
- Hidden iframe (1×1px, `opacity: 0`) — apenas áudio

**Posição:** entre o label do asset ativo e o carrossel de thumbnails, dentro do `MediaVaultViewer`.

**Estilo HUD:**
- Fundo: `rgba(10,8,32,0.95)` → `rgba(5,5,20,0.98)` (gradiente)
- Border-top: `1px solid rgba(64,180,255,0.07)` (idêntico ao carousel)
- Botão play: borda `amber-400/40`, clipPath hexagonal, hover `amber-400/10`
- Progress bar: fill `amber-400/80` sobre `rgba(255,255,255,0.06)`
- Thumb: diamante amber-400 (visible on hover)
- Timestamps: `font-mono text-[9px] tabular-nums`
- Track title: `font-mono text-[11px] text-slate-200`

**Mapa de músicas em `page.tsx`:**
```ts
const FIGHTER_MUSIC: Record<string, MusicTrack> = {
  "Ness": { youtubeId: "OsQEEHUuLGg", title: "Bein' Friends", artist: "Shogo Sakai · EarthBound (SNES, 1994)" },
  // Para adicionar outro lutador: "Marth": { youtubeId: "...", title: "...", artist: "..." },
};
```

**Para adicionar música de outro lutador:** apenas adicionar entrada em `FIGHTER_MUSIC[fighterName]` em `page.tsx`.

### 21.2 Ness — Trilha sonora

| ID YouTube | Título | Artista | Duração |
|---|---|---|---|
| `OsQEEHUuLGg` | Bein' Friends | Shogo Sakai | 3:50 |

## 22. Refinamentos da Sessão 13 (2026-06-05)

### 22.1 Music Player (Volume e Estética)
- Adicionado controle deslizante de volume no `MusicPlayer.tsx`.
- **Volume Inicial Padrão:** Setado para **10%** via API do YouTube (`e.target.setVolume(10)`) para evitar sustos de áudio.
- Largura da barra de volume aumentada (`w-24` ou 96px) para melhorar a usabilidade e precisão do mouse.
- Tamanho das fontes da trilha sonora aumentado: Título da música (`text-[13px]`) e Artista (`text-[11px]`).
- A string da música do Ness no `FIGHTER_MUSIC` foi alterada de *"EarthBound (SNES, 1994)"* para **"Shogo Sakai · Melee Remix"**.

### 22.2 Acervo: Spirit Image do Ness Resolvido
- A URL antiga usada para tentar extrair a arte do Spirit (`Ness_Spirit.png`) retornava um redirecionamento HTML 302 da wiki.
- Isso causou um erro silencioso onde o `spirit.png` local era um arquivo HTML, resultando em 404 no `next/image`.
- O problema foi resolvido usando a URL direta da CDN para Spirits do Ultimate: `https://ssb.wiki.gallery/images/7/71/SSBU_spirit_Ness.png`.
- O arquivo foi baixado validamente como PNG (`89504e47`) para `public/assets/media/ness/spirit.png` e a propriedade `assetRenderUrl` do `SPIRIT-SSBU-Ness-563` no Prisma foi atualizada. O Spirit agora é perfeitamente exibido no Media Vault.

### 22.3 Cuidado com o Cache `.next`
- **Alerta de Ambiente Local:** Nunca deletar a pasta `.next` forçadamente via terminal sem antes encerrar o servidor local (`npm run dev`). Fazer isso enquanto o server roda causa corrupção nas manifest lists (`server-reference-manifest.json`), gerando falhas catastróficas 404/500 silenciosas. Em caso de quebra, o usuário deve dar `Ctrl+C` no processo e reiniciá-lo.

## 23. Extração Global e Padronização Padrão Ness (2026-06-05 - Madrugada)

### 23.1 Sucesso na Raspagem de Textos (Opção 1)
- O script `fighters.ts` foi executado em massa para todos os 89 lutadores.
- Extraídas as franquias de origem, aparições em jogos (Debut), e as Biografias originais em Inglês (SmashWiki) e Japonês (smashwiki.info).
- Todos os 89 lutadores agora constam corretamente na tabela `Fighter`, `FighterBio` e `FighterWork`.

### 23.2 Bloqueios nas Raspagens de Mídia e Música (Opção 2)
- Durante a execução da Opção 2, descobrimos que os scrapers `music.ts` e `collectibles.ts` retornam erro HTTP 404.
- Motivo: A SmashWiki reestruturou suas listas. A página única "List of trophies (SSBM)" não existe mais, tendo sido dividida por franquias (ex: "List of SSBM trophies (EarthBound series)"). O mesmo ocorreu com as músicas.
- **Ação Pendente:** Refatorar os scrapers de música e colecionáveis para iterar sobre as novas rotas de franquias da wiki.

### 23.3 Novo Pipeline de Tradução Massiva (Pendente de API)
- Criado o script `generate-curator.ts` para redigir "Curator Notes" personalizadas via API (Claude Haiku) para todo o elenco.
- **Status:** Aguardando execução. O script foi escrito, porém a execução falhou pois a variável de ambiente `ANTHROPIC_API_KEY` não estava carregada na sessão do terminal que executou o script. 
- Assim que o usuário puder rodar este script (ou injetar a chave), os 88 lutadores restantes ganharão textos idênticos ao padrão curatorial do Ness.

---

## 24. Design: Páginas "Coleções" e "Chronicles" (sessão 14 — 2026-06-06)

### 24.1 Conceito

Duas novas rotas complementares ao museu:

| Rota | Conceito | Inspiração visual |
|---|---|---|
| `/colecoes` | Grid de cards de artefatos (troféus, spirits, sprites) com imagem em destaque, organizados por jogo Smash | Grid de personagens do SSB Spirit Board (veja screenshot de referência) |
| `/chronicles` | Lista cronológica de artefatos com data, tipo e nome — estilo "registro de acervo de museu" | Nintendo Chronicle do Brawl (lista com data + título, separada por console) |

### 24.2 Coleções (`/colecoes`)

**Layout:** Grid de cards (8 colunas desktop, responsivo), com fundo escuro (`slate-950`).

**Estrutura de seções — uma por jogo:**
```
── SSB64 (Nintendo 64 · 1999) ──────────────────────
  [card] [card] [card] [card] ...

── Melee (GameCube · 2002) ──────────────────────────
  [card] [card] [card] ...

── Brawl (Wii · 2008) ───────────────────────────────
  ...
── Smash 4 (3DS/Wii U · 2014) ───────────────────────
  ...
── Ultimate (Switch · 2018) ─────────────────────────
  ...
```

**Card:**
- Imagem do artefato (`assetRenderUrl`) preenchendo o card com `object-cover`
- Nome embaixo (fonte mono, branco/slate, pequeno) — igual ao estilo do Spirit Board
- Ao clicar → abre página do lutador dono do artefato (`/fighters/[slug]`)
- Cards sem imagem exibem placeholder com ícone de museu

**Dados:** `Collectible` filtrado por `smashGameVersion` (SSB64, SSBM, SSBB, SSB4, SSBU).
Tipos incluídos: TROPHY, SPIRIT, SPRITE. Excluir: renders de lutador (eles já estão no `/fighters/[slug]`).

### 24.3 Chronicles (`/chronicles`)

**Layout:** Lista vertical de linhas, separada por jogo (seções com header).

**Inspiração:** Nintendo Chronicle do Brawl — lista com colunas `DATA · TIPO · NOME`.
**Estilo:** Adaptado ao dark theme do site (fundo `slate-950`, texto `slate-200`, acentos `cyan-400/amber-400`).

**Estrutura de linha:**
```
  1999.01   TROPHY    Mario Bros.                        →
  1999.01   TROPHY    Super Mario Bros.                  →
  1999.01   SPRITE    Mario (SNES, 1990)                 →
```

**Colunas:**
| Coluna | Conteúdo |
|---|---|
| Data | `smashGameVersion` + número do roster do dono |
| Tipo | Badge com cor por tipo: TROPHY = amber, SPIRIT = cyan, SPRITE = slate |
| Nome | `name` do artefato |
| Seta → | Link para `/fighters/[slug]` do dono |

**Seções:**
- Header de seção com logotipo do jogo (usar `boxArtPath` do `GAME_META`) + nome completo + ano
- Alternância de cor nas linhas (zebra sutil: `odd:bg-slate-900/40 even:bg-transparent`)
- Scroll infinito ou paginação por jogo

### 24.4 Prioridade de Implementação
1. Primeiro: `/chronicles` (mais simples, só lista — dados já existem no banco)
2. Depois: `/colecoes` (requer imagens — só Ness tem imagens no banco agora)

### 24.5 Sessão 14 — Refinamentos
- `LangSelector` atualizado: bandeiras emoji substituem labels de texto
  - EN → 🇬🇧, PT-BR → 🇧🇷, JP → 🇯🇵, JP→EN → 🇯🇵→🇺🇸
  - Botões: `text-[18px]`, `opacity-40` quando inativo, `title` tooltip com nome por extenso
- `generate-curator.ts`: agora gera EN + PT + JP (学芸員コメント) em uma só chamada
  - Modelo atualizado: `claude-haiku-4-5` (substituiu `claude-3-5-haiku-20241022` aposentado)
  - Where: `OR [curatorOverviewEn: null, curatorOverviewJp: null]`
- Deploy concluído: **smashcompedium.vercel.app** (alias Vercel)
- 404 customizada: `app/not-found.tsx` → "PAGE IN CONSTRUCTION"

---

## 25. Design: Área de Comentários por Personagem (sessão 14 — 2026-06-06)

### 25.1 Conceito

Seção na página `/fighters/[slug]` onde visitantes podem deixar comentários sobre o lutador — memórias, opiniões, curiosidades. Tom de "livro de visitas de museu".

### 25.2 Schema (a adicionar ao Prisma)

```prisma
model FighterComment {
  id         String   @id @default(cuid())
  fighterId  String
  fighter    Fighter  @relation(fields: [fighterId], references: [id])
  author     String   // nome do visitante (obrigatório, max 40 chars)
  body       String   @db.Text  // conteúdo do comentário (max 500 chars)
  approved   Boolean  @default(false)  // moderação manual
  createdAt  DateTime @default(now())
}
```

### 25.3 API

- `GET  /api/comments?fighterId=<id>` — lista comentários `approved: true`
- `POST /api/comments` — cria comentário com `approved: false`

### 25.4 UI

**Localização:** Abaixo das sugestões (`SuggestionPanel`) no painel direito, fora das eras.

**Visual:** Estilo "livro de assinaturas de museu":
- Fundo `slate-900/40`, borda `cyan-500/10`
- Cada comentário: nome do autor em `amber-400` + data + corpo em `slate-300`
- Formulário simples: campo `Nome` + campo `Comentário` + botão "Assinar"
- Confirmação: "Seu comentário aguarda aprovação."
- Paginação: mostrar os 5 mais recentes, botão "ver mais"

---

## 26. Sessão 15 — i18n Completo + Sugestões por Personagem (2026-06-06)

### 26.1 Sistema de i18n (lib/ui-i18n.ts)

Criado `lib/ui-i18n.ts` com tradução de ~35 strings de UI para 4 idiomas:
- `EN` — inglês
- `PT` — português do Brasil
- `JP` — japonês
- `JP_EN` — japonês → inglês (modo leitura dupla)

Helper: `t(lang: UILang, key: UIKey): string`

### 26.2 FighterPageLayout (novo componente)

`components/ui/FighterPageLayout.tsx` — client wrapper que **detém** o estado `lang` e passa para os dois painéis:
- `MediaVaultViewer` (esquerda) recebe `lang`
- `FighterRightPanel` (direita) recebe `lang` + `setLang`

Isso resolve o problema de `MediaVaultViewer` e `FighterRightPanel` serem siblings num Server Component — a solução é encapsulá-los num Client Component pai.

### 26.3 Componentes i18n-izados

| Componente | Labels traduzidos |
|---|---|
| `FighterDataZone` | globalLanguage, profile, timeline, eras, trophies, stickers, spirits, bios, works, curatorOverview, curatorLiteral, noEras |
| `MediaVaultViewer` | collection, artifacts, noImage, noArtifacts |
| `OriginGamesPanel` | originGames, artComingSoon |
| `SuggestionPanel` | suggestions, loading, noSuggestions, namePlaceholder, suggestionPlaceholder, sending, sent, send, errorSend, errorConnection |
| `FighterRightPanel` | alsoIn, fanMade |

### 26.4 Bandeiras Reais (flagcdn.com)

Substituídos emoji de bandeira (que no Windows renderizam como texto "GB/BR/JP") por `<img>` do `flagcdn.com`:
```tsx
<img src={`https://flagcdn.com/w40/${code}.png`} alt={code.toUpperCase()} />
```
Códigos: `gb` (EN), `br` (PT), `jp` (JP), `jp`+`us` (JP_EN).

### 26.5 Sugestões — Refactor

- **Antes:** `SuggestionPanel` por era, acordeão fechado por padrão, `section=gameVer`
- **Agora:** Único painel por personagem, sempre aberto, `section="general"`, após toda a Linha do Tempo
- Prop `label` removida. Props atuais: `fighterId`, `section`, `lang`

### 25.5 Moderação

- Campo `approved: Boolean @default(false)` — comentários ficam ocultos até aprovação manual
- Aprovação via Prisma Studio ou futura página de admin
- Futuramente: campo `approved` pode virar `status: PENDING | APPROVED | REJECTED`

---

## 27. Sessão 18 — Sistema de Música + Tips + Spirits + Fix CF (2026-06-06)

### 27.1 Dados corrigidos — Captain Falcon (e outros)

**Scripts executados:**
- `scripts/scrapers/fix-cf-db.ts` → desassociou "Captain Olimar" e "Falcon Flyer" (trophies Melee) do fighterId do Captain Falcon; desassociou "Falco Lombardi" (spirit) do Captain Falcon.

### 27.2 SSBU Tips — 1.513 tips scrapeados

**Script:** `scripts/scrapers/scrape-ssbu-tips.ts`
**Fonte:** `https://www.ssbwiki.com/List_of_tips_(SSBU)/Fighters`
**Resultado:** 1.513 tips distribuídos entre ~87 fighters.
**Formato no banco:** `FighterTip.titleEn = "[★★☆] Título"`, `textEn = "Descrição"`
**NAME_MAP:** inclui `"PAC-MAN": "Pac-Man"` para normalizar o nome na wiki.
**MULTI_MAP:** `"Pyra/Mythra": ["Pyra", "Mythra"]` (2 fighters separados no banco).

### 27.3 Spirit Descriptions — 54/87 salvos

**Script:** `scripts/scrapers/scrape-spirits.ts`
**Fonte:** `https://www.ssbuspirits.com/spirits/{slug}`
**Resultado:** 54 spirits com `descriptionEn` preenchida.
**Falhas (33):** Personagens 3rd-party (Snake, Sonic, Bayonetta, Cloud, etc.) que não têm página própria no ssbuspirits.com.
**ID de collectible:** `SPIRIT-SSBU-{name}-{spiritNum}` (ex: `SPIRIT-SSBU-Ness-563`)

### 27.4 F-Zero Origin Games

**Adicionados em `app/fighters/[slug]/page.tsx` na constante `FRANCHISE_ORIGIN_GAMES["F-Zero"]`:**
- F-Zero (SNES, 1990/JP — 1991/NA)
- F-Zero X (N64, 1998)
- F-Zero GX (GCN, 2003)
- F-Zero GP Legend / ファルコン伝説 (GBA, 2003/JP — 2004/NA)
- F-Zero Climax / クライマックス (GBA, 2004, JP exclusive)

### 27.5 Sistema de Música por Personagem (NOVO)

#### Schema (adicionado via `ALTER TABLE`)
```sql
ALTER TABLE "Fighter"
ADD COLUMN IF NOT EXISTS "musicYoutubeId" TEXT,
ADD COLUMN IF NOT EXISTS "musicTitle"     TEXT,
ADD COLUMN IF NOT EXISTS "musicArtist"    TEXT,
ADD COLUMN IF NOT EXISTS "musicStatus"    TEXT DEFAULT 'pending_review';
```

#### Scripts
- `scripts/scrapers/migrate-music.ts` — aplica a migração SQL raw
- `scripts/scrapers/scrape-fighter-music.ts` — popula os 87 fighters com trilhas icônicas curadas

**Resultado:** 87/87 fighters com `musicYoutubeId` populado (todos `musicStatus = "pending_review"`).

#### Admin Page: `/admin/music`
- Lista todos os 87 fighters com indicador de status (verde=aprovado, amarelo=pendente)
- Embeds YouTube player para ouvir antes de aprovar
- Editar ID/título/artista inline
- Tecla **A** = aprovar e avançar, **←→** = navegar
- Filtros: All / Pending / Approved
- API: `GET /api/admin/music` + `PATCH /api/admin/music/[id]`

#### page.tsx atualizado
```tsx
// Antes: hardcoded FIGHTER_MUSIC
// Depois: lê do banco, com fallback para o map hardcoded
music={
  fighter.musicYoutubeId
    ? { youtubeId: fighter.musicYoutubeId, musicTitle: fighter.musicTitle, musicArtist: fighter.musicArtist }
    : FIGHTER_MUSIC_FALLBACK[fighter.name]
}
```

#### Mapa curado (principais tracks por personagem — seleção editorial)
| Personagem | Faixa |
|---|---|
| Ness | Bein' Friends (Shogo Sakai · Melee Remix) |
| Captain Falcon | Mute City (Melee) |
| Link | The Legend of Zelda Main Theme |
| Mario | Ground Theme (Super Mario Bros.) |
| Sonic | Green Hill Zone |
| Cloud | Main Theme (Final Fantasy VII) |
| Sephiroth | One-Winged Angel |
| Joker | Last Surprise |
| Steve | Minecraft (Sweden / C418) |
| Sora | Dearly Beloved (Kingdom Hearts) |
| ... | (todos 87 populados) |

### 27.6 Build Fixes

Erros TypeScript corrigidos em vários scripts scrapers (padrão `noUncheckedIndexedAccess`):
- `chronicles/page.tsx` — `CONSOLE_ICONS[activeConsole as string]`, `game.titleNtsc`
- `collectibles/page.tsx` — `ERAS[0]!.id`
- `scripts/scrapers/chronicle.ts` — `(prev[0] as any).name`
- `scripts/scrapers/collectibles.ts` — `numMatch[1]!`
- `scripts/scrapers/download-all-media.ts` — null check + `match[1]!`
- `scripts/scrapers/fetch-chronicles-boxarts.ts` — null check
- `scripts/scrapers/scrape-fighter-music.ts` — regex `/s` flag → indexOf approach
- `scripts/scrapers/scrape-spirits.ts` — `txt[0]` null check
- `scripts/scrapers/scrape-ssbu-tips.ts` — `starsMatch[1] ?? ""`

### 27.7 .gitignore Atualizado
```
public/assets/collectibles/   # 1380+ PNGs de spirits baixados localmente — não commitar
```

### 27.8 Próximos Passos Imediatos

1. **Revisar músicas** em `http://localhost:3000/admin/music` — aprovar ou corrigir os 87 YouTube IDs
2. **Fix Media Vault fotos (CF-4)** — order e fotos que não aparecem para personagens além do Ness
3. **Completar spirits** — os 33 que falharam no ssbuspirits.com precisam de fonte alternativa
4. **Pyra/Mythra tips** — fix do slash encoding no wiki para salvar tips de Pyra e Mythra separadamente

---

## 28. Sessão 19 — Box Arts para Origin Games + Chronicles (2026-06-06)

### 28.1 Box Arts dos Origin Games

**Problema:** `FRANCHISE_ORIGIN_GAMES` em `app/fighters/[slug]/page.tsx` não tinha `boxArtPath` para nenhum jogo além de EarthBound e MOTHER3.

**Solução:** Scripts de scraping via Wikipedia + Wikimedia Commons.

**Scripts criados:**
- `scripts/scrapers/fetch-all-boxarts.ts` — scraper principal (origens + chronicles)
- `scripts/scrapers/fix-failed-boxarts.ts` — fallback via Wikipedia REST API
- `scripts/scrapers/fix-failed-boxarts2.ts` — fallback via HTML scraping agressivo
- `scripts/scrapers/fix-failed-boxarts3.ts` — fallback via MediaWiki prop=images API
- `scripts/scrapers/fetch-chronicles-boxarts-v2.ts` — scraper Chronicles v2 (URL bug corrigido)

**Resultado: 36/37 origin games com box art baixada em `public/assets/games/`**

| Arquivo | Jogo |
|---|---|
| `DONKEY_KONG_ARC_BOX.jpg` | Donkey Kong (1981, flyer) |
| `SUPER_MARIO_BROS_NES_BOX.png` | Super Mario Bros. |
| `DKC_SNES_BOX.png` | Donkey Kong Country |
| `ZELDA_NES_BOX.png` | The Legend of Zelda |
| `METROID_NES_BOX.jpg` | Metroid |
| `KIRBY_DREAMLAND_GB_BOX.png` | Kirby's Dream Land |
| `STARFOX_SNES_BOX.jpg` | Star Fox |
| `POKEMON_RED_BLUE_GB_BOX.webp` | Pokémon Red / Blue + Pocket Monsters R/G |
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
| `EARTHBOUND_USA_BOX.jpg` | EarthBound (pré-existente) |
| `MOTHER3_JP_BOX.jpg` | MOTHER3 (pré-existente) |
| — | Ball (G&W) — sem imagem no Wikipedia |

**`page.tsx` atualizado:** todas as entradas de `FRANCHISE_ORIGIN_GAMES` agora têm:
- `boxArtPath: "/assets/games/{FILENAME}"` para todos os jogos encontrados
- `wikiUrl` adicionado onde não existia

### 28.2 Bug Corrigido — Chronicles Box Art

**Bug original:** `fetch-chronicles-boxarts.ts` construía URL como `https://www.ssbwiki.com${wikiUrl}`, mas os wikiUrls no banco já são URLs completas (ex: `https://en.wikipedia.org/wiki/...`, `https://www.mariowiki.com/...`).

**Fix:** `fetch-chronicles-boxarts-v2.ts` usa `entry.wikiUrl` diretamente quando começa com `http`.

**CDNs suportadas:** `upload.wikimedia.org` (Wikipedia) e `mario.wiki.gallery` (MarioWiki).

**Resultado da primeira rodada (pass 1):** 227 salvos / 124 falhas de 351 entradas processadas.

**Fix-false-positives:** `scripts/scrapers/fix-chronicles-false-positives.ts` limpou 7 falsos positivos:
- `poweredby_mediawiki_88x31.png` (GAME & WATCH — Parachute, NES — Wario's Woods)
- `cc-by-sa.png` (GAME & WATCH — Donkey Kong Junior ×2)
- `Supermarioland2logo.jpg` (GAME BOY — Super Mario Land 2)
- `Big_Brain_Academy_Logo.png` (Nintendo DS)
- `Pictochat_logo.png` (Nintendo DS — PictoChat)

**Resultado final (sessão 19):**
- Box arts válidas: **258** de 351 entradas com wikiUrl (~73%)
- Ainda sem box art: **131** entradas (maioria Pokémon/Zelda/Kirby/Metroid — lazy loading no Wikipedia)
- Pass 2 pendente: rodar `fetch-chronicles-boxarts-v2.ts` novamente para as 131 restantes

**`next.config.mjs` atualizado:** adicionado `mario.wiki.gallery` em `remotePatterns` para suportar imagens MarioWiki via `next/image`.

### 28.3 Diagnóstico de Cobertura
- **Total ChronicleEntry:** 947
- **Com boxArt (pré-sessão 19):** 26
- **Com boxArt (pós-sessão 19):** 258
- **Sem boxArt + com wikiUrl:** 131 (pass 2 pendente)
- **Sem boxArt + sem wikiUrl:** ~558 (necessitam wikiUrl manual ou outra fonte)

### 28.4 Nota sobre .gitignore
- `public/assets/games/` NÃO está no `.gitignore` — as 36 capas SERÃO commitadas
- `public/assets/fighters/` e `public/assets/collectibles/` continuam ignorados
