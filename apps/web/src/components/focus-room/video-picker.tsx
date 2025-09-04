import playlistData from '@/data/programming_vibes';

const VideoPicker: React.FC = () => {
  return (
    <div>
      {playlistData.entries.map((entry) => (
        <div key={entry.id}>{entry.title}</div>
      ))}
    </div>
  );
};

export default VideoPicker;
