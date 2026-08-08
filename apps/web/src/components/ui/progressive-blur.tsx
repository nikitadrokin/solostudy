import type * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Progressive blur via stacked `backdrop-filter` bands.
 *
 * A single blur is scalar — one radius across the whole element — so
 * `mask-image` can only fade that filtered result's alpha, not the blur
 * amount. The real technique (iOS / Linear / Vercel) stacks 6–8 layers at
 * exponential radii, each masked over a staggered range, so the eye reads a
 * continuous ramp even though the steps are discrete.
 *
 * @see https://kennethnym.com/blog/progressive-blur-in-css/
 */

type BlurLayer = {
  /** Blur radius in CSS pixels. */
  blur: number;
  /** `mask-image` linear-gradient for this band. */
  mask: string;
};

/**
 * Band stops measured from the clear edge toward the strong edge.
 * Each band overlaps the next so seams disappear.
 */
const BLUR_BANDS: Array<{ blur: number; stops: string }> = [
  {
    blur: 1,
    stops: 'transparent, black 10%, black 30%, transparent 40%',
  },
  {
    blur: 2,
    stops: 'transparent 10%, black 20%, black 40%, transparent 50%',
  },
  {
    blur: 4,
    stops: 'transparent 15%, black 30%, black 50%, transparent 60%',
  },
  {
    blur: 8,
    stops: 'transparent 20%, black 40%, black 60%, transparent 70%',
  },
  {
    blur: 16,
    stops: 'transparent 40%, black 60%, black 80%, transparent 90%',
  },
  {
    blur: 32,
    stops: 'transparent 60%, black 80%',
  },
  {
    blur: 64,
    stops: 'transparent 70%, black 100%',
  },
];

/** Strongest blur at the top, fading clear toward the bottom. */
const TOP_LAYERS: BlurLayer[] = BLUR_BANDS.map(({ blur, stops }) => ({
  blur,
  mask: `linear-gradient(to top, ${stops})`,
}));

/** Strongest blur at the bottom, fading clear toward the top. */
const BOTTOM_LAYERS: BlurLayer[] = BLUR_BANDS.map(({ blur, stops }) => ({
  blur,
  mask: `linear-gradient(to bottom, ${stops})`,
}));

type ProgressiveBlurProps = React.ComponentProps<'div'> & {
  /** Edge where blur is strongest. */
  side?: 'top' | 'bottom';
  /**
   * Soft surface tint over the blur. Opacity falloff only — never a hard
   * slab — so content still reads through the glass.
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
              ? 'bg-linear-to-b from-background/65 via-background/25 to-transparent'
              : 'bg-linear-to-t from-background/65 via-background/25 to-transparent'
          )}
        />
      ) : null}
    </div>
  );
}

export { ProgressiveBlur };
export type { ProgressiveBlurProps };
