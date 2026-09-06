import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Search, BookOpen, Sun, Moon, 
  ShieldCheck, LogOut, ChevronDown, Lock 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, user, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close overlays on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Handle keyboard shortcuts (Cmd/Ctrl + K for search, ESC to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface dark:bg-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-200 antialiased selection:bg-primary/20 selection:text-primary">
      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:font-semibold text-xs transition-all"
      >
        Skip to main content
      </a>

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-outline-variant/60 dark:border-zinc-800/80 transition-colors duration-200">
        <nav 
          aria-label="Main Navigation"
          className="h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto"
        >
          {/* Brand Logo & Editorial Wordmark */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="group flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none rounded-lg py-1 px-1.5 -ml-1.5 transition-all"
              aria-label="Neural Brief Homepage"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                <BookOpen size={18} />
              </div>
              <span className="font-sans font-extrabold text-2xl tracking-tight text-on-background dark:text-zinc-100 group-hover:text-primary transition-colors">
                Neural Brief
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <li>
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => 
                    `px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                      isActive 
                        ? 'text-primary bg-primary/10 dark:bg-primary/15' 
                        : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-200 hover:bg-surface-container/60 dark:hover:bg-zinc-800/60'
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
                    `px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                      isActive 
                        ? 'text-primary bg-primary/10 dark:bg-primary/15' 
                        : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-200 hover:bg-surface-container/60 dark:hover:bg-zinc-800/60'
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
                    `px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                      isActive 
                        ? 'text-primary bg-primary/10 dark:bg-primary/15' 
                        : 'text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-200 hover:bg-surface-container/60 dark:hover:bg-zinc-800/60'
                    }`
                  }
                >
                  Contact Desk
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger Button */}
            <button 
              onClick={() => setSearchOpen(true)} 
              className="text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-100 hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border border-transparent hover:border-outline-variant dark:hover:border-zinc-700 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Search articles"
              title="Search (Ctrl + K)"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface-container-high dark:bg-zinc-800 text-on-surface-variant dark:text-zinc-400 border border-outline-variant/50 dark:border-zinc-700">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-100 hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Role-Based User / Admin Controls */}
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                {isAdmin ? (
                  // Admin User: Show dedicated CMS action with Admin Badge
                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin/dashboard"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-white text-xs font-bold transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      title="Open Editorial CMS Dashboard"
                    >
                      <ShieldCheck size={15} />
                      <span>CMS Dashboard</span>
                    </Link>

                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      aria-label="User account menu"
                      aria-expanded={userDropdownOpen}
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center uppercase border border-primary/30">
                        {displayName.charAt(0)}
                      </div>
                      <ChevronDown size={14} className="text-on-surface-variant dark:text-zinc-400" />
                    </button>
                  </div>
                ) : (
                  // Regular User: Discrete profile badge without Admin buttons
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface dark:text-zinc-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    aria-label="User account menu"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-7 h-7 rounded-full bg-surface-container-high dark:bg-zinc-800 text-on-surface dark:text-zinc-200 font-bold text-xs flex items-center justify-center uppercase border border-outline-variant dark:border-zinc-700">
                      {displayName.charAt(0)}
                    </div>
                    <ChevronDown size={14} className="text-on-surface-variant dark:text-zinc-400" />
                  </button>
                )}

                {/* Account Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-outline-variant/40 dark:border-zinc-800/80">
                      <p className="text-xs font-bold text-on-background dark:text-zinc-100 truncate">{displayName}</p>
                      <p className="text-[11px] text-on-surface-variant dark:text-zinc-400 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                          Administrator
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-on-surface dark:text-zinc-200 hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
                      >
                        <ShieldCheck size={15} className="text-primary" />
                        <span>CMS Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-error hover:bg-error-container/20 transition-colors text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile Navigation Drawer Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden text-on-surface-variant dark:text-zinc-400 hover:text-on-surface dark:hover:text-zinc-100 hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Search Modal Overlay */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            role="search"
            aria-label="Sitewide article search"
            className="w-full max-w-2xl bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b border-outline-variant/60 dark:border-zinc-800 pb-3">
              <Search size={22} className="text-primary shrink-0" />
              <input 
                ref={searchInputRef}
                type="search" 
                placeholder="Search articles by title, topic, or keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-base sm:text-lg font-serif text-on-surface dark:text-zinc-100 placeholder:text-outline focus:outline-none"
                aria-label="Search articles input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full"
                  aria-label="Clear search input"
                >
                  <X size={16} />
                </button>
              )}
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary-container hover:bg-primary text-white text-xs font-bold rounded-lg transition-colors shadow-sm shrink-0"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant dark:text-zinc-400 gap-2 pt-1">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface-container dark:bg-zinc-800 font-mono text-[10px] border border-outline-variant dark:border-zinc-700">ESC</kbd> to close</span>
              <div className="flex items-center gap-2">
                <span>Popular:</span>
                <button type="button" onClick={() => { setSearchQuery('Brutalism'); }} className="hover:text-primary underline">Brutalism</button>
                <button type="button" onClick={() => { setSearchQuery('Interface'); }} className="hover:text-primary underline">Interface</button>
                <button type="button" onClick={() => { setSearchQuery('Minimalism'); }} className="hover:text-primary underline">Minimalism</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden fixed inset-0 top-20 bg-surface/98 dark:bg-zinc-950/98 backdrop-blur-xl z-40 border-t border-outline-variant/60 dark:border-zinc-800/80 flex flex-col p-6 space-y-6 transition-all duration-200 overflow-y-auto animate-in slide-in-from-top-4"
        >
          <nav className="flex flex-col space-y-2">
            <NavLink 
              to="/" 
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center justify-between px-4 py-3.5 rounded-xl font-sans text-base font-bold transition-all min-h-[44px] ${
                  isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'text-on-surface dark:text-zinc-200 hover:bg-surface-container dark:hover:bg-zinc-900'
                }`
              }
            >
              <span>Home</span>
            </NavLink>
            <NavLink 
              to="/blog" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center justify-between px-4 py-3.5 rounded-xl font-sans text-base font-bold transition-all min-h-[44px] ${
                  isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'text-on-surface dark:text-zinc-200 hover:bg-surface-container dark:hover:bg-zinc-900'
                }`
              }
            >
              <span>All Articles</span>
            </NavLink>
            <NavLink 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center justify-between px-4 py-3.5 rounded-xl font-sans text-base font-bold transition-all min-h-[44px] ${
                  isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'text-on-surface dark:text-zinc-200 hover:bg-surface-container dark:hover:bg-zinc-900'
                }`
              }
            >
              <span>Contact Desk</span>
            </NavLink>

            {/* Admin CMS link in mobile drawer (Only for admins) */}
            {isAdmin && (
              <NavLink 
                to="/admin/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl font-sans text-base font-bold transition-all min-h-[44px] ${
                    isActive 
                      ? 'bg-primary-container text-white' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`
                }
              >
                <ShieldCheck size={18} />
                <span>CMS Dashboard</span>
              </NavLink>
            )}
          </nav>

          {/* User Status / Logout Section in Mobile */}
          {isAuthenticated && (
            <div className="pt-4 border-t border-outline-variant/60 dark:border-zinc-800/80 space-y-3">
              <div className="px-2">
                <p className="text-xs font-bold text-on-surface dark:text-zinc-100">{displayName}</p>
                <p className="text-[11px] text-on-surface-variant dark:text-zinc-400">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-error-container/20 text-error font-sans text-sm font-bold hover:bg-error-container/30 transition-colors min-h-[44px]"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 focus:outline-none">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-zinc-900 border-t border-outline-variant/60 dark:border-zinc-800/80 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-white">
              <BookOpen size={16} />
            </div>
            <span className="font-sans font-extrabold text-lg text-on-background dark:text-zinc-100 tracking-tight">Neural Brief</span>
          </div>

          <p className="text-xs text-on-surface-variant dark:text-zinc-400 font-sans text-center md:text-left">
            &copy; {new Date().getFullYear()} Neural Brief. A high-clarity publication for design, culture, and technology.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-xs font-semibold text-on-surface-variant dark:text-zinc-400">
            <Link to="/" className="hover:text-primary dark:hover:text-primary transition-colors">Home</Link>
            <span>&bull;</span>
            <Link to="/blog" className="hover:text-primary dark:hover:text-primary transition-colors">Archive</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-primary dark:hover:text-primary transition-colors">Contact</Link>
            <span>&bull;</span>
            {isAuthenticated ? (
              isAdmin ? (
                <Link to="/admin/dashboard" className="text-primary hover:underline font-bold flex items-center gap-1">
                  <ShieldCheck size={13} />
                  <span>CMS Dashboard</span>
                </Link>
              ) : null
            ) : (
              <Link 
                to="/login" 
                className="hover:text-primary dark:hover:text-primary transition-colors opacity-75 hover:opacity-100 flex items-center gap-1 text-[11px]" 
                title="Editorial Staff Sign In"
              >
                <Lock size={12} />
                <span>Staff Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
