import React from 'react';

interface LevelProps {
  levelNumber: number;
  complete: boolean;
  locked: boolean;
  onPlay: () => void;
}

const Level: React.FC<LevelProps> = ({ levelNumber, complete, locked, onPlay }) => {
  const getClassNames = () => {
    if (locked) {
      return 'bg-black';
    } else if (complete) {
      return 'alert alert-success';
    } else {
      return 'alert alert-info';
    }
  };

  return (
    <div className={`border  p-4 mb-4 rounded text-center shadow-lg ${getClassNames()}`}>
      <h3>Level {levelNumber}</h3>
      <p>{complete ? 'Complete' : 'Incomplete'}</p>
      <button className="btn btn-light" onClick={onPlay} disabled={locked}>
        {locked ? 'Locked' : 'Play'}
      </button>
    </div>
  );
};

export default Level;