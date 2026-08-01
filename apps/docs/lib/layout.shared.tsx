import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout options used by both the home and docs layouts.
 * Paths are in-app routes; Next.js `basePath: '/docs'` prefixes them publicly.
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
        url: '/components',
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
