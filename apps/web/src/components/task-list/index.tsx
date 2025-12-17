'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { api, apiClient } from '@/utils/trpc';
import TaskItem from './task-item';
import TaskItemSkeleton from './task-item-skeleton';
import type { Task } from './types';

type TaskListProps = {
  className?: string;
};

const TaskList: React.FC<TaskListProps> = ({ className }) => {
  const [newTodo, setNewTodo] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const posthog = usePostHog();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery(
    api.todos.list.queryOptions(undefined, {
      enabled: !!session,
    })
  );
  const createMutation = useMutation({
    mutationFn: (input: { title: string }) =>
      apiClient.todos.create.mutate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['todos', 'list']] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: (input: { id: string; completed?: boolean }) =>
      apiClient.todos.update.mutate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['todos', 'list']] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (input: { id: string }) => apiClient.todos.delete.mutate(input),
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
      posthog.capture('task_created', {
        task_length: newTodo.length,
        platform: isMobile ? 'mobile' : 'desktop',
      });
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
      posthog.capture('task_completed', {
        completed: !task.completed,
        task_age_days: Math.floor(
          (Date.now() - new Date(task.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      });
    } catch {
      // Error handling is done by the query client
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    const task = tasks.find((t: Task) => t.id === taskId);
    if (!task) {
      return;
    }
    try {
      await deleteMutation.mutateAsync({ id: taskId });
      posthog.capture('task_deleted', {
        was_completed: task.completed,
        task_age_days: Math.floor(
          (Date.now() - new Date(task.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      });
    } catch {
      // Error handling is done by the query client
    }
  };

  return (
    <div className={cn('mt-4', className)}>
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
          disabled={!newTodo.trim() || createMutation.isPending}
          onClick={handleAddTask}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="-mr-4 space-y-2 overflow-y-auto py-4 pr-4 md:max-h-64"
        data-task-list-container
      >
        {!isMounted || isLoadingTasks ? (
          Array.from({ length: 10 }).map((_, index) => (
            <TaskItemSkeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              key={`task-item-skeleton-${index}`}
            />
          ))
        ) : tasks.length === 0 ? (
          <p className="py-4 text-center text-muted-foreground text-sm">
            No tasks yet. Add one above!
          </p>
        ) : (
          tasks.map((task: Task) => (
            <TaskItem
              handleRemoveTask={handleRemoveTask}
              handleToggleTask={handleToggleTask}
              key={task.id}
              task={task}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
