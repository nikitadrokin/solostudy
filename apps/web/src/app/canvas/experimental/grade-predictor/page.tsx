'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Calculator,
  CheckCircle,
  ChevronDown,
  Clock,
  Loader2,
  Target,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/utils/trpc';

function getGradeLetter(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function getGradeColor(score: number): string {
  if (score >= 90) return 'text-emerald-500';
  if (score >= 80) return 'text-blue-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 60) return 'text-orange-500';
  return 'text-red-500';
}

// Get color based on letter grade (for API-provided grades)
function getGradeColorFromLetter(grade: string): string {
  const letter = grade.charAt(0).toUpperCase();
  switch (letter) {
    case 'A': return 'text-emerald-500';
    case 'B': return 'text-blue-500';
    case 'C': return 'text-yellow-500';
    case 'D': return 'text-orange-500';
    case 'F': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
}

function getGradeBgColorFromLetter(grade: string): string {
  const letter = grade.charAt(0).toUpperCase();
  switch (letter) {
    case 'A': return 'bg-emerald-500/10';
    case 'B': return 'bg-blue-500/10';
    case 'C': return 'bg-yellow-500/10';
    case 'D': return 'bg-orange-500/10';
    case 'F': return 'bg-red-500/10';
    default: return 'bg-muted';
  }
}

function getGradeBgColor(score: number): string {
  if (score >= 90) return 'bg-emerald-500/10';
  if (score >= 80) return 'bg-blue-500/10';
  if (score >= 70) return 'bg-yellow-500/10';
  if (score >= 60) return 'bg-orange-500/10';
  return 'bg-red-500/10';
}

type GroupAnalysis = {
  id: number;
  name: string;
  weight: number;
  earnedPoints: number;
  possiblePoints: number;
  ungradedPoints: number;
  currentPercentage: number | null;
  assignmentCount: number;
  gradedCount: number;
  assignments: Array<{
    id: number;
    name: string;
    pointsPossible: number | null;
    score: number | null;
    graded: boolean;
    excused: boolean;
    dueAt: string | null;
  }>;
};

function AssignmentGroupCard({ group }: { group: GroupAnalysis }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{group.name}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {group.gradedCount} of {group.assignmentCount} graded
              </p>
            </div>
          </div>
          <div className="text-right">
            {group.currentPercentage !== null ? (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-1',
                  getGradeBgColor(group.currentPercentage)
                )}
              >
                <span
                  className={cn(
                    'font-bold text-xl',
                    getGradeColor(group.currentPercentage)
                  )}
                >
                  {group.currentPercentage.toFixed(1)}%
                </span>
              </div>
            ) : (
              <Badge variant="secondary">Not yet graded</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight and points info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">
                {group.weight}%
              </span>{' '}
              of total
            </span>
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">
                {group.earnedPoints.toFixed(1)}
              </span>{' '}
              / {group.possiblePoints.toFixed(1)} pts
            </span>
          </div>
          {group.ungradedPoints > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {group.ungradedPoints} pts pending
            </span>
          )}
        </div>

        {/* Progress bar */}
        {group.currentPercentage !== null && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, group.currentPercentage)}%` }}
            />
          </div>
        )}

        {/* Expandable assignments list */}
        {group.assignments.length > 0 && (
          <div>
            <Button
              className="w-full justify-between px-0 hover:bg-transparent"
              onClick={() => setExpanded(!expanded)}
              size="sm"
              variant="ghost"
            >
              <span className="text-muted-foreground text-xs">
                View assignments
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expanded && 'rotate-180'
                )}
              />
            </Button>
            {expanded && (
              <motion.div
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-2 space-y-2"
                initial={{ height: 0, opacity: 0 }}
              >
                {group.assignments.map((assignment) => (
                  <div
                    className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                    key={assignment.id}
                  >
                    <div className="flex items-center gap-2">
                      {assignment.graded ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="truncate">{assignment.name}</span>
                    </div>
                    <div className="shrink-0 text-right">
                      {assignment.excused ? (
                        <Badge className="text-xs" variant="outline">
                          Excused
                        </Badge>
                      ) : assignment.graded ? (
                        <span className="font-medium">
                          {assignment.score} / {assignment.pointsPossible}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          — / {assignment.pointsPossible}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type Projection = {
  targetGrade: number;
  needed: number | null;
  achievable: boolean;
};

function ProjectionCard({ projections }: { projections: Projection[] }) {
  const gradeLetters: Record<number, string> = {
    90: 'A',
    80: 'B',
    70: 'C',
    60: 'D',
  };

  return (
    <Card className="select-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">Target Grade Calculator</CardTitle>
            <p className="text-muted-foreground text-sm">
              What you need on remaining work
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {projections.map((proj) => (
            <div
              className={cn(
                'flex items-center justify-between rounded-lg border p-3',
                proj.achievable
                  ? 'border-border bg-card'
                  : 'border-destructive/20 bg-destructive/5'
              )}
              key={proj.targetGrade}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">
                  {gradeLetters[proj.targetGrade]}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({proj.targetGrade}%+)
                </span>
              </div>
              {proj.needed !== null ? (
                <div className="text-right">
                  {proj.achievable ? (
                    <span className="font-medium">
                      Need{' '}
                      <span className={getGradeColor(100 - proj.needed)}>
                        {proj.needed.toFixed(1)}%
                      </span>
                    </span>
                  ) : (
                    <span className="text-destructive text-sm">
                      Not possible
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-right">
                  {proj.achievable ? (
                    <span className="text-emerald-500 text-sm">✓ Secured</span>
                  ) : (
                    <span className="text-destructive text-sm">
                      Not possible
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const GradePredictorPage: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(
    undefined
  );

  const { data: courses = [] } = useQuery(
    api.canvas.getCourses.queryOptions(undefined)
  );

  // Also fetch grades to get Canvas-provided letter grades
  const { data: grades = [] } = useQuery(
    api.canvas.getGrades.queryOptions(undefined)
  );

  const {
    data: gradeAnalysis,
    isLoading: isLoadingAnalysis,
    error,
  } = useQuery(
    api.canvas.getGradeAnalysis.queryOptions(
      { courseId: selectedCourseId ?? 0 },
      {
        enabled: selectedCourseId !== undefined,
      }
    )
  );

  const selectedCourse = courses.find((c) => c.canvasId === selectedCourseId);
  
  // Get the Canvas-provided letter grade for the selected course
  const selectedCourseGrade = grades.find((g) => g.courseId === selectedCourseId);

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="select-none space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
              <Calculator className="size-6 shrink-0" />
            </div>
            <div>
              <h1 className="font-bold text-3xl tracking-tight">
                Grade Predictor
              </h1>
              <p className="text-muted-foreground">
                Analyze your grades and predict your final score
              </p>
            </div>
          </div>

          {/* Course selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-[250px] justify-between" variant="outline">
                {selectedCourse?.name ?? 'Select a course'}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[250px]">
              {courses.map((course) => (
                <DropdownMenuItem
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.canvasId)}
                >
                  {course.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* No course selected state or loading */}
      {(!selectedCourseId || isLoadingAnalysis) && (
        <Card>
          <CardContent>
            <Empty className="!p-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TrendingUp className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Select a Course</EmptyTitle>
                <EmptyDescription>
                  Choose a course to see your grade analysis and predictions.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="min-w-full items-start overflow-x-auto">
                <div className="grid w-full min-w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                  {courses.length > 0
                    ? courses.map((course) => (
                        <Item
                          asChild
                          className="cursor-pointer flex-nowrap overflow-hidden rounded-xl p-3 transition-colors hover:bg-accent"
                          key={course.id}
                          onClick={() => setSelectedCourseId(course.canvasId)}
                          size="sm"
                          variant="outline"
                        >
                          <button disabled={!!selectedCourseId} type="button">
                            <ItemMedia variant="icon">
                              {isLoadingAnalysis &&
                              selectedCourseId === course.canvasId ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <BookOpen className="size-4" />
                              )}
                            </ItemMedia>
                            <ItemContent>
                              <ItemTitle className="line-clamp-2 text-left">
                                {course.name}
                              </ItemTitle>
                            </ItemContent>
                          </button>
                        </Item>
                      ))
                    : Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton
                          className="h-[58px] w-full rounded-xl border opacity-50"
                          key={`course-skeleton-${index}`}
                        />
                      ))}
                </div>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="py-6">
            <p className="text-center text-destructive">
              Failed to load grade analysis. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grade analysis content */}
      {gradeAnalysis && (
        <motion.div
          animate={{ opacity: 1 }}
          className="space-y-6"
          initial={{ opacity: 0 }}
        >
          {/* Overall grade card */}
          <Card className="overflow-hidden">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
                {/* Use API letter grade if available, otherwise calculate from score */}
                {selectedCourseGrade?.currentGrade ? (
                  // Canvas provides letter grade
                  <div
                    className={cn(
                      'flex h-24 w-24 items-center justify-center rounded-2xl',
                      getGradeBgColorFromLetter(selectedCourseGrade.currentGrade)
                    )}
                  >
                    <span
                      className={cn(
                        'font-bold text-4xl',
                        getGradeColorFromLetter(selectedCourseGrade.currentGrade)
                      )}
                    >
                      {selectedCourseGrade.currentGrade}
                    </span>
                  </div>
                ) : (
                  // Fall back to calculated letter grade from score
                  <div
                    className={cn(
                      'flex h-24 w-24 items-center justify-center rounded-2xl',
                      gradeAnalysis.currentOverallGrade !== null
                        ? getGradeBgColor(gradeAnalysis.currentOverallGrade)
                        : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'font-bold text-4xl',
                        gradeAnalysis.currentOverallGrade !== null
                          ? getGradeColor(gradeAnalysis.currentOverallGrade)
                          : 'text-muted-foreground'
                      )}
                    >
                      {gradeAnalysis.currentOverallGrade !== null
                        ? getGradeLetter(gradeAnalysis.currentOverallGrade)
                        : '—'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-semibold text-2xl">
                    {gradeAnalysis.currentOverallGrade !== null
                      ? `${gradeAnalysis.currentOverallGrade.toFixed(2)}%`
                      : 'No grades yet'}
                  </h2>
                  <p className="text-muted-foreground">
                    Current weighted average based on{' '}
                    {gradeAnalysis.totalWeight.toFixed(0)}% of graded work
                  </p>
                  {gradeAnalysis.remainingWeight > 0 && (
                    <p className="mt-1 text-muted-foreground text-sm">
                      {gradeAnalysis.remainingWeight.toFixed(0)}% of your grade
                      is still ungraded
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target grade projections */}
          {gradeAnalysis.projections && (
            <ProjectionCard projections={gradeAnalysis.projections} />
          )}

          {/* Assignment groups breakdown */}
          <div className="space-y-4">
            <h2 className="select-none font-semibold text-xl">
              Grade Breakdown by Category
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {gradeAnalysis.groups.map((group) => (
                <AssignmentGroupCard group={group} key={group.id} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GradePredictorPage;
