import type * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Soft progressive blur via a couple of stacked `backdrop-filter` bands.
 * Kept intentionally light (~1–2px) so content dissolves into glass instead of
 * getting crushed under a heavy opaque scrim.
 *
 * @see https://kennethnym.com/blog/progressive-blur-in-css/
 */

type BlurLayer = {
  /** Blur radius in CSS pixels. */
  blur: number;
  /** `mask-image` linear-gradient stops for this band. */
  mask: string;
};

/** Soft blur at the top, fading to clear. */
const TOP_LAYERS: BlurLayer[] = [
  {
    blur: 1,
    mask: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
  },
  {
    blur: 2,
    mask: 'linear-gradient(to bottom, black 0%, black 20%, transparent 65%)',
  },
];

/** Soft blur at the bottom, fading to clear. */
const BOTTOM_LAYERS: BlurLayer[] = [
  {
    blur: 1,
    mask: 'linear-gradient(to top, black 0%, black 35%, transparent 100%)',
  },
  {
    blur: 2,
    mask: 'linear-gradient(to top, black 0%, black 20%, transparent 65%)',
  },
];

type ProgressiveBlurProps = React.ComponentProps<'div'> & {
  /** Edge where blur is strongest. */
  side?: 'top' | 'bottom';
  /**
   * Whisper of surface color over the blur. Keep this subtle — opacity, not a
   * solid slab — so the falloff still reads as glass.
   */
  tint?: boolean;
};

function ProgressiveBlur({
  className,
  side = 'top',
  tint = true,
  style,
  ...props
}: ProgressiveBlurProps) {
  const layers = side === 'top' ? TOP_LAYERS : BOTTOM_LAYERS;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      data-slot="progressive-blur"
      style={style}
      {...props}
    >
      {layers.map((layer) => (
        <div
          className="absolute inset-0"
          key={layer.blur}
          style={{
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}
      {tint ? (
        <div
          className={cn(
            'absolute inset-0',
            side === 'top'
              ? 'bg-linear-to-b from-background/35 via-background/10 to-transparent'
              : 'bg-linear-to-t from-background/35 via-background/10 to-transparent'
          )}
        />
      ) : null}
    </div>
  );
}

export { ProgressiveBlur };
export type { ProgressiveBlurProps };
