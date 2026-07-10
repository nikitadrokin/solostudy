# sheet

2026-07-09, transformation engine, migrated to `@base-ui/react/dialog` (sheet pattern).

## Changed

- `apps/web/src/components/ui/sheet.tsx`: Overlay → Backdrop, Content → Popup; per-side slide expressed with `data-starting-style`/`data-ending-style` translate classes.
- Leftover scan clean.

## Left alone

- Sidebar mobile sheet consumers (props compatible).

## Behavior changes

- Enter/exit timing still differs between start/end (500ms vs 300ms) via starting/ending duration classes.

## Verify by hand

- Mobile sidebar sheet open/close from rail; close button still works; sides left/right if exercised.
