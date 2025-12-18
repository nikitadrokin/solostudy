'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  MessagesSquare,
} from 'lucide-react';
import Link from 'next/link';
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
import { columns } from './columns';
import { DataTable } from './data-table';

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

          {/* Discussions data table */}
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
            <CardContent>
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
                <DataTable columns={columns} data={insights.unansweredDiscussions} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DiscussionInsightsPage;
