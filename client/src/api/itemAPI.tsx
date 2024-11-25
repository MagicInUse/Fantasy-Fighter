import type { ItemData } from '../interfaces/ItemData';

// /api/item endpoint
const getItems = async (): Promise<ItemData[]> => {
  try {
    const response = await fetch('/api/item');

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
  try {
    const response = await fetch(`/api/item/${item}`);

    if (!response.ok) {
      throw new Error('Could not retrieve item');
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error from level API: ', err);
    return Promise.reject('Could not fetch item');
  }
};

export { getItems, getItem };