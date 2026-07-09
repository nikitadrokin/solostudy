# sidebar

2026-07-09, transformation engine, Slot/Slottable → `useRender` + `mergeProps` on polymorphic parts.

## Changed

- `apps/web/src/components/ui/sidebar.tsx`: removed `@radix-ui/react-slot`; `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuSubButton` take `render` instead of `asChild`. SubButton hit-area span composed via children in `mergeProps`. Leftover radix scan clean (TooltipTrigger `asChild` remains — overlay deferred).
- Consumers: `app-sidebar.tsx`, `user-menu.tsx` updated to `render={<Link />}` / nested Collapsible `render`.

## Left alone

- Sheet/Tooltip inside sidebar still Radix overlays.
- Commented Canvas collapsible block in `app-sidebar.tsx` still shows old `asChild` (inactive).

## Behavior changes

- Composition API `asChild` → `render` for sidebar menu buttons/links.
- Nested `CollapsibleTrigger render={<SidebarMenuButton render={<Link />} />}`: confirm Settings row still opens and navigates.

## Verify by hand

- Collapse sidebar to icon mode; tooltips on menu buttons.
- Main nav links, Settings expand, Settings sub-links, Sign In link, admin Focus videos link.
- Mobile sheet sidebar still opens via trigger.
