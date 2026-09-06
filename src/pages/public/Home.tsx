import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsApi, categoriesApi, newsletterApi } from '../../services/api';
import { Post, Category } from '../../types';
import { Search, Loader2, Clock, CheckCircle2, AlertCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subState, setSubState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subMessage, setSubMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadInitialData = async () => {
      try {
        const [{ data: postsData }, catsData] = await Promise.all([
          postsApi.getPublishedPosts(7),
          categoriesApi.getCategories()
        ]);
        if (mounted) {
          setPosts(postsData);
          setCategories(catsData);
        }
      } catch (err) {
        console.error('[Home.loadInitialData error]', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadInitialData();
    return () => { mounted = false; };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;

    setSubState('loading');
    setSubMessage('');

    try {
      const res = await newsletterApi.subscribe(subEmail);
      if (res.success) {
        setSubState('success');
        setSubMessage(res.message || 'Thank you for subscribing to our weekly digest.');
        setSubEmail('');
      } else {
        setSubState('error');
        setSubMessage(res.message || 'Subscription failed.');
      }
    } catch (err: any) {
      setSubState('error');
      setSubMessage(err.message || 'Failed to process subscription.');
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Recent';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const heroPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="space-y-16 sm:space-y-20">
      <SEO 
        title="Neural Brief | High-Clarity Design & Technology Journal"
        description="A curated digital publication exploring contemporary architecture, minimalist living spaces, culture, and interface design."
        slug=""
      />

      {loading ? (
        <div className="space-y-12 animate-pulse">
          {/* Hero Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center pb-12 border-b border-outline-variant/40 dark:border-zinc-800/60">
            <div className="md:col-span-7 bg-surface-container dark:bg-zinc-900 aspect-[16/10] rounded-2xl" />
            <div className="md:col-span-5 space-y-4">
              <div className="h-4 bg-surface-container dark:bg-zinc-900 w-24 rounded-full" />
              <div className="h-8 bg-surface-container dark:bg-zinc-900 w-full rounded-lg" />
              <div className="h-8 bg-surface-container dark:bg-zinc-900 w-3/4 rounded-lg" />
              <div className="h-16 bg-surface-container dark:bg-zinc-900 w-full rounded-lg" />
              <div className="h-4 bg-surface-container dark:bg-zinc-900 w-36 rounded" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="space-y-3">
                <div className="aspect-[16/10] bg-surface-container dark:bg-zinc-900 rounded-xl" />
                <div className="h-3 bg-surface-container dark:bg-zinc-900 w-20 rounded" />
                <div className="h-5 bg-surface-container dark:bg-zinc-900 w-full rounded" />
                <div className="h-12 bg-surface-container dark:bg-zinc-900 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section: Featured Story */}
          {heroPost && (
            <section aria-label="Featured Story" className="border-b border-outline-variant/40 dark:border-zinc-800/60 pb-12 sm:pb-16">
              <Link 
                to={`/blog/${heroPost.slug}`} 
                className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center rounded-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none transition-all"
              >
                <div className="md:col-span-7 overflow-hidden rounded-2xl bg-surface-container-high dark:bg-zinc-900 aspect-[16/10] shadow-sm">
                  <img 
                    src={heroPost.featured_image} 
                    alt={heroPost.title} 
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                </div>
                <div className="md:col-span-5 flex flex-col justify-center space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {heroPost.category?.name || 'Featured Story'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant dark:text-zinc-400 font-sans">
                      {formatDate(heroPost.published_at || heroPost.created_at)}
                    </span>
                  </div>

                  <h2 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-on-background dark:text-zinc-100 group-hover:text-primary dark:group-hover:text-primary-container transition-colors leading-tight tracking-tight">
                    {heroPost.title}
                  </h2>

                  <p className="font-serif text-base sm:text-lg text-on-surface-variant dark:text-zinc-300 line-clamp-3 leading-relaxed">
                    {heroPost.excerpt}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-on-surface-variant dark:text-zinc-400 font-sans pt-2">
                    <span>By {heroPost.author?.name || 'Editorial Team'}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {heroPost.reading_time} min read
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Main Feed + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left Column: Latest Articles Grid */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <h2 className="font-sans font-bold text-xl sm:text-2xl text-on-background dark:text-zinc-100">
                    Latest Dispatches
                  </h2>
                </div>
                <Link 
                  to="/blog" 
                  className="font-sans text-xs font-bold text-primary dark:text-primary-container hover:underline flex items-center gap-1 group"
                >
                  <span>Explore archive</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              
              {gridPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12">
                  {gridPosts.map(post => (
                    <Link 
                      to={`/blog/${post.slug}`} 
                      key={post.id} 
                      className="group flex flex-col cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl focus-visible:outline-none"
                    >
                      <div className="overflow-hidden rounded-xl mb-4 bg-surface-container dark:bg-zinc-900 aspect-[16/10] shadow-sm">
                        <img 
                          src={post.featured_image} 
                          alt={post.title} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-extrabold text-primary dark:text-primary uppercase tracking-wider">
                          {post.category?.name || 'Article'}
                        </span>
                        <span className="text-[11px] text-on-surface-variant dark:text-zinc-400">&bull;</span>
                        <span className="text-[11px] text-on-surface-variant dark:text-zinc-400 font-sans">
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                      </div>
                      <h3 className="font-sans font-bold text-lg sm:text-xl text-on-background dark:text-zinc-100 mb-2 group-hover:text-primary dark:group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="font-serif text-sm sm:text-base text-on-surface-variant dark:text-zinc-300 mb-4 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center space-x-2 text-xs text-on-surface-variant dark:text-zinc-400 font-sans">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.reading_time} min read
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-surface-container/30 dark:bg-zinc-900/30 rounded-2xl border border-outline-variant/40 dark:border-zinc-800">
                  <p className="text-on-surface-variant dark:text-zinc-400 font-serif text-base">
                    No additional articles published yet. Check back soon for new pieces.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar Widgets */}
            <aside aria-label="Sidebar Content" className="lg:col-span-4 space-y-8 sm:space-y-10">
              
              {/* Search Widget */}
              <div className="bg-surface-container-lowest dark:bg-zinc-900/90 p-5 sm:p-6 border border-outline-variant/60 dark:border-zinc-800 rounded-2xl transition-colors duration-200 shadow-sm">
                <h3 className="font-sans font-bold text-base text-on-background dark:text-zinc-100 mb-3">Search Publication</h3>
                <form onSubmit={handleSearch} className="relative">
                  <label htmlFor="sidebar-search" className="sr-only">Search articles</label>
                  <input 
                    id="sidebar-search"
                    type="search" 
                    placeholder="Search by topic, keyword..." 
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  />
                  <Search size={16} className="absolute left-3.5 top-3 text-on-surface-variant dark:text-zinc-400" />
                </form>
              </div>

              {/* Categories Widget */}
              <div className="bg-surface-container-lowest dark:bg-zinc-900/90 p-5 sm:p-6 border border-outline-variant/60 dark:border-zinc-800 rounded-2xl transition-colors duration-200 shadow-sm">
                <h3 className="font-sans font-bold text-base text-on-background dark:text-zinc-100 mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <span>Curated Topics</span>
                </h3>
                <ul className="space-y-1 font-serif text-sm text-on-surface-variant dark:text-zinc-300">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link 
                        to={`/category/${cat.slug}`} 
                        className="flex justify-between items-center group hover:text-primary dark:hover:text-primary px-2 py-2 rounded-lg hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="font-sans text-xs px-2 py-0.5 rounded-full bg-surface-container dark:bg-zinc-800 text-on-surface-variant dark:text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors font-bold">
                          {cat.post_count ?? 0}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter Digest Widget */}
              <div className="bg-surface-container-low dark:bg-zinc-900/60 p-5 sm:p-6 border border-outline-variant/60 dark:border-zinc-800 rounded-2xl transition-colors duration-200 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  @
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-on-background dark:text-zinc-100">Weekly Editorial Digest</h3>
                  <p className="font-serif text-xs sm:text-sm text-on-surface-variant dark:text-zinc-400 mt-1 leading-relaxed">
                    Thoughtful essays, interface critiques, and design observations delivered every Sunday.
                  </p>
                </div>

                {subState === 'success' ? (
                  <div className="p-3.5 bg-primary/10 border border-primary/30 text-primary text-xs font-semibold rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{subMessage}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
                    {subState === 'error' && (
                      <div className="p-2.5 bg-error-container/20 border border-error-container text-error text-xs rounded-lg flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{subMessage}</span>
                      </div>
                    )}
                    <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                    <input 
                      id="newsletter-email"
                      type="email" 
                      placeholder="name@domain.com" 
                      required
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      className="w-full border border-outline-variant dark:border-zinc-800 rounded-xl p-2.5 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-sans text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    />
                    <button 
                      type="submit" 
                      disabled={subState === 'loading'}
                      className="w-full bg-primary-container text-white font-sans text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-primary transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm min-h-[40px]"
                    >
                      {subState === 'loading' ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};
