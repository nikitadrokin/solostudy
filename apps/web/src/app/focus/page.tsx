'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import YouTubePlayer from '@/components/focus-room/youtube-player';
import { authClient } from '@/lib/auth-client';
import { useFocusStore } from '@/stores/focus-store';
import { useVideoStore } from '@/stores/video-store';
import { trpc, trpcClient } from '@/utils/trpc';
import OverlayControls from './overlay-controls';

const DEFAULT_VIDEO_ID = 'jfKfPfyJRdk';

export default function FocusRoom() {
  const { data: session } = authClient.useSession();
  const { videoId: zustandVideoId, volume } = useFocusStore();
  const {
    handlePlayerReady,
    handlePlay,
    handlePause,
    handleError,
    reloadKey,
    savedTimestamp,
    setOnVideoIdChangePersist,
  } = useVideoStore();

  const [persistedVideoId, setPersistedVideoId] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  const { data: lastPlayedVideo } = useQuery(
    trpc.video.getLastPlayed.queryOptions(undefined, {
      enabled: !!session,
      retry: false,
    })
  );

  const { mutate: setLastPlayed } = useMutation({
    mutationFn: (input: { videoId: string }) =>
      trpcClient.video.setLastPlayed.mutate(input),
  });

  useEffect(() => {
    if (session && lastPlayedVideo !== undefined) {
      if (lastPlayedVideo) {
        setPersistedVideoId(lastPlayedVideo as string);
      } else {
        setPersistedVideoId(null);
      }
      setIsLoadingVideo(false);
    } else if (!session) {
      setPersistedVideoId(null);
      setIsLoadingVideo(false);
    }
  }, [session, lastPlayedVideo]);

  const persistCallback = useCallback(
    (id: string) => {
      setLastPlayed({ videoId: id });
      setPersistedVideoId(id);
    },
    [setLastPlayed]
  );

  useEffect(() => {
    if (session) {
      setOnVideoIdChangePersist(persistCallback);
    } else {
      setOnVideoIdChangePersist(undefined);
    }

    return () => {
      setOnVideoIdChangePersist(undefined);
    };
  }, [session, persistCallback, setOnVideoIdChangePersist]);

  const currentVideoId = session
    ? persistedVideoId || DEFAULT_VIDEO_ID
    : zustandVideoId || DEFAULT_VIDEO_ID;

  if (isLoadingVideo) {
    return (
      <main className="relative flex h-full items-center justify-center overflow-hidden">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="relative h-full select-none overflow-hidden">
      <YouTubePlayer
        onError={handleError}
        onPause={handlePause}
        onPlay={handlePlay}
        onReady={handlePlayerReady}
        reloadKey={reloadKey}
        startTime={savedTimestamp ?? undefined}
        videoId={currentVideoId}
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
