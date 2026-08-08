"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    host: HTMLElement,
    options: {
      videoId?: string;
      width?: number;
      height?: number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: () => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYER_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3 } as const;

export const PLAYER_SIZE = 240;

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
      else reject(new Error("YouTube IFrame API loaded without YT namespace"));
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () =>
      reject(new Error("Failed to load YouTube IFrame API"));
    document.head.appendChild(script);
  });

  return apiPromise;
}

type Options = {
  videoId: string;
  onEnded?: () => void;
  volume?: number;
};

export function useYouTubePlayer({ videoId, onEnded, volume = 80 }: Options) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const onEndedRef = useRef(onEnded);
  const shouldAutoplayRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !containerRef.current || playerRef.current) return;

        const host = document.createElement("div");
        containerRef.current.appendChild(host);

        playerRef.current = new YT.Player(host, {
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
          playerVars: {
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (cancelled) return;
              setIsReady(true);
            },
            onStateChange: ({ data }) => {
              if (cancelled) return;

              setIsBuffering(data === PLAYER_STATE.BUFFERING);
              setIsPlaying(data === PLAYER_STATE.PLAYING);

              if (data === PLAYER_STATE.PLAYING) {
                setDuration(playerRef.current?.getDuration() ?? 0);
              }

              if (data === PLAYER_STATE.ENDED) {
                setProgress(0);
                onEndedRef.current?.();
              }
            },
            onError: () => {
              if (cancelled) return;
              setFailed(true);
              setIsPlaying(false);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      if (containerRef.current) containerRef.current.textContent = "";
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!isReady || !player || !videoId) return;

    setFailed(false);
    setProgress(0);
    setDuration(0);

    if (shouldAutoplayRef.current) player.loadVideoById(videoId);
    else player.cueVideoById(videoId);
  }, [videoId, isReady]);

  useEffect(() => {
    if (isReady) playerRef.current?.setVolume(volume);
  }, [volume, isReady]);

  useEffect(() => {
    if (!isPlaying) return;

    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      setProgress(player.getCurrentTime());
      setDuration((current) => current || player.getDuration());
    }, 250);

    return () => window.clearInterval(id);
  }, [isPlaying]);

  const play = useCallback(() => {
    shouldAutoplayRef.current = true;
    playerRef.current?.playVideo?.();
  }, []);

  const pause = useCallback(() => {
    shouldAutoplayRef.current = false;
    playerRef.current?.pauseVideo();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setProgress(seconds);
  }, []);

  const keepPlaying = useCallback((next: boolean) => {
    shouldAutoplayRef.current = next;
  }, []);

  return {
    containerRef,
    isReady,
    isPlaying,
    isBuffering,
    progress,
    duration,
    failed,
    play,
    pause,
    toggle,
    seek,
    keepPlaying,
  };
}
