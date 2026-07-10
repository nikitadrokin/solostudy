# project

2026-07-09, whole-project overlay batch after leaves/slot migration.

## Dependency swap

- Removed direct deps: `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-tooltip`, `radix-ui`.
- Overlay primitives now `@base-ui/react/{tooltip,popover,dialog,alert-dialog,menu}`.
- Intentionally untouched: `vaul` (drawer), `sonner`, `recharts` (chart).

## App-code sweep

- Universal `asChild` → `render` on Tooltip/Popover/Dialog/DropdownMenu/DynamicPopover consumers.
- Dialog dismiss guards moved to `onOpenChange` + `eventDetails.cancel()`.
- Registry JSON for `popover` / `dynamic-popover` / `visually-hidden` regenerated from source; design-sync Popover preview updated with Header/Title/Description.

## Final build

- `tsc --noEmit` clean after dep removal.
- Derived status: **0 wrappers remain on Radix** under `apps/web/src/components/ui`.
