'use client';

import { useQuery } from '@tanstack/react-query';
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Flame,
  Target,
} from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { api } from '@/utils/trpc';
import { MetricCard, TodayItemCard } from '../_components/study-cards';
import { mockTodayItems, type TodayPlanItem } from '../_components/study-data';
import { StudyPageShell } from '../_components/study-nav';
import { buildCanvasTodayItems } from '../_components/study-transforms';

function totalMinutes(items: TodayPlanItem[]): number {
  let minutes = 0;
  for (const item of items) {
    minutes += item.minutes;
  }
  return minutes;
}

export default function StudyTodayPage() {
  const { data: session } = authClient.useSession();

  const { data: status } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
      retry: false,
    })
  );

  const {
    data: studyPlan,
    isLoading: isLoadingStudyPlan,
    isError: studyPlanError,
  } = useQuery(
    api.canvas.getStudyPlan.queryOptions(undefined, {
      enabled: status?.connected === true,
      retry: false,
    })
  );

  const { data: discussionInsights, isLoading: isLoadingDiscussions } =
    useQuery(
      api.canvas.getDiscussionInsights.queryOptions(undefined, {
        enabled: status?.connected === true,
        retry: false,
      })
    );

  const canvasItems = useMemo(
    () => buildCanvasTodayItems(studyPlan, discussionInsights),
    [studyPlan, discussionInsights]
  );
  const items = canvasItems.length > 0 ? canvasItems : mockTodayItems;
  const dataMode = canvasItems.length > 0 ? 'canvas' : 'sample';
  const isLoadingCanvas =
    status?.connected === true && (isLoadingStudyPlan || isLoadingDiscussions);
  const criticalCount = items.filter(
    (item) => item.priority === 'critical'
  ).length;
  const plannedMinutes = totalMinutes(items);

  return (
    <StudyPageShell
      dataMode={dataMode}
      description="A daily queue that converts deadlines, discussions, grade impact, and manual tasks into one ordered work plan."
      eyebrow="Study system"
      title="Today"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          detail="Prioritized from urgency and impact"
          icon={<Target className="size-4" />}
          label="Next actions"
          value={String(items.length)}
        />
        <MetricCard
          detail="Suggested work blocks"
          icon={<Clock3 className="size-4" />}
          label="Planned effort"
          value={`${plannedMinutes}m`}
        />
        <MetricCard
          detail="Needs attention before anything else"
          icon={<Flame className="size-4" />}
          label="Critical"
          value={String(criticalCount)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => (
            <TodayItemCard item={item} key={item.id} />
          ))}
        </div>

        <aside className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Decision Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4" />
                <p className="text-muted-foreground">
                  Deadline pressure, point value, and participation gaps are
                  collapsed into one ordered queue.
                </p>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 size-4" />
                <p className="text-muted-foreground">
                  Fresh course data updates the signals when available; sample
                  state keeps the workspace visible without a connection.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Canvas connection</span>
                <Badge variant={status?.connected ? 'default' : 'outline'}>
                  {status?.connected ? 'Connected' : 'Sample mode'}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Hydration</span>
                <Badge variant={isLoadingCanvas ? 'secondary' : 'outline'}>
                  {isLoadingCanvas ? 'Loading' : 'Ready'}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Fallback</span>
                <Badge variant={studyPlanError ? 'secondary' : 'outline'}>
                  {studyPlanError ? 'Using sample plan' : 'Available'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </StudyPageShell>
  );
}
