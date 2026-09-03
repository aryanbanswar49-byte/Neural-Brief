import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { postsApi, categoriesApi, generateSlug } from '../../services/api';
import { Post, Category, PostStatus } from '../../types';
import { 
  Plus, Edit2, Trash2, Search, X, Eye, FileText, Upload, 
  CheckCircle2, AlertCircle, Loader2, Sparkles, Link as LinkIcon 
} from 'lucide-react';
import { SafeContent } from '../../components/SafeContent';

export const PostManagement: React.FC = () => {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Form States (Drawer / Modal)
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formStatus, setFormStatus] = useState<PostStatus>('Draft');
  const [formImage, setFormImage] = useState('');
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDescription, setFormMetaDescription] = useState('');

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');

  // Live Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);

  // Delete Confirmation State
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form Submission & Toast
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [allPosts, allCats] = await Promise.all([
        postsApi.getAllPostsAdmin(),
        categoriesApi.getCategories()
      ]);
      setPosts(allPosts);
      setCategories(allCats);
    } catch (err) {
      console.error('[PostManagement.loadData error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen for navigation state from Dashboard buttons
  useEffect(() => {
    const state = location.state as { editPostId?: string; openNew?: boolean } | null;
    if (state?.openNew) {
      handleOpenCreate();
      window.history.replaceState(null, '');
    } else if (state?.editPostId && posts.length > 0) {
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

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category_id === categoryFilter);
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, statusFilter, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormSlug('');
    setFormExcerpt('');
    setFormContent('');
    setFormCategory(categories.length > 0 ? categories[0].id : '');
    setFormStatus('Draft');
    setFormImage('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80');
    setFormMetaTitle('');
    setFormMetaDescription('');
    setFormError('');
    setImageUploadError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCategory(post.category_id || (categories.length > 0 ? categories[0].id : ''));
    setFormStatus(post.status);
    setFormImage(post.featured_image);
    setFormMetaTitle(post.meta_title || '');
    setFormMetaDescription(post.meta_description || '');
    setFormError('');
    setImageUploadError('');
    setFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingPost) {
      setFormSlug(generateSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageUploadError('');

    try {
      const url = await postsApi.uploadFeaturedImage(file);
      setFormImage(url);
      showToast('success', 'Featured image uploaded successfully.');
    } catch (err: any) {
      setImageUploadError(err.message || 'Image upload failed.');
      showToast('error', err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formContent.trim()) {
      setFormError('Article title and content body are required.');
      return;
    }

    setSaving(true);
    setFormError('');

    const finalSlug = formSlug.trim() || generateSlug(formTitle);

    const postPayload: Partial<Post> = {
      title: formTitle.trim(),
      slug: finalSlug,
      excerpt: formExcerpt.trim() || formTitle.slice(0, 120) + '...',
      content: formContent.trim(),
      featured_image: formImage.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      category_id: formCategory || null,
      status: formStatus,
      meta_title: formMetaTitle.trim() || formTitle.trim(),
      meta_description: formMetaDescription.trim() || (formExcerpt.trim() || formTitle.slice(0, 150)),
    };

    try {
      if (editingPost) {
        await postsApi.updatePost(editingPost.id, postPayload);
        showToast('success', `Article "${formTitle}" updated successfully.`);
      } else {
        await postsApi.createPost(postPayload);
        showToast('success', `Article "${formTitle}" created successfully.`);
      }
      setFormOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmPost) return;
    setDeleting(true);

    try {
      await postsApi.deletePost(deleteConfirmPost.id);
      showToast('success', `Article "${deleteConfirmPost.title}" deleted.`);
      setDeleteConfirmPost(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete article.');
    } finally {
      setDeleting(false);
    }
  };

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
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold ${
          toast.type === 'success' 
            ? 'bg-primary-container text-white' 
            : 'bg-error text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-3xl text-on-background dark:text-zinc-100">
            Article Management
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            Write, review, publish, and delete blog articles.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-container text-white hover:bg-primary rounded-lg text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Article</span>
        </button>
      </header>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 p-4 rounded-xl shadow-sm transition-colors duration-200">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-outline" />
          <input 
            type="search" 
            placeholder="Search articles by title or excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background dark:bg-zinc-950 border border-outline-variant dark:border-zinc-800 rounded-lg text-xs font-serif text-on-surface dark:text-zinc-100 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-background dark:bg-zinc-950 border border-outline-variant dark:border-zinc-800 rounded-lg text-xs font-sans font-semibold text-on-surface dark:text-zinc-200 focus:border-primary-container"
            aria-label="Filter by publishing status"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Drafts</option>
          </select>

          {/* Category Filter */}
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-background dark:bg-zinc-950 border border-outline-variant dark:border-zinc-800 rounded-lg text-xs font-sans font-semibold text-on-surface dark:text-zinc-200 focus:border-primary-container"
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-colors duration-200">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 dark:border-zinc-800 bg-surface-container-low/20 dark:bg-zinc-900/50 text-on-surface-variant dark:text-zinc-400 font-sans text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Article</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Reading Time</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 dark:divide-zinc-800/60 font-serif">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-surface-container-low/30 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.featured_image} 
                          alt="" 
                          className="w-12 h-10 object-cover rounded bg-surface-container dark:bg-zinc-800 shrink-0" 
                        />
                        <div>
                          <div className="font-sans font-bold text-on-background dark:text-zinc-100 line-clamp-1">{post.title}</div>
                          <div className="text-xs text-on-surface-variant dark:text-zinc-400 font-mono">/blog/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-sans text-xs text-on-surface-variant dark:text-zinc-400">
                      {post.category?.name || categories.find(c => c.id === post.category_id)?.name || 'Uncategorized'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block font-sans text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        post.status === 'Published' 
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-container' 
                          : 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-xs text-on-surface-variant dark:text-zinc-400">
                      {post.reading_time}m
                    </td>
                    <td className="p-4 font-sans text-xs text-on-surface-variant dark:text-zinc-400">
                      {formatDate(post.published_at || post.created_at)}
                    </td>
                    <td className="p-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        <a 
                          href={`/blog/${post.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1.5 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Preview public page"
                          aria-label={`Preview article ${post.title}`}
                        >
                          <Eye size={16} />
                        </a>
                        <button 
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Edit article"
                          aria-label={`Edit article ${post.title}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmPost(post)}
                          className="p-1.5 text-error hover:bg-error-container/20 rounded-lg transition-colors"
                          title="Delete article"
                          aria-label={`Delete article ${post.title}`}
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
            No articles match your query or filters.
          </div>
        )}
      </section>

      {/* Editor Drawer / Modal */}
      {formOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-sm"
        >
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border-l border-outline-variant dark:border-zinc-800 w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden transition-colors duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-outline-variant/60 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  {editingPost ? 'Edit Article' : 'Compose New Article'}
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-0.5">
                  Author content, upload media, set tags, and configure SEO.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="px-3 py-1.5 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-on-surface dark:text-zinc-200"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>
                <button 
                  onClick={() => setFormOpen(false)}
                  className="p-1.5 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full text-on-surface-variant dark:text-zinc-400"
                  aria-label="Close editor"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {formError && (
                <div className="p-4 bg-error-container/20 border border-error-container text-error text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="artTitle">
                  Article Title *
                </label>
                <input 
                  id="artTitle"
                  type="text" 
                  required
                  placeholder="e.g. The Resurgence of Brutalism in Modern Urban Design"
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-sans font-bold text-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                />
              </div>

              {/* Slug & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="artSlug">
                    URL Slug
                  </label>
                  <input 
                    id="artSlug"
                    type="text" 
                    required
                    placeholder="brutalism-resurgence-modern-urban-design"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-2.5 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-mono text-xs focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="artCategory">
                    Category
                  </label>
                  <select 
                    id="artCategory"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-2.5 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-sans text-xs focus:border-primary-container"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5">
                  Publishing Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-semibold">
                    <input 
                      type="radio" 
                      name="status" 
                      value="Draft" 
                      checked={formStatus === 'Draft'}
                      onChange={() => setFormStatus('Draft')}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Draft (Private)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-semibold">
                    <input 
                      type="radio" 
                      name="status" 
                      value="Published" 
                      checked={formStatus === 'Published'}
                      onChange={() => setFormStatus('Published')}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Published (Public &amp; Indexed)</span>
                  </label>
                </div>
              </div>

              {/* Featured Image Uploader */}
              <div className="space-y-2">
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400">
                  Featured Cover Image
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-32 h-20 bg-surface-container dark:bg-zinc-950 rounded-lg overflow-hidden border border-outline-variant dark:border-zinc-800 shrink-0">
                    <img 
                      src={formImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&auto=format&fit=crop&q=80'} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-3 py-2 bg-surface-container dark:bg-zinc-800 hover:bg-surface-container-high dark:hover:bg-zinc-700 text-on-surface dark:text-zinc-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant dark:border-zinc-700 transition-colors"
                      >
                        {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        <span>Upload from Computer</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <LinkIcon size={14} className="text-outline shrink-0" />
                      <input 
                        type="url" 
                        placeholder="Or paste direct image URL..." 
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-2 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-xs"
                      />
                    </div>
                  </div>
                </div>

                {imageUploadError && (
                  <p className="text-xs text-error">{imageUploadError}</p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="artExcerpt">
                  Excerpt / Summary
                </label>
                <textarea 
                  id="artExcerpt"
                  rows={2}
                  placeholder="A concise summary for article cards and search snippets..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 leading-relaxed"
                />
              </div>

              {/* Content Body */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="artContent">
                  Article Body (Markdown Supported) *
                </label>
                <textarea 
                  id="artContent"
                  rows={12}
                  required
                  placeholder="Write your article essay here. Supports ## Headers, - Bullet lists, > Blockquotes, and paragraphs..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 leading-relaxed font-mono"
                />
              </div>

              {/* SEO Metadata Accordion / Section */}
              <div className="border border-outline-variant dark:border-zinc-800 rounded-xl p-4 bg-surface-container-low/30 dark:bg-zinc-900/40 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold font-sans text-on-background dark:text-zinc-200">
                  <Sparkles size={14} className="text-primary" />
                  <span>Search Engine Optimization (SEO)</span>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-bold text-on-surface-variant dark:text-zinc-400 mb-1" htmlFor="artMetaTitle">
                    Custom Meta Title (Defaults to Article Title)
                  </label>
                  <input 
                    id="artMetaTitle"
                    type="text" 
                    placeholder="e.g. Brutalism in Modern Architecture | Neural Brief" 
                    value={formMetaTitle}
                    onChange={(e) => setFormMetaTitle(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-2 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-bold text-on-surface-variant dark:text-zinc-400 mb-1" htmlFor="artMetaDesc">
                    Custom Meta Description (Defaults to Excerpt)
                  </label>
                  <textarea 
                    id="artMetaDesc"
                    rows={2}
                    placeholder="Short description for Google search result snippets (150-160 chars recommended)..." 
                    value={formMetaDescription}
                    onChange={(e) => setFormMetaDescription(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-2 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-sans text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2.5 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold text-on-surface dark:text-zinc-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary-container text-white hover:bg-primary rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-70"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>{editingPost ? 'Update Article' : (formStatus === 'Published' ? 'Publish Article' : 'Save Draft')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md"
        >
          <div className="bg-surface dark:bg-zinc-950 border border-outline-variant dark:border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant dark:border-zinc-800 flex items-center justify-between bg-surface-container-lowest dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-bold text-primary font-sans">
                <Eye size={16} />
                <span>Live Article Preview</span>
              </div>
              <button 
                onClick={() => setPreviewOpen(false)}
                className="p-1 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full text-on-surface-variant dark:text-zinc-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="text-xs font-bold text-primary uppercase tracking-wider">
                {categories.find(c => c.id === formCategory)?.name || 'Article'}
              </div>
              <h1 className="font-sans font-extrabold text-3xl md:text-4xl text-on-background dark:text-zinc-100">
                {formTitle || 'Untitled Article'}
              </h1>
              {formImage && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden">
                  <img src={formImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <SafeContent content={formContent || 'No content written yet.'} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmPost && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100">
              Confirm Article Deletion
            </h3>
            <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>"{deleteConfirmPost.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteConfirmPost(null)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-error text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-70 flex items-center gap-1.5"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : null}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
