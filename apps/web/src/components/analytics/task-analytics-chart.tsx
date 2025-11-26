'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { apiClient } from '@/utils/trpc';

const chartConfig = {
  created: {
    label: 'Created',
    color: 'hsl(var(--chart-1))',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-2))',
  },
  deleted: {
    label: 'Deleted',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function TaskAnalyticsChart() {
  const { data, isLoading } = useQuery({
    queryKey: [['analytics', 'getTaskAnalytics'], { days: 7 }],
    queryFn: () => apiClient.analytics.getTaskAnalytics.query({ days: 7 }),
  });

  if (isLoading) {
    return (
      <div className="flex h-[200px] select-none items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (!data?.chartData || data.chartData.length === 0) {
    return (
      <div className="flex h-[200px] select-none items-center justify-center">
        <div className="text-muted-foreground text-sm">No data available</div>
      </div>
    );
  }

  const chartData = data.chartData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    created: item.created,
    completed: item.completed,
    deleted: item.deleted,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          dataKey="date"
          tickLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="created" fill="var(--color-created)" radius={4} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
        <Bar dataKey="deleted" fill="var(--color-deleted)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
