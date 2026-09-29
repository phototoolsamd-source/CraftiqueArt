import React, { useState, useEffect } from 'react';
import { Product, Category, Order } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { Hero } from './components/storefront/Hero';
import { CategoryGrid } from './components/storefront/CategoryGrid';
import { CategorySidebar } from './components/storefront/CategorySidebar';
import { ProductCard } from './components/storefront/ProductCard';
import { ProductCustomizer } from './components/storefront/ProductCustomizer';
import { HowItWorks } from './components/storefront/HowItWorks';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { UpiPaymentModal } from './components/storefront/UpiPaymentModal';
import { OrderSuccessModal } from './components/storefront/OrderSuccessModal';
import { OrderTrackingView } from './components/storefront/OrderTrackingView';

// Admin components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrdersManager } from './components/admin/OrdersManager';
import { PaymentVerification } from './components/admin/PaymentVerification';
import { ProductionPanel } from './components/admin/ProductionPanel';
import { QualityControlPanel } from './components/admin/QualityControlPanel';
import { DispatchPanel } from './components/admin/DispatchPanel';
import { DesignApprovalPanel } from './components/admin/DesignApprovalPanel';
import { ProductAdmin } from './components/admin/ProductAdmin';
import { CategoryAdmin } from './components/admin/CategoryAdmin';
import { CatalogSyncPanel } from './components/admin/CatalogSyncPanel';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { AdminSettings } from './components/admin/AdminSettings';

