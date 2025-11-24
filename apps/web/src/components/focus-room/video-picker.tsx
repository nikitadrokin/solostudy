/** biome-ignore-all lint/suspicious/noArrayIndexKey: Skeletons need unique keys */
import { useQuery } from '@tanstack/react-query';
import { memo, useCallback, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { YOUTUBE_VALIDATION_PATTERNS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useFocusStore } from '@/stores/focus-store';
import { useVideoStore } from '@/stores/video-store';
import { trpc } from '@/utils/trpc';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { extractVideoId } from './youtube-player';

const VideoPicker: React.FC = () => {
  const { handleVideoIdChange, handleLoadVideo } = useVideoStore();
  const { videoId } = useFocusStore();
  const isMobile = useIsMobile();
  const { data: videos = [], isLoading } = useQuery(
    trpc.focus.listVideos.queryOptions()
  );

  const [urlInput, setUrlInput] = useState(
    `https://www.youtube.com/watch?v=${videoId}`
  );

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

  const handleVideoSelect = (id: string) => {
    handleVideoIdChange(id);
    handleLoadVideo();
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 overflow-hidden',
          isMobile ? 'h-full min-w-full flex-1 px-2' : 'h-full py-2 pr-4 pl-2'
        )}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            className="cursor-pointer rounded-lg p-2 text-left hover:bg-muted/50"
            key={`video-picker-skeleton-${index}`}
          >
            <AspectRatio
              className="select-none overflow-hidden rounded"
              ratio={16 / 9}
            >
              <Skeleton className="size-full" />
            </AspectRatio>
            <div className="mt-2 truncate font-medium text-xs">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 overflow-y-auto',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-[73.5px] before:z-10 before:h-5 before:bg-gradient-to-b before:from-background/80 before:to-transparent before:content-[""]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-5 after:bg-gradient-to-t after:from-background/80 after:to-transparent after:content-[""]',
        isMobile
          ? 'h-full min-w-full flex-1 px-2 pt-24 before:top-[106px]'
          : 'h-full pt-24 pr-4 pb-2 pl-2'
      )}
    >
      <div
        className={cn(
          'absolute top-0 right-0 left-0 z-10 space-y-2 bg-background/80',
          isMobile ? 'px-2 pt-12' : 'pt-4 pr-6 pl-4'
        )}
      >
        <Label htmlFor="video-picker-url">Custom Video URL</Label>
        <div className="flex gap-2">
          <Input
            className={cn(
              'flex-1',
              urlInput && !isValidYouTubeUrl(urlInput)
                ? 'border-destructive'
                : ''
            )}
            id="video-picker-url"
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
      </div>

      {videos.map((video) => (
        <button
          className="cursor-pointer rounded-lg p-2 text-left hover:bg-muted/50"
          key={video.id}
          onClick={() => handleVideoSelect(video.id)}
          title={video.title}
          type="button"
        >
          <AspectRatio
            className="select-none overflow-hidden rounded"
            ratio={16 / 9}
          >
            {/** biome-ignore lint/performance/noImgElement: saving on vercel bandwidth */}
            <img
              alt={`${video.title} thumbnail`}
              className="h-full w-full object-cover"
              draggable={false}
              loading="lazy"
              src={getThumbnailUrl(video.id)}
            />
          </AspectRatio>
          <div className="mt-2 truncate font-medium text-xs">{video.title}</div>
        </button>
      ))}
    </div>
  );
};

function getThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export default memo(VideoPicker);
