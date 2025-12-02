'use client';

import { useQuery } from '@tanstack/react-query';
import { Bell, ExternalLink, Loader2, User } from 'lucide-react';
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
import { api } from '@/utils/trpc';

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function CanvasAnnouncementsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data: status } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const { data: announcements = [], isLoading: isLoadingAnnouncements } =
    useQuery(
      api.canvas.getAnnouncements.queryOptions(undefined, {
        enabled: status?.connected === true,
      })
    );

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
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>
            {isLoadingAnnouncements
              ? 'Loading announcements...'
              : `${announcements.length} announcement(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAnnouncements ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : announcements.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bell className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>No announcements</EmptyTitle>
                <EmptyDescription>
                  There are no recent announcements from your courses.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div className="rounded-lg border p-4" key={announcement.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                          <span className="font-medium text-foreground/80">
                            {announcement.courseName}
                          </span>
                          <span>·</span>
                          <span>
                            {formatRelativeDate(announcement.postedAt)}
                          </span>
                          {announcement.userName && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {announcement.userName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {announcement.message && (
                        <p className="line-clamp-3 text-muted-foreground text-sm">
                          {stripHtml(announcement.message)}
                        </p>
                      )}
                    </div>
                    {announcement.htmlUrl && (
                      <a
                        className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        href={announcement.htmlUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
