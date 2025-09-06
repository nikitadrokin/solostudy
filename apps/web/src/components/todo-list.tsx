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

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

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
            <span className="-right-1 -top-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {totalCount}
            </span>
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
              onClick={addTodo}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {todos.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground text-sm">
                No tasks yet. Add one above!
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  className="group flex items-center gap-2 rounded-md p-2 hover:bg-muted/50"
                  key={todo.id}
                >
                  <Checkbox
                    checked={todo.completed}
                    className="flex-shrink-0"
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <Button
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => deleteTodo(todo.id)}
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
