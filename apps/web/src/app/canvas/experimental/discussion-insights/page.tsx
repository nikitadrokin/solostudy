'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  MessageCircle,
  MessagesSquare,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { api } from '@/utils/trpc';

type DiscussionStatus =
  | 'overdue'
  | 'urgent'
  | 'upcoming'
  | 'later'
  | 'no-due-date';

const statusConfig: Record<
  DiscussionStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  overdue: {
    label: 'Overdue',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  urgent: {
    label: 'Urgent',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    icon: <Zap className="h-4 w-4" />,
  },
  upcoming: {
    label: 'Soon',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: <Clock className="h-4 w-4" />,
  },
  later: {
    label: 'Later',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  'no-due-date': {
    label: 'No Date',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    icon: <MessageCircle className="h-4 w-4" />,
  },
};

function formatDueDate(
  dueAt: string | null,
  daysUntilDue: number | null
): string {
  if (!dueAt || daysUntilDue === null) return 'No due date';

  if (daysUntilDue < 0) {
    const daysOverdue = Math.abs(daysUntilDue);
    return daysOverdue === 1 ? '1 day overdue' : `${daysOverdue} days overdue`;
  }
  if (daysUntilDue === 0) return 'Due today';
  if (daysUntilDue === 1) return 'Due tomorrow';
  if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;

  return new Date(dueAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function SummaryCard({
  title,
  count,
  icon,
  color,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl py-0">
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            color
          )}
        >
          {icon}
        </div>
        <div>
          <p className="font-bold text-2xl">{count}</p>
          <p className="text-muted-foreground text-sm">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

type Discussion = {
  id: number;
  title: string;
  courseId: number;
  courseName: string;
  dueAt: string | null;
  postedAt: string | null;
  daysUntilDue: number | null;
  status: DiscussionStatus;
  htmlUrl: string;
};

function DiscussionRow({ discussion }: { discussion: Discussion }) {
  const status = statusConfig[discussion.status];

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/50 p-4 hover:bg-accent/50">
      <div className="flex max-w-[80%] flex-grow-0 items-center gap-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            status.bgColor,
            status.color
          )}
        >
          {status.icon}
        </div>
        <div className="min-w-0">
          <a
            className={buttonVariants({
              variant: 'link',
              className: 'line-clamp-1 truncate group-hover:text-primary',
            })}
            href={discussion.htmlUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {discussion.title}
            <ExternalLink className="size-3" />
            <span className="absolute inset-0" />
          </a>
          <div className="line-clamp-1 flex grow-0 items-center gap-2 truncate text-muted-foreground text-sm">
            <BookOpen className="size-3" />
            <span className="truncate">{discussion.courseName}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="text-right">
          <Badge className={cn('text-xs', status.color)} variant="outline">
            {status.label}
          </Badge>
          <p className="mt-1 text-muted-foreground text-xs">
            {formatDueDate(discussion.dueAt, discussion.daysUntilDue)}
          </p>
        </div>
      </div>
    </div>
  );
}

const DiscussionInsightsPage: React.FC = () => {
  const { data: session } = authClient.useSession();

  const { data: status, status: statusStatus } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const notFetchedYet = statusStatus === 'pending';

  const {
    data: insights,
    isLoading,
    error,
  } = useQuery(
    api.canvas.getDiscussionInsights.queryOptions(undefined, {
      enabled: status?.connected === true,
    })
  );

  if (!(status?.connected || notFetchedYet)) {
    return (
      <div className="container mx-auto max-w-7xl select-none space-y-8 p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Discussion Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageCircle className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Canvas Not Connected</EmptyTitle>
                <EmptyDescription>
                  Connect your Canvas account to see discussion insights.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link
                  className={buttonVariants({ size: 'lg' })}
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

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex select-none items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg">
            <MessagesSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Discussion Insights
            </h1>
            <p className="text-muted-foreground">
              Track your Canvas discussion participation
            </p>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="py-6">
            <p className="text-center text-destructive">
              Failed to load discussion insights. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Insights content */}
      {insights && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              color="bg-muted"
              count={insights.summary.totalDiscussions}
              icon={<MessageCircle className="h-6 w-6 text-foreground" />}
              title="Total Discussions"
            />
            <SummaryCard
              color="bg-orange-500/10"
              count={insights.summary.unansweredCount}
              icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
              title="Need Your Reply"
            />
            <SummaryCard
              color="bg-red-500/10"
              count={insights.summary.overdueCount}
              icon={<Clock className="h-6 w-6 text-red-500" />}
              title="Overdue"
            />
            <SummaryCard
              color="bg-emerald-500/10"
              count={insights.summary.userPostCount}
              icon={<CheckCircle2 className="h-6 w-6 text-emerald-500" />}
              title="Your Posts"
            />
          </div>

          {/* Unanswered discussions list */}
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex select-none items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Discussions Awaiting Your Reply
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Sorted by urgency — respond to these first
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.unansweredDiscussions.length === 0 ? (
                <Empty className="!p-8">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CheckCircle2 className="h-6 w-6" />
                    </EmptyMedia>
                    <EmptyTitle>All Caught Up!</EmptyTitle>
                    <EmptyDescription>
                      You&apos;ve replied to all active discussions. Great job!
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                insights.unansweredDiscussions.map((discussion) => (
                  <DiscussionRow discussion={discussion} key={discussion.id} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DiscussionInsightsPage;
