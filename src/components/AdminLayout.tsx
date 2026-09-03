import React from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, FileText, FolderTree, ArrowLeft, LogOut, Loader2, Sun, Moon } from 'lucide-react';
import { SEO } from './SEO';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, user, profile, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-low dark:bg-zinc-950 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-xs text-on-surface-variant dark:text-zinc-400 font-sans tracking-wide">
          Verifying editorial session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // If user is authenticated but does not possess admin or author role
  if (profile && profile.role !== 'admin' && profile.role !== 'author') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-low dark:bg-zinc-950 p-6 text-center">
        <SEO title="Unauthorized Access | Neural Brief" noIndex={true} />
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-8 max-w-md w-full shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-full bg-error-container/20 text-error flex items-center justify-center mx-auto">
            <LogOut size={24} />
          </div>
          <h2 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100">
            Access Restricted
          </h2>
          <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-400 leading-relaxed">
            Your account ({user?.email}) does not have administrative privileges to access Neural Brief CMS. Please contact your system administrator.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-outline-variant dark:border-zinc-800 rounded-lg text-xs font-semibold hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200"
            >
              Return Home
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary-container text-white rounded-lg text-xs font-semibold hover:bg-primary"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Administrator';
  const displayEmail = user?.email || 'admin@theeditorial.com';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface-container-low dark:bg-zinc-950 text-on-surface dark:text-zinc-50 transition-colors duration-200">
      <SEO title="Editorial CMS | Neural Brief" noIndex={true} />

      {/* Sidebar Navigation */}
      <aside 
        aria-label="Admin Navigation"
        className="w-full md:w-64 bg-surface-container-lowest dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-outline-variant dark:border-zinc-800 flex flex-col justify-between shrink-0 transition-colors duration-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between md:mb-8">
            <span className="font-sans font-extrabold text-xl text-on-background dark:text-zinc-100 tracking-tight">Neural Brief</span>
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full uppercase">CMS</span>
          </div>
          
          <nav className="space-y-1.5 mt-6 md:mt-0 flex flex-row md:flex-col gap-2 md:gap-1.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0">
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors shrink-0 ${
                  isActive 
                    ? 'bg-primary-container text-white' 
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
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors shrink-0 ${
                  isActive 
                    ? 'bg-primary-container text-white' 
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800'
                }`
              }
            >
              <FileText size={18} />
              <span>Manage Posts</span>
            </NavLink>
            <NavLink 
              to="/admin/categories" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors shrink-0 ${
                  isActive 
                    ? 'bg-primary-container text-white' 
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800'
                }`
              }
            >
              <FolderTree size={18} />
              <span>Categories</span>
            </NavLink>
          </nav>
        </div>

        {/* User profile & controls */}
        <div className="p-6 border-t border-outline-variant dark:border-zinc-800 flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight text-on-surface dark:text-zinc-200">{displayName}</div>
              <div className="text-[10px] text-on-surface-variant dark:text-zinc-400 leading-none truncate max-w-[140px]">{displayEmail}</div>
            </div>
          </div>

          <div className="flex md:flex-col gap-2">
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-lg hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Theme"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span className="hidden md:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-lg hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="hidden md:inline">View Site</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 text-xs font-semibold text-error hover:bg-error-container/20 px-3 py-2 rounded-lg transition-colors"
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
