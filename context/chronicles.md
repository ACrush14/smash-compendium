# Sistema: Chronicles

**Rota:** `/chronicles`
**Arquivo:** `app/chronicles/page.tsx`
**Modelo:** `ChronicleEntry` (Prisma)

---

## O que é

Timeline cronológica de jogos Nintendo que aparecem no Super Smash Bros. (via SmashWiki). Cada entrada representa um jogo com console, título, datas de lançamento e capa.

## Modelo ChronicleEntry

```prisma
model ChronicleEntry {
  id              String   @id
  consoleName     String   // ex: "Nintendo 64", "GAME BOY"
  titleNtsc       String   // ex: "Star Fox 64" (pode ser "JP EXCLUSIVE" ou "PAL EXCLUSIVE")
  titlePal        String?  // ex: "Lylat Wars"
  titleJp         String?
  titleJpEn       String?  // Romanização
  titleJpPt       String?
  releaseDateNtsc String?  // ex: "1997" ou "1997/04/27"
  releaseDatePal  String?
  releaseDateJp   String?
  wikiUrl         String?  // URL Wikipedia/SSBWiki usada para buscar box art
  boxArtUrl       String?  // URL externa da imagem (CDN Wikipedia ou MarioWiki)
}
```

## Estado Atual

| Métrica | Valor |
|---|---|
| Total de entradas | 947 |
| Com boxArtUrl | 263 (~28%) |
| Sem wikiUrl | 558 (~59%) |
| Falhas por lazy loading | ~126 |

## Admin Web UI — `/admin/chronicles` ✨ NOVO (sessão 19)

Página de curadoria visual para editar wikiUrl e capa de cada entrada:

```
http://localhost:3000/admin/chronicles
```

**Funcionalidades:**
- Filtrar por: "Sem capa", "Sem wiki", "Sem ambos", console específico, busca por título
- Por entrada: editar wikiUrl + boxArtUrl, botão Eye (auto-scrape), preview de candidatos
- Paginação: 50 entradas/página
- Salvar diretamente no banco

**API routes criadas:**
| Endpoint | Método | Função |
|---|---|---|
| `/api/admin/chronicles` | GET | Listar com filtros + paginação |
| `/api/admin/chronicles/[id]` | PATCH | Atualizar wikiUrl/boxArtUrl |
| `/api/admin/chronicles/fetch-preview` | POST | Scraper inline → candidatos |
| `/api/admin/chronicles/consoles` | GET | Consoles distintos |

---

## Box Arts — Scripts

```bash
# Buscar box arts (processa entradas com wikiUrl e sem boxArtUrl)
npx tsx --env-file=.env.local scripts/scrapers/fetch-chronicles-boxarts-v2.ts

# Limpar falsos positivos após rodar o scraper
npx tsx --env-file=.env.local scripts/scrapers/fix-chronicles-false-positives.ts

# Opções do scraper
--dry-run              # Não salva no banco
--limit=N              # Processar só N entradas
--console="GAME BOY"   # Filtrar por console
```

**Scripts admin (curadoria em lote):**
```bash
# Exportar entradas sem wikiUrl para edição manual
npx tsx --env-file=.env.local scripts/admin/export-missing.ts --filter=missing_wiki

# Após editar curated-data.json, importar
npx tsx --env-file=.env.local scripts/admin/import-curated.ts

# Buscar capas para todas as entradas com wikiUrl no JSON
npx tsx --env-file=.env.local scripts/admin/fetch-batch-boxarts.ts
```
Ver `context/admin-curation.md` para fluxo completo.

## Como o Scraper Funciona (`fetch-chronicles-boxarts-v2.ts`)

1. Busca entradas onde `wikiUrl != null AND boxArtUrl = null`
2. Faz fetch da página Wikipedia/MarioWiki via cheerio
3. Procura imagem no infobox: `.infobox-image img`, `table.infobox img`
4. Filtra falsos positivos (SVGs, licenças CC, logos MediaWiki)
5. Converte thumbnail para full-res: `/thumb/a/b/file.jpg/200px-file.jpg` → `/a/b/file.jpg`
6. Salva `boxArtUrl` no banco

## CDNs de Imagem Suportados

- `upload.wikimedia.org` — Wikipedia
- `mario.wiki.gallery` — MarioWiki
- Ambos whitelistados em `next.config.mjs`

## Por que Algumas Entradas Falham

Páginas de Zelda, Pokémon, Kirby, Metroid, Star Fox, Wii Sports usam **JavaScript lazy loading** para carregar imagens. O `fetch` simples não executa JS.

**Solução alternativa (não implementada):**
Usar MediaWiki Action API:
```
GET https://en.wikipedia.org/w/api.php?action=query&titles=Wind_Waker&prop=images&imlimit=30&format=json
GET https://en.wikipedia.org/w/api.php?action=query&titles=File:WindWaker_GCN.jpg&prop=imageinfo&iiprop=url&format=json
```

## Entradas sem wikiUrl (558)

Precisam de `wikiUrl` populada antes de qualquer scraping. Opções:
1. **Manual** — editar via admin ou diretamente no banco
2. **Script automático** — fazer match `titleNtsc` → URL Wikipedia gerada automaticamente
   ```typescript
   const autoUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, "_"))}`;
   ```
   (atenção: títulos ambíguos podem ir para página de desambiguação)

## Falsos Positivos — Padrões Filtrados

O `fix-chronicles-false-positives.ts` remove:
- `poweredby_mediawiki_88x31.png`
- `cc-by-sa.png`, `cc-by.png`
- `*_logo.png`, `*Logo.png`
- `Pictochat_logo.png`, `Big_Brain_Academy_Logo.png`
- Qualquer URL com: `/poweredby/`, `/cc-by/`, `/88x31/`, `/Cscr-featured/`

## Consoles no Chronicles

```
ARCADE, GAME & WATCH, NES, GAME BOY, SUPER NINTENDO ENTERTAINMENT SYSTEM,
VIRTUAL BOY, NINTENDO 64, GAME BOY COLOR, GAME BOY ADVANCE, NINTENDO GAMECUBE,
NINTENDO DS, Wii, NINTENDO 3DS, Wii U, NINTENDO SWITCH
```
