import { ArrowRight, Package, Terminal } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { registry, registryItems } from '@/lib/registry';

export const metadata: Metadata = {
  title: 'solostudy registry',
  description:
    'A shadcn-compatible component registry powering study.nkdr.me. Browse, preview, and install every component with a single command.',
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-fd-muted-foreground text-sm">
          <Package className="size-4" />
          {registryItems.length} components · shadcn-compatible
        </span>
        <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
          The <span className="text-fd-primary">solostudy</span> component
          registry
        </h1>
        <p className="max-w-2xl text-balance text-fd-muted-foreground text-lg">
          Every UI primitive powering{' '}
          <a
            className="font-medium text-fd-foreground underline underline-offset-4"
            href="https://study.nkdr.me"
            rel="noreferrer"
            target="_blank"
          >
            study.nkdr.me
          </a>
          , built on Base UI and distributed through the shadcn CLI. Preview
          each component and copy the install command.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground text-sm transition-opacity hover:opacity-90"
            href="/docs/components"
          >
            Browse components
            <ArrowRight className="size-4" />
          </Link>
          <code className="inline-flex items-center gap-2 rounded-md border border-fd-border bg-fd-card px-4 py-2 font-mono text-sm">
            <Terminal className="size-4 text-fd-muted-foreground" />
            npx shadcn@latest add {registry.homepage}/r/button.json
          </code>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {registryItems.map((item) => (
            <Link
              className="group flex flex-col gap-1 rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-primary/40 hover:bg-fd-accent/40"
              href={`/docs/components/${item.name}`}
              key={item.name}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.title}</span>
                <ArrowRight className="size-4 text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <span className="line-clamp-2 text-fd-muted-foreground text-sm">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
