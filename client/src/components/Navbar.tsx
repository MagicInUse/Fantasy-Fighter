import { useState, useEffect } from 'react';
import auth from '../utils/auth';

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    console.log(loginCheck);
    checkLogin();
  }, [loginCheck]);

  return (
    <div>
      <h1></h1>
      <div>
        {!loginCheck ? (
          <div className="d-flex flex-column align-items-center">
            <h1 className="text-center mt-4 mb-3 unifrakturmaguntia-header card border-secondary p-3">Fantasy Fighter!</h1>
            <nav className="navbar justify-content-around w-50">
            </nav>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <h1 className="text-center m-4 mb-3 unifrakturmaguntia-header card border-secondary p-3">Fantasy Fighter!</h1>
            <nav className="navbar justify-content-around w-50 flex-md-row flex-column">
              <button
                className='btn btn-secondary mb-md-0 mb-2'
                type='button'
                onClick={() => {
                  window.location.assign('/levels');
                }}
              >
                Levels
              </button>
              <button
                className='btn btn-secondary mb-md-0 mb-2'
                type='button'
                onClick={() => {
                  window.location.assign('/profile');
                }}
              >
                Character Profile
              </button>
              <button
                className='btn btn-secondary'
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