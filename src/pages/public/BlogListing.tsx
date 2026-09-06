import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postsApi, categoriesApi } from '../../services/api';
import { Post, Category } from '../../types';
import { Calendar, Tag, Clock, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/SEO';

const POSTS_PER_PAGE = 9;

export const BlogListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(POSTS_PER_PAGE);

  const categoryQuery = searchParams.get('category');

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const [postsRes, catsRes] = await Promise.all([
          postsApi.getPublishedPosts(),
          categoriesApi.getCategories()
        ]);
        if (mounted) {
          setPosts(postsRes.data);
          setCategories(catsRes);
        }
      } catch (err) {
        console.error('[BlogListing.loadData error]', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategorySlug(categoryQuery);
    } else {
      setSelectedCategorySlug('all');
    }
  }, [categoryQuery]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setVisibleCount(POSTS_PER_PAGE);
    if (slug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  };

  const filteredPosts = selectedCategorySlug === 'all'
    ? posts
    : posts.filter(p => p.category?.slug === selectedCategorySlug || p.category_id === selectedCategorySlug);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

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
        title="All Articles | Neural Brief"
        description="Browse our complete archive of in-depth essays, architectural critiques, culture reflections, and design explorations."
        slug="blog"
      />

      {/* Header */}
      <header className="border-b border-outline-variant/30 dark:border-zinc-800/40 pb-8">
        <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 tracking-tight mb-3">
          All Articles
        </h1>
        <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300 max-w-2xl leading-relaxed">
          Browse our entire collection of high-quality long-form essays, critiques, and design stories.
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Article categories">
          <button
            role="tab"
            aria-selected={selectedCategorySlug === 'all'}
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              selectedCategorySlug === 'all'
                ? 'bg-primary-container text-white shadow-sm'
                : 'bg-surface-container dark:bg-zinc-800 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary-container'
            }`}
          >
            All Articles ({posts.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={selectedCategorySlug === cat.slug}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                selectedCategorySlug === cat.slug
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'bg-surface-container dark:bg-zinc-800 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary-container'
              }`}
            >
              {cat.name} ({cat.post_count ?? 0})
            </button>
          ))}
        </div>
      </header>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="animate-pulse bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800/50 rounded-xl p-5 space-y-4">
              <div className="aspect-[16/10] bg-surface-container dark:bg-zinc-800 rounded-lg" />
              <div className="h-4 bg-surface-container dark:bg-zinc-800 w-20 rounded" />
              <div className="h-6 bg-surface-container dark:bg-zinc-800 w-full rounded" />
              <div className="h-12 bg-surface-container dark:bg-zinc-800 w-full rounded" />
            </div>
          ))}
        </div>
      ) : visiblePosts.length > 0 ? (
        <div className="space-y-12">
          {/* Articles Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map(post => (
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

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}
                className="px-8 py-3 bg-surface-container dark:bg-zinc-800 hover:bg-surface-container-high dark:hover:bg-zinc-700 text-on-surface dark:text-zinc-100 font-sans font-semibold text-sm rounded-lg transition-colors border border-outline-variant/50 dark:border-zinc-700 shadow-sm"
              >
                Load More Articles ({filteredPosts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-container/20 dark:bg-zinc-900/20 rounded-xl border border-dashed border-outline-variant dark:border-zinc-800">
          <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-400">
            No articles found for this category filter.
          </p>
          <button 
            onClick={() => handleCategorySelect('all')}
            className="inline-block mt-4 text-sm font-semibold text-primary dark:text-primary-container hover:underline"
          >
            Show All Articles
          </button>
        </div>
      )}
    </div>
  );
};
