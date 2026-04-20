'use client';

import {
  Check,
  Circle,
  Coffee,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Target,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
    goals,
    selectPreset,
    start,
    pause,
    reset,
    tick,
    addGoal,
    toggleGoal,
    removeGoal,
    clearCompletedGoals,
  } = useSoloSessionStore();
  const [goalTitle, setGoalTitle] = useState('');

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

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.completed).length,
    [goals]
  );

  const handleAddGoal = () => {
    addGoal(goalTitle);
    setGoalTitle('');
  };

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

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">Session Goals</h4>
          </div>
          <Badge variant="outline">
            {completedGoals}/{goals.length} done
          </Badge>
        </div>

        <div className="space-y-2">
          <Label htmlFor="session-goal">Goal</Label>
          <div className="flex gap-2">
            <Input
              id="session-goal"
              onChange={(event) => setGoalTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddGoal();
                }
              }}
              placeholder="Read chapter 3, finish problem set..."
              value={goalTitle}
            />
            <Button
              aria-label="Add session goal"
              disabled={!goalTitle.trim()}
              onClick={handleAddGoal}
              size="icon"
              type="button"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {goals.length === 0 ? (
            <div className="rounded-md border border-dashed p-4 text-center text-muted-foreground text-sm">
              Add 1-3 concrete goals before the timer starts.
            </div>
          ) : (
            goals.map((goal) => (
              <div
                className="flex items-center gap-3 rounded-md border bg-background p-2"
                key={goal.id}
              >
                <Checkbox
                  aria-label={`Mark ${goal.title} as ${goal.completed ? 'incomplete' : 'complete'}`}
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoal(goal.id)}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'truncate text-sm',
                      goal.completed && 'text-muted-foreground line-through'
                    )}
                  >
                    {goal.title}
                  </p>
                </div>
                {goal.completed ? (
                  <Check className="size-4 text-muted-foreground" />
                ) : (
                  <Circle className="size-4 text-muted-foreground" />
                )}
                <Button
                  aria-label={`Remove ${goal.title}`}
                  onClick={() => removeGoal(goal.id)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {completedGoals > 0 ? (
          <Button
            className="w-full"
            onClick={clearCompletedGoals}
            type="button"
            variant="outline"
          >
            Clear completed
          </Button>
        ) : null}
      </section>
    </div>
  );
}
