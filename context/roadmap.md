# Roadmap — Smash Compendium

Demandas pendentes organizadas por área. Cada item inclui descrição do problema e estratégia de resolução.

---

## Chronicles

### 1. Música: Trophies (Brawl) no Chronicles
**Prioridade:** Alta  
**Status:** Pendente

O Chronicles deve reproduzir a trilha *"Trophies"* do Super Smash Bros. Brawl em loop enquanto o usuário navega pela página. Essa música está associada ao modo Coleção/Troféus do Brawl e combina com o clima de museu do Chronicles.

**Como resolver:**
- Localizar a faixa no banco (`MusicTrack` onde `gameTitle` contém "Brawl" e `title` contém "Trophies" ou "Trophy").
- Usar um `<audio>` element ou hook `useAudio` no `app/chronicles/page.tsx` com autoplay muted + unmute on interaction (política de autoplay dos navegadores).
- Adicionar botão de volume/mute no canto da página para o usuário controlar.
- Fallback: se a URL da faixa estiver morta, usar a URL de YouTube embed via iframe oculto.

---

### 2. Mood visual inspirado no Brawl
**Prioridade:** Alta  
**Status:** Pendente

O visual atual do Chronicles não remete ao Brawl. O Chronicles do Brawl usa uma paleta escura com tons sépia/dourado, tipografia manuscrita estilizada, texturas de papel envelhecido e um clima de "livro de história".

