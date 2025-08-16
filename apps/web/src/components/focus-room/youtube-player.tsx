'use client';
import { useCallback, useState } from 'react';
import YouTube, { type YouTubeProps } from 'react-youtube';

interface YouTubePlayerProps {
  videoUrl: string;
  onReady?: (event: { target: YT.Player }) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: number) => void;
  volume?: number;
  className?: string;
}

// YouTube URL patterns for video ID extraction
const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
];

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
 * Normalize any YouTube URL to a clean embed format with all UI elements hidden
 * This ensures consistent behavior regardless of the input URL format
 */
function normalizeYouTubeUrl(url: string): string {
  const videoId = extractVideoId(url);
  if (!videoId) {
    return url; // Return original if we can't extract video ID
  }

  const baseUrl = 'https://www.youtube.com/embed/';
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
    mute: '1',
    iv_load_policy: '3',
    playsinline: '1',
    enablejsapi: '1',
    cc_load_policy: '0',
    color: 'white',
    hl: 'en',
    ...(typeof window !== 'undefined' && { origin: window.location.origin }),
  });

  return `${baseUrl}${videoId}?${params.toString()}`;
}

export default function YouTubePlayer({
  videoUrl,
  onReady,
  onPlay,
  onPause,
  onError,
  volume = 50,
  className = '',
}: YouTubePlayerProps) {
  const [, setPlayer] = useState<YT.Player | null>(null);
  const [, setIsReady] = useState(false);

  const videoId = extractVideoId(videoUrl);

  const handleReady: YouTubeProps['onReady'] = useCallback(
    (event: { target: YT.Player }) => {
      const playerInstance = event.target;
      setPlayer(playerInstance);
      setIsReady(true);

      // Set initial volume
      playerInstance.setVolume(volume);

      onReady?.(event);
    },
    [onReady, volume]
  );

  const handlePlay: YouTubeProps['onPlay'] = useCallback(() => {
    onPlay?.();
  }, [onPlay]);

  const handlePause: YouTubeProps['onPause'] = useCallback(() => {
    onPause?.();
  }, [onPause]);

  const handleError: YouTubeProps['onError'] = useCallback(
    (event: { data: number }) => {
      const errorCode = event.data;
      onError?.(errorCode);
    },
    [onError]
  );

  // Update volume when prop changes (for future use)
  // const updateVolume = useCallback(
  //   (newVolume: number) => {
  //     if (player && isReady) {
  //       player.setVolume(newVolume);
  //     }
  //   },
  //   [player, isReady]
  // );

  // Player controls (commented out as not currently used)
  // const controls = {
  //   play: () => player?.playVideo(),
  //   pause: () => player?.pauseVideo(),
  //   stop: () => player?.stopVideo(),
  //   setVolume: updateVolume,
  //   getVolume: () => player?.getVolume() || 0,
  //   mute: () => player?.mute(),
  //   unMute: () => player?.unMute(),
  //   isMuted: () => player?.isMuted() || false,
  //   getDuration: () => player?.getDuration() || 0,
  //   getCurrentTime: () => player?.getCurrentTime() || 0,
  //   seekTo: (seconds: number) => player?.seekTo(seconds, true),
  // };

  // YouTube player options - configured to hide all UI elements and prevent hover effects
  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1, // Auto-start playback
      controls: 0, // Hide YouTube controls completely
      disablekb: 0, // Allow keyboard controls (can be overridden programmatically)
      fs: 0, // Disable fullscreen button
      modestbranding: 1, // Minimal YouTube branding
      rel: 0, // Don't show related videos at end
      showinfo: 0, // Hide video title and uploader info
      loop: 1, // Loop the video continuously
      playlist: videoId ?? '', // Required for looping single video
      mute: 1, // Start muted (user can unmute via app controls)
      iv_load_policy: 3, // Hide video annotations
      playsinline: 1, // Play inline on mobile devices
      enablejsapi: 1, // Enable JavaScript API for programmatic control
      // Additional parameters to ensure clean embed
      cc_load_policy: 0, // Hide closed captions by default
      color: 'white', // White progress bar
      hl: 'en', // Interface language
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    },
  };

  if (!videoId) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <p className="text-muted-foreground">
          {videoUrl
            ? 'Invalid YouTube URL'
            : 'Enter a YouTube URL to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <YouTube
        className="h-full w-full"
        iframeClassName="h-full w-full"
        onError={handleError}
        onPause={handlePause}
        onPlay={handlePlay}
        onReady={handleReady}
        opts={opts}
        videoId={videoId}
      />

      {/* Overlay to prevent direct interaction with YouTube player */}
      <div className="pointer-events-none absolute inset-0" />
    </div>
  );
}

// Export the controls interface for use in parent components
export type YouTubePlayerControls = typeof YouTubePlayer.prototype extends {
  controls: infer U;
}
  ? U
  : never;

// Export video ID extraction and URL normalization utilities
export { extractVideoId, normalizeYouTubeUrl };
