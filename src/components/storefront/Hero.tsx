import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Flame, ChevronLeft, ChevronRight, Layers, Printer } from 'lucide-react';
import { Product } from '../../types';

interface HeroProps {
  onExplore: () => void;
  onCustomise: (sku?: string) => void;
  featuredProduct?: Product | null;
}

const PRINT_SERVICE_HERO_SLIDES = [
  {
    url: "/catalog-images/00. Personalized Print Service/01 Custom Printing Showcase_ Flyers, Cards & Stickers-5.jpg",
    title: "Personalized Printing Service",
    subtitle: "Custom Flyers, Cards, Packaging & Sticker Sheets",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalised Print Services Infographic Grid.jpg",
    title: "100 GSM to 350 GSM Paper Selection",
    subtitle: "Complete Media, Lamination & Precision Cutting Guide",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalized Print Service Showcase-1.jpg",
    title: "Studio-Grade Archival Printing",
    subtitle: "Vibrant Color Reproduction & High-Density Pigment",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalized Prints, Stickers & Packaging.jpg",
    title: "Prints, Stickers & Packaging",
    subtitle: "Bespoke Corporate Branding & Celebration Stationery",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/02 Print Sheet Size Comparison-3.jpg",
    title: "Sheet Size Comparison",
    subtitle: "12×18, 13×19 & A3 Formats (Single & Double Sided)",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/03 Premium Media & Sticker Guide.jpg",
    title: "Premium Media & Substrates",
    subtitle: "Cardstocks, Opaque/Transparent Films & Self-Adhesive Vinyl",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/04 Premium Lamination Finish Options.jpg",
    title: "Thermal Gloss & Matte Lamination",
    subtitle: "Waterproof, Anti-Scratch Protective Studio Shield",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/05 Custom Floral Packaging Solutions.jpg",
    title: "Precision Packaging & Cards",
    subtitle: "Folded Creasing, Luxury Boxes & Product Tags",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/06 Precision Cutting Services Infographic.jpg",
    title: "Precision Kiss-Cut (Half Cut)",
    subtitle: "Machine Contour Kiss-Cut & Guillotine Trimming",
    price: 9,
    mrp: 15
  },
  {
    url: "/catalog-images/00. Personalized Print Service/Custom Paper Prints Showcase (1).jpg",
    title: "Commercial Digital Print Hub",
    subtitle: "Instant Live Dynamic Price: Unit Cost × Quantity",
    price: 9,
    mrp: 15
  }
];

export const Hero: React.FC<HeroProps> = ({ onExplore, onCustomise, featuredProduct }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic slideshow cycling every 3.8 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PRINT_SERVICE_HERO_SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = PRINT_SERVICE_HERO_SLIDES[currentSlide];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + PRINT_SERVICE_HERO_SLIDES.length) % PRINT_SERVICE_HERO_SLIDES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % PRINT_SERVICE_HERO_SLIDES.length);
  };

  const handleCardClick = () => {
    onCustomise('PERSONALIZED_PRINT_SERVICE');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F2EB] to-[#FAF7F2] dark:from-[#181614] dark:to-[#121110] pt-8 pb-20 border-b border-[#EBE3D5] dark:border-stone-800 transition-colors">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/40 dark:bg-amber-900/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-200/30 dark:bg-orange-950/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Modern Indian Craftsmanship • Studio Archival Giclée & Commercial Print</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-stone-100 leading-[1.15]">
              Create Something <br />
              <span className="text-[#B45309] dark:text-amber-500 italic font-normal">Personal & Cherished.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform your finest memories, celebrations, and corporate branding into bespoke museum-grade canvas wall art, luxury photobooks, and commercial fine art prints. Tailored with live real-time price calculation and instant dynamic UPI payments.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onCustomise('PERSONALIZED_PRINT_SERVICE')}
                className="w-full sm:w-auto bg-[#B45309] hover:bg-[#92400E] dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-amber-900/15 flex items-center justify-center gap-2 text-sm transition-all group cursor-pointer"
              >
                <span>Order Printing Service</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExplore}
                className="w-full sm:w-auto bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-700 text-slate-800 dark:text-stone-100 font-semibold py-3.5 px-7 rounded-full border border-[#DCD3C3] dark:border-stone-700 shadow-xs text-sm transition-all cursor-pointer"
              >
                Explore Products
              </button>
            </div>

            {/* Feature trust badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-stone-400 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>12-Color Archival Ink</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Live Dynamic Price</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Instant Dynamic UPI</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card (Permanent Printing Service with Auto Slideshow) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card with shadow & frame */}
              <div 
                onClick={handleCardClick}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="bg-white dark:bg-[#1A1816] rounded-3xl p-4 shadow-xl shadow-amber-900/10 dark:shadow-black/40 border border-[#E5DAC8] dark:border-stone-800 relative overflow-hidden group cursor-pointer hover:border-amber-400 dark:hover:border-amber-600 transition-all"
              >
                {/* Slideshow Image Box */}
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-stone-900 relative">
                  <img
                    src={activeSlide.url}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Top Badge: Featured Studio Craft / Commercial Print */}
                  <div className="absolute top-3 left-3 bg-amber-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>Featured Studio Craft • Commercial Print Hub</span>
                  </div>

                  {/* Slide Counter Pill */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {currentSlide + 1} / {PRINT_SERVICE_HERO_SLIDES.length}
                  </div>

                  {/* Previous / Next Arrow Controls */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Floating Information Strip */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3.5 rounded-xl border border-white/60 dark:border-stone-700 shadow-md">
                    <div className="flex justify-between items-start gap-3">
                      <div className="max-w-[70%]">
                        <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-stone-100 truncate">
                          {activeSlide.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-stone-400 truncate">
                          {activeSlide.subtitle}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 line-through">
                          ₹{activeSlide.mrp}
                        </span>
                        <div className="font-bold text-sm text-[#B45309] dark:text-amber-400">
                          ₹{activeSlide.price} <span className="text-[10px] font-normal text-slate-500">/ sheet</span>
                        </div>
                      </div>
                    </div>

                    {/* Slide Dots Indicator */}
                    <div className="mt-2.5 flex items-center justify-center gap-1.5">
                      {PRINT_SERVICE_HERO_SLIDES.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentSlide === idx 
                              ? 'w-6 bg-amber-600 dark:bg-amber-400' 
                              : 'w-1.5 bg-slate-300 dark:bg-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-strip with quick badges */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-stone-800 flex items-center justify-between text-xs px-2">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-stone-400">
                    <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>Commercial Quality Guarantee</span>
                  </div>
                  <div className="text-amber-800 dark:text-amber-400 font-bold hover:underline flex items-center gap-1">
                    <span>Customize & Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Floating review sticker */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1A1816] p-3 rounded-2xl shadow-lg border border-[#E8DFD0] dark:border-stone-800 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                  4.9★
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-stone-100">Loved by 4,800+ Indian Businesses & Homes</p>
                  <p className="text-slate-500 dark:text-stone-400 text-[10px]">Commercial & Studio Certified</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
