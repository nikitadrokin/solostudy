'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const MANAGERS = [
  { key: 'pnpm', exec: 'pnpm dlx' },
  { key: 'npm', exec: 'npx' },
  { key: 'yarn', exec: 'yarn dlx' },
  { key: 'bun', exec: 'bunx --bun' },
] as const;

type InstallCommandProps = {
  /** Fully-qualified URL to the component's registry JSON. */
  url: string;
};

export function InstallCommand({ url }: InstallCommandProps) {
  const [active, setActive] =
    useState<(typeof MANAGERS)[number]['key']>('pnpm');
  const [copied, setCopied] = useState(false);

  const manager = MANAGERS.find((m) => m.key === active) ?? MANAGERS[0];
  const command = `${manager.exec} shadcn@latest add ${url}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <div className="flex items-center justify-between border-fd-border border-b px-1">
        <div className="flex">
          {MANAGERS.map((m) => (
            <button
              className={cn(
                'px-3 py-2 font-medium text-sm transition-colors',
                active === m.key
                  ? 'text-fd-foreground'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              )}
              key={m.key}
              onClick={() => setActive(m.key)}
              type="button"
            >
              {m.key}
            </button>
          ))}
        </div>
        <button
          aria-label="Copy install command"
          className="mr-2 inline-flex size-7 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
          onClick={onCopy}
          type="button"
        >
          {copied ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <Copy className="size-4" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-sm">
        <code>{command}</code>
      </pre>
    </div>
  );
}
