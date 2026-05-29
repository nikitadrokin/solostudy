'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { api, apiClient } from '@/utils/trpc';

const chartConfig = {
  totalMinutes: {
    label: 'Focus Minutes',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function WeeklyFocusChart() {
  const { data, isLoading } = useQuery({
    queryKey: api.focus.getDailyFocusStats.queryKey({ days: 7 }),
    queryFn: () => apiClient.focus.getDailyFocusStats.query({ days: 7 }),
  });

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  if (!data?.chartData || data.chartData.length === 0) {
    return (
      <div className="flex h-[200px] select-none items-center justify-center">
        <div className="text-muted-foreground text-sm">No data yet</div>
      </div>
    );
  }

  const chartData = data.chartData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'short',
    }),
    totalMinutes: item.totalMinutes,
  }));

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
        <Bar dataKey="totalMinutes" fill="var(--color-totalMinutes)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
