# SmashCompendium — Índice de Context

> **Regra:** Antes de trabalhar em qualquer sistema, leia o arquivo correspondente aqui.
> Estes arquivos são a fonte de verdade sobre cada feature — mais precisos que CONTEXT.md (que é histórico).

**Última atualização:** 2026-06-06 · Sessão 19 (final)

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

## Estado Atual (2026-06-06)

```
FighterWork    ████████████████████  87/87  100%  ✅ COMPLETO
Com bio        ████████████████████  87/87  100%  ✅
Com troféus    ████████████████░░░░  71/87   82%
Com spirits    ███████████████████░  84/87   97%
Com imageUrl   ████████████████████  87/87  100%  ✅
Chronicles art ██████░░░░░░░░░░░░░░ 263/947  28%
Chronicles wiki ████████░░░░░░░░░░░░ 389/947  41%
```

## Pendências (por prioridade)

| Prioridade | Tarefa | Arquivo de context |
|---|---|---|
| 🔴 P1 | 11 fighters sem capa de jogo de origem | `origin-games.md` |
| 🔴 P1 | ETL em massa: 86 fighters sem troféus/imagens completos | `etl-scrapers.md` |
| 🟡 P2 | 558 Chronicles sem wikiUrl → preencher no admin | `chronicles.md` + `admin-curation.md` |
| 🟡 P2 | 684 Chronicles sem capa → rodar fetch após wikiUrl | `chronicles.md` |
| 🟡 P2 | Spirits não exibidos como conteúdo no timeline | `collectibles.md` |
| 🟡 P2 | Bug: stickers nunca exibidos (stickersMap vazio) | `collectibles.md` |
| 🟠 P3 | 87 músicas pending_review → `/admin/music` | `music.md` |
| 🟠 P3 | ANTHROPIC_API_KEY não configurado no Vercel | `i18n.md` |

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
