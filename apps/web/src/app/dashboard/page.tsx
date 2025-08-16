'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: infinite rerender
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="font-bold text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Focus Room Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              Focus Room
            </CardTitle>
            <CardDescription>
              Enter your personalized study environment with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/focus">
              <Button className="w-full" size="lg">
                Start Focus Session
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Study Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
            <CardDescription>Your study time and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Focus Time:
                </span>
                <span className="font-medium">0h 0m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Sessions:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Streak:</span>
                <span className="font-medium">0 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" disabled variant="outline">
              View Study History
            </Button>
            <Button className="w-full justify-start" disabled variant="outline">
              Set Study Goals
            </Button>
            <Link href="/settings">
              <Button className="w-full justify-start" variant="outline">
                Preferences
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Insights and detailed progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="font-medium text-muted-foreground">Coming Soon</p>
              <p className="mt-1 text-muted-foreground text-sm">
                Detailed analytics and insights will be available here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
