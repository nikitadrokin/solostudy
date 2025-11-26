'use client';

import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { apiClient } from '@/utils/trpc';

const chartConfig = {
  tasks: {
    label: 'Tasks Created',
    color: 'hsl(var(--chart-1))',
  },
  completed: {
    label: 'Tasks Completed',
    color: 'hsl(var(--chart-2))',
  },
  focus: {
    label: 'Focus Sessions',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function WeeklyActivityChart() {
  const { data, isLoading } = useQuery({
    queryKey: [['analytics', 'getEventCounts'], { days: 7 }],
    queryFn: () => apiClient.analytics.getEventCounts.query({ days: 7 }),
  });

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-muted-foreground text-sm">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!data?.chartData || data.chartData.length === 0) {
    return (
      <div className="flex h-[200px] select-none items-center justify-center">
        <div className="text-muted-foreground text-sm">
          No analytics data available yet
        </div>
      </div>
    );
  }

  const chartData = data.chartData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    tasks: item.tasks,
    completed: item.completed,
    focus: item.focus,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          dataKey="date"
          tickLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="tasks"
          fill="var(--color-tasks)"
          fillOpacity={0.4}
          stackId="1"
          stroke="var(--color-tasks)"
          type="monotone"
        />
        <Area
          dataKey="completed"
          fill="var(--color-completed)"
          fillOpacity={0.4}
          stackId="1"
          stroke="var(--color-completed)"
          type="monotone"
        />
        <Area
          dataKey="focus"
          fill="var(--color-focus)"
          fillOpacity={0.4}
          stackId="1"
          stroke="var(--color-focus)"
          type="monotone"
        />
      </AreaChart>
    </ChartContainer>
  );
}
