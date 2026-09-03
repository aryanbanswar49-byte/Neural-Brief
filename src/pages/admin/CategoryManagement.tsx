import React, { useState, useEffect } from 'react';
import { categoriesApi, generateSlug } from '../../services/api';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, FolderTree, X, AlertCircle, CheckCircle2, Loader2, FileText } from 'lucide-react';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Notification Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('[CategoryManagement error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setFormError('');
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const finalSlug = slug.trim() || generateSlug(name);
      if (editingCategory) {
        await categoriesApi.updateCategory(editingCategory.id, {
          name: name.trim(),
          slug: finalSlug,
          description: description.trim()
        });
        showToast('success', `Category "${name}" updated successfully.`);
      } else {
        await categoriesApi.createCategory({
          name: name.trim(),
          slug: finalSlug,
          description: description.trim()
        });
        showToast('success', `Category "${name}" created successfully.`);
      }
      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmCat) return;
    setDeleting(true);

    try {
      await categoriesApi.deleteCategory(deleteConfirmCat.id);
      showToast('success', `Category "${deleteConfirmCat.name}" deleted.`);
      setDeleteConfirmCat(null);
      loadCategories();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete category.');
    } finally {
      setDeleting(false);
    }
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
            Category Management
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1">
            Create, edit, and organize editorial categories and topics.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-container text-white hover:bg-primary rounded-lg text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </header>

      {/* Categories Grid Table */}
      <section className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-colors duration-200">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 dark:border-zinc-800 bg-surface-container-low/20 dark:bg-zinc-900/50 text-on-surface-variant dark:text-zinc-400 font-sans text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Articles Count</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 dark:divide-zinc-800/60 font-serif">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-surface-container-low/30 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 font-sans font-bold text-on-background dark:text-zinc-100">
                      {cat.name}
                    </td>
                    <td className="p-4 font-mono text-xs text-primary dark:text-primary-container">
                      /category/{cat.slug}
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant dark:text-zinc-400 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="p-4 font-sans">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 bg-surface-container dark:bg-zinc-800 rounded-full font-semibold text-on-surface dark:text-zinc-200">
                        <FileText size={12} />
                        {cat.post_count ?? 0}
                      </span>
                    </td>
                    <td className="p-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 text-on-surface-variant dark:text-zinc-400 hover:text-primary dark:hover:text-primary hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Edit category"
                          aria-label={`Edit category ${cat.name}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmCat(cat)}
                          className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
                          title="Delete category"
                          aria-label={`Delete category ${cat.name}`}
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
            No categories created yet. Click "New Category" to create your first topic.
          </div>
        )}
      </section>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="cat-modal-title"
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden transition-colors duration-200">
            <div className="px-6 py-4 border-b border-outline-variant/60 dark:border-zinc-800 flex items-center justify-between">
              <h3 id="cat-modal-title" className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 flex items-center gap-2">
                <FolderTree size={18} className="text-primary" />
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-full text-on-surface-variant dark:text-zinc-400"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-error-container/20 border border-error-container text-error text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="catName">
                  Category Name
                </label>
                <input 
                  id="catName"
                  type="text" 
                  required
                  placeholder="e.g. Architecture"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-2.5 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="catSlug">
                  URL Slug
                </label>
                <input 
                  id="catSlug"
                  type="text" 
                  required
                  placeholder="e.g. architecture"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-2.5 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-mono text-xs focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="catDesc">
                  Description
                </label>
                <textarea 
                  id="catDesc"
                  rows={3}
                  placeholder="Short description of this topic for SEO and public listings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-2.5 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold text-on-surface dark:text-zinc-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-5 py-2 bg-primary-container text-white hover:bg-primary rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-70"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmCat && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100">
              Confirm Category Deletion
            </h3>
            <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-300 leading-relaxed">
              Are you sure you want to delete <strong>"{deleteConfirmCat.name}"</strong>? Any articles linked to this category will become Uncategorized.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteConfirmCat(null)}
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
                <span>Delete Category</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
