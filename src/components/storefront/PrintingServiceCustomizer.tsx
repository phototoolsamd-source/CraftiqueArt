import React, { useState, useEffect, useRef } from 'react';
import { Product, UploadedPhotoInfo } from '../../types';
import { useCart } from '../../context/CartContext';
import { 
  Printer, 
  Layers, 
  Scissors, 
  Sparkles, 
  UploadCloud, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  FileText, 
  FileArchive, 
  Image as ImageIcon, 
  AlertCircle, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle,
  Share2
} from 'lucide-react';

export interface PrintingServiceCustomizerProps {
  product: Product;
  onAddedToCart?: () => void;
  onShare?: (product: Product) => void;
  onInstantCheckout?: () => void;
}

// Complete pricing matrix from legacy online_print_order.tsx
export const DEFAULT_PRINTING_PRICING = [
  {
    media: "350 Gsm",
    tagline: "Ultra heavyweight rigid cardstock",
    desc: "Premium luxury cardstock for high-end business cards, invitation cards, luxury wedding stationery, and packaging.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 14 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 17 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 15 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 18 },
    ]
  },
  {
    media: "300 Gsm",
    tagline: "Heavyweight premium cardstock (Most Popular)",
    desc: "Sturdy cardstock with exceptional ink holdout. Ideal for certificate prints, greeting cards, product tags, and menus.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 13 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 16 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 14 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 17 },
    ]
  },
  {
    media: "250 Gsm",
    tagline: "Medium-heavy flexible cardstock",
    desc: "Versatile medium cardstock perfect for photobook covers, corporate folders, flyers, and table tent cards.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 12 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 15 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 13 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 16 },
    ]
  },
  {
    media: "210 Gsm",
    tagline: "Standard cardstock for promotional print",
    desc: "Economical sturdy paper for promotional handouts, brochures, book divider pages, and event programs.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 11.5 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 14 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 12 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 15 },
    ]
  },
  {
    media: "170 Gsm",
    tagline: "Smooth medium art paper",
    desc: "High-resolution smooth art paper for art catalog inners, photo posters, and premium marketing brochures.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 11 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 14 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 12 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 15 },
    ]
  },
  {
    media: "100 /130 Gsm",
    tagline: "Lightweight commercial bond & flyers",
    desc: "Crisp white stationery paper for bulk corporate invoices, letterheads, instruction pamphlets, and manuals.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: null, baseCost: 10 },
      { name: "12x18 (Both side)", lamination: 6, cutting: null, baseCost: 13 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: null, baseCost: 11 },
      { name: "13x19 (Both side)", lamination: 6.5, cutting: null, baseCost: 14 },
    ]
  },
  {
    media: "Sticker Sheet",
    tagline: "Self-adhesive paper & vinyl stickers",
    desc: "Peel-and-stick adhesive sheets with optional precision machine kiss-cut (half-cut) around each sticker contour.",
    sizes: [
      { name: "12x18 (Single)", lamination: 4.5, cutting: 8, baseCost: 13 },
      { name: "13x19 (Single)", lamination: 4.75, cutting: 9, baseCost: 16 },
    ]
  },
  {
    media: "OPEQUE / TRANSPRENT",
    tagline: "Synthetic tearproof & waterproof film",
    desc: "Specialized synthetic tear-proof transparent or opaque film for luxury waterproof tags, overlays, and badges.",
    sizes: [
      { name: "12x18 (Single)", lamination: null, cutting: null, baseCost: 17 },
      { name: "13x19 (Single)", lamination: null, cutting: null, baseCost: 20 },
    ]
  },
  {
    media: "A3 Letter Head",
    tagline: "Official executive letterhead substrate",
    desc: "Finely textured executive letterhead paper calibrated for sharp text rendering and laser/inkjet printer compatibility.",
    sizes: [
      { name: "A3 (Single)", lamination: null, cutting: null, baseCost: 9.5 },
    ]
  },
  {
    media: "PARTY PAPER PRINTING",
    tagline: "Vibrant high-contrast celebration paper",
    desc: "Specialty high-gamut party paper engineered for party banners, birthday bunting flags, photo booth props, and toppers.",
    sizes: [
      { name: "13*19 (Single)", lamination: null, cutting: null, baseCost: 9 },
    ]
  }
];

