"use client";

import { useEffect, useRef } from "react";


export default function YoutubeGif({
  videoId,
  startSec,
  endSec,
  className = "",
}: {
  videoId: string;
  startSec: number;
  endSec: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout;

    const initPlayer = () => {
      if (!isMounted || !containerRef.current || !window.YT) return;
      
      // If a player already exists, destroy it before creating a new one
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          mute: 1,
          start: startSec,
          end: endSec,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            if (isMounted) {
              event.target.mute();
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED == 0
            if (event.data === 0) {
              event.target.seekTo(startSec);
              event.target.playVideo();
            }
          },
        },
      });
    };

    const loadYoutubeApi = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
        return;
      }
      
      const existingScript = document.getElementById("youtube-api-script");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "youtube-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
      
      pollInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(pollInterval);
          initPlayer();
        }
      }, 100);
    };

    loadYoutubeApi();

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startSec, endSec]);

  return (
    <div className={`pointer-events-none overflow-hidden w-full h-full ${className}`}>
      {/* 
        We use a wrapper div that allows scaling up the iframe to hide the black bars 
        or YT branding edges if we want, but pointer-events-none does the heavy lifting.
      */}
      <div className="w-full h-full relative" style={{ transform: "scale(1.2)" }}>
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
