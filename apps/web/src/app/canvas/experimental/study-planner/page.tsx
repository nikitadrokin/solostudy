'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
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
  delay,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay }}
    >
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
    </motion.div>
  );
}

export default function StudyPlannerPage() {
  const { data: session } = authClient.useSession();

  const { data: status, status: statusStatus } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const notFetchedYet = statusStatus === 'pending';

  const {
    data: studyPlan,
    isLoading,
    error,
  } = useQuery(
    api.canvas.getStudyPlan.queryOptions(undefined, {
      enabled: status?.connected === true,
    })
  );

  if (!(status?.connected || notFetchedYet)) {
    return (
      <div className="container mx-auto max-w-7xl select-none space-y-8 p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Study Planner</CardTitle>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Calendar className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Canvas Not Connected</EmptyTitle>
                <EmptyDescription>
                  Connect your Canvas account to create your study plan.
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
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
        initial={{ opacity: 0, y: -10 }}
      >
        <div className="flex select-none items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Study Planner</h1>
            <p className="text-muted-foreground">
              Prioritized assignments based on urgency and grade impact
            </p>
          </div>
        </div>
      </motion.div>

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
              Failed to load study plan. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Study plan content */}
      {studyPlan && (
        <motion.div
          animate={{ opacity: 1 }}
          className="space-y-6"
          initial={{ opacity: 0 }}
        >
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              color="bg-muted"
              count={studyPlan.summary.totalAssignments}
              delay={0}
              icon={<BookOpen className="h-6 w-6 text-foreground" />}
              title="Total Pending"
            />
            <SummaryCard
              color="bg-red-500/10"
              count={studyPlan.summary.overdueCount}
              delay={0.1}
              icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
              title="Overdue"
            />
            <SummaryCard
              color="bg-orange-500/10"
              count={studyPlan.summary.urgentCount}
              delay={0.2}
              icon={<Zap className="h-6 w-6 text-orange-500" />}
              title="Due in 3 Days"
            />
            <SummaryCard
              color="bg-yellow-500/10"
              count={studyPlan.summary.upcomingCount}
              delay={0.3}
              icon={<Clock className="h-6 w-6 text-yellow-500" />}
              title="Due This Week"
            />
          </div>

          {/* Priority list data table */}
          <Card className="rounded-3xl">
            <CardHeader>
              <div className="flex select-none items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Priority List</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Sorted by urgency and grade impact
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {studyPlan.assignments.length === 0 ? (
                <Empty className="!p-8">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CheckCircle2 className="h-6 w-6" />
                    </EmptyMedia>
                    <EmptyTitle>All Caught Up!</EmptyTitle>
                    <EmptyDescription>
                      You have no pending assignments. Great job!
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <DataTable columns={columns} data={studyPlan.assignments} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
