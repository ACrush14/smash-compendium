<div align="center">

<img src="public/screenshots/home.png" alt="SmashCompendium Banner" width="85%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);"/>

# 🏆 SmashCompendium

### *O Museu Digital Definitivo da Franquia Super Smash Bros.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.5-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Version](https://img.shields.io/badge/Version-V00.201%20Alpha-success?style=for-the-badge)](https://github.com/ACrush14/smash-compendium)
[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 📖 Sobre o Projeto

O **SmashCompendium** é um museu digital e enciclopédia interativa, desenvolvido com foco em preservação histórica e excelência técnica, dedicado ao universo da franquia **Super Smash Bros.** A plataforma cataloga e preserva com profundidade acadêmica todos os lutadores, troféus 3D, spirits, stickers, trilhas sonoras e cronologias de jogos desde o clássico **Super Smash Bros. (64)** até o **Super Smash Bros. Ultimate**.

Diferente de wikis tradicionais, o compêndio oferece uma **experiência multilíngue avançada (EN, PT-BR, JP e JP→EN)**, imersão audiovisual através do **MediaVault** (player integrado de trilhas sonoras por lutador) e interconexão direta com o **Nintendo Chronicles** — um catálogo relacional com mais de 1.270 jogos que serve como fonte única de verdade para as origens de cada personagem e colecionável.

> Projeto acadêmico, fan-made e de preservação digital desenvolvido com paixão por **[Anderson Crush](https://andersoncrushdev.vercel.app)**.

---

## 📸 Visualização do Sistema & Screenshots

### 🏛️ Visão Geral & Dashboard
<div align="center">
  <img src="public/screenshots/home.png" alt="Tela Inicial SmashCompendium" width="100%" style="border-radius: 8px;"/>
  <p><i>Tela inicial do museu com acesso imediato ao acervo de lutadores, colecionáveis e catálogo de jogos.</i></p>
</div>

---

### 🥊 Catálogo de Lutadores & Perfil Interativo
| Roster Completo dos Lutadores | Perfil Detalhado do Lutador (Ex: Ness) |
| :---: | :---: |
| <img src="public/screenshots/fighters.png" alt="Roster de Lutadores" width="100%"/> | <img src="public/screenshots/fighter-ness.png" alt="Página do Ness" width="100%"/> |
| *Navegação temporal por todas as eras (SSB64 ao SSBU), ordenado pelo Roster Oficial.* | *MediaVault com músicas do personagem, timeline de biografias por jogo e lista de golpes em 4 idiomas.* |

---

### 🏆 Galerias de Troféus & Spirit Viewer
| Troféus Clássicos (Melee) | Acervo 3D (Brawl) | Spirit Viewer Interativo |
| :---: | :---: | :---: |
| <img src="public/screenshots/trophies-melee.png" alt="Troféus Melee" width="100%"/> | <img src="public/screenshots/trophies-brawl.png" alt="Troféus Brawl" width="100%"/> | <img src="public/screenshots/spirit-viewer.png" alt="Spirit Viewer" width="100%"/> |
| *Preservação do acervo 3D original do GameCube.* | *Troféus da era Wii catalogados com descrições originais.* | *Inspeção detalhada de Spirits do Ultimate com artes em alta resolução.* |

---

### 📚 Nintendo Chronicles
<div align="center">
  <img src="public/screenshots/chronicles.png" alt="Nintendo Chronicles" width="100%" style="border-radius: 8px;"/>
  <p><i>Catálogo histórico interligando mais de 1.270 jogos da Nintendo às suas respectivas aparições e colecionáveis na franquia Smash.</i></p>
</div>

---

## 💻 Stacks & Tecnologias

A arquitetura do projeto foi construída priorizando performance, SSR (Server-Side Rendering), tipagem estática rigorosa e automação inteligente de processos de extração e tradução de dados.

### ⚡ Core & Framework
- **[Next.js 14.2](https://nextjs.org)** — Framework React com App Router e Server Components para renderização ultrarrápida.
- **[TypeScript 5.4](https://www.typescriptlang.org)** — Tipagem estática avançada garantindo segurança e manutenibilidade do código.
- **[Tailwind CSS 3.4](https://tailwindcss.com)** — Estilização moderna sob demanda, com design system customizado focando em uma estética dark imersiva (*Vault BG / Text*).
- **[Framer Motion](https://www.framer.com/motion/)** — Micro-animações responsivas e transições fluidas de interface.
- **[Lucide React](https://lucide.dev)** — Conjunto de ícones vetoriais consistentes e limpos.

### 🗄️ Banco de Dados & ORM
- **[PostgreSQL (Supabase)](https://supabase.com)** — Banco de dados relacional em nuvem de alta disponibilidade (região `sa-east-1`).
- **[Prisma ORM 5.22](https://www.prisma.io)** — Modelagem relacional complexa interligando universos, lutadores, jogos, músicas e colecionáveis.

### 🤖 IA & Automação de Dados (Scraping/ETL)
- **[Google Gemini API](https://ai.google.dev)** — Integração com `gemini-2.5-flash-lite` via `@google/genai` para tradução contextual e humanizada de biografias e listas de golpes para o Português (PT-BR) e Inglês a partir dos originais japoneses.
- **Cheerio + Fetch Nativo** — Scrapers customizados de alta precisão para extração de dados do *SSBWiki*, *SmashWiki.info* e *ssbuspirits.com*.
- **YouTube Data API & ytsr** — Indexação automatizada para verificação de disponibilidade de faixas musicais.

---

## ✨ Funcionalidades Principais

### 🏛️ Área Pública & Experiência Digital

| Funcionalidade | Descrição |
|---|---|
| **Fighter DataZone** | Enciclopédia completa para todos os **90 lutadores** (incluindo variações de Roster como Squirtle, Ivysaur e Charizard), apresentando biografias e movesets evolutivos separados por era do jogo. |
| **Seletor Multilíngue Global** | Sistema de tradução interativa que permite alternar os textos instantaneamente entre **Inglês (EN)**, **Português (PT-BR)**, **Japonês Original (JP)** e **Tradução JP→EN**. |
| **MediaVault & Player Áudio** | Leitor de mídia e reprodutor áudio dedicado na página de cada personagem, integrado à **CollectiblesMusicBar** (barra global persistente com **1.076 faixas** de SSBU). |
| **Galeria de Colecionáveis** | Acervo navegável e filtrável contendo **~3.334 itens**, divididos em Troféus (SSB64 ao SSB4), Spirits (SSBU) e Stickers (Brawl). |
| **Nintendo Chronicles** | Biblioteca relacional de **~1.270 jogos da Nintendo** com box arts originais e metadados, atuando como a fonte única de verdade para vincular lutadores aos seus jogos de origem (*FighterChronicleLink*). |
| **Navegação Contínua** | Sistema de paginação lateral (`Prev`/`Next`) conectando todos os lutadores na ordem cronológica de entrada no Roster Oficial da franquia. |

### 🛡️ Área do Administrador & Curadoria

| Funcionalidade | Descrição |
|---|---|
| **Painel de Controle de Mídias** | Rotas administrativas protegidas via middleware (`/admin/*`) para revisão de integridade de dados do acervo. |
| **Curadoria de Músicas** | Interface dedicada em `/admin/music-tracks` para auditar, testar e substituir links de áudio do YouTube para faixas desatualizadas ou removidas. |
| **ETL de Tradução Automatizada** | Scripts de acionamento em lote que utilizam prompts especializados no Google Gemini para expandir o suporte aos idiomas PT-BR e JP→EN. |
| **Garantia de Qualidade Manual** | Controle estrito de aprovação de conteúdo onde flags críticas como `curationStatus="approved"` só podem ser alteradas manualmente pelo curador. |

---

## 🌐 Estrutura de Rotas

| Rota / URL | Descrição da Página |
|---|---|
| `/` | **Home** — Painel principal de boas-vindas e acesso rápido às seções do museu. |
| `/fighters` | **Roster Central** — Grid interativo com todos os 90 lutadores da série. |
| `/fighters/[name]` | **Dossiê do Lutador** — Visão completa com MediaVault, timeline histórica, jogos de origem e golpes. |
| `/collectibles?type=SPIRIT` | **Spirit Viewer** — Galeria inspecionável com os 1.582 Spirits de Super Smash Bros. Ultimate. |
| `/collectibles?type=TROPHY&game=SSBM` | **Troféus Melee** — Galeria 3D dos troféus clássicos do Nintendo GameCube. |
| `/collectibles?type=TROPHY&game=SSBB` | **Troféus Brawl** — Catálogo de troféus e stickers da era Wii. |
| `/franchise/[name]` | **Universo da Franquia** — Agrupamento de personagens, jogos e itens por série (ex: *Mario*, *Zelda*, *Pokémon*). |
| `/chronicles` | **Nintendo Chronicles** — Catálogo explorável de jogos que construíram o ecossistema Nintendo. |
| `/admin/*` | **Painel de Curadoria** — Área restrita à administração de faixas de música e dados (requer cookie `smash_admin`). |

---

## ⚠️ Regras Absolutas & Boas Práticas de Engenharia

Para manter a estabilidade e a integridade do banco de dados em produção, as seguintes diretrizes são estritamente seguidas no desenvolvimento do projeto:

- ⛔ **NUNCA** alterar `curationStatus="approved"` de forma automatizada via script — a aprovação é uma tarefa exclusivamente manual no painel admin.
- ⛔ **NUNCA** utilizar `ts-node` para execução de scripts TypeScript — sempre executar com **`npx tsx --env-file=.env.local`**.
- ⛔ **NUNCA** executar `prisma migrate dev` diretamente no ambiente em nuvem — para queries estruturais ou correções pontuais, utilizar `$executeRawUnsafe`.
- ⚠️ **Rate Limiting Restrito**: Manter intervalo mínimo de **1.6s** entre requisições de scraping web e **4.1s** nas chamadas à API do Google Gemini para evitar bloqueios de IP e limites de cota.
- ⚠️ **Windows DLL Lock (`EPERM`)**: Sempre parar o servidor de desenvolvimento (`npm run dev`) **antes** de rodar o comando `prisma generate`.

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- **Node.js** v20.x ou superior
- **Git** e **npm** (ou pnpm/yarn/bun)
- Instância ativa do **PostgreSQL** (ou conta gratuita no [Supabase](https://supabase.com))
- Chave de API gratuita do **Google Gemini API** (`GEMINI_API_KEY`)

### 2. Passo a Passo de Instalação

```bash
# 1. Clone o repositório para a sua máquina local
git clone https://github.com/ACrush14/smash-compendium.git

# 2. Acesse o diretório do projeto
cd smash-compendium

# 3. Instale todas as dependências
npm install
```

### 3. Configuração de Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com base no arquivo `.env.example`:

```env
# Conexão com o banco de dados PostgreSQL (Supabase / Prisma)
DATABASE_URL="postgresql://usuario:senha@host:5432/database?schema=public"
DIRECT_URL="postgresql://usuario:senha@host:5432/database?schema=public"

# Chave da API de Inteligência Artificial para tradução automática
GEMINI_API_KEY="sua_chave_do_google_gemini_aqui"

# Cookie secreto de autenticação para as páginas de Admin
ADMIN_SECRET_COOKIE="smash_admin_secret_token"
```

### 4. Preparando o Banco de Dados e Rodando o Projeto

```bash
# 1. Gere os artefatos de tipagem do Prisma Client
npm run db:generate

# 2. Em ambiente de desenvolvimento local, empurre o schema para o banco
npm run db:push

# 3. (Opcional) Execute o seed inicial do banco com dados dos colecionáveis
npm run db:seed

# 4. Inicie o servidor de desenvolvimento do Next.js
npm run dev
```

Acesse o museu no seu navegador através de: **`http://localhost:3000`**.

---

## 🛠️ Scripts Úteis de Automação e Curadoria

O projeto conta com um conjunto robusto de pipelines em CLI construídos em TypeScript para raspagem, tradução e ETL:

```bash
# 🧠 IA & Tradução Automática
# Traduz biografias e golpes para PT-BR e JP->EN utilizando o Google Gemini
npx tsx --env-file=.env.local scripts/admin/translate-all-fighter-content.ts

# 🕸️ Web Scraping & Enriquecimento de Dados
# Extrai biografias multilíngues dos lutadores
npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-bios.ts
# Extrai descrições e dados dos golpes
npx tsx --env-file=.env.local scripts/scrapers/enrich-all-fighter-moves.ts

# 🔗 ETL de Relacionamento de Dados
# Conecta os lutadores aos seus respectivos jogos no Nintendo Chronicles
npx tsx --env-file=.env.local scripts/admin/populate-all-fighter-works.ts

# 🎵 Curadoria de Trilha Sonora
# Verifica e substitui URLs de vídeos indisponíveis no YouTube
npx tsx --env-file=.env.local scripts/admin/replace-dead-music-urls.ts
```

---

## 📊 Schema & Modelagem de Dados

A estrutura relacional do projeto é projetada para conectar universos, itens e cronologias sem redundâncias:

| Modelo | Registros Estimados | Descrição da Entidade |
|---|---|---|
| `Franchise` | **47** | Universos das séries da Nintendo e terceiros (*Mario*, *Zelda*, *Pokémon*, *Final Fantasy*...). |
| `Fighter` | **90** | Cadastro central dos lutadores (incluindo variações de Roster como #33a/#33b/#33c). |
| `FighterBio` | **~250** | Biografias temporais separadas por jogo, em quatro idiomas (EN, PT-BR, JP, JP→EN). |
| `FighterMove` | **~100** | Catálogo de movimentos e ataques especiais, categorizados por era. |
| `FighterChronicleLink` | **~600+** | Tabela associativa que vincula lutadores diretamente aos seus jogos de origem no Chronicles. |
| `Collectible` | **~3.334** | Acervo de Troféus (1.045), Spirits (1.582) e Stickers (707). |
| `CollectibleChronicleLink` | **2.184** | Vínculos relacionais que ligam cada troféu ou spirit ao jogo de onde se originou. |
| `ChronicleEntry` | **~1.270** | Catálogo master de jogos Nintendo com datas de lançamento NTSC/PAL/JP e box arts. |
| `Music` | **1.076** | Faixas da trilha sonora oficial vinculadas aos IDs do YouTube e seus jogos de origem. |

---

## 📜 Histórico de Demandas & Roadmap

Abaixo está o registro cronológico de todas as grandes evoluções e funcionalidades implementadas no sistema, bem como os desafios de curadoria em andamento:

<details open>
<summary><b>✅ Concluído (Done)</b></summary>

- **Estrutura Inicial do Projeto**: Implementação do Next.js 14 App Router com Tailwind CSS (tema dark customizado), schema Prisma robusto e proteção de rotas admin.
- **Seed de Colecionáveis**: Catalogação com sucesso de ~1.045 Troféus, 1.582 Spirits e 707 Stickers com metadados extraídos de wikis especializadas.
- **Nintendo Chronicles**: Sistema de catálogo de ~1.270 jogos da Nintendo, servindo de fonte única de verdade para 2.184 links entre troféus e jogos.
- **Acervo de Música (1.076 faixas)**: Implementação do player áudio no MediaVault dos lutadores e barra persistente de reprodução no catálogo de colecionáveis.
- **Páginas Individuais dos Lutadores**: Design em grid 5/7 colunas flanqueando o MediaVault e o painel de informações (*OriginGamesPanel*, *FighterDataZone*, *AssociatedCards*).
- **Bio Scraper & Moves Scraper**: Scraping e estruturação de biografias e golpes evolutivos para todos os 90 lutadores do acervo.
- **Tradução Automática via Gemini API**: Implementação de pipeline com o modelo `gemini-2.5-flash-lite` para conversão de textos de biografia e golpes para o Português brasileiro.
- **Pokémon Trainer Team**: Estruturação dos lutadores Squirtle (#33a), Ivysaur (#33b) e Charizard (#33c) com suas respectivas páginas, bios e movesets.
- **Refatoração de Arquitetura (`FighterChronicleLink`)**: Migração bem-sucedida para eliminar dependências legadas, conectando personagens diretamente à tabela de Chronicles.
- **UI & Navegação de Roster**: Setas de paginação adjacente para navegação fluida entre perfis e rodapé estilizado em todas as páginas.

</details>

<details>
<summary><b>⏳ Em Andamento (In Progress)</b></summary>

- **Substituição de URLs de Música Mortas**: Execução progressiva do script `replace-dead-music-urls.ts` para mapear e substituir URLs indisponíveis (respeitando a cota diária da API do YouTube).
- **Tradução em Lote**: Processamento de ~226 biografias e ~100 movimentos remanescentes através da API do Google Gemini.

</details>

<details>
<summary><b>🔴 Pendente / Backlog (Pending)</b></summary>

- **Curadoria Forte de Dados dos Lutadores**: Revisão manual minuciosa das informações biográficas, imagens e golpes dos lutadores para garantir precisão histórica máxima.
- **Correções no Acervo Chronicles**: Ajuste de nomes de consoles, datas de lançamento NTSC/PAL/JP e adição de box arts regionais faltantes.
- **Reclassificação de Troféus (`sourceGame="SMASH"`)**: Reclassificação de ~130+ troféus de Melee e Brawl que possuem marcação genérica para seus respectivos jogos de origem.
- **Conclusão da Curadoria do Mario**: Enriquecimento de GIFs de movimentos e revisão dos textos de apresentação do curador (`curatorOverview`).
- **População da Tabela `CollectibleRelation`**: Mapeamento de relações entre troféus equivalentes em diferentes gerações de jogos Smash.
- **Bios para Lutadores DLC**: Pesquisa e documentação biográfica alternativa para lutadores DLC de SSBU que não possuem troféus históricos em jogos anteriores.

</details>

---

## 👥 Autores & Créditos

<div align="center">
  <p>Desenvolvido com dedicação, rigor técnico e carinho pelos games clássicos por:</p>
  <h3><a href="https://andersoncrushdev.vercel.app">⚡ Anderson Crush</a></h3>
  <p>
    <a href="https://github.com/ACrush14">GitHub</a> • 
    <a href="https://andersoncrushdev.vercel.app">Portfólio</a>
  </p>
  <p><i>SmashCompendium • Versão V00.201 Alpha • 2026</i></p>
</div>

---

<div align="center">
  <small>
    <b>Aviso Legal (Disclaimer):</b> Este é um projeto acadêmico e fan-made sem fins lucrativos, criado exclusivamente para fins educacionais, de pesquisa e preservação da história dos videogames. <i>Super Smash Bros.</i>, <i>Nintendo</i> e todos os personagens, nomes, trilhas sonoras e imagens associadas são marcas registradas e propriedade intelectual de seus respectivos criadores e detentores de direitos (Nintendo, HAL Laboratory, Masahiro Sakurai, SEGA, Capcom, Bandai Namco, Square Enix, Atlus, Microsoft, SNK, Disney, entre outros).
  </small>
</div>
