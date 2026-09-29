import React, { useState, useEffect } from 'react';
import { Order, DesignProof } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Palette, UploadCloud, CheckCircle2, RefreshCw, Eye, MessageSquare, AlertCircle } from 'lucide-react';

export const DesignApprovalPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [proof, setProof] = useState<DesignProof | null>(null);
  const [loading, setLoading] = useState(true);

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [designerNotes, setDesignerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadDesignOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        const dOrders = (data.data || []).filter((o: Order) =>
          ['DESIGN REQUIRED', 'DESIGN APPROVAL', 'PAYMENT VERIFIED', 'NEW'].includes(o.order_status)
        );
        setOrders(dOrders);
        if (dOrders.length > 0 && !selectedOrder) {
          selectOrder(dOrders[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching design orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectOrder = async (ord: Order) => {
    setSelectedOrder(ord);
    setFeedback(null);
    try {
      const pRes = await fetch(`/api/design-proofs/${ord.order_number}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setProof(pData.data);
      }
    } catch (e) {
      console.warn('Error fetching proof:', e);
    }
  };

  useEffect(() => {
    loadDesignOrders();
  }, []);

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !proofFile) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      // 1. Upload proof image file
      const formData = new FormData();
      formData.append('proof', proofFile);
      const uploadRes = await fetch('/api/upload-design-proof', {
        method: 'POST',
        body: formData
      });
      if (!uploadRes.ok) throw new Error('Failed to upload proof file');
      const { url: proofUrl } = await uploadRes.json();

      // 2. Save design proof record
      const proofRes = await fetch('/api/design-proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: selectedOrder.order_number,
          proof_url: proofUrl,
          customer_status: 'Pending',
          designer_notes: designerNotes,
          designer: 'studio-designer@creaftique.in',
          revision_count: (proof?.revision_count || 0) + 1
        })
      });

      if (proofRes.ok) {
        const pData = await proofRes.json();
        setProof(pData.data);
        setProofFile(null);
        setDesignerNotes('');
        setFeedback('Design proof uploaded successfully! Customer will see it in their tracking portal.');
        loadDesignOrders();
      }
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Design Studio Proofing & Customer Revision Workspace
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload custom artwork proofs for customer inspection, review customer revision notes, and track approval cycles.
          </p>
        </div>

        <button
          onClick={loadDesignOrders}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Orders */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Artwork Required ({orders.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No orders currently in design queue.
              </p>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => selectOrder(ord)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedOrder?.id === ord.id
                      ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-purple-300'
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

        {/* Right: Upload & Customer Revisions review */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {selectedOrder ? (
            <div className="space-y-6">
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

                {proof && (
                  <span className="text-xs font-bold bg-purple-100 text-purple-900 px-3 py-1 rounded-full border border-purple-200">
                    Revision Version #{proof.revision_count || 1} • {proof.customer_status}
                  </span>
                )}
              </div>

              {/* Current Active Proof & Customer Revision Notes */}
              {proof && (
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-slate-200 space-y-4">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Active Design Proof Version
                  </span>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={proof.proof_url}
                      alt="Active proof"
                      className="w-40 h-32 object-contain bg-white rounded-xl border border-slate-200 shadow-xs"
                    />
                    <div className="space-y-1.5 flex-1 text-xs">
                      <p className="text-slate-600">
                        Status: <strong className="text-slate-900">{proof.customer_status}</strong>
                      </p>
                      {proof.customer_notes && (
                        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-950 font-medium">
                          <span className="text-[10px] uppercase font-bold text-amber-800 block">Customer Feedback:</span>
                          "{proof.customer_notes}"
                        </div>
                      )}
                      <a
                        href={proof.proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-800 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open High-Res Proof in New Tab</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload New Proof Form */}
              <form onSubmit={handleUploadProof} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Upload Proof File for Customer Approval
                </h4>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 relative">
                  <input
                    type="file"
                    required={!proof}
                    accept="image/*,application/pdf"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-slate-800 block">
                    {proofFile ? proofFile.name : 'Select high-resolution proof image or PDF'}
                  </span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, or PDF up to 30MB</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Designer Notes / Caption to Customer:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Adjusted warm color balance, enhanced contrast, kerned custom typography..."
                    value={designerNotes}
                    onChange={(e) => setDesignerNotes(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                {feedback && (
                  <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-semibold">
                    {feedback}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !proofFile}
                  className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Palette className="w-4 h-4" />
                  <span>{submitting ? 'Uploading Proof...' : 'Publish Proof to Customer for Approval'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              Select an order to review customer customization details and upload design proofs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
