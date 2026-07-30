'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { queryClient } from '@/utils/trpc';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/sonner';
import { TooltipProvider } from './ui/tooltip';

// Initialize PostHog synchronously if key is available
let posthogInitialized = false;
if (
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY &&
  !posthogInitialized
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
    defaults: '2025-05-24',
  });
  posthogInitialized = true;
}

/** Routes that sit on top of the ambient video, so they are always dark. */
const DARK_ONLY_ROUTES = new Set(['/', '/focus']);

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PHProvider client={posthog}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
        forcedTheme={DARK_ONLY_ROUTES.has(pathname) ? 'dark' : undefined}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryClientProvider>
        <Toaster richColors />
      </ThemeProvider>
    </PHProvider>
  );
}
