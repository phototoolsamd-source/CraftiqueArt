import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { Order } from '../../types';
import { X, ShieldCheck, ShoppingBag, ArrowRight, AlertCircle, Sparkles, CheckCircle2, User } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
  onOpenCustomerAuth?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
  onOpenCustomerAuth
}) => {
  const { cart, subtotal, discount, tax, shipping, grandTotal, clearCart } = useCart();
  const { customer, isLoggedIn, addOrderToHistory, updateAddress } = useCustomerAuth();

  const [customerName, setCustomerName] = useState(customer?.name || '');
  const [customerEmail, setCustomerEmail] = useState(customer?.email || '');
  const [customerPhone, setCustomerPhone] = useState(customer?.phone || '');
  const [street, setStreet] = useState(customer?.saved_address?.street || '');
  const [city, setCity] = useState(customer?.saved_address?.city || 'Ahmedabad');
  const [state, setState] = useState(customer?.saved_address?.state || 'Gujarat');
  const [pincode, setPincode] = useState(customer?.saved_address?.pincode || '');
  const [country, setCountry] = useState('India');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Sync when customer changes or logs in
  useEffect(() => {
    if (customer) {
      if (customer.name) setCustomerName(customer.name);
      if (customer.phone) setCustomerPhone(customer.phone);
      if (customer.email) setCustomerEmail(customer.email);
      if (customer.saved_address) {
        if (customer.saved_address.street) setStreet(customer.saved_address.street);
        if (customer.saved_address.city) setCity(customer.saved_address.city);
        if (customer.saved_address.state) setState(customer.saved_address.state);
        if (customer.saved_address.pincode) setPincode(customer.saved_address.pincode);
      }
    }
  }, [customer]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('ગ્રાહકનું પૂરું નામ દાખલ કરવું ફરજિયાત છે (Customer Full Name is required).');
      return;
    }

    if (!customerPhone.trim() || !street.trim() || !pincode.trim()) {
      setErrorMsg('Please complete all required customer phone and address fields.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Your craft bag is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim() || `${customerPhone.replace(/[^0-9]/g, '')}@customer.creaftique.in`,
        customer_phone: customerPhone.trim(),
        shipping_address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          country: country.trim()
        },
        billing_address: {
          same_as_shipping: sameAsShipping
        },
        items: cart,
        subtotal,
        discount,
        tax,
        shipping,
        grand_total: grandTotal,
        payment_status: 'Pending',
        order_status: 'NEW'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to place order');
      }

      const { data: createdOrder } = await res.json();
      clearCart();
      addOrderToHistory(createdOrder);
      if (isLoggedIn && customer) {
        updateAddress({
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          country: country.trim()
        });
      }
      onOrderCreated(createdOrder);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while creating order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] dark:bg-[#1A1816] rounded-3xl border border-[#E8DFD0] dark:border-stone-800 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="bg-[#FAF7F2] dark:bg-stone-900 p-5 border-b border-[#EAE0D0] dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-800 dark:text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
              Checkout & Delivery Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 dark:text-stone-400 hover:text-slate-700 dark:hover:text-stone-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Auth Banner */}
          {isLoggedIn && customer ? (
            <div className="bg-emerald-50/80 dark:bg-emerald-950/60 rounded-2xl p-3 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Ordering as <strong>{customer.name}</strong> (+91 {customer.phone.replace(/[^0-9]/g, '').slice(-10)})
                </span>
              </div>
              <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Auto-Filled
              </span>
            </div>
          ) : (
            onOpenCustomerAuth && (
              <div className="bg-amber-50/70 dark:bg-amber-950/50 rounded-2xl p-3 border border-amber-200/60 dark:border-amber-900/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span>Have an account or want quick OTP auto-fill?</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenCustomerAuth}
                  className="font-bold text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 underline cursor-pointer"
                >
                  Login with Mobile
                </button>
              </div>
            )
          )}
          {/* Order Summary Snapshot */}
          <div className="bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl p-4 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider">
                Order Review ({cart.length} item{cart.length === 1 ? '' : 's'})
              </span>
              <span className="font-bold text-sm text-amber-900 dark:text-amber-400">
                Total: ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-600 dark:text-stone-300">
                  <span className="truncate pr-2 font-medium">
                    {item.quantity}× {item.product_name} ({item.size})
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-stone-100">₹{item.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-800 dark:text-stone-200 block mb-1">
                  Full Name (તમારું પૂરું નામ) <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel / પ્રિયાંક પટેલ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-600/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-stone-400 block mb-1">
                  Mobile Number (for UPI & Dispatch SMS) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98251 12345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-600/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-stone-400 block mb-1">
                  Email Address (for order manifest & Drive link)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-600/30"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-stone-200">
              2. Shipping Address
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-stone-400 block mb-1">
                  House / Flat No., Apartment, Street *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Lotus Residency, CG Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-600/30"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-stone-400 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-stone-400 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-stone-400 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="380009"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-stone-400 block mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full bg-slate-100 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-600 dark:text-stone-400"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-stone-400 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="rounded text-amber-800 accent-amber-800"
                />
                <span>Billing address is same as shipping address</span>
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B45309] hover:bg-[#92400E] disabled:bg-slate-400 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-amber-900/15 flex items-center justify-center gap-3 text-base transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Order...' : `Proceed to Dynamic UPI QR (₹${grandTotal.toLocaleString('en-IN')})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-500 dark:text-stone-400 mt-2">
              You will be presented with a dynamic UPI QR code linked to order amount & sequence.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
