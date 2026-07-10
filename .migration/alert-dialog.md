# alert-dialog

2026-07-09, transformation engine, migrated to `@base-ui/react/alert-dialog`.

## Changed

- `apps/web/src/components/ui/alert-dialog.tsx`: Overlay → Backdrop, Content → Popup; Cancel/Action map to `Close` rendered through `Button` (no Action primitive).
- Leftover scan clean.
- Admin focus-room delete dialogs keep their own footer Buttons (already not using Action/Cancel primitives for confirm).

## Left alone

- Custom footer buttons in admin catalogs (unchanged API).

## Behavior changes

- Action is `Close` styled as Button (closes dialog); previously Radix Action also closed. Flag: initial focus defaults to first tabbable (Radix preferred Cancel) — not patched.

## Verify by hand

- Admin remove tag / remove video alert dialogs open, Esc closes, buttons work.
