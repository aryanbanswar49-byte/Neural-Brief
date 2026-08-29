import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import { Post, Category } from '../../types';
import { Search } from 'lucide-react';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchVal, setSearchVal] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(db.getPublishedPosts());
    setCategories(db.getCategories());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subEmail.trim()) {
      setSubscribed(true);
      setSubEmail('');
    }
  };

  const getPostCountForCategory = (catId: string) => {
    return posts.filter(p => p.categoryId === catId).length;
  };

  const formatDate = (dateStr: string) => {
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
      {/* Hero: Featured Post */}
      {heroPost && (
        <section className="border-b border-outline-variant/30 dark:border-zinc-800/30 pb-16">
          <Link to={`/post/${heroPost.slug}`} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center group cursor-pointer">
            <div className="md:col-span-7 overflow-hidden rounded-lg">
              <img 
                src={heroPost.featuredImage} 
                alt={heroPost.title} 
                className="w-full h-auto aspect-video object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
              />
            </div>
            <div className="md:col-span-5 flex flex-col justify-center">
              <span className="font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2 uppercase tracking-widest">
                {categories.find(c => c.id === heroPost.categoryId)?.name || 'Article'}
              </span>
              <h1 className="font-sans font-extrabold text-3xl md:text-4xl text-on-background dark:text-zinc-100 mb-4 group-hover:text-primary transition-colors leading-tight">
                {heroPost.title}
              </h1>
              <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300 mb-6 line-clamp-3 leading-relaxed">
                {heroPost.excerpt}
              </p>
              <div className="flex items-center space-x-3 text-xs text-on-surface-variant dark:text-zinc-400 font-sans">
                <span>By Elena Rostova</span>
                <span>&bull;</span>
                <span>{formatDate(heroPost.createdAt)}</span>
                <span>&bull;</span>
                <span>6 min read</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Main Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left: Latest Articles */}
        <div className="lg:col-span-8 space-y-10">
          <h2 className="font-sans font-bold text-2xl text-on-background dark:text-zinc-100 pb-3 border-b border-outline-variant dark:border-zinc-800">
            Latest Articles
          </h2>
          
          {gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {gridPosts.map(post => (
                <Link to={`/post/${post.slug}`} key={post.id} className="group block cursor-pointer">
                  <div className="overflow-hidden rounded mb-4">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <span className="font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2 block uppercase tracking-wide">
                    {categories.find(c => c.id === post.categoryId)?.name || 'Article'}
                  </span>
                  <h3 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="font-serif text-base text-on-surface-variant dark:text-zinc-300 mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="text-xs text-on-surface-variant dark:text-zinc-400 font-sans">
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant dark:text-zinc-400 font-serif">No additional articles published yet.</p>
          )}
        </div>

        {/* Right: Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          
          {/* Search Widget */}
          <div className="bg-surface dark:bg-zinc-900 p-6 border border-outline-variant dark:border-zinc-800 rounded-lg transition-colors duration-200">
            <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 mb-4">Search</h3>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Keywords..." 
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 pl-10 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
              />
              <Search size={18} className="absolute left-3 top-3.5 text-outline" />
            </form>
          </div>

          {/* Categories Widget */}
          <div className="bg-surface dark:bg-zinc-900 p-6 border border-outline-variant dark:border-zinc-800 rounded-lg transition-colors duration-200">
            <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 mb-4">Categories</h3>
            <ul className="space-y-3 font-serif text-base text-on-surface-variant dark:text-zinc-300">
              {categories.map((cat, index) => (
                <li key={cat.id}>
                  <Link 
                    to={`/blog?category=${cat.id}`} 
                    className={`flex justify-between items-center group hover:text-primary transition-colors py-1 ${
                      index < categories.length - 1 ? 'border-b border-outline-variant/30 dark:border-zinc-800/30' : ''
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="font-sans text-xs text-outline group-hover:text-primary">
                      {getPostCountForCategory(cat.id)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Widget */}
          <div className="bg-surface-container-low dark:bg-zinc-900/60 p-6 border border-outline-variant dark:border-zinc-800 rounded-lg transition-colors duration-200">
            <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 mb-2">Weekly Digest</h3>
            <p className="font-serif text-base text-on-surface-variant dark:text-zinc-300 mb-4 leading-relaxed">
              Curated essays and editorial pieces delivered directly to your inbox every Sunday.
            </p>
            {subscribed ? (
              <div className="p-3 bg-primary-container/10 border border-primary-container/30 text-primary text-sm font-semibold rounded text-center">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  required
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
                <button 
                  type="submit" 
                  className="w-full bg-primary-container text-white font-sans font-semibold py-3 px-4 rounded hover:bg-primary transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
