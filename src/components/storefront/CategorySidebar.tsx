import React from 'react';
import { Category, Product } from '../../types';
import { 
  Sparkles, 
  Frame, 
  Printer, 
  BookOpen, 
  Tag, 
  PartyPopper, 
  Layers, 
  Box,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ShieldCheck,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

interface CategorySidebarProps {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  priceFilter: number;
  onPriceFilterChange: (price: number) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onReset: () => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortByChange,
  onReset
}) => {
  const getCategoryCount = (slug: string) => {
    if (slug === 'all') return products.length;
    return products.filter(p => {
      const pSlug = p.category_slug || p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return pSlug === slug || p.category.toLowerCase().includes(slug.replace(/-/g, ' '));
    }).length;
  };

  const getIcon = (catName: string) => {
    const l = catName.toLowerCase();
    if (l.includes('hanging') || l.includes('scroll')) return <Layers className="w-4 h-4" />;
    if (l.includes('frame') || l.includes('artwork')) return <Frame className="w-4 h-4" />;
    if (l.includes('album') || l.includes('magazine')) return <BookOpen className="w-4 h-4" />;
    if (l.includes('sticker') || l.includes('label')) return <Tag className="w-4 h-4" />;
    if (l.includes('party') || l.includes('birthday')) return <PartyPopper className="w-4 h-4" />;
    if (l.includes('print') || l.includes('card') || l.includes('invitation') || l.includes('business')) return <Printer className="w-4 h-4" />;
    if (l.includes('magnet') || l.includes('shadow')) return <Box className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  const isFiltered = selectedCategory !== 'all' || priceFilter < 3000 || sortBy !== 'featured';

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-6">
      {/* Category List Card */}
      <div className="bg-white dark:bg-[#1A1816] rounded-3xl border border-[#E9E1D2] dark:border-stone-800 p-5 shadow-xs sticky top-24 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-stone-800 mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#B45309] dark:text-amber-400" />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
              Product Categories
            </h3>
          </div>
          {isFiltered && (
            <button
              onClick={onReset}
              className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* All Products Item */}
        <div className="space-y-1 mb-5">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#B45309] text-white shadow-xs font-bold'
                : 'text-slate-700 dark:text-stone-300 hover:bg-amber-50/70 dark:hover:bg-stone-800 hover:text-[#B45309] dark:hover:text-amber-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>All Products</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                selectedCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-stone-800 text-slate-600 dark:text-stone-400'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const count = getCategoryCount(cat.slug);
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#B45309] text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-stone-300 hover:bg-amber-50/70 dark:hover:bg-stone-800 hover:text-[#B45309] dark:hover:text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1.5">
                  <span className={isSelected ? 'text-amber-200 shrink-0' : 'text-slate-400 dark:text-stone-500 shrink-0'}>
                    {getIcon(cat.name)}
                  </span>
                  <span className="truncate">
                    <span className={`font-mono text-[10px] font-bold mr-1.5 ${isSelected ? 'text-amber-200' : 'text-amber-800/70 dark:text-amber-400/80'}`}>
                      {cat.order_prefix || String(categories.indexOf(cat) + 1).padStart(2, '0')}.
                    </span>
                    {cat.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-stone-800 text-slate-500 dark:text-stone-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Price Range Filter */}
        <div className="pt-4 border-t border-slate-100 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-stone-200">Max Budget</span>
            <span className="font-bold text-[#B45309] dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800 px-2 py-0.5 rounded-md">
              ₹{priceFilter >= 3000 ? 'Any' : `₹${priceFilter}`}
            </span>
          </div>
          <input
            type="range"
            min={200}
            max={3000}
            step={100}
            value={priceFilter}
            onChange={(e) => onPriceFilterChange(Number(e.target.value))}
            className="w-full accent-[#B45309] dark:accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-stone-500">
            <span>₹200</span>
            <span>₹1,500</span>
            <span>₹3,000+</span>
          </div>
        </div>

        {/* Sort By Filter */}
        <div className="pt-4 border-t border-slate-100 dark:border-stone-800 space-y-2">
          <label className="block text-xs font-bold text-slate-800 dark:text-stone-200">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl p-2.5 font-medium text-slate-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            <option value="featured">✨ Featured Studio Crafts</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Alphabetical (A to Z)</option>
          </select>
        </div>

        {/* Quality Badges in Sidebar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-stone-800 space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>100% Archival Studio Pigment Inks</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-stone-400">
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Instant Dynamic UPI QR Checkout</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-stone-400">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Custom Photo Upload & Preview</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
