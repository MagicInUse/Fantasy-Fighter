import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

// App component that serves as the main layout for the application.
// It includes the Navbar and renders the child routes using the Outlet component.
function App() {

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