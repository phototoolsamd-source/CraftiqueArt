import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, IndianRupee, PieChart, ShieldCheck } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/summary')
      .then(r => r.json())
      .then(d => {
        if (d.data) setSummary(d.data);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const downloadCsv = () => {
    if (!summary) return;
    const rows = [
      ['Metric', 'Amount (INR)'],
      ['Total Gross Revenue', summary.total_revenue],
      ['Verified Paid Revenue', summary.paid_revenue],
      ['Material Substrate Costs', summary.cost_breakdown?.material_cost],
      ['Archival Printing & Ink Costs', summary.cost_breakdown?.print_cost],
      ['Studio Labor & Craft Costs', summary.cost_breakdown?.labor_cost],
      ['Protective Packaging Costs', summary.cost_breakdown?.packaging_cost],
      ['Logistics Shipping Costs', summary.cost_breakdown?.shipping_cost],
      ['Total Costs of Goods Sold', summary.cost_breakdown?.total_cost],
      ['Gross Studio Profit', summary.profit?.gross_profit],
      ['Gross Profit Margin (%)', `${summary.profit?.profit_margin_percent}%`]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Creaftique_Profit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Profitability & Studio Financial Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit economics, cost of goods sold (COGS), and net gross margin tracking.
          </p>
        </div>

        <button
          onClick={downloadCsv}
          className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all w-fit"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Report (CSV)</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Gross Order Revenue
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-slate-900">
              ₹{summary.total_revenue?.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            100% Direct Prepaid UPI Orders
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Studio Gross Profit
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-emerald-700">
              ₹{summary.profit?.gross_profit?.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Revenue minus All Substrate & Labor Costs
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Net Profit Margin
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-amber-800">
              {summary.profit?.profit_margin_percent}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Healthy artisan studio economics
          </span>
        </div>
      </div>

      {/* Cost of Goods Sold (COGS) Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-amber-800" />
          Production Cost Breakdown (COGS)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Substrate Materials</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              ₹{summary.cost_breakdown?.material_cost?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Canvas, Wood, Acrylic</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Archival 12-Color Ink</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              ₹{summary.cost_breakdown?.print_cost?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Pigment inks & coatings</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Studio Labor & Craft</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              ₹{summary.cost_breakdown?.labor_cost?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Stretching, framing, QC</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Shockproof Packaging</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              ₹{summary.cost_breakdown?.packaging_cost?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Multi-layer bubble & crates</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Courier Logistics</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">
              ₹{summary.cost_breakdown?.shipping_cost?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500">Delhivery, BlueDart, DTDC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
