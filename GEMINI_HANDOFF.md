# SmashCompendium — Gemini Pro Handoff
> Sessão 19 · 2026-06-06 · Preparado para continuar em Gemini Pro

Este documento é **autossuficiente**: contém tudo que você precisa para entender o projeto e continuar o trabalho sem sessões anteriores.

---

## 1. Visão Geral

**SmashCompendium** é um museu digital do Super Smash Bros., preservando troféus, spirits, stickers, biografias bilíngues e capas de jogos de cada lutador desde SSB64 até SSBU. Projeto acadêmico/fan-made sem fins comerciais.

---

## 2. Stack & Setup

| Tecnologia | Versão | Nota |
|---|---|---|
| Next.js | 14.2 | App Router, Server Components |
| Prisma | 5.22 | ORM para PostgreSQL |
| Supabase | — | PostgreSQL na região sa-east-1 |
| Node | 24 | Runtime |
| TypeScript | 5.x | Strict mode |
| Tailwind CSS | 3.x | Tema dark, fundo `#0a0a2a` |
| cheerio | 1.2 | Scraping HTML |

### Iniciar o servidor
```bash
npm run dev           # http://localhost:3000
```

### Rodar scripts TypeScript
```bash
# SEMPRE usar npx tsx — NUNCA ts-node
npx tsx --env-file=.env.local scripts/scrapers/nome-do-script.ts
```

### Variáveis de ambiente
- `.env.local` contém `DATABASE_URL` (Session Pooler do Supabase — IPv4)
- Session Pooler: `aws-1-sa-east-1.pooler.supabase.com:5432`
- **Não usar** a conexão direta (IPv6-only, não funciona em rede doméstica)

---

## 3. Schema do Banco

```prisma
model Franchise    { id, name (unique), fighters[], games[], stages[], musicTracks[] }
model Fighter      { id, rosterNumber, name (unique), franchiseId, imageUrl?,
                     curatorOverviewEn/Pt/Jp/JpEn?,
                     musicYoutubeId?, musicTitle?, musicArtist?, musicStatus?,
                     bios[], works[], collectibles[], tips[], suggestions[] }
model FighterBio   { id, fighterId, smashGameVersion, contentEn, contentPt?,
                     contentJp?, contentJpEn? }
model Game         { id, titleEn, platform, releaseYear?, boxArtUrl? }
model FighterWork  { fighterId, gameId, isDebut }  -- M:N fighter×smash_game
model Collectible  { id, fighterId?, type (TROPHY|SPIRIT|STICKER|SPRITE|MEDIA),
                     smashGameVersion, name, description?, descriptionPt?,
                     descriptionJp?, descriptionJpEn?, assetRenderUrl?,
                     posicaoSpiritSsbu?, posicaoTrofeuMelee/Brawl/Ssb4? }
model ChronicleEntry { id, consoleName, titleNtsc, titlePal?, titleJp?,
                        releaseDateNtsc/Pal/Jp?, wikiUrl?, boxArtUrl? }
model FighterTip   { id, fighterId, titleEn, textEn, titlePt?, textPt?,
                     titleJp?, textJp?, titleJpEn?, textJpEn? }
model FighterSuggestion { id, fighterId, section, authorName, message, approved }
```

---

## 4. Estado Atual do Banco (2026-06-06)

| Tabela | Total | Observação |
|---|---|---|
| Fighter | 87 | Todos com bios |
| FighterBio | ~435 | Todos os 87 lutadores têm bio em EN |
| FighterWork | 9 | **INCOMPLETO** — só 9 fighters mapeados a jogos Smash |
| Collectible (TROPHY) | 901 | 71/87 fighters |
| Collectible (SPIRIT) | 1582 | 84/87 fighters |
| Collectible (STICKER) | 707 | 55/87 fighters |
| ChronicleEntry | 947 | — |
| ChronicleEntry c/ boxArtUrl | 263 | ~28% com imagem |
| ChronicleEntry sem wikiUrl | 558 | Precisam de wikiUrl para busca de imagem |

---

## 5. Estrutura de Arquivos Chave

```
app/
  fighters/[slug]/page.tsx        ← Página do fighter (Server Component)
  chronicles/page.tsx             ← Página do Chronicles
  collectibles/page.tsx           ← Página de colecionáveis
  admin/music/page.tsx            ← Admin: revisão de músicas

components/ui/
  FighterPageLayout.tsx           ← Layout split-vault (esquerda=vault, direita=data)
  FighterDataZone.tsx             ← Zona direita com bio, troféus, works
  OriginGamesPanel.tsx            ← Painel de jogos de origem com capas
  MediaVaultViewer.tsx            ← Carrossel de imagens/gifs (zona esquerda)
  FighterRightPanel.tsx           ← Wrapper client (gerencia lang state)

lib/
  db.ts                           ← Instância Prisma (singleton)
  smash-meta.ts                   ← GAME_META, GAME_ORDER por versão Smash
  ui-i18n.ts                      ← Strings i18n EN/PT/JP/JP+EN
  fighters-tips.ts                ← Tips por lutador (SSBU)

scripts/scrapers/
  character-article.ts            ← ETL bios + troféus + stickers da SSBWiki
  fetch-images.ts                 ← ETL imagens (renders, troféus, sprites, spirits)
  fighters.ts                     ← Bulk insert dos 87 fighters
  fetch-chronicles-boxarts-v2.ts  ← Scraper box arts do Chronicles (Wikipedia/MarioWiki)
  fix-chronicles-false-positives.ts ← Limpa boxArtUrl falsos positivos
  fetch-all-boxarts.ts            ← Scraper box arts dos origin games
  origin-boxart-map.json          ← Mapa nome→arquivo dos origin games baixados

public/assets/
  games/                          ← 36 capas dos origin games (comprometido no git)
  fighters/                       ← Renders dos fighters (no .gitignore)
  collectibles/                   ← Imagens de troféus (no .gitignore)
  consoles/                       ← Ícones de consoles SVG/PNG

prisma/schema.prisma              ← Schema completo do banco
next.config.mjs                   ← remotePatterns para imagens externas
```

---

## 6. Página do Fighter (`/fighters/[slug]`)

### Arquitetura
```
page.tsx (Server Component)
  ├── FIGHTER_ORIGIN_GAMES   ← override por fighter (Ness, Lucas, Pyra, Mythra, Cloud, Sephiroth)
  ├── FRANCHISE_ORIGIN_GAMES ← fallback por franquia (todos os 87 fighters cobertos)
  ├── FIGHTER_GIFS           ← GIFs hardcoded por era (só Ness tem dados)
  └── FighterPageLayout
        ├── Esquerda: MediaVaultViewer (carrossel assets)
        └── Direita: FighterRightPanel
              ├── OriginGamesPanel (jogos de origem da franquia)
              └── FighterDataZone (bio, troféus, spirits, works, tips)
```

### Idiomas suportados
- `EN` — inglês (padrão)
- `PT` — português BR (tradução automática via Claude Haiku `/api/translate`)
- `JP` — japonês
- `JP_EN` — japonês com romanização

### Como adicionar origin games de um novo fighter
```typescript
// Em app/fighters/[slug]/page.tsx

// Override por fighter (tem prioridade):
const FIGHTER_ORIGIN_GAMES: Record<string, OriginGame[]> = {
  "NomeFighter": [
    { name: "Nome do Jogo", console: "NSW", year: 2017, badgeColor: "#2a2a8e",
      boxArtPath: "/assets/games/ARQUIVO.jpg",  // opcional — se não tiver, omitir
      wikiUrl: "https://en.wikipedia.org/wiki/..." }
  ],
};

// Fallback por franquia:
const FRANCHISE_ORIGIN_GAMES: Record<string, OriginGame[]> = {
  "NomeFranquia": [...],
};
```

---

## 7. Box Arts dos Origin Games

### Status atual: 36/37 jogos baixados
Arquivos em `public/assets/games/`. Ball (G&W) não tem imagem disponível.

### Origin games SEM capa ainda (adicionados sessão 19, precisam de imagem manual)
| Fighter(s) | Jogo | Arquivo sugerido |
|---|---|---|
| Snake | Metal Gear Solid (PS, 1998) | `METAL_GEAR_SOLID_PS_BOX.jpg` |
| Wii Fit Trainer | Wii Fit (Wii, 2007) | `WII_FIT_WII_BOX.jpg` |
| Inkling | Splatoon (Wii U, 2015) | `SPLATOON_WIIU_BOX.jpg` |
| Terry | Fatal Fury (Neo Geo, 1991) | `FATAL_FURY_NEO_BOX.jpg` |
| Cloud + Sephiroth | Final Fantasy VII (PS, 1997) | `FF7_PS_BOX.jpg` |
| Steve + Alex | Minecraft (PC, 2011) | `MINECRAFT_PC_BOX.jpg` |
| Kazuya | Tekken (ARC, 1994) | `TEKKEN_ARC_BOX.jpg` |
| Sora | Kingdom Hearts (PS2, 2002) | `KINGDOM_HEARTS_PS2_BOX.jpg` |
| R.O.B. | Gyromite (NES, 1985) | `GYROMITE_NES_BOX.jpg` |
| Mii Fighters | Mii Channel (Wii, 2006) | `MII_WII_BOX.jpg` |
| Pyra + Mythra | Xenoblade Chronicles 2 (NSW, 2017) | `XC2_NSW_BOX.jpg` |

