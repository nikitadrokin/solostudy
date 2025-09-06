'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/trpc';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/sonner';
import { TooltipProvider } from './ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
