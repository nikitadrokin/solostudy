import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: 'solostudy registry',
    template: '%s — solostudy registry',
  },
  description:
    'A shadcn-compatible component registry powering study.nkdr.me — browse, preview, and install every component.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={inter.className} lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
