import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CompletedTasksCardProps = {
  completedTasks: number;
};

const CompletedTasksCard: React.FC<CompletedTasksCardProps> = ({
  completedTasks,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">Tasks Done</CardTitle>
        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{completedTasks}</div>
        <p className="text-muted-foreground text-xs">Completed today</p>
      </CardContent>
    </Card>
  );
};

export default CompletedTasksCard;
