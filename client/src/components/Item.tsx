import React, { useState } from 'react';
import { ItemData } from '../interfaces/ItemData';
import ItemModal from './ItemModal';

interface ItemProps {
  item: ItemData;
  onUpdate: (updatedItem: ItemData | null) => void;
}

const Item: React.FC<ItemProps> = ({ item, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  const getColor = () => {
    switch (item.type) {
      case 1: return 'darkred';
      case 2: return 'green';
      case 3: return 'blue';
      default: return 'gray';
    }
  };

  const getOutline = () => {
    return item.equipped ? '3px solid gold' : 'none';
  };

  const handleEquip = () => {
    if (item.type === 1) {
      // Equip or Unequip the item
      const updatedItem = { ...item, equipped: !item.equipped };
      onUpdate(updatedItem);
    } else {
      // Use the item
      const updatedQuantity = item.quantity - 1;
      const updatedItem = { ...item, quantity: updatedQuantity };
      onUpdate(updatedItem);
    }
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div 
      className="text-center d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: getColor(), border: getOutline(), width: '100%', height: '100%' }}
      onClick={() => setShowModal(true)}
    >
      <h4 className="text-white text-center">
        {item.itemName}
        {item.type !== 1 && ` (${item.quantity})`}
      </h4>
      {showModal && (
        <ItemModal 
          title={`${item.itemName}${item.type !== 1 ? ` (${item.quantity})` : ''}`} 
          body={
            <div>
              <p>{item.description}</p>
              {item.damage ? <p>Damage: {item.damage}</p> : null}
              {item.effect ? <p>Effect: {item.effect}</p> : null}
            </div>
          } 
          equipButton={item.type === 1 ? (item.equipped ? "Unequip" : "Equip") : item.quantity > 0 ? "Use" : null} 
          exitButton="Close" 
          show={showModal} 
          onEquip={handleEquip} 
          onClose={handleClose} 
        />
      )}
    </div>
  );
};

export default Item;