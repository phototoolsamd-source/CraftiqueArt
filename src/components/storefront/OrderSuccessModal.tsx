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
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DFD0] shadow-2xl max-w-lg w-full overflow-hidden my-8 animate-scale-in text-center p-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Successfully Placed
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-3">
            Thank you, {order.customer_name}!
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your customized order has been received by our studio. We are preparing it for archival giclée printing.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD0] space-y-2">
          <p className="text-xs text-slate-500 font-medium">Your Unique Order Reference:</p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-xl font-bold text-amber-950 tracking-wider">
              {order.order_number}
            </span>
            <button
              onClick={copyOrder}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:text-black transition-colors"
              title="Copy Order Number"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <span className="text-[10px] text-emerald-700 font-bold block">✓ Copied to clipboard!</span>}

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-center gap-2 text-xs text-slate-600">
            <FolderCheck className="w-4 h-4 text-amber-800" />
            <span>Google Drive Order Storage: {order.google_drive_folder || 'Creaftique Orders/2026/09/29/' + order.order_number}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onTrackOrder(order.order_number)}
            className="w-full bg-[#B45309] hover:bg-[#92400E] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 transition-all"
          >
            <span>Track Order & Review Design Proof</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Notify Creaftique on WhatsApp (+91 63548 71446)</span>
          </a>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium pt-2 block mx-auto underline"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
