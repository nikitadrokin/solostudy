'use client';

import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { authClient } from '@/lib/auth-client';
import { apiClient } from '@/utils/trpc';

export default function CanvasAnnouncementsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data: status } = useQuery({
    queryKey: [['canvas', 'getStatus']],
    queryFn: () => apiClient.canvas.getStatus.query(),
    enabled: !!session,
  });

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  if (!status?.connected) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Canvas Announcements</CardTitle>
            <CardDescription>
              Connect your Canvas account to view announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bell className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Canvas Not Connected</EmptyTitle>
                <EmptyDescription>
                  You need to connect your Canvas account in settings to view
                  announcements.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href="/settings#integrations">Go to Settings</Link>
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Canvas Announcements
        </h1>
        <p className="text-muted-foreground">
          View course announcements and updates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Announcements Feature Coming Soon</EmptyTitle>
              <EmptyDescription>
                Course announcements and notifications will be available in a
                future update.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  );
}
