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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent align="end" side="bottom">
                Select background
              </TooltipContent>
            </Tooltip>
            <PopoverContent
              align="end"
              className="w-[600px] bg-background/80 py-0 pr-0 pl-1 backdrop-blur-sm"
              side="bottom"
            >
              <VideoPicker />
            </PopoverContent>
          </Popover>

          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>

              <TooltipContent align="end" side="bottom">
                Focus Room Settings
              </TooltipContent>
            </Tooltip>
            <PopoverContent
              align="end"
              className="w-80 bg-background/80 backdrop-blur-sm"
              onOpenAutoFocus={(e) => e.preventDefault()}
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
