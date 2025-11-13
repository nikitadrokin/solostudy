import { memo } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import playlistData from '@/data/programming_vibes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useVideoStore } from '@/stores/video-store';

const VideoPicker: React.FC = () => {
  const { handleVideoIdChange, handleLoadVideo } = useVideoStore();
  const isMobile = useIsMobile();

  const handleVideoSelect = (id: string) => {
    handleVideoIdChange(id);
    handleLoadVideo();
  };

  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 overflow-y-auto',
        isMobile ? 'h-full min-w-full flex-1 px-2' : 'h-full py-2 pr-4 pl-2'
      )}
    >
      {playlistData.entries.map((entry) => (
        <button
          className="cursor-pointer rounded-lg p-2 text-left hover:bg-muted/50"
          key={entry.id}
          onClick={() => handleVideoSelect(entry.id)}
          title={entry.title}
          type="button"
        >
          <AspectRatio
            className="select-none overflow-hidden rounded"
            ratio={16 / 9}
          >
            {/** biome-ignore lint/performance/noImgElement: saving on vercel bandwidth */}
            <img
              alt={`${entry.title} thumbnail`}
              className="h-full w-full object-cover"
              draggable={false}
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
