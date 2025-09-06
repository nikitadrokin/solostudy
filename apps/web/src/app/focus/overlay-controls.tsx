'use client';
import { Clapperboard, Settings } from 'lucide-react';
import ControlsPanel from '@/components/focus-room/controls-panel';
import VideoPicker from '@/components/focus-room/video-picker';
import TodoList from '@/components/todo-list';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
        </div>

        {/* Trailing */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="bg-background/80 backdrop-blur-sm"
                size="sm"
                title="Focus Room Settings"
                variant="outline"
              >
                <Clapperboard className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 bg-background/80 backdrop-blur-sm"
              side="bottom"
            >
              <VideoPicker />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="bg-background/80 backdrop-blur-sm"
                size="sm"
                title="Focus Room Settings"
                variant="outline"
              >
                <Settings className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 bg-background/80 backdrop-blur-sm"
              side="bottom"
            >
              <ControlsPanel />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default OverlayControls;
