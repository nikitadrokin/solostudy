'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, CheckCircle2, Clock3, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { api } from '@/utils/trpc';
import { EffortBar, MetricCard } from '../_components/study-cards';
import { mockProgressCourses } from '../_components/study-data';
import { StudyPageShell } from '../_components/study-nav';

function formatHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export default function StudyProgressPage() {
  const { data: session } = authClient.useSession();

  const { data: todayFocus } = useQuery(
    api.focus.getTodayFocusTime.queryOptions(undefined, {
      enabled: !!session,
      retry: false,
    })
  );

  const { data: dailyStats } = useQuery(
    api.focus.getDailyFocusStats.queryOptions(
      { days: 7 },
      {
        enabled: !!session,
        retry: false,
      }
    )
  );

  const { data: tasks = [] } = useQuery(
    api.todos.list.queryOptions(undefined, {
      enabled: !!session,
      retry: false,
    })
  );

  let weeklyMinutes = 0;
  for (const day of dailyStats?.chartData ?? []) {
    weeklyMinutes += day.totalMinutes;
  }

  const todayMinutes = Math.round((todayFocus?.totalSeconds ?? 0) / 60);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const openTasks = tasks.length - completedTasks;
  const displayTodayMinutes = todayMinutes > 0 ? todayMinutes : 95;
  const displayWeeklyMinutes = weeklyMinutes > 0 ? weeklyMinutes : 365;
  const displayCompletedTasks = tasks.length > 0 ? completedTasks : 10;
  const displayOpenTasks = tasks.length > 0 ? openTasks : 6;

  return (
    <StudyPageShell
      dataMode={tasks.length > 0 || weeklyMinutes > 0 ? 'live' : 'sample'}
      description="A progress view that compares actual focus effort with the work plan, so users can see where attention is drifting."
      eyebrow="Study system"
      title="Progress"
    >
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          detail="Tracked by Focus Room"
          icon={<Clock3 className="size-4" />}
          label="Today"
          value={formatHours(displayTodayMinutes)}
        />
        <MetricCard
          detail="Last 7 days"
          icon={<BarChart3 className="size-4" />}
          label="Focus time"
          value={formatHours(displayWeeklyMinutes)}
        />
        <MetricCard
          detail="Completed work items"
          icon={<CheckCircle2 className="size-4" />}
          label="Closed"
          value={String(displayCompletedTasks)}
        />
        <MetricCard
          detail="Still needs attention"
          icon={<ListChecks className="size-4" />}
          label="Open"
          value={String(displayOpenTasks)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Effort by Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockProgressCourses.map((course) => (
              <div className="space-y-3" key={course.id}>
                <EffortBar
                  label={course.course}
                  max={course.plannedMinutes}
                  value={course.focusMinutes}
                />
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="secondary">
                    {course.completedTasks} closed
                  </Badge>
                  <Badge variant="outline">{course.openTasks} open</Badge>
                  <span className="text-muted-foreground">{course.note}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Next Adjustment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium">
                  Shift the next session to MATH 241
                </p>
                <p className="mt-1 text-muted-foreground">
                  Planned effort is behind the upcoming quiz, while BIO 214 is
                  closer to target.
                </p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Keep the next block short</p>
                <p className="mt-1 text-muted-foreground">
                  A 35-minute practice set is enough to expose the weak topic
                  before the longer session.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Progress Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Focus sessions</span>
                <Badge variant={weeklyMinutes > 0 ? 'default' : 'outline'}>
                  {weeklyMinutes > 0 ? 'Live' : 'Sample'}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Task completion</span>
                <Badge variant={tasks.length > 0 ? 'default' : 'outline'}>
                  {tasks.length > 0 ? 'Live' : 'Sample'}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Course allocation</span>
                <Badge variant="outline">Prototype</Badge>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </StudyPageShell>
  );
}
