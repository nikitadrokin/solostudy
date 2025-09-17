'use client';
import { Plus, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useTodoStore } from '@/stores/todo-store';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: infinite rerender
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="font-bold text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Focus Room Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              Focus Room
            </CardTitle>
            <CardDescription>
              Enter your personalized study environment with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/focus">
              <Button className="w-full" size="lg">
                Start Focus Session
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Study Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              Today's Progress <Badge variant="secondary">coming soon</Badge>
            </CardTitle>
            <CardDescription>Your study time and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Focus Time:
                </span>
                <span className="font-medium">0h 0m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Sessions:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Streak:</span>
                <span className="font-medium">0 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              Quick Actions <Badge variant="secondary">coming soon</Badge>
            </CardTitle>
            <CardDescription>Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" disabled variant="outline">
              View Study History
            </Button>
            <Button className="w-full justify-start" disabled variant="outline">
              Set Study Goals
            </Button>
            <Link href="/settings">
              <Button className="w-full justify-start" variant="outline">
                Preferences
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Preview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Task List */}
        <TaskListCard />

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Insights and detailed progress tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="font-medium text-muted-foreground">Coming Soon</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Detailed analytics and insights will be available here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TaskListCard() {
  const [newTodo, setNewTodo] = useState('');

  const { tasks, addTask, toggleTask, removeTask } = useTodoStore();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask(newTodo);
      setNewTodo('');
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
        <CardDescription>
          {completedCount} of {totalCount} completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              className="flex-1"
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a task..."
              value={newTodo}
            />
            <Button
              className="h-9 w-9"
              disabled={!newTodo.trim()}
              onClick={() => addTask(newTodo)}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                No tasks yet. Add one above!
              </p>
            ) : (
              tasks.map((task) => (
                // biome-ignore lint/a11y/useSemanticElements: can't nest button in button
                <div
                  className="group flex items-center gap-2 rounded-md p-2 hover:bg-muted/50"
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleTask(task.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Checkbox
                    checked={task.completed}
                    className="flex-shrink-0"
                    onCheckedChange={() => {
                      toggleTask(task.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span
                    className={cn(
                      'flex-1 select-none text-sm',
                      task.completed
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    )}
                  >
                    {task.title}
                  </span>
                  <Button
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTask(task.id);
                    }}
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
