import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../index.css';
import { Databuddy } from '@databuddy/sdk/react';
import { cookies } from 'next/headers';
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider defaultOpen={defaultOpen}>
            <div className="flex min-h-svh w-full">
              <AppSidebar />
              <SidebarInset>{children}</SidebarInset>
            </div>
          </SidebarProvider>
        </Providers>

        <Databuddy clientId="3pcVDvZvNzFtuvMqb8CIa" enableBatching={true} />
      </body>
    </html>
  );
}
