import { Calendar } from 'lucide-react';
import { headers } from 'next/headers';
import { AnalyticsTabs } from '@/components/analytics/analytics-tabs';
import { AuthOverlay } from '@/components/auth-overlay';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import FocusTimeCard from './focus-time-card';
import StreakCard from './streak-card';
import DashboardTaskList from './task-list';

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const name =
    session?.user.name?.split(' ')[0] ||
    session?.user.email?.split('@')[0] ||
    'there';

  return (
    <AuthOverlay>
      <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="font-bold text-3xl tracking-tight">{name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <FocusTimeCard />
              <StreakCard />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Your activity over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsTabs />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <DashboardTaskList className="flex flex-col pb-0" />
          </div>
        </div>
      </div>
    </AuthOverlay>
  );
}
