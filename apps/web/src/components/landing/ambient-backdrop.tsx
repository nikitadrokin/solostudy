/** 16/9 loop of the room the landing page is meant to feel like. */
const BACKDROP_LOOP_SRC = '/landing-page-bg.webm';

/** Single frame of the same loop, for viewers who ask for less motion. */
const BACKDROP_POSTER_SRC = '/landing-page-bg-poster.jpg';

/**
 * The focus room seen from outside: an ambient loop behind a scrim.
 *
 * Two layers, so the page never falls back to a black void: a token-built glow
 * that always renders, then the loop on top of it. Reduced-motion viewers get
 * the poster frame instead, swapped by the media query on <source> rather than
 * in JS, which keeps this a server component.
 *
 * Stays at z-0 rather than a negative z-index, which would drop it behind
 * body's opaque background; it paints first because it comes first in the DOM.
 */
export default function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      {/* Always-there glow, so a slow or blocked loop still reads as a room. */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_18%_12%,var(--color-chart-1),transparent),radial-gradient(60%_50%_at_82%_78%,var(--color-chart-4),transparent)] opacity-40" />

      {/* Cover the viewport at 16/9 without letterboxing at any aspect ratio. */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[max(100vh,56.25vw)] w-[max(100vw,177.7778vh)]">
        {/* No drift animation here: the loop already carries its own motion. */}
        <video
          autoPlay
          className="size-full object-cover motion-reduce:hidden"
          loop
          muted
          playsInline
          poster={BACKDROP_POSTER_SRC}
          preload="auto"
          src={BACKDROP_LOOP_SRC}
        />
        {/* Reduced motion gets the still frame, swapped in CSS to stay server-only. */}
        <div
          className="hidden size-full bg-center bg-cover motion-reduce:block"
          style={{ backgroundImage: `url(${BACKDROP_POSTER_SRC})` }}
        />
      </div>

      {/* Scrim: flat pass for legibility, gradient pass to seat the content. */}
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />
    </div>
  );
}
