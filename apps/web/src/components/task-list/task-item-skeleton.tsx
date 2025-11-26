import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

type TaskItemSkeletonProps = {
  className?: string;
};

const TaskItemSkeleton: React.FC<TaskItemSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('flex items-start gap-2 rounded-md p-2', className)}>
      <div className="h-[1lh] place-items-center">
        <Skeleton className="h-4 w-4 flex-shrink-0" />
      </div>
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-6 w-6 flex-shrink-0" />
    </div>
  );
};

export default TaskItemSkeleton;
