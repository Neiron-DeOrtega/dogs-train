import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Main from './components/Main/Main';
import Login from './components/Login/Login';
import Admin from './components/Admin/Admin';
import axios from 'axios';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Main />
  ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
    <AdminRoute type="route">
      <Admin />
    </AdminRoute>
  ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
