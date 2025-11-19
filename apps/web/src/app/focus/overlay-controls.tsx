'use client';
import { useQuery } from '@tanstack/react-query';
import { Clapperboard, ListCheck, LogIn, Settings } from 'lucide-react';
import Link from 'next/link';
import ControlsPanel from '@/components/focus-room/controls-panel';
import VideoPicker from '@/components/focus-room/video-picker';
import { FocusTimer } from '@/components/focus-timer';
import TaskList from '@/components/task-list';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import DynamicPopover from '@/components/ui/dynamic-popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import SidebarTrigger from './sidebar-trigger';

const OverlayControls: React.FC = () => {
  const isMobile = useIsMobile();
  const { data: session } = useSession();

  const { data: uncompletedTasks } = useQuery(
    trpc.todos.getUncompletedCount.queryOptions()
  );

  return (
    <div className="absolute top-4 right-4 left-4 z-10">
      <div className="flex items-start justify-between">
        {/* Leading */}
        <div className="flex items-center gap-2">
          {isMobile && (
            <SidebarTrigger
              className="bg-background/80 backdrop-blur-sm"
              variant="outline"
            />
          )}

          <DynamicPopover
            align="start"
            className={cn(session ? 'md:w-96 md:pb-0' : 'md:min-w-fit md:p-6')}
            side="bottom"
            tooltip="View Tasks"
            trigger={
              <Button
                className="!pr-[9px] !pl-[11px] bg-background/80 backdrop-blur-sm"
                size="sm"
                variant="outline"
              >
                <ListCheck className="size-4" />
                {!!uncompletedTasks && (
                  <Badge className="-right-1 -top-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs shadow-sm">
                    {uncompletedTasks}
                  </Badge>
                )}
              </Button>
            }
          >
            {session ? <TaskList className="" /> : <SignedOutTaskContent />}
          </DynamicPopover>

          <FocusTimer />
        </div>

        {/* Trailing */}
        <div className="flex items-center gap-2">
          <DynamicPopover
            align="end"
            className="p-0 md:h-[500px] md:w-[600px]"
            showScrollFadeOnPopover
            side="bottom"
            tooltip="Select background"
            trigger={
              <Button
                className="bg-background/80 backdrop-blur-sm"
                size="sm"
                variant="outline"
              >
                <Clapperboard className="size-4" />
              </Button>
            }
          >
            <VideoPicker />
          </DynamicPopover>

          <DynamicPopover
            align="end"
            className="md:w-80"
            side="bottom"
            tooltip="Focus Room Settings"
            trigger={
              <Button
                className="bg-background/80 backdrop-blur-sm"
                size="sm"
                title="Focus Room Settings"
                variant="outline"
              >
                <Settings className="size-4" />
              </Button>
            }
          >
            <ControlsPanel />
          </DynamicPopover>
        </div>
      </div>
    </div>
  );
};

const SignedOutTaskContent: React.FC = () => (
  <div className="flex flex-col items-start justify-center gap-4">
    <ListCheck className="size-8 text-muted-foreground" />
    <p className="text-muted-foreground text-sm">
      Sign in to view and manage your tasks!
    </p>

    <Link className={buttonVariants()} href="/login">
      <LogIn className="size-4" />
      Sign in
    </Link>
  </div>
);

export default OverlayControls;
