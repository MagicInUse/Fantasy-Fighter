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
          <nav className="navbar">
          </nav>
        ) : (
          <nav className="navbar">
            <button
              className='btn btn-secondary'
              type='button'
              onClick={() => {
                window.location.assign('/levels');
              }}
            >
              Levels
            </button>
            <button
              className='btn btn-secondary'
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
        )}
      </div>
    </div>
  );
};

export default Navbar;