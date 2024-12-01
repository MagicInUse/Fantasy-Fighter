import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  title: string;
  body: ReactNode;
  exitButton: string;
  show: boolean;
  onClose: () => void;
}

// ModalComponent is a reusable modal dialog component that displays a title, body content, and an exit button.
// It also closes when clicking outside the modal.
const ModalComponent: React.FC<ModalProps> = ({ title, body, exitButton, show, onClose }) => {
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

  if (!show) {
    return null;
  }

  return (
    <>
      {/* Bootstrap Modal */}
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

export default ModalComponent;