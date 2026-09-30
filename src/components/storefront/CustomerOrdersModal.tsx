import React, { useState, useEffect } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useSettings } from '../../context/SettingsContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  Package,
  MapPin,
  LogOut,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
  FolderCheck,
  ChevronRight,
  UserCheck,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
  onStartShopping: () => void;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
  onStartShopping
}) => {
  const { customer, orders, loadingOrders, logoutCustomer, updateProfile, updateAddress, refreshOrders } = useCustomerAuth();
  const { settings } = useSettings();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Profile and Address edit state
  const [profileName, setProfileName] = useState(customer?.name || '');
  const [profileEmail, setProfileEmail] = useState(customer?.email || '');
  const [street, setStreet] = useState(customer?.saved_address?.street || '');
  const [city, setCity] = useState(customer?.saved_address?.city || 'Ahmedabad');
  const [state, setState] = useState(customer?.saved_address?.state || 'Gujarat');
  const [pincode, setPincode] = useState(customer?.saved_address?.pincode || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      if (customer.name) setProfileName(customer.name);
      if (customer.email) setProfileEmail(customer.email);
      if (customer.saved_address) {
        setStreet(customer.saved_address.street || '');
        setCity(customer.saved_address.city || 'Ahmedabad');
        setState(customer.saved_address.state || 'Gujarat');
        setPincode(customer.saved_address.pincode || '');
      }
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);

    const cleanName = profileName.trim();
    if (!cleanName) {
      setNameError('તમારું પૂરું નામ દાખલ કરવું ફરજિયાત છે (Your Full Name is mandatory).');
      return;
    }
    if (cleanName.length < 2) {
      setNameError('કૃપા કરીને સાચું નામ દાખલ કરો (Name must be at least 2 characters).');
      return;
    }

    await updateProfile({
      name: cleanName,
      email: profileEmail.trim(),
      saved_address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        country: 'India'
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const openWhatsAppSupport = (orderNumber: string) => {
    const brandName = settings.business_name || settings.brand_title || 'Craftique';
    const cleanPhone = String(settings.whatsapp_number || '916354871446').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${brandName}, I am ${customer.name || 'Customer'} (+91 ${customer.phone}). Regarding my order ${orderNumber}, please share an update.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] dark:bg-[#1A1816] rounded-3xl border border-[#E8DFD0] dark:border-stone-800 shadow-2xl max-w-2xl w-full overflow-hidden my-6 animate-scale-in flex flex-col max-h-[90vh]">
        {/* Modal Top Profile Header */}
        <div className="bg-[#FAF7F2] dark:bg-stone-900 p-5 sm:p-6 border-b border-[#EAE0D0] dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white font-bold text-lg flex items-center justify-center shadow-sm shrink-0">
              {customer.name ? customer.name[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100 leading-tight">
                  {customer.name || 'Customer Profile'}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                  <UserCheck className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-stone-400 font-mono mt-0.5">
                +91 {customer.phone.replace(/[^0-9]/g, '').slice(-10)} {customer.email && `• ${customer.email}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                logoutCustomer();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign out of customer account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-[#EAE0D0] dark:border-stone-800 bg-white dark:bg-stone-900 px-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-amber-800 dark:border-amber-500 text-amber-900 dark:text-amber-300'
                : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:hover:text-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-amber-800 dark:border-amber-500 text-amber-900 dark:text-amber-300'
                : 'border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:hover:text-stone-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Delivery Address</span>
          </button>

          <div className="ml-auto">
            <button
              onClick={refreshOrders}
              disabled={loadingOrders}
              className="text-xs text-slate-400 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200 p-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              title="Refresh order history"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin text-amber-700' : ''}`} />
              <span className="hidden sm:inline text-[11px]">Refresh</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'orders' ? (
            orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.order_number}
                    className="bg-white dark:bg-stone-900 rounded-2xl border border-[#E8DFD0] dark:border-stone-800 p-4 sm:p-5 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-all space-y-3"
                  >
                    {/* Order header row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-stone-800">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-stone-500 block">Order Reference</span>
                        <span className="font-mono text-sm font-bold text-amber-950 dark:text-amber-300">
                          {order.order_number}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.order_status} type="order" />
                        <span className="font-bold text-sm text-slate-900 dark:text-stone-100 ml-1">
                          ₹{order.grand_total?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <img
                            src={item.image}
                            alt={item.product_name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-stone-700 shrink-0 bg-slate-100 dark:bg-stone-800"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 dark:text-stone-100 truncate">{item.product_name}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-stone-400">
                              Size: {item.size} • Material: {item.material} • Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-bold text-slate-700 dark:text-stone-300 shrink-0">
                            ₹{item.total?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order action footer */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] text-slate-400 dark:text-stone-500">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onTrackOrder(order.order_number);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-900/60 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Track Live Status</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openWhatsAppSupport(order.order_number)}
                          className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                          title="Contact WhatsApp Studio Support"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center mx-auto text-amber-700 dark:text-amber-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-800 dark:text-stone-200">
                    No orders placed with this number yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-stone-400 max-w-sm mx-auto mt-1">
                    When you order canvas art, photo albums, or customized frames with +91 {customer.phone}, they will automatically appear here with real-time tracking!
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onStartShopping();
                  }}
                  className="inline-flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Explore Art Catalog</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg mx-auto">
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>
                  Your name and delivery address are safely saved and will auto-fill on checkout.
                </span>
              </div>

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Profile and address saved successfully!</span>
                </div>
              )}

              {/* Mandatory Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-stone-200 mb-1">
                  Your Full Name (તમારું પૂરું નામ) <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => {
                      setProfileName(e.target.value);
                      if (nameError) setNameError(null);
                    }}
                    placeholder="e.g. Ramesh Patel / પ્રિયાંક પટેલ"
                    className="w-full bg-white dark:bg-stone-900 border border-[#E2D8C9] dark:border-stone-700 rounded-xl py-2 pl-9 pr-3 text-xs font-bold text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 shadow-xs"
                    required
                  />
                  <User className="w-4 h-4 text-amber-700 dark:text-amber-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
                {nameError && (
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block mt-1 pl-1">
                    {nameError}
                  </span>
                )}
              </div>

              {/* Registered Phone (Verified) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1">
                  Registered Mobile Number (નોંધાયેલ નંબર)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={`+91 ${customer.phone.replace(/[^0-9]/g, '').slice(-10)} (Verified)`}
                    disabled
                    className="w-full bg-slate-100 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl py-2 pl-9 pr-3 text-xs font-mono font-bold text-slate-600 dark:text-stone-400 select-none cursor-not-allowed"
                  />
                  <Phone className="w-4 h-4 text-slate-400 dark:text-stone-500 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1">
                  Email Address (ઈમેઇલ)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    className="w-full bg-white dark:bg-stone-900 border border-[#E2D8C9] dark:border-stone-700 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 shadow-xs"
                  />
                  <Mail className="w-4 h-4 text-slate-400 dark:text-stone-500 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1">
                  Street Address & Landmark <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 402, Shivalik Highstreet, Near Keshavbaug Party Plot, Vastrapur"
                  className="w-full bg-white dark:bg-stone-900 border border-[#E2D8C9] dark:border-stone-700 rounded-xl p-3 text-xs text-slate-800 dark:text-stone-200 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all shadow-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1">City <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-[#E2D8C9] dark:border-stone-700 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 shadow-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1">State <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-[#E2D8C9] dark:border-stone-700 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 shadow-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1">
                  Pincode <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 380015"
                  className="w-full bg-white dark:bg-stone-900 border border-[#E2D8C9] dark:border-stone-700 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 shadow-xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!profileName.trim()}
                className="w-full bg-[#B45309] hover:bg-[#92400E] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                Save Profile & Address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
