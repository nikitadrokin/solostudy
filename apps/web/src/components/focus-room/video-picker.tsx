import { memo } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import playlistData from '@/data/programming_vibes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useVideoStore } from '@/stores/video-store';

const VideoPicker: React.FC = () => {
  const { handleVideoUrlChange, handleLoadVideo } = useVideoStore();
  const isMobile = useIsMobile();

  const handleVideoSelect = (url: string) => {
    handleVideoUrlChange(url);
    handleLoadVideo();
  };

  return (
    <div
      className={cn(
        'grid gap-4 overflow-y-auto',
        isMobile
          ? 'h-full min-w-full flex-1 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]'
          : '-mr-4 max-h-[500px] grid-cols-3 py-4 pr-4'
      )}
    >
      {playlistData.entries.map((entry) => (
        <button
          className="cursor-pointer rounded-lg p-2 text-left hover:bg-muted/50"
          key={entry.id}
          onClick={() => handleVideoSelect(entry.url)}
          title={entry.title}
          type="button"
        >
          <AspectRatio className="overflow-hidden rounded" ratio={16 / 9}>
            {/** biome-ignore lint/performance/noImgElement: saving on vercel bandwidth */}
            <img
              alt={`${entry.title} thumbnail`}
              className="h-full w-full object-cover"
              loading="lazy"
              src={entry.thumbnails[0].url}
            />
          </AspectRatio>
          <div className="mt-2 truncate font-medium text-xs">{entry.title}</div>
        </button>
      ))}
    </div>
  );
};

export default memo(VideoPicker);
