'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  Trash2,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import ScrollArea from '@/components/ui/scroll-area';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { trpcClient } from '@/utils/trpc';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: infinite rerender
  useEffect(() => {
    if (!(session || isPending)) {
      router.push('/login');
    }
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            {getGreeting()}, {session.user.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Ready to get back in the zone?
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (Main Actions) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Focus Room Banner */}
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-lg">
            <div className="-mt-16 -mr-16 absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="-mb-16 -ml-16 absolute bottom-0 left-0 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

            <CardContent className="relative flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl">Focus Room</CardTitle>
                <CardDescription className="max-w-md text-base text-primary-foreground/80">
                  Enter your distraction-free environment with ambient sounds
                  and video backgrounds.
                </CardDescription>
              </div>
              <Button
                asChild
                className="shrink-0 shadow-sm"
                size="lg"
                variant="secondary"
              >
                <Link className="gap-2" href="/focus">
                  Enter Focus Room <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Focus Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">0h 0m</div>
                <p className="text-muted-foreground text-xs">Today's total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  Tasks Done
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">0</div>
                <p className="text-muted-foreground text-xs">Completed today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">Streak</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">0</div>
                <p className="text-muted-foreground text-xs">Current streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Placeholder */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>
                Your focus trends over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed bg-muted/50">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Badge variant="outline">Coming Soon</Badge>
                  <span className="text-sm">
                    Detailed analytics are on the way
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6 lg:col-span-4">
          <TaskListCard />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button
                className="w-full justify-start"
                disabled
                variant="outline"
              >
                View Study History
              </Button>
              <Button
                className="w-full justify-start"
                disabled
                variant="outline"
              >
                Manage Goals
              </Button>
              <Button
                asChild
                className="w-full justify-start"
                variant="outline"
              >
                <Link href="/settings">Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TaskListCard() {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const { data: tasks = [] } = useQuery({
    queryKey: [['todos', 'list']],
    queryFn: () => trpcClient.todos.list.query(),
    enabled: !!session,
  });
  const createMutation = useMutation({
    mutationFn: (input: { title: string }) =>
      trpcClient.todos.create.mutate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['todos', 'list']] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: (input: { id: string; completed?: boolean }) =>
      trpcClient.todos.update.mutate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['todos', 'list']] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (input: { id: string }) =>
      trpcClient.todos.delete.mutate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['todos', 'list']] });
    },
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleAddTask = async () => {
    if (!newTodo.trim()) {
      return;
    }
    try {
      await createMutation.mutateAsync({ title: newTodo });
      setNewTodo('');
    } catch {
      // Error handling is done by the query client
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t: Task) => t.id === taskId);
    if (!task) {
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: taskId,
        completed: !task.completed,
      });
    } catch {
      // Error handling is done by the query client
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      await deleteMutation.mutateAsync({ id: taskId });
    } catch {
      // Error handling is done by the query client
    }
  };

  const completedCount = tasks.filter((task: Task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <Card className="flex h-[400px] flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Tasks</CardTitle>
          <Badge className="font-normal" variant="secondary">
            {completedCount}/{totalCount} Done
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div className="flex gap-2">
          <Input
            className="h-9"
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            value={newTodo}
          />
          <Button
            className="h-9 w-9 shrink-0"
            disabled={!newTodo.trim() || createMutation.isPending}
            onClick={handleAddTask}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground text-sm">
                <p>No tasks yet</p>
                <p className="text-xs">Add one to get started!</p>
              </div>
            ) : (
              tasks.map((task: Task) => (
                <div
                  className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                  key={task.id}
                >
                  <Checkbox
                    checked={task.completed}
                    className="rounded-full"
                    onCheckedChange={() => handleToggleTask(task.id)}
                  />
                  <span
                    className={cn(
                      'flex-1 truncate text-sm transition-all',
                      task.completed
                        ? 'text-muted-foreground line-through'
                        : 'font-medium'
                    )}
                  >
                    {task.title}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreVertical className="h-3 w-3" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
