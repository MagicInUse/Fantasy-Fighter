import React from 'react';
import { useNavigate } from 'react-router-dom';

import { LevelData } from '../interfaces/LevelData';
import Level from '../components/Level';

import { getLevels } from '../api/levelAPI';

const GameLevels: React.FC = () => {
  const [levels, setLevels] = React.useState<LevelData[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchLevels = async () => {
      const levelsData = await getLevels();
      setLevels(levelsData);
    };

    fetchLevels();
  }, []);

  const handlePlay = (level: LevelData) => {
    navigate(`/combat/${level.level_id}`);
  };

  // Sort levels by level_id in ascending order
  const sortedLevels = levels.sort((a, b) => a.level_id - b.level_id);

  return (
    <div className="container mt-3">
      <div className="row">
        {sortedLevels.map((level) => (
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