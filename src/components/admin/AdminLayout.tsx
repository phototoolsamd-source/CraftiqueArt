import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  CreditCard,
  Wrench,
  CheckSquare,
  Truck,
  Palette,
  RefreshCw,
  BarChart3,
  Settings,
  ArrowLeft,
  Users,
  ShieldCheck,
  LogOut,
  Bell
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onExitAdmin,
  children
}) => {
  const { user, role, switchRole, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'production', label: 'Production', icon: <Wrench className="w-4 h-4" /> },
    { id: 'qc', label: 'Quality Control', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'dispatch', label: 'Dispatch', icon: <Truck className="w-4 h-4" /> },
    { id: 'design', label: 'Design Proofs', icon: <Palette className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'sync', label: 'Catalog Sync', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Profit', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const rolesList: UserRole[] = [
    'Super Admin',
    'Admin',
    'Production',
    'Designer',
    'QC',
    'Dispatch'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Brand bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
              C
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white tracking-tight">
                Creaftique
              </span>
              <span className="block text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Studio Admin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Return to Storefront */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Customer Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="font-serif font-bold text-xl text-slate-900 capitalize">
              {currentTab === 'sync' ? 'Catalog Synchronization' : currentTab.replace('-', ' ')}
            </h1>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              • Creaftique Ahmedabad Studio Workspace
            </span>
          </div>

          {/* Role selector & user profile */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher for seamless testing of all 6 roles */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 pl-2">Role:</span>
              <select
                value={role}
                onChange={(e) => switchRole(e.target.value as UserRole)}
                className="bg-white border-none text-xs font-bold text-amber-900 rounded-lg py-1 px-2.5 shadow-xs focus:ring-1 focus:ring-amber-600"
              >
                {rolesList.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold text-slate-800 block leading-tight">{user?.name || 'Admin'}</span>
                <span className="text-[10px] text-slate-400">{user?.email || 'admin@phototoolsai.com'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
