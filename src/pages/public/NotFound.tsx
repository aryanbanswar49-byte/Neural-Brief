import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Home } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <SEO title="Page Not Found | Neural Brief" noIndex={true} />

      <div className="w-16 h-16 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center text-primary">
        <BookOpen size={28} />
      </div>

      <div className="space-y-2">
        <span className="font-sans font-extrabold text-sm tracking-widest text-primary uppercase">404 Error</span>
        <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 tracking-tight">
          Page Not Found
        </h1>
        <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          The page you requested could not be located. It may have been archived, renamed, or temporarily moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors shadow-sm"
        >
          <Home size={16} />
          <span>Return Home</span>
        </Link>
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container dark:bg-zinc-800 text-on-surface dark:text-zinc-200 text-xs font-semibold rounded-lg hover:bg-surface-container-high dark:hover:bg-zinc-700 transition-colors border border-outline-variant/40 dark:border-zinc-700"
        >
          <ArrowLeft size={16} />
          <span>Browse All Articles</span>
        </Link>
      </div>
    </div>
  );
};
