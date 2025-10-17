'use client';

import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFocusTimer } from '@/hooks/use-focus-timer';

export function FocusTimer() {
  const { formattedTime, isActive } = useFocusTimer();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="relative bg-background/80 backdrop-blur-sm font-mono"
          size="sm"
          variant="outline"
        >
          <Timer className="mr-2 h-4 w-4" />
          {formattedTime}
          <div
            className={`absolute -right-1 -top-1 h-2 w-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        align="start"
        className="bg-background/80 backdrop-blur-sm"
        side="bottom"
      >
        {isActive ? 'Focus session active' : 'No active session'}
      </TooltipContent>
    </Tooltip>
  );
}
