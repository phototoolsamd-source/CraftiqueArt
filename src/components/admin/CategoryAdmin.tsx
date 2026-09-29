import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { Layers, Plus, Trash2, Edit3, Check, X, FolderTree } from 'lucide-react';

export const CategoryAdmin: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [newSubcatName, setNewSubcatName] = useState('');

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openNewCategory = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      subcategories: []
    });
    setIsEditing(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsEditing(true);
  };

  const handleAddSubcat = () => {
    if (!newSubcatName.trim()) return;
    const slug = newSubcatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updated = [
      ...(editingCategory.subcategories || []),
      { id: `sub-${Date.now()}`, name: newSubcatName.trim(), slug }
    ];
    setEditingCategory({ ...editingCategory, subcategories: updated });
    setNewSubcatName('');
  };

  const handleRemoveSubcat = (id: string) => {
    const updated = (editingCategory.subcategories || []).filter(s => s.id !== id);
    setEditingCategory({ ...editingCategory, subcategories: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory.name) return;

    if (!editingCategory.slug) {
      editingCategory.slug = editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory)
      });
      if (res.ok) {
        setIsEditing(false);
        loadCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Category & Subcategory Hierarchy
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage unlimited nested product lines, taxonomy slugs, and department descriptions.
          </p>
        </div>

        <button
          onClick={openNewCategory}
          className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-serif font-bold text-lg text-slate-900 mt-3">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {cat.description || 'No description entered.'}
              </p>

              {/* Subcategories list */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Subcategories ({cat.subcategories?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories?.map((s) => (
                    <span
                      key={s.id}
                      className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              Slug: /{cat.slug}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFD0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scale-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {editingCategory.id ? `Edit: ${editingCategory.name || 'Category'}` : 'New Category'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-black rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Slug</label>
                <input
                  type="text"
                  placeholder="decor"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
                />
              </div>

              {/* Subcategories Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Subcategories</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add subcategory (e.g. Layflat Photobooks)"
                    value={newSubcatName}
                    onChange={(e) => setNewSubcatName(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcat}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-2 rounded-xl text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {editingCategory.subcategories?.map((s) => (
                    <span
                      key={s.id}
                      className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcat(s.id)}
                        className="hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
