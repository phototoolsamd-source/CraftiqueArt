import React, { useState } from 'react';
import { ShoppingBag, Search, Compass, ShieldCheck, MessageCircle, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
  onSearchChange: (q: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  currentView,
  onSearchChange,
  searchQuery
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'All Products', slug: 'all' },
    { name: 'Décor', slug: 'decor' },
    { name: 'Printing Services', slug: 'printing' },
    { name: 'Customized Gifts', slug: 'customized-products' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBE3D5] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#B45309] text-[#FFFDF9] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex justify-center items-center gap-3">
        <span>✨ Handcrafted Indian Craftsmanship • Free Shipping above ₹1,499 • Dynamic UPI Instant QR</span>
        <a
          href="https://wa.me/916354871446?text=Hello%20Creaftique%2C%20I%20have%20an%20enquiry%20about%20customized%20products"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-amber-200 hover:text-white underline font-semibold ml-2"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
        </a>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-20 sm:h-22 gap-4">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-center gap-3.5 group select-none shrink-0"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-white shadow-md shadow-amber-950/10 border border-slate-200/90 ring-2 ring-amber-600/30 group-hover:scale-105 group-hover:shadow-lg transition-all shrink-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Craftique Production Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center">
                Craftique
              </span>
              <span className="block text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-amber-800 -mt-0.5">
                Handmade & Custom Art
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search canvas art, frames, invitations, stickers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/80 border border-[#E2D8C9] rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Actions & Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => onNavigate('track')}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-full transition-colors ${
                currentView === 'track'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-700" />
              Track Order
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-950 hover:bg-amber-100 transition-colors flex items-center justify-center shadow-xs"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-800" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center justify-between border-t border-[#EBE3D5]/70 py-2.5 text-xs font-medium">
          <div className="flex items-center gap-6">
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => {
                  onNavigate('category', c.slug);
                }}
                className={`py-1 transition-colors hover:text-amber-800 ${
                  currentView === 'category' && c.slug === 'all'
                    ? 'text-amber-900 font-bold border-b-2 border-amber-800'
                    : 'text-slate-600'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="text-slate-500 text-[11px] flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Studio Live: 10:00 AM – 8:00 PM
            </span>
            <span className="text-slate-300">|</span>
            <a
              href="tel:+916354871446"
              className="text-amber-900 font-semibold hover:underline"
            >
              +91 63548 71446
            </a>
          </div>
        </nav>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#EBE3D5] space-y-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white border border-[#E2D8C9] rounded-lg py-2 pl-9 pr-3 text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    onNavigate('category', c.slug);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-md text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-900 font-medium"
                >
                  {c.name}
                </button>
              ))}
              <button
                onClick={() => {
                  onNavigate('track');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-md text-sm text-slate-700 hover:bg-amber-50 font-medium flex items-center justify-between"
              >
                <span>Track Your Order</span>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
