# popover

2026-07-09, transformation engine (legacy `new-york`) + registry polish, migrated to `@base-ui/react/popover`.

## Changed

- `apps/web/src/components/ui/popover.tsx`: Content → Portal > Positioner > Popup; positioning props forwarded to Positioner; animation hooks → `data-starting-style`/`data-ending-style`; origin var → `--transform-origin`.
- Added shadcn-style `PopoverHeader`, `PopoverTitle`, `PopoverDescription` (Base UI Title/Description + layout header) for registry/docs consumers.
- Removed unused `PopoverAnchor` (no Base Anchor part; Positioner `anchor` covers it).
- Synced `apps/web/public/r/popover.json`, registry index deps, `.design-sync` preview/config.
- Leftover scan clean.

## Left alone

- Drawer/`vaul` stack used by dynamic-popover on mobile.

## Behavior changes

- `PopoverAnchor` export removed. No app call sites used it.
- Open/close transitions are CSS transition-based instead of tw-animate keyframes.

## Verify by hand

- Focus Room overlays (tasks/timer/settings/video): popovers position + animate.
- New header API: `PopoverHeader` + Title/Description spacing reads like other shadcn overlays.
