# SmashCompendium — Handoff para IA (Antigravity / Gemini / Claude)
> Sessão 24 · 2026-06-16 · Preparado por Claude Sonnet 4.6

Este documento é **autossuficiente**: tudo que você precisa para entender o projeto e continuar o trabalho.

---

## 1. Visão Geral

**SmashCompendium** é um museu digital fan-made/acadêmico do Super Smash Bros.  
Preserva troféus, spirits, stickers, biografias bilíngues, colecionáveis e jogos de origem de cada lutador (SSB64 → SSBU).

- **Path:** `D:\Super Smash Bros Museum`
- **Branch:** `master`
- **Versão:** V00.087 Alpha (em `lib/version.ts` — incrementar a cada commit)

---

## 2. Stack & Regras Absolutas

| Tecnologia | Versão | Nota |
|---|---|---|
| Next.js | 14.2 | App Router, Server Components |
| Prisma | 5.22 | ORM para PostgreSQL |
| Supabase | — | PostgreSQL sa-east-1 |
| Node | 24 | Runtime |
| TypeScript | 5.x | Strict mode |
| Tailwind CSS | 3.x | Tema dark, fundo `#020617` |

### Regras que NUNCA podem ser violadas

1. **Scripts:** `npx tsx --env-file=.env.local scripts/...` — NUNCA `ts-node`
2. **Migrações:** `$executeRawUnsafe` SQL direto — NUNCA `prisma migrate dev`
3. **`prisma generate`:** parar o dev server ANTES (DLL lock no Windows)
4. **Banco:** Session Pooler IPv4 `aws-1-sa-east-1.pooler.supabase.com:5432` (não usar conexão direta — IPv6)
5. **`curationStatus`:** NUNCA setar `"approved"` via script — só aprovação manual
6. **Versão:** incrementar `APP_VERSION` em `lib/version.ts` em cada commit
7. **PowerShell + colchetes:** usar `-LiteralPath` para caminhos com `[slug]`
8. **Cache `.next`:** se o SWC der erros impossíveis, parar o servidor e deletar `.next` antes de reiniciar

### Dev server
```powershell
npm run dev   # porta 3000 (ou 3001 se 3000 estiver em uso)
```

---

## 3. Schema do Banco (modelos relevantes)

```
Franchise             — 47 franquias
Fighter               — 90 lutadores (87 SSBU + Squirtle #33a + Ivysaur #33b + Charizard #33c)
FighterBio            — bios por versão do Smash (SSB64/SSBM/SSBB/SSB4/SSBU) EN+JP
FighterMove           — movimentos/Final Smash por era JP
FighterChronicleLink  — Fighter ↔ ChronicleEntry (Works GLOBAL do lutador)
FighterTip            — tips de gameplay (Ness completo; outros pendentes)

Collectible           — TROPHY|SPIRIT|STICKER|SPRITE|MEDIA
  smashGameVersion    — "SSB64"|"SSBM"|"SSBB"|"SSB4"|"SSBU"
  type                — "TROPHY"|"SPIRIT"|"STICKER"|"SPRITE"|"MEDIA"

CollectibleChronicleLink — Collectible ↔ ChronicleEntry (jogos de origem do troféu)
                         ⭐ FONTE DOS WORKS POR ERA (ver seção 7)

ChronicleEntry        — catálogo de jogos Nintendo (1254 entradas)
  consoleName, titleNtsc, titlePal, titleJp, releaseDateNtsc/Pal/Jp, wikiUrl, boxArtUrl

Music                 — 1076 faixas SSBU (536 sem YouTube embeddável)
```

### ⚠️ Arquitetura Works (decisão de 2026-06-14)
`FighterChronicleLink → ChronicleEntry` é a **única** fonte de verdade dos jogos de origem.  
NÃO usar a tabela `Game` para works. Corrigir Chronicles corrige a UI automaticamente.

---

## 4. Estado do Banco (2026-06-16)

