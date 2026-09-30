import React, { useState } from 'react';
import { Product, UploadedPhotoInfo, ProductOptionSize, ProductOptionItem } from '../../types';
import { CustomerPhotoUpload } from './CustomerPhotoUpload';
import { LivePriceCalculator } from './LivePriceCalculator';
import { InteractivePreview } from './InteractivePreview';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingBag, 
  Check, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Calendar, 
  MapPin,
  BookOpen,
  Box,
  Layers,
  Plus,
  Minus,
  Info
} from 'lucide-react';

interface ProductCustomizerProps {
  product: Product;
  onAddedToCart?: () => void;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ product, onAddedToCart }) => {
  const { addToCart } = useCart();

  // Category Detection
  const categoryLower = (product.category || '').toLowerCase();
  const nameLower = (product.name || '').toLowerCase();
  const skuLower = (product.sku || '').toLowerCase();

  const isAlbum = categoryLower.includes('album') || nameLower.includes('album') || skuLower.includes('album');
  const isMagnets = categoryLower.includes('magnet') || nameLower.includes('magnet') || skuLower.includes('magnet');
  const isMiniPrints = categoryLower.includes('insta') || 
                       categoryLower.includes('mini') || 
                       nameLower.includes('insta') || 
                       (nameLower.includes('card') && !categoryLower.includes('invitation') && !categoryLower.includes('business'));

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

  // 1. ALBUM SPECIFIC SHEET PRESETS
  // 1 Sheet = 2 Pages. 1 Page = max 4 photos => Max Photos = Sheets * 2 * 4
  const albumSheetPresets = [
    { sheets: 5, pages: 10, maxPhotos: 40, price_adj: 0, label: "5 Sheets (10 Pages)" },
    { sheets: 10, pages: 20, maxPhotos: 80, price_adj: 450, label: "10 Sheets (20 Pages)" },
    { sheets: 15, pages: 30, maxPhotos: 120, price_adj: 850, label: "15 Sheets (30 Pages)" },
    { sheets: 20, pages: 40, maxPhotos: 160, price_adj: 1250, label: "20 Sheets (40 Pages)" },
    { sheets: 25, pages: 50, maxPhotos: 200, price_adj: 1650, label: "25 Sheets (50 Pages)" },
    { sheets: 30, pages: 60, maxPhotos: 240, price_adj: 2050, label: "30 Sheets (60 Pages)" }
  ];
  const [selectedAlbumSheets, setSelectedAlbumSheets] = useState<number>(5);

  // 2. MAGNET SPECIFIC PACK PRESETS
  const magnetPackOptions = [
    { count: 4, label: "Set of 4 Magnets", price_adj: 0 },
    { count: 6, label: "Set of 6 Magnets", price_adj: 120 },
    { count: 9, label: "Set of 9 Magnets (3×3 Grid)", price_adj: 260 },
    { count: 12, label: "Set of 12 Magnets", price_adj: 420 },
    { count: 16, label: "Set of 16 Magnets", price_adj: 590 },
    { count: 24, label: "Set of 24 Magnets", price_adj: 890 }
  ];
  const [selectedMagnetPackCount, setSelectedMagnetPackCount] = useState<number>(6);

  // 3. MINI PRINTS PACK PRESETS
  const miniPrintPackOptions = [
    { count: 12, label: "Pack of 12 Mini Prints", price_adj: 0 },
    { count: 24, label: "Pack of 24 Mini Prints", price_adj: 150 },
    { count: 36, label: "Pack of 36 Mini Prints", price_adj: 280 },
    { count: 48, label: "Pack of 48 Mini Prints", price_adj: 390 },
    { count: 60, label: "Pack of 60 Mini Prints", price_adj: 490 }
  ];
  const [selectedMiniPrintCount, setSelectedMiniPrintCount] = useState<number>(12);

  // General State
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

  // Volume discount based on quantity
  const activeTier = customOptions.quantity_tiers.find(
    t => quantity >= t.min && quantity <= t.max
  ) || { discount_percent: 0 };

  // Calculate dynamic capacity rules
  const albumPages = selectedAlbumSheets * 2;
  const albumMaxPhotos = albumPages * 4; // 1 page = max 4 photos
  const albumPriceAdj = (albumSheetPresets.find(o => o.sheets === selectedAlbumSheets)?.price_adj) ?? Math.max(0, (selectedAlbumSheets - 5) * 85);

  const magnetPriceAdj = magnetPackOptions.find(o => o.count === selectedMagnetPackCount)?.price_adj || 0;
  const magnetMaxPhotos = selectedMagnetPackCount * quantity;

  const miniPrintPriceAdj = miniPrintPackOptions.find(o => o.count === selectedMiniPrintCount)?.price_adj || 0;
  const miniPrintMaxPhotos = selectedMiniPrintCount * quantity;

  // Maximum allowed photos to upload
  const maxPhotosAllowed = isAlbum 
    ? albumMaxPhotos 
    : isMagnets 
    ? magnetMaxPhotos 
    : isMiniPrints 
    ? miniPrintMaxPhotos 
    : (product.required_photos_count || 1);

  // Capacity price adjustment
  const capacityPriceAdj = isAlbum 
    ? albumPriceAdj 
    : isMagnets 
    ? magnetPriceAdj 
    : isMiniPrints 
    ? miniPrintPriceAdj 
    : 0;

  // Calculate custom size pricing if selected
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
    frameAdjustment: (!isAlbum && !isMagnets && !isMiniPrints && selectedFrame) ? selectedFrame.price_adj : 0,
    customizationFee: (customText ? 100 : 0) + capacityPriceAdj,
    expressFee: extrasCost,
    quantity,
    discountRate: activeTier.discount_percent,
    shippingFee: 80,
    taxRate: 18
  };

  const handleAddToCart = () => {
    setErrorMsg(null);

    // Mandatory photo check
    const requiredPhotos = product.requires_photo ? 1 : 0;
    if (requiredPhotos > 0 && photos.length === 0) {
      setErrorMsg(`Please upload at least 1 photo to continue.`);
      return;
    }

    // Photo capacity overflow check
    if (photos.length > maxPhotosAllowed) {
      setErrorMsg(`You have uploaded ${photos.length} photos, which exceeds the maximum limit of ${maxPhotosAllowed} photos. Please remove ${photos.length - maxPhotosAllowed} photo(s).`);
      return;
    }

    const unitPrice = Math.max(
      0,
      product.base_price +
        sizeAdj +
        selectedMaterial.price_adj +
        selectedFinish.price_adj +
        ((!isAlbum && !isMagnets && !isMiniPrints && selectedFrame) ? selectedFrame.price_adj : 0) +
        (customText ? 100 : 0) +
        capacityPriceAdj +
        extrasCost
    );

    let sizeLabel = isCustomSize
      ? `${customWidth} × ${customHeight} ${customUnit} (Custom Dimension)`
      : selectedSize.name;

    if (isAlbum) {
      sizeLabel += ` • ${selectedAlbumSheets} Sheets (${albumPages} Pages • Up to ${albumMaxPhotos} Photos)`;
    } else if (isMagnets) {
      sizeLabel += ` • Set of ${selectedMagnetPackCount} Magnets (${selectedMagnetPackCount} Photos)`;
    } else if (isMiniPrints) {
      sizeLabel += ` • Set of ${selectedMiniPrintCount} Mini Prints (${selectedMiniPrintCount} Photos)`;
    }

    addToCart({
      product_id: product.id,
      sku: product.sku,
      product_name: product.name,
      image: photos[0]?.url || product.images[0],
      size: sizeLabel,
      material: selectedMaterial.name,
      finish: selectedFinish.name,
      frame: (!isAlbum && !isMagnets && !isMiniPrints && selectedFrame) ? selectedFrame.name : 'None',
      quantity,
      unit_price: unitPrice,
      total: unitPrice * quantity,
      customization: {
        text: customText,
        notes,
        photos,
        album_sheets: isAlbum ? selectedAlbumSheets : undefined,
        album_pages: isAlbum ? albumPages : undefined,
        pack_count: isMagnets ? selectedMagnetPackCount : isMiniPrints ? selectedMiniPrintCount : undefined,
        max_photos_allowed: maxPhotosAllowed,
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
          images={product.images || []}
          defaultImage={product.images[0]}
          photos={photos}
          customText={customText}
          size={isAlbum ? `${selectedSize.name} • ${selectedAlbumSheets} Sheets (${albumPages} Pages)` : (isCustomSize ? `${customWidth}×${customHeight} ${customUnit}` : selectedSize.name)}
          material={selectedMaterial.name}
          finish={selectedFinish.name}
          frame={(!isAlbum && !isMagnets && !isMiniPrints && selectedFrame) ? selectedFrame.name : undefined}
        />

        <LivePriceCalculator
          breakdown={priceBreakdown}
          productName={product.name}
        />
      </div>

      {/* Right Column: Customization Controls Form */}
      <div className="lg:col-span-7 bg-white dark:bg-[#1A1816] rounded-3xl p-6 sm:p-8 border border-[#E9E0D2] dark:border-stone-800 shadow-sm space-y-8 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Bespoke Customization Studio
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-stone-100 mt-1">
            Personalize Your {product.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-stone-400 mt-1">
            {isAlbum 
              ? 'Select your album dimensions, page capacity, archival paper finish, and upload your photo memories.'
              : isMagnets
              ? 'Select magnet dimensions, quantity set, and upload a unique photo for every magnet.'
              : isMiniPrints
              ? 'Choose print pack size and upload a personalized photo for each card.'
              : 'Tailor dimensions, archival substrates, and bespoke framing with instant live price calculation.'}
          </p>
        </div>

        {/* 1. Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
              1. Choose {isAlbum ? 'Album Dimensions' : isMagnets ? 'Magnet Dimensions' : 'Size'}
            </label>
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-400">
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
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer ${
                      isCustomSize
                        ? 'border-amber-700 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-600/30 font-bold'
                        : 'border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-200 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-slate-50 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span>Custom Size</span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-400 font-normal">Enter W × H</span>
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
                  className={`py-3 px-3 rounded-xl border text-xs transition-all text-center flex flex-col justify-center items-center gap-0.5 cursor-pointer ${
                    isSelected
                      ? 'border-amber-700 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-600/30 font-bold'
                      : 'border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-200 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-slate-50 dark:hover:bg-stone-700 font-medium'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-stone-500">
                    {s.price_adj === 0 ? 'Base' : s.price_adj > 0 ? `+₹${s.price_adj}` : `-₹${Math.abs(s.price_adj)}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Size Dimension Inputs */}
          {isCustomSize && (
            <div className="mt-3 bg-[#FAF8F5] dark:bg-[#141210] p-4 rounded-2xl border border-amber-200/80 dark:border-amber-800/80 space-y-3">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                Enter Exact Dimensions (Studio Custom Sizing):
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-stone-400 font-bold block mb-1">WIDTH</label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-stone-400 font-bold block mb-1">HEIGHT</label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-stone-400 font-bold block mb-1">UNIT</label>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value as any)}
                    className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  >
                    <option value="inch">Inches (in)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="mm">Millimeters (mm)</option>
                    <option value="ft">Feet (ft)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Material Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
            2. Choose {isAlbum ? 'Cover / Binding Material' : 'Substrate Material'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {customOptions.materials.map((m, idx) => {
              const isSelected = selectedMaterial.name === m.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMaterial(m)}
                  className={`p-3 rounded-xl border text-xs transition-all flex flex-col justify-between text-left cursor-pointer ${
                    isSelected
                      ? 'border-amber-700 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-600/30 font-bold'
                      : 'border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-200 hover:border-amber-300 dark:hover:border-amber-500 font-medium'
                  }`}
                >
                  <span className="truncate">{m.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-stone-400 mt-1">
                    {m.price_adj === 0 ? 'Standard' : `+₹${m.price_adj}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Finish Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
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
                  className={`p-3 rounded-xl border text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                    isSelected
                      ? 'border-amber-700 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-600/30 font-bold'
                      : 'border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-200 hover:border-amber-300 dark:hover:border-amber-500 font-medium'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-stone-400 ml-2">
                    {f.price_adj === 0 ? 'Included' : `+₹${f.price_adj}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. DYNAMIC SECTION: ALBUM SHEETS / MAGNET PACKS / FRAMING */}
        {/* ======================================================== */}
        
        {/* 4A. PHOTO ALBUMS & MAGAZINE ALBUMS: SHEETS & PAGES SELECTOR */}
        {isAlbum && (
          <div className="space-y-3 bg-[#FAF8F5] dark:bg-[#141210] p-5 rounded-2xl border border-amber-200/90 dark:border-amber-800/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                4. Select Album Sheets & Page Count
              </label>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 shadow-2xs font-mono">
                {selectedAlbumSheets} Sheets = {albumPages} Pages (Max {albumMaxPhotos} Photos)
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {albumSheetPresets.map((opt) => {
                const isSelected = selectedAlbumSheets === opt.sheets;
                return (
                  <button
                    key={opt.sheets}
                    type="button"
                    onClick={() => setSelectedAlbumSheets(opt.sheets)}
                    className={`p-3 rounded-xl border text-xs transition-all flex flex-col justify-between text-left cursor-pointer ${
                      isSelected
                        ? 'border-amber-700 dark:border-amber-500 bg-white dark:bg-stone-800 text-amber-950 dark:text-amber-200 ring-2 ring-amber-600/30 font-bold shadow-xs'
                        : 'border-slate-200/90 dark:border-stone-700 bg-white/70 dark:bg-stone-800/50 text-slate-700 dark:text-stone-300 hover:border-amber-400 font-medium'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-sm">{opt.sheets} Sheets</span>
                      <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold block">
                        {opt.pages} Pages (Max {opt.maxPhotos} Photos)
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-stone-500 block mt-0.5">
                        1–4 photos per page
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-900 dark:text-amber-300 font-bold mt-2">
                      {opt.price_adj === 0 ? 'Standard' : `+₹${opt.price_adj}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Sheets Stepper */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-amber-200/60 dark:border-stone-800 text-xs">
              <span className="text-slate-600 dark:text-stone-400 font-medium">
                Need custom sheet count? (From 5 to 50 sheets):
              </span>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSelectedAlbumSheets(prev => Math.max(5, prev - 1))}
                  className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-slate-300 dark:border-stone-700 hover:bg-slate-50 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-300 cursor-pointer shadow-2xs"
                  title="Decrease 1 sheet"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-slate-900 dark:text-stone-100 font-mono w-16 text-center bg-white dark:bg-stone-800 py-1 px-2 rounded-lg border border-slate-200 dark:border-stone-700">
                  {selectedAlbumSheets} Sheets
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedAlbumSheets(prev => Math.min(50, prev + 1))}
                  className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-slate-300 dark:border-stone-700 hover:bg-slate-50 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-300 cursor-pointer shadow-2xs"
                  title="Increase 1 sheet"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Informative Rule Note */}
            <div className="bg-amber-100/60 dark:bg-amber-950/60 p-2.5 rounded-xl border border-amber-300/80 dark:border-amber-800 flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
              <Info className="w-3.5 h-3.5 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
              <span>
                <strong>Capacity Rule:</strong> 1 sheet = 2 pages. 1 page can hold a maximum of 4 photos. For <strong>{selectedAlbumSheets} sheets ({albumPages} pages)</strong>, you can upload up to <strong>{albumMaxPhotos} photos</strong>.
              </span>
            </div>
          </div>
        )}

        {/* 4B. PHOTO MAGNETS: PACK SIZE SELECTOR */}
        {isMagnets && (
          <div className="space-y-3 bg-[#FAF8F5] dark:bg-[#141210] p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-stone-100 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-indigo-800 dark:text-indigo-400" />
                4. Select Magnet Set Pack
              </label>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-full border border-indigo-300 dark:border-indigo-700 shadow-2xs font-mono">
                {selectedMagnetPackCount} Magnets = {magnetMaxPhotos} Photos
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {magnetPackOptions.map((opt) => {
                const isSelected = selectedMagnetPackCount === opt.count;
                return (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => setSelectedMagnetPackCount(opt.count)}
                    className={`p-3 rounded-xl border text-xs transition-all flex flex-col justify-between text-left cursor-pointer ${
                      isSelected
                        ? 'border-indigo-700 dark:border-indigo-500 bg-white dark:bg-stone-800 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-600/30 font-bold shadow-xs'
                        : 'border-slate-200/90 dark:border-stone-700 bg-white/70 dark:bg-stone-800/50 text-slate-700 dark:text-stone-300 hover:border-indigo-400 font-medium'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-sm">{opt.label}</span>
                      <span className="text-[10px] text-indigo-800 dark:text-indigo-400 block mt-0.5">
                        Upload {opt.count} photos (1/magnet)
                      </span>
                    </div>
                    <span className="text-[11px] text-indigo-900 dark:text-indigo-300 font-bold mt-2">
                      {opt.price_adj === 0 ? 'Standard' : `+₹${opt.price_adj}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-start gap-2 text-[11px] text-indigo-950 dark:text-indigo-200">
              <Info className="w-3.5 h-3.5 shrink-0 text-indigo-700 dark:text-indigo-400 mt-0.5" />
              <span>
                <strong>Magnet Rule:</strong> Each magnet gets its own personalized picture. For <strong>{selectedMagnetPackCount} magnets</strong>, you can upload up to <strong>{magnetMaxPhotos} photos</strong>.
              </span>
            </div>
          </div>
        )}

        {/* 4C. MINI PRINTS / INSTA PHOTO CARDS: PRINT PACK SELECTOR */}
        {isMiniPrints && (
          <div className="space-y-3 bg-[#FAF8F5] dark:bg-[#141210] p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-stone-100 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                4. Select Mini Print Set Pack
              </label>
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 shadow-2xs font-mono">
                {selectedMiniPrintCount} Prints = {miniPrintMaxPhotos} Photos
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {miniPrintPackOptions.map((opt) => {
                const isSelected = selectedMiniPrintCount === opt.count;
                return (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => setSelectedMiniPrintCount(opt.count)}
                    className={`p-3 rounded-xl border text-xs transition-all flex flex-col justify-between text-left cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 dark:border-emerald-500 bg-white dark:bg-stone-800 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-600/30 font-bold shadow-xs'
                        : 'border-slate-200/90 dark:border-stone-700 bg-white/70 dark:bg-stone-800/50 text-slate-700 dark:text-stone-300 hover:border-emerald-400 font-medium'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-sm">{opt.label}</span>
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block mt-0.5">
                        Upload {opt.count} photos (1/print)
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-900 dark:text-emerald-300 font-bold mt-2">
                      {opt.price_adj === 0 ? 'Standard' : `+₹${opt.price_adj}`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-2 text-[11px] text-emerald-950 dark:text-emerald-200">
              <Info className="w-3.5 h-3.5 shrink-0 text-emerald-700 dark:text-emerald-400 mt-0.5" />
              <span>
                <strong>Mini Print Rule:</strong> 1 photo per print card. For <strong>{selectedMiniPrintCount} prints</strong>, you can upload up to <strong>{miniPrintMaxPhotos} photos</strong>.
              </span>
            </div>
          </div>
        )}

        {/* 4D. STANDARD FRAMING / HARDWARE (FOR WALL ART, CANVAS, AND FRAMES) */}
        {!isAlbum && !isMagnets && !isMiniPrints && customOptions.frames.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
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
                    className={`p-3 rounded-xl border text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50 text-amber-900 ring-2 ring-amber-600/30 font-bold dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'border-slate-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-slate-700 dark:text-stone-300 hover:border-amber-300 dark:hover:border-amber-700 font-medium'
                    }`}
                  >
                    <span className="truncate">{fr.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-stone-400 ml-2">
                      {fr.price_adj === 0 ? 'Standard' : `+₹${fr.price_adj}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Customer Photo Upload Component with Dynamic Capacity Enforcement */}
        <div className="pt-2 border-t border-slate-100 dark:border-stone-800">
          <CustomerPhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
            requiredCount={product.requires_photo ? 1 : 0}
            maxCount={maxPhotosAllowed}
            categoryType={isAlbum ? 'album' : isMagnets ? 'magnets' : isMiniPrints ? 'mini-prints' : 'standard'}
            albumSheets={selectedAlbumSheets}
            albumPages={albumPages}
            packCount={isMagnets ? selectedMagnetPackCount : isMiniPrints ? selectedMiniPrintCount : 1}
            printSize={isCustomSize ? `${customWidth}×${customHeight} ${customUnit}` : selectedSize.name}
          />
        </div>

        {/* 6. Customer Design Text & Event Information */}
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-stone-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            Custom Text & Personalization Message {isAlbum && '(Album Title / Inscription)'}
          </label>

          <div>
            <input
              type="text"
              placeholder={isAlbum ? "e.g. 'Our Wedding Memories — 2026' or 'Baby Aarav First Year'" : "e.g. 'Aarav & Maya — 24th December 2026' or Family Caption"}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-[#FAF8F5] dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-3 text-xs text-slate-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all font-medium"
            />
            <p className="text-[10px] text-slate-500 dark:text-stone-400 mt-1">
              Our typography artists will balance and kern this text on your layout before printing.
            </p>
          </div>

          {/* Invitation details if applicable */}
          {product.category === 'Printing' && (
            <div className="bg-[#FAF7F2] dark:bg-stone-900/80 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-3">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                Event / Card Details (Optional):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Event Name (e.g. Wedding Reception)"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-lg p-2 text-xs text-slate-800 dark:text-stone-200"
                />
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-lg p-2 text-xs text-slate-800 dark:text-stone-200"
                />
                <input
                  type="text"
                  placeholder="Venue & City (e.g. Hyatt Regency, Ahmedabad)"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-lg p-2 text-xs text-slate-800 dark:text-stone-200 sm:col-span-2"
                />
              </div>
            </div>
          )}

          <div>
            <textarea
              rows={2}
              placeholder="Special instructions for studio master craftsmen (e.g. crop centering, color correction, matte borders)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FAF8F5] dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-3 text-xs text-slate-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all font-medium"
            />
          </div>
        </div>

        {/* 7. Quantity & Tiered Volume Discounts */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
              7. Quantity & Volume Studio Discount
            </label>
            {activeTier.discount_percent > 0 && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                🎉 {activeTier.discount_percent}% Volume Discount Applied!
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-300 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-200 font-bold text-sm cursor-pointer transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="999"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 text-center text-xs font-bold text-slate-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:outline-none py-2"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 py-2 bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-200 font-bold text-sm cursor-pointer transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
              {customOptions.quantity_tiers.map((t, idx) => (
                <div
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg border whitespace-nowrap ${
                    quantity >= t.min && quantity <= t.max
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold'
                      : 'border-slate-200 dark:border-stone-800 bg-slate-50 dark:bg-stone-800/60 text-slate-500 dark:text-stone-400'
                  }`}
                >
                  {t.min}{t.max < 900 ? `–${t.max}` : '+'}: {t.discount_percent === 0 ? 'Regular Price' : `${t.discount_percent}% Off`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8. Studio Add-ons & Extras */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-stone-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
            8. White-Glove Studio Services
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customOptions.extras.map((ex) => {
              const isChecked = selectedExtras.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  onClick={() => toggleExtra(ex.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'border-amber-700 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-semibold'
                      : 'border-slate-200 dark:border-stone-800 hover:border-slate-300 dark:hover:border-stone-700 text-slate-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-amber-700 border-amber-700 text-white' : 'border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs">{ex.name}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-400">+₹{ex.price_adj}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Success toast */}
        {successToast && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-scale-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Successfully added to your shopping cart!</span>
          </div>
        )}

        {/* 9. Final Add to Cart Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-stone-800">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-[#B45309] hover:bg-amber-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-amber-950/20 hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-3 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-amber-200" />
            <span className="text-base sm:text-lg">
              Add to Cart • ₹{((Math.max(
                0,
                product.base_price +
                  sizeAdj +
                  selectedMaterial.price_adj +
                  selectedFinish.price_adj +
                  ((!isAlbum && !isMagnets && !isMiniPrints && selectedFrame) ? selectedFrame.price_adj : 0) +
                  (customText ? 100 : 0) +
                  capacityPriceAdj +
                  extrasCost
              ) * quantity) * (1 - activeTier.discount_percent / 100)).toLocaleString('en-IN')}
            </span>
          </button>
          <p className="text-center text-[11px] text-slate-500 dark:text-stone-400 mt-2">
            ✨ Handcrafted Studio Quality • 100% Satisfaction Guarantee • Dynamic UPI Instant QR
          </p>
        </div>
      </div>
    </div>
  );
};
