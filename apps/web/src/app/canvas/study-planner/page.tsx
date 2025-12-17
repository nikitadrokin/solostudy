'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
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

type AssignmentStatus =
  | 'overdue'
  | 'urgent'
  | 'upcoming'
  | 'later'
  | 'no-due-date';

const statusConfig: Record<
  AssignmentStatus,
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
    icon: <Calendar className="h-4 w-4" />,
  },
};

function getImpactLabel(score: number): { label: string; color: string } {
  if (score >= 10) return { label: 'High', color: 'text-red-500' };
  if (score >= 5) return { label: 'Medium', color: 'text-yellow-500' };
  return { label: 'Low', color: 'text-emerald-500' };
}

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
      <Card className="overflow-hidden">
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

type Assignment = {
  id: number;
  name: string;
  courseId: number;
  courseName: string;
  dueAt: string | null;
  pointsPossible: number | null;
  priorityScore: number;
  urgencyScore: number;
  impactScore: number;
  daysUntilDue: number | null;
  status: AssignmentStatus;
  htmlUrl: string;
};

function AssignmentRow({
  assignment,
  index,
}: {
  assignment: Assignment;
  index: number;
}) {
  const status = statusConfig[assignment.status];
  const impact = getImpactLabel(assignment.impactScore);

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="group relative flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-card/50 p-4 hover:bg-accent/50"
      initial={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-center gap-4">
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
              className: 'group-hover:text-primary',
            })}
            href={assignment.htmlUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {assignment.name}
            <ExternalLink className="size-3" />
            <span className="absolute inset-0" />
          </a>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <BookOpen className="h-3 w-3" />
            <span className="truncate">{assignment.courseName}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {assignment.pointsPossible && (
          <div className="hidden text-right sm:block">
            <p className="font-medium text-sm">
              {assignment.pointsPossible} pts
            </p>
            <p className={cn('text-xs', impact.color)}>{impact.label} impact</p>
          </div>
        )}
        <div className="text-right">
          <Badge className={cn('text-xs', status.color)} variant="outline">
            {status.label}
          </Badge>
          <p className="mt-1 text-muted-foreground text-xs">
            {formatDueDate(assignment.dueAt, assignment.daysUntilDue)}
          </p>
        </div>
        <a
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          href={assignment.htmlUrl}
          rel="noopener noreferrer"
          target="_blank"
          title="Open in Canvas"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}

export default function StudyPlannerPage() {
  const { data: session } = authClient.useSession();

  const { data: status } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const {
    data: studyPlan,
    isLoading,
    error,
  } = useQuery(
    api.canvas.getStudyPlan.queryOptions(undefined, {
      enabled: status?.connected === true,
    })
  );

  if (!status?.connected) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
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
        <div className="flex items-center gap-4">
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

          {/* Assignment list */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
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
            <CardContent className="space-y-3">
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
                studyPlan.assignments.map((assignment, index) => (
                  <AssignmentRow
                    assignment={assignment}
                    index={index}
                    key={assignment.id}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
