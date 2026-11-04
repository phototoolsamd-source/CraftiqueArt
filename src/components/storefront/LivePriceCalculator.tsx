import React from 'react';
import { Calculator, ShieldCheck, Zap } from 'lucide-react';

interface PriceBreakdown {
  basePrice: number;
  sizeAdjustment: number;
  shapeAdjustment?: number;
  materialAdjustment: number;
  finishAdjustment: number;
  frameAdjustment: number;
  customizationFee: number;
  expressFee: number;
  quantity: number;
  discountRate: number; // percentage
  shippingFee: number;
  taxRate: number; // percentage (18%)
}

interface LivePriceCalculatorProps {
  breakdown: PriceBreakdown;
  productName: string;
}

export const LivePriceCalculator: React.FC<LivePriceCalculatorProps> = ({
  breakdown,
  productName
}) => {
  const {
    basePrice,
    sizeAdjustment,
    shapeAdjustment = 0,
    materialAdjustment,
    finishAdjustment,
    frameAdjustment,
    customizationFee,
    expressFee,
    quantity,
    discountRate,
    shippingFee,
    taxRate
  } = breakdown;

  // Single unit subtotal
  const singleUnitSubtotal = Math.max(
    0,
    basePrice +
      sizeAdjustment +
      shapeAdjustment +
      materialAdjustment +
      finishAdjustment +
      frameAdjustment +
      customizationFee +
      expressFee
  );

  const totalRaw = singleUnitSubtotal * quantity;
  const discountAmount = Math.round(totalRaw * (discountRate / 100));
  const subtotalAfterDiscount = totalRaw - discountAmount;
  const taxAmount = Math.round(subtotalAfterDiscount * (taxRate / 100));
  const finalShipping = subtotalAfterDiscount >= 1500 ? 0 : shippingFee;
  const finalTotal = subtotalAfterDiscount + taxAmount + finalShipping;

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#1A1816] rounded-2xl border border-[#E8DFD0] dark:border-stone-800 p-5 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2D6C4] dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-800 dark:text-amber-400" />
          <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-stone-100">
            Live Dynamic Price Breakdown
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-700 dark:text-amber-400 fill-amber-700 dark:fill-amber-400" /> Real-time
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-slate-700 dark:text-stone-300 font-medium">
        <div className="flex justify-between">
          <span className="truncate pr-2">Base Product Price</span>
          <span className="font-semibold text-slate-900 dark:text-stone-100">₹{basePrice.toLocaleString('en-IN')}</span>
        </div>

        {sizeAdjustment !== 0 && (
          <div className="flex justify-between text-slate-600 dark:text-stone-400">
            <span>Size Adjustment</span>
            <span>
              {sizeAdjustment > 0 ? `+₹${sizeAdjustment}` : `-₹${Math.abs(sizeAdjustment)}`}
            </span>
          </div>
        )}

        {shapeAdjustment !== 0 && (
          <div className="flex justify-between text-amber-800 dark:text-amber-400 font-semibold">
            <span>Custom Die-Cut Shape</span>
            <span>+₹{shapeAdjustment}</span>
          </div>
        )}

        {materialAdjustment !== 0 && (
          <div className="flex justify-between text-slate-600 dark:text-stone-400">
            <span>Material Selection</span>
            <span>+₹{materialAdjustment}</span>
          </div>
        )}

        {finishAdjustment !== 0 && (
          <div className="flex justify-between text-slate-600 dark:text-stone-400">
            <span>Premium Finish</span>
            <span>+₹{finishAdjustment}</span>
          </div>
        )}

        {frameAdjustment !== 0 && (
          <div className="flex justify-between text-slate-600 dark:text-stone-400">
            <span>Frame / Hardware</span>
            <span>+₹{frameAdjustment}</span>
          </div>
        )}

        {customizationFee !== 0 && (
          <div className="flex justify-between text-slate-600 dark:text-stone-400">
            <span>Studio Customization</span>
            <span>+₹{customizationFee}</span>
          </div>
        )}

        {expressFee !== 0 && (
          <div className="flex justify-between text-slate-600 dark:text-stone-400">
            <span>Express Production (24h)</span>
            <span>+₹{expressFee}</span>
          </div>
        )}

        {quantity > 1 && (
          <div className="flex justify-between text-amber-900 dark:text-amber-300 font-semibold pt-1 border-t border-dashed border-[#E2D6C4] dark:border-stone-800">
            <span>Unit Price × {quantity} Qty</span>
            <span>₹{totalRaw.toLocaleString('en-IN')}</span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
            <span>Volume Discount ({discountRate}%)</span>
            <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600 dark:text-stone-400 pt-1 border-t border-[#E2D6C4] dark:border-stone-800">
          <span>GST / Tax ({taxRate}%)</span>
          <span>₹{taxAmount.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-stone-400">
          <span>Shipping Charges</span>
          <span>
            {finalShipping === 0 ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase">FREE</span>
            ) : (
              `₹${finalShipping}`
            )}
          </span>
        </div>

        {/* Final Grand Total Highlight */}
        <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-stone-100 pt-3 border-t-2 border-[#D1C2AC] dark:border-stone-700">
          <div>
            <span className="text-base text-slate-900 dark:text-stone-100">Total Amount:</span>
            <p className="text-[10px] text-slate-500 dark:text-stone-400 font-normal">All taxes & packaging included</p>
          </div>
          <span className="font-serif text-xl font-bold text-[#B45309] dark:text-amber-400">
            ₹{finalTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};