**Como resolver:**
- Referência visual: [Subspace Emissary / Adventure Mode — Brawl UI](https://www.ssbwiki.com/The_Subspace_Emissary).
- Paleta: fundos em `#1a1208` (sépia escuro), textos em `#e8d5a0` (dourado envelhecido), detalhes em `#8b6914` (bronze).
- Tipografia: fonte serifada ou "medieval" para títulos (ex: Google Fonts `Cinzel` ou `MedievalSharp`).
- Textura: adicionar SVG ou CSS de textura de papel/pergaminho no background.
- Cards dos jogos: borda estilo moldura dourada, sombra interna, sem cantos modernos.
- Animação de entrada: os jogos surgem como se fossem páginas de um livro sendo virado.

---

### 3. Ordenação por data de lançamento
**Prioridade:** Alta  
**Status:** Pendente

As entradas do Chronicles devem ser exibidas em ordem cronológica de lançamento — mais antigo primeiro. Atualmente a ordenação não é garantida.

**Como resolver:**
- Na query do banco em `app/chronicles/page.tsx`, adicionar `orderBy: [{ releaseDateJp: 'asc' }, { releaseDateNtsc: 'asc' }]`.
- Tratar entradas com data `null`: colocá-las no final.
- Datas estão em formatos variados (`"1997"`, `"1997/04/27"`) — converter para comparação: extrair o ano como número inteiro para um `ORDER BY` SQL confiável ou fazer ordenação no `map` com `parseInt(date)`.
- Dentro do mesmo console, ordenar por data de lançamento japonesa (geralmente primeiro).

---

### 4. Equivalências JP ↔ Internacional
**Prioridade:** Média  
**Status:** Pendente

Muitos jogos lançados primeiro no Japão foram lançados internacionalmente com título diferente (ex: *"Mother"* → *"EarthBound Beginnings"*). O Chronicles deve indicar essa equivalência visualmente.

**Como resolver:**
- Adicionar campo `equivalentEntryId String?` no `ChronicleEntry` (Prisma migration) apontando para a entrada equivalente no outro mercado.
- Alternativa sem migration: fazer matching automático por `titleJpEn` vs `titleNtsc` no frontend — se dois registros do mesmo console têm título muito similar, linkar visualmente.
- Na UI: exibir badge "Versão JP de [título internacional]" ou "Lançado como [título JP] no Japão" com link entre as duas entradas.
- Script de curadoria: `scripts/admin/link-jp-equivalences.ts` — usa similaridade de bigramas para sugerir pares ao administrador, que confirma via admin UI.

---

### 5. GIF de gameplay por jogo
**Prioridade:** Média  
**Status:** Pendente

Cada jogo no Chronicles deve ter um GIF animado de gameplay de alta qualidade (30fps, loop) para dar vida à entrada sem precisar de vídeo embutido.

**Como resolver:**
- Campo no modelo: `gameplayGifUrl String?` no `ChronicleEntry`.
- Fonte primária: [Giphy](https://giphy.com) e [Tenor](https://tenor.com) têm GIFs de praticamente todos os jogos clássicos — scraper via API pública.
  - `GET https://api.giphy.com/v1/gifs/search?q={titulo}&rating=g&limit=5&api_key={KEY}`
- Fonte secundária: converter clipes de gameplay do YouTube via `yt-dlp + ffmpeg`:
  ```bash
  yt-dlp -f best "URL_DO_CLIP" -o clip.mp4
  ffmpeg -i clip.mp4 -vf "fps=30,scale=480:-1" -loop 0 output.gif
  ```
- Para otimização de tamanho: usar WebP animado (`.webp`) ou `<video autoplay loop muted playsinline>` com arquivo `.mp4` de 3-5s — muito menor que GIF mas visualmente idêntico.
- Na UI: exibir como overlay hover no card do jogo, ou em destaque quando o card é selecionado.

---

### 6. Associação jogo → personagem / Sticker / Spirit
**Prioridade:** Alta  
**Status:** Pendente

Cada jogo no Chronicles deve estar associado a pelo menos um Fighter, Sticker ou Spirit do seu universo. Isso conecta o museu de jogos com o acervo de colecionáveis.

**Como resolver:**
- Relação existente: `Fighter` já tem `franchiseId` e `Franchise` tem `name`. `ChronicleEntry` tem `consoleName` mas não tem relação direta com franchises.
- Adicionar campo `franchiseId String?` no `ChronicleEntry` (migration) referenciando `Franchise`.
- Script de associação automática: `scripts/admin/link-chronicles-to-franchises.ts` — faz match entre `titleNtsc`/`titleJp` e `franchise.name` por bigramas.
- Na página Chronicles: para cada entrada, exibir mini-cards dos personagens/stickers/spirits dessa franquia, usando a relação `Franchise → Fighter[]` e `Franchise → Collectible[]`.
- Adicionar campo `gameId String?` no `ChronicleEntry` referenciando o `Game` de Smash correspondente (ex: o jogo Brawl tem entradas do Chronicles associadas ao universo de cada lutador de Brawl).

---

### 7. Vídeo de gameplay — link para longplay
**Prioridade:** Média  
**Status:** Pendente

Cada jogo deve ter um botão que leve o usuário a assistir um longplay (gameplay completo) em vídeo.

**Como resolver:**
- Campo no modelo: `longplayUrl String?` no `ChronicleEntry`.
- Fonte principal: [YouTube — World of Longplays](https://www.youtube.com/@WorldofLongplays) tem longplays de praticamente todos os jogos da coleção.
- Script de preenchimento: `scripts/admin/fill-longplay-urls.ts` — usa YouTube Data API v3 (`search.list?q={titulo}+longplay&channelId=UCVi6ofFy7QyJJrZ9l0-OxnA`) para buscar o vídeo e salvar a URL.
- Na UI: botão "▶ Longplay" no card do jogo — abre em nova aba (`target="_blank"`) direto no YouTube.
- Alternativa sem script: admin UI na página `/admin/chronicles` já tem o campo `wikiUrl` — adicionar campo `longplayUrl` ao mesmo formulário.

---

### 8. Botão JOGAR — emulador online via savestate
**Prioridade:** Baixa (complexidade alta)  
**Status:** Pendente (requer análise legal)

Cada jogo deve ter um botão "JOGAR" que abre o jogo diretamente no navegador, iniciando de um savestate pré-configurado (começo do jogo ou momento representativo).

**Como resolver:**
- Plataforma: [EmulatorJS](https://emulatorjs.org) — biblioteca open-source que roda emuladores no browser via WebAssembly. Suporta NES, SNES, N64, GBA, DS, PS1, entre outros.
- Implementação:
  1. Hospedar as ROMs em storage privado (ex: Supabase Storage com bucket privado ou R2 Cloudflare).
  2. Adicionar campo `romUrl String?` e `savestateUrl String?` no `ChronicleEntry`.
  3. Criar página `/play/[id]` que carrega o EmulatorJS com a ROM e o savestate.
  4. O botão "JOGAR" no Chronicles linka para `/play/[id]`.
- Atenção legal: distribuição de ROMs é ilegal sem licença. Opções legais:
  - Usar apenas ROMs de domínio público (homebrew, freeware).
  - Integrar com [Internet Archive](https://archive.org/details/software) que hospeda ROMs legalmente para preservação.
  - Usar a API do Internet Archive: `https://archive.org/advancedsearch.php?q={titulo}&output=json`.
- Savestate: gravar e exportar um savestate na tela de título ou intro do jogo usando RetroArch localmente, depois hospedar o arquivo.

---

## Stickers

### 9. Corrigir imagens erradas dos Stickers
**Prioridade:** Alta  
**Status:** Pendente

Alguns stickers estão exibindo imagens incorretas — provavelmente por erro de matching durante o ETL de ingestão dos dados do SSBWiki.

**Como resolver:**
- Identificar os stickers com imagens erradas: navegar em `/collectibles?type=STICKER` e anotar os IDs problemáticos.
- Verificar a URL de origem (`imageUrl`) no banco — pode ser que o scraper tenha pego a imagem errada da página do SSBWiki.
- Script de verificação: comparar `Collectible.name` com o nome do arquivo na `imageUrl` — se não baterem (ex: nome "Mario" mas arquivo "link.png"), listar para curadoria.
- Correção: atualizar `imageUrl` manualmente via admin UI ou script de re-scraping.
- Fonte correta: páginas do SSBWiki como `https://www.ssbwiki.com/Sticker` listam todos os stickers com imagens.

---

## Música

### 10. Corrigir músicas com vídeos mortos
**Prioridade:** Alta  
**Status:** Pendente

Faixas de música estão linkando para vídeos do YouTube que foram removidos (erro 404 ou privados), resultando em players quebrados.

**Como resolver:**
- Script de validação: `scripts/admin/validate-music-urls.ts` — para cada `MusicTrack` com `youtubeUrl`, faz `fetch` do `https://www.youtube.com/oembed?url={URL}&format=json` e verifica se retorna 200 (vídeo existe) ou 404/403 (morto).
- Para os mortos: buscar substituto na YouTube Data API por `q="{trackTitle} {gameTitle} OST"`.
- Atualizar `youtubeUrl` no banco para os casos encontrados.
- Longo prazo: migrar para usar IDs de vídeo do YouTube em vez de URLs completas, facilitando validação.

---

## Sugestões

### 11. Músicas originais dos jogos em momentos específicos
**Prioridade:** Baixa  
**Status:** Sugestão

Reproduzir a OST original de cada jogo na página do jogo ou quando o usuário interage com um item do Chronicles/Collectibles relacionado.

**Como resolver:**
- Usar a relação `ChronicleEntry → MusicTrack` via `franchiseId` ou `gameTitle` matching.
- Na página de detalhe do jogo (Chronicles card expandido), autoplay da música principal daquele jogo.
- Para o Chronicles geral: ao fazer scroll e um jogo entrar na viewport (Intersection Observer), fade-in da música daquele jogo substituindo a trilha atual.
- Volume: sempre começa em 30% para não assustar o usuário; controle de volume acessível.

---

### 12. Layout mobile
**Prioridade:** Média  
**Status:** Sugestão

O site não tem otimização específica para telas pequenas. Em mobile, o layout quebra em diversas páginas.

**Como resolver:**
- Auditoria: testar cada rota principal (`/`, `/fighters`, `/chronicles`, `/collectibles`) em viewport de 390px (iPhone 14) usando `preview_resize`.
- Estratégia por componente:
  - **Header:** menu hambúrguer para telas < 768px.
  - **Grid de fighters/collectibles:** `grid-cols-1` em mobile, `grid-cols-2` em tablet, `grid-cols-3+` em desktop.
  - **Chronicles:** stack vertical de cards em mobile (sem colunas laterais).
  - **Tabelas admin:** scroll horizontal com `overflow-x-auto`.
- CSS: usar Tailwind breakpoints `sm:`, `md:`, `lg:` consistentemente em vez de valores fixos de pixel.
- Fonte: reduzir `font-size` base em mobile (14px vs 16px desktop).
- Touch: aumentar áreas clicáveis para mínimo de 44×44px (guideline Apple/Google).
- Testar no Chrome DevTools Device Toolbar antes de considerar concluído.

---

## Índice de Prioridades

| # | Item | Área | Prioridade | Complexidade |
|---|---|---|---|---|
| 1 | Música Trophies Brawl no Chronicles | Chronicles | Alta | Baixa |
| 2 | Mood visual Brawl | Chronicles | Alta | Média |
| 3 | Ordenação por data de lançamento | Chronicles | Alta | Baixa |
| 9 | Corrigir stickers errados | Stickers | Alta | Média |
| 10 | Corrigir músicas mortas | Música | Alta | Média |
| 6 | Associação jogo → Fighter/Spirit/Sticker | Chronicles | Alta | Alta |
| 4 | Equivalências JP ↔ Internacional | Chronicles | Média | Média |
| 5 | GIF de gameplay | Chronicles | Média | Média |
| 7 | Link para longplay | Chronicles | Média | Baixa |
| 12 | Layout mobile | Geral | Média | Alta |
| 11 | Músicas originais nos jogos | Música | Baixa | Média |
| 8 | Botão JOGAR (emulador) | Chronicles | Baixa | Muito Alta |
