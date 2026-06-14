# Smash Compendium

Museu digital interativo do Super Smash Bros. — preserva troféus, spirits, stickers, músicas e biografias bilíngues de cada lutador desde SSB64 até SSBU.

## Screenshots

### Home
![Home](public/screenshots/home.png)

### Lutadores
![Fighters](public/screenshots/fighters.png)

### Página do Lutador (Ness)
![Fighter Ness](public/screenshots/fighter-ness.png)

### Spirit Viewer (1.582 Spirits)
![Spirit Viewer](public/screenshots/spirit-viewer.png)

### Galeria de Troféus — Melee (293 itens)
![Trophies Melee](public/screenshots/trophies-melee.png)

### Galeria de Troféus — Brawl (544 itens)
![Trophies Brawl](public/screenshots/trophies-brawl.png)

### Nintendo Chronicle
![Chronicles](public/screenshots/chronicles.png)

---

## Visão Geral

O Smash Compendium é um projeto fan-made sem fins comerciais que reúne em um único lugar todo o conteúdo colecionável das cinco gerações do Super Smash Bros:

- **Troféus** — Melee (293), Brawl (544), Smash 4 (em breve)
- **Spirits** — Ultimate (1.582 spirits com metadata, arte e música)
- **Stickers** — Brawl
- **Músicas** — 1.076+ faixas do SSBU com links YouTube
- **Lutadores** — 87 fighters com bios bilíngues, renders e curiosidades
- **Chronicles** — Timeline de jogos representados no Smash

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14.2 (App Router + Server Components) |
| Linguagem | TypeScript 5.4 |
| Estilo | Tailwind CSS 3.4 (tema dark customizado) |
| Banco de Dados | PostgreSQL via Supabase (sa-east-1) |
| ORM | Prisma 5.14 |
| Animações | Framer Motion 12 |
| IA/LLM | Anthropic SDK (`@anthropic-ai/sdk`) |
| Scraping | Cheerio + fetch nativo (Node 24) |
| Scripts | tsx (esbuild) |
| Deploy | Vercel |

## Estrutura do Projeto

```
smash-compendium/
├── app/
│   ├── admin/           # Painel de administração (protegido por senha)
│   │   ├── login/       # Página de login
│   │   ├── fighters/    # Curadoria de lutadores
│   │   ├── collectibles/# Editor de troféus/spirits por franquia
│   │   ├── chronicles/  # Editor da timeline de jogos
│   │   ├── music/       # Revisão de músicas por fighter
│   │   └── music-tracks/# Editor das 1.076+ faixas SSBU
│   ├── api/             # Route Handlers (REST)
│   ├── collectibles/    # Galeria de troféus, spirits e stickers
│   ├── fighters/        # Páginas individuais dos lutadores
│   ├── franchise/       # Universos/franquias
│   └── chronicles/      # Timeline de jogos
├── components/
│   └── ui/
│       ├── SpiritViewer.tsx         # Viewer de spirits (navegação 1-a-1)
│       └── CollectiblesMusicBar.tsx # Barra de música da galeria
├── scripts/
│   ├── admin/           # Scripts ETL e scrapers
│   │   ├── scrape-melee-trophies.ts
│   │   ├── scrape-brawl-trophies.ts
│   │   └── scrape-spirit-jp-names.ts
│   └── scrapers/        # Scrapers de spirit metadata
├── prisma/
│   └── schema.prisma    # Schema do banco (Franchise, Fighter, Collectible, ...)
├── lib/
│   └── db.ts            # Instância do Prisma Client
└── middleware.ts         # Proteção das rotas /admin
```

## Configuração

### Pré-requisitos

- Node.js 20+
- Conta no Supabase (ou PostgreSQL local)

### Instalação

```bash
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
DATABASE_URL="postgresql://..."   # Session Pooler do Supabase (porta 5432)
ADMIN_PASSWORD="sua-senha-aqui"   # Senha do painel admin
ANTHROPIC_API_KEY="sk-ant-..."    # Necessário para geração de bios em PT-BR
```

> **Atenção:** Use sempre o **Session Pooler** do Supabase (`pooler.supabase.com:5432`), não a conexão direta — a direta é IPv6-only.

### Banco de Dados

```bash
npm run db:generate   # Gera o Prisma Client
npm run db:push       # Aplica o schema (sem migration)
npm run db:studio     # Abre o Prisma Studio (GUI)
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Páginas Principais

| URL | Descrição |
|-----|-----------|
| `/` | Home com cards para Lutadores, Coleções e Chronicles |
| `/fighters` | Lista de todos os 87 lutadores do SSBU |
| `/fighters/[name]` | Página individual do fighter (bios, troféus, tips) |
| `/collectibles?type=SPIRIT` | SpiritViewer — navegação spirit a spirit |
| `/collectibles?type=TROPHY&game=SSBM` | Galeria de troféus Melee |
| `/collectibles?type=TROPHY&game=SSBB` | Galeria de troféus Brawl |
| `/franchise` | Lista de universos/franquias |
| `/franchise/[name]` | Colecionáveis por franquia |
| `/chronicles` | Timeline de jogos representados no Smash |

## Painel Admin

Acesse `/admin` com a senha configurada em `ADMIN_PASSWORD`.

| URL | Função |
|-----|--------|
| `/admin/fighters` | Aprovar fighters + checklist de completude |
| `/admin/fighters/[id]` | Editar bio, overview, música, imagens e colecionáveis |
| `/admin/collectibles` | Editar troféus/spirits por franquia |
| `/admin/chronicles` | Editar wikiUrl, boxArtUrl e consoleName |
| `/admin/music` | Revisar músicas associadas a fighters |
| `/admin/music-tracks` | Editor das 1.076+ faixas SSBU |
| `/admin/create` | Construtor universal (Fighter/Troféu/Spirit/Música/Crônica/Franquia) |

## Scripts ETL

Todos os scripts rodam com `npx tsx` e precisam do `DATABASE_URL` exportado:

```bash
# Melee trophies (concluído — 293 troféus)
npx tsx scripts/admin/scrape-melee-trophies.ts

# Brawl trophies (544 troféus — rodar --reset na 1ª vez)
npx tsx scripts/admin/scrape-brawl-trophies.ts --reset

# Nomes JP dos spirits
npx tsx scripts/admin/scrape-spirit-jp-names.ts

# Substituir URLs mortas do YouTube (quota: 10k/dia)
npx tsx scripts/admin/replace-dead-music-urls.ts
```

## Regra de Curadoria

Nenhum conteúdo é publicado automaticamente. A flag `curationStatus="approved"` só é setada após revisão manual no painel admin.

## Fontes de Dados

- [SSBWiki](https://www.ssbwiki.com) — troféus, spirits, imagens
- [SmashWiki.info](https://smashwiki.info) — nomes em japonês
- [ssbuspirits.com](https://www.ssbuspirits.com) — metadata dos spirits
- [Libretro Thumbnails](https://github.com/libretro-thumbnails) — box arts de jogos
- Wikipedia — consoles e capas via infobox
