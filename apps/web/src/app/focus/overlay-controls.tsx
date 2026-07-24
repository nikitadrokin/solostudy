'use client';

import { Clapperboard, LogIn, Settings, User, Wrench } from 'lucide-react';
import Link from 'next/link';
import ControlsPanel from '@/components/focus-room/controls-panel';
import VideoPicker from '@/components/focus-room/video-picker';
import { FocusTimer } from '@/components/focus-timer';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DynamicPopover,
  DynamicPopoverBody,
  DynamicPopoverContent,
  DynamicPopoverTrigger,
} from '@/components/ui/dynamic-popover';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import OverlayDialog from './overlay-dialog';

type OverlayControlsProps = {
  onPopoverOpenChange: (open: boolean) => void;
};

const OverlayControls: React.FC<OverlayControlsProps> = ({
  onPopoverOpenChange,
}) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="absolute top-4 right-4 left-4 z-10">
      <div className="flex items-start justify-between">
        {/* Leading */}
        <div className="flex items-center gap-2">
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

          {session ? (
            <Link
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'bg-background/80 backdrop-blur-sm'
              )}
              href="/settings"
              title="Account settings"
            >
              <User className="size-4" />
            </Link>
          ) : (
            <Link
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'bg-background/80 backdrop-blur-sm'
              )}
              href="/login"
              title="Sign in"
            >
              <LogIn className="size-4" />
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'bg-background/80 backdrop-blur-sm'
                )}
                href="/admin/focus-room-videos"
                title="Manage focus room videos"
              >
                <Wrench className="size-4" />
              </Link>
              <OverlayDialog onPopoverOpenChange={onPopoverOpenChange} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverlayControls;
