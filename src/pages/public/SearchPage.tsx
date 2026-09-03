import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { postsApi } from '../../services/api';
import { Post } from '../../types';
import { Search, Tag, Calendar, Clock, X, ArrowRight, Loader2 } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [queryInput, setQueryInput] = useState(queryParam);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setQueryInput(queryParam);
    if (!queryParam.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    let mounted = true;
    const performSearch = async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const posts = await postsApi.searchPosts(queryParam);
        if (mounted) setResults(posts);
      } catch (err) {
        console.error('[SearchPage error]', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    performSearch();
    return () => { mounted = false; };
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      setSearchParams({ q: queryInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setQueryInput('');
    setSearchParams({});
    setResults([]);
    setHasSearched(false);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Recent';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-12">
      <SEO 
        title={queryParam ? `Search results for "${queryParam}" | SignalAI` : 'Search Articles | SignalAI'}
        description="Search through essays, articles, critiques, and stories across SignalAI."
        slug="search"
        noIndex={true} // Search results pages should not pollute search engine indexes
      />

      {/* Header & Search Bar */}
      <header className="border-b border-outline-variant/30 dark:border-zinc-800/40 pb-8 space-y-6">
        <div>
          <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 tracking-tight mb-2">
            Search SignalAI
          </h1>
          <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300">
            Find articles across architectural history, contemporary design, minimalism, and culture.
          </p>
        </div>

        {/* Input box */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <input 
            type="search" 
            placeholder="Search by topic, keyword, or author..." 
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="w-full border border-outline-variant dark:border-zinc-800 rounded-xl p-4 pl-12 pr-28 bg-surface-container-lowest dark:bg-zinc-900 text-on-background dark:text-zinc-100 font-serif text-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all shadow-sm"
            autoFocus
            aria-label="Search articles"
          />
          <Search size={22} className="absolute left-4 top-4 text-outline" />
          
          <div className="absolute right-3 top-2.5 flex items-center gap-1">
            {queryInput && (
              <button 
                type="button" 
                onClick={handleClear}
                className="p-2 text-on-surface-variant dark:text-zinc-400 hover:text-primary rounded-lg"
                aria-label="Clear search input"
              >
                <X size={18} />
              </button>
            )}
            <button 
              type="submit"
              className="px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {hasSearched && !loading && (
          <div className="text-xs font-sans text-on-surface-variant dark:text-zinc-400">
            Showing <span className="font-bold text-on-background dark:text-zinc-200">{results.length}</span> {results.length === 1 ? 'result' : 'results'} for <span className="font-bold text-primary dark:text-primary-container">"{queryParam}"</span>
          </div>
        )}
      </header>

      {/* Results Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="text-xs font-sans text-on-surface-variant dark:text-zinc-400">Searching archive...</span>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(post => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.id} 
              className="group block cursor-pointer bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800/50 rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="overflow-hidden rounded-lg mb-4 aspect-[16/10] bg-surface-container dark:bg-zinc-950">
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-surface-container dark:bg-zinc-800 px-2.5 py-1 rounded text-xs font-semibold text-primary dark:text-primary-container uppercase font-sans">
                    <Tag size={12} />
                    {post.category?.name || 'Article'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-on-surface-variant dark:text-zinc-400 font-sans">
                    <Clock size={12} />
                    {post.reading_time}m
                  </span>
                </div>
                
                <h3 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100 group-hover:text-primary dark:group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                
                <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-300 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-on-surface-variant dark:text-zinc-400 font-sans pt-3 border-t border-outline-variant/20 dark:border-zinc-800/50">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  <span className="text-primary dark:text-primary-container font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : hasSearched ? (
        <div className="text-center py-20 bg-surface-container/20 dark:bg-zinc-900/20 rounded-xl border border-dashed border-outline-variant dark:border-zinc-800 space-y-4">
          <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300">
            No articles found matching "{queryParam}".
          </p>
          <p className="font-sans text-xs text-on-surface-variant dark:text-zinc-400 max-w-sm mx-auto">
            Try checking for spelling errors, using more general keywords, or browsing our category archive.
          </p>
          <div className="pt-2">
            <Link 
              to="/blog" 
              className="inline-block px-5 py-2.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-on-surface-variant dark:text-zinc-400 font-serif">
          Enter a search query above to browse articles.
        </div>
      )}
    </div>
  );
};
