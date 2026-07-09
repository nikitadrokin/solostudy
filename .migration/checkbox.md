# checkbox

2026-07-09, transformation engine (legacy `new-york`), migrated to `@base-ui/react/checkbox`.

## Changed

- `apps/web/src/components/ui/checkbox.tsx`: `radix-ui` Checkbox → `@base-ui/react/checkbox`; class hooks `data-[state=checked]` → `data-checked`; `disabled:` → `data-disabled:`. Leftover scan clean.

## Left alone

- Quiz-practice and other consumers; no `checked="indeterminate"` usage found.

## Behavior changes

- Root renders `<span>` + hidden input (was button-like). Focus/ring styles still apply via classes.
- Indeterminate is a separate `indeterminate` boolean if needed later.

## Verify by hand

- Quiz practice / any checkbox form: toggle, keyboard Space, focus ring, checked fill.
