import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Search, BookOpen, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Close overlays on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface dark:bg-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-surface/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-outline-variant dark:border-zinc-800 transition-colors duration-200">
        <nav 
          aria-label="Main Navigation"
          className="h-20 flex items-center justify-between px-6 md:px-12 max-w-[1200px] w-full mx-auto"
        >
          <Link 
            to="/" 
            className="font-sans font-extrabold text-2xl md:text-3xl text-on-background dark:text-zinc-100 tracking-tight focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            SignalAI
          </Link>
          
          {/* Desktop navigation */}
          <ul className="hidden md:flex space-x-8 items-center">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `font-sans text-sm font-semibold transition-colors duration-200 pb-1 ${
                    isActive ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/blog" 
                className={({ isActive }) => 
                  `font-sans text-sm font-semibold transition-colors duration-200 pb-1 ${
                    isActive ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary'
                  }`
                }
              >
                All Articles
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `font-sans text-sm font-semibold transition-colors duration-200 pb-1 ${
                    isActive ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary'
                  }`
                }
              >
                Contact
              </NavLink>
            </li>
            <li>
              <Link 
                to={isAuthenticated ? '/admin/dashboard' : '/login'} 
                className="font-sans text-sm font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <User size={16} />
                <span>{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
              </Link>
            </li>
          </ul>

          {/* Header Controls */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 text-sm font-semibold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search articles"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Search</span>
            </button>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Search overlay bar */}
      {searchOpen && (
        <div 
          role="search"
          className="bg-surface-container dark:bg-zinc-900 border-b border-outline-variant dark:border-zinc-800 py-4 px-6 sticky top-20 z-20 transition-colors duration-200 shadow-lg"
        >
          <form onSubmit={handleSearchSubmit} className="max-w-[1200px] mx-auto flex items-center gap-3">
            <Search size={20} className="text-on-surface-variant dark:text-zinc-400 shrink-0" />
            <input 
              type="search" 
              placeholder="Search by title, topic, or keyword..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 focus:ring-0 text-body-md font-serif text-on-surface dark:text-zinc-100 placeholder:text-outline text-lg"
              autoFocus
              aria-label="Search articles query"
            />
            <button 
              type="button" 
              onClick={() => setSearchOpen(false)}
              className="text-sm font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary px-3 py-1.5 rounded"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="md:hidden fixed inset-0 top-20 bg-surface dark:bg-zinc-900 z-40 border-t border-outline-variant dark:border-zinc-800 flex flex-col p-6 space-y-6 transition-colors duration-200 overflow-y-auto"
        >
          <NavLink 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => 
              `font-sans text-lg font-bold ${isActive ? 'text-primary' : 'text-on-surface dark:text-zinc-200'}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/blog" 
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => 
              `font-sans text-lg font-bold ${isActive ? 'text-primary' : 'text-on-surface dark:text-zinc-200'}`
            }
          >
            All Articles
          </NavLink>
          <NavLink 
            to="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => 
              `font-sans text-lg font-bold ${isActive ? 'text-primary' : 'text-on-surface dark:text-zinc-200'}`
            }
          >
            Contact
          </NavLink>
          <Link 
            to={isAuthenticated ? '/admin/dashboard' : '/login'} 
            onClick={() => setMobileMenuOpen(false)}
            className="font-sans text-lg font-bold text-on-surface dark:text-zinc-200 flex items-center gap-2"
          >
            <User size={20} />
            <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
          </Link>

          <div className="pt-4 border-t border-outline-variant dark:border-zinc-800">
            <button 
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="font-sans text-lg font-bold text-on-surface dark:text-zinc-200 flex items-center gap-2 text-left w-full"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-8 md:py-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-zinc-900 border-t border-outline-variant dark:border-zinc-800 py-12 px-6 transition-colors duration-200">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary" size={24} />
            <span className="font-sans font-extrabold text-lg text-on-background dark:text-zinc-200 tracking-tight">SignalAI</span>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 font-sans text-center">
            &copy; {new Date().getFullYear()} SignalAI. Crafted with clarity, structural honesty, and focus.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant dark:text-zinc-400">
            <Link to="/contact" className="hover:text-primary dark:hover:text-primary">Contact Desk</Link>
            <span>&bull;</span>
            <Link to={isAuthenticated ? '/admin/dashboard' : '/login'} className="hover:text-primary dark:hover:text-primary">
              {isAuthenticated ? 'Admin Dashboard' : 'Admin Access'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
