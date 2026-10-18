import type { SyntheticEvent } from "react";

/** onError para <img> leve (sem estado): se a versão local não existir, troca uma vez pela URL original. */
export const imgFallback = (original: string | null | undefined) => (e: SyntheticEvent<HTMLImageElement>) => {
  const t = e.currentTarget;
  if (original && t.dataset.fb !== "1") { t.dataset.fb = "1"; t.src = original; }
};
