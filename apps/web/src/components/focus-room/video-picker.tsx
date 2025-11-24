/** biome-ignore-all lint/suspicious/noArrayIndexKey: Skeletons need unique keys */
import { useQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useVideoStore } from '@/stores/video-store';
import { trpc } from '@/utils/trpc';
import { Skeleton } from '../ui/skeleton';

const VideoPicker: React.FC = () => {
  const { handleVideoIdChange, handleLoadVideo } = useVideoStore();
  const isMobile = useIsMobile();
  const { data: videos = [], isLoading } = useQuery(
    trpc.focus.listVideos.queryOptions()
  );

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
        isMobile ? 'h-full min-w-full flex-1 px-2' : 'h-full py-2 pr-4 pl-2'
      )}
    >
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
