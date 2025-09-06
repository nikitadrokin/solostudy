'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import YouTubePlayer from '@/components/focus-room/youtube-player';
import { authClient } from '@/lib/auth-client';
import { useFocusStore } from '@/lib/focus-store';
import { useVideoStore } from '@/lib/video-store';
import OverlayControls from './overlay-controls';

export default function FocusRoom() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Zustand stores
  const { videoUrl, volume } = useFocusStore();
  const { handlePlayerReady, handlePlay, handlePause, handleError } =
    useVideoStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: infinite rerender
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (!(session || isPending)) {
      router.push('/login');
    }
  }, [session, isPending]);

  return (
    <main className="relative h-full overflow-hidden">
      {!isPending && (
        <YouTubePlayer
          onError={handleError}
          onPause={handlePause}
          onPlay={handlePlay}
          onReady={handlePlayerReady}
          videoUrl={videoUrl || 'https://www.youtube.com/watch?v=We4uRmMjjhM'}
          volume={volume}
        />
      )}

      {/* Overlay Controls */}
      <OverlayControls />
    </main>
  );
}
