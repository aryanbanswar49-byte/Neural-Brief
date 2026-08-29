import React from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, FileText, ArrowLeft, LogOut, Loader2, Sun, Moon } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low dark:bg-zinc-950">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface-container-low dark:bg-zinc-950 text-on-surface dark:text-zinc-50 transition-colors duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-surface-container-lowest dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-outline-variant dark:border-zinc-800 flex flex-col justify-between shrink-0 transition-colors duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between md:mb-8">
            <span className="font-sans font-extrabold text-xl text-on-background dark:text-zinc-100 tracking-tight">The Editorial</span>
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full uppercase">Admin</span>
          </div>
          
          <nav className="space-y-1.5 mt-6 md:mt-0 flex flex-row md:flex-col gap-2 md:gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors shrink-0 ${
                  isActive 
                    ? 'bg-primary-container text-on-primary' 
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800'
                }`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/admin/posts" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors shrink-0 ${
                  isActive 
                    ? 'bg-primary-container text-on-primary' 
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800'
                }`
              }
            >
              <FileText size={18} />
              <span>Manage Posts</span>
            </NavLink>
          </nav>
        </div>

        {/* User profile & controls */}
        <div className="p-6 border-t border-outline-variant dark:border-zinc-800 flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight text-on-surface dark:text-zinc-200">{user?.name}</div>
              <div className="text-[10px] text-on-surface-variant dark:text-zinc-400 leading-none">{user?.email}</div>
            </div>
          </div>

          <div className="flex md:flex-col gap-2">
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary px-3 py-2 rounded hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span className="hidden md:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary px-3 py-2 rounded hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="hidden md:inline">View Site</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 text-xs font-semibold text-error hover:bg-error-container/20 px-3 py-2 rounded transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto max-w-[1200px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
