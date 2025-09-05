'use client';
import { Clapperboard, Settings, Video } from 'lucide-react';
import ControlsPanel from '@/components/focus-room/controls-panel';
import VideoPicker from '@/components/focus-room/video-picker';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type OverlayControlsProps = {
  isMuted: boolean;
  isPlaying: boolean;
  isVideoLoaded: boolean;
  onLoadVideo: () => void;
  onMuteToggle: () => void;
  onPlayPause: () => void;
  onVideoUrlChange: (url: string) => void;
  onVolumeChange: (volume: number) => void;
  videoError: string | undefined;
  videoUrl: string;
  volume: number;
};

const OverlayControls: React.FC<OverlayControlsProps> = ({
  isMuted,
  isPlaying,
  isVideoLoaded,
  onLoadVideo,
  onMuteToggle,
  onVolumeChange,
  onPlayPause,
  onVideoUrlChange,
  videoError,
  videoUrl,
  volume,
}) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="flex items-start justify-between">
        {/* Quick Actions */}
        <div className="ml-auto flex gap-2">
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
              <ControlsPanel
                isMuted={isMuted}
                isPlaying={isPlaying}
                isVideoLoaded={isVideoLoaded}
                onLoadVideo={onLoadVideo}
                onMuteToggle={onMuteToggle}
                onPlayPause={onPlayPause}
                onVideoUrlChange={onVideoUrlChange}
                onVolumeChange={onVolumeChange}
                videoError={videoError}
                videoUrl={videoUrl}
                volume={volume}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default OverlayControls;
