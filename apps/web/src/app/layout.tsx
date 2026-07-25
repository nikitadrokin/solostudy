import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import '../index.css';
import Providers from '@/components/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const isDev = process.env.NODE_ENV === 'development';
const siteUrl = 'https://study.nkdr.me';
const siteDescription =
  'A calm online focus room with a flexible study timer, session planning, and ambient video backgrounds.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `SoloStudy — Online Focus Room${isDev ? ' | dev' : ''}`,
    template: `%s | SoloStudy${isDev ? ' | dev' : ''}`,
  },
  description: siteDescription,
  applicationName: 'SoloStudy',
  authors: [{ name: 'Nikita Drokin', url: 'https://nikitadrokin.com/' }],
  creator: 'Nikita Drokin',
  category: 'education',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'SoloStudy',
    title: 'SoloStudy — Online Focus Room',
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoloStudy — Online Focus Room',
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/pwa-192x192.png',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon-180x180.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
  // viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="SoloStudy" name="apple-mobile-web-app-title" />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta
          content="black-translucent"
          name="apple-mobile-web-app-status-bar-style"
        />
        {process.env.NODE_ENV === 'development' && (
          <Script
            crossOrigin="anonymous"
            data-enabled="true"
            src="//unpkg.com/react-grab/dist/index.global.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-svh w-full">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
