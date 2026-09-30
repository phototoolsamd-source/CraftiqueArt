const fs = require('fs');
const path = require('path');

const BUNDLED_DB_FILE = path.join(__dirname, 'data', 'creaftique.json');
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'creaftique.json')
  : BUNDLED_DB_FILE;

// Default initial state
const INITIAL_SETTINGS = {
  business_name: "Craftique",
  brand_title: "Creaftique",
  tagline: "Create. Customize. Print. Cherish.",
  upi_id: "aksharstudio-3@okisbii",
  whatsapp_number: "916354871446",
  script_url: "https://script.google.com/macros/s/AKfycbzRwtwNObuYTQXaZA9sOQW8mfArrfosgT2TqoK-s5w8FtYNYwDl6ZaeauhRD_Nz2cF_/exec",
  admin_emails: ["admin@craftique.in"],
  gst_rate: 18,
  shipping_fee: 80,
  free_shipping_threshold: 1500,
  order_prefix: "CRQ",
  catalog_source_path: "/Volumes/STUDIO/AKSHAR/AKSHAR 1TB/AKSHAR SALES/|| Craftique Products",
  sync_status: {
    connected: true,
    last_sync: new Date().toISOString(),
    products_found: 248,
    new_products: 7,
    updated_products: 15,
    removed_products: 2,
    images_count: 1436
  }
};

const INITIAL_CATEGORIES = [
  {
    id: "decor",
    name: "Décor",
    slug: "decor",
    description: "Handcrafted wall art, personalized frames & artisanal home accents.",
    icon: "Frame",
    subcategories: [
      { id: "paintings", name: "Paintings", slug: "paintings" },
      { id: "wall-art", name: "Wall Art", slug: "wall-art" },
      { id: "hanging", name: "Hanging", slug: "hanging" },
      { id: "posters", name: "Posters", slug: "posters" },
      { id: "photo-frames", name: "Photo Frames", slug: "photo-frames" },
      { id: "customized-frames", name: "Customized Frames", slug: "customized-frames" },
      { id: "decorative-products", name: "Decorative Products", slug: "decorative-products" }
    ]
  },
  {
    id: "printing",
    name: "Printing Services",
    slug: "printing",
    description: "High-definition archival commercial & personal printing solutions.",
    icon: "Printer",
    subcategories: [
      { id: "photo-albums", name: "Photo Albums", slug: "photo-albums" },
      { id: "magazines", name: "Magazines", slug: "magazines" },
      { id: "photo-collage", name: "Photo Collage", slug: "photo-collage" },
      { id: "cards", name: "Cards", slug: "cards" },
      { id: "invitations", name: "Invitations", slug: "invitations" },
      { id: "stickers", name: "Stickers", slug: "stickers" },
      { id: "tags", name: "Tags", slug: "tags" },
      { id: "packaging", name: "Packaging", slug: "packaging" },
      { id: "brochures", name: "Brochures", slug: "brochures" },
      { id: "flyers", name: "Flyers", slug: "flyers" },
      { id: "business-cards", name: "Business Cards", slug: "business-cards" },
      { id: "certificates", name: "Certificates", slug: "certificates" },
      { id: "photo-prints", name: "Photo Prints", slug: "photo-prints" }
    ]
  },
  {
    id: "customized-products",
    name: "Customized Products",
    slug: "customized-products",
    description: "Bespoke gifts, photo magnets, customized backdrops and party supplies.",
    icon: "Sparkles",
    subcategories: [
      { id: "photo-magnets", name: "Photo Magnets", slug: "photo-magnets" },
      { id: "insta-photo-cards", name: "Insta Photo Cards", slug: "insta-photo-cards" },
      { id: "party-supplies", name: "Party Supplies & Cutouts", slug: "party-supplies" },
      { id: "custom-labels", name: "Custom Book & Bottle Labels", slug: "custom-labels" }
    ]
  }
];

