# Sistema: Admin & Curadoria

**Objetivo:** Editar dados do site sem depender de IA — curadoria visual e em lote.

---

## Páginas Admin

| Rota | Arquivo | Função |
|---|---|---|
| `/admin/create` | `app/admin/create/page.tsx` | **CONSTRUTOR** — criar Fighter/Troféu/Spirit/Sticker/Música/Palco/Crônica/Franquia |
| `/admin/fighters` | `app/admin/fighters/page.tsx` | Curadoria: aprovar/rejeitar fighters, ver completeness checklist |
| `/admin/fighters/[id]` | `app/admin/fighters/[id]/page.tsx` | **EDITOR** — editar todo conteúdo de um fighter (bios, overview, música, colecionáveis) |
| `/admin/music` | `app/admin/music/page.tsx` | Revisar músicas dos fighters |
| `/admin/chronicles` | `app/admin/chronicles/page.tsx` | Editar wikiUrl + capa dos Chronicles |

### `/admin/chronicles` — Como usar

1. Abrir `http://localhost:3000/admin/chronicles`
2. Filtrar por **"Sem capa"** para ver entradas prioritárias
3. Para cada entrada:
   - Colar a URL Wikipedia no primeiro campo
   - Clicar no botão **Eye (👁)** → busca a imagem automaticamente e mostra preview
   - Se múltiplos candidatos aparecerem → clicar no thumbnail correto
   - Ou colar URL direta da imagem no segundo campo
   - Clicar **Save**
4. Filtrar por console específico para trabalhar por grupo

---

## API Routes (admin)

### Fighters / Editor
| Endpoint | Método | Função |
|---|---|---|
| `GET /api/admin/fighters` | GET | Listar fighters com completeness |
| `POST /api/admin/fighters` | POST | **Criar novo fighter** (+ FighterWork) |
| `PATCH /api/admin/fighters/[id]` | PATCH | Atualizar campos: curationStatus, imageUrl, curatorOverview*, musicYoutubeId/Title/Artist, musicStatus |
| `GET /api/admin/fighters/[id]/detail` | GET | Detalhes completos do fighter (bios + worksEras) |
| `GET /api/admin/fighters/[id]/bios` | GET | Todas as bios do fighter |
| `POST /api/admin/fighters/[id]/bios` | POST | Upsert bio (cria ou atualiza) para era + idioma |
| `GET /api/admin/fighters/[id]/collectibles` | GET | Colecionáveis do fighter (`?type=TROPHY\|SPIRIT\|STICKER`) |
| `PATCH /api/admin/collectibles/[id]` | PATCH | Atualizar name/nameJp/description*/assetRenderUrl de coletável |

### Construtor
| Endpoint | Método | Função |
|---|---|---|
| `GET /api/admin/franchises` | GET | Listar todas as franquias (para dropdowns) |
| `POST /api/admin/franchises` | POST | **Criar nova franquia** |
| `GET /api/admin/games/smash` | GET | Os 5 jogos Smash com IDs + era (para FighterWork) |
| `POST /api/admin/collectibles` | POST | **Criar novo coletável** |
| `GET/POST /api/admin/music-tracks` | GET/POST | Listar/criar faixas de palco (modelo `Music`) |
| `GET/POST /api/admin/stages` | GET/POST | Listar/criar palcos |
| `POST /api/admin/chronicles` | POST | **Criar nova entrada de crônica** |

### Chronicles / Music
| Endpoint | Método | Função |
|---|---|---|
| `GET /api/admin/chronicles` | GET | Listar entradas com filtros/paginação |
| `PATCH /api/admin/chronicles/[id]` | PATCH | Atualizar wikiUrl e/ou boxArtUrl |
| `POST /api/admin/chronicles/fetch-preview` | POST | Scraper inline — retorna candidatos de imagem |
| `GET /api/admin/chronicles/consoles` | GET | Lista de consoles distintos |
| `GET /api/admin/music` | GET | Listar fighters com dados de música |
| `PATCH /api/admin/music/[id]` | PATCH | Atualizar dados de música |

---

## Construtor (`/admin/create`)

Página unificada para criar qualquer entidade. Sidebar com 8 tipos:

| Tipo | O que cria | Campos chave |
|---|---|---|
| **Fighter** | `Fighter` + `FighterWork` | rosterNumber, name, franchiseId, imageUrl, works (checkboxes dos 5 jogos), músicas opcionais |
| **Troféu** | `Collectible` type=TROPHY | smashGameVersion, name, fighter (search), descriptions |
| **Spirit** | `Collectible` type=SPIRIT | smashGameVersion, name, fighter (search), descriptions |
| **Sticker** | `Collectible` type=STICKER | smashGameVersion, name, fighter (search) |
| **Música** | `Music` (faixa de palco) | title, franchiseId, arranger, isRemix |
| **Palco** | `Stage` | name, franchiseId, smashDebutVersion, description |
| **Crônica** | `ChronicleEntry` | consoleName, titleNtsc, titlePal/JP, releaseDates, wikiUrl, boxArtUrl |
| **Franquia** | `Franchise` | name, svgIconUrl |

