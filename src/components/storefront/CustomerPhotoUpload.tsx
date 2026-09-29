import React, { useRef, useState } from 'react';
import { UploadedPhotoInfo } from '../../types';
import { UploadCloud, CheckCircle, AlertTriangle, X, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

interface CustomerPhotoUploadProps {
  photos: UploadedPhotoInfo[];
  onPhotosChange: (photos: UploadedPhotoInfo[]) => void;
  requiredCount?: number;
  printSize?: string;
}

export const CustomerPhotoUpload: React.FC<CustomerPhotoUploadProps> = ({
  photos,
  onPhotosChange,
  requiredCount = 1,
  printSize = '12 × 18 inch'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Analyze image resolution, aspect ratio, and print suitability
  const analyzeImage = (file: File): Promise<UploadedPhotoInfo> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const megapixels = (width * height) / 1000000;
        const ratio = (width / height).toFixed(2);

        let orientation: string = 'Square';
        if (width > height * 1.1) orientation = 'Landscape';
        else if (height > width * 1.1) orientation = 'Portrait';

        // Check if resolution meets print standard (>= 150 DPI for estimated 12x18 inch = 1800x2700)
        let quality: 'Good quality' | 'Low resolution' | 'Potential blur' = 'Good quality';
        if (width < 1000 || height < 1000) {
          quality = 'Potential blur';
        } else if (width < 1800 || height < 1800) {
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

    setUploadProgress(15);
    const newPhotos: UploadedPhotoInfo[] = [];

    // Simulate progress while reading and analyzing
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const photoInfo = await analyzeImage(file);
      newPhotos.push(photoInfo);
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
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
  };

  const isFulfilled = photos.length >= requiredCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
            Upload Your High-Resolution Photos
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Supported formats: JPG, PNG, WEBP, HEIC, PDF (Max 30MB per file)
          </p>
        </div>

        {/* Counter Badge */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
            isFulfilled
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}
        >
          Uploaded: {photos.length} / {requiredCount} Required
        </span>
      </div>

      {/* Drag & Drop Box */}
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
            ? 'border-amber-600 bg-amber-50/60 ring-4 ring-amber-500/20'
            : 'border-[#DECDBB] bg-[#FAF8F5] hover:border-amber-500 hover:bg-amber-50/30'
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

        <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-amber-200 mx-auto flex items-center justify-center text-amber-700 mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-800">
          Click to upload or drag & drop high-resolution photos
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Our studio auto-inspects DPI & resolution suitability for {printSize}
        </p>

        {uploadProgress !== null && (
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-[10px] font-semibold text-amber-900 mb-1">
              <span>Analyzing photo DPI & aspect ratio...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-700 h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Photos Grid with Quality Analysis */}
      {photos.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Uploaded Photos Quality Check ({photos.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {photos.map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-2.5 flex items-center gap-3 relative shadow-xs"
              >
                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-0.5 left-0.5 bg-black/70 text-white text-[9px] px-1 rounded font-bold">
                    #{idx + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={p.name}>
                    {p.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {p.aspect_ratio || `${(p.size / (1024 * 1024)).toFixed(2)} MB`}
                  </p>

                  {/* Quality Check Badge */}
                  <div className="mt-1">
                    {p.quality === 'Good quality' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        ✓ Good quality (Print Ready)
                      </span>
                    ) : p.quality === 'Low resolution' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        ⚠ Low resolution (Medium Print)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <AlertTriangle className="w-3 h-3" />
                        ⚠ Image may appear blurry when printed
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 p-1 rounded-full hover:bg-slate-100"
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
