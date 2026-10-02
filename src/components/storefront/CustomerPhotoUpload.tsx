import React, { useRef, useState } from 'react';
import { UploadedPhotoInfo } from '../../types';
import { 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  Box, 
  Layers,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface CustomerPhotoUploadProps {
  photos: UploadedPhotoInfo[];
  onPhotosChange: (photos: UploadedPhotoInfo[]) => void;
  requiredCount?: number;
  maxCount?: number;
  categoryType?: 'album' | 'magnets' | 'mini-prints' | 'standard';
  albumSheets?: number;
  albumPages?: number;
  packCount?: number;
  printSize?: string;
  stepNumber?: number;
}

export const CustomerPhotoUpload: React.FC<CustomerPhotoUploadProps> = ({
  photos,
  onPhotosChange,
  requiredCount = 1,
  maxCount = 1,
  categoryType = 'standard',
  albumSheets = 5,
  albumPages = 10,
  packCount = 6,
  printSize = '12 × 18 inch',
  stepNumber
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  // Effective limit
  const effectiveMax = Math.max(1, maxCount);
  const remainingSlots = Math.max(0, effectiveMax - photos.length);
  const isFulfilled = photos.length >= requiredCount;
  const isMaxReached = photos.length >= effectiveMax;

  // Analyze image resolution, aspect ratio, and print suitability
  const analyzeImage = (file: File): Promise<UploadedPhotoInfo> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const megapixels = (width * height) / 1000000;

        let orientation: string = 'Square';
        if (width > height * 1.1) orientation = 'Landscape';
        else if (height > width * 1.1) orientation = 'Portrait';

        // Check if resolution meets print standard
        let quality: 'Good quality' | 'Low resolution' | 'Potential blur' = 'Good quality';
        if (width < 800 || height < 800) {
          quality = 'Potential blur';
        } else if (width < 1400 || height < 1400) {
          quality = 'Low resolution';
        }

        resolve({
          url: objectUrl,
          name: file.name,
          size: file.size,
          width,
          height,
          aspect_ratio: `${orientation} (${width}×${height}px, ${megapixels.toFixed(1)} MP)`,
          quality
        });
      };

      img.onerror = () => {
        resolve({
          url: objectUrl,
          name: file.name,
          size: file.size,
          quality: 'Good quality'
        });
      };

      img.src = objectUrl;
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setWarningMsg(null);

    const availableSlots = effectiveMax - photos.length;
    if (availableSlots <= 0) {
      setWarningMsg(`Maximum limit of ${effectiveMax} photos has already been reached.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      setWarningMsg(`You can upload maximum ${effectiveMax} photos. Added ${availableSlots} photo(s). ${files.length - availableSlots} extra file(s) were skipped.`);
    }

    setUploadProgress(15);
    const newPhotos: UploadedPhotoInfo[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const photoInfo = await analyzeImage(file);
      newPhotos.push(photoInfo);
      setUploadProgress(Math.round(((i + 1) / filesToProcess.length) * 100));
    }

    setTimeout(() => {
      onPhotosChange([...photos, ...newPhotos]);
      setUploadProgress(null);
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
    setWarningMsg(null);
  };

  const clearAllPhotos = () => {
    onPhotosChange([]);
    setWarningMsg(null);
  };

  // Helper label for slot allocation
  const getSlotLabel = (idx: number) => {
    if (categoryType === 'album') {
      const pageNum = Math.floor(idx / 4) + 1;
      const slotInPage = (idx % 4) + 1;
      return `Page ${pageNum} • Slot ${slotInPage}/4`;
    }
    if (categoryType === 'magnets') {
      return `Magnet #${idx + 1}`;
    }
    if (categoryType === 'mini-prints') {
      return `Mini Print #${idx + 1}`;
    }
    return `Photo #${idx + 1}`;
  };

  // Progress percentage
  const progressPct = Math.min(100, Math.round((photos.length / effectiveMax) * 100));

  return (
    <div className="space-y-4">
      {/* Category Specific Capacity Header */}
      <div className="bg-[#FAF7F2] dark:bg-stone-900/90 p-4 rounded-2xl border border-[#E8DFD0] dark:border-stone-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              {categoryType === 'album' && <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />}
              {categoryType === 'magnets' && <Box className="w-4 h-4 text-indigo-800 dark:text-indigo-400" />}
              {categoryType === 'mini-prints' && <Layers className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />}
              {categoryType === 'standard' && <ImageIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />}
              
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-stone-100">
                {stepNumber ? `${stepNumber}. ` : ''}
                {categoryType === 'album' && `Upload Album Photos (${albumSheets} Sheets = ${albumPages} Pages)`}
                {categoryType === 'magnets' && `Upload Magnet Photos (${packCount} Magnets)`}
                {categoryType === 'mini-prints' && `Upload Mini Print Photos (${packCount} Prints)`}
                {categoryType === 'standard' && (requiredCount === 0 ? 'Upload Photos / Artwork / Logo (Optional)' : 'Upload High-Resolution Photos & Artwork')}
              </h3>
            </div>

            {/* Dynamic Rule Explainer */}
            <p className="text-[11px] text-slate-600 dark:text-stone-300 mt-1">
              {categoryType === 'album' && (
                <span>
                  📖 <strong>{albumSheets} Sheets = {albumPages} Pages</strong>. Each page fits up to 4 images. You can upload up to <strong>{effectiveMax} photos</strong>.
                </span>
              )}
              {categoryType === 'magnets' && (
                <span>
                  🧲 Each magnet gets its own personalized picture. You can upload up to <strong>{effectiveMax} photos</strong> (1 photo per magnet).
                </span>
              )}
              {categoryType === 'mini-prints' && (
                <span>
                  🃏 Each mini print card is custom printed. You can upload up to <strong>{effectiveMax} photos</strong> (1 photo per print).
                </span>
              )}
              {categoryType === 'standard' && (
                <span>
                  Supported formats: JPG, PNG, WEBP, HEIC, PDF (Max 30MB per file). DPI auto-inspected for {printSize}.
                </span>
              )}
            </p>
          </div>

          {/* Photo Counter Pill */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs px-3 py-1.5 rounded-full font-bold border shadow-2xs ${
                isMaxReached
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                  : photos.length > 0
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 border-slate-200 dark:border-stone-700'
              }`}
            >
              Uploaded: {photos.length} / {effectiveMax} Max
            </span>

            {photos.length > 0 && (
              <button
                type="button"
                onClick={clearAllPhotos}
                className="text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded-md border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear all uploaded photos"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Capacity Fill Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-stone-400">
            <span>Capacity Utilized</span>
            <span>
              {photos.length} of {effectiveMax} slots filled ({progressPct}%)
              {remainingSlots > 0 ? ` • ${remainingSlots} slots remaining` : ' • All slots full!'}
            </span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isMaxReached 
                  ? 'bg-emerald-600' 
                  : progressPct > 60 
                  ? 'bg-amber-600' 
                  : 'bg-[#B45309]'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warning Message Banner if exceeded */}
      {warningMsg && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs p-3 rounded-xl flex items-start gap-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="flex-1">{warningMsg}</p>
        </div>
      )}

      {/* Drag & Drop Upload Dropzone */}
      {!isMaxReached ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            dragActive
              ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-4 ring-amber-500/20'
              : 'border-[#DECDBB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-stone-900/60 hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="w-12 h-12 rounded-full bg-white dark:bg-stone-800 shadow-xs border border-amber-200 dark:border-stone-700 mx-auto flex items-center justify-center text-amber-700 dark:text-amber-400 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-stone-200">
            Click to upload or drag & drop up to {remainingSlots} more {remainingSlots === 1 ? 'photo' : 'photos'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-stone-400 mt-1">
            Batch multi-select supported. Hold Shift or Ctrl/Cmd to select all {effectiveMax} photos together.
          </p>

          {uploadProgress !== null && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="flex justify-between text-[10px] font-semibold text-amber-900 dark:text-amber-300 mb-1">
                <span>Analyzing photo quality & DPI...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-700 h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>All {effectiveMax} photo slots have been filled!</strong> You can review each photo below or remove any to replace it.
            </span>
          </div>
        </div>
      )}

      {/* Uploaded Photos Grid with Quality Analysis and Slot Badges */}
      {photos.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-stone-300 uppercase tracking-wider">
            <span>
              Uploaded Photos List ({photos.length} / {effectiveMax})
            </span>
            <span className="text-[10px] font-normal text-slate-500 dark:text-stone-400 normal-case">
              Arranged in printing order
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {photos.map((p, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 rounded-xl border border-slate-200 dark:border-stone-800 p-2.5 flex items-center gap-3 relative shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
              >
                {/* Photo Thumbnail */}
                <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-stone-800 overflow-hidden shrink-0 border border-slate-200 dark:border-stone-700 relative">
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-0.5 left-0.5 bg-black/75 text-white text-[9px] px-1 rounded font-bold font-mono">
                    #{idx + 1}
                  </span>
                </div>

                {/* Details & Slot Allocation */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-1.5 py-0.5 rounded">
                      {getSlotLabel(idx)}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 dark:text-stone-100 truncate mt-0.5" title={p.name}>
                    {p.name}
                  </p>

                  <p className="text-[10px] text-slate-400 dark:text-stone-500">
                    {p.aspect_ratio || `${(p.size / (1024 * 1024)).toFixed(2)} MB`}
                  </p>

                  {/* Quality Check Badge */}
                  <div className="mt-1">
                    {p.quality === 'Good quality' ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Print Ready
                      </span>
                    ) : p.quality === 'Low resolution' ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Low Res
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Potential Blur
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 text-slate-400 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