- **FighterSearch**: autocomplete com delay 300ms sobre `GET /api/admin/fighters?q=`
- **Success banner**: aparece após criar, com "Criar outro" + link para editar
- **Recent creations**: lista em memória das últimas 20 criações da sessão
- **Atualização automática**: após criar Franquia, o dropdown atualiza em todos os formulários

---

## Editor de Fighter (`/admin/fighters/[id]`)

Acesso via "✎ Editar" na curadoria ou "Abrir" no construtor.

### Tabs:
| Tab | Conteúdo |
|---|---|
| **Visão Geral** | Render 3D (URL + preview), Curator Overview (4 idiomas), Música (YT ID/título/artista/status + player) |
| **Bios** | Era selector + Language selector + textarea grande + status grid (qual era/lang tem conteúdo) |
| **Colecionáveis** | Filter Troféus/Spirits/Stickers, lista expansível com campos de edição inline por item |

---

## Scripts CLI (`scripts/admin/`)

### `check-status.ts` — Dashboard de estado
```bash
npx tsx --env-file=.env.local scripts/admin/check-status.ts
```
Mostra barras de progresso para cada dimensão do projeto. **Rodar antes de qualquer sessão** para entender o que falta.

### `export-missing.ts` — Exportar para edição manual
```bash
# Exportar tudo sem box art (padrão)
npx tsx --env-file=.env.local scripts/admin/export-missing.ts

# Filtros disponíveis:
--filter=missing_wiki      # Só sem wikiUrl
--filter=missing_art       # Só sem boxArtUrl (padrão)
--filter=missing_wiki_or_art  # Ambos
--console="GAME BOY"       # Filtrar por console
```
Output: `scripts/admin/curated-data.json`

O JSON já vem com **sugestão automática de wikiUrl** baseada no título NTSC. Edite as URLs erradas diretamente no arquivo.

### `import-curated.ts` — Aplicar edições ao banco
```bash
npx tsx --env-file=.env.local scripts/admin/import-curated.ts
npx tsx --env-file=.env.local scripts/admin/import-curated.ts --dry-run   # preview sem salvar
npx tsx --env-file=.env.local scripts/admin/import-curated.ts --file=outro.json
```
Lê o `curated-data.json` e atualiza o banco com os campos preenchidos.

### `fetch-batch-boxarts.ts` — Buscar capas em lote
```bash
npx tsx --env-file=.env.local scripts/admin/fetch-batch-boxarts.ts
npx tsx --env-file=.env.local scripts/admin/fetch-batch-boxarts.ts --dry-run
```
Para cada entrada do JSON que tem `wikiUrl` mas não tem `boxArtUrl`, faz scraping automático e salva. Atualiza também o JSON com as novas URLs.

### `populate-fighter-works.ts` — Aparições nos jogos Smash ✅ JÁ RODADO
```bash
npx tsx --env-file=.env.local scripts/admin/populate-fighter-works.ts
```
Cria FighterWork para todos os 87 fighters. Também cria os 5 jogos Smash se não existirem no banco.
**Status: 219 entradas criadas (2026-06-06) — não precisa rodar novamente a menos que o banco seja resetado.**

---

## Fluxo de Curadoria Recomendado para Chronicles

```
# Passo 1 — Ver estado atual
npx tsx --env-file=.env.local scripts/admin/check-status.ts

# Passo 2 — Exportar entradas sem wikiUrl
npx tsx --env-file=.env.local scripts/admin/export-missing.ts --filter=missing_wiki

# Passo 3 — Editar scripts/admin/curated-data.json
#   Corrigir wikiUrl para cada entrada (sugestões já geradas automaticamente)
#   Dica: abrir no VS Code e usar Ctrl+F para buscar por título

# Passo 4 — Aplicar ao banco
npx tsx --env-file=.env.local scripts/admin/import-curated.ts

# Passo 5 — Buscar capas automaticamente
npx tsx --env-file=.env.local scripts/admin/fetch-batch-boxarts.ts

# Passo 6 — Limpar falsos positivos
npx tsx --env-file=.env.local scripts/scrapers/fix-chronicles-false-positives.ts

# Passo 7 — Entradas que ainda falharam → editar manualmente no /admin/chronicles
```

---

## Formato do curated-data.json

```json
[
  {
    "id": "clxxxxx",
    "wikiUrl": "https://en.wikipedia.org/wiki/Star_Fox_64",  ← edite este
    "boxArtUrl": null,                                        ← deixe null (será preenchido)
    "_console": "Nintendo 64",       ← somente leitura
    "_titleNtsc": "Star Fox 64",     ← somente leitura
    "_titleJp": "スターフォックス64", ← somente leitura
    "_releaseDate": "1997"           ← somente leitura
  }
]
```

Campos com `_` prefixo são somente-leitura (metadados para referência). Edite apenas `wikiUrl` e `boxArtUrl`.

---

## Notas

- **Rate limiting**: `fetch-batch-boxarts.ts` e scrapers similares têm delay de 1.3s+jitter entre requests + pausa de 5s a cada 30
- **Falsos positivos**: rodar `fix-chronicles-false-positives.ts` após qualquer scraping em lote
- **Lazy loading**: Zelda, Pokémon, Kirby, Metroid, Wii Sports não funcionam com fetch simples — editar manualmente no `/admin/chronicles`
