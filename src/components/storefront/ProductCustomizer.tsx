import React, { useState } from 'react';
import { Product, UploadedPhotoInfo, ProductOptionSize, ProductOptionItem } from '../../types';
import { CustomerPhotoUpload } from './CustomerPhotoUpload';
import { LivePriceCalculator } from './LivePriceCalculator';
import { InteractivePreview } from './InteractivePreview';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Check, Sparkles, AlertCircle, FileText, Calendar, MapPin } from 'lucide-react';

interface ProductCustomizerProps {
  product: Product;
  onAddedToCart?: () => void;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ product, onAddedToCart }) => {
  const { addToCart } = useCart();

  // Customizer options fallbacks
  const customOptions = product.custom_options || {
    sizes: [
      { name: "12 × 18 inch", price_adj: 0, default: true },
      { name: "18 × 24 inch", price_adj: 350 },
      { name: "24 × 36 inch", price_adj: 850 },
      { name: "Custom Size", price_adj: 0, is_custom: true }
    ],
    materials: [
      { name: product.material || "Archival Canvas (380 GSM)", price_adj: 0, default: true },
      { name: "Gloss Archival Paper", price_adj: 100 },
      { name: "Optical Cast Acrylic", price_adj: 300 }
    ],
    finishes: [
      { name: "Matte Anti-Glare Coating", price_adj: 0, default: true },
      { name: "Gloss Protective Lustre", price_adj: 80 }
    ],
    frames: [
      { name: "Gallery Wrap (Frameless Stretched)", price_adj: 0, default: true },
      { name: "Sleek Matte Black Floating Frame", price_adj: 450 },
      { name: "Natural Teak Wood Floating Frame", price_adj: 550 }
    ],
    quantity_tiers: [
      { min: 1, max: 9, discount_percent: 0 },
      { min: 10, max: 49, discount_percent: 15 },
      { min: 50, max: 999, discount_percent: 30 }
    ],
    extras: [
      { id: "express", name: "Express 24h Studio Dispatch", price_adj: 299 },
      { id: "gift_wrap", name: "Artisan Gift Packaging & Calligraphy Card", price_adj: 149 }
    ]
  };

  // State
  const [selectedSize, setSelectedSize] = useState<ProductOptionSize>(
    customOptions.sizes.find(s => s.default) || customOptions.sizes[0]
  );
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState<number>(18);
  const [customHeight, setCustomHeight] = useState<number>(24);
  const [customUnit, setCustomUnit] = useState<'inch' | 'cm' | 'mm' | 'ft'>('inch');

  const [selectedMaterial, setSelectedMaterial] = useState<ProductOptionItem>(
    customOptions.materials.find(m => m.default) || customOptions.materials[0]
  );
  const [selectedFinish, setSelectedFinish] = useState<ProductOptionItem>(
    customOptions.finishes.find(f => f.default) || customOptions.finishes[0]
  );
  const [selectedFrame, setSelectedFrame] = useState<ProductOptionItem | null>(
    customOptions.frames.length > 0 ? (customOptions.frames.find(f => f.default) || customOptions.frames[0]) : null
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Photos & Custom design text
  const [photos, setPhotos] = useState<UploadedPhotoInfo[]>([]);
  const [customText, setCustomText] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [eventName, setEventName] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [venue, setVenue] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  // Determine volume discount based on quantity
  const activeTier = customOptions.quantity_tiers.find(
    t => quantity >= t.min && quantity <= t.max
  ) || { discount_percent: 0 };

  // Calculate custom size pricing if custom size is selected
  // Formula: basePrice * (area / default_area)
  let sizeAdj = selectedSize.price_adj;
  if (isCustomSize) {
    let areaInSqIn = customWidth * customHeight;
    if (customUnit === 'cm') areaInSqIn /= 6.45;
    else if (customUnit === 'mm') areaInSqIn /= 645;
    else if (customUnit === 'ft') areaInSqIn *= 144;

    const baseArea = 12 * 18; // 216 sq in
    const ratio = Math.max(0.5, areaInSqIn / baseArea);
    sizeAdj = Math.round((ratio - 1) * product.base_price);
  }

  const extrasCost = selectedExtras.reduce((sum, extraId) => {
    const extra = customOptions.extras.find(e => e.id === extraId);
    return sum + (extra?.price_adj || 0);
  }, 0);

  const priceBreakdown = {
    basePrice: product.base_price,
    sizeAdjustment: sizeAdj,
    materialAdjustment: selectedMaterial.price_adj,
    finishAdjustment: selectedFinish.price_adj,
    frameAdjustment: selectedFrame ? selectedFrame.price_adj : 0,
    customizationFee: customText ? 100 : 0,
    expressFee: extrasCost,
    quantity,
    discountRate: activeTier.discount_percent,
    shippingFee: 80,
    taxRate: 18
  };

  const handleAddToCart = () => {
    setErrorMsg(null);

    // Mandatory photo check
    const requiredPhotos = product.requires_photo ? (product.required_photos_count || 1) : 0;
    if (requiredPhotos > 0 && photos.length < requiredPhotos) {
      setErrorMsg(`Please upload at least ${requiredPhotos} photo${requiredPhotos > 1 ? 's' : ''} to continue.`);
      return;
    }

    const unitPrice = Math.max(
      0,
      product.base_price +
        sizeAdj +
        selectedMaterial.price_adj +
        selectedFinish.price_adj +
        (selectedFrame?.price_adj || 0) +
        (customText ? 100 : 0) +
        extrasCost
    );

    const sizeLabel = isCustomSize
      ? `${customWidth} × ${customHeight} ${customUnit} (Custom Dimension)`
      : selectedSize.name;

    addToCart({
      product_id: product.id,
      sku: product.sku,
      product_name: product.name,
      image: photos[0]?.url || product.images[0],
      size: sizeLabel,
      material: selectedMaterial.name,
      finish: selectedFinish.name,
      frame: selectedFrame ? selectedFrame.name : 'None',
      quantity,
      unit_price: unitPrice,
      total: unitPrice * quantity,
      customization: {
        text: customText,
        notes,
        photos,
        custom_width: isCustomSize ? customWidth : undefined,
        custom_height: isCustomSize ? customHeight : undefined,
        custom_unit: isCustomSize ? customUnit : undefined,
        event_name: eventName,
        event_date: eventDate,
        venue
      },
      selected_extras: selectedExtras
    });

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
    if (onAddedToCart) onAddedToCart();
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Interactive Visual Preview & Live Price Breakdown */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
        <InteractivePreview
          productName={product.name}
          defaultImage={product.images[0]}
          photos={photos}
          customText={customText}
          size={isCustomSize ? `${customWidth}×${customHeight} ${customUnit}` : selectedSize.name}
          material={selectedMaterial.name}
          finish={selectedFinish.name}
          frame={selectedFrame?.name}
        />

        <LivePriceCalculator
          breakdown={priceBreakdown}
          productName={product.name}
        />
      </div>

      {/* Right Column: Customization Controls Form */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E0D2] shadow-sm space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Bespoke Customization Studio
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Personalize Your {product.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tailor dimensions, archival substrates, and bespoke framing with instant live price calculation.
          </p>
        </div>

        {/* 1. Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
              1. Choose Size
            </label>
            <span className="text-xs font-semibold text-amber-900">
              Selected: {isCustomSize ? `${customWidth} × ${customHeight} ${customUnit}` : selectedSize.name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {customOptions.sizes.map((s, idx) => {
              if (s.is_custom) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsCustomSize(true);
                      setSelectedSize(s);
                    }}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all text-center flex flex-col justify-center items-center gap-1 ${
                      isCustomSize
                        ? 'border-amber-700 bg-amber-50 text-amber-900 ring-2 ring-amber-600/30 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>Custom Size</span>
                    <span className="text-[10px] text-amber-800 font-normal">Enter W × H</span>
                  </button>
                );
              }

              const isSelected = !isCustomSize && selectedSize.name === s.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsCustomSize(false);
                    setSelectedSize(s);
                  }}
                  className={`py-3 px-3 rounded-xl border text-xs transition-all text-center flex flex-col justify-center items-center gap-0.5 ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50 text-amber-900 ring-2 ring-amber-600/30 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {s.price_adj === 0 ? 'Base' : s.price_adj > 0 ? `+₹${s.price_adj}` : `-₹${Math.abs(s.price_adj)}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Size Dimension Inputs */}
          {isCustomSize && (
            <div className="mt-3 bg-[#FAF8F5] p-4 rounded-2xl border border-amber-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                Enter Custom Dimensions:
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Width</label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(1, Number(e.target.value)))}
                    className="w-full mt-1 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Height</label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(1, Number(e.target.value)))}
                    className="w-full mt-1 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Unit</label>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value as any)}
                    className="w-full mt-1 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                  >
                    <option value="inch">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                    <option value="ft">Feet (ft)</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-amber-900">
                Studio area calculated: {customWidth} × {customHeight} {customUnit}. Price adjusted dynamically based on substrate square footage.
              </p>
            </div>
          )}
        </div>

        {/* 2. Material Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            2. Choose Substrate / Material
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {customOptions.materials.map((m, idx) => {
              const isSelected = selectedMaterial.name === m.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMaterial(m)}
                  className={`p-3 rounded-xl border text-xs transition-all flex items-center justify-between text-left ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50 text-amber-900 ring-2 ring-amber-600/30 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 font-medium'
                  }`}
                >
                  <span className="truncate">{m.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2">
                    {m.price_adj === 0 ? 'Standard' : `+₹${m.price_adj}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Finish Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            3. Choose Surface Finish
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {customOptions.finishes.map((f, idx) => {
              const isSelected = selectedFinish.name === f.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedFinish(f)}
                  className={`p-3 rounded-xl border text-xs transition-all flex items-center justify-between text-left ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50 text-amber-900 ring-2 ring-amber-600/30 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 font-medium'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2">
                    {f.price_adj === 0 ? 'Included' : `+₹${f.price_adj}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Frame Selection (if applicable) */}
        {customOptions.frames.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
              4. Choose Framing / Presentation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {customOptions.frames.map((fr, idx) => {
                const isSelected = selectedFrame?.name === fr.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedFrame(fr)}
                    className={`p-3 rounded-xl border text-xs transition-all flex items-center justify-between text-left ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50 text-amber-900 ring-2 ring-amber-600/30 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 font-medium'
                    }`}
                  >
                    <span className="truncate">{fr.name}</span>
                    <span className="text-[10px] text-slate-500 ml-2">
                      {fr.price_adj === 0 ? 'Standard' : `+₹${fr.price_adj}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Customer Photo Upload Component */}
        <div className="pt-2 border-t border-slate-100">
          <CustomerPhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
            requiredCount={product.requires_photo ? (product.required_photos_count || 1) : 0}
            printSize={isCustomSize ? `${customWidth}×${customHeight} ${customUnit}` : selectedSize.name}
          />
        </div>

        {/* 6. Customer Design Text & Event Information */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            Custom Text & Personalization Message
          </label>

          <div>
            <input
              type="text"
              placeholder="e.g. 'Aarav & Maya — 24th December 2026' or Family Caption"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all font-medium"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Our typography artists will balance and kern this text on your layout before printing.
            </p>
          </div>

          {/* Invitation details if applicable */}
          {product.category === 'Printing' && (
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-amber-200/60 space-y-3">
              <span className="text-xs font-bold text-amber-900 block">
                Event / Card Details (Optional):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Event Name (e.g. Wedding Reception)"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Date & Time"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Venue & City"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Special Production Instructions / Notes for Studio:
            </label>
            <textarea
              rows={2}
              placeholder="Any specific color preferences, crop requests, or special handling notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all"
            />
          </div>
        </div>

        {/* 7. Quantity & Dynamic Tiers */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Quantity & Volume Pricing
            </label>
            {activeTier.discount_percent > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeTier.discount_percent}% Volume Savings Applied
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-600 hover:text-black font-bold"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="999"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-14 text-center bg-white text-xs font-bold text-slate-900 py-2 border-x border-slate-300"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-slate-600 hover:text-black font-bold"
              >
                +
              </button>
            </div>

            {/* Quick volume tiers selector */}
            <div className="flex flex-wrap gap-2 text-xs">
              {customOptions.quantity_tiers.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuantity(t.min)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                    quantity >= t.min && quantity <= t.max
                      ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.min}–{t.max > 5000 ? 'Any' : t.max} {t.discount_percent > 0 ? `(${t.discount_percent}% off)` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 8. Additional Studio Extras */}
        {customOptions.extras.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              Additional Studio Services
            </label>
            <div className="space-y-2">
              {customOptions.extras.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id);
                return (
                  <label
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`cursor-pointer rounded-xl p-3 border text-xs flex items-center justify-between transition-all select-none ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50 text-amber-900 ring-1 ring-amber-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-amber-800 border-amber-800 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span>{extra.name}</span>
                    </div>
                    <span className="font-bold text-amber-900">+₹{extra.price_adj}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-amber-900/15 flex items-center justify-center gap-3 text-base transition-all group hover:scale-[1.01]"
          >
            <ShoppingBag className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
            <span>Add to Craft Bag & Review Customization</span>
          </button>
        </div>

        {/* Success toast notification */}
        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Successfully added to your craft bag! Opening cart...</span>
          </div>
        )}
      </div>
    </div>
  );
};
