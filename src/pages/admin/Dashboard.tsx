import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../services/db';
import { DashboardStats, Post, Category } from '../../types';
import { Edit2, Plus, RefreshCw, Eye } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const loadData = () => {
    setStats(db.getStats());
    const allPosts = db.getPosts().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setRecentPosts(allPosts.slice(0, 5));
    setCategories(db.getCategories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetDatabase = () => {
    if (window.confirm('Are you sure you want to reset the database to the original 5 articles? This will erase all custom articles.')) {
      db.reset();
      loadData();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-3xl text-on-background dark:text-zinc-100">Dashboard Overview</h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            Real-time analytics and management interface for The Editorial.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetDatabase}
            className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container dark:hover:bg-zinc-800 rounded text-xs font-semibold transition-colors text-on-surface dark:text-zinc-200"
            title="Reset database to default posts"
          >
            <RefreshCw size={14} />
            <span>Reset Demo DB</span>
          </button>
          <button 
            onClick={() => navigate('/admin/posts')}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary text-white rounded text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Write Article</span>
          </button>
        </div>
      </header>

      {/* Stats Cards Row */}
      {stats && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-5 transition-colors duration-200">
            <div className="text-[10px] font-bold text-on-surface-variant dark:text-zinc-400 uppercase tracking-wider">Total Articles</div>
            <div className="text-3xl font-extrabold text-on-background dark:text-zinc-100 mt-2">{stats.totalPosts}</div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-5 transition-colors duration-200">
            <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Published</div>
            <div className="text-3xl font-extrabold text-primary mt-2">{stats.publishedCount}</div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-5 transition-colors duration-200">
            <div className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Drafts</div>
            <div className="text-3xl font-extrabold text-tertiary mt-2">{stats.draftsCount}</div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-5 transition-colors duration-200">
            <div className="text-[10px] font-bold text-on-surface-variant dark:text-zinc-400 uppercase tracking-wider">Categories</div>
            <div className="text-3xl font-extrabold text-on-background dark:text-zinc-100 mt-2">{stats.totalCategories}</div>
          </div>
        </section>
      )}

      {/* Recent Activity Table */}
      <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-6 space-y-4 transition-colors duration-200">
        <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100">Recent Articles</h3>
        
        {recentPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 dark:border-zinc-800 text-on-surface-variant dark:text-zinc-400 font-sans text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date Created</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 dark:divide-zinc-800/60 font-serif">
                {recentPosts.map(post => (
                  <tr key={post.id} className="hover:bg-surface-container-low/30 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-sans font-bold text-on-background dark:text-zinc-100">{post.title}</div>
                      <div className="text-xs text-on-surface-variant dark:text-zinc-400 mt-0.5 line-clamp-1">{post.excerpt}</div>
                    </td>
                    <td className="py-3.5 pr-4 font-sans text-xs text-on-surface-variant dark:text-zinc-400">
                      {categories.find(c => c.id === post.categoryId)?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-block font-sans text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        post.status === 'Published' 
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-container' 
                          : 'bg-on-surface-variant/10 text-on-surface-variant dark:bg-zinc-850 dark:text-zinc-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-sans text-xs text-on-surface-variant dark:text-zinc-400">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="py-3.5 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'Published' && (
                          <Link 
                            to={`/post/${post.slug}`}
                            className="p-1.5 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded transition-colors"
                            title="View published article"
                          >
                            <Eye size={16} />
                          </Link>
                        )}
                        <button 
                          onClick={() => navigate('/admin/posts', { state: { editPostId: post.id } })}
                          className="p-1.5 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded transition-colors"
                          title="Edit article"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-on-surface-variant dark:text-zinc-400">
            No articles found. Write your first article to see it here!
          </div>
        )}
      </section>
    </div>
  );
};
