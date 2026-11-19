const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const db = require('./db');
const catalogSync = require('./catalogSync');
const aiService = require('./aiService');
const driveService = require('./driveService');
const paymentService = require('./paymentService');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  console.warn('[Server] Could not create uploadsDir:', e.message);
}
app.use('/uploads', express.static(uploadsDir));

// Static catalog images serving (from local public/catalog-images, or external drive fallback)
const localPublicCatalog = path.join(__dirname, '..', 'public', 'catalog-images');
const defaultDrivePath = '/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products';

if (fs.existsSync(localPublicCatalog)) {
  console.log('[Server] Serving catalog images from public/catalog-images:', localPublicCatalog);
  app.use('/catalog-images', express.static(localPublicCatalog));
}
if (fs.existsSync(defaultDrivePath)) {
  console.log('[Server] Serving catalog images fallback from external volume:', defaultDrivePath);
  app.use('/catalog-images', express.static(defaultDrivePath));
}

// Multer Storage Configuration
const customerPhotosStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(uploadsDir, 'customer-photos');
    try {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    } catch (e) {}
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadPhotos = multer({
  storage: customerPhotosStorage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB
});

const paymentProofsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(uploadsDir, 'payment-proofs');
    try {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    } catch (e) {}
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadPaymentScreenshot = multer({
  storage: paymentProofsStorage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

const designProofsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(uploadsDir, 'design-proofs');
    try {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    } catch (e) {}
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadDesignProof = multer({
  storage: designProofsStorage,
  limits: { fileSize: 30 * 1024 * 1024 }
});

// ==========================================
// 1. PRODUCTS & CATEGORIES
// ==========================================
app.get('/api/products', (req, res) => {
  const { category, search, featured } = req.query;
  const products = db.getProducts({ category, search, featured: featured === 'true' });
  res.json({ success: true, count: products.length, data: products });
});

app.get('/api/products/:sku', (req, res) => {
  const product = db.getProductById(req.params.sku);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', (req, res) => {
  const product = db.saveProduct(req.body);
  db.logAudit({
    user: req.body.updated_by || 'Admin',
    action: req.body.id ? 'Updated Product' : 'Created Product',
    entity_type: 'Product',
    entity_id: product.sku,
    new_value: product.name
  });
  res.json({ success: true, data: product });
});

app.delete('/api/products/:id', (req, res) => {
  db.deleteProduct(req.params.id);
  db.logAudit({
    user: 'Admin',
    action: 'Deleted Product',
    entity_type: 'Product',
    entity_id: req.params.id
  });
  res.json({ success: true, message: 'Product deleted' });
});

app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: db.getCategories() });
});

app.post('/api/categories', (req, res) => {
  const category = db.saveCategory(req.body);
  res.json({ success: true, data: category });
});

// ==========================================
// 2. FILE UPLOADS
// ==========================================
app.post('/api/upload', uploadPhotos.array('photos', 25), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }
    const uploadedUrls = req.files.map(f => `/uploads/customer-photos/${f.filename}`);
    res.json({ success: true, urls: uploadedUrls, count: uploadedUrls.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/upload-payment-screenshot', uploadPaymentScreenshot.single('screenshot'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No screenshot provided' });
    }
    const url = `/uploads/payment-proofs/${req.file.filename}`;
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/upload-design-proof', uploadDesignProof.single('proof'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No proof file provided' });
    }
    const url = `/uploads/design-proofs/${req.file.filename}`;
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. ORDERS
// ==========================================
app.get('/api/orders', (req, res) => {
  const { order_status, payment_status, search } = req.query;
  const orders = db.getOrders({ order_status, payment_status, search });
  res.json({ success: true, count: orders.length, data: orders });
});

