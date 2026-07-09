# collapsible

2026-07-09, transformation engine (legacy `new-york`), migrated to `@base-ui/react/collapsible`.

## Changed

- `apps/web/src/components/ui/collapsible.tsx`: `@radix-ui/react-collapsible` → `Collapsible` namespace; `Content` → `Panel` (public export name `CollapsibleContent` kept). Leftover scan clean.
- `apps/web/src/components/app-sidebar.tsx`: `asChild` → `render` on `Collapsible` / `CollapsibleTrigger` / nested sidebar buttons (active settings section). Commented Canvas block left with old `asChild` (dead code).
- Removed `@radix-ui/react-collapsible` from `apps/web/package.json`.

## Left alone

- Overlay `asChild` call sites (DialogTrigger, etc.).

## Behavior changes

- `onOpenChange` gains a second `eventDetails` argument (existing single-arg handlers remain type-safe).
- Trigger open marker is `data-panel-open` (no consumer styles depended on `data-state` here).

## Verify by hand

- Sidebar Settings group: expand/collapse chevron; nested hash links still navigate.
- Keyboard: trigger toggles panel; focus stays sensible.
