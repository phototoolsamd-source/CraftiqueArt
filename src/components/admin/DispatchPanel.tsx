import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Truck, Printer, CheckCircle, ExternalLink, RefreshCw, Box } from 'lucide-react';

export const DispatchPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Dispatch fields
  const [courier, setCourier] = useState('Delhivery');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [weight, setWeight] = useState('1.5 kg');
  const [dimensions, setDimensions] = useState('20 × 26 × 2 inch');
  const [shippingCost, setShippingCost] = useState('90');
  const [submitting, setSubmitting] = useState(false);

  const couriersList = [
    { name: 'Delhivery', trackingPrefix: 'https://www.delhivery.com/track/package/' },
    { name: 'BlueDart', trackingPrefix: 'https://www.bluedart.com/tracking?trackNumber=' },
    { name: 'DTDC', trackingPrefix: 'https://www.dtdc.in/tracking/tracking_results.asp?trkType=awb&strCnno=' },
    { name: 'Shiprocket', trackingPrefix: 'https://shiprocket.co/tracking/' },
    { name: 'India Post Speed Post', trackingPrefix: 'https://www.indiapost.gov.in/_layouts/15/dpt.cpt.tracking/trackconsignment.aspx' }
  ];

  const loadDispatchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        const dOrders = (data.data || []).filter((o: Order) =>
          ['READY TO DISPATCH', 'PACKING', 'DISPATCHED'].includes(o.order_status)
        );
        setOrders(dOrders);
        if (dOrders.length > 0 && !selectedOrder) {
          setSelectedOrder(dOrders[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching dispatch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDispatchOrders();
  }, []);

  const handleCourierChange = (newCourier: string) => {
    setCourier(newCourier);
    const found = couriersList.find(c => c.name === newCourier);
    if (found && trackingNumber) {
      setTrackingUrl(`${found.trackingPrefix}${trackingNumber}`);
    }
  };

  const handleTrackingNumberChange = (num: string) => {
    setTrackingNumber(num);
    const found = couriersList.find(c => c.name === courier);
    if (found) {
      setTrackingUrl(`${found.trackingPrefix}${num}`);
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !trackingNumber.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: selectedOrder.order_number,
          courier,
          tracking_number: trackingNumber.trim(),
          tracking_url: trackingUrl.trim(),
          weight,
          dimensions,
          shipping_cost: Number(shippingCost)
        })
      });

      if (res.ok) {
        setTrackingNumber('');
        setTrackingUrl('');
        loadDispatchOrders();
      }
    } catch (err) {
      console.error('Error recording dispatch:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Dispatch & Logistics Manifest Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign courier partners, input AWB tracking numbers, and generate print-ready shipping labels.
          </p>
        </div>

        <button
          onClick={loadDispatchOrders}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Orders queue */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Dispatch Queue ({orders.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No orders ready for courier booking.
              </p>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedOrder?.id === ord.id
                      ? 'border-amber-700 bg-amber-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {ord.order_number}
                    </span>
                    <StatusBadge status={ord.order_status} />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1">{ord.customer_name}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Destination: {ord.shipping_address?.city}, {ord.shipping_address?.state}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Booking Form & Shipping Manifest */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {selectedOrder ? (
            <form onSubmit={handleDispatchSubmit} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xl text-amber-950">
                      {selectedOrder.order_number}
                    </span>
                    <StatusBadge status={selectedOrder.order_status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer: <span className="font-semibold text-slate-800">{selectedOrder.customer_name}</span> ({selectedOrder.customer_phone})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Label</span>
                </button>
              </div>

              {/* Destination address card */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DFD0] flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Shipment Destination:
                  </span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    <strong>{selectedOrder.customer_name}</strong><br />
                    {selectedOrder.shipping_address?.street}<br />
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}<br />
                    Phone: {selectedOrder.customer_phone}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Order Value:
                  </span>
                  <span className="font-serif text-lg font-bold text-amber-900">
                    ₹{selectedOrder.grand_total.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    Prepaid via UPI (Direct)
                  </span>
                </div>
              </div>

              {/* Courier Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Courier Partner *
                  </label>
                  <select
                    value={courier}
                    onChange={(e) => handleCourierChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  >
                    {couriersList.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Airway Bill / Tracking Number (AWB) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 142890182741"
                    value={trackingNumber}
                    onChange={(e) => handleTrackingNumberChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Package Gross Weight
                  </label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Package Dimensions (L × W × H)
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Public Courier Tracking URL
                </label>
                <input
                  type="url"
                  placeholder="https://delhivery.com/track/..."
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-600"
                />
              </div>

              {/* Submit Dispatch */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-slate-400 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Truck className="w-4 h-4" />
                  <span>{submitting ? 'Updating Dispatch Status...' : 'CONFIRM DISPATCH & NOTIFY CUSTOMER'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-16 text-center text-slate-400">
              Select an order to generate shipping manifests and record dispatch details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
