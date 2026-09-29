import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onCustomise: (sku?: string) => void;
  featuredProduct?: Product | null;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onCustomise, featuredProduct }) => {
  const heroImage = featuredProduct?.images?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80';
  const heroTitle = featuredProduct?.name || 'Personalized Premium Gallery Wrap Canvas';
  const heroMaterial = featuredProduct?.material || 'Archival Artist Canvas • Stretched Pine Frame';
  const heroPrice = featuredProduct?.selling_price || 799;
  const heroMrp = featuredProduct?.mrp || 1499;
  const heroSku = featuredProduct?.sku || '';
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F2EB] to-[#FAF7F2] pt-8 pb-20 border-b border-[#EBE3D5]">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 bg-amber-100/90 border border-amber-300/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-900 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Modern Indian Craftsmanship • Studio Archival Giclée</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Create Something <br />
              <span className="text-[#B45309] italic font-normal">Personal & Cherished.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Transform your finest memories, celebrations, and corporate branding into bespoke museum-grade canvas wall art, luxury photobooks, and fine art prints. Tailored with live real-time price calculation and instant dynamic UPI payments.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onCustomise('WA001')}
                className="w-full sm:w-auto bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-amber-900/15 flex items-center justify-center gap-2 text-sm transition-all group"
              >
                <span>Create Something Personal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExplore}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-7 rounded-full border border-[#DCD3C3] shadow-xs text-sm transition-all"
              >
                Explore Products
              </button>
            </div>

            {/* Feature trust badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>12-Color Archival Ink</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live Dynamic Price</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant UPI Payment</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card with shadow & frame */}
              <div className="bg-white rounded-3xl p-4 shadow-xl shadow-amber-900/10 border border-[#E5DAC8] relative overflow-hidden group">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={heroImage}
                    alt={heroTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>Featured Studio Craft</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="max-w-[70%]">
                        <h3 className="font-serif font-bold text-sm text-slate-900 truncate">{heroTitle}</h3>
                        <p className="text-[11px] text-slate-500 truncate">{heroMaterial}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 line-through">₹{heroMrp}</span>
                        <div className="font-bold text-sm text-[#B45309]">₹{heroPrice}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-strip with quick badges */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs px-2">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Archival Quality Guarantee</span>
                  </div>
                  <button
                    onClick={() => onCustomise(heroSku)}
                    className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Customize Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Floating review sticker */}
              <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-2xl shadow-lg border border-[#E8DFD0] hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  4.9★
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Loved by 4,800+ Indian Homes</p>
                  <p className="text-slate-500 text-[10px]">Verified Customer Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
