'use client';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useState } from 'react';
import { extractVideoId } from '@/components/focus-room/youtube-player';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useFocusStore } from '@/stores/focus-store';
import { useVideoStore } from '@/stores/video-store';

// YouTube URL validation patterns
const YOUTUBE_VALIDATION_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
];

export default function ControlsPanel() {
  // Get state and actions from stores
  const { videoId, volume, isMuted } = useFocusStore();
  const {
    isVideoLoaded,
    videoError,
    isPlaying, // Move this here
    handleVideoIdChange,
    handleLoadVideo,
    handlePlayPause,
    handleVolumeChange,
    handleMuteToggle,
  } = useVideoStore();

  const [urlInput, setUrlInput] = useState(videoId);

  const handleUrlSubmit = useCallback(() => {
    // Extract video ID from URL if needed, otherwise use as-is (already an ID)
    const extractedId = extractVideoId(urlInput) || urlInput;
    handleVideoIdChange(extractedId);
    handleLoadVideo();
  }, [urlInput, handleVideoIdChange, handleLoadVideo]);

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
            className={cn(
              'flex-1',
              urlInput && !isValidYouTubeUrl(urlInput)
                ? 'border-destructive'
                : ''
            )}
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
          onClick={handlePlayPause}
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
            onClick={handleMuteToggle}
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
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            type="range"
            value={isMuted ? 0 : volume}
          />
        </div>
      </div>
    </div>
  );
}
