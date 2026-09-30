import React, { useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
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
  UserCheck
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
  const { customer, orders, loadingOrders, logoutCustomer, updateAddress, refreshOrders } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'address'>('orders');

  // Address edit state
  const [street, setStreet] = useState(customer?.saved_address?.street || '');
  const [city, setCity] = useState(customer?.saved_address?.city || 'Ahmedabad');
  const [state, setState] = useState(customer?.saved_address?.state || 'Gujarat');
  const [pincode, setPincode] = useState(customer?.saved_address?.pincode || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !customer) return null;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAddress({
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: 'India'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const openWhatsAppSupport = (orderNumber: string) => {
    const text = encodeURIComponent(
      `Hello Craftique, I am ${customer.name || 'Customer'} (+91 ${customer.phone}). Regarding my order ${orderNumber}, please share an update.`
    );
    window.open(`https://wa.me/916354871446?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFD0] shadow-2xl max-w-2xl w-full overflow-hidden my-6 animate-scale-in flex flex-col max-h-[90vh]">
        {/* Modal Top Profile Header */}
        <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-[#EAE0D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white font-bold text-lg flex items-center justify-center shadow-sm shrink-0">
              {customer.name ? customer.name[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                  {customer.name || 'Customer Profile'}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <UserCheck className="w-3 h-3 text-emerald-700" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
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
              className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign out of customer account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-[#EAE0D0] bg-white px-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'address'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Default Delivery Address</span>
          </button>

          <div className="ml-auto">
            <button
              onClick={refreshOrders}
              disabled={loadingOrders}
              className="text-xs text-slate-400 hover:text-slate-700 p-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
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
                    className="bg-white rounded-2xl border border-[#E8DFD0] p-4 sm:p-5 shadow-xs hover:border-amber-300 transition-all space-y-3"
                  >
                    {/* Order header row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 block">Order Reference</span>
                        <span className="font-mono text-sm font-bold text-amber-950">
                          {order.order_number}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.order_status} type="order" />
                        <span className="font-bold text-sm text-slate-900 ml-1">
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
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 truncate">{item.product_name}</h4>
                            <p className="text-[11px] text-slate-500">
                              Size: {item.size} • Material: {item.material} • Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-bold text-slate-700 shrink-0">
                            ₹{item.total?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order action footer */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] text-slate-400">
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
                          className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Track Live Status</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openWhatsAppSupport(order.order_number)}
                          className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
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
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-800">
                    No orders placed with this number yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
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
            <form onSubmit={handleSaveAddress} className="space-y-4 max-w-lg mx-auto">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Your saved delivery address will automatically auto-fill whenever you checkout.
                </span>
              </div>

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Address saved successfully!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address & Landmark <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 402, Shivalik Highstreet, Near Keshavbaug Party Plot, Vastrapur"
                  className="w-full bg-white border border-[#E2D8C9] rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all shadow-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-[#E2D8C9] rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 shadow-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white border border-[#E2D8C9] rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 shadow-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pincode <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 380015"
                  className="w-full bg-white border border-[#E2D8C9] rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 shadow-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                Save Delivery Address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
