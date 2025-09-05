import playlistData from '@/data/programming_vibes';

const VideoPicker: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <div className="max-h-60 space-y-4 overflow-y-auto">
        {playlistData.entries.map((entry) => (
          // todo: nice layout :)
          <div key={entry.id}>{entry.title}</div>
        ))}
      </div>
    </div>
  );
};

export default VideoPicker;
