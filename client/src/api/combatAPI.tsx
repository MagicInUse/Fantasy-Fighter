import { CharacterData } from '../interfaces/CharacterData';
import { EnemyData } from '../interfaces/EnemyData';

import AuthService from '../utils/auth';

// GET /api/character endpoint to get player data
export const getCharacterData = async (): Promise<CharacterData> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch('/api/character', {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Could not retrieve player data');
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not fetch player data');
  }
};

// POST /api/character endpoint to create character data
export const createCharacterData = async (): Promise<CharacterData> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch('/api/character', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Could not create character data');
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not create player data');
  }
};

// GET /api/enemy/type/:type endpoint to get enemy data by type
export const getEnemyData = async (type: string): Promise<EnemyData> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch(`/api/enemy/type/${type}`, {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Could not retrieve enemy data');
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not fetch enemy data');
  }
};