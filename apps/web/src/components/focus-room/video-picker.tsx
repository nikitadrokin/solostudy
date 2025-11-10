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
        'relative flex flex-col',
        isMobile ? '' : 'pr-4 pl-2',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[var(--gradient-height-top)] before:rounded-t-3xl before:bg-gradient-to-b before:from-[var(--gradient-color)] before:to-transparent before:content-[""]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-[var(--gradient-height-bottom)] after:bg-gradient-to-t after:from-[var(--gradient-color)] after:to-transparent after:content-[""]',
        isMobile ? 'h-full min-h-0' : 'max-h-[500px]'
      )}
      style={
        {
          '--gradient-height-top': '3.5rem',
          '--gradient-height-bottom': '2rem',
          '--gradient-color': 'var(--background)',
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'grid gap-4 overflow-y-auto pt-[var(--gradient-height-top)] pb-[var(--gradient-height-bottom)]',
          isMobile
            ? 'h-full min-w-full flex-1 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] px-2'
            : '-mr-4 grid-cols-3 py-2 pr-4'
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
            <div className="mt-2 truncate font-medium text-xs">
              {entry.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(VideoPicker);
