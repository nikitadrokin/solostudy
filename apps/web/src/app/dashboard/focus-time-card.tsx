import { Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/trpc/server';

const FocusTimeCard: React.FC = async () => {
  const data = await api.focus.getTodayFocusTime();

  const formatFocusTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">Focus Time</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">
          {formatFocusTime(data?.totalSeconds ?? 0)}
        </div>
        <p className="text-muted-foreground text-xs">Today's total</p>
      </CardContent>
    </Card>
  );
} 

export default FocusTimeCard;
