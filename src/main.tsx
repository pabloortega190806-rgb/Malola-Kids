import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { DiscountProvider } from './context/DiscountContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <DiscountProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </DiscountProvider>
      </AdminProvider>
    </BrowserRouter>
  </StrictMode>,
);
