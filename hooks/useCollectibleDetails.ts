"use client";

import { useEffect, useRef, useState } from "react";
import type { CollectibleDetail } from "@/lib/collectible-types";

/**
 * Carrega sob demanda o detalhe (/api/collectibles/[id]) do item aberto e, em tempo ocioso, dos vizinhos.
 * O detalhe inicial (renderizado no servidor) já vem preenchido.
 */
export function useCollectibleDetails(
  currentId: string | undefined,
  neighborIds: (string | undefined)[],
  initialDetail: CollectibleDetail | null,
) {
  const [details, setDetails] = useState<Record<string, CollectibleDetail>>(() => (initialDetail ? { [initialDetail.id]: initialDetail } : {}));
  const inflight = useRef<Set<string>>(new Set());
  const neighborKey = neighborIds.filter(Boolean).join("|");

  useEffect(() => {
    const load = (id: string) => {
      if (details[id] || inflight.current.has(id)) return;
      inflight.current.add(id);
      fetch(`/api/collectibles/${encodeURIComponent(id)}`)
        .then(r => (r.ok ? r.json() : null))
        .then((d: CollectibleDetail | null) => { if (d) setDetails(prev => ({ ...prev, [d.id]: d })); })
        .catch(() => { /* sem rede: tenta de novo ao voltar a este item */ })
        .finally(() => inflight.current.delete(id));
    };
    if (currentId) load(currentId);
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const prefetch = () => neighborKey.split("|").filter(Boolean).forEach(load);
    if (w.requestIdleCallback) w.requestIdleCallback(prefetch); else setTimeout(prefetch, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, neighborKey]);

  return details;
}
