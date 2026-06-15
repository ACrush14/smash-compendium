# SmashCompendium

Museu digital fan-made/acadêmico da franquia **Super Smash Bros.** — preserva troféus, spirits, stickers, músicas e biografias multilíngues de cada lutador desde SSB64 até SSBU.

**Feito por [Anderson Crush](https://andersoncrushdev.vercel.app)**

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14.2 (App Router + Server Components) |
| Linguagem | TypeScript 5.4 |
| Estilo | Tailwind CSS 3.4 (tema dark customizado) |
| Banco de Dados | PostgreSQL via Supabase (sa-east-1) |
| ORM | Prisma 5.22 |
| Scripts | `npx tsx --env-file=.env.local` (NUNCA ts-node) |
| IA/Tradução | Google Gemini API (`gemini-2.5-flash-lite`, free tier) |
| Scraping | Cheerio + fetch nativo |
| Deploy | Vercel |

---

## Regras absolutas

- ⛔ NUNCA `curationStatus="approved"` via script — aprovação exclusivamente manual no painel admin
- ⛔ NUNCA `ts-node` — sempre `npx tsx --env-file=.env.local`
- ⛔ NUNCA `prisma migrate dev` — usar `$executeRawUnsafe`
- ⚠️ Rate limit de 1.6s entre requests de scraping
- ⚠️ `prisma generate`: parar o dev server PRIMEIRO (Windows DLL lock)

---

## Histórico de Demandas

Todas as demandas realizadas e pendentes, em ordem cronológica.

---

### ✅ [DONE] Estrutura inicial do projeto

- Next.js 14 App Router com Tailwind CSS e tema dark customizado
- Schema Prisma: `Franchise`, `Fighter`, `Collectible`, `ChronicleEntry`, `Music`
- Layout em grid 5/7 colunas (MediaVault | FighterRightPanel)
- Middleware de proteção `/admin` por cookie `smash_admin`

---

### ✅ [DONE] Seed de Colecionáveis

- `TROPHY` ≈ 1045 troféus (SSB64, Melee, Brawl, SSB4, SSBU)
- `SPIRIT` = 1582 spirits (SSBU)
- `STICKER` ≈ 707 stickers (Brawl)
- Scraping via SSBWiki + smashwiki.info + ssbuspirits.com
- Página `/collectibles?type=TROPHY|SPIRIT|STICKER`
- SpiritViewer: navegação spirit a spirit com arte, música e metadata

---

### ✅ [DONE] Chronicles — Catálogo de Jogos Nintendo

- `ChronicleEntry`: ~1270 jogos Nintendo com capa, console, datas, wiki
- Página `/chronicles` com busca por nome e filtros
- `CollectibleChronicleLink`: 2184 links troféu ↔ jogo (fonte única de verdade)
- Scrapers: Wikipedia infobox, Libretro Thumbnails para box arts

---

### ✅ [DONE] Música — 1076 faixas SSBU

- Tabela `Music` com youtubeId, título, artista, jogo de origem
- Player de música por lutador (integrado ao MediaVault)
- `CollectiblesMusicBar`: barra de música global na galeria de colecionáveis
- Painel admin `/admin/music-tracks` para revisar e editar faixas

---

### ✅ [DONE] Páginas individuais de lutadores `/fighters/[slug]`

- Header sticky com rosterNumber, nome, franchise, badges por jogo
- MediaVault (galeria, música) | FighterRightPanel (bios, origin games, moves, collectibles)
- `OriginGamesPanel`: jogos de origem com box art
- `FighterDataZone`: perfil, timeline (bios por era), troféus, spirits, stickers, moves
- Seletor de idioma global: EN / PT-BR / JP / JP→EN
- Seção de sugestões da comunidade
- `AssociatedCards`: personagens relacionados (alter-egos, transformações)

---

### ✅ [DONE] Bio Scraper — todos os 90 lutadores

- Scrapa EN (SSBWiki, formato DL) + JP (smashwiki.info, badges [64]/[DX]/[X]/[3U]/[SP])
- `FighterBio` com `contentEn` + `contentPt` + `contentJp` + `contentJpEn` por era
- SSB64: apenas via JP (sem troféus EN históricos nessa era)
- DLC SSBU (Pass 2): sem bios disponíveis (sem troféus históricos)
- Script: `scripts/scrapers/enrich-all-fighter-bios.ts`

---

### ✅ [DONE] Moves Scraper — todos os 90 lutadores

- Scrapa movimentos JP por era do smashwiki.info: (SMASH), (EX), ファイナル
- `FighterMove` com `descEn` + `descPt` + `descJp` + `descJpEn`
- UI em `FighterDataZone` (seção TIMELINE, por era)
- Script: `scripts/scrapers/enrich-all-fighter-moves.ts`

---

### ✅ [DONE] Works Populator — FighterChronicleLink

- Todos os 90 lutadores com jogos de origem vinculados
- `FighterChronicleLink` aponta direto para `ChronicleEntry` (fonte única de verdade)
- Script: `scripts/admin/populate-all-fighter-works.ts`

---

### ✅ [DONE] Pokémon Trainer Team — Squirtle, Ivysaur, Charizard

- Adicionados como `#33a`, `#33b`, `#33c` (rosterNumber string, ordena entre #33 e #34)
- Mesma franchise do Pokémon Trainer
- Bios EN+JP scraped (Squirtle: SSBM+SSBB+SSB4; Ivysaur: SSBB+SSB4; Charizard: SSBM+SSBB+SSB4)
- Charizard: 1 move SSB4 EX (かえんほうしゃ)
- 30 FighterChronicleLinks criados
- Páginas `/fighters/Squirtle`, `/fighters/Ivysaur`, `/fighters/Charizard` automáticas

---

### ✅ [DONE] FighterWork → FighterChronicleLink (refactor de arquitetura)

- Migração da tabela `FighterWork` para `FighterChronicleLink`
- Eliminou a dependência da tabela `Game` (legada)
- `AssociatedCards` e `OriginGamesPanel` leem de `FighterChronicleLink → ChronicleEntry`

---

### ✅ [DONE] Tradução automática via Gemini API

- Script: `scripts/admin/translate-all-fighter-content.ts`
- Modelo: `gemini-2.5-flash-lite` (free tier, `@google/genai@2.8.0`)
- Traduz `contentEn → contentPt` e `contentJp → contentJpEn` (FighterBio)
- Traduz `descEn/descJp → descPt/descJpEn` (FighterMove)
- Prompts curados: "Sound as if it was originally written in pt-BR, NOT like a translation"
- Rate limit: 4.1s entre chamadas; retry automático com parse de `retryDelay`
- Flags: `--dry-run`, `--only-bios`, `--only-moves`, `--fighter <Nome>`

---

### ✅ [DONE] Navegação prev/next entre lutadores

- Setas `ChevronLeft` / `ChevronRight` flanqueando o nome do lutador no header
- Ordena rosterNumbers com suporte a strings ("33a", "33b", "33c")
- Primeiro lutador: sem seta esquerda; último: sem seta direita
- Componentes: `page.tsx`, `FighterPageLayout.tsx`, `FighterRightPanel.tsx`

---

### ✅ [DONE] Footer "Made by Anderson Crush"

- Rodapé em todas as páginas linkando para [andersoncrushdev.vercel.app](https://andersoncrushdev.vercel.app)
- Estilo sutil: font-mono, uppercase, tracking-widest, cyan-900/60

---

### ⏳ [IN PROGRESS] Music URLs — substituição de URLs mortas

- 536 de 1076 faixas ainda sem youtubeId embeddável
- Script: `npx tsx --env-file=.env.local scripts/admin/replace-dead-music-urls.ts`
- Quota YouTube Data API: ~95 buscas/dia (~6 runs restantes)
- Rodar 1× por dia até zerar

---

### ⏳ [IN PROGRESS] Tradução — executar para todos os lutadores

- Script pronto e testado com Samus (3 bios + 3 moves ✅)
- ~226 bios + ~100 moves pendentes
- Rodar: `npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts`

---

### 🔴 [PENDING] Curadoria forte de dados dos lutadores

- Muitos dados estão incorretos ou incompletos (bios, works, moves, imagens)
- O usuário (Anderson Crush) fará curadoria manual extensiva
- Partes serão automatizadas conforme forem identificadas
- Esta demanda tem prioridade antes de expandir funcionalidades

---

### 🔴 [PENDING] Corrigir Chronicles (jogos, consoles, datas)

- `consoleName` errados (ex.: jogo como "Wii" quando deveria ser "Nintendo 3DS")
- Datas faltando/erradas em `releaseDateNtsc`/`releaseDatePal`/`releaseDateJp`
- Entradas faltando (versões arcade, edições regionais)
- Títulos JP/JpEn ausentes em muitas entradas
- Box art / wiki quebrados
- 22 ChronicleEntry com `consoleName="Unknown"` (criadas automaticamente pelo works populator)

---

### 🔴 [PENDING] Reclassificar troféus com sourceGame="SMASH"

- Apenas Melee #002–078 são move trophies legítimos (sentinela de movimentos de lutador)
- ~130+ troféus Melee, 8 Brawl e 22 SSB4 com `sourceGame="SMASH"` precisam ser reclassificados para o jogo correto (SSB N64 ou SSB Melee GCN) e vinculados via `CollectibleChronicleLink`

---

### 🔴 [PENDING] Mario — completar curadoria

- GIFs de movimentos
- Galeria de artes (curada)
- `curatorOverview` (texto de apresentação do curador)

---

### 🔴 [PENDING] Popular CollectibleRelation

- Tabela `CollectibleRelation` vazia
- Linkar troféus cross-game (ex.: troféu equivalente entre Melee ↔ SSB4)

---

### 🔴 [PENDING] JP Slugs — fighters sem página no smashwiki.info

Fighters sem bios JP disponíveis:
- Young Link, Wii Fit Trainer, Mii Brawler/Swordfighter/Gunner, Byleth, Steve, Pyra/Mythra
- DLC SSBU sem troféus históricos: Simon, Richter, Incineroar, Joker, Hero, Banjo & Kazooie, Terry, Min Min, Sephiroth, Kazuya, Sora

---

## Páginas Públicas

| URL | Descrição |
|---|---|
| `/` | Home |
| `/fighters` | Lista de todos os lutadores |
| `/fighters/[name]` | Página individual do lutador |
| `/collectibles?type=SPIRIT` | SpiritViewer |
| `/collectibles?type=TROPHY&game=SSBM` | Galeria de troféus Melee |
| `/collectibles?type=TROPHY&game=SSBB` | Galeria de troféus Brawl |
| `/franchise/[name]` | Colecionáveis por universo |
| `/chronicles` | Catálogo de jogos Nintendo |
| `/admin/*` | Painel admin (cookie `smash_admin`) |

---

## Scripts

```bash
# Scraping de dados dos lutadores
npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-bios.ts
npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-moves.ts

# Admin / ETL
npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts
npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts
npx tsx --env-file=.env.local scripts/admin/replace-dead-music-urls.ts
npx tsx --env-file=.env.local scripts/admin/check-bio-coverage.ts
```

---

## Schema — Modelos Principais

| Modelo | Qtd | Descrição |
|---|---|---|
| `Franchise` | 47 | Universos (Mario, Zelda, Pokémon...) |
| `Fighter` | 90 | Lutadores SSBU + Squirtle/Ivysaur/Charizard |
| `FighterBio` | ~250 | Bios por era em EN/PT/JP/JP→EN |
| `FighterMove` | ~100 | Movimentos por era em EN/PT/JP/JP→EN |
| `FighterChronicleLink` | ~600+ | Fighter ↔ jogo de origem |
| `Collectible` | ~3334 | Troféus + Spirits + Stickers |
| `CollectibleChronicleLink` | 2184 | Troféu ↔ jogo |
| `ChronicleEntry` | ~1270 | Jogos Nintendo (fonte única de verdade) |
| `Music` | 1076 | Faixas SSBU (536 ainda sem URL válida) |

---

## Fontes de Dados

- [SSBWiki](https://www.ssbwiki.com) — troféus, spirits, imagens, bios EN
- [SmashWiki.info](https://smashwiki.info) — nomes e textos em japonês
- [ssbuspirits.com](https://www.ssbuspirits.com) — metadata dos spirits
- [Libretro Thumbnails](https://github.com/libretro-thumbnails) — box arts de jogos
- Wikipedia — consoles e capas via infobox
- YouTube Data API — faixas de música do SSBU
