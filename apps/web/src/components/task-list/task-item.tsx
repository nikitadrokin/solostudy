import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import type { Task } from './types';

type TaskItemProps = {
  task: Task;
  handleToggleTask: (taskId: string) => void;
  handleRemoveTask: (taskId: string) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  handleToggleTask,
  handleRemoveTask,
}) => {
  return (
    // biome-ignore lint/a11y/useSemanticElements: can't nest button in button
    <div
      className="group flex items-start gap-2 rounded-md p-2 hover:bg-muted/50"
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
      <div className="h-[1lh] place-items-center">
        <Checkbox
          checked={task.completed}
          className="flex-shrink-0"
          onCheckedChange={() => {
            handleToggleTask(task.id);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
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
  );
};

export default TaskItem;
