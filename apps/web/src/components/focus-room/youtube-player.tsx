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

export default function YouTubePlayer({
  videoUrl,
  onReady,
  onPlay,
  onPause,
  onError,
  volume = 50,
  className = '',
}: YouTubePlayerProps) {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);

  const videoId = extractVideoId(videoUrl);

  const handleReady: YouTubeProps['onReady'] = useCallback(
    (event) => {
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
    (event) => {
      const errorCode = event.data;
      onError?.(errorCode);
    },
    [onError]
  );

  // Update volume when prop changes
  const updateVolume = useCallback(
    (newVolume: number) => {
      if (player && isReady) {
        player.setVolume(newVolume);
      }
    },
    [player, isReady]
  );

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

  // YouTube player options
  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0, // Hide YouTube controls for clean background
      disablekb: 1, // Disable keyboard controls
      fs: 0, // Disable fullscreen
      modestbranding: 1, // Minimal YouTube branding
      rel: 0, // Don't show related videos
      showinfo: 0, // Don't show video info
      loop: 1, // Loop the video
      playlist: videoId ?? '', // Required for looping
      mute: 0, // Don't mute by default
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

// Export video ID extraction utility
export { extractVideoId };
