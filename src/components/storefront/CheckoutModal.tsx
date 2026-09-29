import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Order } from '../../types';
import { X, ShieldCheck, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated
}) => {
  const { cart, subtotal, discount, tax, shipping, grandTotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Ahmedabad');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerPhone.trim() || !street.trim() || !pincode.trim()) {
      setErrorMsg('Please complete all required customer and address fields.');
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
      onOrderCreated(createdOrder);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while creating order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFD0] shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="bg-[#FAF7F2] p-5 border-b border-[#EAE0D0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-800" />
            <h2 className="font-serif font-bold text-lg text-slate-900">
              Checkout & Delivery Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Summary Snapshot */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/60">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Order Review ({cart.length} item{cart.length === 1 ? '' : 's'})
              </span>
              <span className="font-bold text-sm text-amber-900">
                Total: ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-600">
                  <span className="truncate pr-2 font-medium">
                    {item.quantity}× {item.product_name} ({item.size})
                  </span>
                  <span className="font-semibold text-slate-900">₹{item.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-600/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Mobile Number (for UPI & Dispatch SMS) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98251 12345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-600/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Email Address (for order manifest & Drive link)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-600/30"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              2. Shipping Address
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  House / Flat No., Apartment, Street *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Lotus Residency, CG Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-600/30"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="380009"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
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
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B45309] hover:bg-[#92400E] disabled:bg-slate-400 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-amber-900/15 flex items-center justify-center gap-3 text-base transition-all"
            >
              <span>{isSubmitting ? 'Creating Order...' : `Proceed to Dynamic UPI QR (₹${grandTotal.toLocaleString('en-IN')})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              You will be presented with a dynamic UPI QR code linked to order amount & sequence.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
