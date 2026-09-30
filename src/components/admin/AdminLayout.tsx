import React, { useState } from 'react';
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
  Bell,
  Lock,
  KeyRound
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
  const { user, role, switchRole, logout, isAuthenticated, login } = useAuth();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim().toLowerCase();
    // Authorized passcodes: 3375, akshar3375, craftique, admin
    if (clean === '3375' || clean === 'akshar3375' || clean === 'craftique' || clean === 'admin' || clean === 'akshar') {
      login('admin@phototoolsai.com', pinInput, 'Super Admin');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  // SECURE GATE: If not authenticated, require Studio Passcode / PIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-scale-in">
          
          <div className="w-16 h-16 rounded-full p-1 bg-white border border-slate-700 ring-4 ring-amber-500/30 mx-auto shadow-xl flex items-center justify-center">
            <img src="/logo.png" alt="Craftique" className="w-full h-full object-contain rounded-full" />
          </div>

          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-600/40">
              Studio Workspace
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mt-3">
              Craftique Administration
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Authorized studio production staff & administration only.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block text-left mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Enter Studio Admin Passcode / PIN</span>
              </label>
              <input
                type="password"
                placeholder="Enter PIN (e.g. 3375)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                autoFocus
                className="w-full bg-[#0F172A] border border-slate-600 rounded-xl py-3 px-4 text-center text-lg tracking-widest text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono"
              />
              {pinError && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">
                  Invalid Studio Passcode. Please enter the authorized PIN.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#B45309] hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Studio Workspace</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-700/60">
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Return to Customer Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-1 bg-white border border-slate-700 ring-2 ring-amber-500/40 flex items-center justify-center shrink-0 shadow-md">
              <img src="/logo.png" alt="Craftique Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-white tracking-tight">
                Craftique
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Return to Storefront */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Customer Storefront</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              onExitAdmin();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl hover:bg-rose-950/40 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Logout</span>
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
              • Craftique Ahmedabad Studio Workspace
            </span>
          </div>

          {/* Role selector, user profile, and exit button */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 pl-2">Role:</span>
              <select
                value={role}
                onChange={(e) => switchRole(e.target.value as UserRole)}
                className="bg-white border-none text-xs font-bold text-amber-900 rounded-lg py-1 px-2.5 shadow-xs focus:ring-1 focus:ring-amber-600 cursor-pointer"
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
                <span className="font-bold text-slate-800 block leading-tight">{user?.name || 'Studio Owner'}</span>
                <span className="text-[10px] text-slate-400">{user?.email || 'admin@phototoolsai.com'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                logout();
                onExitAdmin();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Lock and Return to Store"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
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
