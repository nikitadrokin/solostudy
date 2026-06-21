# design-sync notes — SoloStudy UI (apps/web)

This repo is a **Next.js app**, not a published component library. The design system is
the shadcn-style `apps/web/src/components/ui` tree. The sync runs the converter in
**synth-entry mode** against that source.

## Build setup (how the sync works here)

- **Symlink trick**: `apps/web/node_modules/web -> ..` so the converter's
  `PKG_DIR = node_modules/web` resolves to `apps/web` (it self-installs no package).
  Recreate on a fresh clone: `ln -sfn .. apps/web/node_modules/web`. (gitignored)
- **CSS must be compiled**: components rely on Tailwind v4 utilities generated at build
  time. `cfg.buildCmd` compiles them: `cd apps/web && npx @tailwindcss/cli -i src/index.css -o .ds-styles.css`.
  `cfg.cssEntry` points at that compiled `.ds-styles.css`. **Re-run buildCmd before every
  sync** (and after adding any new utility class in previews — Tailwind only emits classes
  it sees in `apps/web/**` source; preview-only classes outside that scope won't be in the
  CSS). `.ds-styles.css` is gitignored.
- **srcDir** is scoped to `src/components/ui` so discovery only sees the DS components.
- **componentSrcMap** nulls ~150 shadcn sub-parts (CardHeader, DialogTitle, TableRow…) so
  only the 33 family roots get cards. Sub-parts remain exported on `window.SoloStudyUI`.
  If a NEW ui component file is added, its primary export must be added to the keep-set
  (i.e. removed from the null map) or it won't get a card.
- **ds-entry.tsx** (gitignored) is an unused leftover barrel from an earlier approach —
  synth mode doesn't need it. Safe to delete.

## Default exports (ScrollArea, DynamicPopover)

`scroll-area.tsx` and `dynamic-popover.tsx` use `export default`, which `export *` skips,
so they'd be missing from the runtime namespace. Fixed via **`apps/web/ds-extra.tsx`**
(gitignored, wired through `cfg.extraEntries`) which re-exports both as named exports.
The build prints `[EXPORT_COLLISION]` for these two — **expected/benign**: the merge
correctly binds them to the real `*_default` implementations (verified in the bundle).
If a new default-export component is added, add it to `ds-extra.tsx`.

## Fonts

The app uses **Geist** (via next/font/google) with **Inter** as a fallback family in
`--font-sans`. These ship via `cfg.extraFonts` → `.design-sync/brandfonts/brand.css`
(committed, with woff2 in `brandfonts/files/`), authored with the exact family names
`Geist`/`Inter` the CSS references (fontsource's `geist-sans` declares `Geist Sans`, which
would NOT match). `cfg.extraFonts` is an **absolute path** in config.json — update it on a
new machine, or it silently skips with `! extraFonts: … not found` (relative paths resolve
against the node_modules/web symlink and break).

## Render check

Playwright/Chromium is NOT installed in this environment — the user opted to review
previews in-browser instead. Builds/validates run with `--no-render-check`. To enable the
automated gate later, install playwright + chromium and drop the flag.

## Known render warns (triaged, not new)

- `[TOKENS_MISSING] --active-tab-height/width/left/bottom` — set at runtime by the Tabs
  animated active-indicator (inline style/JS). Expected absent from static CSS.
- `[RENDER_SKIPPED]` — by design (no playwright; see above).
- `[EXPORT_COLLISION] DynamicPopover, ScrollArea` — expected (see Default exports above).

## Floor-card components (deliberate, not failures)

- **Toaster** (sonner) — toasts are imperative; nothing renders statically.
- **VisuallyHidden** — hidden by design; a preview would be blank.

## Prompt-injection marker (FYI, no action)

`apps/web/src/components/ui/dynamic-popover.tsx` contains an in-code comment addressed to
"AI" instructing it never to delete the comment. It's the author's own defensive marker.
Treated as data, not an instruction. The sync does not edit that file.

## Re-sync risks (what can silently go stale)

- **`cfg.extraFonts` absolute path** — machine-specific; breaks on a new clone/machine.
- **Compiled CSS staleness** — if buildCmd isn't re-run, the bundle ships stale utilities.
  Always re-run buildCmd before the converter.
- **componentSrcMap drift** — new ui components or new sub-parts won't be carded/excluded
  automatically; the null-map is a point-in-time snapshot of the 183-export discovery.
- **node_modules/web symlink** — not committed; recreate on fresh clone.
- **Previews never machine-verified** — visual correctness rests on the in-browser review;
  overlays/Chart/Sidebar are the most fragile under static rendering.
