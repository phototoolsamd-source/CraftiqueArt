import React, { useState, useEffect } from 'react';
import { PaymentRecord, Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Check, X, ShieldCheck, AlertCircle, Copy, Eye, ExternalLink, RefreshCw } from 'lucide-react';

export const PaymentVerification: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectPrompt, setRejectPrompt] = useState<{ id: string; orderNumber: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [payRes, ordRes] = await Promise.all([
        fetch('/api/payments').then(r => r.json()),
        fetch('/api/orders').then(r => r.json())
      ]);
      if (payRes.data) setPayments(payRes.data);
      if (ordRes.data) setOrders(ordRes.data);
    } catch (err) {
      console.error('Error loading payment verification data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (paymentId: string, orderNumber: string, action: 'verify' | 'reject') => {
    setActionLoading(paymentId);
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: paymentId,
          order_number: orderNumber,
          verified_by: 'Studio Admin',
          action,
          rejection_reason: action === 'reject' ? rejectReason : undefined
        })
      });

      if (res.ok) {
        setRejectPrompt(null);
        setRejectReason('');
        loadData();
      }
    } catch (err) {
      console.error('Failed to verify payment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getOrderForPayment = (orderNum: string) => {
    return orders.find(o => o.order_number === orderNum);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            UPI Payment Verification Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review customer claimed payments, cross-reference UTR transaction IDs, and inspect banking screenshots.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">UTR / Transaction ID</th>
                <th className="py-3.5 px-4">Payment Screenshot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No payment claims currently pending verification.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const ord = getOrderForPayment(p.order_number);
                  const isVerified = p.status === 'Verified';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {p.order_number}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {ord?.customer_name || 'Customer'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ord?.customer_phone || ''}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-base text-amber-900">
                        ₹{p.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4">
                        {p.utr ? (
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md max-w-fit">
                            <span>{p.utr}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(p.utr || '')}
                              className="text-slate-400 hover:text-black"
                              title="Copy UTR"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No UTR entered</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {p.screenshot_url ? (
                          <button
                            type="button"
                            onClick={() => setSelectedScreenshot(p.screenshot_url || null)}
                            className="flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-950 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No image attached</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={p.status} type="payment" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        {!isVerified ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={actionLoading === p.id}
                              onClick={() => handleVerify(p.id, p.order_number, 'verify')}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Verify</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRejectPrompt({ id: p.id, orderNumber: p.order_number })}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold px-2.5 py-1.5 rounded-lg text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <ShieldCheck className="w-4 h-4" />
                            Verified by Studio
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox for Payment Screenshot */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 relative shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-serif font-bold text-sm text-slate-800">Payment Proof Screenshot</span>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1 rounded-full text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 max-h-[75vh] overflow-y-auto">
              <img
                src={selectedScreenshot}
                alt="Payment proof screenshot"
                className="w-full h-auto rounded-xl object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Prompt Modal */}
      {rejectPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Reject Payment Claim for {rejectPrompt.orderNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Please provide a reason so the customer can be notified on WhatsApp or SMS to resubmit.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. UTR number not found in bank statement, or amount does not match..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-3 text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectPrompt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerify(rejectPrompt.id, rejectPrompt.orderNumber, 'reject')}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
