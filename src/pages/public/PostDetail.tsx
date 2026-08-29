import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import { Post, Category } from '../../types';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (slug) {
      const activePost = db.getPostBySlug(slug);
      if (activePost) {
        setPost(activePost);
        const allCats = db.getCategories();
        setCategories(allCats);
        
        const allPosts = db.getPublishedPosts();
        const related = allPosts
          .filter(p => p.categoryId === activePost.categoryId && p.id !== activePost.id)
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        navigate('/blog');
      }
    }
  }, [slug, navigate]);

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="font-sans font-bold text-2xl text-on-background dark:text-zinc-100 mt-8 mb-4">
            {trimmed.slice(4)}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="font-sans font-bold text-3xl text-on-background dark:text-zinc-100 mt-10 mb-5">
            {trimmed.slice(3)}
          </h2>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map(item => item.replace(/^[-*]\s+/, ''));
        return (
          <ul key={index} className="list-disc pl-6 space-y-2 my-4 font-serif text-lg leading-relaxed text-on-surface-variant dark:text-zinc-300">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        );
      }
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').map(item => item.replace(/^\d+\.\s+/, ''));
        return (
          <ol key={index} className="list-decimal pl-6 space-y-2 my-4 font-serif text-lg leading-relaxed text-on-surface-variant dark:text-zinc-300">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
          </ol>
        );
      }
      return (
        <p key={index} className="font-serif text-lg md:text-xl text-on-surface-variant dark:text-zinc-300 leading-relaxed mb-6">
          {trimmed}
        </p>
      );
    });
  };

  if (!post) return null;

  return (
    <article className="space-y-12">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100 ease-out" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Back button & Category */}
      <header className="max-w-[700px] mx-auto space-y-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to all articles
        </Link>

        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-container uppercase font-sans tracking-wider">
            <Tag size={12} />
            {categories.find(c => c.id === post.categoryId)?.name || 'Article'}
          </span>
          
          <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 leading-tight">
            {post.title}
          </h1>

          {/* Author/Date Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant dark:text-zinc-400 font-sans border-y border-outline-variant/30 dark:border-zinc-800/40 py-4">
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>By Elena Rostova</span>
            </div>
            <span className="hidden sm:inline text-outline">&bull;</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <span className="hidden sm:inline text-outline">&bull;</span>
            <span>6 min read</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-[1000px] mx-auto overflow-hidden rounded-xl border border-outline-variant/30 dark:border-zinc-800/30">
        <img 
          src={post.featuredImage} 
          alt={post.title} 
          className="w-full h-auto max-h-[500px] object-cover" 
        />
      </div>

      {/* Article Body Content */}
      <div className="max-w-[700px] mx-auto prose prose-slate dark:prose-invert">
        {renderContent(post.content)}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-[900px] mx-auto border-t border-outline-variant/45 dark:border-zinc-800/60 pt-12 space-y-6">
          <h3 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(rel => (
              <Link to={`/post/${rel.slug}`} key={rel.id} className="group block space-y-3">
                <div className="overflow-hidden rounded aspect-[16/10]">
                  <img 
                    src={rel.featuredImage} 
                    alt={rel.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <h4 className="font-sans font-bold text-base text-on-background dark:text-zinc-100 group-hover:text-primary dark:group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
                  {rel.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
