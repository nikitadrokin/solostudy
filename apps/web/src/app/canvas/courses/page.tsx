'use client';

import { useQuery } from '@tanstack/react-query';
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
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

export default function CanvasCoursesPage() {
  const { data: session } = authClient.useSession();

  const { data: status } = useQuery(
    api.canvas.getStatus.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery(
    api.canvas.getCourses.queryOptions(undefined, {
      enabled: status?.connected === true,
    })
  );

  const s = courses.length > 0 ? 's' : '';

  if (!status?.connected) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Canvas Courses</CardTitle>
            <CardDescription>
              Connect your Canvas account to view courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookOpen className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Canvas Not Connected</EmptyTitle>
                <EmptyDescription>
                  You need to connect your Canvas account in settings to view
                  courses.
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

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Canvas Courses</h1>
        <p className="text-muted-foreground">
          View your enrolled Canvas courses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>
            {isLoadingCourses
              ? 'Loading courses...'
              : `${courses.length} course${s} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCourses ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : courses.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookOpen className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>No courses found</EmptyTitle>
                <EmptyDescription>
                  You are not enrolled in any courses
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="divide-y">
              {courses.map((course) => (
                <div
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  key={course.id}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium">{course.name}</h3>
                    {course.courseCode && (
                      <p className="truncate text-muted-foreground text-sm">
                        {course.courseCode}
                      </p>
                    )}
                    {(course.startAt || course.endAt) && (
                      <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                        {course.startAt && (
                          <span>
                            Starts:{' '}
                            {new Date(course.startAt).toLocaleDateString(
                              undefined,
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        )}
                        {course.endAt && (
                          <span>
                            Ends:{' '}
                            {new Date(course.endAt).toLocaleDateString(
                              undefined,
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {status?.canvasUrl && (
                    <a
                      className={buttonVariants({
                        variant: 'ghost',
                        size: 'sm',
                      })}
                      href={`${status.canvasUrl}/courses/${course.canvasId}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
