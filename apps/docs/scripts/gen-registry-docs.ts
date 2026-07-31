/**
 * Generates one MDX doc page per registry item from `registry.json`, plus the
 * Fumadocs `meta.json` navigation files. Run with `pnpm gen:docs` whenever the
 * registry changes.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

type RegistryItem = {
  name: string;
  title: string;
  description: string;
  registryDependencies?: string[];
};

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const registry = JSON.parse(
  readFileSync(join(root, 'registry.json'), 'utf8')
) as { items: RegistryItem[]; homepage: string };

const componentsDir = join(root, 'content/docs/components');
mkdirSync(componentsDir, { recursive: true });

const items = [...registry.items].sort((a, b) => a.name.localeCompare(b.name));

function escapeYaml(value: string): string {
  return value.replace(/"/g, '\\"');
}

for (const item of items) {
  const body = `---
title: ${item.title}
description: "${escapeYaml(item.description)}"
---

${item.description}

<ComponentPreview name="${item.name}" />
`;
  writeFileSync(join(componentsDir, `${item.name}.mdx`), body);
}

writeFileSync(
  join(componentsDir, 'meta.json'),
  `${JSON.stringify(
    {
      title: 'Components',
      description: 'Every component in the solostudy registry.',
      pages: items.map((item) => item.name),
    },
    null,
    2
  )}\n`
);

// biome-ignore lint/suspicious/noConsole: build-time script feedback
console.log(`Generated ${items.length} component docs.`);