**Como adicionar uma capa manualmente:**
1. Coloque a imagem em `public/assets/games/ARQUIVO.jpg`
2. Em `app/fighters/[slug]/page.tsx`, adicione `boxArtPath: "/assets/games/ARQUIVO.jpg"` na entrada correspondente de `FRANCHISE_ORIGIN_GAMES` ou `FIGHTER_ORIGIN_GAMES`

---

## 8. Chronicles Box Arts

### Status: 263/947 com boxArtUrl (~28%)
- 258 válidas + passou por cleanup de falsos positivos
- 126 entradas falharam nos 2 passes (lazy loading Wikipedia — Zelda, Kirby, Wii Sports, etc.)
- 558 sem `wikiUrl` (precisam de wikiUrl antes de buscar imagem)

### Scripts disponíveis
```bash
# Scraper principal (só processa entradas com wikiUrl e sem boxArtUrl):
npx tsx --env-file=.env.local scripts/scrapers/fetch-chronicles-boxarts-v2.ts

# Limpar falsos positivos após novo run:
npx tsx --env-file=.env.local scripts/scrapers/fix-chronicles-false-positives.ts

# Filtrar por console específico:
npx tsx --env-file=.env.local scripts/scrapers/fetch-chronicles-boxarts-v2.ts --console="Nintendo 64"

# Dry run (não salva no banco):
npx tsx --env-file=.env.local scripts/scrapers/fetch-chronicles-boxarts-v2.ts --dry-run
```

### Por que algumas falham
Páginas como Zelda, Kirby, Wii Sports, Star Fox, Pokémon no Wikipedia carregam imagens via JavaScript (lazy loading). O `fetch` simples não consegue executar JS — seria necessário usar MediaWiki Action API (`prop=images&prop=imageinfo`) como fallback.

### Entradas sem wikiUrl (558 entradas)
Precisam ter o campo `wikiUrl` populado antes que o scraper possa buscar a imagem. Opções:
1. Popular manualmente via admin
2. Criar script que tenta match por `titleNtsc` → URL Wikipedia auto-gerada

---

## 9. FighterWork — Aparições nos Jogos Smash (PENDENTE CRÍTICO)

**Problema:** Apenas 9 fighters têm entradas em `FighterWork`. Os outros 78 não têm dados de em quais jogos Smash aparecem.

**Impacto:** A seção de "eras" no timeline da página do fighter fica baseada apenas nos bios e troféus, não nas aparições reais.

**O que precisa ser feito:**
1. Criar um script `scripts/scrapers/populate-fighter-works.ts`
2. Para cada fighter, criar `FighterWork` entries nos jogos Smash em que aparece
3. Os 5 jogos Smash estão na tabela `Game` (buscar com `db.game.findMany()`)
4. Cada fighter tem um `isDebut: true` no jogo em que estreou

**Exemplo de como fazer:**
```typescript
// Buscar IDs dos jogos
const games = await db.game.findMany();
const ssb64 = games.find(g => g.titleEn.includes("64"));
const ssbm = games.find(g => g.titleEn.includes("Melee"));
// etc.

// Mario estreou no SSB64 e aparece em todos
await db.fighterWork.createMany({
  data: [
    { fighterId: marioId, gameId: ssb64.id, isDebut: true },
    { fighterId: marioId, gameId: ssbm.id, isDebut: false },
    // ...
  ]
});
```

---

## 10. Pendências Prioritizadas

### P1 — Impacto visual imediato
- [ ] **Capas dos origin games faltantes** (11 fighters sem imagem — lista na seção 7)
- [ ] **Populat FighterWork** para todos os 87 fighters (seção 9)
- [ ] **Chronicles wikiUrl** para as 558 entradas sem URL → depois rodar scraper novamente

### P2 — Conteúdo
- [ ] **ETL em massa** — bios EN + troféus + imagens para os outros 86 fighters além de Ness
  - Script: `npx tsx --env-file=.env.local scripts/scrapers/index.ts` (orquestrador)
  - Fonte: SSBWiki (`https://www.ssbwiki.com/Fighter_name`)
- [ ] **Spirits no timeline** — spirits são contados mas não exibidos como conteúdo na página do fighter
  - Atualmente só contados em `fichaCounters.spirits`
  - Para exibir: criar `spiritsMap` análogo ao `trophiesMap` em `page.tsx` e `FighterDataZone`
- [ ] **Stickers no timeline** — `stickersMapSerialized` está sempre vazio (bug em `page.tsx` linha ~330)
  - Fix: popular `stickersMapSerialized` com os stickers do fighter

### P3 — Produção
- [ ] **`ANTHROPIC_API_KEY` no Vercel** — tradução PT-BR cai para EN em produção
- [ ] **87 fighters — músicas** — `musicStatus = "pending_review"` para todos
  - Admin em `/admin/music` para aprovar/substituir YouTube IDs
