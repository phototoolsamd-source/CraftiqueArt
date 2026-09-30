import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <CustomerAuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CustomerAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
