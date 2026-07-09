# separator

2026-07-09, transformation engine (legacy `new-york`), migrated to `@base-ui/react/separator`.

## Changed

- `apps/web/src/components/ui/separator.tsx`: `@radix-ui/react-separator` → callable `Separator` from `@base-ui/react/separator`; dropped `decorative` prop. Leftover scan clean.
- Removed `@radix-ui/react-separator` from `apps/web/package.json` (batch with other leaf packages).

## Left alone

- Consumers (`item`, `button-group`, `sidebar`, settings pages) never passed `decorative`.

## Behavior changes

- Base UI separator is always semantic (`role="separator"`). Previous default was `decorative={true}` (presentational). No app call sites relied on `decorative`; flag if a purely visual rule must stay out of the a11y tree — use a plain `div`/`aria-hidden` instead.

## Verify by hand

- Settings / login separators still render as 1px rules horizontal and vertical.
- Screen reader: separator announced as separator (expected Base UI behavior).
