# dynamic-popover

2026-07-09, transformation engine on top of migrated Popover/Tooltip; registry composition preserved.

## Changed

- `apps/web/src/components/ui/dynamic-popover.tsx`: dropped Radix Content type import; desktop title/description use `PopoverTitle`/`PopoverDescription`; trigger API is `render` (maps to DrawerTrigger `asChild` on mobile); shared open props narrowed so Drawer (vaul) and Popover stay type-safe.
- Floating header (`DynamicPopoverHeader`) + measured `--dynamic-popover-header-height` + body scroll offset unchanged.
- Synced `apps/web/public/r/dynamic-popover.json`.
- Consumers: focus overlay controls + focus timer → `render={<Button … />}`.
- Leftover scan clean (vaul `asChild` only on mobile drawer path).

## Left alone

- Drawer/`vaul` itself (hard rule).

## Behavior changes

- Call sites use `render` instead of `asChild` for composition with Button.
- Desktop titles are real Base UI `Popover.Title` / `Description` (better a11y wiring).

## Verify by hand

- Desktop Focus Room: open Tasks / Timer / Settings / Background; floating header fades over scroll body; measured padding matches header height.
- Mobile: same triggers open drawers; optional `title` still provides VisuallyHidden drawer title.
