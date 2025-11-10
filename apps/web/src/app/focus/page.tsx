'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import YouTubePlayer from '@/components/focus-room/youtube-player';
import { authClient } from '@/lib/auth-client';
import { useFocusStore } from '@/stores/focus-store';
import { useVideoStore } from '@/stores/video-store';
import { trpc, trpcClient } from '@/utils/trpc';
import OverlayControls from './overlay-controls';

const DEFAULT_VIDEO_URL = 'https://www.youtube.com/watch?v=jfKfPfyJRdk';

export default function FocusRoom() {
  const { data: session } = authClient.useSession();
  const { videoUrl: zustandVideoUrl, volume } = useFocusStore();
  const {
    handlePlayerReady,
    handlePlay,
    handlePause,
    handleError,
    reloadKey,
    savedTimestamp,
    setOnVideoUrlChangePersist,
  } = useVideoStore();

  const [persistedVideoUrl, setPersistedVideoUrl] = useState<string | null>(
    null
  );
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  const { data: lastPlayedVideo } = useQuery(
    trpc.video.getLastPlayed.queryOptions(undefined, {
      enabled: !!session,
      retry: false,
    })
  );

  const { mutate: setLastPlayed } = useMutation({
    mutationFn: (input: { videoUrl: string }) =>
      trpcClient.video.setLastPlayed.mutate(input),
  });

  useEffect(() => {
    if (session && lastPlayedVideo !== undefined) {
      if (lastPlayedVideo) {
        // don't remove the type cast, build fails without it
        setPersistedVideoUrl(lastPlayedVideo as string);
      } else {
        setPersistedVideoUrl(null);
      }
      setIsLoadingVideo(false);
    } else if (!session) {
      setPersistedVideoUrl(null);
      setIsLoadingVideo(false);
    }
  }, [session, lastPlayedVideo]);

  const persistCallback = useCallback(
    (url: string) => {
      setLastPlayed({ videoUrl: url });
      setPersistedVideoUrl(url);
    },
    [setLastPlayed]
  );

  useEffect(() => {
    if (session) {
      setOnVideoUrlChangePersist(persistCallback);
    } else {
      setOnVideoUrlChangePersist(undefined);
    }

    return () => {
      setOnVideoUrlChangePersist(undefined);
    };
  }, [session, persistCallback, setOnVideoUrlChangePersist]);

  const currentVideoUrl = session
    ? persistedVideoUrl || DEFAULT_VIDEO_URL
    : zustandVideoUrl || DEFAULT_VIDEO_URL;

  if (isLoadingVideo) {
    return (
      <main className="relative flex h-full items-center justify-center overflow-hidden">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="relative h-full overflow-hidden">
      <YouTubePlayer
        onError={handleError}
        onPause={handlePause}
        onPlay={handlePlay}
        onReady={handlePlayerReady}
        reloadKey={reloadKey}
        startTime={savedTimestamp ?? undefined}
        videoUrl={currentVideoUrl}
        volume={volume}
      />

      {/* Clickable overlay to control video */}
      <div
        className="absolute inset-0 z-[5]"
        onClick={() => {
          const { player, isPlaying, setIsPlaying } = useVideoStore.getState();
          if (player && !isPlaying) {
            try {
              player.playVideo();
              setIsPlaying(true);
            } catch {
              // Ignore errors
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            const { player, isPlaying, setIsPlaying } =
              useVideoStore.getState();
            if (player && !isPlaying) {
              try {
                player.playVideo();
                setIsPlaying(true);
              } catch {
                // Ignore errors
              }
            }
          }
        }}
        role="button"
        tabIndex={0}
        title="Play video"
      />

      {/* Overlay Controls */}
      <OverlayControls />
    </main>
  );
}
