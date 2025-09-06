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

const OverlayControls: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 left-4 z-10">
      <div className="flex items-start justify-between">
        {/* Todo List */}
        <div className="flex gap-2">
          <TodoList />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="bg-background/80 backdrop-blur-sm"
                size="sm"
                title="Focus Room Settings"
                variant="outline"
              >
                <Clapperboard className="h-4 w-4" />
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
                <Settings className="h-4 w-4" />
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
