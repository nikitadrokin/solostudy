'use client';

import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DynamicPopover,
  DynamicPopoverBody,
  DynamicPopoverContent,
  DynamicPopoverTrigger,
} from '@/components/ui/dynamic-popover';
import { useFocusTimer } from '@/hooks/use-focus-timer';
import { cn } from '@/lib/utils';
import {
  formatSessionTime,
  useSoloSessionStore,
} from '@/stores/solo-session-store';
import SoloSessionPlanner from './focus-room/solo-session-planner';

type FocusTimerProps = {
  onOpenChange?: (open: boolean) => void;
};

export function FocusTimer({ onOpenChange }: FocusTimerProps) {
  const { formattedTime, isActive } = useFocusTimer();
  const { phase, remainingSeconds, isRunning } = useSoloSessionStore();

  const hasPlannedSession = phase !== 'idle';
  const triggerLabel = hasPlannedSession
    ? formatSessionTime(remainingSeconds)
    : formattedTime;

  return (
    <DynamicPopover onOpenChange={onOpenChange}>
      <DynamicPopoverTrigger
        render={
          <Button
            className="relative bg-background/80 font-mono backdrop-blur-sm"
            size="sm"
            type="button"
            variant="outline"
          />
        }
        tooltip={isRunning ? 'Solo session active' : 'Focus timer'}
      >
        <Timer className="mr-2 h-4 w-4" />
        {triggerLabel}
        <div
          className={cn(
            '-right-1 -top-1 absolute h-2 w-2 rounded-full',
            isRunning || isActive ? 'bg-primary' : 'bg-muted-foreground'
          )}
        />
      </DynamicPopoverTrigger>
      <DynamicPopoverContent
        align="start"
        className="w-[min(28rem,calc(100vw-2rem))]"
        side="bottom"
        title="Focus timer"
      >
        <DynamicPopoverBody viewportClassName="px-4 md:pt-4">
          <SoloSessionPlanner />

          <div className="mt-4 flex items-center gap-3 border-t pt-3 text-muted-foreground text-xs">
            <span className="flex items-center gap-1.5">
              <Timer className="size-3" />
              <span className="font-mono">{formattedTime}</span>
              <span>this session</span>
            </span>
          </div>
        </DynamicPopoverBody>
      </DynamicPopoverContent>
    </DynamicPopover>
  );
}
