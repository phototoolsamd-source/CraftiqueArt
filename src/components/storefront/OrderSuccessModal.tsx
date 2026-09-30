import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Order } from '../../types';
import { CheckCircle2, Copy, MessageCircle, ExternalLink, ShieldCheck, FolderCheck } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order;
  onTrackOrder: (orderNumber: string) => void;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onTrackOrder,
  onClose
}) => {
  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const [copied, setCopied] = React.useState(false);

  const copyOrder = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/916354871446?text=${encodeURIComponent(
    `Hello Creaftique, I have placed Order ${order.order_number} for ₹${order.grand_total.toLocaleString('en-IN')}. Please confirm production.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] dark:bg-[#1A1816] rounded-3xl border border-[#E8DFD0] dark:border-stone-800 shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-scale-in text-center p-8 space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="w-18 h-18 rounded-full p-1 bg-white dark:bg-stone-800 border-2 border-amber-500/50 ring-2 ring-amber-500/20 shadow-lg flex items-center justify-center">
            <img src="/logo.png" alt="Craftique Production Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div className="w-18 h-18 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Order Successfully Placed
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-stone-100 mt-3">
            Thank you, {order.customer_name}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Your customized order has been received by our studio. We are preparing it for archival giclée printing.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="bg-[#FAF7F2] dark:bg-stone-900 p-4 rounded-2xl border border-[#E8DFD0] dark:border-stone-800 space-y-2">
          <p className="text-xs text-slate-500 dark:text-stone-400 font-medium">Your Unique Order Reference:</p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-xl font-bold text-amber-950 dark:text-amber-300 tracking-wider">
              {order.order_number}
            </span>
            <button
              onClick={copyOrder}
              className="p-1.5 bg-white dark:bg-stone-800 border border-slate-300 dark:border-stone-700 rounded-lg text-slate-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              title="Copy Order Number"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">✓ Copied to clipboard!</span>}

          <div className="pt-2 border-t border-slate-200/60 dark:border-stone-800 flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-stone-400">
            <FolderCheck className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <span>Google Drive Order Storage: {order.google_drive_folder || 'Creaftique Orders/2026/09/29/' + order.order_number}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onTrackOrder(order.order_number)}
            className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Track Order & Review Design Proof</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Notify Creaftique on WhatsApp (+91 63548 71446)</span>
          </a>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:hover:text-stone-200 font-medium pt-2 block mx-auto underline cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
