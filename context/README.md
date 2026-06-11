# SmashCompendium — Índice de Context

> **Regra:** Antes de trabalhar em qualquer sistema, leia o arquivo correspondente aqui.
> Estes arquivos são a fonte de verdade sobre cada feature — mais precisos que CONTEXT.md (que é histórico).

**Última atualização:** 2026-06-11 · Sessão 25

| Arquivo | Sistema | Leia quando... |
|---|---|---|
| [`database.md`](database.md) | Schema + estado do banco | Qualquer trabalho com Prisma, queries, migrations |
| [`fighter-page.md`](fighter-page.md) | Página `/fighters/[slug]` | Trabalhar na página do lutador |
| [`origin-games.md`](origin-games.md) | Jogos de origem (Works) | Adicionar/editar jogos de origem e capas |
| [`chronicles.md`](chronicles.md) | Página `/chronicles` | Trabalhar no timeline de jogos Nintendo |
| [`collectibles.md`](collectibles.md) | Troféus, spirits, stickers | Trabalhar com colecionáveis |
| [`media-vault.md`](media-vault.md) | Carrossel de assets (esquerda) | Trabalhar no Media Vault |
| [`etl-scrapers.md`](etl-scrapers.md) | Scripts de ingestão | Criar ou editar scrapers |
| [`i18n.md`](i18n.md) | EN / PT / JP / JP+EN | Trabalhar com textos multilíngues |
| [`box-arts.md`](box-arts.md) | Capas de jogos | Scraping ou adição manual de capas |
| [`music.md`](music.md) | Música icônica dos fighters | Trabalhar com músicas e admin |
| [`admin-curation.md`](admin-curation.md) | Sistema de curadoria | Trabalhar nas ferramentas de admin/curadoria |

---

## Estado Atual (2026-06-11 · Sessão 24)

```
FighterWork    ████████████████████  87/87  100%  ✅ COMPLETO
Com bio SSB64  ████████░░░░░░░░░░░░  ~12/87  14%  (só fighters do SSB64 têm bio)
Com troféus    ████████████████░░░░  71/87   82%
Com spirits    ███████████████████░  84/87   97%
Com imageUrl   ████████████████████  87/87  100%  ✅
Chronicles art ████████░░░░░░░░░░░░ ~547/947+  ~57% (284 Libretro + manuais + existentes)
Chronicles wiki ████████░░░░░░░░░░░░ ~389/947   ~41%
```

> **Bio SSB64**: apenas os 12 fighters originais (SSB64) têm bio de jogo real.
> Demais eras usam Curator Overview. Bios wiki-scraped de outras eras — rodar `cleanup-non-64-bios.ts` para limpar.
>
> **BoxArt fighters**: fighters sem `boxArtPath` local agora buscam `boxArtUrl` do `ChronicleEntry` (sessão 24).
> Jogos adicionados ao Chronicles nesta sessão: Wii Fit, Fatal Fury, Minecraft, Mii.

## Admin Tools Disponíveis (Sessão 24)

| URL | Função |
|---|---|
| `/admin/create` | **CONSTRUTOR** — criar Fighter/Troféu/Spirit/Sticker/Música/Palco/Crônica/Franquia |
| `/admin/fighters` | Curadoria: lista + aprovar fighters (completeness checklist) |
| `/admin/fighters/[id]` | **EDITOR** — editar bios (só SSB64), curator overview, música, imagens, colecionáveis |
| `/admin/collectibles` | Editar troféus/spirits/stickers por franquia (inclusive sem fighter) |
| `/admin/music` | Revisar música icônica dos fighters |
| `/admin/music-tracks` | **EDITOR** — 1.119 faixas SSBU: filtrar/editar/deletar, YouTube preview |
| `/admin/chronicles` | Editar wikiUrl + capa dos chronicles |
| `/franchise` | **PÚBLICO** — índice de todas as franquias com stats |
| `/franchise/[name]` | **PÚBLICO** — página do universo: fighters + colecionáveis + palcos + músicas |

## Estado do Schema (Sessão 21)

```
Collectible.franchiseId  ████████████████████  NOVO — migração rodada 2026-06-07
  1395 collectibles com franchiseId (herdado dos fighters)
  1838 collectibles sem franchiseId (spirits avulsos, nunca tiveram fighter)

  Lógica Option 2:
  - fighterId preenchido → aparece na página do fighter
  - fighterId null + franchiseId preenchido → aparece na página da franquia
  - ⇥ Desvincular no editor: fighterId=null + mantém franchiseId automaticamente
```

## Pendências (por prioridade)

> **Roadmap completo:** ver `context/roadmap.md` (36 itens com estratégia de resolução)

| Prioridade | Tarefa | Arquivo de context |
|---|---|---|
| 🔴 P1 | ETL em massa: bios SSB64 EN/JP para os 12 fighters do original | `etl-scrapers.md` |
| 🔴 P1 | ETL em massa: troféus + imagens para os 16 fighters sem troféus | `etl-scrapers.md` |
| 🔴 P1 | 11 fighters sem boxArtPath local (podem ter boxArtUrl via Chronicle) | `origin-games.md` |
| 🟡 P2 | Limpar bios wiki-scraped de Melee/Brawl/4/Ultimate: `cleanup-non-64-bios.ts` | `admin-curation.md` |
| 🟡 P2 | Curar troféus de universo (ex: Boo no Mario) via ⇥ desvincular → `/franchise/Mario` | `collectibles.md` |
| 🟡 P2 | ~558 Chronicles sem wikiUrl → preencher no admin | `chronicles.md` |
| 🟡 P2 | ~684 Chronicles sem capa → rodar fetch após wikiUrl | `chronicles.md` |
| 🟡 P2 | Spirits não exibidos como conteúdo no timeline | `collectibles.md` |
| 🟡 P2 | Bug: stickers nunca exibidos (stickersMapSerialized vazio em fighters/[slug]/page.tsx) | `collectibles.md` |
| 🟡 P2 | Bug: algumas imagens de sticker incorretas (ETL mal-matched) | `collectibles.md` |
| 🟡 P2 | Music tracks com vídeos mortos — **918 restantes** (rodar replace-dead-music-urls.ts 1x/dia) | `music.md` |
| 🟠 P3 | Músicas pending_review → aprovar via botão inline em `/admin/fighters` | `music.md` |
| 🟠 P3 | ANTHROPIC_API_KEY não configurado no Vercel | `i18n.md` |
| 🟠 P3 | Chronicles: mood visual estilo Brawl | `roadmap.md` |
| 🟠 P3 | Chronicles: botões GAMEPLAY e JOGAR (Em breve) | `chronicles.md` |

## ⚠️ Regra de Curadoria

> **Uma página só é aprovada após curadoria manual do usuário.**
> O processo automatizado (ETL/scraping) não garante qualidade suficiente.
> Nunca definir `curationStatus = "approved"` via script automatizado.

## Convenções Globais

```bash
# Rodar scripts TS
npx tsx --env-file=.env.local scripts/scrapers/meu-script.ts
npx tsx --env-file=.env.local scripts/admin/meu-script.ts

# NUNCA usar ts-node (quebra com "module": "esnext" do tsconfig)

# Ver estado geral do projeto
npx tsx --env-file=.env.local scripts/admin/check-status.ts
```

- **Banco**: Supabase Session Pooler IPv4 — `aws-1-sa-east-1.pooler.supabase.com:5432`
- **Imagens externas**: whitelistadas em `next.config.mjs` (ver `box-arts.md`)
- **Box arts**: `<img style={{ height: Xpx, width: "auto" }}>` — nunca `<Image fill>`
