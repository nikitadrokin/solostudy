/** biome-ignore-all lint/suspicious/noArrayIndexKey: Skeletons need unique keys */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  DynamicPopoverBody,
  DynamicPopoverHeader,
} from '@/components/ui/dynamic-popover';
import { authClient } from '@/lib/auth-client';
import { YOUTUBE_VALIDATION_PATTERNS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useFocusStore } from '@/stores/focus-store';
import { useVideoStore } from '@/stores/video-store';
import { api, apiClient } from '@/utils/trpc';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { extractVideoId } from './youtube-player';

const ALL_TAGS = 'all' as const;

const VideoPicker: React.FC = () => {
  const { handleVideoIdChange, handleLoadVideo } = useVideoStore();
  const { videoId } = useFocusStore();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === 'admin';
  const queryClient = useQueryClient();
  const { data: videos = [], isLoading } = useQuery(
    api.focus.listVideos.queryOptions()
  );
  const { data: focusTags = [] } = useQuery(
    api.focus.listFocusTags.queryOptions()
  );

  const [urlInput, setUrlInput] = useState(
    `https://www.youtube.com/watch?v=${videoId}`
  );
  const [activeTag, setActiveTag] = useState<string>(ALL_TAGS);

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

  useEffect(() => {
    if (videoId) {
      setUrlInput(`https://www.youtube.com/watch?v=${videoId}`);
    }
  }, [videoId]);

  useEffect(() => {
    if (
      activeTag !== ALL_TAGS &&
      !focusTags.some((t) => t.slug === activeTag)
    ) {
      setActiveTag(ALL_TAGS);
    }
  }, [activeTag, focusTags]);

  // Derive the current video ID from the URL input
  const currentInputVideoId = useMemo(() => {
    if (!(urlInput && isValidYouTubeUrl(urlInput))) return null;
    return extractVideoId(urlInput) || urlInput;
  }, [urlInput, isValidYouTubeUrl]);

  // Check if the current input video already exists in the focus room
  const videoExistsInFocusRoom = useMemo(() => {
    if (!currentInputVideoId) return false;
    return videos.some((v) => v.id === currentInputVideoId);
  }, [currentInputVideoId, videos]);

  const { mutate: addVideo, isPending: isAddingVideo } = useMutation({
    mutationFn: (targetVideoId: string) =>
      apiClient.focus.addVideo.mutate({ videoId: targetVideoId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: api.focus.listVideos.queryKey(),
      });
    },
  });

  const handleAddToFocusRoom = useCallback(() => {
    if (currentInputVideoId && !videoExistsInFocusRoom) {
      addVideo(currentInputVideoId);
    }
  }, [currentInputVideoId, videoExistsInFocusRoom, addVideo]);

  const filteredVideos = useMemo(() => {
    if (activeTag === ALL_TAGS) {
      return videos;
    }
    return videos.filter((v) => v.tag === activeTag);
  }, [videos, activeTag]);

  const filterChips = useMemo(() => {
    return [
      { key: ALL_TAGS, label: 'All' },
      ...focusTags.map((t) => ({ key: t.slug, label: t.label })),
    ];
  }, [focusTags]);

  const handleVideoSelect = (id: string) => {
    handleVideoIdChange(id);
    handleLoadVideo();
    setUrlInput(`https://www.youtube.com/watch?v=${id}`);
  };

  if (isLoading) {
    return (
      <DynamicPopoverBody viewportClassName="px-2 md:pr-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
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
      </DynamicPopoverBody>
    );
  }

  return (
    <>
      <DynamicPopoverHeader className="gap-2 px-2 md:px-4 md:pr-6">
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {filterChips.map((chip) => (
            <Badge
              className={cn(
                'shrink-0 cursor-pointer select-none rounded-full px-2.5 py-0.5 text-xs backdrop-blur-xs transition-colors',
                activeTag === chip.key
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              key={chip.key}
              onClick={() => setActiveTag(chip.key)}
              variant="outline"
            >
              {chip.label}
            </Badge>
          ))}
        </div>
        <Label htmlFor="video-picker-url">Custom Video URL</Label>
        <div className="flex gap-2">
          <Input
            className={cn(
              '!h-8 flex-1',
              urlInput && !isValidYouTubeUrl(urlInput)
                ? 'border-destructive'
                : ''
            )}
            id="video-picker-url"
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
            type="url"
            value={urlInput}
          />
          <Button
            disabled={!(urlInput && isValidYouTubeUrl(urlInput))}
            onClick={handleUrlSubmit}
            size="sm"
          >
            Load
          </Button>
          {isAdmin && (
            <Button
              disabled={
                !(urlInput && isValidYouTubeUrl(urlInput)) ||
                videoExistsInFocusRoom ||
                isAddingVideo
              }
              onClick={handleAddToFocusRoom}
              size="sm"
              variant="secondary"
            >
              {isAddingVideo
                ? 'Adding...'
                : videoExistsInFocusRoom
                  ? 'Added'
                  : 'Add'}
            </Button>
          )}
        </div>
      </DynamicPopoverHeader>
      <DynamicPopoverBody viewportClassName="px-0 md:pr-4 md:pb-2 md:pl-2">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-0 md:gap-4">
          {filteredVideos.map((video) => (
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
              <div className="mt-2 truncate font-medium text-xs">
                {video.title}
              </div>
            </button>
          ))}
        </div>
      </DynamicPopoverBody>
    </>
  );
};

function getThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export default memo(VideoPicker);