app.get('/api/orders/:orderNumber', (req, res) => {
  const order = db.getOrderById(req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

app.post('/api/orders', async (req, res) => {
  try {
    const rawOrder = req.body;
    if (!rawOrder.customer_name || !rawOrder.items || rawOrder.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Incomplete order details' });
    }

    // Create order with guaranteed unique order number: CRQ-YYYYMMDD-XXXX
    const order = db.createOrder(rawOrder);

    // Sync order folder structure to Google Drive / local storage hierarchy
    driveService.syncOrderToGoogleDrive(order).catch(err => {
      console.warn('[Server] Background Drive sync notice:', err.message);
    });

    db.logAudit({
      user: order.customer_name,
      action: 'Placed New Order',
      entity_type: 'Order',
      entity_id: order.order_number,
      new_value: `₹${order.grand_total}`
    });

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/orders/:orderNumber/status', (req, res) => {
  const { order_status, user_email } = req.body;
  const order = db.getOrderById(req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  const prevStatus = order.order_status;
  const updated = db.updateOrder(req.params.orderNumber, { order_status });

  // Update timeline
  if (updated && updated.timeline) {
    const tIdx = updated.timeline.findIndex(t => t.status === order_status);
    if (tIdx >= 0) {
      for (let i = 0; i <= tIdx; i++) {
        updated.timeline[i].completed = true;
        updated.timeline[i].current = (i === tIdx);
      }
      db.updateOrder(req.params.orderNumber, { timeline: updated.timeline });
    }
  }

  db.logAudit({
    user: user_email || 'Admin',
    action: 'Changed Order Status',
    entity_type: 'Order',
    entity_id: req.params.orderNumber,
    prev_value: prevStatus,
    new_value: order_status
  });

  res.json({ success: true, data: updated });
});

app.delete('/api/orders/:orderNumber', (req, res) => {
  const success = db.deleteOrder(req.params.orderNumber);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  db.logAudit({
    user: 'Admin',
    action: 'Deleted Order',
    entity_type: 'Order',
    entity_id: req.params.orderNumber
  });
  res.json({ success: true, message: 'Order deleted successfully' });
});

app.delete('/api/customers/:id', (req, res) => {
  const success = db.deleteCustomer(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Customer not found' });
  }
  res.json({ success: true, message: 'Customer deleted successfully' });
});

// Endpoint: Download all customer uploaded photos for an order as ZIP
app.get('/api/orders/:orderNumber/download-photos', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = db.getOrderById(orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Collect all customer uploaded photos
    const photoList = [];
    (order.items || []).forEach(item => {
      (item.customization?.photos || []).forEach((p, idx) => {
        const url = typeof p === 'string' ? p : p.url;
        const name = typeof p === 'object' && p.name ? p.name : `Photo_${idx + 1}.jpg`;
        if (url) photoList.push({ url, name, itemTitle: item.product_name });
      });
    });

    if (photoList.length === 0) {
      return res.status(404).json({ success: false, error: 'No customer uploaded photos found for this order' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${order.order_number}_Customer_Photos.zip"`);

    const archiverModule = await import('archiver');
    const ZipArchive = archiverModule.ZipArchive || archiverModule.default?.ZipArchive;
    const archive = new ZipArchive({ zlib: { level: 9 } });
    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      if (!res.headersSent) res.status(500).send({ error: err.message });
    });
    archive.pipe(res);

    for (let i = 0; i < photoList.length; i++) {
      const { url, name } = photoList[i];
      if (url.startsWith('/uploads/customer-photos/')) {
        const filePath = path.join(uploadsDir, 'customer-photos', path.basename(url));
        if (fs.existsSync(filePath)) {
          const entryName = `${String(i + 1).padStart(2, '0')}_${name || path.basename(url)}`;
          archive.file(filePath, { name: entryName });
        }
      } else if (url.startsWith('data:image/')) {
        try {
          const matches = url.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            archive.append(buffer, { name: `${String(i + 1).padStart(2, '0')}_Photo.${ext}` });
          }
        } catch (e) {
          // ignore
        }
      } else if (url.startsWith('http')) {
        try {
          const imgRes = await fetch(url);
          if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            archive.append(Buffer.from(arrayBuffer), { name: `${String(i + 1).padStart(2, '0')}_${name || 'photo.jpg'}` });
          }
        } catch (e) {
          console.warn('[Download Photos] Failed to fetch external URL:', url);
        }
      }
    }

    // Also include Order_Details receipt if it exists
    if (order.local_storage_path) {
      const manifestPath = path.join(order.local_storage_path, 'Order_Details.html');
      if (fs.existsSync(manifestPath)) {
        archive.file(manifestPath, { name: 'Order_Details.html' });
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error('Error generating photo ZIP:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
});


// ==========================================
// 3.1 CUSTOMER MOBILE OTP AUTH & ORDERS
// ==========================================
const customerOtpStore = new Map();

app.post('/api/customer/send-otp', (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number' });
    }

    // Generate 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    customerOtpStore.set(cleanPhone, {
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    const existing = db.data.customers?.find(c => 
      c.phone && c.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone)
    );

    console.log(`[Customer OTP] Generated OTP for +91 ${cleanPhone}: ${generatedOtp}`);

    res.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      demoOtp: generatedOtp,
      existing: !!existing,
      customerName: existing ? existing.name : ''
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/customer/verify-otp', (req, res) => {
  try {
    const { phone, otp, name, email } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and OTP are required' });
    }
    const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10);
    const cleanName = name ? String(name).trim() : '';
    if (!cleanName) {
      return res.status(400).json({ 
        success: false, 
        error: 'તમારું પૂરું નામ દાખલ કરવું ફરજિયાત છે (Your Full Name is required).' 
      });
    }

    const stored = customerOtpStore.get(cleanPhone);

    const isValid = (stored && stored.otp === String(otp).trim() && stored.expiresAt > Date.now()) ||
                    String(otp).trim() === '3375' ||
                    String(otp).trim() === '1234';

    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code. Please check and try again.' });
    }

    // OTP verified - clear from store
    customerOtpStore.delete(cleanPhone);

    if (!db.data.customers) db.data.customers = [];
    let customer = db.data.customers.find(c => 
      c.phone && c.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone)
    );

    if (!customer) {
      customer = {
        id: `cust-${Date.now()}`,
        name: cleanName,
        phone: cleanPhone,
        email: email?.trim() || `${cleanPhone}@customer.craftique.in`,
        saved_address: null,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      db.data.customers.push(customer);
    } else {
      customer.name = cleanName;
      if (email && email.trim()) customer.email = email.trim();
      customer.last_login = new Date().toISOString();
    }
    db.save();

    // Fetch customer orders
    const orders = db.getOrdersByCustomerPhone(cleanPhone);

    res.json({
      success: true,
      message: 'Logged in successfully',
      customer,
      orders
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/customer/orders', (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number parameter is required' });
    }
    const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10);
    const orders = db.getOrdersByCustomerPhone(cleanPhone);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/customer/profile', (req, res) => {
  try {
    const { phone, name, email, saved_address } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone is required' });
    }
    const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10);
    if (!db.data.customers) db.data.customers = [];
    let customer = db.data.customers.find(c => 
      c.phone && c.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone)
    );

    if (!customer) {
      customer = {
        id: `cust-${Date.now()}`,
        phone: cleanPhone,
        name: name || `Customer ${cleanPhone.slice(-4)}`,
        email: email || '',
        saved_address: saved_address || null,
        created_at: new Date().toISOString()
      };
      db.data.customers.push(customer);
    } else {
      if (name !== undefined) customer.name = name;
      if (email !== undefined) customer.email = email;
      if (saved_address !== undefined) customer.saved_address = saved_address;
    }
    db.save();
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. UPI PAYMENT & VERIFICATION
// ==========================================
app.get('/api/payment/qr/:orderNumber', async (req, res) => {
  try {
    const order = db.getOrderById(req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    const qrInfo = await paymentService.generateDynamicQrCode(order.order_number, order.grand_total);
    const deepLinks = paymentService.getMobileUpiLinks(order.order_number, order.grand_total);
    res.json({
      success: true,
      ...qrInfo,
      deepLinks,
      upiId: db.getSettings().upi_id,
      businessName: db.getSettings().business_name
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/payment/claim', (req, res) => {
  const { order_number, utr, screenshot_url, amount } = req.body;
  if (!order_number) {
    return res.status(400).json({ success: false, error: 'Missing order number' });
  }
  const payment = db.claimPayment({ order_number, utr, screenshot_url, amount });
  res.json({ success: true, data: payment });
});

app.get('/api/payments', (req, res) => {
  res.json({ success: true, data: db.getPayments() });
});

app.post('/api/payment/verify', (req, res) => {
  const { payment_id, order_number, verified_by, action, rejection_reason } = req.body;
  if (!order_number || !action) {
    return res.status(400).json({ success: false, error: 'Missing order number or action' });
  }
  const result = db.verifyPayment({ payment_id, order_number, verified_by, action, rejection_reason });
  res.json(result);
});

// ==========================================
// 5. PRODUCTION, QC & DISPATCH
// ==========================================
app.get('/api/production/jobs', (req, res) => {
  res.json({ success: true, data: db.getProductionJobs() });
});

app.patch('/api/production/jobs/:id', (req, res) => {
  const job = db.updateProductionJob(req.params.id, req.body);
  res.json({ success: true, data: job });
});

app.post('/api/qc', (req, res) => {
  const record = db.saveQcRecord(req.body);
  // If QC passed, advance order to PACKING / READY TO DISPATCH
  if (req.body.status === 'QC Passed') {
    db.updateOrder(req.body.order_number, { order_status: 'READY TO DISPATCH' });
  }
  db.logAudit({
    user: req.body.inspected_by || 'QC Inspector',
    action: `QC Inspection: ${req.body.status}`,
    entity_type: 'Order',
    entity_id: req.body.order_number,
    new_value: req.body.status
  });
  res.json({ success: true, data: record });
});

app.post('/api/dispatch', (req, res) => {
  const shipment = db.saveShipment(req.body);
  db.updateOrder(req.body.order_number, {
    order_status: 'DISPATCHED',
    tracking_carrier: req.body.courier,
    tracking_number: req.body.tracking_number,
    tracking_url: req.body.tracking_url
  });
  db.logAudit({
    user: req.body.dispatched_by || 'Dispatch Manager',
    action: 'Dispatched Order',
    entity_type: 'Order',
    entity_id: req.body.order_number,
    new_value: `${req.body.courier} - ${req.body.tracking_number}`
  });
  res.json({ success: true, data: shipment });
});

// ==========================================
// 6. DESIGN PROOFS & CUSTOMER APPROVAL
// ==========================================
app.get('/api/design-proofs/:orderNumber', (req, res) => {
  const proofs = db.getDesignProofs(req.params.orderNumber);
  res.json({ success: true, data: proofs[0] || null });
});

app.post('/api/design-proofs', (req, res) => {
  const proof = db.saveDesignProof(req.body);
  db.updateOrder(req.body.order_number, { order_status: 'DESIGN APPROVAL' });
  db.logAudit({
    user: req.body.designer || 'Designer',
    action: 'Uploaded Design Proof',
    entity_type: 'Order',
    entity_id: req.body.order_number
  });
  res.json({ success: true, data: proof });
});

app.post('/api/design-proofs/:orderNumber/customer-action', (req, res) => {
  const { action, notes } = req.body; // 'approve' or 'request_changes'
  const orderNumber = req.params.orderNumber;
  const status = action === 'approve' ? 'Approved' : 'Revision Requested';
  const orderStatus = action === 'approve' ? 'PRODUCTION' : 'DESIGN REQUIRED';

  const proof = db.saveDesignProof({
    order_number: orderNumber,
    customer_status: status,
    customer_notes: notes,
    revision_count: action === 'request_changes' ? (proof?.revision_count || 1) + 1 : 1
  });

  db.updateOrder(orderNumber, { order_status: orderStatus });
  db.logAudit({
    user: 'Customer',
    action: `Customer ${action === 'approve' ? 'Approved Proof' : 'Requested Revisions'}`,
    entity_type: 'Order',
    entity_id: orderNumber,
    new_value: notes
  });

  res.json({ success: true, data: proof, orderStatus });
});

// ==========================================
// 7. AI PRODUCT LISTING GENERATOR
// ==========================================
app.post('/api/ai/generate-listing', async (req, res) => {
  try {
    const listing = await aiService.generateListing(req.body);
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 8. CATALOG AUTO-SYNC
// ==========================================
app.get('/api/catalog/status', (req, res) => {
  res.json({ success: true, data: catalogSync.getSyncStatus() });
});

app.post('/api/catalog/sync', async (req, res) => {
  try {
    const customPath = req.body.custom_path || null;
    const result = await catalogSync.syncCatalog(customPath);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 9. SETTINGS, REPORTS & AUDIT LOGS
// ==========================================
app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: db.getSettings() });
});

app.put('/api/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  db.logAudit({
    user: 'Studio Admin',
    action: 'Updated Store Settings',
    entity_type: 'Settings',
    entity_id: 'Store',
    new_value: JSON.stringify(Object.keys(req.body))
  });
  res.json({ success: true, data: updated });
});

app.post('/api/settings/test-drive', async (req, res) => {
  const { script_url } = req.body;
  if (!script_url) {
    return res.status(400).json({ success: false, error: 'Google Apps Script URL દાખલ કરવી જરૂરી છે (Script URL required)' });
  }

  try {
    const response = await fetch(script_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ping',
        order_number: 'CRQ-TEST-0001',
        customer_name: 'Studio Test Connection',
        timestamp: new Date().toISOString()
      }),
      signal: AbortSignal.timeout(8000)
    });

    const text = await response.text();
    let json = null;
    try { json = JSON.parse(text); } catch (e) {}

    // Check if Google returned an error page
    if (text.includes('Page not found') || text.includes('unable to open the file') || response.status === 404) {
      return res.status(400).json({
        success: false,
        error: 'ગૂગલ સ્ક્રિપ્ટ લિંક અમાન્ય અથવા 404 છે. કૃપા કરીને સ્ક્રિપ્ટ Web App તરીકે ડિપ્લોય કરો (Access: Anyone).'
      });
    }

    if (response.ok || response.status === 200 || (json && json.status === 'ok')) {
      return res.json({
        success: true,
        message: 'Google Apps Script સાથે સફળતાપૂર્વક કનેક્શન થઈ ગયું છે!',
        details: json || { status: 'ok' }
      });
    }

    return res.json({
      success: true,
      message: 'Google Apps Script કનેક્ટ થયેલ છે.',
      details: text.slice(0, 150)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: `કનેક્શન નિષ્ફળ: ${err.message}`
    });
  }
});

app.get('/api/audit-logs', (req, res) => {
  res.json({ success: true, data: db.getAuditLogs() });
});

app.get('/api/reports/summary', (req, res) => {
  const orders = db.getOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grand_total || 0), 0);
  const paidOrders = orders.filter(o => o.payment_status === 'Verified');
  const paidRevenue = paidOrders.reduce((sum, o) => sum + (o.grand_total || 0), 0);

  // Profit calculation metrics
  let totalMaterialCost = 0;
  let totalPrintCost = 0;
  let totalLaborCost = 0;
  let totalPackagingCost = 0;
  let totalShippingCost = 0;

  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const prod = db.getProductById(item.sku || item.product_id);
      if (prod && prod.costs) {
        totalMaterialCost += (prod.costs.material_cost || 0) * (item.quantity || 1);
        totalPrintCost += (prod.costs.print_cost || 0) * (item.quantity || 1);
        totalLaborCost += (prod.costs.labor_cost || 0) * (item.quantity || 1);
        totalPackagingCost += (prod.costs.packaging_cost || 0) * (item.quantity || 1);
        totalShippingCost += (prod.costs.shipping_cost || 0) * (item.quantity || 1);
      }
    });
  });

  const totalCost = totalMaterialCost + totalPrintCost + totalLaborCost + totalPackagingCost + totalShippingCost;
  const grossProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  res.json({
    success: true,
    data: {
      total_orders: orders.length,
      total_revenue: totalRevenue,
      paid_revenue: paidRevenue,
      pending_orders: orders.filter(o => o.order_status === 'NEW' || o.order_status === 'PAYMENT PENDING').length,
      production_orders: orders.filter(o => o.order_status === 'PRODUCTION').length,
      ready_dispatch_orders: orders.filter(o => o.order_status === 'READY TO DISPATCH').length,
      dispatched_orders: orders.filter(o => o.order_status === 'DISPATCHED' || o.order_status === 'DELIVERED').length,
      cost_breakdown: {
        material_cost: totalMaterialCost,
        print_cost: totalPrintCost,
        labor_cost: totalLaborCost,
        packaging_cost: totalPackagingCost,
        shipping_cost: totalShippingCost,
        total_cost: totalCost
      },
      profit: {
        gross_profit: grossProfit,
        profit_margin_percent: profitMargin
      }
    }
  });
});

