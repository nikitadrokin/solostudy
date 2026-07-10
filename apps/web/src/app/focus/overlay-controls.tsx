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
import {
  DynamicPopover,
  DynamicPopoverBody,
  DynamicPopoverContent,
  DynamicPopoverDescription,
  DynamicPopoverHeader,
  DynamicPopoverTitle,
  DynamicPopoverTrigger,
} from '@/components/ui/dynamic-popover';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { api } from '@/utils/trpc';
import OverlayDialog from './overlay-dialog';
import SidebarTrigger from './sidebar-trigger';

type OverlayControlsProps = {
  onPopoverOpenChange: (open: boolean) => void;
};

const OverlayControls: React.FC<OverlayControlsProps> = ({
  onPopoverOpenChange,
}) => {
  const { data: session } = useSession();

  const { data: uncompletedTasks } = useQuery(
    api.todos.getUncompletedCount.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const { data: tasks = [] } = useQuery(
    api.todos.list.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="absolute top-4 right-4 left-4 z-10">
      <div className="flex items-start justify-between">
        {/* Leading */}
        <div className="flex items-center gap-2">
          <SidebarTrigger
            className="bg-background/80 backdrop-blur-sm"
            variant="outline"
          />

          <DynamicPopover onOpenChange={onPopoverOpenChange}>
            <DynamicPopoverTrigger
              render={
                <Button
                  className="!pr-[9px] !pl-[11px] bg-background/80 backdrop-blur-sm"
                  size="sm"
                  variant="outline"
                />
              }
              tooltip="View Tasks"
            >
              <ListCheck className="size-4" />
              {!!uncompletedTasks && (
                <Badge className="-right-1 -top-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs shadow-sm">
                  {uncompletedTasks}
                </Badge>
              )}
            </DynamicPopoverTrigger>
            <DynamicPopoverContent
              align="start"
              className={cn(session ? 'md:w-96' : 'md:min-w-fit')}
              side="bottom"
              title={session ? undefined : 'Tasks'}
            >
              {session ? (
                <>
                  <DynamicPopoverHeader>
                    <DynamicPopoverTitle>Task List</DynamicPopoverTitle>
                    <DynamicPopoverDescription>
                      {completedCount} of {totalCount} completed
                    </DynamicPopoverDescription>
                  </DynamicPopoverHeader>
                  <DynamicPopoverBody viewportClassName="px-4">
                    <TaskList />
                  </DynamicPopoverBody>
                </>
              ) : (
                <SignedOutTaskContent />
              )}
            </DynamicPopoverContent>
          </DynamicPopover>

          <FocusTimer onOpenChange={onPopoverOpenChange} />
        </div>

        {/* Trailing */}
        <div className="flex items-center gap-2">
          <DynamicPopover onOpenChange={onPopoverOpenChange}>
            <DynamicPopoverTrigger
              render={
                <Button
                  className="bg-background/80 backdrop-blur-sm"
                  size="sm"
                  variant="outline"
                />
              }
              tooltip="Select background"
            >
              <Clapperboard className="size-4" />
            </DynamicPopoverTrigger>
            <DynamicPopoverContent
              align="end"
              className="md:h-[500px] md:max-h-none md:min-h-full md:w-[600px]"
              side="bottom"
              title="Select background"
            >
              <VideoPicker />
            </DynamicPopoverContent>
          </DynamicPopover>

          <DynamicPopover onOpenChange={onPopoverOpenChange}>
            <DynamicPopoverTrigger
              render={
                <Button
                  className="bg-background/80 backdrop-blur-sm"
                  size="sm"
                  title="Focus Room Settings"
                  variant="outline"
                />
              }
              tooltip="Focus Room Settings"
            >
              <Settings className="size-4" />
            </DynamicPopoverTrigger>
            <DynamicPopoverContent
              align="end"
              className="md:w-96"
              side="bottom"
              title="Focus Room Settings"
            >
              <DynamicPopoverBody viewportClassName="px-4 md:pt-4">
                <ControlsPanel />
              </DynamicPopoverBody>
            </DynamicPopoverContent>
          </DynamicPopover>

          {isAdmin && (
            <OverlayDialog onPopoverOpenChange={onPopoverOpenChange} />
          )}
        </div>
      </div>
    </div>
  );
};

const SignedOutTaskContent: React.FC = () => (
  <div className="flex flex-col items-start justify-center gap-4 p-4 pt-12 md:p-6">
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
