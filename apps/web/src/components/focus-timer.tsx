'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, Info, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DynamicPopover from '@/components/ui/dynamic-popover';
import { useFocusTimer } from '@/hooks/use-focus-timer';
import { cn } from '@/lib/utils';
import { api, apiClient } from '@/utils/trpc';

export function FocusTimer() {
  const { formattedTime, isActive, focusTime } = useFocusTimer();

  const { data: todayData } = useQuery({
    queryKey: api.focus.getTodayFocusTime.queryKey(),
    queryFn: () => apiClient.focus.getTodayFocusTime.query(),
    refetchInterval: 60_000, // Refresh every minute
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalTodaySeconds = (todayData?.totalSeconds ?? 0) + focusTime;

  return (
    <DynamicPopover
      align="start"
      side="bottom"
      tooltip={isActive ? 'Focus session active' : 'Focus timer'}
      trigger={
        <Button
          className="relative bg-background/80 font-mono backdrop-blur-sm"
          size="sm"
          variant="outline"
        >
          <Timer className="mr-2 h-4 w-4" />
          {formattedTime}
          <div
            className={`-right-1 -top-1 absolute h-2 w-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}
          />
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Current Session */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isActive
                ? 'bg-green-500/20 text-green-500'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">Current Session</p>
            <p className="font-mono text-2xl">{formattedTime}</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Today's Total */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-muted-foreground text-sm">
              Today's Total
            </p>
            <p className="font-semibold text-lg">
              {formatDuration(totalTodaySeconds)}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <Info
            className={cn(
              'aspect-square size-4',
              isActive ? 'text-muted-foreground' : 'text-destructive'
            )}
          />
          <p className="text-pretty text-muted-foreground text-xs">
            Time is only tracked while this tab is focused
          </p>
        </div>
      </div>
    </DynamicPopover>
  );
}
