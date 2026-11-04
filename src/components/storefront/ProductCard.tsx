import React from 'react';
import { Product } from '../../types';
import { Sparkles, Image as ImageIcon, ArrowRight, ShieldCheck, Flame, Layers, Share2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onShare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onShare }) => {
  const primaryImg = product.images?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80';
  const secondaryImg = product.images?.[1] || primaryImg;
  const imageCount = product.images?.length || 1;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E9E1D2] dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-stone-900">
        {/* Primary Image */}
        <img
          src={primaryImg}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            secondaryImg !== primaryImg ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {/* Secondary Image on Hover */}
        {secondaryImg !== primaryImg && (
          <img
            src={secondaryImg}
            alt={`${product.name} Alternate View`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start z-10">
          {product.best_seller && (
            <span className="bg-amber-800/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Flame className="w-3 h-3 text-amber-300" />
              Best Seller
            </span>
          )}
          {product.new_product && (
            <span className="bg-emerald-800/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Gallery Photos Count Badge */}
        {imageCount > 1 && (
          <div className="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs z-10">
            <Layers className="w-3 h-3 text-amber-300" />
            <span>{imageCount} Photos</span>
          </div>
        )}

        {/* Photo Upload indicator */}
        {product.requires_photo && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 z-10">
            <ImageIcon className="w-3 h-3 text-amber-300" />
            <span>
              {product.required_photos_count ? `${product.required_photos_count} Photos` : 'Photo Required'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-stone-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-amber-800 dark:text-amber-400">
              {product.category}
            </span>
            <span className="font-mono text-slate-400 dark:text-stone-500">SKU: {product.sku}</span>
          </div>

          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
            {product.short_description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-slate-600 dark:text-stone-300">
            <span className="bg-[#FAF7F2] dark:bg-stone-800/80 border border-[#E8DFCE] dark:border-stone-700 px-2 py-0.5 rounded font-medium">
              {product.material}
            </span>
            <span className="bg-[#FAF7F2] dark:bg-stone-800/80 border border-[#E8DFCE] dark:border-stone-700 px-2 py-0.5 rounded font-medium">
              {product.default_size}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-stone-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base text-slate-900 dark:text-stone-100">
                ₹{product.selling_price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.selling_price && (
                <span className="text-xs text-slate-400 dark:text-stone-500 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discount && product.discount > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(product);
                }}
                title="Share via WhatsApp or Link"
                className="p-2 rounded-xl bg-slate-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-stone-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-[#FAF7F2] dark:bg-stone-800 group-hover:bg-[#B45309] dark:group-hover:bg-amber-600 text-amber-900 dark:text-amber-200 group-hover:text-white border border-[#E0D5C3] dark:border-stone-700 group-hover:border-[#B45309] dark:group-hover:border-amber-600 text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs"
            >
              <span>Personalize</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
