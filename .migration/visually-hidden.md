# visually-hidden

2026-07-09, transformation engine (no Base UI counterpart), `sr-only` span.

## Changed

- `apps/web/src/components/ui/visually-hidden.tsx`: dropped `radix-ui` VisuallyHidden; both `VisuallyHidden` and `VisuallyHiddenRoot` render `<span className="sr-only">`. Leftover scan clean.

## Left alone

- `dynamic-popover.tsx` (overlay registry) still imports `VisuallyHidden` — API compatible; overlay rewrite deferred.

## Behavior changes

None; clip-rect pattern via Tailwind `sr-only`.

## Verify by hand

- Dynamic popover / dialog titles that use VisuallyHidden remain available to screen readers and hidden visually.
