import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsApi } from '../../services/api';
import { Post } from '../../types';
import { Calendar, User, ArrowLeft, Tag, Clock } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { SafeContent } from '../../components/SafeContent';
import { useAuth } from '../../context/AuthContext';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const activePost = await postsApi.getPostBySlug(slug);
        
        if (!activePost) {
          if (mounted) setLoading(false);
          return;
        }

        // Only admins can preview drafts
        if (activePost.status === 'Draft' && !isAdmin) {
          if (mounted) {
            setPost(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setPost(activePost);
        }

        // Fetch related posts if category exists
        if (activePost.category_id) {
          const related = await postsApi.getRelatedPosts(activePost.category_id, activePost.id, 3);
          if (mounted) setRelatedPosts(related);
        }
      } catch (err) {
        console.error('[PostDetail.loadPost error]', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPost();
    return () => { mounted = false; };
  }, [slug, isAdmin]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Recent';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto space-y-8 animate-pulse py-8">
        <div className="h-4 bg-surface-container dark:bg-zinc-800 w-32 rounded" />
        <div className="h-12 bg-surface-container dark:bg-zinc-800 w-full rounded" />
        <div className="h-4 bg-surface-container dark:bg-zinc-800 w-64 rounded" />
        <div className="aspect-[16/9] bg-surface-container dark:bg-zinc-800 rounded-xl" />
        <div className="space-y-4 pt-6">
          <div className="h-5 bg-surface-container dark:bg-zinc-800 w-full rounded" />
          <div className="h-5 bg-surface-container dark:bg-zinc-800 w-full rounded" />
          <div className="h-5 bg-surface-container dark:bg-zinc-800 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-24 space-y-4">
        <h1 className="font-sans font-extrabold text-3xl text-on-background dark:text-zinc-100">
          Article Not Found
        </h1>
        <p className="font-serif text-base text-on-surface-variant dark:text-zinc-400 max-w-md mx-auto">
          The essay you are looking for may have been removed, unpublished, or the URL has changed.
        </p>
        <div className="pt-4">
          <Link 
            to="/blog"
            className="inline-block px-5 py-2.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors"
          >
            Browse All Articles
          </Link>
        </div>
      </div>
    );
  }

  const isDraft = post.status === 'Draft';

  return (
    <article className="space-y-12">
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        slug={`blog/${post.slug}`}
        ogImage={post.featured_image}
        ogType="article"
        publishedTime={post.published_at || post.created_at}
        authorName={post.author?.name || 'Elena Rostova'}
        noIndex={isDraft}
      />

      {/* Scroll Progress Bar */}
      <div 
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollProgress)}
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100 ease-out" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Draft Preview Warning Banner */}
      {isDraft && (
        <div className="max-w-[700px] mx-auto p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-800 dark:text-amber-300 text-xs font-sans font-semibold flex items-center justify-between">
          <span>⚠️ You are previewing an unindexed Draft article. Only administrators can view this page.</span>
          <Link to="/admin/posts" className="underline hover:text-amber-900">Edit in CMS</Link>
        </div>
      )}

      {/* Back button & Category */}
      <header className="max-w-[700px] mx-auto space-y-6">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
        >
          <ArrowLeft size={16} />
          <span>Back to all articles</span>
        </Link>

        <div className="space-y-4">
          {post.category && (
            <Link 
              to={`/category/${post.category.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-container uppercase font-sans tracking-wider hover:underline"
            >
              <Tag size={12} />
              <span>{post.category.name}</span>
            </Link>
          )}
          
          <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Author/Date Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant dark:text-zinc-400 font-sans border-y border-outline-variant/30 dark:border-zinc-800/40 py-4">
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>By {post.author?.name || 'Elena Rostova'}</span>
            </div>
            <span className="hidden sm:inline text-outline">&bull;</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={post.published_at || post.created_at}>{formatDate(post.published_at || post.created_at)}</time>
            </div>
            <span className="hidden sm:inline text-outline">&bull;</span>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{post.reading_time} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-[1000px] mx-auto overflow-hidden rounded-xl border border-outline-variant/30 dark:border-zinc-800/30 bg-surface-container dark:bg-zinc-950 aspect-[16/9]">
        <img 
          src={post.featured_image} 
          alt={post.title} 
          loading="eager"
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Article Body Content */}
      <div className="max-w-[700px] mx-auto">
        <SafeContent content={post.content} />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section aria-label="Related Articles" className="max-w-[900px] mx-auto border-t border-outline-variant/45 dark:border-zinc-800/60 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100">
              Related Articles
            </h2>
            {post.category && (
              <Link 
                to={`/category/${post.category.slug}`}
                className="text-xs font-semibold text-primary dark:text-primary-container hover:underline"
              >
                More in {post.category.name} &rarr;
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(rel => (
              <Link 
                to={`/blog/${rel.slug}`} 
                key={rel.id} 
                className="group block space-y-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2 hover:bg-surface-container/20 dark:hover:bg-zinc-900/30 transition-colors"
              >
                <div className="overflow-hidden rounded-lg aspect-[16/10] bg-surface-container dark:bg-zinc-950">
                  <img 
                    src={rel.featured_image} 
                    alt={rel.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <h3 className="font-sans font-bold text-base text-on-background dark:text-zinc-100 group-hover:text-primary dark:group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
                  {rel.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-on-surface-variant dark:text-zinc-400 font-sans">
                  <span>{rel.reading_time} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