| Tabela | Total | Status |
|---|---|---|
| Fighter | 90 | ✅ (87 SSBU + Squirtle/Ivysaur/Charizard) |
| FighterBio | ~250 | ✅ EN + JP por era, 90 fighters |
| FighterMove | ~100 | ✅ moves JP por era |
| FighterChronicleLink | 139 | ✅ 66/90 fighters cobertos (works global) |
| CollectibleChronicleLink | ~2184 | ✅ troféus → jogos de origem |
| Collectible (TROPHY) | ~1045 | ✅ Melee(293) + Brawl(544) + SSB4(408+) |
| Collectible (SPIRIT) | 1582 | ✅ SSBU |
| Collectible (STICKER) | ~707 | ✅ Brawl |
| ChronicleEntry | 1254 | ✅ 0 consoleName=Unknown; 54 sem boxArt, 57 sem wikiUrl, 603 sem titleJp |
| Music | 1076 | ⚠️ 536 sem YouTube embeddável |

---

## 5. Estrutura de Arquivos Chave

```
app/
  fighters/[slug]/page.tsx        ← Página do lutador (Server Component) ← MODIFICADO 2026-06-16
  chronicles/page.tsx             ← Catálogo de jogos Nintendo
  collectibles/page.tsx           ← Troféus/Spirits/Stickers viewer
  admin/music/page.tsx            ← Admin: revisão de músicas

components/
  fighter/
    FighterDataZone.tsx           ← Timeline + bio + works por era ← MODIFICADO 2026-06-16
    FighterRightPanel.tsx         ← Wrapper client (controla lang state)
    OriginGamesPanel.tsx          ← Painel de works global (painel direito)
    MediaVaultViewer.tsx          ← Carrossel de colecionáveis (painel esquerdo)

lib/
  version.ts                      ← APP_VERSION (incrementar a cada commit)
  smash-meta.ts                   ← GAME_META por versão do Smash
  ui-i18n.ts                      ← Strings i18n EN/PT/JP/JP+EN

scripts/admin/
  replace-dead-music-urls.ts      ⏳ música — 536 pendentes, ~95/dia
  translate-all-fighter-content.ts ⬜ tradução — aguarda ANTHROPIC_API_KEY
  populate-all-fighter-works.ts   ✅ já rodado
  check-trophy-works.ts           diagnóstico: works de um fighter
  check-fighter-coverage.ts       diagnóstico: cobertura de fighters
  link-ssbm-trophies-to-chronicles.ts ✅ 204 CollectibleChronicleLinks Melee
```

---

## 6. Página do Lutador (`/fighters/[slug]`) — Arquitetura Atual

```
page.tsx (Server Component)
  ├── db.fighter.findUnique()         → Fighter + FighterBio + FighterMove + FighterTip
  ├── db.collectible.findMany()       → todos os Collectibles do fighter
  │     include: chronicleLinks → chronicleEntry   ← NOVO (2026-06-16)
  ├── db.fighter.findFirst({          → FighterChronicleLinks (works global)
  │     include: { chronicleLinks: { include: { chronicleEntry } } }
  │   })
  │
  ├── SMASH_TITLES (Set)              → filtro: exclui jogos Smash dos Works
  ├── ceToWorkGame()                  → converte ChronicleEntry → WorkGame
  ├── originWorkGames []              → Works global (union de FighterChronicleLink)
  ├── worksPerGame {}                 → Works por era (de Collectible.chronicleLinks)  ← NOVO
  │     Record<"SSBM"|"SSBB"|"SSB4"|"SSBU", WorkGame[]>
  │     construído agrupando CollectibleChronicleLink por smashGameVersion do Collectible
  │
  └── FighterPageLayout
        ├── Esquerda (col-span-5): MediaVaultViewer — render + carrossel colecionáveis
        └── Direita (col-span-7):  FighterRightPanel → FighterDataZone
```

---

## 7. Works por Era — Sistema Implementado (2026-06-16) ⭐

### Como funciona

Cada `Collectible` (troféu) de um fighter tem `smashGameVersion` (ex: "SSBM") e `chronicleLinks`
apontando para `ChronicleEntry` (jogos de origem daquele troféu). Isso é usado para mostrar
os Works específicos de cada era na linha do tempo do fighter.

**Fonte:**
- `CollectibleChronicleLink → ChronicleEntry` agrupado por `Collectible.smashGameVersion`
- Builder em `page.tsx` → `worksPerGame: Record<string, WorkGame[]>`

**Fallback por era:**
```typescript
const eraWorkGames: WorkGame[] =
  (worksPerGame && worksPerGame[gameVer])
    ? worksPerGame[gameVer]!
    : (originWorkGames ?? []);
```
- Se o troféu daquela era tem jogos ligados → mostra esses jogos
- Senão → mostra os works globais (`FighterChronicleLink`)
- SSB64 e SSBU DLC (sem troféus) → sempre usam o fallback global

