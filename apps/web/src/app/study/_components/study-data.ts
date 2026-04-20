import type { LucideIcon } from 'lucide-react';
import {
  BookOpenCheck,
  CalendarClock,
  CircleGauge,
  FileQuestion,
  Focus,
  MessageSquareText,
  NotebookPen,
  Target,
  TrendingUp,
} from 'lucide-react';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type PlanSource =
  | 'Assignment'
  | 'Discussion'
  | 'Review'
  | 'Calendar'
  | 'Manual';

export type TodayPlanItem = {
  id: string;
  title: string;
  course: string;
  source: PlanSource;
  dueLabel: string;
  minutes: number;
  priority: Priority;
  reason: string;
  impact: string;
  actionLabel: string;
  href: string;
};

export type PlannerBlock = {
  id: string;
  day: string;
  date: string;
  load: 'light' | 'balanced' | 'heavy';
  totalMinutes: number;
  items: TodayPlanItem[];
};

export type ProgressCourse = {
  id: string;
  course: string;
  focusMinutes: number;
  plannedMinutes: number;
  completedTasks: number;
  openTasks: number;
  note: string;
};

export type StudyLabTool = {
  id: string;
  title: string;
  description: string;
  input: string;
  output: string;
  status: 'ready' | 'prototype' | 'next';
  href: string;
  icon: LucideIcon;
};

export const priorityLabels: Record<Priority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const priorityStyles: Record<Priority, string> = {
  critical: 'border-destructive/40 bg-destructive/5',
  high: 'border-border bg-card',
  medium: 'border-border bg-card',
  low: 'border-border bg-muted/40',
};

export const priorityBadgeVariants: Record<
  Priority,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  critical: 'destructive',
  high: 'default',
  medium: 'secondary',
  low: 'outline',
};

export const sourceIcons: Record<PlanSource, LucideIcon> = {
  Assignment: BookOpenCheck,
  Discussion: MessageSquareText,
  Review: NotebookPen,
  Calendar: CalendarClock,
  Manual: Target,
};

export const mockTodayItems: TodayPlanItem[] = [
  {
    id: 'mock-biology-lab',
    title: 'Finish lab reflection and upload worksheet',
    course: 'BIO 214',
    source: 'Assignment',
    dueLabel: 'Due tonight',
    minutes: 55,
    priority: 'critical',
    reason: 'Due soon and worth 8% of the current module grade.',
    impact: 'High grade impact',
    actionLabel: 'Start focus',
    href: '/focus',
  },
  {
    id: 'mock-history-discussion',
    title: 'Post initial response on Reconstruction sources',
    course: 'HIST 108',
    source: 'Discussion',
    dueLabel: 'Due tomorrow',
    minutes: 25,
    priority: 'high',
    reason: 'Unanswered discussion with a reply requirement tomorrow.',
    impact: 'Participation risk',
    actionLabel: 'Draft response',
    href: '/focus',
  },
  {
    id: 'mock-calc-review',
    title: 'Review integration by parts before quiz',
    course: 'MATH 241',
    source: 'Review',
    dueLabel: 'Quiz in 2 days',
    minutes: 35,
    priority: 'medium',
    reason: 'Recent quiz scores suggest this topic needs another pass.',
    impact: 'Confidence builder',
    actionLabel: 'Practice',
    href: '/study/lab',
  },
  {
    id: 'mock-english-reading',
    title: 'Read chapter 6 and capture 3 quotes',
    course: 'ENGL 202',
    source: 'Assignment',
    dueLabel: 'Due Friday',
    minutes: 40,
    priority: 'low',
    reason: 'Lower urgency, but easy to batch after the focus block.',
    impact: 'Low urgency',
    actionLabel: 'Add to plan',
    href: '/study/planner',
  },
];

