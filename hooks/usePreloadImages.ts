"use client";

import { useEffect } from "react";

/**
 * Pré-carrega imagens (ex.: vizinhos do item aberto num carrossel) para que a troca seja instantânea.
 * Ignora URLs vazias e roda só no navegador, quando ele está ocioso.
 */
export function usePreloadImages(urls: (string | null | undefined)[]) {
  const key = urls.filter(Boolean).join("|");
  useEffect(() => {
    if (!key) return;
    const run = () => key.split("|").forEach(u => { const img = new Image(); img.decoding = "async"; img.src = u; });
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(run); else setTimeout(run, 200);
  }, [key]);
}
