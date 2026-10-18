"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { localImageUrl, type ImageTier } from "@/lib/media-config";

/** Bloco cinza com brilho animado — use em loading.tsx e placeholders. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton-shimmer ${className}`} />;
}

type Props = ImageProps & {
  skeletonClassName?: string;
  /** Força a miniatura (≤128px). Por padrão é detectado: imagens exibidas a ≤ 64px usam a miniatura. */
  thumb?: boolean;
  /** Tamanho da versão local a usar (sobrepõe a detecção automática). */
  variant?: ImageTier;
};

/** Maior lado em px que a imagem ocupa, quando dá para saber pelas props (width/height numéricos ou `sizes` em px). */
function displaySide(width: ImageProps["width"], height: ImageProps["height"], sizes?: string): number | null {
  const w = Number(width), h = Number(height);
  if (w > 0 || h > 0) return Math.max(w || 0, h || 0);
  const m = sizes?.match(/^(\d+)px$/);
  return m ? Number(m[1]) : null;
}

/**
 * next/image com skeleton + versão local leve:
 *  - mostra um bloco com shimmer até a imagem carregar, depois faz fade-in;
 *  - troféus do ssb.wiki.gallery e imagens de /assets/collectibles usam a versão WebP local
 *    (miniatura ≤128px quando pequena, ≤512px quando grande) e caem para a URL original se faltar o arquivo.
 * O elemento pai precisa ser `relative`/posicionado.
 */
export default function SkeletonImage({ skeletonClassName = "", className = "", style, onLoad, onError, thumb, variant, ...props }: Props) {
  const original = typeof props.src === "string" ? props.src : null;
  const side = displaySide(props.width, props.height, props.sizes);
  const small = thumb ?? (side !== null && side <= 64);
  const tier: ImageTier = variant ?? (small ? "thumb" : "full");
  // localImageUrl devolve a própria URL quando não há versão local (ex.: collectibles grandes, já ≤600px)
  const initial = original ? localImageUrl(original, tier) : null;

  const [src, setSrc] = useState<ImageProps["src"]>(initial ?? props.src);
  const [done, setDone] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Troca de src (ex.: carrossel) reinicia o skeleton; imagem em cache já vem `complete`.
  useEffect(() => {
    setSrc(initial ?? props.src);
    const img = imgRef.current;
    setDone(!!img && img.complete && img.naturalWidth > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // Vídeos (.webm/.mp4) não são imagens: não baixa nada, só mostra um bloco neutro.
  if (original && /\.(webm|mp4)(\?|$)/i.test(original)) {
    return <div aria-hidden className="absolute inset-0 bg-slate-800/30" />;
  }

  return (
    <>
      {!done && <Skeleton className={`absolute inset-0 pointer-events-none rounded-sm ${skeletonClassName}`} />}
      <Image
        {...props}
        src={src}
        ref={imgRef}
        className={`${className} ${done ? "skeleton-fade-in" : ""}`}
        style={{ ...style, ...(done ? null : { opacity: 0 }) }}
        onLoad={(e) => { setDone(true); onLoad?.(e); }}
        onError={(e) => {
          // versão local ausente: tenta a URL original uma vez
          if (original && src !== original) { setSrc(original); return; }
          setDone(true); onError?.(e);
        }}
      />
    </>
  );
}
