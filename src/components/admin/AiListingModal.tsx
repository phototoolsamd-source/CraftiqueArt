import React, { useState } from 'react';
import { Product } from '../../types';
import { Sparkles, RefreshCw, Check, X, Copy, Edit3, ShieldAlert } from 'lucide-react';

interface AiListingModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onApplyListing: (aiData: any) => void;
}

export const AiListingModal: React.FC<AiListingModalProps> = ({
  product,
  isOpen,
  onClose,
  onApplyListing
}) => {
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableShortDesc, setEditableShortDesc] = useState('');
  const [editableFullDesc, setEditableFullDesc] = useState('');
  const [editableFeatures, setEditableFeatures] = useState<string[]>([]);
  const [editableTags, setEditableTags] = useState<string[]>([]);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          material: product.material,
          size: product.default_size,
          keywords: product.keywords,
          tags: product.tags
        })
      });

      if (res.ok) {
        const { data } = await res.json();
        setGeneratedData(data);
        setEditableTitle(data.seo_title || product.name);
        setEditableShortDesc(data.short_description || '');
        setEditableFullDesc(data.full_description || '');
        setEditableFeatures(data.features || []);
        setEditableTags(data.search_tags || []);
      }
    } catch (err) {
      console.error('AI Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndApply = () => {
    onApplyListing({
      name: editableTitle,
      short_description: editableShortDesc,
      full_description: editableFullDesc,
      tags: editableTags,
      seo: {
        title: editableTitle,
        meta_description: generatedData?.meta_description,
        keywords: editableTags.join(', '),
        slug: generatedData?.url_slug
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFD0] shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-scale-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl">
                AI Product Listing Generator
              </h2>
              <p className="text-xs text-amber-100">
                Crafting SEO titles, marketing copy, features, and structured specs for {product.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {!generatedData ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-800">
                Ready to generate high-converting e-commerce copy
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                AI will inspect substrate ({product.material}), category ({product.category}), size ({product.default_size}), and generate search-optimized metadata.
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={handleGenerate}
                className="bg-[#B45309] hover:bg-[#92400E] disabled:bg-slate-400 text-white font-bold py-3.5 px-8 rounded-full text-xs shadow-md shadow-amber-900/15 inline-flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Analyzing Product & Generating...' : 'Generate Listing with AI'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Overwrite guard warning */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>AI generated content must be reviewed before saving. Existing descriptions will only update upon confirmation.</span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 shrink-0 ml-3"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>

              {/* Editable SEO Title */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  SEO-Friendly Product Title:
                </label>
                <input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Short Description (1–2 Lines):
                </label>
                <textarea
                  rows={2}
                  value={editableShortDesc}
                  onChange={(e) => setEditableShortDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              {/* Full E-Commerce Description */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Full E-Commerce Story & Description:
                </label>
                <textarea
                  rows={4}
                  value={editableFullDesc}
                  onChange={(e) => setEditableFullDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-normal leading-relaxed"
                />
              </div>

              {/* Bullet Points */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  Bullet Features:
                </label>
                <div className="space-y-1.5">
                  {editableFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-amber-800 font-bold">•</span>
                      <span className="text-slate-800 flex-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Structured Specifications */}
              {generatedData.specifications && (
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                    Structured Specifications:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {Object.entries(generatedData.specifications).map(([k, v]: [string, any]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-slate-200/60 last:border-none">
                        <span className="text-slate-500">{k}:</span>
                        <span className="font-semibold text-slate-800 text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Meta Tags */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DFD0] space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-900 block">SEO & Slug Metadata</span>
                <p className="text-slate-600"><strong>URL Slug:</strong> <span className="font-mono text-amber-800">{generatedData.url_slug}</span></p>
                <p className="text-slate-600"><strong>Meta Description:</strong> {generatedData.meta_description}</p>
                <p className="text-slate-600"><strong>Image Alt Text:</strong> {generatedData.image_alt_text}</p>
              </div>

              {/* Overwrite Confirmation Checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-700 select-none cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={confirmOverwrite}
                  onChange={(e) => setConfirmOverwrite(e.target.checked)}
                  className="rounded text-amber-800 accent-amber-800"
                />
                <span className="font-semibold">
                  I approve these AI improvements and authorize updating this product's listing copy.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {generatedData && (
          <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE0D0] flex items-center justify-between">
            <button
              onClick={() => setGeneratedData(null)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Discard Changes
            </button>

            <button
              type="button"
              disabled={!confirmOverwrite}
              onClick={handleSaveAndApply}
              className="bg-[#B45309] hover:bg-[#92400E] disabled:bg-slate-300 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Save AI Listing</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
