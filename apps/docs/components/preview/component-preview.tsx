import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import Link from 'next/link';
import { Demo } from '@/components/preview/demos';
import { InstallCommand } from '@/components/preview/install-command';
import { getRegistryItem, registryItemUrl } from '@/lib/registry';

function readSource(paths: string[]): string {
  return paths
    .map((path) => {
      try {
        const content = readFileSync(join(process.cwd(), path), 'utf8');
        if (paths.length === 1) {
          return content;
        }
        return `// ${path}\n${content}`;
      } catch {
        return `// Unable to read ${path}`;
      }
    })
    .join('\n\n');
}

type ComponentPreviewProps = {
  name: string;
  /** Center the live demo instead of left-aligning it. Defaults to true. */
  align?: 'center' | 'start';
};

export function ComponentPreview({
  name,
  align = 'center',
}: ComponentPreviewProps) {
  const item = getRegistryItem(name);
  const source = item ? readSource(item.files.map((f) => f.path)) : '';
  const url = registryItemUrl(name);

  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      <Tabs items={['Preview', 'Code']}>
        <Tab value="Preview">
          <div
            className={`flex min-h-[340px] w-full ${
              align === 'center' ? 'items-center justify-center' : 'items-start'
            } rounded-lg border border-fd-border bg-fd-background p-8`}
          >
            <Demo name={name} />
          </div>
        </Tab>
        <Tab value="Code">
          <DynamicCodeBlock code={source} lang="tsx" />
        </Tab>
      </Tabs>

      <InstallCommand url={url} />

      {item?.registryDependencies?.length ? (
        <p className="text-fd-muted-foreground text-sm">
          Depends on:{' '}
          {item.registryDependencies.map((dep, index) => (
            <span key={dep}>
              {index > 0 ? ', ' : ''}
              <Link
                className="font-medium text-fd-foreground underline underline-offset-4"
                href={`/components/${dep}`}
              >
                {dep}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
