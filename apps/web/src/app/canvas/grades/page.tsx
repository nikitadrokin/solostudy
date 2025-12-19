'use client';

import { useQuery } from '@tanstack/react-query';
import { Award, ExternalLink, Loader2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { api } from '@/utils/trpc';

function getGradeColor(grade: string | null): string {
  if (!grade) {
    return 'text-muted-foreground';
  }
  const letter = grade.charAt(0).toUpperCase();
  switch (letter) {
    case 'A': {
      return 'text-green-600';
    }
    case 'B': {
      return 'text-blue-600';
    }
    case 'C': {
      return 'text-yellow-600';
    }
    case 'D': {
      return 'text-orange-600';
    }
    case 'F': {
      return 'text-red-600';
    }
    default: {
      return 'text-muted-foreground';
    }
  }
}

export default function CanvasGradesPage() {
  const { data: status } = useQuery(
    api.canvas.getStatus.queryOptions(undefined)
  );

  const { data: grades = [], isLoading: isLoadingGrades } = useQuery(
    api.canvas.getGrades.queryOptions(undefined)
  );

  const gradesWithData = grades.filter(
    (g) => g.currentScore !== null || g.currentGrade !== null
  );
  const gradesWithoutData = grades.filter(
    (g) => g.currentScore === null && g.currentGrade === null
  );

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Canvas Grades</h1>
        <p className="text-muted-foreground">
          View your Canvas grades and performance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Grades</CardTitle>
          <CardDescription>
            {isLoadingGrades
              ? 'Loading grades...'
              : `${gradesWithData.length} course(s) with grades`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingGrades ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : gradesWithData.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Award className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>No grades available</EmptyTitle>
                <EmptyDescription>
                  Your courses don&apos;t have any grades posted yet.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gradesWithData.map((grade) => {
                const gradeColor = getGradeColor(grade.currentGrade);
                const gradientMap: Record<string, string> = {
                  'text-green-600': 'from-green-500/20 to-green-500/5',
                  'text-blue-600': 'from-blue-500/20 to-blue-500/5',
                  'text-yellow-600': 'from-yellow-500/20 to-yellow-500/5',
                  'text-orange-600': 'from-orange-500/20 to-orange-500/5',
                  'text-red-600': 'from-red-500/20 to-red-500/5',
                  'text-muted-foreground': 'from-muted/50 to-muted/20',
                };
                const gradient =
                  gradientMap[gradeColor] ||
                  gradientMap['text-muted-foreground'];

                return (
                  <div
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-gradient-to-br ${gradient} p-5 transition-all hover:shadow-black/5 hover:shadow-lg`}
                    key={grade.courseId}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {grade.courseCode && (
                            <p className="mb-1 truncate font-medium text-muted-foreground text-xs uppercase tracking-wider">
                              {grade.courseCode}
                            </p>
                          )}
                          <h3 className="line-clamp-2 font-semibold leading-tight">
                            {grade.courseName}
                          </h3>
                        </div>
                        {status?.canvasUrl && (
                          <a
                            aria-label={`View ${grade.courseName} grades on Canvas`}
                            className={buttonVariants({
                              variant: 'ghost',
                              size: 'icon',
                              className:
                                'h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100',
                            })}
                            href={`${status.canvasUrl}/courses/${grade.courseId}/grades`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        {grade.currentGrade ? (
                          <div className="flex items-baseline gap-2">
                            <span
                              className={`font-bold text-3xl ${gradeColor}`}
                            >
                              {grade.currentGrade}
                            </span>
                          </div>
                        ) : grade.currentScore !== null ? (
                          <span className="font-bold text-3xl">
                            {grade.currentScore.toFixed(1)}%
                          </span>
                        ) : null}
                      </div>
                      {grade.currentScore !== null && grade.currentGrade && (
                        <span className="font-medium text-muted-foreground text-sm">
                          {grade.currentScore.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {gradesWithoutData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Courses Without Grades</CardTitle>
            <CardDescription>
              {gradesWithoutData.length} course(s) without posted grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gradesWithoutData.map((grade) => (
                <div
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-muted/30 p-5 transition-all hover:shadow-black/5 hover:shadow-lg"
                  key={grade.courseId}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        {grade.courseCode && (
                          <p className="mb-1 truncate font-medium text-muted-foreground text-xs uppercase tracking-wider">
                            {grade.courseCode}
                          </p>
                        )}
                        <h3 className="line-clamp-2 font-semibold text-muted-foreground leading-tight">
                          {grade.courseName}
                        </h3>
                      </div>
                      {status?.canvasUrl && (
                        <a
                          aria-label={`View ${grade.courseName} on Canvas`}
                          className={buttonVariants({
                            variant: 'ghost',
                            size: 'icon',
                            className:
                              'h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100',
                          })}
                          href={`${status.canvasUrl}/courses/${grade.courseId}/grades`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="font-medium text-muted-foreground text-sm">
                      No grade yet
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
