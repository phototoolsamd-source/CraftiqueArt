import React, { useState, useRef, useEffect } from 'react';
import { UploadedPhotoInfo } from '../../types';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Image as ImageIcon,
  Check,
  Palette
} from 'lucide-react';

interface InteractivePreviewProps {
  productName: string;
  images?: string[];
  defaultImage?: string;
  photos: UploadedPhotoInfo[];
  customText?: string;
  size: string;
  material: string;
  finish: string;
  frame?: string;
  shape?: string;
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  productName,
  images = [],
  defaultImage = '',
  photos,
  customText,
  size,
  material,
  finish,
  frame,
  shape
}) => {
  // Normalize all available product images
  const allProductImages = images && images.length > 0 
    ? images 
    : (defaultImage ? [defaultImage] : []);

  // Mode: 'gallery' (browse all folder photos, size charts, in-room views) or 'simulation' (live 3D framed preview)
  const [activeTab, setActiveTab] = useState<'gallery' | 'simulation'>('gallery');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Simulation controls
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  const [zoomLevel, setZoomLevel] = useState(1);

  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // When customer uploads a custom photo, automatically add visual cue or make it active in simulation
  useEffect(() => {
    if (photos.length > 0) {
      // Keep gallery available but simulation becomes rich with customer's photo
    }
  }, [photos]);

  const currentImage = allProductImages[selectedImageIndex] || defaultImage || '';

  // Simulation display photo: customer photo or active product image
  const simulationImage = photos.length > 0 ? photos[0].url : (allProductImages[0] || defaultImage);

  // Parse intelligent label based on filename
  const getImageBadge = (imgUrl: string, idx: number) => {
    const l = decodeURIComponent(imgUrl).toLowerCase();
    if (l.includes('hero')) return { label: 'Hero Showcase', type: 'hero' };
    if (l.includes('banner')) return { label: 'Studio Banner', type: 'banner' };
    if (l.includes('size_')) {
      const match = decodeURIComponent(imgUrl).match(/size_([0-9xX_]+(?:inch|inches)?)/i);
      return { label: `Size Guide ${match ? `(${match[1].replace(/_/g, ' ')})` : ''}`, type: 'size' };
    }
    if (l.includes('usage') || l.includes('room')) return { label: 'In-Room Lifestyle', type: 'usage' };
    if (l.includes('detail') || l.includes('material')) return { label: 'Craft & Texture Details', type: 'details' };
    if (l.includes('beforeafter')) return { label: 'Framing & Finishes', type: 'finishes' };
    return { label: `Photo ${idx + 1}`, type: 'photo' };
  };

  const currentBadge = getImageBadge(currentImage, selectedImageIndex);

  // Frame styling simulation for 3D simulator
  const getFrameStyle = () => {
    switch (frame) {
      case 'Sleek Matte Black Floating Frame':
      case 'Black Floating Frame':
        return 'border-[12px] border-slate-900 shadow-2xl';
      case 'Natural Teak Wood Floating Frame':
      case 'Teak Wood Frame':
        return 'border-[14px] border-[#85512B] shadow-2xl';
      case 'Opulent Golden Luxe Frame':
        return 'border-[14px] border-[#D4AF37] shadow-2xl';
      case 'Modern White Float Frame':
        return 'border-[12px] border-white shadow-xl';
      default:
        // Gallery Wrap / Stretched Canvas (3D border shadow effect)
        return 'border-4 border-slate-200/60 shadow-2xl';
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? allProductImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === allProductImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'gallery') {
        if (e.key === 'ArrowLeft') handlePrevImage();
        if (e.key === 'ArrowRight') handleNextImage();
        if (e.key === 'Escape' && isLightboxOpen) setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isLightboxOpen, allProductImages.length]);

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#1A1816] rounded-3xl p-4 sm:p-5 border border-[#E8DFD0] dark:border-stone-800 shadow-sm flex flex-col space-y-4 transition-colors">
      
      {/* Top Header & Mode Toggle Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EAE0D0] dark:border-stone-800">
        
        {/* Gallery / Simulation Mode Switcher */}
        <div className="bg-white/90 dark:bg-stone-800/90 border border-slate-200/90 dark:border-stone-700 rounded-xl p-1 flex items-center shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-amber-800 dark:bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-stone-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Product Photos ({allProductImages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'simulation'
                ? 'bg-amber-800 dark:bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-stone-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Live 3D Customizer</span>
          </button>
        </div>

        {/* Right action controls */}
        {activeTab === 'gallery' ? (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-medium text-slate-500 dark:text-stone-400 font-mono">
              {selectedImageIndex + 1} / {allProductImages.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-white dark:bg-stone-800 border border-slate-200 dark:border-stone-700 px-2.5 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-stone-700 transition-colors shadow-2xs cursor-pointer"
              title="View full resolution in lightbox"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Zoom</span>
            </button>
          </div>
        ) : (
          /* Simulation Mode Controls */
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="bg-white dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-lg p-0.5 flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('front')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'front' ? 'bg-amber-800 dark:bg-amber-600 text-white' : 'text-slate-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => setViewMode('back')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'back' ? 'bg-amber-800 dark:bg-amber-600 text-white' : 'text-slate-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Back
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
              className="p-1.5 bg-white dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-lg text-slate-600 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-stone-700 transition-colors"
              title="Rotate Orientation"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODE 1: MULTI-IMAGE GALLERY VIEW (ALL 7-8 PRODUCT IMAGES) */}
      {/* ======================================================== */}
      {activeTab === 'gallery' ? (
        <div className="space-y-3">
          {/* Main Showcase Stage */}
          <div 
            onClick={() => setIsLightboxOpen(true)}
            className="group relative min-h-[380px] sm:min-h-[440px] max-h-[500px] bg-white dark:bg-[#121110] rounded-2xl flex items-center justify-center p-3 overflow-hidden select-none border border-[#E9E0D2] dark:border-stone-800 shadow-sm cursor-zoom-in"
          >
            {/* Active Image */}
            <img
              src={currentImage}
              alt={`${productName} view ${selectedImageIndex + 1}`}
              className="relative z-0 w-full h-full max-h-[440px] object-contain rounded-xl transition-all duration-300 group-hover:scale-[1.02]"
            />

            {/* Floating Badge (Type & Slide number) */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/10 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{currentBadge.label}</span>
              <span className="text-slate-400 text-[10px]">({selectedImageIndex + 1}/{allProductImages.length})</span>
            </div>

            {/* Hover overlay hint */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 pointer-events-none">
              <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Click to view full screen</span>
            </div>

            {/* Left Chevron Button */}
            {allProductImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/95 dark:bg-stone-800/95 border border-slate-200/90 dark:border-stone-700 shadow-lg text-slate-800 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-stone-700 hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right Chevron Button */}
            {allProductImages.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/95 dark:bg-stone-800/95 border border-slate-200/90 dark:border-stone-700 shadow-lg text-slate-800 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-stone-700 hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Thumbnail Strip (All 6 to 10 Images from folder) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-stone-400 px-1">
              <span className="font-semibold text-slate-700 dark:text-stone-300">Studio Gallery ({allProductImages.length} photos)</span>
              <span className="text-amber-800 dark:text-amber-400 text-[10px]">Click thumbnail to inspect</span>
            </div>

            <div
              ref={thumbnailScrollRef}
              className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1.5 px-0.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allProductImages.map((imgUrl, idx) => {
                const isSelected = selectedImageIndex === idx;
                const badge = getImageBadge(imgUrl, idx);

                return (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`group relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-white dark:bg-stone-800 flex flex-col ${
                      isSelected
                        ? 'border-amber-600 dark:border-amber-500 ring-2 ring-amber-500/40 scale-105 shadow-md'
                        : 'border-slate-200/90 dark:border-stone-700 opacity-75 hover:opacity-100 hover:border-amber-400'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Miniature caption label */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/65 backdrop-blur-xs text-[9px] font-semibold text-white px-1 py-0.5 truncate text-center">
                      {badge.label.split(' ')[0]}
                    </div>

                    {isSelected && (
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Optional Tile to Jump directly to Simulation */}
              <button
                type="button"
                onClick={() => setActiveTab('simulation')}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-800 hover:border-amber-600 dark:hover:border-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 transition-all cursor-pointer shrink-0 bg-amber-50/20 dark:bg-amber-950/20 flex flex-col items-center justify-center p-1 text-center group"
                title="Switch to 3D Customizer Preview"
              >
                <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[9px] font-bold text-amber-900 dark:text-amber-200 leading-tight">
                  3D Live Preview
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* MODE 2: INTERACTIVE 3D FRAMING SIMULATION */
        /* ======================================================== */
        <div className="space-y-3">
          <div className="relative min-h-[380px] sm:min-h-[440px] bg-gradient-to-b from-[#EBE3D5]/40 to-[#FAF8F5] dark:from-[#181614] dark:to-[#121110] rounded-2xl flex items-center justify-center p-6 overflow-hidden select-none border border-[#EAE0D0] dark:border-stone-800">
            {/* Subtle wall background texture & room context */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-200/50 dark:from-stone-900/50 to-transparent pointer-events-none" />

            {viewMode === 'front' ? (
              <div
                style={{ transform: `scale(${zoomLevel})` }}
                className={`transition-all duration-300 relative ${getFrameStyle()} ${
                  shape === 'Round'
                    ? 'rounded-full aspect-square w-64 sm:w-72 ring-4 ring-amber-600/20'
                    : shape === 'Custom Shape'
                    ? 'rounded-3xl ring-4 ring-amber-600/30'
                    : 'rounded-sm'
                } overflow-hidden bg-white max-w-full shadow-2xl ${
                  shape === 'Round' ? '' : (orientation === 'portrait' ? 'w-64 sm:w-72 aspect-3/4' : 'w-80 sm:w-96 aspect-4/3')
                }`}
              >
                {/* Customer Photo / Simulation Mockup */}
                <img
                  src={simulationImage}
                  alt="Customized Artwork Simulation"
                  className="w-full h-full object-cover"
                />

                {/* Shape outline badge indicator if applicable */}
                {shape && (
                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <span>Shape: {shape}</span>
                  </div>
                )}

                {/* Simulated Matte / Gloss finish reflection overlay */}
                {finish.toLowerCase().includes('gloss') && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                )}

                {/* Custom Text Overlay if present */}
                {customText && (
                  <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-xs text-white p-2.5 rounded-md text-center shadow-lg pointer-events-none">
                    <p className="font-serif italic text-xs sm:text-sm tracking-wide">
                      "{customText}"
                    </p>
                  </div>
                )}

                {/* Multi-photo badge if more than 1 uploaded */}
                {photos.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Layers className="w-3 h-3 text-amber-300" />
                    <span>Photo 1 of {photos.length}</span>
                  </div>
                )}
              </div>
            ) : (
              /* Back Preview: Wooden frame structure, certificate & hanging wire */
              <div
                style={{ transform: `scale(${zoomLevel})` }}
                className={`transition-all duration-300 relative border-8 border-[#7C4824] bg-[#CBB191] rounded-sm p-4 flex flex-col justify-between shadow-2xl max-w-full ${
                  orientation === 'portrait' ? 'w-64 sm:w-72 aspect-3/4' : 'w-80 sm:w-96 aspect-4/3'
                }`}
              >
                {/* Hanging Wire Simulation */}
                <div className="w-full h-1 bg-slate-700/60 rounded-full my-6 relative">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-800 bg-amber-400" />
                </div>

                {/* Studio Authenticity Seal */}
                <div className="bg-[#FAF7F2] p-3 rounded border border-[#BFA788] text-center shadow-xs mx-auto max-w-[200px]">
                  <div className="font-serif font-bold text-xs text-amber-900">CRAFTIQUE</div>
                  <p className="text-[9px] text-slate-600 mt-0.5">Archival Museum Fine Art</p>
                  <p className="text-[8px] text-slate-400 mt-1 font-mono">100% Acid-Free Substrate</p>
                  <div className="mt-1 text-[8px] font-bold text-emerald-800">
                    Studio QC Passed • Handcrafted
                  </div>
                </div>

                <div className="text-[10px] text-slate-700 text-center font-medium">
                  Heavy-Duty Reinforced Corner Brackets & Wall Standoffs
                </div>
              </div>
            )}

            {/* Live specification tags pinned on preview */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 text-[10px] font-semibold text-slate-700 dark:text-stone-300 bg-white/90 dark:bg-stone-800/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-stone-700 shadow-xs pointer-events-none">
              <span>Dimension: {size}</span>
              <span>Substrate: {material}</span>
              <span>Frame: {frame || 'Gallery Wrap'}</span>
            </div>
          </div>

          {/* Zoom and Reset Controls for 3D simulator */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-stone-400 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.15))}
                className="p-1 hover:text-black dark:hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-24 accent-amber-800 dark:accent-amber-500 cursor-pointer h-1"
              />
              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(1.3, zoomLevel + 0.15))}
                className="p-1 hover:text-black dark:hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setZoomLevel(1);
                setOrientation('portrait');
                setViewMode('front');
              }}
              className="text-[11px] text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset View
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FULLSCREEN LIGHTBOX MODAL (ULTRA HIGH-RES ZOOM & INSPECT) */}
      {/* ======================================================== */}
      {isLightboxOpen && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-scale-in"
        >
          {/* Lightbox Header Bar */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-white pb-3 border-b border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-base sm:text-lg tracking-tight">
                {productName}
              </span>
              <span className="text-xs bg-white/15 px-3 py-1 rounded-full text-amber-300 font-semibold flex items-center gap-1.5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{currentBadge.label}</span>
                <span className="text-white/60 font-mono">({selectedImageIndex + 1} / {allProductImages.length})</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Central Display Stage with Navigation */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 flex items-center justify-center overflow-hidden my-4"
          >
            {allProductImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl transition-all hover:scale-110 cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={currentImage}
              alt={`${productName} view ${selectedImageIndex + 1}`}
              className="max-h-[78vh] max-w-[92vw] object-contain rounded-xl shadow-2xl transition-all select-none"
            />

            {allProductImages.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-2xl transition-all hover:scale-110 cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails Carousel */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-none"
          >
            {allProductImages.map((imgUrl, idx) => {
              const isSelected = selectedImageIndex === idx;
              return (
                <button
                  key={`lightbox-${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 scale-105 ring-2 ring-amber-300'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
