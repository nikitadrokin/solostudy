'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import YouTubePlayer from '@/components/focus-room/youtube-player';
import { authClient } from '@/lib/auth-client';
import { useFocusStore } from '@/stores/focus-store';
import { useVideoStore } from '@/stores/video-store';
import { api, apiClient } from '@/utils/trpc';
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
    flushResumeToSession,
  } = useVideoStore();

  const [persistedVideoId, setPersistedVideoId] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [openPopoverCount, setOpenPopoverCount] = useState(0);
  const openPopoverCountRef = useRef(0);
  const suppressVideoToggleUntilRef = useRef(0);
  const isAnyPopoverOpen = openPopoverCount > 0;

  const handlePopoverOpenChange = useCallback((isOpen: boolean) => {
    const nextCount = isOpen
      ? openPopoverCountRef.current + 1
      : Math.max(openPopoverCountRef.current - 1, 0);

    openPopoverCountRef.current = nextCount;
    setOpenPopoverCount(nextCount);

    if (isOpen) {
      suppressVideoToggleUntilRef.current = 0;
      return;
    }

    if (nextCount === 0) {
      suppressVideoToggleUntilRef.current = Date.now() + 150;
    }
  }, []);

  const handleOverlayPlayPause = useCallback(() => {
    if (openPopoverCountRef.current > 0) {
      return;
    }

    if (suppressVideoToggleUntilRef.current > Date.now()) {
      return;
    }

    const { handlePlayPause } = useVideoStore.getState();
    handlePlayPause();
  }, []);

  const { data: lastPlayedVideo, isLoading: isLoadingLastPlayedVideo } =
    useQuery(
      api.video.getLastPlayed.queryOptions(undefined, {
        enabled: !!session,
        retry: false,
      })
    );

  const { mutate: setLastPlayed } = useMutation({
    mutationFn: (input: { videoId: string }) =>
      apiClient.video.setLastPlayed.mutate(input),
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

  useEffect(() => {
    const flush = () => {
      flushResumeToSession(currentVideoId);
    };

    window.addEventListener('pagehide', flush);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    const intervalId = window.setInterval(flush, 15_000);

    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(intervalId);
    };
  }, [currentVideoId, flushResumeToSession]);

  if (isLoadingVideo || isLoadingLastPlayedVideo) {
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
          handleOverlayPlayPause();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOverlayPlayPause();
          }
        }}
        role="button"
        tabIndex={0}
        title={isAnyPopoverOpen ? 'Close the popover to control playback' : ''}
      />

      {/* Overlay Controls */}
      <OverlayControls onPopoverOpenChange={handlePopoverOpenChange} />
    </main>
  );
}
