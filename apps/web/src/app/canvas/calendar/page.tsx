'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { authClient } from '@/lib/auth-client';
import { api, apiClient } from '@/utils/trpc';

type DateRange = '7' | '14' | '30';

function formatDate(dateString: string | null): string {
  if (!dateString) {
    return 'No date';
  }
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function getDateOnly(dateString: string): string {
  return new Date(dateString).toDateString();
}

export default function CanvasCalendarPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [dateRange, setDateRange] = useState<DateRange>('14');

  const { data: status } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const { data: courses = [] } = useQuery(
    api.canvas.getCourses.queryOptions(undefined, {
      enabled: status?.connected === true,
    })
  );

  const startDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0];
  }, []);

  const endDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + Number.parseInt(dateRange, 10));
    return date.toISOString().split('T')[0];
  }, [dateRange]);

  const { data: assignments = [], isLoading: isLoadingAssignments } = useQuery({
    queryKey: [['canvas', 'getAssignments'], { includeCompleted: false }],
    queryFn: () =>
      apiClient.canvas.getAssignments.query({ includeCompleted: false }),
    enabled: status?.connected === true,
  });

  const { data: events = [], isLoading: isLoadingEvents } = useQuery(
    api.canvas.getCalendarEvents.queryOptions(
      { startDate, endDate },
      {
        enabled: status?.connected === true,
      }
    )
  );

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  // Combine assignments and events into a unified list
  const calendarItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      date: string | null;
      type: 'assignment' | 'event';
      courseName: string;
      courseId: string;
      htmlUrl?: string;
    }> = [];

    // Add assignments with due dates in range
    const now = new Date();
    const rangeEnd = new Date();
    rangeEnd.setDate(rangeEnd.getDate() + Number.parseInt(dateRange, 10));

    for (const assignment of assignments) {
      if (assignment.dueAt) {
        const dueDate = new Date(assignment.dueAt);
        if (dueDate >= now && dueDate <= rangeEnd) {
          const course = courses.find((c) => c.id === assignment.courseId);
          items.push({
            id: `assignment-${assignment.id}`,
            title: assignment.name,
            date: assignment.dueAt.toString(),
            type: 'assignment',
            courseName: course?.name ?? 'Unknown Course',
            courseId: assignment.courseId,
          });
        }
      }
    }

    // Add calendar events
    for (const event of events) {
      items.push({
        id: `event-${event.id}`,
        title: event.title,
        date: event.startAt,
        type: 'event',
        courseName: event.contextName,
        courseId: event.contextCode.replace('course_', ''),
        htmlUrl: event.htmlUrl,
      });
    }

    // Sort by date
    items.sort((a, b) => {
      if (!a.date) {
        return 1;
      }
      if (!b.date) {
        return -1;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return items;
  }, [assignments, events, courses, dateRange]);

  // Group items by date
  const groupedItems = useMemo(() => {
    const groups: Map<string, typeof calendarItems> = new Map();

    for (const item of calendarItems) {
      if (item.date) {
        const dateKey = getDateOnly(item.date);
        const existing = groups.get(dateKey) ?? [];
        existing.push(item);
        groups.set(dateKey, existing);
      }
    }

    return groups;
  }, [calendarItems]);

  if (!session) {
    return null;
  }

  if (!status?.connected) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Canvas Calendar</CardTitle>
            <CardDescription>
              Connect your Canvas account to view calendar events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CalendarIcon className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Canvas Not Connected</EmptyTitle>
                <EmptyDescription>
                  You need to connect your Canvas account in settings to view
                  calendar events.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link
                  className={buttonVariants()}
                  href="/settings#integrations"
                >
                  Go to Settings
                </Link>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = isLoadingAssignments || isLoadingEvents;

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Canvas Calendar</h1>
          <p className="text-muted-foreground">
            View upcoming Canvas events and deadlines
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-[150px] justify-between" variant="outline">
              Next {dateRange} days
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDateRange('7')}>
              Next 7 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateRange('14')}>
              Next 14 days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDateRange('30')}>
              Next 30 days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events & Deadlines</CardTitle>
          <CardDescription>
            {isLoading
              ? 'Loading...'
              : `${calendarItems.length} item(s) in the next ${dateRange} days`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : calendarItems.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CalendarIcon className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>No upcoming events</EmptyTitle>
                <EmptyDescription>
                  You have no events or assignment deadlines in the next{' '}
                  {dateRange} days.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-6">
              {Array.from(groupedItems.entries()).map(([dateKey, items]) => (
                <div key={dateKey}>
                  <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                    {formatDateHeader(dateKey)}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        className="flex items-center gap-3 rounded-lg border p-3"
                        key={item.id}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            item.type === 'assignment'
                              ? 'bg-orange-100 text-orange-600 dark:bg-orange-950'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-950'
                          }`}
                        >
                          {item.type === 'assignment' ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <CalendarIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-medium">{item.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                            <span className="truncate">{item.courseName}</span>
                            {item.date && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(item.date)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {status?.canvasUrl && (
                          <a
                            className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            href={
                              item.htmlUrl ??
                              `${status.canvasUrl}/courses/${item.courseId}/assignments`
                            }
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ))}
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
