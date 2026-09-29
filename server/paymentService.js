const QRCode = require('qrcode');
const db = require('./db');

class PaymentService {
  getUpiUri({ orderNumber, amount, note = null }) {
    const settings = db.getSettings();
    const upiId = settings.upi_id || "aksharstudio-3@okisbii";
    const businessName = settings.business_name || "Craftique";
    const cleanAmount = Math.round(Number(amount));
    const txnNote = encodeURIComponent(note || orderNumber);
    const payeeName = encodeURIComponent(businessName);

    // Format strictly according to specification:
    // upi://pay?pa=aksharstudio-3@okisbii&pn=Craftique&am=1230&cu=INR&tn=CRQ-20260913-0001
    return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${cleanAmount}&cu=INR&tn=${txnNote}`;
  }

  async generateDynamicQrCode(orderNumber, amount) {
    const upiUri = this.getUpiUri({ orderNumber, amount });
    try {
      const qrDataUrl = await QRCode.toDataURL(upiUri, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 320,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      });
      return {
        success: true,
        upiUri,
        qrDataUrl,
        amount: Math.round(Number(amount)),
        orderNumber
      };
    } catch (err) {
      console.error('Error generating QR code:', err);
      throw err;
    }
  }

  getMobileUpiLinks(orderNumber, amount) {
    const rawUri = this.getUpiUri({ orderNumber, amount });
    const paramsOnly = rawUri.replace('upi://pay?', '');
    return {
      generic: rawUri,
      gpay: `tez://upi/pay?${paramsOnly}`,
      phonepe: `phonepe://pay?${paramsOnly}`,
      paytm: `paytmmp://pay?${paramsOnly}`
    };
  }
}

module.exports = new PaymentService();
