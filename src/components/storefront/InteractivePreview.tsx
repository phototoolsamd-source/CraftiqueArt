import React, { useState } from 'react';
import { UploadedPhotoInfo } from '../../types';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface InteractivePreviewProps {
  productName: string;
  defaultImage: string;
  photos: UploadedPhotoInfo[];
  customText?: string;
  size: string;
  material: string;
  finish: string;
  frame?: string;
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  productName,
  defaultImage,
  photos,
  customText,
  size,
  material,
  finish,
  frame
}) => {
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('portrait');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Active display image: customer photo #1 or default product mockup
  const displayImage = photos.length > 0 ? photos[0].url : defaultImage;

  // Frame styling simulation
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

  return (
    <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E8DFD0] shadow-sm flex flex-col space-y-4">
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-800" />
          <span className="font-serif font-bold text-sm text-slate-900">
            Interactive Studio Simulation
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Front / Back Toggle */}
          <div className="bg-white border border-slate-200 rounded-lg p-0.5 flex text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('front')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'front' ? 'bg-amber-800 text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => setViewMode('back')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'back' ? 'bg-amber-800 text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              Back
            </button>
          </div>

          {/* Orientation Rotate */}
          <button
            type="button"
            onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-black hover:bg-slate-50 transition-colors"
            title="Rotate Orientation"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visual Display Stage */}
      <div className="relative min-h-[360px] sm:min-h-[420px] bg-gradient-to-b from-[#EBE3D5]/40 to-[#FAF8F5] rounded-2xl flex items-center justify-center p-6 overflow-hidden select-none border border-[#EAE0D0]">
        {/* Subtle wall background texture & room context */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-200/50 to-transparent pointer-events-none" />

        {viewMode === 'front' ? (
          <div
            style={{ transform: `scale(${zoomLevel})` }}
            className={`transition-all duration-300 relative ${getFrameStyle()} rounded-sm overflow-hidden bg-white max-w-full ${
              orientation === 'portrait' ? 'w-64 sm:w-72 aspect-3/4' : 'w-80 sm:w-96 aspect-4/3'
            }`}
          >
            {/* Customer Photo / Mockup */}
            <img
              src={displayImage}
              alt="Customized Artwork Simulation"
              className="w-full h-full object-cover"
            />

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
                <span>Page 1 of {photos.length}</span>
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
              <div className="font-serif font-bold text-xs text-amber-900">CREAFTIQUE</div>
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
        <div className="absolute top-3 left-3 flex flex-col gap-1 text-[10px] font-semibold text-slate-700 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs pointer-events-none">
          <span>Dimension: {size}</span>
          <span>Substrate: {material}</span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.15))}
            className="p-1 hover:text-black rounded"
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
            className="w-24 accent-amber-800 cursor-pointer h-1"
          />
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(1.3, zoomLevel + 0.15))}
            className="p-1 hover:text-black rounded"
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
          className="text-[11px] text-amber-800 hover:underline flex items-center gap-1 font-semibold"
        >
          <RefreshCw className="w-3 h-3" /> Reset View
        </button>
      </div>
    </div>
  );
};
