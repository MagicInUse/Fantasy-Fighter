import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import auth from './utils/auth';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      if (!auth.loggedIn()) {
        auth.logout();
        navigate('/');
      }
    };

    checkLogin();
  }, [navigate]);
  
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;