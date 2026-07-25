import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/settings'],
    },
    sitemap: 'https://study.nkdr.me/sitemap.xml',
    host: 'https://study.nkdr.me',
  };
}