import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { Sparkles, ArrowLeft, Filter, Heart, MessageCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'product-detail' | 'track' | 'admin'>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Products and Categories data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { setIsCartOpen } = useCart();
  const { role } = useAuth();

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()).catch(() => null),
        fetch('/api/categories').then(r => r.json()).catch(() => null)
      ]);
      if (pRes?.data && pRes.data.length > 0) {
        setProducts(pRes.data);
      } else {
        const staticData = await fetch('/data/catalog.json').then(r => r.json()).catch(() => null);
        if (staticData?.products) setProducts(staticData.products);
      }

      if (cRes?.data && cRes.data.length > 0) {
        setCategories(cRes.data);
      } else {
        const staticData = await fetch('/data/catalog.json').then(r => r.json()).catch(() => null);
        if (staticData?.categories) setCategories(staticData.categories);
      }
    } catch (e) {
      console.error('Error loading initial data, fetching static backup:', e);
      try {
        const staticData = await fetch('/data/catalog.json').then(r => r.json());
        if (staticData?.products) setProducts(staticData.products);
        if (staticData?.categories) setCategories(staticData.categories);
      } catch (err) {
        console.error('Static backup failed:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'category') {
      setSelectedCategorySlug(param || 'all');
      setCurrentView('home');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else if (view === 'track') {
      if (param) setTrackingOrderNumber(param);
      setCurrentView('track');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      if (param) setAdminTab(param);
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'home') {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCreated = (order: Order) => {
    setIsCheckoutOpen(false);
    setActiveCreatedOrder(order);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmitted = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  // Filter & sort products for storefront
  const filteredProducts = products
    .filter(p => {
      if (selectedCategorySlug !== 'all') {
        const pCatSlug = p.category_slug || p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const matchCat = pCatSlug === selectedCategorySlug ||
                         p.category.toLowerCase() === selectedCategorySlug.toLowerCase() ||
                         p.category.toLowerCase().includes(selectedCategorySlug.toLowerCase().replace(/-/g, ' '));
        if (!matchCat) return false;
      }
      if (priceFilter < 3000) {
        if (p.selling_price > priceFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchTags = p.tags?.some(t => t.toLowerCase().includes(q));
        return matchName || matchSku || matchCat || matchTags;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.selling_price - b.selling_price;
      if (sortBy === 'price-desc') return b.selling_price - a.selling_price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // 'featured'
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

  const handleResetFilters = () => {
    setSelectedCategorySlug('all');
    setPriceFilter(3000);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col text-slate-800">
      {/* If in Admin view, render AdminLayout */}
      {currentView === 'admin' ? (
        <AdminLayout
          currentTab={adminTab}
          onTabChange={setAdminTab}
          onExitAdmin={() => setCurrentView('home')}
        >
          {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={(t, p) => { setAdminTab(t); }} />}
          {adminTab === 'orders' && <OrdersManager />}
          {adminTab === 'payments' && <PaymentVerification />}
          {adminTab === 'production' && <ProductionPanel />}
          {adminTab === 'qc' && <QualityControlPanel />}
          {adminTab === 'dispatch' && <DispatchPanel />}
          {adminTab === 'design' && <DesignApprovalPanel />}
          {adminTab === 'products' && <ProductAdmin />}
          {adminTab === 'categories' && <CategoryAdmin />}
          {adminTab === 'sync' && <CatalogSyncPanel />}
          {adminTab === 'reports' && <ReportsAnalytics />}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      ) : (
        /* Storefront View */
        <>
          <Navbar
            currentView={currentView}
            onNavigate={handleNavigate}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-1">
            {currentView === 'home' && (
              <>
                <Hero
                  onExplore={() => {
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onCustomise={(sku) => {
                    const match = products.find(p => p.sku === sku) || products[0];
                    if (match) handleSelectProduct(match);
                  }}
                  featuredProduct={products.find(p => p.name.includes('Wrap Canvas') || p.featured) || products[0]}
                />

                <CategoryGrid
                  categories={categories}
                  selectedCategory={selectedCategorySlug}
                  onSelectCategory={(slug) => {
                    setSelectedCategorySlug(slug);
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* Catalog Products Section with Left Sidebar & Widescreen Grid */}
                <section id="catalog-section" className="py-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                  <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Left Sticky Category & Filter Sidebar */}
                    <CategorySidebar
                      categories={categories}
                      products={products}
                      selectedCategory={selectedCategorySlug}
                      onSelectCategory={(slug) => {
                        setSelectedCategorySlug(slug);
                        const el = document.getElementById('catalog-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      priceFilter={priceFilter}
                      onPriceFilterChange={setPriceFilter}
                      sortBy={sortBy}
                      onSortByChange={setSortBy}
                      onReset={handleResetFilters}
                    />

                    {/* Right Product Grid Area */}
                    <div className="flex-1 w-full min-w-0">
                      {/* Section Header Info Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div>
                          <div className="text-xs uppercase font-bold tracking-widest text-[#B45309]">
                            {selectedCategorySlug === 'all' ? 'All Handcrafted Collections' : selectedCategorySlug.replace(/-/g, ' ')}
                          </div>
                          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                            Bespoke Products & Custom Printing
                          </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
                            Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> of {products.length} products
                          </span>
                        </div>
                      </div>

                      {filteredProducts.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
                          <p className="text-sm font-semibold text-slate-600">No products match your search or filter.</p>
                          <button
                            onClick={handleResetFilters}
                            className="text-xs font-bold text-amber-800 underline hover:text-amber-900 cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
                          {filteredProducts.map((p) => (
                            <ProductCard
                              key={p.id}
                              product={p}
                              onSelect={handleSelectProduct}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <HowItWorks />
              </>
            )}

            {/* Product Customizer Detail View */}
            {currentView === 'product-detail' && selectedProduct && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <button
                  onClick={() => setCurrentView('home')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3.5 py-1.5 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Collections</span>
                </button>

                <ProductCustomizer
                  product={selectedProduct}
                  onAddedToCart={() => {
                    // Drawer automatically opens via CartContext
                  }}
                />
              </div>
            )}

            {/* Order Tracking View */}
            {currentView === 'track' && (
              <OrderTrackingView
                initialOrderNumber={trackingOrderNumber}
                onNavigateHome={() => setCurrentView('home')}
              />
            )}
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderCreated={handleOrderCreated}
        />
      )}

      {/* Dynamic UPI Payment Modal */}
      {showPaymentModal && activeCreatedOrder && (
        <UpiPaymentModal
          orderNumber={activeCreatedOrder.order_number}
          amount={activeCreatedOrder.grand_total}
          customerName={activeCreatedOrder.customer_name}
          customerPhone={activeCreatedOrder.customer_phone}
          onPaymentSubmitted={handlePaymentSubmitted}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* Order Success & Celebration Modal */}
      {showSuccessModal && activeCreatedOrder && (
        <OrderSuccessModal
          order={activeCreatedOrder}
          onTrackOrder={(num) => {
            setShowSuccessModal(false);
            setTrackingOrderNumber(num);
            setCurrentView('track');
          }}
          onClose={() => {
            setShowSuccessModal(false);
            setCurrentView('home');
          }}
        />
      )}
    </div>
  );
};
