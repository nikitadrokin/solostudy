'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { api, apiClient } from '@/utils/trpc';

const chartConfig = {
  totalMinutes: {
    label: 'Focus Minutes',
    color: 'var(--chart-1)',
  },
  created: {
    label: 'Tasks Created',
    color: 'var(--chart-2)',
  },
  completed: {
    label: 'Tasks Completed',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function WeeklyFocusChart() {
  const { data: focusData, isLoading: focusLoading } = useQuery({
    queryKey: api.focus.getDailyFocusStats.queryKey({ days: 7 }),
    queryFn: () => apiClient.focus.getDailyFocusStats.query({ days: 7 }),
  });
  const { data: todoData, isLoading: todoLoading } = useQuery(
    api.todos.getDailyStats.queryOptions({ days: 7 })
  );

  if (focusLoading || todoLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  const todoMap = new Map(
    (todoData?.chartData ?? []).map((d) => [d.date, { created: d.created, completed: d.completed }])
  );

  const chartData = (focusData?.chartData ?? []).map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    totalMinutes: item.totalMinutes,
    created: todoMap.get(item.date)?.created ?? 0,
    completed: todoMap.get(item.date)?.completed ?? 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[200px] select-none items-center justify-center">
        <div className="text-muted-foreground text-sm">No data yet</div>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="date"
          tickLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="totalMinutes" fill="var(--color-totalMinutes)" radius={4} />
        <Bar dataKey="created" fill="var(--color-created)" radius={4} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
