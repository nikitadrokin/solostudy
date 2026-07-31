import registryJson from '@/registry.json' with { type: 'json' };

export type RegistryItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies?: string[];
  files: { path: string; type: string }[];
};

export const registry = registryJson as {
  name: string;
  homepage: string;
  items: RegistryItem[];
};

export const registryItems: RegistryItem[] = registry.items;

export function getRegistryItem(name: string): RegistryItem | undefined {
  return registryItems.find((item) => item.name === name);
}

/** The public URL a component's registry JSON is served from. */
export function registryItemUrl(name: string): string {
  return `${registry.homepage}/r/${name}.json`;
}
