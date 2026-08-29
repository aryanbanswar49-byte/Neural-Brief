import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../services/db';
import { Post, Category, PostStatus } from '../../types';
import { Plus, Edit2, Trash2, Search, X, Eye, FileText } from 'lucide-react';

export const PostManagement: React.FC = () => {
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  // Form states (Modal/Drawer)
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStatus, setFormStatus] = useState<PostStatus>('Draft');
  const [formImage, setFormImage] = useState('');

  const loadData = () => {
    const allPosts = db.getPosts().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const allCats = db.getCategories();
    setPosts(allPosts);
    setCategories(allCats);
    if (allCats.length > 0 && !formCategory) {
      setFormCategory(allCats[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen for navigation state from Dashboard edit button
  useEffect(() => {
    const state = location.state as { editPostId?: string } | null;
    if (state?.editPostId && posts.length > 0) {
      const postToEdit = posts.find(p => p.id === state.editPostId);
      if (postToEdit) {
        handleOpenEdit(postToEdit);
      }
      window.history.replaceState(null, '');
    }
  }, [location.state, posts]);

  // Apply filters
  useEffect(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }

    if (statusFilter !== 'All') {
      result = result.filter(p => p.status === statusFilter);
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, statusFilter]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormExcerpt('');
    setFormContent('');
    if (categories.length > 0) {
      setFormCategory(categories[0].id);
    }
    setFormStatus('Draft');
    setFormImage('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60');
    setFormOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCategory(post.categoryId);
    setFormStatus(post.status);
    setFormImage(post.featuredImage);
    setFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formContent.trim()) {
      alert('Please fill out Title and Content.');
      return;
    }

    const generatedSlug = formTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const postData = {
      title: formTitle,
      slug: generatedSlug,
      excerpt: formExcerpt || formTitle.slice(0, 120) + '...',
      content: formContent,
      featuredImage: formImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60',
      categoryId: formCategory,
      status: formStatus,
    };

    if (editingPost) {
      db.updatePost(editingPost.id, postData);
    } else {
      db.addPost(postData);
    }

    setFormOpen(false);
    loadData();
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      db.deletePost(id);
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
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-3xl text-on-background dark:text-zinc-100">Manage Articles</h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            Write, review, publish, and delete blog articles.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-container text-white hover:bg-primary rounded text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Write Article</span>
        </button>
      </header>

      {/* Filter Row */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-4 transition-colors duration-200">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-outline-variant dark:border-zinc-850 rounded p-2.5 pl-9 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
          />
          <Search size={16} className="absolute left-3 top-3 text-outline" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-on-surface-variant dark:text-zinc-400 uppercase tracking-wide">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-outline-variant dark:border-zinc-850 rounded px-3 py-2 bg-background dark:bg-zinc-950 font-sans text-xs text-on-surface dark:text-zinc-200 font-semibold focus:border-primary-container"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </section>

      {/* Table grid */}
      <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg overflow-hidden transition-colors duration-200">
        {filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 dark:border-zinc-800 bg-surface-container-low/20 dark:bg-zinc-900/50 text-on-surface-variant dark:text-zinc-400 font-sans text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Article Info</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Created Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 dark:divide-zinc-800/60 font-serif">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-surface-container-low/30 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 flex items-start gap-4">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title} 
                        className="w-16 h-12 object-cover rounded border border-outline-variant/30 dark:border-zinc-800 shrink-0" 
                      />
                      <div className="space-y-0.5">
                        <div className="font-sans font-bold text-base text-on-background dark:text-zinc-100 line-clamp-1">{post.title}</div>
                        <div className="text-xs text-on-surface-variant dark:text-zinc-400 line-clamp-1">{post.excerpt}</div>
                      </div>
                    </td>
                    <td className="p-4 font-sans text-xs text-on-surface-variant dark:text-zinc-400">
                      {categories.find(c => c.id === post.categoryId)?.name || 'Uncategorized'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block font-sans text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        post.status === 'Published' 
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-container' 
                          : 'bg-on-surface-variant/10 text-on-surface-variant dark:bg-zinc-850 dark:text-zinc-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-xs text-on-surface-variant dark:text-zinc-400">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="p-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'Published' && (
                          <a 
                            href={`/post/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded transition-colors"
                            title="View article"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                        <button 
                          onClick={() => handleOpenEdit(post)}
                          className="p-2 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded transition-colors"
                          title="Edit article"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-error hover:bg-error-container/20 rounded transition-colors"
                          title="Delete article"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-on-surface-variant dark:text-zinc-400 font-serif">
            No articles match your selection.
          </div>
        )}
      </section>

      {/* Write/Edit Form Drawer (Overlay Modal) */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl transition-colors duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/60 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                {editingPost ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button 
                onClick={() => setFormOpen(false)}
                className="p-1 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full text-on-surface-variant dark:text-zinc-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable form) */}
            <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. The Aesthetics of Space Design"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>

              {/* Grid 2-cols: Category & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">Category</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-sans text-sm focus:border-primary-container"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PostStatus)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-sans text-sm focus:border-primary-container"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {/* Featured Image URL */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">Featured Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/image.jpg"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">Excerpt</label>
                <textarea 
                  placeholder="A short summary of the article..."
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>

              {/* Content Body */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">Article Body Content</label>
                <textarea 
                  placeholder="Write your article in plain text or simple markdown format..."
                  required
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all leading-relaxed"
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/60 dark:border-zinc-800 bg-surface-container-low/20 dark:bg-zinc-900/50 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container dark:hover:bg-zinc-800 rounded text-xs font-semibold text-on-surface dark:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSave}
                className="px-5 py-2 bg-primary-container text-white hover:bg-primary rounded text-xs font-semibold transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
