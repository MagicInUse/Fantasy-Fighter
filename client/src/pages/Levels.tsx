import React from 'react';

import { LevelData } from '../interfaces/LevelData';
import Level from '../components/Level';
import { getLevels } from '../api/levelAPI';

const GameLevels: React.FC = () => {
  const [levels, setLevels] = React.useState<LevelData[]>([]);

  React.useEffect(() => {
    const fetchLevels = async () => {
      // TODO: Fetch levels from the server
      const levelsData = await getLevels();
      setLevels(levelsData);
    };

    fetchLevels();
  }, []);

  const handlePlay = (level: LevelData) => {
    // TODO: Implement play functionality
    console.log(`Playing level ${level.level_id}`);
  };

  return (
    <div className="container mt-3">
      <div className="row">
        {levels.map((level) => (
          <div key={level.level_id} className="col-12 col-md-6 col-lg-4">
            <Level
              levelNumber={level.level_id}
              levelName={level.level_name}
              description={level.description}
              complete={level.complete}
              locked={level.locked}
              onPlay={() => handlePlay(level)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLevels;