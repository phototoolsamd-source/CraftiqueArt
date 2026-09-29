import React, { useRef } from 'react';
import { Category } from '../../types';
import { 
  Palette, 
  Printer, 
  Sparkles, 
  Layers, 
  Frame, 
  BookOpen, 
  Tag, 
  PartyPopper, 
  Box,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const getIcon = (catName: string) => {
    const l = catName.toLowerCase();
    if (l.includes('hanging') || l.includes('scroll')) return <Layers className="w-4 h-4 text-amber-700" />;
    if (l.includes('frame') || l.includes('artwork')) return <Frame className="w-4 h-4 text-indigo-700" />;
    if (l.includes('album') || l.includes('magazine')) return <BookOpen className="w-4 h-4 text-emerald-700" />;
    if (l.includes('sticker') || l.includes('label')) return <Tag className="w-4 h-4 text-rose-700" />;
    if (l.includes('party') || l.includes('birthday')) return <PartyPopper className="w-4 h-4 text-purple-700" />;
    if (l.includes('card') || l.includes('invitation') || l.includes('business')) return <Printer className="w-4 h-4 text-blue-700" />;
    if (l.includes('magnet') || l.includes('shadow')) return <Box className="w-4 h-4 text-amber-700" />;
    return <Sparkles className="w-4 h-4 text-amber-600" />;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white border-b border-[#EBE3D5] py-4 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between gap-4">
          {/* Section label */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#B45309] bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 hidden sm:inline-block">
              Categories
            </span>
          </div>

          {/* Horizontal Scroll Area */}
          <div className="relative flex-1 overflow-hidden flex items-center">
            {/* Scroll Left Button */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 z-10 p-1.5 rounded-full bg-white/95 border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 cursor-pointer hidden md:flex items-center justify-center -ml-1"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Chips Container */}
            <div
              ref={scrollRef}
              className="flex items-center gap-2.5 overflow-x-auto scrollbar-none scroll-smooth px-1 py-1 w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* All Collections Chip */}
              <button
                onClick={() => onSelectCategory('all')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#B45309] text-white shadow-xs font-bold'
                    : 'bg-[#FAF7F2] border border-slate-200/80 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>All Crafts</span>
              </button>

              {/* Dynamic Categories */}
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#B45309] text-white shadow-xs font-bold'
                        : 'bg-[#FAF7F2] border border-slate-200/80 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    <span>{getIcon(cat.name)}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 z-10 p-1.5 rounded-full bg-white/95 border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 cursor-pointer hidden md:flex items-center justify-center -mr-1"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
