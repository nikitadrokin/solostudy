import { ArrowRight, Clock3 } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  priorityBadgeVariants,
  priorityLabels,
  priorityStyles,
  sourceIcons,
  type TodayPlanItem,
} from './study-data';

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
};

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex size-10 items-center justify-center rounded-md border bg-muted/40">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="font-semibold text-2xl tracking-tight">{value}</p>
          <p className="truncate text-muted-foreground text-xs">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

type TodayItemCardProps = {
  item: TodayPlanItem;
  compact?: boolean;
};

export function TodayItemCard({ item, compact = false }: TodayItemCardProps) {
  const SourceIcon = sourceIcons[item.source];

  return (
    <article
      className={cn(
        'rounded-lg border p-4 shadow-sm transition-colors duration-200 hover:bg-accent/50',
        priorityStyles[item.priority]
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
              <SourceIcon className="size-4" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={priorityBadgeVariants[item.priority]}>
                  {priorityLabels[item.priority]}
                </Badge>
                <Badge variant="outline">{item.source}</Badge>
              </div>
              <h2 className="font-semibold text-base leading-6">
                {item.title}
              </h2>
              <p className="text-muted-foreground text-sm">{item.course}</p>
            </div>
          </div>

          <div
            className={cn(
              'grid gap-3 text-sm',
              compact ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
            )}
          >
            <div>
              <p className="text-muted-foreground text-xs">Timing</p>
              <p className="font-medium">{item.dueLabel}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Effort</p>
              <p className="flex items-center gap-1 font-medium">
                <Clock3 className="size-3" />
                {item.minutes} min
              </p>
            </div>
            {compact ? null : (
              <div>
                <p className="text-muted-foreground text-xs">Signal</p>
                <p className="font-medium">{item.impact}</p>
              </div>
            )}
          </div>

          <p className="text-muted-foreground text-sm leading-6">
            {item.reason}
          </p>
        </div>

        <Link
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-full justify-between sm:w-auto'
          )}
          href={item.href as Route}
        >
          {item.actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

type EffortBarProps = {
  label: string;
  value: number;
  max: number;
};

export function EffortBar({ label, value, max }: EffortBarProps) {
  const width = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value} / {max} min
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-in-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
