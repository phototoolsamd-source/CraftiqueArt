import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  ChevronRight,
  Pause,
  Play
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
  const set1Ref = useRef<HTMLDivElement>(null);
  
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse drag state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const getIcon = (catName: string) => {
    const l = catName.toLowerCase();
    if (l.includes('hanging') || l.includes('scroll')) return <Layers className="w-3.5 h-3.5 text-amber-700" />;
    if (l.includes('artwork')) return <Palette className="w-3.5 h-3.5 text-purple-700" />;
    if (l.includes('frame')) return <Frame className="w-3.5 h-3.5 text-indigo-700" />;
    if (l.includes('album') || l.includes('magazine')) return <BookOpen className="w-3.5 h-3.5 text-emerald-700" />;
    if (l.includes('sticker') || l.includes('label')) return <Tag className="w-3.5 h-3.5 text-rose-700" />;
    if (l.includes('party') || l.includes('birthday')) return <PartyPopper className="w-3.5 h-3.5 text-pink-700" />;
    if (l.includes('print') || l.includes('card') || l.includes('invitation') || l.includes('business')) return <Printer className="w-3.5 h-3.5 text-blue-700" />;
    if (l.includes('magnet') || l.includes('shadow') || l.includes('miniature')) return <Box className="w-3.5 h-3.5 text-amber-700" />;
    return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
  };

  // Continuous auto-scrolling animation frame
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();
    let scrollPos = container.scrollLeft;
    const speed = 36; // pixels per second for gentle, readable motion

    const step = (timestamp: number) => {
      const elapsed = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const oneSetWidth = set1Ref.current ? set1Ref.current.offsetWidth : 0;

      if (!isAutoScrollPaused && !isHoveredRef.current && !isInteractingRef.current && container && oneSetWidth > 0) {
        scrollPos += speed * elapsed;

        // Infinite seamless loop wrap-around
        if (scrollPos >= oneSetWidth) {
          scrollPos -= oneSetWidth;
        } else if (scrollPos < 0) {
          scrollPos += oneSetWidth;
        }

        container.scrollLeft = scrollPos;
      } else if (container) {
        // Keep internal float in sync with manual user scrolling / dragging
        scrollPos = container.scrollLeft;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoScrollPaused, categories]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current && set1Ref.current) {
      const w = set1Ref.current.offsetWidth;
      if (direction === 'left' && scrollRef.current.scrollLeft < 320 && w > 0) {
        scrollRef.current.scrollLeft += w;
      }
      const amount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });

      // Temporarily pause auto-scroll during manual interaction
      isInteractingRef.current = true;
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 3500);
    }
  };

  // Drag-to-scroll mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStartRef.current = scrollRef.current.scrollLeft;
    dragDistanceRef.current = 0;
    isInteractingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current);
    dragDistanceRef.current += Math.abs(walk);
    scrollRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2500);
  };

  const handleChipClick = (slug: string) => {
    // Only trigger selection if user was not dragging
    if (dragDistanceRef.current <= 6) {
      onSelectCategory(slug);
    }
  };

  // Helper to render one set of category chips
  const renderCategoryChips = (setIndex: number, isFirstSet = false) => (
    <div
      ref={isFirstSet ? set1Ref : undefined}
      className="flex items-center gap-2.5 shrink-0 pr-2.5"
    >
      {/* All Crafts Chip */}
      <button
        key={`all-${setIndex}`}
        onClick={() => handleChipClick('all')}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-2xs ${
          selectedCategory === 'all'
            ? 'bg-[#B45309] text-white shadow-xs font-bold ring-2 ring-amber-600/30'
            : 'bg-[#FAF7F2] dark:bg-stone-800 border border-slate-200/80 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/60 dark:hover:bg-stone-700'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>All Crafts</span>
      </button>

      {/* Dynamic Categories 01 to 15 */}
      {categories.map((cat, idx) => {
        const isSelected = selectedCategory === cat.slug;
        const prefix = cat.order_prefix || String(idx + 1).padStart(2, '0');
        return (
          <button
            key={`${cat.id || cat.slug}-${setIndex}`}
            onClick={() => handleChipClick(cat.slug)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-2xs ${
              isSelected
                ? 'bg-[#B45309] text-white shadow-xs font-bold ring-2 ring-amber-600/30'
                : 'bg-[#FAF7F2] dark:bg-stone-800 border border-slate-200/80 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/60 dark:hover:bg-stone-700'
            }`}
          >
            <span>{getIcon(cat.name)}</span>
            <span>
              <span
                className={`font-mono text-[10px] mr-1 ${
                  isSelected ? 'text-amber-200' : 'text-amber-800 dark:text-amber-400 font-bold'
                }`}
              >
                {prefix}.
              </span>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section className="bg-white dark:bg-[#161412] border-b border-[#EBE3D5] dark:border-stone-800 py-3.5 w-full select-none transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Section label with live auto-scroll indicator & pause toggle */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#B45309] dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200/70 dark:border-amber-800 hidden sm:inline-flex items-center gap-1.5 shadow-2xs">
              <span>Categories</span>
              <span 
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  isAutoScrollPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'
                }`}
                title={isAutoScrollPaused ? "Auto-scroll paused" : "Auto-scrolling active"}
              />
            </span>

            {/* Toggle play/pause button for auto-scrolling */}
            <button
              onClick={() => setIsAutoScrollPaused((prev) => !prev)}
              className="p-1 px-2 rounded-md text-slate-500 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors hidden sm:flex items-center gap-1 text-[10px] font-semibold border border-slate-200/80 dark:border-stone-700 cursor-pointer"
              title={isAutoScrollPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
              aria-label={isAutoScrollPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
            >
              {isAutoScrollPaused ? (
                <>
                  <Play className="w-2.5 h-2.5 fill-current text-amber-700 dark:text-amber-400" />
                  <span className="text-[10px] text-slate-700 dark:text-stone-300">Auto</span>
                </>
              ) : (
                <>
                  <Pause className="w-2.5 h-2.5 fill-current text-slate-500 dark:text-stone-400" />
                  <span className="text-[10px] text-slate-700 dark:text-stone-300">Pause</span>
                </>
              )}
            </button>
          </div>

          {/* Horizontal Auto-Scroll Ribbon Container */}
          <div className="relative flex-1 overflow-hidden flex items-center">
            
            {/* Left Edge Gradient Fade */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-14 bg-gradient-to-r from-white dark:from-[#161412] via-white/80 dark:via-[#161412]/80 to-transparent z-10" />

            {/* Right Edge Gradient Fade */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-14 bg-gradient-to-l from-white dark:from-[#161412] via-white/80 dark:via-[#161412]/80 to-transparent z-10" />

            {/* Scroll Left Button */}
            <button
              onClick={() => handleManualScroll('left')}
              className="absolute left-0.5 z-20 p-1.5 rounded-full bg-white/95 dark:bg-stone-800/95 border border-slate-200/90 dark:border-stone-700 shadow-md text-slate-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-700 hover:text-amber-800 dark:hover:text-amber-400 cursor-pointer hidden md:flex items-center justify-center transition-all hover:scale-105"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Continuous Infinite Scrolling Track */}
            <div
              ref={scrollRef}
              onMouseEnter={() => {
                isHoveredRef.current = true;
              }}
              onMouseLeave={() => {
                isHoveredRef.current = false;
                handleMouseUp();
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={() => {
                isInteractingRef.current = true;
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
              }}
              onTouchEnd={() => {
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                resumeTimeoutRef.current = setTimeout(() => {
                  isInteractingRef.current = false;
                }, 2500);
              }}
              onWheel={() => {
                isInteractingRef.current = true;
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                resumeTimeoutRef.current = setTimeout(() => {
                  isInteractingRef.current = false;
                }, 2500);
              }}
              className="flex items-center overflow-x-auto scrollbar-none py-1 w-full cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {renderCategoryChips(1, true)}
              {renderCategoryChips(2, false)}
              {renderCategoryChips(3, false)}
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => handleManualScroll('right')}
              className="absolute right-0.5 z-20 p-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-md text-slate-700 hover:bg-amber-50 hover:text-amber-800 cursor-pointer hidden md:flex items-center justify-center transition-all hover:scale-105"
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
