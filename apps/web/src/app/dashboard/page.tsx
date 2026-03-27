import { ArrowRight, Calendar } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { AnalyticsTabs } from '@/components/analytics/analytics-tabs';
import { AuthOverlay } from '@/components/auth-overlay';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import CompletedTasksCard from './completed-tasks';
import FocusTimeCard from './focus-time-card';
import StreakCard from './streak-card';
import DashboardTaskList from './task-list';
export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  };

  const name =
    session?.user.name?.split(' ')[0] ||
    session?.user.email?.split('@')[0] ||
    'there';

  return (
    <AuthOverlay>
      <div className="container mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              {getGreeting()}, {name}
            </h1>
            <p className="text-muted-foreground">
              Ready to get back in the zone?
            </p>
          </div>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column (Main Actions) */}
          <div className="space-y-6 lg:col-span-8">
            {/* Focus Room Banner */}
            <Card className="overflow-hidden border shadow-sm pb-0">
              <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-2xl">Focus Room</CardTitle>
                <CardDescription className="max-w-lg text-sm">
                  Enter your distraction-free environment with ambient sounds and
                  video backgrounds.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 border-t bg-muted/50 pb-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-sm">
                  Start a deep-focus session in one click.
                </p>
                <Link
                  className={buttonVariants({
                    className: 'shrink-0 gap-2',
                    size: 'default',
                  })}
                  href="/focus"
                >
                  Open Focus Room <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FocusTimeCard />
              <CompletedTasksCard completedTasks={0} />
              <StreakCard />
            </div>

            {/* Analytics */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Your activity trends over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsTabs />
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6 lg:col-span-4">
            <DashboardTaskList className="flex flex-col pb-0" />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button
                  className="w-full justify-start"
                  disabled
                  variant="outline"
                >
                  View Study History
                </Button>
                <Button
                  className="w-full justify-start"
                  disabled
                  variant="outline"
                >
                  Manage Goals
                </Button>

                <Link
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full justify-start',
                  })}
                  href="/settings"
                >
                  Settings
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthOverlay>
  );
}
