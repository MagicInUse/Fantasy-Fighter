import React, { ReactNode, useEffect } from 'react';

interface ItemModalProps {
  title: string;
  body: ReactNode;
  equipButton: string | null;
  exitButton: string;
  show: boolean;
  onEquip: () => void;
  onClose: () => void;
}

// TODO: BUG: Modal closes when clicking outside of the modal, but not when using either X or Close button.

const ItemModal: React.FC<ItemModalProps> = ({ title, body, equipButton, exitButton, show, onEquip, onClose }) => {
  const handleClickOutside = (event: MouseEvent) => {
    const modal = document.querySelector('.modal-dialog');
    if (modal && !modal.contains(event.target as Node)) {
      onClose();
    }
  };

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

  if (!show) {
    return null;
  }

  return (
    <>
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
                <button type="button" className="btn btn-success" onClick={onEquip}>
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