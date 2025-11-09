'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckSquare, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { trpcClient } from '@/utils/trpc';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export default function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [isOpen, setIsOpen] = useState(false);
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
    mutationFn: (input: { id: string; completed?: boolean; title?: string }) =>
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
  const badgeCount = totalCount - completedCount;

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              className="relative bg-background/80 backdrop-blur-sm"
              size="sm"
              variant="outline"
            >
              <CheckSquare className="h-4 w-4" />
              {totalCount > 0 && (
                <Badge className="-right-1 -top-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {badgeCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent
          align="start"
          className="bg-background/80 backdrop-blur-sm"
          side="bottom"
        >
          View Tasks
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        align="start"
        className="w-80 bg-background/80 backdrop-blur-sm"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        side="bottom"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-sm">Todo List</h3>
              {totalCount > 0 && (
                <p className="text-muted-foreground text-xs">
                  {completedCount} of {totalCount} completed
                </p>
              )}
            </div>
            <Button
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

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

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                No tasks yet. Add one above!
              </p>
            ) : (
              tasks.map((task: Task) => (
                // biome-ignore lint/a11y/useSemanticElements: can't nest button in button
                <div
                  className="group flex items-center gap-2 rounded-md p-2 hover:bg-muted/50"
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleTask(task.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Checkbox
                    checked={task.completed}
                    className="flex-shrink-0"
                    onCheckedChange={() => {
                      handleToggleTask(task.id);
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
                      handleRemoveTask(task.id);
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
      </PopoverContent>
    </Popover>
  );
}
