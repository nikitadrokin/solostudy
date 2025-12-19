'use client';

import { useQuery } from '@tanstack/react-query';
import TaskList from '@/components/task-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { api } from '@/utils/trpc';

type TaskListProps = {
  className?: string;
};

const DashboardTaskList: React.FC<TaskListProps> = ({ className }) => {
  const { data: session } = authClient.useSession();

  const { data: tasks = [] } = useQuery(
    api.todos.list.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <Card className={className}>
      <CardContent className="px-4">
        <CardTitle>Task List</CardTitle>
        <CardDescription>
          {completedCount} of {totalCount} completed
        </CardDescription>
        <TaskList className="**:data-[task-list-container]:!max-h-[37.75rem] h-[640px]" />
      </CardContent>
    </Card>
  );
};

export default DashboardTaskList;
