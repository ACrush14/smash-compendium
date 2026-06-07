# Sistema: ETL / Scrapers

**Pasta:** `scripts/scrapers/`
**Runtime:** `npx tsx --env-file=.env.local` (NUNCA ts-node)

---

## Scripts Disponíveis

### `scripts/scrapers/` — ETL / Ingestão de dados

| Script | Função |
|---|---|
| `character-article.ts` | Bio + troféus + stickers da SSBWiki |
| `fetch-images.ts` | Imagens: render, troféus, sprite, spirit |
| `fighters.ts` | Bulk insert dos 87 fighters |
| `index.ts` | Orquestrador do ETL completo |
| `utils.ts` | Helpers: rate limiting, fetchHtml |
| `fetch-chronicles-boxarts-v2.ts` | Box arts do Chronicles |
| `fix-chronicles-false-positives.ts` | Limpa falsos positivos no Chronicles |
| `fetch-all-boxarts.ts` | Box arts dos origin games (já rodado) |
| `scrape-jp-bios.ts` | Bios em japonês da SSBWiki JP |

### `scripts/admin/` — Curadoria e manutenção ✨ NOVO (sessão 19)

| Script | Função |
|---|---|
| `check-status.ts` | Dashboard de progresso do projeto — rodar antes de qualquer sessão |
| `populate-fighter-works.ts` | Cria FighterWork + Games (✅ JÁ RODADO — 219 entradas) |
| `export-missing.ts` | Exporta Chronicles com dados faltando para `curated-data.json` |
| `import-curated.ts` | Aplica edições do `curated-data.json` ao banco |
| `fetch-batch-boxarts.ts` | Scraping de box arts em lote a partir do JSON |

Ver `context/admin-curation.md` para documentação completa e fluxo de uso.

---

## Como Rodar o ETL de um Fighter

```bash
# Textos (bio, troféus, stickers)
npx tsx --env-file=.env.local scripts/scrapers/character-article.ts --fighter="Mario"

# Imagens (render, troféus, sprite, spirit)
npx tsx --env-file=.env.local scripts/scrapers/fetch-images.ts --fighter="Mario"

# Verificar resultado
npx tsx --env-file=.env.local -e "
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
db.fighter.findFirst({
  where: { name: 'Mario' },
  include: { bios: true, collectibles: { where: { type: { in: ['TROPHY','SPIRIT'] } } } }
}).then(f => {
  console.log('bios:', f.bios.length);
  console.log('trophies:', f.collectibles.filter(c=>c.type==='TROPHY').length);
  console.log('spirits:', f.collectibles.filter(c=>c.type==='SPIRIT').length);
  db.\$disconnect();
});
"
```

## Fonte de Dados

**SSBWiki** — `https://www.ssbwiki.com/{Fighter_Name}`
- Bios: seção "In Super Smash Bros. [game]"
- Troféus: pares `<dt>/<dd>` em `<dl>` com ícone de bandeira NTSC/PAL
- Imagens: infobox da página

**SSBWiki JP** — `https://smashwiki.info/{名前}`
- Bios JP: seção "ゲーム中の解説" com badges "64"/"DX"/"X"/"3U"/"SP"
- Cobertura: SSB64-SSB4 (fighters com troféus). Fighters SSBU-only não têm bios JP.

**ssbuspirits.com** — `https://ssbuspirits.com/spirits/{slug}`
- Texto descritivo dos spirits (só fighters Nintendo originais — não 3rd party)

---

## Rate Limiting (Obrigatório)

```typescript
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Entre cada request:
await sleep(1300 + Math.random() * 400);

// A cada 30 requests:
if ((i + 1) % 30 === 0) {
  console.log("  [pausing 5s]");
  await sleep(5000);
}
```

**Por quê:** SSBWiki bloqueia IPs que fazem requests rápidos demais.

---

## Padrão de User-Agent

```typescript
const UA = "SmashCompendiumBot/1.0 (academic fan project; contact: anderson.crush.link@gmail.com)";
```

---

## Extração de Box Arts (Wikipedia/MarioWiki)

```typescript
async function extractBoxArtUrl(pageUrl: string): Promise<string | null> {
  const res = await fetch(pageUrl, { headers: { "User-Agent": UA } });
  const $ = cheerio.load(await res.text());
  let imgUrl: string | null = null;

  // Seletores em ordem de prioridade
  const selectors = [".infobox-image img", "table.infobox img", ".infobox img"];

  for (const sel of selectors) {
    if (imgUrl) break;
    $(sel).each((_, el) => {
      if (imgUrl) return;
      const raw = $(el).attr("src") ?? $(el).attr("data-src") ?? "";
      let resolved = raw.startsWith("//") ? `https:${raw}` : raw;
      // Aceitar só CDNs de imagem
      if (!resolved.includes("upload.wikimedia.org") && !resolved.includes("wiki.gallery")) return;
      // Filtrar falsos positivos
      if (resolved.match(/cc-by|cc-0|poweredby|license/i)) return;
      if (resolved.match(/\.svg(?:\.png)?/i)) return;
      if (resolved.match(/Cscr-|featured|disambig|logo/i)) return;
      imgUrl = resolved;
    });
  }

  // Converter thumbnail → full-res
  if (imgUrl?.includes("/thumb/")) {
    imgUrl = imgUrl.replace("/thumb/", "/").replace(/\/\d+px-[^/]+$/, "");
  }
  return imgUrl;
}
```

---

## Fighters sem ETL (86 fighters)

Apenas **Ness** tem dados completos. Os outros 86 precisam de:
1. Bios EN (já existem via bulk insert? checar)
2. Troféus com imagens
3. Render SSBU
4. Spirits (onde disponível)

**Como verificar quem falta:**
```bash
npx tsx --env-file=.env.local -e "
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
db.fighter.findMany({
  where: { collectibles: { none: { type: 'TROPHY' } } },
  select: { name: true, rosterNumber: true }
}).then(rows => { rows.forEach(r => console.log(r.rosterNumber, r.name)); db.\$disconnect(); });
"
```

---

## Bios JP — Cobertura Atual

Script: `scripts/scrapers/scrape-jp-bios.ts`

**15 fighters com bios JP salvas:**
Mr. Game & Watch, Olimar, Rosalina & Luma, Little Mac, Greninja, Palutena, Pac-Man, Robin, Shulk, Bowser Jr., Duck Hunt, Ryu, Cloud, Corrin, Bayonetta + Ness

**Fighters SSBU-only/DLC sem bios JP** (formato diferente — sem troféus):
Inkling, Ridley, King K. Rool, Joker, Hero, Banjo & Kazooie, Terry, Byleth, Min Min, Steve, Sephiroth, Pyra/Mythra, Kazuya, Sora

**Fix parcial:** Slugs corrigidos no script:
- Byleth → ベレト
- Steve → スティーブ
- Ken → ケン・マスターズ
