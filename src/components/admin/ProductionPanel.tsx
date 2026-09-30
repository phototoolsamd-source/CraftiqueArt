import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Wrench, Play, Pause, CheckCircle2, Download, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

export const ProductionPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadProductionOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        // Show orders that are verified, design approved, or in production
        const prodOrders = (data.data || []).filter((o: Order) =>
          ['PAYMENT VERIFIED', 'DESIGN APPROVAL', 'PRODUCTION'].includes(o.order_status)
        );
        setOrders(prodOrders);
      }
    } catch (err) {
      console.error('Error fetching production orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductionOrders();
  }, []);

  const handleUpdateStatus = async (orderNumber: string, newStatus: string) => {
    setUpdatingId(orderNumber);
    try {
      const res = await fetch(`/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus })
      });
      if (res.ok) {
        loadProductionOrders();
      }
    } catch (err) {
      console.error('Error updating production status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Studio Production Floor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Work orders requiring printing, canvas stretching, acrylic standoff mounting, and custom framing.
          </p>
        </div>

        <button
          onClick={loadProductionOrders}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Work Orders</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-800">
            No pending production work orders
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All orders are either awaiting payment verification or have already passed through QC & dispatch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-slate-900">
                      {ord.order_number}
                    </span>
                    <StatusBadge status={ord.order_status} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Customer: <span className="font-semibold text-slate-800">{ord.customer_name}</span> ({ord.customer_phone})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {ord.items.some(i => i.customization?.photos && i.customization.photos.length > 0) && (
                    <a
                      href={`/api/orders/${ord.order_number}/download-photos`}
                      download={`${ord.order_number}_Customer_Photos.zip`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      title="Download All Photos for this order as ZIP"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ZIP</span>
                    </a>
                  )}

                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Studio Target
                    </span>
                    <span className="text-xs font-bold text-amber-900">
                      24-48 Hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Specification */}
              <div className="p-5 space-y-4 flex-1">
                {ord.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE3D5] space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{item.product_name}</h4>
                        <span className="font-mono text-[10px] text-slate-400">SKU: {item.sku}</span>
                      </div>
                      <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2 py-0.5 rounded-full">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Size</span>
                        <span className="font-bold text-slate-800">{item.size}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Substrate</span>
                        <span className="font-bold text-slate-800">{item.material}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Finish</span>
                        <span className="font-bold text-slate-800">{item.finish}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Frame</span>
                        <span className="font-bold text-slate-800">{item.frame || 'Frameless'}</span>
                      </div>
                    </div>

                    {item.customization?.text && (
                      <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs">
                        <span className="text-[9px] font-bold text-amber-800 uppercase block">Print Inscription</span>
                        <span className="italic font-serif text-slate-800">"{item.customization.text}"</span>
                      </div>
                    )}

                    {item.customization?.notes && (
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Customer Notes</span>
                        {item.customization.notes}
                      </div>
                    )}

                    {/* Customer Photo files to print */}
                    {item.customization?.photos && item.customization.photos.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                          High-Res Source Artwork ({item.customization.photos.length} files)
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.customization.photos.map((p, pIdx) => (
                            <a
                              key={pIdx}
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-amber-400 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-700 shadow-xs"
                            >
                              <Download className="w-3 h-3 text-amber-700" />
                              <span>Photo #{pIdx + 1} ({p.quality || 'Print Ready'})</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={updatingId === ord.order_number}
                  onClick={() => handleUpdateStatus(ord.order_number, 'PRODUCTION')}
                  className="flex-1 bg-indigo-700 hover:bg-indigo-800 disabled:bg-slate-400 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Production</span>
                </button>

                <button
                  type="button"
                  disabled={updatingId === ord.order_number}
                  onClick={() => handleUpdateStatus(ord.order_number, 'On Hold')}
                  className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 px-3 rounded-xl text-xs"
                >
                  Pause
                </button>

                <button
                  type="button"
                  disabled={updatingId === ord.order_number}
                  onClick={() => handleUpdateStatus(ord.order_number, 'QUALITY CHECK')}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Send to QC</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
