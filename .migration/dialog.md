# dialog

2026-07-09, transformation engine, migrated to `@base-ui/react/dialog`.

## Changed

- `apps/web/src/components/ui/dialog.tsx`: Overlay → Backdrop, Content → Popup; open/close animations via starting/ending styles.
- Consumers: `DialogTrigger asChild` → `render`; settings dialogs that used `onInteractOutside` + `preventDefault` now cancel via `onOpenChange` `eventDetails.cancel()` while mutations load.
- Leftover scan clean.

## Left alone

- Sheet (separate wrapper, same Dialog primitive family).

## Behavior changes

- Dismiss interception moves from Content event props to Root `onOpenChange` reason/`cancel()` (api-keys, canvas, passkeys).

## Verify by hand

- Settings Canvas connect/edit dialog: cannot dismiss while pending.
- API key create/delete dialogs: same guard.
- Home Install modal / auth overlay Learn More open via `render` Button trigger.
