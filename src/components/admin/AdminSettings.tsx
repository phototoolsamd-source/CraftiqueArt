import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Settings,
  Save,
  ShieldCheck,
  Check,
  Sparkles,
  MessageCircle,
  CreditCard,
  FolderCheck,
  ExternalLink,
  QrCode,
  Send,
  HelpCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';

const GOOGLE_SCRIPT_TEMPLATE = `/**
 * Craftique Google Drive Order Management Webhook
 * Automatically creates order folder, subfolders & saves customer photos in your Google Drive.
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "Craftique Google Drive Script Connected!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action === 'ping') {
      return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "Ping successful" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var orderNumber = data.order_number || ("CRQ-" + Utilities.formatDate(new Date(), "GMT+5:30", "yyyyMMdd-HHmmss"));
    var customerName = data.customer_name || "Customer";
    
    // Find or create "Craftique Orders" master folder in Google Drive
    var masterFolderName = "Craftique Orders";
    var masterFolders = DriveApp.getFoldersByName(masterFolderName);
    var masterFolder = masterFolders.hasNext() ? masterFolders.next() : DriveApp.createFolder(masterFolderName);
    
    var now = new Date();
    var yyyy = Utilities.formatDate(now, "GMT+5:30", "yyyy");
    var mm = Utilities.formatDate(now, "GMT+5:30", "MM");
    var dd = Utilities.formatDate(now, "GMT+5:30", "dd");
    
    function getOrCreate(parent, name) {
      var it = parent.getFoldersByName(name);
      return it.hasNext() ? it.next() : parent.createFolder(name);
    }
    
    var fYear = getOrCreate(masterFolder, yyyy);
    var fMonth = getOrCreate(fYear, mm);
    var fDay = getOrCreate(fMonth, dd);
    
    // Create Order folder: <OrderNumber> - <CustomerName>
    var orderFolder = fDay.createFolder(orderNumber + " - " + customerName);
    
    // Create organized subfolders
    var photosFolder = orderFolder.createFolder("Uploaded Photos");
    var designFolder = orderFolder.createFolder("Design Proofs");
    var infoFolder = orderFolder.createFolder("Customer Details");
    
    // Save customer summary file
    var orderSummary = "Order Number: " + orderNumber + "\\n" +
      "Customer Name: " + customerName + "\\n" +
      "Customer Phone: " + (data.customer_phone || "N/A") + "\\n" +
      "Customer Email: " + (data.customer_email || "N/A") + "\\n" +
      "Total Amount: INR " + (data.grand_total || 0) + "\\n" +
      "Total Items: " + (data.items_count || 1) + "\\n" +
      "Date: " + Utilities.formatDate(now, "GMT+5:30", "dd/MM/yyyy HH:mm:ss");
    infoFolder.createFile("Order_Info.txt", orderSummary, "text/plain");

    // Save uploaded photos directly into Google Drive
    if (data.photos && data.photos.length > 0) {
      for (var i = 0; i < data.photos.length; i++) {
        var p = data.photos[i];
        if (p.base64) {
          var decoded = Utilities.base64Decode(p.base64);
          var blob = Utilities.newBlob(decoded, p.mimeType || 'image/jpeg', p.filename || ('Photo_' + (i + 1) + '.jpg'));
          photosFolder.createFile(blob);
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      folderId: orderFolder.getId(),
      folderUrl: orderFolder.getUrl(),
      message: "Order folder created successfully!"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;


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
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>('');
  
  // Google Drive test states
  const [testingDrive, setTestingDrive] = useState(false);
  const [driveTestResult, setDriveTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setSettings(d.data);
          try {
            localStorage.setItem('craftique_settings', JSON.stringify(d.data));
          } catch (e) {}
        }
      })
      .catch(e => console.error(e));
  }, []);

  // Real-time Dynamic UPI QR generation
  useEffect(() => {
    const upi = settings.upi_id || 'aksharstudio-3@okisbii';
    const name = encodeURIComponent(settings.business_name || 'Craftique');
    const uri = `upi://pay?pa=${upi}&pn=${name}&am=100&cu=INR&tn=Sample%20QR`;
    QRCode.toDataURL(uri, {
      width: 220,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
      .then(url => setQrPreviewUrl(url))
      .catch(() => {});
  }, [settings.upi_id, settings.business_name]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save locally to immediate localStorage cache
      try {
        localStorage.setItem('craftique_settings', JSON.stringify(settings));
        window.dispatchEvent(new Event('craftique_settings_updated'));
      } catch (e) {}

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestDriveConnection = async () => {
    if (!settings.script_url) {
      setDriveTestResult({ success: false, message: 'કૃપા કરીને પહેલા Google Apps Script URL દાખલ કરો.' });
      return;
    }
    setTestingDrive(true);
    setDriveTestResult(null);
    try {
      const res = await fetch('/api/settings/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script_url: settings.script_url })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDriveTestResult({
          success: true,
          message: data.message || '✅ Google Apps Script સાથે સફળતાપૂર્વક કનેક્શન થઈ ગયું છે!'
        });
      } else {
        setDriveTestResult({
          success: false,
          message: data.error || '⚠️ ગૂગલ સ્ક્રિપ્ટ લિંક અમાન્ય અથવા 404 છે. નીચેથી કોડ કોપી કરીને ફરી ડિપ્લોય કરો.'
        });
      }
    } catch (err: any) {
      setDriveTestResult({
        success: false,
        message: 'કનેક્શન નિષ્ફળ: ' + err.message
      });
    } finally {
      setTestingDrive(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleTestWhatsApp = () => {
    const phone = String(settings.whatsapp_number || '916354871446').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hello ${settings.business_name || 'Craftique'}, આ સ્ટુડિયો એડમિન સેટિંગ્સમાંથી ટેસ્ટ મેસેજ છે.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">
            Studio Brand & Integration Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ડાયરેક્ટ UPI QR, WhatsApp API, Google Drive ઓર્ડર ફોલ્ડર્સ અને ઓર્ડર રૂલ્સ મેનેજ કરો.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-xs animate-scale-in">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-sm font-bold">સેટિંગ્સ સફળતાપૂર્વક સેવ થઈ ગઈ છે!</p>
            <p className="text-[11px] text-emerald-700 font-medium">સ્ટોરફ્રન્ટ, UPI QR અને ગૂગલ ડ્રાઈવ સાથે તમામ ફેરફારો તરત સિંક થઈ ગયા છે.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business & Brand */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Brand & Storefront Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1.5">
                Brand Public Title (વેબસાઇટ પર દેખાતું નામ)
              </label>
              <input
                type="text"
                value={settings.brand_title || ''}
                onChange={(e) => setSettings({ ...settings, brand_title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. Craftique"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1.5">
                Payee Business Name (યુપીઆઈ અને બિલિંગમાં નામ)
              </label>
              <input
                type="text"
                value={settings.business_name || ''}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. Craftique Studio"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-900 block mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. Create. Customize. Print. Cherish."
              />
            </div>
          </div>
        </div>

        {/* Section 2: UPI Gateway & Real-Time Dynamic QR */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Payment Gateway (Direct UPI & Dynamic QR)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  UPI ID for Customer QR Payments (તમારો સત્તાવાર UPI ID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.upi_id || ''}
                    onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                    className="w-full bg-white border-2 border-amber-300/80 rounded-xl p-3 text-sm font-mono font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g. aksharstudio-3@okisbii"
                  />
                  <span className="absolute right-3 top-3 text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                    Active UPI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  ગ્રાહક જ્યારે ચેકઆઉટ કરશે ત્યારે આ જ UPI ID નો ડાયનેમિક QR કોડ જનરેટ થશે.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  WhatsApp Studio Number (ગ્રાહક સપોર્ટ અને ઓર્ડર કન્ફર્મેશન)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.whatsapp_number || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="flex-1 bg-white border border-slate-300 rounded-xl p-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="916354871446"
                  />
                  <button
                    type="button"
                    onClick={handleTestWhatsApp}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    title="Open WhatsApp chat test"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ટેસ્ટ મેસેજ</span>
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Format: 916354871446 (With country code 91)</span>
              </div>
            </div>

            {/* Dynamic Live QR Preview Card */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE0D0] text-center flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block mb-2 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                <span>Live QR Preview</span>
              </span>

              {qrPreviewUrl ? (
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs mb-2">
                  <img src={qrPreviewUrl} alt="Live UPI QR" className="w-36 h-36 object-contain" />
                </div>
              ) : (
                <div className="w-36 h-36 bg-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 mb-2">
                  QR Generating...
                </div>
              )}

              <span className="text-xs font-bold text-slate-900 truncate max-w-[180px] block">
                {settings.business_name || 'Craftique'}
              </span>
              <span className="text-[10px] font-mono text-amber-950 truncate max-w-[180px] block font-semibold">
                {settings.upi_id || 'aksharstudio-3@okisbii'}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Scan with any UPI App
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Google Drive & Apps Script Integration */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Google Drive Automated Folder Integration
              </h3>
            </div>
            
            <button
              type="button"
              onClick={() => setShowScriptModal(!showScriptModal)}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showScriptModal ? 'સ્ક્રિપ્ટ ગાઇડ છુપાવો' : 'ગૂગલ સ્ક્રિપ્ટ કોડ જુઓ'}</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              Google Apps Script Web App URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={settings.script_url || ''}
                onChange={(e) => {
                  setSettings({ ...settings, script_url: e.target.value });
                  setDriveTestResult(null);
                }}
                className="flex-1 bg-white border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="https://script.google.com/macros/s/.../exec"
              />
              <button
                type="button"
                onClick={handleTestDriveConnection}
                disabled={testingDrive}
                className="px-4 py-3 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingDrive ? 'animate-spin' : ''}`} />
                <span>{testingDrive ? 'ટેસ્ટ કરી રહ્યું છે...' : 'કનેક્શન ટેસ્ટ કરો'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              નવા ઓર્ડર સમયે ગ્રાહકના નામ અને ઓર્ડર નંબરનું ફોલ્ડર આપોઆપ તમારી ગૂગલ ડ્રાઈવમાં બનાવવા માટે આ સ્ક્રિપ્ટ જરૂરી છે.
            </p>

            {/* Test result status feedback */}
            {driveTestResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-scale-in ${
                driveTestResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                {driveTestResult.success ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{driveTestResult.message}</span>
              </div>
            )}
          </div>

          {/* Accordion / Modal for Google Apps Script Code */}
          {showScriptModal && (
            <div className="mt-4 p-5 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Google Apps Script Setup Guide (૩ સરળ સ્ટેપ્સ)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    તમારી ગૂગલ ડ્રાઈવમાં ઓટોમેટિક ઓર્ડર ફોલ્ડર્સ બનાવવા માટે નીચેનો કોડ પેસ્ટ કરો:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'કોડ કોપી થયો!' : 'કોડ કોપી કરો'}</span>
                </button>
              </div>

              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <li><a href="https://drive.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold">drive.google.com</a> ખોલો &gt; <strong>New</strong> &gt; <strong>More</strong> &gt; <strong>Google Apps Script</strong> પર ક્લિક કરો.</li>
                <li>નીચે આપેલો કોડ પેસ્ટ કરી ઉપર <strong>Save</strong> બટન દબાવો.</li>
                <li>ઉપર જમણી બાજુ <strong>Deploy</strong> &gt; <strong>New deployment</strong> પર ક્લિક કરો &gt; Type માં <strong>Web app</strong> પસંદ કરો &gt; <strong>Who has access: Anyone</strong> રાખીને Deploy કરો. મળેલ URL અહીં પેસ્ટ કરો!</li>
              </ol>

              <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 border border-slate-800">
                {GOOGLE_SCRIPT_TEMPLATE}
              </pre>
            </div>
          )}
        </div>

        {/* Section 4: Taxes, Logistics & Order Rules */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Taxes, Shipping & Order Prefix Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1.5">
                GST Rate (%)
              </label>
              <input
                type="number"
                value={settings.gst_rate ?? 18}
                onChange={(e) => setSettings({ ...settings, gst_rate: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 18% GST</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1.5">
                Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={settings.shipping_fee ?? 80}
                onChange={(e) => setSettings({ ...settings, shipping_fee: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Standard courier rate</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1.5">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.free_shipping_threshold ?? 1500}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Free delivery above this</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1.5">
                Order Prefix
              </label>
              <input
                type="text"
                value={settings.order_prefix || 'CRQ'}
                onChange={(e) => setSettings({ ...settings, order_prefix: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Sample: {settings.order_prefix || 'CRQ'}-20260930-0001
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            * ફેરફાર કર્યા પછી <strong>"Save Configuration"</strong> બટન દબાવવાથી તમામ નવા સેટિંગ્સ લાઈવ લાગુ થઈ જશે.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3.5 px-8 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'સેવ થઈ રહ્યું છે...' : 'Save Configuration (સેવ કરો)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
