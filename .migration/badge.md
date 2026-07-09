# badge

2026-07-09, transformation engine, Slot → `useRender` + `mergeProps`.

## Changed

- `apps/web/src/components/ui/badge.tsx`: `@radix-ui/react-slot` / `asChild` → `useRender` with `render` prop. Leftover scan clean.

## Left alone

- No app call sites used `Badge asChild`.

## Behavior changes

None for current consumers; polymorphic API is now `render` if needed.

## Verify by hand

- Grade predictor / quiz practice / study planner badges still render variants.
