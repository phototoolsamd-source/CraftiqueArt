import React, { useState, useEffect } from 'react';
import { Order, DesignProof } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Search, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
  onNavigateHome: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderNumber = '',
  onNavigateHome
}) => {
  const [searchNum, setSearchNum] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [proof, setProof] = useState<DesignProof | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [revisionNotes, setRevisionNotes] = useState('');
  const [proofActionLoading, setProofActionLoading] = useState(false);
  const [proofFeedback, setProofFeedback] = useState<string | null>(null);

  const fetchOrderDetails = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(num.trim())}`);
      if (res.ok) {
        const data = await res.json();
        const foundOrder = data.data;
        setOrder(foundOrder);

        // Fetch design proof if available
        const proofRes = await fetch(`/api/design-proofs/${encodeURIComponent(foundOrder.order_number)}`);
        if (proofRes.ok) {
          const pData = await proofRes.json();
          setProof(pData.data);
        }
      } else {
        setErrorMsg('Order not found. Please double-check your Order Number (e.g. CRQ-20260930-0001) or 10-digit Mobile Number.');
        setOrder(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while searching for order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrderDetails(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleCustomerProofAction = async (action: 'approve' | 'request_changes') => {
    if (!order) return;
    setProofActionLoading(true);
    setProofFeedback(null);
    try {
      const res = await fetch(`/api/design-proofs/${order.order_number}/customer-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: revisionNotes.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProof(data.data);
        setOrder(prev => prev ? { ...prev, order_status: data.orderStatus } : null);
        setProofFeedback(
          action === 'approve'
            ? 'Artwork approved! Our studio has moved your order into production.'
            : 'Revisions requested. Our designer has received your notes.'
        );
      }
    } catch (err: any) {
      setProofFeedback(`Error: ${err.message}`);
    } finally {
      setProofActionLoading(false);
    }
  };

  const timelineSteps = [
    { key: 'NEW', label: 'Order Placed' },
    { key: 'PAYMENT VERIFIED', label: 'Payment Verified' },
    { key: 'DESIGN APPROVAL', label: 'Design Approval' },
    { key: 'PRODUCTION', label: 'In Production' },
    { key: 'QUALITY CHECK', label: 'Quality Control' },
    { key: 'READY TO DISPATCH', label: 'Packed & Labeled' },
    { key: 'DISPATCHED', label: 'Dispatched' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'NEW': return 0;
      case 'PAYMENT PENDING': return 0;
      case 'PAYMENT VERIFIED': return 1;
      case 'DESIGN REQUIRED':
      case 'DESIGN APPROVAL': return 2;
      case 'PRODUCTION': return 3;
      case 'QUALITY CHECK': return 4;
      case 'PACKING':
      case 'READY TO DISPATCH': return 5;
      case 'DISPATCHED': return 6;
      case 'DELIVERED':
      case 'COMPLETED': return 7;
      default: return 0;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Search bar */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="w-20 h-20 rounded-full p-1.5 bg-white dark:bg-stone-800 border-2 border-amber-600/30 ring-4 ring-amber-500/10 mx-auto shadow-lg flex items-center justify-center">
          <img src="/logo.png" alt="Craftique Production" className="w-full h-full object-contain rounded-full" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-stone-100">
          Track Your Custom Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-stone-400">
          Monitor your studio printing progress, review design proofs, and inspect live courier dispatch.
        </p>

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Enter Order Number (e.g. CRQ-20260930-0001) or 10-digit Mobile Number"
            value={searchNum}
            onChange={(e) => setSearchNum(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrderDetails(searchNum)}
            className="flex-1 bg-white dark:bg-stone-900 border border-[#DACFBF] dark:border-stone-700 rounded-full py-2.5 px-4 text-xs sm:text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/30 font-medium"
          />
          <button
            onClick={() => fetchOrderDetails(searchNum)}
            disabled={loading}
            className="bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 rounded-xl text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {order && (
        <div className="space-y-8 animate-fade-in">
          {/* Order Header Summary Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E8DFD0] dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xl sm:text-2xl text-amber-950 dark:text-amber-300">
                  {order.order_number}
                </span>
                <StatusBadge status={order.order_status} size="md" />
              </div>
              <p className="text-xs text-slate-500 dark:text-stone-400 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} • Customer: <span className="font-semibold text-slate-800 dark:text-stone-200">{order.customer_name}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 border-t md:border-t-0 pt-4 md:pt-0 dark:border-stone-800">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 dark:text-stone-400 block">Payment Status</span>
                <StatusBadge status={order.payment_status} type="payment" />
              </div>
              <div className="text-right border-l pl-4 md:pl-6 border-slate-200 dark:border-stone-800">
                <span className="text-[11px] text-slate-500 dark:text-stone-400 block">Total Amount</span>
                <span className="font-serif text-lg font-bold text-amber-900 dark:text-amber-400">
                  ₹{order.grand_total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Visual 10-Stage Timeline */}
          <div className="bg-[#FAF8F5] dark:bg-stone-900/80 rounded-3xl p-6 sm:p-8 border border-[#E8DFD0] dark:border-stone-800 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-800 dark:text-amber-400" />
              Production & Delivery Progress
            </h3>

            {/* Stepper Bar */}
            <div className="relative">
              <div className="overflow-x-auto pb-4">
                <div className="flex items-center justify-between min-w-[640px] relative">
                  {/* Connecting line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-stone-800 -z-0" />

                  {timelineSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(order.order_status);
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center relative z-10 w-24">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amber-700 text-white ring-4 ring-amber-500/20 animate-pulse'
                              : 'bg-white dark:bg-stone-900 border-2 border-slate-300 dark:border-stone-700 text-slate-400 dark:text-stone-500'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-semibold mt-2 ${
                            isCurrent
                              ? 'text-amber-900 dark:text-amber-300 font-bold'
                              : isDone
                              ? 'text-slate-800 dark:text-stone-200'
                              : 'text-slate-400 dark:text-stone-500'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Design Approval Section (if active proof exists) */}
          {proof && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-purple-200 dark:border-purple-900/50 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                  <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
                    Artisan Design Proof (Action Required)
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    proof.customer_status === 'Approved'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                      : 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800 animate-pulse'
                  }`}
                >
                  Status: {proof.customer_status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 aspect-4/3 relative shadow-inner">
                  <img
                    src={proof.proof_url}
                    alt="Design Proof"
                    className="w-full h-full object-contain"
                  />
                  <a
                    href={proof.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2 right-2 bg-black/75 hover:bg-black text-white text-[11px] px-3 py-1 rounded-full font-semibold"
                  >
                    Open High-Res Preview
                  </a>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-stone-400 leading-relaxed">
                    Our lead designer has crafted the typography and photo adjustments for your approval. Please review carefully before we start museum-grade printing.
                  </p>

                  {proof.customer_status !== 'Approved' ? (
                    <div className="space-y-3 pt-2">
                      <textarea
                        rows={3}
                        placeholder="Request specific adjustments or changes (e.g., adjust caption font, warm color tone, change alignment)..."
                        value={revisionNotes}
                        onChange={(e) => setRevisionNotes(e.target.value)}
                        className="w-full bg-[#FAF8F5] dark:bg-stone-800 border border-slate-300 dark:border-stone-700 rounded-xl p-3 text-xs text-slate-800 dark:text-stone-100"
                      />

                      <div className="flex gap-3">
                        <button
                          type="button"
                          disabled={proofActionLoading}
                          onClick={() => handleCustomerProofAction('approve')}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>APPROVE DESIGN & PRINT</span>
                        </button>

                        <button
                          type="button"
                          disabled={proofActionLoading}
                          onClick={() => handleCustomerProofAction('request_changes')}
                          className="flex-1 bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 text-slate-800 dark:text-stone-200 font-semibold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Request Revision
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>Artwork Approved! Printing & framing in progress.</span>
                    </div>
                  )}

                  {proofFeedback && (
                    <p className="text-xs font-bold text-purple-900 dark:text-purple-300">{proofFeedback}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Courier Dispatch & Tracking Info (if dispatched) */}
          {order.tracking_number && (
            <div className="bg-sky-50 dark:bg-sky-950/50 rounded-3xl p-6 border border-sky-200 dark:border-sky-900/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 dark:text-stone-100 text-sm">
                    Package Dispatched with {order.tracking_carrier || 'Express Courier'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-stone-400 mt-0.5">
                    AWB / Tracking Number:{' '}
                    <span className="font-mono font-bold text-slate-900 dark:text-stone-200">{order.tracking_number}</span>
                  </p>
                </div>
              </div>

              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs"
                >
                  Track on Courier Portal
                </a>
              )}
            </div>
          )}

          {/* Order Items Configuration Detail */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E8DFD0] dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
              Customized Items in Order ({order.items.length})
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-stone-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex gap-4">
                    <img
                      src={item.customization?.photos?.[0]?.url || item.image}
                      alt={item.product_name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-stone-700"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-stone-100">{item.product_name}</h4>
                      <p className="text-xs text-slate-500 dark:text-stone-400">
                        Size: <span className="font-semibold text-slate-800 dark:text-stone-200">{item.size}</span> • Material: <span className="font-semibold text-slate-800 dark:text-stone-200">{item.material}</span>
                      </p>
                      {item.frame && (
                        <p className="text-xs text-slate-500 dark:text-stone-400">
                          Frame: <span className="font-semibold text-slate-800 dark:text-stone-200">{item.frame}</span>
                        </p>
                      )}
                      {item.customization?.text && (
                        <p className="text-xs text-amber-800 dark:text-amber-300 italic font-medium">
                          Custom Inscription: "{item.customization.text}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col justify-between items-end">
                    <span className="text-xs text-slate-500 dark:text-stone-400">{item.quantity} × ₹{item.unit_price}</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-stone-100">₹{item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
