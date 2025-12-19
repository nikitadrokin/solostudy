'use client';

import { useQuery } from '@tanstack/react-query';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { api, apiClient } from '@/utils/trpc';

const chartConfig = {
  sessions: {
    label: 'Sessions',
    color: 'var(--chart-1)',
  },
  totalMinutes: {
    label: 'Minutes',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function FocusAnalyticsChart() {
  const { data, isLoading } = useQuery({
    queryKey: api.focus.getDailyFocusStats.queryKey({ days: 7 }),
    queryFn: () => apiClient.focus.getDailyFocusStats.query({ days: 7 }),
  });

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
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
    sessions: item.sessions,
    totalMinutes: item.totalMinutes,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          dataKey="date"
          tickLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="sessions"
          dot={false}
          stroke="var(--color-sessions)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="totalMinutes"
          dot={false}
          stroke="var(--color-totalMinutes)"
          strokeWidth={2}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  );
}

