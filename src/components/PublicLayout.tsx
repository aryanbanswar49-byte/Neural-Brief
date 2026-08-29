import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Search, BookOpen, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const PublicLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface dark:bg-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="bg-surface border-b border-outline-variant dark:bg-zinc-900 dark:border-zinc-800 h-20 flex items-center justify-between px-6 md:px-12 max-w-[1200px] w-full mx-auto sticky top-0 z-30 transition-colors duration-200">
        <Link to="/" className="font-sans font-extrabold text-2xl md:text-3xl text-on-background dark:text-zinc-100 tracking-tight">
          The Editorial
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
            <Link to="/login" className="font-sans text-sm font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1.5">
              <User size={16} />
              Admin
            </Link>
          </li>
        </ul>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors p-1"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            className="text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <Search size={20} />
            <span className="hidden sm:inline">Search</span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Search overlay bar */}
      {searchOpen && (
        <div className="bg-surface-container dark:bg-zinc-900 border-b border-outline-variant dark:border-zinc-800 py-4 px-6 sticky top-20 z-20 transition-colors duration-200">
          <form onSubmit={handleSearchSubmit} className="max-w-[1200px] mx-auto flex items-center gap-3">
            <Search size={20} className="text-on-surface-variant dark:text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search articles, topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 focus:ring-0 text-body-md font-serif text-on-surface dark:text-zinc-100 placeholder:text-outline text-lg"
              autoFocus
            />
            <button 
              type="button" 
              onClick={() => setSearchOpen(false)}
              className="text-sm font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-surface dark:bg-zinc-900 z-40 border-t border-outline-variant dark:border-zinc-800 flex flex-col p-6 space-y-6 transition-colors duration-200">
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
            to="/login" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-sans text-lg font-bold text-on-surface dark:text-zinc-200 flex items-center gap-2"
          >
            <User size={20} />
            Admin Dashboard
          </Link>

          <button 
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
            }}
            className="font-sans text-lg font-bold text-on-surface dark:text-zinc-200 flex items-center gap-2 text-left"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-8 md:py-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-zinc-900 border-t border-outline-variant dark:border-zinc-800 py-12 px-6 transition-colors duration-200">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary" size={24} />
            <span className="font-sans font-extrabold text-lg text-on-background dark:text-zinc-200 tracking-tight">The Editorial</span>
          </div>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 font-sans text-center">
            &copy; {new Date().getFullYear()} The Editorial. Crafted with extreme typography clarity and focus.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant dark:text-zinc-400">
            <Link to="/contact" className="hover:text-primary dark:hover:text-primary">Contact Desk</Link>
            <span>&bull;</span>
            <Link to="/login" className="hover:text-primary dark:hover:text-primary">Admin Access</Link>
            <span>&bull;</span>
            <a href="#" className="hover:text-primary dark:hover:text-primary">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
