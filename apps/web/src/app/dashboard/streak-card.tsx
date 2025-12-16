'use client';

import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { api } from '@/utils/trpc';

export default function StreakCard() {
  const { data: session } = authClient.useSession();

  const { data: streakData, isLoading } = useQuery(
    api.account.getStreak.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const streak = isLoading ? '...' : (streakData?.streak ?? 0);

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
}
