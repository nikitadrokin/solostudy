'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  BookOpen,
  Check,
  ExternalLink,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { trpcClient } from '@/utils/trpc';

const canvasUrl = `${process.env.NEXT_PUBLIC_CANVAS_URL}/api/v1`;

if (!canvasUrl) {
  throw new Error('NEXT_PUBLIC_CANVAS_URL is not set.');
}

const CanvasIntegration: React.FC = () => {
  const queryClient = useQueryClient();
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const { data: status, isLoading: isLoadingStatus } = useQuery({
    queryKey: [['canvas', 'getStatus']],
    queryFn: () => trpcClient.canvas.getStatus.query(),
  });

  const { data: courses = [] } = useQuery({
    queryKey: [['canvas', 'getCourses']],
    queryFn: () => trpcClient.canvas.getCourses.query(),
    enabled: status?.connected === true,
  });

  const connectMutation = useMutation({
    mutationFn: (input: { accessToken: string; canvasUrl: string }) =>
      trpcClient.canvas.connect.mutate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['canvas']] });
      setIsConnectDialogOpen(false);
      setAccessToken('');
      toast.success('Canvas connected successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to connect to Canvas');
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => trpcClient.canvas.disconnect.mutate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['canvas']] });
      setIsDisconnectDialogOpen(false);
      toast.success('Canvas disconnected');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to disconnect Canvas');
    },
  });

  const syncMutation = useMutation({
    mutationFn: () => trpcClient.canvas.sync.mutate(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [['canvas']] });
      toast.success(
        `Found ${data.coursesFound} courses and ${data.assignmentsFound} assignments`
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to sync Canvas data');
    },
  });

  const handleConnect = () => {
    const tokenTrimmed = accessToken.trim();
    const hasToken = Boolean(tokenTrimmed);

    if (!hasToken) {
      toast.error('Please provide your Canvas access token');
      return;
    }

    connectMutation.mutate({
      canvasUrl,
      accessToken: tokenTrimmed,
    });
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  const handleSync = () => {
    syncMutation.mutate();
  };

  if (isLoadingStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Canvas Integration</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Canvas Integration</CardTitle>
        <CardDescription>
          Connect your Canvas LMS account to automatically import assignments
          and track your study progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status?.connected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Canvas Integration</p>
                  <p className="text-muted-foreground text-xs">
                    {status.connected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  disabled={syncMutation.isPending}
                  onClick={handleSync}
                  size="sm"
                  variant="outline"
                >
                  {syncMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Sync
                </Button>
                <Button
                  onClick={() => setIsDisconnectDialogOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            </div>

            {courses.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Synced Courses</p>
                <div className="space-y-1">
                  {courses.slice(0, 5).map((course) => (
                    <div
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                      key={course.id}
                    >
                      <span>{course.name}</span>
                      {course.courseCode && (
                        <span className="text-muted-foreground text-xs">
                          {course.courseCode}
                        </span>
                      )}
                    </div>
                  ))}
                  {courses.length > 5 && (
                    <p className="text-muted-foreground text-xs">
                      +{courses.length - 5} more courses
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Connect your Canvas account to automatically sync assignments and
              courses. You'll need a personal access token from your Canvas
              instance.
            </p>
            <Dialog
              onOpenChange={setIsConnectDialogOpen}
              open={isConnectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Connect Canvas</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Canvas</DialogTitle>
                  <DialogDescription>
                    Enter your Canvas personal access token.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="mt-6">
                  <Field>
                    <FieldLabel htmlFor="canvas-url">Canvas URL</FieldLabel>
                    <Input
                      disabled
                      id="canvas-url"
                      readOnly
                      value={canvasUrl}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="access-token">
                      Personal Access Token
                    </FieldLabel>
                    <Input
                      id="access-token"
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="Enter your Canvas access token"
                      type="password"
                      value={accessToken}
                    />
                    <FieldDescription>
                      Generate a personal access token in Canvas: Account →
                      Settings → New Access Token
                      <Button
                        asChild
                        className="ml-2 h-auto p-0 text-xs"
                        variant="link"
                      >
                        <a
                          href="https://community.canvaslms.com/t5/Canvas-Basics-Guide/How-do-I-manage-API-access-tokens-as-a-student/ta-p/273823"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Learn more
                          <ExternalLink className="ml-1 inline h-3 w-3" />
                        </a>
                      </Button>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
                <Alert variant="destructive">
                  <AlertTriangle />
                  <AlertTitle>Terms of Service Warning</AlertTitle>
                  <AlertDescription>
                    This integration may violate Canvas Terms of Service. Use at
                    your own personal risk.
                  </AlertDescription>
                </Alert>
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    disabled={connectMutation.isPending}
                    onClick={() => setIsConnectDialogOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={connectMutation.isPending || !accessToken.trim()}
                    isLoading={connectMutation.isPending}
                    onClick={handleConnect}
                  >
                    Connect
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
      {status?.connected && (
        <CardFooter>
          <div className="w-full space-y-2">
            <Separator />
            <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">What you can do:</p>
                <ul className="list-inside list-disc space-y-0.5 text-muted-foreground text-xs">
                  <li>Automatically import Canvas assignments as tasks</li>
                  <li>Track study time per course</li>
                  <li>Get deadline reminders</li>
                  <li>View assignment analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </CardFooter>
      )}
      <Dialog
        onOpenChange={setIsDisconnectDialogOpen}
        open={isDisconnectDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Canvas</DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect your Canvas account? This will
              remove all synced courses and assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              disabled={disconnectMutation.isPending}
              onClick={() => setIsDisconnectDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={disconnectMutation.isPending}
              isLoading={disconnectMutation.isPending}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CanvasIntegration;
