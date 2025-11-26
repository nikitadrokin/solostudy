'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { authClient } from '@/lib/auth-client';
import { apiClient } from '@/utils/trpc';

type AssignmentCardProps = {
  assignment: {
    id: string;
    canvasId: number;
    courseId: string;
    name: string;
    description: string | null;
    dueAt: string | Date | null;
    pointsPossible: number | null;
    submitted: boolean;
  };
  courses: Array<{ id: string; name: string }>;
  selectedCourseId?: number;
  onImport: (assignmentId: number) => void;
  isImporting: boolean;
};

function getDueDateStatus(
  dueAt: string | Date | null,
  submitted: boolean
): {
  isOverdue: boolean;
  isDueSoon: boolean;
  dueDate: Date | null;
} {
  const now = Date.now();
  const dueDate = dueAt ? new Date(dueAt) : null;
  const dueTime = dueDate ? dueDate.getTime() : null;
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;

  if (!dueTime || submitted) {
    return { isOverdue: false, isDueSoon: false, dueDate };
  }

  const isOverdue = dueTime < now;
  const isDueSoon = dueTime > now && dueTime - now < threeDaysInMs;

  return { isOverdue, isDueSoon, dueDate };
}

function AssignmentCard({
  assignment,
  courses,
  selectedCourseId,
  onImport,
  isImporting,
}: AssignmentCardProps) {
  const { isOverdue, isDueSoon, dueDate } = getDueDateStatus(
    assignment.dueAt,
    assignment.submitted
  );

  return (
    <Card className={isOverdue ? 'border-destructive' : ''} key={assignment.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              {assignment.submitted ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              ) : (
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-base">{assignment.name}</h3>
                {!selectedCourseId && (
                  <p className="text-muted-foreground text-sm">
                    {courses.find((c) => c.id === assignment.courseId)?.name}
                  </p>
                )}
              </div>
            </div>

            {assignment.description && (
              <p className="line-clamp-2 text-muted-foreground text-sm">
                {assignment.description.replace(/<[^>]*>/g, '')}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {assignment.dueAt && (
                <div
                  className={`flex items-center gap-1.5 ${
                    isOverdue
                      ? 'text-destructive'
                      : isDueSoon
                        ? 'text-orange-600'
                        : 'text-muted-foreground'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>
                    Due:{' '}
                    {dueDate?.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}

              {assignment.pointsPossible !== null &&
                assignment.pointsPossible !== undefined && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {assignment.pointsPossible} point
                      {assignment.pointsPossible !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

              {assignment.submitted && (
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submitted</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!assignment.submitted && (
              <Button
                disabled={isImporting}
                onClick={() => onImport(assignment.canvasId)}
                size="sm"
                variant="outline"
              >
                {isImporting ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-1 h-4 w-4" />
                )}
                Add to Tasks
              </Button>
            )}
            <Button asChild size="sm" variant="ghost">
              <a
                href={`https://canvas.instructure.com/courses/${assignment.courseId}/assignments/${assignment.canvasId}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CanvasAssignmentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(
    undefined
  );
  const [includeCompleted, setIncludeCompleted] = useState(false);

  const { data: status } = useQuery({
    queryKey: [['canvas', 'getStatus']],
    queryFn: () => apiClient.canvas.getStatus.query(),
    enabled: !!session,
  });

  const { data: courses = [] } = useQuery({
    queryKey: [['canvas', 'getCourses']],
    queryFn: () => apiClient.canvas.getCourses.query(),
    enabled: status?.connected === true,
  });

  const { data: assignments = [], isLoading: isLoadingAssignments } = useQuery({
    queryKey: [
      ['canvas', 'getAssignments'],
      { courseId: selectedCourseId, includeCompleted },
    ],
    queryFn: () =>
      apiClient.canvas.getAssignments.query({
        courseId: selectedCourseId,
        includeCompleted,
      }),
    enabled: status?.connected === true,
  });

  const importMutation = useMutation({
    mutationFn: (assignmentIds: number[]) =>
      apiClient.canvas.importAssignmentsAsTodos.mutate({
        assignmentIds,
      }),
    onSuccess: (_, assignmentIds) => {
      queryClient.invalidateQueries({ queryKey: [['todos']] });
      toast.success(`Imported ${assignmentIds.length} assignment(s) as tasks`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to import assignments'
      );
    },
  });

  const handleImportAsTodos = (assignmentIds: number[]) => {
    importMutation.mutate(assignmentIds);
  };

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!status?.connected) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Canvas Assignments</CardTitle>
            <CardDescription>
              Connect your Canvas account to view assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Canvas Not Connected</EmptyTitle>
                <EmptyDescription>
                  You need to connect your Canvas account in settings to view
                  assignments.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild>
                  <Link href="/settings#integrations">Go to Settings</Link>
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedCourse = courses.find(
    (course) => course.canvasId === selectedCourseId
  );

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Canvas Assignments
          </h1>
          <p className="text-muted-foreground">
            View and manage your Canvas assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-[200px] justify-between" variant="outline">
                {selectedCourseId
                  ? (courses.find((c) => c.canvasId === selectedCourseId)
                      ?.name ?? 'Select Course')
                  : 'All Courses'}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setSelectedCourseId(undefined)}>
                All Courses
              </DropdownMenuItem>
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {selectedCourse
                  ? `${selectedCourse.name} Assignments`
                  : 'All Assignments'}
              </CardTitle>
              <CardDescription>
                {isLoadingAssignments
                  ? 'Loading assignments...'
                  : `${assignments.length} assignment(s) found`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIncludeCompleted(!includeCompleted)}
                size="sm"
                variant={includeCompleted ? 'default' : 'outline'}
              >
                {includeCompleted ? 'Hide Completed' : 'Show Completed'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAssignments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : assignments.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>No assignments found</EmptyTitle>
                <EmptyDescription>
                  {selectedCourseId
                    ? 'This course has no assignments'
                    : 'You have no assignments'}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <AssignmentCard
                  assignment={assignment}
                  courses={courses}
                  isImporting={importMutation.isPending}
                  key={assignment.id}
                  onImport={(assignmentId) =>
                    handleImportAsTodos([assignmentId])
                  }
                  selectedCourseId={selectedCourseId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
