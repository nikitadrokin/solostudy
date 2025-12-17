'use client';

import { Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import ChartErrorBoundary from './error-boundary';
import { FocusAnalyticsChart } from './focus-analytics-chart';
import { TaskAnalyticsChart } from './task-analytics-chart';
import { WeeklyActivityChart } from './weekly-activity-chart';

export function AnalyticsTabs() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Monitor className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">Desktop Only</p>
          <p className="text-muted-foreground text-sm">
            Analytics are available on desktop devices only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="focus">Focus</TabsTrigger>
      </TabsList>
      <TabsContent className="mt-4" value="overview">
        <ChartErrorBoundary>
          <WeeklyActivityChart />
        </ChartErrorBoundary>
      </TabsContent>
      <TabsContent className="mt-4" value="tasks">
        <ChartErrorBoundary>
          <TaskAnalyticsChart />
        </ChartErrorBoundary>
      </TabsContent>
      <TabsContent className="mt-4" value="focus">
        <ChartErrorBoundary>
          <FocusAnalyticsChart />
        </ChartErrorBoundary>
      </TabsContent>
    </Tabs>
  );
}
