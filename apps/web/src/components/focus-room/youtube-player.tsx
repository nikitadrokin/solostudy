'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface YouTubePlayerProps {
  videoId: string;
  onReady?: (event: { target: YTPlayer }) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: number) => void;
  volume?: number;
  className?: string;
  reloadKey?: number;
  startTime?: number;
}

// Extend Window interface to include YouTube API
declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        config: YTPlayerOptions
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YouTube API types
interface YTPlayer {
  setVolume(volume: number): void;
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
  getCurrentTime(): number;
  seekTo(seconds: number): void;
  getPlayerState(): number;
}

interface YTPlayerOptions {
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTOnStateChangeEvent) => void;
    onError?: (event: YTOnErrorEvent) => void;
  };
}

interface YTPlayerEvent {
  target: YTPlayer;
}

interface YTOnStateChangeEvent {
  data: number;
}

interface YTOnErrorEvent {
  data: number;
}

// Pattern to check if a string is already a video ID
const VIDEO_ID_PATTERN = /^([a-zA-Z0-9_-]{11})$/;

// YouTube URL patterns for video ID extraction
const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  VIDEO_ID_PATTERN, // Direct video ID
];

/**
 * Convert YouTube video ID to a watch URL
 */
function videoIdToEmbed(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Normalize any YouTube URL or video ID to a clean embed format with all UI elements hidden
 * This ensures consistent behavior regardless of the input format
 */
function normalizeYouTubeUrl(urlOrId: string, startTime?: number): string {
  // Check if input is already a video ID (11 characters, alphanumeric with dashes/underscores)
  const isVideoId = VIDEO_ID_PATTERN.test(urlOrId);
  const videoId = isVideoId ? urlOrId : extractVideoId(urlOrId);
  if (!videoId) {
    // If we can't extract a video ID, return original (fallback for edge cases)
    return urlOrId;
  }

  const videoEmbedUrl = videoIdToEmbed(videoId);
  const params = new URLSearchParams({
    autoplay: '1',
    controls: '0',
    disablekb: '0',
    fs: '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    loop: '1',
    playlist: videoId,
    mute: '0',
    iv_load_policy: '3',
    playsinline: '1',
    enablejsapi: '1',
    cc_load_policy: '0',
    color: 'white',
    hl: 'en',
    ...(typeof window !== 'undefined' && { origin: window.location.origin }),
    ...(startTime !== undefined &&
      startTime > 0 && { start: Math.floor(startTime).toString() }),
  });

  return `${videoEmbedUrl}?${params.toString()}`;
}

/**
 * Load YouTube IFrame API and create a player instance
 */
function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    if (window.YT?.Player) {
      resolve();
      return;
    }

    // Load YouTube IFrame API script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);

    // YouTube API callback
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
}

export default function YouTubePlayer({
  videoId,
  onReady,
  onPlay,
  onPause,
  onError,
  volume = 50,
  className = '',
  reloadKey = 0,
  startTime,
}: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Load YouTube API on mount
  useEffect(() => {
    loadYouTubeAPI().then(() => {
      setApiLoaded(true);
    });
  }, []);

  // Reset player state when reload key changes
  useEffect(() => {
    if (reloadKey > 0) {
      setPlayer(null);
      setIsReady(false);
    }
  }, [reloadKey]);

  // Initialize player when API is loaded and iframe is ready
  useEffect(() => {
    const shouldInitialize =
      apiLoaded && videoId && iframeRef.current && !player;
    if (!shouldInitialize) {
      return;
    }

    const initializePlayer = () => {
      const iframe = iframeRef.current;
      const ytAPI = window.YT;

      if (!iframe) {
        return;
      }

      if (!ytAPI?.Player) {
        return;
      }

      try {
        const ytPlayer = new ytAPI.Player(iframe, {
          events: {
            onReady: (event: YTPlayerEvent) => {
              const playerInstance = event.target;
              setPlayer(playerInstance);
              setIsReady(true);

              // Set initial volume
              playerInstance.setVolume(volume);

              onReady?.({ target: playerInstance });
            },
            onStateChange: (event: YTOnStateChangeEvent) => {
              const ytPlayerState = window.CustomYT?.PlayerState;
              if (!ytPlayerState) {
                return;
              }

              if (event.data === ytPlayerState.PLAYING) {
                onPlay?.();
              } else if (event.data === ytPlayerState.PAUSED) {
                onPause?.();
              }
            },
            onError: (event: YTOnErrorEvent) => {
              onError?.(event.data);
            },
          },
        });
        setPlayer(ytPlayer);
      } catch {
        // Error handling without console
      }
    };

    // Small delay to ensure iframe is fully loaded
    const timer = setTimeout(initializePlayer, 100);
    return () => clearTimeout(timer);
  }, [apiLoaded, videoId, player, onReady, onPlay, onPause, onError, volume]);

  // Update volume when prop changes
  useEffect(() => {
    if (player && isReady) {
      player.setVolume(volume);
    }
  }, [player, isReady, volume]);

  // Clean up player on unmount
  useEffect(() => {
    return () => {
      if (player) {
        try {
          player.destroy();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [player]);

  if (!videoId) {
    return (
      <div
        className={cn(
          'flex select-none items-center justify-center bg-muted',
          className
        )}
      >
        <p className="text-muted-foreground">
          {videoId
            ? 'Invalid YouTube URL'
            : 'Enter a YouTube URL to get started'}
        </p>
      </div>
    );
  }

  const embedUrl = normalizeYouTubeUrl(videoId, startTime);

  return (
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
      allowFullScreen={true}
      className={`-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 box-border h-[56.25vw] min-h-full w-screen min-w-full ${className}`}
      frameBorder="0"
      height="100%"
      id="video-player"
      key={`${videoId}-${reloadKey}`}
      ref={iframeRef}
      referrerPolicy="strict-origin-when-cross-origin"
      src={embedUrl}
      suppressHydrationWarning
      title="YouTube video player"
      width="100%"
    />
  );
}

// Export video ID extraction and URL normalization utilities
export { extractVideoId, normalizeYouTubeUrl, videoIdToEmbed };
