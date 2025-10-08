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
        videoUrl={videoUrl || 'https://www.youtube.com/watch?v=We4uRmMjjhM'}
        volume={volume}
      />

      {/* Overlay Controls */}
      <OverlayControls />
    </main>
  );
}
