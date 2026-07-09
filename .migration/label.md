# label

2026-07-09, transformation engine (legacy `new-york`, no Base counterpart), migrated to native `<label>`.

## Changed

- `apps/web/src/components/ui/label.tsx`: dropped `radix-ui` `Label` primitive; render native `<label>` with the same classes/`data-slot`. Leftover scan clean (`grep -n "radix-ui\|@radix-ui"`).

## Left alone

- Overlay wrappers still on Radix (dialog, sheet, alert-dialog, popover, tooltip, dropdown-menu) — deferred by request.
- `field.tsx` still imports `Label`; no call-site prop changes needed.

## Behavior changes

- Radix Label’s double-click text-selection prevention is gone; `select-none` in classes covers the common case.

## Verify by hand

- Open Settings / Focus Room controls: labels still associate with inputs via `htmlFor` / wrapping.
- Double-click a label: text should not select awkwardly; peer-disabled opacity still applies.