### Cobertura
- **66 fighters** têm CollectibleChronicleLinks (troféus Melee/Brawl/SSB4 com jogos de origem)
- **24 DLC SSBU** (Joker, Hero, Banjo, Terry, Byleth, Min Min, Steve, Sephiroth, Pyra/Mythra, Kazuya, Sora, Miis) — sem troféus → sem per-era Works → usam fallback global
- **SSB64** — nenhum fighter tem troféu dessa era → todos usam fallback

### Exemplo verificado (Yoshi):
- Melee → "Super Mario World", "Super Mario World 2: Yoshi's Island"
- Brawl → "Yoshi's Safari", "Yoshi's Story"
- SSB4 → "Super Mario World", "Super Mario World 2: Yoshi's Island"
- SSB64/SSBU → fallback global (todos os 4 jogos)

---

## 8. Idiomas Suportados

| Código | Descrição |
|---|---|
| `EN` | Inglês (padrão) |
| `PT` | Português BR (tradução via Claude API — bloqueada sem `ANTHROPIC_API_KEY`) |
| `JP` | Japonês |
| `JP_EN` | Japonês com romanização EN |

---

## 8.5 Pipeline de Clipes WebM 360° (iniciado 2026-06-19)

Cada troféu do Melee, Brawl e SSB4 deve ter um clipe WebM em loop seamless de 360° para exibir na página de coleções e na página do lutador.

### Fontes de vídeo
| Jogo | URL | Arquivo local | Status |
|---|---|---|---|
| Melee (293) | — | `full_video_trophies.mp4` | ✅ Vídeo disponível |
| Brawl (544) | https://www.youtube.com/watch?v=vBjfzgulIRQ | `full_video_brawl.mp4` | ⏳ Download em andamento |
| SSB4 Wii U | https://www.youtube.com/watch?v=Zy4tT1KMZs8 | — | ⬜ Na fila após Brawl |
| SSB4 3DS | https://www.youtube.com/watch?v=dry8MwgOswI | — | ⬜ Na fila após Brawl |

### Status por jogo

**Melee:** timestamps anotados **manualmente** pelo usuário no Google Sheets.
- ⬜ Exportar JSON do Sheets → FFmpeg → 293 WebM

**Brawl:** automação via OCR.
- ✅ `scripts/admin/auto-timestamp-brawl.ts` criado (tesseract.js, 4 workers)
- FFmpeg faz crop `x=900,y=0,w=1000,h=250` (top-right onde fica o nome do troféu)
- Fuzzy match Levenshtein contra nomes do banco (`smashGameVersion: 'SSBB'`, ordem `posicaoTrofeuBrawl`)
- Output: `brawl-timestamps.json`
- ⬜ Baixar vídeo (yt-dlp com bloqueios; alternativa: JDownloader / 4K Video Downloader)
- ⬜ Rodar OCR → revisar JSON → `extract-360-brawl.ts` → 544 WebM

**SSB4 Wii U + 3DS:** mesmo pipeline do Brawl — na fila.

### Pendente de schema
```prisma
// Adicionar em Collectible:
clip360Url String?  // WebM de 360° em loop
```
Usar `$executeRawUnsafe` (NUNCA `prisma migrate dev`). Depois popular + UI no TrophyViewer.

---

## 9. Pendências (por prioridade)

### 🔵 PRÓXIMO — Origem, Artwork e Inspiration dos Spirits (SSBU)
O usuário solicitou que fossem adicionadas as informações de Jogo de Origem e Jogo de Artwork Source (com as respectivas capas) nos Spirits do Ultimate a partir do número 1115 (ex: Baxter & Forthington). Além disso, pediu para extrair o campo "inspiration" de cada spirit e anotar no banco.
- **Ação 1:** Fazer scraping ou processamento manual para preencher as origens, artwork source e inspiration dos spirits faltando.
- **Ação 2:** Garantir que essas origens também se tornem entradas na tabela `ChronicleEntry` e sejam referenciadas nos `Collectibles` correspondentes, para aparecerem na interface da página de Coleções.
- **Ação 3:** Buscar páginas Wiki e baixar as capas que faltam no Chronicles desses jogos específicos de origem.

