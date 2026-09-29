import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { AiListingModal } from './AiListingModal';
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  Sparkles,
  ExternalLink,
  Check,
  X,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

export const ProductAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [aiModalProduct, setAiModalProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'customization' | 'seo'>('basic');
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState<Partial<Product>>({});

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openNewProduct = () => {
    const newSku = `CRQ_${Date.now().toString().slice(-4)}`;
    setForm({
      sku: newSku,
      name: 'New Customized Product',
      category: 'Décor',
      subcategory: 'Wall Art',
      material: 'Canvas',
      default_size: '12 × 18 inch',
      base_price: 850,
      selling_price: 850,
      mrp: 1499,
      discount: 43,
      tax: 18,
      stock: 100,
      short_description: 'Archival quality personalized art print.',
      full_description: 'Detailed description crafted in studio.',
      images: [
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80'
      ],
      customization_available: true,
      requires_photo: true,
      required_photos_count: 1,
      active: true,
      featured: false
    });
    setIsEditing(true);
  };

  const openEditProduct = (prod: Product) => {
    setForm({ ...prod });
    setIsEditing(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsEditing(false);
        loadProducts();
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from the catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleDuplicateProduct = async (prod: Product) => {
    const copyPayload = {
      ...prod,
      id: `prod-${Date.now()}`,
      sku: `${prod.sku}_COPY`,
      name: `${prod.name} (Copy)`
    };
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copyPayload)
      });
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      console.error('Failed to duplicate:', err);
    }
  };

  const handleAiApply = (aiData: any) => {
    setForm(prev => ({
      ...prev,
      name: aiData.name || prev.name,
      short_description: aiData.short_description || prev.short_description,
      full_description: aiData.full_description || prev.full_description,
      tags: aiData.tags || prev.tags,
      seo: aiData.seo || prev.seo
    }));
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Product Catalog Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {products.length} products available in store database
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={openNewProduct}
            className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Material / Size</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">AI Copy</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80'}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{prod.name}</span>
                        <span className="text-[10px] text-slate-400">{prod.production_time || '2-3 days'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-950">
                    {prod.sku}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {prod.category}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {prod.material} • {prod.default_size}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{prod.selling_price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                      {prod.stock || 100} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => setAiModalProduct(prod)}
                      className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-200"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>Generate AI</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditProduct(prod)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(prod)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg"
                        title="Duplicate Product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFD0] shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-scale-in flex flex-col max-h-[90vh]">
            <div className="bg-[#FAF7F2] p-5 border-b border-[#EAE0D0] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {form.id ? `Edit: ${form.name}` : 'Create New Product'}
                </h3>
                <p className="text-xs text-slate-500">SKU: {form.sku}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiModalProduct(form as Product)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                  <span>Generate Listing with AI</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-3 px-4 border-b-2 transition-colors ${activeTab === 'basic' ? 'border-amber-800 text-amber-900 font-bold' : 'border-transparent text-slate-500'}`}
              >
                Basic Information
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className={`py-3 px-4 border-b-2 transition-colors ${activeTab === 'pricing' ? 'border-amber-800 text-amber-900 font-bold' : 'border-transparent text-slate-500'}`}
              >
                Pricing & Costs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('customization')}
                className={`py-3 px-4 border-b-2 transition-colors ${activeTab === 'customization' ? 'border-amber-800 text-amber-900 font-bold' : 'border-transparent text-slate-500'}`}
              >
                Customizer Options
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`py-3 px-4 border-b-2 transition-colors ${activeTab === 'seo' ? 'border-amber-800 text-amber-900 font-bold' : 'border-transparent text-slate-500'}`}
              >
                SEO & Tags
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1">
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">SKU</label>
                      <input
                        type="text"
                        required
                        value={form.sku || ''}
                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                      <input
                        type="text"
                        value={form.category || ''}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Substrate / Material</label>
                      <input
                        type="text"
                        value={form.material || ''}
                        onChange={(e) => setForm({ ...form, material: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Default Dimension</label>
                      <input
                        type="text"
                        value={form.default_size || ''}
                        onChange={(e) => setForm({ ...form, default_size: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={form.short_description || ''}
                      onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Description</label>
                    <textarea
                      rows={4}
                      value={form.full_description || ''}
                      onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Base Price (₹)</label>
                      <input
                        type="number"
                        value={form.base_price || 0}
                        onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                      <input
                        type="number"
                        value={form.selling_price || 0}
                        onChange={(e) => setForm({ ...form, selling_price: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-amber-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">MRP (₹)</label>
                      <input
                        type="number"
                        value={form.mrp || 0}
                        onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Unit Cost Breakdown for Profit Margin:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-500">Material Cost (₹)</label>
                        <input
                          type="number"
                          value={form.costs?.material_cost || 300}
                          onChange={(e) => setForm({ ...form, costs: { ...form.costs, material_cost: Number(e.target.value) } as any })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Print Ink Cost (₹)</label>
                        <input
                          type="number"
                          value={form.costs?.print_cost || 180}
                          onChange={(e) => setForm({ ...form, costs: { ...form.costs, print_cost: Number(e.target.value) } as any })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Labor Cost (₹)</label>
                        <input
                          type="number"
                          value={form.costs?.labor_cost || 120}
                          onChange={(e) => setForm({ ...form, costs: { ...form.costs, labor_cost: Number(e.target.value) } as any })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Packaging (₹)</label>
                        <input
                          type="number"
                          value={form.costs?.packaging_cost || 60}
                          onChange={(e) => setForm({ ...form, costs: { ...form.costs, packaging_cost: Number(e.target.value) } as any })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customization' && (
                <div className="space-y-4 text-xs">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.requires_photo || false}
                        onChange={(e) => setForm({ ...form, requires_photo: e.target.checked })}
                        className="rounded text-amber-800"
                      />
                      <span className="font-semibold">Requires Customer Photo Upload</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.custom_text_allowed || false}
                        onChange={(e) => setForm({ ...form, custom_text_allowed: e.target.checked })}
                        className="rounded text-amber-800"
                      />
                      <span className="font-semibold">Allow Custom Text / Inscription</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Required Photos Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={form.required_photos_count || 1}
                      onChange={(e) => setForm({ ...form, required_photos_count: Number(e.target.value) })}
                      className="w-32 bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={form.seo?.title || ''}
                      onChange={(e) => setForm({ ...form, seo: { ...form.seo, title: e.target.value } })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={form.seo?.meta_description || ''}
                      onChange={(e) => setForm({ ...form, seo: { ...form.seo, meta_description: e.target.value } })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Save Footer */}
              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Listing Modal Trigger */}
      {aiModalProduct && (
        <AiListingModal
          product={aiModalProduct}
          isOpen={true}
          onClose={() => setAiModalProduct(null)}
          onApplyListing={handleAiApply}
        />
      )}
    </div>
  );
};
