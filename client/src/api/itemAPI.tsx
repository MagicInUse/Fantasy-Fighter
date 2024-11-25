import type { ItemData } from '../interfaces/ItemData';
import AuthService from '../utils/auth';

// /api/item endpoint
const getItems = async (): Promise<ItemData[]> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch('/api/item', {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Could not retrieve items');
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error from item API: ', err);
    return Promise.reject('Could not fetch items');
  }
};

// /api/item/:id endpoint
const getItem = async (item: string): Promise<ItemData> => {
  if (!AuthService.loggedIn()) {
    return Promise.reject('User is not authenticated');
  }

  try {
    const response = await fetch(`/api/item/${item}`, {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Could not retrieve item');
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error from item API: ', err);
    return Promise.reject('Could not fetch item');
  }
};

export { getItems, getItem };