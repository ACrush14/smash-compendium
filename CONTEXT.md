# SmashCompendium — Contexto do Projeto

> Documento vivo. Fonte única de verdade para todos os assistentes (Claude Code, Antigravity/Gemini).
> Atualizado em: 2026-06-05 (sessão 6 — UI de idioma, capa JP Mother 2, Debut no EraHeader)

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
id                 String   — CUID
rosterNumber       String   — número no roster (ex: "01", "14")
name               String   — único (ex: "Ness")
franchiseId        String
imageUrl           String?  — render principal (URL externa ssbwiki)
selectAnimationUrl String?  — GIF de seleção
curatorOverviewEn  String?  — nota curatorial em inglês (fan-made)
curatorOverviewPt  String?  — nota curatorial em português
curatorOverviewJp  String?  — nota curatorial em japonês
```

### `FighterBio`
Texto biográfico in-game por versão do Smash.
```
id                  String  — CUID
fighterId           String
smashGameVersion    String  — "SSB64" | "MELEE" | "BRAWL" | "SSB4" | "SSBU"
contentEn           String  — texto oficial em inglês (obrigatório)
contentPt           String? — tradução PT-BR (curadoria)
contentJp           String? — texto original japonês
contentJpEn         String? — tradução EN do texto JP
@@unique([fighterId, smashGameVersion])
```

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
@@index([type, smashGameVersion])
```

**Convenções de tipo especial:**
- `type = "SPRITE"` + `smashGameVersion = "ORIGIN"` → sprite do jogo de origem (ex: NessSprite.gif)
- `type = "SPIRIT"` + `smashGameVersion = "SSBU"` → spirit do Ultimate

### `Stage` / `Music` / `StageMusic`
Fases e músicas — modelos existem no schema, ingestão ainda pendente.

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
│
├── components/
│   ├── fighter/
│   │   ├── BioTranslator.tsx   # Tabs EN/JP/PT-BR por era
│   │   ├── FighterDataZone.tsx # Zona direita — header + ficha + timeline
│   │   ├── MediaVaultViewer.tsx# Zona esquerda — render + carrossel
│   │   ├── OriginGamesPanel.tsx# Painel de jogos de origem do personagem
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
| `ssbwiki.com` | Fonte principal — textos, imagens, troféus, stickers, bios |
| `ssb.wiki.gallery` | CDN de imagens do SSBWiki |
| `ssbuspirits.com` | Spirits do SSBU (pendente implementação) |
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
- 3 troféus Melee com imagens ✓
- 1 troféu Brawl com imagem ✓
- 10 troféus SSB4 com imagens (3DS, Wii U, variantes regionais NA/EU) ✓
- 1 sticker Brawl (sem imagem — bug pendente) ✗
- Render SSBU ✓
- Sprite EarthBound (NessSprite.gif, type=SPRITE) ✓

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

| # | Tarefa | Prioridade |
|---|---|---|
| 1 | **ETL Ultimate:** Rate Limit fix + Spirits (ssbuspirits.com) + Fighter Tips (JSON) | Alta |
| 2 | Adicionar modelo `FighterTip` ao schema + `npx prisma db push` | Alta |
| 3 | Box arts dos jogos de origem dos outros franchises (Mario, Zelda, Pokémon...) | Média |
| 4 | Sticker Brawl do Ness — bug de imagem no scraper | Média |
| 5 | Spirit SSBU do Ness — seção "Spirit" não encontrada na página, verificar URL | Média |
| 6 | Bio JP — campos null para todos os fighters | Média |
| 7 | ETL em massa para os outros 86 fighters | Baixa |
| 8 | Página `/fighters` (lista geral com filtros) | Baixa |
| 9 | Stages + Music + StageMusic — ETL escrito, não rodado | Baixa |
| 10 | Nota curatorial — substituir Lorem Ipsum por texto fan-made | Baixa |

**Resolvidos nesta sessão (sessão 4):**
- ✅ Layout visual completo da página do lutador (ver seção 15)
- ✅ Box arts dos 5 jogos Smash na Linha do Tempo
- ✅ Box arts reais de EarthBound e Mother 3 do Wikipedia
- ✅ Header sticky compacto (96px), body com showcase
- ✅ Tipografia mínima 12px em toda EraHeader

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
| PT-BR degradação graceful | `FighterDataZone.tsx` | ✅ tab mostra ✕ quando API key ausente |
| Ícones de console | `public/assets/consoles/` | ✅ 25 arquivos (SVG+PNG), mapeados em `smash-meta.ts` |
| Box arts dos jogos Smash | `public/assets/games/` | ✅ 15 imagens (USA+JP para 5 jogos + EarthBound + Mother 3 + Mother 2 JP) |

### O que fazer na próxima sessão (ordem sugerida)

1. **ETL: Spirits** → criar scraper para `ssbuspirits.com/spirits/ness`
2. **Fix: sticker Brawl do Ness** sem imagem
3. **Box arts de outros franchises** → Mario, Zelda, Kirby, etc. para o OriginGamesPanel

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
