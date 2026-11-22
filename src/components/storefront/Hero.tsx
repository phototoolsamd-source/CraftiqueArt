import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Printer, 
  Scissors, 
  UploadCloud 
} from 'lucide-react';
import { Product } from '../../types';

interface HeroProps {
  onExplore: () => void;
  onCustomise: (sku?: string) => void;
  featuredProduct?: Product | null;
}

const PRINT_SERVICE_HERO_SLIDES = [
  {
    url: "/catalog-images/00. Personalized Print Service/01 Custom Printing Showcase_ Flyers, Cards & Stickers-5.jpg",
    title: "Flyers, Cards & Custom Stickers",
    subtitle: "Commercial & Custom Bulk Print Hub",
    badge: "Showcase 1 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalised Print Services Infographic Grid.jpg",
    title: "Complete Media & Finishing Guide",
    subtitle: "100 GSM to 350 GSM Paper, Lamination & Cutting",
    badge: "Infographic 2 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalized Print Service Showcase-1.jpg",
    title: "Studio-Grade Archival Printing",
    subtitle: "High-Density Pigment & True Color Fidelity",
    badge: "Print Quality 3 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalized Prints, Stickers & Packaging.jpg",
    title: "Bespoke Packaging & Stickers",
    subtitle: "Waterproof Polymeric Vinyl & Paper Decals",
    badge: "Packaging 4 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/02 Print Sheet Size Comparison-3.jpg",
    title: "Print Sheet Size Comparison",
    subtitle: "12×18, 13×19 & A3 Formats (Single & Double Sided)",
    badge: "Sheet Sizes 5 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/03 Premium Media & Sticker Guide.jpg",
    title: "Premium Media & Substrates",
    subtitle: "Cardstocks, Opaque/Transparent & Adhesive Sheets",
    badge: "Media Guide 6 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/04 Premium Lamination Finish Options.jpg",
    title: "Thermal Gloss & Matte Lamination",
    subtitle: "Scratch-Resistant & Waterproof Protective Shield",
    badge: "Lamination 7 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/05 Custom Floral Packaging Solutions.jpg",
    title: "Precision Packaging & Cards",
    subtitle: "Fold Scoring, Luxury Boxes & Product Hangtags",
    badge: "Packaging 8 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/06 Precision Cutting Services Infographic.jpg",
    title: "Precision Kiss-Cut (Half Cut)",
    subtitle: "Machine Contour Kiss-Cut & Guillotine Trimming",
    badge: "Cutting Guide 9 of 10"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/Custom Paper Prints Showcase (1).jpg",
    title: "Commercial Digital Print Hub",
    subtitle: "Live Real-Time Price: Unit Cost × Quantity",
    badge: "Production 10 of 10"
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F2EB] to-[#FAF7F2] dark:from-[#181614] dark:to-[#121110] pt-8 pb-16 border-b border-[#EBE3D5] dark:border-stone-800 transition-colors">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/40 dark:bg-amber-900/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-200/30 dark:bg-orange-950/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to actions */}
          <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-4 space-y-5 text-center lg:text-left">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Modern Indian Craftsmanship & Digital Print</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900 dark:text-stone-100 leading-[1.18]">
              Create Something <br />
              <span className="text-[#B45309] dark:text-amber-500 italic font-normal">Personal & Cherished.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform your finest memories, celebrations, and corporate branding into bespoke museum-grade canvas wall art, luxury photobooks, and commercial fine art prints with live price calculation and instant dynamic UPI payments.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-700 text-slate-800 dark:text-stone-100 font-semibold py-3 px-6 rounded-full border border-[#DCD3C3] dark:border-stone-700 shadow-xs text-xs sm:text-sm transition-all cursor-pointer"
              >
                Explore Products
              </button>

              <button
                onClick={() => onCustomise('PERSONALIZED_PRINT_SERVICE')}
                className="w-full sm:w-auto bg-[#B45309] hover:bg-[#92400E] dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-md text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Print Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature trust badges */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-600 dark:text-stone-400 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>12-Color Archival Ink</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Live Dynamic Price</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Instant Dynamic UPI</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card & Print Service Details (The Red Box Area) */}
          <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-8 relative">
            <div className="relative mx-auto max-w-none">
              
              {/* Main Card with shadow & frame */}
              <div 
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="bg-white dark:bg-[#1A1816] rounded-3xl p-4 sm:p-6 shadow-xl shadow-amber-900/10 dark:shadow-black/40 border border-[#E5DAC8] dark:border-stone-800 relative overflow-hidden transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* LEFT: 1:1 SQUARE IMAGE SLIDESHOW (FIT TO IMAGE - NO CROPPING) */}
                  <div className="md:col-span-6 xl:col-span-6 relative">
                    <div 
                      onClick={handleCardClick}
                      className="aspect-square w-full rounded-2xl overflow-hidden bg-[#121110] relative border border-slate-200/80 dark:border-stone-800 group cursor-pointer shadow-md flex items-center justify-center"
                    >
                      {/* Fully uncropped 1:1 square display */}
                      <img
                        src={activeSlide.url}
                        alt={activeSlide.title}
                        className="w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-[1.02]"
                      />

                      {/* Top Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{activeSlide.badge}</span>
                      </div>

                      {/* Counter Pill */}
                      <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {currentSlide + 1} / {PRINT_SERVICE_HERO_SLIDES.length}
                      </div>

                      {/* Navigation Controls */}
                      <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 cursor-pointer shadow-md"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 cursor-pointer shadow-md"
                        title="Next Image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Bottom Caption Overlay */}
                      <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-white">
                        <h4 className="font-serif font-bold text-xs truncate">
                          {activeSlide.title}
                        </h4>
                        <p className="text-[10px] text-stone-300 truncate">
                          {activeSlide.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Dots Indicator Strip */}
                    <div className="mt-2.5 flex items-center justify-center gap-1.5">
                      {PRINT_SERVICE_HERO_SLIDES.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            currentSlide === idx 
                              ? 'w-6 bg-amber-600 dark:bg-amber-400' 
                              : 'w-1.5 bg-slate-300 dark:bg-stone-700 hover:bg-amber-400'
                          }`}
                          title={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* RIGHT (BAJUMA): PRINT SERVICE TEXT, HIGHLIGHTS, DETAILS & PRICING */}
                  <div className="md:col-span-6 xl:col-span-6 space-y-3.5">
                    {/* Header Tag */}
                    <div className="inline-flex items-center gap-1.5 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-3 py-1 rounded-full text-[11px] font-bold text-amber-900 dark:text-amber-300 shadow-xs">
                      <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                      <span>Commercial Digital Print Hub</span>
                    </div>

                    {/* Service Title & Subtitle */}
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-stone-100 leading-tight">
                        Personalized Printing Service
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-stone-400 mt-1 leading-relaxed">
                        On-demand commercial digital printing on 100 to 350 GSM papers, sticker sheets, and party paper with live dynamic pricing.
                      </p>
                    </div>

                    {/* Feature Highlights Grid */}
                    <div className="space-y-2 text-xs text-slate-700 dark:text-stone-300">
                      <div className="flex items-start gap-2">
                        <Printer className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-stone-100">10+ Premium Media:</span>{' '}
                          <span className="text-[11px] text-slate-500 dark:text-stone-400">350, 300, 250, 210, 170, 100 GSM, Sticker Vinyl & Opaque/Transparent.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Layers className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-stone-100">Sheet Sizes & Sides:</span>{' '}
                          <span className="text-[11px] text-slate-500 dark:text-stone-400">12×18, 13×19 & A3 (Single & Double Sided printing).</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-stone-100">Thermal Lamination:</span>{' '}
                          <span className="text-[11px] text-slate-500 dark:text-stone-400">Gloss & Matte anti-scratch protective coating (+₹4.50 - +₹6.50).</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Scissors className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-stone-100">Precision Cutting:</span>{' '}
                          <span className="text-[11px] text-slate-500 dark:text-stone-400">Kiss-Cut (Half Cut) for stickers (+₹8 - +₹9) & Full Cut Creasing.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <UploadCloud className="w-4 h-4 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-stone-100">Supported Formats:</span>{' '}
                          <span className="text-[11px] text-slate-500 dark:text-stone-400">Upload ZIP, RAR, PDF, CDR, PSD, AI, JPG, PNG design files.</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA Block */}
                    <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-300/80 dark:border-amber-800/80 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-stone-400 uppercase tracking-wider font-semibold block">
                          Formula: Unit Cost × Qty
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[11px] text-slate-400 line-through">₹15</span>
                          <span className="text-xl font-serif font-bold text-[#B45309] dark:text-amber-400">
                            From ₹9
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-stone-400">/ sheet</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCardClick}
                        className="bg-[#B45309] hover:bg-[#92400E] dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer group"
                      >
                        <span>Order Now</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Trust badges footer */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-stone-400 pt-1 border-t border-slate-100 dark:border-stone-800">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ Dynamic UPI QR Instant Pay
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        ⚡ 24-48h Studio Dispatch
                      </span>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
