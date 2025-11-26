'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FocusAnalyticsChart } from './focus-analytics-chart';
import { TaskAnalyticsChart } from './task-analytics-chart';
import { WeeklyActivityChart } from './weekly-activity-chart';

export function AnalyticsTabs() {
  return (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="focus">Focus</TabsTrigger>
      </TabsList>
      <TabsContent className="mt-4" value="overview">
        <WeeklyActivityChart />
      </TabsContent>
      <TabsContent className="mt-4" value="tasks">
        <TaskAnalyticsChart />
      </TabsContent>
      <TabsContent className="mt-4" value="focus">
        <FocusAnalyticsChart />
      </TabsContent>
    </Tabs>
  );
}
