import { useEffect, useState } from 'react';

import Item from '../components/Item';
import { ItemData } from '../interfaces/ItemData';

const Inventory = () => {
  const [allItems, setAllItems] = useState<ItemData[]>([]);

  useEffect(() => {
    // TODO: Get with Hailey for fetch requests of all user items from the server
    const fetchedItems: ItemData[] = [
      { id: 1, itemName: 'Bow', description: 'A short bow.', type: 1, equipped: true, quantity: 1, damage: Math.floor(Math.random() * 10) + 1 },
      { id: 2, itemName: 'Sword', description: 'A short sword.', type: 1, equipped: false, quantity: 1, damage: Math.floor(Math.random() * 6) + 3 },
      { id: 3, itemName: 'Health Potion', description: 'A swirling green liquid.', type: 2, quantity: 5, effect: 'Heals 10 health' },
      { id: 4, itemName: 'Mana Potion', description: 'A thick blue substance.', type: 3, quantity: 5, effect: 'Restores 10 mana' },
    ];
    setAllItems(fetchedItems);
  }, []);

  const handleUpdateItem = (updatedItem: ItemData | null) => {
    if (updatedItem) {
      setAllItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === updatedItem.id) {
            return updatedItem;
          } else if (updatedItem.equipped && item.type === 1) {
            return { ...item, equipped: false };
          } else {
            return item;
          }
        })
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {allItems.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
            <div className="bg-black border rounded p-2" style={{ width: '120px', height: '120px' }}>
              <Item item={item} onUpdate={handleUpdateItem} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;