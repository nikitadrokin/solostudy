'use client';

import { useQuery } from '@tanstack/react-query';
import { Award, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { authClient } from '@/lib/auth-client';
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
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data: status } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const { data: grades = [], isLoading: isLoadingGrades } = useQuery(
    api.canvas.getGrades.queryOptions(undefined, {
      enabled: status?.connected === true,
    })
  );

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  if (!status?.connected) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Canvas Grades</CardTitle>
            <CardDescription>
              Connect your Canvas account to view grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Award className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Canvas Not Connected</EmptyTitle>
                <EmptyDescription>
                  You need to connect your Canvas account in settings to view
                  grades.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link
                  className={buttonVariants({ size: 'lg' })}
                  href="/settings#integrations"
                >
                  Go to Settings
                </Link>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="divide-y">
              {gradesWithData.map((grade) => (
                <div
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  key={grade.courseId}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium">{grade.courseName}</h3>
                    {grade.courseCode && (
                      <p className="truncate text-muted-foreground text-sm">
                        {grade.courseCode}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      {grade.currentGrade && (
                        <span
                          className={`font-semibold text-lg ${getGradeColor(grade.currentGrade)}`}
                        >
                          {grade.currentGrade}
                        </span>
                      )}
                      {grade.currentScore !== null && (
                        <span className="ml-2 text-muted-foreground text-sm">
                          ({grade.currentScore.toFixed(1)}%)
                        </span>
                      )}
                      {!grade.currentGrade && grade.currentScore !== null && (
                        <span className="font-semibold text-lg">
                          {grade.currentScore.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {status?.canvasUrl && (
                      <a
                        className={buttonVariants({
                          variant: 'ghost',
                          size: 'sm',
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
              ))}
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
            <div className="divide-y">
              {gradesWithoutData.map((grade) => (
                <div
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  key={grade.courseId}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-muted-foreground">
                      {grade.courseName}
                    </h3>
                    {grade.courseCode && (
                      <p className="truncate text-muted-foreground text-sm">
                        {grade.courseCode}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="text-muted-foreground text-sm">
                      No grade
                    </span>
                    {status?.canvasUrl && (
                      <a
                        className={buttonVariants({
                          variant: 'ghost',
                          size: 'sm',
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