export const mockPlannerBlocks: PlannerBlock[] = [
  {
    id: 'monday-plan',
    day: 'Monday',
    date: 'Apr 20',
    load: 'heavy',
    totalMinutes: 155,
    items: mockTodayItems.slice(0, 3),
  },
  {
    id: 'tuesday-plan',
    day: 'Tuesday',
    date: 'Apr 21',
    load: 'balanced',
    totalMinutes: 110,
    items: [
      {
        id: 'mock-chem-problem-set',
        title: 'Complete thermodynamics problem set',
        course: 'CHEM 121',
        source: 'Assignment',
        dueLabel: 'Due Wednesday',
        minutes: 60,
        priority: 'high',
        reason: 'Medium deadline pressure with a high point value.',
        impact: 'Grade mover',
        actionLabel: 'Start focus',
        href: '/focus',
      },
      {
        id: 'mock-bio-video',
        title: 'Watch enzyme kinetics lecture and write notes',
        course: 'BIO 214',
        source: 'Review',
        dueLabel: 'Before lab',
        minutes: 50,
        priority: 'medium',
        reason: 'Prepares the next lab without blocking today.',
        impact: 'Prep work',
        actionLabel: 'Open notes',
        href: '/focus',
      },
    ],
  },
  {
    id: 'wednesday-plan',
    day: 'Wednesday',
    date: 'Apr 22',
    load: 'light',
    totalMinutes: 75,
    items: [
      {
        id: 'mock-history-replies',
        title: 'Reply to two classmates',
        course: 'HIST 108',
        source: 'Discussion',
        dueLabel: 'Due Thursday',
        minutes: 20,
        priority: 'medium',
        reason: 'Short task that closes the discussion requirement.',
        impact: 'Completion unlock',
        actionLabel: 'Draft replies',
        href: '/focus',
      },
      {
        id: 'mock-math-quiz',
        title: 'Take 15-question calculus practice quiz',
        course: 'MATH 241',
        source: 'Review',
        dueLabel: 'Quiz Friday',
        minutes: 55,
        priority: 'high',
        reason: 'Practice now leaves time to repair weak topics.',
        impact: 'Exam readiness',
        actionLabel: 'Practice',
        href: '/study/lab',
      },
    ],
  },
];

export const mockProgressCourses: ProgressCourse[] = [
  {
    id: 'progress-bio',
    course: 'BIO 214',
    focusMinutes: 210,
    plannedMinutes: 260,
    completedTasks: 5,
    openTasks: 2,
    note: 'On pace, but tonight has the highest-impact deadline.',
  },
  {
    id: 'progress-math',
    course: 'MATH 241',
    focusMinutes: 85,
    plannedMinutes: 180,
    completedTasks: 2,
    openTasks: 3,
    note: 'Under-invested relative to the quiz risk.',
  },
  {
    id: 'progress-history',
    course: 'HIST 108',
    focusMinutes: 70,
    plannedMinutes: 90,
    completedTasks: 3,
    openTasks: 1,
    note: 'Discussion work is nearly closed for the week.',
  },
];

export const studyLabTools: StudyLabTool[] = [
  {
    id: 'grade-strategy',
    title: 'Grade Strategy',
    description:
      'Prioritize work by how much each assignment can move a grade.',
    input: 'Assignments, weights, submissions',
    output: 'Best next grade-preserving action',
    status: 'ready',
    href: '/canvas/experimental/grade-predictor',
    icon: TrendingUp,
  },
  {
    id: 'quiz-practice',
    title: 'Quiz Practice',
    description: 'Turn course material into short drills before exams.',
    input: 'Files, modules, quiz history',
    output: 'Practice set with weak-topic review',
    status: 'prototype',
    href: '/canvas/experimental/quiz-practice',
    icon: FileQuestion,
  },
  {
    id: 'study-guide',
    title: 'Study Guide',
    description:
      'Condense a course module into concepts, terms, and likely prompts.',
    input: 'Canvas pages and files',
    output: 'Structured guide and flashcard seeds',
    status: 'next',
    href: '/study/lab',
    icon: NotebookPen,
  },
  {
    id: 'focus-calibration',
    title: 'Focus Calibration',
    description: 'Compare planned effort with actual focus time by course.',
    input: 'Tasks, due dates, focus sessions',
    output: 'Study time gaps and next session target',
    status: 'ready',
    href: '/study/progress',
    icon: CircleGauge,
  },
  {
    id: 'deep-work-launcher',
    title: 'Deep Work Launcher',
    description: 'Open the Focus Room with the right assignment pinned.',
    input: 'Priority task and saved focus preset',
    output: 'Tracked work session',
    status: 'ready',
    href: '/focus',
    icon: Focus,
  },
];
