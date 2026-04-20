'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, Info, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DynamicPopover from '@/components/ui/dynamic-popover';
import { useFocusTimer } from '@/hooks/use-focus-timer';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import {
  formatSessionTime,
  useSoloSessionStore,
} from '@/stores/solo-session-store';
import { api } from '@/utils/trpc';
import SoloSessionPlanner from './focus-room/solo-session-planner';

type FocusTimerProps = {
  onOpenChange?: (open: boolean) => void;
};

export function FocusTimer({ onOpenChange }: FocusTimerProps) {
  const { data: session } = authClient.useSession();
  const { formattedTime, isActive, focusTime } = useFocusTimer();
  const { phase, remainingSeconds, isRunning } = useSoloSessionStore();

  const { data: todayData } = useQuery(
    api.focus.getTodayFocusTime.queryOptions(undefined, {
      enabled: !!session,
      refetchInterval: 60_000,
    })
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalTodaySeconds = (todayData?.totalSeconds ?? 0) + focusTime;
  const hasPlannedSession = phase !== 'idle';
  const triggerLabel = hasPlannedSession
    ? formatSessionTime(remainingSeconds)
    : formattedTime;

  return (
    <DynamicPopover
      align="start"
      className="w-[min(28rem,calc(100vw-2rem))]"
      onOpenChange={onOpenChange}
      showScrollFadeOnPopover
      side="bottom"
      tooltip={isRunning ? 'Solo session active' : 'Focus timer'}
      trigger={
        <Button
          className="relative bg-background/80 font-mono backdrop-blur-sm"
          size="sm"
          type="button"
          variant="outline"
        >
          <Timer className="mr-2 h-4 w-4" />
          {triggerLabel}
          <div
            className={cn(
              '-right-1 -top-1 absolute h-2 w-2 rounded-full',
              isRunning || isActive ? 'bg-primary' : 'bg-muted-foreground'
            )}
          />
        </Button>
      }
    >
      <div className="flex max-h-[75vh] flex-col gap-4 overflow-y-auto p-1">
        <SoloSessionPlanner />

        <div className="h-px bg-border" />

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
