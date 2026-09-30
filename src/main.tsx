import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { SettingsProvider } from './context/SettingsContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <CustomerAuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);

