# Creaftique — Customized Products & Printing Platform
> *Create. Customize. Print. Cherish.*

A modern, production-ready, responsive fullstack web application for personalized products, commercial printing, museum-grade canvas wall art, bespoke invitations, and artisanal décor.

**Live Production URL:** [https://craftique-art.vercel.app](https://craftique-art.vercel.app)  
**GitHub Repository:** [https://github.com/Akshar3375/Craftique](https://github.com/Akshar3375/Craftique)

---

## 🚀 Key Features

### 1. Brand & Aesthetic
* **Modern Indian Craft + Contemporary Design:** Warm terracotta/amber accents, clean ivory/paper backgrounds, elegant Playfair Display serif typography, and tactile rounded surfaces.
* **Mobile-First Responsive Interface:** Optimized for smooth customer shopping on mobile and comprehensive workstation management on desktop/tablet.

### 2. Automatic Catalog Sync & Agent
* **Local Folder Integration:** Directly scans and monitors the product folder at `/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products` (with fallback to local `./catalog_source`).
* **Intelligent Excel Column Mapper:** Automatically reads `product.xlsx` or `.csv` files inside product directories and flexibly normalizes variable column names (`Product Name`, `Title`, `MRP`, `Size`, `Material`, etc.).
* **Desktop Sync Agent CLI:**
  ```bash
  # Run one-time scan and sync:
  npm run sync

  # Run continuous live folder watcher:
  npm run sync:watch
  ```
* **Admin Catalog Sync Panel:** Live connection status, last sync timestamp, products found, and one-click manual synchronization.

### 3. Product Customization Engine & Live Price Calculator
* **Sizes:** Standard dimensions (`4×6`, `6×8`, `8×10`, `12×18`, `18×24`, `24×36`) + Custom Size (Width × Height with unit selector: mm / cm / inch / ft).
* **Materials:** Archival Canvas (380 GSM), Glossy Fine Art Paper, Optical Cast Acrylic, Birch Wood, MDF, Sunboard, and Poly-Silk.
* **Finishes:** Matte Anti-Glare, Glossy Lustre, UV Protective Varnish, Emboss, and Foil.
* **Framing Options:** Gallery Wrap, Sleek Matte Black Floating Frame, Teak Wood Floating Frame, Opulent Golden Luxe Frame, and Modern White Frame.
* **Dynamic Volume Pricing Tiers:** Instant tiered discounts (1-9, 10-49, 50-99, 100+).
* **Live Dynamic Price Breakdown:** Real-time calculation:
  $$\text{Final Price} = \text{Base Price} + \text{Size Adj.} + \text{Material Adj.} + \text{Finish Adj.} + \text{Customization} + \text{Express} - \text{Discount} + \text{Tax (GST 18\%)} + \text{Shipping}$$

### 4. Customer Photo Upload & Quality Inspector
* **Supported Formats:** JPG, JPEG, PNG, WEBP, HEIC, PDF.
* **Real-time Client-side Image Analysis:** Analyzes image resolution (width × height px), aspect ratio, orientation, and print-suitability warnings:
  * `✓ Good quality (Print Ready)`
  * `⚠ Low resolution (Medium Print)`
  * `⚠ Image may appear blurry when printed`
* **Mandatory File Enforcement:** Prevents checkout if required photos are missing.

### 5. Interactive Studio Simulation (Live Visual Preview)
* Renders chosen frame/canvas with the customer's uploaded photo(s) placed inside.
* Dynamic custom text inscription overlay with serif typography.
* Toggle Front Preview and Back Preview (showing wooden subframe, hanging wire, and studio authenticity seal).
* Zoom slider and orientation rotation.

### 6. Dynamic UPI QR Code & Payment Verification Workflow
* **Configuration:**
  * `UPI_ID`: `aksharstudio-3@okisbii`
  * `BUSINESS_NAME`: `Craftique`
* **Dynamic UPI URI & Real-time QR Code:**
  ```
  upi://pay?pa=aksharstudio-3@okisbii&pn=Craftique&am=1230&cu=INR&tn=CRQ-20260929-0001
  ```
* **One-Click Mobile Deep Links:** Direct triggers for Google Pay, PhonePe, and Paytm.
* **Payment States:** `Pending` → `Customer Claimed Paid` → `Verification Required` → `Verified`.
* **Verification Panel:** Admin inspects UTR number, reviews uploaded payment screenshots in full lightbox zoom, and verifies or rejects with audit logs.

### 7. Google Drive Storage & Apps Script Integration
* **Hierarchical Organization:**
  ```
  Creaftique Orders/
  └── YYYY/
      └── MM/
          └── DD/
              └── CRQ-YYYYMMDD-XXXX/
                  ├── Customer/
                  ├── Product/
                  ├── Uploaded Photos/
                  ├── Design/
                  └── Order Details.html (Printable invoice & production manifest)
  ```
* Connects to Google Apps Script Web App URL (`https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec`).
* Saves Google Drive folder IDs in database without exposing private Drive links publicly.

### 8. Full 10-Stage Studio Workflow & Customer Portal
1. `NEW` (Order Created with unique ID `CRQ-YYYYMMDD-XXXX`)
2. `PAYMENT PENDING`
3. `PAYMENT VERIFIED`
4. `DESIGN REQUIRED` / `DESIGN APPROVAL` (Designer uploads proof; customer approves or requests revisions)
5. `PRODUCTION` (Work order queue, substrate specs, photo bundle downloads)
6. `QUALITY CHECK` (Mandatory 8-point inspection checklist)
7. `PACKING`
8. `READY TO DISPATCH`
9. `DISPATCHED` (Courier selection: Delhivery, BlueDart, DTDC, Shiprocket, tracking number, shipping label)
10. `DELIVERED` / `COMPLETED`

### 9. AI Product Listing Generator
* Analyzes product titles, substrate materials, dimensions, and categories.
* Generates: SEO-friendly titles, short descriptions, professional e-commerce storytelling descriptions, 5 bullet features, structured specifications, search tags, URL slugs, and image alt text.
* Review workflow: Generate, Regenerate, Edit, Approve, and Save (with overwrite protection).

### 10. Reports, Profit Analytics & Role-Based Permissions
* **Profit Calculations:**
  $$\text{Gross Profit} = \text{Selling Revenue} - (\text{Material} + \text{Print Ink} + \text{Labor} + \text{Packaging} + \text{Shipping})$$
* **One-Click CSV Export:** Generates financial statements.
* **Role-Based Access:** Super Admin, Admin, Production, Designer, QC, Dispatch, and Customer with quick evaluator switcher.

---

## 🛠️ Running the Application

### 1. Start Fullstack Server
```bash
cd /Users/akshar/.gemini/antigravity/scratch/creaftique
npm run dev
```
* **Frontend:** Accessible at `http://localhost:5173` (Vite dev) or `http://localhost:5001` (Unified Express server).
* **Backend API:** Running on `http://localhost:5001/api`.

### 2. Run Catalog Sync Agent
```bash
# Scan and synchronize products from external volume:
npm run sync

# Keep watching directory continuously for file changes:
npm run sync:watch
```

---

## 🔐 Configuration
* **UPI ID:** `aksharstudio-3@okisbii`
* **Business Name:** `Craftique`
* **WhatsApp Number:** `916354871446`
* **Admin Emails:** `admin@phototoolsai.com`, `hitesh@phototoolsai.com`
* **Default Catalog Source:** `/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products`
