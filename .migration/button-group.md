# button-group

2026-07-09, transformation engine, Slot → `useRender` on `ButtonGroupText`.

## Changed

- `apps/web/src/components/ui/button-group.tsx`: `radix-ui` `Slot.Root` / `asChild` → `useRender` + `render`. Leftover scan clean.

## Left alone

- No app consumers of `ButtonGroupText asChild` found.

## Behavior changes

None for current usage.

## Verify by hand

- If button-group appears in UI: orientation classes and separator still join controls.
