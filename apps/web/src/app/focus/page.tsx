'use client';

import YouTubePlayer from '@/components/focus-room/youtube-player';
import { useFocusStore } from '@/stores/focus-store';
import { useVideoStore } from '@/stores/video-store';
import OverlayControls from './overlay-controls';

export default function FocusRoom() {
  // Zustand stores
  const { videoUrl, volume } = useFocusStore();
  const {
    handlePlayerReady,
    handlePlay,
    handlePause,
    handleError,
    reloadKey,
    savedTimestamp,
  } = useVideoStore();

  return (
    <main className="relative h-full overflow-hidden">
      <YouTubePlayer
        onError={handleError}
        onPause={handlePause}
        onPlay={handlePlay}
        onReady={handlePlayerReady}
        reloadKey={reloadKey}
        startTime={savedTimestamp ?? undefined}
        videoUrl={videoUrl || 'https://www.youtube.com/watch?v=jfKfPfyJRdk'}
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
