# aspect-ratio

2026-07-09, transformation engine (no Base UI counterpart), CSS `aspect-ratio` on a `div`.

## Changed

- `apps/web/src/components/ui/aspect-ratio.tsx`: replaced `@radix-ui/react-aspect-ratio` with a `div` applying `style.aspectRatio` from `ratio` (default `1`). Leftover scan clean.
- Removed `@radix-ui/react-aspect-ratio` from `apps/web/package.json`.

## Left alone

- Call sites in `video-picker.tsx` / `overlay-dialog.tsx` already pass `ratio={16 / 9}` — unchanged.

## Behavior changes

None expected; CSS `aspect-ratio` matches the Radix prop mapping.

## Verify by hand

- Focus Room video picker: thumbnails keep 16:9.
- Overlay dialog media previews: same ratio, no layout collapse.
