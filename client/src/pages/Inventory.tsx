import { useEffect, useState } from 'react';

import Item from '../components/Item';
import { ItemData } from '../interfaces/ItemData';

import { getItems } from '../api/itemAPI';

const Inventory = () => {
  const [allItems, setAllItems] = useState<ItemData[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const fetchedItems: ItemData[] = await getItems();
      setAllItems(fetchedItems);
    };
    fetchItems();
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