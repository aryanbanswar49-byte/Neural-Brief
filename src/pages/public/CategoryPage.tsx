import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsApi } from '../../services/api';
import { Post, Category } from '../../types';
import { Calendar, Tag, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadCategoryPosts = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await postsApi.getPostsByCategory(slug);
        if (mounted) {
          setCategory(res.category);
          setPosts(res.posts);
        }
      } catch (err) {
        console.error('[CategoryPage.loadCategoryPosts error]', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCategoryPosts();
    return () => { mounted = false; };
  }, [slug]);

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
        title={category ? `${category.name} | SignalAI` : 'Category | SignalAI'}
        description={category?.description || `Explore articles and essays categorized under ${category?.name || 'this topic'}.`}
        slug={slug ? `category/${slug}` : 'blog'}
      />

      {/* Header */}
      <header className="border-b border-outline-variant/30 dark:border-zinc-800/40 pb-8 space-y-4">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary-container transition-colors"
        >
          <ArrowLeft size={14} />
          <span>All categories</span>
        </Link>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-surface-container dark:bg-zinc-800 w-48 rounded" />
            <div className="h-5 bg-surface-container dark:bg-zinc-800 w-96 rounded" />
          </div>
        ) : category ? (
          <>
            <div className="flex items-center gap-3">
              <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 tracking-tight">
                {category.name}
              </h1>
              <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary font-bold rounded-full">
                {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>
            {category.description && (
              <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            )}
          </>
        ) : (
          <h1 className="font-sans font-extrabold text-3xl text-on-background dark:text-zinc-100">
            Category Not Found
          </h1>
        )}
      </header>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="animate-pulse bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800/50 rounded-xl p-5 space-y-4">
              <div className="aspect-[16/10] bg-surface-container dark:bg-zinc-800 rounded-lg" />
              <div className="h-6 bg-surface-container dark:bg-zinc-800 w-full rounded" />
              <div className="h-12 bg-surface-container dark:bg-zinc-800 w-full rounded" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
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
                    {category?.name || 'Article'}
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
      ) : (
        <div className="text-center py-20 bg-surface-container/20 dark:bg-zinc-900/20 rounded-xl border border-dashed border-outline-variant dark:border-zinc-800">
          <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-400">
            No published articles found in this category yet.
          </p>
          <Link 
            to="/blog" 
            className="inline-block mt-4 text-sm font-semibold text-primary dark:text-primary-container hover:underline"
          >
            Browse All Articles
          </Link>
        </div>
      )}
    </div>
  );
};
