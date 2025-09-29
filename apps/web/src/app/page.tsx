'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import InstallPWAPrompt from '@/components/InstallPWAPrompt';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="container m-auto max-w-6xl place-items-center px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Solo<span className="text-primary">Study</span>
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-muted-foreground text-xl">
          A distraction-free study environment with customizable video
          backgrounds, ambient audio controls, and offline AI assistance.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/focus">Start Studying</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <InstallPWAPrompt />
      </div>

      <div className="rounded-lg border bg-muted/50 p-6 text-center">
        <h2 className="mb-2 font-semibold text-lg">System Status</h2>
        <div className="flex items-center justify-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${healthCheck.data ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="text-muted-foreground text-sm">
            {healthCheck.isLoading
              ? 'Checking system status...'
              : healthCheck.data
                ? 'All systems operational'
                : 'System offline'}
          </span>
        </div>
      </div>
    </div>
  );
}