const INITIAL_PRODUCTS = [
  {
    id: "prod-001",
    sku: "WA001",
    name: "Customized Canvas Wall Art",
    category: "Décor",
    category_slug: "decor",
    subcategory: "Wall Art",
    subcategory_slug: "wall-art",
    short_description: "Museum-grade stretched canvas with vivid pigment inks and durable pine wooden subframe.",
    full_description: "Transform your most treasured memories or bespoke artistic themes into breathtaking museum-grade wall art. Printed on heavyweight 380 GSM textured poly-cotton canvas using 12-color archival giclée inks. Finished with an invisible anti-UV coating that protects against dust, moisture, and fading for over 50 years.",
    material: "Canvas",
    default_size: "18 × 24 inch",
    width: "18",
    height: "24",
    thickness: "1.25 inch",
    weight: "1.4 kg",
    base_price: 1250,
    selling_price: 1450,
    mrp: 2499,
    discount: 42,
    tax: 18,
    stock: 99,
    production_time: "2-3 business days",
    tags: ["Canvas", "Wall Décor", "Personalized Art", "Giclée", "Living Room"],
    keywords: ["custom canvas print", "personalized wall art", "framed photo canvas", "creaftique canvas"],
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=900&auto=format&fit=crop&q=80"
    ],
    customization_available: true,
    requires_photo: true,
    required_photos_count: 1,
    custom_text_allowed: true,
    active: true,
    featured: true,
    new_product: false,
    best_seller: true,
    costs: {
      material_cost: 320,
      print_cost: 210,
      labor_cost: 150,
      packaging_cost: 80,
      shipping_cost: 90
    },
    custom_options: {
      sizes: [
        { name: "8 × 10 inch", price_adj: -400, area_sqin: 80 },
        { name: "12 × 18 inch", price_adj: -150, area_sqin: 216 },
        { name: "18 × 24 inch", price_adj: 0, area_sqin: 432, default: true },
        { name: "24 × 36 inch", price_adj: 850, area_sqin: 864 },
        { name: "Custom Size", price_adj: 0, is_custom: true }
      ],
      materials: [
        { name: "Premium Matte Canvas (380 GSM)", price_adj: 0, default: true },
        { name: "Glossy Archival Canvas (400 GSM)", price_adj: 150 },
        { name: "Textured Linen Canvas", price_adj: 250 },
        { name: "Synthetic Poly-Silk Canvas", price_adj: -100 }
      ],
      finishes: [
        { name: "Matte Anti-Glare Coating", price_adj: 0, default: true },
        { name: "Glossy Lustre Seal", price_adj: 80 },
        { name: "UV Protective Textured Varnish", price_adj: 180 }
      ],
      frames: [
        { name: "Gallery Wrap (Frameless Stretched)", price_adj: 0, default: true },
        { name: "Sleek Matte Black Floating Frame", price_adj: 450 },
        { name: "Natural Teak Wood Floating Frame", price_adj: 550 },
        { name: "Opulent Golden Luxe Frame", price_adj: 650 },
        { name: "Modern White Float Frame", price_adj: 450 }
      ],
      quantity_tiers: [
        { min: 1, max: 9, discount_percent: 0 },
        { min: 10, max: 49, discount_percent: 15 },
        { min: 50, max: 99, discount_percent: 25 },
        { min: 100, max: 9999, discount_percent: 40 }
      ],
      extras: [
        { id: "express", name: "Express 24h Production", price_adj: 299 },
        { id: "gift_wrap", name: "Premium Gift Packaging & Calligraphy Card", price_adj: 149 },
        { id: "design_review", name: "Professional Designer Pre-Print Touchup", price_adj: 199 }
      ]
    },
    seo: {
      title: "Buy Custom Canvas Wall Art Online | Creaftique",
      meta_description: "Order handcrafted custom canvas wall art with vibrant archival giclée prints. Gallery stretched with custom size options and dynamic pricing.",
      keywords: "custom canvas, wall art india, personalized photo frame, giclee print",
      slug: "customized-canvas-wall-art"
    }
  },
  {
    id: "prod-002",
    sku: "PA002",
    name: "Heritage Photobook Album",
    category: "Printing",
    category_slug: "printing",
    subcategory: "Photo Albums",
    subcategory_slug: "photo-albums",
    short_description: "Hardcover lay-flat coffee table wedding and travel album with pearl lustre photo pages.",
    full_description: "Cherish your life's greatest milestones in timeless elegance. The Heritage Photobook features seamless 180-degree lay-flat panoramic spreads, thick archival card-stock pages, and a tailored linen or vegan leather hardcover with optional embossed gold foiling.",
    material: "Premium Paper",
    default_size: "12 × 8 inch",
    width: "12",
    height: "8",
    thickness: "1 inch",
    weight: "1.8 kg",
    base_price: 2400,
    selling_price: 2850,
    mrp: 4500,
    discount: 37,
    tax: 18,
    stock: 50,
    production_time: "4-5 business days",
    tags: ["Photo Album", "Wedding", "Baby Album", "Layflat", "Photobook"],
    keywords: ["wedding photo album", "layflat photobook", "custom photo album online", "creaftique album"],
    images: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=900&auto=format&fit=crop&q=80"
    ],
    customization_available: true,
    requires_photo: true,
    required_photos_count: 24,
    custom_text_allowed: true,
    active: true,
    featured: true,
    new_product: true,
    best_seller: true,
    costs: {
      material_cost: 780,
      print_cost: 540,
      labor_cost: 350,
      packaging_cost: 120,
      shipping_cost: 140
    },
    custom_options: {
      sizes: [
        { name: "8 × 6 inch (Mini Landscape)", price_adj: -600, pages: 20 },
        { name: "10 × 10 inch (Square Classic)", price_adj: -200, pages: 30 },
        { name: "12 × 8 inch (Landscape Grand)", price_adj: 0, pages: 30, default: true },
        { name: "18 × 12 inch (Royal Wedding Edition)", price_adj: 1200, pages: 40 }
      ],
      materials: [
        { name: "Lustre Fuji Crystal Pearl (260 GSM)", price_adj: 0, default: true },
        { name: "Silk Touch Archival Paper (300 GSM)", price_adj: 300 },
        { name: "Metallic High Gloss Fine Art", price_adj: 500 }
      ],
      finishes: [
        { name: "Hardcover Textured Linen", price_adj: 0, default: true },
        { name: "Vegan Leather with Gold Foil Embossing", price_adj: 350 },
        { name: "Acrylic Window Photo Cover", price_adj: 550 }
      ],
      frames: [],
      quantity_tiers: [
        { min: 1, max: 2, discount_percent: 0 },
        { min: 3, max: 9, discount_percent: 10 },
        { min: 10, max: 49, discount_percent: 20 },
        { min: 50, max: 999, discount_percent: 35 }
      ],
      extras: [
        { id: "express", name: "Express 48h Binding & Dispatch", price_adj: 499 },
        { id: "box", name: "Handmade Velvet Keepsake Box", price_adj: 399 },
        { id: "pro_design", name: "Professional Album Curation & Layout", price_adj: 450 }
      ]
    },
    seo: {
      title: "Custom Wedding Photobook & Photo Albums | Creaftique",
      meta_description: "Order layflat handcrafted wedding albums and memory photobooks. Archival grade photo printing with custom foiling.",
      keywords: "photobook, wedding album, layflat photo book, personalized photo album",
      slug: "heritage-photobook-album"
    }
  },
  {
    id: "prod-003",
    sku: "IC003",
    name: "Luxury Foil Wedding Invitation Suite",
    category: "Printing",
    category_slug: "printing",
    subcategory: "Invitations",
    subcategory_slug: "invitations",
    short_description: "Custom metallic foil stamped cards on 450 GSM handmade cotton rag stock with wax seal.",
    full_description: "Make an unforgettable announcement with our royal wedding and engagement suites. Featuring intricate rose gold or champage gold foil stamping on artisan cotton card stock with deckled or smooth edges, paired with personalized butter-paper inserts and customized wax seals.",
    material: "Premium Paper",
    default_size: "5 × 7 inch",
    width: "5",
    height: "7",
    thickness: "0.8 mm",
    weight: "0.04 kg",
    base_price: 65,
    selling_price: 75,
    mrp: 120,
    discount: 37,
    tax: 18,
    stock: 5000,
    production_time: "5-7 business days",
    tags: ["Invitations", "Wedding Cards", "Gold Foil", "Luxury Stationery", "Custom Cards"],
    keywords: ["foil wedding invitations", "luxury wedding card printing", "custom invite card", "creaftique invitation"],
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=900&auto=format&fit=crop&q=80"
    ],
    customization_available: true,
    requires_photo: false,
    custom_text_allowed: true,
    active: true,
    featured: true,
    new_product: false,
    best_seller: true,
    costs: {
      material_cost: 18,
      print_cost: 14,
      labor_cost: 10,
      packaging_cost: 5,
      shipping_cost: 4
    },
    custom_options: {
      sizes: [
        { name: "5 × 7 inch (Standard Suite)", price_adj: 0, default: true },
        { name: "6 × 8 inch (Grand Royal)", price_adj: 25 },
        { name: "4 × 6 inch (Save The Date)", price_adj: -15 }
      ],
      materials: [
        { name: "Handmade Cotton Rag 450 GSM", price_adj: 0, default: true },
        { name: "Pearl Metallic Shimmer 350 GSM", price_adj: 10 },
        { name: "Translucent Vellum Overlay", price_adj: 15 }
      ],
      finishes: [
        { name: "Champagne Gold Hot Foil", price_adj: 0, default: true },
        { name: "Rose Gold Lustre Foil", price_adj: 5 },
        { name: "Embossed Blind Letterpress", price_adj: 10 }
      ],
      frames: [],
      quantity_tiers: [
        { min: 25, max: 99, discount_percent: 0 },
        { min: 100, max: 249, discount_percent: 15 },
        { min: 250, max: 499, discount_percent: 25 },
        { min: 500, max: 5000, discount_percent: 35 }
      ],
      extras: [
        { id: "wax_seal", name: "Custom Monogram Wax Seal & Envelope Liner", price_adj: 20 },
        { id: "calligraphy", name: "Individual Guest Address Calligraphy", price_adj: 15 }
      ]
    },
    seo: {
      title: "Custom Foil Wedding Invitations | Creaftique",
      meta_description: "Order bespoke foil stamped wedding invitations and stationery suites. Luxury cotton rag paper with wax seals.",
      keywords: "wedding invitation cards, foil stamping cards, custom invitations online",
      slug: "luxury-foil-wedding-invitations"
    }
  },
  {
    id: "prod-004",
    sku: "AF004",
    name: "Minimalist Floating Acrylic Photo Frame",
    category: "Décor",
    category_slug: "decor",
    subcategory: "Photo Frames",
    subcategory_slug: "photo-frames",
    short_description: "High-clarity cast acrylic with polished bevel edges and solid brass standoff wall hardware.",
    full_description: "Bring a sleek contemporary gallery feel into your home or office. Two 4mm sheets of optical grade virgin cast acrylic suspend your custom photographic print in mid-air. Secured with solid architectural brass standoffs in brushed gold, matte black, or chrome.",
    material: "Acrylic",
    default_size: "12 × 18 inch",
    width: "12",
    height: "18",
    thickness: "8 mm total",
    weight: "1.9 kg",
    base_price: 1100,
    selling_price: 1350,
    mrp: 2199,
    discount: 38,
    tax: 18,
    stock: 80,
    production_time: "2-3 business days",
    tags: ["Acrylic Frame", "Floating Frame", "Modern Décor", "Photo Frame"],
    keywords: ["acrylic photo frame", "floating picture frame", "standoff frame", "creaftique acrylic"],
    images: [
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&auto=format&fit=crop&q=80"
    ],
    customization_available: true,
    requires_photo: true,
    required_photos_count: 1,
    custom_text_allowed: true,
    active: true,
    featured: true,
    new_product: true,
    best_seller: false,
    costs: {
      material_cost: 390,
      print_cost: 160,
      labor_cost: 140,
      packaging_cost: 90,
      shipping_cost: 110
    },
    custom_options: {
      sizes: [
        { name: "8 × 10 inch", price_adj: -350 },
        { name: "12 × 18 inch", price_adj: 0, default: true },
        { name: "18 × 24 inch", price_adj: 650 },
        { name: "Custom Size", price_adj: 0, is_custom: true }
      ],
      materials: [
        { name: "Optical Clear Cast Acrylic (4mm + 4mm)", price_adj: 0, default: true },
        { name: "Anti-Reflective Museum Acrylic", price_adj: 300 }
      ],
      finishes: [
        { name: "Diamond Polished Bevel Edge", price_adj: 0, default: true },
        { name: "Frosted Edge Perimeter", price_adj: 100 }
      ],
      frames: [
        { name: "Brushed Brass Standoffs", price_adj: 0, default: true },
        { name: "Matte Black Standoffs", price_adj: 50 },
        { name: "Mirror Chrome Standoffs", price_adj: 50 }
      ],
      quantity_tiers: [
        { min: 1, max: 4, discount_percent: 0 },
        { min: 5, max: 19, discount_percent: 12 },
        { min: 20, max: 999, discount_percent: 25 }
      ],
      extras: [
        { id: "mounting", name: "Heavy-duty Wall Anchor Kit with Bubble Level", price_adj: 80 }
      ]
    },
    seo: {
      title: "Custom Floating Acrylic Photo Frames | Creaftique",
      meta_description: "Shop high-clarity cast acrylic frames with architectural brass standoffs. Customizable with your own photos.",
      keywords: "acrylic frame, floating frame, modern picture frame",
      slug: "minimalist-floating-acrylic-photo-frame"
    }
  },
  {
    id: "prod-005",
    sku: "ST005",
    name: "Custom Die-Cut Vinyl Stickers & Labels",
    category: "Printing",
    category_slug: "printing",
    subcategory: "Stickers",
    subcategory_slug: "stickers",
    short_description: "Waterproof, scratch-resistant precision contour-cut vinyl stickers for branding or gifting.",
    full_description: "High performance polymeric vinyl stickers engineered for laptops, tumblers, product packaging, and cars. Waterproof, scratch-resistant, and UV-resistant for outdoor longevity. Precision kiss-cut or die-cut to any custom shape with zero minimum quantity hurdles.",
    material: "Vinyl",
    default_size: "2 × 2 inch",
    width: "2",
    height: "2",
    thickness: "100 micron",
    weight: "0.01 kg",
    base_price: 180,
    selling_price: 220,
    mrp: 350,
    discount: 37,
    tax: 18,
    stock: 9999,
    production_time: "1-2 business days",
    tags: ["Stickers", "Vinyl Decals", "Packaging", "Waterproof", "Branding"],
    keywords: ["custom stickers", "die cut vinyl stickers", "waterproof labels", "creaftique stickers"],
    images: [
      "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=900&auto=format&fit=crop&q=80"
    ],
    customization_available: true,
    requires_photo: true,
    required_photos_count: 1,
    custom_text_allowed: true,
    active: true,
    featured: false,
    new_product: true,
    best_seller: true,
    costs: {
      material_cost: 35,
      print_cost: 25,
      labor_cost: 20,
      packaging_cost: 15,
      shipping_cost: 30
    },
    custom_options: {
      sizes: [
        { name: "2 × 2 inch (Pack of 50)", price_adj: 0, default: true },
        { name: "3 × 3 inch (Pack of 50)", price_adj: 120 },
        { name: "4 × 4 inch (Pack of 50)", price_adj: 260 }
      ],
      materials: [
        { name: "Glossy Waterproof Vinyl", price_adj: 0, default: true },
        { name: "Matte Velvet Touch Vinyl", price_adj: 50 },
        { name: "Holographic Rainbow Foil Vinyl", price_adj: 180 },
        { name: "Transparent Clear Vinyl", price_adj: 80 }
      ],
      finishes: [
        { name: "UV Protective Over-laminate", price_adj: 0, default: true },
        { name: "Heavy Duty 3M Industrial Grip", price_adj: 90 }
      ],
      frames: [],
      quantity_tiers: [
        { min: 1, max: 4, discount_percent: 0 },
        { min: 5, max: 19, discount_percent: 18 },
        { min: 20, max: 99, discount_percent: 32 },
        { min: 100, max: 9999, discount_percent: 50 }
      ],
      extras: [
        { id: "sample", name: "Pre-production Sample Proof Photo", price_adj: 99 }
      ]
    },
    seo: {
      title: "Custom Die Cut Vinyl Stickers Online | Creaftique",
      meta_description: "Order personalized waterproof vinyl stickers and product packaging labels. Holographic, matte, and glossy finishes with instant customizer.",
      keywords: "custom stickers india, vinyl stickers, personalized labels, brand stickers",
      slug: "custom-die-cut-vinyl-stickers"
    }
  },
  {
    id: "prod-006",
    sku: "PM006",
    name: "Vintage Polaroid Wooden Photo Magnets",
    category: "Customized Products",
    category_slug: "customized-products",
    subcategory: "Photo Magnets",
    subcategory_slug: "photo-magnets",
    short_description: "Set of 6 magnetic wood tiles with nostalgic retro borders and ultra-strong neodymium backing.",
    full_description: "Turn your refrigerator or magnetic memo board into a curated gallery of smiling memories. Crafted from 4mm sustainably sourced birch wood with rounded corners and vivid archival direct-UV printing. Each tile includes an inset neodymium magnet with solid grip.",
    material: "Wood",
    default_size: "3 × 3 inch (Set of 6)",
    width: "3",
    height: "3",
    thickness: "4 mm",
    weight: "0.25 kg",
    base_price: 380,
    selling_price: 450,
    mrp: 799,
    discount: 43,
    tax: 18,
    stock: 200,
    production_time: "1-2 business days",
    tags: ["Photo Magnets", "Gifts", "Fridge Magnets", "Personalized Gifts", "Wood"],
    keywords: ["photo magnets", "wooden fridge magnets", "polaroid magnets", "creaftique gifts"],
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=900&auto=format&fit=crop&q=80"
    ],
    customization_available: true,
    requires_photo: true,
    required_photos_count: 6,
    custom_text_allowed: true,
    active: true,
    featured: true,
    new_product: false,
    best_seller: true,
    costs: {
      material_cost: 110,
      print_cost: 65,
      labor_cost: 50,
      packaging_cost: 30,
      shipping_cost: 45
    },
    custom_options: {
      sizes: [
        { name: "Set of 6 (3 × 3 inch)", price_adj: 0, default: true },
        { name: "Set of 12 (3 × 3 inch)", price_adj: 380 },
        { name: "Set of 18 (3 × 3 inch)", price_adj: 720 }
      ],
      materials: [
        { name: "Natural Birch Wood (4mm)", price_adj: 0, default: true },
        { name: "Ultra-White Acrylic Magnet", price_adj: 80 }
      ],
      finishes: [
        { name: "Matte Natural Grain", price_adj: 0, default: true },
        { name: "High Gloss Poly-Seal", price_adj: 50 }
      ],
      frames: [],
      quantity_tiers: [
        { min: 1, max: 4, discount_percent: 0 },
        { min: 5, max: 15, discount_percent: 15 },
        { min: 16, max: 999, discount_percent: 28 }
      ],
      extras: [
        { id: "tin_box", name: "Embossed Tin Keepsake Gift Box", price_adj: 120 }
      ]
    },
    seo: {
      title: "Personalized Wooden Photo Fridge Magnets | Creaftique",
      meta_description: "Customize set of magnetic wooden photo tiles with your phone memories. Perfect anniversary and birthday keepsake.",
      keywords: "photo magnets, fridge magnets customized, personalized gift",
      slug: "vintage-polaroid-wooden-photo-magnets"
    }
  }
];

