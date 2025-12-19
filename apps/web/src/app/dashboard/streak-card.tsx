import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/server';

const StreakCard: React.FC = async () => {
  const streakData = await api.account.getStreak();

  const streak = streakData?.streak ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">Streak</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{streak}</div>
        <p className="text-muted-foreground text-xs">Current streak</p>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
