# button

2026-07-09, transformation engine (legacy `new-york`), migrated to `@base-ui/react/button`.

## Changed

- `apps/web/src/components/ui/button.tsx`: Slot/`asChild`/`Slottable` → real `Button` primitive with `render` + `nativeButton` (defaults to `true` when no `render`). Custom `fullWidth` / `isLoading` / `icon` preserved. Leftover scan clean.
- Consumers updated `asChild` → `render`: announcements, auth-overlay, global-error, dashboard error, home page CTA, settings canvas link, alert-dialog Action/Cancel, combobox InputGroupButton.
- Removed `@radix-ui/react-slot` from `apps/web/package.json` (shared with badge/item/sidebar).

## Left alone

- Overlay triggers still using Radix `asChild` (DialogTrigger, DropdownMenuTrigger, TooltipTrigger, DynamicPopoverTrigger).

## Behavior changes

- Composition API is `render={<Link />}` with children on `Button`, not wrapping a single child via `asChild`.
- When `render` targets a non-`<button>`, set `nativeButton={false}` (links/anchors); AlertDialog Action/Cancel keep `nativeButton` because they remain buttons.

## Verify by hand

- Link-styled buttons (Settings CTA, error “Go Home”, announcements empty state): navigate and keep button styles.
- Loading buttons still show spinner and disable.
- Alert dialog action/cancel still close and look like buttons.
