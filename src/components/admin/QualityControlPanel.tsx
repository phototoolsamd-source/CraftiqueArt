import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { CheckSquare, Check, X, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export const QualityControlPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // 8-point QC checklist
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    product: false,
    size: false,
    material: false,
    quantity: false,
    photos: false,
    print_quality: false,
    cutting: false,
    packaging: false
  });
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadQcOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        const qcOrders = (data.data || []).filter((o: Order) =>
          ['QUALITY CHECK', 'PRODUCTION'].includes(o.order_status)
        );
        setOrders(qcOrders);
        if (qcOrders.length > 0 && !selectedOrder) {
          setSelectedOrder(qcOrders[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching QC orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQcOrders();
  }, []);

  const toggleChecklist = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleQcSubmit = async (status: 'QC Passed' | 'QC Failed' | 'Rework Required') => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: selectedOrder.order_number,
          checklist,
          status,
          notes,
          inspected_by: 'Studio QC'
        })
      });

      if (res.ok) {
        // If passed, set status to READY TO DISPATCH
        // If rework, set to PRODUCTION
        const newOrderStatus = status === 'QC Passed' ? 'READY TO DISPATCH' : 'PRODUCTION';
        await fetch(`/api/orders/${selectedOrder.order_number}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_status: newOrderStatus })
        });

        // Reset checklist
        setChecklist({
          product: false,
          size: false,
          material: false,
          quantity: false,
          photos: false,
          print_quality: false,
          cutting: false,
          packaging: false
        });
        setNotes('');
        loadQcOrders();
      }
    } catch (err) {
      console.error('Error submitting QC result:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const allPassed = Object.values(checklist).every(Boolean);

  const checklistItems = [
    { key: 'product', label: 'Correct Product Model & SKU' },
    { key: 'size', label: 'Correct Dimension & Framing Standoffs' },
    { key: 'material', label: 'Correct Archival Substrate (e.g. 380 GSM Canvas / Acrylic)' },
    { key: 'quantity', label: 'Correct Unit Count & Verified Items' },
    { key: 'photos', label: 'Correct Customer Photos & Custom Text Inscription' },
    { key: 'print_quality', label: '12-Color Archival Print Fidelity (Zero banding/artifacts)' },
    { key: 'cutting', label: 'Precision 90° Edge Trimming & Bevel Alignment' },
    { key: 'packaging', label: 'Shockproof Multi-Layer Bubble Wrap & Corner Guards' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Studio Quality Control (QC) Inspection
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Every product must pass the mandatory 8-point checklist before generating courier shipping manifests.
          </p>
        </div>

        <button
          onClick={loadQcOrders}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Queue of Orders awaiting QC */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Orders in Queue ({orders.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No orders waiting for QC inspection.
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
                    {ord.items?.map(i => i.product_name).join(', ')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Active QC Inspection Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {selectedOrder ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xl text-amber-950">
                      {selectedOrder.order_number}
                    </span>
                    <span className="text-xs bg-cyan-100 text-cyan-900 font-bold px-2.5 py-0.5 rounded-full">
                      Under Inspection
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer: <span className="font-semibold text-slate-800">{selectedOrder.customer_name}</span> ({selectedOrder.customer_phone})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {Object.values(checklist).filter(Boolean).length} / 8 Passed
                  </span>
                  <span className="text-[10px] text-slate-400">Mandatory verification</span>
                </div>
              </div>

              {/* Order Items Snapshot to inspect against physical piece */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DFD0] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Physical Verification Target:
                </span>
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="text-xs text-slate-800">
                    <span className="font-bold">{i.quantity}× {i.product_name}</span> — Size: <span className="font-semibold">{i.size}</span> | Material: <span className="font-semibold">{i.material}</span> | Frame: <span className="font-semibold">{i.frame || 'Frameless'}</span>
                    {i.customization?.text && (
                      <p className="text-amber-800 italic text-[11px] mt-0.5">
                        Required Text: "{i.customization.text}"
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* 8-Point Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  8-Point Studio Inspection Checklist
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {checklistItems.map((item) => {
                    const isChecked = checklist[item.key];
                    return (
                      <label
                        key={item.key}
                        onClick={() => toggleChecklist(item.key)}
                        className={`cursor-pointer rounded-xl p-3 border text-xs flex items-center gap-3 transition-all select-none ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="leading-tight">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Inspector Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Inspector Observation / QC Notes:
                </label>
                <textarea
                  rows={2}
                  placeholder="Record edge alignment notes, print color check, or rework reason..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              {/* QC Action Decision */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={submitting || !allPassed}
                  onClick={() => handleQcSubmit('QC Passed')}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>QC PASSED (APPROVE & PACK)</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleQcSubmit('Rework Required')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-xs"
                >
                  Rework Required
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleQcSubmit('QC Failed')}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-3 px-4 rounded-xl text-xs"
                >
                  QC Failed
                </button>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400">
              Select an order from the left queue to begin quality inspection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
