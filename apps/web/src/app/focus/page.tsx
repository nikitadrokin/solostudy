'use client';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import ControlsPanel from '@/components/focus-room/controls-panel';
import YouTubePlayer from '@/components/focus-room/youtube-player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { useFocusStore } from '@/lib/focus-store';

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
  const [player, setPlayer] = useState<YT.Player | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: infinite rerender
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session]);

  // YouTube player callbacks
  const handlePlayerReady = useCallback((event: { target: YT.Player }) => {
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
    <div className="z-0 flex h-full">
      {/* Main Content Area */}
      <div className="relative flex-1">
        {/* YouTube Video Background */}
        <div className="-z-10 absolute inset-0">
          {videoUrl ? (
            <YouTubePlayer
              className="h-full w-full"
              onError={handleError}
              onPause={handlePause}
              onPlay={handlePlay}
              onReady={handlePlayerReady}
              videoUrl={videoUrl}
              volume={volume}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-muted-foreground dark:from-gray-900 dark:to-gray-800">
              <div className="text-center">
                <h2 className="mb-2 font-semibold text-2xl">
                  YouTube Focus Background
                </h2>
                <p>Enter a YouTube URL in the controls below to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Overlay Controls */}
        {!isZenMode && (
          <div className="absolute top-4 right-4 left-4 z-10">
            <div className="flex items-start justify-between">
              {/* Study Session Info */}
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                    <span className="font-medium text-sm">
                      Focus Session Active
                    </span>
                  </div>
                  <p className="mt-1 font-bold text-2xl">00:00:00</p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="flex gap-2">
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
                <Button
                  className="bg-background/80 backdrop-blur-sm"
                  size="sm"
                  variant="secondary"
                >
                  Take Break
                </Button>
                <Button
                  className="bg-background/80 backdrop-blur-sm"
                  size="sm"
                  variant="destructive"
                >
                  End Session
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Zen Mode Toggle - Always visible */}
        {isZenMode && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              className="bg-background/80 backdrop-blur-sm"
              onClick={handleZenModeToggle}
              size="sm"
              title="Exit Zen Mode"
              variant="outline"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        {!isZenMode && (
          <div className="absolute right-4 bottom-4 left-4 z-10">
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
          </div>
        )}
      </div>

      {/* AI Assistant Sidebar - Collapsed by default */}
      {!isZenMode && (
        <div className="w-80 border-l bg-background shadow-lg">
          <Card className="h-full rounded-none border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                AI Study Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              {/* Chat Messages */}
              <div className="mb-4 flex-1 space-y-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm">
                    Welcome to your focus session! I'm here to help you stay
                    motivated and productive. What are you studying today?
                  </p>
                </div>
              </div>

              {/* Chat Input */}
              <div className="space-y-2">
                <textarea
                  className="h-20 w-full resize-none rounded-md border px-3 py-2"
                  disabled
                  placeholder="Ask me anything about your studies..."
                />
                <Button className="w-full" disabled>
                  Send Message
                </Button>
                <p className="text-center text-muted-foreground text-xs">
                  AI integration coming in Phase 4
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
