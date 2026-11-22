export interface ProductOptionSize {
  name: string;
  price_adj: number;
  is_custom?: boolean;
  area_sqin?: number;
  sheet_info?: string;
  qty_per_sheet?: number;
  default?: boolean;
}

export interface ProductOptionItem {
  name: string;
  price_adj: number;
  description?: string;
  default?: boolean;
}

export interface QuantityTier {
  min: number;
  max: number;
  discount_percent: number;
}

export interface ProductExtra {
  id: string;
  name: string;
  price_adj: number;
}

export interface ProductCustomOptions {
  sizes: ProductOptionSize[];
  shapes?: ProductOptionItem[];
  materials: ProductOptionItem[];
  finishes: ProductOptionItem[];
  frames: ProductOptionItem[];
  quantity_tiers: QuantityTier[];
  extras: ProductExtra[];
}

export interface ProductCosts {
  material_cost: number;
  print_cost: number;
  labor_cost: number;
  packaging_cost: number;
  shipping_cost: number;
}

export interface ProductSeo {
  title?: string;
  meta_description?: string;
  keywords?: string;
  slug?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  category_slug?: string;
  subcategory?: string;
  subcategory_slug?: string;
  short_description: string;
  full_description?: string;
  material: string;
  default_size: string;
  width?: string;
  height?: string;
  thickness?: string;
  weight?: string;
  base_price: number;
  selling_price: number;
  mrp: number;
  discount?: number;
  tax?: number;
  stock?: number;
  production_time?: string;
  tags?: string[];
  keywords?: string[];
  images: string[];
  customization_available: boolean;
  requires_photo?: boolean;
  required_photos_count?: number;
  custom_text_allowed?: boolean;
  active: boolean;
  featured?: boolean;
  new_product?: boolean;
  best_seller?: boolean;
  costs?: ProductCosts;
  custom_options?: ProductCustomOptions;
  seo?: ProductSeo;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order?: number;
  order_prefix?: string;
  display_name?: string;
  description?: string;
  icon?: string;
  subcategories?: { id: string; name: string; slug: string }[];
}

export interface UploadedPhotoInfo {
  url: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  aspect_ratio?: string;
  quality?: 'Good quality' | 'Low resolution' | 'Potential blur';
}

export interface CustomizationState {
  text?: string;
  notes?: string;
  photos: UploadedPhotoInfo[];
  shape?: string;
  custom_width?: number;
  custom_height?: number;
  custom_unit?: 'inch' | 'cm' | 'mm' | 'ft';
  album_sheets?: number;
  album_pages?: number;
  pack_count?: number;
  max_photos_allowed?: number;
  event_name?: string;
  event_date?: string;
  venue?: string;
  contact_info?: string;
  print_media?: string;
  print_side?: string;
  lamination?: boolean;
  lamination_type?: string;
  half_cut?: boolean;
  full_cut_creasing?: boolean;
}

export interface CartItem {
  cart_item_id: string;
  product_id: string;
  sku: string;
  product_name: string;
  image: string;
  size: string;
  shape?: string;
  material: string;
  finish: string;
  frame?: string;
  quantity: number;
  unit_price: number;
  total: number;
  customization: CustomizationState;
  selected_extras: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface TimelineItem {
  status: string;
  label: string;
  date?: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Address;
  billing_address?: { same_as_shipping: boolean; address?: Address };
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grand_total: number;
  payment_status: 'Pending' | 'Customer Claimed Paid' | 'Verification Required' | 'Verified' | 'Failed' | 'Refunded';
  order_status:
    | 'NEW'
    | 'PAYMENT PENDING'
    | 'PAYMENT VERIFIED'
    | 'DESIGN REQUIRED'
    | 'DESIGN APPROVAL'
    | 'PRODUCTION'
    | 'QUALITY CHECK'
    | 'PACKING'
    | 'READY TO DISPATCH'
    | 'DISPATCHED'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'Cancelled'
    | 'On Hold';
  payment_id?: string;
  utr?: string;
  payment_screenshot?: string;
  google_drive_folder?: string;
  google_drive_folder_id?: string;
  google_drive_url?: string;
  tracking_carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  created_at: string;
  updated_at?: string;
  timeline?: TimelineItem[];
}

export interface PaymentRecord {
  id: string;
  order_id?: string;
  order_number: string;
  amount: number;
  utr?: string;
  screenshot_url?: string;
  status: string;
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface ProductionJob {
  id: string;
  order_number: string;
  sku: string;
  product_name: string;
  size: string;
  material: string;
  finish: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  priority: 'Normal' | 'High' | 'Rush';
  started_at?: string;
}

export interface DesignProof {
  id: string;
  order_number: string;
  proof_url: string;
  customer_status: 'Pending' | 'Approved' | 'Revision Requested';
  customer_notes?: string;
  designer_notes?: string;
  revision_count: number;
  approved_at?: string;
  created_at: string;
}

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Production'
  | 'Designer'
  | 'QC'
  | 'Dispatch'
  | 'Customer';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  saved_address?: Address | null;
  created_at?: string;
  last_login?: string;
}

export interface CustomerAuthResponse {
  success: boolean;
  message?: string;
  demoOtp?: string;
  existing?: boolean;
  customerName?: string;
  customer?: CustomerUser;
  orders?: Order[];
  error?: string;
}

