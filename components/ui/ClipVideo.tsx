"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";

/**
 * <video> que some junto com a caixa `[data-video-box]` quando o arquivo falha (ex.: 404 no deploy sem CDN).
 * O erro de um 404 rápido pode chegar ANTES da hidratação do React (evento perdido), por isso confere
 * `video.error` ao montar e também escuta o evento depois.
 */
export default function ClipVideo({ onFail, ...props }: VideoHTMLAttributes<HTMLVideoElement> & { onFail?: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const hide = () => {
      const box = video.closest("[data-video-box]") as HTMLElement | null;
      if (box) box.style.display = "none";
      onFailRef.current?.();
    };
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) hide();
    video.addEventListener("error", hide);
    return () => video.removeEventListener("error", hide);
  }, [props.src]);

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video ref={ref} {...props} />;
}

/**
 * Miniatura de clipe: só a capa leve (WebP), sem baixar o vídeo. Se a capa não existe (o clipe também não existe
 * no deploy sem CDN), avisa o pai para tirar o item do carrossel. Confere `complete` ao montar porque o erro
 * pode ter acontecido antes da hidratação.
 */
export function PosterThumb({ src, className, onFail }: { src: string; className?: string; onFail: () => void }) {
  const ref = useRef<HTMLImageElement>(null);
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) onFailRef.current();
  }, [src]);
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt="" loading="lazy" decoding="async" onError={() => onFailRef.current()} className={className} />;
}
