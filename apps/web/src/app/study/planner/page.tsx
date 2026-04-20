'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Clock3, Layers3, ListChecks } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { api } from '@/utils/trpc';
import { MetricCard, TodayItemCard } from '../_components/study-cards';
import {
  mockPlannerBlocks,
  type PlannerBlock,
} from '../_components/study-data';
import { StudyPageShell } from '../_components/study-nav';
import { buildCanvasPlannerBlocks } from '../_components/study-transforms';

const loadLabels: Record<PlannerBlock['load'], string> = {
  light: 'Light',
  balanced: 'Balanced',
  heavy: 'Heavy',
};

function totalMinutes(blocks: PlannerBlock[]): number {
  let minutes = 0;
  for (const block of blocks) {
    minutes += block.totalMinutes;
  }
  return minutes;
}

function totalItems(blocks: PlannerBlock[]): number {
  let count = 0;
  for (const block of blocks) {
    count += block.items.length;
  }
  return count;
}

export default function StudyPlannerPage() {
  const { data: session } = authClient.useSession();

  const { data: status } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
      retry: false,
    })
  );

  const { data: studyPlan } = useQuery(
    api.canvas.getStudyPlan.queryOptions(undefined, {
      enabled: status?.connected === true,
      retry: false,
    })
  );

  const canvasBlocks = useMemo(
    () => buildCanvasPlannerBlocks(studyPlan),
    [studyPlan]
  );
  const blocks = canvasBlocks.length > 0 ? canvasBlocks : mockPlannerBlocks;
  const dataMode = canvasBlocks.length > 0 ? 'canvas' : 'sample';
  const weeklyMinutes = totalMinutes(blocks);
  const itemCount = totalItems(blocks);

  return (
    <StudyPageShell
      dataMode={dataMode}
      description="A weekly workload board that groups obligations by when they should be handled."
      eyebrow="Study system"
      title="Planner"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          detail="Across visible study blocks"
          icon={<Clock3 className="size-4" />}
          label="Planned load"
          value={`${weeklyMinutes}m`}
        />
        <MetricCard
          detail="Assignments, reviews, and discussions"
          icon={<ListChecks className="size-4" />}
          label="Work items"
          value={String(itemCount)}
        />
        <MetricCard
          detail="Ordered by deadline and impact"
          icon={<Layers3 className="size-4" />}
          label="Study blocks"
          value={String(blocks.length)}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {blocks.map((block) => (
          <Card className="shadow-sm" key={block.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{block.day}</CardTitle>
                  <p className="text-muted-foreground text-sm">{block.date}</p>
                </div>
                <Badge
                  variant={block.load === 'heavy' ? 'default' : 'secondary'}
                >
                  {loadLabels[block.load]}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CalendarDays className="size-4" />
                <span>{block.totalMinutes} planned minutes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {block.items.map((item) => (
                <TodayItemCard compact item={item} key={item.id} />
              ))}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-center">
          <div className="space-y-1">
            <h2 className="font-semibold text-base">Planning rule</h2>
            <p className="text-muted-foreground text-sm">
              Commit time before tasks become urgent.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Badge variant="outline">Now</Badge>
              <p className="text-muted-foreground text-sm">
                Overdue, urgent, and high-impact work moves into the next focus
                block.
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">Next</Badge>
              <p className="text-muted-foreground text-sm">
                Upcoming work gets scheduled while there is still room to adapt.
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">Later</Badge>
              <p className="text-muted-foreground text-sm">
                Low-pressure work stays visible without crowding today.
              </p>
            </div>
          </div>
        </div>
      </section>
    </StudyPageShell>
  );
}
