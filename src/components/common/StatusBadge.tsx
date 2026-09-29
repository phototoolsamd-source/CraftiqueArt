import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'order', size = 'sm' }) => {
  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let dot = 'bg-slate-400';

  if (type === 'payment') {
    switch (status) {
      case 'Verified':
        bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        dot = 'bg-emerald-500';
        break;
      case 'Customer Claimed Paid':
        bg = 'bg-amber-50 text-amber-800 border-amber-200';
        dot = 'bg-amber-500 animate-pulse';
        break;
      case 'Verification Required':
        bg = 'bg-orange-50 text-orange-800 border-orange-200';
        dot = 'bg-orange-500';
        break;
      case 'Pending':
        bg = 'bg-yellow-50 text-yellow-800 border-yellow-200';
        dot = 'bg-yellow-500';
        break;
      case 'Failed':
      case 'Refunded':
        bg = 'bg-rose-50 text-rose-800 border-rose-200';
        dot = 'bg-rose-500';
        break;
    }
  } else {
    switch (status) {
      case 'NEW':
        bg = 'bg-blue-50 text-blue-800 border-blue-200';
        dot = 'bg-blue-500';
        break;
      case 'PAYMENT PENDING':
        bg = 'bg-amber-50 text-amber-800 border-amber-200';
        dot = 'bg-amber-500';
        break;
      case 'PAYMENT VERIFIED':
        bg = 'bg-teal-50 text-teal-800 border-teal-200';
        dot = 'bg-teal-500';
        break;
      case 'DESIGN REQUIRED':
      case 'DESIGN APPROVAL':
        bg = 'bg-purple-50 text-purple-800 border-purple-200';
        dot = 'bg-purple-500';
        break;
      case 'PRODUCTION':
        bg = 'bg-indigo-50 text-indigo-800 border-indigo-200';
        dot = 'bg-indigo-500 animate-pulse';
        break;
      case 'QUALITY CHECK':
        bg = 'bg-cyan-50 text-cyan-800 border-cyan-200';
        dot = 'bg-cyan-500';
        break;
      case 'PACKING':
      case 'READY TO DISPATCH':
        bg = 'bg-amber-50 text-amber-800 border-amber-200';
        dot = 'bg-amber-500';
        break;
      case 'DISPATCHED':
        bg = 'bg-sky-50 text-sky-800 border-sky-200';
        dot = 'bg-sky-500';
        break;
      case 'DELIVERED':
      case 'COMPLETED':
        bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        dot = 'bg-emerald-500';
        break;
      case 'Cancelled':
      case 'On Hold':
        bg = 'bg-rose-50 text-rose-800 border-rose-200';
        dot = 'bg-rose-500';
        break;
    }
  }

  const px = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bg} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};
