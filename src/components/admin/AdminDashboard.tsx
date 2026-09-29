import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Wrench,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  IndianRupee
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/reports/summary').then(r => r.json())
    ])
      .then(([ordersData, reportData]) => {
        if (ordersData.data) setOrders(ordersData.data);
        if (reportData.data) setReport(reportData.data);
      })
      .catch(err => console.error('Error fetching dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.grand_total || 0), 0);
  const pendingOrders = orders.filter(o => o.order_status === 'NEW' || o.order_status === 'PAYMENT PENDING').length;
  const inProduction = orders.filter(o => o.order_status === 'PRODUCTION').length;
  const readyDispatch = orders.filter(o => o.order_status === 'READY TO DISPATCH' || o.order_status === 'PACKING').length;
  const dispatched = orders.filter(o => o.order_status === 'DISPATCHED' || o.order_status === 'DELIVERED').length;
  const paymentPending = orders.filter(o => o.payment_status === 'Customer Claimed Paid' || o.payment_status === 'Pending').length;

  const statCards = [
    {
      title: "Today's Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      sub: "From verified & claimed UPI orders",
      icon: <IndianRupee className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-200"
    },
    {
      title: "Total Orders",
      value: orders.length,
      sub: "Live customer orders",
      icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200"
    },
    {
      title: "Payment Verification",
      value: paymentPending,
      sub: "Pending UTR / Screenshot review",
      icon: <CreditCard className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 border-amber-200",
      action: () => onNavigateTab('payments')
    },
    {
      title: "In Production",
      value: inProduction,
      sub: "Active printing & framing jobs",
      icon: <Wrench className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-200",
      action: () => onNavigateTab('production')
    },
    {
      title: "Ready to Dispatch",
      value: readyDispatch,
      sub: "QC passed, ready for courier manifest",
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-600" />,
      bg: "bg-cyan-50 border-cyan-200",
      action: () => onNavigateTab('dispatch')
    },
    {
      title: "Dispatched / Transit",
      value: dispatched,
      sub: "Shipped with courier AWB tracking",
      icon: <Truck className="w-5 h-5 text-sky-600" />,
      bg: "bg-sky-50 border-sky-200",
      action: () => onNavigateTab('dispatch')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.action}
            className={`p-5 rounded-2xl border ${card.bg} shadow-xs transition-all ${
              card.action ? 'cursor-pointer hover:shadow-md hover:scale-[1.01]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {card.title}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-slate-900">
                {card.value}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Visual Workflow Pipeline Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-slate-900">
              Studio Order Workflow Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Live volume distribution across the 10 production checkpoints
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
          >
            <span>Manage Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-center">
            <span className="text-[11px] font-bold text-blue-900 uppercase">1. New Orders</span>
            <div className="text-xl font-bold text-blue-800 mt-0.5">{pendingOrders}</div>
          </div>
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-center">
            <span className="text-[11px] font-bold text-amber-900 uppercase">2. Payments</span>
            <div className="text-xl font-bold text-amber-800 mt-0.5">{paymentPending}</div>
          </div>
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-center">
            <span className="text-[11px] font-bold text-indigo-900 uppercase">3. Production</span>
            <div className="text-xl font-bold text-indigo-800 mt-0.5">{inProduction}</div>
          </div>
          <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-center">
            <span className="text-[11px] font-bold text-cyan-900 uppercase">4. QC & Packing</span>
            <div className="text-xl font-bold text-cyan-800 mt-0.5">{readyDispatch}</div>
          </div>
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-emerald-900 uppercase">5. Dispatched</span>
            <div className="text-xl font-bold text-emerald-800 mt-0.5">{dispatched}</div>
          </div>
        </div>
      </div>

      {/* Recent Orders Quick Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-slate-900">
            Recent Customer Orders
          </h3>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-amber-800 font-bold hover:underline"
          >
            View All ({orders.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Order No.</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Products</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Workflow Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-900">
                    {ord.order_number}
                  </td>
                  <td className="py-3">
                    <span className="font-semibold text-slate-800 block">{ord.customer_name}</span>
                    <span className="text-[10px] text-slate-400">{ord.customer_phone}</span>
                  </td>
                  <td className="py-3 text-slate-600 max-w-xs truncate">
                    {ord.items?.map(i => `${i.quantity}× ${i.product_name}`).join(', ')}
                  </td>
                  <td className="py-3 font-bold text-slate-900">
                    ₹{ord.grand_total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={ord.payment_status} type="payment" />
                  </td>
                  <td className="py-3">
                    <StatusBadge status={ord.order_status} />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onNavigateTab('orders', ord.order_number)}
                      className="text-xs text-amber-800 font-semibold hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
