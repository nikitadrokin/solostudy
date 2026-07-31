import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ComponentPreview } from '@/components/preview/component-preview';
import { InstallCommand } from '@/components/preview/install-command';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ComponentPreview,
    InstallCommand,
    ...components,
  };
}
