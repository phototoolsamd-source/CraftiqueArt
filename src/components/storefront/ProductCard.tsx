import React from 'react';
import { Product } from '../../types';
import { Sparkles, Image as ImageIcon, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const primaryImg = product.images?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-[#E9E1D2] overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={primaryImg}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
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

        {/* Photo Upload indicator */}
        {product.requires_photo && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
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
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-amber-800">
              {product.category}
            </span>
            <span className="font-mono text-slate-400">SKU: {product.sku}</span>
          </div>

          <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.short_description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-slate-600">
            <span className="bg-[#FAF7F2] border border-[#E8DFCE] px-2 py-0.5 rounded font-medium">
              {product.material}
            </span>
            <span className="bg-[#FAF7F2] border border-[#E8DFCE] px-2 py-0.5 rounded font-medium">
              {product.default_size}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base text-slate-900">
                ₹{product.selling_price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.selling_price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discount && product.discount > 0 && (
              <span className="text-[10px] font-bold text-emerald-700">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-[#FAF7F2] group-hover:bg-[#B45309] text-amber-900 group-hover:text-white border border-[#E0D5C3] group-hover:border-[#B45309] text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs"
          >
            <span>Personalize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
