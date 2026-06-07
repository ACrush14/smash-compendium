# Sistema: Box Arts (Capas de Jogos)

Existem dois tipos de box art no projeto:
1. **Origin Games** — capas dos jogos de origem dos fighters (baixadas localmente)
2. **Chronicles** — capas dos jogos na timeline do Nintendo (URLs externas no banco)

---

## 1. Box Arts de Origin Games

**Localização:** `public/assets/games/`
**Status:** 36/37 jogos baixados (Ball G&W sem imagem)
**Commitadas ao git** — `public/assets/games/` NÃO está no `.gitignore`

### Como usar no código
```typescript
// Em page.tsx — FRANCHISE_ORIGIN_GAMES ou FIGHTER_ORIGIN_GAMES:
{ boxArtPath: "/assets/games/EARTHBOUND_USA_BOX.jpg" }

// Em componentes — SEMPRE <img> com height fixo:
<img src={boxArtPath} style={{ height: 300, width: "auto" }} />
// Nunca <Image fill> — cada console tem proporção diferente
```

### Como adicionar nova capa
1. Baixar a imagem e salvar em `public/assets/games/NOME.jpg`
2. Em `app/fighters/[slug]/page.tsx`, adicionar `boxArtPath` na entrada correspondente

### Script de scraping (já rodado)
`scripts/scrapers/fetch-all-boxarts.ts` — extrai capas da Wikipedia/MarioWiki.

---

## 2. Box Arts do Chronicles

**Armazenamento:** Campo `ChronicleEntry.boxArtUrl` no banco (URL externa)
**Não são baixadas localmente** — são servidas diretamente do CDN da Wikipedia ou MarioWiki

### CDNs Suportados (whitelistados em `next.config.mjs`)

```javascript
// next.config.mjs
remotePatterns: [
  { protocol: "https", hostname: "www.ssbwiki.com",           pathname: "/images/**" },
  { protocol: "https", hostname: "ssb.wiki.gallery",          pathname: "/images/**" },
  { protocol: "https", hostname: "upload.wikimedia.org",      pathname: "/wikipedia/**" },
  { protocol: "https", hostname: "mario.wiki.gallery",        pathname: "/images/**" },
  { protocol: "https", hostname: "earthbound.fandom.com",     pathname: "/**" },
  { protocol: "https", hostname: "static.wikia.nocookie.net", pathname: "/**" },
]
```

**Se adicionar novo CDN**, lembrar de adicionar em `next.config.mjs`.

### Como funciona o scraping

```typescript
// 1. Buscar entradas sem boxArtUrl mas com wikiUrl
const entries = await db.chronicleEntry.findMany({
  where: { boxArtUrl: null, wikiUrl: { not: null } }
});

// 2. Para cada entrada, extrair URL da capa da página Wikipedia
const imgUrl = await extractBoxArtUrl(entry.wikiUrl);

// 3. Salvar no banco
await db.chronicleEntry.update({
  where: { id: entry.id },
  data: { boxArtUrl: imgUrl }
});
```

### Converter Thumbnail → Full Resolution

```typescript
// Wikipedia: /thumb/a/ab/file.jpg/200px-file.jpg → /a/ab/file.jpg
// MarioWiki: /images/thumb/a/ab/file.jpg/250px-file.jpg → /images/a/ab/file.jpg
if (imgUrl.includes("/thumb/")) {
  imgUrl = imgUrl.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
}
```

### Filtrar Falsos Positivos

```typescript
if (resolved.match(/cc-by|cc-0|creative.commons|copyright|license|poweredby/i)) return;
if (resolved.match(/\.svg(?:\.png)?/i)) return;   // SVG badges
if (resolved.match(/Cscr-|featured|disambig|question_mark|OOjs_UI|search/i)) return;
if (resolved.match(/[_-]logo\.(png|jpg|gif|svg)/i)) return;  // logos
if (resolved.match(/Logo\.(png|jpg)/i)) return;
if (resolved.match(/88x31/i)) return;  // banner MediaWiki
if (resolved.match(/pictochat/i)) return;
```

### Páginas com Lazy Loading (não funcionam com fetch simples)

- The Legend of Zelda series
- Pokémon series
- Kirby series
- Metroid series
- Wii Sports, Wii Play
- Star Fox series
- Alguns jogos GCN e Wii

**Alternativa:** MediaWiki Action API
```
GET https://en.wikipedia.org/w/api.php
  ?action=query&titles=Wind_Waker&prop=images&imlimit=30&format=json&redirects=1
→ lista de File: names

GET https://en.wikipedia.org/w/api.php
  ?action=query&titles=File:WindWaker_GCN.jpg&prop=imageinfo&iiprop=url&format=json
→ URL direta da imagem
```

---

## next.config.mjs — Adicionar Novo Domínio

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      // Adicionar aqui:
      { protocol: "https", hostname: "novo-cdn.exemplo.com", pathname: "/images/**" },
    ],
  },
};
```
