'use client';
import { Clapperboard, Settings } from 'lucide-react';
import ControlsPanel from '@/components/focus-room/controls-panel';
import VideoPicker from '@/components/focus-room/video-picker';
import { FocusTimer } from '@/components/focus-timer';
import TodoList from '@/components/todo-list';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
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
import { cn } from '@/lib/utils';
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
          {isMobile ? (
            <Drawer>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DrawerTrigger asChild>
                    <Button
                      className="bg-background/80 backdrop-blur-sm"
                      size="sm"
                      title="Select background"
                      variant="outline"
                    >
                      <Clapperboard className="size-4" />
                    </Button>
                  </DrawerTrigger>
                </TooltipTrigger>
                <TooltipContent align="end" side="bottom">
                  Select background
                </TooltipContent>
              </Tooltip>
              <DrawerContent className="h-[calc(100vh-2.5rem)] overflow-hidden bg-background/95 backdrop-blur-sm">
                <VideoPicker />
              </DrawerContent>
            </Drawer>
          ) : (
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      className="bg-background/80 backdrop-blur-sm"
                      size="sm"
                      title="Select background"
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
                className="flex h-[500px] w-[600px] flex-col overflow-hidden rounded-2xl bg-background/80 p-0 backdrop-blur-sm"
                side="bottom"
              >
                <div
                  className={cn(
                    'relative flex max-h-[500px] flex-col',
                    'before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[var(--gradient-height)] before:bg-gradient-to-b before:from-[var(--gradient-color)] before:to-transparent before:content-[""]',
                    'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-[var(--gradient-height)] after:bg-gradient-to-t after:from-[var(--gradient-color)] after:to-transparent after:content-[""]'
                  )}
                  style={
                    {
                      '--gradient-height': '1rem',
                      '--gradient-color': 'var(--background)',
                    } as React.CSSProperties
                  }
                >
                  <VideoPicker />
                </div>
              </PopoverContent>
            </Popover>
          )}

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
