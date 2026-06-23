"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure we start at the right time
    video.currentTime = startSec;

    const attemptPlay = () => {
      video.play().catch(() => {
        // Autoplay policy might block it, but since it's muted, it usually works.
      });
    };

    attemptPlay();

    // Check time repeatedly
    let animationFrameId: number;
    const loopCheck = () => {
      if (video.currentTime >= endSec) {
        video.currentTime = startSec;
        attemptPlay();
      }
      animationFrameId = requestAnimationFrame(loopCheck);
    };

    animationFrameId = requestAnimationFrame(loopCheck);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [src, startSec, endSec]);

  return (
    <video
      ref={videoRef}
      // Provide the media fragment so the browser requests only this chunk initially
      src={`${src}#t=${startSec},${endSec}`}
      muted
      playsInline
      loop={false}
      controls={false}
      disablePictureInPicture
      onError={onError ? (e) => onError(e.currentTarget) : undefined}
      // We scale it slightly in case the local video has tiny black borders
      className={`pointer-events-none w-full h-full object-cover ${className}`}
      style={{ transform: "scale(1.05)" }}
    />
  );
}
