'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, Timer } from 'lucide-react';
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
      className="w-[min(28rem,calc(100vw-2rem))] p-0!"
      onOpenChange={onOpenChange}
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
      <div className="flex flex-col p-4">
        <SoloSessionPlanner />

        <div className="mt-4 flex items-center gap-3 border-t pt-3 text-muted-foreground text-xs">
          <span className="flex items-center gap-1.5">
            <Timer className="size-3" />
            <span className="font-mono">{formattedTime}</span>
            <span>this session</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3" />
            <span>{formatDuration(totalTodaySeconds)} today</span>
          </span>
        </div>
      </div>
    </DynamicPopover>
  );
}