### 🔵 PRÓXIMO — Music URLs (fácil, só rodar)
```powershell
npx tsx --env-file=.env.local scripts/admin/replace-dead-music-urls.ts
```
- 536 faixas sem YouTube embeddável
- Rodar diariamente (quota ~95/dia, ~6 runs)
- Cada run atualiza `Music.youtubeId` + `Music.embedUrl`

### 🔵 PRÓXIMO — Tradução (bloqueada em ANTHROPIC_API_KEY)
```powershell
# Adicionar ao .env.local:
ANTHROPIC_API_KEY="sk-ant-..."

npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts
```
- Traduz `contentEn→contentPt` e `contentJp→contentJpEn` para todos os ~250 FighterBio
- Também traduz moves: `descJp→descJpEn` para ~100 FighterMove
- Modelo: `claude-sonnet-4-6`
- Flags: `--dry-run`, `--only-bios`, `--only-moves`, `--fighter <Name>`

### 🟡 MÉDIO — Works para 24 DLC SSBU (manual)
Joker, Hero, Banjo & Kazooie, Terry, Byleth, Min Min, Steve, Sephiroth, Pyra/Mythra, Kazuya, Sora, Mii Brawler, Mii Swordfighter, Mii Gunner não têm troféus → sem `CollectibleChronicleLink` → sem per-era Works.

**Solução:** o usuário provê a lista de Works manualmente por era, e criamos `FighterChronicleLink` diretamente com um script.

### 🟡 MÉDIO — Works para SSB64 (todas as eras)
Nenhum fighter tem troféu do SSB64 → a era SSB64 usa sempre o fallback global.  
Para mostrar Works específicos para SSB64 de cada fighter, precisaria criar `FighterChronicleLink` com um sub-tipo ou nova tabela.

### 🟠 P1 — Reclassificar troféus `sourceGame="SMASH"`
Só os troféus Melee #002–078 são moves legítimos de lutador. Os outros ~160 troféus com `sourceGame="SMASH"` na verdade referem-se a "Super Smash Bros. (N64)" ou "Super Smash Bros. Melee (GCN)" — precisam ser corrigidos.
Ver: `memory/next_demand_smash_reclassify.md`

### 🟠 P1 — Corrigir Chronicles
- 54 ChronicleEntry sem boxArt
- 57 ChronicleEntry sem wikiUrl
- 603 ChronicleEntry sem titleJp
Ver: `memory/next_demand_fix_chronicles.md`

### 🟠 P1 — Curadoria dos lutadores
Dados incorretos/faltando em alguns fighters. Usuário fará revisão manual + automação pontual.
Ver: `memory/next_demand_curation.md`

### P2 — sourceGame Melee malformatado
Alguns troféus têm `sourceGame = "Donkey KongArcade 1981"` (sem espaço). Precisam de correção.

### P2 — 22 ChronicleEntry com consoleName="Unknown"
Criadas pelo works populator automaticamente. Precisam de curadoria manual.

### P2 — CollectibleRelation (tabela vazia)
Tabela existe mas está vazia. Linkar troféus cross-game (ex: Lakitu Melee → Lakitu Brawl).

### P2 — Clipes WebM 360° (pipeline completo)
Ver seção 8.5. Ordem: Melee → Brawl → SSB4. Schema + UI ainda a fazer.

### P2 — Requisitos RF não implementados (levantado 2026-06-19)
Com base na planilha de requisitos funcionais (RF01–RF05):
- **RF02 — Filtros na `/fighters`**: filtro por era (SSB64/Melee/Brawl/SSB4/SSBU) e por franquia — não implementados
- **RF05 — 8 itens relacionados por colecionável**: tabela `CollectibleRelation` completamente vazia
- **Design — Música persistente entre páginas**: player atual só existe na página do fighter; RF pede fundo global no site
- **Songs — Página pública `/music`**: existe `/admin/music` (aprovação) mas não página pública de músicas
- **RF01 — Asset aleatório na home**: verificar se a home exibe algum asset aleatório; se não, implementar
- **Design — Mobile responsivo 1080p**: não testado/implementado

### P3 — curatorOverview por fighter
Texto editorial por fighter (apenas Mario tem). ~90 fighters sem.