- [ ] **Spirits 3rd party** (33 fighters) — sem página em ssbuspirits.com para Snake, Sonic, Cloud, etc.

---

## 11. Padrões e Convenções

### Scripts TypeScript
```bash
# SEMPRE: npx tsx  ❌ NUNCA: ts-node
npx tsx --env-file=.env.local scripts/scrapers/meu-script.ts
```

### Rate limiting em scrapers
```typescript
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
// Entre requisições:
await sleep(1300 + Math.random() * 400);
// A cada 30 requisições:
await sleep(5000);
```

### Imagens externas no Next.js
Domínios permitidos em `next.config.mjs`:
- `www.ssbwiki.com` / `ssb.wiki.gallery`
- `upload.wikimedia.org`
- `mario.wiki.gallery`
- `earthbound.fandom.com` / `static.wikia.nocookie.net`

**Regra:** box arts de jogos usam `<img>` com `height: Xpx, width: "auto"` (preserva proporção). Renders e troféus usam `<Image>` do Next.js.

### Box art — extração de Wikipedia
```typescript
// Converter thumbnail para full-res:
if (imgUrl.includes("/thumb/")) {
  imgUrl = imgUrl.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
}
// Filtrar falsos positivos:
if (resolved.match(/\.svg(?:\.png)?/i)) return;
if (resolved.match(/Cscr-|featured|cc-by|poweredby|logo/i)) return;
```

### Consultas Prisma
```typescript
import { db } from "@/lib/db";  // singleton

// Em scripts, criar nova instância:
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
// ... usar db ...
await db.$disconnect();
```

### Versões do Smash (smashGameVersion)
`"SSB64"` | `"SSBM"` | `"SSBB"` | `"SSB4"` | `"SSBU"` | `"ORIGIN"`

### Tipos de Collectible
`"TROPHY"` | `"SPIRIT"` | `"STICKER"` | `"SPRITE"` | `"MEDIA"`

---

## 12. Rotas da Aplicação

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Server | Home com busca de fighters |
| `/fighters` | Server | Grid de todos os fighters |
| `/fighters/[slug]` | Server | Página individual do fighter |
| `/chronicles` | Server | Timeline de jogos Nintendo |
| `/collectibles` | Server | Galeria de troféus/spirits/stickers |
| `/admin/music` | Server | Admin para revisão de músicas |
| `/api/translate` | API Route | Tradução PT-BR via Claude Haiku |

---

## 13. Fluxo ETL para um Novo Fighter

Para ingerir dados completos de um fighter (ex: Mario):

```bash
# 1. Bio + troféus + stickers (texto)
npx tsx --env-file=.env.local scripts/scrapers/character-article.ts --fighter="Mario"

# 2. Imagens (render, troféus, sprite, spirit)
npx tsx --env-file=.env.local scripts/scrapers/fetch-images.ts --fighter="Mario"

# 3. Verificar no banco
npx tsx --env-file=.env.local -e "
  const { PrismaClient } = require('@prisma/client');
  const db = new PrismaClient();
  db.fighter.findFirst({
    where: { name: 'Mario' },
    include: { bios: true, collectibles: true }
  }).then(f => { console.log('bios:', f.bios.length, 'collectibles:', f.collectibles.length); db.\$disconnect(); });
"
```

---

## 14. Nota sobre o Ness

Ness é o fighter com dados mais completos — serve como referência para todos os outros:
- 1 sprite de origem (EarthBound)
- 3 troféus Melee, 1 Brawl, 5 SSB4
- 1 spirit SSBU (Spirit #563)
- Bio EN para todas as eras (SSB64 → SSBU)
- GIFs hardcoded em `FIGHTER_GIFS["Ness"]`
- Tips SSBU em `lib/fighters-tips.ts`
- `curatorOverviewEn` com texto curatorial

---

## 15. Problemas Conhecidos / Gotchas

1. **Wikipedia lazy loading** — Zelda, Pokémon, Kirby, Metroid games não carregam imagens via fetch simples. Usar MediaWiki API (`prop=images&prop=imageinfo`) como alternativa.
2. **Prisma em scripts Node** — usar `require('@prisma/client')` em scripts `.js` ou `import` em `.ts` com tsx.
3. **PowerShell e colchetes** — usar `-LiteralPath` para caminhos com `[slug]`.
4. **Supabase IPv4** — sempre Session Pooler, nunca conexão direta.
5. **`tsx` não `ts-node`** — o tsconfig usa `"module": "esnext"` que ts-node não suporta.
6. **`ANTHROPIC_API_KEY` no Vercel** — não está configurado, tradução PT cai para EN em produção.

---

*Handoff preparado em 2026-06-06. Para dúvidas sobre decisões de design, ver `CONTEXT.md` (arquivo extenso com histórico de todas as sessões).*
