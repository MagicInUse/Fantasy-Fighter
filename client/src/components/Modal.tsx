import React from 'react';

interface ModalProps {
  title: string;
  body: string;
  exitButton: string;
  show: boolean;
  onClose: () => void;
}

const ModalComponent: React.FC<ModalProps> = ({ title, body, exitButton, show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop show">
      </div>
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close ms-auto btn-dark" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: body }}></div>
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