### P3 — GIFs / galeria
Animações por era (apenas Ness tem). Solução de hospedagem a decidir.

---

## 10. Scripts Disponíveis

```powershell
# Enriquecimento
npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-bios.ts    # bio EN+JP
npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-moves.ts   # moves JP
npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts # tradução (requer ANTHROPIC_API_KEY)
npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts    # works via trofeus

# Música
npx tsx --env-file=.env.local scripts/admin/replace-dead-music-urls.ts       # 536 pendentes

# Diagnóstico
npx tsx --env-file=.env.local scripts/admin/check-bio-coverage.ts
npx tsx --env-file=.env.local scripts/admin/check-trophy-works.ts
npx tsx --env-file=.env.local scripts/admin/check-fighter-coverage.ts
```

---

## 11. Commits Recentes

```
4c5cf2c feat(fighters): Works por versão do Smash — cada era mostra jogos do trofeu da era
16814e7 feat(fighters): popula Works via CollectibleChronicleLinks dos trofeus (139 links, 66 fighters)
b588752 feat(fighters): 681 FighterChronicleLinks — todos os lutadores com jogos de origem
0a00bc1 feat(music): 97 faixas com URLs YouTube atualizadas (97/536)
dd2d695 feat(chronicles): corrige Game & Watch — 57 jogos limpos
```

---

## 12. Padrões Técnicos

### Rate limiting em scrapers
```typescript
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
await sleep(1600 + Math.random() * 400);  // entre requisições
await sleep(5000);                          // a cada 30 requisições
```

### Prisma em scripts
```typescript
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
// ... usar db ...
await db.$disconnect();
```

### Imagens externas no Next.js (`next.config.mjs`)
Domínios permitidos: `www.ssbwiki.com`, `ssb.wiki.gallery`, `upload.wikimedia.org`, `mario.wiki.gallery`, `earthbound.fandom.com`, `static.wikia.nocookie.net`

### Versões do Smash (smashGameVersion)
`"SSB64"` | `"SSBM"` | `"SSBB"` | `"SSB4"` | `"SSBU"` | `"ORIGIN"`

### Tipos de Collectible
`"TROPHY"` | `"SPIRIT"` | `"STICKER"` | `"SPRITE"` | `"MEDIA"`

---

## 13. Gotchas & Armadilhas Conhecidas

1. **SWC stale cache:** Erros "Unexpected token div" mesmo após fix → `Remove-Item -Recurse -Force .next` + reiniciar dev server.
2. **`prisma generate` com server ativo:** Falha no Windows por DLL lock. Parar server primeiro.
3. **Session Pooler obrigatório:** Conexão direta do Supabase é IPv6-only → não funciona em rede doméstica.
4. **`ts-node` não funciona:** `tsconfig.json` usa `"module": "esnext"` que ts-node não suporta.
5. **`ANTHROPIC_API_KEY` ausente:** Tab PT-BR fica desabilitado — comportamento esperado, não é bug.
6. **`releaseYear` vs `releaseDateNtsc`:** no ChronicleEntry, o campo é `releaseDateNtsc` (string), não `releaseYear` (int).
7. **GIFs no Next.js:** usar `unoptimized={true}` em `<Image>` para preservar animação.
8. **`height: 180` fixo no EraHeader:** NUNCA usar `minHeight` — quebra o `fill` do Next.js.

---

## 14. Perfil do Usuário

- **Anderson (Crush) de Lima** — brasileiro, Git user "Anderson (Crush) de Lima"
- Valida resultados **visualmente no browser** (localhost:3000 ou 3001)
- Prefere **execução direta** sem excesso de perguntas
- Tema visual: dark intenso (slate-950), acentos amber/dourado, tipografia monospace para metadados

---

## 15. Protocolo de Handoff

Ao terminar uma sessão:
1. Atualizar `>Sessão` e data no topo deste arquivo
2. Atualizar seção 9 (pendências) — marcar o que foi feito, adicionar o que surgiu
3. Atualizar seção 4 (estado do banco) com novos counts
4. Atualizar `APP_VERSION` em `lib/version.ts` (a cada commit)
5. Atualizar `CONTEXT.md` (seção pendências + data)
6. **Nunca deixar o projeto em estado quebrado**

*Contexto técnico completo (histórico de sessões, UI design, padrões de layout): ver `CONTEXT.md`*
