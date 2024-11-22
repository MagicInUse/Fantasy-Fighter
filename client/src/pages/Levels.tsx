import React from 'react';
import { LevelData } from '../interfaces/LevelData';
import Level from '../components/Level';

// TODO: Replace this with an API call to get the levels
const levels: LevelData[] = [
  { levelNumber: 1, complete: true, locked: false },
  { levelNumber: 2, complete: true, locked: false },
  { levelNumber: 3, complete: true, locked: false },
  { levelNumber: 4, complete: true, locked: false },
  { levelNumber: 5, complete: false, locked: false },
  { levelNumber: 6, complete: false, locked: true },
  { levelNumber: 7, complete: false, locked: true },
  { levelNumber: 8, complete: false, locked: true },
  { levelNumber: 9, complete: false, locked: true },
  { levelNumber: 10, complete: false, locked: true },
];

const GameLevels: React.FC = () => {
  const handlePlay = (level: LevelData) => {
    console.log(`Playing level ${level.levelNumber}`);
  };

  return (
    <div className="container mt-3">
      <div className="row">
        {levels.map((level) => (
          <div key={level.levelNumber} className="col-12 col-md-6 col-lg-4">
            <Level
              levelNumber={level.levelNumber}
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