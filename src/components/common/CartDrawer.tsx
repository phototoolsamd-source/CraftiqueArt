import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    tax,
    shipping,
    grandTotal
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingGoal = 1500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingGoal) * 100));
  const amountNeeded = Math.max(0, freeShippingGoal - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] dark:bg-[#1A1816] border-l border-[#E5DAC8] dark:border-stone-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#EAE0D0] dark:border-stone-800 flex items-center justify-between bg-[#FAF7F2] dark:bg-stone-900">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-800 dark:text-amber-400" />
              <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">Your Craft Bag</h2>
              <span className="text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-amber-50/70 dark:bg-amber-950/40 px-5 py-3 border-b border-amber-200/50 dark:border-amber-900/40 text-xs">
            {amountNeeded > 0 ? (
              <p className="text-amber-950 dark:text-amber-200 font-medium">
                Add <span className="font-bold text-amber-800 dark:text-amber-400">₹{amountNeeded}</span> more for <span className="font-bold text-emerald-700 dark:text-emerald-400">FREE SHIPPING</span>
              </p>
            ) : (
              <p className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> You have unlocked FREE Express Shipping!
              </p>
            )}
            <div className="w-full bg-amber-200/60 dark:bg-stone-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-600 to-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-amber-800 dark:text-amber-400">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-700 dark:text-stone-200">Your bag is empty</h3>
                <p className="text-xs text-slate-500 dark:text-stone-400 max-w-xs mx-auto">
                  Explore personalized wall art, handcrafted albums, invitations, and custom prints.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm"
                >
                  Start Customizing <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="bg-white dark:bg-stone-900 rounded-xl p-3.5 border border-[#EBE3D5] dark:border-stone-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-stone-800 shrink-0 border border-slate-200/80 dark:border-stone-700 relative">
                      <img
                        src={item.customization.photos?.[0]?.url || item.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                      {item.customization.photos && item.customization.photos.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.2 rounded font-bold">
                          +{item.customization.photos.length - 1} photos
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-stone-100 truncate">
                          {item.product_name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cart_item_id)}
                          className="text-slate-400 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-stone-400 mt-1 space-y-0.5">
                        <p><span className="font-medium text-slate-700 dark:text-stone-300">Size:</span> {item.size}</p>
                        <p><span className="font-medium text-slate-700 dark:text-stone-300">Material:</span> {item.material}</p>
                        {item.frame && item.frame !== 'None' && (
                          <p><span className="font-medium text-slate-700 dark:text-stone-300">Frame:</span> {item.frame}</p>
                        )}
                        {item.customization.album_sheets && (
                          <p className="text-amber-900 dark:text-amber-300 font-semibold">
                            📖 {item.customization.album_sheets} Sheets ({item.customization.album_pages} Pages) • {item.customization.photos?.length || 0} Photos
                          </p>
                        )}
                        {item.customization.pack_count && (
                          <p className="text-indigo-900 dark:text-indigo-300 font-semibold">
                            🧲 Set of {item.customization.pack_count} Units • {item.customization.photos?.length || 0} Photos
                          </p>
                        )}
                        {item.customization.photos && item.customization.photos.length > 0 && (
                          <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                            ✓ {item.customization.photos.length} Custom Photos Attached
                          </p>
                        )}
                        {item.customization.text && (
                          <p className="text-amber-800 dark:text-amber-300 italic truncate font-medium">
                            "{item.customization.text}"
                          </p>
                        )}
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-stone-800">
                        <div className="flex items-center border border-slate-200 dark:border-stone-700 rounded-lg bg-slate-50 dark:bg-stone-800">
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                            className="p-1 text-slate-600 dark:text-stone-300 hover:text-black dark:hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-stone-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                            className="p-1 text-slate-600 dark:text-stone-300 hover:text-black dark:hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-amber-900 dark:text-amber-400">
                          ₹{item.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#EAE0D0] dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-900 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-stone-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-stone-100">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <span>Volume Discount (5%)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18% Included)</span>
                  <span className="font-semibold text-slate-900 dark:text-stone-100">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-stone-100">
                    {shipping === 0 ? <span className="text-emerald-700 dark:text-emerald-400 uppercase font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-stone-100 pt-2 border-t border-[#E5DAC8] dark:border-stone-800">
                  <span>Grand Total</span>
                  <span className="text-base text-amber-900 dark:text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-900/15 transition-all text-sm group cursor-pointer"
              >
                <span>Proceed to Instant UPI Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-stone-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero convenience fee • Direct UPI payment to Craftique</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
