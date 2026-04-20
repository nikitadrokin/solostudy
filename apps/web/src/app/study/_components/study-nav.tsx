'use client';

import {
  BarChart3,
  CalendarDays,
  FlaskConical,
  ListChecks,
} from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const studyLinks = [
  {
    href: '/study/today',
    label: 'Today',
    description: 'Next actions',
    icon: ListChecks,
  },
  {
    href: '/study/planner',
    label: 'Planner',
    description: 'Weekly load',
    icon: CalendarDays,
  },
  {
    href: '/study/progress',
    label: 'Progress',
    description: 'Effort gaps',
    icon: BarChart3,
  },
  {
    href: '/study/lab',
    label: 'Study Lab',
    description: 'Transform content',
    icon: FlaskConical,
  },
] as const;

type StudyPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  dataMode?: 'sample' | 'canvas' | 'live';
};

const dataModeLabels: Record<
  NonNullable<StudyPageShellProps['dataMode']>,
  string
> = {
  canvas: 'Canvas data',
  live: 'Live data',
  sample: 'Sample data',
};

export function StudyPageShell({
  eyebrow,
  title,
  description,
  children,
  dataMode = 'sample',
}: StudyPageShellProps) {
  return (
    <main className="container mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <header className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <p className="font-medium text-muted-foreground text-sm">
                {eyebrow}
              </p>
              <Badge variant={dataMode === 'sample' ? 'outline' : 'default'}>
                {dataModeLabels[dataMode]}
              </Badge>
            </div>
            <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm leading-6">
              {description}
            </p>
          </div>
          <StudyNav />
        </div>
      </header>
      {children}
    </main>
  );
}

function StudyNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Study views"
      className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
    >
      {studyLinks.map(({ href, label, description, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={cn(
              buttonVariants({ variant: active ? 'default' : 'outline' }),
              'h-auto justify-start px-3 py-3 text-left transition-colors duration-200'
            )}
            href={href as Route}
            key={href}
          >
            <Icon className="size-4" />
            <span className="min-w-0">
              <span className="block font-medium">{label}</span>
              <span
                className={cn(
                  'block text-xs',
                  active
                    ? 'text-primary-foreground/80'
                    : 'text-muted-foreground'
                )}
              >
                {description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
