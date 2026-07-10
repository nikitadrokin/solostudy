# tooltip

2026-07-09, transformation engine (legacy `new-york`), migrated to `@base-ui/react/tooltip`.

## Changed

- `apps/web/src/components/ui/tooltip.tsx`: Provider `delayDuration` → `delay`; Content → Portal > Positioner > Popup with `data-starting-style`/`data-ending-style`; CSS var `--transform-origin`. Leftover scan clean.
- `apps/web/src/components/ui/sidebar.tsx`: `delayDuration={0}` → `delay={0}`; `TooltipTrigger asChild` → `render`.

## Left alone

- Nested TooltipProvider wrapping inside `Tooltip` kept for drop-in parity with the previous wrapper.

## Behavior changes

- `skipDelayDuration` has no provider equivalent exposed (Base `timeout` available if needed later). Flagged only; not used in app.

## Verify by hand

- Sidebar collapsed icon mode: hover tooltip delay ~200ms (global) / 0ms inside sidebar provider.
- Focus Room DynamicPopoverTrigger tooltips open/close cleanly.
