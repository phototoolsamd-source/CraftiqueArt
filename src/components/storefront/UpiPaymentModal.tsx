import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, ShieldCheck, ArrowRight, UploadCloud, MessageCircle, AlertCircle, Sparkles, Smartphone } from 'lucide-react';

interface UpiPaymentModalProps {
  orderNumber: string;
  amount: number;
  customerName: string;
  customerPhone?: string;
  onPaymentSubmitted: () => void;
  onClose?: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  orderNumber,
  amount,
  customerName,
  customerPhone,
  onPaymentSubmitted,
  onClose
}) => {
  const UPI_ID = "aksharstudio-3@okisbii";
  const BUSINESS_NAME = "Craftique";
  const cleanAmount = Math.round(amount);

  // Exact UPI URI according to specification:
  // upi://pay?pa=aksharstudio-3@okisbii&pn=Craftique&am=1230&cu=INR&tn=CRQ-20260913-0001
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate dynamic QR code in browser
  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR:', err));
  }, [upiUri]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleSubmitClaim = async () => {
    setErrorMsg(null);
    if (!utrNumber.trim() && !screenshotFile) {
      setErrorMsg('Please enter your 12-digit UPI UTR number or upload a payment screenshot.');
      return;
    }

    setSubmitting(true);
    try {
      let screenshotUrl = '';
      if (screenshotFile) {
        const formData = new FormData();
        formData.append('screenshot', screenshotFile);
        const uploadRes = await fetch('/api/upload-payment-screenshot', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const upData = await uploadRes.json();
          screenshotUrl = upData.url;
        }
      }

      // Submit payment claim to backend
      const claimRes = await fetch('/api/payment/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber,
          utr: utrNumber.trim(),
          screenshot_url: screenshotUrl,
          amount: cleanAmount
        })
      });

      if (claimRes.ok) {
        onPaymentSubmitted();
      } else {
        const data = await claimRes.json();
        setErrorMsg(data.error || 'Failed to submit payment claim.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred while submitting payment proof.');
    } finally {
      setSubmitting(false);
    }
  };

  // WhatsApp helper
  const whatsappUrl = `https://wa.me/916354871446?text=${encodeURIComponent(
    `Hello Creaftique,\n\nI have placed Order ${orderNumber} for ₹${cleanAmount.toLocaleString('en-IN')}.\nPayment Status: Verification Pending\nCustomer: ${customerName}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFD0] shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white p-6 text-center relative">
          <div className="inline-flex items-center gap-1.5 bg-amber-700/60 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-amber-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            Direct UPI Payment Gateway
          </div>
          <h2 className="font-serif text-3xl font-bold">
            Pay ₹{cleanAmount.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Order Reference: <span className="font-mono font-bold tracking-wider">{orderNumber}</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!isClaiming ? (
            /* STEP 1: QR & Payment Info */
            <div className="space-y-6">
              {/* Dynamic QR Display */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mx-auto max-w-[280px] text-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Creaftique Dynamic UPI QR"
                    className="w-full h-auto mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-60 h-60 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                    Generating dynamic UPI QR...
                  </div>
                )}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-700">
                  <Smartphone className="w-3.5 h-3.5 text-amber-800" />
                  <span>Scan with GPay, PhonePe, Paytm, or BHIM</span>
                </div>
              </div>

              {/* UPI ID Copy Box */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E9DFCE] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Payee Name:</span>
                  <span className="font-bold text-slate-800">{BUSINESS_NAME}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Direct UPI ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-950 text-sm select-all">
                      {UPI_ID}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                {copiedUpi && (
                  <p className="text-[10px] text-emerald-700 font-bold text-right">
                    ✓ UPI ID copied to clipboard!
                  </p>
                )}
              </div>

              {/* Mobile UPI Intent Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`}
                  className="bg-white border border-slate-200 hover:border-amber-400 p-2.5 rounded-xl text-center text-xs font-semibold text-slate-700 shadow-xs flex flex-col items-center justify-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Google Pay
                </a>
                <a
                  href={`phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`}
                  className="bg-white border border-slate-200 hover:border-amber-400 p-2.5 rounded-xl text-center text-xs font-semibold text-slate-700 shadow-xs flex flex-col items-center justify-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  PhonePe
                </a>
                <a
                  href={`paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`}
                  className="bg-white border border-slate-200 hover:border-amber-400 p-2.5 rounded-xl text-center text-xs font-semibold text-slate-700 shadow-xs flex flex-col items-center justify-center gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Paytm
                </a>
              </div>

              {/* Primary Claim Trigger Button */}
              <button
                type="button"
                onClick={() => setIsClaiming(true)}
                className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-amber-900/15 transition-all"
              >
                <span>I HAVE PAID (SUBMIT PROOF / UTR)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp payment confirmation to studio
                </a>
              </div>
            </div>
          ) : (
            /* STEP 2: Claim Verification Form */
            <div className="space-y-4">
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-950">
                <p className="font-semibold">Almost done! Submit your UTR or Screenshot</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Our studio verifies all direct UPI transactions before initiating printing and production.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  12-Digit UPI Transaction ID / UTR Number:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 627192847192 or 42189..."
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Upload Payment Screenshot (Optional but recommended):
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-medium block">
                    {screenshotFile ? screenshotFile.name : 'Click to select screenshot image'}
                  </span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, or WEBP up to 15MB</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsClaiming(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Back to QR
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitClaim}
                  className="flex-2 bg-[#B45309] hover:bg-[#92400E] disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 transition-all"
                >
                  {submitting ? 'Verifying...' : 'Submit Payment for Verification'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
