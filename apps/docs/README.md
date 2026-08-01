# solostudy registry docs

A [Fumadocs](https://fumadocs.dev)-powered showcase for the **solostudy**
shadcn-compatible component registry. It renders a live preview, source, and
copy-paste install command for every item in
[`apps/web/registry.json`](../web/registry.json).

## Development

```bash
pnpm --filter docs dev
```

Then open [http://localhost:3000/docs](http://localhost:3000/docs).

The app uses Next.js `basePath: '/docs'` so it matches production at
[https://study.nkdr.me/docs](https://study.nkdr.me/docs).

## How it fits together

- **`registry.json`** — a copy of the web app's registry with file paths
  rewritten to this app's `components/ui` layout, so the primitives can be
  imported for live previews.
- **`components/ui/*`** — the registry components themselves (Base UI based).
- **`components/preview/*`** — the preview harness: `demos.tsx` holds one demo
  per component, `component-preview.tsx` renders the Preview/Code tabs plus the
  install command, and `install-command.tsx` is the package-manager switcher.
- **`content/docs/*`** — the MDX pages. Component pages are generated from
  `registry.json`.
- **`lib/source.ts`, `app/(docs)/*`, `app/(home)/*`** — the Fumadocs source
  loader, docs layout/page, and the showcase landing page (publicly under
  `/docs` via `basePath`).

## Regenerating component docs

After editing `registry.json`, regenerate the per-component MDX pages:

```bash
pnpm --filter docs gen:docs
```

## Building the registry JSON

To emit the shadcn registry files into `public/r`:

```bash
pnpm --filter docs registry:build
```
