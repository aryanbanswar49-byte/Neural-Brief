import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsApi } from '../../services/api';
import { Post } from '../../types';
import { Calendar, User, ArrowLeft, Tag, Clock, Check, Copy, Twitter, Linkedin } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareTwitter = () => {
    if (!post) return;
    const text = encodeURIComponent(`${post.title} — Neural Brief\n`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-pulse py-8">
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
    <article className="space-y-12 pb-16">
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

      {/* Scroll Reading Progress Bar */}
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
        <div className="max-w-3xl mx-auto p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-800 dark:text-amber-300 text-xs font-sans font-semibold flex items-center justify-between">
          <span>⚠️ You are previewing an unindexed Draft article. Only administrators can view this page.</span>
          <Link to="/admin/posts" className="underline hover:text-amber-900">Edit in CMS</Link>
        </div>
      )}

      {/* Header & Meta */}
      <header className="max-w-3xl mx-auto space-y-6">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
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

          {/* Author / Date / Share Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-on-surface-variant dark:text-zinc-400 font-sans border-y border-outline-variant/30 dark:border-zinc-800/40 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span className="font-semibold text-on-background dark:text-zinc-200">By {post.author?.name || 'Elena Rostova'}</span>
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

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShareTwitter}
                className="p-1.5 rounded-md hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface-variant dark:text-zinc-400 hover:text-primary transition-colors"
                title="Share on X (Twitter)"
                aria-label="Share on X"
              >
                <Twitter size={15} />
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="p-1.5 rounded-md hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface-variant dark:text-zinc-400 hover:text-primary transition-colors"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={15} />
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container dark:bg-zinc-800 hover:bg-surface-container-high dark:hover:bg-zinc-700 text-on-surface-variant dark:text-zinc-300 transition-colors font-sans text-xs font-semibold"
                title="Copy article link"
                aria-label="Copy article link"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-primary dark:text-primary-container" />
                    <span className="text-primary dark:text-primary-container">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-outline-variant/30 dark:border-zinc-800/30 bg-surface-container dark:bg-zinc-950 aspect-[16/9]">
        <img 
          src={post.featured_image} 
          alt={post.title} 
          loading="eager"
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Article Body Content */}
      <div className="max-w-3xl mx-auto">
        <SafeContent content={post.content} />
      </div>

      {/* Author Bio Card */}
      <div className="max-w-3xl mx-auto mt-12 p-6 rounded-xl bg-surface-container-low/40 dark:bg-zinc-900/60 border border-outline-variant/30 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container dark:bg-zinc-800 shrink-0 border border-outline-variant dark:border-zinc-700">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
            alt={post.author?.name || 'Elena Rostova'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-sans font-bold text-base text-on-background dark:text-zinc-100">
            {post.author?.name || 'Elena Rostova'}
          </div>
          <div className="text-xs text-primary font-semibold font-sans">
            Lead Editor &amp; Architectural Critic
          </div>
          <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-300 leading-relaxed pt-1">
            Writing at the intersection of architectural theory, structural minimalism, and modern cultural critique.
          </p>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section aria-label="Related Articles" className="max-w-4xl mx-auto border-t border-outline-variant/45 dark:border-zinc-800/60 pt-12 space-y-6">
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
