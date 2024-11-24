import type { LevelData } from '../interfaces/LevelData';

// /api/level endpoint
const getLevels = async (): Promise<LevelData[]> => {
  try {
    const response = await fetch('/api/level');

    if (!response.ok) {
      throw new Error('Could not retrieve levels');
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error from level API: ', err);
    return Promise.reject('Could not fetch levels');
  }
};

// /api/level/:id endpoint
const getLevel = async (level: number): Promise<LevelData> => {
  try {
    const response = await fetch(`/api/level/${level}`);

    if (!response.ok) {
      throw new Error('Could not retrieve level');
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error from level API: ', err);
    return Promise.reject('Could not fetch level');
  }
};

export { getLevels, getLevel };