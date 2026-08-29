import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { db } from '../../services/db';
import { Post, Category } from '../../types';
import { Calendar, Tag } from 'lucide-react';

export const BlogListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('All Articles');
  const [description, setDescription] = useState('');

  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('q');

  useEffect(() => {
    const allPosts = db.getPublishedPosts();
    const allCats = db.getCategories();
    setCategories(allCats);

    let result = [...allPosts];

    if (categoryParam) {
      const selectedCat = allCats.find(c => c.id === categoryParam);
      if (selectedCat) {
        result = result.filter(p => p.categoryId === categoryParam);
        setTitle(selectedCat.name);
        setDescription(selectedCat.description);
      }
    } else if (searchParam) {
      const query = searchParam.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query) || p.content.toLowerCase().includes(query)
      );
      setTitle(`Search Results`);
      setDescription(`Showing articles matching "${searchParam}"`);
    } else {
      setTitle('All Articles');
      setDescription('Browse our entire collection of high-quality long-form essays and stories.');
    }

    setFilteredPosts(result);
  }, [categoryParam, searchParam]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-12">
      {/* Category / Search Header */}
      <header className="border-b border-outline-variant/30 dark:border-zinc-800/40 pb-8 animate-fade-in">
        <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 tracking-tight mb-3">
          {title}
        </h1>
        {description && (
          <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </header>

      {/* Articles Feed */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Link to={`/post/${post.slug}`} key={post.id} className="group block cursor-pointer bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800/50 rounded-lg p-5 transition-all duration-300 hover:shadow-md">
              <div className="overflow-hidden rounded mb-4 aspect-[16/10]">
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 bg-surface-container dark:bg-zinc-800 px-2.5 py-1 rounded text-xs font-semibold text-primary dark:text-primary-container uppercase font-sans">
                  <Tag size={12} />
                  {categories.find(c => c.id === post.categoryId)?.name || 'Article'}
                </span>
                
                <h3 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100 group-hover:text-primary dark:group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                
                <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-300 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant dark:text-zinc-400 font-sans pt-2 border-t border-outline-variant/20 dark:border-zinc-800/50">
                  <Calendar size={12} />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-container/20 dark:bg-zinc-900/20 rounded-lg border border-dashed border-outline-variant dark:border-zinc-800">
          <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-400">
            No articles found matching your criteria.
          </p>
          <Link to="/blog" className="inline-block mt-4 text-sm font-semibold text-primary dark:text-primary-container hover:underline">
            View All Articles
          </Link>
        </div>
      )}
    </div>
  );
};
