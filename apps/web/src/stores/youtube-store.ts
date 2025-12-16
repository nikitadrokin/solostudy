// useYouTubeStore.ts

import { useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';

// YouTube Player States
export const PLAYER_STATES = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

type PlayerState = (typeof PLAYER_STATES)[keyof typeof PLAYER_STATES];

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
  getPlayerState: () => number;
}

interface YouTubeStore {
  playerState: PlayerState;
  setPlayerState: (state: PlayerState) => void;
  playerRef: YouTubePlayer | null;
  setPlayerRef: (ref: YouTubePlayer | null) => void;
}

interface YouTubeEvent {
  target: YouTubePlayer;
  data: number;
}

interface YouTubePlayerVars {
  autoplay?: 0 | 1;
  controls?: 0 | 1;
  loop?: 0 | 1;
  mute?: 0 | 1;
  playsinline?: 0 | 1;
  start?: number;
  end?: number;
  [key: string]: unknown;
}

interface UseYouTubeOptions {
  videoId: string;
  playerVars?: YouTubePlayerVars;
  onReady?: (event: YouTubeEvent) => void;
  onError?: (event: { data: number; target: YouTubePlayer }) => void;
}

// Custom type for YouTube iframe API
interface CustomYTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
  getPlayerState: () => number;
}

interface CustomYTEvent {
  target: CustomYTPlayer;
  data: number;
}

export interface CustomYouTubeAPI {
  Player: new (
    element: HTMLElement,
    config: {
      videoId?: string;
      height?: string | number;
      width?: string | number;
      playerVars?: YouTubePlayerVars;
      events?: {
        onReady?: (event: CustomYTEvent) => void;
        onStateChange?: (event: CustomYTEvent) => void;
        onError?: (event: { data: number }) => void;
      };
    }
  ) => CustomYTPlayer;
  PlayerState?: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

// Augment window without conflicting with existing types
declare global {
  interface Window {
    YT?: CustomYouTubeAPI;
    CustomYT?: CustomYouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Zustand store
export const useYouTubeStore = create<YouTubeStore>((set) => ({
  playerState: PLAYER_STATES.UNSTARTED,
  setPlayerState: (state: PlayerState) => set({ playerState: state }),
  playerRef: null,
  setPlayerRef: (ref: YouTubePlayer | null) => set({ playerRef: ref }),
}));

// Hook to initialize and control YouTube player
export function useYouTube({
  videoId,
  playerVars = {},
  onReady,
  onError,
}: UseYouTubeOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setPlayerState = useYouTubeStore((s) => s.setPlayerState);
  const setPlayerRef = useYouTubeStore((s) => s.setPlayerRef);

  // Load YouTube IFrame API
  useEffect(() => {
    const YT = window.YT;
    if (YT?.Player) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      // API ready callback will be handled in the next useEffect
    };
    return () => {
      if (window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = undefined;
      }
    };
  }, []);

  const handleReady = useCallback(
    (event: CustomYTEvent) => {
      setPlayerRef(event.target);
      onReady?.({
        target: event.target,
        data: event.data,
      });
    },
    [setPlayerRef, onReady]
  );

  const handleStateChange = useCallback(
    (event: CustomYTEvent) => {
      setPlayerState(event.data as PlayerState);
    },
    [setPlayerState]
  );

  const handleError = useCallback(
    (event: { data: number }) => {
      const playerRef = useYouTubeStore.getState().playerRef;
      if (playerRef) {
        onError?.({
          data: event.data,
          target: playerRef,
        });
      }
    },
    [onError]
  );

  // Create player when API is ready
  useEffect(() => {
    function createPlayer() {
      if (!containerRef.current) {
        return;
      }
      const YT = window.YT;
      if (!YT?.Player) {
        return;
      }
      const player = new YT.Player(containerRef.current, {
        videoId,
        playerVars,
        events: {
          onReady: handleReady,
          onStateChange: handleStateChange,
          onError: handleError,
        },
      });
      setPlayerRef(player);
    }

    const YT = window.YT;
    if (YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      const player = useYouTubeStore.getState().playerRef;
      if (player?.destroy) {
        player.destroy();
        setPlayerRef(null);
      }
    };
  }, [
    videoId,
    playerVars,
    handleReady,
    handleStateChange,
    handleError,
    setPlayerRef,
  ]);

  // Setter: triggers YouTube API, store updates only via onStateChange
  const setYouTubeState = (desiredState: PlayerState) => {
    const player = useYouTubeStore.getState().playerRef;
    if (!player) {
      return;
    }
    switch (desiredState) {
      case PLAYER_STATES.PLAYING: {
        player.playVideo();
        break;
      }
      case PLAYER_STATES.PAUSED: {
        player.pauseVideo();
        break;
      }
      case PLAYER_STATES.ENDED: {
        player.stopVideo();
        break;
      }
      default: {
        break;
      }
    }
    // Do NOT set store state here; state will update via onStateChange only
  };

  return {
    containerRef,
    playerState: useYouTubeStore((s) => s.playerState),
    setYouTubeState,
    PLAYER_STATES,
  };
}
