import { useEffect, useState } from 'react';
import Item from '../components/Item';
import { ItemData, InventoryData } from '../interfaces/InventoryData';

const Inventory = () => {
    const [items, setItems] = useState<InventoryData[]>([]);
    const [allItems, setAllItems] = useState<ItemData[]>([]);

    useEffect(() => {
        // TODO: Fetch all items from the server
        const fetchedItems: ItemData[] = [
            { id: 1, name: 'Item 1', description: 'Description 1' },
            { id: 2, name: 'Item 2', description: 'Description 2' },
            { id: 3, name: 'Item 3', description: 'Description 3' },
        ];
        setAllItems(fetchedItems);

        // TODO: Fetch inventory items from the server
        const userItems: InventoryData[] = [
            { id: 1, item: 'Item 1' },
            { id: 2, item: 'Item 2' },
            { id: 3, item: 'Item 3' },
        ];
        setItems(userItems);
    }, []);

    const getItemDescription = (itemName: string) => {
        const item = allItems.find(i => i.name === itemName);
        return item ? item.description : '';
    };

    return (
        <div className="grid grid-cols-5 gap-4 p-4 d-flex items-center justify-center">
            {items.map((item, index) => (
                <div key={index} className="bg-black border rounded p-2 relative" style={{ width: '80px', height: '80px' }}>
                    <Item item={item} description={getItemDescription(item.item)} />
                </div>
            ))}
        </div>
    );
};

export default Inventory;