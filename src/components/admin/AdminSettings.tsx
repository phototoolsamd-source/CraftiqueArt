import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, Check, Sparkles, MessageCircle, CreditCard, FolderCheck } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    business_name: 'Craftique',
    brand_title: 'Creaftique',
    tagline: 'Create. Customize. Print. Cherish.',
    upi_id: 'aksharstudio-3@okisbii',
    whatsapp_number: '916354871446',
    script_url: 'https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec',
    admin_emails: ['admin@craftique.in'],
    gst_rate: 18,
    shipping_fee: 80,
    free_shipping_threshold: 1500,
    order_prefix: 'CRQ',
    catalog_source_path: '/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.data) setSettings(d.data);
      })
      .catch(e => console.error(e));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="font-serif font-bold text-2xl text-slate-900">
          Studio Brand & Integration Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure direct UPI payments, WhatsApp API, Google Apps Script Drive integrations, and order prefixes.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Business & Brand */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-800" />
            Brand & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Brand Public Title</label>
              <input
                type="text"
                value={settings.brand_title || ''}
                onChange={(e) => setSettings({ ...settings, brand_title: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Payee Business Name</label>
              <input
                type="text"
                value={settings.business_name || ''}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Payment & WhatsApp Integration */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-800" />
            Payment Gateway & Communications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">UPI ID for Dynamic QR</label>
              <input
                type="text"
                value={settings.upi_id || ''}
                onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-amber-950"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Configured: aksharstudio-3@okisbii</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Studio Number</label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Format: 916354871446</span>
            </div>
          </div>
        </div>

        {/* Google Drive & Apps Script Integration */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-amber-800" />
            Google Drive & Apps Script Endpoint
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Google Apps Script Web App URL</label>
            <input
              type="url"
              value={settings.script_url || ''}
              onChange={(e) => setSettings({ ...settings, script_url: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-700"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Handles external Drive folder structuring and notifications.
            </span>
          </div>
        </div>

        {/* Tax & Logistics Rules */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Taxes & Order Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">GST Rate (%)</label>
              <input
                type="number"
                value={settings.gst_rate || 18}
                onChange={(e) => setSettings({ ...settings, gst_rate: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.shipping_fee || 80}
                onChange={(e) => setSettings({ ...settings, shipping_fee: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold || 1500}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Order Prefix</label>
              <input
                type="text"
                value={settings.order_prefix || 'CRQ'}
                onChange={(e) => setSettings({ ...settings, order_prefix: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
