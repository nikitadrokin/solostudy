'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { queryClient } from '@/utils/trpc';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/sonner';
import { TooltipProvider } from './ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  // posthog initialization
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      defaults: '2025-05-24',
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryClientProvider>
        <Toaster richColors />
      </ThemeProvider>
    </PHProvider>
  );
}