export const PRINT_SERVICE_SLIDES = [
  {
    url: "/catalog-images/00. Personalized Print Service/01 Custom Printing Showcase_ Flyers, Cards & Stickers-5.jpg",
    title: "Flyers, Cards & Custom Stickers",
    subtitle: "Commercial & Custom Bulk Print Hub"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalised Print Services Infographic Grid.jpg",
    title: "Personalized Print Service",
    subtitle: "Complete Media, Lamination & Cutting Grid"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalized Print Service Showcase-1.jpg",
    title: "Vibrant Archival Color Printing",
    subtitle: "100 GSM to 350 GSM Studio Cardstocks"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/01 Personalized Prints, Stickers & Packaging.jpg",
    title: "Bespoke Packaging & Stickers",
    subtitle: "Waterproof Vinyl & Paper Stickers"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/02 Print Sheet Size Comparison-3.jpg",
    title: "Print Sheet Size Comparison",
    subtitle: "12×18, 13×19 & A3 Formats (Single / Both Side)"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/03 Premium Media & Sticker Guide.jpg",
    title: "Premium Media & Substrates",
    subtitle: "Opaque, Transparent, Cardstock & Sticker Sheets"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/04 Premium Lamination Finish Options.jpg",
    title: "Thermal Gloss & Matte Lamination",
    subtitle: "Waterproof, Anti-Scratch Protective Shield"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/05 Custom Floral Packaging Solutions.jpg",
    title: "Precision Packaging & Cards",
    subtitle: "Folded Creasing, Boxes & Luxury Branding"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/06 Precision Cutting Services Infographic.jpg",
    title: "Half Cut (Kiss Cut) & Full Die-Cut",
    subtitle: "Precision Machine Contour Cutting & Creasing"
  },
  {
    url: "/catalog-images/00. Personalized Print Service/Custom Paper Prints Showcase (1).jpg",
    title: "Commercial Digital Printing",
    subtitle: "Dynamic Live Pricing: Unit Cost × Qty"
  }
];

export interface UploadedDesignFile {
  name: string;
  size: number;
  type: string;
  extension: string;
  previewUrl?: string;
}

