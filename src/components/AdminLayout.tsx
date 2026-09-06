import React, { useState } from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, FileText, FolderTree, ArrowLeft, 
  LogOut, Loader2, Sun, Moon, Menu, X, Shield 
} from 'lucide-react';
import { SEO } from './SEO';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, user, profile, logout, loading, isAdmin, isAuthor } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-low dark:bg-zinc-950 gap-4">
        <Loader2 className="animate-spin text-primary" size={36} />
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
  if (profile && !isAdmin && !isAuthor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-low dark:bg-zinc-950 p-6 text-center">
        <SEO title="Unauthorized Access | Neural Brief" noIndex={true} />
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-xl space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-error-container/20 text-error flex items-center justify-center mx-auto border border-error-container/30">
            <Shield size={28} />
          </div>
          <h2 className="font-sans font-extrabold text-2xl text-on-background dark:text-zinc-100">
            Access Restricted
          </h2>
          <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-400 leading-relaxed">
            Your account (<strong className="text-on-surface dark:text-zinc-200">{user?.email}</strong>) does not have administrative permissions to access the Neural Brief CMS.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-4 py-2.5 border border-outline-variant dark:border-zinc-800 rounded-xl text-xs font-bold hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200 transition-colors"
            >
              Return Home
            </button>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2.5 bg-primary-container text-white rounded-xl text-xs font-bold hover:bg-primary transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Administrator';
  const displayEmail = user?.email || 'admin@neuralbrief.com';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface-container-low dark:bg-zinc-950 text-on-surface dark:text-zinc-50 transition-colors duration-200 font-sans">
      <SEO title="Editorial CMS | Neural Brief" noIndex={true} />

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface-container-lowest dark:bg-zinc-900 border-b border-outline-variant/60 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="font-sans font-extrabold text-lg text-on-background dark:text-zinc-100 tracking-tight">Neural Brief</span>
          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full uppercase border border-primary/20">CMS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant dark:text-zinc-400 hover:text-on-surface rounded-lg"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-on-surface-variant dark:text-zinc-400 hover:text-on-surface rounded-lg"
            aria-label={mobileNavOpen ? 'Close CMS menu' : 'Open CMS menu'}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileNavOpen && (
        <div className="md:hidden bg-surface-container-lowest dark:bg-zinc-900 border-b border-outline-variant/60 dark:border-zinc-800 p-4 space-y-2 animate-in slide-in-from-top-2">
          <NavLink 
            to="/admin/dashboard" 
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive ? 'bg-primary-container text-white' : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container dark:hover:bg-zinc-800'
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Overview</span>
          </NavLink>
          <NavLink 
            to="/admin/posts" 
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive ? 'bg-primary-container text-white' : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container dark:hover:bg-zinc-800'
              }`
            }
          >
            <FileText size={18} />
            <span>Manage Posts</span>
          </NavLink>
          <NavLink 
            to="/admin/categories" 
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive ? 'bg-primary-container text-white' : 'text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container dark:hover:bg-zinc-800'
              }`
            }
          >
            <FolderTree size={18} />
            <span>Categories</span>
          </NavLink>

          <div className="pt-3 border-t border-outline-variant/60 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary py-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-error hover:underline py-2"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <aside 
        aria-label="Admin Navigation"
        className="hidden md:flex w-64 bg-surface-container-lowest dark:bg-zinc-900 border-r border-outline-variant/60 dark:border-zinc-800 flex-col justify-between shrink-0 transition-colors duration-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="font-sans font-extrabold text-xl text-on-background dark:text-zinc-100 tracking-tight">Neural Brief</span>
            <span className="text-[10px] px-2.5 py-0.5 bg-primary/10 text-primary font-extrabold rounded-full uppercase tracking-wider border border-primary/20">CMS</span>
          </div>
          
          <nav className="space-y-1.5" aria-label="CMS Sidebar Links">
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-primary-container text-white shadow-sm' 
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-100 hover:bg-surface-container dark:hover:bg-zinc-800'
                }`
              }
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/admin/posts" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-primary-container text-white shadow-sm' 
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-100 hover:bg-surface-container dark:hover:bg-zinc-800'
                }`
              }
            >
              <FileText size={17} />
              <span>Manage Posts</span>
            </NavLink>
            <NavLink 
              to="/admin/categories" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-primary-container text-white shadow-sm' 
                    : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-100 hover:bg-surface-container dark:hover:bg-zinc-800'
                }`
              }
            >
              <FolderTree size={17} />
              <span>Categories</span>
            </NavLink>
          </nav>
        </div>

        {/* Desktop User Profile & Controls */}
        <div className="p-6 border-t border-outline-variant/60 dark:border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-on-surface dark:text-zinc-200 truncate">{displayName}</div>
              <div className="text-[10px] text-on-surface-variant dark:text-zinc-400 truncate max-w-[140px]">{displayEmail}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-lg hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors w-full text-left"
            >
              <ArrowLeft size={14} />
              <span>View Live Site</span>
            </button>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-200 px-3 py-2 rounded-lg hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors w-full text-left"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold text-error hover:bg-error-container/20 px-3 py-2 rounded-lg transition-colors w-full text-left"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