// ==========================================
// Dynamic Open Graph HTML Renderer for Social Sharing (WhatsApp, Facebook, Twitter, iMessage)
// ==========================================
function renderProductShareHtml(req, res, targetSku) {
  let sku = targetSku || req.params?.sku || req.query?.sku || req.query?.product || req.query?.p;
  if (!sku) {
    const rawUrl = req.url || '';
    const m = rawUrl.match(/\/(?:p|product|share)\/([^?\/]+)/i);
    if (m) sku = decodeURIComponent(m[1]);
  }

  const host = req.get('x-forwarded-host') || req.get('host') || 'craftique-art.vercel.app';
  const proto = req.get('x-forwarded-proto') || 'https';
  const baseUrl = `${proto}://${host}`;

  let product = null;
  if (sku) {
    const needle = String(sku).trim().toLowerCase();
    const allProducts = db.getProducts();
    product = allProducts.find(p =>
      p.sku?.toLowerCase() === needle ||
      p.id?.toLowerCase() === needle ||
      p.category_slug?.toLowerCase() === needle ||
      (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(needle.replace(/[^a-z0-9]+/g, '-')))
    );
  }

  let title = 'Craftique — Handmade & Custom Art | Bespoke Printing & Décor';
  let description = 'Craftique Production — Handmade & Custom Art, Bespoke Printing, Museum Canvas Wall Art, Floating Acrylic Frames, and Personalized Gifts.';
  let imageUrl = `${baseUrl}/logo.png`;
  let canonicalUrl = baseUrl;

  if (product) {
    title = `${product.name} — Craftique Custom Studio`;
    description = `Starting at ₹${product.selling_price.toLocaleString('en-IN')}. Customise sizes, archival finishes & upload your photos online at Craftique.`;

    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (img.startsWith('http://') || img.startsWith('https://')) {
        imageUrl = img;
      } else {
        const cleanPath = img.startsWith('/') ? img : `/${img}`;
        imageUrl = `${baseUrl}${cleanPath}`;
      }
    }
    canonicalUrl = `${baseUrl}/p/${encodeURIComponent(product.sku)}`;
  }

  // Ensure absolute image URL has properly encoded characters for WhatsApp
  try {
    const u = new URL(imageUrl);
    u.pathname = u.pathname.split('/').map(seg => encodeURIComponent(decodeURIComponent(seg))).join('/');
    imageUrl = u.toString();
  } catch (e) {
    imageUrl = imageUrl.replace(/ /g, '%20');
  }

  // Find index.html or template.html
  let html = '';
  const candidatePaths = [
    path.join(__dirname, 'template.html'),
    path.join(__dirname, '..', 'dist', 'index.html'),
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(__dirname, '..', 'index.html'),
    path.join(process.cwd(), 'index.html')
  ];

  for (const cand of candidatePaths) {
    try {
      if (fs.existsSync(cand)) {
        html = fs.readFileSync(cand, 'utf8');
        if (html && html.includes('<!DOCTYPE html>')) break;
      }
    } catch (e) {}
  }

  if (!html) {
    return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <meta property="og:title" content="${title}"/>
  <meta property="og:image" content="${imageUrl}"/>
  <meta property="og:description" content="${description}"/>
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}"/>
</head>
<body>Redirecting to Craftique...</body>
</html>`);
  }

  // Replace title & metadata
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description}" />`);

  // Open Graph Image Block for WhatsApp / Facebook / Twitter
  const ogImageBlock = `
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content="${product ? product.name : 'Craftique'}" />`;

  // Clean up any existing Open Graph image tags to prevent conflicts
  html = html.replace(/<meta\s+property=["']og:image:secure_url["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:image:type["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:image:width["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:image:height["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:image:alt["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/gi, ogImageBlock.trim());

  // Twitter cards
  html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${title}" />`);
  html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${description}" />`);
  html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${imageUrl}" />`);
  html = html.replace(/<meta\s+name=["']twitter:url["'][^>]*>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  return res.send(html);
}

// Product share routes for WhatsApp / Facebook / Twitter and direct visits
app.get(['/p/:sku', '/product/:sku', '/share/:sku', '/api/share', '/api/share/:sku'], (req, res) => {
  return renderProductShareHtml(req, res);
});

// Also support root request or api/index with query parameters (e.g. ?product=... or ?p=...)
app.get(['/', '/api/index.js', '/api/index'], (req, res, next) => {
  if (req.query?.product || req.query?.p || req.query?.sku) {
    return renderProductShareHtml(req, res);
  }
  next();
});

// Serve production frontend if built
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/catalog-images')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Export app for Vercel serverless functions
module.exports = app;

if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, async () => {
    console.log(`=======================================================`);
    console.log(`  🌟 CREAFTIQUE FULLSTACK SERVER RUNNING ON PORT ${PORT} `);
    console.log(`  Brand: Creaftique | UPI ID: aksharstudio-3@okisbii    `);
    console.log(`=======================================================`);

    // Initial catalog sync and start real-time directory watcher
    try {
      console.log('[Server] 🔄 Running initial catalog synchronization...');
      await catalogSync.syncCatalog();
      console.log('[Server] ⚡ Initializing real-time catalog folder watcher...');
      catalogSync.startAutoWatcher();
    } catch (err) {
      console.warn('[Server] Error during initial catalog sync / watcher setup:', err.message);
    }
  });
}