export const PrintingServiceCustomizer: React.FC<PrintingServiceCustomizerProps> = ({
  product,
  onAddedToCart,
  onShare,
  onInstantCheckout
}) => {
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slideshow State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoSlidePaused, setIsAutoSlidePaused] = useState(false);

  // Customizer Configuration State
  const [selectedMediaName, setSelectedMediaName] = useState<string>("300 Gsm");
  const [selectedSizeName, setSelectedSizeName] = useState<string>("12x18 (Single)");
  const [hasLamination, setHasLamination] = useState<boolean>(false);
  const [laminationType, setLaminationType] = useState<'Gloss' | 'Matte'>('Gloss');
  const [hasHalfCut, setHasHalfCut] = useState<boolean>(false);
  const [hasFullCutCreasing, setHasFullCutCreasing] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(10);
  const [notes, setNotes] = useState<string>('');
  
  // Design Files State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDesignFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  // Auto Slideshow Effect (every 3.5s)
  useEffect(() => {
    if (isAutoSlidePaused) return;
    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % PRINT_SERVICE_SLIDES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoSlidePaused]);

  // Derived Media & Size Definitions
  const currentMediaDef = DEFAULT_PRINTING_PRICING.find(m => m.media === selectedMediaName) || DEFAULT_PRINTING_PRICING[1];
  const currentSizeDef = currentMediaDef.sizes.find(s => s.name === selectedSizeName) || currentMediaDef.sizes[0];

  // When Media changes, update Size & Reset incompatible options
  const handleSelectMedia = (mediaName: string) => {
    setSelectedMediaName(mediaName);
    const media = DEFAULT_PRINTING_PRICING.find(m => m.media === mediaName);
    if (media && media.sizes.length > 0) {
      setSelectedSizeName(media.sizes[0].name);
      if (media.sizes[0].lamination === null) setHasLamination(false);
      if (media.sizes[0].cutting === null) setHasHalfCut(false);
    }
  };

  // Price Calculation Engine: Unit Cost × Quantity
  const baseCost = currentSizeDef.baseCost;
  const laminationCost = (hasLamination && currentSizeDef.lamination !== null) ? currentSizeDef.lamination : 0;
  const halfCutCost = (hasHalfCut && currentSizeDef.cutting !== null) ? currentSizeDef.cutting : 0;
  const fullCutCost = hasFullCutCreasing ? 1.5 : 0;

  const unitCost = Number((baseCost + laminationCost + halfCutCost + fullCutCost).toFixed(2));
  const totalAmount = Math.round(unitCost * quantity);

  // Handle File Uploads (ZIP, RAR, PDF, CDR, PSD, AI, JPG, PNG)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const allowed = ['.zip', '.rar', '.pdf', '.cdr', '.psd', '.ai', '.jpg', '.jpeg', '.png'];
    
    const valid: UploadedDesignFile[] = [];
    let hasInvalid = false;

    files.forEach(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (allowed.includes(ext)) {
        let preview: string | undefined = undefined;
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          preview = URL.createObjectURL(file);
        }
        valid.push({
          name: file.name,
          size: file.size,
          type: file.type,
          extension: ext,
          previewUrl: preview
        });
      } else {
        hasInvalid = true;
      }
    });

    if (hasInvalid) {
      setFileError('Supported formats: ZIP, RAR, PDF, CDR, PSD, AI, JPG, PNG');
    } else {
      setFileError(null);
    }

    setUploadedFiles(prev => [...prev, ...valid]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Add to Cart
  const handleAddToCart = () => {
    let sizeLabel = `${currentSizeDef.name} (${selectedMediaName})`;
    if (hasLamination) sizeLabel += ` • ${laminationType} Thermal Lamination`;
    if (hasHalfCut) sizeLabel += ` • Kiss-Cut Half Cut`;
    if (hasFullCutCreasing) sizeLabel += ` • Full Cut & Creasing`;

    const mappedPhotos: UploadedPhotoInfo[] = uploadedFiles.map(f => ({
      url: f.previewUrl || '/catalog-images/00. Personalized Print Service/01 Personalised Print Services Infographic Grid.jpg',
      name: f.name,
      size: f.size,
      quality: 'Good quality'
    }));

    addToCart({
      product_id: product.id,
      sku: product.sku,
      product_name: `Personalized Printing Service - ${selectedMediaName}`,
      image: PRINT_SERVICE_SLIDES[0].url,
      size: sizeLabel,
      material: `${selectedMediaName} (${currentMediaDef.tagline})`,
      finish: hasLamination ? `${laminationType} Thermal Lamination` : 'Standard Matte Print (Unlaminated)',
      quantity,
      unit_price: unitCost,
      total: totalAmount,
      customization: {
        text: `Job: ${selectedMediaName} | ${selectedSizeName}`,
        notes: notes || undefined,
        photos: mappedPhotos,
        event_name: 'Commercial Digital Print',
        contact_info: `Media: ${selectedMediaName}, Size: ${selectedSizeName}, Lam: ${hasLamination ? laminationType : 'No'}, KissCut: ${hasHalfCut ? 'Yes' : 'No'}, Files: ${uploadedFiles.length}`
      },
      selected_extras: []
    });

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
    if (onAddedToCart) onAddedToCart();
  };

  return (
    <div className="w-full">
      {/* Top Banner Navigation & Share */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100/90 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
            00. Commercial Print Hub • Studio Production
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-stone-100 mt-2">
            Personalized Printing Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-stone-400 mt-1">
            Commercial on-demand digital printing on 100-350 GSM papers, sticker sheets & party papers with live dynamic pricing.
          </p>
        </div>

        {onShare && (
          <button
            onClick={() => onShare(product)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/80 px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Share This Service</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
        
        {/* ========================================================
            LEFT COLUMN: INTERACTIVE SLIDESHOW & SPECIFICATION GUIDES
           ======================================================== */}
        <div className="lg:col-span-5 xl:col-span-5 sticky top-24 space-y-4">
          <div 
            className="bg-white dark:bg-[#1A1816] rounded-3xl p-4 shadow-xl shadow-amber-900/10 dark:shadow-black/40 border border-[#E5DAC8] dark:border-stone-800 relative overflow-hidden group"
            onMouseEnter={() => setIsAutoSlidePaused(true)}
            onMouseLeave={() => setIsAutoSlidePaused(false)}
          >
            {/* Active Slideshow Viewer */}
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-stone-900 relative">
              <img
                src={PRINT_SERVICE_SLIDES[activeImageIndex].url}
                alt={PRINT_SERVICE_SLIDES[activeImageIndex].title}
                className="w-full h-full object-cover transition-all duration-700 ease-out"
              />

              {/* Tag Header */}
              <div className="absolute top-3 left-3 bg-amber-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Infographic {activeImageIndex + 1} of {PRINT_SERVICE_SLIDES.length}</span>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setActiveImageIndex((activeImageIndex - 1 + PRINT_SERVICE_SLIDES.length) % PRINT_SERVICE_SLIDES.length)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                title="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % PRINT_SERVICE_SLIDES.length)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
                title="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3 rounded-xl border border-white/60 dark:border-stone-700 shadow-md">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-stone-100 truncate">
                  {PRINT_SERVICE_SLIDES[activeImageIndex].title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-stone-400 truncate">
                  {PRINT_SERVICE_SLIDES[activeImageIndex].subtitle}
                </p>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {PRINT_SERVICE_SLIDES.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx 
                      ? 'border-amber-600 dark:border-amber-400 ring-2 ring-amber-500/20 scale-105' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quality Guarantees */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-stone-800 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-stone-400 px-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>12-Color Archival Pigment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Precision Blade Kiss-Cut</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Thermal Gloss / Matte Shield</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Heavy GSM 100 up to 350</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: COMMERCIAL CONFIGURATOR & PRICING
           ======================================================== */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          
          {/* STEP 1: PRINT MEDIA SELECTION */}
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 border border-[#E5DAC8] dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                    Select Print Media (Substrate & GSM)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-stone-400">
                    Choose from standard paper, heavy cardstock, sticker vinyl, or synthetic sheets.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                {selectedMediaName}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {DEFAULT_PRINTING_PRICING.map((item) => {
                const isSelected = selectedMediaName === item.media;
                return (
                  <button
                    key={item.media}
                    onClick={() => handleSelectMedia(item.media)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500 shadow-xs ring-1 ring-amber-500'
                        : 'bg-slate-50/50 dark:bg-stone-900/50 border-slate-200 dark:border-stone-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-xs sm:text-sm ${isSelected ? 'text-amber-900 dark:text-amber-300' : 'text-slate-800 dark:text-stone-200'}`}>
                        {item.media}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-stone-400 line-clamp-1 leading-tight">
                      {item.tagline}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Media detail description */}
            <div className="p-3 bg-slate-50 dark:bg-stone-900/60 rounded-xl border border-slate-200/80 dark:border-stone-800 text-xs text-slate-600 dark:text-stone-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{currentMediaDef.desc}</span>
            </div>
          </div>

          {/* STEP 2: PAPER SIZE & SIDES */}
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 border border-[#E5DAC8] dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                    Paper Size & Print Sides
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-stone-400">
                    Available sheet dimensions for {selectedMediaName}.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-stone-400">
                Base ₹{currentSizeDef.baseCost} / sheet
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentMediaDef.sizes.map((size) => {
                const isSelected = selectedSizeName === size.name;
                const isBothSide = size.name.toLowerCase().includes('both side');
                return (
                  <button
                    key={size.name}
                    onClick={() => {
                      setSelectedSizeName(size.name);
                      if (size.lamination === null) setHasLamination(false);
                      if (size.cutting === null) setHasHalfCut(false);
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500 ring-1 ring-amber-500 shadow-xs'
                        : 'bg-slate-50/50 dark:bg-stone-900/50 border-slate-200 dark:border-stone-700 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isSelected ? 'text-amber-900 dark:text-amber-300' : 'text-slate-800 dark:text-stone-200'}`}>
                          {size.name}
                        </span>
                        {isBothSide && (
                          <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                            Double Side
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-stone-400 mt-0.5">
                        {size.lamination !== null ? `Thermal Lam: +₹${size.lamination}` : 'Lamination: N/A'}
                        {size.cutting !== null ? ` • Half Cut: +₹${size.cutting}` : ''}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-[#B45309] dark:text-amber-400">
                        ₹{size.baseCost}
                      </span>
                      <span className="text-[10px] text-slate-400 block">per sheet</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: POST-PRESS ADDONS & FINISHING */}
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 border border-[#E5DAC8] dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                  Finishing & Post-Press Addons
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400">
                  Thermal lamination protective film, machine kiss-cutting, or creasing folds.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              
              {/* Option A: Thermal Lamination */}
              <div className={`p-4 rounded-2xl border transition-all ${
                hasLamination 
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600' 
                  : 'bg-slate-50/50 dark:bg-stone-900/50 border-slate-200 dark:border-stone-700'
              }`}>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasLamination}
                      disabled={currentSizeDef.lamination === null}
                      onChange={(e) => setHasLamination(e.target.checked)}
                      className="w-5 h-5 rounded text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer disabled:opacity-40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-stone-100">
                          Thermal Lamination Film
                        </span>
                        {currentSizeDef.lamination !== null ? (
                          <span className="text-[11px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                            +₹{currentSizeDef.lamination} / sheet
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Not applicable for this size/media</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-stone-400">
                        Scratch-resistant, waterproof protective barrier that intensifies color saturation.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Sub-selector for Gloss vs Matte */}
                {hasLamination && currentSizeDef.lamination !== null && (
                  <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-900/50 flex items-center gap-4">
                    <span className="text-xs font-semibold text-slate-700 dark:text-stone-300">Lamination Finish:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLaminationType('Gloss')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                          laminationType === 'Gloss'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 border-slate-200 dark:border-stone-700'
                        }`}
                      >
                        ✨ Gloss (High Shine)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLaminationType('Matte')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                          laminationType === 'Matte'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 border-slate-200 dark:border-stone-700'
                        }`}
                      >
                        💎 Matte (Velvety Anti-Glare)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Option B: Half Cut (Sticker Kiss Cut) */}
              <div className={`p-4 rounded-2xl border transition-all ${
                hasHalfCut 
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600' 
                  : 'bg-slate-50/50 dark:bg-stone-900/50 border-slate-200 dark:border-stone-700'
              }`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasHalfCut}
                    disabled={currentSizeDef.cutting === null}
                    onChange={(e) => setHasHalfCut(e.target.checked)}
                    className="w-5 h-5 rounded text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer disabled:opacity-40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-stone-100">
                        Half Cut (Sticker Kiss Cut)
                      </span>
                      {currentSizeDef.cutting !== null ? (
                        <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          +₹{currentSizeDef.cutting} / sheet
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Available on Sticker Sheet media</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-stone-400">
                      Machine kiss-cuts around sticker shapes while keeping the back release liner sheet intact for easy peeling.
                    </p>
                  </div>
                </label>
              </div>

              {/* Option C: Full Cut & Creasing */}
              <div className={`p-4 rounded-2xl border transition-all ${
                hasFullCutCreasing 
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600' 
                  : 'bg-slate-50/50 dark:bg-stone-900/50 border-slate-200 dark:border-stone-700'
              }`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasFullCutCreasing}
                    onChange={(e) => setHasFullCutCreasing(e.target.checked)}
                    className="w-5 h-5 rounded text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-stone-100">
                        Full Cut & Creasing / Scoring
                      </span>
                      <span className="text-[11px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                        +₹1.50 / sheet
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-stone-400">
                      Machine guillotine trim to final dimensions and mechanical fold scoring for invitations, brochures, and cards.
                    </p>
                  </div>
                </label>
              </div>

            </div>
          </div>

          {/* STEP 4: QUANTITY & DYNAMIC PRICING FORMULA */}
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 border border-[#E5DAC8] dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                    Quantity & Live Pricing Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-stone-400">
                    Formula: Price = Unit Cost × Quantity (Instant live updates)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              
              {/* Quantity Stepper */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-stone-300 mb-1.5">
                  Order Quantity (Sheets)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-300 dark:border-stone-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-stone-900">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 5))}
                      className="p-3 text-slate-600 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center font-bold text-slate-900 dark:text-stone-100 bg-transparent outline-none text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 5)}
                      className="p-3 text-slate-600 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preset chips */}
                  <div className="flex gap-1">
                    {[10, 25, 50, 100].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuantity(cnt)}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          quantity === cnt 
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                            : 'bg-white dark:bg-stone-800 text-slate-600 dark:text-stone-300 border-slate-200 dark:border-stone-700 hover:border-amber-300'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Calculation Summary Card */}
              <div className="bg-amber-50/70 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-300/80 dark:border-amber-800/80">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-stone-300">
                    <span>Base Print Cost:</span>
                    <span>₹{baseCost.toFixed(2)}</span>
                  </div>
                  {laminationCost > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-stone-300">
                      <span>{laminationType} Lamination:</span>
                      <span>+₹{laminationCost.toFixed(2)}</span>
                    </div>
                  )}
                  {halfCutCost > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-stone-300">
                      <span>Kiss-Cut (Half Cut):</span>
                      <span>+₹{halfCutCost.toFixed(2)}</span>
                    </div>
                  )}
                  {fullCutCost > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-stone-300">
                      <span>Full Cut & Creasing:</span>
                      <span>+₹{fullCutCost.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-amber-200 dark:border-amber-900/60 flex justify-between items-baseline">
                    <span className="font-bold text-slate-800 dark:text-stone-200">
                      Unit Cost:
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-stone-100">
                      ₹{unitCost.toFixed(2)} / sheet
                    </span>
                  </div>

                  <div className="pt-1 flex justify-between items-baseline">
                    <span className="font-serif font-bold text-sm sm:text-base text-amber-900 dark:text-amber-300">
                      Total Order Amount:
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-lg sm:text-xl text-[#B45309] dark:text-amber-400">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({unitCost.toFixed(2)} × {quantity} sheets)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* STEP 5: DESIGN FILE UPLOAD (ZIP, RAR, PDF, CDR, PSD, AI, JPG, PNG) */}
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 border border-[#E5DAC8] dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                  5
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                    Upload Print Design Files
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-stone-400">
                    Accepts ZIP, RAR, PDF, CDR, PSD, AI, JPG, PNG (Max 100MB per file)
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-stone-400">
                {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} attached
              </span>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".zip,.rar,.pdf,.cdr,.psd,.ai,.jpg,.jpeg,.png"
              className="hidden"
            />

            {/* Dropzone button */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300/80 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-400 bg-amber-50/30 dark:bg-stone-900/40 rounded-2xl p-6 text-center cursor-pointer transition-all hover:scale-[1.005]"
            >
              <UploadCloud className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-800 dark:text-stone-200">
                Click here or drag & drop design files to upload
              </p>
              <p className="text-xs text-slate-500 dark:text-stone-400 mt-1">
                Supported formats: <span className="font-semibold text-amber-800 dark:text-amber-300">.ZIP, .RAR, .PDF, .CDR, .PSD, .AI, .JPG, .PNG</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ensure fonts in vector files (CDR, AI) are converted to curves/outlines.
              </p>
            </div>

            {fileError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400">
                  Attached Files ({uploadedFiles.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {uploadedFiles.map((file, idx) => {
                    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-stone-800 bg-slate-50/80 dark:bg-stone-900/80"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {file.previewUrl ? (
                            <img src={file.previewUrl} alt={file.name} className="w-8 h-8 rounded object-cover shrink-0" />
                          ) : file.extension === '.pdf' ? (
                            <div className="w-8 h-8 rounded bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                              PDF
                            </div>
                          ) : ['.zip', '.rar'].includes(file.extension) ? (
                            <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                              ZIP
                            </div>
                          ) : ['.cdr', '.ai', '.psd'].includes(file.extension) ? (
                            <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {file.extension.replace('.', '').toUpperCase()}
                            </div>
                          ) : (
                            <FileText className="w-6 h-6 text-slate-500 shrink-0" />
                          )}

                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-800 dark:text-stone-200 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <span className="text-[10px] text-slate-400">{sizeMb} MB</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Design Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-stone-300 mb-1">
                Design & Printing Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Cut 3mm inside safe margin, maintain Pantone colors, package in sets of 50..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-900 text-xs text-slate-800 dark:text-stone-200 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* ACTION BUTTONS & CHECKOUT STRIP */}
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 border border-[#E5DAC8] dark:border-stone-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-stone-400">Total Calculation:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#B45309] dark:text-amber-400">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500">
                    (₹{unitCost.toFixed(2)} × {quantity} sheets)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  ✓ Instant Dynamic UPI Verification supported
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-none bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-700 text-slate-800 dark:text-stone-100 font-bold py-3.5 px-6 rounded-2xl border border-slate-300 dark:border-stone-700 shadow-xs text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    if (onInstantCheckout) onInstantCheckout();
                  }}
                  className="flex-1 sm:flex-none bg-[#B45309] hover:bg-[#92400E] dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold py-3.5 px-7 rounded-2xl shadow-lg shadow-amber-900/20 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to UPI Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {successToast && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Job added to your cart! You can review or proceed directly to instant UPI checkout.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
