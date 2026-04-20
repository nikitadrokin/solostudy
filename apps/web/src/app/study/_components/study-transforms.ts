import type { RouterOutputs } from '@/trpc/react';
import type { PlannerBlock, Priority, TodayPlanItem } from './study-data';

type CanvasStudyPlan = RouterOutputs['canvas']['getStudyPlan'];
type CanvasDiscussionInsights =
  RouterOutputs['canvas']['getDiscussionInsights'];
type CanvasAssignment = CanvasStudyPlan['assignments'][number];

export function priorityFromCanvasStatus(status: string, score = 0): Priority {
  if (status === 'overdue') {
    return 'critical';
  }
  if (status === 'urgent' || score >= 70) {
    return 'high';
  }
  if (status === 'upcoming' || score >= 35) {
    return 'medium';
  }
  return 'low';
}

export function dueLabelFromDays(daysUntilDue: number | null): string {
  if (daysUntilDue === null) {
    return 'No due date';
  }
  if (daysUntilDue < 0) {
    return `${Math.abs(daysUntilDue)} day${daysUntilDue === -1 ? '' : 's'} overdue`;
  }
  if (daysUntilDue === 0) {
    return 'Due today';
  }
  if (daysUntilDue === 1) {
    return 'Due tomorrow';
  }
  return `Due in ${daysUntilDue} days`;
}

export function minutesFromPriority(priority: Priority): number {
  switch (priority) {
    case 'critical':
      return 60;
    case 'high':
      return 45;
    case 'medium':
      return 30;
    default:
      return 20;
  }
}

export function studyItemFromCanvasAssignment(
  assignment: CanvasAssignment
): TodayPlanItem {
  const priority = priorityFromCanvasStatus(
    assignment.status,
    assignment.priorityScore
  );

  return {
    id: `assignment-${assignment.id}`,
    title: assignment.name,
    course: assignment.courseName,
    source: 'Assignment',
    dueLabel: dueLabelFromDays(assignment.daysUntilDue),
    minutes: minutesFromPriority(priority),
    priority,
    reason: `Ranked by deadline pressure and grade impact score ${Math.round(
      assignment.impactScore
    )}.`,
    impact:
      assignment.impactScore > 0
        ? `${Math.round(assignment.impactScore)} impact score`
        : 'Deadline signal',
    actionLabel: 'Start focus',
    href: '/focus',
  };
}

export function buildCanvasTodayItems(
  studyPlan?: CanvasStudyPlan,
  discussions?: CanvasDiscussionInsights
): TodayPlanItem[] {
  const items: TodayPlanItem[] = [];

  for (const assignment of studyPlan?.assignments.slice(0, 5) ?? []) {
    items.push(studyItemFromCanvasAssignment(assignment));
  }

  for (const discussion of discussions?.unansweredDiscussions.slice(0, 3) ??
    []) {
    const priority = priorityFromCanvasStatus(discussion.status);
    items.push({
      id: `discussion-${discussion.courseId}-${discussion.id}`,
      title: discussion.title,
      course: discussion.courseName,
      source: 'Discussion',
      dueLabel: dueLabelFromDays(discussion.daysUntilDue),
      minutes: priority === 'critical' ? 35 : 25,
      priority,
      reason: 'Unanswered discussion that still needs your participation.',
      impact: 'Participation risk',
      actionLabel: 'Draft response',
      href: '/focus',
    });
  }

  return items.slice(0, 6);
}

export function buildCanvasPlannerBlocks(
  studyPlan?: CanvasStudyPlan
): PlannerBlock[] {
  if (!studyPlan || studyPlan.assignments.length === 0) {
    return [];
  }

  const nowItems: TodayPlanItem[] = [];
  const nextItems: TodayPlanItem[] = [];
  const laterItems: TodayPlanItem[] = [];

  for (const assignment of studyPlan.assignments) {
    const item = studyItemFromCanvasAssignment(assignment);

    if (
      assignment.status === 'overdue' ||
      assignment.status === 'urgent' ||
      (assignment.daysUntilDue !== null && assignment.daysUntilDue <= 3)
    ) {
      nowItems.push(item);
    } else if (
      assignment.status === 'upcoming' ||
      (assignment.daysUntilDue !== null && assignment.daysUntilDue <= 7)
    ) {
      nextItems.push(item);
    } else {
      laterItems.push(item);
    }
  }

  return [
    makePlannerBlock('canvas-now', 'Now', 'Next 72 hours', nowItems),
    makePlannerBlock('canvas-next', 'Next', 'This week', nextItems),
    makePlannerBlock('canvas-later', 'Later', 'After this week', laterItems),
  ].filter((block) => block.items.length > 0);
}

function makePlannerBlock(
  id: string,
  day: string,
  date: string,
  items: TodayPlanItem[]
): PlannerBlock {
  let totalMinutes = 0;
  for (const item of items) {
    totalMinutes += item.minutes;
  }

  return {
    id,
    day,
    date,
    load:
      totalMinutes >= 150 ? 'heavy' : totalMinutes >= 90 ? 'balanced' : 'light',
    totalMinutes,
    items: items.slice(0, 4),
  };
}
