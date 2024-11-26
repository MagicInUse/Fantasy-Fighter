import type { LevelData } from '../interfaces/LevelData';

import AuthService from '../utils/auth';

// GET /api/level endpoint to get all levels
const getLevels = async (): Promise<LevelData[]> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch('/api/level/all', {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

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

// GET /api/level/:id endpoint to get level by id
const getLevel = async (level: number): Promise<LevelData> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch(`/api/level/${level}`, {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

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

// GET /api/level/:id/details endpoint to get level details
const getLevelDetails = async (level: number): Promise<LevelData> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch(`/api/level/${level}/details`, {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Could not retrieve level details');
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.log('Error from level API: ', err);
    return Promise.reject('Could not fetch level details');
  }
}

export { getLevels, getLevel, getLevelDetails };