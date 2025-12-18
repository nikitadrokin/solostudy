'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Discussion = {
  id: number;
  title: string;
  courseId: number;
  courseName: string;
  dueAt: string | null;
  postedAt: string | null;
  daysUntilDue: number | null;
  status: 'overdue' | 'urgent' | 'upcoming' | 'later' | 'no-due-date';
  htmlUrl: string;
};

const statusConfig: Record<
  Discussion['status'],
  { label: string; color: string; bgColor: string; icon: React.ReactNode; priority: number }
> = {
  overdue: {
    label: 'Overdue',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: <AlertTriangle className="h-4 w-4" />,
    priority: 1,
  },
  urgent: {
    label: 'Urgent',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    icon: <Zap className="h-4 w-4" />,
    priority: 2,
  },
  upcoming: {
    label: 'Soon',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: <Clock className="h-4 w-4" />,
    priority: 3,
  },
  later: {
    label: 'Later',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    icon: <CheckCircle2 className="h-4 w-4" />,
    priority: 4,
  },
  'no-due-date': {
    label: 'No Date',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    icon: <MessageCircle className="h-4 w-4" />,
    priority: 5,
  },
};

function formatDueDate(
  dueAt: string | null,
  daysUntilDue: number | null
): string {
  if (!dueAt || daysUntilDue === null) return 'No due date';

  if (daysUntilDue < 0) {
    const daysOverdue = Math.abs(daysUntilDue);
    return daysOverdue === 1 ? '1 day overdue' : `${daysOverdue} days overdue`;
  }
  if (daysUntilDue === 0) return 'Due today';
  if (daysUntilDue === 1) return 'Due tomorrow';
  if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;

  return new Date(dueAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export const columns: ColumnDef<Discussion>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = statusConfig[row.original.status];
      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
              status.bgColor,
              status.color
            )}
          >
            {status.icon}
          </div>
          <Badge className={cn('text-xs', status.color)} variant="outline">
            {status.label}
          </Badge>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const priorityA = statusConfig[rowA.original.status].priority;
      const priorityB = statusConfig[rowB.original.status].priority;
      return priorityA - priorityB;
    },
  },
  {
    accessorKey: 'title',
    header: 'Discussion',
    cell: ({ row }) => (
      <div className="max-w-[300px]">
        <a
          className="group flex items-center gap-1 font-medium text-foreground hover:text-primary hover:underline"
          href={row.original.htmlUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="line-clamp-1">{row.original.title}</span>
          <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
      </div>
    ),
  },
  {
    accessorKey: 'courseName',
    header: 'Course',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <BookOpen className="h-4 w-4 shrink-0" />
        <span className="line-clamp-1 max-w-[200px]">{row.original.courseName}</span>
      </div>
    ),
  },
  {
    accessorKey: 'dueAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDueDate(row.original.dueAt, row.original.daysUntilDue)}
      </span>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.daysUntilDue;
      const b = rowB.original.daysUntilDue;
      if (a === null && b === null) return 0;
      if (a === null) return 1;
      if (b === null) return -1;
      return a - b;
    },
  },
];
