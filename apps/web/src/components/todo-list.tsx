'use client';

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
import { useTodoStore } from '@/lib/todo-store';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

export default function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { tasks, addTask, toggleTask, removeTask } = useTodoStore();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask(newTodo);
      setNewTodo('');
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const badgeCount = totalCount - completedCount;

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          className="relative bg-background/80 backdrop-blur-sm"
          size="sm"
          title="Todo List"
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
      <PopoverContent
        align="start"
        className="w-80 bg-background/80 backdrop-blur-sm"
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
      </PopoverContent>
    </Popover>
  );
}
