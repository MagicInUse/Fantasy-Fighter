import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import 'bootswatch/dist/spacelab/bootstrap.min.css';
import '../src/assets/topography.css';
import '../src/assets/custom.css';

import App from './App.tsx';

import ErrorPage from './pages/ErrorPage.tsx';
import Home from './pages/Home.tsx';
import Levels from './pages/Levels.tsx';
import Combat from './pages/Combat.tsx';
import Inventory from './pages/Inventory.tsx';

// Define the routes for the application
const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/levels',
        element: <Levels />,
      },
      {
        path: '/combat/:level_id',
        element: <Combat />,
      },
      {
        path: '/inventory',
        element: <Inventory />,
      },
    ],
  },
];

// Create the router instance with the defined routes
const router = createBrowserRouter(routes);

// Get the root element from the DOM and render the application
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}