import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';
import { Home } from './pages/public/Home';
import { BlogListing } from './pages/public/BlogListing';
import { PostDetail } from './pages/public/PostDetail';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/admin/Dashboard';
import { PostManagement } from './pages/admin/PostManagement';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/blog', element: <BlogListing /> },
      { path: '/post/:slug', element: <PostDetail /> },
      { path: '/contact', element: <Contact /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'posts', element: <PostManagement /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
