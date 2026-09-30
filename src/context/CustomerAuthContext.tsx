import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CustomerUser, Address, Order } from '../types';

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isLoggedIn: boolean;
  orders: Order[];
  loadingOrders: boolean;
  loginCustomer: (customerData: CustomerUser, initialOrders?: Order[]) => void;
  logoutCustomer: () => void;
  updateProfile: (updates: Partial<CustomerUser>) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
  refreshOrders: () => Promise<void>;
  addOrderToHistory: (order: Order) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'craftique_customer_session';
const ORDERS_KEY = 'craftique_customer_orders';

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loadingOrders, setLoadingOrders] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!customer?.phone) return;
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/customer/orders?phone=${encodeURIComponent(customer.phone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setOrders(data.data);
          localStorage.setItem(ORDERS_KEY, JSON.stringify(data.data));
        }
      }
    } catch (err) {
      console.warn('Could not refresh customer orders from server:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, [customer?.phone]);

  useEffect(() => {
    if (customer?.phone) {
      refreshOrders();
    } else {
      setOrders([]);
      localStorage.removeItem(ORDERS_KEY);
    }
  }, [customer?.phone, refreshOrders]);

  const loginCustomer = (customerData: CustomerUser, initialOrders?: Order[]) => {
    setCustomer(customerData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customerData));
    if (initialOrders && initialOrders.length > 0) {
      setOrders(initialOrders);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
    } else {
      // Trigger order fetch
      setTimeout(() => refreshOrders(), 100);
    }
  };

  const logoutCustomer = () => {
    setCustomer(null);
    setOrders([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ORDERS_KEY);
  };

  const updateProfile = async (updates: Partial<CustomerUser>) => {
    if (!customer) return;
    const updated = { ...customer, ...updates };
    setCustomer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      // silently tolerate offline/demo mode
    }
  };

  const updateAddress = async (address: Address) => {
    if (!customer) return;
    const updated = { ...customer, saved_address: address };
    setCustomer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customer.phone,
          saved_address: address
        })
      });
    } catch (e) {
      // silently tolerate offline
    }
  };

  const addOrderToHistory = (order: Order) => {
    setOrders(prev => {
      const exists = prev.some(o => o.order_number === order.order_number);
      const next = exists ? prev.map(o => o.order_number === order.order_number ? order : o) : [order, ...prev];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoggedIn: !!customer,
        orders,
        loadingOrders,
        loginCustomer,
        logoutCustomer,
        updateProfile,
        updateAddress,
        refreshOrders,
        addOrderToHistory
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
};
