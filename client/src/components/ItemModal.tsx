import React, { ReactNode, useEffect } from 'react';
import { postItem } from '../api/itemAPI';

import AuthService from '../utils/auth';

interface ItemModalProps {
  title: string;
  body: ReactNode;
  equipButton: string | null;
  exitButton: string;
  show: boolean;
  onEquip: () => void;
  onClose: () => void;
  itemName?: string;
}

// TODO: BUG: Modal closes when clicking outside of the modal, but not when using either X or Close button.

// ItemModal is a reusable modal dialog component for displaying item details.
// It includes an equip/use button and an exit button. The modal closes when clicking outside of it.
const ItemModal: React.FC<ItemModalProps> = ({ title, body, equipButton, exitButton, show, onEquip, onClose, itemName }) => {
  // Handle clicks outside the modal to close it
  const handleClickOutside = (event: MouseEvent) => {
    const modal = document.querySelector('.modal-dialog');
    if (modal && !modal.contains(event.target as Node)) {
      onClose();
    }
  };

  // Add or remove event listener for clicks outside the modal
  useEffect(() => {
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);



  const handleEquipClick = async (): Promise<void> => {
    if (!AuthService.loggedIn()) {
      return Promise.reject('User is not authenticated');
    }
  
    // Post item with user authentication
    try {
      if (itemName) {
        await postItem(itemName);
      } else {
        console.error('Item name is undefined');
      }
      onEquip();
    } catch (error) {
      console.error('Error equipping item:', error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <>
    {/* Modified Bootstrap modal to handle item equip / use */}
      <div className="modal-backdrop show"></div>
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close ms-auto" onClick={onClose}></button>
            </div>
            <div className="modal-body">{body}</div>
            <div className="modal-footer">
              {equipButton && (
                <button type="button" className="btn btn-success" onClick={handleEquipClick}>
                  {equipButton}
                </button>
              )}
              <button type="button" className="btn btn-dark" onClick={onClose}>
                {exitButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemModal;