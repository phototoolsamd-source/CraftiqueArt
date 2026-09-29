import React from 'react';
import { MessageCircle, ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (v: string, p?: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1E293B] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-700/80">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Creaftique
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create. Customize. Print. Cherish. Modern Indian craft meets contemporary giclée printing technology for personalized memories that endure.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] bg-slate-800 text-amber-300 px-3 py-1 rounded-full font-medium border border-slate-700">
                Studio in Ahmedabad, Gujarat
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider mb-4">
              Products & Décor
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('category', 'decor')} className="hover:text-amber-400 transition-colors">
                  Museum Canvas Wall Art
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'decor')} className="hover:text-amber-400 transition-colors">
                  Floating Acrylic Photo Frames
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'printing')} className="hover:text-amber-400 transition-colors">
                  Layflat Wedding Photobooks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'printing')} className="hover:text-amber-400 transition-colors">
                  Foil Wedding Invitations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'customized-products')} className="hover:text-amber-400 transition-colors">
                  Polaroid Wooden Magnets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'printing')} className="hover:text-amber-400 transition-colors">
                  Waterproof Vinyl Die-Cut Stickers
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider mb-4">
              Order & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-medium text-amber-300">
                  <span>Track Existing Order</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/916354871446?text=Hi%20Creaftique%20Team%2C%20I%20need%20assistance%20with%20customization"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: +91 63548 71446</span>
                </a>
              </li>
              <li>
                <a href="mailto:admin@phototoolsai.com" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>admin@phototoolsai.com</span>
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-amber-400 transition-colors">
                  Admin & Production Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Verified UPI Payment & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-bold text-sm uppercase tracking-wider mb-4">
              Instant UPI Payment
            </h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Direct & Verified UPI</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dynamic QR code generated on checkout to: <br/>
                <span className="font-mono text-amber-300 select-all font-semibold">aksharstudio-3@okisbii</span>
              </p>
              <p className="text-[10px] text-slate-500">
                Supports Google Pay, PhonePe, Paytm, BHIM and all banking apps.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Creaftique (Craftique). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for creators, couples, and homes across India.
          </p>
        </div>
      </div>
    </footer>
  );
};
