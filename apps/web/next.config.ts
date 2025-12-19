import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // biome-ignore lint: Next.js headers function should be async
  typedRoutes: true,

  // experimental: {
  //   authInterrupts: true,
  // },

  async headers() {
    return await [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return await [
      {
        source: '/',
        destination: '/focus',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
