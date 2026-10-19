"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./SkeletonImage";

export default function LocalVideoGif({
  src,
  startSec,
  endSec,
  className = "",
  onError,
}: {
  src: string;
  startSec: number;
  endSec: number;
  className?: string;
  onError?: (target: HTMLVideoElement) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Arquivo ausente (ex.: 404 no deploy sem CDN): o evento de erro pode ter disparado antes da hidratação,
    // então confere o estado atual e também escuta erros futuros.
    const fail = () => { setFailed(true); onError?.(video); };
    // Só `video.error` vale como falha imediata. NETWORK_NO_SOURCE aparece por um instante ANTES de o navegador
    // começar a baixar (mesmo com o arquivo existindo) e escondia clipes bons; por isso só confirma depois de 3 s.
    if (video.error) { fail(); return; }
    video.addEventListener("error", fail);
    const late = setTimeout(() => {
      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE && video.readyState === 0) fail();
    }, 3000);

    // Ensure we start at the right time
    video.currentTime = startSec;

    const attemptPlay = () => {
      video.play().catch(() => {
        // Autoplay policy might block it, but since it's muted, it usually works.
      });
    };

    attemptPlay();

    // Repete o trecho usando eventos do próprio vídeo (funciona até em aba oculta, ao contrário de
    // requestAnimationFrame). O fragmento #t=início,fim faz o navegador pausar exatamente no fim ('pause').
    const loopIfAtEnd = () => {
      if (video.currentTime >= endSec - 0.05 || video.currentTime < startSec - 0.5) {
        video.currentTime = startSec;
        attemptPlay();
      }
    };
    video.addEventListener("timeupdate", loopIfAtEnd);
    video.addEventListener("pause", loopIfAtEnd);
    video.addEventListener("ended", loopIfAtEnd);

    return () => {
      video.removeEventListener("error", fail);
      clearTimeout(late);
      video.removeEventListener("timeupdate", loopIfAtEnd);
      video.removeEventListener("pause", loopIfAtEnd);
      video.removeEventListener("ended", loopIfAtEnd);
    };
  }, [src, startSec, endSec]);

  if (failed) return null;

  return (
    <div className="relative w-full h-full">
    {!ready && <Skeleton className="absolute inset-0 pointer-events-none" />}
    <video
      ref={videoRef}
      preload="metadata"
      onLoadedData={() => setReady(true)}
      // Provide the media fragment so the browser requests only this chunk initially
      src={`${src}#t=${startSec},${endSec}`}
      muted
      playsInline
      loop={false}
      controls={false}
      disablePictureInPicture
      // We scale it slightly in case the local video has tiny black borders
      className={`pointer-events-none w-full h-full object-cover ${className}`}
      style={{ transform: "scale(1.05)", opacity: ready ? 1 : 0 }}
    />
    </div>
  );
}
