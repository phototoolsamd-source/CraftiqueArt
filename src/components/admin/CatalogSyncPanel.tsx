import React, { useState, useEffect } from 'react';
import { RefreshCw, Folder, HardDrive, CheckCircle2, AlertCircle, Terminal, Play, Sparkles } from 'lucide-react';

export const CatalogSyncPanel: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<any>({
    connected: true,
    last_sync: new Date().toISOString(),
    products_found: 248,
    new_products: 7,
    updated_products: 15,
    removed_products: 2,
    images_count: 1436,
    source_dir: '/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products'
  });
  const [customPath, setCustomPath] = useState('/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/catalog/status');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setSyncStatus(data.data);
          if (data.data.source_dir) setCustomPath(data.data.source_dir);
        }
      }
    } catch (e) {
      console.warn('Error fetching sync status:', e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/catalog/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_path: customPath })
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(data);
        setSyncMessage(`Catalog sync finished! Found ${data.products_found} products, ${data.images_count} images.`);
      } else {
        setSyncMessage(`Sync notice: ${data.error || 'Check drive connection'}`);
      }
    } catch (err: any) {
      setSyncMessage(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Catalog Synchronization Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Auto-generate products, extract photos, and parse Excel spreadsheets from your local product folder.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYNC STATUS: {syncStatus.connected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Products Found
          </span>
          <span className="font-serif text-3xl font-bold text-slate-900 mt-1 block">
            {syncStatus.products_found || 0}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">Active in Store</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Total Images
          </span>
          <span className="font-serif text-3xl font-bold text-slate-900 mt-1 block">
            {syncStatus.images_count || 0}
          </span>
          <span className="text-[11px] text-slate-500">Banners, Heros & Sizes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            New Detected
          </span>
          <span className="font-serif text-3xl font-bold text-amber-800 mt-1 block">
            +{syncStatus.new_products || 0}
          </span>
          <span className="text-[11px] text-amber-700">From folder changes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Last Synchronized
          </span>
          <span className="text-xs font-bold text-slate-800 mt-2 block leading-tight">
            {syncStatus.last_sync ? new Date(syncStatus.last_sync).toLocaleString() : 'Never'}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Automated background sync</span>
        </div>
      </div>

      {/* Source Path Controller & Manual Trigger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-amber-800" />
          Local Folder Source Configuration
        </h3>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Product Folder Directory Path (External Hard Drive or Local Drive):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              className="flex-1 bg-[#FAF8F5] border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            />
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSyncNow}
              className="bg-[#B45309] hover:bg-[#92400E] disabled:bg-slate-400 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Scanning & Parsing...' : 'SYNC CATALOG NOW'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Default: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products</code>
          </p>
        </div>

        {syncMessage && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}
      </div>

      {/* Desktop Sync Agent CLI Instructions (Addressing Section 53) */}
      <div className="bg-[#0F172A] text-slate-300 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <Terminal className="w-5 h-5" />
          <h3 className="font-mono font-bold text-sm text-white">
            Creaftique Background Sync Agent (CLI & Watcher)
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Browsers cannot access arbitrary local filesystems due to security sandbox constraints. Run our lightweight local sync agent on your Mac to watch your external drive in real-time:
        </p>

        <div className="bg-black/60 rounded-xl p-4 font-mono text-xs text-amber-200 space-y-2 border border-slate-800 select-all">
          <p className="text-slate-500"># Run one-time scan and sync:</p>
          <p className="text-emerald-400 font-bold">$ npm run sync</p>
          <p className="text-slate-500 pt-2"># Run continuous live folder watcher (auto-syncs on photo or Excel edit):</p>
          <p className="text-emerald-400 font-bold">$ npm run sync:watch</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Sync agent detects category additions, SKU folders, photo updates, and parses Excel product sheets.</span>
        </div>
      </div>
    </div>
  );
};
