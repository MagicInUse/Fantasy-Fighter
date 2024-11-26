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

// POST /api/character endpoint to create player data
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
      throw new Error('Could not create player data');
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not create player data');
  }
};

// GET /api/enemy endpoint to get enemy data
export const getEnemyData = async (): Promise<EnemyData> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch('/api/enemy', {
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

// TODO: Implement the combat logic functions, be it here or server side
// POST /api/combat/attack endpoint to handle player attacking enemy
export const apiPlayerAttack = async (player: CharacterData, enemy: EnemyData): Promise<{ updatedPlayer: CharacterData, updatedEnemy: EnemyData }> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch('/api/combat/attack', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player, enemy }),
    });

    if (!response.ok) {
      throw new Error('Could not attack enemy');
    }

    const data = await response.json();
    return { updatedPlayer: data.updatedPlayer, updatedEnemy: data.updatedEnemy };

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not attack enemy');
  }
};

// POST /api/combat/defend endpoint to handle player defending against enemy
export const apiPlayerDefend = async (player: CharacterData, enemy: EnemyData): Promise<{ updatedPlayer: CharacterData, updatedEnemy: EnemyData }> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch('/api/combat/defend', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player, enemy }),
    });

    if (!response.ok) {
      throw new Error('Could not defend against enemy');
    }

    const data = await response.json();
    return { updatedPlayer: data.updatedPlayer, updatedEnemy: data.updatedEnemy };

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not defend against enemy');
  }
};

// POST /api/combat/spell endpoint to handle player casting a spell on enemy
export const apiPlayerSpell = async (player: CharacterData, enemy: EnemyData): Promise<{ updatedPlayer: CharacterData, updatedEnemy: EnemyData }> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch('/api/combat/spell', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player, enemy }),
    });

    if (!response.ok) {
      throw new Error('Could not cast spell on enemy');
    }

    const data = await response.json();
    return { updatedPlayer: data.updatedPlayer, updatedEnemy: data.updatedEnemy };

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not cast spell on enemy');
  }
};