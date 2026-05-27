'use client';

import { Coffee, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  formatSessionTime,
  SOLO_SESSION_PRESETS,
  type SoloSessionPhase,
  useSoloSessionStore,
} from '@/stores/solo-session-store';

const phaseLabels: Record<SoloSessionPhase, string> = {
  idle: 'Ready',
  focus: 'Focus',
  break: 'Break',
};

export default function SoloSessionPlanner() {
  const {
    presetId,
    phase,
    remainingSeconds,
    isRunning,
    completedFocusBlocks,
    selectPreset,
    start,
    pause,
    reset,
    tick,
  } = useSoloSessionStore();

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning, tick]);

  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-base">Solo Session</h3>
            <p className="text-muted-foreground text-sm">
              Set a rhythm before starting deep work.
            </p>
          </div>
          <Badge variant={phase === 'break' ? 'secondary' : 'default'}>
            {phaseLabels[phase]}
          </Badge>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono font-semibold text-4xl tracking-tight">
                {formatSessionTime(remainingSeconds)}
              </p>
              <p className="mt-1 text-muted-foreground text-sm">
                {completedFocusBlocks} focus block
                {completedFocusBlocks === 1 ? '' : 's'} finished
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isRunning ? (
                <Button
                  aria-label="Pause solo session"
                  onClick={pause}
                  size="icon"
                  type="button"
                >
                  <Pause className="size-4" />
                </Button>
              ) : (
                <Button
                  aria-label="Start solo session"
                  onClick={start}
                  size="icon"
                  type="button"
                >
                  <Play className="size-4" />
                </Button>
              )}
              <Button
                aria-label="Reset solo session"
                onClick={reset}
                size="icon"
                type="button"
                variant="outline"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Coffee className="size-4 text-muted-foreground" />
          <h4 className="font-medium text-sm">Work / Break Presets</h4>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {SOLO_SESSION_PRESETS.map((preset) => {
            const selected = preset.id === presetId;
            return (
              <Button
                className={cn(
                  'h-auto justify-start px-3 py-3 text-left',
                  selected && 'border-primary'
                )}
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                type="button"
                variant={selected ? 'default' : 'outline'}
              >
                <span className="min-w-0">
                  <span className="block font-medium">{preset.label}</span>
                  <span
                    className={cn(
                      'block text-xs',
                      selected
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    )}
                  >
                    {preset.description}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
