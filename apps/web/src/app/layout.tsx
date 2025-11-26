import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import '../index.css';
import { cookies } from 'next/headers';
import AppHeader from '@/components/app-header';
import AppSidebar from '@/components/app-sidebar';
import Providers from '@/components/providers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'solostudy',
  description: 'solostudy',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            crossOrigin="anonymous"
            data-enabled="true"
            src="//unpkg.com/react-grab/dist/index.global.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta content="SoloStudy" name="apple-mobile-web-app-title" />
      <meta content="yes" name="mobile-web-app-capable" />
      <meta
        content="black-translucent"
        name="apple-mobile-web-app-status-bar-style"
      />
      <meta content="/apple-touch-icon-180x180.png" name="apple-touch-icon" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider defaultOpen={defaultOpen}>
            <div className="flex min-h-svh w-full">
              <AppSidebar />
              <SidebarInset>
                <AppHeader />
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
