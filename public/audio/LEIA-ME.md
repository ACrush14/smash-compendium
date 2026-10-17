# Trilha do site

O player espera o arquivo da "Trophy Gallery (Brawl) — 1 hora" aqui, com um destes nomes
(o navegador usa o primeiro que existir, nesta ordem):

- `trophy-gallery.webm`  (Opus — menor; recomendado)
- `trophy-gallery.ogg`
- `trophy-gallery.mp3`

Dica para ficar leve (1 hora ≈ 25–30 MB em Opus 64 kbps):

    ffmpeg -i original.m4a -vn -c:a libopus -b:a 64k trophy-gallery.webm

Para produção (Vercel), hospede o arquivo no CDN e defina `NEXT_PUBLIC_CDN_BASE_URL`;
o player resolve o caminho por `cdnUrl()` em `lib/media-config.ts`.
