import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const location = useLocation();

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const isCombatRoute = /^\/combat\/\d+$/.test(location.pathname);

  return (
    <div>
      <div>
        {!loginCheck ? (
          <div className="d-flex flex-column align-items-center">
            <h1 className="text-center mt-4 mb-3 unifrakturmaguntia-header card border-secondary p-3">Fantasy Fighter!</h1>
            <nav className="navbar justify-content-around w-50 flex-md-row flex-column">
            </nav>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <h1 className="text-center m-4 mb-3 unifrakturmaguntia-header card border-secondary p-3">Fantasy Fighter!</h1>
            <nav className="navbar justify-content-around w-50 flex-md-row flex-column">
              <button
                className='btn btn-warning mb-md-0 mb-2'
                type='button'
                onClick={() => {
                  window.location.assign('/levels');
                }}
              >
                Levels
              </button>
              <button
                className='btn btn-info mb-md-0 mb-2'
                type='button'
                onClick={() => {
                  window.location.assign('/inventory');
                }}
                disabled={isCombatRoute}
              >
                Inventory
              </button>
              <button
                className='btn btn-dark'
                type='button'
                onClick={() => {
                  auth.logout();
                  window.location.assign('/');
                }}
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;