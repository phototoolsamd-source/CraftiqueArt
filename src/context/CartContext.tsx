import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useSettings } from './SettingsContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cart_item_id'>) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  grandTotal: number;
  freeShippingThreshold: number;
  shippingFee: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('creaftique_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('creaftique_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'cart_item_id'>) => {
    const newItem: CartItem = {
      ...item,
      cart_item_id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };
    setCart(prev => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.cart_item_id === cartItemId) {
          const total = item.unit_price * quantity;
          return { ...item, quantity, total };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cart_item_id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const { settings } = useSettings();
  const gstRate = (Number(settings?.gst_rate) || 18) / 100;
  const shippingFee = Number(settings?.shipping_fee ?? 80);
  const freeShippingThreshold = Number(settings?.free_shipping_threshold ?? 1500);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discount = subtotal > 3000 ? Math.round(subtotal * 0.05) : 0;
  const tax = Math.round((subtotal - discount) * gstRate);
  const shipping = (subtotal - discount) >= freeShippingThreshold || subtotal === 0 ? 0 : shippingFee;
  const grandTotal = Math.max(0, subtotal - discount + tax + shipping);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        itemCount,
        subtotal,
        tax,
        shipping,
        discount,
        grandTotal,
        freeShippingThreshold,
        shippingFee
      }}
    >
      {children}
    </CartContext.Provider>
  );

};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
