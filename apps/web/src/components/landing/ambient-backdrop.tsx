'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type AmbientBackdropProps = {
  /** YouTube id of the video the focus room opens with. */
  videoId: string;
};

/** Wait for first paint to settle before pulling in the YouTube iframe. */
const VIDEO_MOUNT_DELAY_MS = 600;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function buildAmbientEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    disablekb: '1',
    fs: '0',
    modestbranding: '1',
    rel: '0',
    loop: '1',
    playlist: videoId,
    iv_load_policy: '3',
    playsinline: '1',
    cc_load_policy: '0',
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * The focus room seen from outside: the same ambient video, behind a scrim.
 *
 * Three layers, each one optional so the page never falls back to a black
 * void: a token-built glow that always renders, the video's poster frame on
 * top of it once it loads, then the muted video itself. Reduced-motion
 * viewers stop at the poster.
 *
 * Stays at z-0 rather than a negative z-index, which would drop it behind
 * body's opaque background; it paints first because it comes first in the DOM.
 */
export default function AmbientBackdrop({ videoId }: AmbientBackdropProps) {
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isPosterVisible, setIsPosterVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setIsVideoMounted(true),
      VIDEO_MOUNT_DELAY_MS
    );

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      {/* Always-there glow, so a missing poster or blocked embed still reads as a room. */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_18%_12%,var(--color-chart-1),transparent),radial-gradient(60%_50%_at_82%_78%,var(--color-chart-4),transparent)] opacity-40" />

      {/* Cover the viewport at 16/9 without letterboxing at any aspect ratio. */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[max(100vh,56.25vw)] w-[max(100vw,177.7778vh)]">
        {/* biome-ignore lint/performance/noImgElement: hotlinked YouTube poster, no image optimization budget to spend */}
        {/* biome-ignore lint/nursery/noNoninteractiveElementInteractions: onLoad is a load event, not an interaction */}
        <img
          alt=""
          className={cn(
            'size-full object-cover transition-opacity duration-700 ease-out will-change-transform motion-safe:animate-ambient-drift',
            isPosterVisible ? 'opacity-100' : 'opacity-0'
          )}
          draggable={false}
          fetchPriority="low"
          onLoad={() => setIsPosterVisible(true)}
          src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        />

        {isVideoMounted && (
          // biome-ignore lint/nursery/noNoninteractiveElementInteractions: onLoad is a load event, not an interaction
          <iframe
            allow="autoplay; encrypted-media"
            className={cn(
              'absolute inset-0 size-full transition-opacity duration-700 ease-out',
              isVideoVisible ? 'opacity-100' : 'opacity-0'
            )}
            frameBorder="0"
            onLoad={() => setIsVideoVisible(true)}
            referrerPolicy="strict-origin-when-cross-origin"
            src={buildAmbientEmbedUrl(videoId)}
            tabIndex={-1}
            title="Ambient focus room background"
          />
        )}
      </div>

      {/* Scrim: flat pass for legibility, gradient pass to seat the content. */}
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
    </div>
  );
}
