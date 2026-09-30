const fs = require('fs');
const path = require('path');
const db = require('./db');

class DriveService {
  constructor() {
    this.storageRoot = process.env.VERCEL
      ? path.join('/tmp', 'storage', 'orders')
      : path.join(__dirname, 'storage', 'orders');
    this.ensureDirectory(this.storageRoot);
  }

  ensureDirectory(dir) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (err) {
      console.warn('[DriveService] Directory warning (handled for read-only environments):', err.message);
    }
  }

  getOrderFolderStructure(orderNumber, customerName = "Customer") {
    // Structure: Creaftique Orders / YYYY / MM / DD / <orderNumber>/
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const orderDirPath = path.join(this.storageRoot, yyyy, mm, dd, orderNumber);
    const subfolders = {
      root: orderDirPath,
      customer: path.join(orderDirPath, 'Customer'),
      product: path.join(orderDirPath, 'Product'),
      photos: path.join(orderDirPath, 'Uploaded Photos'),
      design: path.join(orderDirPath, 'Design')
    };

    // Ensure all directories exist
    Object.values(subfolders).forEach(p => this.ensureDirectory(p));

    return {
      relativePath: `Creaftique Orders/${yyyy}/${mm}/${dd}/${orderNumber}`,
      localPaths: subfolders
    };
  }

  async syncOrderToGoogleDrive(order) {
    const settings = db.getSettings();
    const scriptUrl = settings.script_url;
    const folderInfo = this.getOrderFolderStructure(order.order_number, order.customer_name);

    // Write Order Details manifest / printable receipt locally
    const manifestPath = path.join(folderInfo.localPaths.root, 'Order_Details.html');
    const htmlManifest = this.generateOrderHtmlManifest(order);
    try {
      fs.writeFileSync(manifestPath, htmlManifest, 'utf-8');
    } catch (err) {
      console.warn('[DriveService] Could not write manifest HTML:', err.message);
    }

    // Copy customer uploaded photos directly into order's Uploaded Photos folder
    let photoCount = 0;
    const uploadsDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
    (order.items || []).forEach(item => {
      const photos = item.customization?.photos || [];
      photos.forEach((p, idx) => {
        const photoUrl = typeof p === 'string' ? p : p.url;
        if (!photoUrl) return;

        if (photoUrl.startsWith('/uploads/customer-photos/')) {
          const filename = path.basename(photoUrl);
          const srcPath = path.join(uploadsDir, 'customer-photos', filename);
          const fallbackSrcPath = path.join(__dirname, 'uploads', 'customer-photos', filename);
          const finalSrc = fs.existsSync(srcPath) ? srcPath : (fs.existsSync(fallbackSrcPath) ? fallbackSrcPath : null);
          if (finalSrc) {
            try {
              const destFilename = `Photo_${String(++photoCount).padStart(2, '0')}_${filename}`;
              const destPath = path.join(folderInfo.localPaths.photos, destFilename);
              fs.copyFileSync(finalSrc, destPath);
            } catch (e) {
              console.warn('[DriveService] Could not copy customer photo:', e.message);
            }
          }
        } else if (photoUrl.startsWith('data:image/')) {
          try {
            const matches = photoUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
            if (matches) {
              const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
              const buffer = Buffer.from(matches[2], 'base64');
              const destFilename = `Photo_${String(++photoCount).padStart(2, '0')}.${ext}`;
              const destPath = path.join(folderInfo.localPaths.photos, destFilename);
              fs.writeFileSync(destPath, buffer);
            }
          } catch (e) {
            console.warn('[DriveService] Error saving base64 photo:', e.message);
          }
        }
      });
    });
    console.log(`[DriveService] Saved ${photoCount} customer photos to ${folderInfo.localPaths.photos}`);

    // Prepare photos payload for Google Apps Script sync
    const photosPayload = [];
    (order.items || []).forEach(item => {
      const photos = item.customization?.photos || [];
      photos.forEach((p, idx) => {
        const photoUrl = typeof p === 'string' ? p : p.url;
        if (!photoUrl) return;
        if (photoUrl.startsWith('data:image/')) {
          const matches = photoUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (matches) {
            photosPayload.push({
              filename: `Photo_${photosPayload.length + 1}_${order.order_number}.${matches[1] === 'jpeg' ? 'jpg' : matches[1]}`,
              mimeType: `image/${matches[1]}`,
              base64: matches[2]
            });
          }
        }
      });
    });

    let driveFolderId = `gdrive-fld-${order.order_number}`;
    let driveUrl = `https://drive.google.com/drive/search?q=${encodeURIComponent(order.order_number)}`;
    let appsScriptStatus = 'Local Initialized';

    // Try posting to Apps Script endpoint if configured
    if (scriptUrl) {
      try {
        console.log(`[DriveService] Notifying Apps Script for order: ${order.order_number}`);
        const response = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'createOrderFolder',
            order_number: order.order_number,
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            customer_phone: order.customer_phone,
            grand_total: order.grand_total,
            items_count: order.items?.length || 1,
            folder_path: folderInfo.relativePath,
            photos: photosPayload.slice(0, 10)
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const result = await response.json().catch(() => ({}));
          if (result.folderId) driveFolderId = result.folderId;
          if (result.folderUrl) driveUrl = result.folderUrl;
          appsScriptStatus = 'Synced with Google Apps Script';
        }
      } catch (err) {
        console.warn(`[DriveService] Apps Script webhook notice (handled smoothly):`, err.message);
        appsScriptStatus = 'Local Fallback Storage Active';
      }
    }

    // Update order with folder info & direct URL
    db.updateOrder(order.order_number, {
      google_drive_folder: folderInfo.relativePath,
      google_drive_folder_id: driveFolderId,
      google_drive_url: driveUrl,
      google_drive_status: appsScriptStatus,
      local_storage_path: folderInfo.localPaths.root
    });


    return {
      folderPath: folderInfo.relativePath,
      driveFolderId,
      status: appsScriptStatus
    };
  }

  generateOrderHtmlManifest(order) {
    const itemsHtml = (order.items || []).map(i => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 8px;">
          <strong>${i.product_name}</strong><br/>
          <span style="font-size: 12px; color: #64748b;">SKU: ${i.sku} | Size: ${i.size} | Material: ${i.material}</span><br/>
          ${i.customization?.text ? `<span style="font-size: 12px; color: #d97706;">Custom Text: "${i.customization.text}"</span>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center;">${i.quantity}</td>
        <td style="padding: 12px 8px; text-align: right;">₹${i.unit_price}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: bold;">₹${i.total}</td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Work Order — ${order.order_number}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; margin: 40px; }
    .header { border-bottom: 2px solid #b45309; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 26px; font-weight: 800; color: #b45309; }
    .meta { font-size: 14px; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f8fafc; text-align: left; padding: 10px 8px; font-size: 13px; text-transform: uppercase; color: #475569; }
    .totals { width: 300px; margin-left: auto; }
    .totals table td { padding: 6px 0; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #fef3c7; color: #92400e; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">Creaftique</div>
      <div class="meta">Customized Products, Printing & Bespoke Décor</div>
      <div class="meta">WhatsApp: +91 63548 71446 | Ahmedabad, Gujarat</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 20px; font-weight: bold;">${order.order_number}</div>
      <div class="meta">Date: ${new Date(order.created_at || Date.now()).toLocaleDateString()}</div>
      <div class="badge">${order.order_status || 'NEW'}</div>
    </div>
  </div>

  <div style="display: flex; gap: 40px; margin-bottom: 24px;">
    <div style="flex: 1;">
      <h4 style="margin: 0 0 6px 0; text-transform: uppercase; font-size: 12px; color: #64748b;">Customer Information</h4>
      <strong>${order.customer_name}</strong><br/>
      Phone: ${order.customer_phone}<br/>
      Email: ${order.customer_email}
    </div>
    <div style="flex: 1;">
      <h4 style="margin: 0 0 6px 0; text-transform: uppercase; font-size: 12px; color: #64748b;">Shipping Destination</h4>
      ${order.shipping_address?.street || ''}<br/>
      ${order.shipping_address?.city || ''}, ${order.shipping_address?.state || ''} - ${order.shipping_address?.pincode || ''}<br/>
      India
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Product & Configuration</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>Subtotal:</td><td style="text-align: right;">₹${order.subtotal}</td></tr>
      ${order.discount ? `<tr><td>Discount:</td><td style="text-align: right; color: #16a34a;">-₹${order.discount}</td></tr>` : ''}
      <tr><td>GST (18%):</td><td style="text-align: right;">₹${order.tax}</td></tr>
      <tr><td>Shipping:</td><td style="text-align: right;">${order.shipping === 0 ? 'FREE' : '₹' + order.shipping}</td></tr>
      <tr style="border-top: 2px solid #0f172a; font-weight: bold; font-size: 16px;">
        <td>Grand Total:</td><td style="text-align: right; color: #b45309;">₹${order.grand_total}</td>
      </tr>
    </table>
  </div>
  <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 40px;">
    Creaftique Production Manifest — Verified Archival Printing Quality
  </p>
</body>
</html>`;
  }
}

module.exports = new DriveService();
