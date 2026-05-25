'use client';

import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { api } from '@/utils/trpc';

const chartConfig = {
  created: {
    label: 'Tasks Created',
    color: 'var(--chart-1)',
  },
  completed: {
    label: 'Tasks Completed',
    color: 'var(--chart-2)',
  },
  focusMinutes: {
    label: 'Focus Minutes',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function WeeklyActivityChart() {
  const { data: todoData, isLoading: todoLoading } = useQuery(
    api.todos.getDailyStats.queryOptions({ days: 7 })
  );
  const { data: focusData, isLoading: focusLoading } = useQuery(
    api.focus.getDailyFocusStats.queryOptions({ days: 7 })
  );

  if (todoLoading || focusLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading analytics…</div>
      </div>
    );
  }

  const focusMap = new Map(
    (focusData?.chartData ?? []).map((d) => [d.date, d.totalMinutes])
  );

  const chartData = (todoData?.chartData ?? []).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    created: d.created,
    completed: d.completed,
    focusMinutes: focusMap.get(d.date) ?? 0,
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
          dataKey="created"
          fill="var(--color-created)"
          fillOpacity={0.4}
          stroke="var(--color-created)"
          type="monotone"
        />
        <Area
          dataKey="completed"
          fill="var(--color-completed)"
          fillOpacity={0.4}
          stroke="var(--color-completed)"
          type="monotone"
        />
        <Area
          dataKey="focusMinutes"
          fill="var(--color-focusMinutes)"
          fillOpacity={0.4}
          stroke="var(--color-focusMinutes)"
          type="monotone"
        />
      </AreaChart>
    </ChartContainer>
  );
}
