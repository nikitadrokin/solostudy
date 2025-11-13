'use client';
import { Clapperboard, Settings } from 'lucide-react';
import ControlsPanel from '@/components/focus-room/controls-panel';
import VideoPicker from '@/components/focus-room/video-picker';
import { FocusTimer } from '@/components/focus-timer';
import TodoList from '@/components/todo-list';
import { Button } from '@/components/ui/button';
import DynamicPopover from '@/components/ui/dynamic-popover';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarTrigger from './sidebar-trigger';

const OverlayControls: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="absolute top-2 right-2 left-2 z-10">
      <div className="flex items-start justify-between">
        {/* Leading */}
        <div className="flex gap-2">
          {isMobile && (
            <SidebarTrigger
              className="bg-background/80 backdrop-blur-sm"
              variant="outline"
            />
          )}

          <TodoList />
          <FocusTimer />
        </div>

        {/* Trailing */}
        <div className="flex gap-2">
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

export default OverlayControls;
