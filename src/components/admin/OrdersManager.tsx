import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Filter,
  Eye,
  X,
  ExternalLink,
  FolderCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  FileText
} from 'lucide-react';

export const OrdersManager: React.FC<{ initialOrderNumber?: string }> = ({ initialOrderNumber }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState(initialOrderNumber || '');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data || []);
        if (initialOrderNumber) {
          const match = data.data.find((o: Order) => o.order_number === initialOrderNumber);
          if (match) setSelectedOrder(match);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [initialOrderNumber]);

  const handleStatusChange = async (orderNumber: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(prev => prev.map(o => o.order_number === orderNumber ? data.data : o));
        setSelectedOrder(data.data);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'ALL' && o.order_status !== statusFilter) return false;
    if (paymentFilter !== 'ALL' && o.payment_status !== paymentFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchCust = o.customer_name.toLowerCase().includes(q);
      const matchPhone = o.customer_phone.toLowerCase().includes(q);
      const matchSku = o.items?.some(i => i.sku.toLowerCase().includes(q));
      return matchNum || matchCust || matchPhone || matchSku;
    }
    return true;
  });

  const allStatuses = [
    'NEW',
    'PAYMENT PENDING',
    'PAYMENT VERIFIED',
    'DESIGN REQUIRED',
    'DESIGN APPROVAL',
    'PRODUCTION',
    'QUALITY CHECK',
    'PACKING',
    'READY TO DISPATCH',
    'DISPATCHED',
    'DELIVERED',
    'COMPLETED',
    'Cancelled',
    'On Hold'
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by Order #, Customer, Phone, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF8F5] border border-slate-200 rounded-lg p-1.5 text-xs font-medium text-slate-800"
            >
              <option value="ALL">All Order Stages</option>
              {allStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-slate-200 rounded-lg p-1.5 text-xs font-medium text-slate-800"
          >
            <option value="ALL">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Customer Claimed Paid">Claimed Paid</option>
            <option value="Verified">Verified</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Order No.</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Products Snapshot</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Workflow Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-950">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{ord.customer_name}</span>
                      <span className="text-[10px] text-slate-500">{ord.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-700">
                      {ord.items?.map(i => `${i.quantity}× ${i.product_name} (${i.size})`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{ord.grand_total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ord.payment_status} type="payment" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ord.order_status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-lg border border-amber-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFD0] shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-scale-in">
            {/* Modal Header */}
            <div className="bg-[#FAF7F2] p-6 border-b border-[#EAE0D0] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-2xl text-amber-950">
                    {selectedOrder.order_number}
                  </span>
                  <StatusBadge status={selectedOrder.order_status} size="md" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Quick Status Progression Controller */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <label className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                  Advance Order Workflow Stage:
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedOrder.order_status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(selectedOrder.order_number, e.target.value)}
                    className="flex-1 bg-white border border-amber-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-600/30"
                  >
                    {allStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span className="text-[11px] text-amber-900 font-semibold">
                    {updatingStatus ? 'Updating...' : 'Changes timeline immediately'}
                  </span>
                </div>
              </div>

              {/* Customer & Shipping info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Customer Information
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{selectedOrder.customer_name}</h4>
                  <p className="text-xs text-slate-600">{selectedOrder.customer_phone}</p>
                  <p className="text-xs text-slate-600">{selectedOrder.customer_email}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Shipping Destination
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {selectedOrder.shipping_address?.street}<br />
                    {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}
                  </p>
                </div>
              </div>

              {/* Google Drive Order Storage */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FolderCheck className="w-5 h-5 text-amber-700" />
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      Google Drive Order Structure
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {selectedOrder.google_drive_folder || 'Creaftique Orders/2026/09/29/' + selectedOrder.order_number}
                    </span>
                  </div>
                </div>
                <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-semibold">
                  Archival Ready
                </span>
              </div>

              {/* Items & Configuration Snapshot */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  Products in Order ({selectedOrder.items?.length || 0})
                </h4>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-4 flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="flex gap-3">
                        <img
                          src={item.customization?.photos?.[0]?.url || item.image}
                          alt={item.product_name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                        />
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-slate-900">{item.product_name}</h5>
                          <p className="text-[11px] text-slate-500">
                            SKU: <span className="font-mono text-slate-700">{item.sku}</span> | Size: {item.size} | Material: {item.material}
                          </p>
                          {item.frame && (
                            <p className="text-[11px] text-slate-500">Frame: {item.frame}</p>
                          )}
                          {item.customization?.text && (
                            <p className="text-[11px] text-amber-800 italic font-semibold">
                              Custom Text: "{item.customization.text}"
                            </p>
                          )}
                          {item.customization?.notes && (
                            <p className="text-[11px] text-slate-600">
                              Customer Notes: {item.customization.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col justify-between items-end">
                        <span className="text-xs text-slate-500">{item.quantity} × ₹{item.unit_price}</span>
                        <span className="font-bold text-sm text-slate-900">₹{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Uploaded Photos Gallery */}
              {selectedOrder.items?.some(i => i.customization?.photos && i.customization.photos.length > 0) && (
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-sm text-slate-900">
                    Customer Uploaded High-Res Photos
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedOrder.items.flatMap(i => i.customization?.photos || []).map((photo, pIdx) => (
                      <a
                        key={pIdx}
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square relative block"
                      >
                        <img
                          src={photo.url}
                          alt="Customer upload"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          View High-Res
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
