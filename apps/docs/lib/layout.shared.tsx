import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout options used by both the home and docs layouts.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <span className="font-semibold">solostudy</span>
          <span className="text-fd-muted-foreground">registry</span>
        </>
      ),
      url: '/',
    },
    links: [
      {
        text: 'Components',
        url: '/docs/components',
        active: 'nested-url',
      },
      {
        text: 'App',
        url: 'https://study.nkdr.me',
      },
    ],
    githubUrl: 'https://github.com/nikitadrokin/solostudy',
  };
}