const INITIAL_ORDERS = [];

class Database {
  constructor() {
    this.data = {
      settings: INITIAL_SETTINGS,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      payments: [],
      production_jobs: [],
      qc_records: [],
      shipments: [],
      design_proofs: [],
      customers: [],
      audit_logs: [
        {
          id: "log-1",
          user: "System",
          action: "Initialize Database",
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
        return;
      }

      if (fs.existsSync(BUNDLED_DB_FILE)) {
        const raw = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
        this.save();
        return;
      }

      this.save();
    } catch (err) {
      console.error('Error loading DB file, fallback to defaults:', err);
    }
  }

  save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Warning writing database file (handled for read-only environments):', err.message);
    }
  }

  // Master ordered category list specified by user
  static ORDERED_CATEGORIES = [
    "Canvas Hanging",
    "Canvas Frame",
    "Personalized Photo Frame",
    "Personalized Artwork Frame",
    "Miniature Frame",
    "Paper Frame",
    "Photo Albums",
    "Magazine Albums",
    "Photo Magnets",
    "Insta Photo Cards",
    "Birthday Party Supplies",
    "Personalized Labels",
    "Personalized Stickers",
    "Personalized Invitation Cards",
    "Personalized Business Cards"
  ];

  // --- Products ---
  getProducts(filters = {}) {
    let list = [...this.data.products];
    if (filters.category) {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase() || p.category_slug === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q))) ||
        (p.material && p.material.toLowerCase().includes(q))
      );
    }
    if (filters.featured) {
      list = list.filter(p => p.featured);
    }

    // Sort products by the master 15-category sequence (01 to 15)
    list.sort((a, b) => {
      const idxA = Database.ORDERED_CATEGORIES.findIndex(c => c.toLowerCase() === (a.category || '').toLowerCase());
      const idxB = Database.ORDERED_CATEGORIES.findIndex(c => c.toLowerCase() === (b.category || '').toLowerCase());
      const posA = idxA === -1 ? 999 : idxA;
      const posB = idxB === -1 ? 999 : idxB;
      if (posA !== posB) return posA - posB;
      return (a.name || '').localeCompare(b.name || '');
    });

    return list;
  }

  getProductById(idOrSku) {
    return this.data.products.find(p => p.id === idOrSku || p.sku === idOrSku);
  }

  saveProduct(product) {
    const idx = this.data.products.findIndex(p => p.id === product.id || p.sku === product.sku);
    if (idx >= 0) {
      this.data.products[idx] = { ...this.data.products[idx], ...product, updated_at: new Date().toISOString() };
    } else {
      if (!product.id) product.id = `prod-${Date.now()}`;
      product.created_at = new Date().toISOString();
      this.data.products.unshift(product);
    }
    this.save();
    return product;
  }

  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id && p.sku !== id);
    this.save();
    return true;
  }

  // --- Categories ---
  getCategories() {
    const ORDERED = Database.ORDERED_CATEGORIES;
    const prodCategories = [...new Set((this.data.products || []).map(p => p.category).filter(Boolean))];
    
    // Combine ordered list with any extra discovered categories
    const allCatNames = [...ORDERED];
    prodCategories.forEach(c => {
      if (!allCatNames.some(o => o.toLowerCase() === c.toLowerCase())) {
        allCatNames.push(c);
      }
    });

    const categories = allCatNames.map((catName, index) => {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let icon = 'Sparkles';
      const lower = catName.toLowerCase();
      if (lower.includes('hanging') || lower.includes('scroll')) icon = 'Layers';
      else if (lower.includes('canvas') || lower.includes('frame') || lower.includes('art')) icon = 'Frame';
      else if (lower.includes('album') || lower.includes('magazine')) icon = 'BookOpen';
      else if (lower.includes('sticker') || lower.includes('label')) icon = 'Tag';
      else if (lower.includes('party') || lower.includes('birthday')) icon = 'PartyPopper';
      else if (lower.includes('card') || lower.includes('invitation') || lower.includes('business')) icon = 'Printer';
      else if (lower.includes('magnet') || lower.includes('shadow') || lower.includes('miniature')) icon = 'Box';

      const orderNum = index + 1;
      const orderPrefix = String(orderNum).padStart(2, '0');

      return {
        id: `cat-${slug}`,
        name: catName,
        slug: slug,
        order: orderNum,
        order_prefix: orderPrefix,
        display_name: `${orderPrefix}. ${catName}`,
        description: `Bespoke handcrafted ${catName.toLowerCase()} customized to perfection.`,
        icon: icon,
        subcategories: []
      };
    });

    return categories;
  }

  saveCategory(category) {
    const idx = this.data.categories.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      this.data.categories[idx] = { ...this.data.categories[idx], ...category };
    } else {
      this.data.categories.push(category);
    }
    this.save();
    return category;
  }

  // --- Orders ---
  getOrders(filters = {}) {
    let list = [...this.data.orders];
    if (filters.order_status) {
      list = list.filter(o => o.order_status === filters.order_status);
    }
    if (filters.payment_status) {
      list = list.filter(o => o.payment_status === filters.payment_status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(o =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q) ||
        (o.items && o.items.some(i => i.sku.toLowerCase().includes(q)))
      );
    }
    // Return latest first
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }

  getOrderById(idOrNum) {
    if (!idOrNum) return null;
    const clean = String(idOrNum).trim();
    // 1. Check exact order_number or id
    const exact = this.data.orders.find(o => 
      o.id === clean || 
      (o.order_number && o.order_number.toLowerCase() === clean.toLowerCase())
    );
    if (exact) return exact;

    // 2. Check customer phone match (last 10 digits)
    const digitsOnly = clean.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= 10) {
      const targetPhone = digitsOnly.slice(-10);
      const byPhone = this.data.orders.filter(o => 
        o.customer_phone && o.customer_phone.replace(/[^0-9]/g, '').endsWith(targetPhone)
      ).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      if (byPhone.length > 0) return byPhone[0];
    }
    return null;
  }

  getOrdersByCustomerPhone(phone) {
    if (!phone) return [];
    const cleanDigits = String(phone).replace(/[^0-9]/g, '').slice(-10);
    if (!cleanDigits) return [];
    return this.data.orders.filter(o => 
      o.customer_phone && o.customer_phone.replace(/[^0-9]/g, '').endsWith(cleanDigits)
    ).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }


  createOrder(order) {
    if (!order.id) order.id = `ord-${Date.now()}`;
    if (!order.order_number) {
      const d = new Date();
      const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
      const count = (this.data.orders.length + 1).toString().padStart(4, '0');
      order.order_number = `${this.data.settings.order_prefix || 'CRQ'}-${dateStr}-${count}`;
    }
    order.created_at = new Date().toISOString();
    order.updated_at = new Date().toISOString();
    order.order_status = order.order_status || 'NEW';
    order.payment_status = order.payment_status || 'Pending';

    // Build timeline
    order.timeline = [
      { status: "NEW", label: "Order Placed", date: order.created_at, completed: true, current: true },
      { status: "PAYMENT PENDING", label: "Payment Verification", completed: false },
      { status: "DESIGN APPROVAL", label: "Artwork Approval", completed: false },
      { status: "PRODUCTION", label: "In Production", completed: false },
      { status: "QUALITY CHECK", label: "Quality Inspection", completed: false },
      { status: "PACKING", label: "Packing & Boxing", completed: false },
      { status: "READY TO DISPATCH", label: "Shipping Manifest Ready", completed: false },
      { status: "DISPATCHED", label: "Dispatched with Tracking", completed: false },
      { status: "DELIVERED", label: "Delivered", completed: false }
    ];

    this.data.orders.unshift(order);

    // Also update/create customer record
    this.upsertCustomer({
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      amount: order.grand_total,
      address: order.shipping_address
    });

    this.save();
    return order;
  }

  updateOrder(orderNumber, updates) {
    const idx = this.data.orders.findIndex(o => o.order_number === orderNumber || o.id === orderNumber);
    if (idx >= 0) {
      this.data.orders[idx] = {
        ...this.data.orders[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.save();
      return this.data.orders[idx];
    }
    return null;
  }

  deleteOrder(orderNumber) {
    if (!this.data.orders) return false;
    const clean = String(orderNumber).trim();
    const idx = this.data.orders.findIndex(o => o.order_number === clean || o.id === clean);
    if (idx === -1) return false;
    const deleted = this.data.orders.splice(idx, 1)[0];

    // Remove associated payments, production jobs, and design proofs
    if (this.data.payments) {
      this.data.payments = this.data.payments.filter(
        p => p.order_number !== clean && p.order_id !== deleted.id
      );
    }
    if (this.data.production_jobs) {
      this.data.production_jobs = this.data.production_jobs.filter(
        j => j.order_number !== clean && j.order_id !== deleted.id
      );
    }
    if (this.data.design_proofs) {
      this.data.design_proofs = this.data.design_proofs.filter(
        d => d.order_number !== clean && d.order_id !== deleted.id
      );
    }

    this.save();
    return true;
  }

  deleteCustomer(idOrPhone) {
    if (!this.data.customers) return false;
    const cleanDigits = String(idOrPhone).replace(/[^0-9]/g, '').slice(-10);
    const idx = this.data.customers.findIndex(c => 
      c.id === idOrPhone || 
      (cleanDigits && c.phone && c.phone.replace(/[^0-9]/g, '').endsWith(cleanDigits))
    );
    if (idx === -1) return false;
    this.data.customers.splice(idx, 1);
    this.save();
    return true;
  }

  upsertCustomer({ name, email, phone, amount, address }) {
    if (!this.data.customers) this.data.customers = [];
    const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, '').slice(-10) : '';
    let cust = this.data.customers.find(c => 
      (cleanPhone && c.phone && c.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone)) ||
      (email && c.email && c.email.toLowerCase() === email.toLowerCase())
    );

    if (cust) {
      cust.orders_count = (cust.orders_count || 1) + 1;
      cust.total_spent = (cust.total_spent || 0) + (amount || 0);
      if (name && (!cust.name || cust.name === 'Guest Customer')) cust.name = name;
      if (email && !cust.email) cust.email = email;
      if (address && !cust.saved_address) cust.saved_address = address;
      cust.last_order_at = new Date().toISOString();
    } else {
      cust = {
        id: `cust-${Date.now()}`,
        name: name || (cleanPhone ? `Customer ${cleanPhone.slice(-4)}` : "Guest Customer"),
        email: email || "",
        phone: cleanPhone || phone || "",
        saved_address: address || null,
        orders_count: 1,
        total_spent: amount || 0,
        created_at: new Date().toISOString(),
        last_order_at: new Date().toISOString()
      };
      this.data.customers.push(cust);
    }
    this.save();
    return cust;
  }


  // --- Payments ---
  getPayments() {
    return this.data.payments.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }

  claimPayment({ order_number, utr, screenshot_url, amount }) {
    const payment = {
      id: `pay-${Date.now()}`,
      order_number,
      amount: Number(amount),
      utr: utr || "",
      screenshot_url: screenshot_url || "",
      status: "Customer Claimed Paid",
      created_at: new Date().toISOString()
    };
    this.data.payments.unshift(payment);

    // Update the corresponding order
    this.updateOrder(order_number, {
      payment_status: "Customer Claimed Paid",
      utr: utr,
      payment_screenshot: screenshot_url
    });

    this.save();
    return payment;
  }

  verifyPayment({ payment_id, order_number, verified_by, action, rejection_reason }) {
    const status = action === 'verify' ? 'Verified' : 'Verification Required';
    const pIdx = this.data.payments.findIndex(p => p.id === payment_id || p.order_number === order_number);
    if (pIdx >= 0) {
      this.data.payments[pIdx].status = status;
      this.data.payments[pIdx].verified_by = verified_by;
      this.data.payments[pIdx].verified_at = new Date().toISOString();
      if (rejection_reason) this.data.payments[pIdx].rejection_reason = rejection_reason;
    }

    const orderStatus = action === 'verify' ? 'PAYMENT VERIFIED' : 'PAYMENT PENDING';
    this.updateOrder(order_number, {
      payment_status: status,
      order_status: orderStatus
    });

    this.logAudit({
      user: verified_by,
      action: action === 'verify' ? 'Verified Payment' : 'Rejected Payment',
      entity_type: 'Order',
      entity_id: order_number,
      new_value: status
    });

    this.save();
    return { success: true, status };
  }

  // --- Production & QC & Dispatch ---
  getProductionJobs() {
    return this.data.production_jobs;
  }

  updateProductionJob(id, updates) {
    const idx = this.data.production_jobs.findIndex(j => j.id === id || j.order_number === id);
    if (idx >= 0) {
      this.data.production_jobs[idx] = { ...this.data.production_jobs[idx], ...updates };
      this.save();
      return this.data.production_jobs[idx];
    }
    return null;
  }

  saveQcRecord(record) {
    record.id = record.id || `qc-${Date.now()}`;
    record.passed_at = new Date().toISOString();
    this.data.qc_records.unshift(record);
    this.save();
    return record;
  }

  saveShipment(shipment) {
    shipment.id = shipment.id || `shp-${Date.now()}`;
    shipment.dispatch_date = shipment.dispatch_date || new Date().toISOString();
    this.data.shipments.unshift(shipment);
    this.save();
    return shipment;
  }

  // --- Design Proofs ---
  getDesignProofs(order_number) {
    if (order_number) {
      return this.data.design_proofs.filter(d => d.order_number === order_number);
    }
    return this.data.design_proofs;
  }

  saveDesignProof(proof) {
    const idx = this.data.design_proofs.findIndex(p => p.order_number === proof.order_number);
    if (idx >= 0) {
      this.data.design_proofs[idx] = { ...this.data.design_proofs[idx], ...proof, updated_at: new Date().toISOString() };
    } else {
      proof.id = `proof-${Date.now()}`;
      proof.created_at = new Date().toISOString();
      this.data.design_proofs.unshift(proof);
    }
    this.save();
    return proof;
  }

  // --- Settings ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // --- Audit Logs ---
  logAudit({ user, action, entity_type, entity_id, prev_value, new_value }) {
    const log = {
      id: `log-${Date.now()}`,
      user: user || "Admin",
      action,
      entity_type,
      entity_id,
      prev_value,
      new_value,
      timestamp: new Date().toISOString()
    };
    this.data.audit_logs.unshift(log);
    // Keep max 500 logs
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 500);
    }
    this.save();
  }

  getAuditLogs() {
    return this.data.audit_logs;
  }
}

module.exports = new Database();
