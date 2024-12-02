import React, { useState } from 'react';
import { ItemData } from '../interfaces/ItemData';
import ItemModal from './ItemModal';

interface ItemProps {
  item: ItemData;
  onUpdate: (updatedItem: ItemData | null) => void;
}

// Item component represents a single item in the game.
// It displays the item name and quantity, and opens a modal with item details when clicked.
const Item: React.FC<ItemProps> = ({ item, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  // Determine the background color based on the item type
  const getColor = () => {
    switch (item.type) {
      case 1: return 'darkred';
      case 2: return 'green';
      case 3: return 'blue';
      default: return 'gray';
    }
  };

  // Determine the border outline based on whether the item is equipped
  const getOutline = () => {
    return item.equipped ? '3px solid gold' : 'none';
  };

  // Handle equipping or using the item
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

  // Handle closing the modal
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Display the item name, quantity, damage or effect, and open the modal when clicked */}
      <div 
        className="text-center d-flex flex-column align-items-center justify-content-center" 
        style={{ backgroundColor: getColor(), border: getOutline(), width: '100%', height: '100%' }}
        onClick={() => setShowModal(true)}
      >
        <h4 className="text-white text-center">
          {item.itemName}
        </h4>
        {item.type !== 1 && <span className="text-white">Quantity: {item.quantity}</span>}
        {item.type === 1 && <span className="text-white">Damage: {item.damage}</span>}
        {(item.type === 2 || item.type === 3) && <span className="text-white">Effect: {item.effect}</span>}
        {showModal && (
          // Display the item modal when the modal state is true
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
            itemName={item.itemName} // Pass itemName prop
          />
        )}
      </div>
    </>
  );
};
export default Item;