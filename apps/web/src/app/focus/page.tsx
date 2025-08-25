'use client';
import { Eye, EyeOff, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import ControlsPanel from '@/components/focus-room/controls-panel';
import YouTubePlayer from '@/components/focus-room/youtube-player';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { authClient } from '@/lib/auth-client';
import { useFocusStore } from '@/lib/focus-store';

// YouTube player type (should match the one in youtube-player.tsx)
interface YTPlayer {
  setVolume(volume: number): void;
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
}

export default function FocusRoom() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Zustand store
  const {
    // Video state
    videoUrl,
    isPlaying,
    volume,
    isMuted,
    // UI state
    isZenMode,
    // Actions
    setVideoUrl,
    setIsPlaying,
    setVolume,
    setIsMuted,
    setIsZenMode,
  } = useFocusStore();

  // Local state that doesn't need persistence
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState<string>();
  const [player, setPlayer] = useState<YTPlayer | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: infinite rerender
  useEffect(() => {
    if (!(session || isPending)) {
      router.push('/login');
    }
  }, [session, isPending]);

  // YouTube player callbacks
  const handlePlayerReady = useCallback((event: { target: YTPlayer }) => {
    setPlayer(event.target);
    setIsVideoLoaded(true);
    setVideoError(undefined);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleError = useCallback((error: number) => {
    const errorMessages: Record<number, string> = {
      2: 'Invalid video ID',
      5: 'Video cannot be played in HTML5 player',
      100: 'Video not found or private',
      101: 'Video owner does not allow embedding',
      150: 'Video owner does not allow embedding',
    };

    setVideoError(errorMessages[error] || 'Unknown error occurred');
    setIsVideoLoaded(false);
  }, []);

  // Control handlers
  const handleVideoUrlChange = useCallback(
    (newUrl: string) => {
      setVideoUrl(newUrl);
      setIsVideoLoaded(false);
      setVideoError(undefined);
    },
    [setVideoUrl]
  );

  const handleLoadVideo = useCallback(() => {
    setIsVideoLoaded(false);
    setVideoError(undefined);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!player) {
      return;
    }

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [player, isPlaying]);

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      if (player) {
        player.setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
          setIsMuted(false);
          player.unMute();
        }
      }
    },
    [player, isMuted, setVolume, setIsMuted]
  );

  const handleMuteToggle = useCallback(() => {
    if (!player) {
      return;
    }

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  }, [player, isMuted, setIsMuted]);

  // Zen mode toggle handler
  const handleZenModeToggle = useCallback(() => {
    setIsZenMode(!isZenMode);
  }, [isZenMode, setIsZenMode]);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  return (
    <main className="relative h-full overflow-hidden">
      <YouTubePlayer
        onError={handleError}
        onPause={handlePause}
        onPlay={handlePlay}
        onReady={handlePlayerReady}
        videoUrl={videoUrl || 'https://www.youtube.com/watch?v=We4uRmMjjhM'}
        volume={volume}
      />

      {/* Overlay Controls */}
      <div className="absolute top-[calc(48px+16px)] left-0 z-10 md:right-0 md:left-auto">
        <div className="flex items-start justify-between">
          {/* Quick Actions */}
          <div className="ml-auto flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="bg-background/80 backdrop-blur-sm"
                  size="sm"
                  title="Focus Room Settings"
                  variant="outline"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 bg-background/95 backdrop-blur-sm"
                side="bottom"
              >
                <ControlsPanel
                  isMuted={isMuted}
                  isPlaying={isPlaying}
                  isVideoLoaded={isVideoLoaded}
                  onLoadVideo={handleLoadVideo}
                  onMuteToggle={handleMuteToggle}
                  onPlayPause={handlePlayPause}
                  onVideoUrlChange={handleVideoUrlChange}
                  onVolumeChange={handleVolumeChange}
                  videoError={videoError}
                  videoUrl={videoUrl}
                  volume={volume}
                />
              </PopoverContent>
            </Popover>
            <Button
              className="bg-background/80 backdrop-blur-sm"
              onClick={handleZenModeToggle}
              size="sm"
              title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Mode'}
              variant="outline"
            >
              {isZenMode ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
