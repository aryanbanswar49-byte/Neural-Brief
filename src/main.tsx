import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PublicLayout } from './components/PublicLayout';
import { AdminLayout } from './components/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { BlogListing } from './pages/public/BlogListing';
import { PostDetail } from './pages/public/PostDetail';
import { CategoryPage } from './pages/public/CategoryPage';
import { SearchPage } from './pages/public/SearchPage';
import { Contact } from './pages/public/Contact';
import { NotFound } from './pages/public/NotFound';

// Auth & Admin Pages
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { PostManagement } from './pages/admin/PostManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';

import './index.css';

// Legacy URL redirect handler
const LegacyPostRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/blog/${slug}`} replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/blog', element: <BlogListing /> },
      { path: '/blog/:slug', element: <PostDetail /> },
      { path: '/post/:slug', element: <LegacyPostRedirect /> }, // Legacy redirect
      { path: '/category/:slug', element: <CategoryPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/contact', element: <Contact /> },
      { path: '/login', element: <Login /> },
      { path: '/admin/login', element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'posts', element: <PostManagement /> },
      { path: 'categories', element: <CategoryManagement /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
