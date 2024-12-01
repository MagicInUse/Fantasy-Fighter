import { useState } from 'react';

import ModalComponent from './Modal';

// Footer component that includes buttons for "About" and "Make it your own!".
// The "About" button opens a modal with information about the developers.
const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  // Configuration for the "About" modal
  const aboutModal = {
    title: 'About',
    body: (
      <div>
        <p>Meet the devs!</p>
        <ul>
          <li className="text-info">
            <a href="https://github.com/Kristenshields" target="_blank" className="text-success-emphasis">
              Kristen
            </a>
          </li>
          <li className="text-info">
            <a href="https://github.com/Cinnlight" target="_blank" className="text-success-emphasis">
              Hailey
            </a>
          </li>
          <li className="text-info">
            <a href="https://github.com/MagicInUse" target="_blank" className="text-success-emphasis">
              Jacob
            </a>
          </li>
        </ul>
      </div>
    ),
    exitButton: 'Close',
    show: showModal,
    onClose: () => setShowModal(false),
  };

  return (
    <footer className="d-flex justify-content-between align-items-center fixed-bottom p-3">
      {/* Button that opens the "About" modal */}
      <button className="btn btn-dark" type="button" onClick={() => setShowModal(true)}>
        About
      </button>
      {/* Button that links to the GitHub repository */}
      <button className="btn btn-dark" type="button" onClick={() => { window.location.assign('https://github.com/MagicInUse/Fantasy-Fighter'); }}>
        Make it your own!
      </button>
      <ModalComponent {...aboutModal} />
    </footer>
  );
};

export default Footer;