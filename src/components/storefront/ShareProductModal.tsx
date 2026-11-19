import React, { useState } from 'react';
import { Product } from '../../types';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink, 
  Send, 
  Mail,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ShareProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareProductModal: React.FC<ShareProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  // Generate deep-link URL based on SKU
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://craftique-art.vercel.app';
  const shareUrl = `${baseUrl}/p/${encodeURIComponent(product.sku)}`;

  const primaryImg = product.images?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80';

  // Format WhatsApp Share Message
  const whatsappMessage = `✨ *Craftique Handmade & Custom Art* ✨\n\n🎨 *${product.name}*\n🏷️ Category: ${product.category}\n💰 Starting at: *₹${product.selling_price.toLocaleString('en-IN')}*\n\n👉 *Customise & Order Online here:*\n${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  // Telegram Share URL
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${product.name} at Craftique!`)}`;

  // Email Share URL
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Check out ${product.name} at Craftique`)}&body=${encodeURIComponent(`Hi,\n\nI thought you might love this handcrafted custom piece from Craftique:\n\n${product.name} (${product.category})\nPrice: ₹${product.selling_price}\n\nYou can customize your size and upload photos directly here:\n${shareUrl}\n\nEnjoy!`)}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Craftique`,
          text: `Check out ${product.name} on Craftique (Starting at ₹${product.selling_price}):`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed silently
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#1A1816] rounded-3xl border border-amber-200/70 dark:border-stone-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-stone-100 leading-tight">
                Share Product
              </h3>
              <p className="text-xs text-slate-500 dark:text-stone-400">
                Direct link for WhatsApp, social media & friends
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-stone-800 text-slate-500 hover:text-slate-800 dark:text-stone-400 dark:hover:text-stone-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Preview Card */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-stone-900/70 border border-slate-200/80 dark:border-stone-800">
            <img 
              src={primaryImg} 
              alt={product.name} 
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-stone-700 shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                {product.category}
              </span>
              <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-stone-100 truncate">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-stone-200">
                  ₹{product.selling_price.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-stone-400">
                  • SKU: {product.sku}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action 1: WhatsApp Share (One-Click) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold py-3.5 px-5 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer text-sm sm:text-base"
          >
            <MessageCircle className="w-5 h-5 fill-white stroke-none" />
            <span>Share on WhatsApp</span>
            <ExternalLink className="w-4 h-4 opacity-75 ml-auto" />
          </a>

          {/* Primary Action 2: Direct URL Copy Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-stone-400">
              Product Deep Link (Direct Page)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-50 dark:bg-stone-900 border border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 text-xs rounded-xl px-3.5 py-2.5 font-mono select-all focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white border border-emerald-600'
                    : 'bg-amber-800 hover:bg-amber-900 text-white border border-amber-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Alternative Sharing Channels */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-2.5 text-center">
              Or share via other platforms
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* Native System Share (Mobile / Mac) */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 border border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-200 transition-colors cursor-pointer text-center"
              >
                <Share2 className="w-4 h-4 text-amber-700 dark:text-amber-400 mb-1" />
                <span className="text-[11px] font-semibold">More Apps</span>
              </button>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 border border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-200 transition-colors cursor-pointer text-center"
              >
                <Send className="w-4 h-4 text-sky-500 mb-1" />
                <span className="text-[11px] font-semibold">Telegram</span>
              </a>

              {/* Email */}
              <a
                href={emailUrl}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 border border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-200 transition-colors cursor-pointer text-center"
              >
                <Mail className="w-4 h-4 text-rose-500 mb-1" />
                <span className="text-[11px] font-semibold">Email</span>
              </a>
            </div>
          </div>

          {/* Gujarati & English Explanatory Info Card */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200/90 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-300">
                Direct Deep-Link Feature:
              </p>
              <p className="mt-0.5 text-[11px] text-amber-800/90 dark:text-amber-200/80">
                તમે આ લિંક જેને પણ મોકલશો, તે ક્લિક કરતાં જ સીધું આ જ પ્રોડક્ટનું પેજ ખુલશે, જ્યાંથી તેઓ સાઈઝ, મટિરિયલ અને ફોટો અપલોડ કરીને ડાયરેક્ટ ઓર્ડર કરી શકશે.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
