"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/** Bloco cinza com brilho animado — use em loading.tsx e placeholders. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton-shimmer ${className}`} />;
}

type Props = ImageProps & { skeletonClassName?: string };

/**
 * next/image com skeleton: mostra um bloco com shimmer até a imagem carregar,
 * depois faz fade-in. O elemento pai precisa ser `relative`/posicionado.
 */
export default function SkeletonImage({ skeletonClassName = "", className = "", style, onLoad, onError, ...props }: Props) {
  const [done, setDone] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Troca de src (ex.: carrossel) reinicia o skeleton; imagem em cache já vem `complete`.
  useEffect(() => {
    const img = imgRef.current;
    setDone(!!img && img.complete && img.naturalWidth > 0);
  }, [props.src]);

  return (
    <>
      {!done && <Skeleton className={`absolute inset-0 pointer-events-none rounded-sm ${skeletonClassName}`} />}
      <Image
        {...props}
        ref={imgRef}
        className={`${className} ${done ? "skeleton-fade-in" : ""}`}
        style={{ ...style, ...(done ? null : { opacity: 0 }) }}
        onLoad={(e) => { setDone(true); onLoad?.(e); }}
        onError={(e) => { setDone(true); onError?.(e); }}
      />
    </>
  );
}
