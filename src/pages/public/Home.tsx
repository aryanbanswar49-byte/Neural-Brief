import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsApi, categoriesApi, newsletterApi } from '../../services/api';
import { Post, Category } from '../../types';
import { Search, Loader2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="space-y-16">
      <SEO 
        title="Neural Brief | High-Clarity Design & Technology Journal"
        description="A curated digital publication exploring contemporary architecture, minimalist living spaces, culture, and interface design."
        slug=""
      />

      {loading ? (
        <div className="space-y-12">
          {/* Hero Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center animate-pulse pb-16 border-b border-outline-variant/30 dark:border-zinc-800/30">
            <div className="md:col-span-7 bg-surface-container dark:bg-zinc-800 h-80 md:h-96 rounded-xl" />
            <div className="md:col-span-5 space-y-4">
              <div className="h-4 bg-surface-container dark:bg-zinc-800 w-24 rounded" />
              <div className="h-10 bg-surface-container dark:bg-zinc-800 w-full rounded" />
              <div className="h-20 bg-surface-container dark:bg-zinc-800 w-full rounded" />
              <div className="h-4 bg-surface-container dark:bg-zinc-800 w-40 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero: Featured Post */}
          {heroPost && (
            <section aria-label="Featured Story" className="border-b border-outline-variant/30 dark:border-zinc-800/30 pb-16">
              <Link 
                to={`/blog/${heroPost.slug}`} 
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
              >
                <div className="md:col-span-7 overflow-hidden rounded-xl bg-surface-container dark:bg-zinc-900 aspect-video">
                  <img 
                    src={heroPost.featured_image} 
                    alt={heroPost.title} 
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
                  />
                </div>
                <div className="md:col-span-5 flex flex-col justify-center">
                  <span className="font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2 uppercase tracking-widest">
                    {heroPost.category?.name || 'Featured Article'}
                  </span>
                  <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-on-background dark:text-zinc-100 mb-4 group-hover:text-primary dark:group-hover:text-primary-container transition-colors leading-tight">
                    {heroPost.title}
                  </h2>
                  <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300 mb-6 line-clamp-3 leading-relaxed">
                    {heroPost.excerpt}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-on-surface-variant dark:text-zinc-400 font-sans">
                    <span>By {heroPost.author?.name || 'Elena Rostova'}</span>
                    <span>&bull;</span>
                    <span>{formatDate(heroPost.published_at || heroPost.created_at)}</span>
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

          {/* Main Grid + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Latest Articles */}
            <div className="lg:col-span-8 space-y-10">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant dark:border-zinc-800">
                <h2 className="font-sans font-bold text-2xl text-on-background dark:text-zinc-100">
                  Latest Articles
                </h2>
                <Link 
                  to="/blog" 
                  className="font-sans text-xs font-semibold text-primary dark:text-primary-container hover:underline"
                >
                  View all &rarr;
                </Link>
              </div>
              
              {gridPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  {gridPosts.map(post => (
                    <Link 
                      to={`/blog/${post.slug}`} 
                      key={post.id} 
                      className="group block cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                    >
                      <div className="overflow-hidden rounded-lg mb-4 bg-surface-container dark:bg-zinc-900 aspect-[16/10]">
                        <img 
                          src={post.featured_image} 
                          alt={post.title} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <span className="font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2 block uppercase tracking-wide">
                        {post.category?.name || 'Article'}
                      </span>
                      <h3 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100 mb-2 group-hover:text-primary dark:group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="font-serif text-base text-on-surface-variant dark:text-zinc-300 mb-4 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-on-surface-variant dark:text-zinc-400 font-sans">
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.reading_time} min read
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-on-surface-variant dark:text-zinc-400 font-serif py-8">
                  No additional articles published yet.
                </p>
              )}
            </div>

            {/* Right: Sidebar */}
            <aside aria-label="Sidebar Content" className="lg:col-span-4 space-y-12">
              
              {/* Search Widget */}
              <div className="bg-surface dark:bg-zinc-900 p-6 border border-outline-variant dark:border-zinc-800 rounded-xl transition-colors duration-200">
                <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 mb-4">Search</h3>
                <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="search" 
                    placeholder="Keywords, topics..." 
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 pl-10 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                    aria-label="Search articles"
                  />
                  <Search size={18} className="absolute left-3 top-3.5 text-outline" />
                </form>
              </div>

              {/* Categories Widget */}
              <div className="bg-surface dark:bg-zinc-900 p-6 border border-outline-variant dark:border-zinc-800 rounded-xl transition-colors duration-200">
                <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 mb-4">Categories</h3>
                <ul className="space-y-3 font-serif text-base text-on-surface-variant dark:text-zinc-300">
                  {categories.map((cat, index) => (
                    <li key={cat.id}>
                      <Link 
                        to={`/category/${cat.slug}`} 
                        className={`flex justify-between items-center group hover:text-primary dark:hover:text-primary-container transition-colors py-1 ${
                          index < categories.length - 1 ? 'border-b border-outline-variant/30 dark:border-zinc-800/30' : ''
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="font-sans text-xs text-outline group-hover:text-primary dark:group-hover:text-primary-container">
                          {cat.post_count ?? 0}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter Widget */}
              <div className="bg-surface-container-low dark:bg-zinc-900/60 p-6 border border-outline-variant dark:border-zinc-800 rounded-xl transition-colors duration-200">
                <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 mb-2">Weekly Digest</h3>
                <p className="font-serif text-base text-on-surface-variant dark:text-zinc-300 mb-4 leading-relaxed">
                  Curated essays and editorial pieces delivered directly to your inbox every Sunday.
                </p>
                {subState === 'success' ? (
                  <div className="p-4 bg-primary/10 border border-primary/30 text-primary text-xs font-semibold rounded-lg flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>{subMessage}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    {subState === 'error' && (
                      <div className="p-3 bg-error-container/20 border border-error-container text-error text-xs rounded-lg flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{subMessage}</span>
                      </div>
                    )}
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      required
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                      aria-label="Email address for newsletter"
                    />
                    <button 
                      type="submit" 
                      disabled={subState === 'loading'}
                      className="w-full bg-primary-container text-white font-sans font-semibold py-3 px-4 rounded-lg hover:bg-primary transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {subState === 'loading' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
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
