import React from 'react';
import { InventoryData } from '../interfaces/InventoryData';

interface ItemProps {
    item: InventoryData;
    description: string;
}

const Item: React.FC<ItemProps> = ({ item, description }) => {
    return (
        <div className='text-center relative'>
            <h4 className='tooltip'>{item.item} {description}</h4>
        </div>
    );
};

export default Item;