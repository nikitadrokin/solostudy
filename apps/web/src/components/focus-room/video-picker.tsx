import { AspectRatio } from '@/components/ui/aspect-ratio';
import playlistData from '@/data/programming_vibes';

const VideoPicker: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <div className="grid max-h-60 grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3 space-y-4 overflow-y-auto">
        {playlistData.entries.map((entry) => (
          <div
            className="cursor-pointer rounded-lg p-2 hover:bg-muted/50"
            key={entry.id}
            title={entry.title}
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
            <div className="mt-2 truncate font-medium text-xs">
              {entry.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPicker;
