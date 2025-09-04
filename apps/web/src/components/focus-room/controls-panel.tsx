'use client';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// YouTube URL validation patterns
const YOUTUBE_VALIDATION_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
];

interface ControlsPanelProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  onLoadVideo: () => void;
  isVideoLoaded: boolean;
  videoError?: string;
}

export default function ControlsPanel({
  videoUrl,
  onVideoUrlChange,
  isPlaying,
  onPlayPause,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
  onLoadVideo,
  isVideoLoaded,
  videoError,
}: ControlsPanelProps) {
  const [urlInput, setUrlInput] = useState(videoUrl);

  const handleUrlSubmit = useCallback(() => {
    onVideoUrlChange(urlInput);
    onLoadVideo();
  }, [urlInput, onVideoUrlChange, onLoadVideo]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleUrlSubmit();
      }
    },
    [handleUrlSubmit]
  );

  const isValidYouTubeUrl = useCallback((url: string): boolean => {
    return YOUTUBE_VALIDATION_PATTERNS.some((pattern) => pattern.test(url));
  }, []);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Focus Room Controls</h3>
        <p className="text-muted-foreground text-sm">
          Configure your video background
        </p>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="youtube-url">YouTube URL</Label>
        <div className="flex gap-2">
          <Input
            className={`flex-1 ${
              urlInput && !isValidYouTubeUrl(urlInput)
                ? 'border-destructive'
                : ''
            }`}
            id="youtube-url"
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://youtube.com/watch?v=..."
            type="url"
            value={urlInput}
          />
          <Button
            disabled={!(urlInput && isValidYouTubeUrl(urlInput))}
            onClick={handleUrlSubmit}
            size="default"
          >
            Load
          </Button>
        </div>

        {/* URL Validation Error */}
        {urlInput && !isValidYouTubeUrl(urlInput) && (
          <p className="text-destructive text-sm">
            Please enter a valid YouTube URL
          </p>
        )}

        {/* Video Error */}
        {videoError && <p className="text-destructive text-sm">{videoError}</p>}
      </div>

      {/* Playback Controls */}
      <div className="flex gap-2">
        <Button
          className="flex items-center gap-2"
          onClick={onPlayPause}
          size="sm"
          variant="outline"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          )}
        </Button>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="video-volume">Volume</Label>
          <span className="text-muted-foreground text-sm">
            {isMuted ? 'Muted' : `${volume}%`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="shrink-0"
            onClick={onMuteToggle}
            size="sm"
            variant="outline"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <input
            className="flex-1"
            disabled={!isVideoLoaded}
            id="video-volume"
            max="100"
            min="0"
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            type="range"
            value={isMuted ? 0 : volume}
          />
        </div>
      </div>
    </div>
  );
}
