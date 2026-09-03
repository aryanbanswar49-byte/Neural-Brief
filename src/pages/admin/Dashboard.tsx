import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { statsApi, postsApi, categoriesApi } from '../../services/api';
import { DashboardStats, Post, Category } from '../../types';
import { Edit2, Plus, Eye, FolderTree, Loader2, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, postsRes, catsRes] = await Promise.all([
        statsApi.getDashboardStats(),
        postsApi.getAllPostsAdmin(),
        categoriesApi.getCategories()
      ]);
      setStats(statsRes);
      setRecentPosts(postsRes.slice(0, 5));
      setCategories(catsRes);
    } catch (err) {
      console.error('[Dashboard.loadData error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
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
          <h1 className="font-sans font-bold text-3xl text-on-background dark:text-zinc-100">
            Neural Brief CMS Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            Real-time content metrics, article publishing, and category management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/categories')}
            className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold transition-colors text-on-surface dark:text-zinc-200"
          >
            <FolderTree size={14} />
            <span>Manage Categories</span>
          </button>
          <button 
            onClick={() => navigate('/admin/posts', { state: { openNew: true } })}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-primary text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Write Article</span>
          </button>
        </div>
      </header>

      {/* Stats Cards Row */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="animate-pulse bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="h-3 bg-surface-container dark:bg-zinc-800 w-20 rounded" />
              <div className="h-8 bg-surface-container dark:bg-zinc-800 w-12 rounded" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <section aria-label="Key Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-5 transition-colors duration-200 shadow-sm">
            <div className="text-[10px] font-bold text-on-surface-variant dark:text-zinc-400 uppercase tracking-wider">Total Articles</div>
            <div className="text-3xl font-extrabold text-on-background dark:text-zinc-100 mt-2">{stats.totalPosts}</div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-5 transition-colors duration-200 shadow-sm">
            <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Published</div>
            <div className="text-3xl font-extrabold text-primary mt-2">{stats.publishedCount}</div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-5 transition-colors duration-200 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Drafts</div>
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{stats.draftsCount}</div>
          </div>
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-5 transition-colors duration-200 shadow-sm">
            <div className="text-[10px] font-bold text-on-surface-variant dark:text-zinc-400 uppercase tracking-wider">Categories</div>
            <div className="text-3xl font-extrabold text-on-background dark:text-zinc-100 mt-2">{stats.totalCategories}</div>
          </div>
        </section>
      ) : null}

      {/* Recent Activity Table */}
      <section aria-label="Recent Articles" className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-6 space-y-4 transition-colors duration-200 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100">
            Recent Articles
          </h2>
          <Link 
            to="/admin/posts"
            className="text-xs font-semibold text-primary dark:text-primary-container hover:underline flex items-center gap-1"
          >
            <span>View all articles</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : recentPosts.length > 0 ? (
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
                      {post.category?.name || categories.find(c => c.id === post.category_id)?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-block font-sans text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        post.status === 'Published' 
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-container' 
                          : 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-sans text-xs text-on-surface-variant dark:text-zinc-400">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="py-3.5 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'Published' && (
                          <Link 
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            title="View published article in new tab"
                            aria-label={`View article ${post.title}`}
                          >
                            <Eye size={16} />
                          </Link>
                        )}
                        <button 
                          onClick={() => navigate('/admin/posts', { state: { editPostId: post.id } })}
                          className="p-1.5 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Edit article"
                          aria-label={`Edit article ${post.title}`}
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
          <div className="text-center py-12 text-on-surface-variant dark:text-zinc-400">
            No articles found. Write your first article to see it here!
          </div>
        )}
      </section>
    </div>
  );
};
