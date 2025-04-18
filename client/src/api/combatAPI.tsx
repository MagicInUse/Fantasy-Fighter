import { CharacterData } from '../interfaces/CharacterData';
import { EnemyData } from '../interfaces/EnemyData';

import AuthService from '../utils/auth';

// GET /api/character endpoint to get player data
export const getCharacterData = async (): Promise<CharacterData> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  // Fetch player data from the server with user authentication
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

  // Create player data on the server with user authentication
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

  // Fetch enemy data from the server based on type with user authentication
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

// POST /api/combat/attack endpoint to handle player attacking enemy
export const apiPlayerAttack = async (combatId: string): Promise<{ updatedPlayer: CharacterData, updatedEnemy: EnemyData }> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  // Send attack request to the server with user authentication
  try {
    const response = await fetch('/api/combat/attack', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ combatId }),
    });

    if (!response.ok) {
      throw new Error('Could not attack enemy');
    }

    const data = await response.json();
    // Return updated player and enemy data
    return { updatedPlayer: data.updatedPlayer, updatedEnemy: data.updatedEnemy };

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not attack enemy');
  }
};

// POST /api/combat/defend endpoint to handle player defending against enemy
export const apiPlayerDefend = async (combatId: string): Promise<{ updatedPlayer: CharacterData, updatedEnemy: EnemyData }> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  // Send defend request to the server with user authentication
  try {
    const response = await fetch('/api/combat/defend', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ combatId }),
    });

    if (!response.ok) {
      throw new Error('Could not defend against enemy');
    }

    const data = await response.json();
    // Return updated player and enemy data
    return { updatedPlayer: data.updatedPlayer, updatedEnemy: data.updatedEnemy };

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not defend against enemy');
  }
};

// POST /api/combat/spell endpoint to handle player casting a spell on enemy
export const apiPlayerSpell = async (combatId: string): Promise<{ updatedPlayer: CharacterData, updatedEnemy: EnemyData }> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  // Send spell request to the server with user authentication
  try {
    const response = await fetch('/api/combat/spell', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ combatId }),
    });

    if (!response.ok) {
      throw new Error('Could not cast spell on enemy');
    }

    const data = await response.json();
    // Return updated player and enemy data
    return { updatedPlayer: data.updatedPlayer, updatedEnemy: data.updatedEnemy };

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not cast spell on enemy');
  }
};

// POST /api/combat/heal endpoint to handle player casting a heal spell
export const apiPlayerHeal = async (combatId: string): Promise<{ updatedPlayer: CharacterData, updatedEnemy: EnemyData }> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  // Send heal request to the server with user authentication
  try {
    const response = await fetch('/api/combat/heal', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ combatId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Could not cast heal spell');
    }

    const data = await response.json();
    // Return updated player and enemy data
    return { updatedPlayer: data.updatedPlayer, updatedEnemy: data.updatedEnemy };

  } catch (err) {
    console.log('Error from combat API: ', err);
    return Promise.reject('Could not cast heal spell');
  }
};