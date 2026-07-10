# dropdown-menu

2026-07-09, transformation engine, migrated to `@base-ui/react/menu` (public names stay DropdownMenu*).

## Changed

- `apps/web/src/components/ui/dropdown-menu.tsx`: Content → Portal > Positioner > Popup; Label → GroupLabel; ItemIndicator → Checkbox/Radio indicators; Sub → SubmenuRoot; SubTrigger open marker `data-popup-open`; SubContent composes Content with submenu defaults.
- Consumers: triggers/items `asChild` → `render`; user-menu CSS vars `--radix-…` → `--anchor-width`; open-state classes → `data-popup-open`.
- Leftover scan clean.

## Left alone

- None remaining on this family.

## Behavior changes

- CheckboxItem/RadioItem `closeOnClick` defaults false in Base UI (flagged; not used in current app menus).
- Menu items for links use `render={<Link />}` instead of wrapping child.

## Verify by hand

- Theme toggle, user menu Dashboard/Settings links, Canvas assignment/calendar/grade course selects: keyboard arrows + typeahead + click.
